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

  // ---- korte jingles (worden één keer gespeeld)
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
  herstel: {
    bpm: 170,
    herhaal: false,
    kanalen: [
      { golf: 'puls25', volume: 0.16, noten: 'C5:1 E5:1 G5:1 C6:1 E5:1 G5:1 C6:1 E6:5' },
      { golf: 'driehoek', volume: 0.25, noten: 'C3:4 G3:8' },
    ],
  },
};
