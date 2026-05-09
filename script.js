/* ============================
   CLOCKHOUSE COTTAGE — SCRIPT
   3-language: EN / LV / RU
   ============================ */

let config = {};
let currentLang = 'en';

fetch('config.json')
  .then(r => r.json())
  .then(data => { config = data; init(); })
  .catch(() => init());

function init() {
  buildHighlights();
  buildAmenities();
  buildGalleries();
  applyLanguage(currentLang);
  setupNav();
  setupLightbox();
  setupAnimations();
}

/* ---- LANGUAGE ---- */

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = resolve(key, lang);
    if (value) el.textContent = value;
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Rebuild dynamic lists for new language
  buildAmenities();
  updateHighlightsLang();
}

function resolve(path, lang) {
  const parts = path.split('.');
  const section = parts[0];
  const key = parts.slice(1).join('.');

  if (!config[section]) return null;

  // Try section.lang.key (most common pattern)
  if (config[section][lang] && config[section][lang][key] !== undefined) {
    return config[section][lang][key];
  }

  // Try section.key directly (e.g. host.name)
  if (config[section][key] !== undefined) {
    return config[section][key];
  }

  return null;
}

/* ---- HIGHLIGHTS ---- */

function buildHighlights() {
  const grid = document.getElementById('highlightsGrid');
  if (!grid || !config.highlights) return;

  const icons = {
    'hot-tub': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12h20"/><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/><path d="M6 8c0-1.5.5-3 2-3s2 1.5 2 3"/><path d="M14 8c0-1.5.5-3 2-3s2 1.5 2 3"/></svg>',
    'sauna': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 20h16"/><path d="M4 20V10l8-6 8 6v10"/><path d="M9 14v2"/><path d="M12 13v3"/><path d="M15 14v2"/></svg>',
    'beach': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="5" r="3"/><path d="M2 20c2-3 5-5 10-5s8 2 10 5"/><path d="M12 8v7"/></svg>',
    'star': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'parking': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 010 6H9"/></svg>',
    'host': '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  const items = config.highlights.en;
  grid.innerHTML = items.map((h, i) => `
    <div class="highlight-item fade-in">
      <div class="highlight-icon">${icons[h.icon] || icons['star']}</div>
      <h4 data-hl="${i}" data-f="title">${h.title}</h4>
      <p data-hl="${i}" data-f="text">${h.text}</p>
    </div>
  `).join('');
}

function updateHighlightsLang() {
  if (!config.highlights || !config.highlights[currentLang]) return;
  config.highlights[currentLang].forEach((h, i) => {
    const t = document.querySelector(`[data-hl="${i}"][data-f="title"]`);
    const p = document.querySelector(`[data-hl="${i}"][data-f="text"]`);
    if (t) t.textContent = h.title;
    if (p) p.textContent = h.text;
  });
}

/* ---- AMENITIES ---- */

function buildAmenities() {
  const lang = currentLang;

  ['garage', 'renovation'].forEach(house => {
    const id = house === 'garage' ? 'garageAmenities' : 'renovationAmenities';
    const list = document.getElementById(id);
    if (!list || !config[house] || !config[house][lang]) return;
    list.innerHTML = config[house][lang].amenities
      .map(a => `<li><span class="amenity-dot"></span>${a}</li>`).join('');
  });
}

/* ---- GALLERIES ---- */

function buildGalleries() {
  ['garage', 'renovation'].forEach(house => {
    const id = house === 'garage' ? 'garageGallery' : 'renovationGallery';
    const grid = document.getElementById(id);
    if (!grid || !config[house]) return;
    grid.innerHTML = config[house].galleryImages
      .map((src, i) => `<div class="gallery-item fade-in" data-gallery="${house}" data-idx="${i}"><img src="${src}" alt="Photo ${i+1}" loading="lazy"></div>`)
      .join('');
  });
}

/* ---- NAV ---- */

function setupNav() {
  const nav = document.getElementById('nav');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang);
    });
  });
}

/* ---- LIGHTBOX ---- */

function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let images = [];
  let idx = 0;

  function open(gallery, i) {
    images = config[gallery].galleryImages;
    idx = i;
    img.src = images[idx];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function prev() { idx = (idx - 1 + images.length) % images.length; img.src = images[idx]; }
  function next() { idx = (idx + 1) % images.length; img.src = images[idx]; }

  document.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (item) open(item.dataset.gallery, parseInt(item.dataset.idx));
  });

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ---- ANIMATIONS ---- */

function setupAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  setTimeout(() => {
    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => observer.observe(el));
  }, 600);
}
