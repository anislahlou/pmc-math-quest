#!/usr/bin/env node
/*
 * qa/diagram_parity_lint.js
 *
 * Registry-driven structural-fidelity gate for module diagrams. Detects:
 *
 *   a) Variant fingerprint instability:
 *      For each (classicId, state), all variantIndex values must render the
 *      same structural SVG skeleton (tag + rounded coords; <text> content
 *      ignored so numeric labels can change). Variants are meant to swap
 *      numbers, not redraw the picture.
 *
 *   b) Initial-vs-solution subset:
 *      Every structural element in the initial render must also appear in
 *      the solution render. Solutions are allowed to ADD elements (the
 *      answer banner, hint overlays, dashed-height reveals) but the
 *      base geometry must remain.
 *
 *   c) Card-vs-module skeleton drift:
 *      The marketing card SVG in run/pmc_simulation_app.html must match
 *      the module's first-classic initial render on three structural
 *      properties: <polygon> count, dashed-line presence, and aspect ratio
 *      (within +/- 20%).
 *
 * No dependencies. Modules that touch `document` at require-time get a
 * minimal polyfill so we can still require() them in node. Modules that
 * don't expose generateProblem / renderProblemVisual / a classic list are
 * SKIPped (not failed) but reported at the end so coverage gaps are visible.
 *
 * Exit 0 only if every covered module passes (SKIPs do not fail the run).
 * Exit 1 on any FAIL.
 *
 * Run via:
 *     node qa/diagram_parity_lint.js
 */

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO_ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(REPO_ROOT, "modules", "registry.json");
const SIM_APP_PATH = path.join(REPO_ROOT, "run", "pmc_simulation_app.html");
const CARD_VISUALS_PATH = path.join(REPO_ROOT, "run", "card_visuals.js");
const MAX_VARIANTS = 20;

const { requireModuleSafe } = require("./_dom_stubs.js");

// ---- structural-fingerprint extraction --------------------------------------

const STRUCTURAL_TAG_RE =
  /<(rect|circle|ellipse|line|polyline|polygon|path|g|svg|use|defs|symbol|image)\b([^>]*)>/gi;

function extractAttrs(rawAttrs) {
  const attrs = {};
  const re = /([a-zA-Z_:][-\w:.]*)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(rawAttrs))) {
    attrs[m[1].toLowerCase()] = m[2];
  }
  return attrs;
}

const COORD_KEYS = ["x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "width", "height"];

function roundCoord(n) {
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 2) / 2; // half-pixel buckets — looser than 1px to allow trivial pixel-jitter, tight enough to catch real geometry changes
}

function fingerprintElement(tag, attrs) {
  const parts = [tag.toLowerCase()];
  for (const key of COORD_KEYS) {
    if (key in attrs) {
      const v = Number(attrs[key]);
      parts.push(`${key}=${roundCoord(v)}`);
    }
  }
  if (attrs.points) {
    const pts = attrs.points
      .trim()
      .split(/[\s,]+/)
      .map((s) => roundCoord(Number(s)))
      .filter((n) => n != null);
    parts.push(`pts=${pts.join(",")}`);
  }
  if (attrs.d) {
    // strip text content; keep operators and rounded coords
    const cmds = attrs.d.match(/[a-zA-Z]|-?\d+(?:\.\d+)?/g) || [];
    const norm = cmds.map((c) => (/^[a-zA-Z]$/.test(c) ? c.toLowerCase() : String(roundCoord(Number(c)))));
    parts.push(`d=${norm.join(",")}`);
  }
  if (attrs["stroke-dasharray"]) {
    parts.push(`dash=${attrs["stroke-dasharray"]}`);
  }
  return parts.join("|");
}

function structuralElements(svgString) {
  if (typeof svgString !== "string" || svgString.length === 0) return [];
  const elements = [];
  STRUCTURAL_TAG_RE.lastIndex = 0;
  let m;
  while ((m = STRUCTURAL_TAG_RE.exec(svgString))) {
    const tag = m[1];
    const attrs = extractAttrs(m[2] || "");
    elements.push(fingerprintElement(tag, attrs));
  }
  return elements;
}

