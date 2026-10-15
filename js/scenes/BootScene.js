// Laadt alle afbeeldingen en lettertypes en start daarna de UI-laag en het startscherm.
import { zetCamera, BREEDTE, HOOGTE, VERSIE } from '../core/constanten.js';

const v = `?v=${VERSIE}`;

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    zetCamera(this);
    const balkRand = this.add.rectangle(BREEDTE / 2, HOOGTE / 2, 122, 8).setStrokeStyle(1, 0x8890b0);
    const balk = this.add.rectangle(BREEDTE / 2 - 59, HOOGTE / 2, 1, 4, 0xf0d060).setOrigin(0, 0.5);
    this.load.on('progress', (p) => { balk.width = Math.max(1, 118 * p); });
    this.load.on('complete', () => { balkRand.destroy(); balk.destroy(); });

    this.load.setPath('assets/');
    const afbeeldingen = {
      bg_titel: 'bg/titel.png',
      bg_intro: 'bg/intro.png',
      patroon: 'ui/patroon.png',
      kader_tekst: 'ui/kader_tekst.png',
      kader_menu: 'ui/kader_menu.png',
      kader_info: 'ui/kader_info.png',
      cursor: 'ui/cursor.png',
      pijl: 'ui/pijl.png',
      icoon_voedselbon: 'ui/icoon_voedselbon.png',
      icoon_soeplepel: 'ui/icoon_soeplepel.png',
      icoon_rugzak: 'ui/icoon_rugzak.png',
      obj_stapelbed: 'sprites/obj_stapelbed.png',
      obj_stapelbed_rood: 'sprites/obj_stapelbed_rood.png',
      obj_kist: 'sprites/obj_kist.png',
      obj_kist_open: 'sprites/obj_kist_open.png',
      obj_kachel: 'sprites/obj_kachel.png',
      obj_tafel: 'sprites/obj_tafel.png',
      obj_kruk: 'sprites/obj_kruk.png',
      obj_emmer: 'sprites/obj_emmer.png',
      binnen: 'tiles/binnen.png',
    };
    Object.entries(afbeeldingen).forEach(([k, pad]) => this.load.image(k, pad + v));

    this.load.spritesheet('beer', `sprites/beer.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('henk', `sprites/henk.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('fenna', `sprites/fenna.png${v}`, { frameWidth: 16, frameHeight: 20 });
    this.load.spritesheet('directeur', `sprites/directeur.png${v}`, { frameWidth: 48, frameHeight: 64 });
    this.load.spritesheet('beer_groot', `sprites/beer_groot.png${v}`, { frameWidth: 48, frameHeight: 56 });

    ['donker', 'wit', 'grijs', 'rood', 'blauw', 'titel'].forEach((naam) => {
      this.load.bitmapFont(`font_${naam}`, `fonts/font_${naam}.png${v}`, `fonts/font_${naam}.xml${v}`);
    });
  }

  create() {
    this.scene.launch('UI');
    this.scene.start('Start');
  }
}
