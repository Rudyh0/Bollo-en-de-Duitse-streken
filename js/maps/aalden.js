// Aalden: het laatste stadje voor het vakantiepark. Huisjes met groen-witte luiken, een molen, een brink met een dobbe,
// tabakszaak Gerard, bejaardenhuis Huize Avondrood en een De Beren. De weg naar het park (noorden) zit dicht:
// Stabsgefreiter Manfred is zijn pakje Duitse zware shag kwijt.

const B = 44;
const H = 30;

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
const zand = (x, y) => ((x + y) % 2 ? 'z' : 'Z');

// gras met bloemetjes
vul(grond, 0, 0, B - 1, H - 1, (x, y) => ((x * 13 + y * 7) % 11 === 0 ? 'b' : 'g'));
// stoepen, de hoofdstraat, de weg naar het park (noorden) en het straatje aan de zuidkant
vul(grond, 2, 14, 41, 14, 's');
vul(grond, 2, 17, 39, 17, 's');
vul(grond, 0, 15, 41, 16, klinker);
vul(grond, 31, 0, 32, 14, klinker);
vul(grond, 40, 17, 41, 27, klinker);
vul(grond, 2, 26, 41, 27, klinker);
// zandpaadje over de brink en een dobbe (Drents vennetje)
vul(grond, 20, 18, 20, 25, zand);
vul(grond, 24, 19, 28, 20, 'w');

// bomen rondom (behalve de weg naar het park en de ingang in het westen)
for (let x = 0; x < B - 2; x += 2) {
  if (x !== 30 && x !== 32) boom(x, 0);
}
vul(boven, 30, 0, 30, 1, '*');
vul(boven, 33, 0, 33, 1, '*');
for (let y = 2; y < 13; y += 2) boom(0, y);
boven[14][0] = '*';
boven[14][1] = '*';
boven[17][0] = '*';
boven[17][1] = '*';
for (let y = 18; y < 28; y += 2) boom(0, y);
for (let x = 0; x < B; x += 2) boom(x, 28);
for (let y = 0; y < 28; y += 2) boom(42, y);
// een heg langs het noorden, zodat je echt langs de slagboom moet
vul(boven, 2, 2, 30, 2, '*');
vul(boven, 33, 2, 41, 2, '*');
boven[3][33] = '*';
// tuinen achter de huizen
boom(4, 5);
boom(11, 4);
boom(23, 4);
boom(37, 3);
[[8, 6], [16, 7], [20, 4], [27, 8], [35, 6], [39, 8]].forEach(([x, y]) => { boven[y][x] = '*'; });
[[6, 9], [14, 9], [25, 9], [29, 10], [38, 21], [16, 20]].forEach(([x, y]) => { boven[y][x] = 'f'; });

const rij = (r) => r.join('');

