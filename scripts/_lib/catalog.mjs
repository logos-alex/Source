// Shared catalog loaders for CI verification scripts.
//
// The existing scripts each read+parse sources-catalog.json / figures.json /
// languages.json / figureCatalogKeys.json independently. This module caches
// them at module scope so a single Node process only pays the parse cost once
// per file (matters when 16 scripts run sequentially in ci:verify).
//
// Legacy scripts are NOT refactored in this round — they keep working. New
// scripts should import from here to avoid drift.

import { readFileSync } from 'node:fs';

const CATALOG_PATH = 'src/_data/sources-catalog.json';
const FIGURES_PATH = 'src/_data/figures.json';
const LANGUAGES_PATH = 'src/_data/languages.json';
const FIGURE_CATALOG_KEYS_PATH = 'src/_data/figureCatalogKeys.json';

let _catalog = null;
let _figures = null;
let _languages = null;
let _figureCatalogKeys = null;

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * The sources catalog as an array of book entries.
 * Each entry: { id, title, lang, description, figure, parallelLayout?, comingSoon?, ... }
 *
 * @returns {Array<object>}
 */
export function getCatalog() {
  if (_catalog === null) _catalog = loadJson(CATALOG_PATH);
  return _catalog;
}

/**
 * Map of figure-key → Hebrew display name.
 * @returns {Object<string, string>}
 */
export function getFigures() {
  if (_figures === null) _figures = loadJson(FIGURES_PATH);
  return _figures;
}

/**
 * Map of language-key → language metadata (label, iso, description).
 * @returns {Object<string, {label: string, iso: string, description: string}>}
 */
export function getLanguages() {
  if (_languages === null) _languages = loadJson(LANGUAGES_PATH);
  return _languages;
}

/**
 * Ordered array of figure keys that appear in the by-figure catalog.
 * @returns {string[]}
 */
export function getFigureCatalogKeys() {
  if (_figureCatalogKeys === null) _figureCatalogKeys = loadJson(FIGURE_CATALOG_KEYS_PATH);
  return _figureCatalogKeys;
}

/** Set of all known book ids (from catalog). */
export function getBookIds() {
  return new Set(getCatalog().map((b) => b.id));
}

/** Set of all known source/language keys (from languages.json). */
export function getSourceKeys() {
  return new Set(Object.keys(getLanguages()));
}

/** Set of all known figure keys (from figures.json). */
export function getFigureKeys() {
  return new Set(Object.keys(getFigures()));
}

/** Set of book ids with `parallelLayout: true`. */
export function getParallelBookIds() {
  return new Set(getCatalog().filter((b) => b.parallelLayout === true).map((b) => b.id));
}

/** Lookup a book entry by id. Returns `undefined` if not found. */
export function getBookById(id) {
  return getCatalog().find((b) => b.id === id);
}
