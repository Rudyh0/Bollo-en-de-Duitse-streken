// Titelscherm met logo en hoofdmenu: Nieuw spel, Spel laden, Instellingen.
import { zetCamera, BREEDTE, VERSIE } from '../core/constanten.js';
import { tekst, kader, centreerX, meet } from '../ui/tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { beer } from '../core/namen.js';
import { heeftOpslag, opslagInfo, nieuwSpel, laad, speeltijdTekst } from '../core/staat.js';

export class TitelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Titel' });
  }

  create() {
    zetCamera(this);
    this.ui = this.scene.get('UI');
    this.add.image(0, 0, 'bg_titel').setOrigin(0, 0);
    this.maakZoeklicht();
    this.maakSterren();

    // beer op het pad
    this.add.ellipse(176, 150, 40, 8, 0x000000, 0.3);
    this.beer = this.add.sprite(176, 152, 'beer_groot', 0).setOrigin(0.5, 1);
    this.time.addEvent({
      delay: 520, loop: true,
      callback: () => { this.zwaaiStand = !this.zwaaiStand; this.beer.setFrame(this.zwaaiStand ? 1 : 0); },
    });

    // logo
    const naam = beer().toUpperCase();
    this.logo = this.add.bitmapText(0, -40, 'font_titel', naam).setOrigin(0, 0);
    this.logo.x = Math.round((BREEDTE - this.logo.width) / 2);
    const ondertitel = 'en de Duitse streken';
    const ob = meet(this, ondertitel, 'wit') + 16;
    this.lint = this.add.graphics();
    this.lint.fillStyle(0x7a1c1c, 1).fillRect((BREEDTE - ob) / 2, 36, ob, 14);
    this.lint.fillStyle(0xb83030, 1).fillRect((BREEDTE - ob) / 2, 36, ob, 12);
    this.lint.fillStyle(0x7a1c1c, 1).fillTriangle((BREEDTE - ob) / 2 - 8, 36, (BREEDTE - ob) / 2, 36, (BREEDTE - ob) / 2, 50);
    this.lint.fillTriangle((BREEDTE + ob) / 2 + 8, 36, (BREEDTE + ob) / 2, 36, (BREEDTE + ob) / 2, 50);
    this.ondertitel = tekst(this, centreerX(this, ondertitel, 'wit'), 38, ondertitel, 'wit');
    this.lint.setAlpha(0);
    this.ondertitel.setAlpha(0);

    this.drukStart = tekst(this, 0, 128, 'DRUK OP START', 'wit');
    this.drukStart.x = centreerX(this, 'DRUK OP START', 'wit') - 30;
    this.drukStart.setVisible(false);
    this.knipper = this.time.addEvent({ delay: 550, loop: true, callback: () => this.drukStart.setAlpha(this.drukStart.alpha > 0.5 ? 0 : 1) });
    tekst(this, 4, 150, `v${VERSIE}`, 'grijs').setAlpha(0.7);

    this.fase = 'intro';
    audio.speelMuziek('titel');
    this.ui.vanZwart(500);
    this.tweens.add({
      targets: this.logo, y: 12, duration: 700, ease: 'Bounce.easeOut', delay: 200,
      onComplete: () => {
        this.tweens.add({ targets: [this.lint, this.ondertitel], alpha: 1, duration: 300 });
        this.drukStart.setVisible(true);
        this.fase = 'wacht';
      },
    });
    this.input.on('pointerdown', () => { if (this.fase === 'wacht') this.openMenu(); });
  }

  maakZoeklicht() {
    const g = this.add.graphics().setBlendMode(Phaser.BlendModes.ADD);
    this.zoeklicht = { g, hoek: -0.35 };
    this.tweens.add({ targets: this.zoeklicht, hoek: 0.25, duration: 4200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  maakSterren() {
    this.sterren = [];
    for (let i = 0; i < 8; i++) {
      const s = this.add.rectangle(Phaser.Math.Between(60, 230), Phaser.Math.Between(2, 40), 1, 1, 0xffffff);
      this.tweens.add({ targets: s, alpha: 0.1, duration: Phaser.Math.Between(500, 1300), yoyo: true, repeat: -1, delay: i * 170 });
    }
  }

  update() {
    const { g, hoek } = this.zoeklicht;
    g.clear();
    const ox = 46;
    const oy = 56;
    const lengte = 210;
    const a1 = hoek - 0.06;
    const a2 = hoek + 0.06;
    g.fillStyle(0xfff0b0, 0.13);
    g.fillTriangle(ox, oy, ox + Math.cos(a1) * lengte, oy + Math.sin(a1) * lengte * 0.35 - 30, ox + Math.cos(a2) * lengte, oy + Math.sin(a2) * lengte * 0.35 - 22);

    if (this.fase === 'wacht' && (invoer.net('start') || invoer.net('a'))) this.openMenu();
  }

  async openMenu() {
    if (this.fase !== 'wacht') return;
    this.fase = 'menu';
    audio.sfx('ok');
    this.drukStart.setVisible(false);
    this.knipper.paused = true;
    const ui = this.ui;
    let infoObjecten = [];
    const ruimInfo = () => { infoObjecten.forEach((o) => o.destroy()); infoObjecten = []; };
    const toonInfo = () => {
      ruimInfo();
      const info = opslagInfo();
      if (!info) return;
      const d = 610;
      const k = kader(ui, 108, 62, 128, 62, 'info').setDepth(d);
      const regels = [
        ['', info.kaartnaam || 'BARAK 7'],
        ['SPEELTIJD', speeltijdTekst(info.speeltijdMs || 0)],
        ['GEZONDHEID', `${info.gezondheid}/${info.maxGezondheid}`],
      ];
      infoObjecten.push(k, tekst(ui, 117, 68, beer(), 'blauw').setDepth(d + 1));
      regels.forEach(([l, r], i) => {
        const y = 82 + i * 13;
        if (l) infoObjecten.push(tekst(ui, 117, y, l, 'grijs').setDepth(d + 1));
        const t = tekst(ui, 0, y, r).setDepth(d + 1);
        t.x = 228 - t.width;
        infoObjecten.push(t);
      });
    };

    let start = heeftOpslag() ? 1 : 0;
    await ui.script(async () => {
      for (;;) {
        const opslag = heeftOpslag();
        const keuze = await ui.kies(
          [{ label: 'NIEUW SPEL' }, { label: 'SPEL LADEN', uit: !opslag }, { label: 'INSTELLINGEN' }],
          {
            x: 6, y: 62, soort: 'menu', breedte: 96, annuleer: 3, start,
            opVerander: (i) => { if (i === 1 && opslag) toonInfo(); else ruimInfo(); },
          },
        );
        ruimInfo();
        if (keuze < 3) start = keuze;
        if (keuze === 0) {
          if (opslag) {
            const k = await ui.vraag('Er is al een opgeslagen spel. Als je een nieuw spel opslaat, wordt het oude overschreven. Toch beginnen?');
            if (k !== 0) continue;
          }
          nieuwSpel();
          audio.stopMuziek(0.6);
          await ui.naarZwart(600);
          this.scene.start('Intro');
          return;
        }
        if (keuze === 1) {
          laad();
          audio.stopMuziek(0.5);
          await ui.naarZwart(500);
          this.scene.start('Wereld', { geladen: true });
          return;
        }
        if (keuze === 2) {
          const r = await ui.instellingen({ vanuitSpel: false });
          if (r === 'namen') {
            await ui.naarZwart(400);
            this.scene.start('Setup');
            return;
          }
          continue;
        }
        // terug naar 'druk op start'
        this.fase = 'wacht';
        this.drukStart.setVisible(true);
        this.knipper.paused = false;
        return;
      }
    });
  }
}
