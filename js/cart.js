// js/cart.js — Cart system with localStorage persistence
let cart = JSON.parse(localStorage.getItem('story_cart') || '[]');

function saveCart() {
  localStorage.setItem('story_cart', JSON.stringify(cart));
  updateNavCartBadge();
}

function addToCart(id) {
  const item = MENU_ITEMS.find(m => m.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ id: item.id, emoji: item.emoji, name: item.name, price: item.price, qty: 1, cat: item.cat }); }
  saveCart();
  updateCartUI();
  showCartToast(item.name);
}

function cartQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const fab = document.getElementById('cart-fab');
  if (fab) {
    fab.style.display = total > 0 ? 'flex' : 'none';
    const cnt = fab.querySelector('.cart-count');
    if (cnt) cnt.textContent = total;
  }
  // Update sticky bar on menu page
  const bar = document.getElementById('sticky-order-bar');
  if (bar) {
    if (total > 0) {
      const sum = cart.reduce((s, i) => s + i.price * i.qty, 0);
      bar.innerHTML = '🛒 ' + total + '品 合計¥' + sum.toLocaleString() + ' → 注文確定へ';
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }
  updateNavCartBadge();
}

function renderCartItems() {
  const el = document.getElementById('cart-items');
  if (!el) return;
  if (cart.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:var(--brown);padding:20px;">カートは空です</p>';
    return;
  }
  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span style="font-size:1.5rem;" aria-hidden="true">${item.emoji}</span>
      <div class="cart-item-name">
        <div>${item.name}</div>
        <div style="font-size:0.8rem;color:var(--brown);">¥${item.price.toLocaleString()}</div>
      </div>
      <div class="cart-qty" role="group" aria-label="${item.name}の数量">
        <button class="cart-qty-btn" onclick="cartQty('${item.id}',-1)" aria-label="${item.name}を1つ減らす">−</button>
        <span style="font-weight:600;min-width:24px;text-align:center;">${item.qty}</span>
        <button class="cart-qty-btn" onclick="cartQty('${item.id}',1)" aria-label="${item.name}を1つ増やす">＋</button>
      </div>
      <span class="cart-item-price">¥${(item.price*item.qty).toLocaleString()}</span>
    </div>`).join('');
}

function openCart() {
  const m = document.getElementById('cart-modal');
  if (m) {
    renderCartItems();
    m.style.display = 'flex';
    // Trap focus — focus the close button
    const closeBtn = m.querySelector('[aria-label="カートを閉じる"]');
    if (closeBtn) closeBtn.focus();
  }
}
function closeCart() {
  const m = document.getElementById('cart-modal');
  if (m) m.style.display = 'none';
}
// Close cart on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeCart();
});

function showCartToast(name) {
  // Use ARIA live region for screen reader announcement
  let liveRegion = document.getElementById('cart-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'cart-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = name + 'をカートに追加しました';

  const t = document.createElement('div');
  t.className = 'cart-toast';
  t.setAttribute('aria-hidden', 'true');
  t.textContent = '✅ ' + name + 'をカートに追加';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2500);
}

function syncCartToOrder() {
  const el = document.getElementById('res-order');
  if (!el) return;
  if (cart.length === 0) { el.value = ''; return; }
  const lines = cart.map(i => i.name + ' × ' + i.qty + ' (¥' + (i.price*i.qty).toLocaleString() + ')');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el.value = lines.join('\n') + '\n合計: ¥' + total.toLocaleString();
}

function goToReserve() {
  closeCart();
  window.location.href = 'reserve.html';
}

function orderSet(name, items, price) {
  cart = [{ id: 'set_' + Date.now(), emoji: '🍱', name: name, price: price, qty: 1, cat: 'set' }];
  saveCart();
  window.location.href = 'reserve.html';
}
