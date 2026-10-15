// De Beren: gratis aanschuiven (alles weer vol), eten afhalen voor onderweg, en de vaste gasten per vestiging.
import { geefItem, knapOp } from '../core/staat.js';
import { ITEMS } from '../core/items.js';
import { openWinkel } from '../ui/winkel.js';
import { beer } from '../core/namen.js';

const AFHALEN = [
  { id: 'broodplankje', als: 'een BROODPLANKJE', zin: 'GASTVROUW: Met extra aioli. Daar houden ze in Drenthe niet zo van, dus je krijgt die van de buren erbij.' },
  { id: 'kipsate', als: 'een portie KIPSATE', zin: 'GASTVROUW: Kipsaté! Het lekkerste dat er is. Pas op met de pindasaus, die spettert.' },
  { id: 'spareribs', als: 'een rek SPARERIBS', zin: 'GASTVROUW: Een heel rek spareribs. Je pakt het met je poten, hè. Dat mag hier.' },
];

async function koop({ ui, staat, audio }, a) {
  const { id, als, zin } = a;
  const item = ITEMS[id];
  const keuze = await ui.vraag(`GASTVROUW: ${als[0].toUpperCase()}${als.slice(1)}? Dat is dan €${item.prijs}.`, ['KOPEN', 'NEE']);
  if (keuze !== 0) {
    await ui.zeg('GASTVROUW: Geen probleem. Neem gerust even de tijd.');
    return;
  }
  if ((staat.geld || 0) < item.prijs) {
    await ui.zeg([
      'GASTVROUW: Oei, daar heb je net niet genoeg voor.',
      'GASTVROUW: Aanschuiven is gratis, hoor. Afhalen helaas niet. De baas is een beer, maar hij is geen gek.',
    ]);
    return;
  }
  staat.geld -= item.prijs;
  geefItem(id);
  audio.sfx('kassa');
  await ui.zeg(`${beer()} kocht ${als} en stopte het in de RUGZAK.`);
  await ui.zeg(zin);
}

/** Even tafelen: de kok zet de borden op de balie, jij eet alles op, en alles is weer vol. */
async function aanschuiven({ ui, wereld, audio }) {
  const kok = wereld.persoon('kok');
  await ui.zeg('GASTVROUW: Eén tafel voor één beer, komt eraan! KOK! Eén keer de Berenschotel!');
  if (kok) {
    kok.kijk('omhoog');
    await ui.wachtMs(350);
    await wereld.uitroep(kok);
    await ui.zeg('KOK: JA CHEF!');
    kok.kijk('omhoog');
    audio.sfx('sis');
    await ui.wachtMs(700);
    kok.kijk('omlaag');
  }
  // de borden komen één voor één op de balie
  const borden = ['bord_spareribs', 'bord_sate', 'bord_broodplankje'].map((t, i) => {
    const b = wereld.add.image(86 + i * 13, 52, t).setOrigin(0.5, 1).setDepth(70).setAlpha(0);
    return b;
  });
  for (const b of borden) {
    b.setAlpha(1).setY(b.y - 4);
    wereld.tweens.add({ targets: b, y: b.y + 4, duration: 120 });
    audio.sfx('tik');
    await ui.wachtMs(280);
  }
  wereld.cameras.main.flash(300, 255, 240, 200);
  await ui.zegMetJingle('{BEER} smikkelt alles op: spareribs, kipsaté én een broodplankje toe!', 'smikkel');
  borden.forEach((b) => wereld.tweens.add({ targets: b, alpha: 0, y: b.y - 6, duration: 300, onComplete: () => b.destroy() }));
  knapOp();
  audio.jingle('herstel');
  await ui.zeg([
    '{BEER} is weer helemaal fit! Al je aanvallen zijn ook weer opgeladen.',
    'GASTVROUW: Graag gedaan! Kom gauw weer langs. En pas goed op jezelf daarbuiten.',
  ]);
}

/** Voor de gevel buiten, in elk dorp. */
export async function berenGevel({ ui }) {
  await ui.zeg([
    'DE BEREN. Uit de schoorsteen komt de geur van spareribs.',
    'Op de deur hangt een sticker: "BEREN ETEN HIER GRATIS". En eronder: "HIER WORDT NIET GEVOCHTEN".',
  ]);
}

