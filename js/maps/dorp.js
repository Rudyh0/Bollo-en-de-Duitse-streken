// Orvelte: een typisch Drents dorpje met een molen, hunebedden, plaggenhutten en een coffeeshop.
// Bij de in- en uitgang hangt de vlag van de bezetter. De uitgang (noordoosten) is een slagboom.
// De tegels worden met code opgebouwd, net als bij het kampplein.

const B = 44;
const H = 28;

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

/** Boom van 2x2 tegels (linksboven op x, y). */
function boom(x, y) {
  if (x < 0 || y < 0 || x + 1 >= B || y + 1 >= H) return;
  boven[y][x] = '1';
  boven[y][x + 1] = '2';
  boven[y + 1][x] = '3';
  boven[y + 1][x + 1] = '4';
}

// gras met bloemetjes
vul(grond, 0, 0, B - 1, H - 1, (x, y) => ((x * 13 + y * 7) % 11 === 0 ? 'b' : 'g'));
// heide met de hunebedden (zuidoosten)
vul(grond, 25, 18, 37, 25, (x, y) => ((x + y) % 3 ? 'h' : 'H'));
// hoofdstraat (klinkers) en de weg naar de uitgang
vul(grond, 0, 14, 40, 15, (x, y) => ((x + y) % 4 ? 'k' : 'K'));
vul(grond, 39, 0, 40, 15, (x, y) => ((x + y) % 4 ? 'k' : 'K'));
// stoepen langs de straat
vul(grond, 4, 13, 37, 13, 's');
vul(grond, 4, 16, 37, 16, 's');
// zandpaadjes naar de molen, plaggenhut 1, de hutten aan de zuidkant en de hunebedden
vul(grond, 30, 8, 30, 12, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));
vul(grond, 24, 12, 24, 12, 'z');
vul(grond, 17, 17, 17, 23, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));
vul(grond, 15, 22, 20, 23, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));
vul(grond, 26, 17, 26, 19, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));

// bomen rondom
for (let x = 0; x < 38; x += 2) boom(x, 0);
for (let y = 2; y < 13; y += 2) boom(0, y);
for (let y = 16; y < 26; y += 2) boom(0, y);
for (let x = 0; x < B; x += 2) boom(x, 26);
for (let y = 0; y < 26; y += 2) boom(42, y);
// het noorden zit dicht, behalve de weg door de slagboom
vul(boven, 38, 0, 38, 2, '*');
vul(boven, 41, 0, 41, 3, '*');
vul(boven, 36, 2, 37, 3, '*');
vul(boven, 41, 5, 41, 12, '|');
boven[13][41] = '+';
// een paar bomen in het dorp
boom(2, 3);
boom(12, 3);
boom(20, 4);
boom(36, 20);
boom(38, 23);
boom(12, 23);
// struiken en bloemperken
[[13, 12], [22, 12], [26, 12], [3, 9], [9, 4], [16, 5], [25, 4], [33, 3]].forEach(([x, y]) => { boven[y][x] = '*'; });
[[23, 12], [25, 12], [7, 17], [11, 21], [13, 17], [19, 17]].forEach(([x, y]) => { boven[y][x] = 'f'; });
// hekje rond de brink
vul(boven, 3, 24, 11, 24, '-');
boven[24][3] = '+';
boven[24][11] = '+';

const rij = (r) => r.join('');

