// Eigen gecomponeerde chiptunes.
// Notatie per kanaal: "NOOT:DUUR" in zestiende noten, "-" is een rust.
// Golven: puls12 / puls25 / puls50 (blokgolven), driehoek, ruis (K = kick, S = snare, H = hihat).

const maat = (patroon, n) => Array(n).fill(patroon).join(' ');

export const LIEDJES = {
  titel: {
    bpm: 132,
    kanalen: [
      {
        golf: 'puls25', volume: 0.2, vibrato: true,
        noten: `
          G4:4 C5:4 E5:6 D5:2  C5:4 G4:4 E4:8  F4:4 A4:4 C5:6 B4:2  A4:4 G4:4 -:4 G4:2 G4:2
          C5:4 E5:4 G5:6 F5:2  E5:4 D5:4 C5:4 A4:4  F5:4 E5:4 D5:4 B4:4  C5:8 -:4 G4:4
          A4:4 C5:4 E5:4 C5:4  F5:6 E5:2 D5:4 C5:4  B4:4 D5:4 G5:4 D5:4  E5:8 C5:8
          A4:4 C5:4 E5:4 A5:4  F5:4 E5:4 D5:4 C5:4  D5:4 E5:2 F5:2 G5:4 B4:4  C5:12 -:4`,
      },
      {
        golf: 'puls50', volume: 0.08,
        noten: `
          E4:8 G4:8  E4:8 C4:8  A4:8 F4:8  B3:8 D4:8  G4:8 E4:8  E4:8 C4:8  D4:8 B3:8  E4:8 C4:8
          C4:8 E4:8  A4:8 F4:8  D4:8 B3:8  G4:8 E4:8  C4:8 E4:8  A4:8 F4:8  B3:8 D4:8  E4:8 G4:8`,
      },
      {
        golf: 'driehoek', volume: 0.34, legato: 0.8,
        noten: `
          C3:4 G2:4 C3:4 G2:4  C3:4 G2:4 C3:4 E3:4  F2:4 C3:4 F2:4 C3:4  G2:4 D3:4 G2:4 B2:4
          C3:4 G2:4 C3:4 G2:4  A2:4 E3:4 A2:4 E3:4  G2:4 D3:4 G2:4 B2:4  C3:4 G2:4 C3:4 G2:4
          A2:4 E3:4 A2:4 E3:4  F2:4 C3:4 F2:4 C3:4  G2:4 D3:4 G2:4 D3:4  C3:4 G2:4 C3:4 G2:4
          A2:4 E3:4 A2:4 E3:4  F2:4 C3:4 F2:4 C3:4  G2:4 D3:4 G2:4 B2:4  C3:4 G2:4 C3:8`,
      },
      { golf: 'ruis', volume: 0.22, noten: maat('K:2 H:2 S:2 H:2 K:2 H:2 S:2 H:2', 16) },
    ],
  },

  intro: {
    bpm: 96,
    kanalen: [
      {
        golf: 'puls50', volume: 0.15, vibrato: true,
        noten: `
          A4:6 C5:2 A4:4 F4:4  D5:6 C5:2 Bb4:4 G4:4  A4:4 C5:4 F5:6 E5:2  D5:4 C5:4 Bb4:4 G4:4
          A4:6 C5:2 A4:4 F4:4  D5:6 F5:2 D5:4 Bb4:4  C5:4 E5:4 G5:4 E5:4  F5:12 -:4`,
      },
      {
        golf: 'puls12', volume: 0.06, legato: 0.6,
        noten: `
          ${maat('F4:2 A4:2 C5:2 A4:2', 2)}  ${maat('F4:2 Bb4:2 D5:2 Bb4:2', 2)}
          ${maat('F4:2 A4:2 C5:2 A4:2', 2)}  ${maat('E4:2 G4:2 Bb4:2 G4:2', 2)}
          ${maat('F4:2 A4:2 C5:2 A4:2', 2)}  ${maat('F4:2 Bb4:2 D5:2 Bb4:2', 2)}
          ${maat('E4:2 G4:2 C5:2 G4:2', 2)}  ${maat('F4:2 A4:2 C5:2 A4:2', 2)}`,
      },
      {
        golf: 'driehoek', volume: 0.3,
        noten: `F2:8 C3:8  Bb2:8 F2:8  F2:8 C3:8  C3:8 G2:8  F2:8 C3:8  Bb2:8 D3:8  C3:8 E3:8  F2:8 C3:4 F2:4`,
      },
      { golf: 'ruis', volume: 0.1, noten: maat('H:4 H:2 H:2', 16) },
    ],
  },

  barak: {
    bpm: 92,
    kanalen: [
      {
        golf: 'puls25', volume: 0.14, vibrato: true,
        noten: `
          E4:4 A4:4 C5:4 B4:4  A4:8 -:4 E4:4  F4:4 A4:4 D5:4 C5:4  B4:8 -:4 G#4:4
          A4:4 C5:4 E5:4 D5:4  C5:6 B4:2 A4:8  D5:4 C5:4 B4:4 G#4:4  A4:12 -:4
          -:4 E5:2 D5:2 C5:4 A4:4  B4:4 G#4:4 E4:8  -:4 F5:2 E5:2 D5:4 B4:4  C5:4 A4:4 E4:8
          D4:4 F4:4 A4:4 D5:4  C5:4 B4:4 A4:4 G#4:4  A4:4 B4:4 C5:4 D5:4  E5:12 -:4`,
      },
      {
        golf: 'puls12', volume: 0.06, legato: 1,
        noten: `
          C4:16 C4:16 F4:16 E4:16 C4:16 A3:16 F4:8 E4:8 C4:16
          C4:16 E4:16 D4:16 C4:16 F4:16 E4:16 E4:16 G#4:16`,
      },
      {
        golf: 'driehoek', volume: 0.3, legato: 0.75,
        noten: `
          A2:4 E3:4 A2:4 E3:4  A2:4 E3:4 A2:4 E3:4  D3:4 A2:4 D3:4 A2:4  E2:4 B2:4 E2:4 G#2:4
          A2:4 E3:4 A2:4 E3:4  F2:4 C3:4 F2:4 C3:4  D3:4 A2:4 E2:4 G#2:4  A2:4 E3:4 A2:8
          A2:4 E3:4 A2:4 E3:4  E2:4 B2:4 E2:4 B2:4  D3:4 A2:4 D3:4 A2:4  A2:4 E3:4 A2:4 E3:4
          D3:4 A2:4 D3:4 A2:4  E2:4 B2:4 E2:4 G#2:4  F2:4 C3:4 F2:4 C3:4  E2:4 B2:4 E2:4 G#2:4`,
      },
      { golf: 'ruis', volume: 0.12, noten: maat('K:4 H:4 H:4 H:4', 16) },
    ],
  },

  plein: {
    bpm: 104,
    kanalen: [
      {
        golf: 'puls25', volume: 0.14, vibrato: true,
        noten: `
          D4:4 F4:4 A4:6 G4:2  F4:4 E4:4 D4:8  F4:4 Bb4:4 D5:6 C5:2  Bb4:2 A4:2 G4:4 A4:8
          D5:4 C5:4 A4:6 F4:2  G4:4 Bb4:4 D5:8  C#5:4 E5:4 D5:4 C#5:4  D5:12 -:4`,
      },
      { golf: 'puls12', volume: 0.06, legato: 1, noten: 'F4:16 F4:16 D4:16 C#4:16 F4:16 Bb3:16 C#4:16 F4:16' },
      {
        golf: 'driehoek', volume: 0.3, legato: 0.8,
        noten: `
          D3:4 A2:4 D3:4 A2:4  D3:4 A2:4 D3:4 A2:4  Bb2:4 F2:4 Bb2:4 F2:4  A2:4 E2:4 A2:4 E2:4
          D3:4 A2:4 D3:4 A2:4  G2:4 D2:4 G2:4 D2:4  A2:4 E2:4 A2:4 E2:4  D3:4 A2:4 D3:8`,
      },
      { golf: 'ruis', volume: 0.14, noten: maat('K:4 S:2 S:2 K:4 S:4', 8) },
    ],
  },

  gevecht: {
    bpm: 156,
    kanalen: [
      {
        golf: 'puls25', volume: 0.15, vibrato: true,
        noten: `
          E5:2 -:2 E5:2 G5:2 F#5:2 E5:2 D5:2 B4:2  E5:6 B4:2 G4:4 B4:4
          C5:2 -:2 C5:2 E5:2 D5:2 C5:2 B4:2 G4:2  A4:6 B4:2 C5:4 D5:4
          E5:2 -:2 E5:2 G5:2 A5:2 G5:2 F#5:2 E5:2  G5:6 F#5:2 E5:4 B4:4
          C5:4 E5:4 D5:4 C5:4  B4:8 D#5:4 F#5:4`,
      },
      { golf: 'puls50', volume: 0.06, legato: 1, noten: 'B4:16 G4:16 G4:16 F#4:16 B4:16 B4:16 E4:16 D#4:16' },
      {
        golf: 'driehoek', volume: 0.32, legato: 0.7,
        noten: `
          ${maat('E2:2 E3:2', 4)} ${maat('E2:2 E3:2', 4)} ${maat('C2:2 C3:2', 4)} ${maat('D2:2 D3:2', 4)}
          ${maat('E2:2 E3:2', 4)} ${maat('E2:2 E3:2', 4)} ${maat('C2:2 C3:2', 4)} ${maat('B1:2 B2:2', 4)}`,
      },
      { golf: 'ruis', volume: 0.2, noten: maat('K:2 H:2 S:2 H:2 K:2 K:2 S:2 H:2', 8) },
    ],
  },

  overwinning: {
    bpm: 132,
    kanalen: [
      {
        golf: 'puls50', volume: 0.15,
        noten: 'C5:2 E5:2 G5:2 C6:6 -:4  A5:2 G5:2 F5:2 E5:2 D5:4 G4:4  C5:2 E5:2 G5:2 C6:4 E6:2 D6:2 C6:2  B5:4 G5:4 C6:8',
      },
      { golf: 'puls25', volume: 0.07, legato: 1, noten: 'E4:16 F4:8 B3:8 E4:16 D4:8 E4:8' },
      { golf: 'driehoek', volume: 0.3, noten: 'C3:4 G2:4 C3:4 G2:4  F2:4 C3:4 G2:4 B2:4  C3:4 G2:4 E3:4 G2:4  G2:4 D3:4 C3:8' },
      { golf: 'ruis', volume: 0.14, noten: maat('K:4 S:4 K:4 S:4', 4) },
    ],
  },

  bos: {
    bpm: 88,
    kanalen: [
      {
        golf: 'puls25', volume: 0.13, vibrato: true,
        noten: `
          E4:6 G4:2 B4:4 A4:4  G4:4 F#4:4 E4:8  D4:6 E4:2 F#4:4 A4:4  G4:4 F#4:4 D4:8
          E4:4 G4:4 B4:4 E5:4  D5:6 C5:2 B4:4 A4:4  C5:4 B4:4 A4:4 F#4:4  E4:12 -:4`,
      },
      { golf: 'puls12', volume: 0.05, legato: 1, noten: 'G3:16 G3:16 F#3:16 F#3:16 G3:16 B3:16 C4:16 B3:16' },
      {
        golf: 'driehoek', volume: 0.3, legato: 0.7,
        noten: `
          E2:4 B2:4 E3:4 B2:4  E2:4 B2:4 E3:4 B2:4  D2:4 A2:4 D3:4 A2:4  D2:4 A2:4 D3:4 F#2:4
          E2:4 B2:4 E3:4 B2:4  G2:4 D3:4 G3:4 D3:4  A2:4 E3:4 A2:4 B2:4  E2:4 B2:4 E2:8`,
      },
      { golf: 'ruis', volume: 0.08, noten: maat('K:4 H:4 H:4 H:4', 8) },
    ],
  },

  kikker: {
    bpm: 112,
    kanalen: [
      {
        golf: 'puls50', volume: 0.12,
        noten: `
          C5:2 -:2 A4:2 C5:2 -:2 A4:2 G4:4  F4:2 G4:2 A4:2 C5:4 A4:2 -:4
          Bb4:2 -:2 G4:2 Bb4:2 -:2 G4:2 F4:4  E4:2 F4:2 G4:2 C5:6 -:4
          C5:2 -:2 A4:2 C5:2 D5:2 C5:2 A4:4  F5:4 E5:2 D5:2 C5:4 A4:4
          Bb4:2 A4:2 G4:2 Bb4:2 A4:2 G4:2 E4:4  F4:8 -:4 C4:2 C4:2`,
      },
      {
        golf: 'puls12', volume: 0.05, legato: 0.5,
        noten: `
          ${maat('-:2 A4:2', 4)} ${maat('-:2 A4:2', 4)} ${maat('-:2 Bb4:2', 4)} ${maat('-:2 G4:2', 4)}
          ${maat('-:2 A4:2', 4)} ${maat('-:2 F4:2', 4)} ${maat('-:2 Bb4:2', 2)} ${maat('-:2 G4:2', 2)} ${maat('-:2 A4:2', 4)}`,
      },
      {
        golf: 'driehoek', volume: 0.32, legato: 0.5,
        noten: `
          F2:2 -:2 F3:2 -:2 C3:2 -:2 F3:2 E3:2  F2:2 -:2 F3:2 -:2 C3:2 -:2 F3:2 E3:2
          G2:2 -:2 G3:2 -:2 D3:2 -:2 G3:2 F3:2  C3:2 -:2 C3:2 -:2 G2:2 -:2 Bb2:2 B2:2
          F2:2 -:2 F3:2 -:2 C3:2 -:2 F3:2 E3:2  D3:2 -:2 D3:2 -:2 A2:2 -:2 D3:2 C3:2
          G2:2 -:2 D3:2 -:2 C3:2 -:2 G2:2 -:2  F2:2 -:2 C3:2 -:2 F2:4 C3:2 E3:2`,
      },
      { golf: 'ruis', volume: 0.12, noten: maat('K:4 S:2 H:2 K:2 K:2 S:4', 8) },
    ],
  },

  dorp: {
    bpm: 116,
    kanalen: [
      {
        golf: 'puls25', volume: 0.13, vibrato: true,
        noten: `
          G4:4 B4:2 D5:2 G5:4 D5:4  E5:4 C5:2 E5:2 D5:8  C5:4 A4:2 C5:2 B4:4 G4:4  A4:4 F#4:2 A4:2 G4:8
          G4:4 B4:2 D5:2 G5:4 F#5:2 E5:2  D5:4 E5:2 F#5:2 G5:8  E5:2 D5:2 C5:2 B4:2 A4:4 D5:4  G4:12 -:4`,
      },
      { golf: 'puls12', volume: 0.05, legato: 1, noten: 'B3:8 B3:8 C4:8 B3:8 C4:8 B3:8 A3:8 B3:8 B3:8 B3:8 A3:8 B3:8 C4:8 A3:8 B3:16' },
      {
        golf: 'driehoek', volume: 0.3, legato: 0.6,
        noten: `
          G2:4 D3:4 G2:4 D3:4  C3:4 G2:4 G2:4 D3:4  A2:4 E3:4 G2:4 D3:4  D3:4 A2:4 G2:4 D3:4
          G2:4 D3:4 G2:4 D3:4  D3:4 A2:4 G2:4 D3:4  C3:4 G2:4 D3:4 A2:4  G2:4 D3:4 G2:8`,
      },
      { golf: 'ruis', volume: 0.1, noten: maat('K:4 H:4 S:4 H:4', 8) },
    ],
  },

  // 8-bit reggae in de coffeeshop (one drop)
  reggae: {
    bpm: 74,
    kanalen: [
      {
        golf: 'puls50', volume: 0.11, vibrato: true,
        noten: `
          E5:6 C5:2 A4:8  -:4 E5:2 G5:2 E5:4 C5:4  D5:6 B4:2 G4:8  -:4 D5:2 E5:2 D5:4 B4:4
          C5:6 A4:2 F4:8  -:4 A4:2 C5:2 F5:4 E5:4  D5:4 B4:4 D5:4 G5:4  E5:8 D5:4 B4:4`,
      },
      {
        golf: 'puls25', volume: 0.07, legato: 0.35,
        noten: `
          ${maat('-:4 E5:2 -:6 E5:2 -:2', 2)} ${maat('-:4 D5:2 -:6 D5:2 -:2', 2)}
          ${maat('-:4 C5:2 -:6 C5:2 -:2', 2)} ${maat('-:4 D5:2 -:6 D5:2 -:2', 2)}`,
      },
      {
        golf: 'puls12', volume: 0.05, legato: 0.35,
        noten: `
          ${maat('-:4 C5:2 -:6 C5:2 -:2', 2)} ${maat('-:4 B4:2 -:6 B4:2 -:2', 2)}
          ${maat('-:4 A4:2 -:6 A4:2 -:2', 2)} ${maat('-:4 B4:2 -:6 B4:2 -:2', 2)}`,
      },
      {
        golf: 'driehoek', volume: 0.36, legato: 0.8,
        noten: `
          ${maat('-:2 A2:4 C3:2 E3:4 D3:2 C3:2', 2)} ${maat('-:2 G2:4 B2:2 D3:4 C3:2 B2:2', 2)}
          ${maat('-:2 F2:4 A2:2 C3:4 B2:2 A2:2', 2)} ${maat('-:2 G2:4 B2:2 D3:4 C3:2 B2:2', 2)}`,
      },
      { golf: 'ruis', volume: 0.1, noten: maat('H:2 H:2 H:2 H:2 K:2 H:2 S:2 H:2', 8) },
    ],
  },

  // gevecht tegen de jongens met de fatbikes
  straat: {
    bpm: 140,
    kanalen: [
      {
        golf: 'puls12', volume: 0.12,
        noten: `
          G5:2 -:2 Eb5:2 -:2 C5:2 -:2 D5:2 Eb5:2  C5:2 -:2 Ab4:2 -:2 C5:2 Eb5:2 -:4
          D5:2 -:2 Bb4:2 -:2 D5:2 -:2 F5:2 D5:2  B4:2 -:2 D5:2 -:2 G5:4 F5:2 D5:2
          G5:2 -:2 Eb5:2 -:2 C5:2 -:2 D5:2 Eb5:2  C5:2 -:2 Ab4:2 -:2 C5:2 Eb5:2 -:4
          D5:2 -:2 Bb4:2 -:2 D5:2 -:2 F5:2 D5:2  G5:2 F5:2 Eb5:2 D5:2 B4:8`,
      },
      { golf: 'puls50', volume: 0.04, legato: 1, noten: 'Eb4:16 C4:16 D4:16 D4:16 Eb4:16 C4:16 D4:16 D4:16' },
      {
        golf: 'driehoek', volume: 0.42, legato: 0.9,
        noten: `
          C2:6 C2:2 -:2 C2:2 Eb2:4  Ab1:6 Ab1:2 -:2 Ab1:2 C2:4  Bb1:6 Bb1:2 -:2 Bb1:2 D2:4  G1:6 G1:2 -:2 G1:2 B1:4
          C2:6 C2:2 -:2 C2:2 Eb2:4  Ab1:6 Ab1:2 -:2 Ab1:2 C2:4  Bb1:6 Bb1:2 -:2 Bb1:2 D2:4  G1:6 G1:2 -:2 G1:2 B1:4`,
      },
      { golf: 'ruis', volume: 0.16, noten: maat('K:2 H:1 H:1 H:2 H:2 S:2 H:1 H:1 H:1 H:1 H:2', 8) },
    ],
  },

  // ---- korte jingles (worden één keer gespeeld)
  onderduiker: {
    bpm: 120,
    herhaal: false,
    kanalen: [
      { golf: 'puls25', volume: 0.16, noten: 'E5:2 D#5:2 E5:2 B4:2 C5:4 A4:6' },
      { golf: 'driehoek', volume: 0.3, noten: 'A2:4 E2:4 A2:10' },
    ],
  },
  aanval: {
    bpm: 150,
    herhaal: false,
    kanalen: [
      { golf: 'puls50', volume: 0.2, noten: 'G4:2 C5:2 E5:2 G5:4 E5:2 G5:8' },
      { golf: 'puls25', volume: 0.1, noten: 'E4:2 G4:2 C5:2 E5:4 C5:2 E5:8' },
      { golf: 'driehoek', volume: 0.3, noten: 'C3:4 G2:4 C3:12' },
      { golf: 'ruis', volume: 0.15, noten: 'K:4 S:4 K:4 S:4 K:4' },
    ],
  },
  item: {
    bpm: 150,
    herhaal: false,
    kanalen: [
      { golf: 'puls50', volume: 0.2, noten: 'E5:2 G5:2 C6:4 B5:2 C6:6' },
      { golf: 'puls25', volume: 0.12, noten: 'C5:2 E5:2 G5:4 G5:2 E5:6' },
      { golf: 'driehoek', volume: 0.3, noten: 'C4:4 G3:4 C3:8' },
    ],
  },
  opslaan: {
    bpm: 160,
    herhaal: false,
    kanalen: [
      { golf: 'puls50', volume: 0.18, noten: 'C5:2 E5:2 G5:2 C6:6' },
      { golf: 'driehoek', volume: 0.3, noten: 'C3:6 G3:6' },
    ],
  },
  volkszanger: {
    bpm: 180,
    herhaal: false,
    kanalen: [
      { golf: 'puls50', volume: 0.17, noten: 'C5:4 A4:4 C5:4  F5:8 E5:4  D5:2 E5:2 F5:2 D5:2 C5:4  F5:8 -:4' },
      { golf: 'puls25', volume: 0.08, noten: 'A4:4 F4:4 A4:4  A4:8 G4:4  Bb4:2 C5:2 D5:2 Bb4:2 A4:4  A4:8 -:4' },
      { golf: 'driehoek', volume: 0.32, noten: 'F2:4 -:8  C3:4 -:8  C2:4 -:8  F2:4 -:8' },
      { golf: 'puls12', volume: 0.07, noten: '-:4 A3:2 -:2 A3:2 -:2  -:4 A3:2 -:2 A3:2 -:2  -:4 Bb3:2 -:2 Bb3:2 -:2  -:4 A3:2 -:2 A3:2 -:2' },
    ],
  },
  niveau: {
    bpm: 180,
    herhaal: false,
    kanalen: [
      { golf: 'puls50', volume: 0.18, noten: 'C5:1 E5:1 G5:1 C6:3 G5:1 C6:5' },
      { golf: 'puls25', volume: 0.08, noten: 'E4:1 G4:1 C5:1 E5:3 C5:1 E5:5' },
      { golf: 'driehoek', volume: 0.3, noten: 'C3:6 G2:6' },
    ],
  },
  herstel: {
    bpm: 170,
    herhaal: false,
    kanalen: [
      { golf: 'puls25', volume: 0.16, noten: 'C5:1 E5:1 G5:1 C6:1 E5:1 G5:1 C6:1 E6:5' },
      { golf: 'driehoek', volume: 0.25, noten: 'C3:4 G3:8' },
    ],
  },
};
