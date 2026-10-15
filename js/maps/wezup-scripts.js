// Wezup: de inwoners (die het "die verdomde tjibbes uit Friesland" vinden), het kistje met snert,
// Leutnant Friedrich bij de uitgang en Anne Fries achter de boekenkast van kruidenier Hendrik.
import { aantal, neemItem, leerAanval } from '../core/staat.js';
import { berenGevel } from './beren-scripts.js';

// ================================================================== buiten

export const wezupScripts = {
  berenGevel,

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.wezupGezien) return;
    staat.vlaggen.wezupGezien = true;
    await ui.zeg([
      'Wezup. Een ambachtsstadje met een haventje, trapgeveltjes en de geur van vers brood en vis.',
      'Iedereen groet je vriendelijk. Tot iemand het over Friezen heeft.',
    ]);
  },

  async bordStad({ ui }) {
    await ui.zeg([
      'WEZUP - Ambachtsstad sinds 1302.',
      'Er zit een sticker op: "TJIBBEVRIJE ZONE". Die is er duidelijk met liefde opgeplakt.',
    ]);
  },

  async poster({ ui }) {
    await ui.zeg([
      'GEZOCHT: ANNE FRIES. Uit Leeuwarden. Dochter van een kruidenier.',
      'Wegens de illegale verkoop van Friese droge worst en suikerbrood.',
      'Beloning: een kilo Drentse metworst. Tips bij Leutnant Friedrich, bij de noorduitgang.',
    ]);
  },

  async huis({ ui }) {
    const zinnen = [
      'Een smal huisje met een trapgevel. Achter het raam hangt een vlaggetje van de Duitsers. En een van Drenthe.',
      'Een trapgevelhuisje. Op de deurmat staat: "WELKOM. BEHALVE FRIEZEN."',
      'Een keurig huisje. De gordijnen bewegen. Iemand houdt je in de gaten.',
    ];
    await ui.zeg(zinnen[Math.floor(Math.random() * zinnen.length)]);
  },

  async kruidenierGevel({ ui }) {
    await ui.zeg('KRUIDENIER HENDRIKS. Koffie, thee, beschuit en "géén suikerbrood", staat er op een bordje.');
  },

  async bakkerGevel({ ui }) {
    await ui.zeg('BAKKERIJ JANSEN. In de etalage liggen krentenbollen. Op een briefje: "Wij bakken GEEN suikerbrood."');
  },

  async slagerGevel({ ui }) {
    await ui.zeg('SLAGERIJ MULDER. "Echte Drentse metworst. Friese droge worst? Mooi niet!"');
  },

  async klompen({ ui }) {
    await ui.zeg('KLOMPENMAKERIJ. In de etalage staan klompen in alle maten. Behalve Friese maat.');
  },

  async netten({ ui }) {
    await ui.zeg('Visnetten, te drogen gehangen. Het ruikt naar zee. Of naar haring. Of allebei.');
  },

  async tonnen({ ui }) {
    await ui.zeg('Tonnen met haring. Op eentje staat met krijt: "NIET VOOR TJIBBES".');
  },

  async viskraam({ ui }) {
    await ui.zeg('Een viskraam met haring, makreel en paling. Alles vers. Zegt Grietje.');
  },

  async boot({ ui }) {
    await ui.zeg('Een vissersboot: de WZ 7. Op het dek liggen netten en een thermoskan koffie.');
  },

  async roeiboot({ ui }) {
    await ui.zeg('Een roeibootje. Er ligt een riem in. Eén. De andere is "geleend door een Fries", staat er op een briefje.');
  },

  // ------------------------------------------------------------ het kistje met de snert

  async kist({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.snertKist) {
      await ui.zeg('Het kistje is leeg. Er hangt nog een geur van erwtensoep.');
      return;
    }
    audio.sfx('kist');
    staat.vlaggen.snertKist = true;
    wereld.vernieuwObject('snertKist');
    await ui.zeg([
      'Achter de netten staat een kistje. Je klapt het deksel open.',
      'Er komt een wolk stoom uit...',
    ]);
    await ui.krijgItem('voedselbon');
    await ui.zeg('En daaronder: een pan erwtensoep. Hij is nog steeds GLOEIEND HEET. Hoe kan dat nou?');
    leerAanval('snert', 8);
    await ui.zegMetJingle('{BEER} leert de aanval GLOEIEND HETE SNERT!', 'aanval');
    await ui.zeg([
      'Die kun je in een gevecht naar een Duitser gooien. Dat doet flink pijn.',
      'En als hij mist, heb je in ieder geval een lekkere geur.',
    ]);
  },

  // ------------------------------------------------------------ inwoners

  async truus({ ui, staat }) {
    if (staat.vlaggen.wezupQuest && !staat.vlaggen.anneGevonden) {
      await ui.zeg([
        'TRUUS: Heb je het al gehoord? Er zit hier een Friezin verstopt! Een échte. Met vlechtjes.',
        'TRUUS: Als ik jou was, zou ik eens bij Hendrik de kruidenier kijken. Die verkoopt ineens suikerbrood.',
        'TRUUS: Waar haalt hij dat vandaan, denk je? Nou dan.',
      ]);
      return;
    }
    if (staat.vlaggen.wezupKlaar) {
      await ui.zeg('TRUUS: Zo! Die verdomde tjibbe is opgepakt. Nu kan ik eindelijk weer rustig slapen.');
      return;
    }
    await ui.zeg([
      'TRUUS: Goeiemiddag! Wat een mooie muts. Je bent toch geen Fries, hè?',
      'TRUUS: Die verdomde tjibbes uit Friesland. Komen hier hun suikerbrood verkopen. Brutaal volk.',
      'TRUUS: Gelukkig zijn de Duitsers er. Die houden de boel netjes.',
    ]);
  },

  async klaas({ ui }) {
    await ui.zeg([
      'KLAAS: Die verdomde tjibbes uit Friesland vissen het hele IJsselmeer leeg.',
      'KLAAS: En dan praten ze er ook nog raar bij. "Bûter, brea en griene tsiis". Wat is dat nou voor taal?',
      'KLAAS: Die Duitsers houden ze tenminste een beetje in toom.',
    ]);
  },

  async grietje({ ui }) {
    await ui.zeg([
      'GRIETJE: Haring! Verse Hollandse haring!',
      'GRIETJE: ...Ben jij Fries? Nee? Dan mag je er eentje proeven. Voor tjibbes is hij dubbel zo duur.',
    ]);
  },

  async sieds({ ui }) {
    await ui.zeg([
      'SIEDS: Ik heet Sieds. Dat is geen Friese naam, hoor! Het is... Drents. Oud-Drents.',
      'SIEDS: Verdomde tjibbes. Allemaal. Haha. Ha.',
      'Hij kijkt nerveus om zich heen.',
    ]);
  },

  async jan({ ui }) {
    await ui.zeg([
      'JAN: Ik maak klompen. Drentse klompen. De beste van het land.',
      'JAN: Friese klompen zijn te groot. Net als hun mond. Verdomde tjibbes.',
    ]);
  },

  async gerrit({ ui }) {
    await ui.zeg([
      'GERRIT: Moi! Mooi stadje, hè? Hier is alles nog ambachtelijk.',
      'GERRIT: Zelfs het verraden van Friezen doen we hier met de hand.',
    ]);
  },

  async hilde({ ui, staat }) {
    if (staat.vlaggen.wezupQuest && !staat.vlaggen.anneGevonden) {
      await ui.zeg('HILDE: Die boekenkast van Hendrik staat er al jaren. Maar ik heb hem nog nooit een boek zien lezen.');
      return;
    }
    await ui.zeg('HILDE: De Duitsers zijn heel beleefd, hoor. Ze vegen zelfs hun laarzen af voor ze een huis doorzoeken.');
  },

  // ------------------------------------------------------------ Leutnant Friedrich en de uitgang

  async leutnant(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.wezupKlaar) return;
    if (!staat.vlaggen.wezupQuest) {
      await ui.zeg([
        'FRIEDRICH: Halt! Niemand verlaat Wezup. Isch ben Leutnant Friedrich.',
        'FRIEDRICH: Wij zoeken een meisje. Anne Fries, uit Leeuwarden. De dochter van een kruidenier.',
        'FRIEDRICH: Gezocht wegens de illegale verkoop van Friese droge worst en suikerbrood. Zwarthandel in Beerenburg wordt vermoed.',
        'FRIEDRICH: De burgers van Wezup helpen ons graag. Zeer behulpzame mensen. Maar niemand heeft haar gevonden.',
        'FRIEDRICH: Jij bent een beer. Beren ruiken honing van kilometers ver. Suikerbrood vast ook.',
        'FRIEDRICH: Vind haar en breng haar bij mij. Dan mag jij verder.',
      ]);
      staat.vlaggen.wezupQuest = true;
      await ui.zeg(staat.vlaggen.dagboekGelezen ? [
        'Een kruidenier... een geheime kamer achter een boekenkast...',
        'Je weet precies waar je moet zoeken. Je wou dat je het niet wist.',
      ] : 'Je denkt aan het schriftje in je rugzak.');
      return;
    }
    const metAnne = (staat.volgers || []).includes('anne');
    if (!metAnne) {
      await ui.zeg('FRIEDRICH: En? Waar is het meisje? De mensen hier zeggen dat de kruidenier zich verdacht gedraagt.');
      return;
    }
    // Anne loopt achter je
    await ui.zeg('FRIEDRICH: Ah! Fräulein Fries. Endlich.');
    const keuze = await ui.vraag('Lever je Anne in?', ['INLEVEREN', 'NEE']);
    if (keuze !== 0) {
      await ui.zeg([
        '{BEER} doet een stap naar achteren. Je kunt het niet.',
        'FRIEDRICH: Dan blijf jij ook hier, beer. Isch heb alle tijd van de wereld.',
      ]);
      return;
    }
    await ui.zeg('ANNE: Het is goed. Jij moet ook verder. Ik snap het.');
    if (staat.vlaggen.anneDagboek) {
      await ui.zeg('ANNE: Hier. Bewaar jij Sjoukje maar. Dan is er tenminste iemand die het onthoudt.');
      await ui.krijgItem('dagboek', 1, 'kreeg');
    }
    staat.vlaggen.wezupKlaar = true;
    await ui.naarZwart(300);
    const gevangen = wereld.volgersLoslaten();
    const f = wereld.persoon('friedrich');
    wereld.zetSpeler(20, 5, 'omhoog');
    const stoet = [f, ...gevangen].filter(Boolean);
    stoet.forEach((p, i) => wereld.zetPersoon(p, 21, 1 + i, 'omhoog'));
    await ui.wachtMs(200);
    await ui.vanZwart(300);
    await ui.zeg('FRIEDRICH: Kommen Sie, Fräulein.');
    await wereld.stoetLoop(stoet, 'omhoog', 1);
    const anne = gevangen.find((p) => p.id === 'anne');
    if (anne) {
      anne.kijk('omlaag');
      await ui.wachtMs(500);
      await ui.zeg('Anne kijkt nog één keer om. Ze zwaait niet. Ze kijkt alleen.');
    }
    await wereld.stoetLoop(stoet, 'omhoog', 5);
    stoet.forEach((p) => wereld.verwijderPersoon(p.id));
    audio.sfx('menu');
    await ui.zeg([
      'Ergens achter je klapt iemand. Dan nog iemand. De bakker roept: "Weg met die tjibbes!"',
      '{BEER} voelt zich misselijk.',
      'De weg naar het noorden is vrij.',
    ]);
  },

  async uitgang({ ui, wereld, staat }, { warp }) {
    if (!staat.vlaggen.wezupKlaar) {
      await ui.zeg('FRIEDRICH: Halt! Zonder Anne Fries kom jij hier niet langs.');
      return;
    }
    if (!staat.vlaggen.wezupVerlaten) {
      staat.vlaggen.wezupVerlaten = true;
      await ui.zeg([
        'Je laat Wezup achter je. Het fietspad gaat over in een landweggetje, tussen de weilanden.',
        'Achter je klinkt nog steeds geklap. Je loopt een beetje sneller.',
      ]);
      await ui.hoofdstuk('HOOFDSTUK 6', 'HET DRENTSE LAND');
    }
    wereld.gaNaar('landweg', 1, warp.x === 20 ? 6 : 7, 'rechts');
  },
};

