// =====================================================================
// safeStorage — wraps localStorage with try/catch for private mode / blocked storage
// =====================================================================
const safeStorage = {
  get(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  },
  set(k, v) {
    try { localStorage.setItem(k, v); return true; } catch (e) { return false; }
  },
  remove(k) {
    try { localStorage.removeItem(k); } catch (e) { /* no-op */ }
  }
};

// =====================================================================
// Main UI initialization
// =====================================================================
(() => {
  const htmlRoot = document.getElementById('htmlRoot');
  const themeToggle = document.getElementById('themeToggle');
  const readingToggle = document.getElementById('readingModeToggle');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function prefersReducedMotion() {
    return reducedMotionQuery.matches;
  }

  function syncReducedMotionPreference() {
    if (!htmlRoot) return;

    if (prefersReducedMotion()) {
      htmlRoot.setAttribute('data-reduced-motion', 'reduce');
    } else {
      htmlRoot.removeAttribute('data-reduced-motion');
    }
  }

  function applyTheme(theme) {
    if (!htmlRoot) return;

    const isDark = theme === 'dark';
    if (isDark) {
      htmlRoot.setAttribute('data-theme', 'dark');
    } else {
      htmlRoot.removeAttribute('data-theme');
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
      // Dynamic aria-label reflecting current state
      const label = isDark
        ? 'מצב כהה פעיל. לחץ למעבר למצב בהיר'
        : 'מצב בהיר פעיל. לחץ למעבר למצב כהה';
      themeToggle.setAttribute('aria-label', label);
      const moonIcon = themeToggle.querySelector('.icon-moon');
      const sunIcon = themeToggle.querySelector('.icon-sun');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = isDark ? 'none' : '';
        sunIcon.style.display = isDark ? '' : 'none';
      }
    }
    safeStorage.set('theme', theme);
  }

  function initTheme() {
    const stored = safeStorage.get('theme');
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored || prefer;
    applyTheme(theme);
  }

  function initMobileNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('mainNavToggle');
    if (!nav || !navToggle) return;

    const closeMobileNav = () => {
      nav.classList.remove('mobile-open');
      navToggle.setAttribute('aria-expanded', 'false');
      // Restore hamburger icon
      navToggle.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>'
        : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    // Close mobile nav when a regular link is clicked
    nav.querySelectorAll('a:not(.dropbtn)').forEach((a) => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('mobile-open')) closeMobileNav();
      });
    });

    // Desktop: toggle dropdown on click, close on outside click
    nav.querySelectorAll('.nav-dropdown').forEach((dropdown, index) => {
      const dropLink = dropdown.querySelector('.dropbtn');
      const menu = dropdown.querySelector('.dropdown-content');
      if (!dropLink || !menu) return;

      dropLink.addEventListener('click', (event) => {
        if (window.innerWidth <= 768) return; // mobile handled below
        event.preventDefault();
        const wasOpen = dropdown.classList.contains('desktop-open');
        if (wasOpen) {
          dropdown.classList.remove('desktop-open');
          dropdown.classList.add('forced-closed');
          dropLink.setAttribute('aria-expanded', 'false');
        } else {
          dropdown.classList.add('desktop-open');
          dropdown.classList.remove('forced-closed');
          dropLink.setAttribute('aria-expanded', 'true');
        }
      });

      // Mobile: create submenu toggle button (progressive enhancement)
      const toggle = document.createElement('button');
      const menuId = `nav-submenu-${index + 1}`;
      menu.id = menuId;
      toggle.type = 'button';
      toggle.className = 'mobile-submenu-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', menuId);
      toggle.setAttribute('aria-label', `פתיחה וסגירה של תת-תפריט ${dropLink.textContent.trim()}`);
      toggle.textContent = '▾';
      dropLink.insertAdjacentElement('afterend', toggle);

      toggle.addEventListener('click', () => {
        const isExpanded = dropdown.classList.toggle('mobile-expanded');
        toggle.setAttribute('aria-expanded', String(isExpanded));
      });
    });

    // Close any open desktop dropdown when clicking outside
    document.addEventListener('click', (event) => {
      nav.querySelectorAll('.nav-dropdown.desktop-open').forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove('desktop-open');
          dropdown.classList.add('forced-closed');
          const dropLink = dropdown.querySelector('.dropbtn');
          if (dropLink) dropLink.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Remove forced-closed when mouse leaves dropdown, so :hover works again next time
    nav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('forced-closed');
      });
    });

    // Global Escape key handler — closes mobile nav and desktop dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (nav.classList.contains('mobile-open')) closeMobileNav();
      nav.querySelectorAll('.nav-dropdown.desktop-open').forEach((dropdown) => {
        dropdown.classList.remove('desktop-open');
        dropdown.classList.add('forced-closed');
        const dropLink = dropdown.querySelector('.dropbtn');
        if (dropLink) dropLink.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.toc-dropdown.toc-open').forEach((d) => {
        d.classList.remove('toc-open');
        const trigger = d.querySelector('.home-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initTocDropdowns() {
    document.querySelectorAll('.toc-dropdown').forEach((dropdown) => {
      const trigger = dropdown.querySelector('.home-link');
      const menu = dropdown.querySelector('.toc-dropdown-content');
      if (!trigger || !menu) return;

      const closeMenu = () => {
        dropdown.classList.remove('toc-open');
        trigger.setAttribute('aria-expanded', 'false');
      };

      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', (event) => {
        if (window.innerWidth > 768) return;
        event.preventDefault();
        const open = dropdown.classList.toggle('toc-open');
        trigger.setAttribute('aria-expanded', String(open));
      });

      document.addEventListener('click', (event) => {
        if (!dropdown.contains(event.target)) closeMenu();
      });
    });
  }

  function updateReadingModeAccessibility(isReading) {
    if (!readingToggle) return;

    const nextActionLabel = isReading
      ? (readingToggle.dataset.readingLabelOn || 'כיבוי מצב קריאה')
      : (readingToggle.dataset.readingLabelOff || 'הפעלת מצב קריאה');

    readingToggle.setAttribute('aria-pressed', String(isReading));
    readingToggle.setAttribute('aria-label', nextActionLabel);
  }

  function initReadingMode() {
    const storedReadingMode = safeStorage.get('readingMode') === 'true';
    if (storedReadingMode) {
      document.body.classList.add('reading-mode');
    }

    if (readingToggle) {
      updateReadingModeAccessibility(storedReadingMode);
      readingToggle.addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
        const isReading = document.body.classList.contains('reading-mode');
        safeStorage.set('readingMode', String(isReading));
        updateReadingModeAccessibility(isReading);
      });
    }
  }

  function initReadingProgress() {
    const progressEl = document.getElementById('readingProgress');
    const progressContainer = document.querySelector('.reading-progress');
    if (!progressEl) return;

    let ticking = false;

    const updateProgress = () => {
      ticking = false;

      // Skip updates in reading mode (progress bar is hidden)
      if (document.body.classList.contains('reading-mode')) return;

      if (prefersReducedMotion()) {
        progressEl.style.width = '0%';
        if (progressContainer) progressContainer.setAttribute('aria-hidden', 'true');
        return;
      }

      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
      const pct = Math.min(100, Math.max(0, scrolled));
      progressEl.style.width = `${pct}%`;
      if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', String(Math.round(pct)));
        progressContainer.removeAttribute('aria-hidden');
      }
    };

    const queueProgressUpdate = () => {
      if (prefersReducedMotion() || ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', queueProgressUpdate, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    reducedMotionQuery.addEventListener('change', () => {
      syncReducedMotionPreference();
      updateProgress();
    });
  }

  function initParallelToggle() {
    const toggles = document.querySelectorAll('.parallel-toggle');
    if (!toggles.length) return;

    const STORAGE_KEY = 'parallelSourceVisible';

    const showSource = safeStorage.get(STORAGE_KEY) !== 'false';

    function applyState(visible) {
      document.querySelectorAll('[data-parallel-container]').forEach(container => {
        if (visible) {
          container.classList.remove('parallel-source-hidden');
        } else {
          container.classList.add('parallel-source-hidden');
        }
      });

      toggles.forEach(btn => {
        const mode = btn.dataset.parallelToggle;
        const isActive = (mode === 'show' && visible) || (mode === 'hide' && !visible);
        btn.setAttribute('aria-pressed', String(isActive));
      });
    }

    applyState(showSource);

    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.parallelToggle;
        const visible = mode === 'show';
        safeStorage.set(STORAGE_KEY, String(visible));
        applyState(visible);
      });
    });
  }

  if (themeToggle && htmlRoot) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  syncReducedMotionPreference();
  initTheme();
  initReadingMode();
  initMobileNavigation();
  initTocDropdowns();
  initReadingProgress();
  initParallelToggle();
})();

