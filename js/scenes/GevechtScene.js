// Beurtgevecht in de stijl van de klassieke handheld-RPG's.
// De beer vecht met zijn soeplepel en kan de volkszanger erbij roepen; Duitse wachters
// schieten met een Walther P38 of steken met een mesje.
import { zetCamera } from '../core/constanten.js';
import { audio } from '../core/audio.js';
import { staat, krijgXp, xpNodig } from '../core/staat.js';
import { beer } from '../core/namen.js';
import { kader, tekst } from '../ui/tekst.js';
import { gezondheidsbalk } from '../ui/gezondheid.js';
import { RasterMenu } from '../ui/rastermenu.js';
import { openRugzak } from '../ui/rugzak.js';
import { StatusPaneel } from '../ui/pauzemenu.js';
import { AANVALLEN, VIJANDEN, ZANGER, berekenSchade } from '../gevecht/data.js';

const VIJAND_X = 176;
const VIJAND_Y = 82;
const SPELER_X = 64;
const SPELER_Y = 112;

const kans = (procent) => Math.random() * 100 < procent;

export class GevechtScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Gevecht' });
  }

  init(data) {
    this.vijandId = data.vijand;
    this.klaar = data.klaar;
    this.achtergrond = data.achtergrond || 'bg_gevecht';
  }

  create() {
    zetCamera(this);
    this.ui = this.scene.get('UI');
    const def = VIJANDEN[this.vijandId];
    this.v = { ...def, gz: def.maxGz, verward: 0 };

    this.add.image(0, 0, this.achtergrond).setOrigin(0, 0);
    this.add.rectangle(0, 112, 240, 48, 0x202028).setOrigin(0, 0);
    this.vijand = this.add.image(-60, VIJAND_Y, def.sprite).setOrigin(0.5, 1);
    this.speler = this.add.image(300, SPELER_Y, 'gevecht_beer_rug').setOrigin(0.5, 1);
    this.zanger = this.add.sprite(-40, SPELER_Y, 'gevecht_volkszanger', 0).setOrigin(0.5, 1).setVisible(false);
    this.sterren = [0, 1].map(() => this.add.image(0, 0, 'effect_ster').setVisible(false).setDepth(5));
    this.sterHoek = 0;

    this.maakInfo();
    this.verloop();
  }

  update(tijd, delta) {
    // sterretjes boven het hoofd van een verwarde vijand
    const verward = this.v && this.v.verward > 0 && this.vijand.alpha > 0.5;
    this.sterHoek += delta * 0.006;
    this.sterren.forEach((s, i) => {
      s.setVisible(verward);
      if (!verward) return;
      const h = this.sterHoek + i * Math.PI;
      s.setPosition(Math.round(this.vijand.x + Math.cos(h) * 10), Math.round(this.vijand.y - 58 + Math.sin(h) * 3));
    });
  }

  // ------------------------------------------------------------ infovakken

  maakInfo() {
    const v = this.v;
    this.vijandInfo = this.add.container(-140, 0);
    this.vijandInfo.add(kader(this, 6, 8, 122, 32, 'info'));
    this.vijandInfo.add(tekst(this, 14, 13, v.naam));
    const nv = tekst(this, 0, 13, `Nv${v.niveau}`, 'grijs');
    nv.x = 120 - nv.width;
    this.vijandInfo.add(nv);
    this.vijandBalk = gezondheidsbalk(this, 54, 27, v.gz, v.maxGz, 1);
    this.vijandBalk.objecten.forEach((o) => this.vijandInfo.add(o));

    this.spelerInfo = this.add.container(130, 0);
    this.spelerInfo.add(kader(this, 126, 70, 110, 40, 'info'));
    this.spelerInfo.add(tekst(this, 134, 75, beer()));
    this.spelerNv = tekst(this, 0, 75, '', 'grijs');
    this.spelerInfo.add(this.spelerNv);
    this.spelerBalk = gezondheidsbalk(this, 160, 88, staat.gezondheid, staat.maxGezondheid, 1);
    this.spelerBalk.objecten.forEach((o) => this.spelerInfo.add(o));
    this.spelerGz = tekst(this, 0, 94, '');
    this.spelerInfo.add(this.spelerGz);
    this.xpBalk = this.add.graphics();
    this.spelerInfo.add(this.xpBalk);
    this.werkSpelerInfoBij();
  }

  werkSpelerInfoBij(gz = staat.gezondheid) {
    this.spelerNv.setText(`Nv${staat.niveau}`);
    this.spelerNv.x = 228 - this.spelerNv.width;
    this.spelerGz.setText(`${gz}/ ${staat.maxGezondheid}`);
    this.spelerGz.x = 228 - this.spelerGz.width;
    this.spelerBalk.zet(gz);
    this.tekenXp(staat.xp / xpNodig());
  }

  tekenXp(deel) {
    const g = this.xpBalk;
    g.clear();
    g.fillStyle(0x404048).fillRect(146, 105, 84, 3);
    g.fillStyle(0x1c2028).fillRect(147, 106, 82, 1);
    g.fillStyle(0x48a8f0).fillRect(147, 106, Math.round(82 * Math.min(1, deel)), 1);
  }

  async animeerGz(wie, van, naar) {
    const stap = van > naar ? -1 : 1;
    for (let w = van; w !== naar; w += stap) {
      if (wie === 'vijand') this.vijandBalk.zet(w + stap);
      else this.werkSpelerInfoBij(w + stap);
      await this.ui.wachtMs(28);
    }
  }

  // ------------------------------------------------------------ hulpjes

  tween(cfg) {
    return new Promise((klaar) => this.tweens.add({ ...cfg, onComplete: klaar }));
  }

  async knipper(doel, keer = 3) {
    for (let i = 0; i < keer; i++) {
      doel.setAlpha(0);
      await this.ui.wachtMs(60);
      doel.setAlpha(1);
      await this.ui.wachtMs(60);
    }
  }

  zeg(teksten, opties) {
    return this.ui.zeg(teksten, opties);
  }

  tekstZonderWachten(t) {
    this.ui.sluitGevraagd = false;
    return this.ui.dialoog.toon(t, { wachtAanEinde: false });
  }

  // ------------------------------------------------------------ verloop

  async verloop() {
    const ui = this.ui;
    let resultaat = 'verloren';
    await ui.script(async () => {
      await Promise.all([
        ui.vanZwart(300),
        this.tween({ targets: this.vijand, x: VIJAND_X, duration: 900, ease: 'Sine.easeOut' }),
        this.tween({ targets: this.speler, x: SPELER_X, duration: 900, ease: 'Sine.easeOut' }),
      ]);
      await this.zeg(this.v.intro || `${this.v.naam} wil vechten!`);
      await Promise.all([
        this.tween({ targets: this.vijandInfo, x: 0, duration: 300, ease: 'Sine.easeOut' }),
        this.tween({ targets: this.spelerInfo, x: 0, duration: 300, ease: 'Sine.easeOut' }),
      ]);

      for (;;) {
        const actie = await this.kiesActie();
        if (actie.soort === 'vlucht') {
          await this.zeg(['Je kunt niet vluchten!', `${this.v.naam} staat precies in de weg.`]);
          continue;
        }
        const spelerEerst = staat.snelheid >= this.v.snelheid || actie.soort === 'item';
        if (spelerEerst) {
          if (actie.soort === 'aanval') await this.spelerAanval(actie.id);
          if (this.v.gz <= 0) { resultaat = await this.gewonnen(); break; }
          await this.vijandBeurt();
          if (staat.gezondheid <= 0) { resultaat = await this.verloren(); break; }
        } else {
          await this.vijandBeurt();
          if (staat.gezondheid <= 0) { resultaat = await this.verloren(); break; }
          await this.spelerAanval(actie.id);
          if (this.v.gz <= 0) { resultaat = await this.gewonnen(); break; }
        }
      }
    });
    this.klaar(resultaat);
  }

  async kiesActie() {
    const ui = this.ui;
    for (;;) {
      ui.sluitDialoog();
      const keuze = await ui.open(new RasterMenu(ui, {
        opties: ['VECHTEN', 'RUGZAK', 'STATUS', 'VLUCHTEN'],
        links: { x: 2, y: 112, b: 112, h: 46, tekst: `Wat doet ${beer()}?` },
        kader: { x: 114, y: 112, b: 124, h: 46, soort: 'menu' },
        kolomBreedte: 56,
        start: this.laatsteKeuze || 0,
      }));
      this.laatsteKeuze = keuze;
      if (keuze === 0) {
        const aanval = await this.kiesAanval();
        if (aanval) return { soort: 'aanval', id: aanval };
      } else if (keuze === 1) {
        const voor = staat.gezondheid;
        const gebruikt = await openRugzak(ui, { inGevecht: true });
        if (gebruikt) {
          this.werkSpelerInfoBij(voor);
          await this.animeerGz('speler', voor, staat.gezondheid);
          return { soort: 'item' };
        }
      } else if (keuze === 2) {
        await ui.open(new StatusPaneel(ui));
      } else {
        return { soort: 'vlucht' };
      }
    }
  }

  async kiesAanval() {
    const lijst = staat.aanvallen;
    const opties = lijst.map((id) => ({ label: AANVALLEN[id].naam, uit: (staat.pp[id] ?? 0) <= 0 }));
    while (opties.length < 4) opties.push({ label: '-', uit: true });
    const keuze = await this.ui.open(new RasterMenu(this.ui, {
      opties,
      kader: { x: 2, y: 112, b: 170, h: 46, soort: 'tekst' },
      info: { x: 172, y: 112, b: 66, h: 46 },
      kolomBreedte: 80,
      annuleer: -1,
      opVerander: (i) => {
        const id = lijst[i];
        if (!id) return ['', ''];
        return [`PP ${staat.pp[id]}/${staat.ppMax[id]}`, AANVALLEN[id].soort];
      },
    }));
    if (keuze < 0 || keuze >= lijst.length) return null;
    return lijst[keuze];
  }

  // ------------------------------------------------------------ aanvallen van de beer

  async spelerAanval(id) {
    const a = AANVALLEN[id];
    staat.pp[id] = Math.max(0, (staat.pp[id] ?? 0) - 1);
    if (id === 'volkszanger') {
      await this.tekstZonderWachten(`${beer()} roept de hulp in van ${ZANGER.naam}!`);
      await this.zangerAnimatie();
      const lied = ZANGER.liedjes[Math.floor(Math.random() * ZANGER.liedjes.length)];
      const al = this.v.verward > 0;
      this.v.verward = 3;
      await this.zeg([
        `SEPP zingt ${lied}!`,
        al ? `${this.v.naam} is al in de war, en zingt nu ook nog mee!` : `${this.v.naam} raakt helemaal in de war!`,
      ]);
      return;
    }
    await this.tekstZonderWachten(`${beer()} gebruikt ${a.naam}!`);
    await this.ui.wachtMs(250);
    if (!kans(a.nauwkeurigheid)) {
      await this.lepelAnimatie(false, a.animatie);
      await this.zeg(`Maar ${this.v.naam} springt opzij!`);
      return;
    }
    await this.lepelAnimatie(true, a.animatie);
    const { schade, voltreffer } = berekenSchade(staat.niveau, a.kracht, staat.aanval, this.v.verdediging);
    const voor = this.v.gz;
    this.v.gz = Math.max(0, this.v.gz - schade);
    await this.animeerGz('vijand', voor, this.v.gz);
    if (voltreffer) await this.zeg('Een voltreffer! BONK!');
    else this.ui.sluitDialoog();
  }

  async lepelAnimatie(raak, soort = 'lepel') {
    const textuur = soort === 'frikandel' ? 'effect_frikandel' : 'effect_lepel';
    const lepel = this.add.image(this.vijand.x - 6, this.vijand.y - 30, textuur).setOrigin(0.2, 0.8).setRotation(-1.3).setDepth(10);
    await this.tween({ targets: lepel, rotation: 0.7, duration: 160, ease: 'Cubic.easeIn' });
    if (raak && soort === 'frikandel') {
      // ijssplinters
      for (let i = 0; i < 6; i++) {
        const s = this.add.image(this.vijand.x, this.vijand.y - 32, 'effect_ster').setTint(0xbfe0ff).setDepth(12);
        const hoek = (i / 6) * Math.PI * 2;
        this.tweens.add({
          targets: s, x: s.x + Math.cos(hoek) * 18, y: s.y + Math.sin(hoek) * 14, alpha: 0, duration: 420,
          onComplete: () => s.destroy(),
        });
      }
    }
    if (raak) {
      audio.sfx('slag');
      const bonk = this.add.image(this.vijand.x, this.vijand.y - 30, 'effect_inslag').setDepth(11);
      this.cameras.main.shake(140, 0.006);
      await this.knipper(this.vijand, 3);
      bonk.destroy();
    } else {
      audio.sfx('mis');
      await this.tween({ targets: this.vijand, x: this.vijand.x + 12, duration: 110, yoyo: true });
    }
    lepel.destroy();
  }

  async zangerAnimatie() {
    const z = this.zanger;
    z.setVisible(true).setPosition(-30, SPELER_Y).setFrame(0);
    await this.tween({ targets: z, x: 18, duration: 350, ease: 'Sine.easeOut' });
    const jingle = audio.jingle('volkszanger');
    let open = false;
    const frames = this.time.addEvent({ delay: 220, loop: true, callback: () => { open = !open; z.setFrame(open ? 1 : 0); } });
    const noten = this.time.addEvent({
      delay: 260, loop: true,
      callback: () => {
        const n = this.add.image(z.x + 10, z.y - 34, 'effect_noot').setDepth(12);
        this.tweens.add({
          targets: n,
          x: this.vijand.x + Phaser.Math.Between(-14, 14),
          y: this.vijand.y - Phaser.Math.Between(40, 60),
          duration: 900,
          ease: 'Sine.easeInOut',
          onComplete: () => n.destroy(),
        });
      },
    });
    const wiebel = this.tweens.add({ targets: this.vijand, angle: { from: -6, to: 6 }, duration: 260, yoyo: true, repeat: -1 });
    await jingle;
    frames.remove();
    noten.remove();
    wiebel.stop();
    this.vijand.setAngle(0);
    z.setFrame(0);
    await this.tween({ targets: z, x: -30, duration: 300, ease: 'Sine.easeIn' });
    z.setVisible(false);
  }

  // ------------------------------------------------------------ de vijand is aan de beurt

  async vijandBeurt() {
    const v = this.v;
    let nauwkeurigheidFactor = 1;
    if (v.verward > 0) {
      v.verward -= 1;
      await this.zeg(`${v.naam} is in de war!`);
      if (kans(30)) {
        await this.schunkel();
        await this.zeg(`${v.naam} staat mee te schunkelen in plaats van aan te vallen!`);
        if (v.verward === 0) await this.zeg(`${v.naam} is weer bij zinnen.`);
        return;
      }
      nauwkeurigheidFactor = 0.5;
    }
    // aanval kiezen (gewogen)
    const totaal = v.aanvallen.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * totaal;
    let id = v.aanvallen[0][0];
    for (const [a, w] of v.aanvallen) {
      if (r < w) { id = a; break; }
      r -= w;
    }
    const a = AANVALLEN[id];
    await this.tekstZonderWachten(`${v.naam} gebruikt ${a.naam}!`);
    await this.ui.wachtMs(250);
    const raak = kans(a.nauwkeurigheid * nauwkeurigheidFactor);
    if (a.animatie === 'schot') await this.schotAnimatie(raak);
    else if (a.animatie === 'vape') await this.vapeAnimatie(raak, a.tint);
    else await this.mesAnimatie(raak);
    if (!raak) {
      await this.zeg(a.misTekst.replace('{BEER}', beer()));
    } else {
      if (a.raakTekst) await this.zeg(a.raakTekst.replace('{BEER}', beer()));
      const { schade, voltreffer } = berekenSchade(v.niveau, a.kracht, v.aanval, staat.verdediging);
      const voor = staat.gezondheid;
      staat.gezondheid = Math.max(0, staat.gezondheid - schade);
      await this.animeerGz('speler', voor, staat.gezondheid);
      if (voltreffer) await this.zeg('Au! Een voltreffer!');
      else this.ui.sluitDialoog();
    }
    if (v.verward === 0 && nauwkeurigheidFactor < 1) await this.zeg(`${v.naam} is weer bij zinnen.`);
  }

  async schunkel() {
    for (let i = 0; i < 3; i++) {
      const n = this.add.image(this.vijand.x + Phaser.Math.Between(-12, 12), this.vijand.y - 50, 'effect_noot').setDepth(12);
      this.tweens.add({ targets: n, y: n.y - 14, alpha: 0, duration: 700, delay: i * 120, onComplete: () => n.destroy() });
    }
    await this.tween({ targets: this.vijand, angle: { from: -8, to: 8 }, duration: 180, yoyo: true, repeat: 2 });
    this.vijand.setAngle(0);
  }

  async schotAnimatie(raak) {
    const loopX = this.vijand.x - 22;
    const loopY = this.vijand.y - 46;
    const flits = this.add.image(loopX, loopY, 'effect_flits').setDepth(12);
    audio.sfx('pang');
    const g = this.add.graphics().setDepth(11);
    const doelX = raak ? this.speler.x + 4 : this.speler.x + 50;
    const doelY = raak ? this.speler.y - 30 : this.speler.y - 60;
    g.lineStyle(1, 0xfff0a0, 1).lineBetween(loopX, loopY, doelX, doelY);
    await this.ui.wachtMs(90);
    flits.destroy();
    g.destroy();
    if (raak) {
      const bonk = this.add.image(this.speler.x, this.speler.y - 28, 'effect_inslag').setDepth(12);
      this.cameras.main.shake(160, 0.008);
      await this.knipper(this.speler, 3);
      bonk.destroy();
    } else {
      audio.sfx('mis');
      await this.tween({ targets: this.speler, x: this.speler.x - 10, duration: 110, yoyo: true });
    }
  }

  async vapeAnimatie(raak, tint) {
    audio.sfx('sis');
    const startX = this.vijand.x - 16;
    const startY = this.vijand.y - 36;
    const wolken = [];
    for (let i = 0; i < 4; i++) {
      const w = this.add.image(startX, startY, 'effect_vape').setDepth(12).setScale(0.3).setAlpha(0.9);
      if (tint) w.setTint(tint);
      wolken.push(w);
      this.tweens.add({
        targets: w,
        x: raak ? this.speler.x + Phaser.Math.Between(-10, 10) : startX + Phaser.Math.Between(10, 30),
        y: raak ? this.speler.y - 30 + Phaser.Math.Between(-8, 8) : startY - Phaser.Math.Between(20, 40),
        scale: raak ? 1.1 : 0.8,
        duration: 600,
        delay: i * 90,
        ease: 'Sine.easeOut',
      });
    }
    await this.ui.wachtMs(900);
    if (raak) await this.knipper(this.speler, 2);
    await this.tween({ targets: wolken, alpha: 0, duration: 400 });
    wolken.forEach((w) => w.destroy());
  }

  async mesAnimatie(raak) {
    await this.tween({ targets: this.vijand, x: VIJAND_X - 18, y: VIJAND_Y + 6, duration: 130, yoyo: true });
    audio.sfx('mes');
    if (raak) {
      const snee = this.add.image(this.speler.x, this.speler.y - 30, 'effect_snee').setDepth(12);
      await this.knipper(this.speler, 3);
      this.tweens.add({ targets: snee, alpha: 0, duration: 200, onComplete: () => snee.destroy() });
    } else {
      await this.tween({ targets: this.speler, x: this.speler.x - 10, duration: 110, yoyo: true });
    }
  }

  // ------------------------------------------------------------ einde

  async gewonnen() {
    const v = this.v;
    audio.sfx('ko');
    await this.tween({ targets: this.vijand, y: VIJAND_Y + 40, alpha: 0, duration: 450, ease: 'Sine.easeIn' });
    await this.tween({ targets: this.vijandInfo, x: -140, duration: 250 });
    audio.speelMuziek('overwinning');
    await this.zeg([`${v.naam} gaat knock-out!`, `${beer()} heeft ${v.naam} verslagen!`]);
    await this.tekstZonderWachten(`${beer()} krijgt ${v.xp} ervaringspunten.`);
    const niveauVoor = staat.niveau;
    const xpVoor = staat.xp;
    const nieuw = krijgXp(v.xp);
    // XP-balk vullen
    const doelen = nieuw.length ? [1] : [staat.xp / xpNodig()];
    const startDeel = xpVoor / xpNodig(niveauVoor);
    for (let i = 0; i <= 20; i++) {
      this.tekenXp(startDeel + (doelen[0] - startDeel) * (i / 20));
      await this.ui.wachtMs(30);
    }
    await this.ui.dialoog.wachtOpKnop();
    if (v.geld) {
      staat.geld = (staat.geld || 0) + v.geld;
      audio.sfx('kies');
      await this.zeg(`${beer()} vindt €${v.geld} in de zakken van ${v.naam}.`);
    }
    for (const n of nieuw) {
      this.werkSpelerInfoBij();
      audio.jingle('niveau');
      await this.zeg([
        `${beer()} is nu niveau ${n}!`,
        'Gezondheid +4, aanval +1, verdediging +1 en snelheid +1.',
      ]);
    }
    this.werkSpelerInfoBij();
    await this.ui.naarZwart(400);
    this.ui.sluitDialoog();
    return 'gewonnen';
  }

  async verloren() {
    audio.stopMuziek(0.5);
    audio.sfx('ko');
    await this.tween({ targets: this.speler, y: SPELER_Y + 50, alpha: 0, duration: 500, ease: 'Sine.easeIn' });
    await this.zeg([`${beer()} is uitgeput...`, `${beer()} valt flauw. Alles wordt zwart...`]);
    await this.ui.naarZwart(600);
    this.ui.sluitDialoog();
    return 'verloren';
  }
}
