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
      const moonIcon = themeToggle.querySelector('.icon-moon');
      const sunIcon = themeToggle.querySelector('.icon-sun');
      if (moonIcon && sunIcon) {
        moonIcon.style.display = isDark ? 'none' : '';
        sunIcon.style.display = isDark ? '' : 'none';
      }
    }
    localStorage.setItem('theme', theme);
  }

  function initTheme() {
    const stored = localStorage.getItem('theme');
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored || prefer;
    applyTheme(theme);
  }

  function initMobileNavigation() {
    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('mainNavToggle');
    if (!nav || !navToggle) return;

    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('mobile-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Toggle icon between hamburger and close
      navToggle.innerHTML = isOpen
        ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>'
        : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    /* Desktop: toggle dropdown on click, close on outside click */
    nav.querySelectorAll('.nav-dropdown').forEach((dropdown, index) => {
      const dropLink = dropdown.querySelector('.dropbtn');
      const menu = dropdown.querySelector('.dropdown-content');
      if (!dropLink || !menu) return;

      dropLink.addEventListener('click', (event) => {
        if (window.innerWidth <= 768) return; // mobile handled below
        event.preventDefault();
        const wasOpen = dropdown.classList.contains('desktop-open');
        if (wasOpen) {
          // Close: remove desktop-open, add forced-closed to override :hover
          dropdown.classList.remove('desktop-open');
          dropdown.classList.add('forced-closed');
          dropLink.setAttribute('aria-expanded', 'false');
        } else {
          // Open: add desktop-open, remove forced-closed
          dropdown.classList.add('desktop-open');
          dropdown.classList.remove('forced-closed');
          dropLink.setAttribute('aria-expanded', 'true');
        }
      });

      /* Mobile: create submenu toggle button */
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

    /* Close any open desktop dropdown when clicking outside */
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

    /* Remove forced-closed when mouse leaves dropdown, so :hover works again next time */
    nav.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
      dropdown.addEventListener('mouseleave', () => {
        dropdown.classList.remove('forced-closed');
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
      ? readingToggle.dataset.readingLabelOn || 'כיבוי מצב קריאה'
      : readingToggle.dataset.readingLabelOff || 'הפעלת מצב קריאה';
    const stateDescription = isReading
      ? readingToggle.dataset.readingDescriptionOn || 'מצב קריאה פעיל. לחיצה תכבה את מצב הקריאה.'
      : readingToggle.dataset.readingDescriptionOff || 'מצב קריאה כבוי. לחיצה תפעיל את מצב הקריאה.';

    readingToggle.setAttribute('aria-pressed', String(isReading));
    readingToggle.setAttribute('aria-label', nextActionLabel);
    readingToggle.setAttribute('aria-description', stateDescription);
  }

  function initReadingMode() {
    const storedReadingMode = localStorage.getItem('readingMode') === 'true';
    if (storedReadingMode) {
      document.body.classList.add('reading-mode');
    }

    if (readingToggle) {
      updateReadingModeAccessibility(storedReadingMode);
      readingToggle.addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
        const isReading = document.body.classList.contains('reading-mode');
        localStorage.setItem('readingMode', isReading);
        updateReadingModeAccessibility(isReading);
      });
    }
  }

  function initReadingProgress() {
    const progressEl = document.getElementById('readingProgress');
    if (!progressEl) return;

    let ticking = false;

    const updateProgress = () => {
      ticking = false;

      if (prefersReducedMotion()) {
        progressEl.style.width = '0%';
        progressEl.setAttribute('aria-hidden', 'true');
        return;
      }

      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
      progressEl.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
      progressEl.removeAttribute('aria-hidden');
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
})();

window.__externalScriptRegistry = window.__externalScriptRegistry || new Set();

const THIRD_PARTY_CONSENT_KEY = 'thirdPartyConsent';
const THIRD_PARTY_LOADED_KEY = 'thirdPartyLoadedServices';
const runtimeThirdParty = (window.siteRuntimeConfig && window.siteRuntimeConfig.thirdParty) || {};
const runtimeAnalytics = runtimeThirdParty.analytics || {};
const runtimeClarity = runtimeThirdParty.clarity || {};
const runtimeTranslate = runtimeThirdParty.translate || {};

function readJsonStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

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

function hasConsent(service) {
  const state = readJsonStorage(THIRD_PARTY_CONSENT_KEY);
  return Boolean(state[service]);
}

function setConsent(service) {
  const state = readJsonStorage(THIRD_PARTY_CONSENT_KEY);
  state[service] = true;
  writeJsonStorage(THIRD_PARTY_CONSENT_KEY, state);
}

function markServiceLoaded(service) {
  const state = readJsonStorage(THIRD_PARTY_LOADED_KEY);
  state[service] = true;
  writeJsonStorage(THIRD_PARTY_LOADED_KEY, state);
}

function isServiceLoaded(service) {
  const state = readJsonStorage(THIRD_PARTY_LOADED_KEY);
  return Boolean(state[service]);
}

function loadAnalytics() {
  if (!runtimeAnalytics.enabled || isServiceLoaded('analytics') || !runtimeAnalytics.measurementId) return;

  ensureExternalScript({
    service: 'analytics',
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(runtimeAnalytics.measurementId)}`
  });

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
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
  if (translateContainer) {
    translateContainer.hidden = false;
  }

  ensureExternalScript({
    service: 'translate',
    src: '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  });

  markServiceLoaded('translate');
}

function shouldLoadService(service, config) {
  if (!config || !config.enabled) return false;
  if (!config.requiresConsent) return true;
  return hasConsent(service);
}

function initThirdPartyButtons() {
  const consentButtons = document.querySelectorAll('[data-consent-service]');
  consentButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.getAttribute('data-consent-service');
      if (!service) return;
      setConsent(service);
      button.disabled = true;
      button.textContent = 'אושר';
      if (service === 'analytics') loadAnalytics();
      if (service === 'clarity') loadClarity();
    });
  });

  const translateLauncher = document.querySelector('[data-third-party-trigger="translate"]');
  if (translateLauncher) {
    translateLauncher.addEventListener('click', () => {
      if (runtimeTranslate.requiresConsent) setConsent('translate');
      loadTranslate();
      translateLauncher.setAttribute('aria-disabled', 'true');
      translateLauncher.disabled = true;
    });
  }
}

function initThirdPartyIntegrations() {
  if (shouldLoadService('analytics', runtimeAnalytics)) loadAnalytics();
  if (shouldLoadService('clarity', runtimeClarity)) loadClarity();
  if (shouldLoadService('translate', runtimeTranslate) && runtimeTranslate.loadStrategy !== 'on-interaction') {
    loadTranslate();
  }

  initThirdPartyButtons();
}

window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (!window.google || !google.translate) return;

  new google.translate.TranslateElement({
    pageLanguage: 'he',
    includedLanguages: runtimeTranslate.includedLanguages || 'en,fr,de,es,ru,ar,it',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};

initThirdPartyIntegrations();

/* ====================================================================
   Back-to-Top button — appears after scrolling past viewport
   ==================================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > window.innerHeight * 0.6) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
  toggle();
})();

/* ====================================================================
   Font-size controls (text pages) — A- / A+ buttons
   Persisted in localStorage
   ==================================================================== */
(function initFontControls() {
  const controls = document.querySelector('.text-controls');
  if (!controls) return;

  const buttons = controls.querySelectorAll('.text-controls__btn');
  const stored = localStorage.getItem('fontScale') || 'md';
  document.body.setAttribute('data-font-scale', stored);
  buttons.forEach((b) => {
    if (b.dataset.scale === stored) b.classList.add('is-active');
    b.addEventListener('click', () => {
      const scale = b.dataset.scale;
      document.body.setAttribute('data-font-scale', scale);
      localStorage.setItem('fontScale', scale);
      buttons.forEach((bb) => bb.classList.remove('is-active'));
      b.classList.add('is-active');
    });
  });
})();

/* ====================================================================
   Search page — read ?q= from URL and inject into Pagefind input
   ==================================================================== */
(function initSearchQuery() {
  if (!window.location.pathname.endsWith('/search/')) return;

  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (!q) return;

  // Pagefind UI is initialized asynchronously; poll until ready
  let attempts = 0;
  const tryFill = () => {
    attempts++;
    const input = document.querySelector('#search .pagefind-ui__search-input');
    if (input) {
      input.value = q;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }
    if (attempts < 20) setTimeout(tryFill, 150);
  };
  setTimeout(tryFill, 300);
})();
