import { execSync } from "node:child_process";

const steps = [
  ["node", "scripts/verify-frontmatter.mjs"],
  ["node", "scripts/verify-text-structure.mjs"],
  ["node", "scripts/verify-catalog-consistency.mjs"],
  ["node", "scripts/verify-chapter-titles.mjs"],
  ["node", "scripts/verify-permalinks.mjs"],
  ["node", "scripts/verify-placeholders.mjs"],
  ["node_modules/.bin/eleventy", "--pathprefix=/Source/"],
  ["node_modules/.bin/pagefind", "--site", "_site", "--output-path", "_site/pagefind"],
  ["node", "scripts/verify-release-content.mjs"],
  ["node", "scripts/verify-path-prefix.mjs"],
  ["node", "scripts/verify-built-links.mjs"]
];

for (const command of steps) {
  const printable = command.join(" ");
  console.log(`\n▶ ${printable}`);
  execSync(printable, { stdio: "inherit" });
}

console.log("\n✅ ci:verify completed successfully.");
