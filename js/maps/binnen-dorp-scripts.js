// Gesprekken en spullen in de plaggenhutten en de coffeeshop van Orvelte.
import { geefItem } from '../core/staat.js';
import { ITEMS } from '../core/items.js';
import { openWinkel } from '../ui/winkel.js';
import { beer } from '../core/namen.js';
import { vindOnderduiker } from './volgers.js';

// ------------------------------------------------------------ gemeenschappelijk voor de hutten

const hutSpullen = {
  async bedstee({ ui }) {
    await ui.zeg([
      'Een bedstee: een bed in een kast. Vroeger sliepen ze half rechtop.',
      'Ze dachten dat je doodging als je plat lag. Zo zie je maar.',
    ]);
  },
  async haard({ ui }) {
    await ui.zeg('Een open haard. In de ketel pruttelt erwtensoep. Het ruikt naar thuis. Bijna.');
  },
  async tafeltje({ ui }) {
    await ui.zeg('Een tafeltje met een kaars en een kopje koffie. De koffie is koud.');
  },
};

// ------------------------------------------------------------ coffeeshop De Zwevende Kei

const AANBOD = [
  { id: 'wiet', prijs: 10, zin: 'BERTUS: Goeie keus. Rustig aan, hè. Eén trekje en je loopt als een Drentse koe.' },
  { id: 'hasj', prijs: 12, zin: 'BERTUS: Ah, de klassieker. Mijn opa rookte dit al. Die werd honderd. Of dat dacht hij.' },
];

async function koop({ ui, staat, audio }, a) {
  const naam = ITEMS[a.id].naam;
  const keuze = await ui.vraag(`BERTUS: ${naam}? Dat is dan €${a.prijs}.`, ['KOPEN', 'NEE']);
  if (keuze !== 0) {
    await ui.zeg('BERTUS: Geen probleem, man. Geen stress.');
    return;
  }
  if ((staat.geld || 0) < a.prijs) {
    await ui.zeg([
      'BERTUS: Hmm. Daar heb je net niet genoeg voor, vriend.',
      'BERTUS: Geen pof, hè. Ik ben Kikker niet.',
    ]);
    return;
  }
  staat.geld -= a.prijs;
  geefItem(a.id);
  audio.sfx('kassa');
  await ui.zeg(`${beer()} kocht ${naam} en stopte het in de RUGZAK.`);
  await ui.zeg(a.zin);
}

export const coffeeshopScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.coffeeshopGezien) return;
    staat.vlaggen.coffeeshopGezien = true;
    await ui.zeg([
      'Binnen hangt een dikke, zoete walm. Uit de speakers klinkt 8-bit reggae.',
      'Op de bank ligt een Duitse soldaat. Hij lijkt niet van plan om op te staan.',
    ]);
  },

  async bertus(ctx) {
    const { ui, staat } = ctx;
    if (!staat.vlaggen.bertusGesproken) {
      staat.vlaggen.bertusGesproken = true;
      await ui.zeg([
        'BERTUS: Moi moi, welkom in De Zwevende Kei.',
        'BERTUS: Ben je wel achttien? ...Beren zijn volwassen als ze drie zijn. Prima.',
        'BERTUS: Ik heb WIET en HASJ. Alles biologisch, uit eigen kas achter de molen.',
        'BERTUS: Goed tegen pijn, stress en Duitsers. Nou ja, niet tegen Duitsers. Die komen er juist op af.',
      ]);
    } else {
      await ui.zeg('BERTUS: Moi. Nog wat nodig, man?');
    }
    await openWinkel(ui, {
      titel: 'DE KEI',
      aanbod: () => AANBOD.map((a) => ({ id: a.id, prijs: `€${a.prijs}` })),
      kies: (regel) => koop(ctx, AANBOD.find((a) => a.id === regel.id)),
    });
    await ui.zeg('BERTUS: Peace, beer. En pas op voor die jongens buiten met hun fatbikes.');
  },

  async karlheinz({ ui }) {
    await ui.zeg([
      'KARL-HEINZ: Ahh... ein Bär. Een heel... mooie... Bär.',
      'KARL-HEINZ: Isch ben niet in dienst. Isch ben in de wolken.',
      'KARL-HEINZ: Als de Feldwebel vraagt waar isch ben: op patrouille. Een héél langzame patrouille.',
    ]);
  },

  async poster({ ui }) {
    await ui.zeg('Een poster in rood, geel en groen met de tekst ONE LOVE. Iemand heeft er ONE LOAF van gemaakt. Vast de molenaar.');
  },

  async menubord({ ui }) {
    await ui.zeg([
      'MENU: Wiet - €10. Hasj - €12.',
      'Spacecake - UITVERKOCHT (Karl-Heinz).',
    ]);
  },

  async plant({ ui }) {
    await ui.zeg('Een plant in een pot. Hij groeit verdacht goed.');
  },

  async bank({ ui }) {
    await ui.zeg('Een oude bruine bank. Er zit een Duitser half in weggezakt. Hij is één geworden met de kussens.');
  },

  async asbak({ ui, staat, audio }) {
    if (staat.vlaggen.asbakEuro) {
      await ui.zeg('Een volle asbak. Verder niks bijzonders.');
      return;
    }
    staat.vlaggen.asbakEuro = true;
    staat.geld = (staat.geld || 0) + 2;
    audio.sfx('kassa');
    await ui.zeg(['Een volle asbak op een bijzettafeltje.', 'Tussen de peuken liggen twee euro. {BEER} steekt ze in zijn zak.']);
  },

  async boxen({ ui }) {
    await ui.zeg('Uit de speakers klinkt reggae in 8-bit. Je hoofd gaat vanzelf mee op de maat.');
  },
};

