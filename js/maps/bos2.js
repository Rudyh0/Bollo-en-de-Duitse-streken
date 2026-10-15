// Bos, deel 2: een Duitse patrouille die op zoek is naar ontsnapte Friezen.
// Elke soldaat kijkt dwars over het pad: je kunt ze niet ontlopen.
import { bouwBos, BOS_LEGENDA, BOS_VAST } from './bosbouw.js';

const bos = bouwBos([
  'TTTTT.TTTTTT',
  'TTTT..TTTTTT',
  'TTTT...,.TTT',
  'TTTTTTTT.TTT',
  'TTTTTT.T.TTT',
  'TT.......TTT',
  'TT.T.TTTTTTT',
  'TT.TTTTTTTTT',
  'TT..TTTTTTTT',
  'TT.TTTTTTTTT',
  'T,.TTTTTTTTT',
  'TT.TTTTTTTTT',
]);

export default {
  id: 'bos2',
  naam: 'DIEP IN HET BOS',
  muziek: 'bos',
  gevechtAchtergrond: 'bg_gevecht_bos',
  tegelset: 'buiten',
  legenda: BOS_LEGENDA,
  vast: BOS_VAST,
  rijen: bos.rijen(),
  boven: bos.bovenRijen(),
  objecten: [
    { type: 'bord', x: 3, y: 20, script: 'poster' },
    { type: 'bron', x: 8, y: 12, script: 'bron' },
    { type: 'boomstronk', x: 11, y: 2, script: 'stronk' },
  ],
  npcs: [
    {
      id: 'horst', sprite: 'mens_soldaat_bos', x: 6, y: 16, richting: 'links', script: 'horst',
      zicht: 3, verbergVlag: 'horstVerslagen',
    },
    {
      id: 'jurgen', sprite: 'mens_soldaat_muts', x: 12, y: 9, richting: 'omlaag', script: 'jurgen',
      zicht: 3, verbergVlag: 'jurgenVerslagen',
    },
    {
      id: 'uwe', sprite: 'mens_feldwebel', x: 10, y: 2, richting: 'omlaag', script: 'uwe',
      zicht: 4, verbergVlag: 'uweVerslagen',
    },
  ],
  warps: [
    ...[4, 5].map((x) => ({ x, y: 23, naar: 'bos1', nx: x + 14, ny: 1, richting: 'omlaag' })),
    ...[10, 11].map((x) => ({ x, y: 0, naar: 'bos3', nx: x, ny: 16, richting: 'omhoog' })),
  ],
  interacties: [],
  start: { x: 4, y: 22, richting: 'omhoog' },
};
