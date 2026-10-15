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
