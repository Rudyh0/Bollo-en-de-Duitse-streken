// Overzicht van alle kaarten en hun scripts.
import barak from './barak.js';
import barakScripts from './barak-scripts.js';
import plein from './plein.js';
import pleinScripts from './plein-scripts.js';
import bos1 from './bos1.js';
import bos1Scripts from './bos1-scripts.js';
import bos2 from './bos2.js';
import bos2Scripts from './bos2-scripts.js';
import bos3 from './bos3.js';
import bos3Scripts from './bos3-scripts.js';

export const KAARTEN = {
  barak,
  plein,
  bos1,
  bos2,
  bos3,
};

export const SCRIPTS = {
  barak: barakScripts,
  plein: pleinScripts,
  bos1: bos1Scripts,
  bos2: bos2Scripts,
  bos3: bos3Scripts,
};
