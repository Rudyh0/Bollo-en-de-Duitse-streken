// Keuzemenu in een raster (2 kolommen), zoals het gevechtsmenu onderin beeld.
import { kader, tekst, breekAf } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { vul } from '../core/namen.js';

export class RasterMenu {
  /**
   * cfg: {
   *   opties: [{label, uit}], kolommen: 2,
   *   kader: {x, y, b, h, soort},           // het menu zelf
   *   links: {x, y, b, h, tekst} (optioneel) // tekstvak links ernaast
   *   info: {x, y, b, h} (optioneel)         // infovak; wordt gevuld via opVerander(i, regels)
   *   kolomBreedte, annuleer, start, opVerander(i) -> [regel1, regel2]
   * }
   */
  constructor(ui, cfg) {
    this.ui = ui;
    this.cfg = cfg;
    this.opties = cfg.opties.map((o) => (typeof o === 'string' ? { label: o } : o));
    this.kolommen = cfg.kolommen || 2;
    this.index = Math.min(cfg.start || 0, this.opties.length - 1);
    this.objecten = [];
    const d = 600;
    const voeg = (o, diepte = d) => { o.setDepth(diepte); this.objecten.push(o); return o; };
    if (cfg.links) {
      const l = cfg.links;
      voeg(kader(ui, l.x, l.y, l.b, l.h, 'tekst'));
      const regels = breekAf(ui, vul(l.tekst), l.b - 20);
      regels.slice(0, 2).forEach((r, i) => voeg(tekst(ui, l.x + 9, l.y + 8 + i * 14, r), d + 1));
    }
    const k = cfg.kader;
    voeg(kader(ui, k.x, k.y, k.b, k.h, k.soort || 'menu'));
    const kb = cfg.kolomBreedte || Math.floor((k.b - 16) / this.kolommen);
    this.posities = this.opties.map((o, i) => ({
      x: k.x + 16 + (i % this.kolommen) * kb,
      y: k.y + 8 + Math.floor(i / this.kolommen) * 14,
    }));
    this.opties.forEach((o, i) => {
      const p = this.posities[i];
      voeg(tekst(ui, p.x, p.y, vul(o.label), o.uit ? 'grijs' : 'donker'), d + 1);
    });
    this.cursor = voeg(ui.add.image(0, 0, 'cursor').setOrigin(0, 0), d + 2);
    if (cfg.info) {
      const inf = cfg.info;
      voeg(kader(ui, inf.x, inf.y, inf.b, inf.h, 'tekst'));
      this.infoRegels = [0, 1].map((i) => voeg(tekst(ui, inf.x + 9, inf.y + 8 + i * 14, ''), d + 1));
    }
    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    this.zetCursor();
  }

  zetCursor() {
    const p = this.posities[this.index];
    this.cursor.setPosition(p.x - 8, p.y + 1);
    if (this.cfg.opVerander) {
      const regels = this.cfg.opVerander(this.index) || [];
      if (this.infoRegels) this.infoRegels.forEach((t, i) => t.setText(regels[i] || ''));
    }
  }

  beweeg(dk, dr) {
    const n = this.opties.length;
    const k = this.index % this.kolommen;
    const r = Math.floor(this.index / this.kolommen);
    const rijen = Math.ceil(n / this.kolommen);
    const nk = (k + dk + this.kolommen) % this.kolommen;
    const nr = (r + dr + rijen) % rijen;
    const ni = nr * this.kolommen + nk;
    if (ni >= n || ni === this.index) return;
    this.index = ni;
    audio.sfx('kies');
    this.zetCursor();
  }

  update() {
    if (this.afgerond) return;
    if (invoer.herhaal('links')) this.beweeg(-1, 0);
    else if (invoer.herhaal('rechts')) this.beweeg(1, 0);
    else if (invoer.herhaal('omhoog')) this.beweeg(0, -1);
    else if (invoer.herhaal('omlaag')) this.beweeg(0, 1);
    else if (invoer.net('a')) {
      if (this.opties[this.index].uit) {
        audio.sfx('fout');
        return;
      }
      audio.sfx('ok');
      this.afgerond = true;
      this.klaar(this.index);
    } else if (invoer.net('b') && this.cfg.annuleer !== undefined) {
      audio.sfx('terug');
      this.afgerond = true;
      this.klaar(this.cfg.annuleer);
    }
  }

  vernietig() {
    this.objecten.forEach((o) => o.destroy());
  }
}
