// Alle gebeurtenissen en gesprekken in Barak 7.
// Elk script krijgt { ui, wereld, staat, audio } en eventueel { x, y, persoon }.

const BEDTEKSTEN = [
  'Een stapelbed. Het ruikt naar natte sokken.',
  'Iemand heeft een tekening van een frikandel boven het bed geprikt.',
  'Onder het kussen ligt een legpuzzel van de Hondsrug. Er mist één stukje.',
  'Een stapelbed. Het kraakt al als je er alleen maar naar kijkt.',
  'In het bovenste bed ligt iemand zachtjes te snurken.',
  'Op het matras ligt een stapel stripboeken. Allemaal deel 3.',
];

export default {
  async binnenkomst({ ui }, { nieuw }) {
    if (!nieuw) return;
    ui.ooglidBoven.setVisible(true).y = 0;
    ui.ooglidOnder.setVisible(true).y = 80;
    await ui.vanZwart(10);
    await ui.ogenOpen();
    await ui.zeg([
      '{BEER} wordt wakker in barak 7 van Kamp Westerbork.',
      'Het ruikt hier naar natte jassen en slappe koffie.',
      'Tijd voor een ontsnappingsplan. Misschien weten de andere gevangenen meer.',
      '(Tip: druk op START of Esc om het menu te openen.)',
    ]);
    ui.toonLocatie('BARAK 7');
  },

  async henk({ ui, staat }) {
    if (!staat.vlaggen.henkGesproken) {
      staat.vlaggen.henkGesproken = true;
      await ui.zeg([
        'HENK: Zo, ben jij de nieuwe? Ik ben Henk.',
        'HENK: Ik zit hier al sinds de Duitsers de bingoavond hebben verboden.',
        'HENK: Als je hier weg wilt, heb je spullen nodig. Kijk eens goed om je heen, jong.',
      ]);
      return;
    }
    if (staat.vlaggen.kistOpen) {
      await ui.zeg([
        'HENK: Een soeplepel? Bewaar die maar goed.',
        'HENK: Ik heb in mijn leven al heel wat opgelost met een soeplepel.',
      ]);
      return;
    }
    await ui.zeg('HENK: Die kachel geeft net zoveel warmte als een theelichtje. Maar beter dan niks.');
  },

  async fenna({ ui, staat }) {
    if (staat.vlaggen.kistOpen) {
      await ui.zeg([
        'FENNA: Voedselbonnen! Daar krijg je bij de keuken eten voor.',
        'FENNA: Gebruik ze als je je slap voelt. Druk op START en kies RUGZAK.',
      ]);
      return;
    }
    await ui.zeg([
      'FENNA: Psst! Ik zag gisteravond een wachter iets onder een van de bedden schuiven.',
      'FENNA: Ergens bij de bedden tegen de achterwand, aan de linkerkant. Ik durf zelf niet te kijken.',
    ]);
  },

  async kist({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.kistOpen) {
      await ui.zeg('Het kistje onder het bed is leeg.');
      return;
    }
    await ui.zeg('Onder het bed steekt een houten kistje uit!');
    if (await ui.vraag('Wil je het openen?') !== 0) {
      await ui.zeg('Je laat het kistje met rust.');
      return;
    }
    audio.sfx('kist');
    staat.vlaggen.kistOpen = true;
    wereld.zetObjectTextuur('kist', 'obj_kist_open');
    await ui.wachtMs(350);
    await ui.krijgItem('voedselbon', 3);
    await ui.krijgItem('soeplepel', 1);
  },

  async eigenBed({ ui, staat }) {
    await ui.zeg('Dit is jouw bed. Het matras is zo dun als een boterham.');
    if (staat.gezondheid < staat.maxGezondheid) {
      await ui.zeg('Je probeert nog even te slapen, maar je maag knort veel te hard.');
    }
  },

  async bed({ ui }, { x, y }) {
    await ui.zeg(BEDTEKSTEN[(x * 7 + y * 3) % BEDTEKSTEN.length]);
  },

  async raam1({ ui }) {
    await ui.zeg('Door het raam zie je prikkeldraad, een wachttoren en heel veel Drentse heide.');
  },

  async raam2({ ui }) {
    await ui.zeg('In de verte zie je de bossen richting Orvelte. Ergens daarachter ligt {PARK}...');
  },

  async raam3({ ui }) {
    await ui.zeg([
      'Buiten loopt een Duitse wachter voorbij. Hij eet een braadworst.',
      'Het ruikt verdacht lekker.',
    ]);
  },

  async prikbord({ ui }) {
    await ui.zeg([
      'Op het prikbord hangt een briefje:',
      'KAMPREGELS. 1: Niet ontsnappen. 2: Niet klagen over het eten. 3: Zie regel 1.',
      "Iemand heeft eronder gekrabbeld: 'Regel 4: handdoeken NIET op de ligbedden leggen!'",
    ]);
  },

  async deur({ ui, staat, audio }) {
    audio.sfx('deur');
    if (staat.vlaggen.deurGeprobeerd) {
      await ui.zeg('De deur zit nog steeds op slot. Buiten hoor je de wachter fluiten.');
      return;
    }
    staat.vlaggen.deurGeprobeerd = true;
    await ui.zeg([
      'De deur zit op slot.',
      'Van buiten klinkt een stem...',
      'WACHTER: Ruhe daarrr binnen! Isch hoorrr jullie wel, ja?',
      'WACHTER: Niemand gaat errr naarrr buiten! Ordnung muss sein!',
      'Hmm. Zo kom je er in elk geval niet uit.',
    ]);
  },

  async tafel({ ui }) {
    await ui.zeg([
      'Een lange houten tafel. Iemand heeft er een potje boter-kaas-en-eieren in gekrast.',
      'Kruisje heeft gewonnen. Natuurlijk.',
    ]);
  },

  async kachel({ ui }) {
    await ui.zeg('Een oude kolenkachel. Hij is lauw. Net als de koffie hier.');
  },

  async emmer({ ui }) {
    await ui.zeg('Een emmer met water. Hopelijk is het water.');
  },
};
