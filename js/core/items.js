// Alle voorwerpen die in de rugzak kunnen zitten.
// soort: 'gebruik' = kan gebruikt worden, 'sleutel' = belangrijk voorwerp voor een quest.
export const ITEMS = {
  voedselbon: {
    naam: 'VOEDSELBON',
    meervoud: 'VOEDSELBONNEN',
    icoon: 'icoon_voedselbon',
    soort: 'gebruik',
    herstel: 8,
    beschrijving: 'Een gestempelde bon voor een warme maaltijd. Herstelt 8 punten gezondheid.',
  },
  ritalin: {
    naam: 'RITALIN',
    meervoud: 'RITALIN',
    icoon: 'icoon_ritalin',
    soort: 'gebruik',
    prijs: 10,
    effect: { snel: 90000 },
    beschrijving: 'Een strip pillen van Kikker. Je gaat er een tijdje superhard van lopen.',
  },
  xtc: {
    naam: 'XTC',
    meervoud: 'XTC',
    icoon: 'icoon_xtc',
    soort: 'gebruik',
    prijs: 15,
    effect: { trip: 70000 },
    beschrijving: 'Een roze pilletje met een smiley. Alles wordt een tijdje heel erg mooi.',
  },
  '3mmc': {
    naam: '3MMC',
    meervoud: '3MMC',
    icoon: 'icoon_3mmc',
    soort: 'gebruik',
    prijs: 20,
    effect: { snel: 90000, trip: 90000 },
    beschrijving: "Een zakje wit poeder. Snel én alles is mooi. Kikker zei erbij: 'niet alles tegelijk'.",
  },
  soeplepel: {
    naam: 'SOEPLEPEL',
    meervoud: 'SOEPLEPELS',
    icoon: 'icoon_soeplepel',
    soort: 'sleutel',
    beschrijving: 'Een stevige metalen soeplepel uit de kampkeuken. Wie weet waar die nog goed voor is...',
  },
};

export function itemNaam(id, aantal = 1) {
  const item = ITEMS[id];
  if (!item) return id.toUpperCase();
  return aantal === 1 ? item.naam : item.meervoud;
}
