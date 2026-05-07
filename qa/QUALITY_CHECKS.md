# Quality Checks

Run this before trusting or packaging the app:

```powershell
& 'C:\Users\AnisLahlou\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' run_all_quality_checks.js
```

## What It Checks

- `u2t2_bank_quality_audit.js`
  - Generates 16 variants for each of the 14 U2T2 submodules.
  - Independently solves each visible question from the prompt.
  - Compares the independent answer with the app answer.
  - Rejects ambiguous prompts, such as a number-type question that does not name square/cube/prime/etc.
  - Verifies choice questions have exactly one correct choice.
  - Verifies each U2T2 submodule mixes multiple-choice and filled-answer formats.
  - Verifies correct multiple-choice answers move position instead of always sitting in the same slot.
  - Requires at least four source-shaped prompt variants for every named classic in the checked U2T2 bank slice, so children cannot rely on memorising the same numbers.

- `u2t2_module_tests.js`
  - Checks the U2T2 app wiring, answer checker, generated hints, worked solutions, visuals, map links, and same-skill repair control.

- `volume_prisms_bank_quality_audit.js`
  - Generates 24 variants for each of the 10 Lesson 15 Volume of Prisms classics.
  - Recomputes every answer from the underlying formula data.
  - Verifies mixed answer formats, varied correct choice positions, source page tracking, anchored visual labels, and fresh-number variation.
  - Rejects direct reuse of the main source number strings so the child cannot answer by memorising the book examples.

- `volume_prisms_module_tests.js`
  - Checks the Volume of Prisms intro, exercise bank, answer checker, repair-question flow, diagrams, and app wiring.

- `math_display_quality_check.js`
  - Checks that displayed powers are formatted as superscripts, such as `5¹`, `x²`, `cm³`, and `2⁽ʳᵒʷ⁻¹⁾`.
  - Checks that Pascal still accepts typed power answers using superscript notation.

- `angles_module_tests.js`
  - Runs the existing Angles module checks.

- `consecutive_triangles_module_tests.js`
  - Runs the existing Consecutive Number Triangles checks.

## Why This Exists

The first U2T2 test only checked that the app accepted its own generated answer. That missed a place-value data error because the wrong answer and checker agreed with each other. The independent audit fixes that weakness by recomputing the answer from the question text.
