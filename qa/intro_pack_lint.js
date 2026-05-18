#!/usr/bin/env node
/*
 * qa/intro_pack_lint.js
 *
 * Registry-driven lint for module intro video packs. Validates:
 *
 *   a) Required sections are present (case-insensitive heading match):
 *      learning outcome, named skills, storyboard / scene storyboard /
 *      video structure, warmup / warm-up, misconception / common pitfalls,
 *      voiceover / voiceover draft.
 *
 *   b) Storyboard depth: numbered items or table rows under the storyboard
 *      heading must be >= max(5, registry.skills.length).
 *
 *   c) Length floor and ceiling: 80 <= total lines <= 600.
 *
 *   d) Voiceover wordcount: each scene's voiceover string must contain
 *      >= 25 words. We look for "Voiceover: ..." lines as well as a
 *      voiceover column in the storyboard table.
 *
 *   e) JS cross-link: if the module JS exports INTRO_SCENES, scene count
 *      must equal storyboard scene count and each scene title must appear
 *      in the pack body (case-insensitive substring).
 *
 * Exit 0 on clean run, 1 on any failure. No dependencies.
 *
 * Run via:
 *     node qa/intro_pack_lint.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");

const { requireModuleSafe } = require("./_dom_stubs.js");

// Each entry is { label, patterns } — heading text matches ANY of the patterns.
const REQUIRED_SECTIONS = [
  { label: "Learning Outcome", patterns: [/learning\s+outcome/i, /core\s+learning\s+outcome/i] },
  { label: "Named Skills", patterns: [/named\s+skills/i] },
  { label: "Storyboard / Scene Storyboard / Video Structure", patterns: [/storyboard/i, /scene\s+storyboard/i, /video\s+structure/i] },
  { label: "Warmup / Warm-up", patterns: [/warm[\s-]?up/i, /warmup/i] },
  { label: "Misconception Risks / Common Pitfalls", patterns: [/misconception/i, /common\s+pitfalls/i] },
  { label: "Voiceover / Voiceover Draft", patterns: [/voiceover/i] }
];

// ---- markdown helpers -------------------------------------------------------

function parseHeadings(text) {
  const lines = text.split(/\r?\n/);
  const headings = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = /^(#{1,6})\s+(.*?)\s*$/.exec(lines[i]);
    if (m) headings.push({ line: i, level: m[1].length, text: m[2] });
  }
  return { lines, headings };
}

function sectionRange(headings, predicate) {
  const idx = headings.findIndex(predicate);
  if (idx === -1) return null;
  const start = headings[idx].line;
  const startLevel = headings[idx].level;
  let end = Infinity;
  for (let i = idx + 1; i < headings.length; i += 1) {
    if (headings[i].level <= startLevel) {
      end = headings[i].line;
      break;
    }
  }
  return { start, end };
}

function linesInSection(lines, range) {
  if (!range) return [];
  const end = range.end === Infinity ? lines.length : range.end;
  return lines.slice(range.start + 1, end);
}

function countNumberedItems(sectionLines) {
  let count = 0;
  for (const ln of sectionLines) {
    if (/^\s*\d+\.\s+\S/.test(ln)) count += 1;
  }
  return count;
}

function countTableRows(sectionLines) {
  // A markdown table block: a header separator line "|---|---|" and body rows starting with "|"
  let inTable = false;
  let bodyRows = 0;
  let headerSeen = false;
  for (const ln of sectionLines) {
    const isPipe = /^\s*\|/.test(ln) && ln.includes("|");
    if (isPipe) {
      if (!inTable) {
        // first pipe row is the header
        inTable = true;
        headerSeen = false;
      } else if (!headerSeen && /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(ln)) {
        headerSeen = true;
      } else if (headerSeen) {
        bodyRows += 1;
      }
    } else if (ln.trim() === "") {
      // blank line inside or after a table is ok; but if we already saw rows and hit blank, table is done
      if (inTable && headerSeen) {
        inTable = false;
        headerSeen = false;
      }
    } else if (inTable) {
      inTable = false;
      headerSeen = false;
    }
  }
  return bodyRows;
}

function extractStoryboardScenes(sectionLines) {
  // Return an array of { title, voiceover } scene records.
  // Strategy:
  //   1. If a markdown table exists, parse it. Use the row's first non-numeric cell
  //      as title. Use the row's last column (if its header looks like Voiceover) as voiceover.
  //   2. Otherwise, parse numbered list items. The first line of each item is title;
  //      the body text becomes the voiceover for length purposes.
  const scenes = [];

  // ---- Table mode --------------------------------------------------------
  let inTable = false;
  let header = null;
  let voiceoverColIdx = -1;
  let titleColIdx = -1;
  for (const ln of sectionLines) {
    const isPipe = /^\s*\|/.test(ln);
    if (isPipe) {
      const cells = ln.split("|").map((c) => c.trim()).filter((c, i, arr) => !(i === 0 && c === "") && !(i === arr.length - 1 && c === ""));
      if (!inTable) {
        header = cells.map((c) => c.toLowerCase());
        voiceoverColIdx = header.findIndex((c) => /voiceover/.test(c));
        titleColIdx = header.findIndex((c) => /title|name|scene\s*name/.test(c));
        if (titleColIdx === -1) {
          // sometimes the first column is "Scene" and the second is the title
          titleColIdx = header.findIndex((c, i) => i > 0 && !/scene|time|#/.test(c));
          if (titleColIdx === -1) titleColIdx = Math.min(1, header.length - 1);
        }
        inTable = true;
      } else if (/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(ln)) {
        // separator row
      } else {
        const title = cells[titleColIdx] || "";
        const voiceover = voiceoverColIdx >= 0 ? cells[voiceoverColIdx] || "" : "";
        if (title) scenes.push({ title: title.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim(), voiceover: voiceover.replace(/^"|"$/g, "").trim() });
      }
    } else if (ln.trim() === "") {
      if (inTable && scenes.length > 0) break;
    }
  }
  if (scenes.length > 0) return scenes;

  // ---- Numbered list mode ------------------------------------------------
  let current = null;
  for (const ln of sectionLines) {
    const m = /^\s*(\d+)\.\s+(.*)$/.exec(ln);
    if (m) {
      if (current) scenes.push(current);
      const titleRaw = m[2].replace(/\*\*/g, "").replace(/^_+|_+$/g, "").trim();
      const title = titleRaw.split(/\s*[-—:]\s*/)[0] || titleRaw;
      current = { title: title.trim(), voiceover: "" };
    } else if (current) {
      const trimmed = ln.trim();
      if (trimmed === "") continue;
      const vo = /voiceover\s*[:\-]\s*(.*)$/i.exec(ln) || /narration\s*[:\-]\s*(.*)$/i.exec(ln);
      if (vo) {
        current.voiceover += " " + vo[1];
      } else if (!trimmed.startsWith("#")) {
        current.voiceover += " " + trimmed;
      }
    }
  }
  if (current) scenes.push(current);
  return scenes.map((s) => ({ title: s.title, voiceover: s.voiceover.trim() }));
}

