const assert = require("assert");
const mod = require("./u2t2_module.js");

const VARIANTS_PER_MODULE = 16;

function numbers(text) {
  return [...text.matchAll(/-?\d+(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0].replace(/,/g, ""))
  );
}

function close(a, b) {
  return Math.abs(Number(a) - Number(b)) < 1e-8;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

function simplifiedRatio(a, b) {
  const factor = gcd(a, b);
  return [a / factor, b / factor];
}

function decimalToFraction(decimalText) {
  const decimals = (decimalText.split(".")[1] || "").length;
  const denominator = 10 ** decimals;
  const numerator = Math.round(Number(decimalText) * denominator);
  const factor = gcd(numerator, denominator);
  return `${numerator / factor}/${denominator / factor}`;
}

function factorString(n) {
  return mod.factorString(n);
}

function wordNumber(text) {
  return { twice: 2, three: 3, four: 4, five: 5, six: 6 }[text];
}

function formatTerm(coefficient, variable, first) {
  const abs = Math.abs(coefficient);
  const body = (abs === 1 ? "" : abs) + variable;
  if (first) return coefficient < 0 ? "-" + body : body;
  return coefficient < 0 ? " - " + body : " + " + body;
}

function linearExpression(coefficients, order) {
  return order
    .filter((variable) => coefficients[variable] !== 0)
    .map((variable, index) => formatTerm(coefficients[variable], variable, index === 0))
    .join("");
}

function collectLikeTerms(expression) {
  const coefficients = {};
  const order = [];
  const normalized = expression.replace(/-/g, "+-");
  normalized.split("+").map((part) => part.trim().replace(/\s+/g, "")).filter(Boolean).forEach((term) => {
    const match = term.match(/^(-?)(\d*)([a-z])$/);
    assert.ok(match, `Cannot parse algebra term ${term} from ${expression}`);
    const variable = match[3];
    const coefficient = (match[2] ? Number(match[2]) : 1) * (match[1] === "-" ? -1 : 1);
    if (!(variable in coefficients)) {
      coefficients[variable] = 0;
      order.push(variable);
    }
    coefficients[variable] += coefficient;
  });
  return linearExpression(coefficients, order);
}

function evaluateArithmetic(expression) {
  const normalized = expression
    .replace(/\^/g, "**")
    .replace(/\bx\b/g, "*")
    .replace(/−/g, "-");
  if (!/^[\d\s+\-*/().]+$/.test(normalized)) {
    throw new Error(`Unsafe arithmetic expression: ${expression}`);
  }
  return Function(`"use strict"; return (${normalized});`)();
}

function digitValueFromPrompt(prompt) {
  const match = prompt.match(/digit (\d) in ([\d,.]+)/);
  assert.ok(match, `Cannot parse digit-value prompt: ${prompt}`);
  const digit = match[1];
  const rawNumber = match[2].replace(/,/g, "");
  const index = rawNumber.indexOf(digit);
  assert.notStrictEqual(index, -1, `Digit ${digit} not found in ${rawNumber}`);
  assert.strictEqual(rawNumber.indexOf(digit, index + 1), -1, `Digit ${digit} appears more than once; prompt needs an underline: ${prompt}`);
  const decimalIndex = rawNumber.indexOf(".");
  let place;
  if (decimalIndex === -1 || index < decimalIndex) {
    const integerLength = decimalIndex === -1 ? rawNumber.length : decimalIndex;
    place = 10 ** (integerLength - index - 1);
  } else {
    place = 10 ** -(index - decimalIndex);
  }
  return Number(digit) * place;
}

function expectedChoiceLabel(problem) {
  const correct = problem.choices.filter((choice) => choice.isCorrect);
  assert.strictEqual(correct.length, 1, `${problem.id} should have exactly one correct choice`);
  return correct[0].label;
}

function assertAcceptsCorrect(problem) {
  assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, `${problem.id} should accept its correct input`);
}

