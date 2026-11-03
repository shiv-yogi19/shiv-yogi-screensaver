/* Text engine: letter-by-letter animations (14 styles, CSS-driven) + canvas spark particles. */
(function (SY) {
  'use strict';
  const host = document.getElementById('host'), fx = document.getElementById('fx'), fc = fx.getContext('2d');
  let P = [], raf = 0;
  function fit() { fx.width = innerWidth; fx.height = innerHeight; }
  addEventListener('resize', fit); fit();
  function emit(x, y, n, c) {
    if (SY.RM || P.length > (SY.q ? 160 : 50)) return;
    for (let i = 0; i < n; i++) P.push({ x, y, vx: (Math.random() - .5) * 1.8, vy: -Math.random() * 1.5 - .2, l: 1, s: Math.random() * 1.8 + .6, c });
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    fc.clearRect(0, 0, fx.width, fx.height); fc.globalCompositeOperation = 'lighter';
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.vx; p.y += p.vy; p.vy += .014; p.l -= .013; if (p.l <= 0) { P.splice(i, 1); continue; } fc.globalAlpha = p.l; fc.fillStyle = p.c; fc.beginPath(); fc.arc(p.x, p.y, p.s, 0, 6.283); fc.fill(); }
    raf = P.length ? requestAnimationFrame(tick) : 0; if (!raf) fc.clearRect(0, 0, fx.width, fx.height);
  }
  /* style: [ms per letter, optional spark colour]. Add a matching .t-<name> rule in css/style.css for new styles. */
  const ST = { crystal: [70, '#cfefff'], golden: [60, '#ffd27a'], typewriter: [85], neon: [75], smoke: [65], liquid: [70], rotate3d: [80], beam: [55, '#fff0c0'], float: [80], blur: [55], wave: [55], stagger: [95], outline: [75], scale: [50] };
  const SAFE = ['blur', 'scale', 'stagger']; let bag = [], lastStyle = '';
  function pickStyle() {
    if (SY.RM) return SAFE[Math.floor(Math.random() * SAFE.length)];
    if (!bag.length) { bag = SY.shuffle(Object.keys(ST)); if (bag[bag.length - 1] === lastStyle) bag.unshift(bag.pop()); }
    return (lastStyle = bag.pop());
  }
  function build(it, wrap) {
    const style = it.style || pickStyle(), d = SY.RM ? 25 : ST[style][0] * (it.cls === 'big' ? 1.3 : 1);
    const el = document.createElement('div'); el.className = 'line ' + (it.cls || '') + ' t-' + style; el.setAttribute('role', 'text'); el.setAttribute('aria-label', it.t);
    el.style.setProperty('--d', d + 'ms'); el.style.setProperty('--off', (it.off || 0) + 'ms');
    let i = 0; const letters = [];
    for (const word of it.t.split(' ')) { const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      for (const ch of word) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; s.style.setProperty('--i', i++); s.style.setProperty('--r', (Math.random() * 2 - 1).toFixed(2)); w.appendChild(s); letters.push(s); }
      el.appendChild(w); }
    wrap.appendChild(el); return { style, d, n: i, off: it.off || 0, letters };
  }
  SY.text = {
    /* Show a stacked group of items together, hold, then dissolve. Resolves when removed. */
    play(items, o) {
      o = o || {};
      return new Promise(res => {
        const card = document.createElement('div'); card.className = 'card'; host.appendChild(card); let end = 0;
        items.forEach(it => { const b = build(it, card), col = ST[b.style][1];
          if (col) b.letters.forEach((s, k) => setTimeout(() => { if (!card.isConnected) return; const r = s.getBoundingClientRect(); emit(r.left + r.width / 2, r.top + r.height / 2, SY.q ? 4 : 2, col); }, b.off + k * b.d + 200));
          end = Math.max(end, b.off + b.n * b.d + 1300); });
        const hold = o.hold || 2400 + items.reduce((a, it) => a + it.t.length * 35, 0);
        setTimeout(() => { card.classList.add('out'); setTimeout(() => { card.remove(); res(); }, 1700); }, end + hold);
      });
    }
  };
})(window.SY);
