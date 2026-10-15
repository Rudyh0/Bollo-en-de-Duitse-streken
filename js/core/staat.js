// De toestand van het lopende spel. Dit is precies wat er wordt opgeslagen.
import { lees, schrijf } from './opslag.js';
import { OPSLAG_SLEUTELS, VERSIE } from './constanten.js';
import { account, opServer, bewaarSave } from './account.js';

function nieuweStaat() {
  return {
    versie: VERSIE,
    kaart: 'barak',
    x: 2,
    y: 4,
    richting: 'omlaag',
    gezondheid: 12,
    maxGezondheid: 20,
    // vechten
    niveau: 5,
    xp: 0,
    aanval: 5,
    verdediging: 5,
    snelheid: 6,
    aanvallen: ['soeplepel', 'volkszanger'],
    pp: { soeplepel: 25, volkszanger: 5 },
    ppMax: { soeplepel: 25, volkszanger: 5 },
    geld: 0,
    effecten: {},
    rugzak: {},
    vlaggen: {},
    intake: {},
    speeltijdMs: 0,
  };
}

export const staat = nieuweStaat();

export function nieuwSpel() {
  Object.keys(staat).forEach((k) => delete staat[k]);
  Object.assign(staat, nieuweStaat());
}

// ---------------------------------------------------------------- rugzak

export function aantal(id) {
  return staat.rugzak[id] || 0;
}

export function geefItem(id, n = 1) {
  staat.rugzak[id] = aantal(id) + n;
}

export function neemItem(id, n = 1) {
  const nieuw = Math.max(0, aantal(id) - n);
  if (nieuw === 0) delete staat.rugzak[id];
  else staat.rugzak[id] = nieuw;
}

export function herstel(punten) {
  const voor = staat.gezondheid;
  staat.gezondheid = Math.min(staat.maxGezondheid, staat.gezondheid + punten);
  return staat.gezondheid - voor;
}

// ---------------------------------------------------------------- opslaan / laden
// Ingelogd: de save staat op de server (en wordt bij het inloggen opgehaald).
// Zonder server: alleen in deze browser, zoals vroeger.

function opgeslagen() {
  if (opServer()) return account.save;
  return lees(OPSLAG_SLEUTELS.spel);
}

export function heeftOpslag() {
  return Boolean(opgeslagen());
}

export function opslagInfo() {
  return opgeslagen();
}

/** Slaat het spel op. Geeft { ok, fout } terug. */
export async function slaOp(kaartnaam) {
  const kopie = JSON.parse(JSON.stringify(staat));
  kopie.opgeslagenOp = new Date().toISOString();
  kopie.kaartnaam = kaartnaam;
  if (opServer()) return bewaarSave(kopie);
  return { ok: schrijf(OPSLAG_SLEUTELS.spel, kopie) };
}

export function laad() {
  const data = opgeslagen();
  if (!data) return false;
  Object.keys(staat).forEach((k) => delete staat[k]);
  Object.assign(staat, nieuweStaat(), JSON.parse(JSON.stringify(data)));
  return true;
}

// ---------------------------------------------------------------- niveau en ervaring

/** Ervaring die nodig is om van dit niveau naar het volgende te gaan. */
export function xpNodig(niveau = staat.niveau) {
  return niveau * 10;
}

/** Ervaring erbij. Geeft een lijst met nieuwe niveaus terug (meestal leeg of één). */
export function krijgXp(punten) {
  const nieuw = [];
  staat.xp += punten;
  while (staat.xp >= xpNodig()) {
    staat.xp -= xpNodig();
    staat.niveau += 1;
    staat.maxGezondheid += 4;
    staat.gezondheid = Math.min(staat.maxGezondheid, staat.gezondheid + 4);
    staat.aanval += 1;
    staat.verdediging += 1;
    staat.snelheid += 1;
    nieuw.push(staat.niveau);
  }
  return nieuw;
}

/** Een nieuwe aanval leren (maximaal 4). Geeft false als hij al bekend is. */
export function leerAanval(id, pp) {
  if (staat.aanvallen.includes(id)) return false;
  staat.aanvallen.push(id);
  staat.ppMax[id] = pp;
  staat.pp[id] = pp;
  return true;
}

/** Helemaal opknappen: gezondheid en alle PP. */
export function knapOp() {
  staat.gezondheid = staat.maxGezondheid;
  Object.keys(staat.ppMax || {}).forEach((k) => { staat.pp[k] = staat.ppMax[k]; });
}

export function speeltijdTekst(ms = staat.speeltijdMs) {
  const minuten = Math.floor(ms / 60000);
  const uren = Math.floor(minuten / 60);
  return `${uren}:${String(minuten % 60).padStart(2, '0')}`;
}
