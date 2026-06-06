// ── MOCK DATA ──
    const recipes = [
    { id:1, title:"Panquecas de Aveia e Banana", author:"Chef Carla", cat:"cafe", catLabel:"Café da Manhã", catClass:"meal-cafe", time:10, diff:"Fácil", portions:2, status:"safe", img:"https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" },
    { id:2, title:"Lasanha Bolonhesa Clássica", author:"Ricardo Rosa", cat:"almoco", catLabel:"Almoço", catClass:"meal-almoco", time:60, diff:"Médio", portions:6, status:"danger", conflicts:["Glúten","Lactose","Frutos do Mar"], img:"https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&q=80" },
    { id:3, title:"Salmão Grelhado com Ervas", author:"Helena Santos", cat:"jantar", catLabel:"Jantar", catClass:"meal-jantar", time:25, diff:"Fácil", portions:2, status:"safe", img:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
    { id:4, title:"Bowl de Quinoa e Vegetais", author:"Nutr. Julia", cat:"almoco", catLabel:"Almoço", catClass:"meal-almoco", time:20, diff:"Fácil", portions:2, status:"safe", img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
    { id:5, title:"Bolo de Chocolate Low Carb", author:"Doces Saudáveis", cat:"sobre", catLabel:"Sobremesa", catClass:"meal-sobre", time:45, diff:"Médio", portions:8, status:"attention", attentionMsg:"Atenção: Lactose", conflicts:["Lactose"], img:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
    { id:6, title:"Risoto de Cogumelos", author:"Chef Pedro", cat:"jantar", catLabel:"Jantar", catClass:"meal-jantar", time:40, diff:"Médio", portions:2, status:"safe", img:"https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80" },
    { id:7, title:"Tapioca com Frango Desfiado", author:"Cozinha Nordestina", cat:"lanche", catLabel:"Lanche", catClass:"meal-veg", time:15, diff:"Fácil", portions:1, status:"safe", img:"https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
    { id:8, title:"Smoothie Verde Detox", author:"Vida Saudável", cat:"cafe", catLabel:"Café da Manhã", catClass:"meal-cafe", time:5, diff:"Fácil", portions:1, status:"safe", img:"https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80" },
    { id:9, title:"Frango ao Curry com Arroz", author:"Chef Arabe", cat:"almoco", catLabel:"Almoço", catClass:"meal-almoco", time:35, diff:"Médio", portions:4, status:"safe", img:"https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80" },
    { id:10, title:"Wrap de Grão-de-Bico", author:"Green Kitchen", cat:"lanche", catLabel:"Lanche", catClass:"meal-veg", time:20, diff:"Fácil", portions:2, status:"safe", img:"https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80" },
    { id:11, title:"Sopa de Lentilha", author:"Cozinha Árabe", cat:"jantar", catLabel:"Jantar", catClass:"meal-jantar", time:40, diff:"Fácil", portions:4, status:"safe", img:"https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
    { id:12, title:"Açaí Bowl com Granola", author:"Vida Natural", cat:"cafe", catLabel:"Café da Manhã", catClass:"meal-cafe", time:5, diff:"Fácil", portions:1, status:"safe", img:"https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80" },
    ];

    // ── ESTADO ──
    let currentPage = 1;
    const perPage = 6;
    let filtered = [...recipes];

    // ── RENDER GRID ──
    function renderGrid() {
    const grid = document.getElementById('resultsGrid');
    const start = (currentPage - 1) * perPage;
    const page = filtered.slice(start, start + perPage);

    document.getElementById('countNum').textContent = filtered.length;

    if (page.length === 0) {
        grid.innerHTML = `<p style="color:var(--muted);font-size:14px;grid-column:1/-1;padding:40px 0;text-align:center">😕 Nenhuma receita encontrada.</p>`;
        return;
    }

    grid.innerHTML = page.map((r, i) => {
        const statusHtml = r.status === 'safe'
        ? `<div class="status-safe">✓ Seguro para você</div>`
        : r.status === 'danger'
        ? `<div class="status-warning">⚠ COMPONENTES DE RISCO<div class="conflict-tags">${r.conflicts.join(', ')}</div></div>`
        : `<div class="status-attention">⚠ ${r.attentionMsg}</div>`;

        const conflictLine = r.conflicts
        ? `<div class="conflict-line">${r.conflicts.map(c => `<span>${c}</span>`).join('')}</div>`
        : '';

        return `
        <div class="result-card" style="animation-delay:${i*0.05}s" data-id="${r.id}">
            <div class="card-img">
            <img src="${r.img}" alt="${r.title}" loading="lazy">
            <span class="meal-badge ${r.catClass}">${r.catLabel}</span>
            </div>
            <div class="card-body">
            <div class="card-author">Por: ${r.author}</div>
            <div class="card-title-res">${r.title}</div>
            ${statusHtml}
            <div class="card-meta-res">
                <span>⏱ ${r.time} min</span>
                <span>🍽 ${r.portions} porções</span>
            </div>
            ${conflictLine}
            <div class="card-footer-res">
                <button class="ver-receita">Ver Receita ›</button>
            </div>
            </div>
        </div>`;
    }).join('');

    renderPagination();
    }

    // ── PAGINAÇÃO ──
    function renderPagination() {
    const total = Math.ceil(filtered.length / perPage);
    const pag = document.getElementById('pagination');
    if (total <= 1) { pag.innerHTML = ''; return; }

    let html = `<button class="page-btn nav" ${currentPage===1?'disabled':''} onclick="goPage(${currentPage-1})">← Anterior</button>`;

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || Math.abs(i - currentPage) <= 1) {
        html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
        } else if (Math.abs(i - currentPage) === 2) {
        html += `<span style="color:var(--muted);padding:0 2px">…</span>`;
        }
    }

    html += `<button class="page-btn nav" ${currentPage===total?'disabled':''} onclick="goPage(${currentPage+1})">Próxima →</button>`;
    pag.innerHTML = html;
    }

    function goPage(n) {
    currentPage = n;
    renderGrid();
    document.querySelector('.results-area').scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── BUSCA ──
    function doSearch() {
    const term = document.getElementById('heroSearch').value.toLowerCase().trim();
    filtered = recipes.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.author.toLowerCase().includes(term) ||
        r.catLabel.toLowerCase().includes(term)
    );
    currentPage = 1;
    renderGrid();
    }

    document.getElementById('heroSearch').addEventListener('input', doSearch);
    document.getElementById('topSearch').addEventListener('input', e => {
    document.getElementById('heroSearch').value = e.target.value;
    doSearch();
    });

    // ── FILTROS ──
    document.querySelectorAll('.filter-option input').forEach(cb => {
    cb.addEventListener('change', applyFilters);
    });

    function applyFilters() {
    const cats = [...document.querySelectorAll('[data-cat]:checked')].map(c => c.dataset.cat);
    const onlySafe = document.getElementById('f100').checked;
    const term = document.getElementById('heroSearch').value.toLowerCase().trim();

    filtered = recipes.filter(r => {
        const matchCat = cats.length === 0 || cats.includes(r.cat);
        const matchSafe = !onlySafe || r.status === 'safe';
        const matchSearch = r.title.toLowerCase().includes(term) || r.author.toLowerCase().includes(term);
        return matchCat && matchSafe && matchSearch;
    });

    currentPage = 1;
    renderGrid();
    }

    // ── FILTROS ATIVOS (chips) ──
    document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        chip.remove();
        applyFilters();
    });
    });

    document.getElementById('clearAll').addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.remove());
    document.querySelectorAll('.filter-option input').forEach(cb => cb.checked = false);
    filtered = [...recipes];
    currentPage = 1;
    renderGrid();
    });

    // ── ORDENAÇÃO ──
    document.getElementById('sortSelect').addEventListener('change', function() {
    if (this.value === 'time') filtered.sort((a,b) => a.time - b.time);
    else if (this.value === 'recent') filtered.sort((a,b) => b.id - a.id);
    else filtered = [...recipes];
    currentPage = 1;
    renderGrid();
    });

    // ── INIT ──
    renderGrid();