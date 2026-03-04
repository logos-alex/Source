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
  sed -n "1,20p" "$0"
  echo
  echo "Options:"
  echo "  REMOTE_NAME=<remote>   Override remote (default: origin)"
  echo "  AUTO_COMMIT=1          Create conflict-resolution commit automatically"
  exit 0
fi

BASE_BRANCH="${1:-main}"
REMOTE="${REMOTE_NAME:-origin}"
AUTO_COMMIT="${AUTO_COMMIT:-0}"

PREFER_OURS=(
  ".github/workflows/deploy-gh-pages-branch.yml"
  ".github/workflows/deploy.yml"
  "docs/content-guidelines-he.md"
  "docs/disqus-setup-he.md"
  "docs/project-deep-dive-he.md"
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
  if [[ "${AUTO_COMMIT}" == "1" ]]; then
    git commit -m "Resolve merge conflicts with ${BASE_BRANCH}" || true
    echo "Auto-commit attempted."
  else
    echo "Now commit and push:"
    echo "  git commit -m 'Resolve merge conflicts with ${BASE_BRANCH}'"
  fi
  echo "  git push ${REMOTE} $(git rev-parse --abbrev-ref HEAD)"
else
  echo "Checks failed. Resolve issues before committing."
  exit 3
fi
