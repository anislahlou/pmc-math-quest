#!/usr/bin/env node
/*
 * qa/intro_pack_pedagogy_review.js
 *
 * Optional LLM-judged supplement to the mechanical intro pack lint.
 *
 * If ANTHROPIC_API_KEY is not set, prints a SKIP line and exits 0.
 * Otherwise, for each module that has an introPack, sends the pack body
 * plus the two pedagogy agent prompts (intro_pedagogy_agent.md and
 * learning_experience_quality_gate.md) to Claude via the messages API
 * and asks for a structured JSON verdict.
 *
 * Responses are cached on disk by SHA-1 of pack contents in
 * qa/.cache/intro_review_<hash>.json so repeated runs are cheap.
 *
 * Wiring: this gate IS opt-in but is now part of qa/run_all_quality_checks.js.
 * When ANTHROPIC_API_KEY is unset, the runner sees a clean SKIP and the
 * overall QA pass/fail is unaffected. When the key IS set, each pack is
 * reviewed and per-module verdicts are printed. Per-pack "fail" verdicts
 * are advisory — they are NOT translated into a thrown error here, so the
 * orchestrator continues to its next gate regardless. To run only this
 * gate standalone:
 *
 *     ANTHROPIC_API_KEY=sk-ant-... node qa/intro_pack_pedagogy_review.js
 *
 * Uses raw https — no SDK, no dependencies.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");
const CACHE_DIR = path.join(__dirname, ".cache");
const MODEL = "claude-sonnet-4-6";

const AGENT_FILES = [
  path.join(REPO_ROOT, "agents", "intro_pedagogy_agent.md"),
  path.join(REPO_ROOT, "agents", "learning_experience_quality_gate.md")
];

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function sha1(s) {
  return crypto.createHash("sha1").update(s).digest("hex");
}

function readIfExists(absPath) {
  try {
    return fs.readFileSync(absPath, "utf8");
  } catch (_) {
    return "";
  }
}

function postMessages(apiKey, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
          "content-length": Buffer.byteLength(data)
        }
      },
      (res) => {
        let buf = "";
        res.on("data", (chunk) => (buf += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(buf));
            } catch (err) {
              reject(new Error(`could not parse Anthropic response: ${err.message}`));
            }
          } else {
            reject(new Error(`Anthropic API ${res.statusCode}: ${buf.slice(0, 400)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function extractJson(s) {
  // pull the first {...} JSON block from the response text
  const m = s.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch (_) {
    return null;
  }
}

async function reviewPack(apiKey, moduleId, packPath, packBody, agentBlobs) {
  const hash = sha1(packBody + "|" + AGENT_FILES.join(","));
  const cachePath = path.join(CACHE_DIR, `intro_review_${hash}.json`);
  if (fs.existsSync(cachePath)) {
    const cached = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    cached.cached = true;
    return cached;
  }

  const system =
    "You are a pedagogy reviewer for an 11-12-year-old maths edtech tool. " +
    "Two agent specs follow. Use them to judge a single intro video pack. " +
    "Be honest, terse, and structured.\n\n" +
    "=== AGENT: intro_pedagogy_agent.md ===\n" +
    agentBlobs[0] +
    "\n\n=== AGENT: learning_experience_quality_gate.md ===\n" +
    agentBlobs[1];

  const userPrompt =
    `Module id: ${moduleId}\nPack path: ${packPath}\n\n` +
    "Below is the intro video pack body. Return ONLY a JSON object with these keys:\n" +
    `  verdict: "pass" | "fail"\n` +
    `  hard_failures: string[]   // pedagogy rules clearly broken\n` +
    `  soft_warnings: string[]   // weaknesses worth fixing soon\n` +
    `  strengths: string[]       // what this pack already does well\n` +
    `  next_actions: string[]    // 3-5 concrete edits ranked by impact\n\n` +
    "=== PACK BODY ===\n" +
    packBody;

  const body = {
    model: MODEL,
    max_tokens: 2048,
    system,
    messages: [{ role: "user", content: userPrompt }]
  };

  const resp = await postMessages(apiKey, body);
  const textBlock = (resp.content || []).find((b) => b.type === "text");
  const rawText = textBlock ? textBlock.text : "";
  const parsed = extractJson(rawText) || { verdict: "fail", parse_error: true, raw: rawText.slice(0, 600) };
  const record = { moduleId, packPath, parsed, raw: rawText, hash, cached: false };
  ensureCacheDir();
  fs.writeFileSync(cachePath, JSON.stringify(record, null, 2));
  return record;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("[pedagogy-review] SKIP — set ANTHROPIC_API_KEY to enable LLM-judged intro review");
    return { skipped: true, verdicts: [] };
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const modules = [...registry.modules].sort((a, b) => a.order - b.order);
  const agentBlobs = AGENT_FILES.map(readIfExists);
  if (agentBlobs.some((b) => b.length === 0)) {
    console.warn("[pedagogy-review] WARN: one or more agent spec files missing — review will be less anchored");
  }

  const verdicts = [];
  for (const m of modules) {
    if (!m.paths || !m.paths.introPack) continue;
    const packAbs = path.join(REPO_ROOT, m.paths.introPack);
    if (!fs.existsSync(packAbs)) {
      console.warn(`[pedagogy-review] WARN ${m.id}: pack file missing on disk`);
      continue;
    }
    const packBody = fs.readFileSync(packAbs, "utf8");
    console.log(`[pedagogy-review] reviewing ${m.id} (${m.paths.introPack})`);
    try {
      const result = await reviewPack(apiKey, m.id, m.paths.introPack, packBody, agentBlobs);
      const verdict = result.parsed && result.parsed.verdict ? result.parsed.verdict : "unknown";
      verdicts.push({ id: m.id, verdict, cached: !!result.cached });
      const summary = result.parsed || {};
      console.log(`  verdict: ${verdict}${result.cached ? " (cached)" : ""}`);
      if (Array.isArray(summary.hard_failures) && summary.hard_failures.length > 0) {
        for (const f of summary.hard_failures) console.log(`  hard: ${f}`);
      }
      if (Array.isArray(summary.next_actions)) {
        for (const a of summary.next_actions.slice(0, 5)) console.log(`  next: ${a}`);
      }
    } catch (err) {
      console.error(`[pedagogy-review] ${m.id} FAILED: ${err.message}`);
      verdicts.push({ id: m.id, verdict: "error", error: err.message });
    }
  }
  console.log("");
  console.log("[pedagogy-review] summary:");
  for (const v of verdicts) console.log(`  ${v.id}: ${v.verdict}${v.cached ? " (cached)" : ""}`);
  return { skipped: false, verdicts };
}

// Runner entry point.
//
// When called by qa/run_all_quality_checks.js this returns a Promise that:
//   - resolves cleanly if ANTHROPIC_API_KEY is unset (SKIP — no impact on
//     the overall QA pass/fail);
//   - resolves cleanly when all packs are reviewed (any per-pack errors
//     are logged and reflected in the per-module verdict, but do not throw);
//   - rejects only on an unexpected fatal — e.g. registry unreadable.
//
// Per-pack "fail" verdicts are NOT translated into a thrown error from
// run(): the LLM judgment is advisory, and the user reads the verdict
// list to decide what to fix. If we ever want hard-failing pedagogy
// review, switch this to throw when any verdict === "fail".
async function run() {
  await main();
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`[pedagogy-review] fatal: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { run, main };
