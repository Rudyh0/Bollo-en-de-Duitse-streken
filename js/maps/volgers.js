// De onderduikers die geboeid achter de beer aan lopen (Orvelte).
// Ze spreken Fries; de beer verstaat er de helft van.
import { aantal, neemItem } from '../core/staat.js';

export const ONDERDUIKERS = {
  sjoerd: {
    naam: 'SJOERD',
    zinnen: [
      ['SJOERD: Moatte wy noch fier rinne? Myn klompen knipe.', '(Hij vraagt of het nog ver is. Zijn klompen knellen.)'],
      ['SJOERD: Ik hie gewoan ûnder dat hunebed lizzen bliuwe moatten.'],
      ['SJOERD: Do bist in ferrieder, bear. In ferrieder mei in mûtse.'],
    ],
  },
  tjitske: {
    naam: 'TJITSKE',
    zinnen: [
      ['TJITSKE: Myn mem hie it al sein: gean net nei Drinte.', '(Haar moeder had haar nog zo gewaarschuwd voor Drenthe.)'],
      ['TJITSKE: Yn dy mûne wie it waarm en it rûk nei bôle. En no dit.'],
      ['TJITSKE: Wat bist do foar in bear? Gjin aardige, dat is wis.'],
    ],
  },
  wiebe: {
    naam: 'WIEBE',
    zinnen: [
      ['WIEBE: Ik siet dêr sa noflik ûnder de flier.', '(Hij zat zo lekker onder de vloer.)'],
      ['WIEBE: Sûnt de Alvestêdetocht fan sânennjoggentich haw ik net sokke kâlde fuotten hân.'],
      ['WIEBE: Hast miskien in slokje Beerenburch foar my? Nee? Dat tocht ik al.'],
    ],
  },
};

/** Praten met een onderduiker die achter je loopt. */
export async function praatMetVolger({ ui, wereld }, volger) {
  const info = ONDERDUIKERS[volger.id];
  if (!info) return;
  wereld.kijkNaarElkaar({
    x: volger.x, y: volger.y, kijk: (r) => { volger.richting = r; wereld.plaatsVolger(volger, 1); },
  });
  info.teller = ((info.teller ?? -1) + 1) % info.zinnen.length;
  await ui.zeg(info.zinnen[info.teller]);
}

/**
 * Een onderduiker gevonden: hij of zij komt tevoorschijn, krijgt handboeien om en loopt voortaan achter je aan.
 * teksten: { vondst: [...], reactie: [...] }
 */
export async function vindOnderduiker({ ui, wereld, staat, audio }, id, teksten) {
  const info = ONDERDUIKERS[id];
  if (staat.vlaggen[`gevonden_${id}`]) return false;
  if (aantal('handboeien') <= 0) {
    await ui.zeg('Je hebt geen handboeien meer.');
    return false;
  }
  await ui.zegMetJingle(teksten.vondst, 'onderduiker');
  const s = wereld.speler;
  const plek = wereld.vrijePlekBij(s.x, s.y);
  const v = wereld.voegVolgerToe(id, plek.x, plek.y);
  v.sprite.setAlpha(0);
  wereld.tweens.add({ targets: v.sprite, alpha: 1, duration: 350 });
  audio.sfx('zoef');
  await ui.wachtMs(400);
  v.richting = s.x > v.x ? 'rechts' : s.x < v.x ? 'links' : s.y > v.y ? 'omlaag' : 'omhoog';
  wereld.plaatsVolger(v, 1);
  await ui.zeg(teksten.reactie);
  neemItem('handboeien');
  staat.vlaggen[`gevonden_${id}`] = true;
  audio.sfx('klik');
  wereld.cameras.main.shake(120, 0.002);
  await ui.zeg(`{BEER} doet ${info.naam} de handboeien om. Klik.`);
  const n = (staat.volgers || []).length;
  if (n >= 3) {
    await ui.zeg([
      'Dat zijn ze alle drie.',
      'Breng ze naar Obergefreiter Wolfgang bij de slagboom...',
    ]);
  } else {
    await ui.zeg(`${info.naam} loopt nu geboeid achter je aan. Nog ${3 - n} te gaan.`);
  }
  return true;
}