// ------------------------------------------------------------ plaggenhut 1: Jantina

export const hut1Scripts = {
  ...hutSpullen,
  async jantina({ ui, staat }) {
    if (!staat.vlaggen.jantinaKoffie) {
      staat.vlaggen.jantinaKoffie = true;
      await ui.zeg([
        'JANTINA: Kom d\'r in, kom d\'r in! Moi! Wil ie een kop koffie? Ik heb krentenbrood.',
        'JANTINA: Hier, neem maar mee voor onderweg. Ie bint veuls te mager. Veur een beer.',
      ]);
      await ui.krijgItem('voedselbon', 2, 'kreeg');
      return;
    }
    if (staat.vlaggen.dorpQuest && !staat.vlaggen.gevonden_wiebe) {
      await ui.zeg([
        'JANTINA: Mien buurman Lammert koopt de leste tied zoveul brood. En hij is zo dun as een bonenstaak.',
        'JANTINA: Ik zeg niks. Ik zeg allent: dat luik in zien vloer, dat ging vroeger nooit lös.',
      ]);
      return;
    }
    await ui.zeg('JANTINA: Nog een bakkie? Nee? Dan ga ie mar weer, hoor. Pas goed op ieself.');
  },
  async spinnewiel({ ui }) {
    await ui.zeg('Een spinnewiel. Jantina spint er wol mee voor sokken. Voor de hele familie. Ook voor de Duitsers, zegt ze. Met kriebelwol.');
  },
};

// ------------------------------------------------------------ plaggenhut 2: Lammert (en Wiebe onder de vloer)

export const hut2Scripts = {
  ...hutSpullen,
  async lammert({ ui, staat }) {
    if (staat.vlaggen.gevonden_wiebe) {
      await ui.zeg([
        'LAMMERT: Wiebe was mien beste maat. Elke winter gingen wij samen op de schaats.',
        'LAMMERT: Hoe kon ie dat doen, beer? Hoe kon ie dat doen?',
      ]);
      return;
    }
    await ui.zeg([
      'LAMMERT: Wat mot ie? Ik heb niks. Ik weet niks. Ik bin niks.',
      'LAMMERT: En van dat luik blief ie af. Daar liggen de eerpels.',
    ]);
  },

  async luik(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.gevonden_wiebe) {
      await ui.zeg('Onder het luik liggen alleen nog aardappels. En een lege fles Beerenburg.');
      return;
    }
    if (!staat.vlaggen.dorpQuest) {
      await ui.zeg([
        'Een luik in de vloer.',
        'Van onderen klinkt een zacht gesnurk. Aardappels snurken toch niet?',
      ]);
      return;
    }
    audio.sfx('deur');
    staat.vlaggen.luikOpen = true;
    wereld.vernieuwObject('luik');
    await ui.zeg([
      'Je tilt het luik op.',
      'Tussen de aardappels ligt een oude man met een pet. Hij snurkt. Er ligt een lege fles Beerenburg naast hem.',
    ]);
    const l = wereld.persoon('lammert');
    if (l) l.kijk('rechts');
    await vindOnderduiker(ctx, 'wiebe', {
      vondst: 'Je hebt een onderduiker gevonden: WIEBE!',
      reactie: [
        'WIEBE: Hè? Wat? Is it al moarn?',
        'WIEBE: Och nee. In bear. Mei handboeien. Dat is nea in goed teken.',
      ],
    });
  },
};

// ------------------------------------------------------------ plaggenhut 3: Airbnb

export const hut3Scripts = {
  ...hutSpullen,
  async daan({ ui, staat }) {
    if (staat.vlaggen.dorpQuest && !staat.vlaggen.dorpKlaar) {
      await ui.zeg([
        'DAAN: Onderduikers? Nee joh, hier niet. Ik heb deze hut tot en met zondag.',
        'DAAN: Al zou het wel authentiek zijn. Dan kan ik er een hoger cijfer voor geven.',
      ]);
      return;
    }
    await ui.zeg([
      'DAAN: Hoi! Ik ben Daan, uit Amsterdam. Ik huur deze plaggenhut via Airbnb.',
      'DAAN: Vierhonderd euro per nacht. Geen wifi, en de wc is een emmer. Super authentiek.',
      'DAAN: Die soldaten bij de slagboom horen er ook bij, toch? Een soort... beleving?',
    ]);
  },
};
