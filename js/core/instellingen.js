import { lees, schrijf } from './opslag.js';
import { OPSLAG_SLEUTELS } from './constanten.js';

export const TEKSTSNELHEDEN = [
  { id: 'langzaam', naam: 'LANGZAAM', msPerTeken: 55 },
  { id: 'normaal', naam: 'NORMAAL', msPerTeken: 30 },
  { id: 'snel', naam: 'SNEL', msPerTeken: 12 },
  { id: 'direct', naam: 'DIRECT', msPerTeken: 0 },
];

export const KNOP_OPTIES = [
  { id: 'auto', naam: 'AUTOMATISCH' },
  { id: 'aan', naam: 'AAN' },
  { id: 'uit', naam: 'UIT' },
];

const STANDAARD = {
  tekstsnelheid: 'normaal',
  muziek: 6,
  effecten: 7,
  knoppen: 'auto',
  altijdRennen: false,
};

const luisteraars = new Set();

export const instellingen = { ...STANDAARD, ...(lees(OPSLAG_SLEUTELS.instellingen, {}) || {}) };

export function zet(sleutel, waarde) {
  instellingen[sleutel] = waarde;
  schrijf(OPSLAG_SLEUTELS.instellingen, instellingen);
  luisteraars.forEach((f) => f(sleutel, waarde));
}

export function bijWijziging(f) {
  luisteraars.add(f);
  return () => luisteraars.delete(f);
}

export function msPerTeken() {
  const s = TEKSTSNELHEDEN.find((t) => t.id === instellingen.tekstsnelheid) || TEKSTSNELHEDEN[1];
  return s.msPerTeken;
}
