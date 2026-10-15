// De telefoon van de beer: een eigen chat-app ("Kwebbel") met het gesprek met Kikker.
import { tekst, breekAf, meet } from './tekst.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { vul } from '../core/namen.js';
import { staat } from '../core/staat.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';

const OUD = [
  { van: 'datum', tekst: 'VORIGE WEEK' },
  { van: 'ik', tekst: 'Yo Kikker, heb je nog ritalin?' },
  { van: 'kikker', tekst: 'kwaak. altijd. hoeveel?' },
  { van: 'ik', tekst: 'Doe maar een strip. En heb je ook dexamfetamine?' },
  { van: 'kikker', tekst: 'dex kan ook. morgen bij het hunebed, 3 uur' },
  { van: 'ik', tekst: 'Top! Ik neem het geld mee.' },
  { van: 'kikker', tekst: 'kwaak. tot morgen' },
];

const NIEUW = [
  { van: 'datum', tekst: 'VANDAAG' },
  { van: 'kikker', tekst: 'ey {BEER}' },
  { van: 'kikker', tekst: 'ik krijg nog 10 euro van je' },
  { van: 'kikker', tekst: 'dat tientje van die 3mmc' },
  { van: 'kikker', tekst: 'hallo???' },
  { van: 'kikker', tekst: 'je bent gewoon een oplichter' },
  { van: 'kikker', tekst: 'OPLICHTER' },
];

// telefoon op het scherm (in 240x160-pixels)
const T = { x: 66, y: 2, b: 108, h: 156 };
const SCHERM = { x: 71, y: 9, b: 98, h: 142 };
const LIJST = { x: 71, y: 40, b: 98, h: 86 };
const KLEUR = {
  balk: 0x24485c, kop: 0x2f6f8f, achtergrond: 0xe8ecf2, ik: 0xcfe0ff, ander: 0xffffff,
  rand: 0xc8ccd6, datum: 0xd6dbe4, knop: 0xc83a3a, knopGrijs: 0x8a909c,
};

export class TelefoonScherm {
  /** cfg: { animeer: nieuwe berichten één voor één laten binnenkomen, geblokkeerd } */
  constructor(ui, cfg = {}) {
    this.ui = ui;
    this.cfg = cfg;
    this.volledigScherm = true;
    this.objecten = [];
    this.geblokkeerd = Boolean(cfg.geblokkeerd);
    this.fase = 'berichten';
    this.scroll = 0;
    const d = 750;
    const voeg = (o, diepte = d) => { o.setDepth(diepte); this.objecten.push(o); return o; };
    this.voeg = voeg;

    voeg(ui.add.rectangle(0, 0, BREEDTE, HOOGTE, 0x000000, 0.7).setOrigin(0, 0));
    const g = voeg(ui.add.graphics());
    g.fillStyle(0x0e0e12).fillRoundedRect(T.x - 1, T.y - 1, T.b + 2, T.h + 2, 12);
    g.fillStyle(0x24242c).fillRoundedRect(T.x, T.y, T.b, T.h, 11);
    g.fillStyle(0x16161a).fillRoundedRect(T.x + 3, T.y + 3, T.b - 6, T.h - 6, 9);
    g.fillStyle(KLEUR.achtergrond).fillRect(SCHERM.x, SCHERM.y, SCHERM.b, SCHERM.h);
    g.fillStyle(0x2a2a32).fillRoundedRect(T.x + 42, T.y + 3, 24, 4, 2);
    // statusbalk
    g.fillStyle(KLEUR.balk).fillRect(SCHERM.x, SCHERM.y, SCHERM.b, 10);
    const nu = new Date();
    voeg(tekst(ui, SCHERM.x + 3, SCHERM.y, `${nu.getHours()}:${String(nu.getMinutes()).padStart(2, '0')}`, 'wit'), d + 1);
    g.fillStyle(0xffffff).fillRect(SCHERM.x + SCHERM.b - 14, SCHERM.y + 3, 10, 5);
    g.fillStyle(0xffffff).fillRect(SCHERM.x + SCHERM.b - 4, SCHERM.y + 4, 1, 3);
    g.fillStyle(0x58d080).fillRect(SCHERM.x + SCHERM.b - 13, SCHERM.y + 4, 6, 3);
    // kop met Kikker
    g.fillStyle(KLEUR.kop).fillRect(SCHERM.x, SCHERM.y + 10, SCHERM.b, 21);
    g.fillStyle(0xffffff);
    [[3, 0], [2, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 6]].forEach(([px, py]) => g.fillRect(SCHERM.x + 3 + px, SCHERM.y + 17 + py, 2, 1));
    g.fillStyle(0x5ab04a).fillCircle(SCHERM.x + 17, SCHERM.y + 20, 7);
    g.fillStyle(0xffffff).fillCircle(SCHERM.x + 14, SCHERM.y + 16, 2).fillCircle(SCHERM.x + 20, SCHERM.y + 16, 2);
    g.fillStyle(0x202028).fillRect(SCHERM.x + 14, SCHERM.y + 16, 1, 1).fillRect(SCHERM.x + 20, SCHERM.y + 16, 1, 1);
    g.fillStyle(0xc04848).fillRect(SCHERM.x + 13, SCHERM.y + 22, 8, 1);
    voeg(tekst(ui, SCHERM.x + 27, SCHERM.y + 11, 'Kikker', 'wit'), d + 1);
    this.statusTekst = voeg(tekst(ui, SCHERM.x + 27, SCHERM.y + 21, this.geblokkeerd ? 'geblokkeerd' : 'online', 'wit'), d + 1);
    // onderbalk
    this.onder = voeg(ui.add.graphics(), d + 1);
    this.knopTekst = [voeg(tekst(ui, 0, 0, '', 'wit'), d + 2), voeg(tekst(ui, 0, 0, '', 'wit'), d + 2)];

    // berichtenlijst (met masker)
    this.lijst = voeg(ui.add.container(0, 0), d + 0.5);
    const masker = ui.make.graphics({ add: false });
    masker.fillStyle(0xffffff).fillRect(LIJST.x, LIJST.y, LIJST.b, LIJST.h);
    this.lijst.setMask(masker.createGeometryMask());
    this.masker = masker;
    this.inhoudHoogte = 4;

    this.resultaat = new Promise((klaar) => { this.klaar = klaar; });
    this.klikHandler = (p) => this.klik(p);
    ui.input.on('pointerdown', this.klikHandler);

    OUD.forEach((b) => this.voegBerichtToe(b));
    if (cfg.animeer && !this.geblokkeerd) {
      this.tekenOnder('invoer');
      this.animeerNieuw();
    } else {
      NIEUW.forEach((b) => this.voegBerichtToe(b));
      if (this.geblokkeerd) {
        this.voegBerichtToe({ van: 'systeem', tekst: 'Je hebt Kikker geblokkeerd.' });
        this.fase = 'klaar';
        this.tekenOnder('sluiten');
      } else {
        this.fase = 'knop';
        this.tekenOnder('blokkeer');
      }
      this.naarOnder();
    }
  }

