// Het vakantiepark. Op de parkeerplaats hoor je dat het park alleen per auto bereikbaar is; Levi scheurt langs in
// zijn witte Audi A1 en daarna kun je elke auto pakken. Bij de ingang heeft Levi de slagboomkaart de struiken in
// gegooid: zoek hem, haal hem door de kaartlezer en rijd naar de receptie.
import { aantal, neemItem } from '../core/staat.js';
import { park } from '../core/namen.js';
import { tekst, meet } from '../ui/tekst.js';

const tween = (scene, cfg) => new Promise((klaar) => scene.tweens.add({ ...cfg, onComplete: klaar }));

/** Stofwolkjes achter een auto. */
function stof(wereld, x, y, n = 8) {
  for (let i = 0; i < n; i++) {
    wereld.time.delayedCall(i * 50, () => {
      const w = wereld.add.circle(x + Phaser.Math.Between(-10, 10), y + Phaser.Math.Between(-4, 4), 3, 0xc8c0b0, 0.8).setDepth(8000);
      wereld.tweens.add({
        targets: w, y: w.y + Phaser.Math.Between(4, 14), scale: 2.4, alpha: 0, duration: 600, onComplete: () => w.destroy(),
      });
    });
  }
}

// ================================================================== 1. de parkeerplaats

const AUTO_TEKST = {
  rood: 'Een rode auto met een fietsenrek. Op de achterbank: drie kratten bier en een opblaasbare krokodil.',
  blauw: 'Een blauwe auto. Aan de spiegel hangt een geurboompje in de vorm van een braadworst.',
  zilver: 'Een zilveren auto vol handdoeken. Alleen maar handdoeken. Tot aan het dak.',
  geel: 'Een gele auto met een dakkoffer. Op de dakkoffer staat met stift: "NICHT ÖFFNEN. SOCKEN."',
  zwart: 'Een zwarte auto met getinte ramen. Op de stoel ligt een Duitse wegenkaart van Nederland uit 1987.',
  groen: 'Een groene auto. Op de hoedenplank zit een wiebelend hondje. Het knikt naar je.',
  wit: 'Een witte auto met een sticker op de achterklep: "ICH BREMSE AUCH FÜR HOLLÄNDER". Er zit een kras doorheen.',
};

/** Zet Levi's auto op de kaart (bij binnenkomst van Levi, of na het laden van een spel). */
function zetAudi(wereld, x, y) {
  wereld.maakObject({ id: 'audi', type: 'auto', kleur: 'levi', richting: 'omhoog', x, y, script: 'levi' });
  return wereld.objecten.audi.sprite;
}

/** De melding, en daarna Levi in zijn witte Audi A1. */
async function leviKomt(ctx) {
  const { ui, wereld, staat, audio } = ctx;
  staat.vlaggen.parkMelding = true;
  audio.sfx('bericht');
  const weg = ui.toonMelding('Receptie', 'Welkom! Park alleen per auto.');
  await ui.wachtMs(2200);
  await weg();
  await ui.zeg([
    'Een berichtje van de receptie van {PARK}: "Welkom! Let op: ons park is alleen met de auto bereikbaar. Voetgangers worden niet toegelaten."',
    'Alleen met de auto? Je bent een beer. Beren hebben geen rijbewijs. Beren hebben niet eens een paspoort.',
  ]);
  const s = wereld.speler;
  // achter je komt iets heel hard aanrijden
  audio.sfx('motor');
  s.richting = 'omlaag';
  wereld.plaatsSpeler();
  await wereld.uitroep(s);
  await ui.zeg('Achter je brult een motor. Heel hard. En hij komt heel snel dichterbij...');
  // de beer springt opzij
  const oud = { x: s.x, y: s.y };
  const kanten = s.x > 16 ? [s.x - 1, s.x + 1] : [s.x + 1, s.x - 1];
  const naarX = kanten.find((x) => x >= 16 && x <= 19 && wereld.kanLopen(x, s.y)) ?? kanten[0];
  audio.sfx('zoef');
  const basisY = s.sprite.y;
  wereld.tweens.add({ targets: s.sprite, x: naarX * 16 + 8, duration: 260 });
  await tween(wereld, { targets: s.sprite, y: basisY - 10, duration: 130, yoyo: true, ease: 'Sine.easeOut' });
  wereld.zetSpeler(naarX, oud.y, naarX < oud.x ? 'rechts' : 'links');
  // de witte Audi komt naast je tot stilstand
  const audi = zetAudi(wereld, oud.x, oud.y);
  const eindY = audi.y;
  audi.y = eindY + 150;
  audio.sfx('scheur');
  await tween(wereld, { targets: audi, y: eindY, duration: 900, ease: 'Cubic.easeOut' });
  audio.sfx('remmen');
  stof(wereld, audi.x, audi.y);
  wereld.cameras.main.shake(200, 0.004);
  await ui.zeg([
    'Een witte Audi A1 komt met piepende banden naast je tot stilstand. Zwart dak. Zwarte velgen. Getinte ramen.',
    'Het raampje gaat langzaam omlaag. Er komt een wolk aardbeien-vape uit.',
  ]);
}