function solve(problem) {
  const prompt = problem.prompt;
  const nums = numbers(prompt);
  const classic = problem.classic;

  if (classic.startsWith("Prep 9 Q1b")) {
    const match = prompt.match(/p = (-?\d+), q = (-?\d+), and y = (-?\d+), find A = (\d+)q \+ py/);
    assert.ok(match, `Cannot parse Prep 9 formula prompt: ${prompt}`);
    const [, p, q, y, coeff] = match.map(Number);
    return { kind: "number", value: coeff * q + p * y };
  }
  if (classic.startsWith("Prep 9 Q3")) {
    const match = prompt.match(/(?:uses|Review Prep 9:) ([\d,]+) (tonnes|kilograms).* (?:uses|of) ([\d.]+) g/);
    assert.ok(match, `Cannot parse Prep 9 metric prompt: ${prompt}`);
    const amount = Number(match[1].replace(/,/g, ""));
    const grams = match[2] === "tonnes" ? amount * 1000000 : amount * 1000;
    return { kind: "number", value: grams / Number(match[3]) };
  }
  if (classic.startsWith("Prep 9 Q4")) {
    if (prompt.includes("33 1/3%")) {
      const match = prompt.match(/of (\d+)/);
      assert.ok(match, `Cannot parse one-third percentage prompt: ${prompt}`);
      return { kind: "number", value: Number(match[1]) / 3 };
    }
    if (prompt.includes("sale price")) {
      const match = prompt.match(/(\d+) before a (\d+)% discount/);
      assert.ok(match, `Cannot parse sale price prompt: ${prompt}`);
      return { kind: "number", value: Number(match[1]) * (100 - Number(match[2])) / 100 };
    }
    if (prompt.includes("answer in grams")) {
      const match = prompt.match(/Calculate ([\d.]+)% of ([\d.]+) kg/);
      assert.ok(match, `Cannot parse grams percentage prompt: ${prompt}`);
      return { kind: "number", value: Number(match[1]) / 100 * Number(match[2]) * 1000 };
    }
  }
  if (classic.startsWith("Prep 9 Q5a")) {
    const match = prompt.match(/measuring (\d+) cm by (\d+) cm by (\d+) cm/);
    assert.ok(match, `Cannot parse Prep 9 cuboid prompt: ${prompt}`);
    const length = Number(match[1]);
    const width = Number(match[2]);
    const height = Number(match[3]);
    return { kind: "number", value: 2 * (length * width + length * height + width * height) };
  }
  if (classic.startsWith("Prep 9 Q6b")) {
    const match = prompt.match(/(?:style:|Review Prep 9:) (\d+) =/);
    assert.ok(match, `Cannot parse Prep 9 odd-divisor prompt: ${prompt}`);
    let value = Number(match[1]);
    while (value % 2 === 0) value /= 2;
    return { kind: "number", value };
  }
  if (classic.startsWith("Prep 9 Q7b")) {
    const match = prompt.match(/shows (\d+) boys as (\d+) degrees/);
    assert.ok(match, `Cannot parse Prep 9 pie-change prompt: ${prompt}`);
    const boys = Number(match[1]);
    const oldAngle = Number(match[2]);
    const oldTotal = 360 * boys / oldAngle;
    return { kind: "number", value: 360 * (boys + 1) / (oldTotal + 1) };
  }

  switch (classic) {
    case "Digit Value":
      return { kind: "number", value: digitValueFromPrompt(prompt) };
    case "Rounding":
      return { kind: "number", value: Math.round(nums[0] / nums[1]) * nums[1] };
    case "Powers Of Ten":
      return { kind: "number", value: prompt.includes(" / ") ? nums[0] / nums[1] : nums[0] * nums[1] };
    case "Scale Arrows":
      return { kind: "number", value: nums[0] + nums[1] * nums[2] };

    case "Slick Addition And Subtraction":
    case "Common Factor":
    case "Decimals And Factors":
    case "Multiplication Before Addition":
    case "Brackets And Powers":
    case "Index First":
    case "Nested Bracket Total": {
      const expression = prompt.match(/Calculate (.+?)(?: using|\.?$)/)[1].replace(/\.$/, "");
      return { kind: "number", value: evaluateArithmetic(expression) };
    }
    case "Missing Number": {
      const equation = prompt.slice(prompt.indexOf(":") + 1).trim().replace(/\.$/, "");
      if (equation.startsWith("? -")) return { kind: "number", value: nums[1] + nums[0] };
      if (equation.startsWith("? /")) return { kind: "number", value: nums[1] * nums[0] };
      if (equation.includes("+ ? =")) return { kind: "number", value: nums[1] - nums[0] };
      if (equation.includes("x ? =")) return { kind: "number", value: nums[1] / nums[0] };
      break;
    }

    case "Fraction To Decimal":
      return { kind: "number", value: nums[0] / nums[1] };
    case "Decimal To Fraction":
      return { kind: "expression", value: decimalToFraction(prompt.match(/Convert ([\d.]+) to/)[1]) };
    case "Percentage To Decimal":
      return { kind: "number", value: nums[0] / 100 };
    case "Percentage Of Amount":
      return { kind: "number", value: nums[0] * nums[1] / 100 };

    case "Square And Cube Numbers": {
      assert.ok(/square number|cube number/.test(prompt), `Ambiguous number-type prompt: ${prompt}`);
      const [lo, hi] = nums;
      const correct = expectedChoiceLabel(problem);
      const value = Number(correct);
      assert.ok(value >= lo && value <= hi, `${problem.id} choice is outside the stated range`);
      if (prompt.includes("square number")) assert.ok(Number.isInteger(Math.sqrt(value)), `${problem.id} expected choice is not square`);
      if (prompt.includes("cube number")) assert.ok(Number.isInteger(Math.cbrt(value)), `${problem.id} expected choice is not cube`);
      return { kind: "choice", value: correct };
    }
    case "Prime Yes Or No":
      return { kind: "choice", value: mod.isPrime(nums[0]) ? "Yes, prime" : "No, not prime" };
    case "Prime Factorisation":
      return { kind: "expression", value: factorString(nums[0]) };
    case "Divisibility Rules":
      return { kind: "choice", value: nums[0] % nums[1] === 0 ? "Yes" : "No" };

    case "Collect Like Terms":
      return { kind: "expression", value: collectLikeTerms(prompt.match(/Simplify (.+)\./)[1]) };
    case "Multiply Algebra Terms": {
      const match = prompt.match(/Simplify (\d+)([a-z]) x (\d+)\2\./);
      assert.ok(match, `Cannot parse multiply algebra prompt: ${prompt}`);
      return { kind: "expression", value: Number(match[1]) * Number(match[3]) + match[2] + "^2" };
    }
    case "Algebra Division": {
      const match = prompt.match(/Simplify (\d+)([a-z]) \/ (\d+)\./);
      assert.ok(match, `Cannot parse algebra division prompt: ${prompt}`);
      return { kind: "expression", value: Number(match[1]) / Number(match[3]) + match[2] };
    }
    case "Words To Algebra": {
      const match = prompt.match(/number ([a-z]), divide by (\d+), then (add|subtract) (\d+)/);
      assert.ok(match, `Cannot parse word-to-algebra prompt: ${prompt}`);
      const sign = match[3] === "add" ? " + " : " - ";
      return { kind: "expression", value: match[1] + "/" + match[2] + sign + match[4] };
    }
    case "Expand One Bracket": {
      const match = prompt.match(/Multiply out (\d+)\(([a-z]) \+ (\d+)\)\./);
      assert.ok(match, `Cannot parse bracket prompt: ${prompt}`);
      return { kind: "expression", value: Number(match[1]) + match[2] + " + " + (Number(match[1]) * Number(match[3])) };
    }
    case "Simplify After Brackets": {
      const match = prompt.match(/Simplify (\d+) \+ (\d+)\(([a-z]) \+ (\d+)\)\./);
      assert.ok(match, `Cannot parse bracket simplify prompt: ${prompt}`);
      return { kind: "expression", value: Number(match[2]) + match[3] + " + " + (Number(match[1]) + Number(match[2]) * Number(match[4])) };
    }
    case "Negative Substitution": {
      const match = prompt.match(/If c = (-?\d+) and d = (-?\d+), find (\d+)cd\./);
      assert.ok(match, `Cannot parse negative substitution prompt: ${prompt}`);
      return { kind: "number", value: Number(match[3]) * Number(match[1]) * Number(match[2]) };
    }
    case "Substitute Into Formula": {
      const a = nums[0];
      const b = nums[1];
      return { kind: "number", value: b * b - a + b };
    }

    case "Balance Method": {
      const match = prompt.match(/Solve (\d+)x ([+-]) (\d+) = (-?\d+)/);
      assert.ok(match, `Cannot parse equation: ${prompt}`);
      const a = Number(match[1]);
      const sign = match[2] === "+" ? 1 : -1;
      const b = Number(match[3]) * sign;
      const total = Number(match[4]);
      return { kind: "number", value: (total - b) / a };
    }
    case "Form From Words": {
      const match = prompt.match(/multiply a number by (\d+) and then add (\d+)\. The answer is (\d+)/);
      assert.ok(match, `Cannot parse form-from-words prompt: ${prompt}`);
      return { kind: "number", value: (Number(match[3]) - Number(match[2])) / Number(match[1]) };
    }
    case "Perimeter Equation": {
      const offset = nums[0];
      const perimeter = nums[1];
      return { kind: "number", value: (perimeter - 2 * offset) / 4 };
    }
    case "Marble Story": {
      const multiplierMatch = prompt.match(/Lesley has (twice|three|four|five|six) times as many/);
      assert.ok(multiplierMatch, `Cannot parse marble multiplier: ${prompt}`);
      const multiplier = wordNumber(multiplierMatch[1]);
      return { kind: "number", value: (nums[1] + nums[0]) / multiplier };
    }

    case "Straight Line Partner":
      return { kind: "number", value: 180 - nums[0] };
    case "Triangle Total":
      return { kind: "number", value: 180 - nums[0] - nums[1] };
    case "Vertically Opposite":
      return { kind: "number", value: nums[0] };
    case "Isosceles Base Angles":
      return { kind: "number", value: (180 - nums[0]) / 2 };

    case "Area Of Any Triangle":
      return { kind: "number", value: nums[0] * nums[1] / 2 };
    case "Shaded Region":
      return { kind: "number", value: nums[1] ** 2 - nums[0] ** 2 };
    case "Area Unit Conversion":
      return { kind: "number", value: ((nums[1] * 100) / nums[0]) ** 2 };
    case "Algebraic Perimeter": {
      const match = prompt.match(/sides x \+ (\d+) and (\d+)x/);
      assert.ok(match, `Cannot parse algebraic perimeter prompt: ${prompt}`);
      return { kind: "expression", value: (2 + 2 * Number(match[2])) + "x + " + (2 * Number(match[1])) };
    }

    case "Vertical Coordinate Distance":
      return { kind: "number", value: Math.abs(nums[3] - nums[1]) };
    case "Rectangle From Coordinates":
      return { kind: "number", value: Math.abs(nums[2] - nums[0]) * Math.abs(nums[3] - nums[1]) };
    case "Coordinate Triangle Area":
      return { kind: "number", value: Math.abs(nums[2] - nums[0]) * Math.abs(nums[5] - nums[1]) / 2 };
    case "Parallel Axis Name":
      return { kind: "choice", value: nums[0] === nums[2] ? "y-axis" : "x-axis" };

    case "Perimeter Equation For x": {
      const [lengthOffset, widthOffset, perimeter] = nums;
      return { kind: "number", value: (perimeter - 2 * lengthOffset - 2 * widthOffset) / 4 };
    }
    case "Rectangle Area Equation For x": {
      const [coefficient, offset, width, area] = nums;
      return { kind: "number", value: (area / width - offset) / coefficient };
    }
    case "Cuboid Volume Equation For x": {
      const [offset, width, height, volume] = nums;
      return { kind: "number", value: volume / (width * height) - offset };
    }
    case "Triangle Area Equation For x": {
      const [offset, height, area] = nums;
      return { kind: "number", value: (2 * area / height) - offset };
    }

    case "Fraction From Ratio": {
      const [boys, girls] = nums;
      return { kind: "ratio", value: simplifiedRatio(girls, boys + girls) };
    }
    case "Known Part To Total": {
      const [boyParts, girlParts, boys] = nums;
      return { kind: "number", value: boys / boyParts * (boyParts + girlParts) };
    }
    case "Difference Between Parts": {
      const [boyParts, girlParts, difference] = nums;
      return { kind: "number", value: difference / (girlParts - boyParts) * (boyParts + girlParts) };
    }
    case "New Ratio After Change": {
      const [totalCats, lionParts, tigerParts, lionCubs, tigerCubs] = nums;
      const onePart = totalCats / (lionParts + tigerParts);
      return { kind: "ratio", value: simplifiedRatio(lionParts * onePart + lionCubs, tigerParts * onePart + tigerCubs) };
    }

    case "Cuboid Volume":
      return { kind: "number", value: nums[0] * nums[1] * nums[2] };
    case "Unit Cubes":
      return { kind: "number", value: ((nums[1] * 100) / nums[0]) ** 3 };
    case "Speed Time":
      return { kind: "number", value: nums[1] / nums[0] * 60 };
    case "Distance From Speed":
      return { kind: "number", value: nums[0] * nums[1] / 60 };

    case "Mean": {
      const data = nums;
      return { kind: "number", value: data.reduce((a, b) => a + b, 0) / data.length };
    }
    case "Median": {
      const data = nums.slice().sort((a, b) => a - b);
      return { kind: "number", value: data[Math.floor(data.length / 2)] };
    }
    case "Mode": {
      const counts = new Map();
      nums.forEach((n) => counts.set(n, (counts.get(n) || 0) + 1));
      let mode = nums[0];
      counts.forEach((count, value) => {
        if (count > counts.get(mode)) mode = value;
      });
      return { kind: "number", value: mode };
    }
    case "Chart Extraction":
      return { kind: "number", value: nums[0] + (nums[0] + nums[1]) + nums[2] };

    case "Matching Pair Logic":
      return { kind: "number", value: nums.length + 1 };
    case "Small Square To Shaded Ratio":
      return { kind: "ratio", value: simplifiedRatio(nums[0] ** 2, nums[1] ** 2 - nums[0] ** 2) };
    case "Age Equation": {
      const multiplierMatch = prompt.match(/George is (twice|three|four|five|six)(?: times)? Sam/);
      assert.ok(multiplierMatch, `Cannot parse age multiplier: ${prompt}`);
      const multiplier = wordNumber(multiplierMatch[1]);
      const total = nums[0];
      const offset = nums[1];
      return { kind: "number", value: multiplier * ((total - offset) / (multiplier + 2)) };
    }
    case "Coordinate Area": {
      const base = Math.abs(nums[2] - nums[0]);
      const height = Math.abs(nums[5] - nums[1]);
      return { kind: "number", value: base * height / 2 };
    }
    case "Prep 9 Formula Substitution": {
      const match = prompt.match(/p = (-?\d+), q = (-?\d+), and y = (-?\d+), find A = (\d+)q \+ py/);
      assert.ok(match, `Cannot parse Prep 9 formula prompt: ${prompt}`);
      const [, p, q, y, coeff] = match.map(Number);
      return { kind: "number", value: coeff * q + p * y };
    }
    case "Prep 9 Metric Unit Count": {
      const match = prompt.match(/(?:uses|Review Prep 9:) ([\d,]+) (tonnes|kilograms).* (?:uses|of) ([\d.]+) g/);
      assert.ok(match, `Cannot parse Prep 9 metric prompt: ${prompt}`);
      const amount = Number(match[1].replace(/,/g, ""));
      const grams = match[2] === "tonnes" ? amount * 1000000 : amount * 1000;
      return { kind: "number", value: grams / Number(match[3]) };
    }
    case "Prep 9 Percentage Level": {
      if (prompt.includes("33 1/3%")) {
        const match = prompt.match(/of (\d+)/);
        assert.ok(match, `Cannot parse one-third percentage prompt: ${prompt}`);
        return { kind: "number", value: Number(match[1]) / 3 };
      }
      if (prompt.includes("sale price")) {
        const plainSaleMatch = prompt.match(/(\d+) before a (\d+)% discount/);
        if (plainSaleMatch) {
          return { kind: "number", value: Number(plainSaleMatch[1]) * (100 - Number(plainSaleMatch[2])) / 100 };
        }
        const saleMatch = prompt.match(/(?:£|Â£)(\d+) before a (\d+)% discount/);
        if (saleMatch) {
          return { kind: "number", value: Number(saleMatch[1]) * (100 - Number(saleMatch[2])) / 100 };
        }
        const match = prompt.match(/£(\d+) before a (\d+)% discount/);
        assert.ok(match, `Cannot parse sale price prompt: ${prompt}`);
        return { kind: "number", value: Number(match[1]) * (100 - Number(match[2])) / 100 };
      }
      if (prompt.includes("answer in grams")) {
        const match = prompt.match(/Calculate ([\d.]+)% of ([\d.]+) kg/);
        assert.ok(match, `Cannot parse grams percentage prompt: ${prompt}`);
        return { kind: "number", value: Number(match[1]) / 100 * Number(match[2]) * 1000 };
      }
      break;
    }
    case "Prep 9 Cuboid Surface Area": {
      const match = prompt.match(/measuring (\d+) cm by (\d+) cm by (\d+) cm/);
      assert.ok(match, `Cannot parse Prep 9 cuboid prompt: ${prompt}`);
      const length = Number(match[1]);
      const width = Number(match[2]);
      const height = Number(match[3]);
      return { kind: "number", value: 2 * (length * width + length * height + width * height) };
    }
    case "Prep 9 Largest Odd Divisor": {
      const match = prompt.match(/(?:style:|Review Prep 9:) (\d+) =/);
      assert.ok(match, `Cannot parse Prep 9 odd-divisor prompt: ${prompt}`);
      let value = Number(match[1]);
      while (value % 2 === 0) value /= 2;
      return { kind: "number", value };
    }
    case "Prep 9 Pie Chart Change": {
      const match = prompt.match(/shows (\d+) boys as (\d+) degrees/);
      assert.ok(match, `Cannot parse Prep 9 pie-change prompt: ${prompt}`);
      const boys = Number(match[1]);
      const oldAngle = Number(match[2]);
      const oldTotal = 360 * boys / oldAngle;
      return { kind: "number", value: 360 * (boys + 1) / (oldTotal + 1) };
    }
    default:
      throw new Error(`No independent solver for ${problem.classic}`);
  }
  throw new Error(`Could not independently solve ${problem.id}: ${prompt}`);
}

