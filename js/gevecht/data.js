// Vijanden en aanvallen voor de gevechten.

export const AANVALLEN = {
  soeplepel: {
    naam: 'SOEPLEPELSLAG',
    soort: 'SLAG',
    kracht: 6,
    nauwkeurigheid: 95,
    animatie: 'lepel',
    uitleg: 'Een flinke klap met de soeplepel.',
  },
  volkszanger: {
    naam: 'VOLKSZANGER',
    soort: 'MUZIEK',
    kracht: 0,
    nauwkeurigheid: 100,
    animatie: 'zanger',
    effect: 'verward',
    uitleg: 'Sepp zingt; de vijand raakt in de war en mist vaker.',
  },
  p38: {
    naam: 'WALTHER P38',
    kracht: 8,
    nauwkeurigheid: 70,
    animatie: 'schot',
    misTekst: 'Maar het schot mist!',
  },
  mes: {
    naam: 'MESJE',
    kracht: 4,
    nauwkeurigheid: 95,
    animatie: 'mes',
    misTekst: 'Maar {BEER} duikt op tijd weg!',
  },
};

export const VIJANDEN = {
  klaus: {
    naam: 'WACHTER KLAUS',
    sprite: 'gevecht_wachter_klaus',
    niveau: 4,
    maxGz: 16,
    aanval: 4,
    verdediging: 4,
    snelheid: 4,
    xp: 50,
    aanvallen: [['p38', 55], ['mes', 45]],
  },
  dieter: {
    naam: 'WACHTER DIETER',
    sprite: 'gevecht_wachter_dieter',
    niveau: 6,
    maxGz: 22,
    aanval: 5,
    verdediging: 5,
    snelheid: 5,
    xp: 60,
    aanvallen: [['p38', 60], ['mes', 40]],
  },
};

export const ZANGER = {
  naam: 'SEPP SCHUNKELHUBER',
  liedjes: [
    "'Heidi, Heidi, Hollandaise'",
    "'Mein Herz ist ein Akkordeon'",
    "'Zwei Bier und eine Polonaise'",
    "'Jodelen in de Jachthaven'",
  ],
};

/** Schade volgens een eenvoudige versie van de klassieke formule. */
export function berekenSchade(niveau, kracht, aanval, verdediging) {
  let basis = Math.floor(((2 * niveau / 5 + 2) * kracht * aanval / Math.max(1, verdediging)) / 10) + 2;
  const voltreffer = Math.random() < 1 / 16;
  if (voltreffer) basis = Math.floor(basis * 1.5);
  const schade = Math.max(1, Math.round(basis * (0.85 + Math.random() * 0.15)));
  return { schade, voltreffer };
}
