// Langs de N34: het kistje uit de vrachtwagen, het tankstation en de grenscontrole bij de afslag.
import { aantal, neemItem } from '../core/staat.js';
import { itemNaam } from '../core/items.js';
import { VERKEER } from './n34.js';

const MIDDELEN = ['ritalin', 'xtc', '3mmc', 'wiet', 'hasj'];
const STOFNAMEN = { ritalin: 'METHYLFENIDAAT', xtc: 'MDMA', '3mmc': '3-MMC', wiet: 'THC', hasj: 'THC' };

const tween = (scene, cfg) => new Promise((klaar) => scene.tweens.add({ ...cfg, onComplete: klaar }));

// ================================================================== deel 1: het kistje

/** Een legervrachtwagen vol kistjes rijdt voorbij en verliest er eentje. */
async function vrachtwagen({ ui, wereld, staat, audio }) {
  const s = wereld.speler;
  await wereld.uitroep(s);
  await ui.zeg('Er komt een Duitse vrachtwagen aan, hoog opgestapeld met kistjes. Hij slingert over de weg...');
  const def = wereld.kaart.objecten.find((o) => o.id === 'krat');
  const doelX = def.x * 16 + 8;
  const doelY = (def.y + 1) * 16;
  await new Promise((klaar) => {
    const v = wereld.nieuwVoertuig(VERKEER.banen[0], wereld.breedte * 16 + 40, { textuur: 'voertuig_truck_kisten', snelheid: 150 });
    audio.sfx('toeter');
    v.opX = {
      x: doelX + 12,
      doe: async (voertuig) => {
        audio.sfx('bonk');
        const k = wereld.add.image(voertuig.img.x, voertuig.img.y - 22, 'obj_krat').setOrigin(0.5, 1).setDepth(9000);
        wereld.tweens.add({ targets: k, x: doelX, duration: 700 });
        wereld.tweens.add({ targets: k, angle: -360, duration: 700 });
        await tween(wereld, { targets: k, y: doelY - 40, duration: 300, ease: 'Sine.easeOut' });
        await tween(wereld, { targets: k, y: doelY, duration: 400, ease: 'Bounce.easeOut' });
        audio.sfx('botsen');
        k.destroy();
        staat.vlaggen.kratGevallen = true;
        wereld.maakObject(def);
        klaar();
      },
    };
  });
  await ui.wachtMs(300);
  await ui.zeg([
    'BONK! Er valt een kistje van de vrachtwagen. Het stuitert over de vangrail en blijft in de berm liggen.',
    'De vrachtwagen rijdt gewoon door. Niemand heeft het gemerkt.',
  ]);
}

export const n34aScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.n34Gezien) return;
    staat.vlaggen.n34Gezien = true;
    await ui.zeg([
      'De N34. Op de bruine borden staat: HUNEBED HIGHWAY.',
      'Auto\'s razen voorbij. En legervoertuigen. Heel veel legervoertuigen.',
      'Gelukkig is er een fietspad. Met een vangrail ertussen. Heel Nederlands.',
    ]);
  },

  naStap(ctx) {
    const { staat, wereld, ui } = ctx;
    if (staat.vlaggen.kratGevallen || wereld.speler.x < 11) return false;
    ui.script(() => vrachtwagen(ctx));
    return true;
  },

  async krat({ ui, wereld, staat, audio }) {
    if (staat.vlaggen.kratOpen) {
      await ui.zeg('Het kistje is leeg. Er ligt alleen nog wat stro in. Het ruikt naar suikerbrood.');
      return;
    }
    await ui.zeg([
      'Op het kistje staat een stempel:',
      '"IN BESLAG GENOMEN. KRUIDENIERSWINKEL FRIES, LEEUWARDEN."',
    ]);
    audio.sfx('kist');
    staat.vlaggen.kratOpen = true;
    wereld.vernieuwObject('krat');
    await ui.zeg('Je wrikt het deksel open.');
    await ui.krijgItem('voedselbon');
    await ui.zeg('Onder het stro ligt nog iets: een schriftje met een kapot slotje.');
    await ui.krijgItem('dagboek');
    await ui.zeg([
      'Op de kaft staat: DAGBOEK VAN ANNE FRIES. NIET LEZEN!!!',
      'Je kunt het lezen via de RUGZAK. Als je durft.',
    ]);
  },

  async bordHighway({ ui }) {
    await ui.zeg('HUNEBED HIGHWAY. Langs deze weg liggen meer hunebedden dan tankstations. Bijna.');
  },

  async bordN34({ ui }) {
    await ui.zeg('N34. Emmen - Groningen. Iemand heeft er HUNEBED HIGHWAY TO HELL onder geschreven.');
  },

  async hunebed({ ui }) {
    await ui.zeg('Nog een hunebed. Ze liggen hier overal. Er ligt niemand onder. Je hebt gekeken.');
  },
};

