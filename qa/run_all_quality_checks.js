const path = require("path");
const fs = require("fs");

const repoRoot = path.resolve(__dirname, "..");
const registryPath = path.join(repoRoot, "modules", "registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

let failures = 0;

// Sort by order so QA output is deterministic and matches the user-facing module sequence.
const modules = [...registry.modules].sort((a, b) => a.order - b.order);

// 1) Audits
for (const m of modules) {
  if (!m.qa.hasAudit) continue;
  const auditAbs = path.join(repoRoot, m.paths.auditJs);
  try {
    const audit = require(auditAbs);
    if (typeof audit.run === "function") {
      audit.run();
    }
    // else: audit self-executes at require time (legacy pattern), which is fine.
  } catch (err) {
    failures++;
    console.error(`[qa] audit failed for ${m.id}: ${err.message}`);
  }
}

// 2) Math display check (cross-module)
try {
  require("./math_display_quality_check.js").run();
} catch (err) {
  failures++;
  console.error(`[qa] math_display_quality_check failed: ${err.message}`);
}

// 3) Module tests
for (const m of modules) {
  if (!m.qa.hasTests) continue;
  const testsAbs = path.join(repoRoot, m.paths.testsJs);
  try {
    const tests = require(testsAbs);
    if (typeof tests.run === "function") {
      tests.run();
    }
    // else: tests self-execute (some legacy test files do this), which is fine.
  } catch (err) {
    failures++;
    console.error(`[qa] tests failed for ${m.id}: ${err.message}`);
  }
}

if (failures > 0) {
  console.error(`\n[qa] ${failures} failure(s).`);
  process.exit(1);
}
console.log("All app quality checks passed.");