  // ------------------------------------------------------------ berichten

  voegBerichtToe(b) {
    const ui = this.ui;
    const y = LIJST.y + this.inhoudHoogte;
    const g = ui.add.graphics();
    const delen = [g];
    let hoogte;
    if (b.van === 'datum' || b.van === 'systeem') {
      const regels = breekAf(ui, vul(b.tekst), LIJST.b - 16, 'grijs');
      const w = Math.max(...regels.map((r) => meet(ui, r, 'grijs'))) + 8;
      const x = Math.round(LIJST.x + (LIJST.b - w) / 2);
      hoogte = regels.length * 11 + 2;
      g.fillStyle(KLEUR.datum).fillRoundedRect(x, y, w, hoogte, 4);
      regels.forEach((r, i) => {
        delen.push(tekst(ui, Math.round(LIJST.x + (LIJST.b - meet(ui, r, 'grijs')) / 2), y + 1 + i * 11, r, 'grijs'));
      });
    } else {
      const regels = breekAf(ui, vul(b.tekst), 66);
      const w = Math.max(...regels.map((r) => meet(ui, r))) + 8;
      hoogte = regels.length * 11 + 4;
      const x = b.van === 'ik' ? LIJST.x + LIJST.b - w - 3 : LIJST.x + 3;
      g.fillStyle(b.van === 'ik' ? KLEUR.ik : KLEUR.ander).fillRoundedRect(x, y, w, hoogte, 4);
      g.lineStyle(1, KLEUR.rand).strokeRoundedRect(x + 0.5, y + 0.5, w - 1, hoogte - 1, 4);
      regels.forEach((r, i) => delen.push(tekst(ui, x + 4, y + 2 + i * 11, r)));
    }
    delen.forEach((o) => this.lijst.add(o));
    this.inhoudHoogte += hoogte + 4;
    return delen;
  }

  naarOnder() {
    const max = Math.max(0, this.inhoudHoogte - LIJST.h);
    this.scroll = max;
    this.lijst.y = -this.scroll;
  }

