/**
 * Catch code that builds on your machine but not on the remote.
 *
 * `git push` sends HEAD, not your working tree, so this analyzes the committed
 * snapshot and asks whether it resolves against itself. Two failure shapes,
 * both of which pass `tsc` locally and then break the remote build:
 *
 *   1. A committed file imports a module that is still untracked.
 *   2. A committed file imports a named export that exists only in your
 *      uncommitted edits to the target file.
 *
 * (2) is what broke the Long Beach email deploy: the email was committed while
 * HeaderBanner lived in an uncommitted edit to emails/components/brand.tsx.
 *
 * A paired local edit that adds both an import and its export is deliberately
 * NOT reported: neither half is pushed, so the remote is unaffected.
 *
 * Run:  node scripts/check-committed-imports.mjs
 * Exits 1 if anything is found, so it can gate a push.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const lines = (s) => s.trim().split("\n").filter(Boolean);

const tracked = new Set(lines(git("ls-files")));

const CODE = /\.(ts|tsx|js|jsx|mjs)$/;
const EXTS = [
  "",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  "/index.ts",
  "/index.tsx",
  "/index.js",
  "/index.jsx",
  "/index.mjs",
];

/**
 * Resolve a relative or `@/` import. Prefers the tracked set over the
 * filesystem, so a module deleted locally but still committed resolves, and an
 * untracked module is reported as such rather than silently resolving.
 */
function resolveImport(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = spec.slice(2);
  else if (spec.startsWith(".")) base = join(dirname(fromFile), spec);
  else return null; // package import, not ours

  const norm = (p) => p.replace(/^\.\//, "");
  for (const ext of EXTS) {
    if (tracked.has(norm(base + ext))) return { path: norm(base + ext), tracked: true };
  }
  for (const ext of EXTS) {
    if (existsSync(resolve(base + ext))) return { path: norm(base + ext), tracked: false };
  }
  return null; // unresolvable; tsc will say so more clearly than we can
}

/** Every local module a file depends on: `from`, bare side-effect, and dynamic. */
function* importSpecs(src) {
  for (const m of src.matchAll(/from\s*["']([^"']+)["']/g)) yield m[1];
  for (const m of src.matchAll(/(?:^|[;\s])import\s+["']([^"']+)["']/g)) yield m[1];
  for (const m of src.matchAll(/import\s*\(\s*["']([^"']+)["']/g)) yield m[1];
}

const findings = [];

for (const file of [...tracked].filter((f) => CODE.test(f))) {
  let src;
  try {
    src = git("show", `HEAD:${file}`);
  } catch {
    continue; // staged-but-never-committed; nothing at HEAD to check yet
  }

  // (1) committed file -> untracked module
  for (const spec of importSpecs(src)) {
    const target = resolveImport(file, spec);
    if (target && !target.tracked) {
      findings.push([file, `imports "${spec}" but ${target.path} is untracked`]);
    }
  }

  // (2) named import of an export missing from the committed target
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g)) {
    const target = resolveImport(file, m[2]);
    if (!target || !target.tracked) continue;
    let committed;
    try {
      committed = git("show", `HEAD:${target.path}`);
    } catch {
      continue;
    }
    for (const raw of m[1].split(",")) {
      // Strip an inline `type` modifier: `import { type Race }`.
      const sym = raw
        .trim()
        .split(/\s+as\s+/)[0]
        .trim()
        .replace(/^type\s+/, "");
      if (!sym) continue;
      const exported = new RegExp(
        `export\\s+(async\\s+)?(function|const|let|var|class|type|interface|enum)\\s+${sym}\\b` +
          `|export\\s*\\{[^}]*\\b${sym}\\b`,
      );
      if (!exported.test(committed)) {
        findings.push([
          file,
          `imports { ${sym} } from "${m[2]}" — not exported in the committed ${target.path}`,
        ]);
      }
    }
  }
}

const unique = [...new Map(findings.map((f) => [f.join("|"), f])).values()];

if (!unique.length) {
  console.log("Committed imports all resolve. Safe to push.");
  process.exit(0);
}

console.error(`${unique.length} import(s) that will not resolve on the remote:\n`);
for (const [file, detail] of unique) console.error(`  ${file}\n    ${detail}\n`);
console.error("Commit the missing files/exports before pushing.");
process.exit(1);
