// Naamscherm zoals in de klassieke handheld-RPG's: een letterrooster plus knoppen.
// Werkt met pijltjes + A/B, met een echt toetsenbord (gewoon typen) en met aanraken.
import { kader, tekst, meet } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';

const PAGINAS = [
  { naam: 'ABC', rijen: ['ABCDEFGHI', 'JKLMNOPQR', 'STUVWXYZ-', ".,'!?&()/"] },
  { naam: 'abc', rijen: ['abcdefghi', 'jklmnopqr', 'stuvwxyz-', 'éëèïöüçáó'] },
  { naam: '123', rijen: ['012345678', "9.,'!?&-/", '()+*%#€:;', 'àäâêîôûúí'] },
];
const ZIJKNOPPEN = ['WISSEL', 'SPATIE', 'WIS', 'KLAAR'];

const ROOSTER_X = 14;
const ROOSTER_Y = 52;
const CEL_B = 18;
const CEL_H = 24;
const ZIJ_X = 186;

export class NaamInvoer {
  /** cfg: { vraag, max, icoon: 'beer' | 'park', start } */
  constructor(ui, cfg) {
    this.ui = ui;
    this.cfg = cfg;
    this.volledigScherm = true;
    this.naam = (cfg.start || '').slice(0, cfg.max);
    this.pagina = this.naam.length ? 1 : 0;
    this.kol = 0;
    this.rij = 0;
    this.objecten = [];
    const voeg = (o, d = 700) => { o.setDepth(d); this.objecten.push(o); return o; };

    this.achtergrond = voeg(ui.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0));
    voeg(kader(ui, 2, 2, 236, 38, 'info'));
    if (cfg.icoon === 'beer') {
      voeg(ui.add.sprite(19, 31, 'beer', 0).setOrigin(0.5, 1), 701);
    } else {
      const g = voeg(ui.add.graphics(), 701);
      g.fillStyle(0x302018).fillRect(17, 25, 4, 7);
      g.fillStyle(0x203828).fillTriangle(19, 8, 9, 27, 29, 27);
      g.fillStyle(0x4c8a46).fillTriangle(19, 10, 11, 26, 27, 26);
      g.fillStyle(0x6cb060).fillTriangle(19, 10, 15, 18, 19, 18);
    }
    voeg(tekst(ui, 34, 8, cfg.vraag), 701);
    this.naamTekst = voeg(tekst(ui, 34, 22, ''), 702);
    this.streepjes = voeg(ui.add.graphics(), 701);
    this.knipperCursor = voeg(ui.add.rectangle(0, 30, 5, 1, 0x404048).setOrigin(0, 0), 702);
    ui.tweens.add({ targets: this.knipperCursor, alpha: 0, duration: 400, yoyo: true, repeat: -1, ease: (v) => (v < 0.5 ? 0 : 1) });

    voeg(kader(ui, 2, 42, 178, 116, 'tekst'));
    voeg(kader(ui, 182, 42, 56, 116, 'menu'));
    this.letters = [];
    for (let r = 0; r < 4; r++) {
      for (let k = 0; k < 9; k++) {
        this.letters.push(voeg(tekst(ui, ROOSTER_X + k * CEL_B + 3, ROOSTER_Y + r * CEL_H, ''), 701));
      }
    }
    this.zijTeksten = ZIJKNOPPEN.map((label, r) => voeg(tekst(ui, ZIJ_X + 10, ROOSTER_Y + r * CEL_H, label), 701));
    this.selectie = voeg(ui.add.rectangle(0, 0, 16, 16, 0xffd860, 0.55).setOrigin(0, 0), 700.5);
    this.selectieRand = voeg(ui.add.rectangle(0, 0, 16, 16).setOrigin(0, 0).setStrokeStyle(1, 0xd05040), 700.6);
    this.cursorIcoon = voeg(ui.add.image(0, 0, 'cursor').setOrigin(0, 0), 703);

    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    invoer.tekstModus = true;
    invoer.leegGetypt();

    this.klikHandler = (pointer) => this.klik(pointer);
    ui.input.on('pointerdown', this.klikHandler);

