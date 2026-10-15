// De N34, de "Hunebed Highway": drie stukken weg met een fietspad ernaast, en het tankstation.
// Je loopt over het rode fietspad; de weg zelf ligt achter de vangrail. Er rijdt continu verkeer.
import { LEGENDA as BINNEN_LEGENDA } from './binnen-dorp.js';

const B = 40;
const H = 15;
// rijen (van boven naar beneden)
const FIETSPAD = 6;
const VANGRAIL = 8;

export const VERKEER = {
  banen: [
    { y: 11 * 16 - 2, richting: -1, min: 900, max: 2800 },   // naar het westen (bovenste rijbaan)
    { y: 13 * 16 - 3, richting: 1, min: 900, max: 2800 },    // naar het oosten
  ],
  soorten: [
    { textuur: 'voertuig_auto_rood', snelheid: 170, kans: 3 },
    { textuur: 'voertuig_auto_blauw', snelheid: 180, kans: 3 },
    { textuur: 'voertuig_auto_zilver', snelheid: 160, kans: 3 },
    { textuur: 'voertuig_auto_geel', snelheid: 175, kans: 2 },
    { textuur: 'voertuig_caravan', snelheid: 95, kans: 1 },
    { textuur: 'voertuig_jeep', snelheid: 130, kans: 2 },
    { textuur: 'voertuig_truck', snelheid: 100, kans: 2 },
    { textuur: 'voertuig_pantser', snelheid: 85, kans: 1 },
  ],
};

/**
 * Bouwt een stuk N34.
 * cfg: { afslag: x van de afslag naar het noorden (2 tegels breed), open: [[x1, x2], ...] stukken zonder bomen bovenaan }
 */
function bouwWeg(cfg = {}) {
  const grond = Array.from({ length: H }, () => Array(B).fill('g'));
  const boven = Array.from({ length: H }, () => Array(B).fill(' '));
  const voor = Array.from({ length: H }, () => Array(B).fill(' '));
  const vul = (raster, x1, y1, x2, y2, t) => {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) if (x >= 0 && x < B && y >= 0 && y < H) raster[y][x] = typeof t === 'function' ? t(x, y) : t;
  };
  const vrij = (x) => (cfg.open || []).some(([a, b]) => x >= a && x <= b) || (cfg.afslag !== undefined && x >= cfg.afslag - 1 && x <= cfg.afslag + 1);
  vul(grond, 0, 0, B - 1, H - 1, (x, y) => ((x * 13 + y * 7) % 11 === 0 ? 'b' : 'g'));
  // bomen bovenaan
  for (let x = 0; x < B; x += 2) {
    if (vrij(x) || vrij(x + 1)) continue;
    boven[0][x] = '1';
    boven[0][x + 1] = '2';
    boven[1][x] = '3';
    boven[1][x + 1] = '4';
  }
  // fietspad, vangrails en de weg
  vul(grond, 0, FIETSPAD, B - 1, FIETSPAD, 'f');
  vul(boven, 0, VANGRAIL, B - 1, VANGRAIL, 'v');
  vul(grond, 0, 9, B - 1, 9, 'r');
  vul(grond, 0, 10, B - 1, 10, 'a');
  vul(grond, 0, 11, B - 1, 11, 'm');
  vul(grond, 0, 12, B - 1, 12, 'o');
  vul(voor, 0, 13, B - 1, 13, 'v');
  // afslag naar het noorden
  if (cfg.afslag !== undefined) {
    const a = cfg.afslag;
    vul(grond, a, 0, a, VANGRAIL, '<');
    vul(grond, a + 1, 0, a + 1, VANGRAIL, '>');
    vul(boven, a, VANGRAIL, a + 1, VANGRAIL, ' ');
    grond[4][a] = '=';
    grond[4][a + 1] = '=';
  }
  return { grond, boven, voor, vul };
}

const rij = (r) => r.join('');

