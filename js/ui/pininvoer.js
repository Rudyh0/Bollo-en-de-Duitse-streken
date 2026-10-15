// Pincode invoeren: een cijferblok van 3x4 (1-9, WIS, 0, OK).
// Werkt met pijltjes + A/B, met de cijfertoetsen van een toetsenbord en met aanraken.
import { kader, tekst, meet } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';

const TOETSEN = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'WIS', '0', 'OK'];
const LENGTE = 6;
const BLOK_X = 66;
const BLOK_Y = 50;
const CEL_B = 36;
const CEL_H = 25;

export class PinInvoer {
  /** cfg: { vraag, uitleg } */
  constructor(ui, cfg) {
    this.ui = ui;
    this.cfg = cfg;
    this.volledigScherm = true;
    this.pin = '';
    this.index = 0;
    this.objecten = [];
    const voeg = (o, d = 700) => { o.setDepth(d); this.objecten.push(o); return o; };

    this.achtergrond = voeg(ui.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0));
    voeg(kader(ui, 2, 2, 236, 40, 'info'));
    const slot = voeg(ui.add.graphics(), 701);
    slot.fillStyle(0x384058).fillRoundedRect(12, 16, 16, 14, 2);
    slot.lineStyle(2, 0x384058).strokeCircle(20, 14, 5);
    slot.fillStyle(0xf0d060).fillRect(19, 21, 2, 5);
    voeg(tekst(ui, 36, 8, cfg.vraag), 701);
    this.vakjes = voeg(ui.add.graphics(), 701);
    if (cfg.uitleg) voeg(tekst(ui, 128, 24, cfg.uitleg, 'grijs'), 701);

    voeg(kader(ui, BLOK_X - 8, BLOK_Y - 8, CEL_B * 3 + 16, CEL_H * 4 + 12, 'tekst'));
    this.selectie = voeg(ui.add.rectangle(0, 0, CEL_B - 4, CEL_H - 5, 0xffd860, 0.55).setOrigin(0, 0), 700.5);
    this.selectieRand = voeg(ui.add.rectangle(0, 0, CEL_B - 4, CEL_H - 5).setOrigin(0, 0).setStrokeStyle(1, 0xd05040), 700.6);
    TOETSEN.forEach((t, i) => {
      const k = i % 3;
      const r = Math.floor(i / 3);
      const x = BLOK_X + k * CEL_B + Math.round((CEL_B - 4 - meet(ui, t)) / 2);
      voeg(tekst(ui, x, BLOK_Y + r * CEL_H + 5, t, t.length > 1 ? 'rood' : 'donker'), 701);
    });

    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    invoer.tekstModus = true;
    invoer.leegGetypt();
    this.klikHandler = (pointer) => this.klik(pointer);
    ui.input.on('pointerdown', this.klikHandler);
    this.tekenVakjes();
    this.tekenSelectie();
  }

  tekenVakjes() {
    const g = this.vakjes;
    g.clear();
    for (let i = 0; i < LENGTE; i++) {
      const x = 36 + i * 14;
      g.fillStyle(0xffffff).fillRect(x, 22, 11, 13);
      g.lineStyle(1, i === this.pin.length ? 0xd05040 : 0x9098a8).strokeRect(x + 0.5, 22.5, 10, 12);
      if (i < this.pin.length) g.fillStyle(0x384058).fillCircle(x + 5.5, 28.5, 3);
    }
  }

  tekenSelectie() {
    const k = this.index % 3;
    const r = Math.floor(this.index / 3);
    const x = BLOK_X + k * CEL_B - 2;
    const y = BLOK_Y + r * CEL_H;
    this.selectie.setPosition(x, y);
    this.selectieRand.setPosition(x, y);
  }

  beweeg(dk, dr) {
    let k = this.index % 3;
    let r = Math.floor(this.index / 3);
    k = (k + dk + 3) % 3;
    r = (r + dr + 4) % 4;
    this.index = r * 3 + k;
    audio.sfx('kies');
    this.tekenSelectie();
  }

  typ(cijfer) {
    if (this.pin.length >= LENGTE) {
      audio.sfx('fout');
      return;
    }
    this.pin += cijfer;
    audio.sfx('tik');
    this.tekenVakjes();
    if (this.pin.length === LENGTE) {
      this.index = 11; // cursor naar OK
      this.tekenSelectie();
    }
  }

  wis() {
    if (!this.pin.length) {
      audio.sfx('fout');
      return;
    }
    this.pin = this.pin.slice(0, -1);
    audio.sfx('terug');
    this.tekenVakjes();
  }

  klaarMet() {
    if (this.pin.length !== LENGTE) {
      audio.sfx('fout');
      this.ui.cameras.main.shake(120, 0.004);
      return;
    }
    audio.sfx('ok');
    this.afgerond = true;
    this.klaar(this.pin);
  }

  activeer() {
    const t = TOETSEN[this.index];
    if (t === 'WIS') this.wis();
    else if (t === 'OK') this.klaarMet();
    else this.typ(t);
  }

  klik(pointer) {
    if (this.afgerond) return;
    const p = pointer.positionToCamera(this.ui.cameras.main);
    const k = Math.floor((p.x - BLOK_X + 2) / CEL_B);
    const r = Math.floor((p.y - BLOK_Y) / CEL_H);
    if (k < 0 || k > 2 || r < 0 || r > 3) return;
    this.index = r * 3 + k;
    this.tekenSelectie();
    this.activeer();
  }

  update(delta) {
    if (this.afgerond) return;
    this.achtergrond.tilePositionX += delta * 0.01;
    this.achtergrond.tilePositionY += delta * 0.01;
    for (const actie of invoer.leegGetypt()) {
      if (actie.soort === 'wis') this.wis();
      else if (actie.soort === 'enter') this.klaarMet();
      else if (actie.soort === 'teken' && /^[0-9]$/.test(actie.teken)) this.typ(actie.teken);
      else if (actie.soort === 'teken') audio.sfx('fout');
      if (this.afgerond) return;
    }
    if (invoer.herhaal('links')) this.beweeg(-1, 0);
    else if (invoer.herhaal('rechts')) this.beweeg(1, 0);
    else if (invoer.herhaal('omhoog')) this.beweeg(0, -1);
    else if (invoer.herhaal('omlaag')) this.beweeg(0, 1);
    else if (invoer.net('a')) this.activeer();
    else if (invoer.net('b')) this.wis();
    else if (invoer.net('start')) this.klaarMet();
  }

  vernietig() {
    invoer.tekstModus = false;
    invoer.leegGetypt();
    this.ui.input.off('pointerdown', this.klikHandler);
    this.objecten.forEach((o) => o.destroy());
  }
}
