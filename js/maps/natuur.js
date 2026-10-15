// Een typisch Drents natuurgebied, in drie delen:
//   1. een boeren landweg met trekkers, legervoertuigen en koeien
//   2. de Drentse Blue Lagoon, waar Duitsers op verlof zitten te barbecueën
//   3. een recreatiestrandje (met een verrassing in het zand)

const leeg = (b, h, t) => Array.from({ length: h }, () => Array(b).fill(t));

function maker(B, H) {
  const grond = leeg(B, H, 'g');
  const boven = leeg(B, H, ' ');
  const vul = (raster, x1, y1, x2, y2, t) => {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (x >= 0 && x < B && y >= 0 && y < H) raster[y][x] = typeof t === 'function' ? t(x, y) : t;
      }
    }
  };
  const boom = (x, y) => {
    if (x < 0 || y < 0 || x + 1 >= B || y + 1 >= H) return;
    boven[y][x] = '1';
    boven[y][x + 1] = '2';
    boven[y + 1][x] = '3';
    boven[y + 1][x + 1] = '4';
  };
  vul(grond, 0, 0, B - 1, H - 1, (x, y) => ((x * 13 + y * 7) % 11 === 0 ? 'b' : 'g'));
  return { grond, boven, vul, boom, rijen: () => grond.map((r) => r.join('')), bovenRijen: () => boven.map((r) => r.join('')) };
}

const LEGENDA = {
  g: 0, b: 1, z: 4, Z: 11, '*': 9, 1: 12, 2: 13, 3: 14, 4: 15, w: 18, '#': 41,
  r: 30, o: 33, W: 45, '^': 46, v: 47, s: 48, S: 49, y: 50, Y: 51, h: 52,
};
const VAST = [9, 12, 13, 14, 15, 18, 30, 33, 45, 46, 47, 52];

// ================================================================== 1. de landweg

const l = maker(40, 15);
for (let x = 0; x < 40; x += 2) if (x < 22 || x > 29) l.boom(x, 0);
l.vul(l.boven, 0, 5, 39, 5, 'h');
l.vul(l.boven, 26, 5, 27, 5, ' ');
l.vul(l.grond, 0, 7, 39, 7, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));
l.vul(l.grond, 0, 8, 39, 8, 'r');
l.vul(l.grond, 0, 9, 39, 9, 'o');
l.vul(l.grond, 0, 11, 39, 11, 'w');
for (let x = 0; x < 40; x += 2) l.boom(x, 13);

export const landweg = {
  id: 'landweg',
  naam: 'DE LANDWEG',
  muziek: 'landweg',
  gevechtAchtergrond: 'bg_gevecht_strand',
  tegelset: 'buiten',
  legenda: LEGENDA,
  vast: VAST,
  rijen: l.rijen(),
  boven: l.bovenRijen(),
  verkeer: {
    banen: [
      { y: 9 * 16 - 1, richting: -1, min: 2200, max: 5000 },
      { y: 10 * 16 - 1, richting: 1, min: 2200, max: 5000 },
    ],
    soorten: [
      { textuur: 'voertuig_trekker_rood', snelheid: 60, kans: 3 },
      { textuur: 'voertuig_trekker_groen', snelheid: 65, kans: 3 },
      { textuur: 'voertuig_trekker_blauw', snelheid: 55, kans: 2 },
      { textuur: 'voertuig_hooikar', snelheid: 45, kans: 2 },
      { textuur: 'voertuig_jeep', snelheid: 110, kans: 2 },
      { textuur: 'voertuig_truck', snelheid: 85, kans: 2 },
      { textuur: 'voertuig_pantser', snelheid: 70, kans: 1 },
    ],
  },
  objecten: [
    { type: 'bord_natuur', x: 3, y: 6, script: 'bord' },
    { type: 'boerderij', x: 24, y: 2, script: 'boerderij' },
    { type: 'melkbussen', x: 30, y: 4, script: 'melkbussen' },
    { type: 'hooibaal', x: 6, y: 12, script: 'hooibaal' },
    { type: 'hooibaal', x: 11, y: 12, script: 'hooibaal' },
    { type: 'hooibaal', x: 19, y: 12, script: 'hooibaal' },
    { type: 'hooibaal', x: 33, y: 12, script: 'hooibaal' },
  ],
  npcs: [
    { id: 'lubbert', sprite: 'mens_boer', x: 26, y: 6, richting: 'omlaag', script: 'lubbert' },
    { id: 'bertha', sprite: 'koe', x: 8, y: 3, richting: 'links', script: 'koe', gedrag: 'zwerven', straal: 2 },
    { id: 'klara', sprite: 'koe', x: 15, y: 2, richting: 'rechts', script: 'koe', gedrag: 'zwerven', straal: 2 },
    { id: 'mina', sprite: 'koe', x: 35, y: 3, richting: 'omlaag', script: 'koe', gedrag: 'zwerven', straal: 2 },
  ],
  warps: [
    { x: 0, y: 6, naar: 'wezup', nx: 20, ny: 1, richting: 'omlaag' },
    { x: 0, y: 7, naar: 'wezup', nx: 21, ny: 1, richting: 'omlaag' },
    { x: 39, y: 6, naar: 'lagune', nx: 1, ny: 12, richting: 'rechts' },
    { x: 39, y: 7, naar: 'lagune', nx: 1, ny: 13, richting: 'rechts' },
  ],
  interacties: [],
  start: { x: 1, y: 7, richting: 'rechts' },
};

