// De aftiteling: de beer zit in de sauna terwijl de namen voorbijkomen, precies zo lang als de Outro duurt.
// Daarna komt er rook, wordt het beeld zwart en lees je hoe het de beer verder verging.
import { BREEDTE, HOOGTE, zetCamera } from '../core/constanten.js';
import { audio } from '../core/audio.js';
import { invoer } from '../core/invoer.js';
import { tekst, meet, breekAf } from '../ui/tekst.js';
import { beer, vul } from '../core/namen.js';

const RUDY = 'Rudy Hovinga';
const CLAUDE = 'Claude';
const OUTRO_DUUR = 36.0;   // reserve, als het geluid niet geladen kan worden

const KOLOM_X = 130;
const KOLOM_B = 106;

/** De aftiteling: [functie, naam] of een kopje ({ kop }) of een plaatje ({ sprite, naam }). */
function titels() {
  return [
    { titel: true },
    { ruimte: 24 },
    ['REGIE', RUDY],
    ['VERHAAL EN SCENARIO', RUDY],
    ['PROGRAMMEERWERK', CLAUDE],
    ['HOOFD FRIKANDELLEN ONTDOOIEN', RUDY],
    ['CONSULENT SOKKEN IN SANDALEN', RUDY],
    ['RASTERLOGICA EN BOTSINGEN', CLAUDE],
    ['COORDINATOR HANDDOEKEN OP LIGBEDDEN', RUDY],
    ['CONTROLEUR SNERTTEMPERATUUR', RUDY],
    ['CHIPTUNE SYNTHESIZER', CLAUDE],
    ['DRENTS-NEDERLANDS TOLK', RUDY],
    ['KIKKERWRANGLER', RUDY],
    ['PIXELS TEKENEN IN PYTHON', CLAUDE],
    ['HOOFD FRIESE DROGE WORST', RUDY],
    ['VANGRAILPOETSER N34', RUDY],
    ['INSPECTEUR ZANDKUILEN', RUDY],
    ['OPSLAAN EN LADEN', CLAUDE],
    ['ADVISEUR TABAKSACCIJNS', RUDY],
    ['PEPERMUNTJESBEHEER', RUDY],
    ['BUGS MAKEN', CLAUDE],
    ['BUGS VINDEN', RUDY],
    ['HOBBELPAARDTRAINER', RUDY],
    ['SAUNA-OPGIETER', RUDY],
    ['CATERING (KIPSATE EN SPARERIBS)', RUDY],
    ['AFNEMER MIETJESTEST', RUDY],
    ['BUGS OPLOSSEN', CLAUDE],
    ['INSPECTIE DOUCHEKOPPEN', RUDY],
    { ruimte: 10 },
    { kop: 'DE CAST' },
    [beer().toUpperCase(), RUDY],
    ['DIRECTEUR HARM ROOKHUYS', RUDY],
    ['LEVI', RUDY],
    ['KIKKER', RUDY],
    ['ALLE DUITSERS', RUDY],
    { ruimte: 10 },
    { kop: 'OP DE BANK' },
    { sprite: 'mens_zit_jesse', naam: 'JESSE' },
    { sprite: 'mens_zit_devona', naam: 'DEVONA' },
    { sprite: 'mens_zit_dewi', naam: 'DEWI' },
    { sprite: 'mens_zit_femke', naam: 'FEMKE' },
    { sprite: 'mens_zit_frank', naam: 'FRANK' },
    { sprite: 'mens_zit_mathijs', naam: 'MATHIJS' },
    { sprite: 'mens_zit_rudy', naam: 'RUDY' },
    { ruimte: 16 },
    { slot: ['GEEN BEREN ZIJN GEWOND', 'GERAAKT TIJDENS HET', 'MAKEN VAN DIT SPEL.'] },
    { ruimte: 18 },
    { laatste: '...NOG NIET.' },
  ];
}