export const aalden = {
  id: 'aalden',
  naam: 'AALDEN',
  muziek: 'aalden',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'buiten',
  legenda: {
    g: 0, b: 1, z: 4, Z: 11, '*': 9, 1: 12, 2: 13, 3: 14, 4: 15, w: 18, k: 23, K: 24, f: 25, s: 29,
  },
  vast: [9, 12, 13, 14, 15, 18, 25],
  rijen: grond.map(rij),
  boven: boven.map(rij),
  objecten: [
    // de weg naar het park
    { id: 'slagboomAalden', type: 'slagboom', x: 30, y: 3, openVlag: 'aaldenSlagboomOpen', script: 'slagboom' },
    { type: 'bord_vakantiepark', x: 27, y: 5, script: 'bordPark' },
    // noordkant van de hoofdstraat
    { type: 'huisje', kleur: 'rood', x: 3, y: 12, script: 'huisje' },
    { type: 'tabakszaak', x: 7, y: 12, script: 'tabakGevel' },
    { type: 'huisje', kleur: 'wit', x: 12, y: 12, script: 'huisje' },
    { type: 'restaurant_beren', x: 16, y: 12, script: 'berenGevel' },
    { type: 'huisje', kleur: 'geel', x: 22, y: 12, script: 'huisje' },
    { type: 'huisje', kleur: 'rood', x: 26, y: 12, script: 'huisje' },
    { type: 'molen', x: 35, y: 11, script: 'molen', interacties: [{ dx: 1, dy: 1, script: 'molenDeur' }] },
    { type: 'meelzakken', x: 38, y: 12, script: 'meelzakken' },
    { type: 'lantaarn', x: 10, y: 14 },
    { type: 'lantaarn', x: 29, y: 14 },
    { type: 'lantaarn', x: 15, y: 17 },
    { type: 'lantaarn', x: 34, y: 17 },
    // de brink
    { type: 'bord', x: 3, y: 18, script: 'bordDorp' },
    { type: 'eik', x: 6, y: 19, script: 'eik' },
    { type: 'bankje', x: 10, y: 20, script: 'bankje' },
    { type: 'waterpomp', x: 14, y: 19, script: 'pomp' },
    { type: 'bankje', x: 30, y: 19, script: 'bankje' },
    // zuidkant: het bejaardenhuis en huisjes
    { type: 'bejaardenhuis', x: 3, y: 24, script: 'bejaardenGevel' },
    { type: 'scootmobiel', x: 9, y: 25, script: 'scootmobiel' },
    { type: 'huisje', kleur: 'geel', x: 11, y: 24, script: 'huisje' },
    { type: 'huisje', kleur: 'rood', x: 15, y: 24, script: 'huisje' },
    { type: 'huisje', kleur: 'wit', x: 22, y: 24, script: 'huisje' },
    { type: 'huisje', kleur: 'geel', x: 26, y: 24, script: 'huisje' },
    { type: 'huisje', kleur: 'rood', x: 30, y: 24, script: 'huisje' },
    { type: 'huisje', kleur: 'wit', x: 34, y: 24, script: 'huisje' },
  ],
  npcs: [
    {
      id: 'manfred', sprite: 'mens_manfred', x: 33, y: 4, richting: 'links', script: 'manfred',
      zicht: 2, zichtVlag: 'aaldenQuest',
    },
    { id: 'geert', sprite: 'mens_boer', x: 13, y: 16, richting: 'rechts', script: 'geert', gedrag: 'zwerven', straal: 3 },
    { id: 'hennie', sprite: 'mens_dorpsvrouw', x: 22, y: 18, richting: 'omlaag', script: 'hennie', gedrag: 'zwerven', straal: 2 },
    { id: 'bert', sprite: 'mens_opa', x: 12, y: 21, richting: 'links', script: 'bert' },
    { id: 'lothar', sprite: 'mens_soldaat_muts', x: 36, y: 16, richting: 'omlaag', script: 'lothar', gedrag: 'draaien', richtingen: ['omlaag', 'links', 'omhoog'] },
    { id: 'jan', sprite: 'mens_molenaar', x: 38, y: 13, richting: 'links', script: 'jan', gedrag: 'zwerven', straal: 1 },
  ],
  warps: [
    // terug naar het strandje
    { x: 0, y: 15, naar: 'strand', nx: 38, ny: 7, richting: 'links' },
    { x: 0, y: 16, naar: 'strand', nx: 38, ny: 9, richting: 'links' },
    // deuren
    { x: 9, y: 13, naar: 'tabakszaak', nx: 4, ny: 5, richting: 'omhoog' },
    { x: 18, y: 13, naar: 'beren_aalden', nx: 5, ny: 8, richting: 'omhoog' },
    { x: 6, y: 25, naar: 'avondrood', nx: 6, ny: 8, richting: 'omhoog' },
    // de weg naar het vakantiepark
    { x: 31, y: 0, script: 'uitgang' },
    { x: 32, y: 0, script: 'uitgang' },
  ],
  interacties: [
    { x: 24, y: 19, script: 'dobbe' }, { x: 25, y: 19, script: 'dobbe' }, { x: 26, y: 19, script: 'dobbe' },
    { x: 27, y: 19, script: 'dobbe' }, { x: 28, y: 19, script: 'dobbe' },
    { x: 24, y: 20, script: 'dobbe' }, { x: 25, y: 20, script: 'dobbe' }, { x: 26, y: 20, script: 'dobbe' },
    { x: 27, y: 20, script: 'dobbe' }, { x: 28, y: 20, script: 'dobbe' },
  ],
  start: { x: 1, y: 15, richting: 'rechts' },
};

