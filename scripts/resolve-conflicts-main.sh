#!/usr/bin/env bash
set -euo pipefail

# Resolve common PR conflicts by preferring the current branch (ours)
# for the files that carry the CI/content rollout changes.
#
# Usage:
#   scripts/resolve-conflicts-main.sh [base-branch]
#
# Example:
#   scripts/resolve-conflicts-main.sh main

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
<<<<<<< HEAD
  sed -n "1,14p" "$0"
=======
  sed -n "1,20p" "$0"
  echo
  echo "Options:"
  echo "  REMOTE_NAME=<remote>   Override remote (default: origin)"
  echo "  AUTO_COMMIT=1          Create conflict-resolution commit automatically"
  echo "  KEEP_BAD_DANIEL_PAGES=0  Keep ours for Apoc Daniel pages 17+ (default: 1 takes theirs)"
>>>>>>> cad5b50915efbed171b250bada5983667da53930
  exit 0
fi

BASE_BRANCH="${1:-main}"
REMOTE="${REMOTE_NAME:-origin}"
<<<<<<< HEAD
=======
AUTO_COMMIT="${AUTO_COMMIT:-0}"
KEEP_BAD_DANIEL_PAGES="${KEEP_BAD_DANIEL_PAGES:-1}"
>>>>>>> cad5b50915efbed171b250bada5983667da53930

PREFER_OURS=(
  ".github/workflows/deploy-gh-pages-branch.yml"
  ".github/workflows/deploy.yml"
  "docs/content-guidelines-he.md"
  "docs/disqus-setup-he.md"
  "docs/project-deep-dive-he.md"
<<<<<<< HEAD
  "package.json"
  "scripts/verify-frontmatter.mjs"
  "src/_data/sources-catalog.json"
  "src/updates.njk"
=======
  "docs/content-status-he.md"
  "package.json"
  "scripts/verify-frontmatter.mjs"
  "scripts/verify-release-content.mjs"
  "src/_data/sources-catalog.json"
  "src/updates.njk"
  "src/_includes/base.njk"
  "src/_includes/category-page.njk"
  "src/_includes/text-page.njk"
)

PREFER_THEIRS=(
  "src/texts/aramaic/apoc-daniel-syriac/page-17.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-18.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-19.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-20.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-21.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-22.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-23.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-24.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-25.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-26.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-27.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-28.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-29.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-30.md"
  "src/texts/aramaic/apoc-daniel-syriac/page-31.md"
>>>>>>> cad5b50915efbed171b250bada5983667da53930
)

if ! git remote get-url "${REMOTE}" >/dev/null 2>&1; then
  echo "Remote '${REMOTE}' is not configured in this clone." >&2
  echo "Set REMOTE_NAME or add the remote first (e.g. git remote add origin <url>)." >&2
  exit 4
fi

echo "==> Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "==> Merging ${REMOTE}/${BASE_BRANCH}"

git fetch "${REMOTE}" "${BASE_BRANCH}"
git merge "${REMOTE}/${BASE_BRANCH}" || true

UNMERGED="$(git diff --name-only --diff-filter=U || true)"
if [[ -z "${UNMERGED}" ]]; then
  echo "No merge conflicts detected."
  exit 0
fi

echo "==> Unmerged files detected:"
printf '%s\n' "${UNMERGED}"

for file in "${PREFER_OURS[@]}"; do
  if git diff --name-only --diff-filter=U | grep -qx "${file}"; then
    echo "Resolving with ours: ${file}"
    git checkout --ours -- "${file}"
    git add "${file}"
  fi
done

<<<<<<< HEAD
=======
if [[ "${KEEP_BAD_DANIEL_PAGES}" == "1" ]]; then
  for file in "${PREFER_THEIRS[@]}"; do
    if git diff --name-only --diff-filter=U | grep -qx "${file}"; then
      echo "Resolving with theirs: ${file}"
      git checkout --theirs -- "${file}" || true
      git add "${file}" || true
      if [[ ! -e "${file}" ]]; then
        git rm -f --cached --ignore-unmatch "${file}" >/dev/null 2>&1 || true
      fi
    fi
  done
fi

>>>>>>> cad5b50915efbed171b250bada5983667da53930
REMAINING="$(git diff --name-only --diff-filter=U || true)"
if [[ -n "${REMAINING}" ]]; then
  echo
  echo "Still unresolved files (resolve manually in editor):"
  printf '%s\n' "${REMAINING}"
  echo
  echo "After resolving them, run:"
  echo "  npm run build && npm run ci:verify"
  echo "  git add . && git commit -m 'Resolve merge conflicts with ${BASE_BRANCH}'"
  exit 2
fi

echo
if npm run build && npm run ci:verify; then
  echo "Conflict resolution complete and checks passed."
<<<<<<< HEAD
  echo "Now commit and push:"
  echo "  git commit -m 'Resolve merge conflicts with ${BASE_BRANCH}'"
=======
  if [[ "${AUTO_COMMIT}" == "1" ]]; then
    git commit -m "Resolve merge conflicts with ${BASE_BRANCH}" || true
    echo "Auto-commit attempted."
  else
    echo "Now commit and push:"
    echo "  git commit -m 'Resolve merge conflicts with ${BASE_BRANCH}'"
  fi
>>>>>>> cad5b50915efbed171b250bada5983667da53930
  echo "  git push ${REMOTE} $(git rev-parse --abbrev-ref HEAD)"
else
  echo "Checks failed. Resolve issues before committing."
  exit 3
fi
