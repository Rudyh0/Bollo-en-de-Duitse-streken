// Gezondheidsbalk in de stijl van een HP-balk.
import { tekst } from './tekst.js';

export function kleurVoor(verhouding) {
  if (verhouding > 0.5) return 0x58d080;
  if (verhouding > 0.2) return 0xf0c838;
  return 0xe85038;
}

/** Tekent een balk van 48 pixels breed met het label 'GZ'. Geeft {objecten, zet(waarde)} terug. */
export function gezondheidsbalk(scene, x, y, waarde, max, diepte = 800) {
  const label = tekst(scene, x, y - 2, 'GZ', 'rood').setDepth(diepte);
  const g = scene.add.graphics().setDepth(diepte);
  const teken = (w) => {
    const v = Math.max(0, Math.min(1, w / max));
    g.clear();
    g.fillStyle(0x404048).fillRect(x + 14, y, 52, 6);
    g.fillStyle(0x505860).fillRect(x + 15, y + 1, 50, 4);
    g.fillStyle(0x1c2028).fillRect(x + 16, y + 1, 48, 4);
    const b = Math.ceil(48 * v);
    if (b > 0) {
      g.fillStyle(kleurVoor(v)).fillRect(x + 16, y + 1, b, 4);
      g.fillStyle(0xffffff, 0.35).fillRect(x + 16, y + 1, b, 1);
    }
  };
  teken(waarde);
  return {
    objecten: [label, g],
    zet: teken,
    vernietig() { label.destroy(); g.destroy(); },
  };
}