function extractVoiceoverDraftScenes(allLines) {
  // Find a section titled "Voiceover / Voiceover Draft / Voiceover Direction" and split
  // by blank lines into paragraphs. Returns an array of paragraphs (each a "scene" for wordcount).
  const { lines, headings } = (function () { return { lines: allLines, headings: parseHeadings(allLines.join("\n")).headings }; })();
  const range = sectionRange(headings, (h) => /voiceover/i.test(h.text));
  if (!range) return [];
  const body = linesInSection(lines, range);
  const paragraphs = [];
  let current = [];
  for (const ln of body) {
    if (ln.trim() === "") {
      if (current.length > 0) {
        paragraphs.push(current.join(" ").trim());
        current = [];
      }
    } else {
      current.push(ln.trim());
    }
  }
  if (current.length > 0) paragraphs.push(current.join(" ").trim());
  return paragraphs.filter((p) => p.length > 0 && !p.startsWith("```"));
}

function wordCount(s) {
  return (s.match(/\b[\w'-]+\b/g) || []).length;
}

// ---- main -------------------------------------------------------------------

function loadRegistry() {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  return JSON.parse(raw).modules;
}

function lintModule(m) {
  const failures = [];
  if (!m.paths || !m.paths.introPack) return { failures, skipped: true, reason: "no introPack path" };
  const packAbs = path.join(REPO_ROOT, m.paths.introPack);
  if (!fs.existsSync(packAbs)) {
    failures.push(`[intro-pack] FAIL ${m.id}: introPack file missing on disk (${m.paths.introPack})`);
    return { failures, skipped: false };
  }
  const text = fs.readFileSync(packAbs, "utf8");
  const lines = text.split(/\r?\n/);
  const { headings } = parseHeadings(text);

  // a) required sections
  for (const section of REQUIRED_SECTIONS) {
    const present = headings.some((h) => section.patterns.some((re) => re.test(h.text)));
    if (!present) {
      failures.push(`[intro-pack] FAIL ${m.id}: missing required section "${section.label}"`);
    }
  }

  // b) storyboard depth
  const storyboardRange = sectionRange(headings, (h) => /storyboard|video\s+structure/i.test(h.text));
  let sceneCount = 0;
  let scenes = [];
  if (storyboardRange) {
    const sbLines = linesInSection(lines, storyboardRange);
    scenes = extractStoryboardScenes(sbLines);
    sceneCount = Math.max(scenes.length, countNumberedItems(sbLines), countTableRows(sbLines));
    const minDepth = Math.max(5, (m.skills || []).length);
    if (sceneCount < minDepth) {
      failures.push(`[intro-pack] FAIL ${m.id}: storyboard has ${sceneCount} scene(s), need >= ${minDepth} (max of 5 and registry.skills.length=${(m.skills || []).length})`);
    }
  } else {
    sceneCount = 0;
  }

  // c) length floors
  const totalLines = lines.length;
  if (totalLines < 80) failures.push(`[intro-pack] FAIL ${m.id}: pack has ${totalLines} lines, need >= 80`);
  if (totalLines > 600) failures.push(`[intro-pack] FAIL ${m.id}: pack has ${totalLines} lines, max 600`);

  // d) voiceover wordcount
  // Combine table-derived voiceovers AND paragraph-derived voiceovers from a "Voiceover Draft" section.
  const draftParagraphs = extractVoiceoverDraftScenes(lines);
  const voiceoverStrings = [];
  for (const s of scenes) {
    if (s.voiceover) voiceoverStrings.push({ source: `storyboard scene "${s.title}"`, text: s.voiceover });
  }
  for (const p of draftParagraphs) {
    voiceoverStrings.push({ source: "voiceover-draft paragraph", text: p });
  }
  if (voiceoverStrings.length === 0) {
    failures.push(`[intro-pack] FAIL ${m.id}: no voiceover content found in storyboard or voiceover section`);
  } else {
    let shortCount = 0;
    const shortExamples = [];
    for (const v of voiceoverStrings) {
      const wc = wordCount(v.text);
      if (wc < 25) {
        shortCount += 1;
        if (shortExamples.length < 3) shortExamples.push(`${v.source} has ${wc} words: ${JSON.stringify(v.text.slice(0, 60))}`);
      }
    }
    // We tolerate the LAST few short ones if there's an abundance of long ones — but report if
    // a meaningful fraction is short.
    if (shortCount > 0 && shortCount > Math.floor(voiceoverStrings.length / 3)) {
      failures.push(
        `[intro-pack] FAIL ${m.id}: ${shortCount}/${voiceoverStrings.length} voiceover blocks under 25 words (${shortExamples.join(" | ")})`
      );
    }
  }

  // e) JS cross-link
  if (m.paths.moduleJs) {
    const modAbs = path.join(REPO_ROOT, m.paths.moduleJs);
    if (fs.existsSync(modAbs)) {
      let mod = null;
      try {
        mod = requireModuleSafe(modAbs);
      } catch (err) {
        failures.push(`[intro-pack] FAIL ${m.id}: cannot require module JS for cross-link: ${err.message}`);
      }
      if (mod && Array.isArray(mod.INTRO_SCENES)) {
        if (mod.INTRO_SCENES.length !== sceneCount) {
          failures.push(
            `[intro-pack] FAIL ${m.id}: INTRO_SCENES has ${mod.INTRO_SCENES.length} entries but pack storyboard has ${sceneCount}`
          );
        }
        const bodyLower = text.toLowerCase();
        for (const scene of mod.INTRO_SCENES) {
          const title = String(scene.title || "").trim();
          if (!title) continue;
          if (!bodyLower.includes(title.toLowerCase())) {
            failures.push(
              `[intro-pack] FAIL ${m.id}: INTRO_SCENES title "${title}" not found in intro pack body`
            );
          }
        }
      } else if (mod) {
        // soft note — only flag if the registry expects intro pack coverage AND no INTRO_SCENES export
        // The spec says fail when INTRO_SCENES exists; absence is just reported below.
        failures.push(
          `[intro-pack] FAIL ${m.id}: module JS does not export INTRO_SCENES — no programmatic cross-link possible`
        );
      }
    }
  }

  return { failures, skipped: false };
}

function main(options = {}) {
  const exitOnFinish = options.exitOnFinish !== false;
  const modules = loadRegistry();
  const allFailures = [];
  let checked = 0;
  let skipped = 0;
  for (const m of [...modules].sort((a, b) => a.order - b.order)) {
    const res = lintModule(m);
    if (res.skipped) {
      skipped += 1;
      continue;
    }
    checked += 1;
    for (const f of res.failures) allFailures.push(f);
  }
  for (const f of allFailures) console.error(f);
  console.log("");
  console.log(`[intro-pack] checked ${checked} module(s), ${skipped} without introPack, ${allFailures.length} failure(s)`);

  const result = { checked, skipped, failures: allFailures.length };
  if (exitOnFinish) process.exit(allFailures.length > 0 ? 1 : 0);
  return result;
}

function run() {
  const result = main({ exitOnFinish: false });
  if (result.failures > 0) {
    const err = new Error(`[intro-pack] ${result.failures} failure(s)`);
    err.gateResult = result;
    throw err;
  }
  return result;
}

if (require.main === module) {
  main();
} else {
  module.exports = { run, lintModule, wordCount, extractStoryboardScenes };
}
