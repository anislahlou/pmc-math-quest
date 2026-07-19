(function (root) {
  "use strict";

  const ROUND_LENGTH = 6;
  const INTRO_SCENE_MS = 9000;

  // Source: Year 6 "M" workbook, Lesson 27 "Recurring Decimals (1)".
  // Printed pages 119-133 (PDF pages 129-143). The lesson teaches dot
  // notation for recurring decimals, comparing and ordering them, which
  // fractions terminate (denominator's prime factors are only 2s and 5s
  // after simplifying) versus recur, and periodicity: the nth digit and
  // digit sums of the repeating block. Everything here is computed on digit
  // STRINGS - no floating point - so every answer is exact.
  const SRC = "Book 119-133 / PDF 129-143";

  const CLASSICS = [
    { id: "dots-notation", nickname: "Dots Notation", skill: "Write a recurring decimal with dots over the first and last digit of the repeating block, and expand the dots back into digits.", sourcePages: SRC },
    { id: "compare-two", nickname: "Compare Recurring Decimals", skill: "Compare two recurring decimals by expanding both past the point where their digits first differ.", sourcePages: SRC },
    { id: "middle-order", nickname: "Middle of the Order", skill: "Order a mixed list of percentages, terminating and recurring decimals by expanding them, then pick the middle value.", sourcePages: SRC },
    { id: "terminating-recurring", nickname: "Terminating or Recurring", skill: "Simplify the fraction first: if the denominator's prime factors are only 2s and 5s it terminates, any other prime makes it recur.", sourcePages: SRC },
    { id: "nth-digit", nickname: "Nth Digit Hunt", skill: "Use the period: after any non-repeating digits, the nth digit is block[(n − 1) mod period], counting from the block's start.", sourcePages: SRC },
    { id: "digit-sum", nickname: "Digit Sum Runs", skill: "Split a run of digits into whole repeating blocks plus a remainder: sum = full blocks × block sum + the leftover digits.", sourcePages: SRC }
  ];

  const CLASSIC_IDS = CLASSICS.map((classic) => classic.id);
  const CLASSIC_BY_ID = Object.fromEntries(CLASSICS.map((classic) => [classic.id, classic]));

  // Registry skills: ["Dots notation", "Compare recurring decimals",
  // "Middle of the order", "Terminating or recurring", "Nth digit hunt",
  // "Digit sum runs"].
  const CLASSIC_SKILLS = {
    "dots-notation": "Dots notation",
    "compare-two": "Compare recurring decimals",
    "middle-order": "Middle of the order",
    "terminating-recurring": "Terminating or recurring",
    "nth-digit": "Nth digit hunt",
    "digit-sum": "Digit sum runs"
  };

  const SOURCE_COVERAGE = {
    "dots-notation": ["Learn & Discover 2a (8.271271… and 5.41666…)", "L&D 2b expand 1.352 and 2.9487 dot forms", "Further Basic 2 (0.7656 dot form expansions)"],
    "compare-two": ["Learn & Discover (0.425 dot pairs — which is smaller)", "Homework 1 (smallest of the 3.241 family)", "Further Basic 3 (largest of the 1.93 family)"],
    "middle-order": ["Let's Get Ready 1 (five decimals, middle value)", "Homework 2 (0.727 family with 72%)", "Teaching Time (36% and the 0.365 family)"],
    "terminating-recurring": ["Learn & Discover fraction groups", "Exploration 2 table (prime factorisation of denominators)", "Practice + Further 7 (circle the recurring fractions)"],
    "nth-digit": ["Exploration 3 (25th and 40th digit of 0.3278 dot form)", "Exploration 4 (100th digit of 2/7)", "Homework 4 (72nd and 88th digits of 0.745)"],
    "digit-sum": ["Exploration 3 (sum of first 100 digits)", "Exploration 4 (sum of first 100 digits of 6/7)", "Homework 5 (first 42 digits of 0.2867); Practice (60th + 100th of 0.594)"]
  };

  const INTRO_SCENES = [
    {
      title: "Dots notation",
      purpose: "Mark the repeating block with dots on its first and last digit.",
      classicId: "dots-notation",
      kind: "dots",
      durationMs: 18000,
      caption: "8.271271271… repeats the block 271 forever. Instead of writing dots and dots of digits, put one dot over the 2 and one over the 1: the dots hug the repeating block. A single repeating digit gets a single dot, like 5.416̇.",
      voiceover: "A recurring decimal repeats a block of digits forever. Writing eight point two seven one, two seven one, on and on would never end, so we mark the block instead. Put a dot over the first digit of the block and a dot over the last digit. If just one digit repeats, it wears a single dot on its own."
    },
    {
      title: "Compare recurring decimals",
      purpose: "Expand both decimals until their digits first differ.",
      classicId: "compare-two",
      kind: "compare",
      durationMs: 18000,
      caption: "To compare 0.42̇5̇ and 0.4̇25̇, expand both: 0.425252… and 0.425425… The first three digits match; at the fourth, 2 < 4, so 0.42̇5̇ is smaller. The dots change everything — expand before you judge.",
      voiceover: "Two recurring decimals can start with the same digits and still be different sizes. Expand each one, digit by digit, until the first place where they disagree. Whichever has the smaller digit there is the smaller number. The dots move the repeating block, so never compare the compact forms directly — always expand first."
    },
    {
      title: "Middle of the order",
      purpose: "Expand every value — percentages too — then sort and pick the centre.",
      classicId: "middle-order",
      kind: "middle",
      durationMs: 18000,
      caption: "72%, 0.72̇, 0.7̇2̇, 0.7̇27̇ and 0.7̇72̇ all expand differently: 0.7200, 0.7222, 0.7272, 0.7277, 0.7727. Sorted, the middle one is 0.7̇2̇. Expansion turns a tricky ordering into simple digit comparison.",
      voiceover: "When a list mixes percentages, plain decimals and recurring decimals, expand every one of them to the same number of digits. A percentage is just a decimal in disguise. Then sort the expansions like ordinary numbers and read off the one sitting in the centre of the order. The expansion does all the hard work."
    },
    {
      title: "Terminating or recurring",
      purpose: "Simplify, then factorise the denominator: only 2s and 5s terminate.",
      classicId: "terminating-recurring",
      kind: "type",
      durationMs: 18000,
      caption: "21/40: the denominator 40 = 2³ × 5, only 2s and 5s, so it terminates (0.525). 5/6: the 6 = 2 × 3 hides a 3, so it recurs (0.83̇). Simplify first — 20/24 becomes 5/6 before you factorise!",
      voiceover: "Whether a fraction terminates or recurs is decided by its denominator. First write the fraction in simplest form. Then break the denominator into prime factors. If you only find twos and fives, the decimal stops. Any other prime, like a three, a seven or an eleven, forces the decimal to repeat forever."
    },
    {
      title: "Nth digit hunt",
      purpose: "The digits cycle with the period — use (n − 1) mod period.",
      classicId: "nth-digit",
      kind: "nth",
      durationMs: 18000,
      caption: "0.3̇278̇ repeats the block 3278 with period 4. For the 25th digit: (25 − 1) mod 4 = 0, so it is the block's 1st digit, 3. For the 40th: (40 − 1) mod 4 = 3 — the block's 4th digit, 8.",
      voiceover: "To find a faraway digit you never need to write them all out. The digits march in a cycle whose length is the period of the block. Subtract one from the position, divide by the period, and the remainder tells you which digit of the block you have landed on. Remainder zero means the first digit of the block."
    },
    {
      title: "Digit sum runs",
      purpose: "Whole blocks times the block sum, plus the leftover digits.",
      classicId: "digit-sum",
      kind: "sum",
      durationMs: 18000,
      caption: "First 100 digits of 0.3̇278̇: the block 3278 sums to 20, and 100 digits is exactly 25 blocks, so the total is 25 × 20 = 500. If the run is not a whole number of blocks, add the first few digits of one more block.",
      voiceover: "Long digit sums collapse the same way. Count how many whole repeating blocks fit into your run of digits, multiply by the sum of one block, and then add the handful of leftover digits from the start of the next block. One hundred digits of a period four decimal is exactly twenty five blocks."
    }
  ];

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function formatMathText(value) {
    return String(value)
      .replace(/\^1/g, "¹")
      .replace(/\^2/g, "²")
      .replace(/\^3/g, "³");
  }

  function parseNumber(value) {
    const text = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return text ? Number(text[0]) : NaN;
  }

  // ---- recurring-decimal machinery (digit strings, no floats) ---------------

  const DOT = "̇"; // combining dot above

  // rec = { int: "0", pre: "41", block: "6" } — integer part, non-repeating
  // decimals, repeating block. block may be "" for terminating decimals.
  function rec(intPart, pre, block) {
    return { int: String(intPart), pre: pre || "", block: block || "" };
  }

  // Compact dot-notation display: dots over first and last block digit.
  function dotted(r) {
    if (!r.block) return `${r.int}.${r.pre}`;
    const b = r.block;
    const marked = b.length === 1
      ? b + DOT
      : b[0] + DOT + b.slice(1, -1) + b[b.length - 1] + DOT;
    return `${r.int}.${r.pre}${marked}`;
  }

  // First n decimal digits as a string (pre then repeating block).
  function digitsOf(r, n) {
    let out = r.pre;
    if (!r.block) return (out + "0".repeat(n)).slice(0, n);
    while (out.length < n) out += r.block;
    return out.slice(0, n);
  }

  // Expanded display with an ellipsis, e.g. "8.271271271…".
  function expanded(r, n) {
    return `${r.int}.${digitsOf(r, n)}…`;
  }

  // Lexicographic comparison on integer part then expanded digits.
  function compareRec(a, b) {
    const ai = parseInt(a.int, 10);
    const bi = parseInt(b.int, 10);
    if (ai !== bi) return ai - bi;
    const da = digitsOf(a, 15);
    const db = digitsOf(b, 15);
    return da < db ? -1 : da > db ? 1 : 0;
  }

  // 1-indexed nth decimal digit.
  function nthDigitOf(r, n) {
    if (n <= r.pre.length) return Number(r.pre[n - 1]);
    return Number(r.block[(n - 1 - r.pre.length) % r.block.length]);
  }

  function sumFirstDigits(r, n) {
    let sum = 0;
    for (let i = 1; i <= n; i += 1) sum += nthDigitOf(r, i);
    return sum;
  }

  function blockSum(r) {
    return r.block.split("").reduce((s, d) => s + Number(d), 0);
  }

  function gcd(a, b) {
    while (b) { const t = a % b; a = b; b = t; }
    return a;
  }

  // Simplify n/d, strip 2s and 5s from the denominator: terminating iff 1 left.
  function fractionType(n, d) {
    const g = gcd(n, d);
    const sd = d / g;
    let rest = sd;
    while (rest % 2 === 0) rest /= 2;
    while (rest % 5 === 0) rest /= 5;
    return { simplest: `${n / g}/${sd}`, terminating: rest === 1 };
  }

  function rdChoice(choices, correct, variantIndex) {
    const unique = [...new Set(choices.map(String))];
    const without = unique.filter((choice) => choice !== String(correct));
    const ordered = [String(correct), ...without].slice(0, 4);
    const offset = variantIndex % ordered.length;
    const rotated = ordered.slice(offset).concat(ordered.slice(0, offset));
    return rotated.map((label) => ({ label, isCorrect: label === String(correct) }));
  }

  function distinctDistractors(correct, candidates) {
    const out = [];
    const seen = new Set([String(correct)]);
    for (const candidate of candidates) {
      const n = Math.round(candidate);
      if (!Number.isFinite(n) || n < 0) continue;
      const key = String(n);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(n);
      if (out.length === 3) break;
    }
    let pad = 1;
    while (out.length < 3) {
      const candidate = correct + pad;
      if (candidate >= 0 && !seen.has(String(candidate))) {
        seen.add(String(candidate));
        out.push(candidate);
      }
      pad += 1;
    }
    return out;
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

  function finishNumeric(p, correct, distractors, variantIndex) {
    p.expected = correct;
    p.expectedDisplay = String(correct);
    p.correctInput = p.answerType === "choice" ? { choice: String(correct) } : { value: String(correct) };
    p.choices = p.answerType === "choice" ? rdChoice([correct, ...distractors].map(String), String(correct), variantIndex) : [];
    return p;
  }

  function finishSymbolic(p, correct, distractors, variantIndex) {
    p.expected = correct;
    p.expectedDisplay = correct;
    p.correctInput = { choice: correct };
    p.choices = rdChoice([correct, ...distractors], correct, variantIndex);
    return p;
  }

  const PRINCIPLE = {
    dots: "the dots hug the first and last digit of the repeating block",
    compare: "expand both until their digits first differ",
    middle: "expand everything, sort the expansions, read the centre",
    type: "simplify, then factorise the denominator: only 2s and 5s stop",
    nth: "(n − 1) mod period picks the digit inside the block",
    sum: "whole blocks × block sum + the leftover digits"
  };

  // ---- generators ------------------------------------------------------------

  function dotsNotationProblem(variantIndex) {
    const cases = [
      { r: rec(8, "", "271"), dir: "toDots" },
      { r: rec(5, "41", "6"), dir: "toDots" },
      { r: rec(1, "", "352"), dir: "expand" },
      { r: rec(2, "94", "87"), dir: "expand" },
      { r: rec(0, "7", "656"), dir: "expand" },
      { r: rec(0, "", "142857"), dir: "toDots" }
    ];
    const data = cases[variantIndex % cases.length];
    const r = data.r;
    const p = problemBase("dots-notation", variantIndex, "choice");
    // Wrong splits of the same digits: dot a different slice of the block.
    const b = r.block;
    let wrongA;
    let wrongB;
    let wrongC;
    if (b.length > 1) {
      wrongA = dotted(rec(r.int, r.pre + b[0], b.slice(1)));
      wrongB = dotted(rec(r.int, r.pre, b.slice(0, -1)));
      wrongC = dotted(rec(r.int, r.pre + b.slice(0, -1), b.slice(-1)));
    } else {
      // Single-digit block: sliding the dot rightwards (e.g. 5.416̇ → 5.4166̇)
      // produces the SAME number, so build wrong choices that genuinely change
      // the value — dot a prefix digit or fold prefix digits into the block.
      wrongA = dotted(rec(r.int, r.pre.slice(0, -1), r.pre.slice(-1) || b));
      wrongB = dotted(rec(r.int, r.pre.slice(0, -1), (r.pre.slice(-1) || "9") + b));
      wrongC = dotted(rec(r.int, "", (r.pre || "9") + b));
    }
    if (data.dir === "toDots") {
      const correct = dotted(r);
      p.prompt = `Write ${expanded(r, Math.max(9, r.pre.length + 2 * b.length))} using dot notation.`;
      p.hint1 = "Find the block of digits that repeats forever, right after any digits that appear only once.";
      p.hint2 = `The repeating block here is "${b}"; the dots go over its first and last digit.`;
      p.solution = `The block ${b} repeats, so the dots sit on ${b[0]} and ${b[b.length - 1]}: ${correct}.`;
      p.visual = { kind: "dots", principle: PRINCIPLE.dots, expr: expanded(r, Math.max(9, r.pre.length + 2 * b.length)), detail: `block "${b}" → ${correct}` };
      return finishSymbolic(p, correct, [wrongA, wrongB, wrongC], variantIndex);
    }
    const correct = expanded(r, Math.max(9, r.pre.length + 3 * b.length));
    const altA = expanded(rec(r.int, r.pre + b[0], b.slice(1) || b), Math.max(9, r.pre.length + 3 * b.length));
    const altB = expanded(rec(r.int, r.pre, (b.slice(1) + b[0])), Math.max(9, r.pre.length + 3 * b.length));
    const altC = expanded(rec(r.int, "", (r.pre ? r.pre : b[0]) + b), Math.max(9, r.pre.length + 3 * b.length));
    p.prompt = `Which expansion equals ${dotted(r)}?`;
    p.hint1 = "The dots mark the repeating block: everything from the first dotted digit to the last dotted digit repeats.";
    p.hint2 = `Here the block is "${b}"${r.pre ? `, after the one-off digits "${r.pre}"` : ""} — copy it out again and again.`;
    p.solution = `${dotted(r)} repeats the block ${b}: ${correct}.`;
    p.visual = { kind: "dots", principle: PRINCIPLE.dots, expr: dotted(r), detail: `block "${b}" → ${correct}` };
    return finishSymbolic(p, correct, [altA, altB, altC].filter((s) => s !== correct), variantIndex);
  }

  function compareTwoProblem(variantIndex) {
    const cases = [
      { a: rec(0, "4", "25"), b: rec(0, "", "425"), want: "smaller" },
      { a: rec(3, "", "241"), b: rec(3, "2", "4"), want: "smaller" },
      { a: rec(0, "3", "6"), b: rec(0, "", "365"), want: "smaller" },
      { a: rec(7, "", "284"), b: rec(7, "2", "84"), want: "smaller" },
      { a: rec(1, "", "93"), b: rec(1, "9", "3"), want: "larger" },
      { a: rec(8, "", "972"), b: rec(8, "9", "72"), want: "larger" }
    ];
    const data = cases[variantIndex % cases.length];
    const cmp = compareRec(data.a, data.b);
    const pick = data.want === "smaller" ? (cmp < 0 ? data.a : data.b) : (cmp > 0 ? data.a : data.b);
    const other = pick === data.a ? data.b : data.a;
    const correct = dotted(pick);
    const p = problemBase("compare-two", variantIndex, "choice");
    p.prompt = `Which is ${data.want}: ${dotted(data.a)} or ${dotted(data.b)}?`;
    p.hint1 = "Expand both decimals digit by digit — the dots move the repeating block, so the expansions differ.";
    p.hint2 = `${dotted(data.a)} = ${expanded(data.a, 6)} and ${dotted(data.b)} = ${expanded(data.b, 6)}. Find the first digit where they differ.`;
    p.solution = `${expanded(data.a, 6)} vs ${expanded(data.b, 6)}: at the first differing digit, ${correct} is the ${data.want} one.`;
    p.visual = { kind: "compare", principle: PRINCIPLE.compare, expr: `${dotted(data.a)}  vs  ${dotted(data.b)} — which is ${data.want}?`, detail: `${expanded(data.a, 6)} vs ${expanded(data.b, 6)} → ${correct}` };
    return finishSymbolic(p, correct, [dotted(other)], variantIndex);
  }

  function middleOrderProblem(variantIndex) {
    const cases = [
      { items: [{ label: "0.31", r: rec(0, "31", "") }, { label: "0.29", r: rec(0, "29", "") }, { label: "0.289", r: rec(0, "289", "") }, { label: "0.305", r: rec(0, "305", "") }, { label: "0.295", r: rec(0, "295", "") }] },
      { items: [{ label: dotted(rec(0, "", "727")), r: rec(0, "", "727") }, { label: "72%", r: rec(0, "72", "") }, { label: dotted(rec(0, "7", "2")), r: rec(0, "7", "2") }, { label: dotted(rec(0, "", "72")), r: rec(0, "", "72") }, { label: dotted(rec(0, "", "772")), r: rec(0, "", "772") }] },
      { items: [{ label: "36%", r: rec(0, "36", "") }, { label: dotted(rec(0, "3", "6")), r: rec(0, "3", "6") }, { label: dotted(rec(0, "", "365")), r: rec(0, "", "365") }, { label: dotted(rec(0, "36", "5")), r: rec(0, "36", "5") }, { label: "0.37", r: rec(0, "37", "") }] },
      { items: [{ label: dotted(rec(7, "", "284")), r: rec(7, "", "284") }, { label: dotted(rec(7, "2", "84")), r: rec(7, "2", "84") }, { label: "7.285", r: rec(7, "285", "") }, { label: dotted(rec(7, "28", "4")), r: rec(7, "28", "4") }, { label: "7.28", r: rec(7, "28", "") }] },
      { items: [{ label: dotted(rec(8, "", "972")), r: rec(8, "", "972") }, { label: dotted(rec(8, "97", "2")), r: rec(8, "97", "2") }, { label: dotted(rec(8, "", "927")), r: rec(8, "", "927") }, { label: dotted(rec(8, "92", "7")), r: rec(8, "92", "7") }, { label: "8.9", r: rec(8, "9", "") }] },
      { items: [{ label: dotted(rec(1, "", "93")), r: rec(1, "", "93") }, { label: dotted(rec(1, "9", "3")), r: rec(1, "9", "3") }, { label: dotted(rec(1, "", "935")), r: rec(1, "", "935") }, { label: dotted(rec(1, "93", "5")), r: rec(1, "93", "5") }, { label: "1.94", r: rec(1, "94", "") }] }
    ];
    const data = cases[variantIndex % cases.length];
    const sorted = [...data.items].sort((x, y) => compareRec(x.r, y.r));
    const middle = sorted[2];
    const listText = data.items.map((it) => it.label).join(" ,  ");
    const p = problemBase("middle-order", variantIndex, "choice");
    p.prompt = `If these five values were put in ascending order, which would be in the middle?   ${listText}`;
    p.hint1 = "Expand every value to the same number of decimal digits — a percentage is a decimal in disguise.";
    p.hint2 = `Expanded: ${data.items.map((it) => expanded(it.r, 5)).join(" , ")}. Sort those.`;
    p.solution = `Sorted: ${sorted.map((it) => it.label).join(" < ")}. The middle value is ${middle.label}.`;
    p.visual = { kind: "middle", principle: PRINCIPLE.middle, expr: "five values — which sits in the middle?", detail: `${sorted.map((it) => it.label).join(" < ")} → ${middle.label}` };
    const distractors = [sorted[1].label, sorted[3].label, sorted[0].label];
    return finishSymbolic(p, middle.label, distractors, variantIndex);
  }

  function terminatingRecurringProblem(variantIndex) {
    const cases = [
      { fracs: [[44, 125], [19, 48], [17, 32], [8, 25]] },
      { fracs: [[33, 48], [4, 17], [63, 125], [9, 45]] },
      { fracs: [[11, 50], [18, 21], [51, 75], [98, 100]] },
      { fracs: [[17, 50], [55, 66], [53, 64], [63, 90]] },
      { fracs: [[1, 4], [3, 11], [21, 40], [13, 100]] },
      { fracs: [[8, 15], [44, 125], [98, 100], [17, 50]] }
    ];
    const data = cases[variantIndex % cases.length];
    const infos = data.fracs.map(([n, d]) => ({ label: `${n}/${d}`, ...fractionType(n, d) }));
    const recurring = infos.find((f) => !f.terminating);
    const p = problemBase("terminating-recurring", variantIndex, "choice");
    p.prompt = `Exactly one of these fractions converts into a RECURRING decimal. Which one?   ${infos.map((f) => f.label).join(" ,  ")}`;
    p.hint1 = "Write each fraction in simplest form first, then break its denominator into prime factors.";
    p.hint2 = "A denominator built only from 2s and 5s terminates; any other prime factor makes the decimal recur.";
    p.solution = `${recurring.label} simplifies to ${recurring.simplest}, whose denominator has a prime factor other than 2 and 5 — so it recurs. The rest terminate.`;
    p.visual = { kind: "type", principle: PRINCIPLE.type, expr: `which of ${infos.map((f) => f.label).join(", ")} recurs?`, detail: `${recurring.label} → ${recurring.simplest} → recurring` };
    const distractors = infos.filter((f) => f.terminating).map((f) => f.label);
    return finishSymbolic(p, recurring.label, distractors, variantIndex);
  }

  function nthDigitProblem(variantIndex) {
    const cases = [
      { r: rec(0, "", "3278"), n: 25, name: null },
      { r: rec(0, "", "3278"), n: 40, name: null },
      { r: rec(0, "", "285714"), n: 100, name: "2/7" },
      { r: rec(0, "", "594"), n: 60, name: null },
      { r: rec(0, "", "745"), n: 88, name: null },
      { r: rec(5, "41", "6"), n: 10, name: null }
    ];
    const data = cases[variantIndex % cases.length];
    const answer = nthDigitOf(data.r, data.n);
    const label = data.name ? `${data.name} = ${dotted(data.r)}` : dotted(data.r);
    const p = problemBase("nth-digit", variantIndex, variantIndex % 2 ? "choice" : "filled");
    p.prompt = `In the decimal part of ${label}, what is the ${data.n}th digit after the decimal point?`;
    p.hint1 = data.r.pre ? `The first ${data.r.pre.length} digit(s) "${data.r.pre}" appear once; after that the block "${data.r.block}" cycles.` : `The block "${data.r.block}" cycles with period ${data.r.block.length}.`;
    p.hint2 = `Count past the one-off digits, then use (position − 1) mod ${data.r.block.length} to land inside the block.`;
    p.solution = `${label}: the ${data.n}th digit falls on block position ${((data.n - 1 - data.r.pre.length) % data.r.block.length) + 1}, which is ${answer}.`;
    p.visual = { kind: "nth", principle: PRINCIPLE.nth, expr: `${label} — digit number ${data.n}?`, detail: `(${data.n} − 1${data.r.pre ? ` − ${data.r.pre.length}` : ""}) mod ${data.r.block.length} → ${answer}` };
    const digits = [...new Set(data.r.block.split("").map(Number))];
    const distractors = distinctDistractors(answer, digits.filter((d) => d !== answer));
    return finishNumeric(p, answer, distractors, variantIndex);
  }

  function digitSumProblem(variantIndex) {
    const cases = [
      { r: rec(0, "", "3278"), mode: "first", n: 100 },
      { r: rec(0, "", "857142"), mode: "first", n: 100, name: "6/7" },
      { r: rec(0, "", "2867"), mode: "first", n: 42 },
      { r: rec(0, "", "594"), mode: "two", n1: 60, n2: 100 },
      { r: rec(0, "", "745"), mode: "two", n1: 72, n2: 88 },
      { r: rec(0, "", "142857"), mode: "first", n: 50, name: "1/7" }
    ];
    const data = cases[variantIndex % cases.length];
    const label = data.name ? `${data.name} = ${dotted(data.r)}` : dotted(data.r);
    const p = problemBase("digit-sum", variantIndex, variantIndex % 2 ? "choice" : "filled");
    let answer;
    if (data.mode === "first") {
      answer = sumFirstDigits(data.r, data.n);
      const per = data.r.block.length;
      const full = Math.floor(data.n / per);
      const rest = data.n % per;
      p.prompt = `For the decimal ${label}, what is the sum of the first ${data.n} digits after the decimal point?`;
      p.hint1 = `The block "${data.r.block}" sums to ${blockSum(data.r)} and has period ${per}.`;
      p.hint2 = `${data.n} digits = ${full} whole block(s)${rest ? ` plus the first ${rest} digit(s) of the next block` : ""}.`;
      p.solution = `The block "${data.r.block}" sums to ${blockSum(data.r)}, and ${data.n} digits hold ${full} whole block(s)${rest ? ` plus the leftover digit(s) ${digitsOf(data.r, data.n).slice(full * per).split("").join(", ")}` : ""}: ${full} × ${blockSum(data.r)}${rest ? ` + ${digitsOf(data.r, data.n).slice(full * per).split("").join(" + ")}` : ""} = ${answer}.`;
      p.visual = { kind: "sum", principle: PRINCIPLE.sum, expr: `${label} — sum of first ${data.n} digits?`, detail: `${full} × ${blockSum(data.r)}${rest ? " + leftovers" : ""} = ${answer}` };
    } else {
      answer = nthDigitOf(data.r, data.n1) + nthDigitOf(data.r, data.n2);
      p.prompt = `For the decimal ${label}, what is the sum of the ${data.n1}th digit and the ${data.n2}th digit after the decimal point?`;
      p.hint1 = `Find each digit separately with (position − 1) mod ${data.r.block.length}, then add them.`;
      p.hint2 = `Block "${data.r.block}": work out where positions ${data.n1} and ${data.n2} land inside it.`;
      p.solution = `Digit ${data.n1} is ${nthDigitOf(data.r, data.n1)} and digit ${data.n2} is ${nthDigitOf(data.r, data.n2)}; their sum is ${answer}.`;
      p.visual = { kind: "sum", principle: PRINCIPLE.sum, expr: `${label} — digit ${data.n1} + digit ${data.n2}?`, detail: `${nthDigitOf(data.r, data.n1)} + ${nthDigitOf(data.r, data.n2)} = ${answer}` };
    }
    const distractors = distinctDistractors(answer, [answer + blockSum(data.r) % 9, answer - 1, answer + 1, answer + 2]);
    return finishNumeric(p, answer, distractors, variantIndex);
  }

  function generateProblem(classicId, variantIndex = 0) {
    const generators = {
      "dots-notation": dotsNotationProblem,
      "compare-two": compareTwoProblem,
      "middle-order": middleOrderProblem,
      "terminating-recurring": terminatingRecurringProblem,
      "nth-digit": nthDigitProblem,
      "digit-sum": digitSumProblem
    };
    const generator = generators[classicId];
    if (!generator) return null;
    const problem = generator(variantIndex);
    if (problem && CLASSIC_SKILLS[classicId]) problem.skillTag = CLASSIC_SKILLS[classicId];
    return problem;
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
    const correct = Math.abs(value - Number(problem.expected)) < 1e-6;
    return { isCorrect: correct, errorClass: correct ? null : "number_mismatch" };
  }

  function svgShell(inner) {
    return `<svg viewBox="0 0 560 330" role="img" aria-label="Recurring decimals visual">${inner}</svg>`;
  }

  // Shared stable "repeat card": three digit tiles with a loop arrow (the
  // repeating-block motif), the teaching principle, the case's expression, and
  // a worked detail line hidden behind "= ?" until reveal. The element
  // skeleton is identical across variants within each state (the solution
  // state adds only the answer banner), so diagram-parity passes, and the
  // answer appears only in that banner.
  function renderProblemVisual(problem, state = "initial") {
    if (!problem || !problem.visual) {
      return { html: svgShell(`<text x="280" y="170" text-anchor="middle" class="formula-note">No problem to show.</text>`), text: "No problem to show." };
    }
    const v = problem.visual;
    const isRevealed = state === "solution" || state === "worked";
    const answer = isRevealed
      ? `<text x="280" y="306" text-anchor="middle" class="formula-note">Answer: ${escapeHtml(problem.expectedDisplay)}</text>`
      : "";
    const html = svgShell(`
        <rect x="150" y="92" width="72" height="72" rx="10" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <rect x="244" y="92" width="72" height="72" rx="10" fill="#ffe6e0" stroke="#16345d" stroke-width="4"/>
        <rect x="338" y="92" width="72" height="72" rx="10" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <text x="186" y="140" text-anchor="middle" class="side-label" style="font-size:30px">•</text>
        <text x="280" y="140" text-anchor="middle" class="side-label" style="font-size:30px">•</text>
        <text x="374" y="140" text-anchor="middle" class="side-label" style="font-size:30px">•</text>
        <path d="M 396 84 Q 280 30 164 84" fill="none" stroke="#0b8993" stroke-width="4"/>
        <text x="280" y="196" text-anchor="middle" class="formula-note">the block repeats forever</text>
        <text x="280" y="52" text-anchor="middle" class="formula-note">${escapeHtml(v.principle)}</text>
        <text x="280" y="232" text-anchor="middle" class="side-label" style="font-size:15px">${escapeHtml(v.expr)}</text>
        <text x="280" y="262" text-anchor="middle" class="formula-note">${escapeHtml(isRevealed ? v.detail : "= ?")}</text>
        ${answer}
      `);
    const text = problem.skill;
    return { html, text };
  }

  // Dedicated intro teaching diagrams (separate from the practice card).
  function introShell(inner) {
    return `<svg viewBox="0 0 560 330" role="img" aria-label="Recurring decimals intro scene">${inner}</svg>`;
  }

  function introDots() {
    return introShell(`
        <text x="280" y="34" text-anchor="middle" class="side-label" style="font-size:17px">Dots mark the repeating block</text>
        <text x="280" y="96" text-anchor="middle" class="side-label" style="font-size:20px">8.271271271…</text>
        <text x="280" y="134" text-anchor="middle" class="formula-note">the block 271 repeats</text>
        <rect x="200" y="156" width="160" height="52" rx="10" fill="#fff8dc" stroke="#16345d" stroke-width="3"/>
        <text x="280" y="190" text-anchor="middle" class="side-label" style="font-size:22px">8.2${DOT}71${DOT}</text>
        <text x="280" y="246" text-anchor="middle" class="formula-note" style="font-size:15px">one dot on the first block digit, one on the last</text>
        <text x="280" y="276" text-anchor="middle" class="formula-note" style="font-size:15px">single repeating digit → single dot: 5.416${DOT}</text>
      `);
  }

  function introCompare() {
    return introShell(`
        <text x="280" y="34" text-anchor="middle" class="side-label" style="font-size:17px">Expand, then find the first difference</text>
        <text x="280" y="92" text-anchor="middle" class="side-label" style="font-size:17px">0.42${DOT}5${DOT} = 0.42525…</text>
        <text x="280" y="128" text-anchor="middle" class="side-label" style="font-size:17px">0.4${DOT}25${DOT} = 0.42542…</text>
        <rect x="330" y="66" width="34" height="76" rx="6" fill="none" stroke="#ff7654" stroke-width="3"/>
        <text x="280" y="188" text-anchor="middle" class="formula-note" style="font-size:15px">first three digits match; at the 4th, 2 &lt; 4</text>
        <text x="280" y="228" text-anchor="middle" class="side-label" style="font-size:17px">so 0.42${DOT}5${DOT} is smaller</text>
      `);
  }

  function introMiddle() {
    return introShell(`
        <text x="280" y="34" text-anchor="middle" class="side-label" style="font-size:17px">Expand everything, sort, take the centre</text>
        <text x="280" y="88" text-anchor="middle" class="formula-note" style="font-size:15px">72% → 0.7200   0.72${DOT} → 0.7222   0.7${DOT}2${DOT} → 0.7272</text>
        <text x="280" y="118" text-anchor="middle" class="formula-note" style="font-size:15px">0.7${DOT}27${DOT} → 0.7277   0.7${DOT}72${DOT} → 0.7727</text>
        <line x1="70" y1="170" x2="490" y2="170" stroke="#16345d" stroke-width="4"/>
        <circle cx="130" cy="170" r="7" fill="#0b8993"/>
        <circle cx="205" cy="170" r="7" fill="#0b8993"/>
        <circle cx="280" cy="170" r="12" fill="#ff7654" stroke="#16345d" stroke-width="3"/>
        <circle cx="355" cy="170" r="7" fill="#0b8993"/>
        <circle cx="430" cy="170" r="7" fill="#0b8993"/>
        <text x="280" y="214" text-anchor="middle" class="formula-note">five in a row — the third is the middle</text>
        <text x="280" y="252" text-anchor="middle" class="side-label" style="font-size:17px">middle = 0.7${DOT}2${DOT}</text>
      `);
  }

  function introType() {
    return introShell(`
        <text x="280" y="34" text-anchor="middle" class="side-label" style="font-size:17px">Only 2s and 5s stop the decimal</text>
        <rect x="76" y="70" width="190" height="120" rx="10" fill="#fff8dc" stroke="#16345d" stroke-width="3"/>
        <text x="171" y="104" text-anchor="middle" class="side-label">21/40</text>
        <text x="171" y="136" text-anchor="middle" class="formula-note">40 = 2×2×2×5</text>
        <text x="171" y="168" text-anchor="middle" class="side-label" style="font-size:15px">terminates: 0.525</text>
        <rect x="294" y="70" width="190" height="120" rx="10" fill="#ffe6e0" stroke="#16345d" stroke-width="3"/>
        <text x="389" y="104" text-anchor="middle" class="side-label">5/6</text>
        <text x="389" y="136" text-anchor="middle" class="formula-note">6 = 2×3 — a 3!</text>
        <text x="389" y="168" text-anchor="middle" class="side-label" style="font-size:15px">recurs: 0.83${DOT}</text>
        <text x="280" y="234" text-anchor="middle" class="formula-note" style="font-size:15px">simplify first: 20/24 → 5/6 before factorising</text>
      `);
  }

  function introNth() {
    return introShell(`
        <text x="280" y="34" text-anchor="middle" class="side-label" style="font-size:17px">The digits cycle with the period</text>
        <text x="280" y="88" text-anchor="middle" class="side-label" style="font-size:19px">0.3${DOT}278${DOT}   period 4</text>
        <rect x="150" y="112" width="260" height="50" rx="10" fill="#fff8dc" stroke="#16345d" stroke-width="3"/>
        <text x="280" y="145" text-anchor="middle" class="side-label" style="font-size:18px">3  2  7  8  |  3  2  7  8  | …</text>
        <text x="280" y="200" text-anchor="middle" class="formula-note" style="font-size:15px">25th digit: (25 − 1) mod 4 = 0 → 1st of the block → 3</text>
        <text x="280" y="232" text-anchor="middle" class="formula-note" style="font-size:15px">40th digit: (40 − 1) mod 4 = 3 → 4th of the block → 8</text>
      `);
  }

  function introSum() {
    return introShell(`
        <text x="280" y="34" text-anchor="middle" class="side-label" style="font-size:17px">Whole blocks, then the leftovers</text>
        <text x="280" y="88" text-anchor="middle" class="side-label" style="font-size:18px">0.3${DOT}278${DOT} — first 100 digits</text>
        <rect x="120" y="112" width="150" height="50" rx="10" fill="#fff8dc" stroke="#16345d" stroke-width="3"/>
        <text x="195" y="145" text-anchor="middle" class="side-label">3+2+7+8 = 20</text>
        <rect x="290" y="112" width="150" height="50" rx="10" fill="#ffe6e0" stroke="#16345d" stroke-width="3"/>
        <text x="365" y="145" text-anchor="middle" class="side-label">100 ÷ 4 = 25</text>
        <text x="280" y="204" text-anchor="middle" class="formula-note" style="font-size:15px">25 whole blocks, no leftovers</text>
        <text x="280" y="240" text-anchor="middle" class="side-label" style="font-size:17px">sum = 25 × 20 = 500</text>
      `);
  }

  function renderIntroScene(index) {
    const scene = INTRO_SCENES[index % INTRO_SCENES.length];
    const builders = {
      "dots-notation": introDots,
      "compare-two": introCompare,
      "middle-order": introMiddle,
      "terminating-recurring": introType,
      "nth-digit": introNth,
      "digit-sum": introSum
    };
    const build = builders[scene.classicId];
    if (build) return build();
    return renderProblemVisual(generateProblem(scene.classicId, index), "initial").html;
  }

  function createRound(offset = 0) {
    return CLASSIC_IDS.map((classicId, index) => generateProblem(classicId, offset + index));
  }

  const api = {
    CLASSICS,
    CLASSIC_IDS,
    CLASSIC_SKILLS,
    SOURCE_COVERAGE,
    INTRO_SCENES,
    INTRO_SCENE_MS,
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

  root.RecurringDecimals1Module = api;

  // ---- browser UI driver -----------------------------------------------------

  const state = {
    introIndex: 0,
    introPlaying: false,
    introStartedAt: 0,
    introTimer: null,
    audioEnabled: true,
    currentUtterance: null,
    roundOffset: 0,
    round: createRound(0),
    current: 0,
    answers: [],
    hintCount: 0
  };

  const $ = (id) => document.getElementById(id);

  function speechEngine() {
    return typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;
  }

  function chooseNarrationVoice() {
    const synth = speechEngine();
    if (!synth) return null;
    const voices = synth.getVoices();
    const englishVoices = voices.filter((voice) => /^en/i.test(voice.lang || ""));
    return englishVoices.find((voice) => /natural|online|neural|jenny|aria|sonia|libby/i.test(voice.name))
      || englishVoices.find((voice) => /microsoft|google/i.test(voice.name))
      || englishVoices[0]
      || voices[0]
      || null;
  }

  function updateAudioStatus(message) {
    const status = $("intro-audio-status");
    if (status) status.textContent = message;
    const button = $("intro-audio");
    if (button) button.textContent = state.audioEnabled ? "Audio on" : "Audio off";
  }

  function cancelIntroSpeech() {
    const synth = speechEngine();
    if (synth) synth.cancel();
    const audio = $("intro-audio-player");
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch (error) {
        // Some browsers cannot reset currentTime until metadata has loaded.
      }
    }
    state.currentUtterance = null;
  }

  function speakIntroSceneFallback() {
    const synth = speechEngine();
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
      updateAudioStatus("Audio is not available in this browser, but the narration text is shown below the animation.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(INTRO_SCENES[state.introIndex].voiceover);
    const voice = chooseNarrationVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    utterance.volume = 1;
    utterance.onstart = () => updateAudioStatus("Audio playing.");
    utterance.onend = () => {
      state.currentUtterance = null;
      updateAudioStatus(state.introPlaying ? "Audio ready for the next scene." : "Audio ready.");
    };
    utterance.onerror = () => {
      state.currentUtterance = null;
      updateAudioStatus("Audio was blocked by the browser. Press Play intro video again to restart it.");
    };
    state.currentUtterance = utterance;
    updateAudioStatus("Audio starting.");
    synth.speak(utterance);
  }

  function speakIntroScene() {
    if (!state.audioEnabled) {
      updateAudioStatus("Audio off. Turn it on to hear the narration.");
      return;
    }
    cancelIntroSpeech();
    const scene = INTRO_SCENES[state.introIndex];
    const audio = $("intro-audio-player");
    if (!audio || !scene.audio) {
      speakIntroSceneFallback();
      return;
    }
    let fallbackStarted = false;
    const startFallback = () => {
      if (fallbackStarted) return;
      fallbackStarted = true;
      updateAudioStatus("Audio file was blocked, so I am trying the browser narration instead.");
      speakIntroSceneFallback();
    };
    audio.src = scene.audio;
    try {
      audio.currentTime = 0;
    } catch (error) {
      // The browser may need metadata before accepting a seek.
    }
    audio.onplay = () => updateAudioStatus("Audio playing.");
    audio.onended = () => updateAudioStatus(state.introPlaying ? "Audio ready for the next scene." : "Audio ready.");
    audio.onerror = startFallback;
    updateAudioStatus("Audio starting.");
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") playAttempt.catch(startFallback);
  }

  function currentIntroDurationMs() {
    const scene = INTRO_SCENES[state.introIndex];
    return scene.durationMs || INTRO_SCENE_MS;
  }

  function toggleIntroAudio() {
    state.audioEnabled = !state.audioEnabled;
    if (!state.audioEnabled) {
      cancelIntroSpeech();
      updateAudioStatus("Audio off. The narration text remains visible.");
      return;
    }
    updateAudioStatus("Audio on. Press Play intro video to hear the narration.");
    if (state.introPlaying) speakIntroScene();
  }

  function renderIntro() {
    const scene = INTRO_SCENES[state.introIndex];
    $("intro-title").textContent = scene.title;
    $("intro-count").textContent = `${state.introIndex + 1} of ${INTRO_SCENES.length}`;
    $("intro-frame").innerHTML = renderIntroScene(state.introIndex);
    $("intro-frame").classList.toggle("playing", state.introPlaying);
    $("intro-voiceover").textContent = scene.voiceover;
    $("intro-caption").textContent = scene.caption;
    $("intro-storyboard").innerHTML = INTRO_SCENES.map((item, index) => `<li class="${index === state.introIndex ? "active" : ""}"><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.purpose)}</li>`).join("");
    $("intro-play").textContent = state.introPlaying ? "Pause intro" : (state.introIndex === INTRO_SCENES.length - 1 ? "Replay intro" : "Play intro video");
    updateAudioStatus(state.audioEnabled ? "Audio ready. Press Play intro video to hear the narration." : "Audio off. The narration text remains visible.");
  }

  function clearIntroTimer() {
    if (state.introTimer) {
      clearInterval(state.introTimer);
      state.introTimer = null;
    }
  }

  function setIntroProgress(percent) {
    const fill = $("intro-progress-fill");
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }

  function stopIntroPlayback(progress = 0) {
    clearIntroTimer();
    cancelIntroSpeech();
    state.introPlaying = false;
    setIntroProgress(progress);
    renderIntro();
  }

  function advanceIntro(keepPlaying = false) {
    const atEnd = state.introIndex >= INTRO_SCENES.length - 1;
    if (atEnd && keepPlaying) {
      stopIntroPlayback(100);
      return;
    }
    state.introIndex = atEnd ? 0 : state.introIndex + 1;
    if (keepPlaying) startIntroPlayback();
    else {
      cancelIntroSpeech();
      state.introPlaying = false;
      setIntroProgress(0);
      renderIntro();
    }
  }

  function retreatIntro() {
    // Manual step backwards. Stepping always pauses autoplay so the learner
    // can dwell on the scene; wraps from the first scene round to the last.
    clearIntroTimer();
    cancelIntroSpeech();
    state.introPlaying = false;
    state.introIndex = state.introIndex <= 0 ? INTRO_SCENES.length - 1 : state.introIndex - 1;
    setIntroProgress(0);
    renderIntro();
  }

  function startIntroPlayback() {
    clearIntroTimer();
    if (state.introIndex >= INTRO_SCENES.length - 1 && !state.introPlaying) state.introIndex = 0;
    state.introPlaying = true;
    state.introStartedAt = Date.now();
    setIntroProgress(0);
    renderIntro();
    speakIntroScene();
    state.introTimer = setInterval(() => {
      const percent = ((Date.now() - state.introStartedAt) / currentIntroDurationMs()) * 100;
      setIntroProgress(percent);
      if (percent >= 100) advanceIntro(true);
    }, 80);
  }

  function toggleIntroPlayback() {
    if (state.introPlaying) stopIntroPlayback(Number($("intro-progress-fill").style.width.replace("%", "")) || 0);
    else startIntroPlayback();
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
    stopIntroPlayback(0);
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
      return `<div class="choice-grid">${problem.choices.map((choice) => `<label class="choice-card"><input type="radio" name="choice" value="${escapeHtml(choice.label)}"><span>${escapeHtml(formatMathText(choice.label))}</span></label>`).join("")}</div>`;
    }
    return `<input class="filled-answer" name="value" autocomplete="off" inputmode="numeric" placeholder="Type the number">`;
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
      : "<div><strong>Clean round.</strong><br>You dotted the blocks, expanded to compare, spotted the recurring fractions, and rode the period to faraway digits.</div>";
  }

  function freshRound() {
    // Advance by 1 (coprime with every generator's case-list length) so a
    // fresh round shifts each classic to a genuinely different variant rather
    // than landing on the same case via variantIndex % cases.length.
    state.roundOffset += 1;
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
    $("intro-audio").addEventListener("click", toggleIntroAudio);
    $("intro-prev").addEventListener("click", retreatIntro);
    $("intro-next").addEventListener("click", () => advanceIntro(false));
    $("intro-play").addEventListener("click", toggleIntroPlayback);
    $("answer-form").addEventListener("submit", checkCurrent);
    $("hint-button").addEventListener("click", showHint);
    $("why-button").addEventListener("click", showWhy);
    $("next-button").addEventListener("click", nextProblem);
    $("similar-button").addEventListener("click", () => {
      state.round[state.current] = generateProblem(currentProblem().classicId, currentProblem().variantIndex + 1);
      state.answers[state.current] = undefined;
      renderProblem();
    });
    $("fresh-round-button").addEventListener("click", freshRound);
    $("review-intro-button").addEventListener("click", showIntro);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : globalThis);
