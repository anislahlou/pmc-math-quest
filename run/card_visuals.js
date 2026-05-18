/*
 * run/card_visuals.js
 *
 * Per-module visual snippets used by run/pmc_simulation_app.html.
 *
 * - `cardVisuals` is keyed by the registry's `cardVariant` and contains
 *   the inner HTML of the `<div class="card-visual" aria-hidden="true">`
 *   block — either an inline SVG or a small DOM mosaic (pascal-stack,
 *   unit-map, number-triangle, angle-stage).
 *
 * - `questNodeVisuals` is keyed by the registry `id` and contains the
 *   inner HTML of the quest-map node (the numbered badge plus the
 *   strong/small labels). Today these are plain HTML; SVG glyphs can be
 *   dropped in here later without touching the render code.
 *
 * Contents are byte-identical to what was previously hand-coded into the
 * HTML. Do not redraw or simplify any path — copy verbatim.
 *
 * Loaded as a plain <script src> tag (NOT type="module") so the run app
 * works when opened from file://. Exposes the three maps on
 * window.PMC_CARD_VISUALS at the bottom of the file.
 */

const cardVisuals = {
  u2t2: `<div class="unit-map">
              <span>Number</span>
              <span>Algebra</span>
              <span>Geometry</span>
              <span>Ratio + Data</span>
              <span>Exam Arena</span>
            </div>`,
  pascal: `<div class="pascal-stack">
              <div class="pascal-row"><span>1</span></div>
              <div class="pascal-row"><span>1</span><span>1</span></div>
              <div class="pascal-row"><span>1</span><span>2</span><span>1</span></div>
              <div class="pascal-row"><span>1</span><span>3</span><span>3</span><span>1</span></div>
            </div>`,
  volume: `<svg class="volume-stage" viewBox="0 0 300 190" role="img" aria-label="Volume prism preview">
              <rect width="300" height="190" rx="8" fill="#ffffff"></rect>
              <polygon points="65,48 168,48 212,75 110,75" fill="#e5f7f9" stroke="#0d263f" stroke-width="3"></polygon>
              <rect x="65" y="75" width="103" height="82" fill="#fff8dc" stroke="#0d263f" stroke-width="3"></rect>
              <polygon points="168,75 212,48 212,130 168,157" fill="#cdeff4" stroke="#0d263f" stroke-width="3"></polygon>
              <polygon points="105,55 130,55 140,61 116,61" fill="#607983" stroke="#0d263f" stroke-width="2"></polygon>
              <rect x="190" y="96" width="70" height="60" fill="#ffffff" stroke="#0d263f" stroke-width="3"></rect>
              <rect x="193" y="125" width="64" height="28" fill="#95dcf2" opacity="0.8"></rect>
              <circle cx="225" cy="137" r="11" fill="#607983"></circle>
              <text x="117" y="174" text-anchor="middle">area x height</text>
              <text x="226" y="174" text-anchor="middle">water rise</text>
            </svg>`,
  "volume-extension": `<svg class="volume-stage" viewBox="0 0 300 190" role="img" aria-label="Volume extension preview">
              <rect width="300" height="190" rx="8" fill="#ffffff"></rect>
              <g stroke="#0d263f" stroke-width="2">
                <rect x="44" y="36" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="78" y="36" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="112" y="36" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="44" y="70" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="78" y="70" width="34" height="34" fill="#ffffff"></rect>
                <rect x="112" y="70" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="44" y="104" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="78" y="104" width="34" height="34" fill="#d8e6ea"></rect>
                <rect x="112" y="104" width="34" height="34" fill="#d8e6ea"></rect>
              </g>
              <text x="95" y="164" text-anchor="middle">layer count</text>
              <g transform="translate(184 42)" stroke="#0d263f" stroke-width="2">
                <rect x="0" y="78" width="28" height="28" fill="#fff8dc"></rect>
                <rect x="28" y="50" width="28" height="56" fill="#fff8dc"></rect>
                <rect x="56" y="22" width="28" height="84" fill="#fff8dc"></rect>
              </g>
              <text x="226" y="164" text-anchor="middle">height map</text>
            </svg>`,
  triangles: `<div class="number-triangle">
              <div class="pascal-row"><span>1</span></div>
              <div class="pascal-row"><span>2</span><span>3</span></div>
              <div class="pascal-row"><span>4</span><span>5</span><span>6</span></div>
              <div class="pascal-row wide"><span>7</span><span>8</span><span>9</span><span>10</span></div>
            </div>`,
  angles: `<div class="angle-stage">
              <span class="angle-line one"></span>
              <span class="angle-line two"></span>
              <span class="angle-arc"></span>
              <span class="angle-badge">x = ?</span>
            </div>`,
  "triangle-sides": `<svg class="volume-stage" viewBox="0 0 300 190" role="img" aria-label="Triangle sides preview">
              <rect width="300" height="190" rx="8" fill="#ffffff"></rect>
              <polygon points="54,148 156,148 112,58" fill="#e8f6ff" stroke="#0d263f" stroke-width="4"></polygon>
              <path d="M112 58 L112 148" stroke="#0d263f" stroke-width="3" stroke-dasharray="6 5"></path>
              <path d="M112 148 L156 148" stroke="#f36f45" stroke-width="5"></path>
              <path d="M112 58 L156 148" stroke="#1790a6" stroke-width="5"></path>
              <text x="83" y="108" text-anchor="middle">13</text>
              <text x="132" y="168" text-anchor="middle">5</text>
              <text x="154" y="102" text-anchor="middle">?</text>
              <text x="221" y="74" text-anchor="middle">a² + b²</text>
              <text x="221" y="103" text-anchor="middle">= c²</text>
              <path d="M206 122 L246 122 L246 150" fill="none" stroke="#0d263f" stroke-width="5" stroke-linecap="round"></path>
              <circle cx="246" cy="150" r="8" fill="#f36f45"></circle>
            </svg>`,
  "equal-height": `<svg class="volume-stage" viewBox="0 0 300 190" role="img" aria-label="Equal-height triangles preview">
              <rect width="300" height="190" rx="8" fill="#ffffff"></rect>
              <line x1="36" y1="42" x2="264" y2="42" stroke="#9fb9c4" stroke-width="3"></line>
              <line x1="36" y1="146" x2="264" y2="146" stroke="#9fb9c4" stroke-width="3"></line>
              <polygon points="48,146 116,146 78,42" fill="#e8f6ff" stroke="#0d263f" stroke-width="4"></polygon>
              <polygon points="150,146 252,146 196,42" fill="#fff1eb" stroke="#0d263f" stroke-width="4"></polygon>
              <text x="82" y="168" text-anchor="middle">base 2</text>
              <text x="202" y="168" text-anchor="middle">base 3</text>
              <text x="154" y="92" text-anchor="middle">same height</text>
            </svg>`
};