const BASIS = {
  muziek: 'snelweg',
  gevechtAchtergrond: 'bg_gevecht_weg',
  tegelset: 'buiten',
  camVolgY: -12,
  legenda: {
    g: 0, b: 1, z: 4, Z: 11, h: 5, H: 10, '*': 9,
    1: 12, 2: 13, 3: 14, 4: 15,
    r: 30, a: 31, m: 32, o: 33, f: 34, v: 35, '<': 36, '>': 37, '=': 38,
  },
  vast: [9, 12, 13, 14, 15, 30, 31, 32, 33, 35],
  verkeer: VERKEER,
  interacties: [],
};

const randWarps = (x, naar, nx) => [2, 3, 4, 5, 6, 7].map((y) => ({ x, y, naar, nx, ny: y, richting: x === 0 ? 'links' : 'rechts' }));

// ------------------------------------------------------------ deel 1: het kistje

const w1 = bouwWeg();
// een paar struiken en heide in het weiland
[[3, 3], [10, 2], [17, 3], [29, 2], [35, 3]].forEach(([x, y]) => { w1.boven[y][x] = '*'; });
w1.vul(w1.grond, 22, 2, 33, 4, (x, y) => ((x + y) % 3 ? 'h' : 'H'));

export const n34a = {
  ...BASIS,
  id: 'n34a',
  naam: 'N34 - HUNEBED HIGHWAY',
  rijen: w1.grond.map(rij),
  boven: w1.boven.map(rij),
  voor: w1.voor.map(rij),
  objecten: [
    { type: 'bord_hunebedhighway', x: 6, y: 5, script: 'bordHighway' },
    { type: 'bord_n34', x: 14, y: 5, script: 'bordN34' },
    { type: 'hunebed', x: 26, y: 3, script: 'hunebed' },
    { type: 'den', x: 37, y: 4 },
    { id: 'krat', type: 'krat', x: 20, y: 7, vlag: 'kratOpen', toonVlag: 'kratGevallen', script: 'krat' },
  ],
  npcs: [],
  warps: [
    ...[2, 3, 4, 5, 6, 7].map((y) => ({ x: 0, y, naar: 'dorp', nx: 40, ny: 1, richting: 'omlaag' })),
    ...randWarps(39, 'n34b', 1),
  ],
  start: { x: 1, y: 6, richting: 'rechts' },
};

// ------------------------------------------------------------ deel 2: het tankstation

const w2 = bouwWeg({ open: [[13, 24]] });
[[4, 3], [9, 2], [27, 3], [33, 2], [36, 4]].forEach(([x, y]) => { w2.boven[y][x] = '*'; });

export const n34b = {
  ...BASIS,
  id: 'n34b',
  naam: 'N34 - TANKSTATION',
  rijen: w2.grond.map(rij),
  boven: w2.boven.map(rij),
  voor: w2.voor.map(rij),
  objecten: [
    { type: 'tankstation', x: 14, y: 3, script: 'tankstation' },
    { type: 'bord_hunebedhighway', x: 29, y: 5, script: 'bordHighway' },
    { type: 'lantaarn', x: 12, y: 5 },
    { type: 'lantaarn', x: 24, y: 5 },
  ],
  npcs: [],
  warps: [
    ...randWarps(0, 'n34a', 38),
    { x: 16, y: 4, naar: 'tankstation', nx: 4, ny: 5, richting: 'omhoog' },
    ...[2, 3, 4, 5, 6, 7].map((y) => ({ x: 39, y, script: 'verder' })),
  ],
  start: { x: 1, y: 6, richting: 'rechts' },
};

// ------------------------------------------------------------ deel 3: de afslag met de grenscontrole

const AFSLAG = 24;
const w3 = bouwWeg({ afslag: AFSLAG });
// heggen rond de grenspost, zodat je er niet omheen kunt
w3.vul(w3.boven, 0, 2, AFSLAG - 5, 3, '*');
w3.vul(w3.boven, AFSLAG - 2, 0, AFSLAG - 1, 3, '*');
w3.boven[3][AFSLAG - 1] = ' ';
w3.vul(w3.boven, AFSLAG + 2, 2, B - 1, 3, '*');
w3.vul(w3.boven, 35, 4, B - 1, 7, '*');

