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
import { praatMetVolger, ONDERDUIKERS } from '../maps/volgers.js';
import { VIJANDEN } from '../gevecht/data.js';

const LOOP_MS = 240;
const REN_MS = 120;
// met een snel-effect (ritalin, 3MMC)
const SNEL_LOOP_MS = 120;
const SNEL_REN_MS = 72;
// stoned (wiet, hasj): alles gaat wat trager
const TRAAG_LOOP_MS = 330;
const TRAAG_REN_MS = 180;
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
  // bos
  schatkist: { textuur: (o) => (staat.vlaggen[o.vlag] ? 'obj_schatkist_open' : 'obj_schatkist'), b: 1, h: 1 },
  bron: { textuur: () => 'obj_bron', b: 2, h: 1, dy: 3, diepte: () => -5 },
  boomstronk: { textuur: () => 'obj_boomstronk', b: 1, h: 1 },
  // Orvelte
  molen: {
    textuur: () => 'obj_molen', b: 3, h: 2,
    extra: (scene, o, sprite) => {
      const wieken = scene.add.image(sprite.x + 24, sprite.y - 61, 'anim_wieken', 0).setDepth(sprite.depth + 0.2);
      let f = 0;
      scene.time.addEvent({ delay: 170, loop: true, callback: () => { f = (f + 1) % 4; wieken.setFrame(f); } });
      return [wieken];
    },
  },
  hunebed: { textuur: () => 'obj_hunebed', b: 4, h: 1 },
  plaggenhut: { textuur: () => 'obj_plaggenhut', b: 3, h: 2 },
  coffeeshop: { textuur: () => 'obj_coffeeshop', b: 5, h: 3 },
  boerderij: { textuur: () => 'obj_boerderij', b: 6, h: 3 },
  vlag: { textuur: () => 'anim_vlag', b: 1, h: 1, dx: 4, animatie: { frames: 2, ms: 380 } },
  slagboom: {
    textuur: (o) => (staat.vlaggen[o.openVlag] ? 'obj_slagboom_open' : 'obj_slagboom'), b: 1, h: 1, dx: 3,
    extraVast: (o) => (staat.vlaggen[o.openVlag] ? [] : [[1, 0], [2, 0]]),
  },
  fatbike: { textuur: () => 'obj_fatbike', b: 2, h: 1, dy: -1 },
  eik: { textuur: () => 'obj_eik', b: 2, h: 1, dx: -8 },
  meelzakken: { textuur: () => 'obj_meelzakken', b: 1, h: 1 },
  bedstee: { textuur: () => 'obj_bedstee', b: 2, h: 1 },
  haard: { textuur: () => 'obj_haard', b: 2, h: 1 },
  tafeltje: { textuur: () => 'obj_tafeltje', b: 2, h: 1 },
  luik: { textuur: (o) => (staat.vlaggen[o.vlag] ? 'obj_luik_open' : 'obj_luik'), b: 1, h: 1, diepte: () => -5 },
  spinnewiel: { textuur: () => 'obj_spinnewiel', b: 1, h: 1, dx: -4 },
  toonbank: { textuur: () => 'obj_toonbank', b: 4, h: 1 },
  bank: { textuur: () => 'obj_bank', b: 3, h: 1 },
  plant: { textuur: () => 'obj_plant', b: 1, h: 1 },
  boxen: { textuur: () => 'obj_boxen', b: 1, h: 1 },
  asbak: { textuur: () => 'obj_asbak', b: 1, h: 1 },
  // de N34
  bord_hunebedhighway: { textuur: () => 'obj_bord_hunebedhighway', b: 3, h: 1 },
  bord_n34: { textuur: () => 'obj_bord_n34', b: 1, h: 1, dx: -4 },
  bord_afslag: { textuur: () => 'obj_bord_afslag', b: 4, h: 1 },
  krat: { textuur: (o) => (staat.vlaggen[o.vlag] ? 'obj_krat_open' : 'obj_krat'), b: 1, h: 1 },
  dranghek: { textuur: () => 'obj_dranghek', b: 2, h: 1 },
  pion: { textuur: () => 'obj_pion', b: 1, h: 1 },
  tankstation: { textuur: () => 'obj_tankstation', b: 9, h: 2 },
  schap: { textuur: () => 'obj_schap', b: 2, h: 1 },
  koelkast: { textuur: () => 'obj_koelkast', b: 1, h: 1 },
  koffieautomaat: { textuur: () => 'obj_koffieautomaat', b: 1, h: 1 },
  kassabalie: { textuur: () => 'obj_kassabalie', b: 3, h: 1 },
  // Wezup
  huis: { textuur: (o) => `obj_huis_${o.kleur || 'rood'}`, b: 3, h: 2 },
  winkel: { textuur: (o) => `obj_winkel_${o.soort}`, b: 4, h: 2 },
  viskraam: { textuur: () => 'obj_viskraam', b: 3, h: 1 },
  vissersboot: { textuur: () => 'obj_vissersboot', b: 3, h: 1, dx: -4, dy: 4 },
  roeiboot: { textuur: () => 'obj_roeiboot', b: 2, h: 1, dy: 1 },
  netten: { textuur: () => 'obj_netten', b: 2, h: 1, dx: -4 },
  tonnen: { textuur: () => 'obj_tonnen', b: 1, h: 1 },
  poster_gezocht: { textuur: () => 'obj_poster_gezocht', b: 1, h: 1, dx: -2 },
  boekenkast: { textuur: (o) => (staat.vlaggen[o.vlag] ? 'obj_boekenkast_open' : 'obj_boekenkast'), b: 2, h: 1 },
  toonbank_oud: { textuur: () => 'obj_toonbank_oud', b: 3, h: 1 },
  kast_kruidenier: { textuur: () => 'obj_kast_kruidenier', b: 2, h: 1 },
  broodvitrine: { textuur: () => 'obj_broodvitrine', b: 3, h: 1 },
  oven: { textuur: () => 'obj_oven', b: 2, h: 1 },
  vleesvitrine: { textuur: () => 'obj_vleesvitrine', b: 3, h: 1 },
  worsten: { textuur: () => 'obj_worsten', b: 2, h: 1 },
  bedje: { textuur: () => 'obj_bedje', b: 2, h: 1 },
  bureautje: { textuur: () => 'obj_bureautje', b: 2, h: 1 },
  smokkelwaar: { textuur: () => 'obj_smokkelwaar', b: 1, h: 1 },
  // het natuurgebied
  hooibaal: { textuur: () => 'obj_hooibaal', b: 2, h: 1, dx: 4 },
  melkbussen: { textuur: () => 'obj_melkbussen', b: 1, h: 1 },
  parasol: { textuur: (o) => (o.kleur === 'blauw' ? 'obj_parasol_blauw' : 'obj_parasol'), b: 1, h: 1, dx: -8 },
  bbq: { textuur: () => 'obj_bbq', b: 1, h: 1 },
  koelbox: { textuur: () => 'obj_koelbox', b: 1, h: 1 },
  flamingo: { textuur: () => 'obj_flamingo', b: 1, h: 1, dx: -4, dy: 2 },
  visbord: { textuur: () => 'obj_visbord', b: 1, h: 1 },
  strandstoel: { textuur: (o) => (o.kleur === 'groen' ? 'obj_strandstoel_groen' : 'obj_strandstoel'), b: 1, h: 1 },
  handdoek: { textuur: (o) => (o.kleur === 'blauw' ? 'obj_handdoek_blauw' : 'obj_handdoek'), b: 1, h: 1, dy: 4, diepte: () => -5 },
  reddingstoren: { textuur: () => 'obj_reddingstoren', b: 2, h: 1 },
  ijscokar: { textuur: () => 'obj_ijscokar', b: 2, h: 1 },
  zandkuil: { textuur: () => 'obj_zandkuil', b: 1, h: 1, diepte: () => -5 },
  zandkasteel: { textuur: () => 'obj_zandkasteel', b: 1, h: 1, dx: -4 },
  schep: { textuur: () => 'obj_schep', b: 1, h: 1 },
  bord_natuur: { textuur: () => 'obj_bord_natuur', b: 3, h: 1 },
  // Aalden
  huisje: { textuur: (o) => `obj_huisje_${o.kleur || 'rood'}`, b: 3, h: 2 },
  tabakszaak: { textuur: () => 'obj_tabakszaak', b: 4, h: 2 },
  bejaardenhuis: { textuur: () => 'obj_bejaardenhuis', b: 6, h: 2 },
  scootmobiel: { textuur: () => 'obj_scootmobiel', b: 1, h: 1, dx: -4 },
  bord_vakantiepark: { textuur: () => 'obj_bord_vakantiepark', b: 3, h: 1, dx: -3 },
  tabaksbalie: { textuur: () => 'obj_tabaksbalie', b: 3, h: 1 },
  tabaksschap: { textuur: () => 'obj_tabaksschap', b: 2, h: 1 },
  krantenrek: { textuur: () => 'obj_krantenrek', b: 1, h: 1 },
  tv_kast: { textuur: () => 'obj_tv_kast', b: 2, h: 1 },
  fauteuil: { textuur: (o) => (o.kleur === 'groen' ? 'obj_fauteuil_groen' : 'obj_fauteuil'), b: 1, h: 1 },
  bingotafel: { textuur: () => 'obj_bingotafel', b: 2, h: 1 },
  staande_klok: { textuur: () => 'obj_staande_klok', b: 1, h: 1 },
  rollator: { textuur: () => 'obj_rollator', b: 1, h: 1 },
  // De Beren-restaurant (in elk dorp)
  restaurant_beren: { textuur: () => 'obj_restaurant_beren', b: 5, h: 2 },
  beren_balie: { textuur: () => 'obj_beren_balie', b: 4, h: 1 },
  beren_tafel: { textuur: (o) => (o.kleur === 'groen' ? 'obj_beren_tafel_groen' : 'obj_beren_tafel'), b: 2, h: 1, dx: -4 },
  houten_beer: { textuur: () => 'obj_houten_beer', b: 1, h: 1, dx: -3 },
  beren_plant: { textuur: () => 'obj_beren_plant', b: 1, h: 1 },
};

