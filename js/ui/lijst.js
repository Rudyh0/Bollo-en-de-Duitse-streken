// Een keuzelijst met cursor (Ja/Nee, menu's, opties).
import { kader, tekst, meet, REGELHOOGTE } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { vul } from '../core/namen.js';

export class Lijst {
  /**
   * @param ui de UI-scène
   * @param cfg { opties: [string | {label, uit}], x, y, breedte, annuleer, start, soort, opVerander, rechts, onder, diepte }
   *   x/y: linkerbovenhoek; met rechts/onder kun je de rechter/onderkant vastzetten.
   */
  constructor(ui, cfg) {
    this.ui = ui;
    this.cfg = cfg;
    this.opties = cfg.opties.map((o) => (typeof o === 'string' ? { label: o } : o));
    this.index = Math.min(cfg.start || 0, this.opties.length - 1);
    this.annuleer = cfg.annuleer ?? -1;
    const rh = cfg.regelhoogte || REGELHOOGTE;
    const tekstBreedte = Math.max(...this.opties.map((o) => meet(ui, vul(o.label)) + (o.rechts ? meet(ui, o.rechts) + 14 : 0)));
    const b = cfg.breedte || tekstBreedte + 28;
    const h = this.opties.length * rh + 14;
    let x = cfg.x ?? 0;
    let y = cfg.y ?? 0;
    if (cfg.rechts !== undefined) x = cfg.rechts - b;
    if (cfg.onder !== undefined) y = cfg.onder - h;
    this.x = x;
    this.y = y;
    this.b = b;
    this.h = h;
    this.rh = rh;
    const diepte = cfg.diepte ?? 600;
    this.kader = kader(ui, x, y, b, h, cfg.soort || 'tekst').setDepth(diepte);
    this.teksten = this.opties.map((o, i) => tekst(ui, x + 16, y + 8 + i * rh, vul(o.label), o.uit ? 'grijs' : 'donker').setDepth(diepte + 1));
    this.rechtsTeksten = this.opties.map((o, i) => {
      if (!o.rechts) return null;
      const t = tekst(ui, 0, y + 8 + i * rh, o.rechts, o.uit ? 'grijs' : 'donker').setDepth(diepte + 1);
      t.x = x + b - 10 - t.width;
      return t;
    });
    this.cursor = ui.add.image(x + 8, y + 9 + this.index * rh, 'cursor').setOrigin(0, 0).setDepth(diepte + 2);
    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    if (cfg.opVerander) cfg.opVerander(this.index, this);
  }

  zetLabel(i, label, uit) {
    this.opties[i].label = label;
    if (uit !== undefined) this.opties[i].uit = uit;
    this.teksten[i].setText(vul(label)).setFont(this.opties[i].uit ? 'font_grijs' : 'font_donker');
  }

  zetRechts(i, waarde) {
    const t = this.rechtsTeksten[i];
    if (!t) return;
    t.setText(waarde);
    t.x = this.x + this.b - 10 - t.width;
  }

  beweeg(stap) {
    const n = this.opties.length;
    this.index = (this.index + stap + n) % n;
    this.cursor.y = this.y + 9 + this.index * this.rh;
    audio.sfx('kies');
    if (this.cfg.opVerander) this.cfg.opVerander(this.index, this);
  }

  update() {
    if (this.afgerond) return;
    if (invoer.herhaal('omhoog')) this.beweeg(-1);
    else if (invoer.herhaal('omlaag')) this.beweeg(1);
    else if (this.cfg.opLinksRechts && invoer.herhaal('links')) this.cfg.opLinksRechts(this.index, -1, this);
    else if (this.cfg.opLinksRechts && invoer.herhaal('rechts')) this.cfg.opLinksRechts(this.index, 1, this);
    else if (invoer.net('a')) {
      if (this.opties[this.index].uit) {
        audio.sfx('fout');
        return;
      }
      if (this.cfg.opA && this.cfg.opA(this.index, this)) return;
      audio.sfx('ok');
      this.rond(this.index);
    } else if ((invoer.net('b') || (this.cfg.startSluit && invoer.net('start'))) && this.annuleer >= 0) {
      audio.sfx('terug');
      this.rond(this.annuleer);
    }
  }

  rond(i) {
    this.afgerond = true;
    this.klaar(i);
  }

  vernietig() {
    this.kader.destroy();
    this.teksten.forEach((t) => t.destroy());
    this.rechtsTeksten.forEach((t) => t && t.destroy());
    this.cursor.destroy();
  }
}