// =====================================================================
// Third-party services (analytics, clarity, translate) — opt-in only
// =====================================================================
window.__externalScriptRegistry = window.__externalScriptRegistry || new Set();

const runtimeThirdParty = (window.siteRuntimeConfig && window.siteRuntimeConfig.thirdParty) || {};
const runtimeAnalytics = runtimeThirdParty.analytics || {};
const runtimeClarity = runtimeThirdParty.clarity || {};
const runtimeTranslate = runtimeThirdParty.translate || {};
const runtimeDisqus = (window.siteRuntimeConfig && window.siteRuntimeConfig.thirdParty && window.siteRuntimeConfig.thirdParty.disqus) || {};

function ensureExternalScript({ service, src, onload, id }) {
  if (!src || !service) return;
  const scriptKey = `${service}:${src}`;
  if (window.__externalScriptRegistry.has(scriptKey)) return;

  const existing = document.querySelector(`script[data-external-service="${service}"][src="${src}"]`);
  if (existing) {
    window.__externalScriptRegistry.add(scriptKey);
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  if (id) script.id = id;
  script.setAttribute('data-external-service', service);
  if (typeof onload === 'function') {
    script.addEventListener('load', onload, { once: true });
  }

  document.head.appendChild(script);
  window.__externalScriptRegistry.add(scriptKey);
}

function isServiceLoaded(service) {
  return window.__externalScriptRegistry.has(`${service}:loaded`);
}
function markServiceLoaded(service) {
  window.__externalScriptRegistry.add(`${service}:loaded`);
}

function loadAnalytics() {
  if (!runtimeAnalytics.enabled || isServiceLoaded('analytics') || !runtimeAnalytics.measurementId) return;
  ensureExternalScript({
    service: 'analytics',
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(runtimeAnalytics.measurementId)}`
  });
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', runtimeAnalytics.measurementId);
  markServiceLoaded('analytics');
}

function loadClarity() {
  if (!runtimeClarity.enabled || isServiceLoaded('clarity') || !runtimeClarity.projectId) return;
  window.clarity = window.clarity || function clarity() {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  ensureExternalScript({
    service: 'clarity',
    src: `https://www.clarity.ms/tag/${encodeURIComponent(runtimeClarity.projectId)}`
  });
  markServiceLoaded('clarity');
}

