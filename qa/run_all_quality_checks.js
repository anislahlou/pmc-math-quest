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

// 4) Registry-driven gates (Phase 2bcd). These run independently — one failing
//    does NOT skip the others. The user wants every gate to show its surface.
//
// The module-integration gate is "soft" by default: when Playwright is not
// installed it prints a SKIP banner and exports `{ skipped: true }` rather
// than throwing, so contributors without Playwright still get a clean run.
// When Playwright IS installed, any assertion failure throws and fails QA.
const gates = [
  { id: "skill-coverage", path: "./skill_coverage_lint.js" },
  { id: "intro-pack", path: "./intro_pack_lint.js" },
  { id: "diagram-parity", path: "./diagram_parity_lint.js" },
  { id: "module-integration", path: "./module_integration_lint.js", soft: true },
  // The pedagogy-review gate is OPT-IN: when ANTHROPIC_API_KEY is unset
  // it prints a SKIP banner and resolves cleanly (no impact on QA pass/fail).
  // When the key IS set, it sends each intro pack to Claude for an
  // LLM-judged verdict — placed AFTER module-integration so contributors
  // see structural issues first.
  { id: "pedagogy-review", path: "./intro_pack_pedagogy_review.js", soft: true }
];

async function runAllGates() {
  const gateOutcomes = [];
  for (const gate of gates) {
    console.log(`\n[qa] running gate: ${gate.id}`);
    try {
      const gateMod = require(gate.path);
      if (typeof gateMod.run !== "function") {
        failures++;
        gateOutcomes.push({ id: gate.id, status: "missing-run" });
        console.error(`[qa] gate ${gate.id} does not export run()`);
        continue;
      }
      // Some gates are sync (throw on failure); the soft module-integration
      // gate is async (returns a Promise). Awaiting works for both — and
      // when Playwright is missing the soft gate resolves cleanly after
      // printing a SKIP banner so we record it as "pass" with no failures.
      await gateMod.run();
      gateOutcomes.push({ id: gate.id, status: "pass" });
    } catch (err) {
      failures++;
      gateOutcomes.push({ id: gate.id, status: "fail", message: err.message });
      console.error(`[qa] gate ${gate.id} failed: ${err.message}`);
    }
  }
  return gateOutcomes;
}

runAllGates().then((gateOutcomes) => {
  console.log("\n[qa] gate summary:");
  for (const o of gateOutcomes) console.log(`  ${o.id}: ${o.status}${o.message ? " — " + o.message : ""}`);

  if (failures > 0) {
    console.error(`\n[qa] ${failures} failure(s).`);
    process.exit(1);
  }
  console.log("All app quality checks passed.");
}).catch((err) => {
  console.error(`[qa] fatal orchestrator error: ${err.message}`);
  process.exit(1);
});
