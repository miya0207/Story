// js/main.js — Shared: dark mode, mobile menu, BGM, scroll progress, header/footer injection

// ─── DARK MODE ───
function toggleDark() {
  const dark = document.body.classList.toggle('dark');
  localStorage.setItem('story_dark', dark ? '1' : '');
  const btn = document.getElementById('dark-btn');
  if (btn) btn.textContent = dark ? '☀️' : '🌙';
}
if (localStorage.getItem('story_dark')) {
  document.body.classList.add('dark');
  // btn textContent is set after DOM loads
}

// ─── MOBILE MENU ───
function toggleMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobile-menu');
  if (!h || !m) return;
  const open = m.classList.toggle('open');
  h.classList.toggle('open', open);
  h.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
function closeMenu() {
  const h = document.getElementById('hamburger');
  const m = document.getElementById('mobile-menu');
  if (h) { h.classList.remove('open'); h.setAttribute('aria-expanded', 'false'); }
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── FAQ ───
function toggleFaq(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !expanded);
}

// ─── COUNTER ───
function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  // Skip animation if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = target.toLocaleString();
    return;
  }
  let n = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = n.toLocaleString();
    if (n >= target) clearInterval(timer);
  }, 30);
}

// ─── SHARE ───
function copyURL() {
  navigator.clipboard.writeText(location.href).then(() => alert('URLをコピーしました！'));
}

// ─── BGM ───
let bgmIdx = 0, bgmPlaying = false;
let bgmAudio;
function bgmLoad(idx) {
  bgmAudio = bgmAudio || document.getElementById('bgm-audio');
  if (!bgmAudio || !BGM_LIST || !BGM_LIST[idx]) return;
  bgmAudio.src = BGM_LIST[idx].src;
  bgmAudio.volume = 0.35;
  const t = document.getElementById('bgm-title');
  if (t && BGM_LIST[idx].title) t.textContent = '🎵 ' + BGM_LIST[idx].title;
}
function bgmToggle() {
  bgmAudio = bgmAudio || document.getElementById('bgm-audio');
  if (!bgmAudio) return;
  if (bgmPlaying) {
    bgmAudio.pause(); bgmPlaying = false;
    const btn = document.getElementById('bgm-btn');
    if (btn) btn.textContent = '▶️';
  } else {
    bgmAudio.play().catch(() => {});
    bgmPlaying = true;
    const btn = document.getElementById('bgm-btn');
    if (btn) btn.textContent = '⏸';
  }
}
function bgmNext() {
  if (!BGM_LIST) return;
  bgmIdx = (bgmIdx + 1) % BGM_LIST.length;
  bgmLoad(bgmIdx);
  if (bgmPlaying) { bgmAudio = bgmAudio || document.getElementById('bgm-audio'); if (bgmAudio) bgmAudio.play().catch(() => {}); }
}
function bgmSetVol(v) {
  bgmAudio = bgmAudio || document.getElementById('bgm-audio');
  if (bgmAudio) bgmAudio.volume = parseFloat(v);
}

// ─── CART BADGE ───
function updateNavCartBadge() {
  const cart = JSON.parse(localStorage.getItem('story_cart') || '[]');
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('nav-cart-count');
  if (badge) {
    badge.textContent = total;
    badge.classList.toggle('visible', total > 0);
  }
}

// ─── HEADER INJECTION ───
function injectHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.innerHTML = `
<a href="#main-content" class="skip-link">メインコンテンツへスキップ</a>
<div id="scroll-progress" aria-hidden="true"></div>
<div id="notice-banner" role="banner">🎉 PayPay対応スタート！ LINE登録で毎日の日替わり情報をゲット → <a href="loyalty.html#coupon">クーポンを見る</a><button id="notice-banner-close" aria-label="お知らせバナーを閉じる">✕</button></div>
<nav id="navbar" aria-label="メインナビゲーション">
  <a href="index.html" class="nav-logo">ST<span>O</span>RY</a>
  <ul class="nav-links" id="nav-links">
    <li><a href="menu.html" data-page="menu">メニュー</a></li>
    <li><a href="reserve.html" data-page="reserve">テイクアウト注文</a></li>
    <li><a href="banquet.html" data-page="banquet">宴会プラン</a></li>
    <li><a href="about.html" data-page="about">店舗情報</a></li>
    <li><a href="loyalty.html" data-page="loyalty">スタンプ・特典</a></li>
  </ul>
  <div style="display:flex;align-items:center;gap:10px;">
    <a href="reserve.html" class="nav-cart-badge" id="nav-cart-link" title="カートを見る">🛒 <span id="nav-cart-count" class="nav-cart-count">0</span></a>
    <a href="tel:08035081890" class="nav-tel">📞 080-3508-1890</a>
    <button onclick="toggleDark()" id="dark-btn" aria-label="ダークモード切替" style="background:none;border:none;cursor:pointer;font-size:1.2rem;">🌙</button>
    <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="メニューを開く">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<nav id="mobile-menu" aria-label="モバイルナビゲーション">
  <a href="menu.html" onclick="closeMenu()">メニュー</a>
  <a href="reserve.html" onclick="closeMenu()">テイクアウト注文</a>
  <a href="banquet.html" onclick="closeMenu()">宴会プラン</a>
  <a href="loyalty.html" onclick="closeMenu()">スタンプ・クーポン</a>
  <a href="about.html" onclick="closeMenu()">店舗情報</a>
  <a href="tel:08035081890" onclick="closeMenu()">📞 電話注文</a>
</nav>`;
}

