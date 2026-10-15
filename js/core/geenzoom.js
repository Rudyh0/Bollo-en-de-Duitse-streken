// Voorkomt dat de pagina op telefoons inzoomt (dubbeltik, knijpen, snel achter elkaar tikken).
// iOS negeert 'user-scalable=no' in de viewport, dus we houden de gebaren hier zelf tegen.
export function blokkeerZoom() {
  const tegenhouden = (e) => { if (e.cancelable) e.preventDefault(); };

  // Safari: knijpgebaren
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((soort) => {
    document.addEventListener(soort, tegenhouden, { passive: false });
  });

  // Meer dan één vinger = knijpen; tegenhouden.
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1 || (typeof e.scale === 'number' && e.scale !== 1)) tegenhouden(e);
  }, { passive: false });

  // Aanraken van het spel en de knoppen: geen standaardgedrag (geen zoom, geen klik-vertraging).
  // De knoppen zelf werken met pointer-events, die gewoon doorgaan.
  ['touchstart', 'touchend'].forEach((soort) => {
    document.addEventListener(soort, (e) => {
      if (e.target.closest && e.target.closest('#app')) tegenhouden(e);
    }, { passive: false });
  });

  // Dubbelklik (desktop en sommige Android-browsers) en ctrl+scroll.
  document.addEventListener('dblclick', tegenhouden, { passive: false });
  document.addEventListener('wheel', (e) => { if (e.ctrlKey) tegenhouden(e); }, { passive: false });

  // Was er toch al ingezoomd (bijv. door een eerdere versie), zet de schaal dan terug.
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp && window.visualViewport && window.visualViewport.scale > 1.01) {
    const inhoud = vp.getAttribute('content');
    vp.setAttribute('content', `${inhoud}, initial-scale=1`);
  }
}