    this.tekenPagina();
    this.tekenNaam();
    this.tekenSelectie();
  }

  tekenPagina() {
    const p = PAGINAS[this.pagina];
    p.rijen.forEach((rij, r) => {
      for (let k = 0; k < 9; k++) {
        const teken = rij[k] || '';
        const t = this.letters[r * 9 + k];
        t.setText(teken);
        t.x = ROOSTER_X + k * CEL_B + Math.round((CEL_B - 2 - meet(this.ui, teken)) / 2);
      }
    });
    const volgende = PAGINAS[(this.pagina + 1) % PAGINAS.length].naam;
    this.zijTeksten[0].setText(volgende);
  }

  tekenNaam() {
    this.naamTekst.setText(this.naam);
    const g = this.streepjes;
    g.clear();
    const breedte = Math.max(this.cfg.max * 6, meet(this.ui, this.naam) + 6);
    g.fillStyle(0x9098a8);
    for (let i = 0; i < this.cfg.max; i++) g.fillRect(34 + i * 6, 32, 5, 1);
    this.knipperCursor.x = 34 + meet(this.ui, this.naam);
    this.knipperCursor.setVisible(this.naam.length < this.cfg.max);
    this.knipperCursor.y = 31;
    return breedte;
  }

  tekenSelectie() {
    let x;
    let y;
    let b;
    if (this.kol < 9) {
      x = ROOSTER_X + this.kol * CEL_B - 2;
      y = ROOSTER_Y + this.rij * CEL_H - 3;
      b = CEL_B - 1;
    } else {
      x = ZIJ_X + 2;
      y = ROOSTER_Y + this.rij * CEL_H - 3;
      b = 46;
    }
    this.selectie.setPosition(x, y).setSize(b, 16);
    this.selectieRand.setPosition(x, y).setSize(b, 16);
    this.cursorIcoon.setVisible(this.kol === 9).setPosition(ZIJ_X + 3, ROOSTER_Y + this.rij * CEL_H + 1);
  }

  beweeg(dk, dr) {
    this.kol = (this.kol + dk + 10) % 10;
    this.rij = (this.rij + dr + 4) % 4;
    audio.sfx('kies');
    this.tekenSelectie();
  }

  typ(teken) {
    if (this.naam.length >= this.cfg.max) {
      audio.sfx('fout');
      return;
    }
    if (teken === ' ' && (!this.naam.length || this.naam.endsWith(' '))) {
      audio.sfx('fout');
      return;
    }
    this.naam += teken;
    audio.sfx('tik');
    // Na de eerste hoofdletter automatisch naar kleine letters, zoals vroeger.
    if (this.naam.length === 1 && this.pagina === 0) {
      this.pagina = 1;
      this.tekenPagina();
    }
    this.tekenNaam();
  }

  wis() {
    if (!this.naam.length) {
      audio.sfx('fout');
      return;
    }
    this.naam = this.naam.slice(0, -1);
    audio.sfx('terug');
    this.tekenNaam();
  }

  klaarMet() {
    const naam = this.naam.trim();
    if (!naam.length) {
      audio.sfx('fout');
      this.ui.cameras.main.shake(120, 0.004);
      return;
    }
    audio.sfx('ok');
    this.afgerond = true;
    this.klaar(naam);
  }

  activeer() {
    if (this.kol < 9) {
      const teken = PAGINAS[this.pagina].rijen[this.rij][this.kol];
      if (teken) this.typ(teken);
      return;
    }
    const knop = ZIJKNOPPEN[this.rij];
    if (knop === 'WISSEL') {
      this.pagina = (this.pagina + 1) % PAGINAS.length;
      audio.sfx('kies');
      this.tekenPagina();
    } else if (knop === 'SPATIE') this.typ(' ');
    else if (knop === 'WIS') this.wis();
    else this.klaarMet();
  }

  klik(pointer) {
    if (this.afgerond) return;
    const p = pointer.positionToCamera(this.ui.cameras.main);
    const r = Math.floor((p.y - ROOSTER_Y + 4) / CEL_H);
    if (r < 0 || r > 3) return;
    if (p.x >= ROOSTER_X - 3 && p.x < ROOSTER_X + 9 * CEL_B) {
      this.kol = Math.max(0, Math.min(8, Math.floor((p.x - ROOSTER_X + 2) / CEL_B)));
      this.rij = r;
    } else if (p.x >= ZIJ_X && p.x < 238) {
      this.kol = 9;
      this.rij = r;
    } else {
      return;
    }
    this.tekenSelectie();
    this.activeer();
  }

  update(delta) {
    if (this.afgerond) return;
    this.achtergrond.tilePositionX += delta * 0.01;
    this.achtergrond.tilePositionY += delta * 0.01;
    const font = this.ui.cache.bitmapFont.get('font_donker').data.chars;
    for (const actie of invoer.leegGetypt()) {
      if (actie.soort === 'wis') this.wis();
      else if (actie.soort === 'enter') this.klaarMet();
      else if (actie.soort === 'teken') {
        if (actie.teken === ' ' || font[actie.teken.charCodeAt(0)]) this.typ(actie.teken);
        else audio.sfx('fout');
      }
      if (this.afgerond) return;
    }
    if (invoer.herhaal('links')) this.beweeg(-1, 0);
    else if (invoer.herhaal('rechts')) this.beweeg(1, 0);
    else if (invoer.herhaal('omhoog')) this.beweeg(0, -1);
    else if (invoer.herhaal('omlaag')) this.beweeg(0, 1);
    else if (invoer.net('a')) this.activeer();
    else if (invoer.net('b')) this.wis();
    else if (invoer.net('start')) {
      this.kol = 9;
      this.rij = 3;
      this.tekenSelectie();
      audio.sfx('kies');
    }
  }

  vernietig() {
    invoer.tekstModus = false;
    invoer.leegGetypt();
    this.ui.input.off('pointerdown', this.klikHandler);
    this.objecten.forEach((o) => o.destroy());
  }
}