// ─── FOOTER INJECTION ───
function injectFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
<footer style="background:var(--warm);border-top:1px solid var(--border);padding:48px 5% 24px;">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:40px;">
    <div>
      <div class="nav-logo" style="font-size:1.8rem;margin-bottom:8px;">ST<span style="color:var(--amber)">O</span>RY</div>
      <p style="font-size:0.8rem;color:var(--brown);">本物のうまさを気軽に、毎日🐸</p>
      <p style="font-size:0.78rem;color:var(--brown);margin-top:8px;">11:00〜20:30 年中無休</p>
    </div>
    <div>
      <p style="font-size:0.75rem;font-weight:700;letter-spacing:0.1em;color:var(--brown);margin-bottom:12px;">NAVIGATION</p>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:8px;">
        <li><a href="index.html" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">ホーム</a></li>
        <li><a href="menu.html" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">メニュー</a></li>
        <li><a href="reserve.html" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">テイクアウト注文</a></li>
        <li><a href="banquet.html" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">宴会プラン</a></li>
        <li><a href="about.html" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">店舗情報</a></li>
        <li><a href="loyalty.html" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">スタンプ・特典</a></li>
      </ul>
    </div>
    <div>
      <p style="font-size:0.75rem;font-weight:700;letter-spacing:0.1em;color:var(--brown);margin-bottom:12px;">CONTACT</p>
      <p style="font-size:0.82rem;color:var(--brown);">埼玉県川口市木曽呂820-3</p>
      <a href="tel:08035081890" style="font-size:1rem;font-weight:700;color:var(--ink);text-decoration:none;display:block;margin-top:6px;">080-3508-1890</a>
      <div style="display:flex;gap:10px;margin-top:12px;">
        <a href="https://www.instagram.com/story.kizoro" target="_blank" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">📸 Instagram</a>
        <a href="https://line.me/R/ti/p/@story_kizoro" target="_blank" style="color:var(--brown);text-decoration:none;font-size:0.82rem;">💬 LINE</a>
      </div>
    </div>
  </div>
  <p style="text-align:center;font-size:0.72rem;color:var(--brown);margin-top:32px;padding-top:16px;border-top:1px solid var(--border);">© 2025 お食事処STORY 木曽呂店 All Rights Reserved.</p>
</footer>`;
}

// ─── INTERSECTION OBSERVER ───
let observer;
function initFadeObserver() {
  // Skip animation entirely if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    return;
  }
  observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ─── DOMContentLoaded ───
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();

  // Notice banner close button
  const bannerClose = document.getElementById('notice-banner-close');
  if (bannerClose) {
    // Hide if previously dismissed this session
    if (sessionStorage.getItem('notice_dismissed')) {
      const banner = document.getElementById('notice-banner');
      if (banner) banner.style.display = 'none';
      const nav = document.getElementById('navbar');
      if (nav) nav.style.top = '0px';
      const mm = document.getElementById('mobile-menu');
      if (mm) mm.style.top = '62px';
    }
    bannerClose.addEventListener('click', () => {
      const banner = document.getElementById('notice-banner');
      if (banner) banner.style.display = 'none';
      const nav = document.getElementById('navbar');
      if (nav) nav.style.top = '0px';
      const mm = document.getElementById('mobile-menu');
      if (mm) mm.style.top = '62px';
      sessionStorage.setItem('notice_dismissed', '1');
    });
  }

  // Restore dark mode
  if (localStorage.getItem('story_dark')) {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-btn');
    if (btn) btn.textContent = '☀️';
  }

  // Active nav detection
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
      if (a.dataset.page === currentPage) a.setAttribute('aria-current', 'page');
    });
  }

  // Cart badge
  updateNavCartBadge();

  // Scroll progress & navbar shadow
  window.addEventListener('scroll', () => {
    const p = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    const prog = document.getElementById('scroll-progress');
    if (prog) prog.style.width = p + '%';
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Escape key closes mobile menu
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Fade-up observer
  initFadeObserver();

  // Safety fallback: show any still-hidden fade-up elements after 1.5s
  // Prevents blank page on slow devices if IntersectionObserver doesn't fire
  setTimeout(() => {
    document.querySelectorAll('.fade-up:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 1500);

  // BGM init (only if audio element exists and BGM_LIST is configured)
  if (typeof BGM_LIST !== 'undefined' && BGM_LIST[0] && BGM_LIST[0].src) {
    bgmLoad(0);
    const audio = document.getElementById('bgm-audio');
    if (audio) {
      audio.addEventListener('ended', bgmNext);
      const bar = document.getElementById('bgm-bar');
      if (bar) bar.style.display = 'flex';
    }
  }
});
