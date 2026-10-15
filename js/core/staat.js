// De toestand van het lopende spel. Dit is precies wat er wordt opgeslagen.
import { lees, schrijf } from './opslag.js';
import { OPSLAG_SLEUTELS, VERSIE } from './constanten.js';

function nieuweStaat() {
  return {
    versie: VERSIE,
    kaart: 'barak',
    x: 2,
    y: 4,
    richting: 'omlaag',
    gezondheid: 12,
    maxGezondheid: 20,
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

export function heeftOpslag() {
  return Boolean(lees(OPSLAG_SLEUTELS.spel));
}

export function opslagInfo() {
  return lees(OPSLAG_SLEUTELS.spel);
}

export function slaOp(kaartnaam) {
  const kopie = JSON.parse(JSON.stringify(staat));
  kopie.opgeslagenOp = new Date().toISOString();
  kopie.kaartnaam = kaartnaam;
  return schrijf(OPSLAG_SLEUTELS.spel, kopie);
}

export function laad() {
  const data = lees(OPSLAG_SLEUTELS.spel);
  if (!data) return false;
  Object.keys(staat).forEach((k) => delete staat[k]);
  Object.assign(staat, nieuweStaat(), data);
  return true;
}

export function speeltijdTekst(ms = staat.speeltijdMs) {
  const minuten = Math.floor(ms / 60000);
  const uren = Math.floor(minuten / 60);
  return `${uren}:${String(minuten % 60).padStart(2, '0')}`;
}
