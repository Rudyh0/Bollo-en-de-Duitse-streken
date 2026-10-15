// Startpunt van het spel.
import { BREEDTE, HOOGTE, SCHAAL } from './core/constanten.js';
import { invoer } from './core/invoer.js';
import { audio } from './core/audio.js';
import { instellingen, bijWijziging } from './core/instellingen.js';
import { werkTitelBij } from './core/namen.js';
import { BootScene } from './scenes/BootScene.js';
import { StartScene } from './scenes/StartScene.js';
import { SetupScene } from './scenes/SetupScene.js';
import { TitelScene } from './scenes/TitelScene.js';
import { IntroScene } from './scenes/IntroScene.js';
import { WereldScene } from './scenes/WereldScene.js';
import { UIScene } from './scenes/UIScene.js';

werkTitelBij();
invoer.start();
invoer.bijEersteInteractie(() => audio.ontgrendel());

function isAanraakApparaat() {
  return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || invoer.gebruiktAanraak;
}

let game = null;

function werkKnoppenBij() {
  const toon = instellingen.knoppen === 'aan' || (instellingen.knoppen === 'auto' && isAanraakApparaat());
  document.body.classList.toggle('toon-knoppen', toon);
  if (game) requestAnimationFrame(() => game.scale.refresh());
}

werkKnoppenBij();
bijWijziging((sleutel) => { if (sleutel === 'knoppen') werkKnoppenBij(); });
window.addEventListener('touchstart', () => {
  if (instellingen.knoppen === 'auto' && !document.body.classList.contains('toon-knoppen')) werkKnoppenBij();
}, { passive: true, once: true });

game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'spel',
  width: BREEDTE * SCHAAL,
  height: HOOGTE * SCHAAL,
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  input: {
    keyboard: false,
    gamepad: false,
  },
  disableContextMenu: true,
  banner: false,
  scene: [BootScene, StartScene, SetupScene, TitelScene, IntroScene, WereldScene, UIScene],
});

game.events.on('prestep', () => invoer.beginFrame());
window.addEventListener('resize', () => game.scale.refresh());
window.addEventListener('orientationchange', () => setTimeout(() => game.scale.refresh(), 200));

// Handig bij het testen in de console.
window.spel = game;