// ================================================================== deel 2: het tankstation

/** Bernd vlucht na het gevecht (terug naar zijn tankstation, of zomaar weg). */
async function berndVerslagen({ ui, wereld, staat }, buiten) {
  staat.vlaggen.berndVerslagen = true;
  await ui.zeg([
    'BERND: Au... mein Rücken. Isch was hier alleen om te tanken. En om tosti\'s te eten.',
    'BERND: Isch ga naar huis. Naar Bielefeld. Daar bestaan geen beren.',
  ]);
  const b = wereld.persoon('bernd');
  if (b) {
    b.gescript = true;
    // naar de deur en weg
    const doel = buiten ? { x: 16 * 16 + 8, y: 5 * 16 } : { x: 4 * 16 + 8, y: 7 * 16 };
    await tween(wereld, { targets: b.sprite, x: doel.x, y: doel.y, alpha: 0, duration: 800 });
    wereld.verwijderPersoon('bernd');
  }
}

async function berndGevecht(ctx, buiten) {
  const uitslag = await ctx.wereld.gevecht('bernd');
  if (uitslag !== 'gewonnen') return false;
  await berndVerslagen(ctx, buiten);
  return true;
}

export const n34bScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.n34bGezien) return;
    staat.vlaggen.n34bGezien = true;
    await ui.zeg('Een tankstation: TANK & TOSTI. In de winkel brandt licht. Iemand staat te kauwen achter het raam.');
  },

  async tankstation({ ui }) {
    await ui.zeg('TANK & TOSTI. Benzine, diesel en tosti\'s. De prijzen zijn bezettingsprijzen.');
  },

  async bordHighway({ ui }) {
    await ui.zeg('HUNEBED HIGHWAY. Volgende hunebed: 2 km. Volgende tosti: hier.');
  },

  /** Doorlopen naar deel 3. Wie het tankstation heeft overgeslagen, krijgt Bernd achter zich aan. */
  async verder(ctx, { warp }) {
    const { ui, wereld, staat, audio } = ctx;
    if (staat.vlaggen.berndVerslagen) {
      wereld.gaNaar('n34c', 1, warp.y, 'rechts');
      return;
    }
    const s = wereld.speler;
    audio.sfx('deur_open');
    const b = wereld.voegPersoonToe({ id: 'bernd', sprite: 'mens_bernd', x: 16, y: 5, richting: 'omlaag', script: 'berndBuiten' });
    b.gescript = true;
    await wereld.uitroep(b);
    await ui.zeg('BERND: HALT! STEHEN BLEIBEN!');
    const plek = wereld.vrijePlekBij(s.x, s.y);
    audio.sfx('zoef');
    await tween(wereld, { targets: b.sprite, x: plek.x * 16 + 8, y: (plek.y + 1) * 16, duration: 650, ease: 'Sine.easeIn' });
    wereld.zetPersoon(b, plek.x, plek.y);
    wereld.kijkNaarElkaar(b);
    await ui.zeg([
      'BERND: Isch zag jou wel langs mijn tankstation sluipen!',
      'BERND: Niemand komt hier langs zonder iets te kopen. Ook niet als je te voet bent!',
      'BERND: Isch ben Unteroffizier Bernd en isch had net een broodje kroket. Nu is het koud. Dat ga jij bezuren!',
    ]);
    await berndGevecht(ctx, true);
  },

  async berndBuiten(ctx) {
    if (!ctx.staat.vlaggen.berndVerslagen) await berndGevecht(ctx, true);
  },
};

