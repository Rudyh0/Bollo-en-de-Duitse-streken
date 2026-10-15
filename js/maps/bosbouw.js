// Boskaarten worden gebouwd uit een grof plan: elk teken is een blok van 2x2 tegels.
// Zo staan de bomen (die 2x2 tegels groot zijn) altijd netjes naast elkaar.
//
//   T  boom             .  bosgrond          ,  bosgrond met varen of paddenstoel
//   w  water            W  water met lelie   r  riet (aan de rand van het water)
//   z  zandpad          g  gras

export const BOS_LEGENDA = {
  g: 0, b: 1, z: 4, Z: 11, '*': 9,
  1: 12, 2: 13, 3: 14, 4: 15, d: 16, D: 17, w: 18, r: 19, l: 20, v: 21, p: 22,
};

// bomen, water, riet, lelies en struiken kun je niet doorheen
export const BOS_VAST = [9, 12, 13, 14, 15, 18, 19, 20];

const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

export function bouwBos(plan) {
  const hoogte = plan.length * 2;
  const breedte = plan[0].length * 2;
  const grond = Array.from({ length: hoogte }, () => Array(breedte).fill('d'));
  const boven = Array.from({ length: hoogte }, () => Array(breedte).fill(' '));
  const bodem = (x, y) => (hash(x, y) % 5 === 0 ? 'D' : 'd');

  plan.forEach((rij, cy) => {
    [...rij].forEach((teken, cx) => {
      const x = cx * 2;
      const y = cy * 2;
      const vak = [[x, y], [x + 1, y], [x, y + 1], [x + 1, y + 1]];
      vak.forEach(([tx, ty]) => { grond[ty][tx] = bodem(tx, ty); });
      if (teken === 'T') {
        boven[y][x] = '1';
        boven[y][x + 1] = '2';
        boven[y + 1][x] = '3';
        boven[y + 1][x + 1] = '4';
      } else if (teken === ',') {
        const [tx, ty] = vak[hash(cx, cy) % 4];
        boven[ty][tx] = hash(cy, cx) % 3 === 0 ? 'p' : 'v';
      } else if (teken === 'w' || teken === 'W') {
        vak.forEach(([tx, ty]) => { grond[ty][tx] = 'w'; });
        if (teken === 'W') {
          const [tx, ty] = vak[hash(cx, cy) % 4];
          boven[ty][tx] = 'l';
        }
      } else if (teken === 'r') {
        vak.forEach(([tx, ty]) => { grond[ty][tx] = 'w'; boven[ty][tx] = 'r'; });
      } else if (teken === 'z') {
        vak.forEach(([tx, ty]) => { grond[ty][tx] = (tx + ty) % 2 ? 'z' : 'Z'; });
      } else if (teken === 'g') {
        vak.forEach(([tx, ty]) => { grond[ty][tx] = hash(tx, ty) % 6 === 0 ? 'b' : 'g'; });
      }
    });
  });

  return {
    breedte,
    hoogte,
    grond,
    boven,
    /** Klaar voor de kaart: rijen als tekst. */
    rijen: () => grond.map((r) => r.join('')),
    bovenRijen: () => boven.map((r) => r.join('')),
  };
}
