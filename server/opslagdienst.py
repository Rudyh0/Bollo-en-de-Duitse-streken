#!/usr/bin/env python3
"""Opslagdienst voor '... en de Duitse streken'.

Een kleine webdienst (alleen Python 3 + SQLite, geen extra pakketten) die per speler
de namen en de opgeslagen voortgang bewaart, zodat je in elke browser verder kunt spelen.
Spelers loggen in met een spelersnaam en een pincode van 6 cijfers.

nginx stuurt alles onder /api/ door naar deze dienst (alleen bereikbaar via 127.0.0.1).

Gebruik:
  python3 opslagdienst.py serveer --db /var/lib/duitse-streken/spel.db --poort 8765
  python3 opslagdienst.py serveer --db test.db --poort 8000 --statisch .   (lokaal testen: game + opslag)
  python3 opslagdienst.py backup  --db /var/lib/duitse-streken/spel.db --map /var/backups/duitse-streken

Endpoints (JSON):
  POST /api/registreer   {naam, pin}        -> {token, naam}
  POST /api/login        {naam, pin}        -> {token, naam}
  POST /api/uitloggen
  GET  /api/ik                               -> {naam, profiel, heeftSave}
  PUT  /api/profiel      {...}               (namen van park en beer, enz.)
  GET  /api/save                             -> {save} (of 404)
  PUT  /api/save         {...}
  DELETE /api/save
  GET  /api/status                           -> {ok: true}
"""
import argparse
import datetime
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

MAX_LICHAAM = 64 * 1024
TOKEN_DAGEN = 180
PBKDF2_RONDES = 200_000
NAAM_PATROON = re.compile(r"^[A-Za-z0-9À-ÿ][A-Za-z0-9À-ÿ .'\-]{1,14}[A-Za-z0-9À-ÿ.]$")
PIN_PATROON = re.compile(r"^[0-9]{6}$")

# Bescherming tegen raden: per IP en per spelersnaam.
POGINGEN_MAX = 8
POGINGEN_VENSTER = 15 * 60
REGISTRATIES_PER_UUR = 10

SCHEMA = """
CREATE TABLE IF NOT EXISTS spelers (
  id INTEGER PRIMARY KEY,
  naam TEXT NOT NULL,
  sleutel TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  zout TEXT NOT NULL,
  profiel TEXT NOT NULL DEFAULT '{}',
  gemaakt TEXT NOT NULL,
  laatst TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessies (
  token_hash TEXT PRIMARY KEY,
  speler_id INTEGER NOT NULL REFERENCES spelers(id) ON DELETE CASCADE,
  verloopt INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS saves (
  speler_id INTEGER PRIMARY KEY REFERENCES spelers(id) ON DELETE CASCADE,
  data TEXT NOT NULL,
  bijgewerkt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessies_speler ON sessies(speler_id);
"""


def nu_tekst():
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")


def naam_sleutel(naam):
    return " ".join(naam.split()).casefold()


def hash_pin(pin, zout):
    return hashlib.pbkdf2_hmac("sha256", pin.encode(), bytes.fromhex(zout), PBKDF2_RONDES).hex()


def hash_token(token):
    return hashlib.sha256(token.encode()).hexdigest()


class Database:
    def __init__(self, pad):
        self.pad = pad
        map_ = os.path.dirname(os.path.abspath(pad))
        os.makedirs(map_, exist_ok=True)
        c = self.open()
        c.execute("PRAGMA journal_mode = WAL")
        c.executescript(SCHEMA)
        c.commit()
        c.close()

    def open(self):
        """Een nieuwe verbinding per verzoek; wordt na het verzoek altijd gesloten."""
        c = sqlite3.connect(self.pad, timeout=10)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA foreign_keys = ON")
        return c


