// De finale. De directeur blijkt omgekocht door de Duitsers: van het vakantiepark moet het tweede kamp van de regio
// worden. Na het gevecht vallen de sleutels van huisje 7 uit zijn zak. In het huisje zitten je vrienden op de bank;
// ze sturen je naar de sauna. Daarna volgt de aftiteling.
import { aantal } from '../core/staat.js';
import { tekst, meet } from '../ui/tekst.js';
import { HUIZEN } from './finale.js';

// ================================================================== de receptie

export const receptieBinnenScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.receptieBinnenGezien || staat.vlaggen.directeurVerslagen) return;
    staat.vlaggen.receptieBinnenGezien = true;
    await ui.zeg([
      'De receptie ruikt naar nieuw tapijt, koffie en sigaren.',
      'Voor de balie staat een man in een pak, met een bolhoed en een snor. Die ken je...',
    ]);
  },

  async directeur(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.directeurVerslagen) return;
    const d = wereld.persoon('directeur');
    if (d) wereld.kijkNaarElkaar(d);
    if (!staat.vlaggen.directeurBekend) {
      staat.vlaggen.directeurBekend = true;
      const ontbijt = (staat.intake && staat.intake.ontbijt) || 'Krentenbollen';
      await ui.zeg([
        'DIRECTEUR: Ah! {BEER}! Daar ben je eindelijk. Welkom in {PARK}!',
        'DIRECTEUR: Je hebt er wel lang over gedaan. Via Orvelte, Wezup en Aalden. Ik heb alles gevolgd. Op de bewakingscamera\'s.',
        'DIRECTEUR: Weet je... ik moet je iets bekennen.',
        'DIRECTEUR: Dit was allemaal een test. Het kamp, de slagbomen, de onderduikers. Ik wilde zien of een beer het zou halen.',
        'DIRECTEUR: Want de Duitsers hebben mij een aanbod gedaan. Een koffer vol geld. Een hele grote koffer.',
        'DIRECTEUR: {PARK} wordt het tweede kamp van de regio. Kamp Westerbork zit vol, zie je.',
        'DIRECTEUR: Het zwembad wordt de appèlplaats. De bungalows worden barakken. En de minigolf... nou ja. Die blijft gewoon minigolf. Daar is iedereen het over eens.',
        `DIRECTEUR: En jij, {BEER}, bent mijn allereerste gast. Ik heb zelfs ${ontbijt.toLowerCase()} voor je klaargezet. In barak 1.`,
        '{BEER} balt zijn poten tot vuisten. Dus daar was die hele intake voor.',
        'DIRECTEUR: Oh? Wil je vechten? Ik ben directeur, hoor. Ik heb twee keer een cursus conflicthantering gedaan!',
      ]);
    } else {
      await ui.zeg('DIRECTEUR: Nog een keer? Prima. Ik heb de hele dag. En een hele koffer.');
    }
    const uitslag = await wereld.gevecht('directeur');
    if (uitslag !== 'gewonnen') return;
    staat.vlaggen.directeurVerslagen = true;
    await ui.zeg([
      'DIRECTEUR: Au... mijn rug. Mijn bolhoed. Mijn smeergeld!',
      'Er valt iets uit de binnenzak van de directeur. Het rinkelt op de tegels...',
    ]);
    audio.sfx('kist');
    await ui.krijgItem('sleutels', 1, 'vond');
    await ui.zeg('DIRECTEUR: Huisje 7. Jouw huisje. Neem ze maar. Ik... ik ga even bellen. Met de Kommandantur.');
    await ui.naarZwart(400);
    wereld.verwijderPersoon('directeur');
    wereld.verwijderObject('geldkoffer');
    await ui.wachtMs(300);
    await ui.vanZwart(400);
    await ui.zeg([
      'De directeur is met zijn koffer onder de balie gekropen. Je hoort hem zachtjes huilen. En bellen.',
      'Huisje 7! Rechts van het plein ligt de straat met de vakantiehuisjes.',
    ]);
  },

  async balie({ ui, staat }) {
    await ui.zeg(staat.vlaggen.directeurVerslagen
      ? 'Onder de balie zit de directeur. Hij zegt "bezet". Net als bij een ligbedje.'
      : 'De balie van de receptie. Er staat een belletje op. Je durft er niet op te drukken.');
  },

  async folders({ ui }) {
    await ui.zeg('Folders: "Het subtropisch zwemparadijs", "Minigolf voor het hele gezin" en, helemaal nieuw: "De Duitse week (52 weken per jaar)".');
  },

  async bouwtekening({ ui }) {
    await ui.zeg([
      'Een bouwtekening. Bovenaan staat: "PLAN: KAMP {PARK} II".',
      'Prikkeldraad rondom, drie barakken en een wachttoren. Waar nu het zwembad zit, staat "APPELPLAATS". Met een smiley.',
    ]);
  },

  async geldkoffer({ ui }) {
    await ui.zeg('Een koffer vol Duits geld. Op een briefje: "Für Harm. Für das Lager. Mit freundlichen Grüßen, die Kommandantur."');
  },

  async plant({ ui }) {
    await ui.zeg('Een plant. In de pot zit een afluisterapparaatje. Of een vergeten kauwgompje. Moeilijk te zeggen.');
  },
};

