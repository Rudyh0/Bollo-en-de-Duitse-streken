// Het natuurgebied: boer Lubbert, de Duitsers op verlof bij de Blue Lagoon (en hun vissen),
// en Kurt, die op het strandje in een kuil ligt te wachten.
import { aantal, neemItem } from '../core/staat.js';
import { vis } from '../ui/vissen.js';

const tween = (scene, cfg) => new Promise((klaar) => scene.tweens.add({ ...cfg, onComplete: klaar }));

// ================================================================== 1. de landweg

export const landwegScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.landwegGezien) return;
    staat.vlaggen.landwegGezien = true;
    await ui.zeg([
      'Een smalle landweg tussen de weilanden. Het ruikt naar gras, koeien en diesel.',
      'In plaats van auto\'s rijden hier trekkers. En legervoertuigen. Die trekkers rijden harder.',
    ]);
  },

  async lubbert({ ui, staat }) {
    if (staat.vlaggen.lubbertBrood) {
      await ui.zeg('LUBBERT: Goed gaon, beer. En niet over de weg lopen, daor rijdt die gekke Duutsers.');
      return;
    }
    staat.vlaggen.lubbertBrood = true;
    await ui.zeg([
      'LUBBERT: Moi! Bist d\'r ok één van die Duutsers?',
      'LUBBERT: Nee? Een beer! Nou, dat zie ie ok niet elke dag. Zeker niet mit zo\'n muts.',
      'LUBBERT: Die Duutsers rijt hier de hele dag mit heur tanks over mien landweg. Mien koenen geeft d\'r gien melk meer van.',
      'LUBBERT: Hier, nim ies wat mee veur onderweg. Een stuk roggebrood mit spek.',
    ]);
    await ui.krijgItem('voedselbon', 1, 'kreeg');
  },

  async koe({ ui, audio }) {
    audio.sfx('boe');
    const zinnen = [
      ['KOE: Boe.', 'De koe kijkt je aan en herkauwt. Ze heeft geen mening over de bezetting.'],
      ['KOE: Boeeeee.', 'Ze geeft al een week geen melk meer. Uit protest, zegt de boer.'],
      ['KOE: Boe?', 'Je hebt het gevoel dat ze meer weet dan ze zegt.'],
    ];
    await ui.zeg(zinnen[Math.floor(Math.random() * zinnen.length)]);
  },

  async bord({ ui }) {
    await ui.zeg([
      'NATUURGEBIED. Honden aan de lijn. Tanks over de weg.',
      'Iemand heeft eronder gekrast: "Naar de Blue Lagoon -->". Er zijn al heel veel voetstappen die kant op.',
    ]);
  },

  async boerderij({ ui }) {
    await ui.zeg('De boerderij van Lubbert. Op de deeldeur hangt een bordje: "VERSE EIEREN. NIET VOOR DUUTSERS."');
  },

  async melkbussen({ ui }) {
    await ui.zeg('Lege melkbussen. Op eentje staat met krijt: "STAKING".');
  },

  async hooibaal({ ui }) {
    await ui.zeg('Een hooibaal in wit plastic. De Drentse marshmallow.');
  },
};

// ================================================================== 2. de Drentse Blue Lagoon

const VISPLEKKEN = {
  visA: { vis: 'baars', vlag: 'visA', vangst: 'Hij is groen-gestreept en kijkt heel boos.' },
  visB: { vis: 'snoek', vlag: 'visB', vangst: 'Lang, glibberig en vol tanden. Niet in je vinger laten bijten.' },
  visC: { vis: 'karper', vlag: 'visC', vangst: 'Een dikke! Hij is waarschijnlijk ouder dan jij.' },
};

const aantalVissen = (staat) => ['visA', 'visB', 'visC'].filter((v) => staat.vlaggen[v]).length;

