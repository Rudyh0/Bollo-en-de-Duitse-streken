// Bos, deel 3: de poel van Kikker. Hij verkoopt "energie".
import { bouwBos, BOS_LEGENDA, BOS_VAST } from './bosbouw.js';

const bos = bouwBos([
  'TTTTTTTTTTTT',
  'TTT,..,TTTTT',
  'TT,.rWwr.,TT',
  'TT..wwww..zz',
  'TT.,rwWr.,TT',
  'TTT...,..TTT',
  'TTTT...TTTTT',
  'TTTTT.TTTTTT',
  'TTTTT.TTTTTT',
]);

export default {
  id: 'bos3',
  naam: 'DE KIKKERPOEL',
  muziek: 'bos',
  gevechtAchtergrond: 'bg_gevecht_bos',
  tegelset: 'buiten',
  legenda: BOS_LEGENDA,
  vast: BOS_VAST,
  rijen: bos.rijen(),
  boven: bos.bovenRijen(),
  objecten: [
    { type: 'bord', x: 19, y: 8, script: 'bord' },
    { type: 'boomstronk', x: 5, y: 2, script: 'stronk' },
  ],
  npcs: [
    {
      id: 'kikker', sprite: 'kikker', x: 11, y: 10, richting: 'omlaag', script: 'kikker',
      zicht: 2, zichtVlag: 'kikkerGesproken', verbergVlag: 'kikkerWeg',
    },
  ],
  warps: [
    ...[10, 11].map((x) => ({ x, y: 17, naar: 'bos2', nx: x, ny: 1, richting: 'omlaag' })),
    ...[6, 7].map((y) => ({ x: 23, y, script: 'uitgang' })),
  ],
  interacties: [
    // de poel zelf
    ...[8, 9, 10, 11, 12, 13, 14, 15].flatMap((x) => [4, 5, 6, 7, 8, 9].map((y) => ({ x, y, script: 'poel' }))),
  ],
  start: { x: 10, y: 16, richting: 'omhoog' },
};
