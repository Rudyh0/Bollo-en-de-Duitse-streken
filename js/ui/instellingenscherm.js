// Instellingen: tekstsnelheid, volume, aanraakknoppen, rennen en (vanuit het titelscherm) namen.
import { kader, tekst, breekAf } from './tekst.js';
import { instellingen, zet, TEKSTSNELHEDEN, KNOP_OPTIES } from '../core/instellingen.js';
import { namenVast } from '../core/namen.js';
import { audio } from '../core/audio.js';
import { BREEDTE, HOOGTE } from '../core/constanten.js';

const RIJ_H = 12;

function rijen(vanuitSpel) {
  const lijst = [
    { id: 'tekstsnelheid', label: 'TEKSTSNELHEID', uitleg: 'Hoe snel de tekst verschijnt. Houd A ingedrukt om sneller te lezen.' },
    { id: 'muziek', label: 'MUZIEK', balk: true, uitleg: 'Volume van de muziek. Pas aan met links en rechts.' },
    { id: 'effecten', label: 'GELUIDSEFFECTEN', balk: true, uitleg: 'Volume van de geluidseffecten. Pas aan met links en rechts.' },
    { id: 'knoppen', label: 'KNOPPEN OP SCHERM', uitleg: 'Aanraakknoppen. AUTOMATISCH toont ze alleen op telefoon en tablet.' },
    { id: 'altijdRennen', label: 'ALTIJD RENNEN', uitleg: 'Altijd rennen. Staat dit uit, houd dan B ingedrukt om te rennen.' },
  ];
  if (!vanuitSpel && !namenVast()) {
    lijst.push({ id: 'namen', label: 'NAMEN WIJZIGEN', uitleg: 'Kies een nieuwe naam voor het vakantiepark en de beer.' });
  }
  lijst.push({ id: 'terug', label: 'TERUG', uitleg: 'Toetsen: pijltjes of WASD, Z/Enter = A, X/Backspace = B, Esc = START.' });
  return lijst;
}

function waardeTekst(id) {
  switch (id) {
    case 'tekstsnelheid': return TEKSTSNELHEDEN.find((t) => t.id === instellingen.tekstsnelheid)?.naam || 'NORMAAL';
    case 'knoppen': return KNOP_OPTIES.find((k) => k.id === instellingen.knoppen)?.naam || 'AUTOMATISCH';
    case 'altijdRennen': return instellingen.altijdRennen ? 'AAN' : 'UIT';
    default: return '';
  }
}

function wijzig(id, richting) {
  if (id === 'tekstsnelheid') {
    const i = TEKSTSNELHEDEN.findIndex((t) => t.id === instellingen.tekstsnelheid);
    zet(id, TEKSTSNELHEDEN[(i + richting + TEKSTSNELHEDEN.length) % TEKSTSNELHEDEN.length].id);
  } else if (id === 'knoppen') {
    const i = KNOP_OPTIES.findIndex((k) => k.id === instellingen.knoppen);
    zet(id, KNOP_OPTIES[(i + richting + KNOP_OPTIES.length) % KNOP_OPTIES.length].id);
  } else if (id === 'altijdRennen') {
    zet(id, !instellingen.altijdRennen);
  } else if (id === 'muziek' || id === 'effecten') {
    const nieuw = Math.max(0, Math.min(10, instellingen[id] + richting));
    if (nieuw === instellingen[id]) return false;
    zet(id, nieuw);
  } else {
    return false;
  }
  return true;
}

/** Opent het instellingenscherm. Geeft 'namen' terug als de speler de namen wil wijzigen. */
export async function openInstellingen(ui, { vanuitSpel = false } = {}) {
  ui.sluitDialoog();
  audio.sfx('ok');
  const d = 700;
  const objecten = [];
  const voeg = (o, diepte = d) => { o.setDepth(diepte); objecten.push(o); return o; };
  voeg(ui.add.tileSprite(0, 0, BREEDTE, HOOGTE, 'patroon').setOrigin(0, 0));
  voeg(kader(ui, 2, 2, 236, 22, 'menu'));
  voeg(tekst(ui, 10, 8, 'INSTELLINGEN'), d + 1);
  voeg(kader(ui, 2, 122, 236, 36, 'tekst'));
  const uitleg = [voeg(tekst(ui, 11, 129, ''), d + 1), voeg(tekst(ui, 11, 142, ''), d + 1)];
  const balken = voeg(ui.add.graphics(), 720);

  const lijstRijen = rijen(vanuitSpel);
  const opties = lijstRijen.map((r) => ({ label: r.label, rechts: r.balk ? ' ' : waardeTekst(r.id) || ' ' }));
  let lijstObj = null;

  const tekenBalken = () => {
    balken.clear();
    if (!lijstObj) return;
    lijstRijen.forEach((r, i) => {
      if (!r.balk) return;
      const y = lijstObj.y + 9 + i * RIJ_H;
      const x0 = 238 - 10 - 59;
      for (let s = 0; s < 10; s++) {
        const aan = s < instellingen[r.id];
        balken.fillStyle(aan ? 0x5878d0 : 0xd0d4dc).fillRect(x0 + s * 6, y + 1, 5, 5);
        if (aan) balken.fillStyle(0x88a8f0).fillRect(x0 + s * 6, y + 1, 5, 1);
      }
    });
  };

  const verwerk = (i, richting, lijst) => {
    const r = lijstRijen[i];
    if (!wijzig(r.id, richting)) return false;
    if (r.id === 'effecten') audio.sfx('kies');
    else audio.sfx('trekje');
    lijst.zetRechts(i, r.balk ? ' ' : waardeTekst(r.id));
    tekenBalken();
    return true;
  };

  try {
    const keuze = await ui.kies(opties, {
      x: 2, y: 26, breedte: 236, regelhoogte: RIJ_H, annuleer: lijstRijen.length - 1, diepte: 710, startSluit: true,
      opVerander: (i, lijst) => {
        lijstObj = lijst;
        const regels = breekAf(ui, lijstRijen[i].uitleg, 216);
        uitleg[0].setText(regels[0] || '');
        uitleg[1].setText(regels[1] || '');
        tekenBalken();
      },
      opLinksRechts: (i, richting, lijst) => verwerk(i, richting, lijst),
      opA: (i, lijst) => {
        const id = lijstRijen[i].id;
        if (id === 'terug' || id === 'namen') return false;
        verwerk(i, 1, lijst);
        return true;
      },
    });
    return lijstRijen[keuze].id === 'namen' ? 'namen' : null;
  } finally {
    objecten.forEach((o) => o.destroy());
  }
}
