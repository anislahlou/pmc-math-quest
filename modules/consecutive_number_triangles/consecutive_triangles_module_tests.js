const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./consecutive_triangles_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function assertCorrect(problem, input) {
  const result = mod.checkAnswer(problem, input);
  assert.strictEqual(result.isCorrect, true, `${problem.classicId} expected ${JSON.stringify(input)} to be correct`);
}

function assertWrong(problem, input, errorClass) {
  const result = mod.checkAnswer(problem, input);
  assert.strictEqual(result.isCorrect, false, `${problem.classicId} expected ${JSON.stringify(input)} to be wrong`);
  assert.strictEqual(result.errorClass, errorClass);
}

function run() {
  assert.strictEqual(mod.triangular(10), 55);
  assert.strictEqual(mod.triangular(20), 210);
  assert.strictEqual(mod.ordinaryValue(21, 5), 215);
  assert.deepStrictEqual(mod.ordinaryAddress(60), { row: 11, position: 5 });
  assert.deepStrictEqual(mod.ordinaryAddress(46), { row: 10, position: 1 });
  assert.strictEqual(mod.ordinaryRowSum(10), 505);
  assert.strictEqual(mod.evenValue(21, 5), 430);
  assert.deepStrictEqual(mod.evenAddress(80), { row: 9, position: 4 });
  assert.strictEqual(mod.wideValue(12, 23), 144);
  assert.deepStrictEqual(mod.wideAddress(83), { row: 10, position: 2 });
  assert.strictEqual(mod.formatMathText("9^2 and (row - 1)^2"), "9² and (row - 1)²");

  assertCorrect(item("consecutive.row-length", 0), { value: "12" });
  assertCorrect(item("consecutive.row-end", 1), { value: "210" });
  assertCorrect(item("consecutive.seat-value", 0), { value: "215" });
  assertWrong(item("consecutive.seat-value", 0), { value: "210" }, "wrong_number");
  assertCorrect(item("consecutive.row-sum", 0), { value: "505" });
  assertCorrect(item("consecutive.find-address", 0), { row: "11", position: "5" });
  assertWrong(item("consecutive.find-address", 0), { row: "11", position: "4" }, "position_error");
  assertCorrect(item("even.seat-value", 0), { value: "430" });
  assertWrong(item("even.seat-value", 0), { value: "215" }, "forgot_to_double");
  assertCorrect(item("even.find-address", 0), { row: "9", position: "4" });
  assertCorrect(item("wide.seat-value", 0), { value: "144" });
  assertCorrect(item("wide.seat-value", 2), { row: "10", position: "2" });

  for (const classicId of mod.CLASSIC_IDS) {
    const generated = item(classicId, 0);
    assert.strictEqual(generated.classicId, classicId);
    assert.ok(generated.prompt.includes("triangle"));
    const rendered = mod.renderProblemVisual(generated, "initial");
    assert.ok(rendered.svg.includes('role="img"'));
    assert.ok(rendered.text.length > 20);
  }

  const html = fs.readFileSync(path.join(__dirname, "consecutive_triangles_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "consecutive_triangles_module.css"), "utf8");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "intro-voice-toggle", "practice-grid", "answer-host", "feedback", "round-recap"]) {
    assert.ok(html.includes(`id="${id}"`), `HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".intro-storyboard", ".choice-card", ".address-grid", ".voice-toggle", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `CSS should include ${token}`);
  }
}

run();
console.log("All Consecutive Number Triangles module tests passed.");