async function visplek(ctx, { x, y }, naam) {
  const { ui, wereld, staat } = ctx;
  const plek = VISPLEKKEN[naam];
  if (staat.vlaggen.visKlaar) {
    await ui.zeg('Het water is helder blauw. Je ziet de vissen zwemmen. Ze lachen je uit.');
    return;
  }
  if (!aantal('hengel')) {
    await ui.zeg('Het water is helder blauw en er zwemmen vissen. Had je maar een hengel...');
    return;
  }
  if (staat.vlaggen[plek.vlag]) {
    await ui.zeg('Hier heb je al een vis gevangen. Probeer een andere stek.');
    return;
  }
  const uitkomst = await vis(ui, wereld, { x, y });
  if (uitkomst === 'gevangen') {
    staat.vlaggen[plek.vlag] = true;
    await ui.krijgItem(plek.vis, 1, 'ving');
    await ui.zeg(plek.vangst);
    const n = aantalVissen(staat);
    await ui.zeg(n >= 3
      ? 'Drie vissen van drie verschillende plekken! Breng ze naar Heinz.'
      : `Nog ${3 - n} ${3 - n === 1 ? 'vis' : 'vissen'} te gaan. Op een andere plek.`);
  } else if (uitkomst === 'te_vroeg') {
    await ui.zeg('Te vroeg! De vis schrikt en zwemt weg. Wacht tot de dobber écht onder gaat.');
  } else if (uitkomst === 'te_laat') {
    await ui.zeg('Te laat! De vis heeft je aas opgegeten en is ervandoor.');
  } else {
    await ui.zeg('Je haalt je lijn weer binnen.');
  }
}

export const laguneScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.laguneGezien) return;
    staat.vlaggen.laguneGezien = true;
    await ui.zeg([
      'De Drentse Blue Lagoon: knalblauw water, spierwit zand. Net de Malediven. Maar dan met dennenbomen.',
      'Op het strandje klinkt schlagermuziek. Een paar Duitsers staan te barbecueën. In zwembroek.',
    ]);
  },

  async heinz({ ui, staat, audio }) {
    if (staat.vlaggen.visKlaar) {
      await ui.zeg('HEINZ: Smakelijk, hè, die vis? Gute Reise, Bär! En als je een Duitser in uniform tegenkomt: wij hebben je nooit gezien.');
      return;
    }
    if (!staat.vlaggen.hengelGekregen) {
      await ui.zeg([
        'HEINZ: Ach, ein Bär! Keine Panik, wir haben Urlaub. Wij hebben verlof! Vandaag vechten wij niet.',
        'HEINZ: Vandaag... grillen wij! Alleen is de worst op. Rüdiger heeft alles opgegeten.',
        'HEINZ: Maar jij bent een beer. Beren kunnen vissen, dat zie je altijd op de tv.',
        'HEINZ: Hier, mijn hengel. Vang drie vissen. Van drie verschillende stekken, anders is het niet gezellig.',
        'HEINZ: Breng ze bij mij, dan mag jij verder. Isch ben op vakantie ook een beetje de baas.',
      ]);
      staat.vlaggen.hengelGekregen = true;
      await ui.krijgItem('hengel', 1, 'kreeg');
      await ui.zeg('Bij de steigers rond het meertje staan bordjes met een visje erop. Daar moet het gebeuren.');
      return;
    }
    if (aantalVissen(staat) < 3) {
      await ui.zeg(`HEINZ: ${aantalVissen(staat)} vis${aantalVissen(staat) === 1 ? '' : 'sen'}? Daar wordt niemand vol van. Drie! Van drie verschillende steigers!`);
      return;
    }
    await ui.zeg([
      'HEINZ: Eins, zwei, drei! Ein Barsch, ein Hecht und ein Karpfen! Wunderbar!',
      'HEINZ: Rüdiger! De barbecue aan! Karl, je sokken uit de buurt van het eten!',
    ]);
    ['hengel', 'baars', 'snoek', 'karper'].forEach((id) => { if (aantal(id)) neemItem(id, aantal(id)); });
    audio.sfx('kassa');
    await ui.zeg('{BEER} geeft de hengel en de drie vissen aan Heinz.');
    staat.vlaggen.visKlaar = true;
    await ui.zeg('HEINZ: Danke schön! Hier, voor onderweg: een echte Thüringer Bratwurst. Van de vorige barbecue.');
    await ui.krijgItem('voedselbon', 1, 'kreeg');
    await ui.zeg('HEINZ: De weg naar het strandje is daar, naar het oosten. Pas op voor de kuilen. Die zijn niet van ons. Echt niet.');
  },

  async rudiger({ ui }) {
    await ui.zeg([
      'RÜDIGER: Isch heb mij ingesmeerd met factor twee. Isch dacht: hoe lager, hoe Duitser.',
      'RÜDIGER: Het doet een beetje pijn nu. Niet aanraken. Ook niet kijken, eigenlijk.',
    ]);
  },

  async karl({ ui }) {
    await ui.zeg([
      'KARL: Sokken in sandalen? Natürlich! Zo krijg je geen zand tussen je tenen.',
      'KARL: Jullie Nederlanders zijn zo onpraktisch. Jullie lopen hier op blote voeten. Barbaren.',
    ]);
  },

  async verder({ ui, wereld, staat }, { warp }) {
    if (!staat.vlaggen.visKlaar) {
      await ui.zeg(staat.vlaggen.hengelGekregen
        ? 'HEINZ: Hey, Bär! Waar ga jij heen met mijn hengel? Eerst drie vissen!'
        : 'Je hoort schlagermuziek achter je. En iemand die "HALLO! BÄR!" roept. Misschien eerst even kijken wat ze willen.');
      return;
    }
    wereld.gaNaar('strand', 1, warp.y === 12 ? 7 : 9, 'rechts');
  },

  visA: (ctx, extra) => visplek(ctx, extra, 'visA'),
  visB: (ctx, extra) => visplek(ctx, extra, 'visB'),
  visC: (ctx, extra) => visplek(ctx, extra, 'visC'),

  async visbord({ ui }) {
    await ui.zeg('VISSTEK. Vergunning verplicht. Iemand heeft "verplicht" doorgestreept en er "gezellig" van gemaakt.');
  },

  async parasol({ ui }) {
    await ui.zeg('Een parasol. Op het stokje staat: "RESERVIERT. SEIT 6 UHR MORGENS."');
  },

  async bbq({ ui }) {
    await ui.zeg('De barbecue gloeit nog. Op het rooster liggen alleen nog wat zwarte restjes. Rüdiger is hier geweest.');
  },

  async koelbox({ ui }) {
    await ui.zeg('Een koelbox vol Duits bier. Er staat een radiootje op, met schlagermuziek. Heel hard.');
  },

  async handdoek({ ui }) {
    await ui.zeg('Een handdoek, strak in het zand gespannen. Hij ligt hier al sinds zes uur vanochtend. Bezet.');
  },

  async flamingo({ ui }) {
    await ui.zeg('Een opblaasflamingo. Op de zijkant staat met stift: "EIGENTUM VON KARL".');
  },
};

