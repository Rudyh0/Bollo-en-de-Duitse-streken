// De finale: de receptie (met de directeur), de straat met vakantiehuisjes en huisje 7 (beneden en boven).

// ================================================================== de receptie van binnen

const BINNEN = {
  '[': 6, ']': 7, '=': 8, H: 9, d: 19, t: 20, T: 21, '-': 22, M: 23, m: 24, P: 25,
  W: 27, w: 28, Z: 29, z: 30, p: 11, q: 12, _: 13,
};
const BINNEN_VAST = [6, 7, 8, 9, 23, 24, 25, 27, 28, 29, 30];

export const receptieBinnen = {
  id: 'receptie_binnen',
  naam: 'RECEPTIE',
  muziek: 'beren',
  gevechtAchtergrond: 'bg_gevecht_winkel',
  tegelset: 'dorp_binnen',
  legenda: BINNEN,
  vast: BINNEN_VAST,
  rijen: [
    'HMMMMMMMMMMH',
    'HmmPmmmmmPmH',
    '[----------]',
    '[tTtTtTtTtT]',
    '[TtTtTtTtTt]',
    '[tTtTtTtTtT]',
    '[TtTtTtTtTt]',
    '[tTtTtTtTtT]',
    'H====d=====H',
  ],
  objecten: [
    { type: 'receptiebalie', x: 3, y: 3, script: 'balie' },
    { type: 'folderrek', x: 1, y: 2, script: 'folders' },
    { type: 'bouwtekening', x: 9, y: 2, script: 'bouwtekening' },
    { type: 'geldkoffer', x: 8, y: 4, script: 'geldkoffer', verbergVlag: 'directeurVerslagen' },
    { type: 'beren_plant', x: 1, y: 6, script: 'plant' },
    { type: 'beren_plant', x: 10, y: 6, script: 'plant' },
  ],
  npcs: [
    {
      id: 'directeur', sprite: 'mens_directeur', x: 5, y: 4, richting: 'omlaag', script: 'directeur',
      zicht: 2, zichtVlag: 'directeurVerslagen', verbergVlag: 'directeurVerslagen',
    },
  ],
  warps: [{ x: 5, y: 8, naar: 'parkingang', nx: 14, ny: 5, richting: 'omlaag' }],
  interacties: [],
  start: { x: 5, y: 7, richting: 'omhoog' },
};

// ================================================================== de straat met vakantiehuisjes

const LEGENDA = {
  g: 0, b: 1, '*': 9, 1: 12, 2: 13, 3: 14, 4: 15, w: 18, f: 25, s: 29, a: 53,
};
const VAST = [9, 12, 13, 14, 15, 18, 25];

const B = 34;
const H = 16;
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
vul(grond, 0, 8, B - 3, 8, 's');
vul(grond, 0, 9, B - 3, 10, 'a');
vul(grond, 0, 11, B - 3, 11, 's');
vul(grond, 14, 12, 18, 13, 'w');
for (let x = 0; x < B; x += 2) { boom(x, 0); boom(x, 14); }
for (let y = 2; y < 14; y += 2) boom(32, y);
[[1, 12], [2, 12], [4, 13], [7, 12], [9, 13], [11, 12], [20, 12], [22, 13], [24, 12], [27, 13], [29, 12]]
  .forEach(([x, y]) => { boven[y][x] = '*'; });
[[3, 12], [8, 12], [12, 13], [21, 12], [26, 12], [30, 13]].forEach(([x, y]) => { boven[y][x] = 'f'; });

// huisjes: [type, kleur, x, nummer]
export const HUIZEN = [
  ['bungalow', null, 1, '5'],
  ['bungalow', 'groen', 5, '6'],
  ['villa', null, 9, '7'],
  ['bungalow', null, 14, '8'],
  ['bungalow', 'groen', 18, '12'],
  ['bungalow', null, 23, '37'],
  ['bungalow', 'groen', 27, '9'],
];

export const vakantiestraat = {
  id: 'vakantiestraat',
  naam: 'DE VAKANTIEHUISJES',
  muziek: 'park',
  gevechtAchtergrond: 'bg_gevecht_weg',
  tegelset: 'buiten',
  autos: true,
  legenda: LEGENDA,
  vast: VAST,
  rijen: grond.map((r) => r.join('')),
  boven: boven.map((r) => r.join('')),
  objecten: [
    ...HUIZEN.map(([type, kleur, x, nummer]) => ({
      type, kleur, x, y: 6, nummer, script: nummer === '7' ? 'huisje7' : 'huisje',
    })),
    { type: 'bbq', x: 21, y: 8, script: 'bbq' },
    { type: 'audi_crash', x: 15, y: 12, script: 'audi' },
    { type: 'lantaarn', x: 4, y: 11 },
    { type: 'lantaarn', x: 19, y: 11 },
    { type: 'lantaarn', x: 28, y: 11 },
  ],
  npcs: [
    { id: 'levi', sprite: 'mens_levi', x: 17, y: 11, richting: 'links', script: 'levi' },
  ],
  warps: [
    { x: 0, y: 9, naar: 'parkingang', nx: 28, ny: 9, richting: 'links' },
    { x: 0, y: 10, naar: 'parkingang', nx: 28, ny: 10, richting: 'links' },
    { x: 11, y: 7, script: 'voordeur' },
  ],
  interacties: [],
  start: { x: 1, y: 9, richting: 'rechts' },
};

