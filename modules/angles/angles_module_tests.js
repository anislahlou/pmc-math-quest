const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./angles_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function assertCorrect(problem, value) {
  const result = mod.checkAnswer(problem, { value });
  assert.strictEqual(result.isCorrect, true, `${problem.classicId} expected ${value} to be correct`);
}

function assertWrong(problem, value, errorClass) {
  const result = mod.checkAnswer(problem, { value });
  assert.strictEqual(result.isCorrect, false, `${problem.classicId} expected ${value} to be wrong`);
  assert.strictEqual(result.errorClass, errorClass);
}

function run() {
  assert.strictEqual(mod.CLASSIC_IDS.length, 12);
  assertCorrect(item("angles.triangle-sum", 0), "65");
  assertCorrect(item("angles.isosceles-base", 0), "75°");
  assertCorrect(item("angles.straight-line", 0), "50");
  assertCorrect(item("angles.alternate", 1), "73");
  assertWrong(item("angles.alternate", 1), "107", "parallel_pair_confusion");
  assertCorrect(item("angles.corresponding", 0), "115");
  assertCorrect(item("angles.co-interior", 0), "48");
  assertWrong(item("angles.co-interior", 0), "132", "cointerior_equal_confusion");
  const coInterior109 = mod.renderProblemVisual(item("angles.co-interior", 2), "worked").svg;
  assert.ok(coInterior109.includes('data-label-value="109°"'), "C-angle shown value should be tied to its own sector");
  assert.ok(coInterior109.includes('data-angle-size="109"'), "C-angle shown sector should visually match 109 degrees");
  assert.ok(coInterior109.includes('data-label-value="71°"'), "C-angle answer should be tied to its own sector");
  assert.ok(coInterior109.includes('data-angle-size="71"'), "C-angle answer sector should visually match 71 degrees");
  const corresponding115 = mod.renderProblemVisual(item("angles.corresponding", 0), "worked").svg;
  assert.ok(corresponding115.includes('data-label-value="115°"'));
  assert.ok(corresponding115.includes('data-angle-size="115"'));
  assertCorrect(item("angles.parallel-zigzag-total", 0), "190");
  assertCorrect(item("angles.parallel-chase", 0), "86");
  assertCorrect(item("angles.equilateral-chase", 0), "135");
  assertCorrect(item("angles.polygon-sum", 0), "900");
  assertWrong(item("angles.polygon-sum", 0), "129", "one_angle_as_polygon_total");
  assertCorrect(item("angles.regular-polygon", 0), "108");
  assertWrong(item("angles.regular-polygon", 0), "72", "exterior_as_interior");
  assertWrong(item("angles.regular-polygon", 0), "540", "polygon_total_as_one_angle");
  assertCorrect(item("angles.shape-combo", 0), "135");
  assertCorrect(item("angles.shape-combo", 1), "27");

  for (const classicId of mod.CLASSIC_IDS) {
    const generated = item(classicId, 0);
    assert.strictEqual(generated.classicId, classicId);
    assert.ok(generated.prompt.length > 20);
    assert.ok(Array.isArray(generated.choices));
    assert.strictEqual(generated.choices.filter((choice) => choice.isCorrect).length, 1);
    const rendered = mod.renderProblemVisual(generated, "initial");
    assert.ok(rendered.svg.includes('role="img"'));
    assert.ok(rendered.text.length > 20);
  }

  const html = fs.readFileSync(path.join(__dirname, "angles_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "angles_module.css"), "utf8");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "intro-voice-toggle", "practice-grid", "answer-host", "feedback", "round-recap"]) {
    assert.ok(html.includes(`id="${id}"`), `HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".intro-storyboard", ".choice-card", ".voice-toggle", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `CSS should include ${token}`);
  }
}

run();
console.log("All Angles module tests passed.");

