// Alle gebeurtenissen en gesprekken in Barak 7.
// Elk script krijgt { ui, wereld, staat, audio } en eventueel { x, y, persoon }.
import { aantal, knapOp } from '../core/staat.js';

const BEDTEKSTEN = [
  'Een stapelbed. Het ruikt naar natte sokken.',
  'Iemand heeft een tekening van een frikandel boven het bed geprikt.',
  'Onder het kussen ligt een legpuzzel van de Hondsrug. Er mist één stukje.',
  'Een stapelbed. Het kraakt al als je er alleen maar naar kijkt.',
  'In het bovenste bed ligt iemand zachtjes te snurken.',
  'Op het matras ligt een stapel stripboeken. Allemaal deel 3.',
];

// ------------------------------------------------------------ rook en alarm

const KACHEL = { x: 3 * 16 + 8, y: 5 * 16 - 8 };

function rookPluim(wereld, aantalWolken, duur, groot = 1) {
  for (let i = 0; i < aantalWolken; i++) {
    wereld.time.delayedCall(i * (duur / aantalWolken), () => {
      const w = wereld.add.circle(KACHEL.x + Phaser.Math.Between(-4, 4), KACHEL.y - 16, 3, 0xd8d8e0, 0.75).setDepth(4000);
      wereld.tweens.add({
        targets: w,
        x: w.x + Phaser.Math.Between(-40, 60) * groot,
        y: w.y - Phaser.Math.Between(20, 60),
        scale: 3 + Math.random() * 3 * groot,
        alpha: 0,
        duration: 1600 + Math.random() * 1400,
        ease: 'Sine.easeOut',
        onComplete: () => w.destroy(),
      });
    });
  }
}

function maakWaas(wereld, alpha) {
  const b = wereld.breedte * 16;
  const h = wereld.hoogte * 16;
  if (!wereld.waas) wereld.waas = wereld.add.rectangle(0, 0, b, h, 0xb8b8c4, 1).setOrigin(0, 0).setDepth(4500);
  wereld.waas.setAlpha(alpha);
  return wereld.waas;
}

async function brandalarm({ ui, wereld, staat, audio }) {
  audio.sfx('sis');
  rookPluim(wereld, 40, 2400, 1.4);
  const waas = maakWaas(wereld, 0);
  wereld.tweens.add({ targets: waas, alpha: 0.62, duration: 2600 });
  await ui.zeg('PSSSSSSJJJJ! Er stijgt een enorme rookwolk op uit de kachel!');
  const henk = wereld.persoon('henk');
  if (henk) henk.kijk('rechts');
  await ui.zeg(['HENK: *kuch* *kuch* Jong! Wat doe je nou?!', 'FENNA: Ik zie niks meer! *kuch*']);
  // alarm
  audio.sfx('alarm');
  const rood = wereld.add.rectangle(0, 0, wereld.breedte * 16, wereld.hoogte * 16, 0xff2020, 1).setOrigin(0, 0).setDepth(4600).setAlpha(0);
  wereld.tweens.add({ targets: rood, alpha: 0.28, duration: 250, yoyo: true, repeat: 4 });
  await ui.wachtMs(600);
  await ui.zeg('WIIIEUUW WIIIEUUW! Het brandalarm gaat af!');
  audio.sfx('alarm');
  await ui.wachtMs(800);
  audio.sfx('klik');
  staat.vlaggen.deurOpen = true;
  wereld.zetTegel(19, 0, 15);
  wereld.zetTegel(19, 1, 16);
  wereld.cameras.main.shake(150, 0.004);
  await ui.zeg([
    'KLIK! De deur van de barak springt van het slot!',
    'WACHTER: Feuer! FEUER! Iedereen blijft binnen! Isch haal de brandblusser!',
    'Je hoort laarzen wegrennen over het grind...',
  ]);
  rood.destroy();
  wereld.tweens.add({ targets: waas, alpha: 0.18, duration: 3000 });
  staat.vlaggen.rookAlarm = true;
  await ui.zeg('Dit is je kans! De deur staat open.');
}

