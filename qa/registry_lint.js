#!/usr/bin/env node
/*
 * qa/registry_lint.js
 *
 * Validates modules/registry.json against the Phase 1 schema:
 *   - JSON parses, schemaVersion === 1, modules is an array
 *   - every module has all required fields
 *   - id === slug, slug matches /^[a-z0-9_]+$/
 *   - order values are unique
 *   - status is "published" | "draft"
 *   - every non-null paths.* entry points to a real file (or dir for audioDir/folder)
 *   - qa.hasAudit => paths.auditJs is set and exists
 *   - qa.hasTests => paths.testsJs is set and exists
 *
 * Exit 0 on success, 1 on any error. Run from anywhere via:
 *     node qa/registry_lint.js
 */

"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");

const REQUIRED_FIELDS = [
  "id",
  "slug",
  "displayName",
  "chapter",
  "unit",
  "topic",
  "tags",
  "skills",
  "difficulty",
  "order",
  "status",
  "cardVariant",
  "blurb",
  "paths",
  "qa",
];

const PATH_KEYS = [
  "folder",
  "launch",
  "moduleJs",
  "auditJs",
  "testsJs",
  "introPack",
  "sourceExtract",
  "audioDir",
  "engineEntry",
];

const SLUG_RE = /^[a-z0-9_]+$/;
const ALLOWED_STATUS = new Set(["published", "draft"]);

const errors = [];

function err(msg) {
  errors.push(msg);
}

function fileExists(rel) {
  try {
    return fs.existsSync(path.join(REPO_ROOT, rel));
  } catch (_) {
    return false;
  }
}

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    err(`registry not found at ${REGISTRY_PATH}`);
    return finish(0);
  }

  let raw;
  try {
    raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  } catch (e) {
    err(`could not read registry: ${e.message}`);
    return finish(0);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    err(`registry JSON is invalid: ${e.message}`);
    return finish(0);
  }

  if (data == null || typeof data !== "object") {
    err("registry top-level must be an object");
    return finish(0);
  }
  if (data.schemaVersion !== 1) {
    err(`schemaVersion must be 1 (got ${JSON.stringify(data.schemaVersion)})`);
  }
  if (!Array.isArray(data.modules)) {
    err("modules must be an array");
    return finish(0);
  }

  const seenOrders = new Map();
  const seenSlugs = new Set();

  data.modules.forEach((mod, idx) => {
    const label = mod && mod.slug ? `module[${idx}] (${mod.slug})` : `module[${idx}]`;

    if (mod == null || typeof mod !== "object") {
      err(`${label}: must be an object`);
      return;
    }

    for (const field of REQUIRED_FIELDS) {
      if (!(field in mod)) {
        err(`${label}: missing required field '${field}'`);
      }
    }

    if (typeof mod.slug !== "string" || !SLUG_RE.test(mod.slug)) {
      err(`${label}: slug must match /^[a-z0-9_]+$/, got ${JSON.stringify(mod.slug)}`);
    }
    if (mod.id !== mod.slug) {
      err(`${label}: id must equal slug (id=${JSON.stringify(mod.id)}, slug=${JSON.stringify(mod.slug)})`);
    }

    if (seenSlugs.has(mod.slug)) {
      err(`${label}: duplicate slug ${JSON.stringify(mod.slug)}`);
    } else {
      seenSlugs.add(mod.slug);
    }

    if (!Number.isInteger(mod.order)) {
      err(`${label}: order must be an integer, got ${JSON.stringify(mod.order)}`);
    } else if (seenOrders.has(mod.order)) {
      err(`${label}: duplicate order ${mod.order} (also used by '${seenOrders.get(mod.order)}')`);
    } else {
      seenOrders.set(mod.order, mod.slug);
    }

    if (!Number.isInteger(mod.difficulty) || mod.difficulty < 1 || mod.difficulty > 5) {
      err(`${label}: difficulty must be an integer 1..5, got ${JSON.stringify(mod.difficulty)}`);
    }

    if (!ALLOWED_STATUS.has(mod.status)) {
      err(`${label}: status must be 'published' or 'draft', got ${JSON.stringify(mod.status)}`);
    }

    if (!Array.isArray(mod.tags)) {
      err(`${label}: tags must be an array`);
    }
    if (!Array.isArray(mod.skills)) {
      err(`${label}: skills must be an array`);
    }

    const p = mod.paths;
    if (p == null || typeof p !== "object") {
      err(`${label}: paths must be an object`);
    } else {
      for (const key of PATH_KEYS) {
        if (!(key in p)) {
          err(`${label}: paths.${key} missing`);
          continue;
        }
        const val = p[key];
        if (val == null) continue;
        if (typeof val !== "string" || val.length === 0) {
          err(`${label}: paths.${key} must be a non-empty string or null, got ${JSON.stringify(val)}`);
          continue;
        }
        if (val.startsWith("/") || val.startsWith("\\")) {
          err(`${label}: paths.${key} must be repo-root-relative without a leading slash, got ${JSON.stringify(val)}`);
          continue;
        }
        if (!fileExists(val)) {
          err(`${label}: paths.${key} -> ${val} does not exist on disk`);
        }
      }
    }

    const qa = mod.qa;
    if (qa == null || typeof qa !== "object") {
      err(`${label}: qa must be an object`);
    } else {
      if (typeof qa.hasAudit !== "boolean") {
        err(`${label}: qa.hasAudit must be a boolean`);
      }
      if (typeof qa.hasTests !== "boolean") {
        err(`${label}: qa.hasTests must be a boolean`);
      }
      if (qa.hasAudit === true) {
        const a = p && p.auditJs;
        if (!a) {
          err(`${label}: qa.hasAudit is true but paths.auditJs is null`);
        } else if (typeof a === "string" && !fileExists(a)) {
          err(`${label}: qa.hasAudit is true but paths.auditJs (${a}) does not exist`);
        }
      }
      if (qa.hasTests === true) {
        const t = p && p.testsJs;
        if (!t) {
          err(`${label}: qa.hasTests is true but paths.testsJs is null`);
        } else if (typeof t === "string" && !fileExists(t)) {
          err(`${label}: qa.hasTests is true but paths.testsJs (${t}) does not exist`);
        }
      }
    }
  });

  finish(data.modules.length);
}

function finish(moduleCount) {
  if (errors.length === 0) {
    console.log(`[registry-lint] ${moduleCount} modules, 0 errors`);
    process.exit(0);
  }
  for (const msg of errors) {
    console.error(`[registry-lint] ERROR: ${msg}`);
  }
  console.error(`[registry-lint] ${moduleCount} modules, ${errors.length} error${errors.length === 1 ? "" : "s"}`);
  process.exit(1);
}

main();
