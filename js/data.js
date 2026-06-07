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
    images: ['/images/slider/slide-26.jpg', '/images/slider/slide-27.jpg', '/images/slider/slide-28.jpg', '/images/slider/slide-29.jpg']
  }
];

// Helper to render plans
function renderPlans(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = PLANS.map(plan => `
    <article class="plan-card" onclick="window.location.href='/plans.html#${plan.slug}'" onmouseenter="startHoverCycle(this)" onmouseleave="stopHoverCycle(this)">
      <div class="plan-render">
        ${plan.images.map((img, idx) => `<img src="${img}" alt="${plan.name}" class="${idx === 0 ? 'active' : ''}">`).join('')}
      </div>
      <h3>${plan.name}</h3>
      <p class="plan-spec">${plan.specText}</p>
    </article>
  `).join('');
}

// Hover cycle logic
window.startHoverCycle = function(card) {
  const imgs = card.querySelectorAll('.plan-render img');
  if (imgs.length <= 1) return;
  let activeIdx = 0;
  card._cycleInt = setInterval(() => {
    imgs[activeIdx].classList.remove('active');
    activeIdx = (activeIdx + 1) % imgs.length;
    imgs[activeIdx].classList.add('active');
  }, 1000); // 1 second per image
};

window.stopHoverCycle = function(card) {
  if (card._cycleInt) clearInterval(card._cycleInt);
  const imgs = card.querySelectorAll('.plan-render img');
  imgs.forEach(i => i.classList.remove('active'));
  if (imgs[0]) imgs[0].classList.add('active');
};
