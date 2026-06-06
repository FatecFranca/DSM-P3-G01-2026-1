// ── ESTADO ──
let liked = new Set();
let activeCat = "todas";
let compatOnly = false;
let visibleCount = 6;
 
// ── ELEMENTOS ──
const grid = document.getElementById("recipesGrid");
const searchInput = document.getElementById("searchInput");
const compatToggle = document.getElementById("compatToggle");
const loadMoreBtn = document.getElementById("loadMoreBtn");
 
// ── RENDERIZAR CARDS ──
function renderRecipes() {
  const search = searchInput.value.toLowerCase().trim();
 
  const filtered = recipes.filter(r => {
    const matchCat = r.cats.includes(activeCat);
    const matchSearch =
      r.title.toLowerCase().includes(search) ||
      r.author.toLowerCase().includes(search) ||
      r.tags.some(t => t.toLowerCase().includes(search));
    const matchCompat = !compatOnly || r.safe;
    return matchCat && matchSearch && matchCompat;
  });
 
  const visible = filtered.slice(0, visibleCount);
 
  // Mostrar/esconder botão "Ver mais"
  loadMoreBtn.style.display = filtered.length > visibleCount ? "flex" : "none";
 
  // Mensagem vazia
  if (visible.length === 0) {
    grid.innerHTML = `
      <p style="color:var(--text-light);font-size:14px;grid-column:1/-1;text-align:center;padding:40px 0">
        😕 Nenhuma receita encontrada.
      </p>`;
    return;
  }
 
  grid.innerHTML = visible.map((r, i) => {
    const isLiked = liked.has(r.id);
    return `
      <div class="recipe-card" data-id="${r.id}" style="animation-delay:${i * 0.05}s">
        <div class="card-image">
          <img class="recipe-image" src="${r.img}" alt="${r.title}" loading="lazy">
          <div class="safety-badge ${r.safe ? "badge-safe" : "badge-warning"}">
            ${r.safe ? "✓ Seguro para Você" : "⚠ " + r.warning}
          </div>
          <div class="fav-btn ${isLiked ? "liked" : ""}" data-id="${r.id}">
            ${isLiked ? "❤️" : "🤍"}
          </div>
        </div>
        <div class="card-body">
          <div class="card-title">${r.title}</div>
          <div class="card-meta">
            <span>⏱ ${r.time} min</span>
            <span>👨‍🍳 ${r.author}</span>
          </div>
          <div class="tags">
            ${r.tags.map(t => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div class="card-footer">
            <span class="likes" data-id="${r.id}">
              ${isLiked ? "❤️" : "🤍"} ${r.likes + (isLiked ? 1 : 0)} curtidas
            </span>
            <a class="details-link" data-id="${r.id}">Ver detalhes ›</a>
          </div>
        </div>
      </div>`;
  }).join("");
 
  // Eventos dos botões de favorito
  grid.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      toggleLike(+btn.dataset.id);
    });
  });
 
  // Evento de clique no card
  grid.querySelectorAll(".recipe-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = +card.dataset.id;
      const recipe = recipes.find(r => r.id === id);
      if (recipe) showToast(`📖 Abrindo: ${recipe.title}`);
    });
  });
 
  // Evento "Ver detalhes"
  grid.querySelectorAll(".details-link").forEach(link => {
    link.addEventListener("click", e => {
      e.stopPropagation();
      const id = +link.dataset.id;
      const recipe = recipes.find(r => r.id === id);
      if (recipe) showToast(`📖 Abrindo: ${recipe.title}`);
    });
  });
}
 
// ── FAVORITAR ──
function toggleLike(id) {
  if (liked.has(id)) {
    liked.delete(id);
  } else {
    liked.add(id);
  }
  renderRecipes();
}
 
// ── TABS ──
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeCat = tab.dataset.cat;
    visibleCount = 6;
    renderRecipes();
  });
});
 
// ── TOGGLE COMPATÍVEIS ──
compatToggle.addEventListener('click', () => {
  compatToggle.classList.toggle('off');
  
  // Ativo = SEM a classe 'off'
  const isActive = !compatToggle.classList.contains('off');
  
  // Muda cor visualmente
  if (isActive) {
    compatToggle.style.background = 'var(--primary)';
  } else {
    compatToggle.style.background = 'var(--border)';
  }
  
  filterRecipes();
});
 
// ── BUSCA ──
searchInput.addEventListener("input", () => {
  visibleCount = 6;
  renderRecipes();
});
 
// ── VER MAIS ──
loadMoreBtn.addEventListener("click", () => {
  visibleCount += 3;
  renderRecipes();
});
 
// ── FAQ ──
document.querySelectorAll(".faq-item").forEach(item => {
  item.querySelector(".faq-q").addEventListener("click", () => {
    item.classList.toggle("open");
  });
});
 
// ── EDITAR RESTRIÇÕES ──
document.querySelector(".edit-btn").addEventListener("click", () => {
  showToast("⚙️ Abrindo configurações de restrições...");
});
 
// ── NOTIFICAÇÕES ──
document.querySelector(".notif-btn").addEventListener("click", () => {
  showToast("🔔 Você não tem novas notificações.");
});
 
// ── PERFIL ──
document.querySelector(".user-chip").addEventListener("click", () => {
  showToast("👤 Abrindo perfil de Ana Silva...");
});
 
// ── FILTRAR INGREDIENTES ──
document.querySelector(".filter-search").addEventListener("click", () => {
  showToast("🔍 Filtro de ingredientes em breve!");
});
 
// ── TOAST NOTIFICATION ──
function showToast(msg) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
 
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--text);
    color: #fff;
    padding: 10px 20px;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transition: opacity .3s, transform .3s;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(0,0,0,.2);
  `;
 
  document.body.appendChild(toast);
 
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
 
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
 
// ── INICIALIZAR ──
renderRecipes();
 