// Wezup: een ambachtsstadje met een haventje, vissers, een bakker, een slager en een kruidenier.
// Achter de boekenkast van de kruidenier zit een geheime kamer.
import { LEGENDA as BINNEN_LEGENDA } from './binnen-dorp.js';

const B = 44;
const H = 34;

const grond = Array.from({ length: H }, () => Array(B).fill('g'));
const boven = Array.from({ length: H }, () => Array(B).fill(' '));

function vul(raster, x1, y1, x2, y2, teken) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      if (y < 0 || y >= H || x < 0 || x >= B) continue;
      raster[y][x] = typeof teken === 'function' ? teken(x, y) : teken;
    }
  }
}

function boom(x, y) {
  if (x < 0 || y < 0 || x + 1 >= B || y + 1 >= H) return;
  boven[y][x] = '1';
  boven[y][x + 1] = '2';
  boven[y + 1][x] = '3';
  boven[y + 1][x + 1] = '4';
}

const klinker = (x, y) => ((x + y) % 4 ? 'k' : 'K');
// gras
vul(grond, 0, 0, B - 1, H - 1, (x, y) => ((x * 13 + y * 7) % 11 === 0 ? 'b' : 'g'));
// hoofdstraat (zuid -> noord) en twee dwarsstraten
vul(grond, 20, 0, 21, H - 1, klinker);
vul(grond, 2, 9, 41, 10, klinker);
vul(grond, 2, 24, 41, 25, klinker);
// kades en de vaart
vul(grond, 0, 11, B - 1, 13, (x, y) => ((x + y) % 2 ? 'q' : 'Q'));
vul(grond, 0, 17, B - 1, 18, (x, y) => ((x + y) % 2 ? 'q' : 'Q'));
vul(grond, 0, 14, B - 1, 14, 'R');
vul(grond, 0, 15, B - 1, 15, 'w');
vul(grond, 0, 16, B - 1, 16, 'U');
// de brug
vul(grond, 19, 14, 22, 16, '#');
vul(boven, 19, 14, 19, 16, 'L');
vul(boven, 22, 14, 22, 16, 'L');
// bomen rondom
for (let x = 0; x < B; x += 2) {
  if (x !== 20) boom(x, 0);
}
for (let x = 0; x < B; x += 2) {
  if (x !== 20) boom(x, H - 2);
}
for (let y = 2; y < 9; y += 2) { boom(0, y); boom(42, y); }
for (let y = 26; y < H - 2; y += 2) { boom(0, y); boom(42, y); }
boven[19][0] = '*';
boven[19][43] = '*';
// struiken en bloemperken
[[3, 3], [8, 4], [12, 3], [16, 4], [26, 4], [31, 3], [35, 4], [39, 3]].forEach(([x, y]) => { boven[y][x] = '*'; });
// de weg naar het noorden zit verder dicht met heggen
vul(boven, 2, 1, 19, 1, (x) => (boven[1][x] === ' ' ? '*' : boven[1][x]));
vul(boven, 22, 1, 41, 1, (x) => (boven[1][x] === ' ' ? '*' : boven[1][x]));
vul(boven, 2, 2, 19, 2, '*');
vul(boven, 22, 2, 41, 2, '*');
// tuintjes in het zuiden
[[4, 27], [9, 28], [14, 27], [26, 27], [31, 28], [36, 27]].forEach(([x, y]) => { boven[y][x] = 'f'; });

const rij = (r) => r.join('');

