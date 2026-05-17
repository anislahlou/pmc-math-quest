const assert = require("assert");
const mod = require("./triangle_sides_module.js");

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
