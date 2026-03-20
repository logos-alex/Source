import fs from 'node:fs';

const updates = JSON.parse(fs.readFileSync('src/_data/updates.json', 'utf8'));
const site = JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8'));

const sitePrefix = normalizePrefix(site.pathPrefix || '/');

function normalizePrefix(prefix) {
  if (!prefix || prefix === '/') {
    return '';
  }

  return prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
}

function withSitePrefix(pathname) {
  return `${sitePrefix}${pathname}`;
}

function readBuiltFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing built file: ${file}`);
  }

  return fs.readFileSync(file, 'utf8');
}

function expectIncludes(html, marker, description, file, failures) {
  if (!html.includes(marker)) {
    console.error(`❌ Missing ${description} in ${file}: ${marker}`);
    failures.count += 1;
  }
}

function expectMatch(html, pattern, description, file, failures) {
  if (!pattern.test(html)) {
    console.error(`❌ Missing ${description} in ${file}: ${pattern}`);
    failures.count += 1;
  }
}

function expectMinimumCount(html, pattern, minimum, description, file, failures) {
  const matches = html.match(pattern) || [];
  if (matches.length < minimum) {
    console.error(`❌ Expected at least ${minimum} ${description} in ${file}, found ${matches.length}`);
    failures.count += 1;
  }
}

const failures = { count: 0 };

try {
  const updatesFile = '_site/updates/index.html';
  const updatesHtml = readBuiltFile(updatesFile);

  expectMatch(updatesHtml, /<div\s+class="updates-grid"[^>]*aria-label="רשימת עדכונים"[\s\S]*?>/, 'updates grid container', updatesFile, failures);
  expectIncludes(updatesHtml, `data-release-series="${updates.release.series}"`, 'release series marker', updatesFile, failures);
  expectIncludes(updatesHtml, `data-release-id="${updates.release.id}"`, 'release id marker', updatesFile, failures);
  expectIncludes(updatesHtml, `data-min-cards="${updates.release.minimumCardCount}"`, 'minimum-card marker', updatesFile, failures);
  expectMinimumCount(updatesHtml, /<article class="update-card"[^>]*data-update-id="[^"]+"/g, updates.release.minimumCardCount, 'release cards with stable ids', updatesFile, failures);

  for (const item of updates.items) {
    expectIncludes(updatesHtml, `data-update-id="${item.id}"`, `update id '${item.id}'`, updatesFile, failures);

    const joinedFlags = (item.flags || []).join(' ');
    if (joinedFlags) {
      expectIncludes(updatesHtml, `data-update-flags="${joinedFlags}"`, `flag set for update '${item.id}'`, updatesFile, failures);
    }

    for (const link of item.links || []) {
      expectIncludes(updatesHtml, `data-critical-link="${link.id}"`, `critical link id '${link.id}'`, updatesFile, failures);
      expectIncludes(updatesHtml, `href="${withSitePrefix(link.href)}"`, `critical link href '${link.href}'`, updatesFile, failures);
    }
  }
} catch (error) {
  console.error(`❌ ${error.message}`);
  failures.count += 1;
}

for (const check of [
  {
    file: '_site/by-figure/index.html',
    markers: [
      'data-figure-key="talmidei-yeshua"',
      `data-figure-link="talmidei-yeshua"`,
      `href="${withSitePrefix('/by-figure/talmidei-yeshua/')}"`
    ]
  },
  {
    file: '_site/texts/aramaic/apoc-daniel-syriac/index.html',
    markers: [
      'id="comments-section"',
      'id="disqus_thread"',
      `this.page.identifier = "${withSitePrefix('/texts/aramaic/apoc-daniel-syriac/')}"`,
      'hebrew-aramaic-sources.disqus.com/embed.js'
    ]
  },
  {
    file: '_site/texts/aramaic/apoc-daniel-syriac/page-1/index.html',
    markers: [
      'id="comments-section"',
      'id="disqus_thread"',
      `this.page.identifier = "${withSitePrefix('/texts/aramaic/apoc-daniel-syriac/page-1/')}"`,
      'hebrew-aramaic-sources.disqus.com/embed.js'
    ]
  }
]) {
  try {
    const html = readBuiltFile(check.file);
    for (const marker of check.markers) {
      expectIncludes(html, marker, 'release marker', check.file, failures);
    }
  } catch (error) {
    console.error(`❌ ${error.message}`);
    failures.count += 1;
  }
}

if (failures.count > 0) {
  console.error(`\nRelease-content verification failed with ${failures.count} issue(s).`);
  process.exit(1);
}

console.log('Release-content verification passed.');
