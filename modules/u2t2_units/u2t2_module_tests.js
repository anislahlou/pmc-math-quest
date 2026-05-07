const assert = require("assert");
const fs = require("fs");
const path = require("path");
const mod = require("./u2t2_module.js");

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
  assert.strictEqual(mod.MODULE_IDS.length, 16);
  assert.strictEqual(mod.gcd(45, 27), 9);
  assert.deepStrictEqual(mod.simplifyFraction(18, 33), { numerator: 6, denominator: 11 });
  assert.strictEqual(mod.triangular(10), 55);
  assert.strictEqual(mod.isPrime(419), true);
  assert.strictEqual(mod.isPrime(847), false);
  assert.strictEqual(mod.factorString(84), "2^2 x 3 x 7");
  assert.strictEqual(mod.formatMathText("5^1, x^2, cm^3, 2^(row - 1)"), "5¹, x², cm³, 2⁽ʳᵒʷ⁻¹⁾");
  assert.strictEqual(mod.normalizeExpression("12x²"), mod.normalizeExpression("12x^2"));
  assert.deepStrictEqual(mod.parseRatio("45:27"), [5, 3]);
  assert.strictEqual(mod.parseNumber("34/15"), 34 / 15);
  assert.strictEqual(mod.generateProblem("place-value-scales", 0).expected, 900000);
  assert.strictEqual(mod.CHALLENGE_VARIANTS_PER_MODULE, 10);
  assert.strictEqual(typeof mod.generateChallengeProblem, "function");

  for (const moduleId of mod.MODULE_IDS) {
    const uniquePrompts = new Set();
    const classics = new Set();
    const answerModes = new Set();
    const correctChoicePositions = new Set();
    for (let variant = 0; variant < 16; variant += 1) {
      const problem = mod.generateProblem(moduleId, variant);
      assert.strictEqual(problem.moduleId, moduleId);
      assert.ok(problem.prompt.length >= 15, `${moduleId} variant ${variant} needs a prompt`);
      assert.ok(problem.hint1.length >= 8, `${moduleId} variant ${variant} needs hint1`);
      assert.ok(problem.hint2.length >= 8, `${moduleId} variant ${variant} needs hint2`);
      assert.ok(problem.solution.length > 10, `${moduleId} variant ${variant} needs a solution`);
      assert.ok(problem.expectedDisplay.length > 0, `${moduleId} variant ${variant} needs expected display`);
      assertCorrect(problem);
      assertWrong(problem);
      const rendered = mod.renderProblemVisual(problem, "solution");
      assert.ok(rendered.html.includes('role="img"'), `${moduleId} variant ${variant} needs a visual role`);
      assert.ok(rendered.html.includes("Answer:"), `${moduleId} variant ${variant} solution visual should show answer`);
      uniquePrompts.add(problem.prompt);
      classics.add(problem.classic);
      answerModes.add(problem.answerType === "choice" ? "choice" : "filled");
      if (problem.answerType === "choice") {
        correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(classics.size >= 4, `${moduleId} should cover at least 4 named classics`);
    assert.ok(uniquePrompts.size >= 4, `${moduleId} should generate multiple prompt forms`);
    assert.ok(answerModes.has("choice") && answerModes.has("filled"), `${moduleId} should mix choice and filled-answer formats`);
    assert.ok(correctChoicePositions.size >= 2, `${moduleId} should vary the correct multiple-choice position`);

    const challengePrompts = new Set();
    const challengeClassics = new Set();
    const challengeModes = new Set();
    for (let variant = 0; variant < mod.CHALLENGE_VARIANTS_PER_MODULE; variant += 1) {
      const problem = mod.generateChallengeProblem(moduleId, variant);
      assert.strictEqual(problem.moduleId, moduleId);
      assert.strictEqual(problem.isChallenge, true, `${moduleId} challenge ${variant} should be marked as challenge`);
      assert.ok(problem.classic.startsWith("Challenge:"), `${moduleId} challenge ${variant} should be labelled Challenge`);
      assert.ok(problem.prompt.includes("Challenge:"), `${moduleId} challenge ${variant} prompt should be labelled Challenge`);
      assert.ok(problem.source.includes("JMC/PMC-inspired"), `${moduleId} challenge ${variant} should record the challenge inspiration`);
      assert.ok(problem.prompt.length >= 20, `${moduleId} challenge ${variant} needs a prompt`);
      assert.ok(problem.hint1.length >= 8, `${moduleId} challenge ${variant} needs hint1`);
      assert.ok(problem.hint2.length >= 8, `${moduleId} challenge ${variant} needs hint2`);
      assert.ok(problem.solution.length > 10, `${moduleId} challenge ${variant} needs a solution`);
      assert.ok(problem.expectedDisplay.length > 0, `${moduleId} challenge ${variant} needs expected display`);
      assertCorrect(problem);
      assertWrong(problem);
      const rendered = mod.renderProblemVisual(problem, "solution");
      assert.ok(rendered.html.includes('role="img"'), `${moduleId} challenge ${variant} needs a visual role`);
      assert.ok(rendered.html.includes("Answer:"), `${moduleId} challenge ${variant} solution visual should show answer`);
      challengePrompts.add(problem.prompt);
      challengeClassics.add(problem.classic);
      challengeModes.add(problem.answerType === "choice" ? "choice" : "filled");
    }
    assert.ok(challengePrompts.size >= 10, `${moduleId} should have at least 10 unique challenge prompts`);
    assert.ok(challengeClassics.size >= 10, `${moduleId} should have at least 10 named challenge classics`);
    assert.ok(challengeModes.has("choice") && challengeModes.has("filled"), `${moduleId} challenges should mix choice and filled-answer formats`);
  }

  const html = fs.readFileSync(path.join(__dirname, "u2t2_submodule.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "u2t2_module.css"), "utf8");
  const mapHtml = fs.readFileSync(path.join(__dirname, "u2t2_units_mission.html"), "utf8");
  for (const id of ["intro-screen", "module-chips", "practice-grid", "answer-host", "similar-button", "feedback", "round-recap"]) {
    assert.ok(html.includes(`id="${id}"`), `U2T2 app should include ${id}`);
  }
  assert.ok(html.includes('data-action="challenge"'), "U2T2 app should include a challenge launch action");
  for (const token of [".intro-screen", ".module-chip", ".choice-card", ".repair-button", ".visual-frame", ".round-recap", ".challenge-action"]) {
    assert.ok(css.includes(token), `U2T2 CSS should include ${token}`);
  }
  for (const moduleId of mod.MODULE_IDS) {
    assert.ok(mapHtml.includes(`u2t2_submodule.html#${moduleId}`), `Mission map should link to ${moduleId}`);
  }
}

if (require.main === module) {
  run();
  console.log("All U2T2 module tests passed.");
}

module.exports = { run };
