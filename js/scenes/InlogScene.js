// Inloggen of een nieuwe speler aanmaken (spelersnaam + pincode van 6 cijfers).
import { zetCamera, BREEDTE, HOOGTE } from '../core/constanten.js';
import { NaamInvoer } from '../ui/naaminvoer.js';
import { PinInvoer } from '../ui/pininvoer.js';
import { audio } from '../core/audio.js';
import { account, login, registreer, laatsteSpelersnaam } from '../core/account.js';
import { laadNamen, heeftNamen } from '../core/namen.js';

// Zelfde regels als de server: letters, cijfers, spatie, punt, apostrof en streepje.
const TOEGESTAAN = /^[A-Za-z0-9À-ÿ.'-]$/;

export class InlogScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Inlog' });
  }

  create() {
    zetCamera(this);
    this.ui = this.scene.get('UI');
    this.achtergrond = this.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0);
    audio.speelMuziek('intro');
    this.verloop();
  }

  update(tijd, delta) {
    this.achtergrond.tilePositionX += delta * 0.01;
    this.achtergrond.tilePositionY += delta * 0.01;
  }

  async vraagNaam(vraag, start = '') {
    return this.ui.open(new NaamInvoer(this.ui, {
      vraag, max: 16, min: 3, icoon: 'speler', start, toegestaan: TOEGESTAAN,
    }));
  }

  async vraagPin(vraag, uitleg) {
    return this.ui.open(new PinInvoer(this.ui, { vraag, uitleg }));
  }

  async verloop() {
    const ui = this.ui;
    await ui.script(async () => {
      await ui.vanZwart(400);
      await ui.zeg([
        'Welkom!',
        'Met een spelersnaam en een pincode kun je op elk apparaat verder spelen waar je gebleven was.',
      ]);
      let naam = laatsteSpelersnaam();
      for (;;) {
        const keuze = await ui.vraag('Wat wil je doen?', ['INLOGGEN', 'NIEUWE SPELER'], { annuleer: -1 });
        if (keuze === 0) {
          naam = await this.vraagNaam('Wat is je spelersnaam?', naam);
          const pin = await this.vraagPin('Wat is je pincode?');
          ui.sluitGevraagd = false;
          await ui.dialoog.toon('Even kijken...', { wachtAanEinde: false });
          const r = await login(naam, pin);
          if (!r.ok) {
            audio.sfx('fout');
            await ui.zeg(r.fout);
            continue;
          }
          await ui.zeg(`Welkom terug, ${account.naam}!`);
          break;
        }
        naam = await this.vraagNaam('Kies een spelersnaam', '');
        const pin1 = await this.vraagPin('Kies een pincode van 6 cijfers', 'Onthoud hem goed!');
        const pin2 = await this.vraagPin('Typ je pincode nog een keer');
        if (pin1 !== pin2) {
          audio.sfx('fout');
          await ui.zeg('De twee pincodes zijn niet hetzelfde. Probeer het nog een keer.');
          continue;
        }
        ui.sluitGevraagd = false;
        await ui.dialoog.toon('Even aanmelden...', { wachtAanEinde: false });
        const r = await registreer(naam, pin1);
        if (!r.ok) {
          audio.sfx('fout');
          await ui.zeg(r.fout);
          continue;
        }
        await ui.zeg([
          `Welkom, ${account.naam}!`,
          'Onthoud je spelersnaam en pincode goed. Daarmee speel je op elk apparaat verder.',
        ]);
        break;
      }
      laadNamen(account.profiel);
      await ui.naarZwart(500);
    });
    this.scene.start(heeftNamen() ? 'Titel' : 'Setup');
  }
}
