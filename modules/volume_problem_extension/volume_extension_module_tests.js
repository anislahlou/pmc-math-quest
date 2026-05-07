const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./volume_extension_module.js");

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
  assert.strictEqual(mod.CLASSIC_IDS.length, 12);
  assert.strictEqual(item("layer-count-core", 0).expected, 24);
  assert.strictEqual(item("adjacent-cube-build", 0).expected, 8);
  assert.strictEqual(item("cross-tunnel-overlap", 0).expected, 22);
  assert.strictEqual(item("side-slice-tunnel", 0).expected, 70);
  assert.strictEqual(item("height-map-volume", 0).expected, 14);
  assert.strictEqual(item("staircase-stack", 0).expected, 24);
  assert.strictEqual(item("front-left-view", 0).expectedText, "3, 1, 1");
  assert.strictEqual(item("front-left-view", 1).expectedText, "2, 3, 1");
  assert.strictEqual(item("reverse-missing-layer", 0).expected, 1);
  assert.strictEqual(item("water-cube-rise", 0).expected, 0.4);

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
    assert.ok(uniquePrompts.size >= 6, `${classicId} should generate fresh-number prompt variety`);
    assert.ok(answerModes.has("choice") && answerModes.has("filled"), `${classicId} should mix choice and typed answers`);
    assert.ok(correctChoicePositions.size >= 2, `${classicId} should vary the correct choice position`);

    const original = item(classicId, 0);
    const similarIndex = mod.findSimilarVariant(original, 0);
    const similar = item(classicId, similarIndex);
    assert.notStrictEqual(similar.prompt, original.prompt, `${classicId} similar repair should use fresh numbers`);
  }

  const overlapVisual = mod.renderProblemVisual(item("cross-tunnel-overlap", 0), "solution").html;
  assert.ok(overlapVisual.includes("centre layer: row and column tunnels"), "Tunnel overlap should show the centre-layer cross, not a floating cutout");
  assert.ok(overlapVisual.includes("each square is one cube in a layer"), "Tunnel overlap should make unit cubes visible");
  assert.ok(overlapVisual.includes("centre cube is shared"), "Tunnel overlap should label the shared centre cube");
  assert.ok(overlapVisual.includes("count it once"), "Tunnel overlap should explain why the overlap is only counted once");

  const sideTunnelVisual = mod.renderProblemVisual(item("side-slice-tunnel", 0), "solution").html;
  assert.ok(sideTunnelVisual.includes("front slice: width by height"), "Side tunnel should show the front slice grid");
  assert.ok(sideTunnelVisual.includes("width = 4"), "Side tunnel should anchor width to the front slice");
  assert.ok(sideTunnelVisual.includes("height = 4"), "Side tunnel should anchor height to the front slice");
  assert.ok(sideTunnelVisual.includes("same missing slice repeats"), "Side tunnel should show the tunnel as repeated length slices");
  assert.ok(sideTunnelVisual.includes("through the full length = 5"), "Side tunnel should label length separately from width and height");

  const stairVisual = mod.renderProblemVisual(item("staircase-stack", 0), "solution").html;
  assert.ok(stairVisual.includes("front stair slice"), "Stair stack should show the front stair slice");
  assert.ok(stairVisual.includes("stair rows: 1 + 2 + 3"), "Stair stack should expose the row count");
  assert.ok(stairVisual.includes("4 identical stair slices"), "Stair stack should show length as repeated slices");
  assert.ok(stairVisual.includes("cross-section = 6 cubes"), "Stair stack should label the cross-section count");
  assert.ok(stairVisual.includes("6 x 4 length slices"), "Stair stack should connect cross-section count to length");

  const adjacentVisual = mod.renderProblemVisual(item("adjacent-cube-build", 0), "solution").html;
  assert.ok(adjacentVisual.includes("plan of adjacent towers"), "Adjacent cubes should show the tower plan");
  assert.ok(adjacentVisual.includes("red edges show touching faces"), "Adjacent cubes should label touching faces");
  assert.ok(adjacentVisual.includes("touching cubes still count"), "Adjacent cubes should warn that hidden faces do not remove cubes");
  assert.ok(adjacentVisual.includes("row totals = 3 + 4 + 1"), "Adjacent cubes should expose row totals in the worked state");

  const frontViewVisual = mod.renderProblemVisual(item("front-left-view", 0), "solution").html;
  assert.ok(frontViewVisual.includes("front view = tallest column heights"), "Front view exercise should state the column rule");
  assert.ok(frontViewVisual.includes("Answer: 3, 1, 1"), "Front view exercise should show the view-list answer");
  const leftViewVisual = mod.renderProblemVisual(item("front-left-view", 1), "solution").html;
  assert.ok(leftViewVisual.includes("left view = tallest row heights"), "Left view exercise should state the row rule");
  assert.ok(leftViewVisual.includes("Answer: 2, 3, 1"), "Left view exercise should show the view-list answer");

  const html = fs.readFileSync(path.join(__dirname, "volume_extension_module.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "volume_extension_module.css"), "utf8");
  const js = fs.readFileSync(path.join(__dirname, "volume_extension_module.js"), "utf8");
  for (const id of ["intro-screen", "intro-frame", "intro-play", "intro-voice-toggle", "practice-grid", "answer-host", "similar-button", "feedback", "round-recap", "live-score", "question-strip"]) {
    assert.ok(html.includes(`id="${id}"`), `Volume extension HTML should include ${id}`);
  }
  for (const token of [".intro-screen", ".intro-storyboard", ".question-jump", ".choice-card", ".repair-button", ".visual-frame", "overflow-x: hidden"]) {
    assert.ok(css.includes(token), `Volume extension CSS should include ${token}`);
  }
  for (const token of ["data-scene-index", "data-question-index", "goToQuestion", "updateSessionUI", "VolumeExtensionModule"]) {
    assert.ok(js.includes(token), `Volume extension JS should include ${token}`);
  }
}

if (require.main === module) {
  run();
  console.log("All Volume Problem Extension module tests passed.");
}

module.exports = { run };
