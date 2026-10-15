// Binnenkant van de plaggenhutten en de coffeeshop in Orvelte (tegelset dorp_binnen).

export const LEGENDA = {
  '.': 0, ',': 1, _: 2, W: 3, w: 4, r: 5, '[': 6, ']': 7, '=': 8, H: 9, D: 10,
  p: 11, q: 12, '~': 13, M: 14, m: 15, P: 16, B: 17, k: 18, d: 19,
};
export const VAST = [3, 4, 5, 6, 7, 8, 9, 14, 15, 16, 17];

const HUT = [
  'HWWWWWWWH',
  'HwwrwwrwH',
  '[_______]',
  '[.,..,..]',
  '[..,...,]',
  '[.,..,..]',
  'H===D===H',
];

/** Een plaggenhut van binnen. De deur (onderin) leidt terug naar het dorp. */
export function hut(id, naam, terug, extra) {
  return {
    id,
    naam,
    muziek: 'dorp',
    gevechtAchtergrond: 'bg_gevecht_dorp',
    tegelset: 'dorp_binnen',
    legenda: LEGENDA,
    vast: VAST,
    rijen: HUT,
    objecten: [
      { type: 'bedstee', x: 1, y: 2, script: 'bedstee' },
      { type: 'haard', x: 6, y: 2, script: 'haard' },
      { type: 'tafeltje', x: 2, y: 4, script: 'tafeltje' },
      ...(extra.objecten || []),
    ],
    npcs: extra.npcs || [],
    warps: [{ x: 4, y: 6, naar: 'dorp', nx: terug.x, ny: terug.y, richting: 'omlaag' }],
    interacties: [],
    start: { x: 4, y: 5, richting: 'omhoog' },
  };
}

export const coffeeshop = {
  id: 'coffeeshop',
  naam: 'DE ZWEVENDE KEI',
  muziek: 'reggae',
  gevechtAchtergrond: 'bg_gevecht_dorp',
  tegelset: 'dorp_binnen',
  legenda: LEGENDA,
  vast: VAST,
  rijen: [
    'HMMMMMMMMMMH',
    'HmPmmBmmPmmH',
    '[~~~~~~~~~~]',
    '[pqpkkkkpqp]',
    '[qpqkkkkqpq]',
    '[pqpkkkkpqp]',
    '[qpqpqpqpqp]',
    'H====d=====H',
  ],
  objecten: [
    { type: 'toonbank', x: 1, y: 3, script: 'bertus' },
    { type: 'plant', x: 5, y: 2, script: 'plant' },
    { type: 'bank', x: 7, y: 2, script: 'bank' },
    { type: 'plant', x: 10, y: 2, script: 'plant' },
    { type: 'asbak', x: 10, y: 4, script: 'asbak' },
    { type: 'boxen', x: 10, y: 6, script: 'boxen' },
    { type: 'plant', x: 1, y: 6, script: 'plant' },
  ],
  npcs: [
    { id: 'bertus', sprite: 'mens_budtender', x: 2, y: 2, richting: 'omlaag', script: 'bertus' },
    { id: 'karlheinz', sprite: 'mens_soldaat_muts', x: 8, y: 3, richting: 'omlaag', script: 'karlheinz' },
  ],
  warps: [{ x: 5, y: 7, naar: 'dorp', nx: 9, ny: 13, richting: 'omlaag' }],
  interacties: [
    { x: 2, y: 1, script: 'poster' }, { x: 8, y: 1, script: 'poster' }, { x: 5, y: 1, script: 'menubord' },
  ],
  start: { x: 5, y: 6, richting: 'omhoog' },
};

export const hut1 = hut('hut1', 'PLAGGENHUT', { x: 24, y: 12 }, {
  objecten: [{ type: 'spinnewiel', x: 7, y: 4, script: 'spinnewiel' }],
  npcs: [{ id: 'jantina', sprite: 'mens_oma', x: 5, y: 3, richting: 'omlaag', script: 'jantina' }],
});

export const hut2 = hut('hut2', 'PLAGGENHUT', { x: 15, y: 22 }, {
  objecten: [{ id: 'luik', type: 'luik', x: 6, y: 4, vlag: 'luikOpen', script: 'luik' }],
  npcs: [{ id: 'lammert', sprite: 'mens_opa', x: 3, y: 3, richting: 'omlaag', script: 'lammert' }],
});

export const hut3 = hut('hut3', 'PLAGGENHUT (AIRBNB)', { x: 20, y: 22 }, {
  objecten: [{ type: 'kruk', x: 5, y: 4 }],
  npcs: [{ id: 'daan', sprite: 'mens_dichter', x: 6, y: 4, richting: 'links', script: 'daan', gedrag: 'draaien', richtingen: ['links', 'omlaag'] }],
});
