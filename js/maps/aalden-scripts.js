// Aalden: Stabsgefreiter Manfred is zijn Duitse zware shag kwijt. Tabakszaak Gerard heeft het pakje,
// maar verkoopt het voor €150. Opa Jannes in Huize Avondrood geeft je geld voor zijn boodschappen...
import { aantal, neemItem } from '../core/staat.js';
import { berenGevel } from './beren-scripts.js';

const PRIJS = 150;

const tween = (scene, cfg) => new Promise((klaar) => scene.tweens.add({ ...cfg, onComplete: klaar }));

/** Rookwolkjes boven iemands hoofd. */
function rook(wereld, p, n = 6) {
  for (let i = 0; i < n; i++) {
    wereld.time.delayedCall(i * 160, () => {
      const w = wereld.add.circle(p.sprite.x + 3, p.sprite.y - 16, 2 + Math.random() * 2, 0xd8d8e0, 0.8).setDepth(9000);
      wereld.tweens.add({
        targets: w,
        x: w.x + Phaser.Math.Between(-6, 10),
        y: w.y - Phaser.Math.Between(14, 26),
        scale: 2.2,
        alpha: 0,
        duration: 1100,
        onComplete: () => w.destroy(),
      });
    });
  }
}

// ================================================================== het dorp

export const aaldenScripts = {
  berenGevel,

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.aaldenGezien) return;
    staat.vlaggen.aaldenGezien = true;
    await ui.zeg([
      'Aalden. Rieten daken, groen-witte luiken, een molen en een brink met een dikke eik.',
      'Het laatste stadje voor {PARK}. Ergens in het noorden moet de weg naar het park zijn.',
    ]);
  },

  async manfred(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    const m = wereld.persoon('manfred');
    if (staat.vlaggen.aaldenKlaar) {
      if (m) rook(wereld, m, 3);
      await ui.zeg('MANFRED: *pfff* Ga maar, beer. Isch zie toch niks met al die rook.');
      return;
    }
    if (!staat.vlaggen.aaldenQuest) {
      audio.sfx('kuch');
      await ui.zeg([
        'MANFRED: HALT! *kuch* *kuch* Niemand komt hier langs!',
        'MANFRED: Isch ben Stabsgefreiter Manfred. Isch bewaak de weg naar het vakantiepark.',
        'MANFRED: En isch ben... isch ben mijn tabak kwijt. Een pakje Duitse zware shag. Het enige wat isch rook.',
        'MANFRED: Sinds gisteren heb isch niks meer gerookt. Isch ben heel nerveus. Isch schiet bijna op alles wat beweegt.',
        'MANFRED: Vind mijn shag. Dan gaat de slagboom open. Erewoord van een Stabsgefreiter.',
      ]);
      staat.vlaggen.aaldenQuest = true;
      await ui.zeg('Ergens in Aalden ligt een pakje Duitse shag. Waar zouden ze hier gevonden spullen naartoe brengen?');
      return;
    }
    if (!aantal('shag')) {
      audio.sfx('kuch');
      if (staat.vlaggen.tabakGeweigerd) {
        await ui.zeg([
          'MANFRED: Gerard heeft mijn shag? En hij wil er honderdvijftig euro voor?!',
          'MANFRED: In Duitsland betaal isch een tientje! *kuch* Dit land is gek.',
          'MANFRED: Isch kan hier niet weg. Befehl ist Befehl. Jij moet het halen, beer.',
        ]);
      } else {
        await ui.zeg('MANFRED: En? Heb je mijn shag? *kuch* Nee? Waarom sta je dan nog hier?');
      }
      return;
    }
    // de shag!
    if (m) m.kijk('links');
    await ui.zeg('MANFRED: Is dat...? MEIN TABAK!');
    neemItem('shag');
    await ui.zeg('{BEER} geeft het pakje Duitse zware shag aan Manfred.');
    if (m) {
      wereld.kijkNaarElkaar(m);
      await ui.wachtMs(300);
      await ui.zeg('Manfred draait in drie seconden een sjekkie. Met één hand. Hij heeft duidelijk veel geoefend.');
      audio.sfx('sis');
      rook(wereld, m, 8);
      await ui.wachtMs(900);
      audio.sfx('kuch');
      wereld.cameras.main.shake(250, 0.003);
    }
    await ui.zeg([
      'MANFRED: Ahhhh. *KUCH* *KUCH KUCH* Wunderbar.',
      'MANFRED: Weet je wat het enige probleem is aan Nederland, beer? De tabak. Veel te duur. Daar wordt een mens toch chagrijnig van.',
      'MANFRED: Goed. Een Stabsgefreiter houdt zijn woord.',
    ]);
    staat.vlaggen.aaldenSlagboomOpen = true;
    staat.vlaggen.aaldenKlaar = true;
    wereld.vernieuwObject('slagboomAalden');
    audio.sfx('klik');
    if (m && (m.x !== 33 || m.y !== 4)) wereld.zetPersoon(m, 33, 4, 'links');
    await ui.zeg([
      'De slagboom gaat omhoog.',
      'MANFRED: Het vakantiepark is daar, rechtdoor. Isch heb jou nooit gezien. Isch zie toch niks, met al die rook.',
    ]);
  },

  async slagboom({ ui, staat }) {
    if (staat.vlaggen.aaldenSlagboomOpen) {
      await ui.zeg('De slagboom staat open. De weg naar het park is vrij.');
      return;
    }
    await ui.zeg('Een rood-witte slagboom. Er hangt een bordje aan: "GESCHLOSSEN. RAUCHERPAUSE."');
  },

  async bordPark({ ui, staat }) {
    await ui.zeg([
      'Een bruin bord: VAKANTIEPARK. Met een tentje en een pijl naar het noorden.',
      staat.vlaggen.aaldenKlaar ? 'Je bent er bijna. Echt bijna.' : 'Zo dichtbij... Was die slagboom er maar niet.',
    ]);
  },

  async uitgang({ ui, staat }) {
    if (!staat.vlaggen.aaldenKlaar) return;
    await ui.zeg([
      'Je loopt onder de slagboom door. Achter je hoor je Manfred tevreden hoesten.',
      'Het pad gaat het bos in. Tussen de bomen zie je al vlaggetjes, een slagboom en een receptie. {PARK}!',
      'EINDE VAN HOOFDSTUK 7. Wordt vervolgd!',
      '(Tip: sla je spel op via START, dan kun je straks verder.)',
    ]);
  },

  async huisje({ ui }) {
    const zinnen = [
      'Een Drents huisje met groen-witte luiken. Achter het raam staat een vaas met plastic tulpen.',
      'Op de deur hangt een bordje: "GEEN COLPORTEURS, GEEN DUITSERS". Het tweede is er later bij geschreven.',
      'Er klinkt een radio. Iemand zingt mee. Vals. Maar met heel veel gevoel.',
      'Op de vensterbank zit een kat. Ze kijkt je aan alsof jij hier niet hoort. Dat klopt eigenlijk ook.',
    ];
    await ui.zeg(zinnen[Math.floor(Math.random() * zinnen.length)]);
  },

  async tabakGevel({ ui }) {
    await ui.zeg([
      'Tabakszaak Gerard. Tabak, sigaren, kranten en krasloten.',
      'Op de etalage zit een briefje geplakt: "GEVONDEN VOORWERPEN: VRAAG BINNEN".',
    ]);
  },

  async bejaardenGevel({ ui }) {
    await ui.zeg([
      'Huize Avondrood. Achter elk raam hangen oranje gordijnen.',
      'Achter één raam zwaait iemand naar je. Of hij slaat een vlieg dood. Dat is niet helemaal duidelijk.',
    ]);
  },

  async scootmobiel({ ui }) {
    await ui.zeg('Een rode scootmobiel. Op de achterkant zit een sticker: "IK REM OOK VOOR DUITSERS. SOMS."');
  },

  async molen({ ui }) {
    await ui.zeg('Molen De Hoop. De wieken draaien rustig rond. Er hangt een geur van vers meel.');
  },

  async molenDeur({ ui }) {
    await ui.zeg('De deur zit op slot. Er hangt een briefje: "BEN EVEN BIJ DE BEREN. - JAN".');
  },

  async meelzakken({ ui }) {
    await ui.zeg('Zakken meel. Op eentje staat met stift: "NIET VOOR DE KOMMANDANTUR".');
  },

  async bordDorp({ ui }) {
    await ui.zeg('AALDEN. Eronder staat: "Het mooiste dorp van Drenthe". Dat staat onder elk dorpsbord in Drenthe.');
  },

  async eik({ ui }) {
    await ui.zeg('Een eeuwenoude eik. In de schors staan honderden namen en hartjes gekerfd. Eén hartje is heel nieuw: "M + SHAG".');
  },

  async bankje({ ui }) {
    await ui.zeg('Een bankje met een koperen plaatje: "Ter nagedachtenis aan Hendrikus, die hier altijd zat". Je gaat er maar niet op zitten.');
  },

  async pomp({ ui }) {
    await ui.zeg('Een oude dorpspomp. Je pompt een paar keer. Er komt een slak uit.');
  },

  async dobbe({ ui }) {
    await ui.zeg('Een dobbe: een Drents vennetje. Een eend kijkt je aan, kwaakt één keer en draait zich om.');
  },

  // ---- dorpelingen

  async geert({ ui, staat }) {
    await ui.zeg(staat.vlaggen.aaldenKlaar
      ? 'GEERT: Moi. Manfred staat weer te roken? Mooi zo. Dan is hij tenminste rustig.'
      : [
        'GEERT: Moi. Hier in Aalden doen we niet moeilijk. Duitsers, geen Duitsers... als de koffie maar warm is.',
        'GEERT: Al zit die Duitser bij de slagboom wel de hele dag te hoesten en te vloeken. Hij is iets kwijt, geloof ik.',
      ]);
  },

  async hennie({ ui, staat }) {
    if (staat.vlaggen.aaldenKlaar) {
      await ui.zeg('HENNIE: Zag ik daar nou een beer met een envelop van ome Jannes lopen? Nee hè. Ik zie ook al dingen.');
      return;
    }
    await ui.zeg([
      'HENNIE: Heb je het gehoord? Die Duitser bij de slagboom is zijn shag kwijt.',
      'HENNIE: Gevonden spullen brengen we hier altijd naar Gerard van de tabakszaak. Die verkoopt ze dan gewoon weer door. Handig is dat.',
    ]);
  },

  async bert({ ui }) {
    await ui.zeg([
      'BERT: Ik woon in Huize Avondrood. Maar ik ben ontsnapt.',
      'BERT: Niet doorvertellen, hè. Om vijf uur moet ik terug. Dan is er warme prak.',
    ]);
  },

  async lothar({ ui, staat }) {
    await ui.zeg(staat.vlaggen.aaldenKlaar
      ? 'LOTHAR: Manfred rookt weer. Godzijdank. Nu kan isch eindelijk weer in de buurt van de slagboom komen.'
      : [
        'LOTHAR: Manfred zonder shag is gevaarlijker dan een tank zonder rem.',
        'LOTHAR: Isch blijf hier lekker uit de buurt. Isch rook zelf niet. Isch eet. Bij De Beren.',
      ]);
  },

  async jan({ ui }) {
    await ui.zeg([
      'JAN: Dit is molen De Hoop. Hij draait al tweehonderd jaar.',
      'JAN: De Duitsers wilden hem stilzetten. Maar ze konden de rem niet vinden. Ik heb hem goed verstopt.',
    ]);
  },
};

