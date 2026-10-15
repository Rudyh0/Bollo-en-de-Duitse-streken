// De UI-scène ligt altijd bovenop en verzorgt tekstvakken, keuzes, menu's en overgangen.
// Andere scènes roepen dit aan met await, zodat scripts als een verhaal lezen:
//   await ui.zeg('Hallo!');
//   const keuze = await ui.vraag('Wil je het openen?');
import { zetCamera, BREEDTE, HOOGTE } from '../core/constanten.js';
import { Dialoog } from '../ui/dialoog.js';
import { Lijst } from '../ui/lijst.js';
import { kader, tekst, meet, centreerX } from '../ui/tekst.js';
import { audio } from '../core/audio.js';
import { geefItem } from '../core/staat.js';
import { itemNaam } from '../core/items.js';
import { beer } from '../core/namen.js';
import { openPauzemenu } from '../ui/pauzemenu.js';
import { openInstellingen } from '../ui/instellingenscherm.js';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UI', active: false });
  }

  create() {
    zetCamera(this);
    this.dialoog = new Dialoog(this);
    this.panelen = [];
    this.wachters = [];
    this.scripts = 0;
    this.gordijn = this.add.rectangle(0, 0, BREEDTE, HOOGTE, 0x000000, 1).setOrigin(0, 0).setDepth(5000).setAlpha(0);
    this.ooglidBoven = this.add.rectangle(0, 0, BREEDTE, HOOGTE / 2 + 1, 0x000000).setOrigin(0, 0).setDepth(4900).setVisible(false);
    this.ooglidOnder = this.add.rectangle(0, HOOGTE / 2, BREEDTE, HOOGTE / 2, 0x000000).setOrigin(0, 0).setDepth(4900).setVisible(false);
    this.scene.bringToTop();
  }

  /** True zolang er een tekstvak, menu of script actief is. */
  get bezig() {
    return this.dialoog.bezig || this.panelen.length > 0 || this.scripts > 0;
  }

  update(tijd, delta) {
    if (this.wachters.length) {
      const klaar = this.wachters.filter((w) => w.conditie());
      if (klaar.length) {
        this.wachters = this.wachters.filter((w) => !klaar.includes(w));
        klaar.forEach((w) => w.klaar());
      }
    }
    const top = this.panelen[this.panelen.length - 1];
    if (top && top.update) top.update(delta);
    // Tekstvak sluiten als niemand het meer gebruikt.
    if (this.dialoog.open && !this.dialoog.bezig && this.panelen.length === 0 && this.sluitGevraagd) {
      this.sluitGevraagd = false;
      this.dialoog.zichtbaar(false);
    }
  }

  // ------------------------------------------------------------ wachten

  wachtMs(ms) {
    return new Promise((klaar) => {
      if (ms <= 0) { klaar(); return; }
      this.time.delayedCall(ms, klaar);
    });
  }

  wachtOp(conditie) {
    return new Promise((klaar) => this.wachters.push({ conditie, klaar }));
  }

  /** Markeer dat er een script loopt (de speler kan dan niet lopen). */
  async script(functie) {
    this.scripts += 1;
    try {
      return await functie();
    } finally {
      this.scripts -= 1;
      this.sluitGevraagd = true;
    }
  }

  // ------------------------------------------------------------ tekst en keuzes

  async zeg(teksten, opties = {}) {
    this.sluitGevraagd = false;
    await this.dialoog.toon(teksten, opties);
    this.sluitGevraagd = true;
  }

  sluitDialoog() {
    this.dialoog.zichtbaar(false);
    this.sluitGevraagd = false;
  }

  async open(paneel) {
    if (paneel.volledigScherm) this.sluitDialoog();
    this.panelen.push(paneel);
    try {
      return await paneel.resultaat;
    } finally {
      this.panelen = this.panelen.filter((p) => p !== paneel);
      paneel.vernietig();
    }
  }

  kies(opties, cfg = {}) {
    return this.open(new Lijst(this, { opties, ...cfg }));
  }

  /** Tekst met daarna een keuze (standaard JA/NEE). Geeft de index van het antwoord terug. */
  async vraag(teksten, opties = ['JA', 'NEE'], cfg = {}) {
    this.sluitGevraagd = false;
    await this.dialoog.toon(teksten, { wachtAanEinde: false });
    const antwoord = await this.kies(opties, { rechts: 238, onder: 111, annuleer: opties.length - 1, diepte: 950, ...cfg });
    this.sluitGevraagd = true;
    return antwoord;
  }

  /** Voorwerp krijgen, met melodietje. */
  async krijgItem(id, n = 1) {
    geefItem(id, n);
    const naam = itemNaam(id, n);
    const wat = n === 1 ? `een ${naam}` : `${n} ${naam}`;
    const jingle = audio.jingle('item');
    this.sluitGevraagd = false;
    await this.dialoog.toon(`${beer()} vond ${wat}!`, { wachtAanEinde: false });
    await jingle;
    await this.dialoog.wachtOpKnop();
    await this.zeg(`${beer()} stopte ${n === 1 ? 'de' : 'de'} ${naam} in de RUGZAK.`);
  }

  /** Tekst met een melodietje eronder (nieuwe aanval geleerd, enzovoort). */
  async zegMetJingle(teksten, jingleId) {
    const jingle = audio.jingle(jingleId);
    this.sluitGevraagd = false;
    await this.dialoog.toon(teksten, { wachtAanEinde: false });
    await jingle;
    await this.dialoog.wachtOpKnop();
    this.sluitGevraagd = true;
  }

  // ------------------------------------------------------------ overgangen

  /** Titelkaart voor een nieuw hoofdstuk, op een zwart scherm. Het scherm blijft daarna zwart. */
  async hoofdstuk(boven, titel) {
    this.sluitDialoog();
    await this.naarZwart(500);
    const a = tekst(this, centreerX(this, boven, 'grijs'), 58, boven, 'grijs').setDepth(5001).setAlpha(0);
    const b = tekst(this, centreerX(this, titel, 'titel'), 74, titel, 'titel').setDepth(5001).setAlpha(0);
    await new Promise((klaar) => this.tweens.add({ targets: [a, b], alpha: 1, duration: 500, onComplete: klaar }));
    await this.wachtMs(1800);
    await new Promise((klaar) => this.tweens.add({ targets: [a, b], alpha: 0, duration: 400, onComplete: klaar }));
    a.destroy();
    b.destroy();
  }

  gordijnNaar(alpha, ms, kleur = 0x000000) {
    this.gordijn.setFillStyle(kleur, 1);
    return new Promise((klaar) => {
      this.tweens.add({ targets: this.gordijn, alpha, duration: ms, onComplete: klaar });
    });
  }

  naarZwart(ms = 400) { return this.gordijnNaar(1, ms, 0x000000); }
  vanZwart(ms = 400) { return this.gordijnNaar(0, ms, 0x000000); }
  naarWit(ms = 400) { return this.gordijnNaar(1, ms, 0xffffff); }
  vanWit(ms = 400) { return this.gordijnNaar(0, ms, 0xffffff); }
  zetZwart() { this.gordijn.setFillStyle(0x000000, 1).setAlpha(1); }

  /** Overgang naar een gevecht: twee flitsen en zwarte balken die het beeld dichtschuiven. */
  async gevechtsOvergang() {
    audio.sfx('flits');
    for (let i = 0; i < 2; i++) {
      await this.gordijnNaar(0.85, 70, 0xffffff);
      await this.gordijnNaar(0, 90, 0xffffff);
    }
    const balken = [];
    for (let i = 0; i < 10; i++) {
      const vanLinks = i % 2 === 0;
      const r = this.add.rectangle(vanLinks ? -BREEDTE : BREEDTE, i * 16, BREEDTE, 16, 0x000000).setOrigin(0, 0).setDepth(4950);
      balken.push(r);
      this.tweens.add({ targets: r, x: 0, duration: 380, delay: i * 30, ease: 'Sine.easeIn' });
    }
    await this.wachtMs(380 + 10 * 30 + 60);
    this.zetZwart();
    balken.forEach((b) => b.destroy());
  }

  /** Wakker worden: oogleden gaan twee keer open. Het gordijn moet dan al weg zijn. */
  async ogenOpen() {
    const boven = this.ooglidBoven;
    const onder = this.ooglidOnder;
    boven.setVisible(true).y = 0;
    onder.setVisible(true).y = HOOGTE / 2;
    const beweeg = (open, ms) => new Promise((klaar) => {
      this.tweens.add({ targets: boven, y: -open, duration: ms, ease: 'Sine.easeInOut' });
      this.tweens.add({ targets: onder, y: HOOGTE / 2 + open, duration: ms, ease: 'Sine.easeInOut', onComplete: klaar });
    });
    await this.wachtMs(300);
    await beweeg(18, 500);
    await beweeg(0, 250);
    await this.wachtMs(250);
    await beweeg(40, 500);
    await beweeg(10, 200);
    await beweeg(HOOGTE / 2 + 2, 600);
    boven.setVisible(false);
    onder.setVisible(false);
  }

  /** Bordje met de naam van de plek (linksboven), zoals bij het betreden van een gebied. */
  toonLocatie(naam) {
    if (this.locatieBord) this.locatieBord.forEach((o) => o.destroy());
    const b = meet(this, naam) + 24;
    const k = kader(this, 4, -30, b, 24, 'info');
    const t = tekst(this, 16, -23, naam, 'donker');
    const delen = [k, t];
    delen.forEach((o) => o.setDepth(450));
    this.locatieBord = delen;
    this.tweens.add({ targets: delen, y: '+=34', duration: 300, ease: 'Sine.easeOut' });
    this.tweens.add({
      targets: delen, y: '-=34', duration: 300, delay: 2400, ease: 'Sine.easeIn',
      onComplete: () => delen.forEach((o) => o.destroy()),
    });
  }

  /** Pushmelding van de telefoon bovenin beeld. Geeft een functie terug die hem weer weghaalt. */
  toonMelding(afzender, bericht) {
    const x = 16;
    const b = BREEDTE - 32;
    const h = 32;
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.35).fillRoundedRect(x + 1, 2, b, h, 6);
    g.fillStyle(0xf4f6fa).fillRoundedRect(x, 0, b, h, 6);
    g.lineStyle(1, 0xc8ccd6).strokeRoundedRect(x + 0.5, 0.5, b - 1, h - 1, 6);
    // app-icoontje: een spraakwolkje
    g.fillStyle(0x2f6f8f).fillRoundedRect(x + 5, 6, 20, 20, 5);
    g.fillStyle(0xffffff).fillRoundedRect(x + 9, 10, 12, 9, 3);
    g.fillTriangle(x + 11, 18, x + 15, 18, x + 10, 22);
    const delen = [
      g,
      tekst(this, x + 30, 3, 'KWEBBEL - nu', 'grijs'),
      tekst(this, x + 30, 15, `${afzender}: ${bericht}`, 'donker'),
    ];
    const melding = this.add.container(0, -40, delen).setDepth(880);
    this.tweens.add({ targets: melding, y: 4, duration: 260, ease: 'Back.easeOut' });
    return () => new Promise((klaar) => {
      this.tweens.add({
        targets: melding, y: -40, duration: 200, ease: 'Sine.easeIn',
        onComplete: () => { melding.destroy(); klaar(); },
      });
    });
  }

  // ------------------------------------------------------------ grote schermen

  pauzemenu(wereld) {
    return openPauzemenu(this, wereld);
  }

  instellingen(opties = {}) {
    return openInstellingen(this, opties);
  }
}
