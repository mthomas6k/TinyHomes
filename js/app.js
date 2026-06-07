/* =========================================================
   MAISON — app.js
   Scaffold-level interactions only.
   Set piece animations (paint, scribble, saw, handwriting)
   are added in follow-up passes.
   ========================================================= */

(function () {

  /* ---------- sticky header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (header) {
          if (window.scrollY > 20) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
        }
        if (backToTop) {
          if (window.scrollY > 400) backToTop.classList.add('visible');
          else backToTop.classList.remove('visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      siteNav.classList.toggle('open');
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- render plans ---------- */
  if (typeof renderPlans === 'function') {
    renderPlans('planGrid');
  }


  /* ---------- HERO SLIDER ENGINE ---------- */
  /* 
   * SLIDE_DATA: master config for every slide.
   * Each entry: { src, model, nav }
   *   src   = image path
   *   model = model name string
   *   nav   = 'white' or 'black' (navbar text color for this slide)
   *
   * MODEL_GROUPS: defines which slide indices belong to each model
   * and which index is the floor plan (first image in each group).
   * The slider plays through all slides of one model, then moves
   * to the next model. On each page load, the starting model is
   * randomized, but it always begins on the floor plan of that model.
   */
  const SLIDE_DATA = [
    // === THE GREENWICH (pages 1–6) ===
    { src: '/images/slider/slide-01.jpg', model: 'The Greenwich', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-02.jpg', model: 'The Greenwich', nav: 'black' },
    { src: '/images/slider/slide-03.jpg', model: 'The Greenwich', nav: 'black' },
    { src: '/images/slider/slide-04.jpg', model: 'The Greenwich', nav: 'white' },
    { src: '/images/slider/slide-05.jpg', model: 'The Greenwich', nav: 'black' },
    { src: '/images/slider/slide-06.jpg', model: 'The Greenwich', nav: 'black' },
    
    // === THE WESTPORT (pages 7-10) ===
    { src: '/images/slider/slide-07.jpg', model: 'The Westport', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-08.jpg', model: 'The Westport', nav: 'black' },
    { src: '/images/slider/slide-09.jpg', model: 'The Westport', nav: 'black' },
    { src: '/images/slider/slide-10.jpg', model: 'The Westport', nav: 'black' },

    // === THE DARIEN (pages 11-14) ===
    { src: '/images/slider/slide-11.jpg', model: 'The Darien', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-12.jpg', model: 'The Darien', nav: 'black' },
    { src: '/images/slider/slide-13.jpg', model: 'The Darien', nav: 'black' },
    { src: '/images/slider/slide-14.jpg', model: 'The Darien', nav: 'black' },

    // === THE OCEAN BREEZE (pages 15-17) ===
    // { src: '/images/slider/slide-15.jpg', model: 'The Ocean Breeze', nav: 'black', type: 'floorplan' }, // MISSING
    { src: '/images/slider/slide-16.jpg', model: 'The Ocean Breeze', nav: 'black' },
    { src: '/images/slider/slide-17.jpg', model: 'The Ocean Breeze', nav: 'black' },

    // === THE ROWAYTON 2 (pages 18-22) ===
    { src: '/images/slider/slide-18.jpg', model: 'The Rowayton 2', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-19.jpg', model: 'The Rowayton 2', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-20.jpg', model: 'The Rowayton 2', nav: 'black' },
    { src: '/images/slider/slide-21.jpg', model: 'The Rowayton 2', nav: 'black' },
    { src: '/images/slider/slide-22.jpg', model: 'The Rowayton 2', nav: 'black' },
    { src: '/images/slider/slide-23.jpg', model: 'The Rowayton 2', nav: 'black' },

    // === THE ROWAYTON 3 (pages 23-x) ===
    { src: '/images/slider/slide-24.jpg', model: 'The Rowayton 3', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-25.jpg', model: 'The Rowayton 3', nav: 'black', type: 'floorplan' },
  ];

  const MODEL_GROUPS = [
    { name: 'The Greenwich', start: 0, end: 5 },
    { name: 'The Westport', start: 6, end: 9 },
    { name: 'The Darien', start: 10, end: 13 },
    // { name: 'The Ocean Breeze', start: 14, end: 15 }, // Hold until floorplan is uploaded
    { name: 'The Rowayton 2', start: 16, end: 21 }, // Indices 16-21 in SLIDE_DATA
    { name: 'The Rowayton 3', start: 22, end: 23 }, // Indices 22-23 in SLIDE_DATA
  ];

  const sliderTrack = document.getElementById('sliderTrack');

  if (sliderTrack && SLIDE_DATA.length > 0) {
    const SLIDE_DURATION = 5000; // ms per slide
    let currentIndex = -1;

    // --- Build the ordered playback sequence ---
    // Shuffle model order, but keep slides within each model in original order.
    // Always start each model on its floor plan (first slide in group).
    function buildPlaybackOrder() {
      const groupIndices = MODEL_GROUPS.map((_, i) => i);
      // Fisher-Yates shuffle the model order
      for (let i = groupIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [groupIndices[i], groupIndices[j]] = [groupIndices[j], groupIndices[i]];
      }
      const order = [];
      groupIndices.forEach(gi => {
        const g = MODEL_GROUPS[gi];
        for (let s = g.start; s <= g.end; s++) {
          order.push(s);
        }
      });
      return order;
    }

    const playbackOrder = buildPlaybackOrder();
    let playbackPos = 0;

    // --- Create slide DOM elements ---
    SLIDE_DATA.forEach((slide, i) => {
      const div = document.createElement('div');
      div.className = 'slider-slide';
      if (slide.type === 'floorplan') {
        div.classList.add('is-floorplan');
      }
      div.dataset.index = i;
      const img = document.createElement('img');
      img.src = slide.src;
      img.alt = slide.model;
      img.loading = (i <= 1) ? 'eager' : 'lazy';
      div.appendChild(img);
      sliderTrack.appendChild(div);
    });

    const slideEls = sliderTrack.querySelectorAll('.slider-slide');

    function showSlide(index) {
      const prevIndex = currentIndex;
      currentIndex = index;
      const slide = SLIDE_DATA[index];

      // Cleanup any stray .prev classes before setting the new one
      slideEls.forEach(el => el.classList.remove('prev'));

      // The currently active slide becomes .prev (it sits underneath the wipe)
      if (prevIndex >= 0 && slideEls[prevIndex]) {
        slideEls[prevIndex].classList.remove('active');
        slideEls[prevIndex].classList.add('prev');
      }

      // The new slide becomes .active and triggers the wipe animation
      // We force a reflow to restart the animation if needed, though adding .active should trigger it
      void slideEls[index].offsetWidth;
      slideEls[index].classList.add('active');

      // Navbar color crossfade
      if (slide.nav === 'black') {
        document.body.classList.add('nav-dark');
      } else {
        document.body.classList.remove('nav-dark');
      }

      // Scroll cue color
      const cue = document.getElementById('scrollCue');
      if (cue) {
        cue.style.color = slide.nav === 'black' ? 'var(--ink)' : 'var(--white)';
      }
    }

    // Start on first slide of random model
    showSlide(playbackOrder[0]);

    // Auto-advance
    setInterval(() => {
      playbackPos = (playbackPos + 1) % playbackOrder.length;
      showSlide(playbackOrder[playbackPos]);
    }, SLIDE_DURATION);
  }


  /* ---------- before/after slider ---------- */
  const slider = document.getElementById('baSlider');
  const baWith = document.getElementById('baWith');
  const baHandle = document.getElementById('baHandle');
  let dragging = false;

  function setSlider(clientX) {
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    let pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    baWith.style.clipPath = 'inset(0 0 0 ' + (pct * 100) + '%)';
    baHandle.style.left = (pct * 100) + '%';
    // The "after" caption lives INSIDE .ba-with so it's automatically
    // clipped by the top layer's clip-path — no extra work needed.
    // The "before" caption lives on the bottom layer (always rendered),
    // so we need to hide it manually when the top layer (after-image) is
    // covering it. The top layer is visible from x=pct*width to x=width.
    // The before caption sits at right: 18px. Compute its left edge as a
    // fraction of the slider width and check if the slider has crossed it.
    const capBefore = slider.querySelector('.ba-cap-before');
    if (capBefore) {
      const capRect = capBefore.getBoundingClientRect();
      // caption's left edge in slider-pct
      const capLeftPct = (capRect.left - rect.left) / rect.width;
      // visible only if slider position has crossed past the caption's left
      // edge (i.e. the top layer no longer covers the caption's left edge)
      capBefore.style.opacity = (pct >= capLeftPct) ? '1' : '0';
    }
  }

  if (slider) {
    slider.addEventListener('mousedown', (e) => { dragging = true; setSlider(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (dragging) setSlider(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    slider.addEventListener('touchstart', (e) => { setSlider(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener('touchmove', (e) => { setSlider(e.touches[0].clientX); }, { passive: true });
    // init at 50% so caption opacities match starting clip-path
    const r = slider.getBoundingClientRect();
    setSlider(r.left + r.width / 2);
  }


  /* ---------- contact form (stub validation) ---------- */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  function setFeedback(msg, type) {
    if (!feedback) return;
    feedback.textContent = msg;
    feedback.className = 'form-feedback ' + (type || '');
  }
  function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

  if (form) {
    const sourcePageField = document.getElementById('sourcePage');
    if (sourcePageField) sourcePageField.value = window.location.pathname;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (data.website) return; // honeypot

      if (!data.name || data.name.trim().length < 2) return setFeedback('Please enter your name.', 'error');
      if (!isEmail(data.email)) return setFeedback('Please enter a valid email.', 'error');
      if (!data.message || data.message.trim().length < 5) return setFeedback('Please add a brief message.', 'error');
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: data.phone,
            town: data.town,
            message: data.message,
            sourcePage: data.sourcePage || window.location.pathname
          })
        });
        if (res.ok) {
          const result = await res.json();
          if (result.redirect) {
            window.location.href = result.redirect;
          } else {
            setFeedback('Thanks — we will be in touch within a day.', 'success');
            form.reset();
            submitBtn.textContent = 'Sent';
          }
        } else {
          setFeedback('Something went wrong. Please try again later.', 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send';
        }
      } catch (err) {
        setFeedback('Network error. Please try again later.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      }
    });
  }


  /* =========================================================
     PAINT REVEAL — reusable x-ray scratch-off mechanic.
     Used for "Who are we?" (cover beige → reveals navy world)
     and "Who we are NOT" (cover cobalt → reveals pink world).
     ========================================================= */
  function setupPaintReveal(section, coverSvg, opts) {
    if (!section || !coverSvg) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const ANG = -16;
    const bandH = H * 0.36;
    const COUNT = 7;
    const L = W * 2.2;
    const NS = 'http://www.w3.org/2000/svg';
    const MASK_ID = 'paint-mask-' + Math.random().toString(36).slice(2, 8);

    coverSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    coverSvg.innerHTML = '';

    const defs = document.createElementNS(NS, 'defs');
    const mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', MASK_ID);
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('x', 0); mask.setAttribute('y', 0);
    mask.setAttribute('width', W); mask.setAttribute('height', H);

    const maskBg = document.createElementNS(NS, 'rect');
    maskBg.setAttribute('x', 0); maskBg.setAttribute('y', 0);
    maskBg.setAttribute('width', W); maskBg.setAttribute('height', H);
    maskBg.setAttribute('fill', 'white');
    mask.appendChild(maskBg);

    const maskGroup = document.createElementNS(NS, 'g');
    maskGroup.setAttribute('transform', 'rotate(' + ANG + ' ' + (W / 2) + ' ' + (H / 2) + ')');
    const maskStrokes = [];
    for (let i = 0; i < COUNT; i++) {
      const cy = -H * 0.1 + ((H * 1.2) / (COUNT - 1)) * i;
      const ln = document.createElementNS(NS, 'line');
      ln.setAttribute('x1', -W * 0.5);
      ln.setAttribute('y1', cy);
      ln.setAttribute('x2', W * 1.5);
      ln.setAttribute('y2', cy);
      ln.setAttribute('stroke', 'black');
      ln.setAttribute('stroke-width', bandH);
      ln.setAttribute('stroke-linecap', 'round');
      ln.setAttribute('stroke-dasharray', L);
      ln.setAttribute('stroke-dashoffset', L);
      maskGroup.appendChild(ln);
      maskStrokes.push(ln);
    }
    mask.appendChild(maskGroup);

    const maskSeal = document.createElementNS(NS, 'rect');
    maskSeal.setAttribute('x', 0);
    maskSeal.setAttribute('y', H);
    maskSeal.setAttribute('width', W);
    maskSeal.setAttribute('height', 0);
    maskSeal.setAttribute('fill', 'black');
    mask.appendChild(maskSeal);

    defs.appendChild(mask);
    coverSvg.appendChild(defs);

    // the cover rect — color set by opts.coverColor
    const cover = document.createElementNS(NS, 'rect');
    cover.setAttribute('x', 0); cover.setAttribute('y', 0);
    cover.setAttribute('width', W); cover.setAttribute('height', H);
    cover.setAttribute('fill', opts.coverColor);
    cover.setAttribute('mask', 'url(#' + MASK_ID + ')');
    coverSvg.appendChild(cover);

    // foreignObject headline with "before" colors, masked the same way
    if (opts.headlineHtml) {
      const fo = document.createElementNS(NS, 'foreignObject');
      fo.setAttribute('x', 0); fo.setAttribute('y', 0);
      fo.setAttribute('width', W); fo.setAttribute('height', H);
      fo.setAttribute('mask', 'url(#' + MASK_ID + ')');
      fo.innerHTML = opts.headlineHtml;
      coverSvg.appendChild(fo);
    }

    let latched = false;
    let collapsed = false;

    function update() {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const HEAD_OFFSET = 120;
      let p = Math.min(Math.max((-rect.top + HEAD_OFFSET) / total, 0), 1);
      if (latched) p = 1;

      const bandsPortion = 0.85;
      let covered = 0;
      maskStrokes.forEach((ln, i) => {
        const start = (i / COUNT) * bandsPortion;
        const end = ((i + 1) / COUNT) * bandsPortion;
        let loc = Math.min(Math.max((p - start) / (end - start), 0), 1);
        ln.setAttribute('stroke-dashoffset', L * (1 - loc));
        if (loc > 0.5) covered++;
      });

      const sealP = Math.min(Math.max((p - bandsPortion) / (1 - bandsPortion), 0), 1);
      maskSeal.setAttribute('y', H - H * sealP);
      maskSeal.setAttribute('height', H * sealP);

      if (covered >= COUNT - 1 || sealP > 0.3) section.classList.add('painted');
      else section.classList.remove('painted');

      if (p >= 0.999 && !latched) {
        latched = true;
      }

      // Once latched AND section is fully below viewport, collapse height silently
      if (latched && !collapsed && rect.bottom < 0) {
        collapsed = true;
        section.style.height = '100vh';
        section.classList.add('latched-collapsed');
      }
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => { update(); ticking = false; });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // shared "before" headline HTML template
  const headlineHtml1 = '<div xmlns="http://www.w3.org/1999/xhtml" class="who-headline-fo">' +
    '<div class="container-inner">' +
    '<p class="eyebrow">about us</p>' +
    '<h2 class="display-h2">Who are we<em>?</em></h2>' +
    '</div></div>';

  const headlineHtml2 = '<div xmlns="http://www.w3.org/1999/xhtml" class="who-headline-fo who-headline-fo-light">' +
    '<div class="container-inner">' +
    '<p class="eyebrow">to be clear</p>' +
    '<h2 class="display-h2">Who we are <em>NOT.</em></h2>' +
    '</div></div>';

  setupPaintReveal(
    document.querySelector('.section-who'),
    document.getElementById('coverSheet'),
    { coverColor: '#f6f1e7', headlineHtml: headlineHtml1 }
  );

  setupPaintReveal(
    document.querySelector('.section-who-not'),
    document.getElementById('coverSheet2'),
    { coverColor: '#1d3a6b', headlineHtml: headlineHtml2 }
  );


  /* =========================================================
     SET PIECE #3 — SCRIBBLE OUT + HANDWRITTEN CORRECTION
     One-shot. IntersectionObserver triggers when the heading
     enters viewport.
       1. Scribble crosses out "we provide." with curvy looping
          marker strokes (not sharp zigzags).
       2. After scribble finishes, "makes us different." writes
          itself in above the scribbled portion.
     ========================================================= */
  const scribbleSvg = document.getElementById('scribbleSvg');
  const scribbleTarget = document.getElementById('scribbleTarget');
  const markerLabel = document.getElementById('markerLabel');
  const strikeHeading = document.getElementById('strikeHeading');
  let scribbleFired = false;

  function fireScribble() {
    if (scribbleFired || !scribbleSvg || !scribbleTarget) return;
    scribbleFired = true;

    // measure the scribble target
    const r = scribbleTarget.getBoundingClientRect();
    const W = r.width + 60;
    const H = r.height + 40;
    scribbleSvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    // SCRIBBLE PATH — matches reference: tight diagonal slashes with
    // hairpin turns at the top and bottom edges. Each "stroke" is a
    // near-diagonal line; consecutive strokes connect through small
    // U-turn arcs. Densely packed across the text.
    const SLASHES = 18;             // number of diagonal strokes
    const padX = 18;
    const startX = padX;
    const endX = W - padX;
    const topY = H * 0.15;
    const botY = H * 0.85;
    const slashWidth = (endX - startX) / SLASHES;
    // each diagonal slash leans right by ~half a slash-width per height
    const lean = slashWidth * 0.7;  // how far the bottom of each slash
                                     // is to the right of its top

    let d = '';
    // start at top-left
    let curX = startX;
    let curY = topY;
    d += 'M ' + curX + ' ' + curY;

    for (let i = 0; i < SLASHES; i++) {
      const goingDown = i % 2 === 0;
      // each stroke advances rightward
      const nextX = curX + (goingDown ? lean : (slashWidth * 2 - lean));
      const nextY = goingDown ? botY : topY;

      // slight randomness in stroke target
      const jitterY = (Math.random() - 0.5) * 8;
      const jitterX = (Math.random() - 0.5) * 4;
      const tx = nextX + jitterX;
      const ty = nextY + jitterY;

      // hairpin curve: control points pull slightly past the endpoint
      // to create the small U-turn at top/bottom
      const overshoot = 6;
      const cx1 = curX + (tx - curX) * 0.35;
      const cy1 = curY + (ty - curY) * 0.55;
      const cx2 = tx - (tx - curX) * 0.1;
      const cy2 = ty + (goingDown ? overshoot : -overshoot);

      d += ' C ' + cx1 + ' ' + cy1 + ', ' + cx2 + ' ' + cy2 + ', ' + tx + ' ' + ty;

      curX = tx;
      curY = ty;
    }

    const NS = 'http://www.w3.org/2000/svg';
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#1d3a6b');
    path.setAttribute('stroke-width', '14');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('fill', 'none');
    scribbleSvg.innerHTML = '';
    scribbleSvg.appendChild(path);

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    path.getBoundingClientRect();   // force reflow

    // pre-delay so reader can read "What we provide." before scribble fires
    setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95)';
      path.style.strokeDashoffset = '0';
    }, 1500);

    // AFTER scribble completes, write the marker label (1500 pre-delay + 1400 scribble)
    setTimeout(() => {
      if (markerLabel) markerLabel.classList.add('written');
    }, 2900);
  }

  if (strikeHeading) {
    const scribObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !scribbleFired) {
          fireScribble();
          scribObs.disconnect();
        }
      });
    }, { rootMargin: '0px 0px -25% 0px' });
    scribObs.observe(strikeHeading);
  }


  /* =========================================================
     NAILED-TITLE animation — staggered across the 3 value cols.
     Underline draws left-to-right, then nail drops in at the
     right end and shakes briefly like it's just been hammered.
     One-shot, IntersectionObserver triggered.
     ========================================================= */
  const valueRow = document.querySelector('.value-row');
  if (valueRow) {
    let nailsFired = false;
    const nailObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !nailsFired) {
          nailsFired = true;
          const titles = valueRow.querySelectorAll('.nailed-title');
          titles.forEach((t, i) => {
            // Sequential rhythm: 350ms between strikes
            setTimeout(() => t.classList.add('nailed'), 900 + i * 350);
          });
          nailObs.disconnect();
        }
      });
    }, { rootMargin: '0px 0px -20% 0px' });
    nailObs.observe(valueRow);
  }


  // resize handler reloads (simplest reliable approach)
  // Disable reload on resize if the keyboard appears on mobile (height changes).
  let initHeight = window.innerHeight;
  let initWidth = window.innerWidth;
  window.addEventListener('resize', () => { 
    if (window.innerWidth !== initWidth) { // only reload on horizontal resize
      location.reload(); 
    }
  });

  /* =========================================================
     ADMIN PANEL LISTENER
     ========================================================= */
  let adminBuffer = '';
  document.addEventListener('keydown', async (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (document.activeElement.isContentEditable) return;
    
    if (e.key.length === 1) adminBuffer = (adminBuffer + e.key).slice(-50);
    if (e.key === 'Backspace') adminBuffer = adminBuffer.slice(0, -1);
    const candidate = adminBuffer.slice(-15);
    if (candidate.length === 15) {
      try {
        const r = await fetch('/api/dashboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passkey: candidate })
        });
        if (r.ok) {
          const data = await r.json();
          openAdminPanel(data, candidate);
          adminBuffer = '';
        }
      } catch (err) {}
    }
  });

  function openAdminPanel(data, passkey) {
    let panel = document.getElementById('adminPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'adminPanel';
      panel.className = 'admin-panel';
      document.body.appendChild(panel);
    }
    renderPanelContents(panel, data, passkey);
    panel.getBoundingClientRect(); // reflow
    panel.classList.add('open');

    const onEsc = (e) => {
      if (e.key === 'Escape') {
        panel.classList.remove('open');
        adminBuffer = '';
        document.removeEventListener('keydown', onEsc);
      }
    };
    document.addEventListener('keydown', onEsc);
  }

  function renderPanelContents(panel, data, passkey) {
    const subs = data.submissions || [];
    panel.innerHTML = `
      <div class="admin-header">
        <h2>Welcome back, ${data.ownerName}.</h2>
        <button class="admin-close" onclick="document.getElementById('adminPanel').classList.remove('open');">&times;</button>
      </div>
      <div class="admin-controls">
        <select class="admin-select" id="adminSort">
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
        <select class="admin-select" id="adminFilter">
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="pending">Pending</option>
          <option value="filled">Filled</option>
          <option value="passed">Passed</option>
        </select>
      </div>
      <div id="adminSubs"></div>
    `;

    const container = panel.querySelector('#adminSubs');
    
    function renderList(list) {
      container.innerHTML = list.map(sub => `
        <div class="submission-card ${!sub.opened ? 'unread' : ''}">
          <div class="sub-meta">${new Date(sub.submittedAt).toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'})} &middot; from ${sub.sourcePage}</div>
          <div class="sub-name">${sub.name}</div>
          <div class="sub-contact">
            <a href="mailto:${sub.email}">${sub.email}</a>
            ${sub.phone ? `<a href="tel:${sub.phone}">${sub.phone}</a>` : ''}
            <span>${sub.town || ''}</span>
          </div>
          <div class="sub-msg">${sub.message}</div>
          <div class="sub-actions">
            <select class="sub-status admin-select" data-id="${sub.id}" data-val="${sub.status || 'new'}">
              <option value="new" ${sub.status === 'new' ? 'selected' : ''}>NEW</option>
              <option value="pending" ${sub.status === 'pending' ? 'selected' : ''}>PENDING</option>
              <option value="filled" ${sub.status === 'filled' ? 'selected' : ''}>FILLED</option>
              <option value="passed" ${sub.status === 'passed' ? 'selected' : ''}>PASSED</option>
            </select>
            <input type="text" class="sub-note" placeholder="Add a note..." data-id="${sub.id}" value="${sub.note || ''}">
            <label style="font-size: 11px; display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" class="sub-opened" data-id="${sub.id}" ${sub.opened ? 'checked' : ''}> Opened
            </label>
          </div>
        </div>
      `).join('');
      
      container.querySelectorAll('.sub-status, .sub-note, .sub-opened').forEach(el => {
        el.addEventListener('change', async (e) => {
          const id = e.target.getAttribute('data-id');
          if (e.target.classList.contains('sub-status')) {
            e.target.setAttribute('data-val', e.target.value);
          }
          const patch = {};
          if (e.target.classList.contains('sub-status')) patch.status = e.target.value;
          if (e.target.classList.contains('sub-note')) patch.note = e.target.value;
          if (e.target.classList.contains('sub-opened')) {
            patch.opened = e.target.checked;
            const card = e.target.closest('.submission-card');
            if (patch.opened) card.classList.remove('unread');
            else card.classList.add('unread');
          }
          
          await fetch('/api/update', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ passkey, submissionId: id, patch })
          });
        });
      });
    }
    
    function applyFilters() {
      const sort = panel.querySelector('#adminSort').value;
      const filter = panel.querySelector('#adminFilter').value;
      let filtered = subs;
      if (filter !== 'all') {
        filtered = subs.filter(s => (s.status || 'new') === filter);
      }
      if (sort === 'asc') {
        filtered = [...filtered].reverse();
      }
      renderList(filtered);
    }
    
    panel.querySelector('#adminSort').addEventListener('change', applyFilters);
    panel.querySelector('#adminFilter').addEventListener('change', applyFilters);
    applyFilters();
  }

})();
