document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const galleries = Array.from(document.querySelectorAll('.gallery'));
  const imgModal = document.getElementById('imgModal');
  const modalImg = imgModal.querySelector('img');
  const modalClose = document.getElementById('modalClose');
  const yearSpan = document.getElementById('year');
  const tag = document.querySelector('.tag');

  yearSpan.textContent = new Date().getFullYear();

  const saved = localStorage.getItem('avery-theme');
  const icon = themeToggle?.querySelector('i');

  if (saved === 'dark') {
    body.classList.add('dark');
    themeToggle?.setAttribute('aria-pressed', 'true');
    icon?.classList.replace('fa-sun', 'fa-moon');
  } else {
    body.classList.add('light');
    themeToggle?.setAttribute('aria-pressed', 'false');
    icon?.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    body.classList.toggle('light', !isDark);
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    localStorage.setItem('avery-theme', isDark ? 'dark' : 'light');

    if (isDark) {
      icon?.classList.replace('fa-sun', 'fa-moon');
    } else {
      icon?.classList.replace('fa-moon', 'fa-sun');
    }
  });

function openModal(src, alt) {
  modalImg.src = src;
  modalImg.alt = alt || '';
  imgModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', escClose);

  modalImg.onload = () => {
    const { naturalWidth, naturalHeight } = modalImg;
    const aspectRatio = naturalWidth / naturalHeight;
    const modalContent = imgModal.querySelector('.modal-content');

    modalContent.style.width = '';
    modalContent.style.height = '';

    if (aspectRatio > 1.2) {
      modalContent.style.width = '90vw';
      modalContent.style.height = 'auto';
    } else {
      modalContent.style.height = '90vh';
      modalContent.style.width = 'auto';
    }
  };
}

function closeModal() {
  imgModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  setTimeout(() => (modalImg.src = ''), 200);
  document.removeEventListener('keydown', escClose);
}

  function escClose(e) {
    if (e.key === 'Escape') closeModal();
  }

  modalClose.addEventListener('click', closeModal);
  imgModal.addEventListener('click', e => {
    if (e.target === imgModal) closeModal();
  });

  function attachImageClickEvents() {
    document.querySelectorAll('.gallery.active img').forEach(img => {
      img.onclick = () => openModal(img.src, img.alt);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('active')) return;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      galleries.forEach(g => {
        g.classList.toggle('active', g.dataset.cat === cat);
        g.style.zIndex = g.dataset.cat === cat ? 10 : 0;
      });

      attachImageClickEvents();
      document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  attachImageClickEvents();

  const target = 37500000;
  let current = 0;
  const duration = 3000;

  function formatNumber(num) {
    return num.toLocaleString();
  }

  function animateCount(timestampStart) {
    if (!timestampStart) timestampStart = performance.now();
    const elapsed = performance.now() - timestampStart;
    const progress = Math.min(elapsed / duration, 1);
    current = Math.floor(progress * target);
    tag.textContent = `Contributed to ${formatNumber(current)} Visits`;

    if (progress < 1) {
      requestAnimationFrame(() => animateCount(timestampStart));
    }
  }

  animateCount();
});

const heartContainer = document.querySelector('.heart-overlay');

function spawnHeart() {
  const heart = document.createElement('div');
  heart.className = 'heart';

  const baseTop = window.innerWidth < 600 ? 600 : 470;

  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.top = `${baseTop + Math.random() * 40}px`;
  heart.style.animationDelay = '0s';
  heart.style.setProperty('--angle', `${(Math.random() * 50 - 25)}deg`);

  heart.innerHTML = `
<svg viewBox="0 0 32 29">
  <path d="M23.6 1.6c-3.1 0-5.3 2.1-7.6 5.1C13.7 3.7 11.5 1.6 8.4 1.6 4.2 1.6 1 5.2 1 9.4c0 6.4 7.3 11.1 15 18 7.7-6.9 15-11.6 15-18 0-4.2-3.2-7.8-7.4-7.8z" />
</svg>
  `;

  heartContainer.appendChild(heart);
  setTimeout(() => heart.remove(), window.innerWidth < 600 ? 12000 : 18000);
}

setInterval(spawnHeart, 500);
