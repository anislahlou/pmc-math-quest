# Module Factory Pipeline — how a lesson becomes a mission

This is the **canonical, end-to-end process** for adding a new learning module
(one workbook lesson → one playable mission). It is self-contained: a fresh
machine with a plain `git clone` of this repository has everything needed to
run it — source PDF included (via Git LFS). Lessons 22–25 (Train Problems,
Calculating with Formulas, Prime Factorisation 2, Inequalities) were all built
with exactly this pipeline.

The per-discipline design protocols in this folder (pedagogy, diagram
fidelity, question-bank quality, …) describe **what good looks like** at each
stage. This document describes **the order of operations, the commands, and
the verification harness** around them.

---

## Prerequisites (fresh machine)

| Tool | Why | Check |
|---|---|---|
| git + **git-lfs** | The source workbook PDF is stored in LFS. Without `git lfs install` before/after clone you get a 130-byte pointer file, not the PDF. | `git lfs ls-files` shows the PDF |
| Node.js ≥ 18 | Scaffolder, QA gates, static server. No npm install needed for core QA. | `node -v` |
| GitHub CLI (`gh`), authed | PRs and merges from the terminal. | `gh auth status` |
| (optional) `npm i` + Playwright | Enables the browser-integration QA gate; it SKIPs cleanly if absent. | — |
| (optional) `ANTHROPIC_API_KEY` | Enables the LLM pedagogy-review QA gate; SKIPs if unset. | — |

**Source workbook:** `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf`
(one bound PDF covering Lessons 19–28). **PDF page = printed page + 10.**
Each lesson ends where the next lesson's title page begins.

**Dev server:** `node scripts/static-server.mjs` → http://localhost:8765/
(config also in `.claude/launch.json` as `pmc-static` for Claude Code's
preview panel). The app equally runs from `file://` or GitHub Pages — there is
no build step and no runtime dependency.

---

## The pipeline (10 steps)

### 1. Read the lesson from the source PDF
Render the lesson's pages (title page → last exercise page before the next
lesson) and extract: the objectives box, every Learn & Discover, Exploration,
Practice, Reasoning ("Is Pip correct?"), Challenge, Teaching Time, Homework,
and Further/Extensive exercises. There is **no printed answer key** — every
answer used in the module must be computed, never copied.

### 2. Scaffold
```
node scripts/new-module.mjs --slug=<snake_case> --display="<Title>" \
  --chapter="Lesson NN" --unit=<unit> --topic="<Topic>" \
  --order=<last+10> --variant=<card-variant> --difficulty=1..5 \
  --skills="Skill A,Skill B,...(usually 6)"
```
Creates `modules/<slug>/` (8 files), a `status:"draft"` registry entry, and
re-generates `modules/registry.js`. Orders run 10, 20, … — take the next free
multiple of 10.

### 3. Author `<slug>_module.js` (the real work)
Model on the newest shipped module (e.g. `modules/inequalities/`). Contract:

- **6 classics**, each a generator with ≥ 6 hand-picked, integer-clean cases;
  `variantIndex % cases.length` selects the case. Alternate `choice` /
  `filled` answer modes by parity.
- **Answers are computed in code** (e.g. Legendre's formula, brute-force
  helpers), never hard-coded from eyeballing the source.
- `CLASSIC_SKILLS` maps every classic id to its **exact registry skill
  string** (the skill-coverage gate token-matches these).
- `INTRO_SCENES`: one scene per classic, `title` = registry skill (case may
  differ), 25+ word `voiceover`, plus a **dedicated teaching diagram per
  scene** (`introShell` builders) — not the practice card.
- **Answer-leak rules (bitten twice, Codex caught both):**
  - the practice visual's worked line is gated: `isRevealed ? v.detail : "= ?"`;
  - the `Answer:` banner renders only in `solution`/`worked` state;
  - nothing **always visible** (`v.principle`, `v.expr`, static legend) may
    state the answer for *any* variant — beware classics whose answer is a
    symbol or a constant (e.g. a properties premise `a > b` telegraphs `>`;
    "ones digit → 0" leaks every 0-answer case);
  - `renderProblemVisual` keeps a **stable SVG element skeleton** across
    variants/states (only text content changes) so diagram-parity passes, and
    null-guards its `problem` argument.
- **Browser UI driver** (below `root.XModule = api`): copy from the newest
  module — includes intro autoplay, **Previous scene** (`retreatIntro`) and
  Next buttons, audio fallback chain, hint ladder, Try similar, Fresh round.
  The scaffolder stubs this out; without it the page won't wire up.

