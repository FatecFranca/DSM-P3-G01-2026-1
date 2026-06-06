// ── MOCK DATA ──
const recipes = [
  {
    id: 1,
    title: "Bowl de Quinoa e Vegetais",
    author: "Chef Marina",
    time: 25,
    likes: 124,
    safe: true,
    warning: null,
    tags: ["Vegano", "Sem Glúten", "Nutritivo"],
    cats: ["todas","almoco","vegano","glutenfree"],
    emoji: "🥗",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
  },
  {
    id: 2,
    title: "Massa Penne ao Pesto",
    author: "Lucas Rossi",
    time: 15,
    likes: 89,
    safe: false,
    warning: "Contém Nozes",
    tags: ["Italiano", "Vegetariano", "Rápido"],
    cats: ["todas","almoco"],
    emoji: "🍝",
    img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&q=80"
  },
  {
    id: 3,
    title: "Salmão Grelhado com Aspargos",
    author: "Dr. Roberto",
    time: 30,
    likes: 256,
    safe: true,
    warning: null,
    tags: ["Low Carb", "Proteico", "Sem Lactose"],
    cats: ["todas","almoco","glutenfree"],
    emoji: "🐟",
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80"
  },
  {
    id: 4,
    title: "Panquecas de Banana e Aveia",
    author: "Fit Kitchen",
    time: 10,
    likes: 412,
    safe: true,
    warning: null,
    tags: ["Café da Manhã", "Sem Glúten", "Doce"],
    cats: ["todas","cafe","glutenfree"],
    emoji: "🥞",
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"
  },
  {
    id: 5,
    title: "Sopa de Lentilha e Especiarias",
    author: "Cozinha Árabe",
    time: 40,
    likes: 178,
    safe: true,
    warning: null,
    tags: ["Vegano", "Inverno", "Proteína Vegetal"],
    cats: ["todas","almoco","vegano","glutenfree"],
    emoji: "🍲",
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80"
  },
  {
    id: 6,
    title: "Taco de Camarão com Abacate",
    author: "Mexico Vivo",
    time: 20,
    likes: 95,
    safe: false,
    warning: "Contém Frutos do Mar",
    tags: ["Picante", "Mexicano", "Frutos do Mar"],
    cats: ["todas","almoco"],
    emoji: "🌮",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"
  }
];

const recommended = [
  { name: "Smoothie de Frutas",      sub: "5 min · Por BioFit",     emoji: "" },
  { name: "Omelete de Cogumelos",    sub: "12 min · Por Chef Ana",  emoji: "" },
  { name: "Salada Caesar Adaptada",  sub: "15 min · Por Light Bites", emoji: "" }
];

// ── RENDER RECOMMENDED ──
const recBox = document.getElementById('recommended');
recommended.forEach(r => {
  recBox.innerHTML += `
    <div class="rec-item">
      <div class="rec-thumb">${r.emoji}</div>
      <div class="rec-info">
        <div class="rec-name">${r.name}</div>
        <div class="rec-sub">${r.sub}</div>
        <span class="compat-tag">Compatível</span>
      </div>
    </div>`;
});

// ── RENDER RECIPES ──
let liked = new Set();
let activeCat = 'todas';
let compatOnly = false;
let visibleCount = 6;

function renderRecipes() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const grid = document.getElementById('recipesGrid');
  grid.innerHTML = '';

  const filtered = recipes.filter(r => {
    const matchCat = r.cats.includes(activeCat);
    const matchSearch = r.title.toLowerCase().includes(search) || r.author.toLowerCase().includes(search);
    const matchCompat = !compatOnly || r.safe;
    return matchCat && matchSearch && matchCompat;
  }).slice(0, visibleCount);

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:14px;grid-column:1/-1">Nenhuma receita encontrada.</p>';
    return;
  }

  filtered.forEach((r, i) => {
    const isLiked = liked.has(r.id);
    grid.innerHTML += `
      <div class="recipe-card" style="animation-delay:${i * 0.05}s">
        <div class="card-image">
          <img src="${r.img}" alt="${r.title}" loading="lazy">
          <div class="safety-badge ${r.safe ? 'badge-safe' : 'badge-warning'}">
            ${r.safe ? '✓ Seguro para Você' : '⚠ ' + r.warning}
          </div>
          <div class="fav-btn ${isLiked ? 'liked' : ''}" data-id="${r.id}">
            ${isLiked ? '❤️' : '🤍'}
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${r.title}</div>
          <div class="card-meta">
            <span>⏱ ${r.time} min</span>
            <span>👨‍🍳 ${r.author}</span>
          </div>
          <div class="tags">${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <div class="card-footer">
            <span class="likes">❤️ ${r.likes} curtidas</span>
            <a class="details-link">Ver detalhes ›</a>
          </div>
        </div>
      </div>`;
  });

  // Fav buttons
  grid.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = +btn.dataset.id;
      if (liked.has(id)) { liked.delete(id); } else { liked.add(id); }
      renderRecipes();
    });
  });
}

// ── TABS ──
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCat = tab.dataset.cat;
    renderRecipes();
  });
});

// ── TOGGLE ──
const toggle = document.getElementById('compatToggle');
toggle.addEventListener('click', () => {
  compatOnly = !compatOnly;
  toggle.classList.toggle('off', !compatOnly);
  renderRecipes();
});
toggle.classList.add('off'); // starts off

// ── SEARCH ──
document.getElementById('searchInput').addEventListener('input', renderRecipes);

// ── LOAD MORE ──
document.getElementById('loadMoreBtn').addEventListener('click', () => {
  visibleCount += 3;
  renderRecipes();
});

// ── FAQ ──
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

// ── INIT ──
renderRecipes();