export default {
  opbouw({ wereld, staat }) {
    if (staat.vlaggen.rookAlarm) {
      maakWaas(wereld, 0.14);
      wereld.time.addEvent({ delay: 900, loop: true, callback: () => rookPluim(wereld, 1, 100, 0.4) });
    }
  },

  async binnenkomst({ ui, staat }, { nieuw, naVerlies }) {
    if (naVerlies || staat.vlaggen.netVerloren) {
      delete staat.vlaggen.netVerloren;
      knapOp();
      await ui.vanZwart(600);
      await ui.zeg([
        '{BEER} wordt wakker in zijn eigen bed. Alles doet pijn.',
        'HENK: Ze hebben je teruggebracht, jong. Je zag er niet uit.',
        'HENK: Rust even uit en probeer het dan nog eens. De deur staat nog steeds open.',
      ]);
      return;
    }
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
    if (staat.vlaggen.rookAlarm) {
      await ui.zeg([
        'HENK: *kuch* Ga nou maar, jong! Voordat ze terugkomen met die brandblusser.',
        'HENK: En als je buiten bent: niet te hard lopen. Dat vinden ze verdacht.',
      ]);
      return;
    }
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
        'HENK: Daar kun je van alles mee scheppen. Water uit die emmer daar, bijvoorbeeld.',
        'HENK: En die kachel... die rookt al als je er naar kijkt. Ik zeg verder niks.',
      ]);
      return;
    }
    await ui.zeg('HENK: Die kachel geeft net zoveel warmte als een theelichtje. Maar beter dan niks.');
  },

  async fenna({ ui, staat }) {
    if (staat.vlaggen.rookAlarm) {
      await ui.zeg([
        'FENNA: Snel, de deur is open! *kuch*',
        'FENNA: Ik blijf hier. Iemand moet Henk wakker houden.',
      ]);
      return;
    }
    if (staat.vlaggen.kistOpen) {
      await ui.zeg([
        'FENNA: Voedselbonnen! Daar krijg je bij de keuken eten voor.',
        'FENNA: Gebruik ze als je je slap voelt. Druk op START en kies RUGZAK.',
        'FENNA: O, en weet je wat raar is? Bij brandalarm gaan hier alle deuren vanzelf open.',
        'FENNA: Brandveiligheid, zeggen de Duitsers. Ordnung muss sein.',
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
      "En daaronder, met kleine letters: 'Bij brand gaan alle deuren automatisch open.'",
    ]);
  },

  async deur({ ui, staat, audio }) {
    if (staat.vlaggen.deurOpen) {
      await ui.zeg('De deur staat wagenwijd open. Buiten is het kampplein.');
      return;
    }
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

  async kachel(ctx) {
    const { ui, staat } = ctx;
    if (staat.vlaggen.rookAlarm) {
      await ui.zeg('De kachel is uit. Hij ruikt naar natte as.');
      return;
    }
    if (!staat.vlaggen.lepelWater) {
      await ui.zeg([
        'Een oude kolenkachel. Er smeult nog wat kolen in.',
        'Als je daar water op gooit, wordt het vast een flinke rookwolk...',
      ]);
      return;
    }
    await ui.zeg('De kolen in de kachel gloeien nog. Je soeplepel zit vol water.');
    if (await ui.vraag('Wil je het water op de kachel gooien?') !== 0) {
      await ui.zeg('Je houdt de lepel nog even recht.');
      return;
    }
    delete staat.vlaggen.lepelWater;
    await brandalarm(ctx);
  },

  async emmer({ ui, staat, audio }) {
    if (staat.vlaggen.rookAlarm) {
      await ui.zeg('De emmer is bijna leeg. Je hebt er zelf voor gezorgd.');
      return;
    }
    if (staat.vlaggen.lepelWater) {
      await ui.zeg('Er zit al water in je soeplepel. Voorzichtig, niet morsen!');
      return;
    }
    if (!aantal('soeplepel')) {
      await ui.zeg('Een emmer met water. Hopelijk is het water.');
      return;
    }
    await ui.zeg('Een emmer met water. Hopelijk is het water.');
    if (await ui.vraag('Wil je met de SOEPLEPEL water scheppen?') !== 0) return;
    audio.sfx('kies');
    staat.vlaggen.lepelWater = true;
    await ui.zeg('{BEER} schept een volle lepel water uit de emmer.');
  },
};
