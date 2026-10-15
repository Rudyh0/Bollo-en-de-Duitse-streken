// Het vakantiepark: eerst de parkeerplaats (vol Duitsers die heel erg zin hebben in hun vakantie),
// dan de ingang met de slagboom en de receptie. Op beide kaarten mag je rijden.

const LEGENDA = {
  g: 0, b: 1, '*': 9, 1: 12, 2: 13, 3: 14, 4: 15, w: 18, k: 23, K: 24, f: 25, s: 29,
  a: 53, l: 54, L: 55, '^': 56, m: 57,
};
const VAST = [9, 12, 13, 14, 15, 18, 25];

function maker(B, H) {
  const grond = Array.from({ length: H }, () => Array(B).fill('g'));
  const boven = Array.from({ length: H }, () => Array(B).fill(' '));
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

// ================================================================== 1. de parkeerplaats

const P = maker(36, 24);
// asfalt, met de oprijlaan in het midden (x 16..19) van onder naar boven
P.vul(P.grond, 3, 3, 32, 16, 'a');
P.vul(P.grond, 16, 0, 19, 23, 'a');
// parkeervakken: blok A (rij 3-4), B en C rug aan rug (rij 7-10), D (rij 13-14)
const vakken = (y1, y2, achterlijnRij) => {
  for (const [x1, x2] of [[3, 14], [20, 31]]) {
    P.vul(P.grond, x1, y1, x2, y2, (x, y) => {
      const lijn = (x - x1) % 2 === 0;
      if (y === achterlijnRij) return lijn ? 'L' : 'm';
      return lijn ? 'l' : 'a';
    });
  }
};
vakken(3, 4, null);
vakken(7, 8, 8);
vakken(9, 10, null);
vakken(13, 14, null);
// pijlen op de oprijlaan
[[17, 12], [18, 6], [17, 19]].forEach(([x, y]) => { P.grond[y][x] = '^'; });
// stoep onderaan, met caravans en Duitsers
P.vul(P.grond, 3, 17, 32, 18, 's');
P.vul(P.grond, 16, 17, 19, 18, 'a');
// bomen en heggen rondom
for (let x = 0; x < 36; x += 2) {
  if (x !== 16 && x !== 18) P.boom(x, 0);
}
P.vul(P.boven, 2, 2, 15, 2, '*');
P.vul(P.boven, 20, 2, 33, 2, '*');
for (let y = 2; y < 22; y += 2) { P.boom(0, y); P.boom(34, y); }
P.vul(P.boven, 2, 19, 15, 19, (x) => (x % 3 === 0 ? 'f' : '*'));
P.vul(P.boven, 20, 19, 33, 19, (x) => (x % 3 === 0 ? 'f' : '*'));
for (let x = 0; x < 36; x += 2) {
  if (x !== 16 && x !== 18) P.boom(x, 22);
}
P.vul(P.boven, 2, 20, 15, 21, (x, y) => ((x + y) % 4 === 0 ? '*' : ' '));
P.vul(P.boven, 20, 20, 33, 21, (x, y) => ((x + y) % 4 === 0 ? '*' : ' '));

// geparkeerde auto's: [x, y, richting]; elke auto is mee te nemen (na Levi)
const KLEUREN = ['rood', 'blauw', 'zilver', 'geel', 'zwart', 'groen', 'wit'];
const PLEKKEN = [
  // blok A, neus naar beneden
  [3, 4, 'omlaag'], [7, 4, 'omlaag'], [9, 4, 'omlaag'], [13, 4, 'omlaag'], [20, 4, 'omlaag'], [24, 4, 'omlaag'], [26, 4, 'omlaag'], [30, 4, 'omlaag'],
  // blok B, neus naar boven
  [5, 7, 'omhoog'], [9, 7, 'omhoog'], [11, 7, 'omhoog'], [22, 7, 'omhoog'], [28, 7, 'omhoog'],
  // blok C, neus naar beneden
  [3, 10, 'omlaag'], [7, 10, 'omlaag'], [13, 10, 'omlaag'], [20, 10, 'omlaag'], [22, 10, 'omlaag'], [26, 10, 'omlaag'], [30, 10, 'omlaag'],
  // blok D, neus naar boven
  [5, 13, 'omhoog'], [7, 13, 'omhoog'], [11, 13, 'omhoog'], [24, 13, 'omhoog'], [26, 13, 'omhoog'], [30, 13, 'omhoog'],
];
const AUTOS = PLEKKEN.map(([x, y, richting], i) => ({
  id: `auto${i + 1}`, type: 'geparkeerd', kleur: KLEUREN[(i * 3) % KLEUREN.length], x, y, richting,
  script: 'auto', verbergVlag: `autoWeg_auto${i + 1}`,
}));

export const parkeerplaats = {
  id: 'parkeerplaats',
  naam: 'PARKEERPLAATS',
  muziek: 'schlager',
  gevechtAchtergrond: 'bg_gevecht_weg',
  tegelset: 'buiten',
  autos: true,
  legenda: LEGENDA,
  vast: VAST,
  rijen: P.rijen(),
  boven: P.bovenRijen(),
  objecten: [
    ...AUTOS,
    // het kistje, in een leeg vak in blok D
    { id: 'parkKist', type: 'schatkist', x: 9, y: 13, vlag: 'parkKist', script: 'kist' },
    // caravans en koffers langs de stoep
    { type: 'caravan', x: 4, y: 17, script: 'caravan' },
    { type: 'caravan', x: 26, y: 17, script: 'caravan' },
    { type: 'koffers', x: 9, y: 17, script: 'koffers' },
    { type: 'koffers', x: 13, y: 18, script: 'koffers' },
    { type: 'koffers', x: 22, y: 18, script: 'koffers' },
    { type: 'koffers', x: 15, y: 5, script: 'koffers' },
    { type: 'parkeerbord', x: 15, y: 20, script: 'pBord' },
    { type: 'parkeerautomaat', x: 21, y: 20, script: 'automaat' },
  ],
  npcs: [
    { id: 'heinz', sprite: 'mens_heinz', x: 8, y: 18, richting: 'omhoog', script: 'heinz' },
    { id: 'rudiger', sprite: 'mens_rudiger', x: 10, y: 18, richting: 'links', script: 'rudiger' },
    { id: 'karl', sprite: 'mens_karl', x: 3, y: 18, richting: 'rechts', script: 'karl' },
    { id: 'gisela', sprite: 'mens_kassiere', x: 23, y: 18, richting: 'links', script: 'gisela', gedrag: 'draaien', richtingen: ['links', 'omlaag', 'rechts'] },
    { id: 'jurgen', sprite: 'mens_toerist', x: 30, y: 17, richting: 'links', script: 'jurgen' },
    { id: 'dieter', sprite: 'mens_soldaat_muts', x: 12, y: 6, richting: 'omlaag', script: 'dieter' },
    { id: 'helga', sprite: 'mens_oma', x: 25, y: 6, richting: 'omlaag', script: 'helga' },
    { id: 'uwe', sprite: 'mens_sporter', x: 27, y: 15, richting: 'links', script: 'uwe', gedrag: 'zwerven', straal: 2 },
  ],
  warps: [
    // naar de ingang van het park
    ...[16, 17, 18, 19].map((x) => ({ x, y: 0, script: 'naarPark' })),
    // terug naar Aalden
    ...[16, 17, 18, 19].map((x) => ({ x, y: 23, script: 'terug' })),
  ],
  interacties: [],
  start: { x: 17, y: 21, richting: 'omhoog' },
};

// ================================================================== 2. de ingang van het park

const I = maker(30, 26);
// de weg van de parkeerplaats naar de receptie
I.vul(I.grond, 14, 10, 15, 25, 'a');
I.grond[21][14] = '^';
I.grond[13][15] = '^';
// het plein voor de receptie
I.vul(I.grond, 6, 5, 23, 9, (x, y) => ((x + y) % 4 ? 'k' : 'K'));
// bomen rondom
for (let x = 0; x < 30; x += 2) I.boom(x, 0);
for (let y = 2; y < 24; y += 2) { I.boom(0, y); I.boom(28, y); }
for (let x = 0; x < 30; x += 2) {
  if (x !== 14) I.boom(x, 24);
}
// struiken, bloemperken en de struik waar de kaart in ligt
[[5, 18], [6, 18], [7, 18], [5, 19], [5, 20], [6, 20], [3, 15], [9, 21], [22, 16], [24, 20], [20, 22], [11, 18]]
  .forEach(([x, y]) => { I.boven[y][x] = '*'; });
[[8, 16], [10, 15], [19, 15], [21, 19], [12, 22], [17, 22], [7, 10], [3, 22], [26, 17]]
  .forEach(([x, y]) => { I.boven[y][x] = 'f'; });
// een vijvertje
I.vul(I.grond, 22, 13, 25, 14, 'w');

export const parkingang = {
  id: 'parkingang',
  naam: 'INGANG VAKANTIEPARK',
  muziek: 'park',
  gevechtAchtergrond: 'bg_gevecht_weg',
  tegelset: 'buiten',
  autos: true,
  legenda: LEGENDA,
  vast: VAST,
  rijen: I.rijen(),
  boven: I.bovenRijen(),
  objecten: [
    { type: 'receptie', x: 11, y: 3, script: 'receptieGevel' },
    { type: 'parkvlag', x: 8, y: 4, script: 'vlag' },
    { type: 'parkvlag', x: 20, y: 4, script: 'vlag' },
    { type: 'bungalow', x: 3, y: 7, script: 'bungalow' },
    { type: 'bungalow', kleur: 'groen', x: 24, y: 7, script: 'bungalow' },
    { type: 'bungalow', kleur: 'groen', x: 3, y: 11, script: 'bungalow' },
    { type: 'bungalow', x: 24, y: 11, script: 'bungalow' },
    { type: 'wegwijzer', x: 21, y: 12, script: 'wegwijzer' },
    { id: 'poortboog', type: 'poortboog', x: 11, y: 12, script: 'boog' },
    { id: 'slagboomPark', type: 'slagboom', x: 13, y: 15, openVlag: 'parkSlagboomOpen', script: 'slagboom' },
    { id: 'kaartlezer', type: 'kaartlezer', x: 13, y: 16, openVlag: 'parkSlagboomOpen', script: 'kaartlezer' },
    { type: 'parkhuisje', x: 16, y: 14, script: 'huisje' },
    { type: 'remsporen', x: 13, y: 16 },
    { id: 'kaart', type: 'slagboomkaart', x: 6, y: 19, script: 'kaart', verbergVlag: 'kaartGevonden' },
  ],
  npcs: [
    { id: 'jochem', sprite: 'mens_medewerker', x: 16, y: 16, richting: 'links', script: 'jochem' },
    { id: 'selfie', sprite: 'mens_toerist', x: 10, y: 13, richting: 'omhoog', script: 'selfie' },
    { id: 'tuinman', sprite: 'mens_boer', x: 20, y: 18, richting: 'omlaag', script: 'tuinman', gedrag: 'zwerven', straal: 2 },
  ],
  warps: [
    { x: 14, y: 25, naar: 'parkeerplaats', nx: 17, ny: 1, richting: 'omlaag' },
    { x: 15, y: 25, naar: 'parkeerplaats', nx: 18, ny: 1, richting: 'omlaag' },
    { x: 14, y: 4, script: 'receptie' },
  ],
  interacties: [],
  start: { x: 14, y: 24, richting: 'omhoog' },
};
