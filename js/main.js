/* Main: performance tier, fullscreen handling, wake lock, intro, endless loop, service worker. */
(function (SY) {
  'use strict';
  const $ = id => document.getElementById(id), wait = ms => new Promise(r => setTimeout(r, ms));
  SY.RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4, small = Math.min(screen.width, screen.height) < 600;
  SY.q = (cores <= 4 || mem <= 2) ? 0 : (cores >= 8 && mem >= 8 && !small ? 2 : 1);

  function bag(a) { let b = [], lastv; return () => { if (!b.length) { b = SY.shuffle(a); if (b[b.length - 1] === lastv && b.length > 1) b.unshift(b.pop()); } return (lastv = b.pop()); }; }
  const nextLine = bag(SY.lines), nextCap = bag(SY.captions);
  const visible = () => document.hidden ? new Promise(r => { const f = () => { if (!document.hidden) { document.removeEventListener('visibilitychange', f); r(); } }; document.addEventListener('visibilitychange', f); }) : Promise.resolve();

  let wl = null;
  async function wake() { try { if (navigator.wakeLock && !document.hidden) wl = await navigator.wakeLock.request('screen'); } catch (_) { } }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });

  let started = false;
  async function begin() {
    if (started) return; started = true; wake();
    $('stage').classList.remove('blur');            /* gradual blur removal + zoom reveal */
    await wait(SY.RM ? 600 : 2800);
    await SY.text.play([
      { t: 'ABOUT THE CREATOR', cls: 'lab', style: 'beam' },
      { t: 'SHIV YOGI', cls: 'big', style: 'crystal', off: 900 },
      { t: 'An Imagination Beyond Boundaries.', cls: 'sub', style: 'blur', off: 2300 }
    ], { hold: 2600 });
    let n = 0;
    for (;;) {
      await wait(1100 + Math.random() * 1100); await visible();
      await SY.text.play(++n % 6 === 0 ? nextCap() : [{ t: nextLine(), cls: 'quote' }]);
    }
  }

  async function boot() {
    SY.engine.start();
    const root = document.documentElement, rq = root.requestFullscreen || root.webkitRequestFullscreen;
    const standalone = matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone;
    const go = () => { try { const p = rq.call(root, { navigationUI: 'hide' }); return p && p.then ? p.then(() => true, () => false) : Promise.resolve(true); } catch (_) { return Promise.resolve(false); } };
    if (!rq || standalone || document.fullscreenElement) return begin();
    if (await go()) return begin();                  /* works when the browser already grants permission */
    let seen = false; try { seen = localStorage.getItem('sy_entered') === '1'; } catch (_) { }
    if (seen) {                                      /* returning visitor: no overlay, silently go fullscreen on first interaction */
      let done = false; const arm = () => { if (done) return; done = true; go(); };
      ['pointerup', 'keydown'].forEach(e => addEventListener(e, arm, { once: true }));
      return begin();
    }
    const en = $('enter'); en.hidden = false;        /* first visit only: minimal one-time overlay */
    $('enterBtn').addEventListener('click', () => {
      try { localStorage.setItem('sy_entered', '1'); } catch (_) { }
      go(); en.classList.add('gone'); setTimeout(() => en.remove(), 1000); begin();
    }, { once: true });
  }
  boot();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => { }));
})(window.SY);
