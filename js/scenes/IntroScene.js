// Kennismaking met de directeur van het vakantiepark (zoals de professor aan het begin
// van een klassieke monster-RPG), met een korte intake. Daarna een overgang naar de barak.
import { zetCamera } from '../core/constanten.js';
import { audio } from '../core/audio.js';
import { staat } from '../core/staat.js';

const ONTBIJT = [
  { label: 'KRENTENBOLLEN', naam: 'Krentenbollen', reactie: 'DIRECTEUR: Krentenbollen! Een echte Drent. Ik heb er zelf vandaag ook al drie op.' },
  { label: 'PANNENKOEKEN', naam: 'Pannenkoeken', reactie: 'DIRECTEUR: Pannenkoeken, met stroop hoop ik. Ik geef het door aan de keuken.' },
  { label: 'ONTBIJTKOEK', naam: 'Ontbijtkoek', reactie: 'DIRECTEUR: Ontbijtkoek! Stevig spul. Daarmee sjouw je een hele dag door de heide.' },
];

const HOBBY = [
  {
    label: 'ZWEMMEN', naam: 'Zwemmen',
    reactie: 'DIRECTEUR: Zwemmen! Ons subtropisch zwembad heeft een wildwaterbaan. Als de Duitsers die tenminste niet hebben ingepikt...',
  },
  {
    label: 'FIETSEN', naam: 'Fietsen',
    reactie: 'DIRECTEUR: Fietsen! Drenthe is zo plat als een dubbeltje. Al moet je wel oppassen met je fietsverlichting. Daarover zo meer.',
  },
  {
    label: 'NIKSEN', naam: 'Niksen',
    reactie: 'DIRECTEUR: Niksen! Een beer naar mijn hart. Daar heb ik zelf jaren op gestudeerd.',
  },
];

