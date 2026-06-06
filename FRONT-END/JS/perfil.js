// ── PROFILES DATA ──
let profiles = [
  {
    id: 1, name: "Ana Silva", emoji: "👩",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    tags: ["Sem Glúten", "Sem Lactose"],
    active: true
  },
  {
    id: 2, name: "João Carlos", emoji: "👨",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    tags: ["Sem Amendoim", "Vegano"],
    active: false
  },
  {
    id: 3, name: "Beatriz (Filha)", emoji: "👧",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    tags: ["Sem Ovos", "Sem Soja"],
    active: false
  }
];

// ── RENDER ──
function renderProfiles() {
  const grid = document.getElementById('profilesGrid');
  let html = profiles.map((p, i) => `
    <div class="profile-card ${p.active ? 'active-profile' : ''}"
         style="animation-delay:${i * 0.07}s"
         onclick="switchProfile(${p.id})">
      ${p.active ? '<span class="active-badge">Conta Ativa</span>' : ''}
      <div class="profile-avatar-wrap">
        <div class="profile-avatar">
          <img src="${p.img}" alt="${p.name}"
            onerror="this.style.display='none';this.parentElement.textContent='${p.emoji}'">
        </div>
        ${p.active ? '<div class="online-dot"></div>' : ''}
      </div>
      <div class="profile-name">${p.name}</div>
      <div class="profile-tags">
        ${p.tags.map(t => `<span class="profile-tag">${t}</span>`).join('')}
      </div>
      <div class="profile-action">
        <span>${p.active ? 'Gerenciar Perfil' : 'Alternar para esta conta'}</span>
        <span>›</span>
      </div>
    </div>
  `).join('');

  html += `
    <div class="add-profile-card" onclick="openModal()"
         style="animation-delay:${profiles.length * 0.07}s">
      <div class="add-icon">+</div>
      <div class="add-profile-label">Adicionar Perfil</div>
      <div class="add-profile-sub">Configure restrições para outro membro da família</div>
    </div>
  `;

  grid.innerHTML = html;
}

// ── SWITCH ──
function switchProfile(id) {
  profiles.forEach(p => p.active = p.id === id);
  renderProfiles();
  const profile = profiles.find(p => p.id === id);
  showToast(`✅ Perfil alterado para ${profile.name}`);

  // Atualiza topbar
  document.querySelector('.user-name').textContent = profile.name;
  document.querySelector('.user-diet').textContent = profile.tags[0] || '';
  document.querySelector('.avatar-top').textContent = profile.emoji;
}

// ── MODAL ──
function openModal() {
  document.getElementById('profileModal').classList.add('open');
  document.getElementById('newName').focus();
}

function closeModal() {
  document.getElementById('profileModal').classList.remove('open');
  document.getElementById('newName').value = '';
  document.getElementById('newEmoji').value = '';
  document.querySelectorAll('.modal-tag.selected').forEach(t => t.classList.remove('selected'));
}

function toggleModalTag(el) {
  el.classList.toggle('selected');
}

function addProfile() {
  const name = document.getElementById('newName').value.trim();
  const emoji = document.getElementById('newEmoji').value.trim() || '👤';
  const tags = [...document.querySelectorAll('.modal-tag.selected')].map(t => t.textContent);

  if (!name) { showToast('⚠ Digite um nome para o perfil!'); return; }

  const newId = profiles.length + 1;
  profiles.push({
    id: newId, name, emoji,
    img: `https://randomuser.me/api/portraits/lego/${newId}.jpg`,
    tags: tags.length ? tags : ['Sem restrições'],
    active: false
  });

  closeModal();
  renderProfiles();
  showToast(`✅ Perfil "${name}" criado com sucesso!`);
}

// ── FECHAR MODAL FORA ──
document.getElementById('profileModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

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

// ── INIT ──
renderProfiles();