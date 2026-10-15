// Bos, deel 2: de patrouille van Feldwebel Uwe.
import { knapOp } from '../core/staat.js';

/** Een verslagen soldaat vlucht het bos in. */
async function vlucht(wereld, ui, audio, id) {
  const p = wereld.persoon(id);
  if (!p) return;
  p.gescript = true;
  audio.sfx('zoef');
  await new Promise((klaar) => {
    wereld.tweens.add({
      targets: p.sprite, alpha: 0, y: p.sprite.y - 4, duration: 450, onComplete: klaar,
    });
  });
  wereld.verwijderPersoon(id);
  await ui.wachtMs(150);
}

export default {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.bos2Gezien) return;
    staat.vlaggen.bos2Gezien = true;
    await ui.zeg([
      'Het bos wordt dichter. Ergens tussen de bomen hoor je laarzen op het pad.',
      'En iemand die heel vals "Ein Prosit" fluit...',
    ]);
  },

  async horst({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.horstVerslagen) return;
    await ui.zeg([
      'HORST: Halt! Patrouille! Wij zoeken ontsnapte Friezen.',
      'HORST: Jij bent een beer. Beren zijn geen Friezen. Toch?',
      'HORST: Zeg eens "Sch-... Schwe-... Scheveningen".',
      'HORST: Hmm. Isch weet eigenlijk zelf niet hoe dat hoort te klinken.',
      'HORST: Maar het klonk verdacht Fries! Ordnung muss sein!',
    ]);
    const uitslag = await wereld.gevecht('horst');
    if (uitslag !== 'gewonnen') return;
    staat.vlaggen.horstVerslagen = true;
    await ui.zeg([
      'HORST: Au! Was war das?! Een... bevroren snack?',
      'HORST: Isch stop ermee. Isch word bakker. In Bad Bentheim. Daar is het rustig.',
    ]);
    await vlucht(wereld, ui, audio, 'horst');
  },

  async jurgen({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.jurgenVerslagen) return;
    await ui.zeg([
      'JÜRGEN: Stehen bleiben! Isch heb gehoord dat Horst is verslagen door een beer.',
      'JÜRGEN: Horst is een slappeling. Hij huilt ook bij Bambi.',
      'JÜRGEN: Isch heb drie jaar commando-training gehad. Bij de Lidl. Op de diepvriesafdeling.',
      'JÜRGEN: Kom maar op!',
    ]);
    const uitslag = await wereld.gevecht('jurgen');
    if (uitslag !== 'gewonnen') return;
    staat.vlaggen.jurgenVerslagen = true;
    await ui.zeg([
      'JÜRGEN: Nein... verslagen met een frikandel. Uitgerekend een frikandel.',
      'JÜRGEN: Als de Feldwebel dit hoort, moet isch een maand latrines poetsen.',
    ]);
    await vlucht(wereld, ui, audio, 'jurgen');
  },

  async uwe({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.uweVerslagen) return;
    await ui.zeg([
      'UWE: So so. Dus JIJ bent die beer die mijn mannen in elkaar slaat.',
      'UWE: Isch ben Feldwebel Uwe. Isch heb nog nooit een gevecht verloren.',
      'UWE: Behalve één keer. Van mijn schoonmoeder. Maar dat telt niet.',
      'UWE: Achter mij ligt de weg naar de vijver. Daar kom jij nooit!',
    ]);
    const uitslag = await wereld.gevecht('uwe');
    if (uitslag !== 'gewonnen') return;
    staat.vlaggen.uweVerslagen = true;
    await ui.zeg([
      'UWE: Unmöglich... Isch... isch ga dit melden. Bij mijn schoonmoeder.',
      'UWE: Pas maar op voor die kikker bij de poel. Die is gevaarlijker dan isch.',
    ]);
    await vlucht(wereld, ui, audio, 'uwe');
    await ui.zeg('Het pad naar het noorden is vrij!');
  },

  async bron({ ui, staat, audio }) {
    const vol = staat.gezondheid >= staat.maxGezondheid
      && Object.keys(staat.ppMax || {}).every((k) => staat.pp[k] >= staat.ppMax[k]);
    await ui.zeg('Een heldere bosbron. Het water is ijskoud en smaakt naar dennennaalden.');
    if (vol) {
      await ui.zeg('{BEER} neemt een slokje. Lekker, maar je was al helemaal fit.');
      return;
    }
    knapOp();
    await ui.zegMetJingle('{BEER} drinkt van de bron en voelt zich weer helemaal fit!', 'herstel');
  },

  async poster({ ui }) {
    await ui.zeg([
      'Er hangt een poster aan het bord: "GEZOCHT: FRIEZEN."',
      '"Herkenbaar aan: klompen, suikerbrood en een taal die klinkt als een hoestbui."',
      '"Beloning: tien rookworsten en een fietsbel." De fietsbel is doorgestreept.',
    ]);
  },

  async stronk({ ui }) {
    await ui.zeg('Een boomstronk. Er ligt een half opgegeten broodje braadworst op.');
  },
};
