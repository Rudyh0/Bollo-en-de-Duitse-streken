// Bos, deel 3: Kikker en zijn handeltje. Daarna een appje...
import { geefItem, staat as spelStaat } from '../core/staat.js';
import { ITEMS } from '../core/items.js';
import { openWinkel } from '../ui/winkel.js';
import { openTelefoon } from '../ui/telefoon.js';
import { beer } from '../core/namen.js';

const AANBOD = [
  {
    id: 'ritalin', prijs: 10, vlag: 'kochtRitalin',
    uitleg: 'Van deze pilletjes ga je een tijdje superhard lopen. Kikker gebruikt ze zelf ook. Hoor maar hoe snel hij praat.',
    na: 'KIKKER: Goeie keus. Daarmee ren je elke Duitser er zo uit.',
  },
  {
    id: 'xtc', prijs: 15, vlag: 'kochtXtc',
    uitleg: 'Een roze pilletje met een smiley. Alles wordt een tijdje heel erg mooi. Zelfs Drenthe.',
    na: 'KIKKER: Geniet ervan. En niet met de Duitsers gaan knuffelen, hè.',
  },
  {
    id: '3mmc', prijs: 20, nu: 10, vlag: 'kocht3mmc',
    uitleg: 'Snel én alles is mooi: het beste van twee werelden. Kikker zegt erbij: "niet alles tegelijk".',
    na: 'KIKKER: Tientje later. Niet vergeten, hè. Kikker vergeet nooit iets. Kikker heeft een geheugen als een... eh... kikker.',
  },
];

const allesGekocht = () => AANBOD.every((a) => spelStaat.vlaggen[a.vlag]);

async function koop({ ui, staat, audio }, a) {
  const naam = ITEMS[a.id].naam;
  let bedrag = a.prijs;
  if (a.nu) {
    await ui.zeg(`KIKKER: ${naam}. Dat is twintig euro, vriend.`);
    const keuze = await ui.vraag(
      'KIKKER: Weet je wat? Doe maar een tientje nu en een tientje later. Je hebt eerlijke ogen. Deal?',
      ['DEAL', 'NEE'],
    );
    if (keuze !== 0) {
      await ui.zeg('KIKKER: Kwaak. Jammer. Je weet me te vinden.');
      return;
    }
    bedrag = a.nu;
  } else {
    const keuze = await ui.vraag(`KIKKER: ${naam}? Dat wordt dan €${a.prijs}.`, ['KOPEN', 'NEE']);
    if (keuze !== 0) {
      await ui.zeg('KIKKER: Kwaak. Ook goed.');
      return;
    }
  }
  if ((staat.geld || 0) < bedrag) {
    await ui.zeg([
      'KIKKER: Kwaak? Daar heb je niet genoeg geld voor.',
      'KIKKER: Ga maar wat Duitsers beroven. Die hebben altijd cash bij zich.',
    ]);
    return;
  }
  staat.geld -= bedrag;
  if (a.nu) staat.vlaggen.schuldKikker = a.prijs - a.nu;
  staat.vlaggen[a.vlag] = true;
  geefItem(a.id);
  audio.sfx('kassa');
  await ui.zeg(`${beer()} kocht ${naam} en stopte het in de RUGZAK.`);
  await ui.zeg(a.na);
}

/** Kikker springt de poel in en is weg. */
async function vertrek({ ui, wereld, staat, audio }) {
  await ui.zeg([
    'KIKKER: Kwaak! Lekker zaken gedaan, wij tweeën.',
    'KIKKER: Kikker moet nu gaan. Als iemand het vraagt: je hebt mij nooit gezien.',
    'KIKKER: O ja, en Kikker heeft nu je nummer. Voor als je nog eens wat nodig hebt.',
  ]);
  staat.vlaggen.kikkerWeg = true;
  const k = wereld.persoon('kikker');
  if (k) {
    k.gescript = true;
    k.kijk('omhoog');
    await ui.wachtMs(250);
    audio.sfx('kwaak');
    const s = k.sprite;
    const doelY = 10 * 16;
    await new Promise((klaar) => wereld.tweens.add({ targets: s, y: s.y - 18, duration: 200, ease: 'Sine.easeOut', onComplete: klaar }));
    await new Promise((klaar) => wereld.tweens.add({ targets: s, y: doelY, duration: 220, ease: 'Sine.easeIn', onComplete: klaar }));
    audio.sfx('plons');
    plons(wereld, s.x, doelY - 6);
    wereld.verwijderPersoon('kikker');
    await ui.wachtMs(800);
  }
  audio.speelMuziek('bos');
  await ui.zeg('Weg is Kikker. Er komen alleen nog wat belletjes boven in de poel.');
}