export const tankstationScripts = {
  async binnenkomst(ctx, extra = {}) {
    const { ui, wereld, staat } = ctx;
    if (staat.vlaggen.berndVerslagen || extra.naVerlies) return;
    const b = wereld.persoon('bernd');
    if (!b) return;
    await wereld.uitroep(b);
    wereld.kijkNaarElkaar(b);
    await ui.zeg([
      'BERND: Was?! Ein Bär! In MEINER Tankstelle?!',
      'BERND: Isch was net mijn broodje kroket aan het eten. Dat ga jij bezuren!',
    ]);
    await berndGevecht(ctx, false);
  },

  async bernd(ctx) {
    const { ui, staat } = ctx;
    if (staat.vlaggen.berndVerslagen) {
      await ui.zeg('BERND: Isch reken af. Isch reken af! Laat mij met rust.');
      return;
    }
    await ui.zeg('BERND: Jij weer! Nu eet isch mijn kroket pas als jij plat ligt.');
    await berndGevecht(ctx, false);
  },

  async kassiere({ ui, staat }) {
    if (staat.vlaggen.berndVerslagen && !staat.vlaggen.kroketGekregen) {
      staat.vlaggen.kroketGekregen = true;
      await ui.zeg([
        'INGE: Die Duitser stond hier al een week gratis te eten. Bedankt, beer!',
        'INGE: Hier, een broodje kroket. Van het huis.',
      ]);
      await ui.krijgItem('voedselbon', 1, 'kreeg');
      return;
    }
    await ui.zeg([
      'INGE: Welkom bij Tank & Tosti! Pomp één of twee?',
      'INGE: ...Geen pomp? Je bent te voet? Op de N34? Nou, sterkte.',
    ]);
  },

  async kassa(ctx) {
    await tankstationScripts.kassiere(ctx);
  },

  async schap({ ui }) {
    await ui.zeg('Chips, drop, energiedrank en een boekje: "Hunebedden voor Dummies".');
  },

  async koffie({ ui }) {
    await ui.zeg('Een koffieautomaat. Koffie: €3,50. Op een briefje staat "Duitse soldaten gratis". Iemand heeft "gratis" doorgestreept.');
  },

  async koelkast({ ui }) {
    await ui.zeg('Een koelkast vol energiedrank en karnemelk. Typisch Drenthe.');
  },

  async poster({ ui }) {
    await ui.zeg('BROODJE KROKET €2,95. In kleine letters: "kan sporen van Duitsers bevatten".');
  },
};

// ================================================================== deel 3: de grenscontrole

/** Rex snuffelt aan de rugzak. */
async function snuffel({ wereld, ui }, gevonden) {
  const rex = wereld.persoon('rex');
  if (!rex) return;
  rex.gescript = true;
  rex.kijk('rechts');
  for (let i = 0; i < 3; i++) {
    await tween(wereld, { targets: rex.sprite, y: rex.sprite.y - 3, duration: 90, yoyo: true });
    await ui.wachtMs(80);
  }
  if (gevonden) {
    await tween(wereld, { targets: rex.sprite, y: rex.sprite.y - 6, duration: 120, yoyo: true, repeat: 2 });
  }
  rex.gescript = false;
}

async function controle(ctx) {
  const { ui, wereld, staat, audio } = ctx;
  const h = wereld.persoon('helmut');
  if (h) wereld.kijkNaarElkaar(h);
  await ui.zeg([
    'HELMUT: Halt! Grenzkontrolle! Niemand komt zomaar Wezup in.',
    'HELMUT: Rugzak open. Rex, such!',
  ]);
  const bij = MIDDELEN.filter((id) => aantal(id) > 0);
  await ui.zeg('Rex snuffelt aan je rugzak...');
  await snuffel(ctx, bij.length > 0);
  if (bij.length) {
    audio.sfx('blaf');
    await ui.zeg('REX: WOEF! WOEF WOEF!');
    const lijst = bij.map((id) => `${aantal(id)}x ${itemNaam(id, aantal(id))}`).join(', ');
    await ui.zeg([
      'HELMUT: Aha! Was haben wir denn hier?',
      `HELMUT: ${lijst}. Tsss.`,
    ]);
    bij.forEach((id) => neemItem(id, aantal(id)));
    audio.sfx('klik');
    await ui.zeg([
      'Helmut neemt al je middelen in beslag. Jens stopt ze in een plastic zakje. Hij kijkt er een beetje te lang naar.',
      'HELMUT: Drugs smokkelen over de Hunebed Highway! Dat wordt een dikke boete. En een pak slaag!',
    ]);
  } else {
    await ui.zeg([
      'Rex snuffelt nog eens. En nog eens. Dan gaat hij teleurgesteld zitten.',
      'HELMUT: Niks? Hmm. Verdacht. Niemand komt hier clean langs. Jens, de speekseltest!',
      'JENS: Mond open, beer. Ja, ook de tong.',
      'Jens haalt een wattenstaafje langs je tong. Het smaakt naar handschoen.',
      'Het testje ligt op de motorkap. Iedereen kijkt ernaar. Ook Rex.',
    ]);
    await ui.wachtMs(600);
    const gebruikt = Object.keys(staat.vlaggen.gebruikt || {}).filter((id) => MIDDELEN.includes(id));
    if (gebruikt.length) {
      const lijst = [...new Set(gebruikt.map((id) => STOFNAMEN[id]))];
      const stoffen = lijst.length > 1 ? `${lijst.slice(0, -1).join(', ')} en ${lijst[lijst.length - 1]}` : lijst[0];
      const vanKikker = gebruikt.some((id) => ['ritalin', 'xtc', '3mmc'].includes(id));
      audio.sfx('fout');
      await ui.zeg([
        `JENS: Positief! Op ${stoffen}!`,
        vanKikker
          ? 'HELMUT: Dacht isch het niet. Bij Kikker gekocht, hè? Iedereen koopt bij Kikker.'
          : 'HELMUT: Dacht isch het niet. In die coffeeshop in Orvelte geweest, hè?',
        'HELMUT: Onder invloed op de Hunebed Highway. Dat is strafbaar. Ook voor beren!',
      ]);
    } else {
      await ui.zeg([
        'JENS: Negatief. Helemaal niks. Zelfs geen paracetamol.',
        'HELMUT: Negatief? Gar nichts? Geen biertje, geen jointje, geen pilletje?',
        'JENS: Wat een mietje.',
        'HELMUT: Mietjes horen hier niet thuis. Dit is Drenthe! Hier drinken zelfs de koeien Beerenburg.',
        'HELMUT: Isch zal jou eens leren wat een echte grenscontrole is!',
      ]);
    }
  }
  const uitslag = await wereld.gevecht('helmut');
  if (uitslag !== 'gewonnen') return;
  staat.vlaggen.grensControle = true;
  staat.vlaggen.grensOpen = true;
  await ui.zeg([
    'HELMUT: Au... Gut, gut. Ga maar. Loop maar door.',
    'HELMUT: Maar Rex onthoudt jouw geur. Voor altijd.',
  ]);
  audio.sfx('klik');
  wereld.vernieuwObject('slagboom');
  await ui.zeg('De slagboom gaat omhoog. De weg naar Wezup is vrij.');
}

