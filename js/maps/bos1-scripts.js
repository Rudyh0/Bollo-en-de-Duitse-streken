// Bos, deel 1: de kist met de bevroren frikandel.
import { leerAanval } from '../core/staat.js';

export default {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.bos1Gezien) return;
    staat.vlaggen.bos1Gezien = true;
    await ui.zeg([
      'Het kamp ligt achter je. Om je heen staan alleen nog dennenbomen.',
      'Het ruikt hier naar hars, mos en vrijheid. Vooral naar mos.',
    ]);
  },

  async kist({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.frikandelKist) {
      await ui.zeg('De kist is leeg. Er hangt nog een vage geur van frituurvet.');
      return;
    }
    audio.sfx('kist');
    staat.vlaggen.frikandelKist = true;
    wereld.vernieuwObject('kist');
    await ui.zeg([
      'Je opent de kist. Er komt een wolk ijskoude lucht uit.',
      'Op de bodem ligt een briefje: "NOODVOORRAAD VAN DE KOMMANDANT. NICHT ANFASSEN!"',
      'Onder het briefje ligt...',
    ]);
    audio.sfx('ijs');
    wereld.cameras.main.flash(250, 200, 230, 255);
    await ui.zeg('...een BEVROREN FRIKANDEL! Hij is zo hard als een baksteen.');
    leerAanval('frikandel', 10);
    await ui.zegMetJingle('{BEER} leert de aanval BEVROREN FRIKANDEL!', 'aanval');
    await ui.zeg([
      'Hiermee sla je harder dan met de soeplepel, maar je mist ook wat vaker.',
      'Een snack én een wapen. Echt Hollands: niets gaat verloren.',
    ]);
  },

  async bord({ ui }) {
    await ui.zeg([
      'BOSWACHTERIJ DRENTHE. Honden aan de lijn. Friezen ook.',
      'Iemand heeft eronder gekrast: "Kikker zit bij de poel. Vraag naar de aanbiedingen."',
    ]);
  },

  async stronk({ ui }) {
    await ui.zeg('Een boomstronk. Iemand heeft er "HIER WAS DIETER" in gekerfd. Met een mesje, zo te zien.');
  },

  async terug({ ui }) {
    await ui.zeg('Terug naar het kamp? Mooi niet. Daar zijn ze nu vast heel boos over die rook.');
  },

  async verder({ ui, wereld, staat }, { warp }) {
    if (!staat.vlaggen.frikandelKist) {
      await ui.zeg([
        'Tussen de bomen aan de westkant glinstert iets...',
        'Misschien moet je dat eerst even bekijken voordat je verder gaat.',
      ]);
      return;
    }
    wereld.gaNaar('bos2', warp.x === 18 ? 4 : 5, 22, 'omhoog');
  },
};
