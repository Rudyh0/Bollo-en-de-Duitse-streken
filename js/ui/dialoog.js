// Het Pokémon-achtige tekstvak onderin beeld: twee regels, typemachine-effect,
// rood pijltje als je op A moet drukken, en doorschuiven bij lange teksten.
import { kader, tekst, breekAf, REGELHOOGTE } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { msPerTeken } from '../core/instellingen.js';
import { vul } from '../core/namen.js';

const X = 2;
const Y = 112;
const B = 236;
const H = 46;
const TEKST_X = 11;
const TEKST_Y = 120;
const MAX_BREEDTE = 214;

export class Dialoog {
  constructor(ui) {
    this.ui = ui;
    this.kader = kader(ui, X, Y, B, H, 'tekst');
    this.regels = [tekst(ui, TEKST_X, TEKST_Y, ''), tekst(ui, TEKST_X, TEKST_Y + REGELHOOGTE, '')];
    this.pijl = ui.add.image(X + B - 16, Y + H - 12, 'pijl').setOrigin(0, 0).setVisible(false);
    this.pijlTween = ui.tweens.add({
      targets: this.pijl, y: this.pijl.y + 2, duration: 280, yoyo: true, repeat: -1, ease: (v) => Math.round(v),
    });
    this.onderdelen = [this.kader, ...this.regels, this.pijl];
    this.onderdelen.forEach((o) => o.setDepth(900));
    this.zichtbaar(false);
    this.bezig = false;
  }

  zichtbaar(aan) {
    this.onderdelen.forEach((o) => o.setVisible(aan));
    if (aan) this.pijl.setVisible(false);
    this.open = aan;
  }

  leeg() {
    this.regels.forEach((r) => r.setText(''));
  }

  async wachtOpKnop() {
    this.pijl.setVisible(true);
    await this.ui.wachtOp(() => invoer.net('a') || invoer.net('b'));
    this.pijl.setVisible(false);
    audio.sfx('kies');
  }

  async typ(regel, slot) {
    const doel = this.regels[slot];
    const ms = msPerTeken();
    if (ms === 0) {
      doel.setText(regel);
      return;
    }
    for (let n = 1; n <= regel.length; n++) {
      doel.setText(regel.slice(0, n));
      if (regel[n - 1] === ' ') continue;
      if (invoer.net('a') || invoer.net('b')) {
        doel.setText(regel);
        return;
      }
      const sneller = invoer.ingedrukt('a') || invoer.ingedrukt('b');
      await this.ui.wachtMs(sneller ? Math.min(ms, 8) : ms);
    }
  }

  /**
   * Toont één of meer alinea's. Elke alinea begint in een leeg tekstvak.
   * Met wachtAanEinde: false blijft de laatste tekst staan zonder op A te wachten
   * (handig vlak voor een keuzemenu).
   */
  async toon(alineas, { wachtAanEinde = true } = {}) {
    const lijst = Array.isArray(alineas) ? alineas : [alineas];
    this.bezig = true;
    if (!this.open) this.zichtbaar(true);
    for (let a = 0; a < lijst.length; a++) {
      const regels = breekAf(this.ui, vul(lijst[a]), MAX_BREEDTE);
      this.leeg();
      for (let i = 0; i < regels.length; i++) {
        let slot = i;
        if (i >= 2) {
          await this.wachtOpKnop();
          await this.schuifOp();
          slot = 1;
        }
        await this.typ(regels[i], slot);
      }
      const laatste = a === lijst.length - 1;
      if (!laatste || wachtAanEinde) await this.wachtOpKnop();
    }
    this.bezig = false;
  }

  async schuifOp() {
    const [boven, onder] = this.regels;
    boven.setText(onder.text);
    onder.setText('');
    boven.y = TEKST_Y + 6;
    await this.ui.wachtMs(40);
    boven.y = TEKST_Y + 3;
    await this.ui.wachtMs(40);
    boven.y = TEKST_Y;
  }
}
