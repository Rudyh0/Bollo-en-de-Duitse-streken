// Het vis-minispel: lijn uitgooien, wachten tot de dobber écht onder gaat en dan op tijd ophalen.
//   - te vroeg op A: de vis schrikt
//   - te laat: de vis eet je aas op en is weg
import { kader, tekst, meet } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { TEGEL, RICHTINGEN } from '../core/constanten.js';

const BEET_VENSTER = 800;

export class VisSpel {
  /** doel: de watertegel waar de dobber in komt. */
  constructor(ui, wereld, doel) {
    this.ui = ui;
    this.wereld = wereld;
    this.fase = 'werpen';
    this.tijd = 0;
    this.wacht = 1600 + Math.random() * 2800;
    this.knabbels = [this.wacht * 0.35, this.wacht * 0.7].filter(() => Math.random() < 0.8);
    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });

    // hint bovenin
    const d = 640;
    this.hintKader = kader(ui, 30, 4, 180, 24, 'info').setDepth(d);
    this.hint = tekst(ui, 0, 10, '', 'donker').setDepth(d + 1);
    this.zetHint('Je gooit je lijn uit...');

    // dobber en lijn in de wereld
    const s = wereld.speler.sprite;
    const r = RICHTINGEN[wereld.speler.richting] || RICHTINGEN.omlaag;
    this.richting = wereld.speler.richting;
    // de dobber komt iets verder het water in dan de tegel vlak voor je neus
    this.doelX = doel.x * TEGEL + 8 + r.dx * 12;
    this.doelY = doel.y * TEGEL + 10 + r.dy * 12;
    this.lijn = wereld.add.graphics().setDepth(8000);
    this.dobber = wereld.add.image(s.x, s.y - 24, 'dobber').setOrigin(0.5, 1).setDepth(8001);
    audio.sfx('zoef');
    wereld.tweens.add({ targets: this.dobber, x: this.doelX, duration: 420 });
    wereld.tweens.add({
      targets: this.dobber, y: this.doelY - 22, duration: 210, yoyo: false, ease: 'Sine.easeOut',
      onComplete: () => {
        wereld.tweens.add({
          targets: this.dobber, y: this.doelY, duration: 210, ease: 'Sine.easeIn',
          onComplete: () => {
            audio.sfx('tik');
            this.ringetje();
            this.fase = 'wachten';
            this.tijd = 0;
            this.zetHint('Wacht op een beet... (A = ophalen)');
            this.dobberRust = wereld.tweens.add({
              targets: this.dobber, y: this.doelY + 1, duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
            });
          },
        });
      },
    });
  }

  zetHint(t) {
    this.hint.setText(t);
    this.hint.x = Math.round(30 + (180 - meet(this.ui, t)) / 2);
  }

  ringetje() {
    const w = this.wereld;
    const r = w.add.ellipse(this.doelX, this.doelY, 6, 3).setStrokeStyle(1, 0xd8f0ff).setDepth(7999);
    w.tweens.add({ targets: r, scaleX: 3, scaleY: 3, alpha: 0, duration: 600, onComplete: () => r.destroy() });
  }

  /** De hengel (een stok vanuit de poot) en de lijn naar de dobber. */
  tekenLijn() {
    const s = this.wereld.speler.sprite;
    const g = this.lijn;
    const links = this.richting === 'links';
    const handX = s.x + (links ? -5 : 5);
    const handY = s.y - 9;
    const uit = { links: [-13, -11], rechts: [13, -11], omlaag: [5, -14], omhoog: [5, -16] }[this.richting] || [5, -14];
    const buig = this.fase === 'beet' ? 3 : 0;
    const topX = handX + uit[0];
    const topY = handY + uit[1] + buig;
    g.clear();
    g.lineStyle(2, 0x6b4426, 1).lineBetween(handX, handY, topX, topY);
    g.lineStyle(1, 0x2a1a10, 1).lineBetween(handX, handY, handX + uit[0] * 0.3, handY + uit[1] * 0.3);
    g.lineStyle(1, 0xe8e8e8, 0.8).lineBetween(topX, topY, this.dobber.x, this.dobber.y - 8);
  }

  rond(uitkomst) {
    if (this.afgerond) return;
    this.afgerond = true;
    this.klaar(uitkomst);
  }

  update(delta) {
    if (this.afgerond) return;
    this.tekenLijn();
    this.tijd += delta;
    if (invoer.net('b')) { this.rond('gestopt'); return; }
    if (this.fase === 'wachten') {
      if (invoer.net('a')) {
        audio.sfx('fout');
        this.rond('te_vroeg');
        return;
      }
      // af en toe een knabbeltje: niet intrappen!
      if (this.knabbels.length && this.tijd >= this.knabbels[0]) {
        this.knabbels.shift();
        audio.sfx('tik');
        this.ringetje();
        this.wereld.tweens.add({ targets: this.dobber, x: this.doelX + 1, duration: 60, yoyo: true, repeat: 1 });
      }
      if (this.tijd >= this.wacht) {
        this.fase = 'beet';
        this.tijd = 0;
        if (this.dobberRust) this.dobberRust.stop();
        audio.sfx('plons');
        this.ringetje();
        this.dobber.y = this.doelY + 5;
        this.dobber.setAlpha(0.55);
        this.zetHint('BEET! Druk op A!');
        const s = this.wereld.speler.sprite;
        this.uitroep = this.wereld.add.image(s.x, s.y - 22, 'effect_uitroep').setOrigin(0.5, 1).setDepth(10000);
        audio.sfx('uitroep');
      }
    } else if (this.fase === 'beet') {
      if (invoer.net('a')) {
        audio.sfx('ok');
        this.rond('gevangen');
        return;
      }
      if (this.tijd >= BEET_VENSTER) this.rond('te_laat');
    }
  }

  vernietig() {
    if (this.dobberRust) this.dobberRust.stop();
    this.lijn.destroy();
    this.dobber.destroy();
    if (this.uitroep) this.uitroep.destroy();
    this.hintKader.destroy();
    this.hint.destroy();
  }
}

/** Vissen op een tegel. Geeft 'gevangen', 'te_vroeg', 'te_laat' of 'gestopt'. */
export function vis(ui, wereld, doel) {
  return ui.open(new VisSpel(ui, wereld, doel));
}
