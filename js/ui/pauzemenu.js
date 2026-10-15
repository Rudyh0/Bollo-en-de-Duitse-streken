// Het menu dat je opent met START/Esc tijdens het lopen.
import { kader, tekst, breekAf } from './tekst.js';
import { gezondheidsbalk } from './gezondheid.js';
import { openRugzak } from './rugzak.js';
import { openInstellingen } from './instellingenscherm.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';
import { staat, slaOp, heeftOpslag, speeltijdTekst } from '../core/staat.js';
import { beer, park, vul } from '../core/namen.js';

const OPTIES = [
  { label: 'RUGZAK', uitleg: 'Bekijk en gebruik de spullen in je rugzak.' },
  { label: '{BEER_HOOFD}', uitleg: 'Bekijk hoe het met {BEER} gaat.' },
  { label: 'OPSLAAN', uitleg: 'Sla je voortgang op in deze browser.' },
  { label: 'INSTELLINGEN', uitleg: 'Pas de tekstsnelheid, het geluid en de knoppen aan.' },
  { label: 'SLUITEN', uitleg: 'Sluit dit menu en ga verder.' },
];

export async function openPauzemenu(ui, wereld) {
  audio.sfx('menu');
  let start = 0;
  for (;;) {
    const uitlegKader = kader(ui, 2, 112, 236, 46, 'tekst').setDepth(590);
    const uitlegRegels = [tekst(ui, 11, 120, '').setDepth(591), tekst(ui, 11, 134, '').setDepth(591)];
    const keuze = await ui.kies(OPTIES.map((o) => o.label), {
      rechts: 238, y: 2, annuleer: OPTIES.length - 1, start, startSluit: true, soort: 'menu', breedte: 96,
      opVerander: (i) => {
        const regels = breekAf(ui, vul(OPTIES[i].uitleg), 214);
        uitlegRegels[0].setText(regels[0] || '');
        uitlegRegels[1].setText(regels[1] || '');
      },
    });
    uitlegKader.destroy();
    uitlegRegels.forEach((r) => r.destroy());
    start = keuze;
    if (keuze === 0) await openRugzak(ui);
    else if (keuze === 1) await ui.open(new StatusPaneel(ui));
    else if (keuze === 2) {
      if (await opslaanFlow(ui, wereld)) return;
    } else if (keuze === 3) await openInstellingen(ui, { vanuitSpel: true });
    else return;
  }
}

// ------------------------------------------------------------ status van de beer

class StatusPaneel {
  constructor(ui) {
    this.ui = ui;
    this.volledigScherm = true;
    ui.sluitDialoog();
    const d = 700;
    const o = [];
    const voeg = (x, diepte = d) => { x.setDepth(diepte); o.push(x); return x; };
    voeg(ui.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0));
    voeg(kader(ui, 2, 2, 236, 22, 'menu'));
    voeg(tekst(ui, 10, 8, `${beer().toUpperCase()}`, 'donker'), d + 1);
    voeg(tekst(ui, 170, 8, 'B: TERUG', 'grijs'), d + 1);
    voeg(kader(ui, 2, 26, 92, 132, 'info'));
    voeg(ui.add.image(48, 104, 'beer_groot', 0).setOrigin(0.5, 1), d + 1);
    voeg(ui.add.ellipse(48, 106, 60, 10, 0x000000, 0.18), d + 0.5);
    voeg(tekst(ui, 12, 118, beer(), 'blauw'), d + 1);
    voeg(tekst(ui, 12, 132, 'Gevangene', 'grijs'), d + 1);
    voeg(kader(ui, 96, 26, 142, 132, 'tekst'));
    const rijen = [
      [36, 'GEZONDHEID', `${staat.gezondheid}/${staat.maxGezondheid}`],
      [62, 'BESTEMMING', ''],
      [76, '', park()],
      [96, 'SPEELTIJD', speeltijdTekst()],
      [114, 'ONTBIJT', staat.intake.ontbijt || '-'],
      [132, 'HOBBY', staat.intake.hobby || '-'],
    ];
    rijen.forEach(([y, links, rechts]) => {
      if (links) voeg(tekst(ui, 106, y, links, 'grijs'), d + 1);
      if (rechts) {
        const t = voeg(tekst(ui, 0, y, rechts, 'donker'), d + 1);
        t.x = Math.max(106, 230 - t.width);
      }
    });
    const balk = gezondheidsbalk(ui, 164, 50, staat.gezondheid, staat.maxGezondheid, d + 1);
    balk.objecten.forEach((x) => o.push(x));
    this.objecten = o;
    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    audio.sfx('ok');
  }

  update() {
    if (invoer.net('a') || invoer.net('b') || invoer.net('start')) {
      audio.sfx('terug');
      this.klaar();
    }
  }

  vernietig() {
    this.objecten.forEach((x) => x.destroy());
  }
}

// ------------------------------------------------------------ opslaan

function opslagInfo(ui, wereld) {
  const d = 590;
  const o = [];
  const voeg = (x, diepte = d) => { x.setDepth(diepte); o.push(x); return x; };
  voeg(kader(ui, 2, 2, 132, 74, 'info'));
  voeg(tekst(ui, 12, 9, beer(), 'blauw'), d + 1);
  const rijen = [
    ['LOCATIE', wereld.kaartNaam],
    ['SPEELTIJD', speeltijdTekst()],
    ['GEZONDHEID', `${staat.gezondheid}/${staat.maxGezondheid}`],
  ];
  rijen.forEach(([links, rechts], i) => {
    const y = 25 + i * 15;
    voeg(tekst(ui, 12, y, links, 'grijs'), d + 1);
    const t = voeg(tekst(ui, 0, y, rechts), d + 1);
    t.x = 126 - t.width;
  });
  return () => o.forEach((x) => x.destroy());
}

async function opslaanFlow(ui, wereld) {
  const ruimOp = opslagInfo(ui, wereld);
  try {
    if (await ui.vraag('Wil je het spel opslaan?') !== 0) return false;
    if (heeftOpslag() && !wereld.alOpgeslagen) {
      if (await ui.vraag('Er is al een opgeslagen spel. Wil je dat overschrijven?') !== 0) return false;
    }
    ui.sluitGevraagd = false;
    await ui.dialoog.toon('Bezig met opslaan... Zet het spel niet uit!', { wachtAanEinde: false });
    wereld.bewaarPositie();
    const gelukt = slaOp(wereld.kaartNaam);
    await ui.wachtMs(600);
    if (!gelukt) {
      audio.sfx('fout');
      await ui.zeg('Opslaan is niet gelukt. Staat opslag in deze browser misschien uit?');
      return false;
    }
    wereld.alOpgeslagen = true;
    await audio.jingle('opslaan');
    await ui.zeg(`${beer()} heeft het spel opgeslagen.`);
    return true;
  } finally {
    ruimOp();
  }
}