### 4. Fix the page chrome
The scaffolder copies the donor lesson's HTML: update the visible headers
(`Think Academy Lesson NN`, `<h1>`, intro copy, video anchors, panel names)
and make sure the **`intro-prev` button** exists. Update `<title>`.

### 5. Intro pack + source extract
- `<slug>_intro_video_pack.md`: 6 required sections; storyboard scene titles
  = the registry skills; every voiceover ≥ 25 words; 80–600 lines.
- `<slug>_source_extract.md`: book/PDF page range, lesson boundaries, core
  ideas, and a **classic-id → registry-skill → representative source items**
  table so every bank item traces to the printed lesson.

### 6. Register the card (three maps — all of them)
In `run/card_visuals.js` add the module to:
1. `cardVisuals` (key = `cardVariant`) — card SVG. Keep **0 `<polygon>`, no
   dashed strokes, viewBox aspect within ±20 %** of the module's
   first-classic initial render (diagram-parity's card check).
2. `cardMeta` (key = registry `id`) — aria label + Launch/Source-extract buttons.
3. `questNodeVisuals` (key = registry `id`) — the numbered quest-map badge.
   **Missing this = unnumbered node on the missions page.** Number sequentially
   (…, train=11, formulas=12, prime-fact-2=13, inequalities=14).

### 7. Publish + sync
Flip the registry entry to `"status": "published"`, then
`node scripts/sync-registry-js.mjs`. **Never hand-edit `modules/registry.js`**
— it is generated; a stale copy fails `qa/registry_js_sync_lint.js`.

### 8. QA gates
```
npm run qa        # = registry_js_sync_lint + run_all_quality_checks
```
Per-module audit (96 generated questions) + tests, math-display,
skill-coverage, intro-pack, diagram-parity, module-integration (SKIP without
Playwright), pedagogy-review (SKIP without API key).
**Known baseline failures (pre-existing, not yours): 3 skill-coverage fails
in `u2t2_units`, `pascal`, `triangle_sides`.** Anything else must be fixed.

### 9. Independent verification (two agents, in parallel)
This is what makes the process trustworthy — the author never grades their
own homework:
- **Math re-derivation agent** — a separate agent re-computes every answer
  **from the text shown to the student** (parse the prompt, brute-force the
  integers / BigInt-check the factorials), for ~30 variants × 6 classics,
  and diff against `problem.expected`. Target: **0 discrepancies**.
- **Adversarial review agent (Codex)** — hunts answer-leaks in the
  `initial`/`hint` visual states, boundary/off-by-one errors, distractor
  collisions, HTML-escaping issues. Every real finding gets fixed and
  re-verified. (Historical catches: worked-method shown ungated; "ones digit
  → 0" principle leak; properties premise telegraphing the answer.)
- **Browser smoke test** — serve locally, then drive the real page: intro
  renders 6 scenes with Prev/Next, each answer style (choice / symbol /
  fill-in) accepts a correct answer, the visual shows `= ?` before and the
  worked detail + `Answer:` only after reveal.

### 10. Ship
```
git checkout -b feature/lesson-NN-<slug>
git add modules/<slug> modules/registry.json modules/registry.js run/card_visuals.js
git commit  &&  git push -u origin HEAD
gh pr create --base main ...
```
- PR body: summary, classics table, verification evidence, QA status.
- **Merging to `main` deploys to GitHub Pages** (`--source main /`), so a
  merge is a production release: **only merge with the owner's explicit OK.**
- After merge: wait for the Pages build
  (`gh api repos/<owner>/pmc-math-quest/pages/builds/latest`), then verify the
  live module URL returns 200 and the live `registry.js` / `card_visuals.js`
  contain the new module. Browser caching is aggressive — hard-refresh
  (Ctrl+Shift+R) when eyeballing the live site.

---

## Quality invariants (the short list)

1. Every answer computed, never transcribed; independent re-derivation says 0 diffs.
2. Nothing visible before "Check"/"Show why" states or implies the answer.
3. Registry skills ≡ intro-pack storyboard titles ≡ `INTRO_SCENES` titles ≡
   `CLASSIC_SKILLS` values — one vocabulary everywhere.
4. `registry.json` is the single source of truth; `registry.js` is generated.
5. All three `card_visuals.js` maps updated; quest node numbered.
6. QA green except the 3 documented baseline failures.
7. `main` = production. PR first; owner approves every merge.