function fingerprintSvg(svgString) {
  const elements = structuralElements(svgString);
  const joined = elements.join("\n");
  return {
    elements,
    hash: crypto.createHash("sha1").update(joined).digest("hex").slice(0, 12)
  };
}

// ---- module surface adapters ------------------------------------------------

function extractSvgString(rendered) {
  if (!rendered) return null;
  if (typeof rendered === "string") return rendered;
  if (typeof rendered.svg === "string") return rendered.svg;
  if (typeof rendered.html === "string") return rendered.html;
  return null;
}

function classicsFromModule(mod) {
  if (Array.isArray(mod.CLASSICS)) {
    return mod.CLASSICS.map((c) => ({
      id: c.id,
      nickname: c.nickname || c.title || c.id
    }));
  }
  if (Array.isArray(mod.classics)) {
    return mod.classics.map((c) => ({
      id: c.id,
      nickname: c.nickname || c.title || c.id
    }));
  }
  if (Array.isArray(mod.problemBase)) {
    return mod.problemBase.map((c) => ({
      id: c.id,
      nickname: c.nickname || c.title || c.id
    }));
  }
  if (Array.isArray(mod.MODULES)) {
    // u2t2 — its "classics" are submodules
    return mod.MODULES.map((c) => ({
      id: c.id,
      nickname: c.title || c.id
    }));
  }
  return null;
}

// ---- card SVG extraction from sim app --------------------------------------

function findCardSvg(html, cardVariant) {
  if (!cardVariant) return null;
  // Phase 4 refactor: the sim app no longer hand-codes each card's SVG
  // inline. The card visuals now live in run/card_visuals.js, keyed by
  // cardVariant. Prefer that source. If it's unreadable or doesn't yet
  // have the variant, fall back to the legacy inline <article> scan so
  // older snapshots of the HTML still work.
  const fromVisualsFile = findCardSvgInVisualsFile(cardVariant);
  if (fromVisualsFile) return fromVisualsFile;

  // legacy: inline <article class="module-card <variant>">...</article>
  const variantEsc = cardVariant.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const articleRe = new RegExp(
    `<article\\b[^>]*class="[^"]*\\bmodule-card\\b[^"]*\\b${variantEsc}\\b[^"]*"[\\s\\S]*?<\\/article>`,
    "i"
  );
  const articleMatch = articleRe.exec(html);
  if (!articleMatch) return null;
  const article = articleMatch[0];
  const svgRe = /<svg\b[^>]*>[\s\S]*?<\/svg>/i;
  const svgMatch = svgRe.exec(article);
  if (!svgMatch) return null;
  return svgMatch[0];
}

let _cardVisualsCache = null;
function loadCardVisualsSource() {
  if (_cardVisualsCache !== null) return _cardVisualsCache;
  if (!fs.existsSync(CARD_VISUALS_PATH)) {
    _cardVisualsCache = "";
    return _cardVisualsCache;
  }
  _cardVisualsCache = fs.readFileSync(CARD_VISUALS_PATH, "utf8");
  return _cardVisualsCache;
}

function findCardSvgInVisualsFile(cardVariant) {
  const src = loadCardVisualsSource();
  if (!src) return null;
  // Match either bare-identifier or quoted keys: `pascal:` or `"volume-extension":`
  // followed by a backtick-template string. Capture the template body.
  const variantEsc = cardVariant.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const re = new RegExp(
    `(?:["']${variantEsc}["']|\\b${variantEsc}\\b)\\s*:\\s*\`([\\s\\S]*?)\``,
    "m"
  );
  const m = re.exec(src);
  if (!m) return null;
  const body = m[1];
  const svgRe = /<svg\b[^>]*>[\s\S]*?<\/svg>/i;
  const svgMatch = svgRe.exec(body);
  if (!svgMatch) return null;
  return svgMatch[0];
}

function parseViewBox(svgString) {
  const m = /viewBox="([^"]+)"/.exec(svgString);
  if (!m) return null;
  const parts = m[1].trim().split(/\s+/).map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
}

function countPolygons(svgString) {
  return (svgString.match(/<polygon\b/gi) || []).length;
}

function hasDashed(svgString) {
  return /stroke-dasharray\s*=/i.test(svgString);
}

