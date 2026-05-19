#!/usr/bin/env node
/*
 * qa/skill_coverage_lint.js
 *
 * Registry-driven gate that catches vocabulary drift between three places
 * the user encounters a skill: the registry, the intro pack, and the
 * problem bank.
 *
 * For each module we report a per-skill row:
 *   skill                | in_intro_pack | in_intro_scenes | tagged_problems
 *
 * Rules:
 *   a) Each registry.skills[i] must appear in the intro pack body. Match is
 *      either case-insensitive punctuation-stripped exact match OR token
 *      Jaccard overlap >= 0.7 against some non-empty line of the pack.
 *
 *   b) If the module JS exports INTRO_SCENES, each registry skill must
 *      token-match (Jaccard >= 0.7 or exact) some scene.title or scene.purpose.
 *
 *   c) Each generated problem should expose `skillTag`. If no problem yet
 *      exposes skillTag we record this as a soft fail telling the user to
 *      add a classic->skill map. Once skillTag is present:
 *        - every skillTag value must be in registry.skills (token-match)
 *        - every registry.skill must appear on >= 4 problems
 *
 * Exit 0 only if every "no" / "0" cell is acceptable for an unmapped module
 * (which we explicitly mark as failures with `[skill-coverage] FAIL ...`).
 *
 * No dependencies.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");
const MAX_VARIANTS_PER_CLASSIC = 20;
const TAG_COVERAGE_MIN = 4;
const JACCARD_THRESHOLD = 0.7;

const { requireModuleSafe } = require("./_dom_stubs.js");

// ---- token / matching utilities --------------------------------------------

function stripPunct(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s+/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_TOKENS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "by", "is", "are", "be",
  "with", "into", "from", "at", "as"
]);

function tokenize(s) {
  return stripPunct(s)
    .split(/\s+/)
    .filter((t) => t && !STOP_TOKENS.has(t));
}

function jaccard(aTokens, bTokens) {
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  let inter = 0;
  for (const t of aSet) if (bSet.has(t)) inter += 1;
  const union = aSet.size + bSet.size - inter;
  return union === 0 ? 0 : inter / union;
}

function tokenMatchAnyLine(needle, haystackLines) {
  const needleStripped = stripPunct(needle);
  const needleTokens = tokenize(needle);
  if (!needleStripped) return { hit: false };
  for (const ln of haystackLines) {
    if (!ln) continue;
    const lnStripped = stripPunct(ln);
    if (lnStripped === needleStripped) return { hit: true, kind: "exact", line: ln };
    if (lnStripped.includes(needleStripped)) return { hit: true, kind: "substring", line: ln };
    const lnTokens = tokenize(ln);
    const j = jaccard(needleTokens, lnTokens);
    if (j >= JACCARD_THRESHOLD) return { hit: true, kind: `jaccard=${j.toFixed(2)}`, line: ln };
  }
  return { hit: false };
}

function tokenMatchAnyString(needle, candidates) {
  const lines = candidates.filter((c) => typeof c === "string");
  return tokenMatchAnyLine(needle, lines);
}

// ---- module helpers --------------------------------------------------------

function classicsFromModule(mod) {
  if (Array.isArray(mod.CLASSICS)) return mod.CLASSICS;
  if (Array.isArray(mod.classics)) return mod.classics;
  if (Array.isArray(mod.problemBase)) return mod.problemBase;
  if (Array.isArray(mod.MODULES)) return mod.MODULES;
  return null;
}

// ---- main -------------------------------------------------------------------

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8")).modules;
}

function padRight(s, n) {
  s = String(s);
  if (s.length >= n) return s;
  return s + " ".repeat(n - s.length);
}

function lintModule(m) {
  const failures = [];
  const skills = Array.isArray(m.skills) ? m.skills : [];
  if (skills.length === 0) {
    return { failures: [`[skill-coverage] FAIL ${m.id}: registry.skills is empty`], rows: [] };
  }

  // load pack
  let packLines = [];
  if (m.paths && m.paths.introPack) {
    const packAbs = path.join(REPO_ROOT, m.paths.introPack);
    if (fs.existsSync(packAbs)) {
      packLines = fs.readFileSync(packAbs, "utf8").split(/\r?\n/);
    } else {
      failures.push(`[skill-coverage] FAIL ${m.id}: introPack file missing on disk (${m.paths.introPack})`);
    }
  } else {
    failures.push(`[skill-coverage] FAIL ${m.id}: no introPack registered — cannot cross-check skills`);
  }

  // load module JS surface
  let mod = null;
  if (m.paths && m.paths.moduleJs) {
    const modAbs = path.join(REPO_ROOT, m.paths.moduleJs);
    if (fs.existsSync(modAbs)) {
      try {
        mod = requireModuleSafe(modAbs);
      } catch (err) {
        failures.push(`[skill-coverage] FAIL ${m.id}: cannot require module JS: ${err.message}`);
      }
    }
  }

  const introScenes = mod && Array.isArray(mod.INTRO_SCENES) ? mod.INTRO_SCENES : null;
  const sceneStrings = introScenes
    ? introScenes.flatMap((s) => [s.title, s.purpose, s.caption, s.voiceover].filter(Boolean))
    : null;

  // build classic -> bank
  let tagCountBySkill = new Map();
  let bankExposesSkillTag = false;
  let bankProblemCount = 0;
  let unknownTags = [];
  if (mod && typeof mod.generateProblem === "function") {
    const classics = classicsFromModule(mod);
    if (classics) {
      for (const classic of classics) {
        const classicId = classic.id;
        if (!classicId) continue;
        for (let v = 0; v < MAX_VARIANTS_PER_CLASSIC; v += 1) {
          let problem;
          try {
            problem = mod.generateProblem(classicId, v);
          } catch (_err) {
            break;
          }
          if (!problem) break;
          bankProblemCount += 1;
          if (problem.skillTag) {
            bankExposesSkillTag = true;
            const tag = String(problem.skillTag);
            const matchedSkill = skills.find((sk) => {
              const j = jaccard(tokenize(sk), tokenize(tag));
              return j >= JACCARD_THRESHOLD || stripPunct(sk) === stripPunct(tag);
            });
            if (matchedSkill) {
              tagCountBySkill.set(matchedSkill, (tagCountBySkill.get(matchedSkill) || 0) + 1);
            } else {
              unknownTags.push(tag);
            }
          }
        }
      }
    }
  }

  if (!bankExposesSkillTag) {
    failures.push(
      `[skill-coverage] FAIL ${m.id}: problems missing skillTag — add classic->skill map ` +
        `(scanned ${bankProblemCount} problems across ${(classicsFromModule(mod || {}) || []).length || 0} classic(s))`
    );
  }

  // ---- per-skill rows
  const rows = [];
  for (const sk of skills) {
    const inPack = packLines.length > 0 ? tokenMatchAnyLine(sk, packLines) : { hit: false };
    const inScenes = sceneStrings ? tokenMatchAnyString(sk, sceneStrings) : null;
    const tagged = bankExposesSkillTag ? (tagCountBySkill.get(sk) || 0) : 0;
    rows.push({
      skill: sk,
      inPack: inPack.hit ? "yes" : "no",
      inScenes: inScenes == null ? "n/a" : (inScenes.hit ? "yes" : "no"),
      tagged
    });

    if (!inPack.hit && packLines.length > 0) {
      failures.push(
        `[skill-coverage] FAIL ${m.id}: registry skill "${sk}" not found in intro pack ` +
          `(pack: ${m.paths.introPack}; registry skills: ${JSON.stringify(skills)})`
      );
    }
    if (inScenes && !inScenes.hit) {
      failures.push(
        `[skill-coverage] FAIL ${m.id}: registry skill "${sk}" not found in INTRO_SCENES titles/purposes ` +
          `(scenes: ${JSON.stringify(introScenes.map((s) => s.title))})`
      );
    }
    if (bankExposesSkillTag && tagged < TAG_COVERAGE_MIN) {
      failures.push(
        `[skill-coverage] FAIL ${m.id}: registry skill "${sk}" tagged on only ${tagged} problem(s), need >= ${TAG_COVERAGE_MIN}`
      );
    }
  }

  if (bankExposesSkillTag && unknownTags.length > 0) {
    const uniq = Array.from(new Set(unknownTags));
    failures.push(
      `[skill-coverage] FAIL ${m.id}: ${uniq.length} skillTag value(s) not in registry.skills: ${JSON.stringify(uniq.slice(0, 6))}`
    );
  }

  return { failures, rows, bankExposesSkillTag, bankProblemCount };
}

function renderTable(modId, rows) {
  const colSkill = Math.max(20, ...rows.map((r) => r.skill.length));
  const colPack = "in_intro_pack".length;
  const colScenes = "in_intro_scenes".length;
  const colTag = "tagged_problems".length;
  const lines = [];
  lines.push(`=== ${modId} ===`);
  lines.push(
    [
      padRight("skill", colSkill),
      padRight("in_intro_pack", colPack),
      padRight("in_intro_scenes", colScenes),
      "tagged_problems"
    ].join(" | ")
  );
  for (const r of rows) {
    lines.push(
      [
        padRight(r.skill, colSkill),
        padRight(r.inPack, colPack),
        padRight(r.inScenes, colScenes),
        String(r.tagged)
      ].join(" | ")
    );
  }
  return lines.join("\n");
}

function main(options = {}) {
  const exitOnFinish = options.exitOnFinish !== false;
  const modules = loadRegistry();
  const allFailures = [];
  let modCount = 0;
  const output = [];
  for (const m of [...modules].sort((a, b) => a.order - b.order)) {
    const { failures, rows } = lintModule(m);
    modCount += 1;
    if (rows.length > 0) output.push(renderTable(m.id, rows));
    for (const f of failures) allFailures.push(f);
  }
  for (const block of output) console.log(block + "\n");
  for (const f of allFailures) console.error(f);
  console.log("");
  console.log(`[skill-coverage] checked ${modCount} module(s), ${allFailures.length} failure(s)`);

  const result = { modules: modCount, failures: allFailures.length };
  if (exitOnFinish) process.exit(allFailures.length > 0 ? 1 : 0);
  return result;
}

function run() {
  const result = main({ exitOnFinish: false });
  if (result.failures > 0) {
    const err = new Error(`[skill-coverage] ${result.failures} failure(s)`);
    err.gateResult = result;
    throw err;
  }
  return result;
}

if (require.main === module) {
  main();
} else {
  module.exports = { run, lintModule, tokenize, jaccard };
}