// ================================================================== de winkels

export const kruidenierScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.kruidenierGezien) return;
    staat.vlaggen.kruidenierGezien = true;
    await ui.zeg('Een ouderwetse kruidenierswinkel. Het ruikt naar koffie, zeep en... anijs?');
  },

  async hendrik({ ui, staat }) {
    if (staat.vlaggen.wezupKlaar) {
      await ui.zeg('HENDRIK: ...Ga alsjeblieft weg.');
      return;
    }
    if (staat.vlaggen.anneGevonden) {
      await ui.zeg([
        'HENDRIK: Ze ging mee zodat ik veilig zou zijn. Zij aan mij. Andersom had het moeten zijn.',
        'HENDRIK: Wat ben jij voor een beer?',
      ]);
      return;
    }
    if (staat.vlaggen.wezupQuest) {
      await ui.zeg([
        'Hendrik zweet. Hij poetst een glas dat al schoon is.',
        'HENDRIK: Een meisje? Nee. Hier is niemand. Alleen ik. En mijn boeken.',
        'HENDRIK: Ik lees heel veel. Elke avond. Achter de... in de... nou ja. Ik lees veel.',
      ]);
      return;
    }
    await ui.zeg([
      'HENDRIK: Goedemiddag! Koffie, thee, beschuit? Een ons kaas?',
      'HENDRIK: Suikerbrood? Nee! Nee nee. Hoe kom je erbij. Dat verkoop ik niet. Nooit gedaan. Ik ben Drents.',
    ]);
  },

  async kast({ ui }) {
    await ui.zeg('Potten met snoep, blikken erwten, pakken koffie. En helemaal achteraan, verstopt: een pakje Friese anijsblokjes.');
  },

  async boekenkast(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.boekenkastOpen) {
      if (staat.vlaggen.anneGevonden) {
        await ui.zeg('Achter de boekenkast is een donker, leeg kamertje.');
        return;
      }
      wereld.gaNaar('achterkamer', 3, 4, 'omhoog');
      return;
    }
    if (!staat.vlaggen.wezupQuest) {
      await ui.zeg('Een grote boekenkast. Eén geel boek steekt een beetje uit: "Friesland voor beginners".');
      return;
    }
    await ui.zeg([
      'Eén geel boek steekt een beetje uit: "Friesland voor beginners".',
      'Je trekt eraan...',
    ]);
    audio.sfx('klik');
    await ui.wachtMs(300);
    audio.sfx('deur');
    wereld.cameras.main.shake(200, 0.003);
    staat.vlaggen.boekenkastOpen = true;
    wereld.vernieuwObject('boekenkast');
    const h = wereld.persoon('hendrik');
    if (h) h.kijk('rechts');
    await ui.zeg([
      'KLIK. De boekenkast schuift opzij. Erachter is een smalle, donkere doorgang.',
      'HENDRIK: Nee... Niet doen. Alsjeblieft. Ze is nog maar een kind.',
    ]);
    wereld.gaNaar('achterkamer', 3, 4, 'omhoog');
  },
};

