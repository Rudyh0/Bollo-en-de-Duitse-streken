/** Tegels rondom een rechthoek, met de klok mee (voor stoeten die rondjes lopen). */
export function rechthoekPad(x1, y1, x2, y2) {
  const pad = [];
  for (let x = x1; x <= x2; x++) pad.push({ x, y: y1 });
  for (let y = y1 + 1; y <= y2; y++) pad.push({ x: x2, y });
  for (let x = x2 - 1; x >= x1; x--) pad.push({ x, y: y2 });
  for (let y = y2 - 1; y > y1; y--) pad.push({ x: x1, y });
  return pad;
}
