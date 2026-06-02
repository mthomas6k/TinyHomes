const PLANS = [
  {
    slug: "darien",
    name: "The Darien",
    sqft: 240,
    beds: 0,
    baths: 0.5,
    specText: "240 sqft &middot; studio &middot; half bath",
    image: "IMAGE: Exterior render — small white shingle cottage with porch, hydrangeas. ~600×450"
  },
  {
    slug: "greenwich",
    name: "The Greenwich",
    sqft: 360,
    beds: 1,
    baths: 1,
    specText: "360 sqft &middot; 1 bed &middot; full bath",
    image: "IMAGE: Exterior render — cedar shingle with gabled roof, larger footprint. ~600×450"
  },
  {
    slug: "westport",
    name: "The Westport",
    sqft: 420,
    beds: 1,
    baths: 1,
    specText: "420 sqft &middot; 1 bed &middot; full bath &middot; loft",
    image: "IMAGE: Exterior render — modern dark cladding with flat roof, sleek. ~600×450"
  },
  {
    slug: "rowayton",
    name: "The Rowayton",
    sqft: 480,
    beds: 1,
    baths: 1,
    specText: "480 sqft &middot; 1 bed &middot; full bath &middot; kitchen",
    image: "IMAGE: Exterior render — coastal white with navy trim, large windows. ~600×450"
  },
  {
    slug: "mianus",
    name: "The Mianus",
    sqft: 320,
    beds: 0,
    baths: 1,
    specText: "320 sqft &middot; studio &middot; full bath",
    image: "IMAGE: Exterior render — barn-shape, board-and-batten siding, cognac door. ~600×450"
  },
  {
    slug: "compo",
    name: "The Compo",
    sqft: 280,
    beds: 0,
    baths: 0.5,
    specText: "280 sqft &middot; studio &middot; half bath",
    image: "IMAGE: Exterior render — gable with covered porch, weathered cedar shake. ~600×450"
  }
];

// Helper to render plans
function renderPlans(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = PLANS.map(plan => `
    <article class="plan-card" onclick="window.location.href='/plans.html#${plan.slug}'">
      <div class="plan-render"><div class="placeholder placeholder-plan">${plan.image}</div></div>
      <h3>${plan.name}</h3>
      <p class="plan-spec">${plan.specText}</p>
    </article>
  `).join('');
}
