// Het dagboek van Anne Fries: een opengeslagen schriftje dat je kunt doorbladeren.
import { tekst, breekAf, meet } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';

export const PAGINAS = [
  {
    omslag: true,
    regels: ['DAGBOEK', 'van Anne Fries', 'Leeuwarden', '', 'NIET LEZEN!!!', '(behalve als je een kat bent)'],
  },
  {
    datum: '12 juni',
    tekst: 'Lieve Sjoukje, vandaag ben ik jarig en jij bent mijn cadeau! Heit zegt dat ik alles aan je mag vertellen. '
      + 'Heit heeft een kruidenierswinkel in Leeuwarden. We verkopen suikerbrood, drop, Beerenburg (niet voor mij) en heel veel kaas.',
  },
  {
    datum: '3 juli',
    tekst: 'Er rijden steeds meer Duitse wagens door de stad. Ze zoeken Friezen, zeggen ze. Maar iedereen hier is Fries! '
      + 'Mem zegt dat ik op straat niet zo hard Fries moet praten. Ik oefen nu Hollands. Het klinkt raar in mijn mond.',
  },
  {
    datum: '15 juli',
    tekst: 'Heit fluisterde vanavond met mem in de keuken. We gaan weg. Heit heeft een oude vriend in Wezup, ook een kruidenier. '
      + 'Achter zijn winkel is een GEHEIME KAMER. Je komt erin via de boekenkast! Niemand mag het weten, Sjoukje. Ook jij niet. Oeps.',
  },
  {
    datum: '16 juli',
    tekst: 'Ik mag maar één tas mee. Ik neem mijn schaatsen en een pot hagelslag. Heit zegt dat hagelslag geen eerste levensbehoefte is. '
      + 'Heit heeft ongelijk. Jou kan ik niet meenemen, dus ik verstop je onder de toonbank. Ik kom je halen. Beloofd.',
  },
  {
    datum: '17 juli',
    tekst: 'Vannacht vertrekken we. Ik ben bang, maar ook een beetje opgewonden. Een geheime kamer! Net als in een boek. '
      + 'Als iemand dit vindt: zeg niks tegen de Duitsers. Alsjeblieft. Groetjes, Anne',
  },
];

const P = { x: 22, y: 6, b: 196, h: 148 };

export class DagboekScherm {
  constructor(ui) {
    this.ui = ui;
    this.volledigScherm = true;
    this.pagina = 0;
    this.objecten = [];
    this.inhoud = [];
    const d = 760;
    const voeg = (o, diepte = d) => { o.setDepth(diepte); this.objecten.push(o); return o; };
    voeg(ui.add.rectangle(0, 0, BREEDTE, HOOGTE, 0x1a1210, 0.85).setOrigin(0, 0));
    this.blad = voeg(ui.add.graphics());
    this.paginaTekst = voeg(tekst(ui, 0, P.y + P.h - 13, '', 'grijs'), d + 2);
    this.pijlen = voeg(ui.add.graphics(), d + 2);
    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    this.klikHandler = (p) => this.klik(p);
    ui.input.on('pointerdown', this.klikHandler);
    this.toon();
  }

  tekenBlad(omslag) {
    const g = this.blad;
    g.clear();
    if (omslag) {
      g.fillStyle(0x6a1a2e).fillRoundedRect(P.x - 2, P.y - 2, P.b + 4, P.h + 4, 6);
      g.fillStyle(0xc83a5a).fillRoundedRect(P.x, P.y, P.b, P.h, 5);
      g.fillStyle(0x8a2640).fillRect(P.x, P.y, 10, P.h);
      g.fillStyle(0xf8f0e0).fillRoundedRect(P.x + 38, P.y + 22, P.b - 64, 74, 4);
      g.fillStyle(0xe0c048).fillRect(P.x + P.b - 6, P.y + 62, 8, 16);
      return;
    }
    g.fillStyle(0x4a3a2a).fillRoundedRect(P.x - 2, P.y - 2, P.b + 4, P.h + 4, 4);
    g.fillStyle(0xfbf6e8).fillRect(P.x, P.y, P.b, P.h);
    g.fillStyle(0xbcd4ec);
    for (let y = P.y + 27; y < P.y + P.h - 14; y += 12) g.fillRect(P.x + 4, y, P.b - 8, 1);
    g.fillStyle(0xe8a0a0).fillRect(P.x + 22, P.y, 1, P.h);
    // gaatjes van de ringband
    g.fillStyle(0x4a3a2a);
    for (let y = P.y + 10; y < P.y + P.h; y += 18) g.fillCircle(P.x + 8, y, 2.5);
  }

