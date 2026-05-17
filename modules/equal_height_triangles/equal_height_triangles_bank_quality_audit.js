const assert = require("assert");
const mod = require("./equal_height_triangles_module.js");

const REQUIRED_CLASSICS = [
  "area-formula",
  "equal-height-base-ratio",
  "same-base-height",
  "reverse-from-area",
  "multi-triangle-height",
  "shared-base-split",
  "compound-difference",
  "algebraic-targets",
  "equal-area-reverse",
  "diagram-interpretation"
];

function assertNoInitialVisualLeak(problem) {
  const rendered = mod.renderProblemVisual(problem, "initial");
  assert.ok(!rendered.html.includes("Answer:"), `${problem.id} initial visual must not show the answer banner`);
  assert.ok(!rendered.html.includes("data-derived-value"), `${problem.id} initial visual must not expose derived values`);
  if (problem.visual.type === "reverseArea" && problem.visual.base == null) {
    assert.ok(!rendered.html.includes(`base ${problem.expected} cm`), `${problem.id} initial visual must hide missing base`);
  }
  if (problem.visual.type === "reverseArea" && problem.visual.height == null) {
    assert.ok(!rendered.html.includes(`height ${problem.expected} cm`), `${problem.id} initial visual must hide missing height`);
  }
  if (["ratioParallel", "slidingApex", "splitBase", "multiLine", "difference", "algebra", "equalAreaReverse", "equalPairs"].includes(problem.visual.type)) {
    assert.ok(!rendered.html.includes("data-visual-state=\"initial\""), `${problem.id} initial visual should not render hint overlays`);
  }
}

function run() {
  assert.deepStrictEqual(mod.CLASSIC_IDS, REQUIRED_CLASSICS);

  for (const classicId of REQUIRED_CLASSICS) {
    assert.ok(mod.SOURCE_COVERAGE[classicId], `${classicId} needs source coverage notes`);
    assert.ok(mod.SOURCE_COVERAGE[classicId].length >= 1, `${classicId} needs at least one source coverage entry`);

    const promptSet = new Set();
    const answerModes = new Set();
    const correctChoicePositions = new Set();
    const visualTypes = new Set();
    const wrongPatternsRejected = [];

    for (let variant = 0; variant < 24; variant += 1) {
      const problem = mod.generateProblem(classicId, variant);
      assert.strictEqual(problem.classicId, classicId, `${problem.id} should stay in its classic`);
      assert.ok(problem.skill.length > 35, `${problem.id} should map to a named skill`);
      assert.ok(problem.sourcePages.includes("Book"), `${problem.id} should carry book/source evidence`);
      assert.ok(problem.sourcePages.includes("PDF"), `${problem.id} should carry PDF evidence or caveat`);
      assert.ok(mod.validateProblemMath(problem), `${problem.id} should pass independent formula audit`);
      assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, `${problem.id} should accept correct input`);
      for (const wrong of problem.commonWrongInputs || []) {
        assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, `${problem.id} should reject wrong input ${JSON.stringify(wrong)}`);
        wrongPatternsRejected.push(JSON.stringify(wrong));
      }
      const solution = mod.renderProblemVisual(problem, "solution");
      assert.ok(solution.html.includes('role="img"'), `${problem.id} should render an accessible diagram`);
      assert.ok(solution.html.includes("data-label-for"), `${problem.id} visual labels should be anchored`);
      assert.ok(solution.html.includes("data-anchor-id"), `${problem.id} labels should keep explicit anchors`);
      assert.ok(solution.html.includes("Answer:"), `${problem.id} solution should show the answer after checking`);
      assert.ok(solution.text.length > 25, `${problem.id} visual explanation should not be empty`);
      assertNoInitialVisualLeak(problem);

      promptSet.add(problem.prompt);
      answerModes.add(problem.answerMode);
      visualTypes.add(problem.visual.type);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, `${problem.id} needs one correct choice`);
        correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }

    assert.ok(promptSet.size >= 8, `${classicId} must vary prompts and numbers`);
    assert.ok(answerModes.size >= 1, `${classicId} needs answer mode tracking`);
    assert.ok(visualTypes.size >= 1, `${classicId} needs a diagram type`);
    assert.ok(wrongPatternsRejected.length >= 24, `${classicId} should reject registered traps`);
    if (correctChoicePositions.size > 0) {
      assert.ok(correctChoicePositions.size >= 2, `${classicId} should vary correct multiple-choice positions`);
    }
  }

  const challengePrompts = new Set();
  const challengeAnswerModes = new Set();
  const challengeVisuals = new Set();
  for (let index = 0; index < 12; index += 1) {
    const problem = mod.generateChallengeProblem(index);
    assert.ok(problem.prompt.startsWith("Challenge:"), `${problem.id} challenge prompt needs label`);
    assert.ok(problem.classic.startsWith("Challenge:"), `${problem.id} challenge classic needs label`);
    assert.ok(problem.source.includes("JMC/PMC-inspired"), `${problem.id} challenge source note missing`);
    assert.ok(mod.validateProblemMath(problem), `${problem.id} challenge formula audit failed`);
    assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, `${problem.id} challenge should accept correct input`);
    assertNoInitialVisualLeak(problem);
    challengePrompts.add(problem.prompt);
    challengeAnswerModes.add(problem.answerMode);
    challengeVisuals.add(problem.visual.type);
  }
  assert.ok(challengePrompts.size >= 10, "Challenge bank should contain at least ten distinct prompts");
  assert.ok(challengeAnswerModes.size >= 3, "Challenge bank should mix answer formats");
  assert.ok(challengeVisuals.size >= 6, "Challenge bank should use varied diagrams");

  const round = mod.createRound(25);
  const roundPrompts = new Set(round.map((problem) => problem.prompt));
  assert.strictEqual(round.length, REQUIRED_CLASSICS.length, "Routine round should cover every classic once");
  assert.strictEqual(roundPrompts.size, round.length, "Routine round should not repeat prompt templates");

  console.log("Independent Equal Height Triangles bank audit passed for " + (REQUIRED_CLASSICS.length * 24 + 12) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
