// De Beren: in elk dorp een vestiging. Hier word je gratis opgelapt (gezondheid en PP),
// en kun je eten afhalen voor onderweg. Binnen ziet elke vestiging er hetzelfde uit; alleen de gasten verschillen.

const LEGENDA = {
  '[': 6, ']': 7, '=': 8, H: 9, d: 19,
  A: 31, a: 32, L: 33, M: 34, U: 35, o: 36, O: 37, _: 38,
};
const VAST = [6, 7, 8, 9, 31, 32, 33, 34, 35];

const RIJEN = [
  'HAAAAAAAAAAH',
  'HLMaaaUUaMLH',
  '[__________]',
  '[oOoOoOoOoO]',
  '[OoOoOoOoOo]',
  '[oOoOoOoOoO]',
  '[OoOoOoOoOo]',
  '[oOoOoOoOoO]',
  '[OoOoOoOoOo]',
  'H====d=====H',
];

/**
 * Een vestiging van De Beren.
 *   id: kaart-id, plaats: naam van het dorp, dorp: kaart van het dorp, terug: waar je buiten weer staat,
 *   gasten: extra npc's (met hun eigen scripts).
 */
function berenRestaurant(id, plaats, dorp, terug, gasten) {
  return {
    id,
    naam: `DE BEREN ${plaats.toUpperCase()}`,
    plaats,
    muziek: 'beren',
    gevechtAchtergrond: 'bg_gevecht_dorp',
    tegelset: 'dorp_binnen',
    legenda: LEGENDA,
    vast: VAST,
    rijen: RIJEN,
    objecten: [
      {
        type: 'beren_balie', x: 4, y: 3, script: 'gastvrouw',
        interacties: [{ dx: 2, dy: 0, script: 'kok' }, { dx: 3, dy: 0, script: 'kok' }],
      },
      // de plant en de houten beer sluiten de ruimte achter de balie af
      { type: 'beren_plant', x: 3, y: 2, script: 'plant' },
      { type: 'houten_beer', x: 8, y: 2, script: 'houtenBeer' },
      { type: 'beren_tafel', x: 1, y: 5, script: 'tafel' },
      { type: 'beren_tafel', kleur: 'groen', x: 9, y: 5, script: 'tafel' },
      { type: 'beren_tafel', kleur: 'groen', x: 1, y: 7, script: 'tafel' },
      { type: 'beren_tafel', x: 9, y: 7, script: 'tafel' },
    ],
    npcs: [
      { id: 'gastvrouw', sprite: 'mens_gastvrouw', x: 5, y: 2, richting: 'omlaag', script: 'gastvrouw' },
      { id: 'kok', sprite: 'mens_kok', x: 7, y: 2, richting: 'omlaag', script: 'kok' },
      ...gasten,
    ],
    warps: [{ x: 5, y: 9, naar: dorp, nx: terug.x, ny: terug.y, richting: 'omlaag' }],
    interacties: [
      { x: 1, y: 1, script: 'lijst' },
      { x: 10, y: 1, script: 'lijst' },
      { x: 2, y: 1, script: 'menu' },
      { x: 9, y: 1, script: 'menu' },
    ],
    start: { x: 5, y: 8, richting: 'omhoog' },
  };
}

export const berenOrvelte = berenRestaurant('beren_orvelte', 'Orvelte', 'dorp', { x: 35, y: 13 }, [
  { id: 'aaltje', sprite: 'mens_oma', x: 3, y: 5, richting: 'links', script: 'aaltje' },
  { id: 'gunther', sprite: 'mens_soldaat_muts', x: 8, y: 7, richting: 'rechts', script: 'gunther' },
]);

export const berenAalden = berenRestaurant('beren_aalden', 'Aalden', 'aalden', { x: 18, y: 14 }, [
  { id: 'roelie', sprite: 'mens_dorpsvrouw', x: 3, y: 5, richting: 'links', script: 'roelie' },
  { id: 'fritz', sprite: 'mens_soldaat_muts', x: 8, y: 7, richting: 'rechts', script: 'fritz' },
]);

export const berenWezup = berenRestaurant('beren_wezup', 'Wezup', 'wezup', { x: 26, y: 9 }, [
  { id: 'wiepke', sprite: 'mens_visser', x: 3, y: 7, richting: 'links', script: 'wiepke' },
  { id: 'otto', sprite: 'mens_soldaat_muts', x: 8, y: 5, richting: 'rechts', script: 'otto' },
]);