export default {
  id: 'dorp',
  naam: 'ORVELTE',
  muziek: 'dorp',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'buiten',
  legenda: {
    g: 0, b: 1, z: 4, Z: 11, h: 5, H: 10, '*': 9,
    1: 12, 2: 13, 3: 14, 4: 15, k: 23, K: 24, f: 25, '-': 26, '|': 27, '+': 28, s: 29,
  },
  vast: [9, 12, 13, 14, 15, 25, 26, 27, 28],
  rijen: grond.map(rij),
  boven: boven.map(rij),
  objecten: [
    // vlaggen bij de ingang en de uitgang
    { type: 'vlag', x: 2, y: 12, script: 'vlag' },
    { type: 'vlag', x: 37, y: 4, script: 'vlag' },
    { type: 'bord', x: 3, y: 17, script: 'bordDorp' },
    // de coffeeshop met de jongens en hun fatbikes ervoor
    { type: 'coffeeshop', x: 6, y: 10, script: 'coffeeshopMuur', interacties: [{ dx: 3, dy: 2, script: 'coffeeshopDeur' }] },
    { id: 'fatbikeDjelano', type: 'fatbike', x: 6, y: 13, script: 'fatbike', verbergVlag: 'jongensWeg' },
    { id: 'fatbikeMustafah', type: 'fatbike', x: 11, y: 13, script: 'fatbike', verbergVlag: 'jongensWeg' },
    // boerderij, plaggenhut, molen
    { type: 'boerderij', x: 14, y: 9, script: 'boerderij' },
    { type: 'plaggenhut', x: 23, y: 10, script: 'hutMuur' },
    { id: 'molen', type: 'molen', x: 29, y: 6, script: 'molen', interacties: [{ dx: 1, dy: 1, script: 'molenDeur' }] },
    { type: 'meelzakken', x: 32, y: 7, script: 'meelzakken' },
    // De Beren
    { type: 'restaurant_beren', x: 33, y: 11, script: 'berenGevel' },
    // de brink
    { type: 'eik', x: 4, y: 18, script: 'eik' },
    { type: 'eik', x: 9, y: 22, script: 'eik' },
    { type: 'bankje', x: 6, y: 20, script: 'bankje' },
    { type: 'waterpomp', x: 10, y: 18, script: 'pomp' },
    { type: 'lantaarn', x: 8, y: 17 },
    { type: 'lantaarn', x: 14, y: 13 },
    { type: 'lantaarn', x: 28, y: 13 },
    // plaggenhutten aan de zuidkant
    { type: 'plaggenhut', x: 14, y: 20, script: 'hutMuur' },
    { type: 'plaggenhut', x: 19, y: 20, script: 'hutMuur' },
    // hunebedden op de heide
    { type: 'hunebed', x: 27, y: 20, script: 'hunebedA' },
    { type: 'hunebed', x: 32, y: 23, script: 'hunebedB' },
    { type: 'bord', x: 25, y: 19, script: 'bordHunebed' },
    // de slagboom bij de uitgang
    { id: 'slagboom', type: 'slagboom', x: 38, y: 3, openVlag: 'slagboomOpen', script: 'slagboom' },
  ],
  npcs: [
    { id: 'rudi', sprite: 'mens_wachter', x: 4, y: 12, richting: 'omlaag', script: 'rudi', gedrag: 'draaien', richtingen: ['omlaag', 'rechts', 'links'] },
    { id: 'djelano', sprite: 'mens_djelano', x: 8, y: 13, richting: 'omlaag', script: 'jongens', verbergVlag: 'jongensWeg' },
    { id: 'mustafah', sprite: 'mens_mustafah', x: 10, y: 13, richting: 'omlaag', script: 'jongens', verbergVlag: 'jongensWeg' },
    { id: 'albertus', sprite: 'mens_boer', x: 20, y: 12, richting: 'omlaag', script: 'albertus' },
    { id: 'harm', sprite: 'mens_molenaar', x: 31, y: 9, richting: 'omlaag', script: 'harm', gedrag: 'zwerven', straal: 1 },
    { id: 'roelof', sprite: 'mens_opa', x: 7, y: 21, richting: 'omlaag', script: 'roelof' },
    { id: 'geesje', sprite: 'mens_dorpsvrouw', x: 21, y: 16, richting: 'links', script: 'geesje', gedrag: 'zwerven', straal: 3 },
    { id: 'ingrid', sprite: 'mens_toerist', x: 29, y: 22, richting: 'omhoog', script: 'ingrid', gedrag: 'draaien', richtingen: ['omhoog', 'links', 'omhoog'] },
    {
      id: 'wolfgang', sprite: 'mens_grenswacht', x: 41, y: 4, richting: 'links', script: 'wolfgang',
      zicht: 2, zichtVlag: 'dorpQuest', verbergVlag: 'dorpKlaar',
    },
  ],
  warps: [
    // terug het bos in
    { x: 0, y: 14, naar: 'bos3', nx: 22, ny: 6, richting: 'links' },
    { x: 0, y: 15, naar: 'bos3', nx: 22, ny: 7, richting: 'links' },
    // deuren
    { x: 9, y: 12, naar: 'coffeeshop', nx: 5, ny: 6, richting: 'omhoog' },
    { x: 24, y: 11, naar: 'hut1', nx: 4, ny: 5, richting: 'omhoog' },
    { x: 15, y: 21, naar: 'hut2', nx: 4, ny: 5, richting: 'omhoog' },
    { x: 20, y: 21, naar: 'hut3', nx: 4, ny: 5, richting: 'omhoog' },
    { x: 35, y: 12, naar: 'beren_orvelte', nx: 5, ny: 8, richting: 'omhoog' },
    // de uitgang achter de slagboom
    { x: 39, y: 0, script: 'uitgang' },
    { x: 40, y: 0, script: 'uitgang' },
  ],
  interacties: [],
  start: { x: 1, y: 14, richting: 'rechts' },
};