// ================================================================== 3. het strandje

/** Kurt komt uit het zand. */
async function zandDuitser(ctx) {
  const { ui, wereld, staat, audio } = ctx;
  const s = wereld.speler;
  const x = Math.min(s.x + 2, 37);
  const y = s.y;
  audio.sfx('bonk');
  wereld.cameras.main.shake(400, 0.006);
  await ui.zeg('Het zand voor je begint te trillen...');
  // zandwolkjes en een kuil
  const kuil = wereld.add.image(x * 16 + 8, (y + 1) * 16 + 2, 'obj_zandkuil').setOrigin(0.5, 1).setDepth(-5);
  for (let i = 0; i < 10; i++) {
    const z = wereld.add.circle(x * 16 + 8, (y + 1) * 16 - 4, 2, 0xe4c890).setDepth(9000);
    wereld.tweens.add({
      targets: z, x: z.x + Phaser.Math.Between(-18, 18), y: z.y - Phaser.Math.Between(6, 22), alpha: 0, duration: 600,
      onComplete: () => z.destroy(),
    });
  }
  const k = wereld.voegPersoonToe({ id: 'kurt', sprite: 'mens_kurt', x, y, richting: 'omlaag', script: 'kurt' });
  k.gescript = true;
  const eindY = k.sprite.y;
  k.sprite.setY(eindY + 18).setAlpha(0.2);
  audio.sfx('zoef');
  await tween(wereld, { targets: k.sprite, y: eindY, alpha: 1, duration: 700, ease: 'Back.easeOut' });
  wereld.kijkNaarElkaar(k);
  await wereld.uitroep(k);
  await ui.zeg([
    'KURT: Guten Tag! Erschrocken? Isch lag hier al drie dagen in mijn kuil.',
    'KURT: Jullie Nederlanders lachen altijd om Duitsers die kuilen graven op het strand. Maar weet je waaróm wij dat doen?',
    'KURT: Omdat jullie om zeven uur \'s ochtends alle plekjes al met een handdoek hebben bezet. Dan moet je wel de diepte in!',
    'KURT: Isch graaf hier al sinds 1974. Isch heb onderweg twee strandballen, een emmertje en een Hollander met een caravan gevonden.',
    'KURT: En nu ga isch jou begraven! Tot aan je nek! Met een zandkasteel op je hoofd!',
  ]);
  const uitslag = await wereld.gevecht('kurt');
  if (uitslag !== 'gewonnen') return;
  staat.vlaggen.kurtVerslagen = true;
  await ui.zeg([
    'KURT: Au... Gut, gut. Jij hebt gewonnen.',
    'KURT: Isch ga terug in mijn kuil. Daar is het lekker koel. En niemand legt er een handdoek op.',
  ]);
  const kurt = wereld.persoon('kurt');
  if (kurt) {
    audio.sfx('zoef');
    await tween(wereld, { targets: kurt.sprite, y: kurt.sprite.y + 18, alpha: 0, duration: 700, ease: 'Sine.easeIn' });
    wereld.verwijderPersoon('kurt');
  }
  kuil.setAlpha(0.8);
  await ui.zeg('Er blijft alleen een kuil over. En een vaag gezoem van schlagermuziek, diep onder het zand.');
}

