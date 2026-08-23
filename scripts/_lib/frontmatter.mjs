// Shared YAML frontmatter utilities for CI verification scripts.
//
// The existing scripts each rolled their own regex-based frontmatter parser.
// This module centralizes the canonical implementation so future scripts can
// import it instead of re-rolling. The legacy scripts are NOT refactored in
// this round (see worklog) — they continue to work as-is. New scripts should
// import from here.
//
// Notes on the format:
// - Frontmatter is delimited by `---` on its own line at the very start of the file.
// - CRLF and LF line endings are both supported.
// - This is a lightweight parser — it does NOT support nested YAML structures
//   beyond the flat key: value form used by this project's frontmatter schema.
//   For full YAML, use `js-yaml` (already a devDependency).

import { readFileSync } from "node:fs";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

/**
 * Extract raw frontmatter block (the YAML text between the `---` delimiters)
 * from a file's contents. Returns `null` if no frontmatter is present.
 *
 * @param {string} content  Full file contents.
 * @returns {string|null}
 */
export function getFrontmatter(content) {
  const m = content.match(FRONTMATTER_RE);
  return m ? m[1] : null;
}

/**
 * Read a file and return its frontmatter block (or `null`).
 *
 * @param {string} file  Absolute path.
 * @returns {string|null}
 */
export function readFrontmatter(file) {
  const content = readFileSync(file, "utf8");
  return getFrontmatter(content);
}

/**
 * Check whether a frontmatter block declares `key:`. Key must appear at the
 * start of a line (multi-line safe).
 *
 * @param {string} frontmatter  Raw frontmatter block (from getFrontmatter).
 * @param {string} key
 * @returns {boolean}
 */
export function hasKey(frontmatter, key) {
  if (!frontmatter) return false;
  return new RegExp(`^${key}:`, "m").test(frontmatter);
}

/**
 * Read a single-line scalar value for `key` from frontmatter. Surrounding
 * quotes (single or double) are stripped. Returns `''` if the key is missing
 * or has no value on the same line. For multi-line values (arrays, nested
 * objects), write a dedicated parser instead.
 *
 * @param {string} frontmatter
 * @param {string} key
 * @returns {string}
 */
export function readValue(frontmatter, key) {
  if (!frontmatter) return "";
  const m = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, "m"));
  return m ? m[1].replace(/^[\'"]|[\'"]$/g, "") : "";
}

/**
 * Parse the YAML `tags:` array from frontmatter. Returns `[]` if absent or
 * malformed. Accepts both block-sequence form:
 *   tags:
 *     - texts
 *     - aramaic
 * and inline flow form:
 *   tags: [texts, aramaic]
 *
 * @param {string} frontmatter
 * @returns {string[]}
 */
export function parseTags(frontmatter) {
  if (!frontmatter) return [];
  // Block sequence form
  const blockMatch = frontmatter.match(/^tags:\s*\n((?:\s+-\s.+\n?)+)/m);
  if (blockMatch) {
    return blockMatch[1]
      .split("\n")
      .map((line) => line.match(/^\s+-\s+(.+?)\s*$/))
      .filter(Boolean)
      .map((m) => m[1].replace(/^[\'"]|[\'"]$/g, ""));
  }
  // Inline flow form: tags: [a, b, c]
  const inlineMatch = frontmatter.match(/^tags:\s*\[([^\]]*)\]/m);
  if (inlineMatch) {
    return inlineMatch[1]
      .split(",")
      .map((s) => s.trim().replace(/^[\'"]|[\'"]$/g, ""))
      .filter(Boolean);
  }
  return [];
}
