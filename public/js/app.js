// Page behaviour. The site is a fly-through: every .stop is a panel parked at its own depth in a 3D
// world, and scrolling moves the camera forward through them. Data comes from js/data.js.
// No libraries except Typed.js.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const pad = (n) => String(n).padStart(2, '0');
  const root = document.documentElement;
  const motion = root.classList.contains('motion'); // set in <head>, off for reduced motion
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasTyped = !!window.Typed && motion;

  // ---------- intro curtain (first, so a later error can never leave the page covered) ----------
  let launched = false;
  const ready = () => {
    $('#loading').classList.add('done');
    document.body.classList.add('ready');
    launched = true;
  };
  if (hasTyped) {
    new Typed('#loading_text', {
      strings: ["Welcome to the Carroo's world"], typeSpeed: 45, showCursor: false,
      onComplete: () => setTimeout(ready, 350),
    });
    $('#multiple_text').textContent = '';
    new Typed('#multiple_text', { strings: ['Web Developer', 'Student', 'Freelancer'], typeSpeed: 90, backSpeed: 45, loop: true });
  } else {
    ready();
  }

  // ---------- render data ----------
  const card = (e) => `<div class="card"><p class="period">${e.period}</p><h4>${e.title}</h4><p class="desc">${e.desc}</p></div>`;
  const titleOf = (svg) => (svg.match(/<title>(.*?)<\/title>/) || [])[1] || '';
  $('#edu').innerHTML = DATA.educations.map(card).join('');
  $('#exp').innerHTML = DATA.experiences.map(card).join('');
  $('#skills-sphere').innerHTML = DATA.skills.map((s) => {
    const svg = SKILL_SVGS[s.icon], name = titleOf(svg);
    return `<a href="${s.url}" ${s.target === undefined ? 'target="_blank" rel="noopener"' : ''} data-name="${name}" aria-label="${name}">${svg}</a>`;
  }).join('');
  const deck = $('#deck');
  deck.innerHTML = DATA.portfolios.map((p, i) => `
    <article class="pf">
      <img src="${DATA.portfolioImages[i]}" alt="${p.title} screenshot">
      <div>
        <div class="pf-head"><span class="pf-num">${p.num}</span><h3>${p.title}</h3></div>
        <p>${p.desc}</p>
        <ul>${p.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
        <div class="chips">${p.techs.map((t) => `<span>${t}</span>`).join('')}</div>
        <div class="links">${p.links.map((l) => `<a class="btn sm" href="${l.url}" target="_blank" rel="noopener">${SVG_ICONS[l.icon]}<span>Show Me</span></a>`).join('')}</div>
      </div>
    </article>`).join('');

  // ---------- project deck: one project at a time (buttons, left/right keys, swipe) ----------
  const slides = $$('.pf', deck);
  let slide = 0;
  function showSlide(i) {
    slide = (i + slides.length) % slides.length;
    slides.forEach((s, j) => { s.classList.toggle('on', j === slide); s.classList.toggle('past', j < slide); });
    $('#pf-n').textContent = pad(slide + 1);
  }
  $('#pf-total').textContent = pad(slides.length);
  $('#pf-prev').onclick = () => showSlide(slide - 1);
  $('#pf-next').onclick = () => showSlide(slide + 1);
  // Swipe on touch: the page itself is scroll-driven, so the moment iOS/Android decides a finger
  // drag is a scroll it fires pointercancel and a pointer-based swipe never completes. So read the
  // touch stream directly, wait for a clearly horizontal intent, and only then claim the gesture.
  const SWIPE_MIN = 45;    // px of travel that counts as a swipe
  const INTENT = 10;       // px before we decide the direction
  let sx = null, sy = null, swiping = false;
  const endTouch = () => { sx = null; sy = null; swiping = false; };
  deck.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    sx = t.clientX; sy = t.clientY; swiping = false;
  }, { passive: true });
  deck.addEventListener('touchmove', (e) => {
    if (sx === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (!swiping) {
      if (Math.abs(dx) < INTENT) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.2) { endTouch(); return; } // vertical: let the page fly on
      swiping = true;
    }
    if (e.cancelable) e.preventDefault();
  }, { passive: false });
  deck.addEventListener('touchend', (e) => {
    if (swiping) {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > SWIPE_MIN) showSlide(slide + (dx < 0 ? 1 : -1));
    }
    endTouch();
  }, { passive: true });
  deck.addEventListener('touchcancel', endTouch, { passive: true });
  // Mouse drag stays on pointer events (no scroll to fight there).
  let swipeX = null;
  deck.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') swipeX = e.clientX; });
  deck.addEventListener('pointerup', (e) => {
    if (swipeX !== null && Math.abs(e.clientX - swipeX) > 50) showSlide(slide + (e.clientX < swipeX ? 1 : -1));
    swipeX = null;
  });
  showSlide(0);

  // ---------- light / dark ----------
  let light = root.dataset.theme === 'light';
  const themeBtn = $('#theme-toggle');
  const paintTheme = () => { themeBtn.textContent = light ? '🌙' : '☀️'; };
  themeBtn.onclick = () => {
    const flip = () => {
      light = !light;
      if (light) root.dataset.theme = 'light'; else delete root.dataset.theme;
      try { localStorage.setItem('dm-theme', light ? 'light' : 'dark'); } catch (e) { /* private mode: just don't remember */ }
      paintTheme();
      if (!motion) drawSpace(0, 0, 0, hues[0]);
    };
    if (document.startViewTransition && motion) document.startViewTransition(flip); else flip();
  };
  paintTheme();
  $('#contacts-container').innerHTML = DATA.contacts.map((c) => `
    <a class="card tilt" href="${c.url}" target="_blank" rel="noopener">
      <span class="ico">${SVG_ICONS[c.icon]}</span>
      <span><h4>${c.title}</h4><p>${c.subtitle}</p></span>
    </a>`).join('');
  $('#footer-socials').innerHTML = DATA.footerSocials.map((s) =>
    `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${titleOf(SVG_ICONS[s.icon])}">${SVG_ICONS[s.icon]}</a>`).join('');

  // ---------- text effects ----------
  $$('.name > span').forEach((w, wi) => {
    w.innerHTML = [...w.textContent].map((c, i) => `<i style="--i:${wi * 5 + i}">${c}</i>`).join('');
  });
  if (motion) {
    $$('[data-words]').forEach((p) => {
      p.innerHTML = p.textContent.trim().split(/\s+/).map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');
    });
  }
  function scramble(el) {
    if (el.scrambling) return;
    el.scrambling = true;
    const txt = [...el.textContent], junk = '!<>-_\\/[]{}=+*^?#';
    let f = 0;
    const id = setInterval(() => {
      el.textContent = txt.map((c, i) => (i < f / 2 || c === ' ' || c.codePointAt(0) > 255 ? c : junk[Math.random() * junk.length | 0])).join('');
      if (++f > txt.length * 2) { clearInterval(id); el.scrambling = false; }
    }, 30);
  }
  function countUp(el) {
    const end = +el.dataset.count, t0 = performance.now();
    (function step(t) {
      const p = clamp((t - t0) / 1500);
      el.textContent = Math.round(end * (1 - (1 - p) ** 3)) + '++';
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  // ---------- the route ----------
  const S = 2200;   // world distance between two stops (px)
  const SEG = 800;  // scroll distance between two stops (px)
  const P = 1000;   // must match `perspective` on #scene
  const world = $('#world'), stops = $$('.stop'), gates = $$('.gate'), n = stops.length;
  const projectsStop = stops.indexOf($('#projects'));
  const nav = $('#nav-menu'), navLinks = $$('a', nav);
  const chapters = navLinks.map((a) => $(a.getAttribute('href')));
  const hues = [190, 95, 320, 35]; // accent hue per chapter: home, about, portfolio, contact
  const chapterOf = [];
  stops.reduce((c, s, i) => (chapterOf[i] = Math.max(c, chapters.indexOf(s))), 0);
  // a gate is a giant word you fly through, halfway before the stop that follows it
  gates.forEach((g) => {
    g.z = (stops.indexOf(g.nextElementSibling) - 0.5) * S;
    g.style.transform = `translate(-50%,-50%) translateZ(${-g.z}px)`;
  });
  $('#hud-total').textContent = pad(n);

  let cur = -1;
  const goTo = (i) => {
    i = clamp(i, 0, n - 1);
    if (motion) scrollTo({ top: i * SEG, behavior: 'smooth' });
    else stops[i].scrollIntoView();
  };
  // in-page links can't scroll to a panel that floats in 3D, so route them through goTo
  document.addEventListener('click', (e) => {
    const a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    const i = a ? stops.indexOf($(a.getAttribute('href'))) : -1;
    if (i < 0 || !motion) return;
    e.preventDefault();
    history.replaceState(null, '', a.hash);
    goTo(i);
  });
  $('#hamburger').onclick = () => nav.classList.toggle('open');
  nav.onclick = () => nav.classList.remove('open');
  $('#prev').onclick = () => goTo(cur - 1);
  $('#next').onclick = () => goTo(cur + 1);
  if (motion) {
    addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, button, a') || e.ctrlKey || e.metaKey || e.altKey) return;
      const turn = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (turn && cur === projectsStop) return showSlide(slide + turn);
      const step = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      goTo(cur + step);
    });
    // keyboard focus landing in a far panel brings the camera to it
    world.addEventListener('focusin', (e) => {
      const i = stops.indexOf(e.target.closest('.stop'));
      if (i >= 0 && i !== cur) goTo(i);
    });
  }

  const logo = $('#carroo');
  const logoTexts = ['Carroo', 'Carro', 'Carr', 'Catr', 'Catr H', 'Catr He', 'Catur He', 'Catur Hen', 'Catur Hend', 'Catur Hendra'];
  let logoIdx = -1;

  function arrive(i) {
    cur = i;
    stops.forEach((s, j) => s.classList.toggle('here', j === i));
    navLinks.forEach((a, j) => a.classList.toggle('active', j === chapterOf[i]));
    $('#hud-n').textContent = pad(i + 1);
    $('#hud-label').textContent = stops[i].dataset.label;
    $$('[data-scramble]', stops[i]).forEach(scramble);
    $$('[data-count]', stops[i]).forEach(countUp);
  }

  // ---------- pointer: look around, tilt, custom cursor, click pop ----------
  let mx = 0, my = 0, px = innerWidth / 2, py = innerHeight / 2, rx = px, ry = py, tilted = null;
  const dot = $('#cur-dot'), ring = $('#cur-ring');
  if (fine && motion) {
    root.classList.add('has-cursor');
    addEventListener('pointermove', (e) => {
      dot.hidden = ring.hidden = false; // shown on first move, so it never sits parked mid-screen
      px = e.clientX; py = e.clientY;
      mx = px / innerWidth - 0.5; my = py / innerHeight - 0.5;
      // moving the vanishing point shifts everything far away but leaves the panel in focus still
      root.style.setProperty('--px', 50 + mx * 14 + '%');
      root.style.setProperty('--py', 50 + my * 14 + '%');
      const t = e.target.closest ? e.target : null;
      ring.classList.toggle('hover', !!(t && t.closest('a, button, input')));
      const el = t && t.closest('.tilt');
      if (tilted && tilted !== el) { tilted.style.removeProperty('--rx'); tilted.style.removeProperty('--ry'); }
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--ry', ((px - r.left) / r.width - 0.5) * 14 + 'deg');
        el.style.setProperty('--rx', (0.5 - (py - r.top) / r.height) * 14 + 'deg');
      }
      tilted = el;
    });
  }
  const pops = ['😀', '🥰', '😜', '🤭'];
  let popIdx = 0;
  addEventListener('click', (e) => {
    const s = document.createElement('span');
    s.className = 'pop';
    s.textContent = pops[popIdx++ % pops.length];
    s.style.left = e.clientX + 'px';
    s.style.top = e.clientY + 'px';
    s.onanimationend = () => s.remove();
    document.body.append(s);
    if (!motion) setTimeout(() => s.remove(), 600);
  });

  // ---------- space: stars that streak with speed, and a tunnel of hexagons ----------
  const cv = $('#bg'), ctx = cv.getContext('2d');
  const DEPTH = 6000, RING_GAP = 1100, RINGS = 6;
  const stars = Array.from({ length: innerWidth < 800 ? 260 : 520 }, () =>
    [(Math.random() * 2 - 1) * 1800, (Math.random() * 2 - 1) * 1400, Math.random() * DEPTH]);
  let W, H;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawSpace(t, cam, vel, hue) {
    const cx = W / 2 + mx * W * 0.14, cy = H / 2 + my * H * 0.14; // same vanishing point as the CSS scene
    const stretch = clamp(vel * 3, -1500, 1500);
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = 'round';
    ctx.strokeStyle = light ? `hsl(${hue} 60% 30%)` : `hsl(${hue} 90% 82%)`;
    for (const s of stars) {
      let zr = (s[2] - cam) % DEPTH;
      if (zr < 0) zr += DEPTH;
      const dist = zr + 80, tail = dist + stretch;
      if (tail < 20) continue;
      const k = P / dist, k2 = P / tail;
      ctx.globalAlpha = (1 - zr / DEPTH) * 0.9;
      ctx.lineWidth = clamp(k * 1.2, 0.5, 3);
      ctx.beginPath();
      ctx.moveTo(cx + s[0] * k, cy + s[1] * k);
      ctx.lineTo(cx + s[0] * k2 + 0.5, cy + s[1] * k2);
      ctx.stroke();
    }
    ctx.strokeStyle = light ? `hsl(${hue} 90% 36%)` : `hsl(${hue} 95% 62%)`;
    ctx.lineWidth = 1;
    for (let m = 0; m < RINGS; m++) {
      let zr = (m * RING_GAP - cam) % (RING_GAP * RINGS);
      if (zr < 0) zr += RING_GAP * RINGS;
      const k = P / (zr + 80), r = 1100 * k, a0 = m * 0.5 + t * 0.00005;
      if (r > 6000) continue;
      ctx.globalAlpha = (1 - zr / (RING_GAP * RINGS)) * 0.28;
      ctx.beginPath();
      for (let i = 0; i <= 6; i++) ctx.lineTo(cx + Math.cos(a0 + i * Math.PI / 3) * r, cy + Math.sin(a0 + i * Math.PI / 3) * r);
      ctx.stroke();
    }
  }

  // ---------- skills sphere ----------
  const sphere = $('#skills-sphere'), balls = $$('a', sphere), skillsStop = stops.indexOf($('#skills'));
  const ballPts = balls.map((_, i) => { const y = 1 - 2 * (i + 0.5) / balls.length, r = Math.sqrt(1 - y * y), a = i * 2.39996; return [r * Math.cos(a), y, r * Math.sin(a)]; });
  let sAx = 0, sAy = 0, sVx = 0.003, sVy = 0.006, sPause = false, sR = 130;
  if (motion) {
    sphere.addEventListener('pointermove', (e) => {
      const r = sphere.getBoundingClientRect();
      sVy = ((e.clientX - r.left) / r.width - 0.5) * 0.05;
      sVx = (0.5 - (e.clientY - r.top) / r.height) * 0.05;
      sPause = !!e.target.closest('a'); // hold still so the icon under the pointer can be clicked
    });
    sphere.addEventListener('pointerleave', () => { sVx = 0.003; sVy = 0.006; sPause = false; });
  }
  function drawSphere() {
    if (!sPause) { sAx += sVx; sAy += sVy; }
    const cY = Math.cos(sAy), sY = Math.sin(sAy), cX = Math.cos(sAx), sX = Math.sin(sAx);
    balls.forEach((el, i) => {
      const [x, y, z] = ballPts[i];
      const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
      const y1 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
      el.style.transform = `translate(${x1 * sR}px,${y1 * sR}px) scale(${0.6 + (z2 + 1) * 0.3})`;
      el.style.opacity = 0.3 + (z2 + 1) * 0.35;
      el.style.zIndex = z2 > 0 ? 2 : 1;
    });
  }

  // ---------- one frame ----------
  const progress = $('#progress');
  let cam = -2600; // starts far behind the first stop: the page opens with a fly-in
  function frame(t) {
    // each scroll segment: first half parked exactly on a stop (so its text is crisp), second half flying to the next
    const u = clamp(scrollY / SEG, 0, n - 1), i = Math.min(u | 0, n - 1);
    const target = launched ? (i + smooth(clamp((u - i - 0.5) / 0.5))) * S : cam;
    const prev = cam;
    cam += (target - cam) * 0.1;
    if (Math.abs(target - cam) < 0.5) cam = target;
    world.style.transform = `translateZ(${cam}px)`;

    const at = clamp(cam / S, 0, n - 1), here = Math.round(at);
    if (here !== cur) arrive(here);
    const a = Math.floor(at), b = Math.min(a + 1, n - 1);
    const hue = hues[chapterOf[a]] + (hues[chapterOf[b]] - hues[chapterOf[a]]) * smooth(at - a);
    root.style.setProperty('--h', hue.toFixed(1));
    progress.style.transform = `scaleX(${at / (n - 1)})`;
    const li = Math.min(logoTexts.length - 1, Math.floor(clamp(cam / S) * logoTexts.length));
    if (li !== logoIdx) {
      logoIdx = li;
      logo.textContent = logoTexts[li];
      logo.classList.toggle('full', li === logoTexts.length - 1);
    }

    stops.forEach((el, j) => {
      const d = j * S - cam; // distance ahead of the camera
      const on = d < 2500 && d > -500;
      if (!on) {
        if (el.on) { el.on = false; el.style.opacity = 0; el.style.pointerEvents = 'none'; }
        return;
      }
      el.on = true;
      const far = clamp((2400 - d) / 1200), k = clamp(d / 1500, -1, 1), side = j ? (j % 2 ? 1 : -1) : 0;
      el.style.opacity = d < 0 ? clamp(1 + d / 450) : far * far;
      el.style.pointerEvents = Math.abs(d) < 200 ? 'auto' : 'none';
      // swoop in from one side, face the camera when parked (d = 0 leaves no 3D transform at all)
      el.style.transform = `translate(-50%,-50%) translate3d(${side * k * Math.abs(k) * W * 0.4}px,0,${-j * S}px) rotateY(${-side * k * 28}deg)`;
    });
    gates.forEach((g) => {
      const d = g.z - cam;
      // only shows mid-flight: still invisible from the stop before it (d = S / 2), so it never sits behind a parked panel
      g.style.opacity = (d < 0 ? clamp(1 + d / 500) : clamp((1000 - d) / 500)) * 0.6;
    });

    drawSpace(t, cam, cam - prev, hue);
    if (Math.abs(skillsStop * S - cam) < 700) drawSphere();
    rx += (px - rx) * 0.18; ry += (py - ry) * 0.18;
    dot.style.transform = `translate(${px}px,${py}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(frame);
  }
  function measure() {
    resize();
    sR = sphere.offsetWidth / 2 - 28;
    if (motion) document.body.style.height = (n - 1) * SEG + innerHeight + 'px';
    else drawSpace(0, 0, 0, hues[0]);
  }
  addEventListener('resize', measure);
  measure();
  if (motion) {
    const i = stops.indexOf(location.hash.length > 1 ? $(location.hash) : null);
    if (i > 0) scrollTo(0, i * SEG);
    requestAnimationFrame(frame);
  } else {
    arrive(0);
  }

  // ---------- bug game (click a "magic" word): bugs fly at you, squash them before they get past ----------
  const faces = ['😍', '😀', '🙂', '😐', '🙁', '😢', '😭'];
  const layer = $('#game'), gHud = $('#game-hud'), over = $('#gameover');
  const MAX = 10; // bugs allowed to escape
  let squashed = 0, escaped = 0, gap, timer, playing = false;
  const score = () => {
    $('#g-face').textContent = faces[Math.min(6, Math.floor(escaped * 7 / MAX))];
    $('#g-score').textContent = `squashed ${squashed} · escaped ${escaped}/${MAX}`;
  };
  function stopGame() {
    playing = false;
    clearTimeout(timer);
    layer.replaceChildren();
    gHud.hidden = true;
  }
  function gameOver() {
    playing = false;
    clearTimeout(timer);
    layer.replaceChildren();
    const msg = `Game over! It seems the bug is challenging to fix. Let's enlist Carroo's expertise; he might have the solution...... (you squashed ${squashed})`;
    const end = () => { stopGame(); over.classList.remove('show'); };
    const out = $('#gameover_text');
    out.textContent = '';
    over.classList.add('show');
    if (hasTyped) new Typed(out, { strings: [msg], typeSpeed: 40, showCursor: false, onComplete: () => setTimeout(end, 1500) });
    else { out.textContent = msg; setTimeout(end, 5000); }
  }
  function spawn() {
    const b = document.createElement('button');
    b.className = 'bug';
    b.textContent = '🐞';
    b.setAttribute('aria-label', 'Squash bug');
    // faster flights the more you squash
    b.style.cssText = `--x:${(Math.random() - 0.5) * 28}vw;--y:${(Math.random() - 0.5) * 24}vh;--t:${Math.max(1.6, 4.2 - squashed * 0.08)}s`;
    b.onclick = () => { b.remove(); squashed++; score(); };
    b.onanimationend = () => { // reached the camera
      b.remove();
      if (!playing) return;
      escaped++;
      score();
      layer.animate([{ background: 'rgba(255,40,40,.3)' }, { background: 'transparent' }], 350);
      if (escaped >= MAX) gameOver();
    };
    layer.append(b);
    gap = Math.max(450, gap * 0.95);
    timer = setTimeout(spawn, gap);
  }
  if (motion) { // the game is all animation, so it is left out under reduced motion
    $$('.startButton').forEach((b) => b.onclick = () => {
      stopGame();
      playing = true;
      squashed = escaped = 0;
      gap = 1500;
      score();
      gHud.hidden = false;
      spawn();
    });
    $('#stopButton').onclick = stopGame;
  }
})();