  toon() {
    this.inhoud.forEach((o) => o.destroy());
    this.inhoud = [];
    const p = PAGINAS[this.pagina];
    const ui = this.ui;
    const d = 761;
    this.tekenBlad(p.omslag);
    if (p.omslag) {
      p.regels.forEach((r, i) => {
        if (!r) return;
        const kleur = i === 0 ? 'rood' : i >= 4 ? 'grijs' : 'donker';
        const y = i >= 4 ? P.y + 100 + (i - 4) * 12 : P.y + 28 + i * 15;
        const t = tekst(ui, 0, y, r, i >= 4 ? 'wit' : kleur).setDepth(d);
        t.x = Math.round(P.x + (P.b - meet(ui, r, i >= 4 ? 'wit' : kleur)) / 2);
        this.inhoud.push(t);
      });
    } else {
      this.inhoud.push(tekst(ui, P.x + 28, P.y + 8, p.datum, 'rood').setDepth(d));
      const regels = breekAf(ui, p.tekst, P.b - 36);
      regels.slice(0, 10).forEach((r, i) => {
        this.inhoud.push(tekst(ui, P.x + 28, P.y + 17 + i * 12, r).setDepth(d));
      });
    }
    const n = `${this.pagina + 1}/${PAGINAS.length}`;
    this.paginaTekst.setText(p.omslag ? '' : n).setX(P.x + P.b - 8 - meet(ui, n, 'grijs'));
    const g = this.pijlen;
    const my = P.y + P.h / 2;
    g.clear().fillStyle(0xf0e8d8);
    if (this.pagina > 0) g.fillTriangle(P.x - 6, my - 6, P.x - 6, my + 6, P.x - 13, my);
    if (this.pagina < PAGINAS.length - 1) g.fillTriangle(P.x + P.b + 6, my - 6, P.x + P.b + 6, my + 6, P.x + P.b + 13, my);
  }

  blader(stap) {
    const nieuw = Math.max(0, Math.min(PAGINAS.length - 1, this.pagina + stap));
    if (nieuw === this.pagina) return;
    this.pagina = nieuw;
    audio.sfx('trekje');
    this.toon();
  }

  klik(pointer) {
    if (this.afgerond) return;
    const p = pointer.positionToCamera(this.ui.cameras.main);
    if (p.x < P.x || p.x > P.x + P.b || p.y < P.y || p.y > P.y + P.h) { this.sluit(); return; }
    if (p.x < P.x + P.b / 2) this.blader(-1);
    else if (this.pagina === PAGINAS.length - 1) this.sluit();
    else this.blader(1);
  }

  sluit() {
    if (this.afgerond) return;
    this.afgerond = true;
    audio.sfx('terug');
    this.klaar(this.pagina);
  }

  update() {
    if (this.afgerond) return;
    if (invoer.net('rechts') || invoer.net('a')) {
      if (this.pagina === PAGINAS.length - 1 && invoer.net('a')) this.sluit();
      else this.blader(1);
    } else if (invoer.net('links')) this.blader(-1);
    else if (invoer.net('b') || invoer.net('start')) this.sluit();
  }

  vernietig() {
    this.ui.input.off('pointerdown', this.klikHandler);
    this.inhoud.forEach((o) => o.destroy());
    this.objecten.forEach((o) => o.destroy());
  }
}

/** Dagboek lezen. Geeft true terug als je het tot de laatste bladzijde hebt gelezen. */
export async function leesDagboek(ui) {
  const laatste = await ui.open(new DagboekScherm(ui));
  return laatste === PAGINAS.length - 1;
}
