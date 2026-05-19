#!/usr/bin/env node
/*
 * scripts/sync-registry-js.mjs
 *
 * Regenerates modules/registry.js from the canonical modules/registry.json.
 *
 * The .js form is loaded via <script src> from the dashboard and run-app
 * HTMLs, so those pages work when opened directly from disk (file://),
 * where fetch() of local JSON is blocked by Chrome/Edge. The .json file
 * remains the single source of truth — never hand-edit registry.js.
 *
 * Re-generate with: node scripts/sync-registry-js.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename_ = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename_);
const repoRoot = resolve(__dirname, "..");
const jsonPath = resolve(repoRoot, "modules/registry.json");
const jsPath = resolve(repoRoot, "modules/registry.js");

export function buildRegistryJsContent(data) {
  const banner =
    "// AUTO-GENERATED from modules/registry.json. Do not edit by hand.\n" +
    "// Re-generate with: node scripts/sync-registry-js.mjs\n";
  const body = `window.PMC_REGISTRY = ${JSON.stringify(data, null, 2)};\n`;
  return banner + body;
}

export function readRegistryJson() {
  const raw = readFileSync(jsonPath, "utf8");
  return JSON.parse(raw);
}

export function syncRegistryJs() {
  const data = readRegistryJson();
  const content = buildRegistryJsContent(data);
  writeFileSync(jsPath, content, "utf8");
  return { jsPath, moduleCount: data.modules.length };
}

// CLI entrypoint (only when run directly, not when imported)
const invokedDirect = process.argv[1] && resolve(process.argv[1]) === __filename_;
if (invokedDirect) {
  const { jsPath: outPath, moduleCount } = syncRegistryJs();
  console.log(`[sync-registry-js] wrote ${outPath} (${moduleCount} modules)`);
}
