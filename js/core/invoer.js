// Eén invoersysteem voor toetsenbord en aanraakknoppen.
// Logische knoppen: omhoog, omlaag, links, rechts, a, b, start.

const RICHTINGEN = ['omhoog', 'omlaag', 'links', 'rechts'];

const TOETSEN = {
  ArrowUp: 'omhoog', KeyW: 'omhoog',
  ArrowDown: 'omlaag', KeyS: 'omlaag',
  ArrowLeft: 'links', KeyA: 'links',
  ArrowRight: 'rechts', KeyD: 'rechts',
  KeyZ: 'a', Space: 'a', Enter: 'a', NumpadEnter: 'a',
  KeyX: 'b', Backspace: 'b',
  Escape: 'start', KeyM: 'start',
};

const HERHAAL_VERTRAGING = 320;
const HERHAAL_INTERVAL = 90;

class Invoer {
  constructor() {
    this.vast = new Set();        // knoppen die nu ingedrukt zijn
    this.wachtend = new Set();    // ingedrukt sinds het begin van deze frame (zichtbaar vanaf de volgende)
    this.nieuw = new Set();       // knoppen die deze frame als 'net ingedrukt' gelden
    this.verbruikt = new Set();   // al afgehandeld deze frame
    this.richtingStapel = [];     // laatst ingedrukte richting achteraan
    this.ingedruktSinds = {};
    this.laatsteHerhaal = {};
    this.tekstModus = false;
    this.getypt = [];
    this.bronnen = { toets: new Set(), aanraak: new Set() };
    this.eersteInteractie = [];
    this.gebruiktAanraak = false;
  }

  start() {
    window.addEventListener('keydown', (e) => this.toetsOmlaag(e), { passive: false });
    window.addEventListener('keyup', (e) => this.toetsOmhoog(e));
    window.addEventListener('blur', () => this.reset());
    const eerste = () => {
      this.eersteInteractie.forEach((f) => f());
      this.eersteInteractie = [];
    };
    window.addEventListener('pointerdown', eerste, { capture: true });
    window.addEventListener('keydown', eerste, { capture: true });
    window.addEventListener('touchstart', () => { this.gebruiktAanraak = true; }, { passive: true, capture: true });
    this.koppelAanraakknoppen();
  }

  bijEersteInteractie(f) {
    this.eersteInteractie.push(f);
  }

  // ------------------------------------------------------------ toetsenbord