function plons(wereld, x, y) {
  for (let i = 0; i < 3; i++) {
    const ring = wereld.add.ellipse(x, y, 6, 3).setStrokeStyle(1, 0xd8f0ff).setDepth(y + 20);
    wereld.tweens.add({
      targets: ring, scaleX: 4, scaleY: 4, alpha: 0, delay: i * 160, duration: 700, onComplete: () => ring.destroy(),
    });
  }
  for (let i = 0; i < 6; i++) {
    const druppel = wereld.add.rectangle(x, y, 2, 2, 0xd8f0ff).setDepth(y + 21);
    wereld.tweens.add({
      targets: druppel,
      x: x + Phaser.Math.Between(-12, 12),
      y: y - Phaser.Math.Between(6, 16),
      alpha: 0,
      duration: 420,
      ease: 'Sine.easeOut',
      onComplete: () => druppel.destroy(),
    });
  }
}

/** Belletjes in de poel, op de plek waar Kikker verdween. */
function belletje(wereld) {
  const b = wereld.add.circle(11 * 16 + 8 + Phaser.Math.Between(-5, 5), 9 * 16 + 12, 1.5)
    .setStrokeStyle(1, 0xd8f0ff).setDepth(-5);
  wereld.tweens.add({ targets: b, y: b.y - 6, alpha: 0, duration: 900, onComplete: () => b.destroy() });
}

/** Het berichtje van Kikker: eerst een melding, daarna eventueel de telefoon. */
async function melding({ ui, wereld, staat, audio }) {
  staat.vlaggen.telefoon = true;
  audio.sfx('trillen');
  wereld.cameras.main.shake(300, 0.002);
  const weg = ui.toonMelding('Kikker', `ey ${beer()}`);
  await ui.wachtMs(700);
  audio.sfx('bericht');
  const keuze = await ui.vraag(
    ['Bzzzt! Je telefoon trilt.', 'Je hebt een nieuw bericht van KIKKER.'],
    ['OPENEN', 'LATER'],
  );
  await weg();
  if (keuze === 0) {
    await openTelefoon(ui);
  } else {
    await ui.zeg('Je stopt je telefoon weer weg. Je kunt het bericht lezen via het menu (START), bij TELEFOON.');
  }
}

async function einde({ ui, wereld, staat }, { warp }) {
  if (!staat.vlaggen.bosVerlaten) {
    staat.vlaggen.bosVerlaten = true;
    await ui.zeg([
      'Je laat het bos achter je. Het zandpad loopt verder naar het oosten.',
      'In de verte zie je een molen boven de rieten daken uit steken. Orvelte.',
    ]);
    await ui.hoofdstuk('HOOFDSTUK 3', 'ORVELTE');
  }
  wereld.gaNaar('dorp', 1, warp && warp.y === 7 ? 15 : 14, 'rechts');
}

