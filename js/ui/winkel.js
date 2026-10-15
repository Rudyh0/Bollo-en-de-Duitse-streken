// Een winkeltje (zoals bij Kikker): geld linksboven, aanbod rechts, uitleg met icoon onderin.
import { kader, tekst, breekAf } from './tekst.js';
import { ITEMS } from '../core/items.js';
import { staat } from '../core/staat.js';
import { audio } from '../core/audio.js';
import { vul } from '../core/namen.js';

class WinkelScherm {
  constructor(ui, titel) {
    this.ui = ui;
    const d = 700;
    this.objecten = [];
    const voeg = (o, diepte = d) => { o.setDepth(diepte); this.objecten.push(o); return o; };
    voeg(kader(ui, 2, 2, 82, 40, 'menu'));
    voeg(tekst(ui, 12, 9, titel, 'grijs'), d + 1);
    this.geldTekst = voeg(tekst(ui, 12, 23, ''), d + 1);
    voeg(kader(ui, 2, 108, 236, 50, 'tekst'));
    this.icoon = voeg(ui.add.image(10, 116, 'icoon_voedselbon').setOrigin(0, 0), d + 1);
    this.regels = [0, 1, 2].map((i) => voeg(tekst(ui, 32, 114 + i * 13, ''), d + 1));
    this.werkGeldBij();
  }

  werkGeldBij() {
    this.geldTekst.setText(`GELD  €${staat.geld || 0}`);
  }

  toon(regel) {
    const item = regel && ITEMS[regel.id];
    this.icoon.setVisible(Boolean(item));
    if (item) this.icoon.setTexture(item.icoon);
    const uitleg = regel ? (regel.uitleg || item.beschrijving) : 'Niets meer nodig? Dan ga je weer verder.';
    const regels = breekAf(this.ui, vul(uitleg), item ? 196 : 218);
    this.regels.forEach((r, i) => r.setText(regels[i] || '').setX(item ? 32 : 11));
  }

  vernietig() {
    this.objecten.forEach((o) => o.destroy());
  }
}

/**
 * Opent een winkel.
 * cfg: {
 *   titel: tekst in het geldvak,
 *   aanbod: () => [{ id, prijs: 'tekst rechts', uitleg?, uit?: bool }],
 *   kies: async (regel, scherm) => void   (het gesprek bij het kopen; mag geld afschrijven)
 *   klaar: () => bool                      (true: winkel sluit vanzelf, bijv. als alles verkocht is)
 * }
 */
export async function openWinkel(ui, cfg) {
  ui.sluitDialoog();
  audio.sfx('menu');
  const scherm = new WinkelScherm(ui, cfg.titel || 'WINKEL');
  let start = 0;
  try {
    for (;;) {
      if (cfg.klaar && cfg.klaar()) return;
      const aanbod = cfg.aanbod();
      const opties = aanbod.map((r) => ({ label: ITEMS[r.id].naam, rechts: r.prijs, uit: r.uit }));
      opties.push({ label: 'STOPPEN' });
      scherm.werkGeldBij();
      const keuze = await ui.kies(opties, {
        x: 86, y: 2, breedte: 152, annuleer: opties.length - 1, start, diepte: 710,
        opVerander: (i) => scherm.toon(aanbod[i]),
      });
      if (keuze >= aanbod.length) return;
      start = keuze;
      await cfg.kies(aanbod[keuze], scherm);
      scherm.werkGeldBij();
    }
  } finally {
    scherm.vernietig();
  }
}
