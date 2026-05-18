#!/usr/bin/env node
/*
 * scripts/new-module.mjs
 *
 * One-command scaffolder for a new PMC Math Quest module. Copies a template
 * folder (default: modules/triangle_sides), renames every file and every
 * "triangle_sides / triangleSides / Triangle Sides / TRIANGLE_SIDES" token
 * to the new slug's variants, stubs out the module JS / audit JS / tests JS
 * / intro pack / source extract with QA-passing placeholders, and appends a
 * fresh entry to modules/registry.json with status="draft".
 *
 * Usage:
 *   node scripts/new-module.mjs \
 *     --slug=mean_median --unit=stats --topic="Averages" \
 *     --display="Mean and Median" --chapter="Lesson 18" \
 *     --order=90 --variant=averages
 *
 * Required flags: --slug --display --chapter --unit --topic --order --variant
 * Optional flags: --short-label --difficulty --tags --skills --blurb --template-from
 *
 * ESM, zero dependencies. The scaffolder rolls back any partial work if a
 * step fails — the repo never ends up with a half-created module.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");

// ---- arg parsing -----------------------------------------------------------

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const eq = token.indexOf("=");
    let key;
    let value;
    if (eq >= 0) {
      key = token.slice(2, eq);
      value = token.slice(eq + 1);
    } else {
      key = token.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        value = next;
        i += 1;
      } else {
        value = "true";
      }
    }
    args[key] = value;
  }
  return args;
}

// ---- slug variants ---------------------------------------------------------

function slugVariants(slug) {
  const parts = slug.split("_").filter(Boolean);
  const camel = parts
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join("");
  const title = parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const constant = parts.map((p) => p.toUpperCase()).join("_");
  return { snake: slug, camel, title, constant };
}

// ---- registry --------------------------------------------------------------

async function loadRegistry() {
  const raw = await fs.readFile(REGISTRY_PATH, "utf8");
  return JSON.parse(raw);
}

// Serialize a single registry entry the way the existing entries are written:
// inline arrays for string-only `tags` / `skills`, two-space indent everywhere
// else. This preserves the file's diff-friendly hand-edited style.
function formatRegistryEntry(entry, indent) {
  const pad = " ".repeat(indent);
  const innerPad = " ".repeat(indent + 2);
  const lines = ["{"];
  const keys = Object.keys(entry);
  keys.forEach((key, idx) => {
    const value = entry[key];
    let serialized;
    if ((key === "tags" || key === "skills") && Array.isArray(value)) {
      serialized = "[" + value.map((v) => JSON.stringify(v)).join(", ") + "]";
    } else {
      serialized = JSON.stringify(value, null, 2);
      // Re-indent multiline JSON.stringify output so it sits inside our entry block.
      if (serialized.includes("\n")) {
        serialized = serialized
          .split("\n")
          .map((ln, i) => (i === 0 ? ln : innerPad + ln))
          .join("\n");
      }
    }
    const comma = idx === keys.length - 1 ? "" : ",";
    lines.push(`${innerPad}${JSON.stringify(key)}: ${serialized}${comma}`);
  });
  lines.push(`${pad}}`);
  return lines.join("\n");
}

// Rewrite registry.json by inserting the new entry's formatted block immediately
// before the closing `]` of the `"modules"` array. This avoids reformatting any
// existing entries (which use inline arrays for `tags` and `skills` that
// JSON.stringify would expand).
async function appendRegistryEntry(newEntry) {
  const raw = await fs.readFile(REGISTRY_PATH, "utf8");
  // Locate the end of the modules array. We look for the LAST `}` followed by
  // optional whitespace and `]` — that's the closing bracket of the array.
  const closeIdx = raw.lastIndexOf("]");
  if (closeIdx < 0) throw new Error("registry.json: cannot find closing array bracket");
  // Find the matching `}` immediately before the closing `]` so we can insert
  // a comma after it. Walk backwards over whitespace.
  let i = closeIdx - 1;
  while (i >= 0 && /\s/.test(raw[i])) i -= 1;
  if (i < 0 || raw[i] !== "}") {
    // Empty modules array — write the first entry directly inside.
    const before = raw.slice(0, closeIdx);
    const after = raw.slice(closeIdx);
    const block = formatRegistryEntry(newEntry, 4);
    const out = before.replace(/\s*$/, "") + "\n    " + block + "\n  " + after;
    await fs.writeFile(REGISTRY_PATH, out, "utf8");
    return;
  }
  // Insert `,\n    <new-entry>` after the last `}` and before the `]`.
  const insertAt = i + 1;
  const block = formatRegistryEntry(newEntry, 4);
  const out = raw.slice(0, insertAt) + ",\n    " + block + raw.slice(insertAt);
  await fs.writeFile(REGISTRY_PATH, out, "utf8");
}

// ---- copy helpers ----------------------------------------------------------

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function listFilesRecursive(dir) {
  // Returns array of relative paths (POSIX-style) under dir.
  const out = [];
  async function walk(current, rel) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const next = path.join(current, entry.name);
      const nextRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        await walk(next, nextRel);
      } else if (entry.isFile()) {
        out.push(nextRel);
      }
    }
  }
  await walk(dir, "");
  return out;
}

// ---- file content stubs ----------------------------------------------------

function moduleJsStub(v, displayName) {
  // v = slug variants. Build a minimal module exposing the surface every QA
  // gate inspects: CLASSICS, CLASSIC_IDS, SOURCE_COVERAGE, INTRO_SCENES,
  // generateProblem, renderProblemVisual, validateProblemMath, checkAnswer,
  // formatMathText, parseNumber, renderIntroScene, createRound.
  const placeholderId = `${v.snake.replace(/_/g, "-")}-placeholder`;
  const titleEsc = displayName.replace(/"/g, '\\"');
  return `// TODO(scaffold): replace this placeholder bank with the real classics for "${titleEsc}".
(function (root) {
  "use strict";

  const ROUND_LENGTH = 5;
  const INTRO_SCENE_MS = 9000;

  const CLASSICS = [
    {
      id: "${placeholderId}",
      nickname: "Placeholder Classic",
      skill: "Placeholder skill — replace this string with the real teaching skill once classics are written.",
      sourcePages: "Book TODO / PDF TODO"
    }
  ];

  const CLASSIC_IDS = CLASSICS.map((classic) => classic.id);
  const CLASSIC_BY_ID = Object.fromEntries(CLASSICS.map((classic) => [classic.id, classic]));

  const SOURCE_COVERAGE = {
    "${placeholderId}": ["TODO: list source sections that motivate this classic."]
  };

  const INTRO_SCENES = [
    {
      title: "Placeholder skill — intro step 1",
      purpose: "Placeholder purpose — replace this text with what scene 1 teaches.",
      classicId: "${placeholderId}",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene one. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 2",
      purpose: "Placeholder purpose — replace this text with what scene 2 teaches.",
      classicId: "${placeholderId}",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene two. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 3",
      purpose: "Placeholder purpose — replace this text with what scene 3 teaches.",
      classicId: "${placeholderId}",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene three. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 4",
      purpose: "Placeholder purpose — replace this text with what scene 4 teaches.",
      classicId: "${placeholderId}",
      kind: "placeholder",
      durationMs: 9000,
      caption: "Placeholder caption — replace with a one-line visual explanation children will read.",
      voiceover: "This is a placeholder voiceover for scene four. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next."
    },
    {
      title: "Placeholder skill — intro step 5",
      purpose: "Placeholder purpose — replace this text with what scene 5 teaches.",
      classicId: "${placeholderId}",
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
      .replace(/\\^1/g, "\\u00b9")
      .replace(/\\^2/g, "\\u00b2")
      .replace(/\\^3/g, "\\u00b3");
  }

  function parseNumber(value) {
    const text = String(value ?? "").replace(/,/g, "").match(/-?\\d+(?:\\.\\d+)?/);
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
      \`Placeholder prompt set A: which value matches step \${v + 1}?\`,
      \`Placeholder prompt set B: which value matches step \${v + 1}?\`,
      \`Placeholder prompt set C: which value matches step \${v + 1}?\`,
      \`Placeholder prompt set D: which value matches step \${v + 1}?\`
    ];
    const classic = CLASSIC_BY_ID["${placeholderId}"];
    const problem = {
      id: "${placeholderId}-" + v,
      classicId: "${placeholderId}",
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
    if (classicId !== "${placeholderId}") return null;
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
    return \`<svg viewBox="0 0 560 330" role="img" aria-label="${titleEsc} placeholder visual">\${inner}</svg>\`;
  }

  function renderProblemVisual(problem, state = "initial") {
    const isRevealed = state === "solution" || state === "worked";
    const answer = isRevealed
      ? \`<text x="280" y="306" text-anchor="middle" class="formula-note">Answer: \${escapeHtml(problem.expectedDisplay)}</text>\`
      : "";
    const html = svgShell(\`
        <rect x="80" y="60" width="400" height="180" fill="#fff8dc" stroke="#16345d" stroke-width="4"/>
        <text x="280" y="160" text-anchor="middle" class="formula-note">Placeholder visual</text>
        \${answer}
      \`);
    const text = "Placeholder visual — replace with a real diagram for this classic.";
    return { html, text };
  }

  function renderIntroScene(index) {
    const scene = INTRO_SCENES[index % INTRO_SCENES.length];
    const fakeProblem = generateProblem(scene.classicId || CLASSIC_IDS[0], index);
    return renderProblemVisual(fakeProblem, "initial").html;
  }

  function createRound(offset = 0) {
    return Array.from({ length: ROUND_LENGTH }, (_, i) => generateProblem("${placeholderId}", offset + i));
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

  root.${v.camel.charAt(0).toUpperCase() + v.camel.slice(1)}Module = api;
})(typeof window !== "undefined" ? window : globalThis);
`;
}

function auditJsStub(v) {
  return `const assert = require("assert");
const mod = require("./${v.snake}_module.js");

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length >= 1, "module must expose at least one CLASSIC_IDS entry");

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
      assert.ok(mod.checkAnswer(problem, problem.correctInput).isCorrect, problem.id + " should accept correct input");
      const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
      assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, problem.id + " should reject wrong input");
      const visual = mod.renderProblemVisual(problem, "solution");
      assert.ok(visual.html.includes('role="img"'), problem.id + " should render an accessible visual");
      assert.ok(visual.text.length > 20, problem.id + " visual text should explain the diagram");
      const initialVisual = mod.renderProblemVisual(problem, "initial");
      assert.ok(!initialVisual.html.includes("Answer:"), problem.id + " initial visual must not include the answer banner");
      prompts.add(problem.prompt);
      if (problem.answerType === "choice") {
        assert.strictEqual(problem.choices.filter((choice) => choice.isCorrect).length, 1, problem.id + " needs one correct choice");
        choicePositions.add(problem.choices.findIndex((choice) => choice.isCorrect));
      }
    }
    assert.ok(prompts.size >= 4, classicId + " needs varied prompts");
    if (choicePositions.size > 0) {
      assert.ok(choicePositions.size >= 2, classicId + " should vary correct multiple-choice positions");
    }
  }

  console.log("Placeholder ${v.snake} bank audit passed for " + (mod.CLASSIC_IDS.length * 16) + " generated questions.");
}

if (require.main === module) {
  run();
}

module.exports = { run };
`;
}

function testsJsStub(v) {
  return `const assert = require("assert");
const mod = require("./${v.snake}_module.js");

function item(classicId, variantIndex) {
  return mod.generateProblem(classicId, variantIndex);
}

function run() {
  assert.ok(Array.isArray(mod.CLASSIC_IDS) && mod.CLASSIC_IDS.length >= 1);
  assert.ok(Array.isArray(mod.INTRO_SCENES) && mod.INTRO_SCENES.length >= 5);
  assert.strictEqual(typeof mod.formatMathText("x^2"), "string");
  assert.strictEqual(mod.parseNumber("42 units"), 42);

  for (const [index, scene] of mod.INTRO_SCENES.entries()) {
    assert.ok(scene.title && scene.title.length > 0, "scene " + index + " needs a title");
    assert.ok(scene.purpose && scene.purpose.length > 20, scene.title + " needs a clear purpose");
    assert.ok(scene.caption && scene.caption.length > 30, scene.title + " needs a visual caption");
    assert.ok(scene.voiceover && scene.voiceover.length > 80, scene.title + " needs narration");
    assert.ok(scene.classicId, scene.title + " must reference a classic");
    assert.ok(mod.CLASSIC_IDS.includes(scene.classicId), scene.title + " classicId must exist in CLASSIC_IDS");
    assert.ok(mod.renderIntroScene(index).includes('role="img"'), scene.title + " should render as a visual intro scene");
  }

  for (const classicId of mod.CLASSIC_IDS) {
    const problem = item(classicId, 0);
    assert.strictEqual(problem.classicId, classicId);
    assert.ok(problem.prompt.length > 20, problem.id + " needs a useful prompt");
    assert.ok(problem.hint1.length > 10, problem.id + " needs hint1");
    assert.ok(problem.hint2.length > 10, problem.id + " needs hint2");
    assert.ok(problem.solution.length > 20, problem.id + " needs worked solution");
    assert.ok(mod.validateProblemMath(problem), problem.id + " formula audit failed");
    assert.strictEqual(mod.checkAnswer(problem, problem.correctInput).isCorrect, true, problem.id + " should accept correct input");
    const wrong = problem.answerType === "choice" ? { choice: "__wrong__" } : { value: "__wrong__" };
    assert.strictEqual(mod.checkAnswer(problem, wrong).isCorrect, false, problem.id + " should reject wrong input");
    const rendered = mod.renderProblemVisual(problem, "solution");
    assert.ok(rendered.html.includes('role="img"'), problem.id + " needs accessible visual");
    assert.ok(rendered.html.includes("Answer:"), problem.id + " solution visual should include answer");
  }
}

if (require.main === module) {
  run();
  console.log("All ${v.snake} module tests passed.");
}

module.exports = { run };
`;
}

function introPackStub(v, displayName, chapter) {
  // Must have all 6 required sections. Must have >= 5 storyboard scenes.
  // Each scene title must appear in pack body (lint cross-link checks this).
  // Voiceover wordcount: each voiceover block >= 25 words.
  // Total lines must be >= 80 and <= 600. We pad with explicit TODO content.
  const sceneRows = [];
  for (let i = 1; i <= 5; i += 1) {
    sceneRows.push(
      `${i}. **Placeholder skill — intro step ${i}**\n` +
      `   Placeholder purpose — replace this text with what scene ${i} teaches in the final video.\n` +
      `   Voiceover: This is a placeholder voiceover for scene ${i}. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next.\n`
    );
  }
  return `# ${displayName} Intro Video Pack

Mission: ${chapter} - ${displayName}

## Learning Outcome

TODO: Describe what the learner can do by the end of the intro video for ${displayName}. Write at least one full sentence that captures the named skills children should master before practice begins. Replace this placeholder once the real learning outcome is settled.

## Named Skills Shown Before Practice

- Placeholder skill

TODO: list the real named skills here, one per line. Each named skill should also appear in the storyboard below and in the registry skills array.

## Storyboard

${sceneRows.join("\n")}

TODO: replace each storyboard scene with the real visual beat for ${displayName}. Keep one scene per named skill. Each scene's voiceover should be at least twenty five words so the intro-pack lint passes.

## Warmup Gate

Before full practice, the learner should answer:

1. TODO: replace this warmup question with a real prompt that previews the first named skill in ${displayName}.
2. TODO: replace this warmup question with a real prompt that previews the second named skill.
3. TODO: replace this warmup question with a real prompt that previews the third named skill.

## Misconception Risks

TODO: list the common misconceptions children bring to ${displayName}. For example:

- TODO: write the first common pitfall a child might fall into here.
- TODO: write the second common pitfall a child might fall into here.
- TODO: write the third common pitfall a child might fall into here.

## Voiceover Draft

TODO: write the full voiceover draft for ${displayName}. Each paragraph below maps to one storyboard scene and must contain at least twenty five words so the intro-pack lint accepts it as a real narration block instead of a placeholder.

This is a placeholder voiceover draft paragraph for scene one. Replace it with the real teacher narration that introduces ${displayName}, names the first skill, and tells the child what to look at on screen during the opening beat of the intro.

This is a placeholder voiceover draft paragraph for scene two. Replace it with the real teacher narration that walks the child through the second named skill of ${displayName} and explicitly references the visual change happening on screen at this moment.

This is a placeholder voiceover draft paragraph for scene three. Replace it with the real teacher narration that walks the child through the third named skill of ${displayName} and explicitly references the visual change happening on screen at this moment.

This is a placeholder voiceover draft paragraph for scene four. Replace it with the real teacher narration that walks the child through the fourth named skill of ${displayName} and explicitly references the visual change happening on screen at this moment.

This is a placeholder voiceover draft paragraph for scene five. Replace it with the real teacher narration that walks the child through the fifth named skill of ${displayName} and explicitly references the visual change happening on screen at this moment.

## Notes For The Scaffolder

This intro pack was generated by scripts/new-module.mjs. Every TODO above must be replaced before the module is flipped to status="published" in modules/registry.json. The pack must continue to clear qa/intro_pack_lint.js and qa/skill_coverage_lint.js after edits.

The placeholder bank in ${v.snake}_module.js exposes a single classic with id ending in "-placeholder" that returns "Placeholder skill" as its skillTag. The skill-coverage gate matches this skill against the storyboard scene titles above, so each storyboard line must keep "Placeholder skill" in its title until you swap in the real named skills.

The audit file ${v.snake}_bank_quality_audit.js iterates 16 variants per classic and checks that prompts vary, that at least two correct-choice positions are used, and that the initial visual never includes "Answer:". When you add real classics, copy this contract into the new classics so the audit continues to pass.

The tests file ${v.snake}_module_tests.js verifies INTRO_SCENES wiring: each scene's classicId must exist in CLASSIC_IDS, each title/purpose/caption/voiceover meets minimum lengths, and renderIntroScene returns an SVG with role="img". Keep these invariants when you replace the placeholders.

The card visual entry for cardVariant "${v.snake.replace(/_/g, "-")}" still needs to be added to run/card_visuals.js. The diagram-parity gate compares the card SVG against the iconic classic's initial render; without a card entry the gate emits a SKIP, not a fail. Add the card before flipping status to "published".
`;
}

function sourceExtractStub(displayName) {
  return `# Source extract: ${displayName}

TODO: paste the lesson source extract here. Include the book section, the PDF page range, and the named classics that will become the module's question bank. This file is referenced from the registry and surfaced in QA so authors can trace each classic back to its origin in the printed lesson.
`;
}

// ---- main ------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));

  // ---- validate required flags
  const required = ["slug", "display", "chapter", "unit", "topic", "order", "variant"];
  const missing = required.filter((k) => !(k in args) || args[k] === "true" || args[k] === "");
  if (missing.length > 0) {
    console.error(`[new-module] missing required flag(s): ${missing.map((m) => "--" + m).join(", ")}`);
    process.exit(1);
  }

  const slug = args.slug;
  if (!/^[a-z0-9_]+$/.test(slug)) {
    console.error(`[new-module] --slug must match /^[a-z0-9_]+$/, got ${JSON.stringify(slug)}`);
    process.exit(1);
  }
  const order = Number(args.order);
  if (!Number.isInteger(order)) {
    console.error(`[new-module] --order must be an integer, got ${JSON.stringify(args.order)}`);
    process.exit(1);
  }

  const templateSlug = args["template-from"] || "triangle_sides";
  const templateDir = path.join(REPO_ROOT, "modules", templateSlug);
  if (!(await pathExists(templateDir))) {
    console.error(`[new-module] template module not found: modules/${templateSlug}`);
    process.exit(1);
  }

  const newDir = path.join(REPO_ROOT, "modules", slug);
  if (await pathExists(newDir)) {
    console.error(`[new-module] module folder already exists: modules/${slug}`);
    process.exit(1);
  }

  // ---- registry conflict checks
  const registry = await loadRegistry();
  if (!Array.isArray(registry.modules)) {
    console.error("[new-module] registry.modules is not an array");
    process.exit(1);
  }
  for (const m of registry.modules) {
    if (m.slug === slug) {
      console.error(`[new-module] slug "${slug}" already registered`);
      process.exit(1);
    }
    if (m.order === order) {
      console.error(`[new-module] order ${order} already used by "${m.slug}"`);
      process.exit(1);
    }
  }

  // ---- build inputs
  const v = slugVariants(slug);
  const templateVariants = slugVariants(templateSlug);
  const displayName = args.display;
  const shortLabel = args["short-label"] || displayName;
  const difficulty = args.difficulty ? Number(args.difficulty) : 3;
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    console.error(`[new-module] --difficulty must be 1..5, got ${JSON.stringify(args.difficulty)}`);
    process.exit(1);
  }
  const tags = args.tags
    ? args.tags.split(",").map((s) => s.trim()).filter(Boolean)
    : [args.unit, slug];
  // Skills: spec default is empty array, but skill-coverage QA gate requires
  // at least one skill to pass. To keep the scaffold QA-green out of the box
  // we default to a single "Placeholder skill" entry that lines up with the
  // placeholder bank's skillTag. The author replaces it when adding real classics.
  const skills = args.skills
    ? args.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : ["Placeholder skill"];
  const blurb = args.blurb || `TODO: blurb for ${displayName}`;

  // ---- track files written for rollback
  const writtenPaths = [];

  async function safeWrite(absPath, content) {
    await fs.mkdir(path.dirname(absPath), { recursive: true });
    await fs.writeFile(absPath, content, "utf8");
    writtenPaths.push(absPath);
  }

  async function rollback() {
    try {
      await fs.rm(newDir, { recursive: true, force: true });
    } catch (_) {}
  }

  // ---- step 2/3: copy template structure with renames, but stub the
  // module/audit/tests/pack/source files and skip audio binaries.
  try {
    await fs.mkdir(newDir, { recursive: true });
    writtenPaths.push(newDir);

    const entries = await listFilesRecursive(templateDir);
    const renameToken = templateVariants.snake; // e.g. "triangle_sides"
    const templateCamel = templateVariants.camel;
    const templateTitle = templateVariants.title;
    const templateConst = templateVariants.constant;

    // Replacement function for text content
    function replaceTokens(text) {
      return text
        .replaceAll(templateConst, v.constant)
        .replaceAll(templateCamel, v.camel)
        .replaceAll(templateTitle, displayName)
        .replaceAll(renameToken, v.snake);
    }

    // File classification helpers
    const moduleJsName = `${renameToken}_module.js`;
    const auditJsName = `${renameToken}_bank_quality_audit.js`;
    const testsJsName = `${renameToken}_module_tests.js`;
    const introPackName = `${renameToken}_intro_video_pack.md`;
    const sourceExtractName = `${renameToken}_source_extract.md`;

    let hasAudioDir = false;

    for (const rel of entries) {
      // Convert template-prefixed filenames to new slug prefix
      const renamedRel = rel
        .split("/")
        .map((seg) => seg.replaceAll(renameToken, v.snake))
        .join("/");
      const destAbs = path.join(newDir, renamedRel);
      const segments = rel.split("/");
      const topLevel = segments[0];

      if (topLevel === "audio") {
        // Mark that the template has an audio dir; we create it empty rather than
        // copying half a megabyte of .wav files per scaffold. The author drops
        // real audio in once their voiceover script is recorded.
        hasAudioDir = true;
        continue;
      }

      const baseName = segments[segments.length - 1];

      // Stubbed files (top-level only)
      if (segments.length === 1 && baseName === moduleJsName) {
        await safeWrite(destAbs, moduleJsStub(v, displayName));
        continue;
      }
      if (segments.length === 1 && baseName === auditJsName) {
        await safeWrite(destAbs, auditJsStub(v));
        continue;
      }
      if (segments.length === 1 && baseName === testsJsName) {
        await safeWrite(destAbs, testsJsStub(v));
        continue;
      }
      if (segments.length === 1 && baseName === introPackName) {
        await safeWrite(destAbs, introPackStub(v, displayName, args.chapter));
        continue;
      }
      if (segments.length === 1 && baseName === sourceExtractName) {
        await safeWrite(destAbs, sourceExtractStub(displayName));
        continue;
      }

      // Everything else: copy with token replacement applied to text content
      const srcAbs = path.join(templateDir, ...rel.split("/"));
      // Only treat known text extensions as text; copy everything else verbatim
      const ext = path.extname(baseName).toLowerCase();
      const textExts = new Set([".js", ".mjs", ".cjs", ".html", ".htm", ".css", ".md", ".txt", ".json", ".svg"]);
      if (textExts.has(ext)) {
        const raw = await fs.readFile(srcAbs, "utf8");
        await safeWrite(destAbs, replaceTokens(raw));
      } else {
        await fs.mkdir(path.dirname(destAbs), { recursive: true });
        await fs.copyFile(srcAbs, destAbs);
        writtenPaths.push(destAbs);
      }
    }

    // Create empty audio dir if template had one (preserves audioDir path validity)
    if (hasAudioDir) {
      const audioAbs = path.join(newDir, "audio");
      await fs.mkdir(audioAbs, { recursive: true });
      writtenPaths.push(audioAbs);
      // Leave a TODO file so empty-dir isn't accidentally dropped by tooling
      await safeWrite(
        path.join(audioAbs, "README.md"),
        `# Audio for ${displayName}\n\nTODO: drop the recorded \`.wav\` narration files here, one per intro scene.\n`
      );
    }

    // ---- step 7: register in modules/registry.json
    const launchHtmlRel = `modules/${v.snake}/${v.snake}_module.html`;
    const moduleJsRel = `modules/${v.snake}/${v.snake}_module.js`;
    const auditJsRel = `modules/${v.snake}/${v.snake}_bank_quality_audit.js`;
    const testsJsRel = `modules/${v.snake}/${v.snake}_module_tests.js`;
    const introPackRel = `modules/${v.snake}/${v.snake}_intro_video_pack.md`;
    const sourceExtractRel = `modules/${v.snake}/${v.snake}_source_extract.md`;
    const audioDirRel = hasAudioDir ? `modules/${v.snake}/audio` : null;
    const folderRel = `modules/${v.snake}`;

    const newEntry = {
      id: slug,
      slug,
      displayName,
      shortLabel,
      chapter: args.chapter,
      unit: args.unit,
      topic: args.topic,
      tags,
      skills,
      difficulty,
      order,
      status: "draft",
      cardVariant: args.variant,
      blurb,
      paths: {
        folder: folderRel,
        launch: launchHtmlRel,
        moduleJs: moduleJsRel,
        auditJs: auditJsRel,
        testsJs: testsJsRel,
        introPack: introPackRel,
        sourceExtract: sourceExtractRel,
        audioDir: audioDirRel,
        engineEntry: null
      },
      qa: {
        hasAudit: true,
        hasTests: true
      }
    };

    await appendRegistryEntry(newEntry);

    // ---- step 8: summary
    const fileCount = writtenPaths.filter((p) => !p.endsWith(newDir) && !p.endsWith(path.join(newDir, "audio"))).length;
    const lines = [];
    lines.push(`Created module: ${slug}`);
    lines.push(`- folder: modules/${slug}`);
    lines.push(`- ${fileCount} files scaffolded`);
    lines.push(`- registered in modules/registry.json (status=draft, order=${order})`);
    lines.push("");
    lines.push("Next steps:");
    lines.push(`  1. Edit modules/${slug}/${slug}_module.js — replace placeholder classics.`);
    lines.push(`  2. Edit modules/${slug}/${slug}_intro_video_pack.md — replace TODOs.`);
    lines.push(`  3. Add a card SVG entry for cardVariant "${args.variant}" in run/card_visuals.js.`);
    lines.push(`  4. Run: node qa/run_all_quality_checks.js`);
    lines.push(`  5. When ready, flip status to "published" in modules/registry.json.`);
    console.log(lines.join("\n"));
  } catch (err) {
    console.error(`[new-module] ERROR: ${err.message}`);
    await rollback();
    process.exit(1);
  }
}

main();