export default {
  opbouw({ wereld, staat, audio }) {
    if (!staat.vlaggen.kikkerWeg) {
      audio.speelMuziek('kikker');
    } else {
      wereld.time.addEvent({ delay: 1400, loop: true, callback: () => belletje(wereld) });
    }
  },

  async binnenkomst({ ui, staat }) {
    if (staat.vlaggen.bos3Gezien) return;
    staat.vlaggen.bos3Gezien = true;
    await ui.zeg([
      'Je komt bij een kleine bosvijver. Het ruikt hier naar kroos, modder en... aardbeienvape?',
      'Er klinkt muziek uit een speakertje. Iemand heeft hier duidelijk zijn vaste plekje.',
    ]);
  },

  /** Na de laatste aankoop: bij de eerste stap komt het berichtje binnen. */
  naStap(ctx) {
    const { staat, ui } = ctx;
    if (!staat.vlaggen.kikkerWeg || staat.vlaggen.telefoon) return false;
    ui.script(() => melding(ctx));
    return true;
  },

  async kikker(ctx) {
    const { ui, staat, audio } = ctx;
    audio.sfx('kwaak');
    if (!staat.vlaggen.kikkerGesproken) {
      staat.vlaggen.kikkerGesproken = true;
      await ui.zeg([
        'KIKKER: Kwaak. Psst. Hé jij. Ja, jij, met die muts.',
        'KIKKER: Ik ben Kikker. Gewoon Kikker. Mijn ouders hadden niet zo veel fantasie.',
        'KIKKER: Jij ziet eruit alsof je net uit een kamp bent ontsnapt. En alsof je nog een heel eind moet lopen.',
        'KIKKER: Dan heb je wat extra energie nodig. En toevallig... heeft Kikker wat extra energie.',
        'KIKKER: RITALIN, XTC en 3MMC. Allemaal biologisch. Uit eigen vijver.',
      ]);
    } else {
      await ui.zeg('KIKKER: Kwaak. Daar ben je weer. Zaken doen?');
    }
    await openWinkel(ui, {
      titel: 'KIKKER',
      aanbod: () => AANBOD.map((a) => ({
        id: a.id,
        prijs: staat.vlaggen[a.vlag] ? 'GEKOCHT' : `€${a.prijs}`,
        uit: Boolean(staat.vlaggen[a.vlag]),
        uitleg: a.uitleg,
      })),
      klaar: allesGekocht,
      kies: (regel) => koop(ctx, AANBOD.find((a) => a.id === regel.id)),
    });
    if (allesGekocht()) await vertrek(ctx);
    else await ui.zeg('KIKKER: Kom maar terug als je je bedenkt. Kikker gaat nergens heen. Nog niet.');
  },

  async uitgang(ctx, extra) {
    const { ui, staat, audio } = ctx;
    if (!staat.vlaggen.kikkerWeg) {
      audio.sfx('kwaak');
      await ui.zeg([
        'KIKKER: Psst! Hé, beer! Niet zo snel!',
        'KIKKER: Je gaat toch niet verder zonder even bij Kikker langs te gaan? Kwaak.',
      ]);
      return;
    }
    if (!staat.vlaggen.kikkerGeblokkeerd) {
      staat.vlaggen.telefoon = true;
      audio.sfx('trillen');
      await ui.zeg([
        'Bzzzt. Bzzzt. Je telefoon blijft maar trillen.',
        'Het is Kikker weer. Misschien moet je dat eerst even afhandelen.',
      ]);
      await openTelefoon(ui);
      if (!staat.vlaggen.kikkerGeblokkeerd) return;
    }
    await einde(ctx, extra);
  },

  async poel({ ui, staat }) {
    if (staat.vlaggen.kikkerWeg) {
      await ui.zeg('Een donkere bosvijver. Af en toe komt er een belletje boven. Kikker zit vast ergens op de bodem te tellen.');
    } else {
      await ui.zeg('Een donkere bosvijver vol kroos. Er drijft een leeg zakje in met "100% BIO" erop.');
    }
  },

  async bord({ ui }) {
    await ui.zeg([
      'ORVELTE - 1 KM. Wezup - 6 KM. Aalden - 9 KM.',
      '{PARK_HOOFD} - 10 KM. Inchecken tot 22:00 uur.',
    ]);
  },

  async stronk({ ui }) {
    await ui.zeg('Een boomstronk met een kras erin: "KIKKER WAS HIER". Er staat een telefoonnummer onder.');
  },
};
