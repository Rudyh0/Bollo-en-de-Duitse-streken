// Hulpfuncties voor pixeltekst en kaders.

export const REGELHOOGTE = 14;

export function tekst(scene, x, y, inhoud, kleur = 'donker') {
  return scene.add.bitmapText(Math.round(x), Math.round(y), `font_${kleur}`, inhoud).setOrigin(0, 0);
}

function tekenBreedte(fontData, teken) {
  const c = fontData.chars[teken.charCodeAt(0)];
  return c ? c.xAdvance : 4;
}

export function meet(scene, inhoud, kleur = 'donker') {
  const font = scene.cache.bitmapFont.get(`font_${kleur}`);
  if (!font) return inhoud.length * 5;
  let b = 0;
  for (const t of inhoud) b += tekenBreedte(font.data, t);
  return b;
}

/** Breekt tekst af op woorden zodat elke regel binnen `max` pixels past. */
export function breekAf(scene, inhoud, max, kleur = 'donker') {
  const regels = [];
  inhoud.split('\n').forEach((alinea) => {
    const woorden = alinea.split(' ');
    let regel = '';
    woorden.forEach((woord) => {
      const poging = regel ? `${regel} ${woord}` : woord;
      if (meet(scene, poging, kleur) <= max) {
        regel = poging;
        return;
      }
      if (regel) regels.push(regel);
      // woord dat in zijn geheel te lang is: hard afbreken
      let rest = woord;
      while (meet(scene, rest, kleur) > max) {
        let n = rest.length - 1;
        while (n > 1 && meet(scene, rest.slice(0, n), kleur) > max) n -= 1;
        regels.push(rest.slice(0, n));
        rest = rest.slice(n);
      }
      regel = rest;
    });
    regels.push(regel);
  });
  return regels;
}

/** Een schaalbaar kader (9-slice). Soorten: tekst, menu, info. */
export function kader(scene, x, y, b, h, soort = 'tekst') {
  return scene.add.nineslice(Math.round(x), Math.round(y), `kader_${soort}`, null, Math.round(b), Math.round(h), 8, 8, 8, 8).setOrigin(0, 0);
}

export function centreerX(scene, inhoud, kleur = 'donker', breedte = 240) {
  return Math.round((breedte - meet(scene, inhoud, kleur)) / 2);
}
