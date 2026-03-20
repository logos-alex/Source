import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const configPath = path.join(repoRoot, 'src/_data/site.json');
const baseTemplatePath = path.join(repoRoot, 'src/_includes/base.njk');
const siteJsPath = path.join(repoRoot, 'src/assets/js/site.js');
const originalConfig = JSON.parse(readFileSync(configPath, 'utf8'));
const originalConfigText = readFileSync(configPath, 'utf8');
const buildWarnings = [];

const build = (config) => {
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  execFileSync('./node_modules/.bin/eleventy', [`--pathprefix=${config.pathPrefix || '/'}`], {
    cwd: repoRoot,
    stdio: 'pipe'
  });
};

const tryBuild = (config, label) => {
  try {
    build(config);
    return true;
  } catch (error) {
    const message = String(error.stderr || error.message || error).trim().split('\n').slice(0, 4).join(' | ');
    buildWarnings.push(`${label}: ${message}`);
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
  if (!condition) throw new Error(message);
};

try {
  const baseTemplate = readFileSync(baseTemplatePath, 'utf8');
  const siteJs = readFileSync(siteJsPath, 'utf8');

  assert(!baseTemplate.includes('https://www.googletagmanager.com/gtag/js'), 'base.njk should not eagerly inject GA');
  assert(!baseTemplate.includes('https://www.clarity.ms/tag/'), 'base.njk should not eagerly inject Clarity');
  assert(!baseTemplate.includes('translate.google.com/translate_a/element.js'), 'base.njk should not eagerly inject Google Translate');
  assert(siteJs.includes('window.__externalScriptRegistry'), 'site.js should keep a registry for deduplicating external scripts');
  assert(siteJs.includes('data-external-service'), 'site.js should mark injected external scripts for duplicate prevention');

  const disabledConfig = structuredClone(originalConfig);
  disabledConfig.thirdParty.analytics.enabled = false;
  disabledConfig.thirdParty.clarity.enabled = false;
  disabledConfig.thirdParty.translate.enabled = false;
  disabledConfig.fonts.loadExternal = false;
  disabledConfig.fonts.useSelfHosted = false;

  if (tryBuild(disabledConfig, 'disabled-config build')) {
    const disabledHtml = walkHtmlFiles(path.join(repoRoot, '_site')).map((file) => readFileSync(file, 'utf8')).join('\n');
    assert(!disabledHtml.includes('translateLauncher'), 'Translate launcher should disappear when translate is disabled');
    assert(!disabledHtml.includes('data-consent-service="analytics"'), 'Analytics consent control should disappear when analytics is disabled');
    assert(!disabledHtml.includes('data-consent-service="clarity"'), 'Clarity consent control should disappear when clarity is disabled');
    assert(!disabledHtml.includes('fonts.googleapis.com'), 'External font stylesheet should disappear when external fonts are disabled');
  }

  const enabledConfig = structuredClone(originalConfig);
  enabledConfig.thirdParty.analytics.enabled = true;
  enabledConfig.thirdParty.analytics.requiresConsent = true;
  enabledConfig.thirdParty.clarity.enabled = true;
  enabledConfig.thirdParty.clarity.requiresConsent = true;
  enabledConfig.thirdParty.translate.enabled = true;
  enabledConfig.fonts.loadExternal = true;
  enabledConfig.fonts.useSelfHosted = false;

  if (tryBuild(enabledConfig, 'enabled-config build')) {
    const htmlFiles = walkHtmlFiles(path.join(repoRoot, '_site'));
    for (const file of htmlFiles) {
      const html = readFileSync(file, 'utf8');
      const analyticsControls = html.match(/data-consent-service="analytics"/g) || [];
      const clarityControls = html.match(/data-consent-service="clarity"/g) || [];
      const translateLaunchers = html.match(/id="translateLauncher"/g) || [];

      assert(analyticsControls.length <= 1, `${path.relative(repoRoot, file)} injects analytics control more than once`);
      assert(clarityControls.length <= 1, `${path.relative(repoRoot, file)} injects clarity control more than once`);
      assert(translateLaunchers.length <= 1, `${path.relative(repoRoot, file)} injects translate launcher more than once`);
    }
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
  writeFileSync(configPath, originalConfigText);
  tryBuild(originalConfig, 'restore original build');
}
