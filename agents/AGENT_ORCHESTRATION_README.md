# Agent Orchestration Protocol

This is the repeatable build process for every new mission or enrichment pass.

## 1. Source Miner

Extract the topic scope from the lesson notes and review papers. Capture definitions, worked examples, diagram types, common exam wording, units, and likely misconceptions.

Output:
- Source extract or classics file inside the module folder.
- Source images or screenshots when diagrams matter.

## 2. Intro Pedagogy Agent

Turn the source into a child-ready launch path. The introduction should explain why the idea matters, show the first mental model, and prepare the student for practice without giving away every answer.

Output:
- Intro video pack.
- Warm-up sequence or onboarding screen.
- Skill gates for the module.

## 3. Source Diagram Fidelity Agent

Check all diagrams against the source and the math. This agent prevents mismatched shapes, incorrect dimensions, swapped height-width-length labels, or labels that float away from the intended feature.

Output:
- Corrected diagrams.
- Diagram-specific QA notes when needed.

## 4. Visual Explainer Graphics Agent

Make the explanation interactive and useful. Animatic blocks should be clickable when the module promises interaction, labels should be legible, and visual states should support the concept rather than decorate it.

Output:
- Interactive explainer components.
- Consistent labels and feedback states.

## 5. Volume Spatial Visual Agent

Approve cube-count visuals only when the child can see the unit cubes or cube cells being counted. Tunnel overlap must show the shared centre cube, and side-tunnel problems must separate width, height, and length visually.

Output:
- Cube-grid or layer-grid tunnel diagrams.
- Dimension-label checks for width, height, and length.
- Blockers for decorative tunnel cutouts that do not explain the count.

## 6. Question Bank Quality Agent

Build varied practice from the source without copying the same numbers by memory. Mix multiple choice and typed responses, verify every answer, and include a similar-question retake path for mistakes.

Output:
- Question bank generator.
- Bank audit script.
- Distractor and answer checks.

## 7. Challenge Question Agent

When a submodule is too easy, turn the hardest source classics into challenge variations. Use JMC/PMC-style design: multi-step reasoning, reverse questions, missing values, constraints, and plausible traps. Do not copy external paper questions verbatim; use them only to learn the shape of strong challenge problems.

Output:
- At least 10 Challenge questions per submodule.
- Explicit `Challenge:` labels and source notes.
- Mixed multiple-choice and filled-answer formats.
- Challenge audit coverage.

## 8. Learning Experience Quality Gate

Review the full student journey: navigation, live score, unanswered questions, end feedback, retry behavior, and whether the child can recover from mistakes without feeling stuck.

Output:
- Module test script.
- Final polish issues before release.

## 9. Release Gate

A mission is trusted only after source coverage, visuals, bank checks, module tests, and math display checks pass.
If the lesson promises intro narration, the release also needs a real audio asset check and a browser or manual playback sign-off.

Output:
- Updated dashboard registry.
- Updated main app links.
- Passing full QA run.