export const parkeerplaatsScripts = {
  opbouw({ wereld, staat }) {
    // spel opgeslagen terwijl Levi nog stond te wachten? Dan staat hij er gewoon weer.
    if (staat.vlaggen.parkMelding && !staat.vlaggen.leviWeg) {
      const plek = [[17, 6], [18, 6], [17, 4], [18, 4]].find(([x, y]) => x !== staat.x || y !== staat.y);
      zetAudi(wereld, plek[0], plek[1]);
    }
  },

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.parkeerplaatsGezien) return;
    staat.vlaggen.parkeerplaatsGezien = true;
    await ui.zeg([
      'De parkeerplaats van {PARK}. Rijen auto\'s met Duitse kentekens, caravans en stapels koffers.',
      'Iedereen hier heeft heel erg zin in vakantie. Héél erg.',
    ]);
  },

  naStap(ctx) {
    const { staat, wereld, ui } = ctx;
    if (staat.vlaggen.parkMelding || wereld.inAuto) return false;
    const s = wereld.speler;
    if (s.y > 8 || s.x < 16 || s.x > 19) return false;
    ui.script(() => leviKomt(ctx));
    return true;
  },

  async levi({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.leviWeg) return;
    await ui.zeg([
      'LEVI: Yo! Sorry bro, ik zag je niet. Ik zat op mijn telefoon.',
      'LEVI: Ik ben Levi. Nice muts, trouwens.',
      'LEVI: Ken je dit park? Ik ga er zo met 180 overheen scheuren. Over de drempels, langs het zwembad, dwars door de minigolf.',
      'LEVI: Hier mag je 15. Ik doe 180. Dat is twaalf keer zo hard. Heb ik uitgerekend. Op mijn telefoon.',
      'LEVI: Jij hebt geen auto? Pak er gewoon eentje, man. Die Duitsers laten overal de sleutels in zitten. Die zijn veel te hyped voor hun vakantie.',
      'LEVI: Ik ben weg. Doeiii!',
    ]);
    staat.vlaggen.leviWeg = true;
    const audi = wereld.objecten.audi;
    if (audi) {
      audio.sfx('scheur');
      stof(wereld, audi.sprite.x, audi.sprite.y, 12);
      await tween(wereld, { targets: audi.sprite, y: audi.sprite.y - 280, duration: 750, ease: 'Cubic.easeIn' });
      wereld.verwijderObject('audi');
    }
    await ui.zeg([
      'Weg is Levi. Je hoort hem nog een hele tijd: "WOEHOEEEE!"',
      'Hij heeft wel gelijk. Elke auto op deze parkeerplaats is nu van jou. Nou ja. Bijna.',
    ]);
  },

  async auto(ctx, { x, y }) {
    const { ui, wereld, staat, audio } = ctx;
    const obj = Object.values(wereld.objecten)
      .find((o) => o.data.type === 'geparkeerd' && o.data.y === y && (o.data.x === x || o.data.x + 1 === x));
    if (!obj) return;
    const a = obj.data;
    if (wereld.inAuto) {
      await ui.zeg('Je hebt al een auto. Eén geleende auto per beer is wel genoeg.');
      return;
    }
    if (!staat.vlaggen.leviWeg) {
      await ui.zeg([AUTO_TEKST[a.kleur], 'De sleutel zit erin. Maar je bent een beer. Beren lopen gewoon.']);
      return;
    }
    await ui.zeg(AUTO_TEKST[a.kleur]);
    const keuze = await ui.vraag('De sleutel zit erin! Neem je deze auto?', ['INSTAPPEN', 'NEE']);
    if (keuze !== 0) return;
    staat.vlaggen[`autoWeg_${a.id}`] = true;
    await ui.naarZwart(250);
    wereld.verwijderObject(a.id);
    wereld.zetSpeler(a.x, a.y, a.richting);
    wereld.stapInAuto(a.kleur);
    await ui.vanZwart(250);
    audio.sfx('motor');
    await ui.zeg([
      '{BEER} kruipt achter het stuur. De stoel staat helemaal naar achteren. Op het dashboard ligt een Duitse zonnebril.',
      'VROEM! Geen rijbewijs, geen probleem. Niemand vraagt een beer om zijn rijbewijs.',
      '(Hou B ingedrukt om extra hard te rijden. Net als Levi.)',
    ]);
  },

  async naarPark({ ui, wereld, staat }, { warp }) {
    if (!wereld.inAuto) {
      await ui.zeg(staat.vlaggen.leviWeg
        ? 'Te voet kom je het park niet op. Pak een auto! De sleutels zitten er toch in.'
        : 'Te voet kom je het park niet op, zei de receptie. Misschien kan die jongen in de witte auto je helpen.');
      return;
    }
    wereld.gaNaar('parkingang', warp.x <= 17 ? 14 : 15, 24, 'omhoog');
  },

  async terug({ ui, wereld }, { warp }) {
    if (wereld.inAuto) {
      await ui.zeg('Met een geleende auto terug naar Aalden? Manfred ziet je al aankomen. Het park is de andere kant op.');
      return;
    }
    wereld.gaNaar('aalden', warp.x <= 17 ? 31 : 32, 1, 'omlaag');
  },

  async kist({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.parkKist) {
      await ui.zeg('Het kistje is leeg. Er ligt alleen nog een parkeerbonnetje in. Van 1998.');
      return;
    }
    audio.sfx('kist');
    staat.vlaggen.parkKist = true;
    wereld.vernieuwObject('parkKist');
    await ui.zeg('Iemand heeft een kistje in een leeg parkeervak gezet. Om de plek bezet te houden, waarschijnlijk.');
    await ui.krijgItem('voedselbon');
  },

  // ---- de vakantiegangers

  async heinz({ ui, staat }) {
    await ui.zeg(staat.vlaggen.visKlaar ? [
      'HEINZ: BÄR! Du hier?! Wir auch! Ons verlof is nog niet op, dus wij gaan nog een weekje naar het park!',
      'HEINZ: Isch heb jouw vissen nog in de koelbox. Voor de barbecue. Je bent welkom! Huisje 12!',
    ] : [
      'HEINZ: URLAUB! Endlich Urlaub! Drie weken niks doen. Behalve barbecueën. En vissen.',
    ]);
  },

  async rudiger({ ui }) {
    await ui.zeg([
      'RÜDIGER: Factor vijftig! Isch heb het geleerd. En een hoedje. En een zonnescherm. En een parasol.',
      'RÜDIGER: Isch ga deze vakantie helemaal niet verbranden. Isch ga gewoon de hele dag in de caravan zitten.',
    ]);
  },

  async karl({ ui }) {
    await ui.zeg([
      'KARL: Nieuwe sokken! Speciaal voor de vakantie. Wit, met een streepje.',
      'KARL: Isch heb ook nieuwe sandalen. Daar gaan de sokken in. Isch ben nog nooit zo gelukkig geweest.',
    ]);
  },

  async gisela({ ui }) {
    await ui.zeg([
      'GISELA: URLAUB! URLAUB! URLAUB!',
      'GISELA: Isch heb er een heel jaar op gewacht. Isch heb drie koffers bij me. Eén alleen voor de handdoeken.',
    ]);
  },

  async jurgen({ ui }) {
    await ui.zeg([
      'JÜRGEN: Wij komen hier al vijfentwintig jaar. Altijd hetzelfde huisje. Huisje 37.',
      'JÜRGEN: Als er iemand anders in huisje 37 zit, gaan wij weer naar huis. Zo is het.',
    ]);
  },

  async dieter({ ui }) {
    await ui.zeg([
      'DIETER: Isch heb verlof! Drie weken! Isch ga helemaal niks doen.',
      'DIETER: Behalve elke ochtend om zes uur een ligbedje reserveren bij het zwembad. Met een handdoek. Dat is traditie.',
    ]);
  },

  async helga({ ui }) {
    await ui.zeg([
      'HELGA: Mein Mann heeft een satellietschotel op de caravan gezet. Wij missen geen enkele aflevering van onze krimi.',
      'HELGA: Vakantie is pas vakantie als het precies hetzelfde is als thuis.',
    ]);
  },

  async uwe({ ui }) {
    await ui.zeg([
      'UWE: Isch ben al drie keer rond de parkeerplaats gejogd. Isch ben zo opgewonden, isch kan niet stilstaan!',
      'UWE: Heb jij die witte Audi gezien? Wat een rijstijl. Bijna Duits.',
    ]);
  },

  async caravan({ ui }) {
    await ui.zeg('Een caravan met een satellietschotel, een fietsenrek en een vlaggetje. Op de achterkant: "WIR SIND DANN MAL WEG".');
  },

  async koffers({ ui }) {
    await ui.zeg('Een berg koffers. Op elk label staat "URLAUB!!!". Met drie uitroeptekens.');
  },

  async pBord({ ui }) {
    await ui.zeg('P. Parkeren alleen voor gasten van {PARK}. Eronder hangt een tweede bordje: "AUCH FÜR DEUTSCHE GÄSTE".');
  },

  async automaat({ ui }) {
    await ui.zeg('Parkeren: €45 per uur. Daaronder zit een sticker: "DEUTSCHE GÄSTE: KOSTENLOS". Natuurlijk.');
  },
};

