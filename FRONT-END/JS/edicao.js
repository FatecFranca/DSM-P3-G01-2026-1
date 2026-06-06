// ── IMAGEM DE CAPA ──
function handleCover(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    document.getElementById('coverImg').src = ev.target.result;
    showToast('✅ Imagem atualizada!');
  };
  reader.readAsDataURL(file);
}

// ── INGREDIENTES ──
function addIngredient() {
  const tbody = document.getElementById('ingBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>⠿</td>
    <td><input type="text" placeholder="Nome do ingrediente"></td>
    <td><input type="text" placeholder="Quantidade"></td>
    <td style="text-align:right"><button class="delete-btn" onclick="removeIng(this)">🗑</button></td>
  `;
  tbody.appendChild(tr);
  tr.querySelector('input').focus();
}

function removeIng(btn) {
  btn.closest('tr').remove();
}

// ── PASSOS ──
function addStep() {
  const list = document.getElementById('stepsList');
  const num = list.querySelectorAll('.step-row').length + 1;
  const div = document.createElement('div');
  div.className = 'step-row';
  div.innerHTML = `
    <div class="step-num">${num}</div>
    <textarea placeholder="Descreva este passo..."></textarea>
    <button class="delete-btn" onclick="removeStep(this)" style="margin-top:4px">🗑</button>
  `;
  list.appendChild(div);
  div.querySelector('textarea').focus();
}

function removeStep(btn) {
  btn.closest('.step-row').remove();
  renumberSteps();
}

function renumberSteps() {
  document.querySelectorAll('#stepsList .step-num').forEach((el, i) => {
    el.textContent = i + 1;
  });
}

// ── TAGS ──
function toggleTag(el) {
  const isActive = el.classList.contains('active-tag');
  el.classList.toggle('active-tag', !isActive);
  el.classList.toggle('inactive-tag', isActive);
}

// ── AVANÇADO ──
function toggleAdvanced() {
  const toggle = document.getElementById('advToggle');
  const body = document.getElementById('advBody');
  toggle.classList.toggle('open');
  body.classList.toggle('open');
}

// ── SALVAR ──
function handleSave() {
  const title = document.getElementById('recipeTitle').value.trim();
  if (!title) { showToast('⚠ Adicione um título para a receita!'); return; }
  showToast('✅ Alterações salvas com sucesso!');
}

// ── DESCARTAR ──
function handleDiscard() {
  if (confirm('Descartar todas as alterações? As mudanças serão perdidas.')) {
    showToast('🗑 Alterações descartadas.');
  }
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