// ================================================================== tabakszaak Gerard

export const tabakszaakScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.tabakszaakGezien) return;
    staat.vlaggen.tabakszaakGezien = true;
    await ui.zeg('Het ruikt naar tabak, drop en oude kranten. Achter de toonbank staat een man in een bruin vest.');
  },

  async gerard(ctx) {
    const { ui, staat, audio, wereld } = ctx;
    const g = wereld.persoon('gerard');
    if (g) g.kijk('omlaag');
    if (staat.vlaggen.aaldenKlaar) {
      await ui.zeg('GERARD: Is Manfred tevreden? Mooi. Dan staat hij tenminste niet meer de hele dag voor mijn etalage te hoesten.');
      return;
    }
    if (aantal('shag')) {
      await ui.zeg('GERARD: Breng dat pakje maar gauw naar die Duitser. Voor hij hier de hele winkel komt opkopen.');
      return;
    }
    if (aantal('envelop')) {
      await ui.zeg([
        'GERARD: Zo, ben je daar weer? Wat heb je daar? Een envelop?',
        '{BEER} schuift de envelop van opa Jannes over de toonbank. Je kijkt er niet bij.',
        'GERARD: Honderdvijftig euro. Precies. Kijk, dat noem ik nog eens een klant.',
      ]);
      neemItem('envelop');
      audio.sfx('kassa');
      staat.vlaggen.shagGekocht = true;
      await ui.krijgItem('shag', 1, 'kreeg');
      await ui.zeg([
        'GERARD: Weet je dat zo\'n pakje in Duitsland maar een tientje kost?',
        'GERARD: Het enige wat die Duitsers wel goed doen, zijn de tabaksprijzen. Hier kan Rob Jetten nog wat van leren.',
      ]);
      return;
    }
    if (!staat.vlaggen.aaldenQuest) {
      await ui.zeg([
        'GERARD: Goeiemiddag! Tabak, sigaren, de krant? Een kraslot?',
        'GERARD: Niks? Een beer die niet rookt. Verstandig.',
        'GERARD: Er ligt hier trouwens nog een pakje Duitse zware shag. Gevonden op de brink. Iemand zal dat wel missen.',
      ]);
      return;
    }
    await ui.zeg([
      'GERARD: Dat pakje Duitse zware shag? Ja, dat ligt hier. Gevonden op de brink, onder de eik.',
      `GERARD: Dat kost dan honderdvijftig euro.`,
      'GERARD: Dat is gewoon de prijs, hoor. Met accijns. En toeslag op het vloeitje. En vindersloon.',
    ]);
    if ((staat.geld || 0) >= PRIJS) {
      const keuze = await ui.vraag(`Betaal je €${PRIJS} voor de shag?`, ['BETALEN', 'NEE']);
      if (keuze === 0) {
        staat.geld -= PRIJS;
        audio.sfx('kassa');
        staat.vlaggen.shagGekocht = true;
        await ui.krijgItem('shag', 1, 'kreeg');
        await ui.zeg('GERARD: Het enige wat die Duitsers wel goed doen, zijn de tabaksprijzen. Hier kan Rob Jetten nog wat van leren.');
      }
      return;
    }
    staat.vlaggen.tabakGeweigerd = true;
    await ui.zeg([
      `GERARD: Hoeveel heb jij bij je? €${staat.geld || 0}? Daar krijg je hier nog geen vloeitje voor.`,
      'GERARD: Geen geld, geen shag. Zo werkt dat in de middenstand.',
      'GERARD: Die oudjes in Huize Avondrood hebben altijd wel wat contant liggen. Voor de boodschappen. Ik zeg maar wat, hè.',
    ]);
  },

  async bodo({ ui, wereld }) {
    const b = wereld.persoon('bodo');
    if (b) b.kijk('omlaag');
    await ui.zeg([
      'BODO: Isch kras al de hele ochtend krasloten. Isch heb nog niks gewonnen.',
      'BODO: In Duitsland win isch altijd. Daar zijn de krasloten ook beter. En de tabak goedkoper.',
    ]);
    if (b) b.kijk('omhoog');
  },

  async schap({ ui }) {
    await ui.zeg('Een kast vol pakjes shag, sigarenkistjes en pijpen. Op een bordje: "ROKEN IS SLECHT VOOR U. MAAR GOED VOOR DE OMZET."');
  },

  async kranten({ ui }) {
    await ui.zeg([
      'De krant van vandaag. Kop: "DUITSERS IN DRENTHE: TOERISME STIJGT".',
      'Daaronder, kleiner: "Beer ontsnapt uit kamp, nog steeds voortvluchtig". Je legt de krant snel terug.',
    ]);
  },
};

