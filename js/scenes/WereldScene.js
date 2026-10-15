// De speelwereld: tegelkaart, objecten, personen en lopen over een raster (zoals in de klassieke RPG's).
//
// Kaarten (js/maps) beschrijven tegels, objecten, personen, stoeten (geketende gevangenen met een wachter),
// interacties en deuren naar andere kaarten. Scripts (js/maps/*-scripts.js) bepalen wat er gebeurt.
import { SCHAAL, TEGEL, RICHTINGEN, TEGENOVER, BREEDTE, HOOGTE } from '../core/constanten.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { instellingen } from '../core/instellingen.js';
import { staat } from '../core/staat.js';
import { KAARTEN, SCRIPTS } from '../maps/index.js';

const LOOP_MS = 240;
const REN_MS = 120;
const DRAAI_MS = 90;
const NPC_LOOP_MS = 300;

// Objecten met een vaste "voet" (tegels waar je niet doorheen kunt).
// voet: breedte x hoogte in tegels, linksboven op (x, y). De afbeelding staat met de onderkant op de voet.
const OBJECT_TYPES = {
  stapelbed: { textuur: (o) => (o.variant === 'rood' ? 'obj_stapelbed_rood' : 'obj_stapelbed'), b: 1, h: 2 },
  kist: {
    textuur: (o) => (staat.vlaggen[o.vlag] ? 'obj_kist_open' : 'obj_kist'),
    b: 0, h: 0,
    positie: (o) => [o.x * TEGEL + 1, o.y * TEGEL + 26],
    oorsprong: [0, 0],
    diepte: (o) => (o.y + 2) * TEGEL + 1,
  },
  tafel: { textuur: () => 'obj_tafel', b: 4, h: 1, positie: (o) => [o.x * TEGEL, o.y * TEGEL - 2], oorsprong: [0, 0] },
  kruk: { textuur: () => 'obj_kruk', b: 1, h: 1, positie: (o) => [o.x * TEGEL + 1, o.y * TEGEL + 2], oorsprong: [0, 0] },
  kachel: { textuur: () => 'obj_kachel', b: 1, h: 1, dy: 2 },
  emmer: { textuur: () => 'obj_emmer', b: 1, h: 1, positie: (o) => [o.x * TEGEL + 1, o.y * TEGEL + 1], oorsprong: [0, 0] },
  // buiten
  barak: {
    textuur: (o) => {
      const basis = o.nummer ? `obj_barak_${o.nummer}` : 'obj_barak';
      return o.openVlag && staat.vlaggen[o.openVlag] ? `${basis}_open` : basis;
    },
    b: 7, h: 4,
  },
  keuken: { textuur: () => 'obj_keuken', b: 5, h: 4 },
  wachttoren: { textuur: () => 'obj_wachttoren', b: 2, h: 1, dx: -4 },
  poort: { textuur: (o) => (staat.vlaggen[o.openVlag] ? 'obj_poort_open' : 'obj_poort'), b: 4, h: 1 },
  wachthuisje: { textuur: () => 'obj_wachthuisje', b: 2, h: 2 },
  den: { textuur: () => 'obj_den', b: 2, h: 1 },
  waterpomp: { textuur: () => 'obj_waterpomp', b: 1, h: 1 },
  lantaarn: { textuur: () => 'obj_lantaarn', b: 1, h: 1 },
  bankje: { textuur: () => 'obj_bankje', b: 2, h: 1, dy: -1 },
  kisten: { textuur: () => 'obj_kisten', b: 1, h: 1 },
  bord: { textuur: () => 'obj_bord', b: 1, h: 1, dx: -4 },
};

const sleutel = (x, y) => `${x},${y}`;

function richtingNaar(van, naar) {
  if (naar.x > van.x) return 'rechts';
  if (naar.x < van.x) return 'links';
  if (naar.y > van.y) return 'omlaag';
  return 'omhoog';
}

