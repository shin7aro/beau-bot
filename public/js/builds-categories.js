/* ─────────────────────────────────────────
   CATEGORY MANAGEMENT
   Officers/admins can add custom categories
───────────────────────────────────────── */

let allCategories = [];

async function loadCategories() {
  try {
    const res = await fetch('/api/builds/categories');
    allCategories = await res.json();
    window.__buildCategories = allCategories; // Expose for builds.js init
    renderTabNav();
  } catch (err) {
    console.error('Failed to load categories:', err);
    allCategories = [];
    window.__buildCategories = [];
  }
}

// Expose globally for builds.js to call during initialization
window.loadCategories = loadCategories;

function renderTabNav() {
  const tabNav = document.getElementById('tab-nav');
  if (!tabNav) return;
  
  const manageBtnHtml = window.SITE_AUTH && (window.SITE_AUTH.role === 'officer' || window.SITE_AUTH.role === 'admin')
    ? '<button class="btn manage-categories-btn officer-only visible" id="manage-categories-btn"><span class="btn-label">+ Manage Categories</span></button>'
    : '';
  
  tabNav.innerHTML = allCategories.map(cat => 
    `<button class="tab-btn ${cat.id === (window.currentTab || 'brawl') ? 'active' : ''}" data-tab="${cat.id}">${escapeHtml(cat.label)}</button>`
  ).join('') + manageBtnHtml;
  
  // Re-attach tab click handlers
  tabNav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.switchTab) {
        window.switchTab(btn.dataset.tab);
      } else {
        // Fallback for legacy tab switching
        const tab = btn.dataset.tab;
        window.currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
      }
    });
  });
  
  const manageBtn = document.getElementById('manage-categories-btn');
  if (manageBtn) {
    manageBtn.addEventListener('click', openCategoryModal);
  }
}

function openCategoryModal() {
  const modal = document.getElementById('category-modal-overlay');
  if (!modal) {
    createCategoryModal();
    return openCategoryModal();
  }
  
  renderCategoryList();
  modal.classList.add('open');
}

function closeCategoryModal() {
  const modal = document.getElementById('category-modal-overlay');
  if (modal) modal.classList.remove('open');
}

function createCategoryModal() {
  const div = document.createElement('div');
  div.id = 'category-modal-overlay';
  div.className = 'category-modal-overlay';
  div.innerHTML = `
    <div class="category-modal">
      <div class="category-modal-header">
        <h2 class="category-modal-title">Manage Categories</h2>
        <button class="category-modal-close" aria-label="Close">×</button>
      </div>
      <div class="category-modal-body">
        <div class="category-list" id="category-list"></div>
        <form class="category-add-form" id="category-add-form">
          <input type="text" class="category-input" id="category-name-input" placeholder="New category name..." maxlength="50" required>
          <button type="submit" class="category-submit-btn">Add</button>
        </form>
      </div>
    </div>`;
  
  document.body.appendChild(div);
  
  div.addEventListener('click', e => { if (e.target === div) closeCategoryModal(); });
  div.querySelector('.category-modal-close').addEventListener('click', closeCategoryModal);
  
  const form = div.querySelector('#category-add-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createCategory();
  });
}

function renderCategoryList() {
  const list = document.getElementById('category-list');
  if (!list) return;
  
  const defaultIds = ['brawl', 'gank', 'kite', 'brawlclap', 'tracking', 'groupdungeon', 'avadungeon'];
  
  list.innerHTML = allCategories.map(cat => {
    const isDefault = defaultIds.includes(cat.id);
    const deleteBtn = !isDefault 
      ? `<button type="button" class="category-item-btn danger" data-delete="${cat.id}">Delete</button>`
      : '';
    
    return `
      <div class="category-item ${isDefault ? 'is-default' : ''}">
        <span class="category-item-label">${escapeHtml(cat.label)}</span>
        <div class="category-item-actions">
          ${deleteBtn}
        </div>
      </div>`;
  }).join('');
  
  // Attach delete handlers
  list.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteCategory(btn.dataset.delete));
  });
}

async function createCategory() {
  const input = document.getElementById('category-name-input');
  const label = input.value.trim();
  
  if (!label) return;
  
  try {
    const res = await fetch('/api/builds/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ label }),
    });
    
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to create category');
      return;
    }
    
    const newCat = await res.json();
    allCategories.push(newCat);
    window.__buildCategories = allCategories;
    
    // Initialize empty build list for new category
    if (window.ALL_BUILDS && !window.ALL_BUILDS[newCat.id]) {
      window.ALL_BUILDS[newCat.id] = [];
    }
    
    // Create the tab panel + wire up the build editor (same as other tabs)
    if (window.createDynamicTab && !document.getElementById('tab-' + newCat.id)) {
      window.createDynamicTab(newCat);
    }
    
    input.value = '';
    renderCategoryList();
    renderTabNav();
    showToast(`Category "${label}" created`);
  } catch (err) {
    console.error('Failed to create category:', err);
    alert('Failed to create category');
  }
}

async function deleteCategory(id) {
  if (!confirm('Delete this category? All builds in it will be removed.')) return;
  
  try {
    const res = await fetch(`/api/builds/categories/${id}`, {
      method: 'DELETE',
      credentials: 'same-origin',
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.error || 'Failed to delete category');
      return;
    }
    
    allCategories = allCategories.filter(c => c.id !== id);
    if (window.ALL_BUILDS) {
      delete window.ALL_BUILDS[id];
    }
    
    renderCategoryList();
    renderTabNav();
    
    // Switch to first category if we deleted the current one
    const currentTab = window.currentTab || 'brawl';
    if (currentTab === id && allCategories.length > 0) {
      if (window.switchTab) {
        window.switchTab(allCategories[0].id);
      }
    }
    
    showToast('Category deleted');
  } catch (err) {
    console.error('Failed to delete category:', err);
    alert('Failed to delete category');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
