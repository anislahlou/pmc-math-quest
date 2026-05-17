const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./equal_height_triangles_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function assertCorrect(problem) {
  const result = mod.checkAnswer(problem, problem.correctInput);
  assert.strictEqual(result.isCorrect, true, `${problem.id} should accept ${JSON.stringify(problem.correctInput)}`);
}

function assertWrong(problem) {
  const wrong = problem.commonWrongInputs && problem.commonWrongInputs[0]
    ? problem.commonWrongInputs[0]
    : problem.answerType === "choice"
      ? { choice: "__wrong__" }
      : problem.answerType === "multi"
        ? { choices: [] }
        : { value: "__wrong__" };
  const result = mod.checkAnswer(problem, wrong);
  assert.strictEqual(result.isCorrect, false, `${problem.id} should reject a known wrong answer`);
}

function assertNoInitialLeak(problem) {
  const rendered = mod.renderProblemVisual(problem, "initial");
  assert.ok(!rendered.html.includes("Answer:"), `${problem.id} initial visual should not show answer text`);
  assert.ok(!rendered.html.includes("data-derived-value"), `${problem.id} initial visual should not include derived answer payload`);
  if (["ratioParallel", "slidingApex", "multiLine", "splitBase", "difference", "algebra", "equalAreaReverse", "equalPairs"].includes(problem.visual.type)) {
    assert.ok(!rendered.html.includes("same height</text>"), `${problem.id} initial visual should not draw the same-height hint before the child asks`);
  }
  if (problem.visual.type === "reverseArea" && problem.visual.base == null) {
    assert.ok(!rendered.html.includes(`base ${problem.expected} cm`), `${problem.id} initial visual should not reveal missing base`);
  }
  if (problem.visual.type === "reverseArea" && problem.visual.height == null) {
    assert.ok(!rendered.html.includes(`height ${problem.expected} cm`), `${problem.id} initial visual should not reveal missing height`);
  }
}

function wavDurationMs(audioPath) {
  const buffer = fs.readFileSync(audioPath);
  let offset = 12;
  let byteRate = 0;
  let dataSize = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    if (id === "fmt ") byteRate = buffer.readUInt32LE(offset + 16);
    if (id === "data") {
      dataSize = size;
      break;
    }
    offset += 8 + size + (size % 2);
  }
  return Math.ceil((dataSize / byteRate) * 1000);
}