export class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Intro' });
  }

  create() {
    zetCamera(this);
    this.ui = this.scene.get('UI');
    this.add.image(0, 0, 'bg_intro').setOrigin(0, 0);
    this.directeur = this.add.sprite(120, 108, 'directeur', 0).setOrigin(0.5, 1).setAlpha(0);
    this.beer = this.add.sprite(176, 108, 'beer_groot', 0).setOrigin(0.5, 1).setAlpha(0);

    // knipperen en sigarenrook
    this.time.addEvent({
      delay: 3100, loop: true,
      callback: () => {
        this.directeur.setFrame(1);
        this.time.delayedCall(150, () => this.directeur.setFrame(0));
      },
    });
    this.time.addEvent({ delay: 650, loop: true, callback: () => this.rookwolkje() });

    audio.speelMuziek('intake');
    this.verhaal();
  }

  rookwolkje(groot = false) {
    if (this.directeur.alpha < 0.5) return;
    const x = this.directeur.x + 15;
    const y = this.directeur.y - 38;
    const wolk = this.add.circle(x, y, groot ? 2 : 1, 0xe8e8f0, 0.85);
    this.tweens.add({
      targets: wolk,
      x: x + Phaser.Math.Between(2, 7),
      y: y - Phaser.Math.Between(12, 20),
      scale: groot ? 3 : 2.2,
      alpha: 0,
      duration: groot ? 1800 : 1400,
      onComplete: () => wolk.destroy(),
    });
  }

  verschijn(sprite, ms = 500) {
    return new Promise((klaar) => this.tweens.add({ targets: sprite, alpha: 1, duration: ms, onComplete: klaar }));
  }

  verdwijn(sprite, ms = 400) {
    return new Promise((klaar) => this.tweens.add({ targets: sprite, alpha: 0, duration: ms, onComplete: klaar }));
  }

  schuif(sprite, x, ms = 450) {
    return new Promise((klaar) => this.tweens.add({ targets: sprite, x, duration: ms, ease: 'Sine.easeInOut', onComplete: klaar }));
  }

  async trekAanSigaar() {
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 120, () => this.rookwolkje(true));
    }
    await this.ui.wachtMs(300);
  }

  async verhaal() {
    const ui = this.ui;
    await ui.script(async () => {
      await ui.vanZwart(500);
      await ui.wachtMs(300);
      await this.verschijn(this.directeur, 700);
      await ui.zeg([
        'DIRECTEUR: Hallo daar! Welkom in de wondere wereld van Drenthe!',
        'DIRECTEUR: Mijn naam is Harm Rookhuys. Maar de meeste mensen noemen mij gewoon... de directeur.',
        'DIRECTEUR: Ik ben de directeur van {PARK}, het mooiste vakantiepark van heel Drenthe!',
        'DIRECTEUR: Dennenbossen, hunebedden, een subtropisch zwembad... en de beste frikandellen van de provincie.',
      ]);
      await this.trekAanSigaar();
      await ui.zeg([
        'DIRECTEUR: *pfffff*',
        'DIRECTEUR: Maar ja. De tijden zijn veranderd.',
        'DIRECTEUR: Het is 2026, maar het voelt als 1940. De Duitsers zijn de grens weer over gekomen.',
        'DIRECTEUR: Niet met een caravan dit keer, maar in ouderwetse uniformen, met stalen helmen en heel veel regels.',
        'DIRECTEUR: Ze hebben heel Drenthe ingepikt. Zelfs de ligbedden bij het zwembad. Zoals altijd eigenlijk.',
        'DIRECTEUR: Maar genoeg over mij. Laten we beginnen met de intake!',
      ]);

      await Promise.all([this.schuif(this.directeur, 64), this.verschijn(this.beer, 600)]);
      for (;;) {
        const ja = await ui.vraag('DIRECTEUR: Aha! Dus jij bent {BEER}?');
        if (ja === 0) break;
        await ui.zeg('DIRECTEUR: Hm? Er staat toch echt {BEER} op de reservering. Ik vraag het nog één keer.');
      }
      await ui.zeg('DIRECTEUR: Welkom, {BEER}! Dan nog twee vragen voor de intake.');

      const o = await ui.vraag('DIRECTEUR: Wat eet jij het liefst bij het ontbijt?', ONTBIJT.map((x) => x.label), { annuleer: -1 });
      staat.intake.ontbijt = ONTBIJT[o].naam;
      await ui.zeg(ONTBIJT[o].reactie);

      const h = await ui.vraag('DIRECTEUR: En wat doe je het liefst op vakantie?', HOBBY.map((x) => x.label), { annuleer: -1 });
      staat.intake.hobby = HOBBY[h].naam;
      await ui.zeg(HOBBY[h].reactie);

      await this.trekAanSigaar();
      await ui.zeg([
        'DIRECTEUR: Mooi, dan is je reservering bijna rond. Alleen... is er een klein probleempje.',
        'DIRECTEUR: Op weg naar {PARK} ben je aangehouden door een Duitse patrouille.',
        'DIRECTEUR: Je fietsverlichting deed het niet. Daar zijn ze tegenwoordig érg streng in.',
        'DIRECTEUR: Nu zit je vast in Kamp Westerbork. Barak 7, om precies te zijn.',
        'DIRECTEUR: Je moet daar zien te ontsnappen en helemaal naar {PARK} zien te komen. Langs Orvelte, Wezup en Aalden.',
        'DIRECTEUR: Onderweg kom je vast heel wat Duitsers tegen. Laat je niet kisten!',
        'DIRECTEUR: Je huisje staat klaar en de sleutel ligt bij de receptie. O ja, en het zwembad sluit om tien uur.',
      ]);
      await this.verdwijn(this.directeur, 500);
      await this.schuif(this.beer, 120, 500);
      await ui.zeg('{BEER}! Jouw avontuur in de Duitse streken begint nu!');
      await this.krimpOvergang();
    });
    this.scene.start('Wereld', { nieuw: true });
  }

  async krimpOvergang() {
    const ui = this.ui;
    ui.sluitDialoog();
    audio.stopMuziek(1.2);
    audio.sfx('zoef');
    await ui.wachtMs(200);
    await new Promise((klaar) => {
      this.tweens.add({
        targets: this.beer,
        scaleX: 0.33,
        scaleY: 0.36,
        y: 96,
        duration: 900,
        ease: 'Cubic.easeIn',
        onComplete: klaar,
      });
      this.time.delayedCall(450, () => ui.naarWit(450));
    });
    await ui.wachtMs(250);
    await ui.naarZwart(350);
  }
}
