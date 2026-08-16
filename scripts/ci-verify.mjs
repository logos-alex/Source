import { spawnSync } from "node:child_process";

const steps = [
  ["node", "scripts/verify-frontmatter.mjs"],
  ["node", "scripts/verify-text-structure.mjs"],
  ["node", "scripts/verify-catalog-consistency.mjs"],
  ["node", "scripts/verify-chapter-titles.mjs"],
  ["node", "scripts/verify-permalinks.mjs"],
  ["node", "scripts/verify-placeholders.mjs"],
  ["node", "scripts/verify-intro-revisions.mjs"],
  ["node", "scripts/verify-third-party-controls.mjs"],
  ["node", "scripts/report-content-status.mjs", "--check"],
  ["npx", "--no-install", "eleventy", "--pathprefix=/Source/"],
  ["node", "scripts/verify-display-book-titles.mjs"],
  ["npx", "--no-install", "pagefind", "--site", "_site", "--output-path", "_site/pagefind"],
  ["node", "scripts/verify-release-content.mjs"],
  ["node", "scripts/verify-intro-navigation.mjs"],
  ["node", "scripts/verify-path-prefix.mjs"],
  ["node", "scripts/verify-built-links.mjs"]
];

const results = [];
let failed = false;

for (const command of steps) {
  const printable = command.join(" ");
  console.log(`\n▶ ${printable}`);
  const t0 = Date.now();
  const r = spawnSync(command[0], command.slice(1), { stdio: "inherit" });
  const ms = Date.now() - t0;
  const ok = r.status === 0;
  results.push({ cmd: command[0] === "npx" ? command.slice(2).join(" ") : command.slice(1).join(" "), ok, ms });
  if (!ok) {
    failed = true;
    // Continue to next steps so we can show a full summary, but remember failure.
  }
}

console.log("\n──────────────────────────────────────────────");
console.log("CI verification summary:");
console.log("──────────────────────────────────────────────");
for (const r of results) {
  const mark = r.ok ? "✓" : "✗";
  const time = `${r.ms}ms`;
  console.log(`  ${mark} ${r.cmd.padEnd(50)} ${time.padStart(8)}`);
}
console.log("──────────────────────────────────────────────");
const passed = results.filter(r => r.ok).length;
const total = results.length;
console.log(`  ${passed}/${total} steps passed, total ${(results.reduce((s, r) => s + r.ms, 0) / 1000).toFixed(2)}s`);

if (failed) {
  console.error("\n❌ ci:verify failed — see errors above.");
  process.exit(1);
}
console.log("\n✅ ci:verify completed successfully.");