function run() {
  assert.strictEqual(mod.CLASSIC_IDS.length, 10);
  assert.strictEqual(mod.INTRO_SCENES.length, 10);
  assert.strictEqual(mod.WARMUP_QUESTIONS.length, 4);
  assert.strictEqual(mod.formatMathText("cm^2 and 5^2"), "cm\u00b2 and 5\u00b2");
  assert.strictEqual(mod.normaliseRatio("6/9"), "2:3");
  assert.strictEqual(mod.normaliseRatio("6 to 9"), "2:3");
  assert.strictEqual(mod.parseNumber("24 cm\u00b2"), 24);

  const introClassicIds = new Set(mod.INTRO_SCENES.map((scene) => scene.classicId));
  for (const classicId of mod.CLASSIC_IDS) {
    assert.ok(introClassicIds.has(classicId), `${classicId} must be introduced before practice`);
  }

  for (const [index, scene] of mod.INTRO_SCENES.entries()) {
    assert.ok(scene.purpose.length > 20, `${scene.title} needs a child-facing purpose`);
    assert.ok(scene.caption.length > 60, `${scene.title} needs visual explanation`);
    assert.ok(scene.voiceover.length > 120, `${scene.title} needs narrative teacher voiceover`);
    assert.ok(scene.audio && scene.audio.endsWith(".wav"), `${scene.title} needs bundled narration audio`);
    assert.ok(scene.durationMs >= 9000, `${scene.title} needs enough time for narration`);
    const audioPath = path.join(__dirname, scene.audio);
    assert.ok(fs.existsSync(audioPath), `${scene.title} audio file should exist at ${scene.audio}`);
    assert.ok(fs.statSync(audioPath).size > 100000, `${scene.title} audio file should not be empty`);
    assert.ok(scene.durationMs >= wavDurationMs(audioPath) + 400, `${scene.title} scene timer must not cut off narration audio`);
    assert.ok(mod.renderIntroScene(index).includes('role="img"'), `${scene.title} should render as a visual intro scene`);
  }

  assert.strictEqual(item("area-formula", 0).expected, 12);
  assert.strictEqual(item("equal-height-base-ratio", 1).expected, 27);
  assert.strictEqual(item("same-base-height", 0).expected, 24);
  assert.strictEqual(item("reverse-from-area", 0).expected, 5);
  assert.strictEqual(item("multi-triangle-height", 0).expected, 25);
  assert.strictEqual(item("shared-base-split", 0).expected, 42);
  assert.strictEqual(item("compound-difference", 0).expected, 7.5);
  assert.strictEqual(item("algebraic-targets", 0).expected, 3);
  assert.strictEqual(item("equal-area-reverse", 0).expected, 7);
  assert.strictEqual(item("diagram-interpretation", 1).expected, 25);

  for (const classicId of mod.CLASSIC_IDS) {
    const problem = item(classicId, 0);
    assert.strictEqual(problem.classicId, classicId);
    assert.ok(problem.prompt.length > 35, `${problem.id} needs a useful prompt`);
    assert.ok(problem.hint1.length > 15, `${problem.id} needs hint1`);
    assert.ok(problem.hint2.length > 15, `${problem.id} needs hint2`);
    assert.ok(problem.solution.length > 25, `${problem.id} needs worked solution`);
    assert.ok(problem.sourcePages.includes("Book"), `${problem.id} needs source tracking`);
    assert.ok(problem.sourcePages.includes("PDF"), `${problem.id} needs PDF caveat tracking`);
    assert.ok(mod.validateProblemMath(problem), `${problem.id} formula audit failed`);
    assertCorrect(problem);
    assertWrong(problem);
    const solution = mod.renderProblemVisual(problem, "solution");
    assert.ok(solution.html.includes('role="img"'), `${problem.id} needs accessible visual`);
    assert.ok(solution.html.includes("data-label-for"), `${problem.id} needs anchored visual labels`);
    assert.ok(solution.html.includes("Answer:"), `${problem.id} solution visual should show answer`);
    assert.ok(solution.text.length > 25, `${problem.id} visual text should explain the diagram`);
    assertNoInitialLeak(problem);
  }

  for (let index = 0; index < 12; index += 1) {
    const problem = mod.generateChallengeProblem(index);
    assert.ok(problem.prompt.startsWith("Challenge:"), `${problem.id} challenge prompt should be labelled`);
    assert.ok(problem.classic.startsWith("Challenge:"), `${problem.id} challenge classic should be labelled`);
    assert.ok(problem.source.includes("JMC/PMC-inspired"), `${problem.id} should carry challenge source note`);
    assert.ok(mod.validateProblemMath(problem), `${problem.id} challenge formula audit failed`);
    assertCorrect(problem);
    assertWrong(problem);
    assertNoInitialLeak(problem);
  }
  assert.strictEqual(mod.generateChallengeProblem(2).expected, 10, "Equal Area Expression challenge should solve its displayed equation");
  assert.strictEqual(mod.generateChallengeProblem(9).expected, 10, "Reverse total challenge should solve its displayed equation");

  const html = fs.readFileSync(path.join(__dirname, "equal_height_triangles_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "equal_height_triangles_module.css"), "utf8");
  const js = fs.readFileSync(path.join(__dirname, "equal_height_triangles_module.js"), "utf8");

  assert.ok(!html.includes("base x height / 2</h2>"), "Opening card should not lead with the formula as the main heading");
  assert.ok(html.includes("same height means areas follow bases"), "Opening card should name the core learning outcome");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "intro-audio", "intro-audio-player", "intro-audio-status", "intro-progress-fill", "intro-voiceover", "warmup-form", "warmup-gate", "practice-grid", "answer-host", "similar-button", "feedback", "round-recap", "live-score", "challenge-round-button"]) {
    assert.ok(html.includes(`id="${id}"`), `Equal Height module HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".warmup-card", ".choice-card", ".visual-frame", ".feedback-card", ".voiceover-card", ".audio-status", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `Equal Height CSS should include ${token}`);
  }
  for (const token of ["speechSynthesis", "SpeechSynthesisUtterance", "intro-audio-player", ".wav", "speakIntroSceneFallback", "speakIntroScene", "checkWarmup", "generateChallengeProblem"]) {
    assert.ok(js.includes(token), `Equal Height JS should include ${token}`);
  }
}

if (require.main === module) {
  run();
  console.log("All Equal Height Triangles module tests passed.");
}

module.exports = { run };
