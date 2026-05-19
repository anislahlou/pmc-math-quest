const assert = require("assert");
const mod = require("./algebraic_word_puzzles_module.js");

// Bank audit for Algebraic Word Puzzles. Asserts that every variant of
// every classic produces an integer answer, accepts its correct input,
// rejects wrong input, carries a valid skillTag from the registry-allowed
// set, has a 4-option choice set with exactly one correct choice (when in
// choice mode), and that the solution we generate matches an independent
// re-solving of the prompt for the canonical source problems.

const ALLOWED_SKILLS = new Set([
  "Variable substitution",
  "Self-exclusion counting",
  "System of equations",
  "Pair-sum decomposition",
  "Missing-pair logic"
]);

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length === 6, "module must expose 6 classics");

  let totalProblems = 0;
  for (const classicId of mod.CLASSIC_IDS) {
    assert.ok(mod.SOURCE_COVERAGE[classicId], classicId + " needs source coverage");
    const prompts = new Set();
    const choicePositions = new Set();
    for (let variant = 0; variant < 16; variant += 1) {
      const problem = mod.generateProblem(classicId, variant);
      assert.ok(problem, classicId + "/" + variant + " should produce a problem");
      assert.ok(problem.skill.length > 25, problem.id + " should map to a named skill");
      assert.ok(problem.sourcePages.includes("Book"), problem.id + " should carry book page evidence");
      assert.ok(problem.sourcePages.includes("PDF"), problem.id + " should carry PDF page evidence");
      assert.ok(mod.validateProblemMath(problem), problem.id + " should pass math validation");

      // Integer answer requirement
      assert.ok(Number.isInteger(Number(problem.expected)), problem.id + " answer must be integer, got " + problem.expected);

      // skillTag validity
      assert.ok(ALLOWED_SKILLS.has(problem.skillTag), problem.id + " skillTag '" + problem.skillTag + "' not in registry skills");

      // accept correct
      assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, problem.id + " should accept correct input");
      // reject wrong
      const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
      assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, problem.id + " should reject wrong input");

      // visual: initial has no Answer banner; solution does
      const visual = mod.renderProblemVisual(problem, "solution");
      assert.ok(visual.html.includes('role="img"'), problem.id + " should render an accessible visual");
      assert.ok(visual.text.length > 20, problem.id + " visual text should explain the diagram");
      const initialVisual = mod.renderProblemVisual(problem, "initial");
      assert.ok(!initialVisual.html.includes("Answer:"), problem.id + " initial visual must not include the answer banner");

      // choice set integrity (only for choice problems)
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.length, 4, problem.id + " needs exactly 4 choices");
        const correctCount = problem.choices.filter((c) => c.isCorrect).length;
        assert.strictEqual(correctCount, 1, problem.id + " needs exactly one correct choice");
        choicePositions.add(problem.choices.findIndex((c) => c.isCorrect));
      }

      prompts.add(problem.prompt);
      totalProblems += 1;
    }
    assert.ok(prompts.size >= 4, classicId + " needs >= 4 distinct prompts across variants");
    if (choicePositions.size > 0) {
      assert.ok(choicePositions.size >= 2, classicId + " should vary correct multiple-choice positions");
    }
  }

  // Re-solve canonical Problem 1 (hat-system-3, variant 0): expect G=13.
  const canonical1 = mod.generateProblem("hat-system-3-statement", 0);
  // Independent solver:
  //   B - G = 3 (boy says 2 more) -> k1+1
  //   G = 2T + 1 (girl twice as many)
  //   B = T + 10 (teacher 11 fewer)
  // (T+10) - (2T+1) = 3 => T = 6, G = 13, B = 16
  const T_check = (11 - 2 - 3) / (2 - 1);
  const G_check = 2 * T_check + 1;
  assert.strictEqual(T_check, 6, "independent T must equal 6");
  assert.strictEqual(G_check, 13, "independent G must equal 13");
  assert.strictEqual(Number(canonical1.expected), G_check,
    "hat-system-3 variant 0 must produce 13 girls (got " + canonical1.expected + ")");

  // Re-solve canonical Problem 2 (four-people-five-sums, variant 0): expect 66.
  const canonical2 = mod.generateProblem("four-people-five-sums", 0);
  // Independent solver for {99,113,125,130,144}:
  // S = a+b+c+d. a+b=99 (smallest), c+d=144 (largest). S = 99+144 = 243.
  // missing = 3*243 - (99+113+125+130+144) = 729 - 611 = 118.
  // Sorted sums: 99,113,118,125,130,144 -> a+c=113, b+c=118, a+d=125, b+d=130.
  // d - c = 12. c+d = 144 -> c = 66, d = 78. b = 118-66 = 52. a = 99-52 = 47.
  // Missing pair = (b, c) = (52, 66). Heavier = 66.
  assert.strictEqual(Number(canonical2.expected), 66,
    "four-people-five-sums variant 0 must produce 66 kg (got " + canonical2.expected + ")");

  // Each registry skill must appear on >= 4 problems across the bank.
  const skillCount = new Map();
  for (const classicId of mod.CLASSIC_IDS) {
    for (let v = 0; v < 4; v += 1) {
      const p = mod.generateProblem(classicId, v);
      if (p && p.skillTag) skillCount.set(p.skillTag, (skillCount.get(p.skillTag) || 0) + 1);
    }
  }
  for (const sk of ALLOWED_SKILLS) {
    const n = skillCount.get(sk) || 0;
    assert.ok(n >= 4, "registry skill '" + sk + "' should appear on >= 4 problems, got " + n);
  }

  console.log("Algebraic Word Puzzles bank audit passed for " + totalProblems + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
