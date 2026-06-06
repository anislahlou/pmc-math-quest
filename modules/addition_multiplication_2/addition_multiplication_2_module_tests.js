const assert = require("assert");
const mod = require("./addition_multiplication_2_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length === 7, "module must expose all 7 CLASSIC_IDS");
  assert.ok(Array.isArray(mod.INTRO_SCENES) && mod.INTRO_SCENES.length >= 6, "INTRO_SCENES must have at least 6 entries");
  assert.strictEqual(typeof mod.formatMathText("x^2"), "string");
  assert.strictEqual(mod.parseNumber("42 numbers"), 42);
  assert.strictEqual(mod.factorial(5), 120);

  for (const [index, scene] of mod.INTRO_SCENES.entries()) {
    assert.ok(scene.title && scene.title.length > 0, "scene " + index + " needs a title");
    assert.ok(scene.purpose && scene.purpose.length > 20, scene.title + " needs a clear purpose");
    assert.ok(scene.caption && scene.caption.length > 30, scene.title + " needs a visual caption");
    assert.ok(scene.voiceover && scene.voiceover.length > 80, scene.title + " needs narration");
    assert.ok(scene.classicId, scene.title + " must reference a classic");
    assert.ok(mod.CLASSIC_IDS.includes(scene.classicId), scene.title + " classicId must exist in CLASSIC_IDS");
    assert.ok(mod.renderIntroScene(index).includes('role="img"'), scene.title + " should render as a visual intro scene");
  }

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

  // ---- Source-canonical answer regressions ----------------------------------
  // These pin the numbers we transcribed from the source so any future tweak
  // to the generator that breaks the canonical example fails this test.

  // C1: {1,2,3,4} 2-digit with repeats → 4^2 = 16
  assert.strictEqual(item("digits-with-repeats", 0).expected, 16, "C1 canonical: {1,2,3,4}^2 = 16");

  // C2: {0,1,2,3} 2-digit with repeats → 3 × 4 = 12 (source)
  assert.strictEqual(item("zero-leading-constraint", 0).expected, 12, "C2 canonical (source): {0,1,2,3} 2-digit repeats = 12");

  // C3: {0,1,2,3} 2-digit no repeats → 3 × 3 = 9 (source)
  assert.strictEqual(item("no-repeat-distinct-digits", 0).expected, 9, "C3 canonical (source): {0,1,2,3} 2-digit no-repeats = 9");

  // C4: {1,5,6,7,8} 3-digit odd with repeats → 3 odd × 5 × 5 = 75
  assert.strictEqual(item("odd-by-last-digit-repeats", 0).expected, 75, "C4 canonical: 3 × 5 × 5 = 75");

  // C5: {0..5} 3-digit odd no repeats — Pip's mistake canonical, real answer 48 (not 75)
  assert.strictEqual(item("odd-or-even-no-repeats", 0).expected, 48, "C5 canonical (Pip): 3 × 4 × 4 = 48");

  // C6: APPLE letters, PP adjacent → 4! = 24
  assert.strictEqual(item("bundling-adjacent", 0).expected, 24, "C6 canonical: APPLE with PP glued = 24");

  // C7: 8 students with {A,B,C} together + {D,E} together → 5! × 3! × 2! = 1440
  assert.strictEqual(item("bundling-multi-restriction", 0).expected, 1440, "C7 canonical: 5! × 3! × 2! = 1440");

  // ---- All 7 CLASSICS appear in CLASSIC_SKILLS ------------------------------
  for (const id of mod.CLASSIC_IDS) {
    assert.ok(mod.CLASSIC_SKILLS && mod.CLASSIC_SKILLS[id], "CLASSIC_SKILLS missing " + id);
  }

  // ---- INTRO_SCENES coverage ------------------------------------------------
  // The Pip-mistake misconception scene must appear (named "Odd/Even Via Last Digit").
  const sceneTitles = mod.INTRO_SCENES.map((s) => s.title);
  assert.ok(
    sceneTitles.some((t) => /odd.*even/i.test(t)),
    "INTRO_SCENES must include the odd/even fix-last-position scene"
  );
  assert.ok(
    sceneTitles.some((t) => /bundling/i.test(t)),
    "INTRO_SCENES must include the bundling method scene"
  );
}

if (require.main === module) {
  run();
  console.log("All addition_multiplication_2 module tests passed.");
}

module.exports = { run };
