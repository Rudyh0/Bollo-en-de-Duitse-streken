// Gebeurtenissen en gesprekken op het kampplein.
// De gevangenen hebben het zwaar, maar hun humor is nog niet afgepakt.
import { aantal, knapOp, staat as spelStaat } from '../core/staat.js';

const BARAK7_DEUR = { x: 21 * 16 + 8, y: 15 * 16 - 4 };

function rookUitBarak(wereld) {
  const w = wereld.add.circle(BARAK7_DEUR.x + Phaser.Math.Between(-6, 6), BARAK7_DEUR.y - 6, 2, 0xc8c8d0, 0.7).setDepth(3000);
  wereld.tweens.add({
    targets: w,
    x: w.x + Phaser.Math.Between(-10, 18),
    y: w.y - Phaser.Math.Between(30, 60),
    scale: 3 + Math.random() * 2,
    alpha: 0,
    duration: 2200,
    onComplete: () => w.destroy(),
  });
}

async function poortOpen({ ui, wereld, staat, audio }) {
  if (!staat.vlaggen.klausVerslagen || !staat.vlaggen.dieterVerslagen || staat.vlaggen.poortOpen) return;
  await ui.wachtMs(300);
  audio.sfx('klik');
  staat.vlaggen.poortOpen = true;
  wereld.vernieuwObject('poort');
  wereld.cameras.main.shake(120, 0.003);
  await ui.zeg([
    'Met een piepende zucht zwaait de poort van het kamp open!',
    'De weg naar buiten is vrij...',
  ]);
}

