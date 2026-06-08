(function () {
  const root = document.querySelector('[data-manuscript-lab]');
  if (!root) return;

  const fileInput = root.querySelector('#manuscriptFiles');
  const fileSummary = root.querySelector('#fileSummary');
  const scriptProfile = root.querySelector('#scriptProfile');
  const transcriptionMode = root.querySelector('#transcriptionMode');
  const engineProfile = root.querySelector('#engineProfile');
  const draftTranscript = root.querySelector('#draftTranscript');
  const agentReport = root.querySelector('#agentReport');
  const runPlan = root.querySelector('#runPlan');
  const analyzeButton = root.querySelector('#analyzeTranscript');
  const exportTxtButton = root.querySelector('#exportTxt');
  const exportJsonButton = root.querySelector('#exportJson');

  const profileLabels = {
    'hebrew-rtl': 'עברית / ארמית בכתב עברי',
    'arabic-rtl': 'ערבית',
    'syriac-rtl': 'סורית',
    'garshuni-rtl': 'גרשוני',
    'latin-ltr': 'לטינית',
    'greek-ltr': 'יוונית',
    mixed: 'מעורב / לא ידוע'
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0KB';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)}${units[unitIndex]}`;
  };

  const selectedFiles = () => Array.from(fileInput.files || []);

  const updateFileSummary = () => {
    const files = selectedFiles();
    if (!files.length) {
      fileSummary.textContent = 'טרם נבחרו קבצים.';
      updateRunPlan();
      return;
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const names = files.slice(0, 3).map((file) => file.name).join(' · ');
    const suffix = files.length > 3 ? ` ועוד ${files.length - 3}` : '';
    fileSummary.textContent = `${files.length} קבצים נבחרו (${formatBytes(totalSize)}): ${names}${suffix}`;
    updateRunPlan();
  };

  const hasRtlProfile = () => ['hebrew-rtl', 'arabic-rtl', 'syriac-rtl', 'garshuni-rtl'].includes(scriptProfile.value);

  const getWarnings = (lines) => {
    const warnings = [];
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const markers = ['?', '�', '[', ']', '…', '...', '___'];
      const hasMarker = markers.some((marker) => trimmed.includes(marker));
      const shortLine = trimmed.length < 8;
      const hasLatinInRtl = hasRtlProfile() && /[A-Za-z]{3,}/.test(trimmed);
      if (hasMarker || shortLine || hasLatinInRtl) {
        warnings.push({
          line: index + 1,
          text: trimmed,
          reason: hasMarker ? 'סימני אי־ודאות/חסר' : shortLine ? 'שורה קצרה במיוחד' : 'אותיות לטיניות בתוך פרופיל RTL'
        });
      }
    });
    return warnings;
  };

  const updateRunPlan = () => {
    const files = selectedFiles();
    const profile = profileLabels[scriptProfile.value] || 'לא ידוע';
    const engine = engineProfile.options[engineProfile.selectedIndex].text;
    const mode = transcriptionMode.options[transcriptionMode.selectedIndex].text;
    const fileStep = files.length ? `הכן ${files.length} קבצים לעיבוד ושמור metadata.` : 'בחר PDF או תמונות עמודים.';

    runPlan.innerHTML = '';
    [
      fileStep,
      `הפעל פרופיל ${profile} במצב ${mode}.`,
      `שלח לעיבוד ראשוני דרך ${engine}.`,
      'סמן שורות עם confidence נמוך, סימני חסר או ערבוב כתבים.',
      'אשר תיקונים אנושית ושמור אותם כ־Ground Truth לכתב היד.'
    ].forEach((step) => {
      const item = document.createElement('li');
      item.textContent = step;
      runPlan.appendChild(item);
    });
  };

  const renderReport = () => {
    const lines = draftTranscript.value.split(/\r?\n/);
    const nonEmptyLines = lines.filter((line) => line.trim()).length;
    const warnings = getWarnings(lines);
    const files = selectedFiles();
    const confidence = nonEmptyLines ? Math.max(35, 95 - warnings.length * 9) : 0;

    if (!nonEmptyLines && !files.length) {
      agentReport.className = 'lab-report-empty';
      agentReport.textContent = 'כדי להפיק דוח, בחר קובץ או הדבק תעתיק ראשוני.';
      return;
    }

    agentReport.className = 'lab-report';
    const warningItems = warnings.length
      ? warnings.slice(0, 8).map((warning) => `<li><strong>שורה ${warning.line}:</strong> ${warning.reason}<br><span>${escapeHtml(warning.text)}</span></li>`).join('')
      : '<li>לא זוהו סימני אי־ודאות בולטים בתעתיק שהוזן.</li>';

    agentReport.innerHTML = `
      <dl class="lab-metrics">
        <div><dt>שורות תעתיק</dt><dd>${nonEmptyLines}</dd></div>
        <div><dt>קבצים</dt><dd>${files.length}</dd></div>
        <div><dt>מדד אמון ניסיוני</dt><dd>${confidence}%</dd></div>
      </dl>
      <p><strong>המלצת סוכן:</strong> ${warnings.length ? 'להתחיל בבדיקת השורות המסומנות לפני ייצוא סופי.' : 'אפשר להתקדם לעריכה אנושית וייצוא ראשוני.'}</p>
      <ul class="lab-warning-list">${warningItems}</ul>
    `;
  };

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const download = (filename, content, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportPayload = () => ({
    createdAt: new Date().toISOString(),
    scriptProfile: scriptProfile.value,
    transcriptionMode: transcriptionMode.value,
    engineProfile: engineProfile.value,
    files: selectedFiles().map((file) => ({ name: file.name, size: file.size, type: file.type || 'unknown' })),
    transcript: draftTranscript.value,
    review: getWarnings(draftTranscript.value.split(/\r?\n/))
  });

  fileInput.addEventListener('change', updateFileSummary);
  [scriptProfile, transcriptionMode, engineProfile].forEach((control) => control.addEventListener('change', updateRunPlan));
  analyzeButton.addEventListener('click', renderReport);
  exportTxtButton.addEventListener('click', () => download('manuscript-transcript.txt', draftTranscript.value || '', 'text/plain;charset=utf-8'));
  exportJsonButton.addEventListener('click', () => download('manuscript-transcript.json', JSON.stringify(exportPayload(), null, 2), 'application/json;charset=utf-8'));

  updateRunPlan();
}());