  scrollBij(stap) {
    const max = Math.max(0, this.inhoudHoogte - LIJST.h);
    this.scroll = Math.max(0, Math.min(max, this.scroll + stap));
    this.lijst.y = -this.scroll;
  }

  async animeerNieuw() {
    for (const b of NIEUW) {
      if (b.van === 'kikker') {
        this.statusTekst.setText('typt...');
        const typen = this.voegBerichtToe({ van: 'kikker', tekst: '...' });
        this.naarOnder();
        await this.ui.wachtMs(this.snel ? 60 : 750);
        if (this.afgerond) return;
        typen.forEach((o) => o.destroy());
        this.inhoudHoogte -= 15 + 4;
        this.statusTekst.setText('online');
        audio.sfx('bericht');
        this.ui.cameras.main.shake(80, 0.002);
      }
      this.voegBerichtToe(b);
      this.naarOnder();
      if (b.van === 'datum') await this.ui.wachtMs(this.snel ? 60 : 400);
    }
    this.fase = 'knop';
    this.tekenOnder('blokkeer');
  }

  // ------------------------------------------------------------ onderbalk en knoppen

  tekenOnder(soort) {
    const g = this.onder;
    g.clear();
    const x = SCHERM.x + 3;
    const y = 128;
    const b = SCHERM.b - 6;
    this.knopTekst.forEach((t) => t.setText(''));
    if (soort === 'invoer') {
      g.fillStyle(0xffffff).fillRoundedRect(x, y + 3, b - 16, 14, 6);
      g.fillStyle(KLEUR.kop).fillCircle(x + b - 7, y + 10, 6);
      this.knopTekst[0].setText('Bericht').setFont('font_grijs').setPosition(x + 5, y + 5);
      return;
    }
    const kleur = soort === 'blokkeer' ? KLEUR.knop : KLEUR.knopGrijs;
    g.fillStyle(kleur).fillRoundedRect(x, y, b, 21, 5);
    if (this.knopKnippert) g.lineStyle(1, 0xffd860).strokeRoundedRect(x + 0.5, y + 0.5, b - 1, 20, 5);
    const regels = soort === 'blokkeer' ? ['CONTACT', 'BLOKKEREN'] : ['SLUITEN'];
    regels.forEach((r, i) => {
      const t = this.knopTekst[i].setFont('font_wit').setText(r);
      t.setPosition(Math.round(x + (b - meet(this.ui, r, 'wit')) / 2), regels.length === 1 ? y + 5 : y + 1 + i * 10);
    });
    this.onderSoort = soort;
  }

  toonBevestiging() {
    const ui = this.ui;
    this.fase = 'bevestig';
    const d = 760;
    const x = SCHERM.x + 4;
    const b = SCHERM.b - 8;
    const titel = breekAf(ui, 'Kikker blokkeren?', b - 8);
    const uitleg = breekAf(ui, 'Hij kan je dan geen berichten meer sturen.', b - 8, 'grijs');
    const tekstH = (titel.length + uitleg.length) * 11 + 6;
    const knopH = 15;
    const h = tekstH + knopH * 2;
    const y = Math.round(SCHERM.y + (SCHERM.h - h) / 2);
    const g = ui.add.graphics().setDepth(d);
    g.fillStyle(0x000000, 0.4).fillRect(SCHERM.x, SCHERM.y, SCHERM.b, SCHERM.h);
    g.fillStyle(0xffffff).fillRoundedRect(x, y, b, h, 6);
    g.fillStyle(KLEUR.rand).fillRect(x, y + tekstH, b, 1).fillRect(x, y + tekstH + knopH, b, 1);
    this.keuzeVlak = ui.add.rectangle(x + 1, 0, b - 2, knopH - 1, 0xe4e8f0).setOrigin(0, 0).setDepth(d + 0.5);
    const teksten = [
      ...titel.map((r, i) => tekst(ui, x + Math.round((b - meet(ui, r)) / 2), y + 3 + i * 11, r)),
      ...uitleg.map((r, i) => tekst(ui, x + Math.round((b - meet(ui, r, 'grijs')) / 2), y + 3 + (titel.length + i) * 11, r, 'grijs')),
      tekst(ui, x + Math.round((b - meet(ui, 'BLOKKEREN', 'rood')) / 2), y + tekstH + 3, 'BLOKKEREN', 'rood'),
      tekst(ui, x + Math.round((b - meet(ui, 'TERUG', 'blauw')) / 2), y + tekstH + knopH + 3, 'TERUG', 'blauw'),
    ].map((t) => t.setDepth(d + 1));
    this.bevestiging = [g, this.keuzeVlak, ...teksten];
    this.bevestigVak = { x, y, b, tekstH, knopH };
    this.zetKeuze(0);
  }

