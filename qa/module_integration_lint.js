#!/usr/bin/env node
/*
 * qa/module_integration_lint.js
 *
 * End-to-end smoke gate that catches "module HTML and module JS got out
 * of sync" bugs — the class of bug where a module is duplicated from a
 * template, the JS doesn't wire its intro player, and the page renders
 * with another module's title or with an empty intro frame.
 *
 * For each module in modules/registry.json that:
 *   - has paths.launch != null
 *   - has qa.hasIntro !== false (default: enabled)
 * launch the module HTML in a headless Chromium browser (Playwright) and
 * assert all of:
 *
 *   1. document.title does NOT contain another module's displayName
 *      (cross-template leak check).
 *   2. The INTRO_SCENES[0].title appears (token overlap, case-insensitive)
 *      in ANY of: #intro-title, #intro-scene-title, #intro-caption,
 *      #intro-frame innerHTML, or the surrounding DOM neighbourhood.
 *      DOM-ID variation between templates is expected — older modules use
 *      #intro-scene-title (a sibling <h2>) instead of #intro-title.
 *   3. #intro-frame innerHTML length > 200 chars.
 *   4. #intro-frame innerHTML contains "<svg" OR a substantial DOM mosaic
 *      (we currently look for "<svg" since every module uses SVG diagrams).
 *   5. No console.error during page load. favicon.ico 404 is filtered out.
 *   6. #intro-storyboard child element count >= INTRO_SCENES.length.
 *
 * Modules without paths.moduleJs (e.g. pascal, which is a static practice
 * share) or whose module JS exports no INTRO_SCENES (e.g. u2t2_units, a
 * year-mission map) are SKIPped — they show up in the report as
 * "[module-integration] SKIP <id>: <reason>" and do NOT count toward
 * failures.
 *
 * For each scene with an `audio: "..."` field, we also resolve the file
 * relative to the module's folder and emit a soft "[module-integration]
 * WARN" if it is missing. Missing audio does NOT fail the gate — the page
 * still works without it — but the author should know.
 *
 * Playwright is loaded via require("playwright-core") (an optional dev
 * dependency). If it is not installed, the gate prints a SKIP banner
 * with install instructions and exits 0 — making this a SOFT gate by
 * default. The day Playwright is available, every assertion above runs
 * for every module that opts in.
 *
 * Run via:
 *     node qa/module_integration_lint.js
 *
 * The gate is wired into qa/run_all_quality_checks.js after the existing
 * gates. The orchestrator treats a Playwright-missing SKIP as a pass so
 * that contributors without Playwright still get a clean QA run; if
 * Playwright IS installed, an assertion failure here will fail the run
 * loudly.
 */

"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");
const STATIC_PORT = Number(process.env.PMC_STATIC_PORT || 8765);
const STATIC_ROOT = `http://localhost:${STATIC_PORT}`;

const { requireModuleSafe } = require("./_dom_stubs.js");

function tryRequirePlaywright() {
  // We deliberately try a list of candidate package names so the gate
  // works whether the user installed playwright-core, playwright, or
  // had it hoisted by a workspace tool.
  const candidates = ["playwright-core", "playwright"];
  for (const name of candidates) {
    try {
      const lib = require(name);
      if (lib && lib.chromium) return { lib, name };
    } catch (err) {
      // ignore — try next candidate
    }
  }
  return null;
}

function printSkipBanner(reason) {
  console.log("");
  console.log("[module-integration] SKIP: " + reason);
  console.log("[module-integration] To enable this gate, install Playwright:");
  console.log("    npm install --save-dev playwright-core@latest");
  console.log("    npx playwright install chromium");
  console.log("[module-integration] Then re-run: node qa/module_integration_lint.js");
}