// ================================================================== de straat met vakantiehuisjes

const HUIS_TEKST = {
  5: 'Huisje 5. Op het terras zitten twee Duitsers met een bord vol braadworst. Ze zwaaien. Je zwaait maar terug.',
  6: 'Huisje 6. Uit het raam klinkt een schlager. Héél hard. Iemand zingt mee. Héél vals.',
  8: 'Huisje 8. Op de deur hangt een briefje: "NIET STOREN. MIDDAGDUTJE TOT 18.00 UUR."',
  12: 'Huisje 12. Hier zit Heinz straks. De barbecue staat al klaar en zijn handdoek ligt op de ligstoel. Bezet.',
  37: 'Huisje 37. Het huisje van Jürgen. Al vijfentwintig jaar. Er hangt een plaquette naast de deur.',
  9: 'Huisje 9. Hier is niemand thuis. Er ligt alleen een opblaasflamingo op het terras. Eigentum von Karl.',
};

export const vakantiestraatScripts = {
  opbouw({ wereld }) {
    // huisnummers bij de deuren (de villa heeft er al een)
    HUIZEN.forEach(([type, , x, nummer]) => {
      if (type !== 'bungalow') return;
      const b = meet(wereld, nummer, 'donker') + 4;
      const px = x * 16 + 32 - Math.round(b / 2);
      const py = 6 * 16 + 4;
      wereld.add.rectangle(px, py, b, 9, 0xf4f4f0).setOrigin(0, 0).setStrokeStyle(1, 0x24201c).setDepth(150);
      tekst(wereld, px + 2, py - 1, nummer, 'donker').setDepth(151);
    });
  },

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.straatGezien) return;
    staat.vlaggen.straatGezien = true;
    await ui.zeg([
      'Een rustig straatje met vakantiehuisjes. Bij nummer 7 brandt licht. Boven lijkt het wel... een sauna?',
      'In de vijver aan de overkant ligt een witte Audi A1. Ondersteboven. Nou ja, half.',
    ]);
  },

  async voordeur(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (!aantal('sleutels')) {
      await ui.zeg('De deur van huisje 7 zit op slot. De sleutel ligt bij de receptie.');
      return;
    }
    if (!staat.vlaggen.huisjeOpen) {
      staat.vlaggen.huisjeOpen = true;
      audio.sfx('deur');
      await ui.zeg([
        '{BEER} steekt de sleutel in het slot. Hij past!',
        'Binnen klinkt muziek. En gelach. Er is al iemand...',
      ]);
    }
    wereld.gaNaar('huisje_beneden', 6, 9, 'omhoog');
  },

  async huisje7({ ui }) {
    await ui.zeg('Huisje 7. Jouw huisje. Met een verdieping, een balkon en een eigen sauna. Je bent er bijna.');
  },

  async huisje({ ui, wereld }, { x }) {
    const huis = HUIZEN.find(([, , hx]) => x >= hx && x < hx + 3);
    await ui.zeg(HUIS_TEKST[huis ? huis[3] : 5] || 'Een vakantiehuisje.');
  },

  async bbq({ ui }) {
    await ui.zeg('De barbecue van Heinz. Op het rooster ligt een briefje: "RESERVIERT FÜR BÄR. UND SEINE FISCHE."');
  },

  async levi({ ui, wereld }) {
    const l = wereld.persoon('levi');
    if (l) wereld.kijkNaarElkaar(l);
    await ui.zeg([
      'LEVI: Yo bro. Ik deed 180. Die bocht deed 30.',
      'LEVI: Maakt niet uit. Ik heb alles gefilmd. Twintigduizend views al.',
      'LEVI: Niet tegen mijn moeder zeggen, hè. Het is haar auto.',
    ]);
  },

  async audi({ ui }) {
    await ui.zeg('Levi\'s witte Audi A1, half in de vijver. Er zwemt een eend door het open raampje naar binnen.');
  },
};