  toetsOmlaag(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.tekstModus) {
      if (e.key === 'Backspace') { this.getypt.push({ soort: 'wis' }); e.preventDefault(); return; }
      if (e.key === 'Enter') { this.getypt.push({ soort: 'enter' }); e.preventDefault(); return; }
      if (e.key.length === 1 && !e.repeat) {
        this.getypt.push({ soort: 'teken', teken: e.key });
        e.preventDefault();
        return;
      }
      if (!e.code.startsWith('Arrow') && e.code !== 'Escape') return;
    }
    const knop = TOETSEN[e.code];
    if (!knop) return;
    e.preventDefault();
    if (e.repeat) return;
    this.bronnen.toets.add(knop);
    this.druk(knop);
  }

  toetsOmhoog(e) {
    const knop = TOETSEN[e.code];
    if (!knop) return;
    this.bronnen.toets.delete(knop);
    if (!this.bronnen.aanraak.has(knop)) this.laatLos(knop);
  }

  // ------------------------------------------------------------ algemeen

  druk(knop) {
    if (!this.vast.has(knop)) {
      this.vast.add(knop);
      this.wachtend.add(knop);
      this.ingedruktSinds[knop] = performance.now();
      this.laatsteHerhaal[knop] = performance.now();
    }
    if (RICHTINGEN.includes(knop)) {
      this.richtingStapel = this.richtingStapel.filter((r) => r !== knop);
      this.richtingStapel.push(knop);
    }
  }

  laatLos(knop) {
    this.vast.delete(knop);
    this.richtingStapel = this.richtingStapel.filter((r) => r !== knop);
  }

  reset() {
    this.vast.clear();
    this.nieuw.clear();
    this.wachtend.clear();
    this.richtingStapel = [];
    this.bronnen.toets.clear();
    this.bronnen.aanraak.clear();
    this.getypt = [];
    document.querySelectorAll('.ingedrukt').forEach((el) => el.classList.remove('ingedrukt'));
    const dpad = document.getElementById('dpad');
    if (dpad) dpad.removeAttribute('data-richting');
  }

  /** Is de knop op dit moment ingedrukt? */
  ingedrukt(knop) {
    return this.vast.has(knop);
  }

  /** Werd de knop deze frame ingedrukt? Telt maar één keer per frame. */
  net(knop) {
    if (this.nieuw.has(knop) && !this.verbruikt.has(knop)) {
      this.verbruikt.add(knop);
      return true;
    }
    return false;
  }

  /** Voor menu's: true bij indrukken en daarna herhaald zolang de knop vast blijft. */
  herhaal(knop) {
    if (this.net(knop)) return true;
    if (!this.vast.has(knop) || this.verbruikt.has(knop)) return false;
    const nu = performance.now();
    if (nu - this.ingedruktSinds[knop] > HERHAAL_VERTRAGING && nu - this.laatsteHerhaal[knop] > HERHAAL_INTERVAL) {
      this.laatsteHerhaal[knop] = nu;
      this.verbruikt.add(knop);
      return true;
    }
    return false;
  }

  /** De richting die nu wordt vastgehouden (laatst ingedrukte wint). */
  richting() {
    return this.richtingStapel.length ? this.richtingStapel[this.richtingStapel.length - 1] : null;
  }

  vastSinds(knop) {
    return this.vast.has(knop) ? performance.now() - this.ingedruktSinds[knop] : 0;
  }

  leegGetypt() {
    const lijst = this.getypt;
    this.getypt = [];
    return lijst;
  }

  /**
   * Wordt aan het begin van elke frame aangeroepen. Knoppen die sinds de vorige frame
   * zijn ingedrukt, gelden deze hele frame (inclusief afgeronde promises) als 'net ingedrukt'.
   */
  beginFrame() {
    this.nieuw = this.wachtend;
    this.wachtend = new Set();
    this.verbruikt.clear();
  }

  // ------------------------------------------------------------ aanraakknoppen

  koppelAanraakknoppen() {
    document.querySelectorAll('#besturing [data-knop]').forEach((el) => {
      const knop = el.dataset.knop;
      const omlaag = (e) => {
        e.preventDefault();
        el.setPointerCapture?.(e.pointerId);
        el.classList.add('ingedrukt');
        this.bronnen.aanraak.add(knop);
        this.druk(knop);
        if (navigator.vibrate) navigator.vibrate(8);
      };
      const omhoog = (e) => {
        e.preventDefault();
        el.classList.remove('ingedrukt');
        this.bronnen.aanraak.delete(knop);
        if (!this.bronnen.toets.has(knop)) this.laatLos(knop);
      };
      el.addEventListener('pointerdown', omlaag);
      el.addEventListener('pointerup', omhoog);
      el.addEventListener('pointercancel', omhoog);
      el.addEventListener('lostpointercapture', omhoog);
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    const dpad = document.getElementById('dpad');
    if (!dpad) return;
    let actief = null;
    const zetRichting = (r) => {
      if (r === actief) return;
      if (actief) {
        this.bronnen.aanraak.delete(actief);
        if (!this.bronnen.toets.has(actief)) this.laatLos(actief);
      }
      actief = r;
      if (r) {
        this.bronnen.aanraak.add(r);
        this.druk(r);
        dpad.dataset.richting = r;
        if (navigator.vibrate) navigator.vibrate(6);
      } else {
        dpad.removeAttribute('data-richting');
      }
    };
    const bereken = (e) => {
      const box = dpad.getBoundingClientRect();
      const dx = e.clientX - (box.left + box.width / 2);
      const dy = e.clientY - (box.top + box.height / 2);
      if (Math.hypot(dx, dy) < box.width * 0.1) return null;
      if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'rechts' : 'links';
      return dy > 0 ? 'omlaag' : 'omhoog';
    };
    dpad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      dpad.setPointerCapture?.(e.pointerId);
      zetRichting(bereken(e));
    });
    dpad.addEventListener('pointermove', (e) => {
      if (actief !== null || e.buttons) zetRichting(bereken(e));
    });
    const los = (e) => {
      e.preventDefault();
      zetRichting(null);
    };
    dpad.addEventListener('pointerup', los);
    dpad.addEventListener('pointercancel', los);
    dpad.addEventListener('lostpointercapture', los);
    dpad.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

export const invoer = new Invoer();