// ------------------------------------------------------------ binnen

const BINNEN = {
  '[': 6, ']': 7, '=': 8, H: 9, d: 19, p: 11, q: 12, _: 13, W: 27, w: 28, c: 39, C: 40, '-': 41,
};
const BINNEN_VAST = [6, 7, 8, 9, 27, 28];

export const tabakszaak = {
  id: 'tabakszaak',
  naam: 'TABAKSZAAK GERARD',
  muziek: 'aalden',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'dorp_binnen',
  legenda: BINNEN,
  vast: BINNEN_VAST,
  rijen: [
    'HWWWWWWWWH',
    'HwwwwwwwwH',
    '[________]',
    '[pqpqpqpq]',
    '[qpqpqpqp]',
    '[pqpqpqpq]',
    'H===d====H',
  ],
  objecten: [
    { type: 'tabaksbalie', x: 1, y: 3, script: 'gerard' },
    { type: 'tabaksschap', x: 4, y: 2, script: 'schap' },
    { type: 'tabaksschap', x: 7, y: 2, script: 'schap' },
    { type: 'krantenrek', x: 8, y: 4, script: 'kranten' },
  ],
  npcs: [
    { id: 'gerard', sprite: 'mens_gerard', x: 2, y: 2, richting: 'omlaag', script: 'gerard' },
    { id: 'bodo', sprite: 'mens_soldaat_muts', x: 6, y: 4, richting: 'omhoog', script: 'bodo' },
  ],
  warps: [{ x: 4, y: 6, naar: 'aalden', nx: 9, ny: 14, richting: 'omlaag' }],
  interacties: [],
  start: { x: 4, y: 5, richting: 'omhoog' },
};

export const avondrood = {
  id: 'avondrood',
  naam: 'HUIZE AVONDROOD',
  muziek: 'avondrood',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'dorp_binnen',
  legenda: BINNEN,
  vast: BINNEN_VAST,
  rijen: [
    'HWWWWWWWWWWWWH',
    'HwwwwwwwwwwwwH',
    '[------------]',
    '[cCcCcCcCcCcC]',
    '[CcCcCcCcCcCc]',
    '[cCcCcCcCcCcC]',
    '[CcCcCcCcCcCc]',
    '[cCcCcCcCcCcC]',
    '[CcCcCcCcCcCc]',
    'H=====d======H',
  ],
  objecten: [
    { type: 'staande_klok', x: 1, y: 2, script: 'klok' },
    { type: 'tv_kast', x: 3, y: 2, script: 'tv' },
    { type: 'fauteuil', x: 3, y: 4, script: 'fauteuil' },
    { type: 'fauteuil', kleur: 'groen', x: 5, y: 4, script: 'fauteuil' },
    { type: 'bingotafel', x: 9, y: 3, script: 'bingo' },
    { type: 'tafeltje', x: 9, y: 6, script: 'koffie' },
    { type: 'rollator', x: 2, y: 7, script: 'rollator' },
    { type: 'beren_plant', x: 12, y: 2, script: 'plant' },
    { type: 'fauteuil', x: 1, y: 7, script: 'fauteuilJannes' },
  ],
  npcs: [
    { id: 'jannes', sprite: 'mens_jannes', x: 3, y: 7, richting: 'omlaag', script: 'jannes' },
    { id: 'grietje', sprite: 'mens_oma', x: 8, y: 3, richting: 'rechts', script: 'grietje' },
    { id: 'kloosterman', sprite: 'mens_opa', x: 11, y: 3, richting: 'links', script: 'kloosterman' },
    { id: 'ineke', sprite: 'mens_zuster', x: 7, y: 6, richting: 'omlaag', script: 'ineke', gedrag: 'zwerven', straal: 2 },
  ],
  warps: [{ x: 6, y: 9, naar: 'aalden', nx: 6, ny: 26, richting: 'omlaag' }],
  interacties: [],
  start: { x: 6, y: 8, richting: 'omhoog' },
};
