const assert = require("assert");
const mod = require("./algebraic_word_puzzles_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length >= 1);
  assert.ok(Array.isArray(mod.INTRO_SCENES) && mod.INTRO_SCENES.length >= 5);
  assert.strictEqual(typeof mod.formatMathText("x^2"), "string");
  assert.strictEqual(mod.parseNumber("42 units"), 42);

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
}

if (require.main === module) {
  run();
  console.log("All algebraic_word_puzzles module tests passed.");
}

module.exports = { run };