function assertMatches(problem, expected) {
  if (expected.kind === "number") {
    assert.ok(close(problem.expected, expected.value), `${problem.id} expected ${expected.value}, app has ${problem.expected}`);
    assert.ok(close(mod.parseNumber(problem.expectedDisplay), expected.value), `${problem.id} display ${problem.expectedDisplay} should equal ${expected.value}`);
    if (problem.answerType === "choice") {
      assert.ok(close(mod.parseNumber(expectedChoiceLabel(problem)), expected.value), `${problem.id} correct choice should equal ${expected.value}`);
    }
    assertAcceptsCorrect(problem);
    return;
  }
  if (expected.kind === "ratio") {
    assert.deepStrictEqual(problem.expected, expected.value, `${problem.id} ratio mismatch`);
    assert.strictEqual(problem.expectedDisplay, `${expected.value[0]}:${expected.value[1]}`, `${problem.id} ratio display mismatch`);
    if (problem.answerType === "choice") {
      assert.deepStrictEqual(mod.parseRatio(expectedChoiceLabel(problem)), expected.value, `${problem.id} correct choice ratio mismatch`);
    }
    assertAcceptsCorrect(problem);
    return;
  }
  if (expected.kind === "expression") {
    assert.strictEqual(mod.normalizeExpression(problem.expectedDisplay), mod.normalizeExpression(expected.value), `${problem.id} expression mismatch`);
    if (problem.answerType === "choice") {
      assert.strictEqual(mod.normalizeExpression(expectedChoiceLabel(problem)), mod.normalizeExpression(expected.value), `${problem.id} correct choice mismatch`);
    }
    assertAcceptsCorrect(problem);
    return;
  }
  if (expected.kind === "choice") {
    assert.strictEqual(expectedChoiceLabel(problem), expected.value, `${problem.id} correct choice mismatch`);
    assert.strictEqual(problem.expectedDisplay, expected.value, `${problem.id} expected display mismatch`);
    assertAcceptsCorrect(problem);
    return;
  }
  throw new Error(`Unknown expected kind ${expected.kind}`);
}

