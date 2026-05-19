#!/usr/bin/env node
/*
 * qa/registry_js_sync_lint.js
 *
 * Drift check: modules/registry.js must always be in sync with
 * modules/registry.json. We regenerate the .js content in memory from
 * the canonical .json, then byte-compare against the on-disk .js.
 *
 * If they differ, fail with a clear remediation. This catches the most
 * common foot-gun: someone edits registry.json but forgets to re-run
 * `node scripts/sync-registry-js.mjs`, so the dashboard and run app
 * (which read window.PMC_REGISTRY from registry.js) silently fall
 * behind.
 *
 * Exit 0 on success, 1 on drift or missing file.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const JSON_PATH = path.join(REPO_ROOT, "modules", "registry.json");
const JS_PATH = path.join(REPO_ROOT, "modules", "registry.js");

function buildExpectedJsContent(data) {
  // Must match scripts/sync-registry-js.mjs::buildRegistryJsContent byte-for-byte.
  const banner =
    "// AUTO-GENERATED from modules/registry.json. Do not edit by hand.\n" +
    "// Re-generate with: node scripts/sync-registry-js.mjs\n";
  const body = `window.PMC_REGISTRY = ${JSON.stringify(data, null, 2)};\n`;
  return banner + body;
}

function fail(msg) {
  console.error(`[registry-js-sync-lint] FAIL: ${msg}`);
  process.exit(1);
}

function main() {
  if (!fs.existsSync(JSON_PATH)) {
    fail(`modules/registry.json not found at ${JSON_PATH}`);
  }
  if (!fs.existsSync(JS_PATH)) {
    fail(`modules/registry.js not found — run node scripts/sync-registry-js.mjs`);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  } catch (e) {
    fail(`modules/registry.json could not be parsed: ${e.message}`);
  }

  const expected = buildExpectedJsContent(data);
  const actual = fs.readFileSync(JS_PATH, "utf8");

  if (expected !== actual) {
    fail(
      "modules/registry.js out of sync with modules/registry.json — " +
        "run node scripts/sync-registry-js.mjs"
    );
  }

  console.log(
    `[registry-js-sync-lint] modules/registry.js in sync with registry.json (${data.modules.length} modules)`
  );
}

main();