export const bakkerijScripts = {
  async bakker({ ui, staat }) {
    if (staat.vlaggen.wezupKlaar) {
      await ui.zeg('JANSEN: Gehoord? Die tjibbe is opgepakt! Vandaag krentenbollen voor de halve prijs. Feestje!');
      return;
    }
    await ui.zeg([
      'JANSEN: Goedemiddag! Krentenbollen, roggebrood, Drentse turf... eh, koek.',
      'JANSEN: Suikerbrood? Dat bakken die verdomde tjibbes uit Friesland. Hier bakken we gewoon krentenbrood. Zoals het hoort.',
      'JANSEN: De Duitsers kopen hier elke ochtend twintig broodjes. Goede klanten. Ze betalen nooit, maar toch.',
    ]);
  },
  async hans({ ui }) {
    await ui.zeg([
      'HANS: Isch vind Wezup heerlijk. De mensen hier zijn zo... behulpzaam.',
      'HANS: Isch hoef nooit iets zelf te zoeken. Ze wijzen alles aan. Wunderbar.',
    ]);
  },
  async oven({ ui }) {
    await ui.zeg('De oven gloeit. Er bakken krentenbollen. Er staat geen suikerbrood in. Je hebt gekeken.');
  },
};

export const slagerijScripts = {
  async slager({ ui }) {
    await ui.zeg([
      'MULDER: Friese droge worst! Pfff. Verdomde tjibbes. Hier hebben we Drentse metworst. Eerlijke worst.',
      'MULDER: Die Duitsers hebben gelijk, hoor. Orde moet er zijn. Ook in de worst.',
    ]);
  },
  async worsten({ ui }) {
    await ui.zeg('Een rek met metworsten. Op eentje staat met krijt: "FRIESE WORST = DOODZONDE".');
  },
};

