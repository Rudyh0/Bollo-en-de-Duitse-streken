// Het rugzakscherm: lijst met spullen, uitleg en icoon, en voorwerpen gebruiken.
import { kader, tekst, breekAf } from './tekst.js';
import { gezondheidsbalk } from './gezondheid.js';
import { ITEMS } from '../core/items.js';
import { staat, aantal, neemItem, herstel } from '../core/staat.js';
import { audio } from '../core/audio.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';
import { beer, vul } from '../core/namen.js';
import { leesDagboek } from './dagboek.js';

/** Middelen die bij een speekseltest zichtbaar blijven. */
const MIDDELEN = ['ritalin', 'xtc', '3mmc', 'wiet', 'hasj'];

function onthoudGebruik(id) {
  if (!MIDDELEN.includes(id)) return;
  staat.vlaggen.gebruikt = { ...(staat.vlaggen.gebruikt || {}), [id]: true };
}

const MAALTIJDEN = ['een kom erwtensoep', 'een gevulde koek', 'een broodje kroket', 'een bord hutspot', 'een krentenbol met kaas'];

class RugzakScherm {
  constructor(ui) {
    this.ui = ui;
    const d = 700;
    this.objecten = [];
    const voeg = (o, diepte = d) => { o.setDepth(diepte); this.objecten.push(o); return o; };
    voeg(ui.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0));
    voeg(kader(ui, 2, 2, 88, 104, 'menu'));
    voeg(ui.add.ellipse(46, 66, 44, 10, 0x000000, 0.15), d + 1);
    this.rugzak = voeg(ui.add.image(46, 66, 'icoon_rugzak').setOrigin(0.5, 1).setScale(3), d + 2);
    voeg(tekst(ui, 22, 74, 'RUGZAK', 'donker'), d + 1);
    this.balk = gezondheidsbalk(ui, 12, 94, staat.gezondheid, staat.maxGezondheid, d + 1);
    this.balk.objecten.forEach((o) => this.objecten.push(o));
    voeg(kader(ui, 2, 108, 236, 50, 'tekst'));
    this.icoon = voeg(ui.add.image(10, 116, 'icoon_voedselbon').setOrigin(0, 0), d + 1);
    this.regels = [0, 1, 2].map((i) => voeg(tekst(ui, 32, 114 + i * 13, ''), d + 1));
    ui.tweens.add({ targets: this.rugzak, y: 64, duration: 120, yoyo: true, repeat: 1 });
  }

  toon(id) {
    const item = ITEMS[id];
    if (!item) {
      this.icoon.setVisible(false);
      const regels = breekAf(this.ui, 'Sluit de rugzak.', 196);
      this.regels.forEach((r, i) => r.setText(regels[i] || ''));
      return;
    }
    this.icoon.setVisible(true).setTexture(item.icoon);
    const regels = breekAf(this.ui, vul(item.beschrijving), 196);
    this.regels.forEach((r, i) => r.setText(regels[i] || ''));
  }

  werkBalkBij() {
    this.balk.zet(staat.gezondheid);
  }

  vernietig() {
    this.objecten.forEach((o) => o.destroy());
  }
}

const EFFECT_TEKSTEN = {
  ritalin: ['{BEER} neemt een RITALIN.', 'Je hart gaat tekeer. Je benen willen maar één ding: rennen!'],
  xtc: ['{BEER} neemt een XTC.', 'Alles om je heen begint te glinsteren. Wat een mooie bomen. Wat een mooie wereld.'],
  '3mmc': ['{BEER} neemt wat 3MMC.', 'Alles is mooi. Alles is snel. Héél snel.'],
  wiet: ['{BEER} draait een jointje en neemt een paar flinke halen.', 'Alles wordt een beetje... zacht. En traag. Heel traag.'],
  hasj: ['{BEER} rookt een stukje hasj.', 'Je benen voelen als pudding. Lekkere pudding.'],
};

const HERSTEL_TEKSTEN = {
  wiet: ['{BEER} rookt snel een jointje.', 'De pijn zakt weg. {BEER} kreeg {N} punten gezondheid terug!'],
  hasj: ['{BEER} neemt een hap van een spacecake met hasj.', 'Heerlijk. {BEER} kreeg {N} punten gezondheid terug!'],
};

function zetEffect(item) {
  staat.effecten = staat.effecten || {};
  Object.entries(item.effect).forEach(([soort, ms]) => {
    staat.effecten[soort] = Math.max(staat.effecten[soort] || 0, ms);
  });
}