export const n34cScripts = {
  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.n34cGezien) return;
    staat.vlaggen.n34cGezien = true;
    await ui.zeg([
      'De afslag naar Wezup. Er staat een slagboom over de weg.',
      'En een hond. En twee Duitsers die eruitzien alsof ze zich al de hele dag vervelen.',
    ]);
  },

  async controle(ctx) {
    if (ctx.staat.vlaggen.grensOpen) {
      await ctx.ui.zeg('HELMUT: Doorlopen, beer. Gute Reise. Rex houdt je in de gaten.');
      return;
    }
    await controle(ctx);
  },

  async jens({ ui, staat }) {
    if (staat.vlaggen.grensOpen) {
      await ui.zeg('JENS: Loop voorzichtig. En zeg niet tegen Helmut dat isch dat zakje nog heb.');
      return;
    }
    await ui.zeg([
      'JENS: Isch ben Jens. Isch doe de testjes.',
      'JENS: Isch heb er vandaag al driehonderd gedaan. Allemaal positief. Behalve die van Rex.',
    ]);
  },

  async rex({ ui, audio }) {
    audio.sfx('blaf');
    await ui.zeg('Rex de drugshond. Hij kwispelt. Daarna snuffelt hij aan je rugzak en gromt zachtjes.');
  },

  async wachthuisje({ ui }) {
    await ui.zeg('Het grenshuisje. Binnen staat een koffiezetapparaat en een ingelijste foto van Rex.');
  },

  async slagboom({ ui, staat }) {
    await ui.zeg(staat.vlaggen.grensOpen
      ? 'De slagboom staat open. De weg naar Wezup is vrij.'
      : 'Een slagboom. Erop staat: GRENZKONTROLLE - HALT.');
  },

  async bordAfslag({ ui }) {
    await ui.zeg([
      'AFSLAG WEZUP.',
      'Iemand heeft er een stickertje op geplakt: "Hier woont de beste kruidenier van Drenthe."',
    ]);
  },

  async afgesloten({ ui }) {
    await ui.zeg('FIETSPAD AFGESLOTEN. Omleiding via Wezup. Bedankt voor uw begrip. - Die Kommandantur');
  },

  async stadje({ ui, wereld, staat }, { warp }) {
    if (!staat.vlaggen.n34Verlaten) {
      staat.vlaggen.n34Verlaten = true;
      await ui.zeg([
        'Je loopt de afslag af. Achter de bomen zie je de eerste trapgeveltjes van Wezup.',
        staat.vlaggen.dagboekGelezen ? 'Ergens in dit stadje is een kruidenier. Met een boekenkast...' : 'Het ruikt naar vers brood en vis.',
      ]);
      await ui.hoofdstuk('HOOFDSTUK 5', 'WEZUP');
    }
    wereld.gaNaar('wezup', warp.x === 24 ? 20 : 21, 32, 'omhoog');
  },
};
