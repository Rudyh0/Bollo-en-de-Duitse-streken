// Spelersaccount: inloggen met spelersnaam + pincode, zodat namen en voortgang op de server
// staan en je in elke browser verder kunt spelen.
// Is er geen server (bijvoorbeeld bij lokaal testen), dan werkt alles zoals vroeger: alleen in deze browser.
import { lees, schrijf, wis } from './opslag.js';

const API = 'api';
const TOKEN_SLEUTEL = 'duitse-streken:token';
const LAATSTE_NAAM = 'duitse-streken:laatste-spelersnaam';

export const account = {
  modus: null, // 'server' of 'lokaal'
  naam: null,
  profiel: {},
  save: null,
};

let token = lees(TOKEN_SLEUTEL, null);

async function verzoek(methode, pad, data = null, wachttijd = 8000) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const klok = ctrl ? setTimeout(() => ctrl.abort(), wachttijd) : null;
  try {
    const antwoord = await fetch(`${API}/${pad}`, {
      method: methode,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data ? JSON.stringify(data) : undefined,
      cache: 'no-store',
      signal: ctrl ? ctrl.signal : undefined,
    });
    let inhoud = {};
    try { inhoud = await antwoord.json(); } catch (e) { inhoud = {}; }
    return { ok: antwoord.ok, status: antwoord.status, data: inhoud };
  } catch (e) {
    return { ok: false, status: 0, data: { fout: 'Geen verbinding met de server.' } };
  } finally {
    if (klok) clearTimeout(klok);
  }
}

function zetToken(nieuw) {
  token = nieuw;
  if (nieuw) schrijf(TOKEN_SLEUTEL, nieuw);
  else wis(TOKEN_SLEUTEL);
}

/** Kijkt of er een opslagserver is. Zo niet, dan spelen we 'lokaal'. */
export async function bepaalModus() {
  const r = await verzoek('GET', 'status', null, 4000);
  account.modus = r.ok && r.data && r.data.ok ? 'server' : 'lokaal';
  return account.modus;
}

export function opServer() {
  return account.modus === 'server';
}

export function ingelogd() {
  return opServer() && Boolean(account.naam);
}

export function laatsteSpelersnaam() {
  return lees(LAATSTE_NAAM, '') || '';
}

async function naInloggen(naam) {
  account.naam = naam;
  schrijf(LAATSTE_NAAM, naam);
  const ik = await verzoek('GET', 'ik');
  account.profiel = (ik.ok && ik.data.profiel) || {};
  await haalSave();
}

/** Bestaande sessie herstellen (token uit deze browser). */
export async function herstelSessie() {
  if (!token) return false;
  const r = await verzoek('GET', 'ik');
  if (r.ok) {
    account.naam = r.data.naam;
    account.profiel = r.data.profiel || {};
    await haalSave();
    return true;
  }
  if (r.status === 401) zetToken(null);
  return false;
}

export async function login(naam, pin) {
  const r = await verzoek('POST', 'login', { naam, pin });
  if (!r.ok) return { ok: false, fout: r.data.fout || 'Inloggen lukte niet.' };
  zetToken(r.data.token);
  await naInloggen(r.data.naam);
  return { ok: true };
}

export async function registreer(naam, pin) {
  const r = await verzoek('POST', 'registreer', { naam, pin });
  if (!r.ok) return { ok: false, fout: r.data.fout || 'Aanmelden lukte niet.' };
  zetToken(r.data.token);
  await naInloggen(r.data.naam);
  return { ok: true };
}

export async function uitloggen() {
  await verzoek('POST', 'uitloggen');
  zetToken(null);
  account.naam = null;
  account.profiel = {};
  account.save = null;
}

export async function bewaarProfiel(profiel) {
  account.profiel = { ...account.profiel, ...profiel };
  if (!ingelogd()) return false;
  const r = await verzoek('PUT', 'profiel', account.profiel);
  return r.ok;
}

export async function haalSave() {
  const r = await verzoek('GET', 'save');
  account.save = r.ok ? r.data.save : null;
  return account.save;
}

export async function bewaarSave(data) {
  // Altijd ook een reservekopie in deze browser, voor het geval de verbinding wegvalt.
  schrijf(`duitse-streken:reserve-${(account.naam || 'lokaal').toLowerCase()}`, data);
  const r = await verzoek('PUT', 'save', data, 12000);
  if (r.ok) account.save = data;
  return { ok: r.ok, fout: r.data.fout, uitgelogd: r.status === 401 };
}