export const wezup = {
  id: 'wezup',
  naam: 'WEZUP',
  muziek: 'wezup',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'buiten',
  legenda: {
    g: 0, b: 1, '*': 9, 1: 12, 2: 13, 3: 14, 4: 15, w: 18, k: 23, K: 24, f: 25,
    q: 39, R: 40, '#': 41, L: 42, Q: 43, U: 44,
  },
  vast: [9, 12, 13, 14, 15, 18, 25, 40, 42, 44],
  rijen: grond.map(rij),
  boven: boven.map(rij),
  objecten: [
    // noordkant: de kruidenier en huizen
    { type: 'huis', kleur: 'donker', x: 4, y: 7, script: 'huis' },
    { type: 'winkel', soort: 'kruidenier', x: 9, y: 7, script: 'kruidenierGevel' },
    { type: 'huis', kleur: 'wit', x: 14, y: 7, script: 'huis' },
    { type: 'poster_gezocht', x: 18, y: 6, script: 'poster' },
    { type: 'huis', kleur: 'geel', x: 24, y: 7, script: 'huis' },
    { type: 'huis', kleur: 'rood', x: 28, y: 7, script: 'huis' },
    { type: 'huis', kleur: 'donker', x: 32, y: 7, script: 'huis' },
    { type: 'huis', kleur: 'wit', x: 36, y: 7, script: 'huis' },
    // de haven
    { type: 'netten', x: 6, y: 12, script: 'netten' },
    { type: 'tonnen', x: 15, y: 12, script: 'tonnen' },
    { type: 'tonnen', x: 16, y: 12, script: 'tonnen' },
    { type: 'viskraam', x: 27, y: 12, script: 'viskraam' },
    { type: 'netten', x: 35, y: 12, script: 'netten' },
    { type: 'vissersboot', x: 6, y: 15, script: 'boot' },
    { type: 'roeiboot', x: 14, y: 15, script: 'roeiboot' },
    { type: 'vissersboot', x: 30, y: 15, script: 'boot' },
    { type: 'roeiboot', x: 37, y: 15, script: 'roeiboot' },
    // het verstopte kistje, achter de netten op de zuidkade
    { type: 'netten', x: 3, y: 17, script: 'netten' },
    { type: 'tonnen', x: 5, y: 17, script: 'tonnen' },
    { id: 'snertKist', type: 'schatkist', x: 1, y: 17, vlag: 'snertKist', script: 'kist' },
    // zuidkant: bakker, slager, klompenmaker en huizen
    { type: 'winkel', soort: 'bakker', x: 3, y: 22, script: 'bakkerGevel' },
    { type: 'huis', kleur: 'rood', x: 8, y: 22, script: 'huis' },
    { type: 'huis', kleur: 'geel', x: 12, y: 22, script: 'huis' },
    { type: 'lantaarn', x: 18, y: 23 },
    { type: 'winkel', soort: 'slager', x: 24, y: 22, script: 'slagerGevel' },
    { type: 'huis', kleur: 'donker', x: 29, y: 22, script: 'huis' },
    { type: 'winkel', soort: 'klompen', x: 33, y: 22, script: 'klompen' },
    { type: 'huis', kleur: 'wit', x: 38, y: 22, script: 'huis' },
    { type: 'bord', x: 22, y: 30, script: 'bordStad' },
    { type: 'lantaarn', x: 23, y: 23 },
  ],
  npcs: [
    {
      id: 'friedrich', sprite: 'mens_leutnant', x: 22, y: 3, richting: 'links', script: 'leutnant',
      zicht: 2, zichtVlag: 'wezupQuest', verbergVlag: 'wezupKlaar',
    },
    { id: 'truus', sprite: 'mens_oma', x: 16, y: 10, richting: 'omlaag', script: 'truus', gedrag: 'zwerven', straal: 2 },
    { id: 'klaas', sprite: 'mens_visser', x: 10, y: 13, richting: 'omlaag', script: 'klaas', gedrag: 'draaien', richtingen: ['omlaag', 'links', 'rechts'] },
    { id: 'grietje', sprite: 'mens_vissersvrouw', x: 28, y: 11, richting: 'omlaag', script: 'grietje' },
    { id: 'sieds', sprite: 'mens_visser', x: 34, y: 17, richting: 'omhoog', script: 'sieds' },
    { id: 'jan', sprite: 'mens_klompenmaker', x: 37, y: 24, richting: 'omlaag', script: 'jan' },
    { id: 'gerrit', sprite: 'mens_boer', x: 12, y: 25, richting: 'rechts', script: 'gerrit', gedrag: 'zwerven', straal: 3 },
    { id: 'hilde', sprite: 'mens_dorpsvrouw', x: 28, y: 25, richting: 'links', script: 'hilde', gedrag: 'zwerven', straal: 3 },
  ],
  warps: [
    { x: 20, y: H - 1, naar: 'n34c', nx: 24, ny: 1, richting: 'omlaag' },
    { x: 21, y: H - 1, naar: 'n34c', nx: 25, ny: 1, richting: 'omlaag' },
    // deuren
    { x: 11, y: 8, naar: 'kruidenier', nx: 4, ny: 5, richting: 'omhoog' },
    { x: 5, y: 23, naar: 'bakkerij', nx: 4, ny: 5, richting: 'omhoog' },
    { x: 26, y: 23, naar: 'slagerij', nx: 4, ny: 5, richting: 'omhoog' },
    // de uitgang in het noorden
    { x: 20, y: 0, script: 'uitgang' },
    { x: 21, y: 0, script: 'uitgang' },
  ],
  interacties: [],
  start: { x: 20, y: H - 2, richting: 'omhoog' },
};

