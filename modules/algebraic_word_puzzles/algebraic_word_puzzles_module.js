// TODO(scaffold): replace this placeholder bank with the real classics for "Algebraic Word Puzzles".
(function (root) {
  "use strict";

  const ROUND_LENGTH = 5;
  const INTRO_SCENE_MS = 9000;

  const CLASSICS = [
    {
      id: "algebraic-word-puzzles-placeholder",
      nickname: "Placeholder Classic",
      skill: "Placeholder skill — replace this string with the real teaching skill once classics are written.",
      sourcePages: "Book TODO / PDF TODO"
    }
  ];

  const CLASSIC_IDS = CLASSICS.map((classic) => classic.id);
  const CLASSIC_BY_ID = Object.fromEntries(CLASSICS.map((classic) => [classic.id, classic]));

  const SOURCE_COVERAGE = {
    "algebraic-word-puzzles-placeholder": ["TODO: list source sections that motivate this classic."]
  };

  const INTRO_SCENES = [
    {
      title: "Placeholder skill — intro step 1",
      purpose: "Placeholder purpose — replace this text with what scene 1 teaches.",
      classicId: "algebraic-word-puzzles-placeholder",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene one. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 2",
      purpose: "Placeholder purpose — replace this text with what scene 2 teaches.",
      classicId: "algebraic-word-puzzles-placeholder",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene two. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 3",
      purpose: "Placeholder purpose — replace this text with what scene 3 teaches.",
      classicId: "algebraic-word-puzzles-placeholder",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene three. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 4",
      purpose: "Placeholder purpose — replace this text with what scene 4 teaches.",
      classicId: "algebraic-word-puzzles-placeholder",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene four. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 5",
      purpose: "Placeholder purpose — replace this text with what scene 5 teaches.",
      classicId: "algebraic-word-puzzles-placeholder",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene five. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
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
      .replace(/\^1/g, "\u00b9")
      .replace(/\^2/g, "\u00b2")
      .replace(/\^3/g, "\u00b3");
  }

  function parseNumber(value) {
    const text = String(value ?? "").replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
    return text ? Number(text[0]) : NaN;
  }

  function rotateChoice(choices, correct, variantIndex) {
    const unique = [...new Set(choices.map(String))];
    const without = unique.filter((choice) => choice !== String(correct));
    const ordered = [String(correct), ...without].slice(0, 4);
    const offset = variantIndex % ordered.length;
    const rotated = ordered.slice(offset).concat(ordered.slice(0, offset));
    return rotated.map((label) => ({ label, isCorrect: label === String(correct) }));
  }

  function placeholderProblem(variantIndex) {
    const v = Number(variantIndex) || 0;
    const correct = (v % 8) + 2;
    const distractors = [correct + 1, correct + 2, correct + 3];
    const promptVariants = [
      `Placeholder prompt set A: which value matches step ${v + 1}?`,
      `Placeholder prompt set B: which value matches step ${v + 1}?`,
      `Placeholder prompt set C: which value matches step ${v + 1}?`,
      `Placeholder prompt set D: which value matches step ${v + 1}?`
    ];
    const classic = CLASSIC_BY_ID["algebraic-word-puzzles-placeholder"];
    const problem = {
      id: "algebraic-word-puzzles-placeholder-" + v,
      classicId: "algebraic-word-puzzles-placeholder",
      classic: classic.nickname,
      skill: classic.skill,
      skillTag: "Placeholder skill",
      sourcePages: classic.sourcePages,
      variantIndex: v,
      answerType: "choice",
      answerMode: "choice",
      prompt: promptVariants[v % promptVariants.length],
      expected: correct,
      expectedDisplay: String(correct),
      correctInput: { choice: String(correct) },
      choices: rotateChoice([correct, ...distractors], correct, v),
      hint1: "Placeholder hint one — replace with a real first hint.",
      hint2: "Placeholder hint two — replace with a real second hint.",
      solution: "Placeholder solution — replace with a real worked solution that explains the answer.",
      visual: { type: "placeholder", value: correct, index: v }
    };
    return problem;
  }

  function generateProblem(classicId, variantIndex = 0) {
    if (classicId !== "algebraic-word-puzzles-placeholder") return null;
    return placeholderProblem(variantIndex);
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
    return `<svg viewBox="0 0 560 330" role="img" aria-label="Algebraic Word Puzzles placeholder visual">${inner}</svg>`;
  }

  function renderProblemVisual(problem, state = "initial") {
    const isRevealed = state === "solution" || state === "worked";
    const answer = isRevealed
      ? `<text x="280" y="306" text-anchor="middle" class="formula-note">Answer: ${escapeHtml(problem.expectedDisplay)}</text>`
      : "";
    const html = svgShell(`
        <rect x="80" y="60" width="400" height="180" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <text x="280" y="160" text-anchor="middle" class="formula-note">Placeholder visual</text>
        ${answer}
      `);
    const text = "Placeholder visual — replace with a real diagram for this classic.";
    return { html, text };
  }

  function renderIntroScene(index) {
    const scene = INTRO_SCENES[index % INTRO_SCENES.length];
    const fakeProblem = generateProblem(scene.classicId || CLASSIC_IDS[0], index);
    return renderProblemVisual(fakeProblem, "initial").html;
  }

  function createRound(offset = 0) {
    return Array.from({ length: ROUND_LENGTH }, (_, i) => generateProblem("algebraic-word-puzzles-placeholder", offset + i));
  }

  const api = {
    CLASSICS,
    CLASSIC_IDS,
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

  root.AlgebraicWordPuzzlesModule = api;
})(typeof window !== "undefined" ? window : globalThis);