// ================================================================== huisje 7: beneden

/** Het groepsgesprek op de bank (de eerste keer dat je iemand aanspreekt). */
async function groepsgesprek({ ui, staat }) {
  staat.vlaggen.bankGesproken = true;
  await ui.zeg([
    'RUDY: Hé, daar is de beer! Eindelijk! We zitten hier al uren te wachten.',
    'JESSE: We hebben de beamer al aangesloten. We kijken een film over een beer die uit een kamp ontsnapt.',
    'DEWI: Heel spannend. Al loopt het op het eind wel een beetje raar af, geloof ik.',
    'FEMKE: Je ziet er moe uit. En je ruikt naar snert. En naar Duitse shag.',
    'DEVONA: Je moet even lekker uitrusten. Boven in de badkamer is een sauna!',
    'FRANK: Hij staat al aan. Negentig graden. Heb ik zelf gedaan.',
    'MATHIJS: Ga maar lekker. Ik film het wel even voor de socials.',
    '{BEER} kijkt naar de salontafel. Dan naar de trap. Een sauna klinkt eigenlijk heel goed.',
  ]);
}

function vriend(id, regels) {
  return async (ctx) => {
    if (!ctx.staat.vlaggen.bankGesproken) {
      await groepsgesprek(ctx);
      return;
    }
    await ctx.ui.zeg(regels);
  };
}