function run() {
  const failures = [];
  let checked = 0;
  let challengeChecked = 0;
  for (const moduleId of mod.MODULE_IDS) {
    const promptsByClassic = new Map();
    const answerModes = new Set();
    const correctChoicePositions = new Set();
    const routineVariantCount = moduleId === "review-prep-9-challenge" ? 20 : VARIANTS_PER_MODULE;
    for (let variant = 0; variant < routineVariantCount; variant += 1) {
      const problem = mod.generateProblem(moduleId, variant);
      try {
        if (!promptsByClassic.has(problem.classic)) promptsByClassic.set(problem.classic, new Set());
        promptsByClassic.get(problem.classic).add(problem.prompt);
        answerModes.add(problem.answerType === "choice" ? "choice" : "filled");
        if (problem.answerType === "choice") {
          correctChoicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
        }
        const expected = solve(problem);
        assertMatches(problem, expected);
        assert.ok(problem.solution.includes(String(problem.expectedDisplay).split("/")[0]) || problem.solution.length > 20, `${problem.id} solution is too thin`);
        if (moduleId === "geometry-equations-challenge") {
          assert.ok(problem.prompt.includes("Use the"), `${problem.id} should name the geometry formula source in the prompt`);
          assert.ok(problem.solution.includes("equation"), `${problem.id} should show the equation used to find x`);
        }
        checked += 1;
      } catch (error) {
        failures.push(`${problem.id} [${problem.classic}] ${problem.prompt}\n  ${error.message}`);
      }
    }
    promptsByClassic.forEach((prompts, classic) => {
      const minimumPrompts = moduleId === "review-prep-9-challenge" ? 1 : 4;
      if (prompts.size < minimumPrompts) {
        failures.push(`${moduleId} [${classic}]\n  Expected at least ${minimumPrompts} source-shaped prompt variants, found ${prompts.size}.`);
      }
    });
    if (!(answerModes.has("choice") && answerModes.has("filled"))) {
      failures.push(`${moduleId}\n  Expected a mix of multiple-choice and filled-answer formats.`);
    }
    if (correctChoicePositions.size < 2) {
      failures.push(`${moduleId}\n  Expected the correct multiple-choice position to vary.`);
    }
    if (moduleId === "review-prep-9-challenge") {
      const routineLabels = [...promptsByClassic.keys()].join(" ");
      for (const sourceLabel of ["Q1b", "Q3", "Q4", "Q5a", "Q6b", "Q7b"]) {
        if (!routineLabels.includes(sourceLabel)) {
          failures.push(`${moduleId}\n  Expected refreshed Review Prep 9 bank to include ${sourceLabel}-style questions.`);
        }
      }
    }

    const challengePrompts = new Set();
    const challengeClassics = new Set();
    const challengeModes = new Set();
    const challengeVariantCount = mod.challengeVariantCount(moduleId);
    if (challengeVariantCount === 0) {
      const practiceProblem = mod.generateChallengeProblem(moduleId, 0);
      if (practiceProblem.isChallenge || practiceProblem.prompt.includes("Challenge:")) {
        failures.push(`${moduleId}\n  Expected no challenge bank for the refreshed Review Prep 9 set.`);
      }
      if (moduleId !== "review-prep-9-challenge") {
        failures.push(`${moduleId}\n  Only Review Prep 9 should have challenge mode disabled.`);
      }
      continue;
    }
    for (let variant = 0; variant < challengeVariantCount; variant += 1) {
      const problem = mod.generateChallengeProblem(moduleId, variant);
      try {
        assert.strictEqual(problem.isChallenge, true, `${problem.id} is not marked as challenge`);
        assert.ok(problem.classic.startsWith("Challenge:"), `${problem.id} is missing the Challenge classic label`);
        assert.ok(problem.prompt.includes("Challenge:"), `${problem.id} is missing the Challenge prompt label`);
        assert.ok(problem.source.includes("JMC/PMC-inspired"), `${problem.id} is missing source inspiration notes`);
        assert.ok(problem.solution.length > 20 || problem.solution.includes(String(problem.expectedDisplay).split("/")[0]), `${problem.id} challenge solution is too thin`);
        if (moduleId === "geometry-equations-challenge") {
          const promptLower = problem.prompt.toLowerCase();
          const solutionLower = problem.solution.toLowerCase();
          if (promptLower.includes("volume")) assert.ok(solutionLower.includes("volume"), `${problem.id} must keep volume language in the solution`);
          if (promptLower.includes("area")) assert.ok(solutionLower.includes("area"), `${problem.id} must keep area language in the solution`);
          if (promptLower.includes("perimeter")) assert.ok(solutionLower.includes("perimeter"), `${problem.id} must keep perimeter language in the solution`);
          if (promptLower.includes("first use")) assert.ok(solutionLower.includes("equation") || solutionLower.includes("area ="), `${problem.id} must show the setup before the final geometry answer`);
        }
        if (problem.classic === "Challenge: Square Frame Equation") {
          assert.ok(problem.prompt.includes("border area only"), `${problem.id} must distinguish frame area from perimeter in the prompt`);
          assert.ok(problem.prompt.includes("outer perimeter"), `${problem.id} must state that the requested final answer is perimeter`);
          assert.ok(problem.solution.includes("The 80 is an area"), `${problem.id} must explicitly keep the given area separate from the final perimeter`);
          assert.ok(problem.solution.includes("4 x 12 = 48"), `${problem.id} must show perimeter as 4 times the outer side`);
        }
        assertAcceptsCorrect(problem);
        const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
        assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, `${problem.id} should reject a wrong answer`);
        const rendered = mod.renderProblemVisual(problem, "solution");
        assert.ok(rendered.html.includes("Answer:"), `${problem.id} challenge visual should reveal the answer in solution mode`);
        challengePrompts.add(problem.prompt);
        challengeClassics.add(problem.classic);
        challengeModes.add(problem.answerType === "choice" ? "choice" : "filled");
        challengeChecked += 1;
      } catch (error) {
        failures.push(`${problem.id} [${problem.classic}] ${problem.prompt}\n  ${error.message}`);
      }
    }
    if (challengePrompts.size < challengeVariantCount) {
      failures.push(`${moduleId}\n  Expected ${challengeVariantCount} unique challenge prompts, found ${challengePrompts.size}.`);
    }
    if (challengeClassics.size < challengeVariantCount) {
      failures.push(`${moduleId}\n  Expected ${challengeVariantCount} named challenge classics, found ${challengeClassics.size}.`);
    }
    if (!(challengeModes.has("choice") && challengeModes.has("filled"))) {
      failures.push(`${moduleId}\n  Expected challenge questions to mix multiple-choice and filled-answer formats.`);
    }
    if (moduleId === "review-prep-9-challenge") {
      const labels = [...challengeClassics].join(" ");
      for (const sourceLabel of ["Q1b", "Q3", "Q4", "Q5a", "Q6b", "Q7b"]) {
        if (!labels.includes(sourceLabel)) {
          failures.push(`${moduleId}\n  Expected Review Prep 9 challenge bank to include ${sourceLabel}-style questions.`);
        }
      }
    }
  }

  if (failures.length) {
    throw new Error(failures.join("\n\n"));
  }
  console.log(`Independent U2T2 bank audit passed for ${checked} routine questions and ${challengeChecked} challenge questions.`);
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { run, solve };
