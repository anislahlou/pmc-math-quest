const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./volume_prisms_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function assertCorrect(problem) {
  const result = mod.checkAnswer(problem, problem.correctInput);
  assert.strictEqual(result.isCorrect, true, `${problem.id} should accept ${JSON.stringify(problem.correctInput)}`);
}

function assertWrong(problem) {
  const input = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
  const result = mod.checkAnswer(problem, input);
  assert.strictEqual(result.isCorrect, false, `${problem.id} should reject a wrong answer`);
}

function run() {
  assert.strictEqual(mod.CLASSIC_IDS.length, 10);
  assert.strictEqual(mod.formatMathText("cm^2 and cm^3 and 5^2"), "cm² and cm³ and 5²");
  assert.strictEqual(mod.parseNumber("240 cm³"), 240);

  assert.strictEqual(item("cuboid-warmup", 0).expected, 240);
  assert.strictEqual(item("cuboid-warmup", 1).expected, 7);
  assert.strictEqual(item("hollow-prism", 0).expected, 1152);
  assert.strictEqual(item("hollow-height", 0).expected, 9);
  assert.strictEqual(item("water-rise-volume", 0).expected, 540);
  assert.strictEqual(item("new-water-level", 0).expected, 11);
  assert.strictEqual(item("partial-submerged-block", 0).expected, 9.6);
  assert.strictEqual(item("extensive-cross-section", 0).expected, 9940);

  const triangularVisual = mod.renderProblemVisual(item("base-area-stack", 0), "solution").html;
  assert.ok(triangularVisual.includes('data-shape="triangular-prism"'), "Triangular prism prompts should draw triangular prisms");
  assert.ok(!triangularVisual.includes('data-shape="cylinder-style-prism"'), "Triangular prism prompts should not reuse a cylinder drawing");
  const cylinderVisual = mod.renderProblemVisual(item("base-area-stack", 2), "solution").html;
  assert.ok(cylinderVisual.includes('data-shape="cylinder-style-prism"'), "Cylinder-style prompts should keep the cylinder-style drawing");

  const houseVisual = mod.renderProblemVisual(item("composite-cross-section", 0), "solution").html;
  for (const label of ["front width", "rectangle height", "triangle height", "prism length"]) {
    assert.ok(houseVisual.includes(label), `House prism visual should label ${label}`);
  }

  for (const classicId of mod.CLASSIC_IDS) {
    const uniquePrompts = new Set();
    const answerModes = new Set();
    const correctChoicePositions = new Set();
    for (let variant = 0; variant < 18; variant += 1) {
      const problem = item(classicId, variant);
      assert.strictEqual(problem.classicId, classicId);
      assert.ok(problem.prompt.length >= 35, `${problem.id} needs a substantial prompt`);
      assert.ok(problem.hint1.length >= 20, `${problem.id} needs hint1`);
      assert.ok(problem.hint2.length >= 20, `${problem.id} needs hint2`);
      assert.ok(problem.solution.length >= 25, `${problem.id} needs a worked solution`);
      assert.ok(problem.sourcePages.includes("PDF"), `${problem.id} needs source page tracking`);
      assert.ok(mod.validateProblemMath(problem), `${problem.id} should satisfy its audit formula`);
      assertCorrect(problem);
      assertWrong(problem);
      const rendered = mod.renderProblemVisual(problem, "solution");
      assert.ok(rendered.html.includes('role="img"'), `${problem.id} needs accessible diagram role`);
      assert.ok(rendered.html.includes("data-label-for"), `${problem.id} needs anchored diagram labels`);
      assert.ok(rendered.html.includes("Answer:"), `${problem.id} solution visual should show the answer`);
      uniquePrompts.add(problem.prompt);
      answerModes.add(problem.answerMode);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, `${problem.id} needs one correct choice`);
        correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(uniquePrompts.size >= 8, `${classicId} should generate fresh-number prompt variety`);
    assert.ok(answerModes.has("choice") && answerModes.has("filled"), `${classicId} should mix choice and typed answers`);
    assert.ok(correctChoicePositions.size >= 2, `${classicId} should vary the correct choice position`);

    const original = item(classicId, 0);
    const similarIndex = mod.findSimilarVariant(original, 0);
    const similar = item(classicId, similarIndex);
    assert.notStrictEqual(similar.prompt, original.prompt, `${classicId} similar repair should use fresh numbers`);
  }

  const html = fs.readFileSync(path.join(__dirname, "volume_prisms_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "volume_prisms_module.css"), "utf8");
  const js = fs.readFileSync(path.join(__dirname, "volume_prisms_module.js"), "utf8");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "intro-voice-toggle", "practice-grid", "answer-host", "similar-button", "feedback", "round-recap", "live-score", "question-strip"]) {
    assert.ok(html.includes(`id="${id}"`), `Volume module HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".intro-storyboard", ".question-jump", ".choice-card", ".repair-button", ".visual-frame", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `Volume module CSS should include ${token}`);
  }
  for (const token of ["data-scene-index", "data-question-index", "goToQuestion", "updateSessionUI"]) {
    assert.ok(js.includes(token), `Volume module JS should include ${token}`);
  }
}

if (require.main === module) {
  run();
  console.log("All Volume of Prisms module tests passed.");
}

module.exports = { run };