// ================================================================== de geheime kamer

export const achterkamerScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.achterkamerGezien) return;
    staat.vlaggen.achterkamerGezien = true;
    await ui.zeg([
      'Een klein kamertje zonder ramen. Er brandt één kaarsje.',
      'Er staan kistjes met droge worst en suikerbrood. En op het bed zit een meisje met blonde vlechtjes.',
    ]);
  },

  async anne(ctx) {
    const { ui, wereld, staat } = ctx;
    if (staat.vlaggen.anneGevonden) return;
    await ui.zeg([
      'ANNE: ...Ben jij van de Duitsers?',
      'ANNE: Je bent een beer. Dat had ik niet verwacht. Heit zei altijd dat ze met laarzen zouden komen.',
    ]);
    if (aantal('dagboek') > 0) {
      await ui.zeg([
        'Haar ogen worden groot. Uit je rugzak steekt een schriftje met een kapot slotje.',
        'ANNE: Sjoukje! Mijn dagboek! Waar heb je dat gevonden?',
      ]);
      neemItem('dagboek');
      staat.vlaggen.anneDagboek = true;
      await ui.zeg([
        '{BEER} geeft het dagboek terug. Ze drukt het tegen zich aan.',
        'ANNE: Dank je wel. Echt.',
      ]);
    }
    await ui.zeg([
      'ANNE: Ze zoeken me, hè? Vanwege de droge worst. En het suikerbrood.',
      'ANNE: Heit verkocht het hier, onder de toonbank. De mensen kwamen er van heinde en verre voor.',
      'ANNE: Ook de mensen die nu "verdomde tjibbes" roepen.',
      'ANNE: ...Goed. Ik ga met je mee. Als ik hier blijf, nemen ze Hendrik ook nog mee.',
    ]);
    staat.vlaggen.anneGevonden = true;
    const a = wereld.persoon('anne');
    const plek = a ? { x: a.x, y: a.y } : wereld.vrijePlekBij(wereld.speler.x, wereld.speler.y);
    if (a) wereld.verwijderPersoon('anne');
    const v = wereld.voegVolgerToe('anne', plek.x, plek.y);
    v.richting = 'omlaag';
    wereld.plaatsVolger(v, 1);
    await ui.zeg(staat.vlaggen.anneDagboek
      ? 'Anne pakt haar dagboek en een stukje suikerbrood. Dan loopt ze zwijgend achter je aan.'
      : 'Anne pakt een stukje suikerbrood. Dan loopt ze zwijgend achter je aan.');
  },

  async bedje({ ui }) {
    await ui.zeg('Een smal bedje met een rood dekentje. Onder het kussen ligt een paar schaatsen.');
  },

  async bureautje({ ui }) {
    await ui.zeg('Een tafeltje met een kaarsje en een lege pot hagelslag. Iemand heeft hem helemaal leeggeschraapt.');
  },

  async smokkelwaar({ ui }) {
    await ui.zeg('Kistjes met Friese droge worst en suikerbrood. De zwarthandel waar heel Wezup zich zo druk om maakt. Het ruikt verrukkelijk.');
  },
};

