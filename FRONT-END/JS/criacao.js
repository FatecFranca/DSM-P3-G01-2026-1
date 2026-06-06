// ── PREVIEW ──
function updatePreview() {
  const title = document.getElementById('recipeTitle').value.trim();
  const desc  = document.getElementById('recipeDesc').value.trim();
  const time  = document.getElementById('recipeTime').value || '0';
  const port  = document.getElementById('recipePortions').value || '0';

  const titleEl = document.getElementById('previewTitle');
  titleEl.textContent = title || 'Título da Receita';
  titleEl.classList.toggle('placeholder', !title);

  document.getElementById('previewDesc').textContent =
    desc || 'Sua descrição aparecerá aqui. Conte aos usuários o que torna esta receita especial e segura para fazer.';

  document.getElementById('previewMeta').textContent = `⏱ ${time} min · 🍽 ${port} porções`;
}

// ── UPLOAD DE IMAGEM ──
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const preview = document.getElementById('uploadPreview');
    preview.src = ev.target.result;
    preview.style.display = 'block';
    document.querySelector('.upload-icon').style.display = 'none';
    document.querySelector('.upload-text').style.display = 'none';
    document.querySelector('.upload-sub').style.display = 'none';

    // Atualiza preview lateral
    const pImg = document.getElementById('previewImg');
    pImg.src = ev.target.result;
    pImg.style.display = 'block';
    document.getElementById('previewPlaceholder').style.display = 'none';
    document.getElementById('previewPlaceholderText').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

// ── TAGS ──
function toggleTag(el) {
  el.classList.toggle('selected');
  updatePreviewTags();
}

function updatePreviewTags() {
  const selected = [...document.querySelectorAll('.diet-tag.selected')].map(t => t.textContent);
  const container = document.getElementById('previewTags');
  const fixed = '<span class="preview-tag safe">Seguro</span>';
  const tags = selected.map(t => `<span class="preview-tag">${t}</span>`).join('');
  container.innerHTML = fixed + tags;
}

// ── INGREDIENTES ──
let ingCount = 0;

function addIngredient() {
  ingCount++;
  const list = document.getElementById('ingredientsList');
  const row = document.createElement('div');
  row.className = 'ingredient-row';
  row.id = `ing-${ingCount}`;
  row.innerHTML = `
    <input type="text" placeholder="Ex: 200g de Farinha de Arroz">
    <label class="allergen-check">
      <input type="checkbox"> <span>⚠ Alergênico?</span>
    </label>
    <button class="remove-btn" onclick="removeRow('ing-${ingCount}')">🗑</button>
  `;
  list.appendChild(row);
}

// ── PASSOS ──
let stepCount = 0;

function addStep() {
  stepCount++;
  const list = document.getElementById('stepsList');
  const row = document.createElement('div');
  row.className = 'step-row';
  row.id = `step-${stepCount}`;
  row.innerHTML = `
    <div class="step-badge">${stepCount}</div>
    <textarea placeholder="Descreva o que fazer neste estágio..."></textarea>
    <button class="remove-btn" onclick="removeRow('step-${stepCount}')" style="margin-top:4px">🗑</button>
  `;
  list.appendChild(row);
}

function removeRow(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
  renumberSteps();
}

function renumberSteps() {
  document.querySelectorAll('#stepsList .step-badge').forEach((badge, i) => {
    badge.textContent = i + 1;
  });
  stepCount = document.querySelectorAll('#stepsList .step-row').length;
}

// ── VISIBILIDADE ──
function selectVis(val) {
  document.getElementById('visPublic').classList.toggle('selected', val === 'public');
  document.getElementById('visPrivate').classList.toggle('selected', val === 'private');
}

// ── PUBLICAR ──
function handlePublish() {
  const title = document.getElementById('recipeTitle').value.trim();
  const confirmed = document.getElementById('confirmCheck').checked;

  if (!title) { showToast('⚠ Adicione um nome para a receita!'); return; }
  if (!confirmed) { showToast('⚠ Confirme as informações de alérgenos!'); return; }

  showToast('🚀 Receita publicada com sucesso!');
}

function handleDiscard() {
  if (confirm('Tem certeza que deseja descartar o rascunho?')) {
    document.getElementById('recipeTitle').value = '';
    document.getElementById('recipeDesc').value = '';
    document.getElementById('ingredientsList').querySelectorAll('.ingredient-row').forEach(r => r.remove());
    document.getElementById('stepsList').innerHTML = '';
    stepCount = 0; ingCount = 0;
    updatePreview();
    showToast('🗑 Rascunho descartado.');
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

// ── INIT ──
addIngredient();
addStep();
updatePreview();