// ================================================================== Huize Avondrood

export const avondroodScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.avondroodGezien) return;
    staat.vlaggen.avondroodGezien = true;
    await ui.zeg([
      'Het is warm binnen. Héél warm. De verwarming staat op dertig graden.',
      'Het ruikt naar koffie, cake en lavendel. Op de televisie staat een quiz. Heel hard.',
    ]);
  },

  async jannes(ctx) {
    const { ui, staat, wereld } = ctx;
    const j = wereld.persoon('jannes');
    if (j) wereld.kijkNaarElkaar(j);
    if (staat.vlaggen.jannesPepermunt) {
      await ui.zeg('JANNES: Wie ben jij ook alweer? Ach, dat geeft niet. Gezellig dat je er bent.');
      return;
    }
    if (staat.vlaggen.shagGekocht) {
      await ui.zeg([
        'JANNES: Daar ben je weer! Heb je mijn boodschappen?',
        '{BEER} kijkt heel aandachtig naar de staande klok.',
        'JANNES: ...',
        'JANNES: Wat kwam je ook alweer doen? Ach, ik word oud. Ik vergeet tegenwoordig alles.',
        'JANNES: Hier, neem een pepermuntje. Jij bent een beste beer.',
      ]);
      staat.vlaggen.jannesPepermunt = true;
      await ui.krijgItem('pepermuntje', 1, 'kreeg');
      await ui.zeg('Je voelt je heel even heel erg schuldig. Het pepermuntje helpt een beetje.');
      return;
    }
    if (aantal('envelop')) {
      await ui.zeg('JANNES: Nog niet weg? Koffie, beschuit, drop en advocaat. Het staat op de envelop. Niet vergeten, hè!');
      return;
    }
    if (!staat.vlaggen.tabakGeweigerd) {
      await ui.zeg([
        'JANNES: Ha, een beer! Vroeger hadden ze die ook in de dierentuin in Emmen. Die waren groter.',
        'JANNES: Ik zou wel iemand kunnen gebruiken die boodschappen voor me doet. Maar jij hebt het vast druk.',
      ]);
      return;
    }
    await ui.zeg([
      'JANNES: Jij daar! Beer! Kom eens hier.',
      'JANNES: Zou jij boodschappen voor me willen doen? De zuster heeft het zo druk. En mijn scootmobiel staat aan de lader.',
      'JANNES: Een pak koffie, een rol beschuit, een zak Engelse drop en een fles advocaat. Het staat allemaal op de envelop.',
      'JANNES: Hier. Honderdvijftig euro. Dat zal wel genoeg zijn. Alles is zo duur geworden.',
    ]);
    await ui.vraag('Doe je de boodschappen voor opa Jannes?', ['JA HOOR', 'NATUURLIJK']);
    await ui.zeg('{BEER} knikt heel braaf. Koffie, beschuit, drop en advocaat. Natuurlijk.');
    await ui.krijgItem('envelop', 1, 'kreeg');
    await ui.zeg([
      'JANNES: Wat een lieve beer. Tot zo, hè!',
      'In je hoofd sta je al in de tabakszaak.',
    ]);
  },

  async ineke({ ui, staat }) {
    await ui.zeg(staat.vlaggen.shagGekocht
      ? 'ZUSTER INEKE: Meneer Jannes zegt dat er een beer met zijn boodschappen vandoor is. Maar dat zegt hij elke week.'
      : [
        'ZUSTER INEKE: Meneer Jannes vraagt iedereen om boodschappen te doen. Hij vergeet het daarna altijd weer.',
        'ZUSTER INEKE: De Duitsers? Die komen hier alleen op woensdag. Voor de bingo. Ze winnen nooit.',
      ]);
  },

  async grietje({ ui }) {
    await ui.zeg([
      'GRIETJE: BINGO!',
      'GRIETJE: ...Nee, toch niet. Ik heb al vijf jaar geen bingo meer gehad. Ik blijf het gewoon roepen. Voor de zekerheid.',
    ]);
  },

  async kloosterman({ ui }) {
    await ui.zeg([
      'MENEER KLOOSTERMAN: Zzzz...',
      'MENEER KLOOSTERMAN: Wat? Is het al koffietijd? ...Zzzz.',
    ]);
  },

  async klok({ ui }) {
    await ui.zeg('Een Friese staande klok. Hij loopt tien minuten achter. Net als iedereen hier.');
  },

  async tv({ ui }) {
    await ui.zeg([
      'Op de televisie: een quiz. "Wat is de hoofdstad van Drenthe?"',
      'De kandidaat weet het niet. Iedereen in de zaal roept: "ASSEN!" Je roept het zelf ook, een beetje.',
    ]);
  },

  async fauteuil({ ui }) {
    await ui.zeg('Een fauteuil met een gehaakt kleedje. Hij heeft de vorm aangenomen van iemand die hier al twintig jaar zit.');
  },

  async fauteuilJannes({ ui }) {
    await ui.zeg('De fauteuil van opa Jannes. Tussen de kussens liggen drie pepermuntjes, een kam en een losse tand.');
  },

  async bingo({ ui }) {
    await ui.zeg('Een bingotafel met kaarten en een bingomolen. Op een briefje: "BINGO: WOENSDAG. DUITSERS BETALEN DUBBEL."');
  },

  async koffie({ ui }) {
    await ui.zeg('Koffie en cake. Eén plak per persoon. Er hangt een briefje bij: "ZUSTER INEKE TELT MEE".');
  },

  async rollator({ ui }) {
    await ui.zeg('De rollator van opa Jannes. Er hangt een fietsbel aan. En een spiegeltje. En een vlaggetje van FC Emmen.');
  },

  async plant({ ui }) {
    await ui.zeg('Een plant. Iemand heeft hem vandaag al vier keer water gegeven. Hij ziet er niet goed uit.');
  },
};
