const assert = require("assert");
const mod = require("./volume_prisms_module.js");

const REQUIRED_CLASSICS = [
  "cuboid-warmup",
  "base-area-stack",
  "hollow-prism",
  "hollow-height",
  "composite-cross-section",
  "water-rise-volume",
  "new-water-level",
  "full-tank-removal",
  "partial-submerged-block",
  "extensive-cross-section"
];

const SOURCE_COPY_RISKS = [
  "length 10cm, width 8cm and height 20cm",
  "6cm x 6cm square base has a 4cm x 4cm square hole",
  "length of 20 cm, a width of 12 cm, and a height of 20 cm",
  "base area of 50cm^2 and a height of 15cm",
  "ABCF is a square of side 12 cm"
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
        assert.ok(!problem.prompt.includes(risky), `${problem.id} repeats source numbers too literally: ${risky}`);
      }
      const solutionVisual = mod.renderProblemVisual(problem, "solution");
      assert.ok(solutionVisual.html.includes("data-label-for"), `${problem.id} visual labels should be anchored`);
      assert.ok(solutionVisual.html.includes("Answer:"), `${problem.id} visual solution should show an answer`);
      assert.ok(solutionVisual.text.length > 25, `${problem.id} visual explanation should not be empty`);
      if (classicId === "base-area-stack") {
        if (problem.visual.shape.includes("triangular")) {
          assert.ok(solutionVisual.html.includes('data-shape="triangular-prism"'), `${problem.id} should draw a triangular prism`);
          assert.ok(!solutionVisual.html.includes('data-shape="cylinder-style-prism"'), `${problem.id} should not draw a cylinder for a triangular prism`);
        }
        if (problem.visual.shape.includes("cylinder-style")) {
          assert.ok(solutionVisual.html.includes('data-shape="cylinder-style-prism"'), `${problem.id} should draw the cylinder-style prism only when named`);
        }
      }
      if (classicId === "composite-cross-section" && problem.visual.shape === "house") {
        for (const label of ["front width", "rectangle height", "triangle height", "prism length"]) {
          assert.ok(solutionVisual.html.includes(label), `${problem.id} house visual should label ${label}`);
        }
      }
      promptSet.add(problem.prompt);
      answerModes.add(problem.answerMode);
      visuals.add(problem.visual.type);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, `${problem.id} needs one correct choice`);
        correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(promptSet.size >= 8, `${classicId} must vary prompts and numbers`);
    assert.ok(answerModes.has("choice") && answerModes.has("filled"), `${classicId} must mix answer formats`);
    assert.ok(correctChoicePositions.size >= 2, `${classicId} must vary correct multiple-choice positions`);
    assert.ok(visuals.size >= 1, `${classicId} must have a diagram type`);
  }

  assert.strictEqual(mod.INTRO_SCENES.length, 9);
  for (const scene of mod.INTRO_SCENES) {
    assert.ok(scene.caption.length > 50, `${scene.title} needs teacher-like narration`);
    assert.ok(mod.renderIntroScene(mod.INTRO_SCENES.indexOf(scene)).includes('role="img"'), `${scene.title} should render as a visual scene`);
  }

  console.log("Independent Volume of Prisms bank audit passed for " + (REQUIRED_CLASSICS.length * 24) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