// ================================================================== 2. de Drentse Blue Lagoon

const g = maker(40, 26);
for (let x = 0; x < 40; x += 2) { g.boom(x, 0); g.boom(x, 24); }
for (let y = 2; y < 24; y += 2) {
  if (y !== 12) { g.boom(0, y); g.boom(38, y); }
}
// wit zand rond het meer
g.vul(g.grond, 2, 2, 37, 23, (x, y) => ((x * 7 + y * 3) % 5 === 0 ? 'S' : 's'));
g.vul(g.grond, 0, 12, 1, 13, 's');
g.vul(g.grond, 38, 12, 39, 13, 's');
// het meer
g.vul(g.grond, 11, 7, 28, 7, '^');
g.vul(g.grond, 11, 8, 28, 17, 'W');
g.vul(g.grond, 11, 18, 28, 18, 'v');
// steigers
g.vul(g.grond, 15, 7, 15, 9, '#');
g.vul(g.grond, 26, 12, 28, 12, '#');
g.vul(g.grond, 20, 16, 20, 18, '#');
// wat gras en struiken aan de randen
g.vul(g.grond, 2, 2, 7, 4, (x, y) => ((x + y) % 4 ? 'g' : 'b'));
g.vul(g.grond, 32, 20, 37, 23, (x, y) => ((x + y) % 4 ? 'g' : 'b'));
[[3, 3], [6, 2], [34, 22], [36, 20], [31, 3], [36, 4]].forEach(([x, y]) => { g.boven[y][x] = '*'; });

