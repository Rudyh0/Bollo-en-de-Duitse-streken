// Kleine chiptune-synthesizer met Web Audio: twee pulskanalen, een driehoek en ruis,
// net als op een oude handheld. Er zijn geen geluidsbestanden nodig.
import { instellingen, bijWijziging } from './instellingen.js';
import { LIEDJES } from './muziek.js';
import { VERSIE } from './constanten.js';

// Muziek uit een geluidsbestand in plaats van de chiptune-synthesizer.
const BESTANDEN = {
  intake: { url: 'assets/audio/intake.mp3', volume: 0.55, herhaal: true },
  outro: { url: 'assets/audio/outro.mp3', volume: 0.75, herhaal: false },
};

const NOTEN = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

export function noteNaarFrequentie(noot) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(noot);
  if (!m) return null;
  let n = NOTEN[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
  const octaaf = parseInt(m[3], 10);
  const midi = 12 * (octaaf + 1) + n;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** Zet "C5:4 E5:2 -:2" om in [{t, duur, noot}] in zestienden. */
function ontleedSpoor(tekst) {
  const noten = [];
  let t = 0;
  tekst.trim().split(/\s+/).forEach((token) => {
    if (!token) return;
    const [noot, duurTekst] = token.split(':');
    const duur = parseFloat(duurTekst || '4');
    if (noot !== '-') noten.push({ t, duur, noot });
    t += duur;
  });
  return { noten, lengte: t };
}

class Audio {
  constructor() {
    this.ctx = null;
    this.bestandData = {};    // id -> Promise<ArrayBuffer>
    this.bestandBuffers = {}; // id -> AudioBuffer
    this.klaar = false;
    this.huidig = null;
    this.golven = {};
    this.ruisBuffer = null;
  }

  ontgrendel() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const ctx = this.ctx;
    this.hoofd = ctx.createGain();
    this.hoofd.gain.value = 0.9;
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.ratio.value = 4;
    this.hoofd.connect(compressor).connect(ctx.destination);
    this.muziekGain = ctx.createGain();
    this.muziekDemper = ctx.createGain();
    this.muziekGain.connect(this.muziekDemper).connect(this.hoofd);
    this.jingleGain = ctx.createGain();
    this.jingleGain.connect(this.hoofd);
    this.sfxGain = ctx.createGain();
    this.sfxGain.connect(this.hoofd);
    this.werkVolumesBij();
    bijWijziging((sleutel) => {
      if (sleutel === 'muziek' || sleutel === 'effecten') this.werkVolumesBij();
    });

    // pulsgolven met verschillende breedtes
    [0.125, 0.25, 0.5].forEach((breedte) => {
      const n = 32;
      const real = new Float32Array(n);
      const imag = new Float32Array(n);
      for (let i = 1; i < n; i++) {
        real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * breedte);
      }
      this.golven[breedte] = ctx.createPeriodicWave(real, imag);
    });
    const lengte = ctx.sampleRate;
    this.ruisBuffer = ctx.createBuffer(1, lengte, ctx.sampleRate);
    const data = this.ruisBuffer.getChannelData(0);
    for (let i = 0; i < lengte; i++) data[i] = Math.random() * 2 - 1;

    this.klaar = true;
    this.planner = setInterval(() => this.plan(), 25);
    if (this.wachtend) {
      const w = this.wachtend;
      this.wachtend = null;
      this.speelMuziek(w);
    }
  }

  volume(stand) {
    return Math.pow(stand / 10, 1.6);
  }

  werkVolumesBij() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.muziekGain.gain.setTargetAtTime(this.volume(instellingen.muziek) * 0.55, t, 0.02);
    this.jingleGain.gain.setTargetAtTime(this.volume(instellingen.muziek) * 0.6, t, 0.02);
    this.sfxGain.gain.setTargetAtTime(this.volume(instellingen.effecten) * 0.6, t, 0.02);
  }

  // ------------------------------------------------------------ instrumenten

  toon(bestemming, golf, freq, start, duur, vol, opties = {}) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    if (golf === 'driehoek') osc.type = 'triangle';
    else if (golf === 'zaag') osc.type = 'sawtooth';
    else if (golf === 'sinus') osc.type = 'sine';
    else {
      const breedte = { puls12: 0.125, puls25: 0.25, puls50: 0.5 }[golf] ?? golf;
      osc.setPeriodicWave(this.golven[breedte] || this.golven[0.5]);
    }
    osc.frequency.setValueAtTime(freq, start);
    if (opties.naarFreq) osc.frequency.exponentialRampToValueAtTime(opties.naarFreq, start + duur);
    if (opties.vibrato && duur > 0.3) {
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.5;
      lfoGain.gain.setValueAtTime(0, start);
      lfoGain.gain.linearRampToValueAtTime(freq * 0.012, start + 0.25);
      lfo.connect(lfoGain).connect(osc.frequency);
      lfo.start(start);
      lfo.stop(start + duur + 0.05);
    }
    const g = ctx.createGain();
    const aanval = 0.004;
    const loslaten = Math.min(0.06, duur * 0.3);
    const verval = opties.verval ?? 0.75;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + aanval);
    g.gain.linearRampToValueAtTime(vol * verval, start + Math.min(duur * 0.5, 0.12) + aanval);
    g.gain.setValueAtTime(vol * verval, start + Math.max(aanval, duur - loslaten));
    g.gain.linearRampToValueAtTime(0, start + duur);
    osc.connect(g).connect(bestemming);
    osc.start(start);
    osc.stop(start + duur + 0.02);
  }

  ruis(bestemming, soort, start, vol) {
    const ctx = this.ctx;
    if (soort === 'K') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, start);
      osc.frequency.exponentialRampToValueAtTime(42, start + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(vol * 1.6, start);
      g.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
      osc.connect(g).connect(bestemming);
      osc.start(start);
      osc.stop(start + 0.16);
      return;
    }
    const bron = ctx.createBufferSource();
    bron.buffer = this.ruisBuffer;
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    let duur = 0.05;
    if (soort === 'H') {
      filter.type = 'highpass';
      filter.frequency.value = 7000;
      duur = 0.04;
      vol *= 0.5;
    } else if (soort === 'S') {
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 0.8;
      duur = 0.14;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      duur = 0.2;
    }
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + duur);
    bron.connect(filter).connect(g).connect(bestemming);
    bron.start(start, Math.random() * 0.5);
    bron.stop(start + duur + 0.02);
  }

  /** Ruis door een filter waarvan de frequentie verschuift (sissen, zoeven, schoten). */
  ruisSweep(bestemming, type, van, naar, start, duur, vol) {
    const ctx = this.ctx;
    const bron = ctx.createBufferSource();
    bron.buffer = this.ruisBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(van, start);
    filter.frequency.exponentialRampToValueAtTime(naar, start + duur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + duur);
    bron.connect(filter).connect(g).connect(bestemming);
    bron.start(start, Math.random() * 0.4);
    bron.stop(start + duur + 0.05);
  }

  // ------------------------------------------------------------ muziek

  bereidVoor(id) {
    const lied = LIEDJES[id];
    if (!lied) return null;
    if (!lied._sporen) {
      lied._sporen = lied.kanalen.map((k) => ({ ...k, ...ontleedSpoor(k.noten) }));
      lied._lengte = Math.max(...lied._sporen.map((s) => s.lengte));
    }
    return lied;
  }

  /** Begint alvast met downloaden, zodat de muziek meteen klaar is als hij nodig is. */
  voorladen(id) {
    const info = BESTANDEN[id];
    if (!info || this.bestandData[id]) return;
    this.bestandData[id] = fetch(`${info.url}?v=${VERSIE}`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(r.status))))
      .catch(() => { delete this.bestandData[id]; return null; });
  }

  async decodeer(id) {
    if (this.bestandBuffers[id]) return this.bestandBuffers[id];
    this.voorladen(id);
    const data = await this.bestandData[id];
    if (!data || !this.ctx) return null;
    try {
      this.bestandBuffers[id] = await new Promise((ok, fout) => this.ctx.decodeAudioData(data.slice(0), ok, fout));
    } catch (e) {
      return null;
    }
    return this.bestandBuffers[id];
  }

  speelBestand(id) {
    const info = BESTANDEN[id];
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.connect(this.muziekGain);
    const huidig = { id, bus, bron: null };
    this.huidig = huidig;
    this.decodeer(id).then((buffer) => {
      if (!buffer || this.huidig !== huidig) return;
      const bron = ctx.createBufferSource();
      bron.buffer = buffer;
      bron.loop = info.herhaal !== false;
      bron.connect(bus);
      const t = ctx.currentTime;
      bus.gain.setValueAtTime(0, t);
      bus.gain.linearRampToValueAtTime(info.volume ?? 0.6, t + 0.6);
      bron.start(t);
      huidig.bron = bron;
    });
  }

  /**
   * Speelt een geluidsbestand precies één keer af (de aftiteling).
   * Geeft { duur, start } in AudioContext-seconden zodra het nummer klinkt, of null als dat niet lukt.
   */
  async speelEenmaal(id) {
    if (!this.klaar || !this.ctx) return null;
    this.stopMuziek(0.05);
    const info = BESTANDEN[id];
    const buffer = await this.decodeer(id);
    if (!buffer) return null;
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = info.volume ?? 0.6;
    bus.connect(this.muziekGain);
    const bron = ctx.createBufferSource();
    bron.buffer = buffer;
    bron.connect(bus);
    const start = ctx.currentTime + 0.05;
    bron.start(start);
    this.huidig = { id, bus, bron };
    return { duur: buffer.duration, start };
  }

  /** De klok van de geluidskaart (of van de browser, als er geen geluid is). */
  nu() {
    return this.ctx ? this.ctx.currentTime : performance.now() / 1000;
  }

  speelMuziek(id, { herstart = false } = {}) {
    if (!this.klaar) {
      this.wachtend = id;
      return;
    }
    if (this.huidig && this.huidig.id === id && !herstart) return;
    this.stopMuziek(0.15);
    if (BESTANDEN[id]) {
      this.speelBestand(id);
      return;
    }
    const lied = this.bereidVoor(id);
    if (!lied) return;
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = 1;
    bus.connect(this.muziekGain);
    this.huidig = {
      id,
      lied,
      bus,
      start: ctx.currentTime + 0.08,
      gepland: lied._sporen.map(() => 0),
      ronde: lied._sporen.map(() => 0),
    };
  }

  stopMuziek(fade = 0.3) {
    if (!this.huidig) return;
    const { bus, bron } = this.huidig;
    const t = this.ctx.currentTime;
    bus.gain.cancelScheduledValues(t);
    bus.gain.setValueAtTime(bus.gain.value, t);
    bus.gain.linearRampToValueAtTime(0, t + fade);
    setTimeout(() => {
      try { if (bron) bron.stop(); } catch (e) { /* al gestopt */ }
      bus.disconnect();
    }, (fade + 0.6) * 1000);
    this.huidig = null;
  }

  plan() {
    const h = this.huidig;
    if (!h || !h.lied || !this.ctx) return;
    const ctx = this.ctx;
    const zestiende = 60 / h.lied.bpm / 4;
    const tot = ctx.currentTime + 0.2;
    h.lied._sporen.forEach((spoor, i) => {
      for (;;) {
        const index = h.gepland[i];
        if (index >= spoor.noten.length) {
          if (h.lied.herhaal === false) return;
          h.gepland[i] = 0;
          h.ronde[i] += 1;
          if (!spoor.noten.length) return;
          continue;
        }
        const noot = spoor.noten[index];
        const start = h.start + (h.ronde[i] * h.lied._lengte + noot.t) * zestiende;
        if (start > tot) break;
        h.gepland[i] += 1;
        if (start < ctx.currentTime - 0.05) continue;
        const duur = noot.duur * zestiende * (spoor.legato ?? 0.9);
        if (spoor.golf === 'ruis') {
          this.ruis(h.bus, noot.noot, start, spoor.volume);
        } else {
          const f = noteNaarFrequentie(noot.noot);
          if (f) this.toon(h.bus, spoor.golf, f, start, duur, spoor.volume, { vibrato: spoor.vibrato, verval: spoor.verval });
        }
      }
    });
  }

  /** Korte melodie (item gevonden, opgeslagen...). Dempt de muziek zolang hij speelt. */
  jingle(id) {
    return new Promise((klaar) => {
      if (!this.klaar) { klaar(); return; }
      const lied = this.bereidVoor(id);
      if (!lied) { klaar(); return; }
      const ctx = this.ctx;
      const zestiende = 60 / lied.bpm / 4;
      const start = ctx.currentTime + 0.05;
      const t = ctx.currentTime;
      this.muziekDemper.gain.cancelScheduledValues(t);
      this.muziekDemper.gain.setValueAtTime(this.muziekDemper.gain.value, t);
      this.muziekDemper.gain.linearRampToValueAtTime(0, t + 0.05);
      lied._sporen.forEach((spoor) => {
        spoor.noten.forEach((noot) => {
          const s = start + noot.t * zestiende;
          const duur = noot.duur * zestiende * (spoor.legato ?? 0.9);
          if (spoor.golf === 'ruis') this.ruis(this.jingleGain, noot.noot, s, spoor.volume);
          else this.toon(this.jingleGain, spoor.golf, noteNaarFrequentie(noot.noot), s, duur, spoor.volume, { verval: spoor.verval });
        });
      });
      const totaal = lied._lengte * zestiende;
      setTimeout(() => {
        const nu = this.ctx.currentTime;
        this.muziekDemper.gain.setValueAtTime(0, nu);
        this.muziekDemper.gain.linearRampToValueAtTime(1, nu + 0.6);
        klaar();
      }, (totaal + 0.15) * 1000);
    });
  }

  // ------------------------------------------------------------ geluidseffecten

  sfx(naam) {
    if (!this.klaar) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.005;
    const uit = this.sfxGain;
    switch (naam) {
      case 'kies':
        this.toon(uit, 0.5, 1320, t, 0.035, 0.22, { verval: 1 });
        break;
      case 'ok':
        this.toon(uit, 0.5, 990, t, 0.04, 0.22, { verval: 1 });
        this.toon(uit, 0.5, 1480, t + 0.045, 0.06, 0.2, { verval: 1 });
        break;
      case 'terug':
        this.toon(uit, 0.5, 880, t, 0.04, 0.2, { verval: 1 });
        this.toon(uit, 0.5, 587, t + 0.045, 0.06, 0.2, { verval: 1 });
        break;
      case 'menu':
        this.toon(uit, 0.25, 660, t, 0.035, 0.2, { verval: 1 });
        this.toon(uit, 0.25, 880, t + 0.04, 0.035, 0.2, { verval: 1 });
        this.toon(uit, 0.25, 1320, t + 0.08, 0.05, 0.2, { verval: 1 });
        break;
      case 'tik':
        this.toon(uit, 0.25, 1760, t, 0.025, 0.14, { verval: 1 });
        break;
      case 'botsen':
        this.toon(uit, 0.5, 130, t, 0.11, 0.38, { naarFreq: 70, verval: 0.8 });
        break;
      case 'deur':
        [0, 0.09, 0.18].forEach((d) => this.ruis(uit, 'S', t + d, 0.45));
        this.toon(uit, 0.125, 180, t, 0.25, 0.18, { naarFreq: 140 });
        break;
      case 'kist':
        this.toon(uit, 'zaag', 160, t, 0.22, 0.16, { naarFreq: 420 });
        this.ruis(uit, 'S', t + 0.2, 0.3);
        break;
      case 'fout':
        this.toon(uit, 0.5, 220, t, 0.08, 0.25, { verval: 1 });
        this.toon(uit, 0.5, 196, t + 0.1, 0.12, 0.25, { verval: 1 });
        break;
      case 'zoef':
        this.ruis(uit, 'L', t, 0.5);
        this.toon(uit, 0.125, 300, t, 0.35, 0.12, { naarFreq: 1400 });
        break;
      case 'trekje':
        this.toon(uit, 0.25, 520, t, 0.06, 0.12, { verval: 1 });
        break;
      case 'uitroep':
        this.toon(uit, 0.5, 700, t, 0.08, 0.22, { naarFreq: 1900, verval: 1 });
        this.toon(uit, 0.5, 1900, t + 0.09, 0.08, 0.18, { verval: 1 });
        break;
      case 'deur_open':
        this.toon(uit, 'zaag', 120, t, 0.18, 0.08, { naarFreq: 240 });
        this.ruis(uit, 'H', t + 0.16, 0.4);
        break;
      case 'klik':
        this.ruis(uit, 'H', t, 0.8);
        this.toon(uit, 0.25, 2200, t, 0.03, 0.2, { verval: 1 });
        this.toon(uit, 0.25, 1600, t + 0.06, 0.03, 0.18, { verval: 1 });
        break;
      case 'sis':
        this.ruisSweep(uit, 'highpass', 3000, 7000, t, 1.4, 0.55);
        this.ruisSweep(uit, 'bandpass', 900, 400, t, 1.0, 0.3);
        break;
      case 'alarm':
        for (let i = 0; i < 5; i++) {
          this.toon(uit, 0.5, 620, t + i * 0.5, 0.25, 0.2, { naarFreq: 1150, verval: 1 });
          this.toon(uit, 0.5, 1150, t + i * 0.5 + 0.25, 0.25, 0.2, { naarFreq: 620, verval: 1 });
        }
        break;
      case 'slag':
        this.ruis(uit, 'S', t, 0.7);
        this.toon(uit, 'sinus', 180, t, 0.12, 0.6, { naarFreq: 60 });
        this.toon(uit, 0.125, 1480, t + 0.02, 0.18, 0.12, { naarFreq: 1400 });
        break;
      case 'pang':
        this.ruisSweep(uit, 'lowpass', 4000, 300, t, 0.35, 1.0);
        this.toon(uit, 0.5, 300, t, 0.12, 0.35, { naarFreq: 50 });
        break;
      case 'mes':
        this.ruisSweep(uit, 'bandpass', 2500, 7000, t, 0.16, 0.6);
        this.ruisSweep(uit, 'bandpass', 3000, 8000, t + 0.12, 0.12, 0.4);
        break;
      case 'mis':
        this.ruisSweep(uit, 'bandpass', 600, 1800, t, 0.25, 0.3);
        break;
      case 'ko':
        this.toon(uit, 0.5, 660, t, 0.7, 0.25, { naarFreq: 80, verval: 0.9 });
        break;
      case 'flits':
        this.toon(uit, 0.125, 1200, t, 0.05, 0.15, { verval: 1 });
        this.toon(uit, 0.125, 1500, t + 0.06, 0.05, 0.15, { verval: 1 });
        break;
      case 'trillen':
        // telefoon die trilt op tafel
        for (let i = 0; i < 2; i++) this.toon(uit, 0.5, 58, t + i * 0.32, 0.22, 0.4, { naarFreq: 52, verval: 1 });
        break;
      case 'bericht':
        this.toon(uit, 'sinus', 1046, t, 0.07, 0.35, { verval: 1 });
        this.toon(uit, 'sinus', 1568, t + 0.08, 0.12, 0.35, { verval: 0.8 });
        break;
      case 'plons':
        this.ruisSweep(uit, 'lowpass', 2500, 200, t, 0.5, 0.9);
        this.toon(uit, 'sinus', 420, t, 0.18, 0.4, { naarFreq: 1200 });
        this.ruisSweep(uit, 'bandpass', 1200, 3000, t + 0.15, 0.4, 0.25);
        break;
      case 'kwaak':
        this.toon(uit, 0.25, 160, t, 0.09, 0.3, { naarFreq: 240, verval: 1 });
        this.toon(uit, 0.25, 150, t + 0.12, 0.14, 0.3, { naarFreq: 110, verval: 1 });
        break;
      case 'kassa':
        this.toon(uit, 0.5, 1568, t, 0.05, 0.2, { verval: 1 });
        this.toon(uit, 0.5, 2093, t + 0.06, 0.18, 0.2, { verval: 0.6 });
        this.ruis(uit, 'H', t + 0.02, 0.6);
        break;
      case 'ijs':
        [0, 0.05, 0.11, 0.18].forEach((d, i) => this.toon(uit, 0.125, 2400 + i * 400, t + d, 0.05, 0.12, { verval: 1 }));
        break;
      case 'motor':
        this.toon(uit, 0.5, 55, t, 0.5, 0.22, { naarFreq: 110, verval: 0.5 });
        this.toon(uit, 0.25, 82, t, 0.5, 0.12, { naarFreq: 165, verval: 0.5 });
        this.toon(uit, 0.5, 110, t + 0.45, 0.35, 0.18, { naarFreq: 70, verval: 1 });
        this.ruis(uit, 'H', t, 0.25);
        break;
      case 'scheur':
        this.toon(uit, 0.5, 70, t, 0.9, 0.24, { naarFreq: 240, verval: 0.3 });
        this.toon(uit, 0.25, 105, t, 0.9, 0.12, { naarFreq: 360, verval: 0.3 });
        this.ruis(uit, 'S', t + 0.05, 0.3);
        break;
      case 'remmen':
        this.toon(uit, 0.125, 1900, t, 0.45, 0.08, { naarFreq: 1500, verval: 1 });
        this.toon(uit, 0.125, 2300, t, 0.4, 0.05, { naarFreq: 1700, verval: 1 });
        this.ruis(uit, 'S', t, 0.35);
        break;
      case 'piep':
        this.toon(uit, 0.5, 1760, t, 0.08, 0.14, { verval: 1 });
        this.toon(uit, 0.5, 2093, t + 0.1, 0.12, 0.14, { verval: 1 });
        break;
      case 'kuch':
        [0, 0.24, 0.42].forEach((d, i) => {
          this.ruis(uit, 'S', t + d, 0.45 - i * 0.08);
          this.toon(uit, 0.5, 180 - i * 20, t + d, 0.08, 0.18, { naarFreq: 120, verval: 1 });
        });
        break;
      case 'boe':
        this.toon(uit, 0.5, 130, t, 0.25, 0.28, { naarFreq: 150, verval: 0.4 });
        this.toon(uit, 0.5, 150, t + 0.25, 0.55, 0.28, { naarFreq: 105, verval: 1 });
        break;
      case 'blaf':
        [0, 0.22].forEach((d) => {
          this.toon(uit, 0.25, 320, t + d, 0.09, 0.32, { naarFreq: 170, verval: 1 });
          this.ruis(uit, 'S', t + d, 0.35);
        });
        break;
      case 'toeter':
        this.toon(uit, 0.5, 392, t, 0.35, 0.16, { verval: 1 });
        this.toon(uit, 0.5, 494, t, 0.35, 0.14, { verval: 1 });
        this.toon(uit, 0.5, 392, t + 0.45, 0.2, 0.16, { verval: 1 });
        this.toon(uit, 0.5, 494, t + 0.45, 0.2, 0.14, { verval: 1 });
        break;
      case 'bonk':
        this.toon(uit, 'sinus', 140, t, 0.2, 0.6, { naarFreq: 50 });
        this.ruis(uit, 'L', t, 0.6);
        break;
      case 'zoem':
        this.toon(uit, 'sinus', 220, t, 0.6, 0.25, { naarFreq: 880 });
        this.toon(uit, 'sinus', 330, t, 0.6, 0.18, { naarFreq: 1320 });
        break;
      default:
        break;
    }
  }
}

export const audio = new Audio();