  zetKeuze(i) {
    this.keuze = i;
    const v = this.bevestigVak;
    this.keuzeVlak.setY(v.y + v.tekstH + 1 + i * v.knopH);
  }

  annuleerBevestiging() {
    this.sluitBevestiging();
    this.fase = 'knop';
    audio.sfx('terug');
  }

  sluitBevestiging() {
    (this.bevestiging || []).forEach((o) => o.destroy());
    this.bevestiging = null;
  }

  blokkeer() {
    audio.sfx('klik');
    this.sluitBevestiging();
    this.geblokkeerd = true;
    this.statusTekst.setText('geblokkeerd');
    this.voegBerichtToe({ van: 'systeem', tekst: 'Je hebt Kikker geblokkeerd.' });
    this.naarOnder();
    this.fase = 'klaar';
    this.tekenOnder('sluiten');
  }

  sluit() {
    if (this.afgerond) return;
    this.afgerond = true;
    audio.sfx('terug');
    this.klaar(this.geblokkeerd && !this.cfg.geblokkeerd ? 'geblokkeerd' : 'gesloten');
  }

  // ------------------------------------------------------------ invoer

  klik(pointer) {
    if (this.afgerond) return;
    const p = pointer.positionToCamera(this.ui.cameras.main);
    if (this.fase === 'bevestig') {
      const v = this.bevestigVak;
      const boven = v.y + v.tekstH;
      if (p.x < v.x || p.x > v.x + v.b) return;
      if (p.y >= boven && p.y < boven + v.knopH) this.blokkeer();
      else if (p.y >= boven + v.knopH && p.y < boven + v.knopH * 2) this.annuleerBevestiging();
      return;
    }
    const opKnop = p.x >= SCHERM.x && p.x <= SCHERM.x + SCHERM.b && p.y >= 126 && p.y <= 152;
    if (opKnop && this.fase === 'knop') { audio.sfx('ok'); this.toonBevestiging(); return; }
    if (opKnop && this.fase === 'klaar') { this.sluit(); return; }
    // tik op het pijltje terug of buiten de telefoon: sluiten
    if (p.x < T.x || p.x > T.x + T.b || (p.y < SCHERM.y + 31 && p.x < SCHERM.x + 12)) {
      if (this.fase !== 'berichten') this.sluit();
    }
  }

  update() {
    if (this.afgerond) return;
    if (this.fase === 'berichten') {
      if (invoer.net('a') || invoer.net('b')) this.snel = true;
      return;
    }
    if (this.fase === 'bevestig') {
      if (invoer.net('omhoog') || invoer.net('omlaag') || invoer.net('links') || invoer.net('rechts')) {
        this.zetKeuze(1 - this.keuze);
        audio.sfx('kies');
      } else if (invoer.net('a')) {
        if (this.keuze === 0) this.blokkeer();
        else this.annuleerBevestiging();
      } else if (invoer.net('b')) this.annuleerBevestiging();
      return;
    }
    if (invoer.herhaal('omhoog')) this.scrollBij(-11);
    else if (invoer.herhaal('omlaag')) this.scrollBij(11);
    else if (invoer.net('a')) {
      if (this.fase === 'knop') { audio.sfx('ok'); this.toonBevestiging(); } else this.sluit();
    } else if (invoer.net('b') || invoer.net('start')) this.sluit();
    // knipperende rand om de knop
    const knipper = Math.floor(performance.now() / 450) % 2 === 0;
    if (knipper !== this.knopKnippert && this.onderSoort) {
      this.knopKnippert = knipper;
      this.tekenOnder(this.onderSoort);
    }
  }

  vernietig() {
    this.sluitBevestiging();
    this.ui.input.off('pointerdown', this.klikHandler);
    this.objecten.forEach((o) => o.destroy());
    this.masker.destroy();
  }
}

/** Telefoon openen (vanuit het menu of na de melding). Geeft 'geblokkeerd' of 'gesloten' terug. */
export async function openTelefoon(ui) {
  const r = await ui.open(new TelefoonScherm(ui, {
    animeer: !staat.vlaggen.berichtGelezen,
    geblokkeerd: Boolean(staat.vlaggen.kikkerGeblokkeerd),
  }));
  staat.vlaggen.berichtGelezen = true;
  if (r === 'geblokkeerd') {
    staat.vlaggen.kikkerGeblokkeerd = true;
    await ui.zeg(['Opgelucht stop je je telefoon weer weg.', 'Zo. Tijd om verder te gaan.']);
  }
  return r;
}
