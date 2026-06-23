const { execSync } = require('node:child_process');

function safeExec(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

module.exports = {
  commitShort: safeExec('git rev-parse --short HEAD'),
  branch: safeExec('git rev-parse --abbrev-ref HEAD'),
  builtAtUTC: new Date().toISOString(),
  buildYear: new Date().getFullYear()
};