/*
 * Per-card metadata that isn't in the registry but was hand-coded in the
 * HTML — skill-list aria-label and the action-button HTML. Keyed by
 * registry module id. Kept here so the render code stays generic.
 */
const cardMeta = {
  pascal: {
    skillsAriaLabel: "Pascal skills",
    actionsHtml: `<a class="button" href="../modules/pascal/pascal_triangle_practice_share.html">Launch Pascal</a>`
  },
  consecutive_number_triangles: {
    skillsAriaLabel: "Consecutive triangle skills",
    actionsHtml: `<a class="button" href="../modules/consecutive_number_triangles/consecutive_triangles_practice_share.html">Launch Chapter 2</a>
            <a class="button secondary" href="../modules/consecutive_number_triangles/consecutive_triangles_module.html">Source version</a>`
  },
  angles: {
    skillsAriaLabel: "Angle skills",
    actionsHtml: `<a class="button" href="../modules/angles/angles_practice_share.html">Launch Angles</a>
            <a class="button secondary" href="../modules/angles/angles_module.html">Source version</a>`
  },
  u2t2_units: {
    skillsAriaLabel: "U2T2 skills",
    actionsHtml: `<a class="button coral" href="../modules/u2t2_units/u2t2_units_mission.html">Open U2T2 Units</a>`
  },
  volume_prisms: {
    skillsAriaLabel: "Volume skills",
    actionsHtml: `<a class="button" href="../modules/volume_prisms/volume_prisms_module.html">Launch Volume</a>`
  },
  volume_problem_extension: {
    skillsAriaLabel: "Volume extension skills",
    actionsHtml: `<a class="button" href="../modules/volume_problem_extension/volume_extension_module.html">Launch Extension</a>`
  },
  triangle_sides: {
    skillsAriaLabel: "Triangle sides skills",
    actionsHtml: `<a class="button" href="../modules/triangle_sides/triangle_sides_module.html">Launch Triangle Sides</a>
            <a class="button secondary" href="../modules/triangle_sides/triangle_sides_source_extract.md">Source extract</a>`
  },
  equal_height_triangles: {
    skillsAriaLabel: "Equal height triangle skills",
    actionsHtml: `<a class="button" href="../modules/equal_height_triangles/equal_height_triangles_module.html">Launch Equal Height</a>
            <a class="button secondary" href="../modules/equal_height_triangles/equal_height_triangles_source_extract.md">Source extract</a>`
  }
};

/*
 * Quest-map node inner HTML, keyed by module id. Today these are pure
 * HTML (no glyphs/SVGs). Adding a custom glyph for a module later means
 * editing only this map.
 */
const questNodeVisuals = {
  pascal: `<span class="node-number">1</span>
              <strong>Pascal Triangle</strong>
              <small>Pattern lab</small>`,
  consecutive_number_triangles: `<span class="node-number">2</span>
              <strong>Number Triangles</strong>
              <small>Clue chase</small>`,
  angles: `<span class="node-number">3</span>
              <strong>Angles</strong>
              <small>Boss puzzle</small>`,
  u2t2_units: `<span class="node-number">4</span>
              <strong>U2T2 Units</strong>
              <small>Year quest</small>`,
  volume_prisms: `<span class="node-number">5</span>
              <strong>Volume of Prisms</strong>
              <small>Stack lab</small>`,
  volume_problem_extension: `<span class="node-number">6</span>
              <strong>Volume Extension</strong>
              <small>Cube lab</small>`,
  triangle_sides: `<span class="node-number">7</span>
              <strong>Triangle Sides</strong>
              <small>Pythagoras lab</small>`,
  equal_height_triangles: `<span class="node-number">8</span>
              <strong>Equal Height</strong>
              <small>Area ratio lab</small>`
};

/*
 * Browser global mirror.
 *
 * The run app HTML is opened directly from disk (file://) by double-click,
 * where Chrome/Edge block fetch() of local files AND, in some configurations,
 * also block ES module imports. To keep the page working from file://, we
 * additionally expose the same three maps on `window.PMC_CARD_VISUALS` so the
 * run app can read them via a regular <script src> tag without using
 * <script type="module">. The `export const` statements above are kept for
 * any future ES-module consumers.
 */
if (typeof window !== "undefined") {
  window.PMC_CARD_VISUALS = { cardVisuals, cardMeta, questNodeVisuals };
}
