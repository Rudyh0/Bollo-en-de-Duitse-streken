# … en de Duitse streken

Een korte RPG in de stijl van de klassieke handheld-monster-RPG's, helemaal in het Nederlands, die je in de browser speelt. Een beer zit vast in Kamp Westerbork en moet ontsnappen naar zijn vakantiepark bij Aalden, terwijl Drenthe weer eens bezet is door Duitsers in ouderwetse uniformen. Speelduur: ongeveer een uur (als alles af is).

Gebouwd met [Phaser 3](https://phaser.io). Geen build-stap: het zijn gewone statische bestanden.

## Spelers, opslaan en namen

Op de server logt elke speler in met een **spelersnaam en een pincode van 6 cijfers**. De voortgang en de gekozen namen staan dan op de server, dus je speelt op elk apparaat en in elke browser verder waar je gebleven was. Er wordt geen e-mailadres of andere persoonlijke informatie gevraagd.

- Een nieuwe speler kiest daarna hoe het vakantiepark en de beer heten. Het hele spel gebruikt die namen (titel, gesprekken, menu's). Wijzigen kan via **Instellingen → Namen wijzigen** op het titelscherm; uitloggen ook daar.
- Pincodes worden niet als tekst bewaard (PBKDF2 met zout). Na 8 verkeerde pogingen is een spelersnaam een kwartier geblokkeerd.
- Wie de game host, kan ook vaste namen voor iedereen instellen: via de installer, of in `js/spel-config.js`.
- Draait de game zonder opslagserver (bijv. als losse bestanden), dan werkt alles nog steeds, maar wordt alleen in die ene browser opgeslagen.

De opslagdienst staat in `server/opslagdienst.py`: Python 3 met SQLite, zonder extra pakketten. Op de server bewaart hij alles in `/var/lib/duitse-streken/spel.db`, met elke nacht een back-up in `/var/backups/duitse-streken` (14 dagen).

## Besturing

| Actie | Toetsenbord | Telefoon/tablet |
|---|---|---|
| Lopen | pijltjes of WASD | D-pad |
| A (praten, kiezen, tekst verder) | Z, Spatie of Enter | A |
| B (terug, rennen als je hem vasthoudt) | X of Backspace | B |
| Menu | Esc of M | START |

Op een telefoon of tablet verschijnen de knoppen vanzelf (staand onder het beeld, liggend aan de zijkanten). Dat kun je aanpassen bij **Instellingen**.

## Installeren op een Ubuntu-server

Op een Ubuntu-server (22.04 of nieuwer), als root:

```bash
curl -fsSL https://raw.githubusercontent.com/Rudyh0/Bollo-en-de-Duitse-streken/main/install.sh | sudo bash
```

De installer vraagt naar het domein (standaard `bollo.rudymedia.nl`), of dat via Cloudflare loopt, en of hij nieuwe versies automatisch moet ophalen. Daarna:

- installeert hij nginx, git, rsync, UFW en (zonder Cloudflare) certbot, allemaal uit Ubuntu zelf;
- zet hij de game in `/var/www/duitse-streken` (alleen wat de browser nodig heeft, geen tools);
- draait de game **alleen op dat ene domein**: andere domeinnamen en het kale IP-adres krijgen geen antwoord (tenzij een andere site op de server al de standaardsite is; die laat hij met rust);
- zet hij de opslagdienst voor spelers klaar (alleen intern bereikbaar; nginx stuurt `/api/` door) met een dagelijkse back-up;
- regelt hij HTTPS:
  - **zonder Cloudflare** via Let's Encrypt, dat vanzelf verlengt. Wijst het domein nog niet naar de server, dan draait de game eerst via http; draai de installer opnieuw zodra de DNS klopt.
  - **met Cloudflare** (proxy aan, oranje wolkje) met een eigen certificaat. Zet in Cloudflare bij SSL/TLS de modus op **Full** (niet "Full (strict)"). De echte IP van bezoekers wordt herkend.
- zet hij poort 80 en 443 open in de firewall en houdt hij SSH altijd bereikbaar (ook op een andere poort dan 22);
- haalt hij (als je dat wilt) elke 10 minuten de nieuwste versie van GitHub. Wat op `main` staat, staat dus binnen 10 minuten live. Is de opslagdienst veranderd, dan wordt die ook herstart.

Handige commando's:

```bash
sudo duitse-streken-update            # nu meteen bijwerken
sudo duitse-streken-update --forceer  # opnieuw neerzetten, ook zonder nieuwe versie
journalctl -u duitse-streken-update   # logboek van het bijwerken
journalctl -u duitse-streken-opslag   # logboek van de opslagdienst
```

Instellingen wijzigen: draai de installer opnieuw (je vorige antwoorden blijven staan) of pas `/etc/duitse-streken/config` aan en draai daarna de installer. Alle opties staan bovenin `install.sh` (bijv. `--domein`, `--cloudflare ja`, `--ja` voor geen vragen). Verwijderen: `sudo bash install.sh --verwijder`.

## Lokaal testen

Met inloggen en opslaan op de "server":

```bash
python3 server/opslagdienst.py serveer --db test.db --poort 8000 --statisch .
```

Of zonder opslagserver (opslaan alleen in de browser):

```bash
python3 -m http.server 8000
```

Open daarna <http://localhost:8000>. (Direct het bestand openen werkt niet: browsers laden JavaScript-modules alleen via een webserver.)

## Projectstructuur

```
index.html, css/          pagina en aanraakknoppen
lib/phaser.min.js         Phaser 3.90
js/main.js                start van het spel
js/spel-config.js         vaste namen (leeg = speler kiest)
js/core/                  invoer, geluid (chiptune-synth), muziek, opslaan, instellingen, namen, voorwerpen
js/ui/                    tekstvak, keuzelijsten, naamscherm, pauzemenu, rugzak, instellingen
js/scenes/                Boot, Start, Setup (namen), Titel, Intro (directeur), Wereld, UI
js/maps/                  kaarten (tegels, objecten, personen) en hun scripts
server/opslagdienst.py    opslag voor spelers en saves (Python + SQLite)
assets/                   pixel-art en lettertypes (gegenereerd), en audio/intake.mp3
tools/                    Python-scripts die alle pixel-art maken
install.sh                installer voor een Ubuntu-server
```

Alle pixel-art, het lettertype en de chiptune-muziek zijn eigen werk; `assets/audio/intake.mp3` (de muziek tijdens de intake) is aangeleverd. De plaatjes worden gemaakt met:

```bash
pip install pillow
python3 tools/genereer_assets.py
```

## Stand van zaken

Klaar:

- hoofdmenu (nieuw spel, spel laden, instellingen) en de namen-invoer bij de eerste keer openen
- intro met de directeur van het vakantiepark, inclusief intake
- barak 7 van Kamp Westerbork: rondlopen, praten met medegevangenen, een kistje onder een bed met voedselbonnen en een soeplepel
- pauzemenu met rugzak (voedselbonnen gebruiken), status, opslaan en instellingen (tekstsnelheid, muziek, geluidseffecten, aanraakknoppen, altijd rennen)

Nog te doen: ontsnappen uit de barak, de route langs Orvelte, Wezup en Aalden, gevechten tegen Duitsers per gebied, quests en het einde bij het vakantiepark.
