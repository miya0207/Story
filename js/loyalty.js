// js/loyalty.js — Stamps, coupons, reviews
let stampCount = parseInt(localStorage.getItem('story_stamps') || '0');
let reviewStars = 5;
let userReviews = JSON.parse(localStorage.getItem('story_reviews') || '[]');

function renderStamps() {
  const el = document.getElementById('stamp-grid');
  if (!el) return;
  el.innerHTML = Array.from({length: 10}, (_, i) =>
    '<div class="stamp-circle' + (i < stampCount ? ' filled' : '') + '" aria-hidden="true">' + (i < stampCount ? '🐸' : '') + '</div>'
  ).join('');
  const counter = document.getElementById('stamp-counter');
  if (counter) {
    counter.textContent = '現在 ' + stampCount + ' / 10 スタンプ';
    counter.setAttribute('aria-live', 'polite');
    counter.setAttribute('aria-atomic', 'true');
  }
  const reward = document.getElementById('stamp-reward');
  if (reward) reward.style.display = stampCount >= 10 ? 'block' : 'none';
}

function addStamp() {
  if (stampCount >= 20) return;
  stampCount++;
  localStorage.setItem('story_stamps', stampCount);
  renderStamps();
  if (stampCount === 10) {
    setTimeout(() => alert('🎉 10スタンプ達成！\nからあげ1個プレゼント or テイクアウト¥100引き\n次回ご来店時にスタッフへ画面をお見せください！'), 300);
  }
}

function resetStamp() {
  if (!confirm('スタンプをリセットしますか？')) return;
  stampCount = 0;
  localStorage.setItem('story_stamps', 0);
  renderStamps();
}

// Coupons
const usedCoupons = JSON.parse(localStorage.getItem('story_coupons') || '{}');
function useCoupon(id, code) {
  if (usedCoupons[id]) { alert('このクーポンはすでに使用済みです'); return; }
  if (!confirm('クーポンコード「' + code + '」を使用しますか？\nスタッフへ画面をお見せください。')) return;
  usedCoupons[id] = true;
  localStorage.setItem('story_coupons', JSON.stringify(usedCoupons));
  document.querySelectorAll('.coupon-card[data-id="' + id + '"]').forEach(c => c.classList.add('used'));
  const cardEl = document.getElementById(id);
  if (cardEl) {
    const usedEl = cardEl.querySelector('.coupon-used');
    if (usedEl) usedEl.style.display = 'flex';
  }
}

function initCoupons() {
  Object.keys(usedCoupons).forEach(id => {
    const cardEl = document.getElementById(id);
    if (cardEl) {
      const usedEl = cardEl.querySelector('.coupon-used');
      if (usedEl) usedEl.style.display = 'flex';
    }
  });
}

// Reviews
function setStars(n) {
  reviewStars = n;
  document.querySelectorAll('.star-btn').forEach((s, i) => {
    const filled = i < n;
    s.classList.toggle('active', filled);
    s.style.color = filled ? '#b37a00' : '#ccc';
    s.setAttribute('aria-pressed', filled ? 'true' : 'false');
    s.setAttribute('aria-label', (i + 1) + '星');
  });
}

function submitReview() {
  const textEl = document.getElementById('review-text');
  const nickEl = document.getElementById('review-nick');
  const text = textEl ? textEl.value.trim() : '';
  if (!text) { alert('レビュー内容を入力してください'); return; }
  const nick = nickEl ? (nickEl.value.trim() || '匿名さん') : '匿名さん';
  const now = new Date();
  const date = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
  userReviews.unshift({ nick, text, stars: reviewStars, date });
  localStorage.setItem('story_reviews', JSON.stringify(userReviews));
  if (textEl) textEl.value = '';
  if (nickEl) nickEl.value = '';
  setStars(5);
  renderReviews();
  const msg = document.getElementById('review-success');
  if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
}

function renderReviews() {
  const el = document.getElementById('reviews-grid');
  if (!el) return;
  const allReviews = [...userReviews, ...DEFAULT_REVIEWS];
  el.innerHTML = allReviews.map(r =>
    '<div class="review-card fade-up">' +
    '<div class="review-stars">' + '⭐'.repeat(r.stars) + '</div>' +
    '<p class="review-text">"' + r.text + '"</p>' +
    '<div class="review-meta">' + (r.nick || r.author || '匿名') + ' · ' + (r.date || '') + '</div>' +
    '</div>'
  ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderStamps();
  initCoupons();
  renderReviews();
  setStars(5);
});
