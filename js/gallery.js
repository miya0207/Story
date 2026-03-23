// js/gallery.js — Gallery and lightbox
function renderGallery() {
  const el = document.getElementById('gallery-grid');
  if (!el) return;
  el.innerHTML = GALLERY_EMOJIS.map((emoji, i) =>
    '<button class="gallery-item fade-up" onclick="openLightbox(\'' + emoji + '\',' + i + ')" style="background:hsl(' + (i*24) + ',60%,92%);border:none;" aria-label="料理写真 ' + (i+1) + 'を拡大">' +
    '<span style="font-size:3rem;" aria-hidden="true">' + emoji + '</span>' +
    '</button>'
  ).join('');
}

function openLightbox(emoji, index) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const content = lb.querySelector('.lightbox-content');
  if (content) {
    content.innerHTML =
      '<button onclick="closeLightbox()" aria-label="閉じる" style="position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:1.5rem;cursor:pointer;border-radius:50%;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">✕</button>' +
      '<div style="font-size:8rem;" role="img" aria-label="料理写真 ' + (index+1) + '">' + emoji + '</div>';
  }
  lb.classList.add('open');
  lb.style.display = 'flex';
  // Move focus to close button
  const closeBtn = lb.querySelector('button');
  if (closeBtn) closeBtn.focus();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) { lb.style.display = 'none'; lb.classList.remove('open'); }
}

document.addEventListener('DOMContentLoaded', () => {
  renderGallery();
  // Close lightbox with Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
});
