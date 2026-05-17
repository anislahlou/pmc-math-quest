(function (root) {
  "use strict";

  const ROUND_LENGTH = 8;

  const CLASSICS = [
    { id: "triangle-gate", nickname: "Triangle Gate", skill: "Check whether the two shorter sides add to more than the longest side.", sourcePages: "Book 118, 127 / PDF 128, 137" },
    { id: "isosceles-choice", nickname: "Isosceles Choice", skill: "Choose the valid repeated side in an isosceles triangle, then find the perimeter.", sourcePages: "Book 119, 125, 127 / PDF 129, 135, 137" },
    { id: "hypotenuse-builder", nickname: "Hypotenuse Builder", skill: "Use a^2 + b^2 = c^2 to find the hypotenuse from two legs.", sourcePages: "Book 120-122 / PDF 130-132" },
    { id: "missing-leg", nickname: "Missing Leg", skill: "Subtract squares to find a missing leg from the hypotenuse and the other leg.", sourcePages: "Book 121-122, 128 / PDF 131-132, 138" },
    { id: "shared-height-chase", nickname: "Shared Height Chase", skill: "Use one altitude as the shared height of two right triangles.", sourcePages: "Book 122-123, 126-128 / PDF 132-133, 136-138" },
    { id: "isosceles-split-area", nickname: "Isosceles Split Area", skill: "Split an isosceles triangle in half, find the height, then calculate area.", sourcePages: "Book 123, 126, 128 / PDF 133, 136, 138" },
    { id: "area-to-perimeter", nickname: "Area To Perimeter", skill: "Reverse from area and base to height, then use Pythagoras to find the perimeter.", sourcePages: "Book 124 / PDF 134" },
    { id: "right-turn-path", nickname: "Right-Turn Path", skill: "Group alternating 90 degree moves into two perpendicular totals, then use Pythagoras.", sourcePages: "Book 124 / PDF 134" }
  ];

  const CLASSIC_IDS = CLASSICS.map((classic) => classic.id);
  const CLASSIC_BY_ID = Object.fromEntries(CLASSICS.map((classic) => [classic.id, classic]));

  const SOURCE_COVERAGE = {
    "triangle-gate": ["Map shortest path triangle inequality", "Further exercise side-set choice"],
    "isosceles-choice": ["Exploration 1 two side lengths", "Homework isosceles perimeter"],
    "hypotenuse-builder": ["Pythagorean theorem proof", "Right-triangle missing hypotenuse"],
    "missing-leg": ["Exploration 2 missing right-triangle sides", "Further exercise 40-41-9 form"],
    "shared-height-chase": ["Exploration 3 AB=13, BH=5, AC=15 area", "Practice AC=15, AD=9, BD=16 perimeter", "Homework AC=30, AD=18, BC=40"],
    "isosceles-split-area": ["Isosceles 5,5,8 area", "Isosceles 13,13,10 area"],
    "area-to-perimeter": ["Isosceles area 48 and base 12 perimeter"],
    "right-turn-path": ["Caterpillar 90 degree turn maximum distance"]
  };

  const INTRO_SCENES = [
    { title: "Triangle Gate", purpose: "Can the sides close?", kind: "gate", caption: "Three sticks only make a triangle when the two shorter sticks can reach across the longest side." },
    { title: "Pick The Longest Side", purpose: "Avoid checking the wrong pair.", kind: "order", caption: "Put the sides in order first. The only gate to test is short plus short greater than longest." },
    { title: "Meet The Hypotenuse", purpose: "Name the side opposite the right angle.", kind: "right", caption: "In a right triangle, the side across from the square corner is the hypotenuse. It is the side called c in a^2 + b^2 = c^2." },
    { title: "Build The Hypotenuse", purpose: "Use the squares of the two legs.", kind: "hyp", caption: "If the legs are 6 and 8, their squares are 36 and 64. Together they make 100, so the hypotenuse is 10." },
    { title: "Find A Missing Leg", purpose: "Reverse the same idea.", kind: "leg", caption: "If you know the hypotenuse and one leg, subtract the known square from the hypotenuse square." },
    { title: "Shared Height Chase", purpose: "Use two right triangles in one diagram.", kind: "shared", caption: "One dropped height can belong to two smaller right triangles. Use the first triangle to find the height, then the second to find the hidden base." },
    { title: "Isosceles Split", purpose: "Halve the base before using Pythagoras.", kind: "iso", caption: "The height in an isosceles triangle splits the base into two equal parts, which gives a right triangle to solve." },
    { title: "Right-Turn Challenge", purpose: "Turn a path into one right triangle.", kind: "path", caption: "For a 90 degree path, combine all moves in one direction, combine all moves in the other direction, then use Pythagoras for the final distance." }
  ];

  const triples = [
    [3, 4, 5], [5, 12, 13], [6, 8, 10], [7, 24, 25], [8, 15, 17],
    [9, 12, 15], [9, 40, 41], [10, 24, 26], [12, 16, 20], [15, 20, 25]
  ];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatMathText(value) {
    return String(value).replace(/\^2/g, "²");
  }

  function parseNumber(value) {
    const text = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return text ? Number(text[0]) : NaN;
  }

  function triangularChoice(choices, correct, variantIndex) {
    const unique = [...new Set(choices.map(String))];
    const without = unique.filter((choice) => choice !== String(correct));
    const ordered = [String(correct), ...without].slice(0, 4);
    const offset = variantIndex % ordered.length;
    const rotated = ordered.slice(offset).concat(ordered.slice(0, offset));
    return rotated.map((label) => ({ label, isCorrect: label === String(correct) }));
  }

  function problemBase(classicId, variantIndex, answerType) {
    const classic = CLASSIC_BY_ID[classicId];
    return {
      id: `${classicId}-${variantIndex}`,
      classicId,
      classic: classic.nickname,
      skill: classic.skill,
      sourcePages: classic.sourcePages,
      variantIndex,
      answerType,
      answerMode: answerType === "choice" ? "choice" : "filled"
    };
  }

  function triangleInequalityProblem(variantIndex) {
    const sets = [
      { sides: [4, 5, 6], ok: true },
      { sides: [2, 2, 4], ok: false },
      { sides: [7, 10, 19], ok: false },
      { sides: [5, 8, 12], ok: true },
      { sides: [15, 16, 32], ok: false },
      { sides: [9, 11, 18], ok: true },
      { sides: [3, 3, 6], ok: false },
      { sides: [6, 14, 19], ok: true }
    ];
    const data = sets[variantIndex % sets.length];
    const p = problemBase("triangle-gate", variantIndex, "choice");
    p.prompt = `Which answer is correct for side lengths ${data.sides.join(" cm, ")} cm?`;
    p.expected = data.ok ? "can form a triangle" : "cannot form a triangle";
    p.expectedDisplay = p.expected;
    p.correctInput = { choice: p.expected };
    p.choices = triangularChoice(["can form a triangle", "cannot form a triangle", "only if it is right-angled", "only if it is isosceles"], p.expected, variantIndex);
    const sorted = [...data.sides].sort((a, b) => a - b);
    p.hint1 = `Put the sides in order: ${sorted.join(", ")}.`;
    p.hint2 = `Test ${sorted[0]} + ${sorted[1]} against ${sorted[2]}.`;
    p.solution = `${sorted[0]} + ${sorted[1]} = ${sorted[0] + sorted[1]}. The longest side is ${sorted[2]}, so the triangle ${data.ok ? "can" : "cannot"} close.`;
    p.visual = { type: "gate", sides: data.sides, ok: data.ok };
    return p;
  }

  function isoscelesChoiceProblem(variantIndex) {
    const pairs = [
      [4, 9], [12, 15], [5, 10], [5, 12], [6, 14], [9, 11], [7, 20], [8, 13]
    ];
    const [a, b] = pairs[variantIndex % pairs.length];
    const small = Math.min(a, b);
    const big = Math.max(a, b);
    const repeated = 2 * small > big ? small : big;
    const base = repeated === small ? big : small;
    const expected = 2 * repeated + base;
    const p = problemBase("isosceles-choice", variantIndex, variantIndex % 2 ? "filled" : "choice");
    p.prompt = `Two sides of an isosceles triangle measure ${a} cm and ${b} cm. What is its perimeter?`;
    p.expected = expected;
    p.expectedDisplay = `${expected} cm`;
    p.correctInput = p.answerType === "choice" ? { choice: String(expected) } : { value: String(expected) };
    p.choices = p.answerType === "choice" ? triangularChoice([expected, a + 2 * b, 2 * a + b, a + b], expected, variantIndex) : [];
    p.hint1 = "In an isosceles triangle, two sides are equal.";
    p.hint2 = `The repeated side must be ${repeated} cm because ${small} + ${small} ${2 * small > big ? ">" : "="} ${big}.`;
    p.solution = `The equal sides are ${repeated} cm and ${repeated} cm, with base ${base} cm. Perimeter = ${repeated} + ${repeated} + ${base} = ${expected} cm.`;
    p.visual = { type: "isosceles", equal: repeated, base };
    return p;
  }

  function hypotenuseProblem(variantIndex) {
    const [a, b, c] = triples[(variantIndex + 2) % triples.length];
    const p = problemBase("hypotenuse-builder", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `A right-angled triangle has perpendicular sides ${a} cm and ${b} cm. What is the hypotenuse?`;
    p.expected = c;
    p.expectedDisplay = `${c} cm`;
    p.correctInput = p.answerType === "choice" ? { choice: String(c) } : { value: String(c) };
    p.choices = p.answerType === "choice" ? triangularChoice([c, a + b, Math.abs(b - a), c + 1], c, variantIndex) : [];
    p.hint1 = "The hypotenuse is opposite the right angle.";
    p.hint2 = `Use ${a}^2 + ${b}^2 = c^2.`;
    p.solution = `${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}, so c = ${c} cm.`;
    p.visual = { type: "right", a, b, c, missing: "c" };
    return p;
  }

  function missingLegProblem(variantIndex) {
    const [a, b, c] = triples[(variantIndex + 1) % triples.length];
    const missingA = variantIndex % 2 === 0;
    const missing = missingA ? a : b;
    const known = missingA ? b : a;
    const p = problemBase("missing-leg", variantIndex, variantIndex % 2 ? "filled" : "choice");
    p.prompt = `A right-angled triangle has hypotenuse ${c} cm and one leg ${known} cm. What is the missing leg?`;
    p.expected = missing;
    p.expectedDisplay = `${missing} cm`;
    p.correctInput = p.answerType === "choice" ? { choice: String(missing) } : { value: String(missing) };
    p.choices = p.answerType === "choice" ? triangularChoice([missing, c - known, c + known, known], missing, variantIndex) : [];
    p.hint1 = "You are finding a leg, so subtract the known square from the hypotenuse square.";
    p.hint2 = `${c}^2 - ${known}^2 = ${c * c - known * known}.`;
    p.solution = `${c}^2 - ${known}^2 = ${c * c} - ${known * known} = ${missing * missing}, so the missing leg is ${missing} cm.`;
    p.visual = { type: "right", a: missingA ? null : known, b: missingA ? known : null, c, missing: missingA ? "a" : "b" };
    return p;
  }

  function sharedHeightProblem(variantIndex) {
    const cases = [
      { leftHyp: 13, leftBase: 5, rightHyp: 15, ask: "area", expected: 84 },
      { leftHyp: 15, leftBase: 9, rightBase: 16, ask: "perimeter", expected: 60 },
      { leftHyp: 30, leftBase: 18, rightHyp: 40, ask: "rightBase", expected: 32 },
      { leftBase: 4, height: 3, rightHyp: 13, ask: "rightBase", expected: 12 }
    ];
    const data = cases[variantIndex % cases.length];
    const height = data.height ?? Math.sqrt(data.leftHyp ** 2 - data.leftBase ** 2);
    const rightBase = data.rightBase ?? Math.sqrt((data.rightHyp ?? 13) ** 2 - height ** 2);
    const rightHyp = data.rightHyp ?? Math.sqrt(height ** 2 + rightBase ** 2);
    const leftHyp = data.leftHyp ?? Math.sqrt(height ** 2 + data.leftBase ** 2);
    const totalBase = data.leftBase + rightBase;
    const p = problemBase("shared-height-chase", variantIndex, variantIndex % 2 ? "choice" : "filled");
    if (data.ask === "area") {
      p.prompt = `A triangle is split by a perpendicular height. The left small right triangle has hypotenuse ${leftHyp} and base ${data.leftBase}. The right sloping side is ${rightHyp}. What is the area of the whole triangle?`;
    } else if (data.ask === "perimeter") {
      p.prompt = `CD is perpendicular to AB. AC = ${leftHyp}, AD = ${data.leftBase}, and DB = ${rightBase}. What is the perimeter of triangle ABC?`;
    } else {
      p.prompt = `Two right triangles share a height. One has hypotenuse ${leftHyp} and base ${data.leftBase}; the other has hypotenuse ${rightHyp}. What is the hidden right-base length?`;
    }
    p.expected = data.expected;
    p.expectedDisplay = String(data.expected);
    p.correctInput = p.answerType === "choice" ? { choice: String(data.expected) } : { value: String(data.expected) };
    p.choices = p.answerType === "choice" ? triangularChoice([data.expected, Math.round(height), Math.round(totalBase), Math.round(leftHyp + rightHyp)], data.expected, variantIndex) : [];
    p.hint1 = "Use the left right triangle first to find the shared height.";
    p.hint2 = `Shared height = ${Math.round(height)}. Then use the other right triangle or the area/perimeter rule.`;
    p.solution = `The shared height is ${Math.round(height)}. The hidden right base is ${Math.round(rightBase)}. ${data.ask === "area" ? `Area = ${totalBase} x ${height} / 2 = ${data.expected}.` : data.ask === "perimeter" ? `Perimeter = ${totalBase} + ${leftHyp} + ${rightHyp} = ${data.expected}.` : `The hidden base is ${data.expected}.`}`;
    p.visual = { type: "shared", leftBase: data.leftBase, height: Math.round(height), rightBase: Math.round(rightBase), leftHyp: Math.round(leftHyp), rightHyp: Math.round(rightHyp), ask: data.ask };
    return p;
  }

  function isoscelesAreaProblem(variantIndex) {
    const cases = [[5, 8, 12], [13, 10, 60], [17, 16, 120], [10, 12, 48]];
    const [equal, base, expected] = cases[variantIndex % cases.length];
    const half = base / 2;
    const height = Math.sqrt(equal ** 2 - half ** 2);
    const p = problemBase("isosceles-split-area", variantIndex, variantIndex % 2 ? "filled" : "choice");
    p.prompt = `An isosceles triangle has sides ${equal} cm, ${equal} cm and ${base} cm. What is its area?`;
    p.expected = expected;
    p.expectedDisplay = `${expected} cm²`;
    p.correctInput = p.answerType === "choice" ? { choice: String(expected) } : { value: String(expected) };
    p.choices = p.answerType === "choice" ? triangularChoice([expected, equal * base, (equal * base) / 2, base + equal + equal], expected, variantIndex) : [];
    p.hint1 = `Split the base into ${half} cm and ${half} cm.`;
    p.hint2 = `Use ${equal}^2 - ${half}^2 to find the height.`;
    p.solution = `Half the base is ${half} cm. Height = ${Math.round(height)} cm. Area = ${base} x ${Math.round(height)} / 2 = ${expected} cm².`;
    p.visual = { type: "isoArea", equal, base, height: Math.round(height) };
    return p;
  }

  function areaToPerimeterProblem(variantIndex) {
    const cases = [
      { area: 48, base: 12, height: 8, equal: 10, expected: 32 },
      { area: 60, base: 10, height: 12, equal: 13, expected: 36 },
      { area: 120, base: 16, height: 15, equal: 17, expected: 50 },
      { area: 84, base: 14, height: 12, equal: 13, expected: 40 }
    ];
    const data = cases[variantIndex % cases.length];
    const p = problemBase("area-to-perimeter", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `An isosceles triangle has area ${data.area} cm² and base ${data.base} cm. What is its perimeter?`;
    p.expected = data.expected;
    p.expectedDisplay = `${data.expected} cm`;
    p.correctInput = p.answerType === "choice" ? { choice: String(data.expected) } : { value: String(data.expected) };
    p.choices = p.answerType === "choice" ? triangularChoice([data.expected, data.area + data.base, data.equal * 2, data.base + data.height], data.expected, variantIndex) : [];
    p.hint1 = "Reverse the area formula to find the height.";
    p.hint2 = `Height = 2 x ${data.area} / ${data.base} = ${data.height}; half-base = ${data.base / 2}.`;
    p.solution = `Height = ${data.height}. Half the base is ${data.base / 2}. Equal side = sqrt(${data.height}^2 + ${data.base / 2}^2) = ${data.equal}. Perimeter = ${data.equal} + ${data.equal} + ${data.base} = ${data.expected} cm.`;
    p.visual = { type: "isoArea", equal: data.equal, base: data.base, height: data.height };
    return p;
  }

  function rightTurnPathProblem(variantIndex) {
    const sequences = [
      [2, 3, 4, 5, 6, 7, 8],
      [1, 2, 3, 4, 5, 6],
      [3, 4, 5, 6, 7, 8],
      [4, 5, 6, 7, 8]
    ];
    const moves = sequences[variantIndex % sequences.length];
    const x = moves.filter((_, index) => index % 2 === 0).reduce((a, b) => a + b, 0);
    const y = moves.filter((_, index) => index % 2 === 1).reduce((a, b) => a + b, 0);
    const expected = Math.round(Math.sqrt(x * x + y * y));
    const p = problemBase("right-turn-path", variantIndex, "choice");
    p.prompt = `A path turns 90° after each move. The move lengths are ${moves.join(", ")} metres. What is the greatest possible distance from the start?`;
    p.expected = expected;
    p.expectedDisplay = `${expected} m`;
    p.correctInput = { choice: String(expected) };
    p.choices = triangularChoice([expected, moves.reduce((a, b) => a + b, 0), Math.max(x, y), Math.abs(x - y)], expected, variantIndex);
    p.hint1 = "Put alternate moves into two perpendicular directions.";
    p.hint2 = `One direction can total ${x} m and the other can total ${y} m.`;
    p.solution = `The greatest straight-line distance is sqrt(${x}^2 + ${y}^2) = ${expected} m.`;
    p.visual = { type: "path", moves, x, y, expected };
    return p;
  }

  function generateProblem(classicId, variantIndex = 0) {
    const generators = {
      "triangle-gate": triangleInequalityProblem,
      "isosceles-choice": isoscelesChoiceProblem,
      "hypotenuse-builder": hypotenuseProblem,
      "missing-leg": missingLegProblem,
      "shared-height-chase": sharedHeightProblem,
      "isosceles-split-area": isoscelesAreaProblem,
      "area-to-perimeter": areaToPerimeterProblem,
      "right-turn-path": rightTurnPathProblem
    };
    return generators[classicId](variantIndex);
  }

  function validateProblemMath(problem) {
    return Number.isFinite(Number(problem.expected)) || typeof problem.expected === "string";
  }

  function checkAnswer(problem, input) {
    if (problem.answerType === "choice") {
      const value = String(input.choice ?? "");
      const correct = value === String(problem.expected);
      return { isCorrect: correct, errorClass: correct ? null : "choice_mismatch" };
    }
    const value = parseNumber(input.value);
    const correct = Math.abs(value - Number(problem.expected)) < 1e-8;
    return { isCorrect: correct, errorClass: correct ? null : "number_mismatch" };
  }

  function svgShell(inner) {
    return `<svg viewBox="0 0 560 330" role="img" aria-label="Triangle sides visual">${inner}</svg>`;
  }

  function renderProblemVisual(problem, state = "initial") {
    const v = problem.visual;
    const answer = state === "solution" || state === "worked" ? `<text x="280" y="306" text-anchor="middle" class="formula-note">Answer: ${escapeHtml(problem.expectedDisplay)}</text>` : "";
    let html = "";
    let text = problem.skill;
    if (v.type === "gate") {
      const sorted = [...v.sides].sort((a, b) => a - b);
      html = svgShell(`
        <line x1="90" y1="210" x2="470" y2="210" stroke="#16345d" stroke-width="6" data-label-for="longest-side"/>
        <line x1="110" y1="130" x2="250" y2="210" stroke="#ff7654" stroke-width="6"/>
        <line x1="450" y1="130" x2="250" y2="210" stroke="#0b8993" stroke-width="6"/>
        <text x="280" y="238" text-anchor="middle" class="side-label">longest ${sorted[2]}</text>
        <text x="130" y="120" class="side-label">${sorted[0]}</text>
        <text x="428" y="120" class="side-label">${sorted[1]}</text>
        <text x="280" y="64" text-anchor="middle" class="formula-note">${sorted[0]} + ${sorted[1]} ${v.ok ? ">" : "≤"} ${sorted[2]}</text>
        ${answer}
      `);
      text = "The two shorter sides must add to more than the longest side.";
    } else if (v.type === "right") {
      html = svgShell(`
        <polygon points="130,240 130,80 410,240" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <path d="M130 216 H154 V240" fill="none" stroke="#ff7654" stroke-width="4" data-label-for="right-angle"/>
        <text x="112" y="165" class="side-label">${v.a ?? "?"}</text>
        <text x="270" y="264" text-anchor="middle" class="side-label">${v.b ?? "?"}</text>
        <text x="286" y="145" class="side-label">${v.c ?? "?"}</text>
        <text x="280" y="52" text-anchor="middle" class="formula-note">a² + b² = c²</text>
        ${answer}
      `);
      text = "The hypotenuse is opposite the right angle.";
    } else if (v.type === "isosceles" || v.type === "isoArea") {
      html = svgShell(`
        <polygon points="280,70 140,250 420,250" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <line x1="280" y1="70" x2="280" y2="250" stroke="#ff7654" stroke-width="4" stroke-dasharray="8 8" data-label-for="height"/>
        <text x="178" y="158" class="side-label">${v.equal}</text>
        <text x="366" y="158" class="side-label">${v.equal}</text>
        <text x="280" y="274" text-anchor="middle" class="side-label">base ${v.base}</text>
        ${v.height ? `<text x="294" y="168" class="side-label">height ${v.height}</text>` : ""}
        ${answer}
      `);
      text = "The height splits an isosceles base into two equal halves.";
    } else if (v.type === "shared") {
      html = svgShell(`
        <polygon points="150,250 280,90 450,250" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <line x1="280" y1="90" x2="280" y2="250" stroke="#ff7654" stroke-width="4" data-label-for="shared-height"/>
        <path d="M280 228 H302 V250" fill="none" stroke="#ff7654" stroke-width="4"/>
        <text x="210" y="164" class="side-label">${v.leftHyp}</text>
        <text x="365" y="164" class="side-label">${v.rightHyp}</text>
        <text x="214" y="274" class="side-label">${v.leftBase}</text>
        <text x="362" y="274" class="side-label">${v.rightBase}</text>
        <text x="294" y="174" class="side-label">h ${v.height}</text>
        ${answer}
      `);
      text = "Find the shared height first, then use the second right triangle.";
    } else {
      html = svgShell(`
        <polyline points="120,250 210,250 210,180 330,180 330,110 450,110" fill="none" stroke="#16345d" stroke-width="8" stroke-linejoin="round"/>
        <line x1="120" y1="250" x2="450" y2="110" stroke="#ff7654" stroke-width="4" stroke-dasharray="8 8" data-label-for="final-distance"/>
        <text x="280" y="74" text-anchor="middle" class="formula-note">perpendicular totals: ${v.x} and ${v.y}</text>
        ${answer}
      `);
      text = "Alternate turns make two perpendicular totals.";
    }
    return { html, text };
  }

  function renderIntroScene(index) {
    const scene = INTRO_SCENES[index % INTRO_SCENES.length];
    const fakeProblem = generateProblem(CLASSIC_IDS[index % CLASSIC_IDS.length], index);
    return renderProblemVisual({ ...fakeProblem, expectedDisplay: scene.title }, "initial").html;
  }

  function createRound(offset = 0) {
    return CLASSIC_IDS.map((classicId, index) => generateProblem(classicId, offset + index));
  }

  const api = {
    CLASSICS,
    CLASSIC_IDS,
    SOURCE_COVERAGE,
    INTRO_SCENES,
    ROUND_LENGTH,
    formatMathText,
    parseNumber,
    generateProblem,
    validateProblemMath,
    checkAnswer,
    renderProblemVisual,
    renderIntroScene,
    createRound
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
    return;
  }

  root.TriangleSidesModule = api;

  const state = { introIndex: 0, roundOffset: 0, round: createRound(0), current: 0, answers: [], hintCount: 0 };

  const $ = (id) => document.getElementById(id);

  function renderIntro() {
    const scene = INTRO_SCENES[state.introIndex];
    $("intro-title").textContent = scene.title;
    $("intro-count").textContent = `${state.introIndex + 1} of ${INTRO_SCENES.length}`;
    $("intro-frame").innerHTML = renderIntroScene(state.introIndex);
    $("intro-caption").textContent = scene.caption;
    $("intro-storyboard").innerHTML = INTRO_SCENES.map((item, index) => `<li class="${index === state.introIndex ? "active" : ""}"><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.purpose)}</li>`).join("");
  }

  function renderSkills() {
    $("intro-skill-grid").innerHTML = CLASSICS.map((classic) => `<div class="skill-tile"><strong>${escapeHtml(classic.nickname)}</strong><span>${escapeHtml(classic.skill)}</span></div>`).join("");
    $("mastery-chips").innerHTML = CLASSICS.map((classic) => `<div class="classic-chip"><strong>${escapeHtml(classic.nickname)}</strong></div>`).join("");
  }

  function showIntro() {
    $("intro-screen").hidden = false;
    $("practice-grid").hidden = true;
    $("round-recap").hidden = true;
    renderIntro();
  }

  function showPractice() {
    $("intro-screen").hidden = true;
    $("practice-grid").hidden = false;
    $("round-recap").hidden = true;
    renderProblem();
  }

  function currentProblem() {
    return state.round[state.current];
  }

  function renderAnswerHost(problem) {
    if (problem.answerType === "choice") {
      return `<div class="choice-grid">${problem.choices.map((choice, index) => `<label class="choice-card"><input type="radio" name="choice" value="${escapeHtml(choice.label)}"><span>${escapeHtml(formatMathText(choice.label))}</span></label>`).join("")}</div>`;
    }
    return `<input class="filled-answer" name="value" autocomplete="off" inputmode="decimal" placeholder="Type the number">`;
  }

  function renderProblem() {
    const problem = currentProblem();
    state.hintCount = 0;
    $("classic-label").textContent = problem.classic;
    $("session-count").textContent = `${state.current + 1} of ${state.round.length}`;
    $("problem-prompt").textContent = problem.prompt;
    $("answer-host").innerHTML = renderAnswerHost(problem);
    $("hint-ladder").innerHTML = "";
    $("feedback").className = "feedback-card muted";
    $("feedback").textContent = "Choose or type an answer, then check it.";
    $("similar-button").hidden = true;
    renderVisual("initial");
    renderScore();
  }

  function renderVisual(mode) {
    const rendered = renderProblemVisual(currentProblem(), mode);
    $("visual-frame").innerHTML = rendered.html;
    $("visual-text").textContent = rendered.text;
    $("visual-state").textContent = mode;
  }

  function renderScore() {
    const attempted = state.answers.filter(Boolean).length;
    const correct = state.answers.filter((answer) => answer && answer.isCorrect).length;
    $("live-score").textContent = `Score ${correct} / ${attempted} · Unanswered ${state.round.length - attempted}`;
  }

  function collectInput() {
    const form = new FormData($("answer-form"));
    return { choice: form.get("choice"), value: form.get("value") };
  }

  function checkCurrent(event) {
    event.preventDefault();
    const problem = currentProblem();
    const result = checkAnswer(problem, collectInput());
    state.answers[state.current] = result;
    $("feedback").className = `feedback-card ${result.isCorrect ? "correct" : "wrong"}`;
    $("feedback").textContent = result.isCorrect ? `Correct. ${problem.solution}` : `Not quite. ${problem.hint1}`;
    $("similar-button").hidden = result.isCorrect;
    renderVisual(result.isCorrect ? "solution" : "hint");
    renderScore();
  }

  function showHint() {
    const problem = currentProblem();
    state.hintCount += 1;
    const hint = state.hintCount === 1 ? problem.hint1 : problem.hint2;
    $("hint-ladder").insertAdjacentHTML("beforeend", `<div>${escapeHtml(formatMathText(hint))}</div>`);
    renderVisual("hint");
  }

  function showWhy() {
    $("feedback").className = "feedback-card";
    $("feedback").textContent = currentProblem().solution;
    renderVisual("solution");
  }

  function nextProblem() {
    if (state.current < state.round.length - 1) {
      state.current += 1;
      renderProblem();
    } else {
      showRecap();
    }
  }

  function showRecap() {
    $("practice-grid").hidden = true;
    $("round-recap").hidden = false;
    const missed = state.round.filter((_, index) => !state.answers[index]?.isCorrect);
    $("recap-content").innerHTML = missed.length
      ? missed.map((problem) => `<div><strong>${escapeHtml(problem.classic)}</strong><br>${escapeHtml(problem.skill)}</div>`).join("")
      : "<div><strong>Clean round.</strong><br>You used the triangle gate, Pythagoras, and isosceles splitting accurately.</div>";
  }

  function freshRound() {
    state.roundOffset += 8;
    state.round = createRound(state.roundOffset);
    state.current = 0;
    state.answers = [];
    showPractice();
  }

  function boot() {
    renderSkills();
    renderIntro();
    $("show-intro").addEventListener("click", showIntro);
    $("show-practice").addEventListener("click", showPractice);
    $("intro-start").addEventListener("click", showPractice);
    $("intro-next").addEventListener("click", () => { state.introIndex = (state.introIndex + 1) % INTRO_SCENES.length; renderIntro(); });
    $("intro-play").addEventListener("click", () => { state.introIndex = (state.introIndex + 1) % INTRO_SCENES.length; renderIntro(); });
    $("answer-form").addEventListener("submit", checkCurrent);
    $("hint-button").addEventListener("click", showHint);
    $("why-button").addEventListener("click", showWhy);
    $("next-button").addEventListener("click", nextProblem);
    $("similar-button").addEventListener("click", () => { state.round[state.current] = generateProblem(currentProblem().classicId, currentProblem().variantIndex + 8); renderProblem(); });
    $("fresh-round-button").addEventListener("click", freshRound);
    $("review-intro-button").addEventListener("click", showIntro);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : globalThis);
