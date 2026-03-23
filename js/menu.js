// js/menu.js — Menu page logic
let currentGroup = 'all';
let currentSub = '';
let searchQuery = '';

function setGroup(group, el) {
  currentGroup = group;
  currentSub = '';
  document.querySelectorAll('.menu-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  if (el) { el.classList.add('active'); el.setAttribute('aria-selected', 'true'); }
  renderSubTabs();
  renderMenu();
}

function setSub(sub, el) {
  currentSub = sub;
  document.querySelectorAll('.menu-subtab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  if (el) { el.classList.add('active'); el.setAttribute('aria-selected', 'true'); }
  renderMenu();
}

function renderSubTabs() {
  const container = document.getElementById('sub-tabs');
  if (!container) return;
  const groupDef = GROUP_DEF[currentGroup];
  const subs = (groupDef && groupDef.subs) || [];
  if (subs.length === 0) { container.innerHTML = ''; currentSub = ''; return; }
  container.innerHTML = subs.map((s, i) =>
    '<button class="menu-subtab' + (i===0?' active':'') + '" role="tab" aria-selected="' + (i===0?'true':'false') + '" onclick="setSub(\'' + s.key + '\',this)">' + s.label + '</button>'
  ).join('');
  if (subs.length > 0) currentSub = subs[0].key;
}

function filterMenu() {
  const input = document.getElementById('menu-search');
  searchQuery = (input ? input.value : '').trim();
  renderMenu();
}

function renderMenu() {
  const container = document.getElementById('menu-grid');
  if (!container) return;
  let items = MENU_ITEMS;
  if (currentGroup === 'kodomo') {
    items = items.filter(m => m.kodomo);
  } else if (currentGroup !== 'all') {
    items = items.filter(m => m.group === currentGroup);
    if (currentSub) items = items.filter(m => m.sub === currentSub);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    items = items.filter(m => m.name.toLowerCase().includes(q) || (m.desc || '').toLowerCase().includes(q));
  }
  if (items.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--brown);">該当するメニューが見つかりませんでした</p>';
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="menu-card fade-up">
      <div class="menu-card-top">
        <span class="menu-emoji">${item.emoji}</span>
        <div class="menu-card-info">
          <div class="menu-name">${item.name}</div>
          ${item.tag ? '<span class="menu-tag' + (item.kodomo ? ' kodomo' : '') + '">' + item.tag + '</span>' : ''}
        </div>
      </div>
      <div class="menu-desc">${item.desc || ''}${!item.to ? '<br><em style="color:#e65100;font-size:0.72rem">※店内のみ</em>' : ''}</div>
      <div class="menu-card-bottom">
        <span class="menu-price">¥${item.price.toLocaleString()}</span>
        <button class="add-btn" onclick="addToCart(${item.id})" aria-label="${item.name}をカートに追加">+ カート</button>
      </div>
    </div>`).join('');
  // Re-observe new elements
  document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
    if (typeof observer !== 'undefined' && observer) observer.observe(el);
    else el.classList.add('visible');
  });
}

// Initialize menu page
document.addEventListener('DOMContentLoaded', () => {
  renderSubTabs();
  renderMenu();
  updateCartUI();
});
