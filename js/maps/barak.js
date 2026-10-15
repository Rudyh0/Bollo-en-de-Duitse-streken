// Barak 7 van Kamp Westerbork: het startpunt van het spel.
//
// Elke regel in `rijen` is één rij tegels. De tekens staan voor tegels uit
// assets/tiles/binnen.png (zie `legenda`). Objecten, personen en dingen waar je
// mee kunt praten of naar kunt kijken staan in de lijsten eronder.

export default {
  id: 'barak',
  naam: 'BARAK 7',
  muziek: 'barak',
  tegelset: 'binnen',
  legenda: {
    '.': 0, ',': 1, _: 2, ';': 3,
    w: 4, W: 5, r: 6, R: 7, d: 8, D: 9, p: 10,
    '[': 11, ']': 12, '=': 13, H: 14,
  },
  // tegels waar je niet doorheen kunt lopen
  vast: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  rijen: [
    'HwwrwwwwrwwwwwrwwwwdwH',
    'HWWRWWWWRWWpWWRWWWWDWH',
    '[__;___;__;___;__;___]',
    '[..,.....,......,....]',
    '[.....,.......,......]',
    '[...,......,....,....]',
    '[.,.......,.....,....]',
    '[....,.......,.....,.]',
    '[..,.....,.....,.....]',
    '[......,......,......]',
    'H====================H',
  ],
  objecten: [
    // stapelbedden tegen de achterwand
    { type: 'stapelbed', x: 1, y: 2, script: 'bed' },
    { type: 'stapelbed', x: 2, y: 2, variant: 'rood', script: 'eigenBed' },
    { type: 'stapelbed', x: 5, y: 2, script: 'bed' },
    { id: 'kistbed', type: 'stapelbed', x: 6, y: 2, script: 'kist' },
    { type: 'stapelbed', x: 12, y: 2, script: 'bed' },
    { type: 'stapelbed', x: 13, y: 2, script: 'bed' },
    { type: 'stapelbed', x: 16, y: 2, script: 'bed' },
    { type: 'stapelbed', x: 17, y: 2, script: 'bed' },
    // stapelbedden aan de voorkant
    { type: 'stapelbed', x: 1, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 2, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 5, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 6, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 9, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 10, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 13, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 14, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 17, y: 8, script: 'bed' },
    { type: 'stapelbed', x: 18, y: 8, script: 'bed' },
    // het kistje dat onder het bed uitsteekt
    { id: 'kist', type: 'kist', x: 6, y: 2, vlag: 'kistOpen' },
    // overige inrichting
    { type: 'tafel', x: 9, y: 5, script: 'tafel' },
    { type: 'kruk', x: 8, y: 5 },
    { type: 'kruk', x: 13, y: 5 },
    { type: 'kachel', x: 3, y: 5, script: 'kachel' },
    { type: 'emmer', x: 20, y: 9, script: 'emmer' },
  ],
  npcs: [
    { id: 'henk', sprite: 'henk', x: 3, y: 6, richting: 'omhoog', script: 'henk' },
    { id: 'fenna', sprite: 'fenna', x: 15, y: 6, richting: 'links', script: 'fenna' },
  ],
  interacties: [
    { x: 3, y: 1, script: 'raam1' },
    { x: 8, y: 1, script: 'raam2' },
    { x: 14, y: 1, script: 'raam3' },
    { x: 11, y: 1, script: 'prikbord' },
    { x: 19, y: 1, script: 'deur' },
  ],
  start: { x: 2, y: 4, richting: 'omlaag' },
};
