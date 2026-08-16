import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';

const repoRoot = process.cwd();
const configPath = path.join(repoRoot, 'src/_data/site.json');
const baseTemplatePath = path.join(repoRoot, 'src/_includes/base.njk');
const siteJsPath = path.join(repoRoot, 'src/assets/js/site.js');
const originalConfigText = readFileSync(configPath, 'utf8');
const buildWarnings = [];
const failures = [];

// Use a backup file (in tmpdir) so we can restore on exit even if the process is killed.
const backupPath = path.join(tmpdir(), `logia-site-${process.pid}.json`);
writeFileSync(backupPath, originalConfigText, 'utf8');

// Restore on any exit — including SIGINT, SIGTERM, uncaughtException.
function restoreConfig(signal) {
  try {
    if (existsSync(backupPath)) {
      const backup = readFileSync(backupPath, 'utf8');
      writeFileSync(configPath, backup, 'utf8');
    }
  } catch (_) { /* no-op */ }
  if (signal) process.exit(1);
}
process.on('SIGINT', () => restoreConfig('SIGINT'));
process.on('SIGTERM', () => restoreConfig('SIGTERM'));
process.on('uncaughtException', (err) => { console.error(err); restoreConfig('uncaughtException'); });
process.on('beforeExit', restoreConfig);

// Cross-platform eleventy invocation: prefer npx --no-install (works on Windows + Unix).
function runEleventy(pathPrefix) {
  const args = ['--no-install', 'eleventy', `--pathprefix=${pathPrefix || '/'}`];
  execFileSync('npx', args, { cwd: repoRoot, stdio: 'pipe' });
}

const build = (config) => {
  rmSync(path.join(repoRoot, '_site'), { recursive: true, force: true });
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  runEleventy(config.pathPrefix);
};

const tryBuild = (config, label) => {
  try {
    build(config);
    return true;
  } catch (error) {
    const message = String(error.stderr || error.message || error).trim().split('\n').slice(0, 4).join(' | ');
    buildWarnings.push(`${label}: ${message}`);
    failures.push(`${label}: build failed`);
    return false;
  }
};

const walkHtmlFiles = (dir) => {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      results.push(...walkHtmlFiles(fullPath));
      continue;
    }
    if (fullPath.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
};

const assert = (condition, message) => {
  if (!condition) {
    failures.push(message);
    throw new Error(message);
  }
};

try {
  const baseTemplate = readFileSync(baseTemplatePath, 'utf8');
  const siteJs = readFileSync(siteJsPath, 'utf8');

  assert(siteJs.includes('window.__externalScriptRegistry'), 'site.js should keep a registry for deduplicating external scripts');
  assert(siteJs.includes('data-external-service'), 'site.js should mark injected external scripts for duplicate prevention');
  assert(siteJs.includes('loadAnalytics'), 'site.js should expose loadAnalytics');
  assert(siteJs.includes('loadClarity'), 'site.js should expose loadClarity');

  const originalConfig = JSON.parse(originalConfigText);
  const disabledConfig = structuredClone(originalConfig);
  disabledConfig.thirdParty.analytics.enabled = false;
  disabledConfig.thirdParty.clarity.enabled = false;
  disabledConfig.thirdParty.disqus.enabled = false;
  disabledConfig.thirdParty.translate.enabled = false;
  disabledConfig.fonts.loadExternal = false;
  disabledConfig.fonts.useSelfHosted = false;

  if (tryBuild(disabledConfig, 'disabled-config build')) {
    const disabledHtml = walkHtmlFiles(path.join(repoRoot, '_site')).map((file) => readFileSync(file, 'utf8')).join('\n');
    assert(!disabledHtml.includes('translateLauncher'), 'Translate launcher should disappear when translate is disabled');
    assert(!disabledHtml.includes('disqus_thread'), 'Disqus container should disappear when disqus is disabled');
    assert(!disabledHtml.includes('googletagmanager.com/gtag/js'), 'Analytics script should disappear when analytics is disabled');
    assert(!disabledHtml.includes('clarity.ms/tag/'), 'Clarity script should disappear when clarity is disabled');
    assert(!disabledHtml.includes('fonts.googleapis.com'), 'External font stylesheet should disappear when external fonts are disabled');
  }

  const enabledConfig = structuredClone(originalConfig);
  enabledConfig.thirdParty.analytics.enabled = true;
  enabledConfig.thirdParty.clarity.enabled = true;
  enabledConfig.thirdParty.disqus.enabled = true;
  enabledConfig.thirdParty.translate.enabled = true;
  enabledConfig.fonts.loadExternal = true;
  enabledConfig.fonts.useSelfHosted = false;

  if (tryBuild(enabledConfig, 'enabled-config build')) {
    const htmlFiles = walkHtmlFiles(path.join(repoRoot, '_site'));
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf8');
      const translateLaunchers = html.match(/id="translateLauncher"/g) || [];
      const analyticsScripts = html.match(/googletagmanager\.com\/gtag\/js/g) || [];
      const clarityScripts = html.match(/clarity\.ms\/tag\//g) || [];

      if (translateLaunchers.length > 1) failures.push(`${path.relative(repoRoot, file)} injects translate launcher more than once`);
      if (analyticsScripts.length > 1) failures.push(`${path.relative(repoRoot, file)} injects analytics script more than once`);
      if (clarityScripts.length > 1) failures.push(`${path.relative(repoRoot, file)} injects clarity script more than once`);
    }
  }

  if (failures.length) {
    console.error('Third-party loading controls verification failed:\n');
    for (const f of failures) console.error(`- ${f}`);
    process.exit(1);
  }

  if (buildWarnings.length) {
    console.warn('Static third-party QA passed, but build-backed checks were skipped due to environment limitations:');
    for (const warning of buildWarnings) {
      console.warn(`- ${warning}`);
    }
  } else {
    console.log('Third-party loading controls verified.');
  }
} finally {
  restoreConfig();
  // Rebuild with original config so _site is in a known-good state.
  tryBuild(JSON.parse(originalConfigText), 'restore original build');
  try { rmSync(backupPath, { force: true }); } catch (_) { /* no-op */ }
}