// ================================================================== 2. de ingang van het park

export const parkingangScripts = {
  opbouw({ wereld }) {
    // de naam van het park op de welkomstboog
    const boog = wereld.objecten.poortboog;
    if (!boog) return;
    const naam = park().toUpperCase();
    const b = meet(wereld, naam);
    tekst(wereld, boog.sprite.x + (128 - b) / 2, boog.sprite.y - 56 + 16, naam, 'donker').setDepth(5001);
  },

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.parkingangGezien) return;
    staat.vlaggen.parkingangGezien = true;
    await ui.zeg([
      'De ingang van {PARK}. Een houten welkomstboog, vlaggetjes, bungalows en daar, aan het eind van de weg: de receptie.',
      'Er zit alleen nog een slagboom tussen jou en je vakantie.',
    ]);
  },

  async jochem({ ui, staat }) {
    if (staat.vlaggen.parkSlagboomOpen) {
      await ui.zeg('JOCHEM: Fijne vakantie! En als je Levi ziet: zeg maar dat hij hier nooit meer in mag. Hij komt toch wel.');
      return;
    }
    if (aantal('slagboomkaart')) {
      await ui.zeg('JOCHEM: Je hebt hem gevonden! Haal hem maar even langs de kaartlezer, links van de slagboom.');
      return;
    }
    if (staat.vlaggen.jochemGesproken) {
      await ui.zeg('JOCHEM: Die kaart vloog naar links. De struiken in. Bij die bosjes, daar.');
      return;
    }
    staat.vlaggen.jochemGesproken = true;
    await ui.zeg([
      'JOCHEM: Welkom bij {PARK}! Ik ben Jochem, van de slagboom.',
      'JOCHEM: Net kwam hier een jongen in een witte Audi aanscheuren. Hij griste mijn slagboomkaart uit het hokje en deed de slagboom open.',
      'JOCHEM: En daarna gooide hij de kaart gewoon uit zijn raampje. Het was Levi. Iedereen kent Levi.',
      'JOCHEM: Zonder kaart gaat de slagboom niet meer open. En ik mag het hokje niet uit. Arbo.',
      'JOCHEM: Ik zag hem die kant op vliegen. Naar links, de struiken in.',
    ]);
  },

  async kaart({ ui, wereld, staat }) {
    if (staat.vlaggen.kaartGevonden) return;
    staat.vlaggen.kaartGevonden = true;
    await ui.zeg(wereld.inAuto
      ? 'Er glinstert iets tussen de struiken. {BEER} leunt ver uit het raampje en vist het eruit...'
      : 'Er glinstert iets tussen de struiken...');
    wereld.verwijderObject('kaart');
    await ui.krijgItem('slagboomkaart', 1, 'vond');
    await ui.zeg('Er zit een vlek pindasaus op. Typisch Levi.');
  },

  async kaartlezer({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.parkSlagboomOpen) {
      await ui.zeg('Het lampje is groen. De slagboom staat open.');
      return;
    }
    if (!aantal('slagboomkaart')) {
      audio.sfx('fout');
      await ui.zeg([
        'De kaartlezer piept boos. Op het schermpje: "KAART AUB".',
        'Daaronder, kleiner: "Geen kaart? Vraag het de slagboomwachter."',
      ]);
      return;
    }
    await ui.zeg('{BEER} houdt de slagboomkaart voor de lezer...');
    audio.sfx('piep');
    neemItem('slagboomkaart');
    staat.vlaggen.parkSlagboomOpen = true;
    wereld.vernieuwObject('kaartlezer');
    await ui.wachtMs(300);
    audio.sfx('klik');
    wereld.vernieuwObject('slagboomPark');
    await ui.zeg([
      'PIEP! Het lampje springt op groen en de slagboom gaat omhoog!',
      'De kaartlezer houdt de kaart meteen in. Die heeft duidelijk ook over Levi gehoord.',
    ]);
  },

  async slagboom({ ui, staat }) {
    await ui.zeg(staat.vlaggen.parkSlagboomOpen
      ? 'De slagboom staat open. Op naar de receptie!'
      : 'Een rood-witte slagboom. Er hangt een bordje aan: "ALLEEN MET KAART".');
  },

  async receptie({ ui, wereld, staat }) {
    if (!staat.vlaggen.receptieBereikt) {
      staat.vlaggen.receptieBereikt = true;
      await ui.zeg([
        'Je parkeert de auto schuin op het plein, half in een bloembak, vlak voor de deur. Precies zoals Levi het zou doen.',
        '{BEER} stapt uit en kijkt omhoog. De receptie van {PARK}.',
        'Het kamp, het bos, de dorpjes, de N34, de onderduikers, de vissen, de shag... en nu sta je hier. Je bent er.',
        'De schuifdeuren gaan open. Ergens binnen klinkt een belletje.',
      ]);
    }
    wereld.gaNaar('receptie_binnen', 5, 7, 'omhoog');
  },

  async naarHuisjes({ ui, wereld, staat }, { warp }) {
    if (!staat.vlaggen.directeurVerslagen) {
      await ui.zeg('Een bordje: "VAKANTIEHUISJES - EERST INCHECKEN BIJ DE RECEPTIE". Zonder sleutel geen huisje.');
      return;
    }
    wereld.gaNaar('vakantiestraat', 1, warp.y, 'rechts');
  },

  async receptieGevel({ ui }) {
    await ui.zeg('De receptie. Achter het glas hangen folders over het zwemparadijs, de minigolf en de "Duitse week".');
  },

  async vlag({ ui }) {
    await ui.zeg('De vlag van {PARK}: een zonnetje boven een golf. Hij wappert vrolijk. Hij weet nog niks van de Duitsers.');
  },

  async bungalow({ ui }) {
    await ui.zeg('Een vakantiebungalow. Op het terras staat een tuinstoel. Op de tuinstoel ligt een handdoek. Bezet.');
  },

  async wegwijzer({ ui }) {
    await ui.zeg('RECEPTIE, ZWEMBAD, MINIGOLF. Iemand heeft er met stift een vierde pijltje bij getekend: "LEVI".');
  },

  async boog({ ui }) {
    await ui.zeg('WELKOM IN {PARK}. De letters zijn nog maar half droog. Iemand heeft er net een nieuwe laag verf op gezet.');
  },

  async huisje({ ui }) {
    await ui.zeg('Het slagboomhuisje. Er hangt een briefje op de deur: "NIET STOREN - ARBO".');
  },

  async selfie({ ui }) {
    await ui.zeg([
      'TOERIST: Selfie! Mit dem Schild!',
      'TOERIST: Isch ben hier nu vijfentwintig keer geweest. Isch heb vijfentwintig keer dezelfde selfie. Prachtig.',
    ]);
  },

  async tuinman({ ui }) {
    await ui.zeg([
      'TUINMAN: Zag je die witte Audi? Dwars door mijn perkje. Met 180.',
      'TUINMAN: De petunia\'s zijn nog steeds in shock.',
    ]);
  },
};
