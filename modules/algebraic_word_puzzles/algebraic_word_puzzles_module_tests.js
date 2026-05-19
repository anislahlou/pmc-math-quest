const assert = require("assert");
const mod = require("./algebraic_word_puzzles_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length === 6, "expect 6 classics");
  assert.ok(Array.isArray(mod.INTRO_SCENES) && mod.INTRO_SCENES.length >= 6, "expect >=6 intro scenes");
  assert.strictEqual(typeof mod.formatMathText("x^2"), "string");
  assert.strictEqual(mod.parseNumber("42 units"), 42);

  // Every scene needs full content and a valid classic mapping.
  for (const [index, scene] of mod.INTRO_SCENES.entries()) {
    assert.ok(scene.title && scene.title.length > 0, "scene " + index + " needs a title");
    assert.ok(scene.purpose && scene.purpose.length > 20, scene.title + " needs a clear purpose");
    assert.ok(scene.caption && scene.caption.length > 30, scene.title + " needs a visual caption");
    assert.ok(scene.voiceover && scene.voiceover.length > 80, scene.title + " needs narration");
    assert.ok(scene.classicId, scene.title + " must reference a classic");
    assert.ok(mod.CLASSIC_IDS.includes(scene.classicId), scene.title + " classicId must exist in CLASSIC_IDS");
    assert.ok(mod.renderIntroScene(index).includes('role="img"'), scene.title + " should render as a visual intro scene");
  }

  // Smoke check every classic v0
  for (const classicId of mod.CLASSIC_IDS) {
    const problem = item(classicId, 0);
    assert.strictEqual(problem.classicId, classicId);
    assert.ok(problem.prompt.length > 20, problem.id + " needs a useful prompt");
    assert.ok(problem.hint1.length > 10, problem.id + " needs hint1");
    assert.ok(problem.hint2.length > 10, problem.id + " needs hint2");
    assert.ok(problem.solution.length > 20, problem.id + " needs worked solution");
    assert.ok(mod.validateProblemMath(problem), problem.id + " formula audit failed");
    assert.strictEqual(mod.checkAnswer(problem, problem.correctInput).isCorrect, true, problem.id + " should accept correct input");
    const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
    assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, problem.id + " should reject wrong input");
    const rendered = mod.renderProblemVisual(problem, "solution");
    assert.ok(rendered.html.includes('role="img"'), problem.id + " needs accessible visual");
    assert.ok(rendered.html.includes("Answer:"), problem.id + " solution visual should include answer");
  }

  // Canonical Problem 1 — original source: should report 13 girls.
  const p1 = item("hat-system-3-statement", 0);
  assert.strictEqual(Number(p1.expected), 13, "Problem 1 canonical answer must be 13 girls (got " + p1.expected + ")");
  assert.ok(p1.expectedDisplay.includes("13"), "Problem 1 display must contain 13");
  assert.ok(p1.expectedDisplay.includes("girls"), "Problem 1 display must mention girls");

  // Canonical Problem 2 — original source: should report 66 kg.
  const p2 = item("four-people-five-sums", 0);
  assert.strictEqual(Number(p2.expected), 66, "Problem 2 canonical answer must be 66 kg (got " + p2.expected + ")");
  assert.ok(p2.expectedDisplay.includes("66"), "Problem 2 display must contain 66");
  assert.ok(p2.expectedDisplay.includes("kg"), "Problem 2 display must mention kg");

  // The canonical four-people prompt should contain all five source sums.
  const sourceSums = ["99", "113", "125", "130", "144"];
  for (const s of sourceSums) {
    assert.ok(p2.prompt.includes(s), "Problem 2 prompt must mention the source pair sum " + s);
  }

  // Self-exclusion sanity: a "I see 2 more red than yellow" with B=16 must imply G = 13.
  // The two-group-difference classic encodes this rule. Variant 0 has n=10, k=3 -> answer = 6.
  const wsamp = item("two-group-difference", 0);
  assert.strictEqual(Number(wsamp.expected), 6, "two-group warmup v0 expects y = n-1-k = 10-1-3 = 6");

  // Pair-sum decomposition v0: people 30/40/50, sums 70/80/90, heaviest = 50.
  const psamp = item("three-people-pair-sums", 0);
  assert.strictEqual(Number(psamp.expected), 50, "three-people v0 heaviest = 50");
}

if (require.main === module) {
  run();
  console.log("All algebraic_word_puzzles module tests passed.");
}

module.exports = { run };
