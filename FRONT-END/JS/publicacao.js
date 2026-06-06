// ── MOCK DATA ──
const publications = [
  {
    id: 1, title: "Bolo de Amêndoas e Laranja (Vegano)",
    status: "publicada", date: "há 2 dias",
    time: 45, portions: 8,
    tags: ["Vegano", "Sem Glúten", "Sem Lactose"],
    likes: 412, views: 2100, saves: 87,
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80"
  },
  {
    id: 2, title: "Panquecas de Aveia e Banana",
    status: "publicada", date: "há 5 dias",
    time: 10, portions: 4,
    tags: ["Sem Glúten", "Café da Manhã"],
    likes: 398, views: 1800, saves: 74,
    img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80"
  },
  {
    id: 3, title: "Smoothie Verde Detox",
    status: "publicada", date: "há 2 horas",
    time: 5, portions: 1,
    tags: ["Vegano", "Sem Glúten"],
    likes: 54, views: 210, saves: 12,
    img: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80"
  },
  {
    id: 4, title: "Risoto de Cogumelos Trufado",
    status: "revisao", date: "há 1 dia",
    time: 40, portions: 3,
    tags: ["Vegetariano", "Sem Glúten"],
    likes: 0, views: 0, saves: 0,
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80"
  },
  {
    id: 5, title: "Tapioca com Frango Desfiado",
    status: "publicada", date: "há 1 semana",
    time: 15, portions: 2,
    tags: ["Sem Glúten", "Low Carb"],
    likes: 287, views: 1340, saves: 55,
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80"
  },
  {
    id: 6, title: "Sopa de Lentilha com Especiarias",
    status: "rascunho", date: "há 3 dias",
    time: 40, portions: 4,
    tags: ["Vegano", "Sem Glúten"],
    likes: 0, views: 0, saves: 0,
    img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80"
  },
  {
    id: 7, title: "Frango Grelhado com Ervas",
    status: "publicada", date: "há 2 semanas",
    time: 30, portions: 2,
    tags: ["Sem Lactose", "Low Carb"],
    likes: 320, views: 1560, saves: 63,
    img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80"
  },
  {
    id: 8, title: "Bowl de Quinoa e Vegetais",
    status: "publicada", date: "há 3 semanas",
    time: 20, portions: 2,
    tags: ["Vegano", "Sem Glúten"],
    likes: 510, views: 2800, saves: 112,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
  },
  {
    id: 9, title: "Wrap Integral de Grão-de-Bico",
    status: "rascunho", date: "há 4 dias",
    time: 20, portions: 2,
    tags: ["Vegano"],
    likes: 0, views: 0, saves: 0,
    img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80"
  },
];

const statusLabels = {
  publicada: { label: "✓ Publicada", cls: "status-published" },
  rascunho:  { label: "✎ Rascunho",  cls: "status-draft" },
  revisao:   { label: "⏳ Em Revisão", cls: "status-review" },
  rejeitada: { label: "✕ Rejeitada", cls: "status-rejected" },
};

let activeFilter = "todas";
let cardToDelete = null;

// ── RENDER ──
function renderGrid(data) {
  const grid = document.getElementById('pubGrid');

  if (!data.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="emoji">📭</div>
        <h3>Nenhuma publicação encontrada</h3>
        <p>Tente outro filtro ou crie sua primeira receita.</p>
        <a href="publicar-receita.html" class="btn-new" style="text-decoration:none">+ Nova Receita</a>
      </div>`;
    return;
  }

  grid.innerHTML = data.map((p, i) => {
    const st = statusLabels[p.status] || statusLabels.rascunho;
    const tags = p.tags.map(t => `<span class="pub-tag">${t}</span>`).join('');
    return `
      <div class="pub-card" data-status="${p.status}" style="animation-delay:${i*0.05}s">
        <div class="pub-card-img">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
          <span class="status-badge ${st.cls}">${st.label}</span>
          <div class="card-actions-overlay">
            <button class="overlay-btn" title="Editar" onclick="editCard(${p.id})">✏️</button>
            <button class="overlay-btn" title="Excluir" onclick="askDelete(${p.id})">🗑</button>
          </div>
        </div>
        <div class="pub-card-body">
          <div class="pub-card-title">${p.title}</div>
          <div class="pub-card-meta">
            <span>⏱ ${p.time} min</span>
            <span>🍽 ${p.portions} porções</span>
            <span>📅 ${p.date}</span>
          </div>
          <div class="pub-card-tags">${tags}</div>
          ${p.status === 'publicada' ? `
          <div class="pub-stats">
            <span class="pub-stat">❤️ ${p.likes}</span>
            <span class="pub-stat">👁 ${p.views.toLocaleString()}</span>
            <span class="pub-stat">🔖 ${p.saves}</span>
          </div>` : `
          <div class="pub-stats" style="color:var(--muted);font-size:11px;font-style:italic">
            ${p.status === 'rascunho' ? '📝 Não publicada ainda' : '⏳ Aguardando aprovação da equipe SafeBite'}
          </div>`}
        </div>
        <div class="pub-card-footer">
          <button class="card-btn card-btn-edit" onclick="editCard(${p.id})">✏️ Editar</button>
          <button class="card-btn card-btn-view" onclick="viewCard(${p.id})">👁 Ver</button>
          <button class="card-btn card-btn-danger" onclick="askDelete(${p.id})">🗑</button>
        </div>
      </div>`;
  }).join('');
}

// ── FILTROS ──
function filterCards(tab) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  activeFilter = tab.dataset.filter;
  applyFilter();
}

function applyFilter() {
  const search = document.getElementById('topSearch').value.toLowerCase();
  let data = publications.filter(p => {
    const matchFilter = activeFilter === 'todas' || p.status === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(search) ||
      p.tags.some(t => t.toLowerCase().includes(search));
    return matchFilter && matchSearch;
  });
  renderGrid(data);
}

// ── ORDENAÇÃO ──
function sortCards(val) {
  let data = [...publications];
  if (activeFilter !== 'todas') data = data.filter(p => p.status === activeFilter);
  if (val === 'curtidas') data.sort((a,b) => b.likes - a.likes);
  else if (val === 'views') data.sort((a,b) => b.views - a.views);
  renderGrid(data);
}

// ── BUSCA ──
document.getElementById('topSearch').addEventListener('input', applyFilter);

// ── AÇÕES ──
function editCard(id) {
  showToast('✏️ Abrindo editor...');
  setTimeout(() => window.location.href = 'editar-receita.html', 800);
}

function viewCard(id) {
  showToast('👁 Abrindo receita...');
  setTimeout(() => window.location.href = 'card.html', 800);
}

function askDelete(id) {
  cardToDelete = id;
  document.getElementById('deleteModal').classList.add('open');
}

function closeModal() {
  document.getElementById('deleteModal').classList.remove('open');
  cardToDelete = null;
}

function confirmDelete() {
  closeModal();
  showToast('🗑 Receita excluída.');
}

// ── TOAST ──
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ── FECHAR MODAL CLICANDO FORA ──
document.getElementById('deleteModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── INIT ──
renderGrid(publications);
