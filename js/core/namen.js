import { lees, schrijf } from './opslag.js';
import { OPSLAG_SLEUTELS } from './constanten.js';
import { SPEL_CONFIG } from '../spel-config.js';

export const MAX_BEERNAAM = 10;
export const MAX_PARKNAAM = 20;

const opgeslagen = lees(OPSLAG_SLEUTELS.namen, {}) || {};

const namen = {
  park: (SPEL_CONFIG.parknaam || opgeslagen.park || '').trim(),
  beer: (SPEL_CONFIG.beernaam || opgeslagen.beer || '').trim(),
};

/** True als de host de namen vast heeft ingesteld in spel-config.js. */
export function namenVast() {
  return Boolean(SPEL_CONFIG.parknaam && SPEL_CONFIG.beernaam);
}

export function heeftNamen() {
  return Boolean(namen.park && namen.beer);
}

export function beer() {
  return namen.beer || 'Beer';
}

export function park() {
  return namen.park || 'het vakantiepark';
}

export function zetNamen(parknaam, beernaam) {
  namen.park = parknaam.trim();
  namen.beer = beernaam.trim();
  schrijf(OPSLAG_SLEUTELS.namen, { park: namen.park, beer: namen.beer });
  werkTitelBij();
}

export function werkTitelBij() {
  document.title = heeftNamen() ? `${beer()} en de Duitse streken` : 'De Duitse streken';
}

/** Vervangt {BEER}, {PARK} en {BEER_HOOFD} in een tekst. */
export function vul(tekst) {
  return tekst
    .replaceAll('{BEER_HOOFD}', beer().toUpperCase())
    .replaceAll('{PARK_HOOFD}', park().toUpperCase())
    .replaceAll('{BEER}', beer())
    .replaceAll('{PARK}', park());
}
