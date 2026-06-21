const PLANS = [
  {
    slug: "greenwich",
    name: "The Greenwich",
    sqft: 866,
    beds: 3,
    baths: 2,
    specText: "866 sq ft &middot; 3 beds &middot; 2 baths",
    description: "Three bedrooms and two full baths under one roof, with a kitchen that opens straight into the family room. This is the layout for people who want a real house in a small footprint, not a glorified studio. The king bedroom sits off on its own for privacy, while the other two bedrooms share the second bath.",
    image: "/images/slider/slide-02.jpg",
    floorplan: "/images/slider/slide-01.jpg",
    images: ['/images/slider/slide-02.jpg', '/images/slider/slide-03.jpg', '/images/slider/slide-04.jpg', '/images/slider/slide-05.jpg', '/images/slider/slide-06.jpg']
  },
  {
    slug: "westport",
    name: "The Westport",
    sqft: 710,
    beds: 2,
    baths: 1,
    specText: "710 sq ft &middot; 2 beds &middot; 1 bath",
    description: "A long, single-story layout that runs kitchen to bath to bedrooms in a clean line. Two bedrooms, one of which fits a king, plus a 600 sq ft living area up front with room to actually spread out. Built for a couple or a small family who wants separation between sleeping and living space without adding square footage they don't need.",
    image: "/images/slider/slide-08.jpg",
    floorplan: "/images/slider/slide-07.jpg",
    images: ['/images/slider/slide-08.jpg', '/images/slider/slide-09.jpg', '/images/slider/slide-10.jpg']
  },
  {
    slug: "darien",
    name: "The Darien",
    sqft: 475,
    beds: 1,
    baths: 1,
    specText: "475 sq ft &middot; 1 bed &middot; 1 bath",
    description: "Our most compact full layout: one bedroom, one bath, and a combined kitchen and living area that's almost as big as the bedroom itself. Good for a guest house, a rental unit, or anyone who wants single-level living without any wasted space.",
    image: "/images/slider/slide-12.jpg",
    floorplan: "/images/slider/slide-11.jpg",
    images: ['/images/slider/slide-12.jpg', '/images/slider/slide-13.jpg', '/images/slider/slide-14.jpg']
  },
  {
    slug: "ocean-breeze",
    name: "The Ocean Breeze",
    sqft: 212,
    beds: 0,
    baths: 1,
    specText: "212 sq ft finished &middot; studio &middot; 1 bath",
    description: "A studio-style layout built for simplicity. One open living space with a bath tucked off to the side. This is the smallest model we offer, and the one most people picture when they hear \"tiny home.\" No frills, no waste, just a clean place to land.",
    image: "/images/slider/slide-16.jpg",
    floorplan: "/images/slider/slide-15.jpg",
    images: ['/images/slider/slide-16.jpg', '/images/slider/slide-17.jpg']
  },
  {
    slug: "rowayton-2",
    name: "The Rowayton 2",
    sqft: 970,
    beds: 1,
    baths: 1,
    specText: "640 sq ft garage &middot; 330 sq ft living above",
    description: "A two-car garage downstairs with a full one-bedroom living space built above it. Kitchen, living room, bedroom, and bath all live upstairs, with a full washer-dryer combo built in. Good fit for anyone who needs covered parking and a separate living unit on the same footprint, like an in-law setup or a long-term guest space.",
    image: "/images/slider/slide-20.jpg",
    floorplan: "/images/slider/slide-18.jpg",
    floorplan2: "/images/slider/slide-19.jpg",
    images: ['/images/slider/slide-20.jpg', '/images/slider/slide-21.jpg', '/images/slider/slide-22.jpg', '/images/slider/slide-23.jpg']
  },
  {
    slug: "rowayton-3",
    name: "The Rowayton 3",
    sqft: 1290,
    beds: 1,
    baths: 1,
    specText: "859 sq ft garage &middot; 431 sq ft living above",
    description: "The bigger sibling to the Rowayton 2. Three-car garage on the ground floor, with a full living room, bedroom, and bath above. More room to actually live in upstairs, while still keeping all that garage space on the ground.",
    image: "/images/slider/slide-26.jpg",
    floorplan: "/images/slider/slide-24.jpg",
    floorplan2: "/images/slider/slide-25.jpg",
    images: ['/images/slider/slide-26.jpg', '/images/slider/slide-27.jpg', '/images/slider/slide-28.jpg', '/images/slider/slide-29.jpg']
  }
];

// Helper to render plans
function renderPlans(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isPlansPage = window.location.pathname.includes('/plans');

  container.innerHTML = PLANS.map((plan, i) => `
    <article class="plan-card" onclick="${isPlansPage ? `window.location.href='/model.html?id=${plan.slug}'` : `openModal(${i})`}" onmouseenter="startHoverCycle(this)" onmouseleave="stopHoverCycle(this)">
      <div class="plan-render">
        ${plan.images.map((img, idx) => `<img src="${img}" alt="${plan.name}" style="z-index: ${idx === 0 ? '2' : '1'}">`).join('')}
      </div>
      <h3>${plan.name}</h3>
      <p class="plan-spec">${plan.specText}</p>
    </article>
  `).join('');
}

// Hover wipe cycle logic
window.startHoverCycle = function(card) {
  const imgs = card.querySelectorAll('.plan-render img');
  if (imgs.length <= 1) return;
  let activeIdx = 0;
  
  // Initialize z-indexes: 2 for active, 1 for next, 0 for rest
  imgs.forEach((img, i) => {
    img.style.zIndex = i === 0 ? '2' : (i === 1 ? '1' : '0');
    img.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    img.style.transition = 'none';
  });

  card._cycleInt = setInterval(() => {
    const currentImg = imgs[activeIdx];
    activeIdx = (activeIdx + 1) % imgs.length;
    const nextImg = imgs[activeIdx];

    // Reset all others to z-index 0
    imgs.forEach(img => img.style.zIndex = '0');

    // Prepare next image underneath
    nextImg.style.zIndex = '1';
    nextImg.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    nextImg.style.transition = 'none';

    // Put current image on top and wipe it out
    currentImg.style.zIndex = '2';
    // Trigger reflow
    void currentImg.offsetWidth;
    currentImg.style.transition = 'clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1)';
    currentImg.style.clipPath = 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
    
  }, 1200); // Wait a bit between wipes
};

window.stopHoverCycle = function(card) {
  if (card._cycleInt) clearInterval(card._cycleInt);
  const imgs = card.querySelectorAll('.plan-render img');
  imgs.forEach((img, i) => {
    img.style.transition = 'none';
    img.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    img.style.zIndex = i === 0 ? '2' : (i === 1 ? '1' : '0');
  });
};
