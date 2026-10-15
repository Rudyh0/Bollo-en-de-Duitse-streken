// Het kampplein van Kamp Westerbork, met in het noorden de uitgang (nog binnen de hekken).
// De tegels worden hier met code opgebouwd: dat leest makkelijker dan 29 regels van 32 tekens.
import { rechthoekPad } from './pad.js';

const B = 32;
const H = 29;

const grond = Array.from({ length: H }, () => Array(B).fill('g'));
const boven = Array.from({ length: H }, () => Array(B).fill(' '));

function vul(raster, x1, y1, x2, y2, teken) {
  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      raster[y][x] = typeof teken === 'function' ? teken(x, y) : teken;
    }
  }
}

// gras met hier en daar bloemetjes
vul(grond, 0, 0, B - 1, H - 1, (x, y) => ((x * 13 + y * 7) % 11 === 0 ? 'b' : 'g'));
// buiten de hekken: heide
vul(grond, 0, 0, B - 1, H - 1, (x, y) => (y <= 1 || y >= 28 || x === 0 || x === B - 1 ? ((x + y) % 3 ? 'h' : 'H') : grond[y][x]));
// het plein (grind)
vul(grond, 2, 16, 29, 25, (x, y) => ((x * 7 + y * 3) % 5 === 0 ? ':' : '.'));
// zandpad naar de uitgang
vul(grond, 26, 3, 27, 15, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));
vul(grond, 25, 3, 28, 5, (x, y) => ((x + y) % 2 ? 'z' : 'Z'));
// buitenhek met poort (de poort zelf is een object)
vul(boven, 1, 2, 30, 2, '-');
vul(boven, 25, 2, 28, 2, ' ');
vul(boven, 1, 27, 30, 27, '-');
vul(boven, 1, 3, 1, 26, '|');
vul(boven, 30, 3, 30, 26, '|');
[[1, 2], [30, 2], [1, 27], [30, 27]].forEach(([x, y]) => { boven[y][x] = '+'; });
// binnenhek tussen plein en uitgang, met een doorgang
vul(boven, 2, 10, 29, 10, '-');
vul(boven, 26, 10, 27, 10, ' ');
// struiken
[[2, 11], [9, 11], [17, 11], [3, 8], [12, 6], [16, 7], [8, 4]].forEach(([x, y]) => { boven[y][x] = '*'; });

const rij = (r) => r.join('');

export default {
  id: 'plein',
  naam: 'KAMPPLEIN',
  muziek: 'plein',
  tegelset: 'buiten',
  legenda: {
    g: 0, b: 1, '.': 2, ':': 3, z: 4, h: 5, '-': 6, '|': 7, '+': 8, '*': 9, H: 10, Z: 11,
  },
  vast: [5, 6, 7, 8, 9, 10],
  rijen: grond.map(rij),
  boven: boven.map(rij),
  objecten: [
    // uitgang
    { id: 'poort', type: 'poort', x: 25, y: 2, openVlag: 'poortOpen' },
    { type: 'wachttoren', x: 2, y: 4, script: 'wachttoren' },
    { type: 'wachthuisje', x: 21, y: 4, script: 'wachthuisje' },
    { type: 'bord', x: 25, y: 11, script: 'bord' },
    // barakken
    { type: 'barak', nummer: 5, x: 2, y: 12, interacties: [{ dx: 3, dy: 3, script: 'barak5' }] },
    { type: 'barak', nummer: 6, x: 10, y: 12, interacties: [{ dx: 3, dy: 3, script: 'barak6' }] },
    { id: 'barak7', type: 'barak', nummer: 7, openVlag: 'deurOpen', x: 18, y: 12, interacties: [{ dx: 3, dy: 3, script: 'barak7' }] },
    // plein
    { type: 'keuken', x: 3, y: 22, script: 'keuken' },
    { type: 'waterpomp', x: 15, y: 20, script: 'pomp' },
    { type: 'lantaarn', x: 12, y: 17 },
    { type: 'lantaarn', x: 24, y: 25 },
    { type: 'bankje', x: 18, y: 24, script: 'bankje' },
    { type: 'kisten', x: 28, y: 16, script: 'kisten' },
    { type: 'kisten', x: 28, y: 17, script: 'kisten' },
    { type: 'wachttoren', x: 28, y: 25, script: 'wachttoren' },
    // bomen buiten het hek
    ...[3, 8, 13, 18, 29].map((x) => ({ type: 'den', x, y: 1 })),
    ...[4, 10, 16, 22, 27].map((x) => ({ type: 'den', x, y: 28 })),
  ],
  npcs: [
    // de twee wachters bij de poort: ze zien je aankomen
    {
      id: 'klaus', sprite: 'mens_wachter', x: 26, y: 3, richting: 'omlaag', script: 'klaus',
      zicht: 4, zichtVlag: 'klausVerslagen', plekNaVlag: { vlag: 'klausVerslagen', x: 24, y: 3, richting: 'rechts' },
    },
    {
      id: 'dieter', sprite: 'mens_wachter_pet', x: 27, y: 3, richting: 'omlaag', script: 'dieter',
      zicht: 4, zichtVlag: 'dieterVerslagen', plekNaVlag: { vlag: 'dieterVerslagen', x: 29, y: 3, richting: 'links' },
    },
    { id: 'slaper', sprite: 'mens_wachter', x: 28, y: 11, richting: 'links', script: 'slaper' },
    // vrij rondlopende gevangenen
    { id: 'oma', sprite: 'mens_oma', x: 14, y: 23, richting: 'omlaag', script: 'oma', gedrag: 'zwerven', straal: 2 },
    { id: 'boer', sprite: 'mens_boer', x: 15, y: 17, richting: 'omlaag', script: 'boer', gedrag: 'zwerven', straal: 1 },
    { id: 'sporter', sprite: 'mens_sporter', x: 22, y: 19, richting: 'omlaag', script: 'sporter', gedrag: 'draaien' },
    { id: 'dichter', sprite: 'mens_dichter', x: 11, y: 24, richting: 'omhoog', script: 'dichter' },
    { id: 'kokkin', sprite: 'mens_kokkin', x: 9, y: 24, richting: 'links', script: 'kokkin' },
  ],
  // geketende gevangenen met een wachter voorop
  stoeten: [
    {
      id: 'stoetA',
      pad: rechthoekPad(3, 17, 11, 20),
      start: 3,
      leden: [
        { id: 'fritz', sprite: 'mens_wachter_pet', script: 'fritz' },
        { id: 'kees', sprite: 'mens_gevangene_a', script: 'kees' },
        { id: 'ria', sprite: 'mens_gevangene_b', script: 'ria' },
        { id: 'jan', sprite: 'mens_gevangene_c', script: 'jan' },
      ],
    },
    {
      id: 'stoetB',
      pad: rechthoekPad(18, 17, 27, 21),
      start: 5,
      pauze: 400,
      leden: [
        { id: 'gunther', sprite: 'mens_wachter', script: 'gunther' },
        { id: 'piet', sprite: 'mens_gevangene_d', script: 'piet' },
        { id: 'bram', sprite: 'mens_gevangene_a', script: 'bram' },
      ],
    },
  ],
  warps: [
    { x: 21, y: 15, naar: 'barak', nx: 19, ny: 2, richting: 'omlaag' },
    ...[25, 26, 27, 28].map((x) => ({ x, y: 2, vlag: 'poortOpen', script: 'poortUit' })),
  ],
  interacties: [],
  start: { x: 21, y: 16, richting: 'omlaag' },
};
