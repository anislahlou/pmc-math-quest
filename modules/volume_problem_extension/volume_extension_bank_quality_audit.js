const assert = require("assert");
const mod = require("./volume_extension_module.js");

const REQUIRED_CLASSICS = [
  "layer-count-core",
  "layer-map-sum",
  "adjacent-cube-build",
  "cross-tunnel-overlap",
  "side-slice-tunnel",
  "height-map-volume",
  "staircase-stack",
  "front-left-view",
  "view-rebuild",
  "reverse-missing-layer",
  "water-cube-rise",
  "compare-layer-solids"
];

const SOURCE_COPY_RISKS = [
  "9-1=8",
  "finished the first layer",
  "complete the other two layers"
];

function run() {
  assert.deepStrictEqual(mod.CLASSIC_IDS, REQUIRED_CLASSICS);

  for (const classicId of REQUIRED_CLASSICS) {
    assert.ok(mod.SOURCE_COVERAGE[classicId], `${classicId} needs source coverage notes`);
    assert.ok(mod.SOURCE_COVERAGE[classicId].length >= 1, `${classicId} needs source coverage entries`);

    const promptSet = new Set();
    const answerModes = new Set();
    const correctChoicePositions = new Set();
    const visuals = new Set();
    for (let variant = 0; variant < 24; variant += 1) {
      const problem = mod.generateProblem(classicId, variant);
      assert.ok(mod.validateProblemMath(problem), `${problem.id} formula audit failed`);
      assert.ok(problem.skill && problem.skill.length > 30, `${problem.id} should map back to a named skill`);
      assert.ok(problem.sourcePages.includes("Book"), `${problem.id} should carry book source pages`);
      assert.ok(problem.sourcePages.includes("PDF"), `${problem.id} should carry PDF source pages`);
      assert.ok(!problem.prompt.includes("^"), `${problem.id} should display powers as superscripts`);
      assert.ok(!problem.solution.includes("^"), `${problem.id} solution should display powers as superscripts`);
      for (const risky of SOURCE_COPY_RISKS) {
        assert.ok(!problem.prompt.includes(risky), `${problem.id} repeats source wording too literally: ${risky}`);
      }
      const solutionVisual = mod.renderProblemVisual(problem, "solution");
      assert.ok(solutionVisual.html.includes("data-label-for"), `${problem.id} visual labels should be anchored`);
      assert.ok(solutionVisual.html.includes("Answer:"), `${problem.id} visual solution should show an answer`);
      assert.ok(solutionVisual.text.length > 25, `${problem.id} visual explanation should not be empty`);
      if (classicId === "cross-tunnel-overlap") {
        assert.ok(solutionVisual.html.includes("share"), `${problem.id} should call out tunnel overlap`);
        assert.ok(solutionVisual.html.includes("centre layer: row and column tunnels"), `${problem.id} should show the centre layer tunnel cross`);
        assert.ok(solutionVisual.html.includes("each square is one cube in a layer"), `${problem.id} should make unit cubes visible`);
      }
      if (classicId === "side-slice-tunnel") {
        assert.ok(solutionVisual.html.includes("front slice: width by height"), `${problem.id} should show the front slice grid`);
        assert.ok(solutionVisual.html.includes("same missing slice repeats"), `${problem.id} should show the tunnel repeated through length`);
        assert.ok(solutionVisual.html.includes("tunnel opening"), `${problem.id} should anchor the tunnel opening label`);
      }
      if (classicId === "adjacent-cube-build") {
        assert.ok(solutionVisual.html.includes("plan of adjacent towers"), `${problem.id} should show the adjacent tower plan`);
        assert.ok(solutionVisual.html.includes("touching cubes still count"), `${problem.id} should explain adjacent cubes still count`);
        assert.ok(solutionVisual.html.includes("adjacent shared face"), `${problem.id} should mark touching faces`);
      }
      if (classicId === "staircase-stack") {
        assert.ok(solutionVisual.html.includes("front stair slice"), `${problem.id} should show the stair cross-section`);
        assert.ok(solutionVisual.html.includes("stair rows:"), `${problem.id} should label the row sum`);
        assert.ok(solutionVisual.html.includes("identical stair slices"), `${problem.id} should show length as repeated stair slices`);
        assert.ok(solutionVisual.html.includes("cross-section ="), `${problem.id} should label the cross-section count`);
      }
      if (classicId === "height-map-volume") {
        assert.ok(solutionVisual.html.includes("tower"), `${problem.id} should identify height-map numbers as towers`);
      }
      if (classicId === "front-left-view") {
        assert.ok(solutionVisual.html.includes("plan view with tower heights"), `${problem.id} should show a plan view`);
        assert.ok(solutionVisual.html.includes("view answer"), `${problem.id} should render the requested front/left view`);
        assert.ok(solutionVisual.html.includes("Answer:"), `${problem.id} should show the view-list answer`);
      }
      if (classicId === "view-rebuild") {
        assert.ok(solutionVisual.html.includes("front view"), `${problem.id} should render a front view`);
        assert.ok(solutionVisual.html.includes("left view"), `${problem.id} should render a left view`);
        assert.ok(solutionVisual.html.includes("front checks columns; left checks rows"), `${problem.id} should explain how views connect to the plan`);
      }
      promptSet.add(problem.prompt);
      answerModes.add(problem.answerMode);
      visuals.add(problem.visual.type);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, `${problem.id} needs one correct choice`);
        correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(promptSet.size >= 6, `${classicId} must vary prompts and numbers`);
    assert.ok(answerModes.has("choice") && answerModes.has("filled"), `${classicId} must mix answer formats`);
    assert.ok(correctChoicePositions.size >= 2, `${classicId} must vary correct multiple-choice positions`);
    assert.ok(visuals.size >= 1, `${classicId} must have a diagram type`);
  }

  assert.strictEqual(mod.INTRO_SCENES.length, 11);
  for (const scene of mod.INTRO_SCENES) {
    assert.ok(scene.caption.length > 50, `${scene.title} needs teacher-like narration`);
    assert.ok(mod.renderIntroScene(mod.INTRO_SCENES.indexOf(scene)).includes('role="img"'), `${scene.title} should render as a visual scene`);
  }

  console.log("Independent Volume Problem Extension bank audit passed for " + (REQUIRED_CLASSICS.length * 24) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
