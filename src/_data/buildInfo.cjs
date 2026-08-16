const { execSync } = require('node:child_process');
const { existsSync, statSync } = require('node:fs');
const { extname } = require('node:path');

function safeExec(command) {
  try {
    return execSync(command, { encoding: 'utf8', timeout: 2000 }).trim();
  } catch (_) {
    return 'unknown';
  }
}

// Cache git last-modified dates per file to avoid spawning git for every page.
const _gitDateCache = new Map();
function getGitLastModified(filePath) {
  if (!filePath || !existsSync(filePath)) return null;
  if (_gitDateCache.has(filePath)) return _gitDateCache.get(filePath);

  let result = null;
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf8',
      timeout: 2000,
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim();
    if (iso && /^\d{4}-\d{2}-\d{2}/.test(iso)) {
      result = iso;
    }
  } catch (_) {
    // Not in git yet, or git unavailable — fall back to filesystem mtime
    try {
      const st = statSync(filePath);
      result = st.mtime.toISOString();
    } catch (_) {
      result = null;
    }
  }
  _gitDateCache.set(filePath, result);
  return result;
}

module.exports = {
  commitShort: safeExec('git rev-parse --short HEAD'),
  branch: safeExec('git rev-parse --abbrev-ref HEAD'),
  builtAtUTC: new Date().toISOString(),
  buildYear: new Date().getFullYear(),
  getGitLastModified
};
