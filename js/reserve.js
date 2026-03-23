// js/reserve.js — Reservation form logic
let currentTab = 'to';

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.res-tab').forEach(t => t.classList.remove('active'));
  const tabEl = document.getElementById('tab-' + tab);
  if (tabEl) tabEl.classList.add('active');
  document.querySelectorAll('.res-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('panel-' + tab);
  if (panel) panel.style.display = 'block';
}

function submitReservation() {
  const name = document.getElementById('res-name') ? document.getElementById('res-name').value.trim() : '';
  const tel = document.getElementById('res-tel') ? document.getElementById('res-tel').value.trim() : '';
  const date = document.getElementById('res-date') ? document.getElementById('res-date').value : '';
  const time = document.getElementById('res-time') ? document.getElementById('res-time').value : '';
  if (!name || !tel || !date || !time) {
    alert('お名前、お電話番号、ご希望日、ご希望時間は必須です。');
    return;
  }

  const msg = document.getElementById('res-success');
  if (msg) { msg.style.display = 'block'; }

  // Clear cart after successful submission
  localStorage.removeItem('story_cart');
  if (typeof updateNavCartBadge === 'function') updateNavCartBadge();

  // Reset form
  const form = document.getElementById('res-form');
  if (form) form.reset();

  setTimeout(() => { if (msg) msg.style.display = 'none'; }, 5000);
}

// Load cart on page init
document.addEventListener('DOMContentLoaded', () => {
  // Set min date to tomorrow
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Load cart summary
  const cartItems = JSON.parse(localStorage.getItem('story_cart') || '[]');
  const summaryEl = document.getElementById('cart-summary-items');
  const emptyEl = document.getElementById('cart-summary-empty');
  const totalEl = document.getElementById('cart-summary-total');

  if (summaryEl) {
    if (cartItems.length === 0) {
      if (emptyEl) emptyEl.style.display = 'block';
      summaryEl.innerHTML = '';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
      summaryEl.innerHTML = cartItems.map(item =>
        '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:0.88rem;">' +
        '<span>' + item.emoji + ' ' + item.name + ' × ' + item.qty + '</span>' +
        '<span style="font-weight:600;">¥' + (item.price*item.qty).toLocaleString() + '</span></div>'
      ).join('');
      if (totalEl) totalEl.innerHTML = '<span>合計</span><span>¥' + total.toLocaleString() + '</span>';

      // Auto-fill order field
      const orderField = document.getElementById('res-order');
      if (orderField) {
        const lines = cartItems.map(i => i.name + ' × ' + i.qty + ' (¥' + (i.price*i.qty).toLocaleString() + ')');
        orderField.value = lines.join('\n') + '\n合計: ¥' + total.toLocaleString();
      }
    }
  }
});
