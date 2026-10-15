// Eerste keer openen: de speler kiest de naam van het vakantiepark en de beer.
import { zetCamera, BREEDTE, HOOGTE } from '../core/constanten.js';
import { NaamInvoer } from '../ui/naaminvoer.js';
import { audio } from '../core/audio.js';
import { zetNamen, heeftNamen, park, beer, MAX_BEERNAAM, MAX_PARKNAAM } from '../core/namen.js';

export class SetupScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Setup' });
  }

  create() {
    zetCamera(this);
    this.ui = this.scene.get('UI');
    this.achtergrond = this.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0);
    audio.speelMuziek('intro');
    this.vraagNamen();
  }

  update(tijd, delta) {
    this.achtergrond.tilePositionX += delta * 0.01;
    this.achtergrond.tilePositionY += delta * 0.01;
  }

  async vraagNamen() {
    const ui = this.ui;
    const hadNamen = heeftNamen();
    let parknaam = hadNamen ? park() : '';
    let beernaam = hadNamen ? beer() : '';
    await ui.script(async () => {
      await ui.vanZwart(400);
      await ui.zeg([
        'Welkom!',
        'Voordat het avontuur begint, mag jij twee namen bedenken.',
        'Eerst: hoe heet het vakantiepark waar de beer zo graag naartoe wil?',
      ]);
      for (;;) {
        parknaam = await ui.open(new NaamInvoer(ui, {
          vraag: 'Hoe heet het vakantiepark?', max: MAX_PARKNAAM, icoon: 'park', start: parknaam,
        }));
        await ui.zeg('En hoe heet de beer, de held van dit verhaal?');
        beernaam = await ui.open(new NaamInvoer(ui, {
          vraag: 'Hoe heet de beer?', max: MAX_BEERNAAM, icoon: 'beer', start: beernaam,
        }));
        const klopt = await ui.vraag(`Het vakantiepark heet ${parknaam} en de beer heet ${beernaam}. Klopt dat?`);
        if (klopt === 0) break;
        await ui.zeg('Geen probleem. Dan doen we het nog een keer.');
      }
      zetNamen(parknaam, beernaam);
      await ui.zeg(`Top! ${beernaam} staat klaar voor het grote avontuur.`);
      await ui.naarZwart(500);
    });
    this.scene.start('Titel');
  }
}