export const n34c = {
  ...BASIS,
  id: 'n34c',
  naam: 'N34 - AFSLAG WEZUP',
  rijen: w3.grond.map(rij),
  boven: w3.boven.map(rij),
  voor: w3.voor.map(rij),
  objecten: [
    { type: 'bord_afslag', x: 17, y: 5, script: 'bordAfslag' },
    { type: 'wachthuisje', x: 20, y: 2, script: 'wachthuisje' },
    { id: 'slagboom', type: 'slagboom', x: AFSLAG - 1, y: 3, openVlag: 'grensOpen', script: 'slagboom' },
    { type: 'pion', x: AFSLAG - 1, y: 5 },
    { type: 'pion', x: AFSLAG + 2, y: 5 },
    { type: 'dranghek', x: 33, y: 4, script: 'afgesloten' },
    { type: 'dranghek', x: 33, y: 5, script: 'afgesloten' },
    { type: 'dranghek', x: 33, y: 6, script: 'afgesloten' },
    { type: 'dranghek', x: 33, y: 7, script: 'afgesloten' },
    { type: 'bord', x: 32, y: 5, script: 'afgesloten' },
  ],
  npcs: [
    {
      id: 'helmut', sprite: 'mens_helmut', x: AFSLAG + 2, y: 4, richting: 'links', script: 'controle',
      zicht: 2, zichtVlag: 'grensControle',
    },
    { id: 'jens', sprite: 'mens_jens', x: AFSLAG + 3, y: 4, richting: 'links', script: 'jens' },
    { id: 'rex', sprite: 'rex', x: AFSLAG - 2, y: 4, richting: 'rechts', script: 'rex', gedrag: 'draaien', richtingen: ['rechts', 'omlaag'] },
  ],
  warps: [
    ...randWarps(0, 'n34b', 38),
    { x: AFSLAG, y: 0, script: 'stadje' },
    { x: AFSLAG + 1, y: 0, script: 'stadje' },
  ],
  start: { x: 1, y: 6, richting: 'rechts' },
};

// ------------------------------------------------------------ het tankstation van binnen

export const tankstation = {
  id: 'tankstation',
  naam: 'TANK & TOSTI',
  muziek: 'winkel',
  gevechtAchtergrond: 'bg_gevecht_winkel',
  tegelset: 'dorp_binnen',
  legenda: { ...BINNEN_LEGENDA, '.': 20, ',': 21, _: 22, M: 23, m: 24, P: 25, S: 26 },
  vast: [6, 7, 8, 9, 23, 24, 25],
  rijen: [
    'HMMMMMMMMH',
    'HmmPmmmmmH',
    '[________]',
    '[.,.,.,.,]',
    '[,.,.,.,.]',
    '[.,.,.,.,]',
    'H===S====H',
  ],
  objecten: [
    { type: 'kassabalie', x: 1, y: 3, script: 'kassa' },
    { type: 'schap', x: 5, y: 2, script: 'schap' },
    { type: 'koffieautomaat', x: 7, y: 2, script: 'koffie' },
    { type: 'koelkast', x: 8, y: 2, script: 'koelkast' },
    { type: 'schap', x: 5, y: 4, script: 'schap' },
  ],
  npcs: [
    { id: 'kassiere', sprite: 'mens_kassiere', x: 2, y: 2, richting: 'omlaag', script: 'kassiere' },
    { id: 'bernd', sprite: 'mens_bernd', x: 7, y: 4, richting: 'links', script: 'bernd', verbergVlag: 'berndVerslagen' },
  ],
  warps: [{ x: 4, y: 6, naar: 'n34b', nx: 16, ny: 5, richting: 'omlaag' }],
  interacties: [{ x: 3, y: 1, script: 'poster' }],
  start: { x: 4, y: 5, richting: 'omhoog' },
};
