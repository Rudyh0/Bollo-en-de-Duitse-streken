// Eerste scherm: wacht op een tik of toets, zodat de browser geluid toestaat.
import { zetCamera, VERSIE } from '../core/constanten.js';
import { tekst, centreerX } from '../ui/tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { heeftNamen } from '../core/namen.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Start' });
  }

  create() {
    zetCamera(this);
    this.cameras.main.setBackgroundColor('#000000');
    const regel1 = 'Tik op het scherm';
    const regel2 = 'of druk op een toets';
    const t1 = tekst(this, centreerX(this, regel1, 'wit'), 66, regel1, 'wit');
    const t2 = tekst(this, centreerX(this, regel2, 'wit'), 80, regel2, 'wit');
    this.tweens.add({ targets: [t1, t2], alpha: 0.25, duration: 700, yoyo: true, repeat: -1 });
    tekst(this, 4, 148, `v${VERSIE}`, 'grijs').setAlpha(0.6);
    this.verder = false;
    this.input.once('pointerdown', () => this.ga());
  }

  update() {
    if (['a', 'b', 'start', 'omhoog', 'omlaag', 'links', 'rechts'].some((k) => invoer.net(k))) this.ga();
  }

  async ga() {
    if (this.verder) return;
    this.verder = true;
    audio.ontgrendel();
    audio.sfx('ok');
    const ui = this.scene.get('UI');
    await ui.naarZwart(250);
    this.scene.start(heeftNamen() ? 'Titel' : 'Setup');
  }
}
