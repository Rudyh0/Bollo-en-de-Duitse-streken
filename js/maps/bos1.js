// Bos, deel 1: een rustig dennenbos met alleen een kist (met daarin de tweede aanval).
import { bouwBos, BOS_LEGENDA, BOS_VAST } from './bosbouw.js';

const bos = bouwBos([
  'TTTTTTTTT.TT',
  'TTTTTTTT,.TT',
  'TT,..TTTT.TT',
  'T,...,TTT..T',
  'T....TTTT.,T',
  'TT...TTT..TT',
  'TTT.TTTT.TTT',
  'TTT.....,TTT',
  'TTTTT..TTTTT',
  'TTTTT.TTTTTT',
]);

export default {
  id: 'bos1',
  naam: 'DENNENBOS',
  muziek: 'bos',
  gevechtAchtergrond: 'bg_gevecht_bos',
  tegelset: 'buiten',
  legenda: BOS_LEGENDA,
  vast: BOS_VAST,
  rijen: bos.rijen(),
  boven: bos.bovenRijen(),
  objecten: [
    { id: 'kist', type: 'schatkist', x: 6, y: 8, vlag: 'frikandelKist', script: 'kist' },
    { type: 'bord', x: 13, y: 16, script: 'bord' },
    { type: 'boomstronk', x: 5, y: 6, script: 'stronk' },
  ],
  npcs: [],
  warps: [
    ...[10, 11].map((x) => ({ x, y: 19, script: 'terug' })),
    ...[18, 19].map((x) => ({ x, y: 0, script: 'verder' })),
  ],
  interacties: [],
  start: { x: 10, y: 18, richting: 'omhoog' },
};