// Meldingen als een middel is uitgewerkt.
const EFFECT_EINDE = {
  snel: 'Je benen zijn weer normaal.',
  trip: 'De kleuren zijn weer gewoon. Jammer.',
  stoned: 'Weer helder. Wel trek in een frikandel.',
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
    this.trip = null;
    this.stoned = null;
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
    // Het begin van deze scène onthouden: wie een gevecht verliest, begint hier opnieuw.
    if (this.start.nieuw || (this.start.binnen && !this.start.naVerlies) || !staat.respawn) {
      staat.respawn = { kaart: this.kaart.id, x: staat.x, y: staat.y, richting: staat.richting };
    }
    this.maakSpeler();
    this.bouwVolgers();

    const cam = this.cameras.main;
    cam.setZoom(SCHAAL);
    cam.setRoundPixels(true);
    const mapB = this.breedte * TEGEL;
    const mapH = this.hoogte * TEGEL;
    // Kleinere kaarten in het midden van het scherm.
    cam.setBounds(Math.min(0, (mapB - BREEDTE) / 2), Math.min(0, (mapH - HOOGTE) / 2), Math.max(mapB, BREEDTE), Math.max(mapH, HOOGTE));
    cam.startFollow(this.speler.sprite, true, 1, 1, 0, this.kaart.camVolgY ?? 8);
    cam.setBackgroundColor('#000000');

    audio.speelMuziek(this.kaart.muziek);
    this.events.once('shutdown', () => {
      invoer.reset();
      this.stopTrip();
      this.stopStoned();
    });
    this.startVerkeer();
    if (this.scripts.opbouw) this.scripts.opbouw(this.context());
    this.binnenkomst();
  }

  async binnenkomst() {
    const script = this.scripts.binnenkomst;
    await this.ui.script(async () => {
      if (this.start.naVerlies) {
        await this.ui.vanZwart(600);
        await this.ui.zeg([
          '{BEER} komt langzaam weer bij...',
          'Je bent terug bij het begin van deze plek. Gelukkig voel je je weer helemaal fit.',
        ]);
        return;
      }
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
    // Voorlaag: tegels die vóór alles liggen (zoals de vangrail aan de overkant van de weg).
    if (this.kaart.voor) {
      const voor = this.kaart.voor.map(lees);
      const map3 = this.make.tilemap({ data: voor, tileWidth: TEGEL, tileHeight: TEGEL });
      const set3 = map3.addTilesetImage(tegelset, tegelset, TEGEL, TEGEL, 0, 0);
      map3.createLayer(0, set3, 0, 0).setDepth(5000);
      markeer(voor);
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
    (this.kaart.objecten || []).forEach((o) => {
      if (o.verbergVlag && staat.vlaggen[o.verbergVlag]) return;
      if (o.toonVlag && !staat.vlaggen[o.toonVlag]) return;
      this.maakObject(o);
    });
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
    const sprite = this.add.image(px, py, type.textuur(o), 0).setOrigin(...oorsprong).setDepth(diepte);
    if (type.animatie) {
      let f = 0;
      this.time.addEvent({
        delay: type.animatie.ms, loop: true,
        callback: () => { f = (f + 1) % type.animatie.frames; sprite.setFrame(f); },
      });
    }
    const extra = type.extra ? type.extra(this, o, sprite) : [];
    // extra tegels die (soms) dicht zitten, zoals een slagboom over de weg
    const extraVast = type.extraVast ? type.extraVast(o) : [];
    extraVast.forEach(([dx, dy]) => this.vast.add(sleutel(o.x + dx, o.y + dy)));
    if (o.id) this.objecten[o.id] = { sprite, data: o, type, extra, extraVast };
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
    if (!o) return;
    o.sprite.setTexture(o.type.textuur(o.data));
    if (o.type.extraVast) {
      o.extraVast.forEach(([dx, dy]) => this.vast.delete(sleutel(o.data.x + dx, o.data.y + dy)));
      o.extraVast = o.type.extraVast(o.data);
      o.extraVast.forEach(([dx, dy]) => this.vast.add(sleutel(o.data.x + dx, o.data.y + dy)));
    }
  }

  verwijderObject(id) {
    const o = this.objecten[id];
    if (!o) return;
    o.sprite.destroy();
    (o.extra || []).forEach((e) => e.destroy());
    const t = o.type;
    for (let dy = 0; dy < t.h; dy++) {
      for (let dx = 0; dx < t.b; dx++) this.vast.delete(sleutel(o.data.x + dx, o.data.y + dy));
    }
    delete this.objecten[id];
  }

  /** Een vrije tegel naast (x, y), bij voorkeur achter de speler. */
  vrijePlekBij(x, y) {
    const s = this.speler;
    const volgorde = [TEGENOVER[s.richting], 'links', 'rechts', 'omlaag', 'omhoog'];
    for (const r of volgorde) {
      const nx = x + RICHTINGEN[r].dx;
      const ny = y + RICHTINGEN[r].dy;
      if (this.kanLopen(nx, ny) && !this.isWarp(nx, ny) && !this.volgerOp(nx, ny) && !(nx === s.x && ny === s.y)) {
        return { x: nx, y: ny };
      }
    }
    return { x, y };
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
    if (this.volgerOp(x, y)) return false;
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
    audio.speelMuziek(VIJANDEN[vijandId]?.muziek || 'gevecht');
    await this.ui.gevechtsOvergang();
    const resultaat = await new Promise((klaar) => {
      this.scene.launch('Gevecht', { vijand: vijandId, klaar, achtergrond: this.kaart.gevechtAchtergrond });
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

  /** Verloren: opnieuw beginnen aan het begin van de scène, weer helemaal opgeknapt. */
  async verloren() {
    staat.gezondheid = staat.maxGezondheid;
    Object.keys(staat.pp || {}).forEach((k) => { staat.pp[k] = staat.ppMax[k]; });
    const r = staat.respawn || { kaart: this.kaart.id, ...this.kaart.start };
    staat.kaart = r.kaart;
    staat.x = r.x;
    staat.y = r.y;
    staat.richting = r.richting;
    this.overgang = true;
    this.scene.restart({ binnen: true, naVerlies: true, stil: true });
  }

  // ------------------------------------------------------------ elke frame

  update(tijd, delta) {
    staat.speeltijdMs += delta;
    this.updatePersonen(delta);
    this.updateVolgers();
    this.updateVerkeer(delta);
    this.tekenKettingen();
    if (this.overgang) return;
    this.updateEffecten(delta);
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
      const rent = instellingen.altijdRennen || invoer.ingedrukt('b');
      const snel = this.heeftEffect('snel');
      const traag = this.heeftEffect('stoned');
      if (snel && !traag) {
        s.duur = rent ? SNEL_REN_MS : SNEL_LOOP_MS;
        this.stofwolkje();
      } else if (traag && !snel) {
        s.duur = rent ? TRAAG_REN_MS : TRAAG_LOOP_MS;
      } else {
        s.duur = rent ? REN_MS : LOOP_MS;
      }
      this.volgersStap(s.x, s.y);
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
    // kaartscripts die na een stap iets willen laten gebeuren (bijv. een berichtje op je telefoon)
    if (this.scripts.naStap && this.scripts.naStap(this.context())) return true;
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

  // ------------------------------------------------------------ middelen (ritalin, XTC, 3MMC)

  heeftEffect(soort) {
    return ((staat.effecten || {})[soort] || 0) > 0;
  }

  updateEffecten(delta) {
    const e = staat.effecten || (staat.effecten = {});
    const voorbij = [];
    Object.keys(e).forEach((soort) => {
      e[soort] -= delta;
      if (e[soort] <= 0) {
        delete e[soort];
        if (EFFECT_EINDE[soort]) voorbij.push(soort);
      }
    });
    if (voorbij.length > 1) this.ui.toonLocatie('Je bent weer nuchter. Jammer.');
    else if (voorbij.length) this.ui.toonLocatie(EFFECT_EINDE[voorbij[0]]);
    if (this.heeftEffect('trip') && !this.trip) this.startTrip();
    else if (!this.heeftEffect('trip') && this.trip) this.stopTrip();
    if (this.trip) this.updateTrip(delta);
    if (this.heeftEffect('stoned') && !this.stoned) this.startStoned();
    else if (!this.heeftEffect('stoned') && this.stoned) this.stopStoned();
    if (this.stoned) this.updateStoned(delta);
  }

  startStoned() {
    const cam = this.cameras.main;
    this.stoned = { tijd: 0, wolk: 400 };
    if (cam.postFX) {
      try {
        this.stoned.rand = cam.postFX.addVignette(0.5, 0.5, 0.9, 0.45);
        this.stoned.kleur = cam.postFX.addColorMatrix();
      } catch (e) {
        this.stoned.rand = null;
        this.stoned.kleur = null;
      }
    }
  }

  stopStoned() {
    if (!this.stoned) return;
    const cam = this.cameras.main;
    if (cam && cam.postFX) {
      if (this.stoned.rand) cam.postFX.remove(this.stoned.rand);
      if (this.stoned.kleur) cam.postFX.remove(this.stoned.kleur);
    }
    this.stoned = null;
  }

  updateStoned(delta) {
    const st = this.stoned;
    st.tijd += delta;
    if (st.rand) st.rand.radius = 0.82 + Math.sin(st.tijd / 900) * 0.06;
    if (st.kleur) {
      st.kleur.saturate(0.35);
      st.kleur.brightness(1.05, true);
    }
    // rookwolkjes boven het hoofd van de beer
    st.wolk -= delta;
    if (st.wolk <= 0) {
      st.wolk = 900;
      const s = this.speler.sprite;
      const w = this.add.circle(s.x + 3, s.y - 20, 2, 0xe8e8e8, 0.7).setDepth(9000);
      this.tweens.add({
        targets: w, y: w.y - 14, x: w.x + Phaser.Math.Between(-4, 6), scale: 3, alpha: 0, duration: 1600,
        onComplete: () => w.destroy(),
      });
    }
  }

  /** Stofwolkjes achter de beer als hij supersnel loopt. */
  stofwolkje() {
    const s = this.speler;
    const r = RICHTINGEN[s.richting];
    for (let i = 0; i < 2; i++) {
      const w = this.add.circle(
        s.sprite.x - r.dx * 6 + Phaser.Math.Between(-3, 3),
        s.sprite.y - 2 - r.dy * 4,
        2, 0xe8e0c8, 0.8,
      ).setDepth(s.sprite.depth - 0.3);
      this.tweens.add({
        targets: w, alpha: 0, scale: 2, x: w.x - r.dx * 6, y: w.y - 3 - r.dy * 4,
        duration: 320 + i * 80, onComplete: () => w.destroy(),
      });
    }
  }

  startTrip() {
    const cam = this.cameras.main;
    this.trip = { tijd: 0, vonk: 0, spoor: 0 };
    if (cam.postFX) {
      try {
        this.trip.kleur = cam.postFX.addColorMatrix();
        this.trip.bol = cam.postFX.addBarrel(1);
      } catch (e) {
        this.trip.kleur = null;
        this.trip.bol = null;
      }
    }
  }

  stopTrip() {
    if (!this.trip) return;
    const cam = this.cameras.main;
    if (cam && cam.postFX) {
      if (this.trip.kleur) cam.postFX.remove(this.trip.kleur);
      if (this.trip.bol) cam.postFX.remove(this.trip.bol);
    }
    this.trip = null;
  }

  updateTrip(delta) {
    const t = this.trip;
    t.tijd += delta;
    if (t.kleur) {
      t.kleur.hue((t.tijd * 0.06) % 360);
      t.kleur.saturate(0.5, true);
    }
    if (t.bol) t.bol.amount = 1 + Math.sin(t.tijd / 450) * 0.06;
    // glinsteringen in de lucht
    t.vonk -= delta;
    if (t.vonk <= 0) {
      t.vonk = 110;
      const v = this.cameras.main.worldView;
      const kleur = Phaser.Display.Color.HSVToRGB(Math.random(), 0.6, 1).color;
      const ster = this.add.star(v.x + Math.random() * v.width, v.y + Math.random() * v.height, 4, 1, 3, kleur)
        .setDepth(9000).setAlpha(0);
      this.tweens.add({ targets: ster, alpha: 1, duration: 250, yoyo: true, hold: 200, onComplete: () => ster.destroy() });
      this.tweens.add({ targets: ster, angle: 90, y: ster.y - 6, duration: 700 });
    }
    // regenboogspoor achter de beer
    t.spoor -= delta;
    const s = this.speler;
    if (s.beweegt && t.spoor <= 0) {
      t.spoor = 60;
      const kleur = Phaser.Display.Color.HSVToRGB((t.tijd / 900) % 1, 0.7, 1).color;
      const geest = this.add.image(s.sprite.x, s.sprite.y, 'beer', s.sprite.frame.name)
        .setOrigin(0.5, 1).setTint(kleur).setAlpha(0.55).setDepth(s.sprite.depth - 0.2);
      this.tweens.add({ targets: geest, alpha: 0, duration: 450, onComplete: () => geest.destroy() });
    }
  }

  // ------------------------------------------------------------ volgers (geboeid achter de beer aan)

  isWarp(x, y) {
    return (this.kaart.warps || []).some((w) => w.x === x && w.y === y);
  }

  volgerOp(x, y) {
    return (this.volgers || []).find((v) => v.x === x && v.y === y && v.zichtbaar !== false) || null;
  }

  bouwVolgers() {
    this.volgers = [];
    this.volgKetting = this.add.graphics();
    const s = this.speler;
    const terug = RICHTINGEN[TEGENOVER[s.richting]];
    let vorige = { x: s.x, y: s.y };
    (staat.volgers || []).forEach((id) => {
      const plek = { x: vorige.x + terug.dx, y: vorige.y + terug.dy };
      const vrij = this.binnenKaart(plek.x, plek.y) && this.kanLopen(plek.x, plek.y) && !this.isWarp(plek.x, plek.y);
      const p = vrij ? plek : { ...vorige };
      this.volgers.push(this.maakVolger(id, p.x, p.y, s.richting));
      vorige = p;
    });
  }

  maakVolger(id, x, y, richting) {
    const sprite = this.add.sprite(x * TEGEL + 8, (y + 1) * TEGEL, `mens_${id}`, 0).setOrigin(0.5, 1);
    const v = { id, sprite, x, y, vanX: x, vanY: y, richting, voet: 0, beweegt: false };
    this.plaatsVolger(v, 1);
    return v;
  }

  /** Een gevonden onderduiker sluit achteraan aan. */
  voegVolgerToe(id, x, y) {
    staat.volgers = [...(staat.volgers || []), id];
    const v = this.maakVolger(id, x, y, richtingNaar({ x, y }, this.speler));
    this.volgers.push(v);
    return v;
  }

  /** De speler zet een stap vanaf (x, y): iedere volger schuift één plek op. */
  volgersStap(x, y) {
    let doel = { x, y };
    this.volgers.forEach((v) => {
      const oud = { x: v.x, y: v.y };
      v.vanX = v.x;
      v.vanY = v.y;
      v.x = doel.x;
      v.y = doel.y;
      if (v.x !== v.vanX || v.y !== v.vanY) {
        v.richting = richtingNaar(oud, v);
        v.voet = 1 - v.voet;
        v.beweegt = true;
      }
      doel = oud;
    });
  }

  plaatsVolger(v, t) {
    const px = (v.vanX + (v.x - v.vanX) * t) * TEGEL + 8;
    const py = (v.vanY + (v.y - v.vanY) * t + 1) * TEGEL;
    v.sprite.setPosition(Math.round(px), Math.round(py));
    v.sprite.setDepth(py + 0.4);
    let frame = RICHTINGEN[v.richting].frame * 3;
    if (v.beweegt && t < 0.55) frame += 1 + v.voet;
    v.sprite.setFrame(frame);
  }

  updateVolgers() {
    if (!this.volgers || !this.volgers.length) {
      if (this.volgKetting) this.volgKetting.clear();
      return;
    }
    const s = this.speler;
    const t = s.beweegt ? Math.min(1, s.voortgang) : 1;
    this.volgers.forEach((v) => {
      this.plaatsVolger(v, t);
      if (!s.beweegt && v.beweegt) {
        v.beweegt = false;
        v.vanX = v.x;
        v.vanY = v.y;
        this.plaatsVolger(v, 1);
      }
    });
    // ketting van handboeien: beer -> eerste -> tweede -> derde
    const g = this.volgKetting;
    g.clear();
    const punten = [s.sprite, ...this.volgers.map((v) => v.sprite)];
    for (let i = 0; i < punten.length - 1; i++) {
      // sommige volgers lopen gewoon mee, zonder handboeien
      if (ONDERDUIKERS[this.volgers[i].id]?.ketting === false) continue;
      const a = punten[i];
      const b = punten[i + 1];
      const ax = a.x;
      const ay = a.y - 7;
      const bx = b.x;
      const by = b.y - 7;
      const lengte = Math.hypot(bx - ax, by - ay);
      if (lengte < 3) continue;
      const stappen = Math.floor(lengte / 2);
      for (let k = 0; k <= stappen; k++) {
        const f = k / stappen;
        const x = Math.round(ax + (bx - ax) * f);
        const y = Math.round(ay + (by - ay) * f + Math.sin(f * Math.PI) * 2);
        g.fillStyle(k % 2 ? 0x9aa0ae : 0x5c6070, 1).fillRect(x, y, 1, 1);
      }
    }
    g.setDepth(Math.min(...punten.map((p) => p.depth)) - 0.1);
  }

  /** Volgers worden gewone personen (bijvoorbeeld als ze worden overgedragen). */
  volgersLoslaten() {
    const personen = this.volgers.map((v) => {
      v.sprite.destroy();
      const p = this.nieuwPersoon({ id: v.id, sprite: `mens_${v.id}`, x: v.x, y: v.y, richting: v.richting });
      p.gescript = true;
      this.personen[v.id] = p;
      return p;
    });
    this.volgers = [];
    staat.volgers = [];
    return personen;
  }

  /** Een nieuwe persoon in de wereld zetten (bijvoorbeeld iemand die naar buiten stormt). */
  voegPersoonToe(n) {
    const p = this.nieuwPersoon(n);
    this.personen[n.id] = p;
    this.personenOpPlek.set(sleutel(p.x, p.y), p);
    return p;
  }

  // ------------------------------------------------------------ verkeer (auto's en legervoertuigen op de weg)

  startVerkeer() {
    this.voertuigen = [];
    const v = this.kaart.verkeer;
    if (!v) return;
    const mapB = this.breedte * TEGEL;
    v.banen.forEach((baan) => {
      // alvast een paar auto's op de weg
      for (let i = 0; i < 3; i++) this.nieuwVoertuig(baan, Math.random() * mapB);
      const plan = () => {
        this.time.delayedCall(Phaser.Math.Between(baan.min ?? 1100, baan.max ?? 3200), () => {
          this.nieuwVoertuig(baan);
          plan();
        });
      };
      plan();
    });
  }

  nieuwVoertuig(baan, startX, soortOverride) {
    const soorten = this.kaart.verkeer.soorten;
    let soort = soortOverride;
    if (!soort) {
      const totaal = soorten.reduce((t, s) => t + s.kans, 0);
      let r = Math.random() * totaal;
      soort = soorten.find((s) => (r -= s.kans) < 0) || soorten[0];
    }
    const img = this.add.image(0, baan.y, soort.textuur).setOrigin(0.5, 1).setFlipX(baan.richting < 0);
    const mapB = this.breedte * TEGEL;
    img.x = startX ?? (baan.richting > 0 ? -img.width : mapB + img.width);
    img.setDepth(baan.y);
    // niet bovenop een ander voertuig beginnen
    const teDichtbij = this.voertuigen.some((w) => w.baan === baan && Math.abs(w.img.x - img.x) < (w.img.width + img.width) / 2 + 12);
    if (teDichtbij && !soortOverride) {
      img.destroy();
      return null;
    }
    const voertuig = {
      img, baan, richting: baan.richting, snelheid: soort.snelheid * (0.85 + Math.random() * 0.3), vast: !!soortOverride,
    };
    this.voertuigen.push(voertuig);
    return voertuig;
  }

  updateVerkeer(delta) {
    if (!this.voertuigen || !this.voertuigen.length) return;
    const mapB = this.breedte * TEGEL;
    this.voertuigen.forEach((v) => {
      // niet op je voorganger inrijden
      let snelheid = v.snelheid;
      this.voertuigen.forEach((w) => {
        if (w === v || w.baan !== v.baan) return;
        const afstand = (w.img.x - v.img.x) * v.richting;
        const ruimte = (w.img.width + v.img.width) / 2 + 10;
        if (afstand > 0 && afstand < ruimte + 20) snelheid = Math.min(snelheid, w.snelheid * 0.9);
      });
      v.img.x += v.richting * snelheid * delta / 1000;
      if (v.opX && !v.opXGedaan && (v.img.x - v.opX.x) * v.richting >= 0) {
        v.opXGedaan = true;
        v.opX.doe(v);
      }
    });
    this.voertuigen = this.voertuigen.filter((v) => {
      const weg = v.richting > 0 ? v.img.x > mapB + v.img.width : v.img.x < -v.img.width;
      if (weg) v.img.destroy();
      return !weg;
    });
  }

  /** Zet een persoon direct op een andere plek. */
  zetPersoon(p, x, y, richting = p.richting) {
    this.personenOpPlek.forEach((waarde, k) => { if (waarde === p) this.personenOpPlek.delete(k); });
    p.x = x;
    p.y = y;
    p.beweegt = false;
    p.richting = richting;
    this.personenOpPlek.set(sleutel(x, y), p);
    this.plaatsPersoon(p);
  }

  /** Zet de speler direct op een andere plek (bijvoorbeeld tijdens een zwart scherm). */
  zetSpeler(x, y, richting) {
    const s = this.speler;
    s.x = x;
    s.y = y;
    s.beweegt = false;
    s.voortgang = 0;
    if (richting) s.richting = richting;
    this.bewaarPositie();
    this.plaatsSpeler();
  }

  /** Een rij mensen loopt achter elkaar aan (de eerste loopt in `richting`). */
  async stoetLoop(leden, richting, stappen) {
    for (let i = 0; i < stappen; i++) {
      const oud = leden.map((l) => ({ x: l.x, y: l.y }));
      leden.forEach((l, k) => {
        l.gescript = true;
        if (k === 0) this.stapPersoon(l, richting, { negeerBezet: true });
        else if (oud[k - 1].x !== l.x || oud[k - 1].y !== l.y) this.stapPersoon(l, richtingNaar(l, oud[k - 1]), { negeerBezet: true });
      });
      await this.ui.wachtOp(() => leden.every((l) => !l.beweegt));
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
      if (persoon.beweegt) return;
      persoon.kijk(TEGENOVER[s.richting]);
      scriptNaam = persoon.script;
    } else {
      const volger = this.volgerOp(tx, ty);
      if (volger) {
        audio.sfx('kies');
        await this.ui.script(() => praatMetVolger(this.context(), volger));
        return;
      }
      scriptNaam = this.interacties.get(sleutel(tx, ty));
    }
    if (!scriptNaam) return;
    const script = this.scripts[scriptNaam];
    if (!script) return;
    audio.sfx('kies');
    await this.ui.script(() => script(this.context(), { x: tx, y: ty, persoon }));
  }
}