function aspectRatio(svgString) {
  const vb = parseViewBox(svgString);
  if (!vb || vb.h === 0) return null;
  return vb.w / vb.h;
}

// ---- main -------------------------------------------------------------------

function loadRegistry() {
  const raw = fs.readFileSync(REGISTRY_PATH, "utf8");
  const data = JSON.parse(raw);
  return data.modules;
}

function safeRender(mod, classicId, variantIndex, state) {
  let problem;
  try {
    problem = mod.generateProblem(classicId, variantIndex);
  } catch (err) {
    return { error: `generateProblem(${classicId},${variantIndex}) threw: ${err.message}` };
  }
  if (problem == null) return { error: `generateProblem(${classicId},${variantIndex}) returned null` };
  let rendered;
  try {
    rendered = mod.renderProblemVisual(problem, state);
  } catch (err) {
    return { error: `renderProblemVisual(${classicId},${variantIndex},${state}) threw: ${err.message}` };
  }
  const svgString = extractSvgString(rendered);
  if (svgString == null) return { error: `renderProblemVisual returned no svg/html for ${classicId}/${variantIndex}/${state}` };
  return { svg: svgString };
}

function main(options = {}) {
  const exitOnFinish = options.exitOnFinish !== false;
  const modules = loadRegistry();
  const failures = [];
  const skips = [];
  const passes = [];
  const simAppHtml = fs.existsSync(SIM_APP_PATH) ? fs.readFileSync(SIM_APP_PATH, "utf8") : null;

  for (const m of [...modules].sort((a, b) => a.order - b.order)) {
    if (!m.paths || !m.paths.moduleJs) continue; // nothing to inspect
    const modAbs = path.join(REPO_ROOT, m.paths.moduleJs);
    if (!fs.existsSync(modAbs)) {
      failures.push(`[diagram-parity] FAIL ${m.id}: moduleJs path does not exist (${m.paths.moduleJs})`);
      continue;
    }

    let mod;
    try {
      mod = requireModuleSafe(modAbs);
    } catch (err) {
      failures.push(`[diagram-parity] FAIL ${m.id}: require() failed: ${err.message}`);
      continue;
    }

    if (typeof mod.generateProblem !== "function" || typeof mod.renderProblemVisual !== "function") {
      skips.push(`[diagram-parity] SKIP ${m.id}: missing required exports (generateProblem / renderProblemVisual)`);
      continue;
    }

    const classics = classicsFromModule(mod);
    if (!classics || classics.length === 0) {
      skips.push(`[diagram-parity] SKIP ${m.id}: no classics/MODULES/problemBase array exported`);
      continue;
    }

    const states = ["initial", "solution"];
    let modulePassedAny = false;

    for (const classic of classics) {
      const stateFingerprints = {}; // state -> { hash, elements } for variant 0
      let classicVariantStable = true;
      let classicHadAnyRender = false;

      for (const state of states) {
        for (let v = 0; v < MAX_VARIANTS; v += 1) {
          const r = safeRender(mod, classic.id, v, state);
          if (r.error) {
            // Some classics only have a few variants. If variant 0 fails, skip the classic. Otherwise stop.
            if (v === 0) {
              failures.push(`[diagram-parity] FAIL ${m.id}/${classic.id}/${state}: ${r.error}`);
              classicVariantStable = false;
            }
            break;
          }
          classicHadAnyRender = true;
          const fp = fingerprintSvg(r.svg);
          if (v === 0) {
            stateFingerprints[state] = fp;
          } else {
            if (fp.hash !== stateFingerprints[state].hash) {
              const added = fp.elements.filter((e) => !stateFingerprints[state].elements.includes(e)).slice(0, 3);
              const removed = stateFingerprints[state].elements.filter((e) => !fp.elements.includes(e)).slice(0, 3);
              failures.push(
                `[diagram-parity] FAIL ${m.id}/${classic.id}/${state}: variant 0 vs variant ${v} fingerprint differs ` +
                  `(v0 hash ${stateFingerprints[state].hash} vs v${v} hash ${fp.hash}; ` +
                  `e.g. added ${JSON.stringify(added)}; removed ${JSON.stringify(removed)})`
              );
              classicVariantStable = false;
              break;
            }
          }
        }
      }

      if (classicHadAnyRender && stateFingerprints.initial && stateFingerprints.solution) {
        const initialSet = new Set(stateFingerprints.initial.elements);
        const solutionSet = new Set(stateFingerprints.solution.elements);
        const initialOnly = [...initialSet].filter((e) => !solutionSet.has(e));
        if (initialOnly.length > 0) {
          failures.push(
            `[diagram-parity] FAIL ${m.id}/${classic.id}: initial has ${initialOnly.length} element(s) absent from solution ` +
              `(e.g. ${JSON.stringify(initialOnly.slice(0, 3))})`
          );
        }
      }
      if (classicVariantStable && classicHadAnyRender) modulePassedAny = true;
    }

    // ---- card-vs-module skeleton check
    if (simAppHtml && m.cardVariant && classics.length > 0) {
      const cardSvg = findCardSvg(simAppHtml, m.cardVariant);
      if (cardSvg) {
        const cardPolygons = countPolygons(cardSvg);
        const cardDashed = hasDashed(cardSvg);
        const cardAspect = aspectRatio(cardSvg);

        // pick the iconic classic
        const iconicId = m.cardPreviewClassicId || classics[0].id;
        const r = safeRender(mod, iconicId, 0, "initial");
        if (r.error) {
          failures.push(`[diagram-parity] FAIL ${m.id}: card-vs-module check could not render iconic classic ${iconicId}: ${r.error}`);
        } else {
          const moduleSvg = r.svg;
          const modPolygons = countPolygons(moduleSvg);
          const modDashed = hasDashed(moduleSvg);
          const modAspect = aspectRatio(moduleSvg);

          if (cardPolygons !== modPolygons) {
            failures.push(
              `[diagram-parity] FAIL ${m.id}: card has ${cardPolygons} <polygon> elements, module initial render has ${modPolygons} ` +
                `(cardVariant=${m.cardVariant}, iconic=${iconicId})`
            );
          }
          if (cardDashed !== modDashed) {
            failures.push(
              `[diagram-parity] FAIL ${m.id}: card dashed-line presence (${cardDashed}) differs from module initial render (${modDashed})`
            );
          }
          if (cardAspect != null && modAspect != null) {
            const lo = cardAspect * 0.8;
            const hi = cardAspect * 1.2;
            if (modAspect < lo || modAspect > hi) {
              failures.push(
                `[diagram-parity] FAIL ${m.id}: card aspect ratio ${cardAspect.toFixed(2)} vs module ${modAspect.toFixed(2)} ` +
                  `(allowed +/-20% band ${lo.toFixed(2)}..${hi.toFixed(2)})`
              );
            }
          } else if (cardAspect == null) {
            failures.push(`[diagram-parity] FAIL ${m.id}: card SVG has no parseable viewBox`);
          } else if (modAspect == null) {
            // module render is HTML-wrapped — not a real fail, just note it
            skips.push(`[diagram-parity] SKIP ${m.id}: module initial render has no <svg viewBox> (HTML-wrapped visual)`);
          }
        }
      } else {
        skips.push(`[diagram-parity] SKIP ${m.id}: no <svg> found inside card.module-card.${m.cardVariant}`);
      }
    }

    if (modulePassedAny) passes.push(m.id);
  }

  for (const s of skips) console.log(s);
  for (const f of failures) console.error(f);

  console.log("");
  console.log(`[diagram-parity] ${passes.length} module(s) with at least one passing classic`);
  console.log(`[diagram-parity] ${skips.length} skip(s) — these modules lack the surface the gate needs`);
  console.log(`[diagram-parity] ${failures.length} failure(s)`);

  const result = { passes: passes.length, skips: skips.length, failures: failures.length };
  if (exitOnFinish) {
    process.exit(failures.length > 0 ? 1 : 0);
  }
  return result;
}

function run() {
  // entry for the registry-driven runner: do not exit, just throw on failure.
  const result = main({ exitOnFinish: false });
  if (result.failures > 0) {
    const err = new Error(`[diagram-parity] ${result.failures} failure(s)`);
    err.gateResult = result;
    throw err;
  }
  return result;
}

if (require.main === module) {
  main();
} else {
  module.exports = { run, fingerprintSvg, structuralElements };
}