export const huisjeBenedenScripts = {
  opbouw({ wereld, audio }) {
    // het licht van de beamer, van de salontafel naar het scherm
    const g = wereld.add.graphics().setDepth(40).setBlendMode(Phaser.BlendModes.ADD);
    g.fillStyle(0x8898d8, 0.22);
    g.fillTriangle(94, 88, 166, 10, 166, 42);
    g.fillTriangle(94, 88, 166, 42, 120, 70);
    wereld.tweens.add({ targets: g, alpha: 0.7, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    // de muziek voor de aftiteling alvast binnenhalen
    audio.voorladen('outro');
  },

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.huisjeGezien) return;
    staat.vlaggen.huisjeGezien = true;
    await ui.zeg([
      'Huisje 7. Het licht is gedimd, de beamer staat aan en op de hoekbank zitten... zeven mensen?',
      'Op de salontafel ligt van alles. Niemand kijkt op. Ze kijken film.',
    ]);
  },

  jesse: vriend('jesse', 'JESSE: Ik zit nog in een livestream, hoor. Zwaai even! ...Nee? Ook goed.'),
  dewi: vriend('dewi', 'DEWI: Check, check... staat deze microfoon aan? Ik wil straks even aankondigen: "De beer is thuis!"'),
  devona: vriend('devona', 'DEVONA: De sauna is boven. De trap op, dan zie je hem meteen staan.'),
  femke: vriend('femke', 'FEMKE: Neem wel een handdoek mee. En drink daarna veel water. Echt water, hè.'),
  frank: vriend('frank', 'Frank kijkt je van opzij aan, met een grijns. FRANK: Negentig graden, beer. Negentig.'),
  mathijs: vriend('mathijs', 'MATHIJS: Even stilstaan... ja... mooi! Die gaat online.'),
  rudy: vriend('rudy', [
    'RUDY: Heb je mijn hobbelpaard al gezien? Hij heet Bliksem.',
    'RUDY: Niet aankomen. Hij is heel snel. Bijna 180.',
  ]),

  async bank(ctx) {
    if (!ctx.staat.vlaggen.bankGesproken) {
      await groepsgesprek(ctx);
      return;
    }
    await ctx.ui.zeg('Een gigantische hoekbank. Er is nog precies één plekje vrij. Daar ligt een plaid. Met kruimels.');
  },

  async tafel({ ui }) {
    await ui.zeg([
      'Op de salontafel: zakjes, pillen in alle kleuren van de regenboog, een bergje wit poeder, een jointje...',
      '...en een bakje chips. Je neemt een chipje. Paprika.',
    ]);
  },

  async scherm({ ui }) {
    await ui.zeg('Op het scherm: een film over een beer met een rode muts die uit een kamp ontsnapt. Hé. Wacht eens even...');
  },

  async hobbelpaard({ ui }) {
    await ui.zeg('Het hobbelpaard van Rudy. Er hangt een kaartje aan: "BLIKSEM. NIET AANKOMEN." Het oortje heeft een rood vlekje.');
  },

  async koelkast({ ui }) {
    await ui.zeg('De koelkast. Bier, energiedrank en een fles advocaat. Die laatste komt je ergens bekend voor.');
  },

  async plant({ ui }) {
    await ui.zeg('Een plant. Iemand heeft er een zonnebril op gezet.');
  },
};

// ================================================================== huisje 7: boven

export const huisjeBovenScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.badkamerGezien) return;
    staat.vlaggen.badkamerGezien = true;
    await ui.zeg('De badkamer. Delfts blauwe tegels, een regendouche, en daar in de hoek: de sauna. Er komt warme lucht onder de deur door.');
  },

  async sauna(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (!staat.vlaggen.bankGesproken) {
      await ui.zeg('De sauna staat al aan. Negentig graden. Maar zeg eerst even gedag tegen de mensen beneden. Dat is wel zo netjes.');
      return;
    }
    await ui.zeg('Aan de deur van de sauna hangt een briefje: "VOOR DE BEER. RUST LEKKER UIT!" Met zeven handtekeningen.');
    const keuze = await ui.vraag('Ga je de sauna in?', ['JA, HEERLIJK', 'NOG NIET']);
    if (keuze !== 0) return;
    staat.vlaggen.saunaIn = true;
    staat.vlaggen.uitgespeeld = true;
    audio.sfx('deur');
    audio.stopMuziek(0.8);
    await ui.zeg('{BEER} pakt een handdoek, stapt de sauna in en gaat lekker zitten. Aaaah...');
    await ui.naarZwart(900);
    ui.sluitDialoog();
    wereld.scene.start('Aftiteling');
  },

  async douche({ ui }) {
    await ui.zeg([
      'Een splinternieuwe regendouche. Op de douchekop zit nog een stickertje: "GELIEFERT VON DER DIREKTION".',
      'Eerst de sauna. Daarna lekker douchen.',
    ]);
  },

  async wastafel({ ui }) {
    await ui.zeg('In de spiegel kijkt een moe, maar heel tevreden beer terug. Je bent er. Je bent echt in je eigen huisje.');
  },

  async wc({ ui }) {
    await ui.zeg('Een wc. Op de stortbak staat een wc-eend. Hij kijkt je aan. Jij kijkt terug.');
  },
};