async function gebruik(ui, id, scherm, inGevecht = false) {
  const item = ITEMS[id];
  let opties = item.soort === 'sleutel' ? ['BEKIJKEN', 'TERUG'] : ['GEBRUIKEN', 'TERUG'];
  if (id === 'dagboek') opties = ['LEZEN', 'TERUG'];
  const keuze = await ui.kies(opties, { rechts: 238, onder: 106, annuleer: 1, diepte: 720 });
  if (keuze !== 0) return;

  if (item.herstel) {
    const vol = staat.gezondheid >= staat.maxGezondheid;
    // Vol en geen effect (of midden in een gevecht): dan heeft het geen zin.
    if (vol && (!item.effect || inGevecht)) {
      await ui.zeg(id === 'voedselbon' ? `${beer()} heeft op dit moment geen honger.` : `${beer()} voelt zich al prima.`);
      return;
    }
    neemItem(id);
    onthoudGebruik(id);
    if (vol) {
      zetEffect(item);
      audio.sfx('menu');
      await ui.zeg(EFFECT_TEKSTEN[id] || [`{BEER} gebruikt ${item.naam}.`]);
      return true;
    }
    const voor = staat.gezondheid;
    const hersteld = herstel(item.herstel);
    audio.jingle('herstel');
    for (let i = 1; i <= hersteld; i++) {
      scherm.balk.zet(voor + i);
      await ui.wachtMs(45);
    }
    if (id === 'voedselbon') {
      const maaltijd = MAALTIJDEN[Math.floor(Math.random() * MAALTIJDEN.length)];
      await ui.zeg([
        `${beer()} ruilde een VOEDSELBON in voor ${maaltijd}.`,
        `${beer()} kreeg ${hersteld} punten gezondheid terug!`,
      ]);
    } else {
      await ui.zeg((HERSTEL_TEKSTEN[id] || ['{BEER} kreeg {N} punten gezondheid terug!']).map((t) => t.replace('{N}', hersteld)));
    }
    if (item.effect && !inGevecht) {
      zetEffect(item);
      await ui.zeg(EFFECT_TEKSTEN[id].slice(1));
    }
    return true;
  }

  if (item.effect) {
    if (inGevecht) {
      await ui.zeg('Dit is niet het moment om dat te gebruiken.');
      return false;
    }
    neemItem(id);
    onthoudGebruik(id);
    zetEffect(item);
    audio.sfx('menu');
    await ui.zeg(EFFECT_TEKSTEN[id] || [`{BEER} gebruikt ${item.naam}.`]);
    return true;
  }

  if (id === 'dagboek') {
    const uit = await leesDagboek(ui);
    if (uit && !staat.vlaggen.dagboekGelezen) {
      staat.vlaggen.dagboekGelezen = true;
      await ui.zeg([
        'Een geheime kamer achter een boekenkast, bij een kruidenier in Wezup...',
        '{BEER} stopt het dagboek voorzichtig terug in de rugzak.',
      ]);
    }
    return false;
  }

  if (id === 'handboeien') {
    await ui.zeg(staat.vlaggen.dorpQuest ? [
      'Koude, zware handboeien. Je hebt er nog ' + aantal(id) + ' over.',
      'Ergens in Orvelte zitten nog Friezen verstopt...',
    ] : 'Koude, zware handboeien.');
    return false;
  }

  if (id === 'soeplepel') {
    await ui.zeg(staat.vlaggen.rookAlarm ? [
      'Een stevige metalen soeplepel. Er zit nog een beetje roet op.',
      'Hij is ook prima geschikt om Duitsers mee te slaan.',
    ] : [
      'Een stevige metalen soeplepel. Hij ruikt nog een beetje naar erwtensoep.',
      'Je kunt er van alles mee scheppen...',
    ]);
    return false;
  }

  await ui.zeg('Daar kun je hier niets mee.');
}

/** Opent de rugzak. Met { inGevecht: true } sluit hij na het gebruiken van een voorwerp en geeft hij true terug. */
export async function openRugzak(ui, { inGevecht = false } = {}) {
  ui.sluitDialoog();
  audio.sfx('ok');
  const scherm = new RugzakScherm(ui);
  let start = 0;
  try {
    for (;;) {
      const ids = Object.keys(ITEMS).filter((id) => aantal(id) > 0);
      const opties = ids.map((id) => ({
        label: ITEMS[id].naam,
        rechts: ITEMS[id].soort === 'sleutel' && aantal(id) < 2 ? '' : `×${aantal(id)}`,
      }));
      opties.push({ label: 'SLUITEN' });
      if (!ids.length) scherm.toon(null);
      const keuze = await ui.kies(opties, {
        x: 92, y: 2, breedte: 146, annuleer: opties.length - 1, start, diepte: 710,
        opVerander: (i) => scherm.toon(ids[i]),
      });
      if (keuze >= ids.length) return false;
      start = keuze;
      const gebruikt = await gebruik(ui, ids[keuze], scherm, inGevecht);
      if (gebruikt && inGevecht) return true;
      if (gebruikt && ITEMS[ids[keuze]].effect && staat.effecten && Object.keys(staat.effecten).length) return true;
      if (aantal(ids[keuze]) === 0) start = Math.max(0, keuze - 1);
    }
  } finally {
    scherm.vernietig();
  }
}
