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
      // Icon visibility is handled purely via CSS (html[data-theme="dark"] selectors)
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

// ============================================================
  // תצוגה מקבילית של נוסחים — טוען את הקטע המקביל בצד (לפי טבלת התאמה)
  // + טוגל "הדגש הבדלים" עם diff מילולי (LCS) ונרמול ניקוד
  // ============================================================

  // --- Hebrew normalization: strip niqqud/diacritics for comparison ---
  function normalizeHebrew(text) {
    if (!text) return '';
    // Remove Hebrew diacritics (U+0591–U+05BD, U+05BF, U+05C1–U+05C5, U+05C7)
    // Keep: letters (U+05D0–U+05EA), punctuation (U+05F0–U+05F4), maqaf (U+05BE)
    return text.replace(/[\u0591-\u05BD\u05BF\u05C1-\u05C5\u05C7]/g, '');
  }

  // --- Word-level LCS diff ---
  // Returns array of {text, type} where type is 'common' | 'add' | 'remove'
  function diffWords(textA, textB) {
    const normA = normalizeHebrew(textA);
    const normB = normalizeHebrew(textB);
    // Split into words, keeping original text for display
    const wordsAorig = (textA || '').match(/\S+/g) || [];
    const wordsBorig = (textB || '').match(/\S+/g) || [];
    const wordsAnorm = (normA || '').match(/\S+/g) || [];
    const wordsBnorm = (normB || '').match(/\S+/g) || [];

    const n = wordsAnorm.length;
    const m = wordsBnorm.length;

    // Build LCS table
    // dp[i][j] = length of LCS of wordsAnorm[i..] and wordsBnorm[j..]
    const dp = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        if (wordsAnorm[i] === wordsBnorm[j]) {
          dp[i][j] = dp[i+1][j+1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i+1][j], dp[i][j+1]);
        }
      }
    }

    // Backtrack to produce diff
    const result = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (wordsAnorm[i] === wordsBnorm[j]) {
        result.push({text: wordsAorig[i], type: 'common'});
        i++; j++;
      } else if (dp[i+1][j] >= dp[i][j+1]) {
        result.push({text: wordsAorig[i], type: 'remove'});
        i++;
      } else {
        result.push({text: wordsBorig[j], type: 'add'});
        j++;
      }
    }
    while (i < n) {
      result.push({text: wordsAorig[i], type: 'remove'});
      i++;
    }
    while (j < m) {
      result.push({text: wordsBorig[j], type: 'add'});
      j++;
    }
    return result;
  }

  // --- Render diff into a DOM element ---
  function renderDiff(container, textA, textB, side) {
    // side = 'left' (current page) or 'right' (parallel page)
    // For 'left': show 'remove' words in red, 'add' words faded/hidden
    // For 'right': show 'add' words in green, 'remove' words faded/hidden
    const diff = diffWords(textA, textB);
    container.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (const item of diff) {
      const span = document.createElement('span');
      span.textContent = item.text + ' ';
      if (side === 'left') {
        if (item.type === 'remove') {
          span.className = 'diff-remove';
        } else if (item.type === 'add') {
          // On the left side, additions from right are not shown (they belong to the other column)
          // But we keep them faded so the reader sees where text was added
          span.className = 'diff-add-faded';
        } else {
          span.className = 'diff-common';
        }
      } else { // right
        if (item.type === 'add') {
          span.className = 'diff-add';
        } else if (item.type === 'remove') {
          span.className = 'diff-remove-faded';
        } else {
          span.className = 'diff-common';
        }
      }
      frag.appendChild(span);
    }
    container.appendChild(frag);
  }

  // --- Extract plain text from a DOM element (for diffing) ---
  function extractText(el) {
    if (!el) return '';
    // Clone to avoid modifying original
    const clone = el.cloneNode(true);
    // Remove script, style, controls
    clone.querySelectorAll('script, style, .text-controls, .parallel-controls, .version-parallel-controls, .version-parallel-panel, .reading-progress, .footnotes').forEach(e => e.remove());
    return clone.textContent || '';
  }

  function initVersionParallel() {
    const toggle = document.querySelector('[data-version-parallel="off"]');
    const select = document.querySelector('[data-version-parallel-select]');
    const panel = document.querySelector('[data-version-parallel-panel]');
    const diffToggle = document.querySelector('[data-version-diff="off"]');
    const sectionLabel = document.querySelector('[data-version-parallel-section]');
    if (!toggle || !select || !panel) return;

    const body = document.querySelector('[data-version-parallel-body]');
    const titleEl = document.querySelector('[data-version-parallel-title]');
    const loadingEl = document.querySelector('[data-version-parallel-loading]');
    const closeBtn = document.querySelector('[data-version-parallel-close]');
    const footerEl = document.querySelector('[data-version-parallel-footer]');
    const statsEl = document.querySelector('[data-version-parallel-stats]');
    const noteEl = document.querySelector('[data-version-parallel-note]');
    const article = document.querySelector('article.text-main');
    if (!article || !body || !titleEl) return;

    const STORAGE_KEY = 'versionParallelEnabled';
    const STORAGE_VERSION_KEY = 'versionParallelTarget';
    const STORAGE_DIFF_KEY = 'versionDiffEnabled';

    // Extract book, source, current version, page number from the page URL
    const urlMatch = window.location.pathname.match(/\/texts\/([^/]+)\/([^/]+)\/([^/]+)\/page-(\d+)\//);
    if (!urlMatch) return;
    const [, source, book, currentVersion, pageNum] = urlMatch;

    // Load alignment data (embedded as <script type="application/json" data-alignment="...">)
    let alignment = null;
    const alignmentScript = document.querySelector('script[data-alignment="' + book + '"]');
    if (alignmentScript) {
      try {
        alignment = JSON.parse(alignmentScript.textContent);
      } catch (e) {
        // ignore parse errors
      }
    }

    // Find which section the current page belongs to
    function findCurrentSection(ver, pgNum) {
      if (!alignment || !alignment.sections) return null;
      const n = parseInt(pgNum, 10);
      for (const [sectionKey, section] of Object.entries(alignment.sections)) {
        if (section[ver] === n) {
          return {key: sectionKey, section: section};
        }
      }
      return null;
    }

    // Returns ALL logical sections mapped to this page (a page may contain several).
    function findCurrentSections(ver, pgNum) {
      if (!alignment || !alignment.sections) return null;
      const n = parseInt(pgNum, 10);
      const out = [];
      for (const [sectionKey, section] of Object.entries(alignment.sections)) {
        if (section[ver] === n) {
          out.push({key: sectionKey, section: section});
        } else {
          const spans = section[ver + '_spans'];
          if (spans && spans.some(sp => sp.page === n)) {
            out.push({key: sectionKey, section: section});
          }
        }
      }
      return out.length ? out : null;
    }

    // Restore saved state
    const savedEnabled = safeStorage.get(STORAGE_KEY) === 'true';
    const savedTarget = safeStorage.get(STORAGE_VERSION_KEY);
    if (savedTarget && select.querySelector('option[value="' + savedTarget + '"]')) {
      select.value = savedTarget;
    }
    const savedDiff = safeStorage.get(STORAGE_DIFF_KEY) === 'true';

    function setLoading(isLoading) {
      if (loadingEl) loadingEl.style.display = isLoading ? '' : 'none';
    }

    // Update the section label (shows which logical section we're viewing)
    function updateSectionLabel() {
      const currents = findCurrentSections(currentVersion, pageNum);
      if (sectionLabel) {
        if (currents && currents.length) {
          const names = currents.map(c => c.section.title);
          sectionLabel.textContent = 'קטע' + (names.length > 1 ? 'ים' : '') + ': ' + names.join(' · ');
          sectionLabel.hidden = false;
        } else {
          sectionLabel.hidden = true;
        }
      }
    }
    updateSectionLabel();

    function applyState(enabled) {
      if (enabled) {
        article.classList.add('text-main--with-parallel');
        panel.hidden = false;
        toggle.setAttribute('aria-pressed', 'true');
        toggle.querySelector('span').textContent = 'מופעלת';
        loadParallelContent();
      } else {
        article.classList.remove('text-main--with-parallel');
        panel.hidden = true;
        toggle.setAttribute('aria-pressed', 'false');
        toggle.querySelector('span').textContent = 'כבויה';
        // Also turn off diff when parallel is off
        if (diffToggle && diffToggle.getAttribute('aria-pressed') === 'true') {
          applyDiffState(false);
        }
      }
      safeStorage.set(STORAGE_KEY, String(enabled));
    }

    function applyDiffState(enabled) {
      if (diffToggle) {
        diffToggle.setAttribute('aria-pressed', String(enabled));
        diffToggle.querySelector('span').textContent = enabled ? 'הדגש הבדלים פעיל' : 'הדגש הבדלים';
      }
      if (enabled) {
        article.classList.add('diff-active');
        // Re-render with diff highlighting
        renderParallelWithDiff();
      } else {
        article.classList.remove('diff-active');
        // Restore normal content
        restoreNormalContent();
      }
      safeStorage.set(STORAGE_DIFF_KEY, String(enabled));
    }

    function restoreNormalContent() {
      // The parallel panel content was modified by diff; reload it normally
      if (toggle.getAttribute('aria-pressed') === 'true') {
        loadParallelContent();
      }
    }

    function renderParallelWithDiff() {
      // Get the current page's text content
      const localContent = document.querySelector('article.text-main .text-content');
      if (!localContent) return;
      const textA = extractText(localContent);
      const textB = extractText(body);
      if (!textA || !textB) return;

      // Render diff on both sides
      const localDiffContainer = document.createElement('div');
      localDiffContainer.className = 'diff-rendered diff-rendered--left';
      localContent.parentNode.insertBefore(localDiffContainer, localContent);
      localContent.style.display = 'none';
      renderDiff(localDiffContainer, textA, textB, 'left');

      // Replace panel body with diff version
      const panelDiffContainer = document.createElement('div');
      panelDiffContainer.className = 'diff-rendered diff-rendered--right';
      body.style.display = 'none';
      body.parentNode.insertBefore(panelDiffContainer, body);
      renderDiff(panelDiffContainer, textA, textB, 'right');
    }

    function updateStatsAndNote() {
      // Calculate word-level diff statistics
      const localContent = document.querySelector('article.text-main .text-content');
      if (!localContent || !body) {
        if (footerEl) footerEl.hidden = true;
        return;
      }

      // Hide footer if section is missing
      const current = findCurrentSection(currentVersion, pageNum);
      if (!current) {
        if (footerEl) footerEl.hidden = true;
        return;
      }

      const targetVersion = select.value;
      const targetPage = current.section[targetVersion];
      if (targetPage === null || targetPage === undefined) {
        if (footerEl) footerEl.hidden = true;
        return;
      }

      const textA = extractText(localContent);
      const textB = extractText(body);
      if (!textA || !textB) {
        if (footerEl) footerEl.hidden = true;
        return;
      }

      // Count differences
      const diff = diffWords(textA, textB);
      let removeCount = 0;
      let addCount = 0;
      let commonCount = 0;
      for (const item of diff) {
        if (item.type === 'remove') removeCount++;
        else if (item.type === 'add') addCount++;
        else commonCount++;
      }
      const totalA = commonCount + removeCount;
      const totalB = commonCount + addCount;
      const pctDiff = totalA > 0 ? Math.round(((removeCount + addCount) / (totalA + totalB)) * 100) : 0;

      // Display stats
      if (statsEl) {
        statsEl.innerHTML = `<span class="version-parallel-stats__label">הבדלים בקטע זה:</span> `
          + `<span class="version-parallel-stats__num version-parallel-stats__num--remove">${removeCount} מילים ייחודיות לנוסח ${currentVersion.toUpperCase()}'</span>`
          + `<span class="version-parallel-stats__sep">·</span>`
          + `<span class="version-parallel-stats__num version-parallel-stats__num--add">${addCount} מילים ייחודיות לנוסח ${targetVersion.toUpperCase()}'</span>`
          + `<span class="version-parallel-stats__sep">·</span>`
          + `<span class="version-parallel-stats__pct">${pctDiff}% שונים</span>`;
      }

      // Display comparison note
      if (noteEl) {
        const note = current.section.comparison_note || '';
        if (note) {
          noteEl.innerHTML = '<span class="version-parallel-note__label">הערת השוואה:</span> ' + note;
          noteEl.hidden = false;
        } else {
          noteEl.hidden = true;
        }
      }

      if (footerEl) footerEl.hidden = false;
    }

        function loadParallelContent() {
      const targetVersion = select.value;
      if (!targetVersion) return;

      // Use alignment table to find ALL parallel sections for this page.
      // Each section now carries exact sentence spans (*_spans) per version,
      // so we can slice the fetched page by sentence range instead of
      // showing the whole page.
      const currents = findCurrentSections(currentVersion, pageNum);
      let targetSpans = null;   // [{page, from, to, sectionTitle, sectionKey}]
      let sectionTitle = '';
      let sectionNote = '';

      if (currents && alignment) {
        const titles = [];
        const notes = [];
        const missing = [];
        const spansAll = [];
        currents.forEach(c => {
          const spans = c.section[targetVersion + '_spans'];
          titles.push(c.section.title);
          if (c.section.note) notes.push(c.section.note);
          if (!spans || !spans.length) {
            missing.push(c.section.title);
          } else {
            spans.forEach(sp => {
              spansAll.push({
                page: sp.page,
                from: sp.from,
                to: sp.to,
                sectionTitle: c.section.title,
                sectionKey: c.key
              });
            });
          }
        });
        sectionTitle = titles.join(' · ');
        sectionNote = notes.join(' ');
        if (!spansAll.length) {
          // All mapped sections are missing in the target version
          titleEl.textContent = `נוסח ${targetVersion.toUpperCase()}' — ${sectionTitle}`;
          body.innerHTML = `<div class="version-parallel-missing">
            <p><strong>קטע זה חסר בנוסח ${targetVersion.toUpperCase()}'.</strong></p>
            <p class="version-parallel-missing__note">${sectionNote}</p>
          </div>`;
          setLoading(false);
          return;
        }
        targetSpans = spansAll;
      }

      // Collect unique target pages from spans (or fall back to same page)
      let pages;
      if (targetSpans) {
        pages = [...new Set(targetSpans.map(s => s.page))].sort((a, b) => a - b);
      } else {
        pages = [parseInt(pageNum, 10)];
      }
      const minPage = Math.min(...pages);
      const maxPage = Math.max(...pages);
      const rangeLabel = minPage === maxPage
        ? `פרק ${minPage}`
        : `פרקים ${minPage}–${maxPage}`;
      const label = sectionTitle
        ? `${sectionTitle} — נוסח ${targetVersion.toUpperCase()}' (${rangeLabel})`
        : `נוסח ${targetVersion.toUpperCase()}' — ${rangeLabel}`;
      titleEl.textContent = label;
      setLoading(true);
      body.innerHTML = '';

      // Clean up any previous diff rendering
      document.querySelectorAll('.diff-rendered').forEach(el => el.remove());
      const localContent = document.querySelector('article.text-main .text-content');
      if (localContent) localContent.style.display = '';

      const urls = pages.map(p => `/Source/texts/${source}/${book}/${targetVersion}/page-${p}/`);

      Promise.all(urls.map(u => fetch(u).then(r => (r.ok ? r.text() : null))))
        .then(htmls => {
          const parser = new DOMParser();
          const fragment = document.createDocumentFragment();
          let any = false;
          // Collect slices per page first, then group across pages by section.
          const pageSlices = []; // {pageNo, sents|null, remoteArticle|null}
          htmls.forEach((html, idx) => {
            if (!html) return;
            const doc = parser.parseFromString(html, 'text/html');
            const remoteArticle = doc.querySelector('article.text-main .text-content') || doc.querySelector('article.text-main');
            if (!remoteArticle) return;
            remoteArticle.querySelectorAll('.text-controls, .parallel-controls, .version-parallel-controls, .version-parallel-panel, .footnotes, .reading-progress, script').forEach(el => el.remove());
            const pageNo = pages[idx];
            const spansForPage = targetSpans ? targetSpans.filter(s => s.page === pageNo) : [];
            const hasExactSpans = spansForPage.length > 0 &&
              spansForPage.every(s => s.from !== null && s.to !== null && s.to >= s.from);
            let sents = null;
            if (hasExactSpans) {
              const raw = remoteArticle.textContent.replace(/\n{2,}/g, '\n').trim();
              sents = raw.split(/(?<=[\.\?\!\"\u05C3])\s+/).map(s => s.trim()).filter(s => s && s !== '---');
            }
            pageSlices.push({ pageNo, sents, remoteArticle, spansForPage, hasExactSpans });
            any = true;
          });

          if (any) {
            // Build output. Sections that have exact spans are grouped across
            // pages (one title per section); pages without spans fall back to
            // showing the whole page.
            const sectionGroups = new Map(); // sectionKey -> {title, spans:[], order}
            const fallbackPages = [];
            let order = 0;
            pageSlices.forEach(slice => {
              if (slice.hasExactSpans) {
                slice.spansForPage.forEach(sp => {
                  if (!sectionGroups.has(sp.sectionKey)) {
                    sectionGroups.set(sp.sectionKey, { title: sp.sectionTitle, spans: [], order: order++ });
                  }
                  sectionGroups.get(sp.sectionKey).spans.push({ span: sp, sents: slice.sents });
                });
              } else {
                fallbackPages.push(slice.remoteArticle);
              }
            });

            const sortedGroups = [...sectionGroups.values()].sort((a, b) => a.order - b.order);
            let emittedAny = false;
            sortedGroups.forEach(group => {
              const wrap = document.createElement('div');
              wrap.className = 'version-parallel-section';
              const head = document.createElement('h4');
              head.className = 'version-parallel-section__title';
              head.textContent = group.title;
              wrap.appendChild(head);
              group.spans.forEach(({ span, sents }) => {
                if (span.from < sents.length) {
                  for (let i = span.from; i <= span.to && i < sents.length; i++) {
                    const p = document.createElement('p');
                    p.textContent = sents[i];
                    wrap.appendChild(p);
                  }
                }
              });
              fragment.appendChild(wrap);
              emittedAny = true;
            });

            fallbackPages.forEach((el, i) => {
              if (emittedAny || i > 0) {
                const sep = document.createElement('hr');
                sep.className = 'version-parallel-sep';
                fragment.appendChild(sep);
              }
              fragment.appendChild(el);
              emittedAny = true;
            });

            body.innerHTML = '';
            body.appendChild(fragment);
            body.style.display = '';
          } else {
            body.innerHTML = '<p>לא נמצא תוכן מקביל בנוסח זה.</p>';
          }
          setLoading(false);

          // Update stats and comparison note
          updateStatsAndNote();

          // If diff was previously enabled, re-apply
          if (diffToggle && diffToggle.getAttribute('aria-pressed') === 'true') {
            renderParallelWithDiff();
          }
        })
        .catch(err => {
          body.innerHTML = `<p>שגיאה בטעינת התוכן המקביל: ${err.message}.<br>ייתכן שאין פרק מקביל בנוסח זה.</p>`;
          setLoading(false);
        });
    }
    toggle.addEventListener('click', () => {
      const isEnabled = toggle.getAttribute('aria-pressed') === 'true';
      applyState(!isEnabled);
    });

    select.addEventListener('change', () => {
      safeStorage.set(STORAGE_VERSION_KEY, select.value);
      if (toggle.getAttribute('aria-pressed') === 'true') {
        loadParallelContent();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => applyState(false));
    }

    if (diffToggle) {
      diffToggle.addEventListener('click', () => {
        // Diff can only be enabled if parallel is on
        if (toggle.getAttribute('aria-pressed') !== 'true') {
          // Auto-enable parallel first
          applyState(true);
          // Wait for content to load, then enable diff
          setTimeout(() => applyDiffState(true), 500);
        } else {
          const isDiffOn = diffToggle.getAttribute('aria-pressed') === 'true';
          applyDiffState(!isDiffOn);
        }
      });
    }

    // Auto-enable if previously enabled
    if (savedEnabled) {
      applyState(true);
      if (savedDiff && diffToggle) {
        setTimeout(() => applyDiffState(true), 600);
      }
    }
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
    initVersionParallel();
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