export const strandScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.strandGezien) return;
    staat.vlaggen.strandGezien = true;
    await ui.zeg([
      'Een recreatiestrandje. Zand, parasols, een ijscokar en een strandwacht die ligt te slapen.',
      'Overal in het zand zitten kuilen. Grote kuilen.',
    ]);
  },

  naStap(ctx) {
    const { staat, wereld, ui } = ctx;
    if (staat.vlaggen.kurtVerslagen || wereld.speler.x < 31 || wereld.persoon('kurt')) return false;
    ui.script(() => zandDuitser(ctx));
    return true;
  },

  async kurt(ctx) {
    if (ctx.staat.vlaggen.kurtVerslagen) return;
    const uitslag = await ctx.wereld.gevecht('kurt');
    if (uitslag === 'gewonnen') ctx.staat.vlaggen.kurtVerslagen = true;
  },

  async verder({ ui, staat, wereld }, { warp }) {
    if (!staat.vlaggen.kurtVerslagen) {
      // je komt hier pas na Kurt, maar voor de zekerheid
      if (!wereld.persoon('kurt')) await zandDuitser(wereld.context());
      return;
    }
    if (!staat.vlaggen.strandVerlaten) {
      staat.vlaggen.strandVerlaten = true;
      await ui.zeg([
        'Je laat het strandje achter je. Het zand gaat over in een fietspad, met een bordje: AALDEN.',
        'Het laatste stadje voor {PARK}. Je bent er bijna.',
      ]);
      await ui.hoofdstuk('HOOFDSTUK 7', 'AALDEN');
    }
    wereld.gaNaar('aalden', 1, warp.y <= 8 ? 15 : 16, 'rechts');
  },

  async ijsman({ ui }) {
    await ui.zeg([
      'IJSMAN: IJsjes! Vanille, aardbei, en voor de Duitsers: zuurkool-stracciatella.',
      'IJSMAN: Die verkoopt beter dan je denkt.',
    ]);
  },

  async marga({ ui }) {
    await ui.zeg([
      'MARGA: Ik lig hier al sinds zeven uur. Met mijn handdoek. Dat is mijn goed recht.',
      'MARGA: Die Duitsers zijn gek, met hun kuilen. Ik ben er vanochtend al twee keer in gevallen.',
    ]);
  },

  async strandkees({ ui }) {
    await ui.zeg('KEES: Ik ben hier aan het hardlopen. Op zand. Dat is goed voor je kuiten. En je ziet de kuilen eerder.');
  },

  async parasol({ ui }) {
    await ui.zeg('Een parasol. Eronder ligt niemand. Behalve een handdoek. Bezet.');
  },

  async strandstoel({ ui }) {
    await ui.zeg('Een strandstoel. Er zit nog een kuiltje in van iemand die er héél lang op heeft gezeten.');
  },

  async handdoek({ ui }) {
    await ui.zeg('Een handdoek. Met vier stenen op de hoeken. Hier wordt niet mee gesold.');
  },

  async reddingstoren({ ui }) {
    await ui.zeg('De stoel van de strandwacht. De strandwacht slaapt. Met een zonnebril op, zodat niemand het ziet.');
  },

  async zandkasteel({ ui }) {
    await ui.zeg('Een prachtig zandkasteel, met een vlaggetje. Op het vlaggetje staat: "KURT WAS HIER".');
  },

  async schep({ ui }) {
    await ui.zeg('Een rood schepje, rechtop in het zand. Het lijkt wel een grafsteentje.');
  },

  async ijscokar({ ui }) {
    await ui.zeg('Een ijscokar. De smaak van de dag: zuurkool-stracciatella. Hm.');
  },
};
