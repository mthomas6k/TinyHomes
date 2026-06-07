const PLANS = [
  {
    slug: "greenwich",
    name: "The Greenwich",
    sqft: 360,
    beds: 1,
    baths: 1,
    specText: "360 sqft &middot; 1 bed &middot; full bath",
    image: "/images/slider/slide-02.jpg",
    floorplan: "/images/slider/slide-01.jpg",
    images: ['/images/slider/slide-02.jpg', '/images/slider/slide-03.jpg', '/images/slider/slide-04.jpg', '/images/slider/slide-05.jpg', '/images/slider/slide-06.jpg']
  },
  {
    slug: "westport",
    name: "The Westport",
    sqft: 420,
    beds: 1,
    baths: 1,
    specText: "420 sqft &middot; 1 bed &middot; full bath &middot; loft",
    image: "/images/slider/slide-08.jpg",
    floorplan: "/images/slider/slide-07.jpg",
    images: ['/images/slider/slide-08.jpg', '/images/slider/slide-09.jpg', '/images/slider/slide-10.jpg']
  },
  {
    slug: "darien",
    name: "The Darien",
    sqft: 240,
    beds: 0,
    baths: 0.5,
    specText: "240 sqft &middot; studio &middot; half bath",
    image: "/images/slider/slide-12.jpg",
    floorplan: "/images/slider/slide-11.jpg",
    images: ['/images/slider/slide-12.jpg', '/images/slider/slide-13.jpg', '/images/slider/slide-14.jpg']
  },
  {
    slug: "ocean-breeze",
    name: "The Ocean Breeze",
    sqft: 500,
    beds: 1,
    baths: 1,
    specText: "1 bed &middot; full bath",
    image: "/images/slider/slide-16.jpg",
    floorplan: "/images/slider/slide-15.jpg",
    images: ['/images/slider/slide-16.jpg', '/images/slider/slide-17.jpg']
  },
  {
    slug: "rowayton-2",
    name: "The Rowayton 2",
    sqft: 480,
    beds: 1,
    baths: 1,
    specText: "480 sqft &middot; 1 bed &middot; full bath",
    image: "/images/slider/slide-20.jpg",
    floorplan: "/images/slider/slide-18.jpg",
    floorplan2: "/images/slider/slide-19.jpg",
    images: ['/images/slider/slide-20.jpg', '/images/slider/slide-21.jpg', '/images/slider/slide-22.jpg', '/images/slider/slide-23.jpg']
  },
  {
    slug: "rowayton-3",
    name: "The Rowayton 3",
    sqft: 550,
    beds: 1,
    baths: 1,
    specText: "550 sqft &middot; 1 bed &middot; full bath",
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
  
  // Initialize z-indexes so first image is on top
  imgs.forEach((img, i) => {
    img.style.zIndex = i === 0 ? '2' : '1';
    img.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    img.style.transition = 'none';
  });

  card._cycleInt = setInterval(() => {
    const currentImg = imgs[activeIdx];
    activeIdx = (activeIdx + 1) % imgs.length;
    const nextImg = imgs[activeIdx];

    // Prepare next image underneath
    nextImg.style.zIndex = '1';
    nextImg.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    nextImg.style.transition = 'none';

    // Put current image on top and wipe it out
    currentImg.style.zIndex = '2';
    // Trigger reflow
    void currentImg.offsetWidth;
    currentImg.style.transition = 'clip-path 1.4s cubic-bezier(0.77, 0, 0.175, 1)';
    currentImg.style.clipPath = 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)';
    
  }, 1600); // Wait a bit between wipes
};

window.stopHoverCycle = function(card) {
  if (card._cycleInt) clearInterval(card._cycleInt);
  const imgs = card.querySelectorAll('.plan-render img');
  imgs.forEach((img, i) => {
    img.style.transition = 'none';
    img.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
    img.style.zIndex = i === 0 ? '2' : '1';
  });
};