export class AftitelingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Aftiteling' });
  }

  create() {
    zetCamera(this);
    this.ui = this.scene.get('UI');
    this.fase = 'laden';
    this.add.rectangle(0, 0, BREEDTE, HOOGTE, 0x000000).setOrigin(0, 0);

    // links: de beer in de sauna
    this.add.image(4, 5, 'aftiteling_sauna').setOrigin(0, 0);
    this.beer = this.add.sprite(64, 106, 'aftiteling_beer', 1).setOrigin(0.5, 1);
    this.time.addEvent({
      delay: 2600, loop: true,
      callback: () => {
        this.beer.setFrame(0);
        this.time.delayedCall(260, () => this.beer.setFrame(1));
      },
    });
    // stoom van de kachel en zweetdruppels
    this.time.addEvent({ delay: 220, loop: true, callback: () => this.stoom() });
    this.time.addEvent({ delay: 1400, loop: true, callback: () => this.zweet() });
    this.add.rectangle(124, 0, 2, HOOGTE, 0x3a2414).setOrigin(0, 0);

    // rechts: de namen
    this.kolom = this.add.container(KOLOM_X, HOOGTE);
    this.bouwTitels();

    // muziek: de rol loopt precies zo lang als het nummer
    this.ui.vanZwart(700);
    this.laadTekst = tekst(this, KOLOM_X + 30, 74, '...', 'grijs');
    audio.speelEenmaal('outro').then((info) => {
      this.laadTekst.destroy();
      if (info) {
        this.klok = () => audio.nu();
        this.start = info.start;
        this.duur = info.duur;
      } else {
        this.klok = () => performance.now() / 1000;
        this.start = this.klok();
        this.duur = OUTRO_DUUR;
      }
      this.fase = 'rol';
    });
  }

  regel(y, inhoud, kleur, midden = true) {
    const x = midden ? Math.round((KOLOM_B - meet(this, inhoud, kleur)) / 2) : 0;
    const t = tekst(this, x, y, inhoud, kleur);
    this.kolom.add(t);
    return t;
  }

  bouwTitels() {
    let y = 0;
    titels().forEach((item) => {
      if (Array.isArray(item)) {
        const [functie, naam] = item;
        breekAf(this, functie, KOLOM_B).forEach((r) => { this.regel(y, r, 'grijs'); y += 9; });
        this.regel(y, naam, naam === CLAUDE ? 'rood' : 'wit');
        y += 16;
      } else if (item.titel) {
        const naam = beer().toUpperCase();
        const t = this.add.bitmapText(0, y, 'font_titel', naam).setOrigin(0, 0);
        if (t.width > KOLOM_B) t.setScale(KOLOM_B / t.width);
        t.x = Math.round((KOLOM_B - t.width * t.scaleX) / 2);
        this.kolom.add(t);
        y += Math.round(t.height * t.scaleY) + 4;
        this.regel(y, 'en de Duitse streken', 'wit');
        y += 12;
      } else if (item.ruimte) {
        y += item.ruimte;
      } else if (item.kop) {
        this.regel(y, item.kop, 'rood');
        y += 16;
      } else if (item.sprite) {
        const img = this.add.image(26, y + 20, item.sprite, 0).setOrigin(0.5, 1);
        this.kolom.add(img);
        this.regel(y + 6, item.naam, 'wit', false).setX(42);
        y += 24;
      } else if (item.slot) {
        item.slot.forEach((r) => { this.regel(y, r, 'grijs'); y += 10; });
      } else if (item.laatste) {
        this.laatsteY = y;
        this.regel(y, item.laatste, 'wit');
        y += 10;
      }
    });
    // eindpunt: de laatste regel staat precies in het midden als de muziek ophoudt
    this.beginY = HOOGTE + 4;
    this.eindY = Math.round(HOOGTE / 2 - 4 - this.laatsteY);
  }

  stoom() {
    const w = this.add.circle(14 + Phaser.Math.Between(0, 20), 114, 3, 0xf0f0f0, 0.35).setDepth(5);
    this.tweens.add({
      targets: w, y: w.y - Phaser.Math.Between(40, 80), x: w.x + Phaser.Math.Between(-6, 16),
      scale: 3, alpha: 0, duration: 2400, onComplete: () => w.destroy(),
    });
  }

  zweet() {
    const d = this.add.circle(64 + Phaser.Math.Between(-10, 10), 62, 1.2, 0x9cd8f8).setDepth(6);
    this.tweens.add({ targets: d, y: d.y + 22, alpha: 0, duration: 900, ease: 'Quad.easeIn', onComplete: () => d.destroy() });
  }

  update() {
    if (this.fase === 'rol') {
      const p = Phaser.Math.Clamp((this.klok() - this.start) / this.duur, 0, 1);
      this.kolom.y = Math.round(this.beginY + (this.eindY - this.beginY) * p);
      if (p >= 1) this.einde();
    } else if (this.fase === 'klaar') {
      if (invoer.net('a') || invoer.net('start')) this.naarMenu();
    }
  }

  /** Rook, dan zwart, dan het slot. */
  async einde() {
    this.fase = 'rook';
    const rook = this.time.addEvent({
      delay: 40, loop: true,
      callback: () => {
        for (let i = 0; i < 3; i++) {
          const kleur = Phaser.Math.RND.pick([0x9a9aa0, 0xb8b8bc, 0x7a7a80, 0xd0d0d4]);
          const r = this.add.circle(Phaser.Math.Between(-10, BREEDTE + 10), HOOGTE + 10, Phaser.Math.Between(6, 14), kleur, 0.55)
            .setDepth(50);
          this.tweens.add({
            targets: r, y: Phaser.Math.Between(-20, HOOGTE), x: r.x + Phaser.Math.Between(-30, 30),
            scale: Phaser.Math.FloatBetween(2, 4), alpha: 0.85, duration: Phaser.Math.Between(1400, 2600),
          });
        }
      },
    });
    await this.wacht(2600);
    const zwart = this.add.rectangle(0, 0, BREEDTE, HOOGTE, 0x000000).setOrigin(0, 0).setDepth(100).setAlpha(0);
    await new Promise((ok) => this.tweens.add({ targets: zwart, alpha: 1, duration: 1600, onComplete: ok }));
    rook.remove();
    await this.wacht(800);
    const regels = [
      vul('{BEER} overleed niet veel later.'),
      '',
      'Na de sauna wilde hij nog even',
      'lekker douchen.',
      '',
      'Er kwam alleen iets anders dan',
      'water uit de douchekop.',
    ];
    let y = 36;
    for (const r of regels) {
      if (r) {
        const t = tekst(this, Math.round((BREEDTE - meet(this, r, 'wit')) / 2), y, r, 'wit').setDepth(101).setAlpha(0);
        this.tweens.add({ targets: t, alpha: 1, duration: 700 });
        await this.wacht(900);
      }
      y += 11;
    }
    await this.wacht(1400);
    const eind = tekst(this, Math.round((BREEDTE - meet(this, 'EINDE', 'rood')) / 2), y + 8, 'EINDE', 'rood').setDepth(101).setAlpha(0);
    this.tweens.add({ targets: eind, alpha: 1, duration: 900 });
    await this.wacht(1600);
    const knop = 'DRUK OP A VOOR HET MENU';
    const t = tekst(this, Math.round((BREEDTE - meet(this, knop, 'grijs')) / 2), HOOGTE - 14, knop, 'grijs').setDepth(101);
    this.time.addEvent({ delay: 550, loop: true, callback: () => t.setAlpha(t.alpha > 0.5 ? 0 : 1) });
    this.fase = 'klaar';
  }

  wacht(ms) {
    return new Promise((ok) => this.time.delayedCall(ms, ok));
  }

  naarMenu() {
    this.fase = 'weg';
    audio.stopMuziek(0.3);
    this.ui.sluitDialoog();
    this.scene.start('Titel');
  }
}