function tokenise(text) {
  return String(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((tok) => tok.length >= 3);
}

function tokenOverlap(actual, expected) {
  if (!actual || !expected) return 0;
  const want = new Set(tokenise(expected));
  if (want.size === 0) return 0;
  const have = tokenise(actual);
  let hits = 0;
  for (const tok of have) if (want.has(tok)) hits += 1;
  return hits;
}

function pingStaticServer() {
  return new Promise((resolve) => {
    const req = http.get(`${STATIC_ROOT}/modules/registry.json`, (res) => {
      // Drain so the socket can close.
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function startStaticServer() {
  // Spawn the project's own static server so the gate is self-sufficient
  // when run standalone. Returns a handle whose stop() kills the child.
  const serverPath = path.join(REPO_ROOT, "scripts", "static-server.mjs");
  if (!fs.existsSync(serverPath)) return null;
  const child = spawn(process.execPath, [serverPath], {
    cwd: REPO_ROOT,
    env: { ...process.env, PORT: String(STATIC_PORT) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  return {
    stop: () => {
      try { child.kill(); } catch (err) { /* noop */ }
    }
  };
}

async function waitForServer(maxMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    // eslint-disable-next-line no-await-in-loop
    if (await pingStaticServer()) return true;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

function loadIntroScenesFor(modRecord) {
  // Use the existing dom-stubs helper so that browser-only runtime in
  // the module file (e.g. boot()) does not crash at require time.
  const absJs = path.join(REPO_ROOT, modRecord.paths.moduleJs);
  if (!fs.existsSync(absJs)) return null;
  try {
    const mod = requireModuleSafe(absJs);
    if (!mod) return null;
    if (Array.isArray(mod.INTRO_SCENES)) return mod.INTRO_SCENES;
    return null;
  } catch (err) {
    return { error: err.message };
  }
}

async function checkOneModule(page, modRecord, allDisplayNames, introScenes) {
  const url = `${STATIC_ROOT}/${modRecord.paths.launch.replace(/\\/g, "/")}`;
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // The static server doesn't ship a favicon, so a favicon 404 is
    // not a real bug. Filter it out per spec.
    if (/favicon\.ico/i.test(text)) return;
    consoleErrors.push(text);
  };
  const onPageError = (err) => {
    pageErrors.push(String(err && err.message ? err.message : err));
  };
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  let pageTitle = "";
  let dom = {};
  try {
    await page.goto(url, { waitUntil: "load", timeout: 15000 });
    // Give the boot() handler a moment to run after DOMContentLoaded.
    await page.waitForTimeout(150);
    pageTitle = await page.title();
    dom = await page.evaluate(() => {
      const introTitle = document.getElementById("intro-title");
      const introCaption = document.getElementById("intro-caption");
      const introFrame = document.getElementById("intro-frame");
      const storyboard = document.getElementById("intro-storyboard");
      // Build a "neighbourhood" of text near intro-frame so we can match
      // titles rendered in a sibling <h2>/<h3> (e.g. older modules use
      // #intro-scene-title rather than #intro-title).
      let neighbourhood = "";
      if (introFrame) {
        // Walk up to 2 ancestors, collect their textContent so we capture
        // sibling headings/captions surrounding the frame.
        let node = introFrame;
        for (let i = 0; i < 3 && node; i += 1) {
          if (node.textContent) neighbourhood += " " + node.textContent;
          node = node.parentElement;
        }
        // Trim to a reasonable size — we only need a window around the frame.
        if (neighbourhood.length > 2000) neighbourhood = neighbourhood.slice(0, 2000);
      }
      // Some older templates name the title element `intro-scene-title`.
      const sceneTitle = document.getElementById("intro-scene-title");
      return {
        introTitleText: introTitle ? introTitle.textContent : null,
        introSceneTitleText: sceneTitle ? sceneTitle.textContent : null,
        introCaptionText: introCaption ? introCaption.textContent : null,
        introFrameLen: introFrame ? introFrame.innerHTML.length : 0,
        introFrameHTML: introFrame ? introFrame.innerHTML : "",
        introFrameHasSvg: introFrame ? introFrame.innerHTML.includes("<svg") : false,
        introNeighbourhood: neighbourhood,
        storyboardCount: storyboard ? storyboard.children.length : 0
      };
    });
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }

  const failures = [];
  // 1) Cross-template title leak: title must not name another module.
  const titleLow = (pageTitle || "").toLowerCase();
  const ownName = String(modRecord.displayName || "").toLowerCase();
  for (const otherName of allDisplayNames) {
    if (!otherName) continue;
    if (otherName.toLowerCase() === ownName) continue;
    // Only flag if the other name is a clean substring of length >= 8 to
    // avoid false matches on short generic words.
    if (otherName.length >= 8 && titleLow.includes(otherName.toLowerCase())) {
      failures.push(`page <title> ${JSON.stringify(pageTitle)} mentions another module "${otherName}"`);
    }
  }

  // 2) Title token-overlap match against INTRO_SCENES[0].title.
  //    DOM-ID structure varies between templates: newer modules render the
  //    scene title in #intro-title, older ones use #intro-scene-title
  //    (a sibling <h2> near #intro-frame), and some embed the title in
  //    the SVG itself or in the surrounding heading. We accept a token
  //    overlap (>= 2 tokens, or >= 1 token for single-token titles) in
  //    ANY of these locations.
  const expected = (Array.isArray(introScenes) && introScenes[0] && introScenes[0].title) || null;
  if (expected) {
    const candidates = [
      ["#intro-title", dom.introTitleText],
      ["#intro-scene-title", dom.introSceneTitleText],
      ["#intro-caption", dom.introCaptionText],
      ["#intro-frame innerHTML", dom.introFrameHTML],
      ["frame neighbourhood", dom.introNeighbourhood]
    ];
    const expectedTokens = tokenise(expected);
    // Require >= 2 token hits unless the title only HAS 1 meaningful token.
    const required = expectedTokens.length >= 2 ? 2 : 1;
    let matched = false;
    let bestSource = null;
    let bestOverlap = 0;
    for (const [src, text] of candidates) {
      const overlap = tokenOverlap(text, expected);
      if (overlap > bestOverlap) {
        bestOverlap = overlap;
        bestSource = src;
      }
      if (overlap >= required) {
        matched = true;
        break;
      }
    }
    if (!matched) {
      failures.push(
        `no DOM location contains >= ${required} token(s) of INTRO_SCENES[0].title ${JSON.stringify(expected)} ` +
        `(best match: ${bestOverlap} token(s) in ${bestSource || "n/a"})`
      );
    }
  }
  // (If `expected` is null the caller has already SKIPped this module.)

  // 3) intro-frame innerHTML length floor.
  if (dom.introFrameLen <= 200) {
    failures.push(`intro-frame innerHTML is only ${dom.introFrameLen} chars (need > 200) — runtime probably did not render`);
  }
  // 4) intro-frame must contain an SVG diagram.
  if (!dom.introFrameHasSvg) {
    failures.push(`intro-frame innerHTML does not contain "<svg" — diagram missing`);
  }
  // 5) Console errors.
  if (consoleErrors.length) {
    failures.push(`console errors: ${consoleErrors.slice(0, 3).join(" | ")}`);
  }
  if (pageErrors.length) {
    failures.push(`uncaught page errors: ${pageErrors.slice(0, 3).join(" | ")}`);
  }
  // 6) Storyboard child count vs INTRO_SCENES length.
  if (Array.isArray(introScenes)) {
    if (dom.storyboardCount < introScenes.length) {
      failures.push(`intro-storyboard has ${dom.storyboardCount} children, expected >= ${introScenes.length}`);
    }
  }
  return { url, pageTitle, dom, failures };
}

function checkAudioFiles(modRecord, introScenes) {
  // Returns an array of WARN strings for missing audio files referenced
  // by INTRO_SCENES. Audio paths are resolved relative to the module's
  // folder (paths.folder from the registry).
  const warns = [];
  if (!Array.isArray(introScenes)) return warns;
  const folder = modRecord.paths && modRecord.paths.folder;
  if (!folder) return warns;
  const folderAbs = path.join(REPO_ROOT, folder);
  for (const scene of introScenes) {
    if (!scene || typeof scene.audio !== "string" || scene.audio.length === 0) continue;
    const audioAbs = path.join(folderAbs, scene.audio);
    if (!fs.existsSync(audioAbs)) {
      const sceneLabel = scene.title || "(untitled)";
      warns.push(`${modRecord.id}/${sceneLabel}: audio file missing — ${scene.audio}`);
    }
  }
  return warns;
}

async function runAsync() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`registry not found at ${REGISTRY_PATH}`);
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const allDisplayNames = registry.modules.map((m) => m.displayName).filter(Boolean);

  // Select modules eligible for the gate.
  // We include modules that have a launch HTML but no moduleJs as well —
  // they will be reported as SKIP (no INTRO_SCENES to verify) so the
  // user gets a clear signal rather than a silent omission.
  const targets = registry.modules.filter((m) => {
    if (!m.paths) return false;
    if (!m.paths.launch) return false;
    if (m.qa && m.qa.hasIntro === false) return false;
    return true;
  });

  if (targets.length === 0) {
    console.log("[module-integration] no eligible modules — nothing to check");
    return { failures: 0, results: [], skips: [], audioWarns: [] };
  }

  const playwrightHandle = tryRequirePlaywright();
  if (!playwrightHandle) {
    printSkipBanner("Playwright is not installed in this workspace");
    return { skipped: true, failures: 0, results: [] };
  }

  // Make sure the static server is up. Start one if not.
  let startedServer = null;
  const initialReachable = await pingStaticServer();
  if (!initialReachable) {
    startedServer = startStaticServer();
    const ok = await waitForServer(5000);
    if (!ok) {
      if (startedServer) startedServer.stop();
      throw new Error(`could not reach static server at ${STATIC_ROOT} after start`);
    }
  }

  const browser = await playwrightHandle.lib.chromium.launch({ headless: true });
  const results = [];
  const skips = [];
  const audioWarns = [];
  let failures = 0;
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    for (const m of targets) {
      // SKIP modules that have no module JS at all (e.g. pascal, which
      // ships only a static HTML practice share with no INTRO_SCENES).
      if (!m.paths.moduleJs) {
        skips.push({ id: m.id, reason: "no module JS" });
        continue;
      }
      const introScenes = loadIntroScenesFor(m);
      if (introScenes && introScenes.error) {
        results.push({ id: m.id, failures: [`module JS require failed: ${introScenes.error}`] });
        failures += 1;
        continue;
      }
      // SKIP modules whose JS exports no INTRO_SCENES — there is nothing
      // intro-related to verify, and the storyboard / intro-frame are
      // expected to be empty for these (e.g. u2t2_units, which is a
      // year-mission map rather than a lesson with an intro video).
      if (!Array.isArray(introScenes)) {
        skips.push({ id: m.id, reason: "no INTRO_SCENES exported" });
        continue;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await checkOneModule(page, m, allDisplayNames, introScenes);
        results.push({ id: m.id, ...result });
        if (result.failures.length) failures += 1;
      } catch (err) {
        results.push({ id: m.id, failures: [`exception during check: ${err.message}`] });
        failures += 1;
      }
      // Audio-file existence is WARN-only and does NOT count toward failures.
      const warns = checkAudioFiles(m, introScenes);
      for (const w of warns) audioWarns.push(w);
    }
    await context.close();
  } finally {
    await browser.close();
    if (startedServer) startedServer.stop();
  }

  return { failures, results, skips, audioWarns };
}

function printResults(out) {
  if (out.skipped) return;
  console.log("");
  for (const r of out.results) {
    if (r.failures && r.failures.length) {
      console.log(`[module-integration] FAIL ${r.id}`);
      for (const f of r.failures) console.log(`    - ${f}`);
    } else {
      console.log(`[module-integration] OK   ${r.id}  (title=${JSON.stringify(r.pageTitle)}, frameLen=${r.dom.introFrameLen})`);
    }
  }
  // Skipped modules (no module JS / no INTRO_SCENES) — informational only.
  if (Array.isArray(out.skips) && out.skips.length) {
    for (const s of out.skips) {
      console.log(`[module-integration] SKIP ${s.id}: ${s.reason}`);
    }
  }
  // Audio-file warnings — soft, do not affect pass/fail.
  if (Array.isArray(out.audioWarns) && out.audioWarns.length) {
    console.log("");
    for (const w of out.audioWarns) {
      console.log(`[module-integration] WARN ${w}`);
    }
  }
  console.log("");
  const skipCount = (out.skips && out.skips.length) || 0;
  const warnCount = (out.audioWarns && out.audioWarns.length) || 0;
  console.log(
    `[module-integration] checked ${out.results.length} module(s), ` +
    `${out.failures} failure(s), ${skipCount} skip(s), ${warnCount} audio warning(s)`
  );
}

async function run() {
  const out = await runAsync();
  printResults(out);
  if (out.failures > 0) {
    throw new Error(`[module-integration] ${out.failures} failure(s)`);
  }
}

if (require.main === module) {
  run().then(
    () => process.exit(0),
    (err) => {
      console.error(err.message || err);
      process.exit(1);
    }
  );
}

module.exports = { run, runAsync };
