(() => {
  const htmlRoot = document.getElementById('htmlRoot');
  const themeToggle = document.getElementById('themeToggle');
  const readingToggle = document.getElementById('readingModeToggle');

  function applyTheme(theme) {
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

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  initTheme();
  initReadingMode();
})();

window.googleTranslateElementInit = function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'he',
    includedLanguages: 'en,fr,de,es,ru,ar,it',
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
};
