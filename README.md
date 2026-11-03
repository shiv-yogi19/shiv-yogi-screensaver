# SHIV YOGI — Cinematic Screen Saver

An immersive, continuously running digital screen saver (no dashboard, no controls). Pure static HTML/CSS/JS, built for GitHub Pages. **Created By Shiv Yogi.**

## Deploy on GitHub Pages
1. Create a repository and upload **the contents of this folder** (index.html must be at the repo root).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. Open `https://<username>.github.io/<repo>/`. All paths are relative, so sub-directory hosting works.

## Structure
```
index.html            page shell (stage canvases, text host, one-time Enter overlay)
css/style.css         layout, cinematic look, 14 letter animations
js/content.js         40 appreciation lines + identity captions (edit here)
js/wallpaper-engine.js  rotation (5 min), crossfade, adaptive quality
js/text-engine.js     letter-by-letter engine + spark particles
js/main.js            performance tier, fullscreen, wake lock, intro, loop, SW registration
wallpapers/scenes.js  10 procedural wallpapers (add more here)
assets/icons/         PWA icons
manifest.json, service-worker.js   installable PWA, offline cache
```

## Extending
- **New line**: add a string to `SY.lines` in `js/content.js`.
- **New wallpaper**: add an `add(name, init, draw)` block in `wallpapers/scenes.js`.
- **New text style**: add `name: [msPerLetter, optionalSparkColour]` to `ST` in `js/text-engine.js` and a `.t-name .ch` rule + `@keyframes` in `css/style.css`.

## Fullscreen notes
Browsers allow fullscreen only after a user gesture. The site tries automatically; on a first visit it shows one minimal **Enter Experience** button. Returning visitors get no overlay — fullscreen is requested silently on their first tap/key. iPhone Safari has no fullscreen API for pages: use *Share → Add to Home Screen* to run it full-screen. Installed PWAs (Android/desktop Chrome/Edge) open in fullscreen/standalone mode automatically.

## Performance
Quality tier (0/1/2) is chosen from CPU cores, memory and screen size, then lowered automatically if frames are slow. Rendering pauses when the tab is hidden, and `prefers-reduced-motion` switches to calm fades with fewer effects. The screen wake lock keeps the display on while the saver is visible (where supported).

## Update note
After changing files, bump `V` in `service-worker.js` so installed copies refresh.
