/* Wallpaper engine: two stacked canvases, 5-minute rotation, 4s crossfade, adaptive quality. */
(function (SY) {
  'use strict';
  const FADE = 4200, ROTATE = 300000;
  const L = ['w0', 'w1'].map(id => { const cv = document.getElementById(id); return { cv, ctx: cv.getContext('2d', { alpha: false }), scene: null, state: null, on: false, idx: -1 }; });
  const SPEED = SY.RM ? 0.35 : 1;
  let cur = -1, q = SY.q, run = false, last = 0, order = [], oi = 0, W = 0, H = 0, z = 1, samples = 0, sum = 0, down = 0, rt = 0, raf = 0;

  function size() { const d = [.5, .75, 1][q] * Math.min(window.devicePixelRatio || 1, 1.5); W = Math.max(320, Math.ceil(innerWidth * d)); H = Math.max(240, Math.ceil(innerHeight * d)); }
  function setup(l, i) { l.cv.width = W; l.cv.height = H; l.idx = i; l.scene = SY.scenes[i]; l.state = l.scene.init(W, H, q); }
  function nextIdx() {
    if (oi >= order.length) { const p = order[order.length - 1]; order = SY.shuffle(SY.scenes.map((_, i) => i)); if (order[0] === p && order.length > 1) order.push(order.shift()); oi = 0; }
    return order[oi++];
  }
  function swap() {
    const first = cur < 0, old = first ? null : L[cur], n = L[first ? 0 : 1 - cur];
    setup(n, nextIdx()); n.on = true; n.cv.style.zIndex = ++z; n.cv.classList.add('show'); if (first) n.cv.classList.add('first');
    cur = L.indexOf(n);
    if (old) setTimeout(() => { if (L[cur] === old) return; old.cv.classList.remove('show', 'first'); old.on = false; old.state = null; }, FADE + 300);
  }
  function resize() { size(); L.forEach(l => { if (l.on) setup(l, l.idx); }); }
  function adapt(ms) {
    if (q === 0 || down >= 2 || (L[0].on && L[1].on)) return;
    if (++samples <= 30) return; sum += ms;
    if (samples >= 120) { const avg = sum / 90; samples = 0; sum = 0; if (avg > (q === 2 ? 9 : 13)) { down++; q--; resize(); } }
  }
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (ts - last < 1000 / (q > 1 ? 60 : 30) - 2) return;
    last = ts; const t0 = performance.now();
    for (const l of L) if (l.on && l.state) l.scene.draw(l.ctx, ts * SPEED, W, H, q, l.state);
    adapt(performance.now() - t0);
  }
  SY.engine = {
    start() { if (run) return; run = true; size(); swap(); raf = requestAnimationFrame(frame); setInterval(() => { if (!document.hidden) swap(); }, ROTATE); }
  };
  document.addEventListener('visibilitychange', () => {
    if (!run) return;
    if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); last = 0; raf = requestAnimationFrame(frame); }
  });
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (run) resize(); }, 300); });
})(window.SY);