const gemeenschappelijk = {
  async binnenkomst({ ui, staat, wereld }) {
    const vlag = `${wereld.kaart.id}Gezien`;
    if (staat.vlaggen[vlag]) return;
    staat.vlaggen[vlag] = true;
    await ui.zeg(staat.vlaggen.berenGezien
      ? `Nog een De Beren! Het ruikt hier precies hetzelfde als in de vorige. Naar spareribs en pindasaus.`
      : 'Het ruikt naar spareribs en pindasaus. Uit de speakers klinkt zacht muziek. Overal hangen beren aan de muur.');
    staat.vlaggen.berenGezien = true;
  },

  async gastvrouw(ctx) {
    const { ui, staat, wereld } = ctx;
    const gv = wereld.persoon('gastvrouw');
    if (gv) gv.kijk('omlaag');
    if (!staat.vlaggen.berenBezocht) {
      staat.vlaggen.berenBezocht = true;
      await ui.zeg([
        `GASTVROUW: Welkom bij De Beren ${wereld.kaart.plaats}! Oh... een echte beer!`,
        'GASTVROUW: Dat hebben we nog nooit gehad. De baas wordt gek als hij dit hoort.',
        'GASTVROUW: Huisregel nummer één: beren eten hier gratis. Altijd. In elke vestiging.',
        'GASTVROUW: En huisregel nummer twee: bij De Beren wordt niet gevochten. Ook niet door Duitsers.',
      ]);
    } else {
      await ui.zeg(`GASTVROUW: Welkom terug bij De Beren ${wereld.kaart.plaats}!`);
    }
    for (;;) {
      const keuze = await ui.vraag('GASTVROUW: Wat mag het zijn?', ['AANSCHUIVEN', 'AFHALEN', 'NIKS']);
      if (keuze === 0) {
        await aanschuiven(ctx);
        return;
      }
      if (keuze === 1) {
        await openWinkel(ui, {
          titel: 'DE BEREN',
          aanbod: () => AFHALEN.map((a) => ({ id: a.id, prijs: `€${ITEMS[a.id].prijs}` })),
          kies: (regel) => koop(ctx, AFHALEN.find((a) => a.id === regel.id)),
        });
        await ui.zeg('GASTVROUW: Eet smakelijk onderweg! Niet alles in één keer opeten, hè.');
        return;
      }
      await ui.zeg('GASTVROUW: Geen honger? Een beer zonder honger... Dat heb ik ook nog nooit gezien. Tot ziens!');
      return;
    }
  },

  async kok({ ui, wereld }) {
    const kok = wereld.persoon('kok');
    if (kok) kok.kijk('omlaag');
    const zinnen = [
      ['KOK: Het geheim van mijn spareribs? De marinade. Honing, knoflook en een scheut Drentse kruidenbitter.', 'KOK: Niet doorvertellen. Vooral niet aan de Duitsers.'],
      ['KOK: Die Duitsers willen overal zuurkool bij. Bij de kipsaté. Bij de spareribs. Bij het ijs.', 'KOK: Ik doe het niet. Ik heb ook mijn grenzen.'],
      ['KOK: Gisteren bestelde er eentje "Saté ohne Erdnuss". Kipsaté zonder pindasaus!', 'KOK: Ik heb hem de deur gewezen. Huisregel nummer drie.'],
    ];
    await ui.zeg(zinnen[Math.floor(Math.random() * zinnen.length)]);
  },

  async plant({ ui }) {
    await ui.zeg('Een plant. Hij is van plastic, maar wel heel goed afgestoft.');
  },

  async houtenBeer({ ui }) {
    await ui.zeg([
      'Een levensgrote houten beer met een menukaart in zijn poten.',
      'Hij lijkt een beetje op jou. Alleen heeft hij geen muts. En hij hoeft niet op de vlucht.',
    ]);
  },

  async tafel({ ui }) {
    await ui.zeg('Een gezellig tafeltje met een kaarsje. Er ligt nog een kroepoekje. Je eet het stiekem op.');
  },

  async lijst({ ui }) {
    await ui.zeg('Een ingelijste foto van een beer. Onder de foto staat: "DE OPRICHTER".');
  },

  async menu({ ui }) {
    await ui.zeg([
      'HET MENU: Broodplankje - €5. Kipsaté - €10. Spareribs - €18.',
      'Daaronder, met krijt: "BEREN ETEN GRATIS. DUITSERS BETALEN DUBBEL."',
    ]);
  },
};

export const berenOrvelteScripts = {
  ...gemeenschappelijk,

  async aaltje({ ui }) {
    await ui.zeg([
      'AALTJE: Ik kom hier elke dinsdag. Dan zijn de spareribs in de aanbieding.',
      'AALTJE: Vroeger zat hier alleen volk uit het dorp. Nu zitten er ook Duitsers. Die eten de kroepoek op voor je hem besteld hebt.',
    ]);
  },

  async gunther({ ui, wereld }) {
    const p = wereld.persoon('gunther');
    if (p) p.kijk('links');
    await ui.zeg([
      'GÜNTHER: Mmmf! Nicht stören. Isch heb pauze.',
      'GÜNTHER: Jij bent die beer, ja? Wij zoeken jou. Maar niet hier. Bij De Beren wordt niet gevochten.',
      'GÜNTHER: Dat is de regel. Ook voor ons. Anders krijgen we geen spareribs meer. Dat risico nemen wij niet.',
    ]);
    if (p) p.kijk('rechts');
  },
};

export const berenWezupScripts = {
  ...gemeenschappelijk,

  async wiepke({ ui }) {
    await ui.zeg([
      'WIEPKE: Vis? Nee hoor. Ik vang de hele week al vis. Als ik uit eten ga, wil ik spareribs.',
      'WIEPKE: En geen Friese droge worst, hè. Daar doen we hier niet aan. Die verdomde tjibbes uit Friesland.',
    ]);
  },

  async otto({ ui, wereld }) {
    const p = wereld.persoon('otto');
    if (p) p.kijk('links');
    await ui.zeg([
      'OTTO: Ach, der Bär. Keine Sorge, isch zit hier alleen te eten.',
      'OTTO: Weet je dat jullie Nederlanders saté van Indonesië hebben? Wij hebben de currywurst. Dat is ongeveer hetzelfde.',
      'OTTO: ...Nee? Ook goed. Isch neem nog een kipsaté.',
    ]);
    if (p) p.kijk('rechts');
  },
};
