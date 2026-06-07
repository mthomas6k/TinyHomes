const PLANS = [
  {
    slug: "greenwich",
    name: "The Greenwich",
    sqft: 360,
    beds: 1,
    baths: 1,
    specText: "360 sqft &middot; 1 bed &middot; full bath",
    image: "/images/slider/slide-02.jpg",
    floorplan: "/images/slider/slide-01.jpg"
  },
  {
    slug: "westport",
    name: "The Westport",
    sqft: 420,
    beds: 1,
    baths: 1,
    specText: "420 sqft &middot; 1 bed &middot; full bath &middot; loft",
    image: "/images/slider/slide-07.jpg",
    floorplan: "/images/slider/slide-06.jpg"
  },
  {
    slug: "darien",
    name: "The Darien",
    sqft: 240,
    beds: 0,
    baths: 0.5,
    specText: "240 sqft &middot; studio &middot; half bath",
    image: "/images/slider/slide-11.jpg",
    floorplan: "/images/slider/slide-10.jpg"
  },
  {
    slug: "ocean-breeze",
    name: "The Ocean Breeze",
    sqft: 500,
    beds: 1,
    baths: 1,
    specText: "1 bed &middot; full bath",
    image: "/images/slider/slide-16.jpg",
    floorplan: "/images/slider/slide-15.jpg"
  },
  {
    slug: "rowayton-2",
    name: "The Rowayton 2",
    sqft: 480,
    beds: 1,
    baths: 1,
    specText: "480 sqft &middot; 1 bed &middot; full bath",
    image: "/images/slider/slide-20.jpg",
    floorplan: "/images/slider/slide-18.jpg"
  },
  {
    slug: "rowayton-3",
    name: "The Rowayton 3",
    sqft: 550,
    beds: 1,
    baths: 1,
    specText: "550 sqft &middot; 1 bed &middot; full bath",
    image: "/images/slider/slide-26.jpg",
    floorplan: "/images/slider/slide-24.jpg"
  }
];

// Helper to render plans
function renderPlans(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = PLANS.map(plan => `
    <article class="plan-card" onclick="window.location.href='/plans.html#${plan.slug}'">
      <div class="plan-render"><img src="${plan.image}" alt="${plan.name}" style="width:100%; height:100%; object-fit:cover; display:block;"></div>
      <h3>${plan.name}</h3>
      <p class="plan-spec">${plan.specText}</p>
    </article>
  `).join('');
}
