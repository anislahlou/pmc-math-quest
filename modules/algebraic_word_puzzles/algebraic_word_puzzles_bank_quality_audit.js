const assert = require("assert");
const mod = require("./algebraic_word_puzzles_module.js");

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length >= 1, "module must expose at least one CLASSIC_IDS entry");

  for (const classicId of mod.CLASSIC_IDS) {
    assert.ok(mod.SOURCE_COVERAGE[classicId], classicId + " needs source coverage");
    const prompts = new Set();
    const choicePositions = new Set();
    for (let variant = 0; variant < 16; variant += 1) {
      const problem = mod.generateProblem(classicId, variant);
      assert.ok(problem, classicId + "/" + variant + " should produce a problem");
      assert.ok(problem.skill.length > 25, problem.id + " should map to a named skill");
      assert.ok(problem.sourcePages.includes("Book"), problem.id + " should carry book page evidence");
      assert.ok(problem.sourcePages.includes("PDF"), problem.id + " should carry PDF page evidence");
      assert.ok(mod.validateProblemMath(problem), problem.id + " should pass math validation");
      assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, problem.id + " should accept correct input");
      const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
      assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, problem.id + " should reject wrong input");
      const visual = mod.renderProblemVisual(problem, "solution");
      assert.ok(visual.html.includes('role="img"'), problem.id + " should render an accessible visual");
      assert.ok(visual.text.length > 20, problem.id + " visual text should explain the diagram");
      const initialVisual = mod.renderProblemVisual(problem, "initial");
      assert.ok(!initialVisual.html.includes("Answer:"), problem.id + " initial visual must not include the answer banner");
      prompts.add(problem.prompt);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, problem.id + " needs one correct choice");
        choicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(prompts.size >= 4, classicId + " needs varied prompts");
    if (choicePositions.size > 0) {
      assert.ok(choicePositions.size >= 2, classicId + " should vary correct multiple-choice positions");
    }
  }

  console.log("Placeholder algebraic_word_puzzles bank audit passed for " + (mod.CLASSIC_IDS.length * 16) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
