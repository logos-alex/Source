import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const conflictRegex = /^(<{7}|={7}|>{7})(?: .*)?$/m;

const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .filter((file) => !file.startsWith('node_modules/'));

let failures = 0;

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  if (conflictRegex.test(content)) {
    console.error(`❌ Conflict marker detected in: ${file}`);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\nConflict-marker verification failed with ${failures} issue(s).`);
  process.exit(1);
}

console.log('Conflict-marker verification passed.');
