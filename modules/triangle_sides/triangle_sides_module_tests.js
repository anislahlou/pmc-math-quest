const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./triangle_sides_module.js");

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
  assert.strictEqual(mod.CLASSIC_IDS.length, 8);
  assert.strictEqual(mod.formatMathText("a^2 + b^2 = c^2"), "a² + b² = c²");
  assert.strictEqual(mod.parseNumber("32 cm"), 32);

  assert.strictEqual(item("triangle-gate", 0).expected, "can form a triangle");
  assert.strictEqual(item("triangle-gate", 1).expected, "cannot form a triangle");
  assert.strictEqual(item("isosceles-choice", 0).expected, 22);
  assert.strictEqual(item("isosceles-choice", 2).expected, 25);
  assert.strictEqual(item("hypotenuse-builder", 0).expected, 10);
  assert.strictEqual(item("missing-leg", 0).expected, 5);
  assert.strictEqual(item("shared-height-chase", 0).expected, 84);
  assert.strictEqual(item("shared-height-chase", 1).expected, 60);
  assert.strictEqual(item("shared-height-chase", 2).expected, 32);
  assert.strictEqual(item("isosceles-split-area", 0).expected, 12);
  assert.strictEqual(item("area-to-perimeter", 0).expected, 32);
  assert.strictEqual(item("right-turn-path", 0).expected, 25);

  for (const classicId of mod.CLASSIC_IDS) {
    const problem = item(classicId, 0);
    assert.strictEqual(problem.classicId, classicId);
    assert.ok(problem.prompt.length > 25, `${problem.id} needs a useful prompt`);
    assert.ok(problem.hint1.length > 10, `${problem.id} needs hint1`);
    assert.ok(problem.hint2.length > 10, `${problem.id} needs hint2`);
    assert.ok(problem.solution.length > 20, `${problem.id} needs worked solution`);
    assert.ok(problem.sourcePages.includes("PDF"), `${problem.id} needs PDF page source`);
    assert.ok(mod.validateProblemMath(problem), `${problem.id} formula audit failed`);
    assertCorrect(problem);
    assertWrong(problem);
    const rendered = mod.renderProblemVisual(problem, "solution");
    assert.ok(rendered.html.includes('role="img"'), `${problem.id} needs accessible visual`);
    assert.ok(rendered.html.includes("Answer:"), `${problem.id} solution visual should include answer`);
  }

  const html = fs.readFileSync(path.join(__dirname, "triangle_sides_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "triangle_sides_module.css"), "utf8");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "practice-grid", "answer-host", "similar-button", "feedback", "round-recap", "live-score"]) {
    assert.ok(html.includes(`id="${id}"`), `Triangle sides HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".choice-card", ".visual-frame", ".feedback-card", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `Triangle sides CSS should include ${token}`);
  }
}

if (require.main === module) {
  run();
  console.log("All Triangle Sides module tests passed.");
}

module.exports = { run };
