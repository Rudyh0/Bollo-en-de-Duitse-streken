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
import dorp from './dorp.js';
import dorpScripts from './dorp-scripts.js';
import { coffeeshop, hut1, hut2, hut3 } from './binnen-dorp.js';
import { coffeeshopScripts, hut1Scripts, hut2Scripts, hut3Scripts } from './binnen-dorp-scripts.js';
import { n34a, n34b, n34c, tankstation } from './n34.js';
import { n34aScripts, n34bScripts, n34cScripts, tankstationScripts } from './n34-scripts.js';
import { wezup, kruidenier, bakkerij, slagerij, achterkamer } from './wezup.js';
import {
  wezupScripts, kruidenierScripts, bakkerijScripts, slagerijScripts, achterkamerScripts,
} from './wezup-scripts.js';

export const KAARTEN = {
  barak,
  plein,
  bos1,
  bos2,
  bos3,
  dorp,
  coffeeshop,
  hut1,
  hut2,
  hut3,
  n34a,
  n34b,
  n34c,
  tankstation,
  wezup,
  kruidenier,
  bakkerij,
  slagerij,
  achterkamer,
};

export const SCRIPTS = {
  barak: barakScripts,
  plein: pleinScripts,
  bos1: bos1Scripts,
  bos2: bos2Scripts,
  bos3: bos3Scripts,
  dorp: dorpScripts,
  coffeeshop: coffeeshopScripts,
  hut1: hut1Scripts,
  hut2: hut2Scripts,
  hut3: hut3Scripts,
  n34a: n34aScripts,
  n34b: n34bScripts,
  n34c: n34cScripts,
  tankstation: tankstationScripts,
  wezup: wezupScripts,
  kruidenier: kruidenierScripts,
  bakkerij: bakkerijScripts,
  slagerij: slagerijScripts,
  achterkamer: achterkamerScripts,
};
