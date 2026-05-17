const assert = require("assert");
const mod = require("./triangle_sides_module.js");

function assertNoInitialVisualLeak(problem) {
  const rendered = mod.renderProblemVisual(problem, "initial");
  const html = rendered.html;
  const visual = problem.visual;

  assert.ok(!html.includes("Answer:"), `${problem.id} initial visual must not include the answer banner`);

  if (visual.type === "gate") {
    assert.ok(!html.includes(" > ") && !html.includes("≤"), `${problem.id} initial triangle-gate visual must not reveal the comparison result`);
  }
  if (visual.type === "right" && visual.missing === "c") {
    assert.ok(!html.includes(`>${problem.expected}<`), `${problem.id} initial hypotenuse visual must keep the hypotenuse hidden`);
  }
  if (visual.type === "isoscelesChoice") {
    assert.ok(!html.includes(`base ${visual.base}`), `${problem.id} initial isosceles-choice visual must not reveal the base`);
    const repeatedCount = (html.match(new RegExp(`>${visual.equal}<`, "g")) || []).length;
    assert.ok(repeatedCount < 2, `${problem.id} initial isosceles-choice visual must not show the repeated side twice`);
  }
  if (visual.type === "shared") {
    assert.ok(!html.includes(`h ${visual.height}`), `${problem.id} initial shared-height visual must not reveal the hidden height`);
    if (!visual.showRightBase) assert.ok(!html.includes(`>${visual.rightBase}<`), `${problem.id} initial shared-height visual must not reveal hidden right base`);
    if (!visual.showRightHyp) assert.ok(!html.includes(`>${visual.rightHyp}<`), `${problem.id} initial shared-height visual must not reveal hidden right hypotenuse`);
  }
  if (visual.type === "isoArea") {
    assert.ok(!html.includes(`height ${visual.height}`), `${problem.id} initial isosceles-area visual must not reveal the hidden height`);
  }
  if (visual.type === "areaPerimeter") {
    assert.ok(!html.includes(`height ${visual.height}`), `${problem.id} initial area-to-perimeter visual must not reveal the hidden height`);
    assert.ok(!html.includes(`>${visual.equal}<`), `${problem.id} initial area-to-perimeter visual must not reveal the equal side`);
  }
  if (visual.type === "path") {
    assert.ok(!html.includes(`perpendicular totals: ${visual.x} and ${visual.y}`), `${problem.id} initial path visual must not reveal the grouped totals`);
  }
}

function run() {
  const required = [
    "triangle-gate",
    "isosceles-choice",
    "hypotenuse-builder",
    "missing-leg",
    "shared-height-chase",
    "isosceles-split-area",
    "area-to-perimeter",
    "right-turn-path"
  ];
  assert.deepStrictEqual(mod.CLASSIC_IDS, required);

  for (const classicId of required) {
    assert.ok(mod.SOURCE_COVERAGE[classicId], `${classicId} needs source coverage`);
    const prompts = new Set();
    const answerModes = new Set();
    const visualTypes = new Set();
    const correctChoicePositions = new Set();
    for (let variant = 0; variant < 16; variant += 1) {
      const problem = mod.generateProblem(classicId, variant);
      assert.ok(problem.skill.length > 25, `${problem.id} should map to a named skill`);
      assert.ok(problem.sourcePages.includes("Book"), `${problem.id} should carry book page evidence`);
      assert.ok(problem.sourcePages.includes("PDF"), `${problem.id} should carry PDF page evidence`);
      assert.ok(mod.validateProblemMath(problem), `${problem.id} should pass math validation`);
      assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, `${problem.id} should accept correct input`);
      const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
      assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, `${problem.id} should reject wrong input`);
      const visual = mod.renderProblemVisual(problem, "solution");
      assert.ok(visual.html.includes('role="img"'), `${problem.id} should render an accessible visual`);
      assert.ok(visual.text.length > 20, `${problem.id} visual text should explain the diagram`);
      assertNoInitialVisualLeak(problem);
      prompts.add(problem.prompt);
      answerModes.add(problem.answerMode);
      visualTypes.add(problem.visual.type);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, `${problem.id} needs one correct choice`);
        correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(prompts.size >= 4, `${classicId} needs varied prompts`);
    assert.ok(answerModes.size >= 1, `${classicId} needs answer mode tracking`);
    assert.ok(visualTypes.size >= 1, `${classicId} needs a visual type`);
    if (correctChoicePositions.size > 0) {
      assert.ok(correctChoicePositions.size >= 2, `${classicId} should vary correct multiple-choice positions`);
    }
  }

  console.log("Independent Triangle Sides bank audit passed for " + (required.length * 16) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
