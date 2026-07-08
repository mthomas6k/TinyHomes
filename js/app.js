/* =========================================================
   MAISON — app.js
   Scaffold-level interactions only.
   Set piece animations (paint, scribble, saw, handwriting)
   are added in follow-up passes.
   ========================================================= */

(function () {

  /* ---------- sticky header scroll state ---------- */
  const backToTop = document.getElementById('backToTop');
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 20;
        document.querySelectorAll('.site-header').forEach(h => {
          // Don't change scroll state while mobile nav is open
          if (document.body.classList.contains('nav-open')) return;
          if (isScrolled) h.classList.add('scrolled');
          else h.classList.remove('scrolled');
        });
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
  const siteHeader = document.getElementById('siteHeader');
  let scrollPosition = 0; // Track scroll position for iOS lock

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      
      if (isOpen) {
        // Lock body scroll (iOS safe)
        scrollPosition = window.scrollY;
        document.body.classList.add('nav-open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
      } else {
        // Unlock body scroll
        document.body.classList.remove('nav-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollPosition);
      }
    });

    // Close menu when a nav link is tapped
    siteNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.classList.remove('open');
        // Unlock body scroll
        document.body.classList.remove('nav-open');
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollPosition);
      });
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
    renderPlans('planGridPage');
  }

  /* ---------- global modal logic ---------- */
  window.openModal = function(index) {
    if (typeof PLANS === 'undefined') return;
    const plan = PLANS[index];
    document.getElementById('modalTitle').textContent = plan.name;
    document.getElementById('modalSpec').innerHTML = plan.specText;
    document.getElementById('modalDesc').textContent = plan.description || '';
    document.getElementById('modalImage').innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px; width: 100%;">
        <img src="${plan.image}" alt="${plan.name} Exterior" style="width: 100%; height: auto; border-radius: 4px;">
        <img src="${plan.floorplan}" alt="${plan.name} Floorplan" style="width: 100%; height: auto; border-radius: 4px;">
        ${plan.floorplan2 ? `<img src="${plan.floorplan2}" alt="${plan.name} Secondary Floorplan" style="width: 100%; height: auto; border-radius: 4px;">` : ''}
      </div>
    `;
    document.getElementById('modalSeeMore').href = '/model.html?id=' + plan.slug;
    document.getElementById('planModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    document.getElementById('planModal').classList.remove('open');
    document.body.style.overflow = '';
  };


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
    { src: '/images/slider/slide-02.jpg', model: 'The Greenwich', nav: 'white' },
    { src: '/images/slider/slide-03.jpg', model: 'The Greenwich', nav: 'white' },
    { src: '/images/slider/slide-04.jpg', model: 'The Greenwich', nav: 'white' },
    { src: '/images/slider/slide-05.jpg', model: 'The Greenwich', nav: 'white' },
    { src: '/images/slider/slide-06.jpg', model: 'The Greenwich', nav: 'mixed' },
    
    // === THE WESTPORT (pages 7-10) ===
    { src: '/images/slider/slide-07.jpg', model: 'The Westport', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-08.jpg', model: 'The Westport', nav: 'mixed' },
    { src: '/images/slider/slide-09.jpg', model: 'The Westport', nav: 'mixed' },
    { src: '/images/slider/slide-10.jpg', model: 'The Westport', nav: 'mixed' },

    // === THE DARIEN (pages 11-14) ===
    { src: '/images/slider/slide-11.jpg', model: 'The Darien', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-12.jpg', model: 'The Darien', nav: 'mixed' },
    { src: '/images/slider/slide-13.jpg', model: 'The Darien', nav: 'mixed' },
    { src: '/images/slider/slide-14.jpg', model: 'The Darien', nav: 'mixed' },

    // === THE OCEAN BREEZE (pages 15-17) ===
    { src: '/images/slider/slide-15.jpg', model: 'The Ocean Breeze', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-16.jpg', model: 'The Ocean Breeze', nav: 'white' },
    { src: '/images/slider/slide-17.jpg', model: 'The Ocean Breeze', nav: 'white' },

    // === THE ROWAYTON 2 (pages 18-23) ===
    { src: '/images/slider/slide-18.jpg', model: 'The Rowayton 2', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-19.jpg', model: 'The Rowayton 2', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-20.jpg', model: 'The Rowayton 2', nav: 'white' },
    { src: '/images/slider/slide-21.jpg', model: 'The Rowayton 2', nav: 'white' },
    { src: '/images/slider/slide-22.jpg', model: 'The Rowayton 2', nav: 'white' },
    { src: '/images/slider/slide-23.jpg', model: 'The Rowayton 2', nav: 'white' },

    // === THE ROWAYTON 3 (pages 24-29) ===
    { src: '/images/slider/slide-24.jpg', model: 'The Rowayton 3', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-25.jpg', model: 'The Rowayton 3', nav: 'black', type: 'floorplan' },
    { src: '/images/slider/slide-26.jpg', model: 'The Rowayton 3', nav: 'white' },
    { src: '/images/slider/slide-27.jpg', model: 'The Rowayton 3', nav: 'white' },
    { src: '/images/slider/slide-28.jpg', model: 'The Rowayton 3', nav: 'white' },
    { src: '/images/slider/slide-29.jpg', model: 'The Rowayton 3', nav: 'white' },
  ];

  const MODEL_GROUPS = [
    { name: 'The Greenwich', start: 0, end: 5 },
    { name: 'The Westport', start: 6, end: 9 },
    { name: 'The Darien', start: 10, end: 13 },
    { name: 'The Ocean Breeze', start: 14, end: 16 }, 
    { name: 'The Rowayton 2', start: 17, end: 22 }, 
    { name: 'The Rowayton 3', start: 23, end: 28 }, 
  ];

  const sliderTrack = document.getElementById('sliderTrack');

  if (sliderTrack && SLIDE_DATA.length > 0) {
    const SLIDE_DURATION = 3500; // ms per slide
    let currentIndex = -1;

    // --- Build the ordered playback sequence ---
    // Shuffle model order, but keep slides within each model in original order.
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
          if (SLIDE_DATA[s].type !== 'floorplan') {
            order.push(s);
          }
        }
      });
      return order;
    }

    const playbackOrder = buildPlaybackOrder();
    let playbackPos = 0;

    // --- Header Wipe Setup ---
    const header1 = document.getElementById('siteHeader');
    let header2 = null;
    if (header1) {
      header2 = header1.cloneNode(true);
      header2.id = 'siteHeader2';
      // Remove child IDs to prevent duplicates
      header2.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      header1.parentNode.insertBefore(header2, header1.nextSibling);
      
      header1.style.zIndex = '100';
      header2.style.zIndex = '101';
      header2.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'; // default fully visible
      
      if (window.scrollY > 20) {
        header2.classList.add('scrolled');
      }
    }
    let activeHeaderNum = 1;

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
      
      // Dynamic scroll cue inside the slide so it wipes perfectly
      const cue = document.createElement('a');
      cue.href = '#who';
      cue.className = 'scroll-cue scroll-cue-hero';
      cue.innerHTML = '<span>keep scrolling</span><i>↓</i>';
      cue.style.color = slide.nav === 'black' ? 'var(--ink)' : 'var(--white)';
      div.appendChild(cue);
      
      // Caption text inside the slide so it wipes seamlessly
      let modelName = slide.model;
      if (typeof PLANS !== 'undefined') {
        const planData = PLANS.find(p => p.slug === slide.model);
        if (planData) modelName = planData.name;
      }
      const captionText = document.createElement('div');
      captionText.className = 'hero-caption-text';
      captionText.textContent = modelName;
      captionText.style.color = slide.nav === 'black' ? 'var(--ink)' : 'var(--white)';
      captionText.style.position = 'absolute';
      captionText.style.bottom = '40px';
      captionText.style.left = '40px';
      captionText.style.zIndex = '5';
      div.appendChild(captionText);

      sliderTrack.appendChild(div);
    });

    const slideEls = sliderTrack.querySelectorAll('.slider-slide');
    let isFirstLoad = true;
    let currentCaptionModel = null;
    const heroCaptionContainer = document.getElementById('heroCaptionContainer');

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
        slideEls[prevIndex].style.animation = ''; // clean up any inline overrides
      }

      // The new slide becomes .active and triggers the wipe animation
      void slideEls[index].offsetWidth;
      slideEls[index].classList.add('active');

      if (isFirstLoad) {
        slideEls[index].style.animation = 'none';
        slideEls[index].style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        isFirstLoad = false;
      } else {
        slideEls[index].style.animation = '';
        slideEls[index].style.clipPath = '';
      }

      // --- Header Sync Wipe ---
      if (header1 && header2) {
        const currentHeader = activeHeaderNum === 1 ? header1 : header2;
        const nextHeader = activeHeaderNum === 1 ? header2 : header1;

        if (slide.nav === 'black') {
          nextHeader.classList.add('nav-dark');
          nextHeader.classList.remove('nav-mixed');
        } else if (slide.nav === 'mixed') {
          nextHeader.classList.add('nav-mixed');
          nextHeader.classList.remove('nav-dark');
        } else {
          nextHeader.classList.remove('nav-dark', 'nav-mixed');
        }

        if (!isFirstLoad && prevIndex !== -1 && window.scrollY <= 20) {
          nextHeader.style.zIndex = '101';
          currentHeader.style.zIndex = '100';
          
          nextHeader.style.animation = 'none';
          void nextHeader.offsetWidth; // trigger reflow
          nextHeader.style.animation = 'wipe-in 1.4s cubic-bezier(0.77, 0, 0.175, 1) forwards';
        } else {
          // First load or Scrolled Down
          nextHeader.style.zIndex = '101';
          currentHeader.style.zIndex = '100';
          nextHeader.style.animation = 'none';
          nextHeader.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
        }
        
        activeHeaderNum = activeHeaderNum === 1 ? 2 : 1;
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
    let baHintStopped = false;

    // rAF-driven hint: drives setSlider() directly so image + handle move together
    let hintRaf = null;
    let hintStart = null;
    const sliderRect = slider.getBoundingClientRect();

    function hintTick(ts) {
      if (baHintStopped) return;
      if (!hintStart) hintStart = ts;
      const elapsed = (ts - hintStart) / 1000; // seconds
      const cycle = elapsed % 4; // 4-second loop

      let offset = 0;
      if (cycle < 0.4) {
        // swing left
        offset = -Math.sin((cycle / 0.4) * Math.PI) * 0.18;
      } else if (cycle < 0.8) {
        // swing right
        offset = Math.sin(((cycle - 0.4) / 0.4) * Math.PI) * 0.14;
      } else if (cycle < 1.1) {
        // settle
        offset = -Math.sin(((cycle - 0.8) / 0.3) * Math.PI) * 0.06;
      } else if (cycle < 2.5) {
        // rest at 0.5
        offset = 0;
      } else if (cycle < 2.6) {
        offset = -0.05 * Math.sin(((cycle - 2.5) / 0.1) * Math.PI);
      } else if (cycle < 2.7) {
        offset = 0.05 * Math.sin(((cycle - 2.6) / 0.1) * Math.PI);
      } else if (cycle < 2.8) {
        offset = -0.04 * Math.sin(((cycle - 2.7) / 0.1) * Math.PI);
      } else if (cycle < 2.9) {
        offset = 0.04 * Math.sin(((cycle - 2.8) / 0.1) * Math.PI);
      } else {
        offset = 0;
      }

      const rect = slider.getBoundingClientRect();
      const centerX = rect.left + rect.width * (0.5 + offset);
      setSlider(centerX);
      hintRaf = requestAnimationFrame(hintTick);
    }

    hintRaf = requestAnimationFrame(hintTick);

    // Show HOLD label on handle
    if (baHandle) baHandle.classList.add('hinting');

    function stopHint() {
      if (!baHintStopped) {
        baHintStopped = true;
        if (hintRaf) cancelAnimationFrame(hintRaf);
        if (baHandle) {
          baHandle.classList.remove('hinting');
          baHandle.style.animation = 'none';
        }
      }
    }

    slider.addEventListener('mousedown', (e) => { dragging = true; stopHint(); setSlider(e.clientX); });
    window.addEventListener('mousemove', (e) => { if (dragging) setSlider(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    slider.addEventListener('touchstart', (e) => { stopHint(); setSlider(e.touches[0].clientX); }, { passive: true });
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
    
    // Disable on mobile to prevent choppy scrolling
    if (window.innerWidth <= 960) {
      section.classList.add('painted');
      coverSvg.style.display = 'none';
      return;
    }
    
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
      /* Item 16: 1.4× multiplier so paint completes ~30% sooner */
      p = Math.min(1, p * 1.4);
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
      ADMIN PANEL LISTENER
      ========================================================= */
  let adminBuffer = '';

  // ---- audio: realistic mechanical/industrial ----
  let ac;
  let noiseBuffer;
  function initAudio(){
    if (ac) return;
    ac = new (window.AudioContext||window.webkitAudioContext)();
    const len = ac.sampleRate;
    noiseBuffer = ac.createBuffer(1, len, ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for(let i=0;i<len;i++) data[i] = Math.random()*2-1;
  }

  function thock(){
    if(!ac) return;
    const t = ac.currentTime;
    const click = ac.createBufferSource();
    click.buffer = noiseBuffer;
    click.playbackRate.value = 1.2 + Math.random()*0.4;
    const clickHp = ac.createBiquadFilter();
    clickHp.type='highpass'; clickHp.frequency.value = 1800;
    const clickBp = ac.createBiquadFilter();
    clickBp.type='bandpass'; clickBp.frequency.value = 2800 + Math.random()*600; clickBp.Q.value = 1.5;
    const clickG = ac.createGain();
    clickG.gain.setValueAtTime(0.0001, t);
    clickG.gain.exponentialRampToValueAtTime(0.025, t+0.0005);
    clickG.gain.exponentialRampToValueAtTime(0.0001, t+0.006);
    click.connect(clickHp).connect(clickBp).connect(clickG).connect(ac.destination);
    click.start(t, Math.random()*0.9, 0.008);

    const tone = ac.createOscillator();
    tone.type = 'sine';
    tone.frequency.value = 320 + Math.random()*40;
    const toneG = ac.createGain();
    toneG.gain.setValueAtTime(0.0001, t);
    toneG.gain.exponentialRampToValueAtTime(0.05, t+0.001);
    toneG.gain.exponentialRampToValueAtTime(0.0001, t+0.025);
    tone.connect(toneG).connect(ac.destination);
    tone.start(t);
    tone.stop(t+0.03);
  }

  function seek(){
    if(!ac) return;
    const t = ac.currentTime;
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer;
    src.playbackRate.value = 1.2 + Math.random()*0.8;
    const bp = ac.createBiquadFilter();
    bp.type='bandpass';
    const startF = 250 + Math.random()*400;
    const endF = startF + (Math.random()*600 - 300);
    bp.frequency.setValueAtTime(startF, t);
    bp.frequency.exponentialRampToValueAtTime(Math.max(200,endF), t+0.04);
    bp.Q.value = 4;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.04, t+0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t+0.05);
    src.connect(bp).connect(g).connect(ac.destination);
    src.start(t, Math.random()*0.9, 0.06);
  }

  // ---- content ----
  const hex = (n) => Array.from({length:n},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join('');
  const rnd = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const pick = (a) => a[Math.floor(Math.random()*a.length)];
  const hosts = ['node-01','node-02','node-03','edge-us-east-1','edge-eu-west-2','db-primary','db-replica-3','cache-01','feed-ingress','scanner-7f8b'];
  const services = ['core','evaluator','scanner','cache','db-primary','feed','gateway','metrics','vault','queue-worker'];

  function block_systemd(){
    const lines = [];
    for(const s of services){
      lines.push({c:'g', t:`● ${s}.service - ${s} daemon`});
      lines.push({c:'d', t:`   Loaded: loaded (/etc/systemd/system/${s}.service; enabled; preset: enabled)`});
      lines.push({c:'d', t:`   Active: active (running) since ${new Date(Date.now()-rnd(1e5,1e9)).toUTCString()}`});
      lines.push({c:'d', t:` Main PID: ${rnd(1000,99999)} (${s})`});
      lines.push({c:'d', t:`    Tasks: ${rnd(4,80)}    Memory: ${rnd(40,2400)}.${rnd(0,9)}M    CPU: ${rnd(0,12)}.${rnd(100,999)}s`});
      lines.push({c:'dd', t:`   CGroup: /system.slice/${s}.service`});
      lines.push({c:'dd', t:`           └─${rnd(1000,99999)} /usr/bin/${s} --config /etc/${s}/config.yaml`});
      lines.push({c:'g', t:' '});
    }
    return lines;
  }
  function block_log(){
    const lines = [];
    const levels = [['INFO','d'],['INFO','d'],['INFO','d'],['DEBUG','dd'],['DEBUG','dd'],['WARN','g'],['INFO','d']];
    for(let i=0;i<28;i++){
      const ts = new Date(Date.now()-rnd(0,1e6)).toISOString().replace('T',' ').slice(0,23);
      const [lvl, c] = pick(levels);
      const svc = pick(services);
      const msgs = [
        `bootstrap complete in ${rnd(120,890)}ms`,
        `connecting to ws://${pick(hosts)}:${rnd(8000,9999)}`,
        `subscribed to ${rnd(2000,8000)} contracts`,
        `latency p50=${rnd(2,12)}ms p99=${rnd(14,48)}ms p999=${rnd(50,200)}ms`,
        `kelly_frac=0.${rnd(8,18)} max_pos=0.0${rnd(2,8)}`,
        `rate limiter: ${rnd(40,98)}% capacity (${rnd(800,9999)}/${rnd(10000,12000)} rps)`,
        `gc pause: ${rnd(1,8)}.${rnd(100,999)}ms`,
        `cache hit ratio: 0.${rnd(80,99)}${rnd(10,99)}`,
        `processed batch id=${hex(8)} size=${rnd(100,9999)}`,
        `evicted ${rnd(10,400)} stale entries`,
        `replication lag: ${rnd(0,8)}.${rnd(0,9)}ms`,
        `tx committed: ${hex(12)} (${rnd(1,24)}ms)`,
        `outbound: ${rnd(40,800)}KB/s  inbound: ${rnd(80,2400)}KB/s`,
        `heap: used=${rnd(200,1800)}MB total=${rnd(2000,4096)}MB`,
      ];
      lines.push({c, t:`[${ts}] ${lvl}  ${svc.padEnd(10)} ${pick(msgs)}`});
    }
    return lines;
  }
  function block_docker(){
    const lines = [{c:'g', t:'CONTAINER ID   IMAGE                          STATUS              PORTS                    NAMES'}];
    for(let i=0;i<14;i++){
      const id = hex(6);
      const img = pick(services)+':'+rnd(0,9)+'.'+rnd(0,30)+'.'+rnd(0,9);
      const status = 'Up '+rnd(1,90)+' '+pick(['minutes','hours','days']);
      const port = rnd(3000,9999)+'/tcp';
      lines.push({c:'dd', t:`${id}   ${img.padEnd(30)} ${status.padEnd(19)} 0.0.0.0:${port}   ${pick(services)}-${hex(4)}`});
    }
    lines.push({c:'g',t:' '});
    return lines;
  }
  function block_kubectl(){
    const lines = [{c:'g',t:'NAME                          READY   STATUS    RESTARTS   AGE     IP             NODE'}];
    for(let i=0;i<18;i++){
      const name = pick(services)+'-'+hex(4)+'-'+hex(5);
      lines.push({c:'dd', t:`${name.padEnd(30)}1/1     Running   0          ${rnd(1,30)}d     10.${rnd(0,255)}.${rnd(0,255)}.${rnd(0,255)}   ${pick(hosts)}`});
    }
    lines.push({c:'g',t:' '});
    return lines;
  }
  function block_build(){
    const files = ['scanner.js','evaluator.ts','core.go','feed.rs','kelly.py','router.tsx','schema.sql','config.yaml','main.cpp','indexer.go'];
    return [
      {c:'w',t:'$ npm run build --silent'},
      {c:'d',t:'> vite build'},
      {c:'d',t:'  vite v5.4.10 building for production...'},
      ...Array.from({length:18},(_,i)=>({c:'dd',t:`  transforming (${(i+1)*70})  src/${pick(files)}`})),
      {c:'g',t:`✓ ${rnd(900,1800)} modules transformed.`},
      {c:'d',t:`dist/assets/index-${hex(4)}.css   ${rnd(20,80)}.${rnd(10,99)} kB │ gzip: ${rnd(4,12)}.${rnd(10,99)} kB`},
      {c:'d',t:`dist/assets/index-${hex(4)}.js    ${rnd(300,900)}.${rnd(10,99)} kB │ gzip: ${rnd(80,240)}.${rnd(10,99)} kB`},
      {c:'g',t:`✓ built in ${rnd(2,8)}.${rnd(10,99)}s`},
      {c:'w',t:' '},
    ];
  }
  function block_git(){
    return [
      {c:'w',t:'$ git pull --rebase origin main'},
      {c:'d',t:'remote: Enumerating objects: '+rnd(20,200)+', done.'},
      {c:'d',t:'remote: Counting objects: 100% ('+rnd(20,200)+'/'+rnd(20,200)+'), done.'},
      {c:'d',t:'remote: Compressing objects: 100% ('+rnd(10,80)+'/'+rnd(10,80)+'), done.'},
      {c:'d',t:'remote: Total '+rnd(30,300)+' (delta '+rnd(5,100)+'), reused 0 (delta 0)'},
      {c:'d',t:'Receiving objects: 100% ('+rnd(30,300)+'/'+rnd(30,300)+'), '+rnd(10,400)+'.'+rnd(0,9)+' KiB | '+rnd(2,12)+'.'+rnd(0,9)+' MiB/s, done.'},
      {c:'d',t:'Resolving deltas: 100% ('+rnd(20,200)+'/'+rnd(20,200)+'), completed with '+rnd(0,10)+' local objects.'},
      {c:'g',t:'Successfully rebased and updated refs/heads/main.'},
      {c:'w',t:' '},
    ];
  }
  function block_hexdump(){
    const lines = [];
    for(let i=0;i<22;i++){
      const addr = (i*16).toString(16).padStart(8,'0');
      const bytes = Array.from({length:16},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(' ');
      const ascii = Array.from({length:16},()=>{ const c=Math.floor(Math.random()*94)+33; return String.fromCharCode(c); }).join('');
      lines.push({c:'dd', t:`${addr}  ${bytes}  |${ascii}|`});
    }
    return lines;
  }
  function block_scan(){
    const lines = [{c:'w',t:'$ ./bin/scan --watch --threshold=0.12'}];
    for(let i=0;i<20;i++){
      const r = Math.random();
      if(r<0.3) lines.push({c:'d',t:`[scan] edge detected: 0.${rnd(8,30)} (filtered)`});
      else if(r<0.5) lines.push({c:'g',t:`[scan] edge detected: 0.${rnd(15,28)} → queued`});
      else if(r<0.7) lines.push({c:'dd',t:`[scan] tick ${hex(8)}  ${rnd(2000,8000)} contracts evaluated`});
      else lines.push({c:'dd',t:`[scan] portfolio delta: ${Math.random()<0.5?'+':'-'}0.0${rnd(10,80)}`});
    }
    return lines;
  }
  function block_curl(){
    return [
      {c:'w',t:'$ curl -sv https://api.internal/v2/markets'},
      {c:'dd',t:'*   Trying 10.0.4.18:443...'},
      {c:'dd',t:'* Connected to api.internal (10.0.4.18) port 443'},
      {c:'dd',t:'* TLSv1.3 (OUT), TLS handshake, Client hello (1):'},
      {c:'dd',t:'* TLSv1.3 (IN), TLS handshake, Server hello (2):'},
      {c:'dd',t:'* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384'},
      {c:'dd',t:'> GET /v2/markets HTTP/2'},
      {c:'dd',t:'> Host: api.internal'},
      {c:'dd',t:'< HTTP/2 200'},
      {c:'dd',t:'< content-type: application/json'},
      {c:'dd',t:'< content-length: '+rnd(10000,99999)},
      {c:'g',t:'{"status":"ok","markets":'+rnd(4000,8000)+',"ts":'+Date.now()+'}'},
      {c:'w',t:' '},
    ];
  }
  function block_compile(){
    const lines = [{c:'w',t:'$ cargo build --release'}];
    const crates = ['tokio','serde','reqwest','clap','anyhow','futures','async-trait','tower','hyper','tracing','rayon','axum','sqlx','tonic','prost'];
    for(let i=0;i<16;i++){
      lines.push({c:'dd',t:`   Compiling ${pick(crates)} v${rnd(0,2)}.${rnd(0,20)}.${rnd(0,30)}`});
    }
    lines.push({c:'g',t:`    Finished release [optimized] target(s) in ${rnd(20,120)}.${rnd(10,99)}s`});
    lines.push({c:'w',t:' '});
    return lines;
  }
  const blockGens = [block_systemd, block_log, block_docker, block_kubectl, block_build, block_git, block_hexdump, block_scan, block_curl, block_compile];

  function buildBuffer(){
    const scroll = document.getElementById('scroll');
    scroll.innerHTML = '';
    const frag = document.createDocumentFragment();
    for(let i=0;i<100;i++){
      const block = pick(blockGens)();
      for(const {c,t} of block){
        const div = document.createElement('div');
        div.className = 'line ' + c;
        div.textContent = t || ' ';
        frag.appendChild(div);
      }
    }
    scroll.appendChild(frag);
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function typeInto(el, text, minDelay=55, maxDelay=110){
    el.innerHTML = '<span class="cur"></span>';
    const cur = el.querySelector('.cur');
    for(const ch of text){
      const node = document.createTextNode(ch);
      el.insertBefore(node, cur);
      if(Math.random() < 1.0) thock();
      await sleep(minDelay + Math.random()*(maxDelay-minDelay));
    }
    return cur;
  }

  async function backspaceFrom(el, speed=22){
    const cur = el.querySelector('.cur');
    if(cur) cur.remove();
    while(el.textContent.length > 0){
      el.textContent = el.textContent.slice(0, -1);
      if(Math.random() < 1.0) thock();
      await sleep(speed + Math.random()*15);
    }
  }

  async function runBootSequence(data, passkey) {
    if (!document.getElementById('bootOverlay')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div id="bootOverlay">
          <div id="term"><div id="scroll"></div></div>
          <div id="greet">
            <div class="row" id="greetLine1"></div>
            <div class="name" id="greetLine2"></div>
          </div>
        </div>
        <canvas id="matrixCanvas"></canvas>
      `);
      initMatrix();
    }
    
    const overlay = document.getElementById('bootOverlay');
    const term = document.getElementById('term');
    const scroll = document.getElementById('scroll');
    const greetLayer = document.getElementById('greet');
    const line1 = document.getElementById('greetLine1');
    const line2 = document.getElementById('greetLine2');
    
    overlay.style.display = 'block';
    term.style.display = 'block';
    greetLayer.style.display = 'none';
    line1.innerHTML = '';
    line2.innerHTML = '';
    
    // fade in overlay
    requestAnimationFrame(() => overlay.style.opacity = '1');
    
    buildBuffer();
    
    const DURATION = 1000;
    const viewportH = window.innerHeight;
    const contentH = scroll.scrollHeight;
    const startY = viewportH;
    const endY = viewportH - contentH;
    scroll.style.transform = `translateY(${startY}px)`;

    const totalSounds = 140;
    for(let k=0;k<totalSounds;k++){
      const ms = (k/totalSounds) * DURATION + Math.random()*6;
      setTimeout(() => {
        if(Math.random()<0.75) thock(); else seek();
      }, ms);
    }

    const t0 = performance.now();
    function step(){
      const elapsed = performance.now() - t0;
      const p = Math.min(1, elapsed/DURATION);
      const eased = 1 - Math.pow(1-p, 1.8);
      const y = startY + (endY - startY) * eased;
      scroll.style.transform = `translateY(${y}px)`;
      if(p < 1) requestAnimationFrame(step);
      else greeting();
    }
    requestAnimationFrame(step);

    async function greeting(){
      term.style.display = 'none';
      greetLayer.style.display = 'flex';
      await sleep(180);
      const cur1 = await typeInto(line1, 'Welcome back', 60, 120);
      
      const userName = data.ownerName || 'Admin';
      if (userName) {
        await sleep(500);
        cur1.remove();
        await typeInto(line2, userName, 70, 130);
      }
      
      await sleep(1400);
      await backspaceFrom(line2, 18);
      await sleep(120);
      await backspaceFrom(line1, 14);
      
      openAdminPanel(data, passkey);
      
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 200);
      }, 50);
    }
  }

  // --- Matrix Rain Logic ---
  let matrixRunning = false;
  function initMatrix() {
    const c = document.getElementById('matrixCanvas');
    const ctx = c.getContext('2d');
    const CELL_PX = 16;
    const FONT_PX = 14;
    const CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ0123456789:・."=*+-<>¦|';
    const pickChar = () => CHARS[(Math.random()*CHARS.length)|0];
    const rnd = (a,b) => a + Math.random()*(b-a);
    let W, H, cols, rows, columns;
    const ACTIVE_COL_FRACTION = 0.95;

    function makeProfile(length){
      const p1 = Math.random()*Math.PI*2, p2 = Math.random()*Math.PI*2, p3 = Math.random()*Math.PI*2;
      const f1 = 0.35 + Math.random()*0.25, f2 = 0.75 + Math.random()*0.5, f3 = 1.4 + Math.random()*0.6;
      const decay = 0.04 + Math.random()*0.04;
      const arr = new Float32Array(length);
      for(let i=0;i<length;i++){
        const env = 1 / (1 + i*decay);
        const bump = 0.5 + 0.5 * (Math.sin(i*f1 + p1) * 0.55 + Math.sin(i*f2 + p2) * 0.30 + Math.sin(i*f3 + p3) * 0.15);
        arr[i] = env * bump;
      }
      return arr;
    }

    function newStream(rowsCount){
      const length = (rnd(14, 36)|0);
      return { headY: -rnd(0, 12), speed: rnd(6, 16), length, profile: makeProfile(length) };
    }

    function resize(){
      W = c.width = window.innerWidth * devicePixelRatio;
      H = c.height = window.innerHeight * devicePixelRatio;
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
      cols = Math.ceil(W / (CELL_PX * devicePixelRatio));
      rows = Math.ceil(H / (CELL_PX * devicePixelRatio)) + 2;
      columns = [];
      for(let x=0;x<cols;x++){
        const active = Math.random() < ACTIVE_COL_FRACTION;
        const initialStreams = [];
        if(active){
          const n = Math.random() < 0.55 ? 2 : 1;
          for(let k=0;k<n;k++){
            const s = newStream(rows);
            s.headY = rnd(-4, rows + 6);
            initialStreams.push(s);
          }
        }
        columns.push({
          streams: initialStreams, active, charByRow: new Map(),
          respawnIn: active ? 0 : rnd(0.1, 1.5), nextSpawnIn: active ? rnd(0.1, 1.2) : 0,
        });
      }
      ctx.font = `${FONT_PX * devicePixelRatio}px 'Menlo','Monaco','Courier New',monospace`;
      ctx.textBaseline = 'top';
    }
    window.addEventListener('resize', resize);
    resize();

    let last = performance.now();
    function frame(now){
      if (!matrixRunning) return;
      const dt = Math.min(0.05, (now - last)/1000);
      last = now;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      for(let x=0;x<cols;x++){
        const col = columns[x];
        if(!col.active){
          col.respawnIn -= dt;
          if(col.respawnIn <= 0){
            if(Math.random() < ACTIVE_COL_FRACTION){ col.active = true; col.nextSpawnIn = 0; }
            else col.respawnIn = rnd(0.3, 2.0);
          }
        } else {
          col.nextSpawnIn -= dt;
          if(col.nextSpawnIn <= 0){
            col.streams.push(newStream(rows));
            col.nextSpawnIn = rnd(0.6, 2.4);
            if(Math.random() < 0.015){ col.active = false; col.respawnIn = rnd(0.3, 1.8); }
          }
        }
        for(let si = col.streams.length - 1; si >= 0; si--){
          const s = col.streams[si];
          s.headY += s.speed * dt;
          for(let i=0;i<s.length;i++){
            const row = Math.floor(s.headY - i);
            if(row < 0 || row >= rows) continue;
            let entry = col.charByRow.get(row);
            if(!entry){ entry = { ch: pickChar(), life: rnd(0.3, 2.5) }; col.charByRow.set(row, entry); }
            entry.life -= dt;
            if(entry.life <= 0){ entry.ch = pickChar(); entry.life = rnd(0.4, 3.0); }
            const b = Math.min(1, s.profile[i]);
            if(b < 0.05) continue;
            const v = Math.round(15 + b * 220);
            ctx.fillStyle = `rgb(${v},${v},${v})`;
            ctx.fillText(entry.ch, x * CELL_PX * devicePixelRatio, row * CELL_PX * devicePixelRatio);
          }
          if(s.headY - s.length > rows) col.streams.splice(si, 1);
        }
      }
      requestAnimationFrame(frame);
    }
    window.startMatrix = () => { matrixRunning = true; last = performance.now(); requestAnimationFrame(frame); };
    window.stopMatrix = () => { matrixRunning = false; };
  }

  document.addEventListener('keydown', async (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    if (document.activeElement.isContentEditable) return;
    
    // Auth gesture for AudioContext
    initAudio();
    if (ac && ac.state === 'suspended') ac.resume();

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
          runBootSequence(data, candidate);
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
    
    const mc = document.getElementById('matrixCanvas');
    if (mc) mc.style.display = 'block';
    if (window.startMatrix) window.startMatrix();

    panel.classList.add('open');

    const onEsc = (e) => {
      if (e.key === 'Escape') {
        panel.classList.remove('open');
        const mc = document.getElementById('matrixCanvas');
        if (mc) mc.style.display = 'none';
        if (window.stopMatrix) window.stopMatrix();
        adminBuffer = '';
        document.removeEventListener('keydown', onEsc);
      }
    };
    document.addEventListener('keydown', onEsc);
  }

  function renderPanelContents(panel, data, passkey) {
    const subs = data.submissions || [];
    panel.innerHTML = `
      <div class="admin-header" style="display:block; border-bottom:none; padding-bottom:0;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2>welcome back, ${data.ownerName}.</h2>
          <button class="admin-close" style="position:static; margin-top:-10px; margin-right:-10px;" onclick="document.getElementById('adminPanel').classList.remove('open'); const mc = document.getElementById('matrixCanvas'); if(mc) mc.style.display='none'; if(window.stopMatrix) window.stopMatrix();">&times;</button>
        </div>
        <div style="display:flex; gap:24px; margin-top:16px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:0;">
          <button class="admin-tab-btn active" id="tabInboxBtn" onclick="switchAdminTab('inbox')">Inbox</button>
          <button class="admin-tab-btn" id="tabAnalyticsBtn" onclick="switchAdminTab('analytics')">Analytics</button>
        </div>
      </div>

      <div id="adminInboxTab">
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
        <div id="adminEmptyState" style="display:none; border:1px dashed rgba(255,255,255,0.15); border-radius:6px; padding:48px; text-align:center; margin-top:24px;">
          <div style="font-size:28px; margin-bottom:12px; opacity:0.3;">📬</div>
          <div style="font-size:14px; opacity:0.5; font-family:'Menlo',monospace; letter-spacing:0.05em;">Requests will appear here</div>
          <div style="font-size:12px; opacity:0.3; margin-top:6px;">When someone fills out the contact form, it shows up here.</div>
        </div>
      </div>

      <div id="adminAnalyticsTab" style="display:none; padding:24px 0;">
        <!-- KPI row -->
        <div style="display:grid; grid-template-columns: repeat(4,1fr); gap:16px; margin-bottom:32px;">
          <div class="a-kpi-card" id="akpi0"><div class="a-kpi-label">Total Visitors</div><div class="a-kpi-val" id="akpiV0">0</div><div class="a-kpi-delta positive">+12% vs last month</div></div>
          <div class="a-kpi-card" id="akpi1"><div class="a-kpi-label">Contact Requests</div><div class="a-kpi-val" id="akpiV1">0</div><div class="a-kpi-delta positive">+8% vs last month</div></div>
          <div class="a-kpi-card" id="akpi2"><div class="a-kpi-label">Most Viewed Model</div><div class="a-kpi-val" style="font-size:18px;" id="akpiV2">--</div><div class="a-kpi-delta neutral">42% of plan views</div></div>
          <div class="a-kpi-card" id="akpi3"><div class="a-kpi-label">Avg. Session (min)</div><div class="a-kpi-val" id="akpiV3">0</div><div class="a-kpi-delta positive">+22 sec vs last month</div></div>
        </div>

        <!-- Charts row -->
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-bottom:20px;">
          <!-- Traffic over time -->
          <div class="a-chart-card">
            <div class="a-chart-header">
              <div>
                <div class="a-chart-title">Site Traffic</div>
                <div class="a-chart-sub">Unique visitors over time</div>
              </div>
              <div style="display:flex; gap:8px;">
                <button class="a-period-btn active" onclick="setTrafficPeriod('7d',this)">7D</button>
                <button class="a-period-btn" onclick="setTrafficPeriod('30d',this)">30D</button>
                <button class="a-period-btn" onclick="setTrafficPeriod('90d',this)">90D</button>
              </div>
            </div>
            <canvas id="trafficChart" height="180"></canvas>
            <div id="trafficTooltip" class="a-tooltip" style="display:none;"></div>
          </div>
          <!-- Model preference donut -->
          <div class="a-chart-card">
            <div class="a-chart-header">
              <div>
                <div class="a-chart-title">Model Preference</div>
                <div class="a-chart-sub">Plan page views</div>
              </div>
            </div>
            <canvas id="donutChart" height="180"></canvas>
            <div id="donutLegend" style="margin-top:12px; font-size:12px;"></div>
          </div>
        </div>

        <!-- Row 2: conversion funnel + source breakdown -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
          <!-- Conversion funnel -->
          <div class="a-chart-card">
            <div class="a-chart-header">
              <div>
                <div class="a-chart-title">Conversion Funnel</div>
                <div class="a-chart-sub">Visitors to submissions</div>
              </div>
            </div>
            <canvas id="funnelChart" height="160"></canvas>
          </div>
          <!-- Traffic sources bar -->
          <div class="a-chart-card">
            <div class="a-chart-header">
              <div>
                <div class="a-chart-title">Traffic Sources</div>
                <div class="a-chart-sub">Where visitors come from</div>
              </div>
            </div>
            <canvas id="sourceChart" height="160"></canvas>
          </div>
        </div>
      </div>
    `;

    window.switchAdminTab = function(tab) {
      document.getElementById('adminInboxTab').style.display = tab === 'inbox' ? 'block' : 'none';
      document.getElementById('adminAnalyticsTab').style.display = tab === 'analytics' ? 'block' : 'none';
      document.getElementById('tabInboxBtn').classList.toggle('active', tab === 'inbox');
      document.getElementById('tabAnalyticsBtn').classList.toggle('active', tab === 'analytics');
      if (tab === 'analytics') initAnalyticsCharts();
    };

    // ---- Analytics Charts ----
    function animateCount(el, target, suffix, duration, decimals) {
      let start = 0; const step = target / (duration / 16);
      const tick = () => {
        start = Math.min(start + step, target);
        el.textContent = decimals ? start.toFixed(decimals) + (suffix||'') : Math.floor(start) + (suffix||'');
        if (start < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    function initAnalyticsCharts() {
      // Animate KPIs
      animateCount(document.getElementById('akpiV0'), 2847, '', 1200);
      animateCount(document.getElementById('akpiV1'), subs.length || 14, '', 1200);
      document.getElementById('akpiV2').textContent = 'The Greenwich';
      animateCount(document.getElementById('akpiV3'), 3.4, ' min', 1200, 1);

      const cobalt = '#1a3a6b';
      const cobaltLight = '#2a5faa';
      const pink = '#d4a0a0';
      const gold = '#c8a96e';

      // ---- Traffic Line Chart ----
      const trafficCanvas = document.getElementById('trafficChart');
      if (!trafficCanvas) return;
      const trafficCtx = trafficCanvas.getContext('2d');
      trafficCanvas.width = trafficCanvas.offsetWidth;

      const allData = {
        '7d':  { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values: [42,67,55,89,120,98,143] },
        '30d': { labels: Array.from({length:30},(_,i)=>'Day '+(i+1)), values: Array.from({length:30},()=>Math.floor(30+Math.random()*120)) },
        '90d': { labels: Array.from({length:12},(_,i)=>['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]), values: [310,480,520,690,750,820,640,710,890,960,1100,980] }
      };
      let currentPeriod = '7d';

      function drawTrafficChart(periodKey, progress) {
        const { labels, values } = allData[periodKey];
        const W = trafficCanvas.width, H = trafficCanvas.height;
        trafficCtx.clearRect(0,0,W,H);

        const pad = { t:20, r:20, b:40, l:50 };
        const cw = W - pad.l - pad.r;
        const ch = H - pad.t - pad.b;
        const maxV = Math.max(...values) * 1.1;
        const pts = values.map((v,i) => ({
          x: pad.l + (i/(values.length-1)) * cw,
          y: pad.t + ch - (v / maxV) * ch * progress
        }));

        // Grid lines
        trafficCtx.strokeStyle = 'rgba(255,255,255,0.06)';
        trafficCtx.lineWidth = 1;
        [0.25,0.5,0.75,1].forEach(f => {
          const y = pad.t + ch * (1-f);
          trafficCtx.beginPath(); trafficCtx.moveTo(pad.l,y); trafficCtx.lineTo(W-pad.r,y); trafficCtx.stroke();
          trafficCtx.fillStyle = 'rgba(255,255,255,0.3)';
          trafficCtx.font = '10px Inter,sans-serif';
          trafficCtx.fillText(Math.floor(maxV*f), 4, y+4);
        });

        // Area fill
        const grad = trafficCtx.createLinearGradient(0,pad.t,0,pad.t+ch);
        grad.addColorStop(0,'rgba(42,95,170,0.5)');
        grad.addColorStop(1,'rgba(42,95,170,0.02)');
        trafficCtx.beginPath();
        trafficCtx.moveTo(pts[0].x, pad.t+ch);
        pts.forEach(p => trafficCtx.lineTo(p.x, p.y));
        trafficCtx.lineTo(pts[pts.length-1].x, pad.t+ch);
        trafficCtx.closePath();
        trafficCtx.fillStyle = grad;
        trafficCtx.fill();

        // Line
        trafficCtx.beginPath();
        trafficCtx.moveTo(pts[0].x, pts[0].y);
        pts.forEach(p => trafficCtx.lineTo(p.x, p.y));
        trafficCtx.strokeStyle = cobaltLight;
        trafficCtx.lineWidth = 2.5;
        trafficCtx.lineJoin = 'round';
        trafficCtx.stroke();

        // Dots
        pts.forEach(p => {
          trafficCtx.beginPath();
          trafficCtx.arc(p.x, p.y, 4, 0, Math.PI*2);
          trafficCtx.fillStyle = cobaltLight;
          trafficCtx.fill();
          trafficCtx.strokeStyle = '#0a0a0a';
          trafficCtx.lineWidth = 2;
          trafficCtx.stroke();
        });

        // X labels (sparse)
        trafficCtx.fillStyle = 'rgba(255,255,255,0.4)';
        trafficCtx.font = '10px Inter,sans-serif';
        trafficCtx.textAlign = 'center';
        const step = Math.max(1, Math.floor(labels.length / 7));
        labels.forEach((l,i) => {
          if (i % step === 0) trafficCtx.fillText(l, pts[i].x, H-6);
        });

        return pts;
      }

      let trafficPts = [];
      let trafficAnim = null;
      function animateTraffic(periodKey) {
        if(trafficAnim) cancelAnimationFrame(trafficAnim);
        let start = null;
        function frame(ts) {
          if(!start) start = ts;
          const p = Math.min((ts-start)/600, 1);
          trafficPts = drawTrafficChart(periodKey, p);
          if(p<1) trafficAnim = requestAnimationFrame(frame);
        }
        trafficAnim = requestAnimationFrame(frame);
      }
      animateTraffic('7d');

      // Hover tooltip on traffic chart
      const trafficTooltip = document.getElementById('trafficTooltip');
      trafficCanvas.addEventListener('mousemove', e => {
        const rect = trafficCanvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const scaleX = trafficCanvas.width / rect.width;
        const mxS = mx * scaleX;
        let closest = null, closestDist = Infinity;
        trafficPts.forEach((p,i) => {
          const d = Math.abs(p.x - mxS);
          if(d < closestDist) { closestDist = d; closest = i; }
        });
        if(closest !== null && closestDist < 40) {
          const d = allData[currentPeriod];
          trafficTooltip.style.display = 'block';
          trafficTooltip.style.left = (mx + 8) + 'px';
          trafficTooltip.style.top = (my - 36) + 'px';
          trafficTooltip.innerHTML = '<strong>' + d.labels[closest] + '</strong>: ' + d.values[closest] + ' visitors';
        } else {
          trafficTooltip.style.display = 'none';
        }
      });
      trafficCanvas.addEventListener('mouseleave', () => trafficTooltip.style.display = 'none');

      window.setTrafficPeriod = function(period, btn) {
        currentPeriod = period;
        document.querySelectorAll('.a-period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        animateTraffic(period);
      };

      // ---- Donut Chart ----
      const donutCanvas = document.getElementById('donutChart');
      const donutCtx = donutCanvas.getContext('2d');
      donutCanvas.width = donutCanvas.offsetWidth;
      const donutData = [
        { label:'The Greenwich', value:42, color:'#2a5faa' },
        { label:'The Darien',    value:28, color:'#7b9ed9' },
        { label:'Rowayton 2',    value:15, color:'#c8a96e' },
        { label:'The Westport',  value:10, color:'#d4a0a0' },
        { label:'Other',         value:5,  color:'rgba(255,255,255,0.15)' }
      ];
      const total = donutData.reduce((a,d) => a+d.value, 0);
      let donutHover = -1;

      function drawDonut(progress, hoverIdx) {
        const W = donutCanvas.width, H = donutCanvas.height;
        donutCtx.clearRect(0,0,W,H);
        const cx = W/2, cy = H/2 - 10;
        const outerR = Math.min(cx,cy) - 8;
        const innerR = outerR * 0.58;
        let angle = -Math.PI / 2;
        donutData.forEach((d,i) => {
          const sweep = (d.value / total) * Math.PI * 2 * progress;
          const isHover = i === hoverIdx;
          const r = isHover ? outerR + 8 : outerR;
          donutCtx.beginPath();
          donutCtx.moveTo(cx, cy);
          donutCtx.arc(cx, cy, r, angle, angle+sweep);
          donutCtx.closePath();
          donutCtx.fillStyle = d.color;
          donutCtx.fill();
          if(isHover) {
            donutCtx.strokeStyle = 'rgba(255,255,255,0.3)';
            donutCtx.lineWidth = 2;
            donutCtx.stroke();
          }
          angle += sweep;
        });
        // Inner hole
        donutCtx.beginPath();
        donutCtx.arc(cx, cy, innerR, 0, Math.PI*2);
        donutCtx.fillStyle = '#0a0a0a';
        donutCtx.fill();
        // Center label
        if(hoverIdx >= 0) {
          donutCtx.fillStyle = '#fff';
          donutCtx.font = 'bold 20px Inter,sans-serif';
          donutCtx.textAlign = 'center';
          donutCtx.fillText(donutData[hoverIdx].value + '%', cx, cy+2);
          donutCtx.font = '10px Inter,sans-serif';
          donutCtx.fillStyle = 'rgba(255,255,255,0.5)';
          donutCtx.fillText(donutData[hoverIdx].label, cx, cy+16);
        }
      }

      let donutAnim = null;
      function animateDonut() {
        if(donutAnim) cancelAnimationFrame(donutAnim);
        let start = null;
        function frame(ts) {
          if(!start) start = ts;
          const p = Math.min((ts-start)/800, 1);
          drawDonut(p, donutHover);
          if(p<1) donutAnim = requestAnimationFrame(frame);
        }
        donutAnim = requestAnimationFrame(frame);
      }
      animateDonut();

      // Donut hover
      donutCanvas.addEventListener('mousemove', e => {
        const rect = donutCanvas.getBoundingClientRect();
        const mx = (e.clientX-rect.left) * (donutCanvas.width/rect.width);
        const my = (e.clientY-rect.top) * (donutCanvas.height/rect.height);
        const cx = donutCanvas.width/2, cy = donutCanvas.height/2-10;
        const dx = mx-cx, dy = my-cy;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const outerR = Math.min(cx,cy)-8;
        const innerR = outerR*0.58;
        if(dist > innerR && dist < outerR+16) {
          let angle = Math.atan2(dy,dx) + Math.PI/2;
          if(angle<0) angle += Math.PI*2;
          let cum = 0; let found = -1;
          donutData.forEach((d,i) => {
            const sweep = (d.value/total)*Math.PI*2;
            if(angle >= cum && angle < cum+sweep) found = i;
            cum += sweep;
          });
          if(found !== donutHover) { donutHover = found; drawDonut(1, donutHover); }
        } else {
          if(donutHover !== -1) { donutHover = -1; drawDonut(1, -1); }
        }
      });
      donutCanvas.addEventListener('mouseleave', () => { donutHover=-1; drawDonut(1,-1); });

      // Legend
      const legend = document.getElementById('donutLegend');
      legend.innerHTML = donutData.map(d =>
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">' +
        '<div style="width:10px;height:10px;border-radius:2px;background:'+d.color+';flex-shrink:0;"></div>' +
        '<span style="opacity:0.7;">' + d.label + '</span>' +
        '<span style="margin-left:auto;opacity:0.9;">' + d.value + '%</span></div>'
      ).join('');

      // ---- Funnel Chart ----
      const funnelCanvas = document.getElementById('funnelChart');
      const funnelCtx = funnelCanvas.getContext('2d');
      funnelCanvas.width = funnelCanvas.offsetWidth;
      const funnelStages = [
        { label:'Site Visits', value:2847, color:cobaltLight },
        { label:'Plans Viewed', value:1420, color:'#4a7fc0' },
        { label:'Contact Click', value:284, color:gold },
        { label:'Submitted', value: Math.max(subs.length||14, 14), color:'#7ecb8a' }
      ];

      function drawFunnel(progress) {
        const W = funnelCanvas.width, H = funnelCanvas.height;
        funnelCtx.clearRect(0,0,W,H);
        const pad = {t:10,r:20,b:10,l:20};
        const rowH = (H-pad.t-pad.b) / funnelStages.length - 6;
        const maxW = W - pad.l - pad.r;
        const maxV = funnelStages[0].value;
        funnelStages.forEach((s,i) => {
          const barW = (s.value/maxV) * maxW * progress;
          const x = pad.l + (maxW - barW)/2;
          const y = pad.t + i*(rowH+6);
          funnelCtx.fillStyle = s.color;
          const r = 4;
          funnelCtx.beginPath();
          funnelCtx.roundRect(x,y,barW,rowH,r);
          funnelCtx.fill();
          // Label
          funnelCtx.fillStyle='rgba(255,255,255,0.9)';
          funnelCtx.font='bold 12px Inter,sans-serif';
          funnelCtx.textAlign='left';
          funnelCtx.fillText(s.label, pad.l, y+rowH/2+4);
          funnelCtx.textAlign='right';
          funnelCtx.fillText(s.value.toLocaleString(), W-pad.r, y+rowH/2+4);
        });
      }
      let funnelAnim=null;
      function animateFunnel() {
        if(funnelAnim) cancelAnimationFrame(funnelAnim);
        let start=null;
        function frame(ts){
          if(!start)start=ts;
          const p=Math.min((ts-start)/700,1);
          drawFunnel(p);
          if(p<1)funnelAnim=requestAnimationFrame(frame);
        }
        funnelAnim=requestAnimationFrame(frame);
      }
      animateFunnel();

      // ---- Source Bar Chart ----
      const sourceCanvas = document.getElementById('sourceChart');
      const sourceCtx = sourceCanvas.getContext('2d');
      sourceCanvas.width = sourceCanvas.offsetWidth;
      const sourceData = [
        { label:'Direct', value:38, color:cobaltLight },
        { label:'Google', value:29, color:'#4a7fc0' },
        { label:'Referral', value:18, color:gold },
        { label:'Social', value:10, color:pink },
        { label:'Email', value:5,  color:'rgba(255,255,255,0.3)' }
      ];

      function drawSource(progress) {
        const W = sourceCanvas.width, H = sourceCanvas.height;
        sourceCtx.clearRect(0,0,W,H);
        const pad={t:10,r:20,b:30,l:20};
        const bw = (W-pad.l-pad.r)/sourceData.length - 10;
        const ch = H-pad.t-pad.b;
        const mx = Math.max(...sourceData.map(d=>d.value));
        sourceData.forEach((d,i) => {
          const bh = (d.value/mx)*ch*progress;
          const x = pad.l + i*(bw+10);
          const y = pad.t+ch-bh;
          sourceCtx.fillStyle=d.color;
          sourceCtx.beginPath();
          sourceCtx.roundRect(x,y,bw,bh,4);
          sourceCtx.fill();
          // value label
          sourceCtx.fillStyle='rgba(255,255,255,0.9)';
          sourceCtx.font='bold 11px Inter,sans-serif';
          sourceCtx.textAlign='center';
          sourceCtx.fillText(d.value+'%', x+bw/2, y-4);
          // X label
          sourceCtx.fillStyle='rgba(255,255,255,0.45)';
          sourceCtx.font='10px Inter,sans-serif';
          sourceCtx.fillText(d.label, x+bw/2, H-4);
        });
      }
      let sourceAnim=null;
      function animateSource(){
        if(sourceAnim)cancelAnimationFrame(sourceAnim);
        let start=null;
        function frame(ts){
          if(!start)start=ts;
          const p=Math.min((ts-start)/700,1);
          drawSource(p);
          if(p<1)sourceAnim=requestAnimationFrame(frame);
        }
        sourceAnim=requestAnimationFrame(frame);
      }
      animateSource();
    }

    const container = panel.querySelector('#adminSubs');

    function renderList(list) {
      if (!list || list.length === 0) {
        container.innerHTML = '';
        document.getElementById('adminEmptyState').style.display = 'block';
        return;
      }
      document.getElementById('adminEmptyState').style.display = 'none';
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
