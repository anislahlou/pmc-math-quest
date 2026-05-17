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

function assertNoInitialLeak(problem) {
  const html = mod.renderProblemVisual(problem, "initial").html;
  const visual = problem.visual;
  assert.ok(!html.includes("Answer:"), `${problem.id} initial visual should not show answer text`);
  if (visual.type === "isoscelesChoice") {
    assert.ok(!html.includes(`base ${visual.base}`), `${problem.id} initial visual should not reveal the chosen base`);
  }
  if (visual.type === "right" && visual.missing === "c") {
    assert.ok(!html.includes(`>${problem.expected}<`), `${problem.id} initial visual should not reveal the hypotenuse`);
  }
  if (visual.type === "shared") {
    assert.ok(!html.includes(`h ${visual.height}`), `${problem.id} initial visual should not reveal the shared height`);
  }
  if (visual.type === "areaPerimeter") {
    assert.ok(!html.includes(`height ${visual.height}`), `${problem.id} initial visual should not reveal the height`);
    assert.ok(!html.includes(`>${visual.equal}<`), `${problem.id} initial visual should not reveal the equal side`);
  }
}

function run() {
  assert.strictEqual(mod.CLASSIC_IDS.length, 8);
  assert.strictEqual(mod.INTRO_SCENES.length, 8);
  assert.deepStrictEqual(
    mod.INTRO_SCENES.map((scene) => scene.classicId),
    mod.CLASSIC_IDS,
    "Every named Triangle Sides skill must have one aligned intro scene"
  );
  assert.strictEqual(mod.formatMathText("a^2 + b^2 = c^2"), "a² + b² = c²");
  assert.strictEqual(mod.parseNumber("32 cm"), 32);

  for (const [index, scene] of mod.INTRO_SCENES.entries()) {
    assert.ok(scene.purpose.length > 20, `${scene.title} needs a clear child-facing purpose`);
    assert.ok(scene.caption.length > 60, `${scene.title} needs visual explanation before practice`);
    assert.ok(scene.voiceover.length > 80, `${scene.title} needs teacher-like narration`);
    assert.ok(scene.audio && scene.audio.endsWith(".wav"), `${scene.title} needs bundled narration audio`);
    assert.ok(scene.durationMs >= 7500, `${scene.title} needs enough time for narration`);
    const audioPath = path.join(__dirname, scene.audio);
    assert.ok(fs.existsSync(audioPath), `${scene.title} audio file should exist at ${scene.audio}`);
    assert.ok(fs.statSync(audioPath).size > 100000, `${scene.title} audio file should not be empty`);
    assert.ok(mod.renderIntroScene(index).includes('role="img"'), `${scene.title} should render as a visual intro scene`);
  }

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
    assertNoInitialLeak(problem);
  }

  const html = fs.readFileSync(path.join(__dirname, "triangle_sides_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "triangle_sides_module.css"), "utf8");
  assert.ok(!html.includes("a² + b² = c²"), "Opening intro card should not show the Pythagorean formula before the visual bridge");
  assert.ok(html.includes("right-angle side builder"), "Opening intro card should name the skill without leading with the formula");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "intro-audio", "intro-audio-player", "intro-audio-status", "intro-progress-fill", "intro-voiceover", "practice-grid", "answer-host", "similar-button", "feedback", "round-recap", "live-score"]) {
    assert.ok(html.includes(`id="${id}"`), `Triangle sides HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".choice-card", ".visual-frame", ".feedback-card", ".voiceover-card", ".audio-status", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `Triangle sides CSS should include ${token}`);
  }
  const js = fs.readFileSync(path.join(__dirname, "triangle_sides_module.js"), "utf8");
  for (const token of ["speechSynthesis", "SpeechSynthesisUtterance", "intro-audio-player", ".wav", "speakIntroSceneFallback", "speakIntroScene"]) {
    assert.ok(js.includes(token), `Triangle sides JS should include audio hook ${token}`);
  }
}

if (require.main === module) {
  run();
  console.log("All Triangle Sides module tests passed.");
}

module.exports = { run };