// ================================================================== huisje 7: beneden

export const huisjeBeneden = {
  id: 'huisje_beneden',
  naam: 'HUISJE 7',
  muziek: 'huisje',
  gevechtAchtergrond: 'bg_gevecht_winkel',
  tegelset: 'dorp_binnen',
  legenda: BINNEN,
  vast: BINNEN_VAST,
  rijen: [
    'HWWWWWWWWWWWWH',
    'HwwwwwwwwwwwwH',
    '[____________]',
    '[pqpqpqpqpqpq]',
    '[qpqpqpqpqpqp]',
    '[pqpqpqpqpqpq]',
    '[qpqpqpqpqpqp]',
    '[pqpqpqpqpqpq]',
    '[qpqpqpqpqpqp]',
    '[pqpqpqpqpqpq]',
    'H=====d======H',
  ],
  objecten: [
    {
      type: 'hoekbank', x: 1, y: 2,
      // de chaise longue onder Rudy: wie daar tegenaan praat, praat met Rudy
      interacties: [{ dx: 6, dy: 2, script: 'rudy' }, { dx: 7, dy: 2, script: 'bank' }, { dx: 7, dy: 1, script: 'rudy' },
        { dx: 6, dy: 3, script: 'bank' }, { dx: 7, dy: 3, script: 'bank' }],
    },
    { type: 'salontafel', x: 2, y: 5, script: 'tafel' },
    { type: 'projectiescherm', x: 10, y: 2, script: 'scherm' },
    { type: 'hobbelpaard', x: 9, y: 4, script: 'hobbelpaard' },
    { type: 'koelkast', x: 9, y: 2, script: 'koelkast' },
    // de trap: je loopt er onderaan van links op (de leuning stopt een tegel eerder)
    { type: 'trap', x: 11, y: 6, lengte: 3 },
    { type: 'beren_plant', x: 1, y: 9, script: 'plant' },
  ],
  npcs: [
    { id: 'jesse', sprite: 'mens_zit_jesse', x: 1, y: 3, richting: 'omlaag', script: 'jesse' },
    { id: 'devona', sprite: 'mens_zit_devona', x: 2, y: 3, richting: 'omlaag', script: 'devona' },
    { id: 'dewi', sprite: 'mens_zit_dewi', x: 3, y: 3, richting: 'omlaag', script: 'dewi' },
    { id: 'femke', sprite: 'mens_zit_femke', x: 4, y: 3, richting: 'omlaag', script: 'femke' },
    { id: 'frank', sprite: 'mens_zit_frank', x: 5, y: 3, richting: 'omlaag', script: 'frank' },
    { id: 'mathijs', sprite: 'mens_zit_mathijs', x: 6, y: 3, richting: 'omlaag', script: 'mathijs' },
    { id: 'rudy', sprite: 'mens_zit_rudy', x: 7, y: 3, richting: 'omlaag', script: 'rudy' },
  ],
  warps: [
    { x: 6, y: 10, naar: 'vakantiestraat', nx: 11, ny: 8, richting: 'omlaag' },
    { x: 12, y: 6, naar: 'huisje_boven', nx: 10, ny: 6, richting: 'omhoog' },
  ],
  interacties: [],
  start: { x: 6, y: 9, richting: 'omhoog' },
};

// ================================================================== huisje 7: boven (de badkamer met de sauna)

export const huisjeBoven = {
  id: 'huisje_boven',
  naam: 'DE BADKAMER',
  muziek: 'huisje',
  gevechtAchtergrond: 'bg_gevecht_winkel',
  tegelset: 'dorp_binnen',
  legenda: BINNEN,
  vast: BINNEN_VAST,
  rijen: [
    'HZZZZZZZZZZH',
    'HzzzzzzzzzzH',
    '[----------]',
    '[tTtTtTtTtT]',
    '[TtTtTtTtTt]',
    '[tTtTtTtTtT]',
    '[TtTtTtTtTt]',
    '[tTtTtTtTtT]',
    'H==========H',
  ],
  objecten: [
    { type: 'sauna', x: 1, y: 2, script: 'sauna' },
    { type: 'douche', x: 5, y: 2, script: 'douche' },
    { type: 'wastafel', x: 7, y: 2, script: 'wastafel' },
    { type: 'wc', x: 8, y: 2, script: 'wc' },
    { type: 'trap', x: 9, y: 4, lengte: 4 },
  ],
  npcs: [],
  warps: [{ x: 10, y: 7, naar: 'huisje_beneden', nx: 12, ny: 7, richting: 'omlaag' }],
  interacties: [],
  start: { x: 10, y: 6, richting: 'omhoog' },
};
