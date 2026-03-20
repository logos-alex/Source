(() => {
  const htmlRoot = document.getElementById('htmlRoot');
  const themeToggle = document.getElementById('themeToggle');
  const readingToggle = document.getElementById('readingModeToggle');

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
})();

window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (!window.google || !google.translate) return;

  new google.translate.TranslateElement({
    pageLanguage: 'he',
    includedLanguages: 'en,fr,de,es,ru,ar,it',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};