// ------------------------------------------------------------ binnen

const LEGENDA = {
  ...BINNEN_LEGENDA, W: 27, w: 28, T: 29, t: 30, p: 11, q: 12, _: 13,
};
const VAST = [6, 7, 8, 9, 27, 28, 29, 30];

function winkelBinnen(id, naam, muren, objecten, npcs, terug, extra = {}) {
  const [boven, onder] = muren;
  return {
    id,
    naam,
    muziek: 'wezup',
    gevechtAchtergrond: 'bg_gevecht_dorp',
    tegelset: 'dorp_binnen',
    legenda: LEGENDA,
    vast: VAST,
    rijen: [
      `H${boven.repeat(8)}H`,
      `H${onder.repeat(8)}H`,
      '[________]',
      '[pqpqpqpq]',
      '[qpqpqpqp]',
      '[pqpqpqpq]',
      'H===d====H',
    ],
    objecten,
    npcs,
    warps: [{ x: 4, y: 6, naar: 'wezup', nx: terug.x, ny: terug.y, richting: 'omlaag' }, ...(extra.warps || [])],
    interacties: [],
    start: { x: 4, y: 5, richting: 'omhoog' },
  };
}

export const kruidenier = winkelBinnen('kruidenier', 'KRUIDENIER HENDRIKS', ['W', 'w'], [
  { type: 'toonbank_oud', x: 1, y: 3, script: 'hendrik' },
  { type: 'kast_kruidenier', x: 4, y: 2, script: 'kast' },
  { id: 'boekenkast', type: 'boekenkast', x: 7, y: 2, vlag: 'boekenkastOpen', script: 'boekenkast' },
], [
  { id: 'hendrik', sprite: 'mens_hendrik', x: 2, y: 2, richting: 'omlaag', script: 'hendrik' },
], { x: 11, y: 9 }, {
  warps: [
    { x: 7, y: 2, vlag: 'boekenkastOpen', naar: 'achterkamer', nx: 3, ny: 4, richting: 'omhoog' },
    { x: 8, y: 2, vlag: 'boekenkastOpen', naar: 'achterkamer', nx: 3, ny: 4, richting: 'omhoog' },
  ],
});

export const bakkerij = winkelBinnen('bakkerij', 'BAKKERIJ JANSEN', ['T', 't'], [
  { type: 'broodvitrine', x: 1, y: 3, script: 'bakker' },
  { type: 'oven', x: 6, y: 2, script: 'oven' },
], [
  { id: 'bakker', sprite: 'mens_bakker', x: 2, y: 2, richting: 'omlaag', script: 'bakker' },
  { id: 'hans', sprite: 'mens_soldaat_muts', x: 6, y: 4, richting: 'links', script: 'hans' },
], { x: 5, y: 24 });

export const slagerij = winkelBinnen('slagerij', 'SLAGERIJ MULDER', ['T', 't'], [
  { type: 'vleesvitrine', x: 1, y: 3, script: 'slager' },
  { type: 'worsten', x: 5, y: 2, script: 'worsten' },
  { type: 'tonnen', x: 8, y: 2 },
], [
  { id: 'slager', sprite: 'mens_slager', x: 2, y: 2, richting: 'omlaag', script: 'slager' },
], { x: 26, y: 24 });

export const achterkamer = {
  id: 'achterkamer',
  naam: 'DE GEHEIME KAMER',
  muziek: 'achterkamer',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'dorp_binnen',
  legenda: LEGENDA,
  vast: VAST,
  rijen: [
    'HWWWWWH',
    'HwwwwwH',
    '[_____]',
    '[pqpqp]',
    '[qpqpq]',
    'H==d==H',
  ],
  objecten: [
    { type: 'bedje', x: 1, y: 2, script: 'bedje' },
    { type: 'bureautje', x: 4, y: 2, script: 'bureautje' },
    { type: 'smokkelwaar', x: 5, y: 4, script: 'smokkelwaar' },
    { type: 'smokkelwaar', x: 1, y: 4, script: 'smokkelwaar' },
  ],
  npcs: [
    { id: 'anne', sprite: 'mens_anne', x: 3, y: 3, richting: 'omlaag', script: 'anne', verbergVlag: 'anneGevonden' },
  ],
  warps: [{ x: 3, y: 5, naar: 'kruidenier', nx: 7, ny: 3, richting: 'omlaag' }],
  interacties: [],
  start: { x: 3, y: 4, richting: 'omhoog' },
};
