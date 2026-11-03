/* Wallpaper scenes. Each: add(name, init(w,h,q)->state, draw(ctx,t,w,h,q,state)). q = quality tier 0/1/2.
   To add a wallpaper, append another add(...) call below. All procedural: no external assets. */
(function (SY) {
  'use strict';
  const R = Math.random, T = Math.PI * 2, sc = SY.scenes = [];
  const add = (name, init, draw) => sc.push({ name, init, draw });
  const M = q => [0.35, 0.65, 1][q];
  function bg(c, w, h, st) { const g = c.createLinearGradient(0, 0, 0, h); st.forEach((s, i) => g.addColorStop(i / (st.length - 1), s)); c.fillStyle = g; c.fillRect(0, 0, w, h); }
  function glow(c, x, y, r, col, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
  function sprite(r, col) { const k = document.createElement('canvas'); k.width = k.height = r * 2; glow(k.getContext('2d'), r, r, r, col, 1); return k; }

  add('galaxy', (w, h, q) => { const m = M(q), S = [], D = []; for (let i = 0; i < 350 * m; i++) S.push({ x: R() * w, y: R() * h, s: R() * 1.6 + .5, p: R() * T }); for (let i = 0; i < 900 * m; i++) { const r = Math.pow(R(), .7); D.push({ r, a: r * 9 + (i % 3) * T / 3 + R() * .5, o: R() * .6 + .2 }); } return { S, D }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#03030c', '#0a0620', '#02020a']); c.fillStyle = '#cfd8ff'; for (const p of s.S) { c.globalAlpha = .4 + .6 * Math.abs(Math.sin(t * .001 + p.p)); c.fillRect(p.x, p.y, p.s, p.s); }
      const cx = w / 2, cy = h / 2, r0 = Math.min(w, h) * .55, rot = t * .00004; c.globalCompositeOperation = 'lighter'; c.globalAlpha = 1; glow(c, cx, cy, r0 * .5, 'rgba(255,190,140,A)', .35);
      for (const d of s.D) { const a = d.a + rot * (1.2 - d.r); c.globalAlpha = d.o; c.fillStyle = d.r < .3 ? '#ffd9a8' : '#8fb2ff'; c.fillRect(cx + Math.cos(a) * d.r * r0 * 1.3, cy + Math.sin(a) * d.r * r0 * .5, 2, 2); }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; });

  add('aurora', () => ({}), (c, t, w, h, q) => { bg(c, w, h, ['#020611', '#04101c', '#020409']); c.globalCompositeOperation = 'lighter';
    const cols = ['rgba(60,255,170,A)', 'rgba(90,160,255,A)', 'rgba(170,90,255,A)'], step = q ? 6 : 12;
    for (let k = 0; k < 3; k++) for (let x = 0; x < w; x += step) { const y = h * .32 + Math.sin(x * .004 + t * .0003 * (k + 1) + k * 2) * h * .1 + Math.sin(x * .011 - t * .0005) * h * .03, L = h * (.28 + .1 * Math.sin(x * .006 + t * .0004 + k)), g = c.createLinearGradient(0, y, 0, y + L);
      g.addColorStop(0, cols[k].replace('A', 0)); g.addColorStop(.25, cols[k].replace('A', .28)); g.addColorStop(1, cols[k].replace('A', 0)); c.fillStyle = g; c.fillRect(x, y, step + 1, L); }
    c.globalCompositeOperation = 'source-over'; c.fillStyle = '#010308'; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += 20) c.lineTo(x, h * .9 - Math.sin(x * .006) * h * .04 - Math.sin(x * .017 + 2) * h * .02); c.lineTo(w, h); c.fill(); });

  add('city', (w, h) => { const L = []; for (let l = 0; l < 3; l++) { const b = []; let x = 0; while (x < w * 2) { const bw = (40 + R() * 70) * (1 + l * .35), bh = h * (.18 + R() * .3) * (1 + l * .25); b.push({ x, w: bw, h: bh, c: ['#ff2fd6', '#27e4ff', '#ffb02f'][(R() * 3) | 0], n: R() }); x += bw + R() * 10; } L.push({ b, W: x }); } return { L }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#07031a', '#1a0638', '#4a0b57', '#0a0414']); glow(c, w * .7, h * .45, h * .5, 'rgba(255,60,200,A)', .25);
      s.L.forEach((l, i) => { const o = (t * .008 * (i + 1)) % l.W, al = .55 + i * .2, gx = q ? 9 : 13; for (const b of l.b) { let x = b.x - o; if (x < -b.w) x += l.W; if (x > w) continue; const y = h - b.h;
        c.globalAlpha = 1; c.fillStyle = 'rgb(' + (8 + i * 6) + ',' + (6 + i * 4) + ',' + (20 + i * 10) + ')'; c.fillRect(x, y, b.w, b.h); c.fillStyle = b.c; c.globalAlpha = al * .9; c.fillRect(x, y, b.w, 2);
        if (q && b.n > .6) { c.globalAlpha = al * .5; glow(c, x + b.w / 2, y + 8, b.w * .9, b.c === '#ff2fd6' ? 'rgba(255,47,214,A)' : 'rgba(39,228,255,A)', .5); }
        c.globalAlpha = al; const nn = (b.n * 100) | 0; for (let j = 0; y + 8 + j * gx < h - 4; j++) for (let k = 0; 5 + k * 8 < b.w - 5; k++) if ((j * 7 + k * 13 + nn) % 5 === 0) { c.fillStyle = ((j + k) % 3) ? '#ffe9a8' : b.c; c.fillRect(x + 5 + k * 8, y + 8 + j * gx, 2, 3); } } });
      c.globalAlpha = 1; c.fillStyle = 'rgba(255,60,200,.06)'; c.fillRect(0, h * .82, w, h * .18); });

  add('rain', (w, h, q) => { const D = [], B = [], n = (220 * M(q)) | 0; for (let i = 0; i < n; i++) D.push({ x: R() * w, y: R() * h, l: h * (.02 + R() * .04), v: .6 + R() * .8 }); for (let i = 0; i < 12; i++) B.push({ x: R() * w, y: R() * h * .8, r: h * (.05 + R() * .1), h: i % 3, p: R() * T }); return { D, B }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#05080f', '#0c1522', '#0a0f18']); c.globalCompositeOperation = 'lighter'; const cols = ['rgba(255,150,70,A)', 'rgba(80,170,255,A)', 'rgba(255,70,150,A)'];
      for (const b of s.B) glow(c, b.x + Math.sin(t * .0002 + b.p) * 20, b.y, b.r, cols[b.h], .16 + .05 * Math.sin(t * .0007 + b.p));
      c.globalCompositeOperation = 'source-over'; c.strokeStyle = 'rgba(180,210,255,.35)'; c.lineWidth = 1; c.beginPath();
      for (const d of s.D) { d.y += d.v * h * .012; d.x -= d.v * h * .002; if (d.y > h) { d.y = -d.l; d.x = R() * w * 1.1; } c.moveTo(d.x, d.y); c.lineTo(d.x - d.l * .12, d.y + d.l); } c.stroke(); });

  add('ocean', (w, h, q) => { const B = []; for (let i = 0; i < 60 * M(q); i++) B.push({ x: R() * w, y: R() * h, r: 1 + R() * 3, v: .15 + R() * .5, p: R() * T }); return { B }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#0a6a86', '#07405e', '#031a33', '#010a1a']); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 7; i++) { const x = w * (i / 6) + Math.sin(t * .0003 + i) * w * .06, g = c.createLinearGradient(x, 0, x + w * .12, h * .85); g.addColorStop(0, 'rgba(160,240,255,.16)'); g.addColorStop(1, 'rgba(160,240,255,0)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - w * .03, 0); c.lineTo(x + w * .05, 0); c.lineTo(x + w * .2 + Math.sin(t * .0004 + i) * 30, h * .9); c.lineTo(x + w * .02, h * .9); c.fill(); }
      c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(200,245,255,.5)';
      for (const b of s.B) { b.y -= b.v * h * .003; if (b.y < -5) { b.y = h + 5; b.x = R() * w; } c.globalAlpha = .25 + .3 * Math.sin(t * .002 + b.p) ** 2; c.beginPath(); c.arc(b.x + Math.sin(t * .001 + b.p) * 8, b.y, b.r, 0, T); c.fill(); }
      c.globalAlpha = 1; c.fillStyle = 'rgba(180,240,255,.10)'; c.beginPath(); c.moveTo(0, 0); for (let x = 0; x <= w; x += 16) c.lineTo(x, h * .05 + Math.sin(x * .01 + t * .0012) * h * .012); c.lineTo(w, 0); c.fill(); });

  add('mountains', () => ({ ph: [R() * 9, R() * 9, R() * 9, R() * 9] }), (c, t, w, h, q, s) => { bg(c, w, h, ['#1b2347', '#6b4a7a', '#f0a07a', '#f7d1a1']); glow(c, w * .68, h * .52, h * .55, 'rgba(255,220,160,A)', .55);
    const cols = ['#4c4673', '#38355c', '#262449', '#12112a'], st = q ? 8 : 16;
    for (let k = 0; k < 4; k++) { const base = h * (.55 + k * .1), a = h * (.14 - k * .01), sp = t * .00004 * (k + 1); c.fillStyle = cols[k]; c.beginPath(); c.moveTo(0, h);
      for (let x = 0; x <= w + st; x += st) c.lineTo(x, base - a * (Math.sin(x * .004 * (1 + k * .4) + s.ph[k] + sp) * .6 + Math.sin(x * .011 + s.ph[k] * 2 + sp * 1.3) * .3 + Math.sin(x * .027 + k) * .1)); c.lineTo(w, h); c.fill();
      if (k < 3) { const g = c.createLinearGradient(0, base - a, 0, base + h * .1); g.addColorStop(0, 'rgba(255,200,190,0)'); g.addColorStop(.5, 'rgba(255,200,190,.16)'); g.addColorStop(1, 'rgba(255,200,190,0)'); c.fillStyle = g; c.fillRect(0, base - a, w, h * .1 + a); } } });

  add('liquid', () => ({}), (c, t, w, h) => { c.fillStyle = '#04040e'; c.fillRect(0, 0, w, h); c.globalCompositeOperation = 'lighter';
    const cols = ['rgba(60,90,255,A)', 'rgba(170,60,255,A)', 'rgba(0,200,200,A)', 'rgba(255,70,160,A)', 'rgba(255,160,60,A)', 'rgba(80,120,255,A)'], m = Math.min(w, h);
    for (let i = 0; i < 6; i++) { const a = t * .0002 * (1 + i * .23) + i * 1.7; glow(c, w * (.5 + .34 * Math.sin(a * 1.1 + i)), h * (.5 + .34 * Math.cos(a * .9 + i * 2)), m * (.45 + .12 * Math.sin(a * 2)), cols[i], .5); } c.globalCompositeOperation = 'source-over'; });

  add('particles', (w, h, q) => { const P = [], n = (110 * M(q)) | 0; for (let i = 0; i < n; i++) P.push({ x: R() * w, y: R() * h, r: h * (.006 + R() * .016), vx: (R() - .5) * .3, vy: -(.1 + R() * .35), g: R() < .6, p: R() * T }); return { P, a: sprite(32, 'rgba(255,205,120,A)'), b: sprite(32, 'rgba(120,200,255,A)') }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#020208', '#070714', '#0b0a18']); c.globalCompositeOperation = 'lighter';
      for (const p of s.P) { p.x += p.vx; p.y += p.vy; if (p.y < -20) { p.y = h + 20; p.x = R() * w; } if (p.x < -20) p.x = w + 20; if (p.x > w + 20) p.x = -20; c.globalAlpha = .35 + .45 * Math.sin(t * .0015 + p.p) ** 2; const d = p.r * 6; c.drawImage(p.g ? s.a : s.b, p.x - d, p.y - d, d * 2, d * 2); }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; });

  add('clouds', (w, h, q) => { const P = []; for (let i = 0; i < 26 * M(q); i++) P.push({ x: R() * w * 1.4, y: h * (.25 + R() * .6), r: h * (.1 + R() * .2), v: .15 + R() * .4, a: .1 + R() * .2 }); return { P, sp: sprite(64, 'rgba(255,225,235,A)') }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#1a1450', '#5b3a8c', '#e07aa0', '#ffc79a']); glow(c, w * .5, h * .72, h * .5, 'rgba(255,230,180,A)', .45);
      for (const p of s.P) { p.x -= p.v * .6; if (p.x < -p.r * 2) p.x = w + p.r * 2; c.globalAlpha = p.a * (.8 + .2 * Math.sin(t * .0004 + p.r)); c.drawImage(s.sp, p.x - p.r * 1.6, p.y - p.r, p.r * 3.2, p.r * 2); } c.globalAlpha = 1; });

  add('digital', (w, h, q) => { const n = Math.ceil(w / (q ? 18 : 26)), C = []; for (let i = 0; i < n; i++) C.push({ y: R() * h, v: 1 + R() * 3, l: R() }); return { C, n }; },
    (c, t, w, h, q, s) => { bg(c, w, h, ['#010409', '#031a24', '#010409']); const hz = h * .58; c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(0,220,255,.35)'; c.lineWidth = 1; c.beginPath();
      for (let i = -20; i <= 20; i++) { c.moveTo(w / 2 + i * w * .02, hz); c.lineTo(w / 2 + i * w * .28, h); } const o = (t * .0004) % 1; for (let k = 0; k < 12; k++) { const f = (k + o) / 12, y = hz + (h - hz) * f * f; c.moveTo(0, y); c.lineTo(w, y); } c.stroke();
      glow(c, w / 2, hz, w * .45, 'rgba(0,200,255,A)', .2); c.font = (q ? 14 : 16) + 'px monospace'; c.fillStyle = 'rgba(60,255,200,.55)'; const st = q ? 18 : 26;
      for (let i = 0; i < s.n; i++) { const k = s.C[i]; k.y += k.v; if (k.y > hz + 20) k.y = -R() * h * .3; c.globalAlpha = .25 + k.l * .5; c.fillText((((t * .01 + i * 7) | 0) % 2) ? '1' : '0', i * st, k.y); }
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; });
})(window.SY);