export const lagune = {
  id: 'lagune',
  naam: 'DRENTSE BLUE LAGOON',
  muziek: 'schlager',
  gevechtAchtergrond: 'bg_gevecht_strand',
  tegelset: 'buiten',
  legenda: LEGENDA,
  vast: VAST,
  rijen: g.rijen(),
  boven: g.bovenRijen(),
  objecten: [
    // het kampje van de Duitsers op verlof
    { type: 'parasol', x: 5, y: 9, script: 'parasol' },
    { type: 'bbq', x: 4, y: 11, script: 'bbq' },
    { type: 'koelbox', x: 8, y: 10, script: 'koelbox' },
    { type: 'handdoek', x: 6, y: 15, script: 'handdoek' },
    { type: 'handdoek', kleur: 'blauw', x: 8, y: 16, script: 'handdoek' },
    { type: 'parasol', kleur: 'blauw', x: 9, y: 18, script: 'parasol' },
    { type: 'flamingo', x: 17, y: 13, script: 'flamingo' },
    // visplekken
    { type: 'visbord', x: 14, y: 6, script: 'visbord' },
    { type: 'visbord', x: 29, y: 11, script: 'visbord' },
    { type: 'visbord', x: 21, y: 19, script: 'visbord' },
    { type: 'den', x: 33, y: 5 },
    { type: 'den', x: 3, y: 20 },
  ],
  npcs: [
    { id: 'heinz', sprite: 'mens_heinz', x: 6, y: 11, richting: 'rechts', script: 'heinz' },
    { id: 'rudiger', sprite: 'mens_rudiger', x: 6, y: 14, richting: 'omhoog', script: 'rudiger' },
    { id: 'karl', sprite: 'mens_karl', x: 9, y: 13, richting: 'links', script: 'karl', gedrag: 'draaien', richtingen: ['links', 'omlaag', 'rechts'] },
  ],
  warps: [
    { x: 0, y: 12, naar: 'landweg', nx: 38, ny: 6, richting: 'links' },
    { x: 0, y: 13, naar: 'landweg', nx: 38, ny: 7, richting: 'links' },
    { x: 39, y: 12, script: 'verder' },
    { x: 39, y: 13, script: 'verder' },
  ],
  interacties: [
    { x: 15, y: 10, script: 'visA' },
    { x: 25, y: 12, script: 'visB' },
    { x: 20, y: 15, script: 'visC' },
  ],
  start: { x: 1, y: 12, richting: 'rechts' },
};

// ================================================================== 3. het recreatiestrandje

const s = maker(40, 15);
s.vul(s.grond, 0, 0, 39, 3, 'W');
s.vul(s.grond, 0, 4, 39, 4, 'v');
s.vul(s.grond, 0, 5, 39, 11, (x, y) => ((x * 7 + y * 3) % 5 === 0 ? 'Y' : 'y'));
for (let x = 0; x < 40; x += 2) s.boom(x, 13);
[[3, 12], [9, 12], [17, 12], [25, 12], [30, 12], [36, 12]].forEach(([x, y]) => { s.boven[y][x] = '*'; });

export const strand = {
  id: 'strand',
  naam: 'RECREATIESTRANDJE',
  muziek: 'strand',
  gevechtAchtergrond: 'bg_gevecht_strand',
  tegelset: 'buiten',
  legenda: LEGENDA,
  vast: VAST,
  rijen: s.rijen(),
  boven: s.bovenRijen(),
  objecten: [
    { type: 'parasol', x: 6, y: 6, script: 'parasol' },
    { type: 'strandstoel', x: 7, y: 6, script: 'strandstoel' },
    { type: 'handdoek', x: 5, y: 8, script: 'handdoek' },
    { type: 'reddingstoren', x: 15, y: 5, script: 'reddingstoren' },
    { type: 'zandkasteel', x: 11, y: 9, script: 'zandkasteel' },
    { type: 'schep', x: 12, y: 9, script: 'schep' },
    { type: 'ijscokar', x: 21, y: 10, script: 'ijscokar' },
    { type: 'parasol', kleur: 'blauw', x: 27, y: 6, script: 'parasol' },
    { type: 'strandstoel', kleur: 'groen', x: 28, y: 6, script: 'strandstoel' },
    { type: 'handdoek', kleur: 'blauw', x: 26, y: 8, script: 'handdoek' },
  ],
  npcs: [
    { id: 'ijsman', sprite: 'mens_ijsman', x: 23, y: 10, richting: 'omlaag', script: 'ijsman' },
    { id: 'marga', sprite: 'mens_dorpsvrouw', x: 9, y: 7, richting: 'omlaag', script: 'marga' },
    { id: 'kees', sprite: 'mens_sporter', x: 18, y: 8, richting: 'links', script: 'strandkees', gedrag: 'zwerven', straal: 2 },
  ],
  warps: [
    ...[5, 6, 7, 8, 9, 10, 11].map((y) => ({ x: 0, y, naar: 'lagune', nx: 38, ny: y < 9 ? 12 : 13, richting: 'links' })),
    ...[5, 6, 7, 8, 9, 10, 11].map((y) => ({ x: 39, y, script: 'verder' })),
  ],
  interacties: [],
  start: { x: 1, y: 8, richting: 'rechts' },
};
