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
 *   - has paths.moduleJs != null
 *   - has paths.launch != null
 *   - has qa.hasIntro !== false (default: enabled)
 * launch the module HTML in a headless Chromium browser (Playwright) and
 * assert all of:
 *
 *   1. document.title does NOT contain another module's displayName
 *      (cross-template leak check).
 *   2. #intro-title text contains a substantial token match against the
 *      module JS's INTRO_SCENES[0].title (case-insensitive token match,
 *      not pixel-perfect).
 *   3. #intro-frame innerHTML length > 200 chars.
 *   4. #intro-frame innerHTML contains "<svg" OR a substantial DOM mosaic
 *      (we currently look for "<svg" since every module uses SVG diagrams).
 *   5. No console.error during page load. favicon.ico 404 is filtered out.
 *   6. #intro-storyboard child element count >= INTRO_SCENES.length.
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
      const introFrame = document.getElementById("intro-frame");
      const storyboard = document.getElementById("intro-storyboard");
      return {
        introTitleText: introTitle ? introTitle.textContent : null,
        introFrameLen: introFrame ? introFrame.innerHTML.length : 0,
        introFrameHasSvg: introFrame ? introFrame.innerHTML.includes("<svg") : false,
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

  // 2) intro-title token match against INTRO_SCENES[0].title.
  if (Array.isArray(introScenes) && introScenes[0] && introScenes[0].title) {
    const expected = introScenes[0].title;
    const overlap = tokenOverlap(dom.introTitleText, expected);
    if (overlap < 1) {
      failures.push(`intro-title ${JSON.stringify(dom.introTitleText)} has no token overlap with INTRO_SCENES[0].title ${JSON.stringify(expected)}`);
    }
  } else {
    failures.push("module JS does not expose INTRO_SCENES (cannot verify intro-title)");
  }

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

async function runAsync() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`registry not found at ${REGISTRY_PATH}`);
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  const allDisplayNames = registry.modules.map((m) => m.displayName).filter(Boolean);

  // Select modules eligible for the gate.
  const targets = registry.modules.filter((m) => {
    if (!m.paths) return false;
    if (!m.paths.moduleJs) return false;
    if (!m.paths.launch) return false;
    if (m.qa && m.qa.hasIntro === false) return false;
    return true;
  });

  if (targets.length === 0) {
    console.log("[module-integration] no eligible modules — nothing to check");
    return { failures: 0, results: [] };
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
  let failures = 0;
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    for (const m of targets) {
      const introScenes = loadIntroScenesFor(m);
      if (introScenes && introScenes.error) {
        results.push({ id: m.id, failures: [`module JS require failed: ${introScenes.error}`] });
        failures += 1;
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
    }
    await context.close();
  } finally {
    await browser.close();
    if (startedServer) startedServer.stop();
  }

  return { failures, results };
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
  console.log("");
  console.log(`[module-integration] checked ${out.results.length} module(s), ${out.failures} failure(s)`);
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
