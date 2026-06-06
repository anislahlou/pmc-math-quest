// Bank quality audit for addition_multiplication_2 (Lesson 21).
// Independently recomputes every generated problem's expected answer using
// brute-force enumeration / closed-form formulas to confirm the module's
// generator is mathematically correct across 16 variants per classic.
const assert = require("assert");
const mod = require("./addition_multiplication_2_module.js");

function factorial(n) {
  let acc = 1;
  for (let i = 2; i <= n; i += 1) acc *= i;
  return acc;
}

// Brute-force enumerate digit-formation numbers under a constraint.
// digits: array of digits, n: number of positions, opts: { repeats, parity, noLeadingZero }.
function bruteCountDigitNumbers(digits, n, opts) {
  let count = 0;
  function recurse(pickedIndices, slotIdx) {
    if (slotIdx === n) {
      const last = digits[pickedIndices[pickedIndices.length - 1]];
      if (opts.parity === "odd" && last % 2 !== 1) return;
      if (opts.parity === "even" && last % 2 !== 0) return;
      const lead = digits[pickedIndices[0]];
      if (opts.noLeadingZero && lead === 0) return;
      count += 1;
      return;
    }
    for (let di = 0; di < digits.length; di += 1) {
      if (!opts.repeats && pickedIndices.includes(di)) continue;
      pickedIndices.push(di);
      recurse(pickedIndices, slotIdx + 1);
      pickedIndices.pop();
    }
  }
  recurse([], 0);
  return count;
}

// Closed-form arrangement count for items in a row where some named groups
// must each be adjacent. Items is an array of identifiers. Bundles is an
// array of arrays of identifiers. Returns the number of distinct row
// arrangements where each bundle is contiguous and items are distinct.
function bruteCountArrangements(items, bundles) {
  // Each bundle must be contiguous. We brute-permute all items and count
  // arrangements where each bundle's elements are consecutive (in any order).
  const n = items.length;
  if (n > 9) return null; // skip brute for large
  const perms = [];
  function permute(arr, start) {
    if (start === arr.length - 1) {
      perms.push(arr.slice());
      return;
    }
    for (let i = start; i < arr.length; i += 1) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      permute(arr, start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }
  permute(items.slice(), 0);
  let count = 0;
  for (const perm of perms) {
    let ok = true;
    for (const bundle of bundles) {
      const positions = bundle.map((b) => perm.indexOf(b)).sort((a, b) => a - b);
      for (let i = 1; i < positions.length; i += 1) {
        if (positions[i] !== positions[i - 1] + 1) { ok = false; break; }
      }
      if (!ok) break;
    }
    if (ok) count += 1;
  }
  return count;
}

function recomputeExpected(problem) {
  const v = problem.visual || {};
  const classicId = problem.classicId;
  if (classicId === "digits-with-repeats") {
    const slots = v.slots.length;
    return Math.pow(v.digits.length, slots);
  }
  if (classicId === "zero-leading-constraint") {
    const slots = v.slots.length;
    const s = v.digits.length;
    return (s - 1) * Math.pow(s, slots - 1);
  }
  if (classicId === "no-repeat-distinct-digits") {
    const hasZero = v.digits.includes(0);
    return bruteCountDigitNumbers(v.digits, v.slots.length, {
      repeats: false,
      noLeadingZero: hasZero
    });
  }
  if (classicId === "odd-by-last-digit-repeats") {
    const targetIsOdd = v.slots[v.slots.length - 1].mode === "odd";
    return bruteCountDigitNumbers(v.digits, v.slots.length, {
      repeats: true,
      parity: targetIsOdd ? "odd" : "even"
    });
  }
  if (classicId === "odd-or-even-no-repeats") {
    const hasZero = v.digits.includes(0);
    const lastMode = v.slots[v.slots.length - 1].mode;
    const parity = lastMode === "odd" ? "odd" : "even";
    return bruteCountDigitNumbers(v.digits, v.slots.length, {
      repeats: false,
      noLeadingZero: hasZero,
      parity
    });
  }
  if (classicId === "bundling-adjacent") {
    const items = v.items.slice();
    if (!v.bundleDistinct) {
      // Letters with a duplicate. Count distinct anagrams with the duplicate
      // glued together. n!/(2!) where the duplicate is the bundled pair.
      // For APPLE with PP glued: effective 4 items, no duplicates → 4! = 24.
      return factorial(items.length - 1);
    }
    return bruteCountArrangements(items, [v.bundle]);
  }
  if (classicId === "bundling-multi-restriction") {
    return bruteCountArrangements(v.items, [v.bundle, v.bundle2]);
  }
  return null;
}

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length >= 7, "module must expose all 7 CLASSIC_IDS");

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
      assert.ok(problem.skillTag, problem.id + " should expose skillTag");
      assert.ok(mod.validateProblemMath(problem), problem.id + " should pass math validation");
      assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, problem.id + " should accept correct input");
      const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
      assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, problem.id + " should reject wrong input");
      const visual = mod.renderProblemVisual(problem, "solution");
      assert.ok(visual.html.includes('role="img"'), problem.id + " should render an accessible visual");
      assert.ok(visual.text.length > 20, problem.id + " visual text should explain the diagram");
      const initialVisual = mod.renderProblemVisual(problem, "initial");
      assert.ok(!initialVisual.html.includes("Answer:"), problem.id + " initial visual must not include the answer banner");
      // Independent recomputation
      const recomputed = recomputeExpected(problem);
      if (recomputed != null) {
        assert.strictEqual(
          Number(problem.expected),
          recomputed,
          problem.id + " expected " + problem.expected + " but independent recompute = " + recomputed
        );
      }
      prompts.add(problem.prompt);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, problem.id + " needs one correct choice");
        // Choices must be unique
        const seen = new Set();
        for (const c of problem.choices) {
          assert.ok(!seen.has(c.label), problem.id + " choice " + c.label + " duplicated");
          seen.add(c.label);
        }
        choicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(prompts.size >= 4, classicId + " needs varied prompts (got " + prompts.size + ")");
    if (choicePositions.size > 0) {
      assert.ok(choicePositions.size >= 2, classicId + " should vary correct multiple-choice positions");
    }
  }

  console.log("addition_multiplication_2 bank audit passed for " + (mod.CLASSIC_IDS.length * 16) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