export class WereldScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Wereld' });
  }

  init(data) {
    this.start = data || {};
  }

  create() {
    this.ui = this.scene.get('UI');
    this.kaart = KAARTEN[staat.kaart] || KAARTEN.barak;
    this.kaartNaam = this.kaart.naam;
    this.scripts = SCRIPTS[this.kaart.id] || {};
    this.alOpgeslagen = false;
    this.botsTijd = 0;
    this.bezigMetMenu = false;
    this.overgang = false;
    this.bouwKaart();
    this.bouwObjecten();
    this.bouwPersonen();
    this.bouwStoeten();

    if (this.start.nieuw) {
      const s = this.kaart.start;
      staat.x = s.x;
      staat.y = s.y;
      staat.richting = s.richting;
    }
    this.maakSpeler();

    const cam = this.cameras.main;
    cam.setZoom(SCHAAL);
    cam.setRoundPixels(true);
    const mapB = this.breedte * TEGEL;
    const mapH = this.hoogte * TEGEL;
    // Kleinere kaarten in het midden van het scherm.
    cam.setBounds(Math.min(0, (mapB - BREEDTE) / 2), Math.min(0, (mapH - HOOGTE) / 2), Math.max(mapB, BREEDTE), Math.max(mapH, HOOGTE));
    cam.startFollow(this.speler.sprite, true, 1, 1, 0, 8);
    cam.setBackgroundColor('#000000');

    audio.speelMuziek(this.kaart.muziek);
    this.events.once('shutdown', () => invoer.reset());
    if (this.scripts.opbouw) this.scripts.opbouw(this.context());
    this.binnenkomst();
  }

  async binnenkomst() {
    const script = this.scripts.binnenkomst;
    await this.ui.script(async () => {
      if (this.start.nieuw && script) {
        await script(this.context(), { nieuw: true });
      } else {
        await this.ui.vanZwart(this.start.binnen ? 300 : 400);
        if (!this.start.stil) this.ui.toonLocatie(this.kaartNaam);
        if (script) await script(this.context(), { nieuw: false, ...this.start });
      }
    });
  }

  // ------------------------------------------------------------ opbouw

  bouwKaart() {
    const { legenda, vast, tegelset } = this.kaart;
    const rijen = this.kaart.rijen;
    this.hoogte = rijen.length;
    this.breedte = rijen[0].length;
    const lees = (rij) => [...rij].map((t) => (t === ' ' ? -1 : legenda[t] ?? 0));
    const grond = rijen.map(lees);
    this.tegels = grond;
    const map = this.make.tilemap({ data: grond, tileWidth: TEGEL, tileHeight: TEGEL });
    const set = map.addTilesetImage(tegelset, tegelset, TEGEL, TEGEL, 0, 0);
    this.laag = map.createLayer(0, set, 0, 0).setDepth(-20);
    this.map = map;
    this.vast = new Set();
    const markeer = (data) => data.forEach((rij, y) => rij.forEach((t, x) => {
      if (t >= 0 && vast.includes(t)) this.vast.add(sleutel(x, y));
    }));
    markeer(grond);
    // Bovenlaag (hekken, struiken) met transparante tegels.
    this.bovenlaag = null;
    if (this.kaart.boven) {
      const boven = this.kaart.boven.map(lees);
      const map2 = this.make.tilemap({ data: boven, tileWidth: TEGEL, tileHeight: TEGEL });
      const set2 = map2.addTilesetImage(tegelset, tegelset, TEGEL, TEGEL, 0, 0);
      this.bovenlaag = map2.createLayer(0, set2, 0, 0).setDepth(-10);
      markeer(boven);
    }
    this.interacties = new Map();
    (this.kaart.interacties || []).forEach((i) => this.interacties.set(sleutel(i.x, i.y), i.script));
    // Tegels die veranderen door een vlag (bijv. een deur die opengaat).
    (this.kaart.tegelVlaggen || []).forEach((t) => {
      if (staat.vlaggen[t.vlag]) this.zetTegel(t.x, t.y, t.tegel);
    });
  }

  zetTegel(x, y, index) {
    this.laag.putTileAt(index, x, y);
  }

  bouwObjecten() {
    this.objecten = {};
    (this.kaart.objecten || []).forEach((o) => this.maakObject(o));
  }

  maakObject(o) {
    const type = OBJECT_TYPES[o.type];
    if (!type) return;
    let px;
    let py;
    let oorsprong;
    if (type.positie) {
      [px, py] = type.positie(o);
      oorsprong = type.oorsprong;
    } else {
      px = o.x * TEGEL + (type.dx || 0);
      py = (o.y + type.h) * TEGEL + (type.dy || 0);
      oorsprong = [0, 1];
    }
    const diepte = type.diepte ? type.diepte(o) : (o.y + Math.max(1, type.h)) * TEGEL;
    const sprite = this.add.image(px, py, type.textuur(o)).setOrigin(...oorsprong).setDepth(diepte);
    if (o.id) this.objecten[o.id] = { sprite, data: o, type };
    for (let dy = 0; dy < type.h; dy++) {
      for (let dx = 0; dx < type.b; dx++) {
        this.vast.add(sleutel(o.x + dx, o.y + dy));
        if (o.script) this.interacties.set(sleutel(o.x + dx, o.y + dy), o.script);
      }
    }
    // extra interacties per object (bijv. de deur van een barak)
    (o.interacties || []).forEach((i) => this.interacties.set(sleutel(o.x + i.dx, o.y + i.dy), i.script));
  }

  maakPersoonSprite(spriteKey, x, y, richting) {
    const sprite = this.add.sprite(x * TEGEL + 8, (y + 1) * TEGEL, spriteKey, 0).setOrigin(0.5, 1);
    const frames = this.textures.get(spriteKey).frameTotal - 1;
    return { sprite, loopt: frames >= 12, richting };
  }

  nieuwPersoon(n) {
    const { sprite, loopt } = this.maakPersoonSprite(n.sprite, n.x, n.y, n.richting);
    const p = {
      ...n,
      sprite,
      loopt,
      beweegt: false,
      voortgang: 0,
      duur: n.duur || NPC_LOOP_MS,
      voet: 0,
      thuis: { x: n.x, y: n.y },
      timer: 600 + Math.random() * 2500,
      kijk: (richting) => { p.richting = richting; this.plaatsPersoon(p); },
    };
    this.plaatsPersoon(p);
    return p;
  }

  bouwPersonen() {
    this.personen = {};
    this.personenOpPlek = new Map();
    this.kettingen = this.add.graphics();
    (this.kaart.npcs || []).forEach((n) => {
      if (n.verbergVlag && staat.vlaggen[n.verbergVlag]) return;
      const plek = n.plekNaVlag && staat.vlaggen[n.plekNaVlag.vlag] ? n.plekNaVlag : null;
      const p = this.nieuwPersoon(plek ? { ...n, x: plek.x, y: plek.y, richting: plek.richting } : n);
      this.personen[n.id] = p;
      this.personenOpPlek.set(sleutel(p.x, p.y), p);
    });
  }

  bouwStoeten() {
    this.stoeten = [];
    (this.kaart.stoeten || []).forEach((st) => {
      const pad = st.pad;
      const leden = st.leden.map((lid, i) => {
        const plek = pad[(st.start - i + pad.length * 10) % pad.length];
        const volgende = pad[(st.start - i + 1 + pad.length * 10) % pad.length];
        const p = this.nieuwPersoon({
          ...lid, x: plek.x, y: plek.y, richting: richtingNaar(plek, volgende), gedrag: 'stoet', duur: 380,
        });
        this.personen[lid.id] = p;
        this.personenOpPlek.set(sleutel(p.x, p.y), p);
        return p;
      });
      this.stoeten.push({ ...st, leden, index: st.start, timer: 800 });
    });
  }

  maakSpeler() {
    const sprite = this.add.sprite(0, 0, 'beer', 0).setOrigin(0.5, 1);
    this.speler = {
      sprite,
      x: staat.x,
      y: staat.y,
      richting: staat.richting,
      beweegt: false,
      voortgang: 0,
      duur: LOOP_MS,
      voet: 0,
      draaiTimer: 0,
      liep: false,
    };
    this.plaatsSpeler();
  }

  plaatsSpeler() {
    const s = this.speler;
    let px = s.x * TEGEL + 8;
    let py = (s.y + 1) * TEGEL;
    if (s.beweegt) {
      const r = RICHTINGEN[s.richting];
      const t = s.voortgang;
      px = (s.x + r.dx * t) * TEGEL + 8;
      py = (s.y + r.dy * t + 1) * TEGEL;
    }
    s.sprite.setPosition(Math.round(px), Math.round(py));
    s.sprite.setDepth(py + 0.5);
    const basis = RICHTINGEN[s.richting].frame * 3;
    let frame = basis;
    if (s.beweegt && s.voortgang < 0.55) frame = basis + 1 + s.voet;
    if (s.botsAnimatie > 0) frame = basis + 1 + s.voet;
    s.sprite.setFrame(frame);
  }

  plaatsPersoon(p) {
    let px = p.x * TEGEL + 8;
    let py = (p.y + 1) * TEGEL;
    if (p.beweegt) {
      const t = p.voortgang;
      px = (p.x + (p.naarX - p.x) * t) * TEGEL + 8;
      py = (p.y + (p.naarY - p.y) * t + 1) * TEGEL;
    }
    p.sprite.setPosition(Math.round(px), Math.round(py));
    p.sprite.setDepth(py + 0.5);
    const r = RICHTINGEN[p.richting].frame;
    if (p.loopt) {
      let frame = r * 3;
      if (p.beweegt && p.voortgang < 0.55) frame += 1 + p.voet;
      p.sprite.setFrame(frame);
    } else {
      p.sprite.setFrame(r);
    }
  }

  // ------------------------------------------------------------ helpers voor scripts

  context() {
    return { ui: this.ui, wereld: this, staat, audio };
  }

  bewaarPositie() {
    staat.x = this.speler.x;
    staat.y = this.speler.y;
    staat.richting = this.speler.richting;
    staat.kaart = this.kaart.id;
  }

  zetObjectTextuur(id, textuur) {
    const o = this.objecten[id];
    if (o) o.sprite.setTexture(textuur);
  }

  vernieuwObject(id) {
    const o = this.objecten[id];
    if (o) o.sprite.setTexture(o.type.textuur(o.data));
  }

  persoon(id) {
    return this.personen[id];
  }

  verwijderPersoon(id) {
    const p = this.personen[id];
    if (!p) return;
    this.personenOpPlek.forEach((waarde, k) => { if (waarde === p) this.personenOpPlek.delete(k); });
    p.sprite.destroy();
    delete this.personen[id];
  }

  binnenKaart(x, y) {
    return x >= 0 && y >= 0 && x < this.breedte && y < this.hoogte;
  }

  kanLopen(x, y) {
    if (!this.binnenKaart(x, y)) return false;
    if (this.vast.has(sleutel(x, y))) return false;
    if (this.personenOpPlek.has(sleutel(x, y))) return false;
    return true;
  }

  spelerOp(x, y) {
    const s = this.speler;
    if (s.x === x && s.y === y) return true;
    if (s.beweegt) {
      const r = RICHTINGEN[s.richting];
      if (s.x + r.dx === x && s.y + r.dy === y) return true;
    }
    return false;
  }

  npcKanLopen(p, x, y) {
    if (!this.kanLopen(x, y)) return false;
    if (this.spelerOp(x, y)) return false;
    if ((this.kaart.warps || []).some((w) => w.x === x && w.y === y)) return false;
    return true;
  }

  /** Laat een persoon één stap zetten. Geeft false als het niet kan. */
  stapPersoon(p, richting, { negeerBezet = false } = {}) {
    const r = RICHTINGEN[richting];
    const nx = p.x + r.dx;
    const ny = p.y + r.dy;
    p.richting = richting;
    if (!negeerBezet && !this.npcKanLopen(p, nx, ny)) {
      this.plaatsPersoon(p);
      return false;
    }
    p.beweegt = true;
    p.voortgang = 0;
    p.naarX = nx;
    p.naarY = ny;
    p.voet = 1 - p.voet;
    this.personenOpPlek.set(sleutel(nx, ny), p);
    return true;
  }

  /** Voor scripts: laat iemand een aantal stappen lopen en wacht tot hij er is. */
  async loopPersoon(p, richting, stappen = 1) {
    p.gescript = true;
    for (let i = 0; i < stappen; i++) {
      if (!this.stapPersoon(p, richting, { negeerBezet: true })) break;
      await this.ui.wachtOp(() => !p.beweegt);
    }
  }

  /** Uitroepteken boven iemands hoofd (zoals wanneer een wachter je ziet). */
  async uitroep(p) {
    audio.sfx('uitroep');
    const b = this.add.image(p.sprite.x, p.sprite.y - 22, 'effect_uitroep').setOrigin(0.5, 1).setDepth(10000);
    this.tweens.add({ targets: b, y: b.y - 3, duration: 120, yoyo: true });
    await this.ui.wachtMs(700);
    b.destroy();
  }

  /** Speler en persoon naar elkaar laten kijken. */
  kijkNaarElkaar(p) {
    const s = this.speler;
    const r = richtingNaar(s, p);
    s.richting = r;
    this.plaatsSpeler();
    p.kijk(TEGENOVER[r]);
  }

  /** Naar een andere kaart (deur, trap, poort...). */
  async gaNaar(kaartId, x, y, richting, extra = {}) {
    if (this.overgang) return;
    this.overgang = true;
    audio.sfx('deur_open');
    await this.ui.naarZwart(260);
    staat.kaart = kaartId;
    staat.x = x;
    staat.y = y;
    staat.richting = richting;
    this.scene.restart({ binnen: true, ...extra });
  }

  /** Start een gevecht. Geeft 'gewonnen' of 'verloren' terug. */
  async gevecht(vijandId) {
    this.bewaarPositie();
    audio.stopMuziek(0.1);
    audio.speelMuziek('gevecht');
    await this.ui.gevechtsOvergang();
    const resultaat = await new Promise((klaar) => {
      this.scene.launch('Gevecht', { vijand: vijandId, klaar });
      this.scene.pause();
    });
    this.scene.resume();
    this.scene.stop('Gevecht');
    if (resultaat === 'verloren') {
      await this.verloren();
      return resultaat;
    }
    audio.speelMuziek(this.kaart.muziek);
    await this.ui.vanZwart(350);
    return resultaat;
  }

  /** Verloren: terug naar de barak, weer helemaal opgeknapt. */
  async verloren() {
    staat.gezondheid = staat.maxGezondheid;
    Object.keys(staat.pp || {}).forEach((k) => { staat.pp[k] = staat.ppMax[k]; });
    staat.vlaggen.netVerloren = true;
    staat.kaart = 'barak';
    staat.x = 2;
    staat.y = 4;
    staat.richting = 'omlaag';
    this.overgang = true;
    this.scene.restart({ binnen: true, naVerlies: true, stil: true });
  }

  // ------------------------------------------------------------ elke frame

  update(tijd, delta) {
    staat.speeltijdMs += delta;
    this.updatePersonen(delta);
    this.tekenKettingen();
    if (this.overgang) return;
    const s = this.speler;

    if (s.beweegt) {
      s.voortgang += delta / s.duur;
      if (s.voortgang >= 1) {
        const r = RICHTINGEN[s.richting];
        s.x += r.dx;
        s.y += r.dy;
        s.beweegt = false;
        s.voortgang = 0;
        s.liep = true;
        this.bewaarPositie();
        this.plaatsSpeler();
        if (this.naStap()) return;
      } else {
        this.plaatsSpeler();
        return;
      }
    }

    if (s.botsAnimatie > 0) {
      s.botsAnimatie -= delta;
      if (s.botsAnimatie <= 0) s.voet = 1 - s.voet;
    }

    if (this.ui.bezig || this.bezigMetMenu) {
      s.liep = false;
      this.plaatsSpeler();
      return;
    }

    if (invoer.net('start')) {
      this.openMenu();
      return;
    }
    if (invoer.net('a')) {
      this.praat();
      return;
    }

    const richting = invoer.richting();
    if (!richting) {
      s.liep = false;
      s.draaiTimer = 0;
      this.plaatsSpeler();
      return;
    }

    if (richting !== s.richting && !s.liep) {
      s.richting = richting;
      s.draaiTimer = DRAAI_MS;
      this.plaatsSpeler();
      return;
    }
    s.richting = richting;
    if (s.draaiTimer > 0) {
      s.draaiTimer -= delta;
      if (s.draaiTimer > 0) {
        this.plaatsSpeler();
        return;
      }
    }

    const r = RICHTINGEN[richting];
    const tx = s.x + r.dx;
    const ty = s.y + r.dy;
    const warp = (this.kaart.warps || []).find((w) => w.x === tx && w.y === ty && (!w.vlag || staat.vlaggen[w.vlag]));
    if (warp) {
      this.plaatsSpeler();
      if (warp.script) {
        const script = this.scripts[warp.script];
        if (script) this.ui.script(() => script(this.context(), { warp }));
      } else {
        this.gaNaar(warp.naar, warp.nx, warp.ny, warp.richting || richting);
      }
      return;
    }
    if (this.kanLopen(tx, ty)) {
      s.beweegt = true;
      s.voortgang = 0;
      s.voet = 1 - s.voet;
      s.duur = instellingen.altijdRennen || invoer.ingedrukt('b') ? REN_MS : LOOP_MS;
      this.plaatsSpeler();
    } else {
      s.liep = false;
      if (tijd - this.botsTijd > 420) {
        this.botsTijd = tijd;
        audio.sfx('botsen');
        s.botsAnimatie = 200;
      }
      this.plaatsSpeler();
    }
  }

  /** Na elke stap: ziet een wachter je? Geeft true als er een script start. */
  naStap() {
    const s = this.speler;
    for (const p of Object.values(this.personen)) {
      if (!p.zicht || p.gescript || p.beweegt) continue;
      if (p.zichtVlag && staat.vlaggen[p.zichtVlag]) continue;
      const r = RICHTINGEN[p.richting];
      for (let k = 1; k <= p.zicht; k++) {
        const x = p.x + r.dx * k;
        const y = p.y + r.dy * k;
        if (x === s.x && y === s.y) {
          this.gezien(p, k);
          return true;
        }
        if (!this.kanLopen(x, y)) break;
      }
    }
    return false;
  }

  async gezien(p, afstand) {
    const script = this.scripts[p.script];
    await this.ui.script(async () => {
      await this.uitroep(p);
      if (afstand > 1) await this.loopPersoon(p, p.richting, afstand - 1);
      p.gescript = false;
      this.kijkNaarElkaar(p);
      if (script) await script(this.context(), { persoon: p, gezien: true });
    });
  }

  updatePersonen(delta) {
    const bevroren = this.ui.bezig || this.bezigMetMenu || this.overgang;
    for (const p of Object.values(this.personen)) {
      if (p.beweegt) {
        p.voortgang += delta / p.duur;
        if (p.voortgang >= 1) {
          if (this.personenOpPlek.get(sleutel(p.x, p.y)) === p) this.personenOpPlek.delete(sleutel(p.x, p.y));
          p.x = p.naarX;
          p.y = p.naarY;
          p.beweegt = false;
          p.voortgang = 0;
          this.personenOpPlek.set(sleutel(p.x, p.y), p);
        }
        this.plaatsPersoon(p);
        continue;
      }
      if (bevroren || p.gescript) continue;
      if (p.gedrag === 'zwerven') this.zwerf(p, delta);
      else if (p.gedrag === 'draaien') this.draai(p, delta);
    }
    if (!bevroren) this.stoeten.forEach((st) => this.updateStoet(st, delta));
  }

  zwerf(p, delta) {
    p.timer -= delta;
    if (p.timer > 0) return;
    p.timer = 900 + Math.random() * 2600;
    const richtingen = ['omhoog', 'omlaag', 'links', 'rechts'];
    const richting = richtingen[Math.floor(Math.random() * 4)];
    const r = RICHTINGEN[richting];
    const straal = p.straal ?? 2;
    const nx = p.x + r.dx;
    const ny = p.y + r.dy;
    if (Math.random() < 0.35 || Math.abs(nx - p.thuis.x) > straal || Math.abs(ny - p.thuis.y) > straal) {
      p.kijk(richting);
      return;
    }
    this.stapPersoon(p, richting);
  }

  draai(p, delta) {
    p.timer -= delta;
    if (p.timer > 0) return;
    p.timer = 1500 + Math.random() * 3000;
    const opties = p.richtingen || ['omlaag', 'links', 'rechts'];
    p.kijk(opties[Math.floor(Math.random() * opties.length)]);
  }

  updateStoet(st, delta) {
    if (st.leden.some((l) => l.beweegt || l.gescript)) return;
    st.timer -= delta;
    if (st.timer > 0) return;
    const pad = st.pad;
    const volgende = pad[(st.index + 1) % pad.length];
    const leider = st.leden[0];
    const staart = st.leden[st.leden.length - 1];
    const bezet = this.personenOpPlek.get(sleutel(volgende.x, volgende.y));
    if (this.spelerOp(volgende.x, volgende.y) || (bezet && bezet !== staart) || this.vast.has(sleutel(volgende.x, volgende.y))) {
      leider.kijk(richtingNaar(leider, volgende));
      st.timer = 400;
      return;
    }
    const oudePlekken = st.leden.map((l) => ({ x: l.x, y: l.y }));
    st.leden.forEach((l, i) => {
      const doel = i === 0 ? volgende : oudePlekken[i - 1];
      this.stapPersoon(l, richtingNaar(l, doel), { negeerBezet: true });
    });
    st.index = (st.index + 1) % pad.length;
    st.timer = st.pauze ?? 260;
  }

  tekenKettingen() {
    const g = this.kettingen;
    g.clear();
    this.stoeten.forEach((st) => {
      for (let i = 0; i < st.leden.length - 1; i++) {
        const a = st.leden[i].sprite;
        const b = st.leden[i + 1].sprite;
        const ax = a.x;
        const ay = a.y - 7;
        const bx = b.x;
        const by = b.y - 7;
        const lengte = Math.max(1, Math.hypot(bx - ax, by - ay));
        const stappen = Math.floor(lengte / 2);
        for (let k = 0; k <= stappen; k++) {
          const t = k / stappen;
          const x = Math.round(ax + (bx - ax) * t);
          const y = Math.round(ay + (by - ay) * t + Math.sin(t * Math.PI) * 2);
          g.fillStyle(k % 2 ? 0x9aa0ae : 0x5c6070, 1).fillRect(x, y, 1, 1);
        }
      }
    });
    // ketting tussen de mensen in, maar boven de grond
    const dieptes = this.stoeten.flatMap((st) => st.leden.map((l) => l.sprite.depth));
    g.setDepth(dieptes.length ? Math.min(...dieptes) - 0.1 : 0);
  }

  async openMenu() {
    this.bezigMetMenu = true;
    this.bewaarPositie();
    try {
      await this.ui.pauzemenu(this);
    } finally {
      this.bezigMetMenu = false;
    }
  }

  async praat() {
    const s = this.speler;
    const r = RICHTINGEN[s.richting];
    const tx = s.x + r.dx;
    const ty = s.y + r.dy;
    const persoon = this.personenOpPlek.get(sleutel(tx, ty));
    let scriptNaam = null;
    if (persoon) {
      if (persoon.beweegt) return;
      persoon.kijk(TEGENOVER[s.richting]);
      scriptNaam = persoon.script;
    } else {
      scriptNaam = this.interacties.get(sleutel(tx, ty));
    }
    if (!scriptNaam) return;
    const script = this.scripts[scriptNaam];
    if (!script) return;
    audio.sfx('kies');
    await this.ui.script(() => script(this.context(), { x: tx, y: ty, persoon }));
  }
}
