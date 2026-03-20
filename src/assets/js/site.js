(() => {
  const htmlRoot = document.getElementById('htmlRoot');
  const themeToggle = document.getElementById('themeToggle');
  const readingToggle = document.getElementById('readingModeToggle');
  const runtimeConfig = window.siteRuntimeConfig || {};
  const thirdParty = runtimeConfig.thirdParty || {};
  const scriptRegistry = window.__externalScriptRegistry = window.__externalScriptRegistry || {};
  const consentStoragePrefix = 'site-consent:';

  function applyTheme(theme) {
    if (!htmlRoot) return;

    const isDark = theme === 'dark';
    if (isDark) {
      htmlRoot.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.textContent = '☀️';
    } else {
      htmlRoot.removeAttribute('data-theme');
      if (themeToggle) themeToggle.textContent = '🌙';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isDark));
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
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    nav.querySelectorAll('.nav-dropdown').forEach((dropdown, index) => {
      const dropLink = dropdown.querySelector('.dropbtn');
      const menu = dropdown.querySelector('.dropdown-content');
      if (!dropLink || !menu) return;

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

  function initReadingMode() {
    const storedReadingMode = localStorage.getItem('readingMode') === 'true';
    if (storedReadingMode) {
      document.body.classList.add('reading-mode');
    }

    if (readingToggle) {
      readingToggle.setAttribute('aria-pressed', String(storedReadingMode));
      readingToggle.addEventListener('click', () => {
        document.body.classList.toggle('reading-mode');
        const isReading = document.body.classList.contains('reading-mode');
        localStorage.setItem('readingMode', isReading);
        readingToggle.setAttribute('aria-pressed', String(isReading));
      });
    }
  }

  function hasConsent(serviceKey) {
    return localStorage.getItem(`${consentStoragePrefix}${serviceKey}`) === 'granted';
  }

  function setConsent(serviceKey, value) {
    localStorage.setItem(`${consentStoragePrefix}${serviceKey}`, value ? 'granted' : 'denied');
  }

  function whenBrowserIdle(callback) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback, { timeout: 2500 });
      return;
    }

    window.setTimeout(callback, 1200);
  }

  function runOnFirstInteraction(callback) {
    let fired = false;
    const handler = () => {
      if (fired) return;
      fired = true;
      ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
        window.removeEventListener(eventName, handler, passiveOnce);
      });
      callback();
    };
    const passiveOnce = { passive: true, once: true };

    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach((eventName) => {
      window.addEventListener(eventName, handler, passiveOnce);
    });
  }

  function scheduleDeferredLoad(callback, { triggeredByUserAction = false } = {}) {
    if (triggeredByUserAction) {
      whenBrowserIdle(callback);
      return;
    }

    runOnFirstInteraction(() => whenBrowserIdle(callback));
  }

  function loadExternalScript(serviceKey, src, { async = true } = {}) {
    if (!src) {
      return Promise.reject(new Error(`Missing src for ${serviceKey}`));
    }

    if (scriptRegistry[serviceKey]) {
      return scriptRegistry[serviceKey];
    }

    const existingScript = document.querySelector(`script[data-external-service="${serviceKey}"]`);
    if (existingScript) {
      scriptRegistry[serviceKey] = Promise.resolve(existingScript);
      return scriptRegistry[serviceKey];
    }

    scriptRegistry[serviceKey] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = async;
      script.dataset.externalService = serviceKey;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Failed to load ${serviceKey}`));
      document.head.appendChild(script);
    });

    return scriptRegistry[serviceKey];
  }

  function enableAnalytics({ triggeredByUserAction = false } = {}) {
    const analytics = thirdParty.analytics || {};
    if (!analytics.enabled || !analytics.measurementId) return;
    if (analytics.requiresConsent && !hasConsent('analytics')) return;

    scheduleDeferredLoad(() => {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', analytics.measurementId, { anonymize_ip: true });

      loadExternalScript(
        'google-analytics',
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.measurementId)}`
      ).catch((error) => {
        console.warn(error);
      });
    }, { triggeredByUserAction });
  }

  function enableClarity({ triggeredByUserAction = false } = {}) {
    const clarity = thirdParty.clarity || {};
    if (!clarity.enabled || !clarity.projectId) return;
    if (clarity.requiresConsent && !hasConsent('clarity')) return;

    scheduleDeferredLoad(() => {
      if (window.clarity) return;

      window.clarity = window.clarity || function clarityProxy() {
        (window.clarity.q = window.clarity.q || []).push(arguments);
      };

      loadExternalScript(
        'microsoft-clarity',
        `https://www.clarity.ms/tag/${encodeURIComponent(clarity.projectId)}`
      ).catch((error) => {
        console.warn(error);
      });
    }, { triggeredByUserAction });
  }

  function initConsentControls() {
    document.querySelectorAll('[data-consent-service]').forEach((button) => {
      const serviceKey = button.getAttribute('data-consent-service');
      if (!serviceKey) return;

      if (hasConsent(serviceKey)) {
        button.disabled = true;
        button.textContent = 'מאופשר';
      }

      button.addEventListener('click', () => {
        setConsent(serviceKey, true);
        button.disabled = true;
        button.textContent = 'מאופשר';

        if (serviceKey === 'analytics') enableAnalytics({ triggeredByUserAction: true });
        if (serviceKey === 'clarity') enableClarity({ triggeredByUserAction: true });
      });
    });
  }

  function initGoogleTranslate() {
    const translate = thirdParty.translate || {};
    const translateLauncher = document.getElementById('translateLauncher');
    const translateContainer = document.getElementById('google_translate_element');

    if (!translate.enabled || !translateLauncher || !translateContainer) return;

    translateLauncher.addEventListener('click', () => {
      translateLauncher.disabled = true;
      translateLauncher.textContent = 'טוען תרגום...';

      loadExternalScript(
        'google-translate',
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      )
        .then(() => {
          translateContainer.hidden = false;
          translateLauncher.textContent = 'תרגום פעיל';
        })
        .catch((error) => {
          console.warn(error);
          translateLauncher.disabled = false;
          translateLauncher.textContent = 'נסה שוב לטעון תרגום';
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

  initTheme();
  initReadingMode();
  initMobileNavigation();
  initTocDropdowns();
  initConsentControls();
  initGoogleTranslate();
  enableAnalytics();
  enableClarity();
})();

window.googleTranslateElementInit = function googleTranslateElementInit() {
  const translate = (window.siteRuntimeConfig && window.siteRuntimeConfig.thirdParty && window.siteRuntimeConfig.thirdParty.translate) || {};
  if (!window.google || !google.translate) return;

  new google.translate.TranslateElement({
    pageLanguage: 'he',
    includedLanguages: translate.includedLanguages || 'en,fr,de,es,ru,ar,it',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};
