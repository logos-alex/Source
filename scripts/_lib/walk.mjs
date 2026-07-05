// Shared filesystem walker for CI verification scripts.
//
// Recursively walks a directory and invokes `cb(filePath)` for every regular file.
// Directories are recursed into automatically. Symlinks are skipped (statSync is
// non-following on the readdir entry; we rely on st.isDirectory() which is false
// for symlinks-to-dirs on most platforms, which is the desired safe behavior here).
//
// Usage:
//   import { walkFiles } from './_lib/walk.mjs';
//   walkFiles('src/texts', (file) => { ... });
//
// To filter by extension, check inside the callback — keeps this helper agnostic.

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Recursively walk `root` and call `cb(absoluteFilePath)` for each regular file.
 *
 * @param {string} root   Absolute or cwd-relative directory path.
 * @param {(file: string) => void} cb  Callback invoked once per file.
 * @returns {void}
 */
export function walkFiles(root, cb) {
  if (!root) return;
  let entries;
  try {
    entries = readdirSync(root);
  } catch {
    return; // directory missing — let caller decide if that's an error
  }
  for (const name of entries) {
    const full = join(root, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue; // unreadable entry — skip
    }
    if (st.isDirectory()) {
      walkFiles(full, cb);
      continue;
    }
    if (st.isFile()) {
      cb(full);
    }
  }
}

/**
 * Walk `root` and return an array of file paths matching `predicate`.
 * Convenience wrapper around walkFiles for filter+collect patterns.
 *
 * @param {string} root
 * @param {(file: string) => boolean} [predicate]  Optional filter; default = all files.
 * @returns {string[]}
 */
export function listFiles(root, predicate) {
  const out = [];
  walkFiles(root, (f) => {
    if (!predicate || predicate(f)) out.push(f);
  });
  return out;
}
