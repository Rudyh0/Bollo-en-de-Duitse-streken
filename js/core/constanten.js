// Het spel tekent op een GBA-achtig raster van 240x160 pixels.
// Intern renderen we drie keer zo groot, zodat het opschalen naar het scherm scherp blijft.
export const BREEDTE = 240;
export const HOOGTE = 160;
export const SCHAAL = 3;
export const TEGEL = 16;

export const RICHTINGEN = {
  omlaag: { dx: 0, dy: 1, frame: 0 },
  omhoog: { dx: 0, dy: -1, frame: 1 },
  links: { dx: -1, dy: 0, frame: 2 },
  rechts: { dx: 1, dy: 0, frame: 3 },
};

export const TEGENOVER = { omlaag: 'omhoog', omhoog: 'omlaag', links: 'rechts', rechts: 'links' };

export const OPSLAG_SLEUTELS = {
  instellingen: 'duitse-streken:instellingen',
  namen: 'duitse-streken:namen',
  spel: 'duitse-streken:opslag-1',
};

export const VERSIE = '1.0.0';

/** Zet de camera van een scène op het 240x160-raster. */
export function zetCamera(scene) {
  const cam = scene.cameras.main;
  cam.setZoom(SCHAAL);
  cam.centerOn(BREEDTE / 2, HOOGTE / 2);
  cam.setRoundPixels(true);
  return cam;
}