function loadTranslate() {
  if (!runtimeTranslate.enabled || isServiceLoaded('translate')) return;
  const translateContainer = document.getElementById('google_translate_element');
  if (translateContainer) translateContainer.hidden = false;
  ensureExternalScript({
    service: 'translate',
    src: '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  });
  markServiceLoaded('translate');
}

// Eager-load analytics + clarity on every page (no consent needed — user has explicitly opted in via site config)
loadAnalytics();
loadClarity();

// Translate launcher — kept as a button click (UX, not consent)
const translateLauncher = document.querySelector('[data-third-party-trigger="translate"]');
if (translateLauncher) {
  translateLauncher.addEventListener('click', () => {
    loadTranslate();
    translateLauncher.textContent = 'תרגום פעיל';
    translateLauncher.classList.add('is-active');
    translateLauncher.disabled = true;
  });
}

window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (!window.google || !google.translate) return;
  new google.translate.TranslateElement({
    pageLanguage: 'he',
    includedLanguages: runtimeTranslate.includedLanguages || 'en,fr,de,es,ru,ar,it',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};

// =====================================================================
// Back-to-Top button — appears after scrolling past viewport
// =====================================================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggle = () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  toggle();
})();

// =====================================================================
// Font-size controls (text pages) — A- / A+ buttons
// Persisted in localStorage; manages aria-pressed for screen readers
// =====================================================================
(function initFontControls() {
  const controls = document.querySelector('.text-controls');
  if (!controls) return;

  const buttons = controls.querySelectorAll('.text-controls__btn');
  const stored = safeStorage.get('fontScale') || 'md';
  document.body.setAttribute('data-font-scale', stored);

  const updateAria = (activeBtn) => {
    buttons.forEach((b) => {
      const isActive = b === activeBtn;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
  };

  // Initialize aria-pressed based on stored scale
  const initialActive = Array.from(buttons).find((b) => b.dataset.scale === stored) || buttons[0];
  if (initialActive) updateAria(initialActive);

  buttons.forEach((b) => {
    b.addEventListener('click', () => {
      const scale = b.dataset.scale;
      document.body.setAttribute('data-font-scale', scale);
      safeStorage.set('fontScale', scale);
      updateAria(b);
    });
  });
})();

// =====================================================================
// Search page — read ?q= from URL and inject into Pagefind input
// =====================================================================
(function initSearchQuery() {
  if (!window.location.pathname.endsWith('/search/')) return;

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return;

  // Pagefind UI is initialized asynchronously; poll until ready (max ~6s)
  let attempts = 0;
  const maxAttempts = 40;
  const tryFill = () => {
    attempts++;
    const input = document.querySelector('#search .pagefind-ui__search-input');
    if (input) {
      input.value = q;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    if (attempts < maxAttempts) setTimeout(tryFill, 150);
  };
  setTimeout(tryFill, 300);
})();

// =====================================================================
// Lazy-load Disqus when comments section approaches viewport
// =====================================================================
(function initLazyDisqus() {
  if (!runtimeDisqus.enabled || !runtimeDisqus.shortname) return;
  const commentsSection = document.getElementById('disqus_thread') || document.querySelector('.comments-section');
  if (!commentsSection) return;
  if (!('IntersectionObserver' in window)) {
    // Fallback: load after a short delay
    setTimeout(loadDisqus, 2000);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      loadDisqus();
      io.disconnect();
    }
  }, { rootMargin: '200px' });
  io.observe(commentsSection);

  function loadDisqus() {
    if (isServiceLoaded('disqus')) return;
    const shortname = runtimeDisqus.shortname;
    window.disqus_config = function disqus_config() {
      this.page.url = window.location.href;
      this.page.identifier = window.location.pathname;
    };
    const d = document;
    const s = d.createElement('script');
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', String(+new Date()));
    s.setAttribute('data-external-service', 'disqus');
    (d.head || d.body).appendChild(s);
    markServiceLoaded('disqus');
  }
})();