class Teller:
    """Houdt mislukte pogingen bij (in het geheugen)."""

    def __init__(self):
        self.slot = threading.Lock()
        self.pogingen = {}

    def te_veel(self, sleutel, maximum, venster):
        nu = time.time()
        with self.slot:
            lijst = [t for t in self.pogingen.get(sleutel, []) if nu - t < venster]
            self.pogingen[sleutel] = lijst
            return len(lijst) >= maximum

    def tel(self, sleutel):
        with self.slot:
            self.pogingen.setdefault(sleutel, []).append(time.time())

    def wis(self, sleutel):
        with self.slot:
            self.pogingen.pop(sleutel, None)


class Fout(Exception):
    def __init__(self, status, melding, code=None):
        super().__init__(melding)
        self.status = status
        self.melding = melding
        self.code = code or "fout"


def maak_handler(db, teller, statisch=None):
    class Handler(SimpleHTTPRequestHandler):
        server_version = "DuitseStreken/1"
        sys_version = ""

        # ---------------------------------------------------------- hulp

        def log_message(self, formaat, *args):  # alleen fouten loggen
            pass

        def client_ip(self):
            return self.headers.get("X-Real-IP") or self.client_address[0]

        def stuur(self, status, data=None):
            lichaam = json.dumps(data if data is not None else {}, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Content-Length", str(len(lichaam)))
            self.end_headers()
            self.wfile.write(lichaam)

        def lees_json(self):
            lengte = int(self.headers.get("Content-Length") or 0)
            if lengte > MAX_LICHAAM:
                raise Fout(413, "Te veel gegevens.", "te_groot")
            ruw = self.rfile.read(lengte) if lengte else b"{}"
            try:
                data = json.loads(ruw.decode("utf-8") or "{}")
            except (UnicodeDecodeError, json.JSONDecodeError):
                raise Fout(400, "Ongeldige gegevens.", "ongeldig")
            if not isinstance(data, dict):
                raise Fout(400, "Ongeldige gegevens.", "ongeldig")
            return data

        def speler(self):
            kop = self.headers.get("Authorization", "")
            if not kop.startswith("Bearer "):
                raise Fout(401, "Niet ingelogd.", "niet_ingelogd")
            token = kop[7:].strip()
            c = self.c
            rij = c.execute(
                "SELECT s.* FROM sessies x JOIN spelers s ON s.id = x.speler_id "
                "WHERE x.token_hash = ? AND x.verloopt > ?",
                (hash_token(token), int(time.time())),
            ).fetchone()
            if not rij:
                raise Fout(401, "Je sessie is verlopen. Log opnieuw in.", "niet_ingelogd")
            return rij, token

        def nieuwe_sessie(self, speler_id):
            token = secrets.token_urlsafe(32)
            c = self.c
            c.execute(
                "INSERT INTO sessies (token_hash, speler_id, verloopt) VALUES (?, ?, ?)",
                (hash_token(token), speler_id, int(time.time()) + TOKEN_DAGEN * 86400),
            )
            c.execute("DELETE FROM sessies WHERE verloopt < ?", (int(time.time()),))
            c.commit()
            return token

        def controleer_invoer(self, data):
            naam = " ".join(str(data.get("naam", "")).split())
            pin = str(data.get("pin", ""))
            if not NAAM_PATROON.match(naam):
                raise Fout(400, "Een spelersnaam heeft 3 tot 16 letters of cijfers.", "naam_ongeldig")
            if not PIN_PATROON.match(pin):
                raise Fout(400, "De pincode bestaat uit 6 cijfers.", "pin_ongeldig")
            return naam, pin

        # ---------------------------------------------------------- routes

        def afhandelen(self, methode):
            pad = self.path.split("?", 1)[0].rstrip("/")
            self.c = db.open()
            try:
                if not pad.startswith("/api"):
                    raise Fout(404, "Niet gevonden.", "niet_gevonden")
                route = pad[4:] or "/"
                functie = {
                    ("GET", "/status"): self.r_status,
                    ("POST", "/registreer"): self.r_registreer,
                    ("POST", "/login"): self.r_login,
                    ("POST", "/uitloggen"): self.r_uitloggen,
                    ("GET", "/ik"): self.r_ik,
                    ("PUT", "/profiel"): self.r_profiel,
                    ("GET", "/save"): self.r_save_lees,
                    ("PUT", "/save"): self.r_save_schrijf,
                    ("DELETE", "/save"): self.r_save_wis,
                }.get((methode, route))
                if not functie:
                    raise Fout(404, "Niet gevonden.", "niet_gevonden")
                functie()
            except Fout as f:
                self.stuur(f.status, {"fout": f.melding, "code": f.code})
            except Exception as e:  # noqa: BLE001
                print(f"[opslagdienst] fout bij {methode} {self.path}: {e!r}", file=sys.stderr)
                self.stuur(500, {"fout": "Er ging iets mis op de server.", "code": "server"})
            finally:
                try:
                    if self.c.in_transaction:
                        self.c.rollback()
                finally:
                    self.c.close()

        def do_GET(self):
            if statisch and not self.path.startswith("/api/"):
                super().do_GET()  # lokaal testen: ook de spelbestanden serveren
                return
            self.afhandelen("GET")

        def do_HEAD(self):
            if statisch and not self.path.startswith("/api/"):
                super().do_HEAD()
                return
            self.stuur(405, {"fout": "Niet toegestaan."})

        def do_POST(self):
            self.afhandelen("POST")

        def do_PUT(self):
            self.afhandelen("PUT")

        def do_DELETE(self):
            self.afhandelen("DELETE")

        def r_status(self):
            self.stuur(200, {"ok": True})

        def r_registreer(self):
            ip = self.client_ip()
            if teller.te_veel("reg:" + ip, REGISTRATIES_PER_UUR, 3600):
                raise Fout(429, "Te veel nieuwe spelers vanaf dit adres. Probeer het later nog eens.", "te_veel")
            naam, pin = self.controleer_invoer(self.lees_json())
            c = self.c
            zout = secrets.token_hex(16)
            try:
                cur = c.execute(
                    "INSERT INTO spelers (naam, sleutel, pin_hash, zout, gemaakt, laatst) VALUES (?, ?, ?, ?, ?, ?)",
                    (naam, naam_sleutel(naam), hash_pin(pin, zout), zout, nu_tekst(), nu_tekst()),
                )
                c.commit()
            except sqlite3.IntegrityError:
                raise Fout(409, "Die spelersnaam bestaat al. Kies een andere, of log in.", "naam_bezet")
            teller.tel("reg:" + ip)
            self.stuur(200, {"token": self.nieuwe_sessie(cur.lastrowid), "naam": naam})

        def r_login(self):
            ip = self.client_ip()
            data = self.lees_json()
            naam = " ".join(str(data.get("naam", "")).split())
            pin = str(data.get("pin", ""))
            sleutel = naam_sleutel(naam)
            if teller.te_veel("ip:" + ip, POGINGEN_MAX * 3, POGINGEN_VENSTER) or teller.te_veel(
                "naam:" + sleutel, POGINGEN_MAX, POGINGEN_VENSTER
            ):
                raise Fout(429, "Te veel verkeerde pogingen. Wacht een kwartier en probeer het opnieuw.", "te_veel")
            c = self.c
            rij = c.execute("SELECT * FROM spelers WHERE sleutel = ?", (sleutel,)).fetchone()
            goed = False
            if rij and PIN_PATROON.match(pin):
                goed = hmac.compare_digest(hash_pin(pin, rij["zout"]), rij["pin_hash"])
            else:
                hash_pin("000000", "00" * 16)  # gelijke rekentijd, zodat je niet kunt zien of een naam bestaat
            if not goed:
                teller.tel("ip:" + ip)
                teller.tel("naam:" + sleutel)
                raise Fout(401, "Spelersnaam of pincode klopt niet.", "onjuist")
            teller.wis("naam:" + sleutel)
            c.execute("UPDATE spelers SET laatst = ? WHERE id = ?", (nu_tekst(), rij["id"]))
            c.commit()
            self.stuur(200, {"token": self.nieuwe_sessie(rij["id"]), "naam": rij["naam"]})

        def r_uitloggen(self):
            try:
                _, token = self.speler()
            except Fout:
                self.stuur(200, {"ok": True})
                return
            c = self.c
            c.execute("DELETE FROM sessies WHERE token_hash = ?", (hash_token(token),))
            c.commit()
            self.stuur(200, {"ok": True})

        def r_ik(self):
            speler, _ = self.speler()
            c = self.c
            heeft = c.execute("SELECT 1 FROM saves WHERE speler_id = ?", (speler["id"],)).fetchone() is not None
            self.stuur(200, {"naam": speler["naam"], "profiel": json.loads(speler["profiel"] or "{}"), "heeftSave": heeft})

        def r_profiel(self):
            speler, _ = self.speler()
            data = self.lees_json()
            c = self.c
            c.execute(
                "UPDATE spelers SET profiel = ?, laatst = ? WHERE id = ?",
                (json.dumps(data, ensure_ascii=False), nu_tekst(), speler["id"]),
            )
            c.commit()
            self.stuur(200, {"ok": True})

        def r_save_lees(self):
            speler, _ = self.speler()
            rij = self.c.execute("SELECT data, bijgewerkt FROM saves WHERE speler_id = ?", (speler["id"],)).fetchone()
            if not rij:
                raise Fout(404, "Nog geen opgeslagen spel.", "geen_save")
            self.stuur(200, {"save": json.loads(rij["data"]), "bijgewerkt": rij["bijgewerkt"]})

        def r_save_schrijf(self):
            speler, _ = self.speler()
            data = self.lees_json()
            c = self.c
            c.execute(
                "INSERT INTO saves (speler_id, data, bijgewerkt) VALUES (?, ?, ?) "
                "ON CONFLICT(speler_id) DO UPDATE SET data = excluded.data, bijgewerkt = excluded.bijgewerkt",
                (speler["id"], json.dumps(data, ensure_ascii=False), nu_tekst()),
            )
            c.execute("UPDATE spelers SET laatst = ? WHERE id = ?", (nu_tekst(), speler["id"]))
            c.commit()
            self.stuur(200, {"ok": True})

        def r_save_wis(self):
            speler, _ = self.speler()
            c = self.c
            c.execute("DELETE FROM saves WHERE speler_id = ?", (speler["id"],))
            c.commit()
            self.stuur(200, {"ok": True})

    return Handler


def serveer(args):
    db = Database(args.db)
    teller = Teller()
    handler = maak_handler(db, teller, args.statisch)
    if args.statisch:
        handler = partial(handler, directory=os.path.abspath(args.statisch))
    server = ThreadingHTTPServer((args.adres, args.poort), handler)
    server.daemon_threads = True
    print(f"[opslagdienst] luistert op http://{args.adres}:{args.poort} (database: {args.db})", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


def backup(args):
    os.makedirs(args.map, exist_ok=True)
    doel = os.path.join(args.map, f"spel-{datetime.date.today().isoformat()}.db")
    bron = sqlite3.connect(args.db)
    kopie = sqlite3.connect(doel)
    with kopie:
        bron.backup(kopie)
    kopie.close()
    bron.close()
    os.chmod(doel, 0o600)
    bestanden = sorted(f for f in os.listdir(args.map) if f.startswith("spel-") and f.endswith(".db"))
    for oud in bestanden[: -args.bewaar]:
        os.remove(os.path.join(args.map, oud))
    print(f"[opslagdienst] backup gemaakt: {doel}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="opdracht", required=True)
    s = sub.add_parser("serveer")
    s.add_argument("--db", required=True)
    s.add_argument("--adres", default="127.0.0.1")
    s.add_argument("--poort", type=int, default=8765)
    s.add_argument("--statisch", default=None, help="map met de spelbestanden (alleen voor lokaal testen)")
    b = sub.add_parser("backup")
    b.add_argument("--db", required=True)
    b.add_argument("--map", required=True)
    b.add_argument("--bewaar", type=int, default=14)
    args = p.parse_args()
    {"serveer": serveer, "backup": backup}[args.opdracht](args)


if __name__ == "__main__":
    main()