export default {
  opbouw({ wereld, staat }) {
    if (staat.vlaggen.rookAlarm) {
      wereld.time.addEvent({ delay: 380, loop: true, callback: () => rookUitBarak(wereld) });
    }
  },

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.pleinGezien) return;
    staat.vlaggen.pleinGezien = true;
    await ui.zeg([
      'Buiten loeit nog steeds het brandalarm. Uit barak 7 komt dikke rook.',
      'Niemand let op jou. Iedereen kijkt naar de rook.',
      'Je staat op het kampplein. In het noorden, achter het binnenhek, ligt de uitgang van het kamp!',
    ]);
  },

  // ------------------------------------------------------------ de wachters bij de poort

  async klaus(ctx, { persoon }) {
    const { ui, wereld, staat } = ctx;
    if (staat.vlaggen.klausVerslagen) {
      await ui.zeg([
        'KLAUS: Au... mijn hoofd. Die soeplepel is een verboden wapen, weet je dat?',
        'KLAUS: Isch ga een klacht indienen. In drievoud.',
      ]);
      return;
    }
    if (persoon) wereld.kijkNaarElkaar(persoon);
    await ui.zeg([
      'KLAUS: Halt! Waar denk jij dat jij naartoe gaat, kleine beer?',
      "KLAUS: Ben jij soms een Fries? Zeg eens: 'bûter, brea en griene tsiis'!",
      'KLAUS: ...Dat klonk verdacht Fries! Niemand gaat door deze poort! Behalve isch. Om vijf uur. Feierabend!',
      'KLAUS: Isch heb een Walther P38 en een mesje. Jij hebt... een soeplepel? Hahaha!',
    ]);
    const uitslag = await wereld.gevecht('klaus');
    if (uitslag !== 'gewonnen') return;
    staat.vlaggen.klausVerslagen = true;
    const k = wereld.persoon('klaus');
    await ui.zeg('KLAUS: Ach du lieber... verslagen door een beer met een muts. Isch ga even zitten.');
    if (k) {
      await wereld.loopPersoon(k, 'links', 2);
      k.kijk('rechts');
      k.gescript = true;
    }
    await poortOpen(ctx);
  },

  async dieter(ctx, { persoon }) {
    const { ui, wereld, staat } = ctx;
    if (staat.vlaggen.dieterVerslagen) {
      await ui.zeg([
        'DIETER: Isch heb dit niet gezien. Jij hebt dit niet gezien.',
        'DIETER: Als de Kommandant het vraagt: het was een heel grote beer. Met een tank.',
      ]);
      return;
    }
    if (persoon) wereld.kijkNaarElkaar(persoon);
    if (staat.vlaggen.klausVerslagen) {
      await ui.zeg([
        'DIETER: Klaus! Was ist los?! ...Jij hebt Klaus verslagen? Met een SOEPLEPEL?',
        'DIETER: Dat gaat jou niet nog een keer lukken. Isch ben drie keer zo sterk als Klaus!',
        'DIETER: Nou ja. Twee keer. Op een goede dag.',
      ]);
    } else {
      await ui.zeg([
        'DIETER: Ho ho! Jij bent toch die beer van barak 7? Terug naar binnen, schnell!',
        'DIETER: Nee? Dan zal isch het je moeten leren. Ordnung muss sein!',
      'DIETER: En daarna ga isch jouw stamboom nakijken. Isch ruik hier suikerbrood!',
      ]);
    }
    const uitslag = await wereld.gevecht('dieter');
    if (uitslag !== 'gewonnen') return;
    staat.vlaggen.dieterVerslagen = true;
    const d = wereld.persoon('dieter');
    await ui.zeg('DIETER: Mein Gott... Dit wordt een heel lang verslag voor de Kommandant.');
    if (d) {
      await wereld.loopPersoon(d, 'rechts', 2);
      d.kijk('links');
      d.gescript = true;
    }
    await poortOpen(ctx);
  },

  async poortUit({ ui }) {
    await ui.zeg([
      'Je stapt door de poort. Achter het prikkeldraad ligt de vrijheid... en heel veel Drentse heide.',
      'Ergens achter die bossen ligt {PARK}. En je huisje. En het zwembad, dat om tien uur sluit.',
      'EINDE VAN HOOFDSTUK 1. Wordt vervolgd!',
      '(Tip: sla je spel op via START, dan kun je straks verder.)',
    ]);
  },

  async slaper({ ui }) {
    await ui.zeg([
      'WACHTER: Zzzz... Ordnung... zzz...',
      'WACHTER: ...nog vijf minuutjes, Mutti... zzz...',
      'Hij slaapt staand. Dat moet hij op een opleiding hebben geleerd.',
    ]);
  },

  // ------------------------------------------------------------ de stoeten

  async fritz({ ui }) {
    await ui.zeg([
      'FRITZ: Links, rechts, links, rechts! Wij lopen rondjes. Waarom? Omdat het in het rooster staat!',
      'FRITZ: Jij daar! Ben jij een Fries? ...Nee? Beren tellen niet. Isch heb geen tijd, nog zeven rondjes.',
    ]);
  },

  async kees({ ui }) {
    await ui.zeg([
      'KEES: Ze hebben me vastgeketend aan mijn schoonmoeder.',
      "KEES: De Duitsers noemen het 'zware straf'. Ik noem het gewoon zondag.",
    ]);
  },

  async ria({ ui }) {
    await ui.zeg([
      'RIA: Ik heb een Duitse toerist de weg gewezen. Naar het verkeerde hunebed.',
      'RIA: Hij zoekt nog steeds. Ik ook: naar een advocaat.',
    ]);
  },

  async jan({ ui }) {
    await ui.zeg([
      'JAN: Ze denken dat ik Fries ben, omdat ik lang ben en weinig zeg. Ik kom uit Assen.',
      'JAN: Ik ben zevenentachtig en heb levenslang gekregen. Dus eerlijk gezegd valt het reuze mee.',
    ]);
  },

  async gunther({ ui }) {
    await ui.zeg([
      'GÜNTHER: Nicht praten met de gevangenen! Dat is verboten!',
      'GÜNTHER: ...Okay, één vraag dan. Weet jij waar hier de koffieautomaat is?',
    ]);
  },

  async piet({ ui }) {
    await ui.zeg([
      'PIET: Het goede nieuws: aan deze ketting ben ik nooit meer alleen.',
      'PIET: Het slechte nieuws: aan deze ketting ben ik nooit meer alleen.',
    ]);
  },

  async bram({ ui }) {
    await ui.zeg([
      'BRAM: Ik zit hier voor het verkeerd scheiden van afval. Plastic bij het papier.',
      "BRAM: Ze noemen het hier 'sabotage'. Mijn buurvrouw noemde het 'eindelijk'.",
    ]);
  },

  // ------------------------------------------------------------ vrije rondlopers

  async oma({ ui }) {
    await ui.zeg([
      'OMA TRUUS: Ik brei een sjaal voor de wachters. Van prikkeldraad.',
      'OMA TRUUS: Het wordt een verrassing. Hij kriebelt een beetje.',
    ]);
  },

  async boer({ ui }) {
    await ui.zeg([
      'BOER GERRIT: Ze hebben me opgepakt omdat mijn koeien zwart-wit zijn. Fries vee, zeiden ze.',
      'BOER GERRIT: Mijn koeien staan thuis nog op stal.',
      'BOER GERRIT: Ik hoop maar dat ze de deur hebben gevonden. Ik heb hem in elk geval niet gevonden.',
    ]);
  },

  async sporter({ ui }) {
    await ui.zeg([
      'ROCCO: ...98... 99... 100! Ik train voor de ontsnapping.',
      'ROCCO: Al zes jaar. Ik ben nu ontzettend sterk. En nog steeds hier.',
    ]);
  },

  async dichter({ ui }) {
    if (await ui.vraag('DIRK: Ik schrijf gedichten. Wil je er een horen?') !== 0) {
      await ui.zeg('DIRK: Niemand wil ze horen. Daarom zit ik hier, denk ik.');
      return;
    }
    await ui.zeg([
      'DIRK: Prikkeldraad om mij heen,',
      'DIRK: de soep is koud, mijn hart van steen.',
      'DIRK: De zon gaat onder, en weer op.',
      'DIRK: Morgen weer soep. Stop.',
      'DIRK: ...Ik werk nog aan het einde.',
    ]);
  },

  async kokkin({ ui, staat }) {
    if (!staat.vlaggen.kokkinBon) {
      staat.vlaggen.kokkinBon = true;
      await ui.zeg([
        'GERDA: Vandaag erwtensoep. Gisteren ook. Morgen ook.',
        'GERDA: Jij ziet er hongerig uit. Hier, een extra voedselbon. Niet aan de wachters vertellen.',
      ]);
      await ui.krijgItem('voedselbon', 1);
      return;
    }
    await ui.zeg([
      'GERDA: De soep is op. Ik heb er te veel water bij gedaan, en nu is er alleen nog water.',
      'GERDA: Ga anders naar de pomp. Dat water is tenminste koud.',
    ]);
  },

  // ------------------------------------------------------------ dingen

  async pomp({ ui, audio }) {
    const s = spelStaat;
    const vol = s.gezondheid >= s.maxGezondheid && Object.keys(s.ppMax).every((k) => s.pp[k] >= s.ppMax[k]);
    await ui.zeg('Een oude waterpomp. Je pompt een paar keer en drinkt ijskoud water.');
    if (vol) {
      await ui.zeg('Lekker, maar je was al helemaal fit.');
      return;
    }
    knapOp();
    audio.jingle('herstel');
    await ui.zeg('{BEER} voelt zich weer helemaal fit! Ook de soeplepel en Sepp zijn weer uitgerust.');
  },

  async barak5({ ui }) {
    await ui.zeg('Barak 5 zit op slot. Binnen hoor je iemand heel hard snurken.');
  },

  async barak6({ ui }) {
    await ui.zeg('Barak 6 zit op slot. Op de deur hangt een briefje: "Niet storen. Wij doen alsof we slapen."');
  },

  async barak7({ ui }) {
    await ui.zeg('Barak 7. Jouw barak. Er komt nog steeds rook uit.');
  },

  async keuken({ ui }) {
    await ui.zeg('De KEUKEN. De deur zit op slot. Er hangt een geur van erwtensoep. Al jaren.');
  },

  async wachthuisje({ ui }) {
    await ui.zeg('In het wachthuisje staat een radio. Er speelt Duitse schlagermuziek. Heel hard.');
  },

  async wachttoren({ ui }) {
    await ui.zeg('Een wachttoren. Er zit niemand in. Het is pauze.');
  },

  async bankje({ ui }) {
    await ui.zeg('Een bankje. Er staat in gekerfd: "Hier zat Jan, 1987 tot heden."');
  },

  async kisten({ ui }) {
    if (!aantal('voedselbon') && !spelStaat.vlaggen.kistenBon) {
      spelStaat.vlaggen.kistenBon = true;
      await ui.zeg('Tussen de kisten ligt iets...');
      await ui.krijgItem('voedselbon', 1);
      return;
    }
    await ui.zeg('Houten kisten. Er staat op: "ZUURKOOL. HOUDBAAR TOT 2031."');
  },

  async bord({ ui }) {
    await ui.zeg([
      'UITGANG. Doorgang alleen met toestemming van de Kommandant.',
      'Daaronder, met de hand: "De Kommandant geeft nooit toestemming."',
    ]);
  },
};
