// Orvelte: dorpelingen, de jongens met de fatbikes, de onderduikers en Obergefreiter Wolfgang.
import { vindOnderduiker } from './volgers.js';
import { knapOp } from '../core/staat.js';

/** Hoeveel onderduikers lopen er achter je aan? */
const aantalVolgers = (staat) => (staat.volgers || []).length;

/** De jongens rijden weg op hun fatbikes. */
async function wegScheuren({ wereld, ui, audio }) {
  audio.sfx('zoef');
  const delen = [];
  ['djelano', 'mustafah'].forEach((id) => {
    const p = wereld.persoon(id);
    if (p) delen.push(p.sprite);
  });
  ['fatbikeDjelano', 'fatbikeMustafah'].forEach((id) => {
    const o = wereld.objecten[id];
    if (o) delen.push(o.sprite);
  });
  await new Promise((klaar) => {
    wereld.tweens.add({ targets: delen, x: '+=260', duration: 900, ease: 'Cubic.easeIn', onComplete: klaar });
  });
  wereld.verwijderPersoon('djelano');
  wereld.verwijderPersoon('mustafah');
  wereld.verwijderObject('fatbikeDjelano');
  wereld.verwijderObject('fatbikeMustafah');
}

export default {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.dorpGezien) return;
    staat.vlaggen.dorpGezien = true;
    await ui.zeg([
      'Orvelte. Een typisch Drents dorpje: klinkers, rieten daken, een molen en hunebedden.',
      'Alleen die rode vlaggen bij de ingang passen niet echt op de ansichtkaart.',
    ]);
  },

  // ------------------------------------------------------------ vlaggen en borden

  async vlag({ ui }) {
    await ui.zeg([
      'De vlag van de bezetter. Hij wappert alsof hij hier hoort.',
      'Dat doet hij niet.',
    ]);
  },

  async bordDorp({ ui }) {
    await ui.zeg([
      'ORVELTE. Museumdorp. Rijksbeschermd dorpsgezicht.',
      'Iemand heeft eronder geplakt: "NU OOK MET SLAGBOOM. FRIEZEN VERBODEN."',
    ]);
  },

  async bordHunebed({ ui }) {
    await ui.zeg([
      'HUNEBEDDEN. Vijfduizend jaar oud. Niet beklimmen.',
      'En ook niet onder kruipen, staat er met pen bij geschreven. Verdacht.',
    ]);
  },

  // ------------------------------------------------------------ de wachter bij de ingang

  async rudi({ ui, staat }) {
    if (staat.vlaggen.dorpKlaar) {
      await ui.zeg('RUDI: Wolfgang heeft de Friezen gekregen, hoor isch. Hij krijgt vast een medaille. Isch krijg nooit een medaille.');
      return;
    }
    await ui.zeg([
      'RUDI: Willkommen in Orvelte! Een typisch Drents dorp.',
      'RUDI: Met molens. En plaggen. En hunebedden. Isch weet niet wat een hunebed is, maar het is zwaar.',
      'RUDI: Isch moet hier de vlag bewaken. De hele dag. Er is nog nooit iemand aan gekomen.',
    ]);
  },

  // ------------------------------------------------------------ de jongens met de fatbikes

  async jongens(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.jongensWeg) return;
    const d = wereld.persoon('djelano');
    const m = wereld.persoon('mustafah');
    if (d) wereld.kijkNaarElkaar(d);
    if (m) m.kijk(d ? (wereld.speler.x < m.x ? 'links' : 'omlaag') : 'omlaag');
    await ui.zeg([
      'DJELANO: Ewa niffo, wat kijk je nou? Ben je lost ofzo?',
      'MUSTAFAH: Djalla, die beer heeft een muts op. Met dit weer, mattie. Kanker cringe.',
      'DJELANO: Dit is ons stukkie, bro. Jij staat voor onze coffeeshop. Djalla, wegwezen.',
      'DJELANO: Wat, je gaat niet? Dan ga ik je kapotmaken, kanker beer!',
    ]);
    let uitslag = await wereld.gevecht('djelano');
    if (uitslag !== 'gewonnen') return;
    await ui.zeg([
      'DJELANO: Au! Niffo, mijn patta\'s! Er zit een kras op mijn patta\'s!',
      'MUSTAFAH: Je hebt mijn neef gesloopt?! Kanker beer, nu ben je van mij!',
    ]);
    uitslag = await wereld.gevecht('mustafah');
    if (uitslag !== 'gewonnen') return;
    await ui.zeg([
      'MUSTAFAH: Djalla, djalla, wegwezen! Mijn moeder belt toch al.',
      'DJELANO: Dit is nog niet klaar, niffo! Volgende keer neem ik twee broodmessen mee!',
    ]);
    staat.vlaggen.jongensWeg = true;
    await wegScheuren(ctx);
    audio.sfx('kies');
    await ui.zeg('Ze scheuren weg op hun fatbikes. Met 45 kilometer per uur. Over de stoep.');
  },

  async fatbike({ ui }) {
    await ui.zeg('Een fatbike. De begrenzer is eruit gesloopt. Er hangt een geurboompje aan het stuur.');
  },

  // ------------------------------------------------------------ gebouwen

  async coffeeshopMuur({ ui }) {
    await ui.zeg('COFFEESHOP DE ZWEVENDE KEI. Er komt een zoete geur en een reggaedeuntje naar buiten.');
  },

  async coffeeshopDeur({ ui }) {
    await ui.zeg('De deur staat op een kier. Er klinkt reggae.');
  },

  async boerderij({ ui }) {
    await ui.zeg([
      'Een prachtige Drentse boerderij met een enorm rieten dak.',
      'Op de deeldeur hangt een briefje: "IN BESLAG GENOMEN. DIE KOMMANDANTUR."',
    ]);
  },

  async hutMuur({ ui }) {
    await ui.zeg('Een plaggenhut. Muren van heideplaggen. Lekker warm, zeggen ze. En je ziet niet wie erin zit.');
  },

  async molen({ ui }) {
    await ui.zeg('De molen van Orvelte. De wieken draaien rustig rond. Hij maalt nog elke dag graan.');
  },

  async molenDeur(ctx) {
    const { ui, staat, audio } = ctx;
    if (!staat.vlaggen.dorpQuest) {
      audio.sfx('botsen');
      await ui.zeg([
        'De deur van de molen zit dicht.',
        'Binnen hoor je iemand niezen. Vast het meel.',
      ]);
      return;
    }
    if (staat.vlaggen.gevonden_tjitske) {
      await ui.zeg('De molen is leeg. Alleen nog een voetafdruk in het meel.');
      return;
    }
    audio.sfx('deur');
    await ui.zeg([
      'Je klopt op de molendeur. Binnen wordt het ineens heel stil.',
      'Je duwt de deur open. Tussen de meelzakken staat een vrouw, helemaal wit van het meel.',
    ]);
    await vindOnderduiker(ctx, 'tjitske', {
      vondst: 'Je hebt een onderduiker gevonden: TJITSKE!',
      reactie: [
        'TJITSKE: Hoi! Ik bin... eh... de mûnder. De molenaar. Hjir is neat te sjen.',
        'TJITSKE: ...Dat leaust net, hè? Nee. Dat tocht ik al.',
      ],
    });
  },

  async meelzakken({ ui }) {
    await ui.zeg('Zakken meel. "Orvelter Oergraan". Er zit een gaatje in eentje, alsof iemand erin heeft gegluurd.');
  },

  async eik({ ui }) {
    await ui.zeg('Een oude eik op de brink. Iemand heeft er "DJELANO WAS HIER" in gekrast. Met een broodmes.');
  },

  async bankje({ ui }) {
    await ui.zeg('Een bankje op de brink. Er ligt een lege zak drop.');
  },

  async pomp({ ui, staat, audio }) {
    if (staat.gezondheid >= staat.maxGezondheid) {
      await ui.zeg('Een ouderwetse dorpspomp. Het water is lekker koud.');
      return;
    }
    knapOp();
    audio.jingle('herstel');
    await ui.zeg(['Je pompt wat water op en drinkt een paar flinke slokken.', '{BEER} voelt zich weer helemaal fit!']);
  },

  // ------------------------------------------------------------ hunebedden

  async hunebedA(ctx) {
    const { ui, staat } = ctx;
    if (!staat.vlaggen.dorpQuest) {
      await ui.zeg([
        'Een hunebed. Enorme zwerfkeien, hier neergelegd in de prehistorie.',
        'Onder de dekstenen hoor je iets... kauwen?',
      ]);
      return;
    }
    if (staat.vlaggen.gevonden_sjoerd) {
      await ui.zeg('Onder de dekstenen ligt alleen nog een kruimel suikerbrood.');
      return;
    }
    await ui.zeg([
      'Je bukt en kijkt onder de dekstenen.',
      'Daar ligt een man plat op zijn buik, met klompen aan en een plak suikerbrood in zijn hand.',
    ]);
    await vindOnderduiker(ctx, 'sjoerd', {
      vondst: 'Je hebt een onderduiker gevonden: SJOERD!',
      reactie: [
        'SJOERD: Goeie. Ik bin hjir net, hear.',
        'SJOERD: ...Oké. Ik bin hjir wol. Mar ik wie hjir earst! Fiiftûzen jier lyn al, sawat.',
      ],
    });
  },

  async hunebedB({ ui }) {
    await ui.zeg([
      'Nog een hunebed. Hier ligt niemand onder.',
      'Alleen een Duitse toeristenfolder: "Hünengrab! Ein Erlebnis für die ganze Familie!"',
    ]);
  },

  // ------------------------------------------------------------ dorpelingen

  async albertus({ ui, staat }) {
    if (staat.vlaggen.dorpQuest && !staat.vlaggen.dorpKlaar) {
      await ui.zeg([
        'ALBERTUS: Friezen? Ik weet van niks. Ik heb niks gezien.',
        'ALBERTUS: Al zou ik wel eens bij die molen kieken. Harm zegt dat er een muus in zit. Een hele grote muus.',
      ]);
      return;
    }
    await ui.zeg([
      'ALBERTUS: Moi! Wat zeg ie? Een beer? Ok goed.',
      'ALBERTUS: De Duutsers hebt mien trekker in beslag nomen. Nou mot ik mit de fiets naor de Jumbo.',
      'ALBERTUS: En die twee jongs mit die dikke fietsen, die moet ie mar niet anspreken. Die bint niet goed wies.',
    ]);
  },

  async harm({ ui, staat }) {
    if (staat.vlaggen.dorpQuest && !staat.vlaggen.gevonden_tjitske) {
      await ui.zeg([
        'HARM: Ik heb niks gezien. Er zit ook helemaal niemand in mijn molen.',
        'HARM: Zeker geen Friezin. En al helemaal geen Friezin die van mijn krentenbollen eet.',
      ]);
      return;
    }
    await ui.zeg([
      'HARM: Moi. Ik bin Harm, de molenaar.',
      'HARM: De Duutsers willen dat ik voortaan Duits brood bak. Pumpernickel. Daar maal ik niet aan mee.',
    ]);
  },

  async roelof({ ui, staat }) {
    if (staat.vlaggen.dorpQuest && !staat.vlaggen.gevonden_sjoerd) {
      await ui.zeg([
        'ROELOF: Vroeger begroeven ze hier hun doden onder de hunebedden.',
        'ROELOF: Tegenwoordig verstoppen ze er Friezen onder. Zegt men. Ik zeg niks.',
      ]);
      return;
    }
    await ui.zeg([
      'ROELOF: Ik zit hier al zeventig jaar op dit bankje. Ik heb alles zien komen en gaan.',
      'ROELOF: De Duitsers, de fatbikes, de toeristen. Ik weet niet wat het ergste is.',
    ]);
  },

  async geesje({ ui, staat }) {
    if (staat.vlaggen.dorpQuest && !staat.vlaggen.gevonden_wiebe) {
      await ui.zeg([
        'GEESJE: Weet je wat ik raar vind? Lammert koopt elke week drie broden. Hij woont alleen.',
        'GEESJE: En in zijn plaggenhut hoor ik \'s nachts iemand snurken. Onder de vloer.',
      ]);
      return;
    }
    await ui.zeg([
      'GEESJE: Hoi! Ben jij die beer van dat vakantiepark? {PARK}?',
      'GEESJE: Mijn schoonzus heeft daar ooit een week gezeten. Ze praat er nog steeds over. Niet positief.',
    ]);
  },

  async ingrid({ ui }) {
    await ui.zeg([
      'INGRID: Oh! Nein, nein, wir sind nur Touristen! Wij zijn gewoon op vakantie!',
      'INGRID: Wij komen elk jaar voor de hunebedden. En de pannenkoeken. Wij hebben niets met die soldaten te maken.',
      'INGRID: ...Mein Mann wel een beetje. Maar die zit in de caravan.',
    ]);
  },

  // ------------------------------------------------------------ Obergefreiter Wolfgang en de slagboom

  async wolfgang(ctx) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.dorpKlaar) return;
    if (!staat.vlaggen.dorpQuest) {
      await ui.zeg([
        'WOLFGANG: HALT! Niemand verlaat Orvelte! Befehl ist Befehl.',
        'WOLFGANG: Isch ben Obergefreiter Wolfgang. Isch bewaak deze slagboom. Al drie jaar. Het is een heel mooie slagboom.',
        'WOLFGANG: Wij weten dat er in dit dorp drie Friese onderduikers zitten. Isch ruik ze. Het ruikt hier naar Beerenburg en suikerbrood.',
        'WOLFGANG: Jij bent een beer. Beren hebben een goede neus. Jij gaat ze voor mij zoeken.',
        'WOLFGANG: Hier. Drie handboeien. Breng ze alle drie bij mij, dan gaat de slagboom voor jou open.',
      ]);
      staat.vlaggen.dorpQuest = true;
      await ui.krijgItem('handboeien', 3, 'kreeg');
      await ui.zeg([
        '{BEER} kijkt naar de handboeien. Dit voelt helemaal niet goed.',
        'Maar zonder die slagboom kom je nooit bij {PARK}...',
      ]);
      return;
    }
    const n = aantalVolgers(staat);
    if (n < 3) {
      await ui.zeg(n === 0 ? [
        'WOLFGANG: En? Waar zijn mijn Friezen? Schnell, schnell!',
        'WOLFGANG: Kijk onder de stenen, in de molen, onder de vloeren. Friezen kruipen overal in.',
      ] : [
        `WOLFGANG: Isch tel er ${n === 1 ? 'maar één' : 'maar twee'}. Isch wil er DREI. Drie! Kannst du nicht zählen?`,
      ]);
      return;
    }
    // overdracht
    await ui.zeg([
      'WOLFGANG: Eins, zwei, drei... Sehr gut! Drie Friezen!',
      'WOLFGANG: Jij bent een hele brave beer. Isch zal een goed woordje voor je doen bij de Kommandant.',
    ]);
    staat.vlaggen.dorpKlaar = true;
    staat.vlaggen.slagboomOpen = true;
    audio.sfx('klik');
    wereld.vernieuwObject('slagboom');
    await ui.zeg('Met een zwaai gaat de slagboom omhoog.');
    // Wolfgang neemt de drie mee, de weg op naar het noorden.
    await ui.naarZwart(300);
    const gevangenen = wereld.volgersLoslaten();
    const w = wereld.persoon('wolfgang');
    wereld.zetSpeler(39, 5, 'omhoog');
    const stoet = [w, ...gevangenen].filter(Boolean);
    stoet.forEach((p, i) => wereld.zetPersoon(p, 40, 1 + i, 'omhoog'));
    await ui.wachtMs(200);
    await ui.vanZwart(300);
    await ui.zeg('WOLFGANG: Abmarsch! Links, zwei, drei, vier!');
    await wereld.stoetLoop(stoet, 'omhoog', 2);
    const wiebe = gevangenen.find((p) => p.id === 'wiebe');
    if (wiebe) wiebe.kijk('omlaag');
    await ui.zeg('WIEBE: Dat ferjou ik dy noait, bear! Noait!');
    await wereld.stoetLoop(stoet, 'omhoog', 5);
    stoet.forEach((p) => wereld.verwijderPersoon(p.id));
    await ui.zeg([
      '{BEER} kijkt ze na tot ze om de bocht verdwenen zijn.',
      'De slagboom is open. Maar ergens voelt het alsof je zelf iets bent kwijtgeraakt.',
    ]);
  },

  async slagboom({ ui, staat }) {
    if (staat.vlaggen.slagboomOpen) {
      await ui.zeg('De slagboom staat open. De weg naar het noorden is vrij.');
      return;
    }
    await ui.zeg('Een rood-witte slagboom. Er hangt een bordje aan: "DURCHGANG NUR MIT GENEHMIGUNG".');
  },

  async uitgang({ ui }) {
    await ui.zeg([
      'Je laat Orvelte achter je. De klinkers gaan over in een smal fietspad.',
      'Volgens het bordje is het nog een flink stuk naar {PARK}.',
      'EINDE VAN HOOFDSTUK 3. Wordt vervolgd!',
      '(Tip: sla je spel op via START, dan kun je straks verder.)',
    ]);
  },
};
