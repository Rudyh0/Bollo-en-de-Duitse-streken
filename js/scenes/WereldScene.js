// De speelwereld: tegelkaart, objecten, personen en lopen over een raster (zoals in de klassieke RPG's).
import { SCHAAL, TEGEL, RICHTINGEN, TEGENOVER } from '../core/constanten.js';
import { invoer } from '../core/invoer.js';
import { audio } from '../core/audio.js';
import { instellingen } from '../core/instellingen.js';
import { staat } from '../core/staat.js';
import { KAARTEN, SCRIPTS } from '../maps/index.js';

const LOOP_MS = 240;
const REN_MS = 120;
const DRAAI_MS = 90;

const OBJECT_TYPES = {
  stapelbed: {
    textuur: (o) => (o.variant === 'rood' ? 'obj_stapelbed_rood' : 'obj_stapelbed'),
    voet: [[0, 0], [0, 1]],
    positie: (o) => [o.x * TEGEL, (o.y + 2) * TEGEL],
    oorsprong: [0, 1],
    diepte: (o) => (o.y + 2) * TEGEL,
  },
  kist: {
    textuur: (o) => (staat.vlaggen[o.vlag] ? 'obj_kist_open' : 'obj_kist'),
    voet: [],
    positie: (o) => [o.x * TEGEL + 1, o.y * TEGEL + 26],
    oorsprong: [0, 0],
    diepte: (o) => (o.y + 2) * TEGEL + 1,
  },
  tafel: {
    textuur: () => 'obj_tafel',
    voet: [[0, 0], [1, 0], [2, 0], [3, 0]],
    positie: (o) => [o.x * TEGEL, o.y * TEGEL - 2],
    oorsprong: [0, 0],
    diepte: (o) => (o.y + 1) * TEGEL,
  },
  kruk: {
    textuur: () => 'obj_kruk',
    voet: [[0, 0]],
    positie: (o) => [o.x * TEGEL + 1, o.y * TEGEL + 2],
    oorsprong: [0, 0],
    diepte: (o) => (o.y + 1) * TEGEL,
  },
  kachel: {
    textuur: () => 'obj_kachel',
    voet: [[0, 0]],
    positie: (o) => [o.x * TEGEL, (o.y + 1) * TEGEL + 2],
    oorsprong: [0, 1],
    diepte: (o) => (o.y + 1) * TEGEL,
  },
  emmer: {
    textuur: () => 'obj_emmer',
    voet: [[0, 0]],
    positie: (o) => [o.x * TEGEL + 1, o.y * TEGEL + 1],
    oorsprong: [0, 0],
    diepte: (o) => (o.y + 1) * TEGEL,
  },
};

const sleutel = (x, y) => `${x},${y}`;

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
    this.bouwKaart();
    this.bouwObjecten();
    this.bouwPersonen();

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
    cam.setBounds(0, 0, this.breedte * TEGEL, this.hoogte * TEGEL);
    cam.startFollow(this.speler.sprite, true, 1, 1, 0, 8);
    cam.setBackgroundColor('#000000');

    audio.speelMuziek(this.kaart.muziek);
    this.events.once('shutdown', () => invoer.reset());
    this.binnenkomst();
  }

  async binnenkomst() {
    const script = this.scripts.binnenkomst;
    await this.ui.script(async () => {
      if (this.start.nieuw && script) {
        await script(this.context(), { nieuw: true });
      } else {
        await this.ui.vanZwart(400);
        this.ui.toonLocatie(this.kaartNaam);
        if (script) await script(this.context(), { nieuw: false });
      }
    });
  }

  // ------------------------------------------------------------ opbouw

  bouwKaart() {
    const { rijen, legenda, vast, tegelset } = this.kaart;
    this.hoogte = rijen.length;
    this.breedte = rijen[0].length;
    const data = rijen.map((rij) => [...rij].map((t) => legenda[t] ?? 0));
    this.tegels = data;
    const map = this.make.tilemap({ data, tileWidth: TEGEL, tileHeight: TEGEL });
    const set = map.addTilesetImage(tegelset, tegelset, TEGEL, TEGEL, 0, 0);
    this.laag = map.createLayer(0, set, 0, 0).setDepth(-10);
    this.vast = new Set();
    data.forEach((rij, y) => rij.forEach((t, x) => { if (vast.includes(t)) this.vast.add(sleutel(x, y)); }));
    this.interacties = new Map();
    (this.kaart.interacties || []).forEach((i) => this.interacties.set(sleutel(i.x, i.y), i.script));
  }

  bouwObjecten() {
    this.objecten = {};
    (this.kaart.objecten || []).forEach((o) => {
      const type = OBJECT_TYPES[o.type];
      if (!type) return;
      const [px, py] = type.positie(o);
      const sprite = this.add.image(px, py, type.textuur(o)).setOrigin(...type.oorsprong).setDepth(type.diepte(o));
      if (o.id) this.objecten[o.id] = { sprite, data: o, type };
      type.voet.forEach(([dx, dy]) => {
        this.vast.add(sleutel(o.x + dx, o.y + dy));
        if (o.script) this.interacties.set(sleutel(o.x + dx, o.y + dy), o.script);
      });
    });
  }

  bouwPersonen() {
    this.personen = {};
    this.personenOpPlek = new Map();
    (this.kaart.npcs || []).forEach((n) => {
      const sprite = this.add.sprite(n.x * TEGEL + 8, (n.y + 1) * TEGEL, n.sprite, RICHTINGEN[n.richting].frame)
        .setOrigin(0.5, 1)
        .setDepth((n.y + 1) * TEGEL + 0.5);
      const persoon = {
        ...n,
        sprite,
        kijk: (richting) => sprite.setFrame(RICHTINGEN[richting].frame),
      };
      this.personen[n.id] = persoon;
      this.personenOpPlek.set(sleutel(n.x, n.y), persoon);
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

  kanLopen(x, y) {
    if (x < 0 || y < 0 || x >= this.breedte || y >= this.hoogte) return false;
    if (this.vast.has(sleutel(x, y))) return false;
    if (this.personenOpPlek.has(sleutel(x, y))) return false;
    return true;
  }

  // ------------------------------------------------------------ elke frame

  update(tijd, delta) {
    staat.speeltijdMs += delta;
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
    if (this.kanLopen(s.x + r.dx, s.y + r.dy)) {
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
