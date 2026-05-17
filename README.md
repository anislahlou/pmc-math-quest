# PMC Math Quest Organized Export

Open this file to launch the app:

`run/pmc_simulation_app.html`

The `run` folder intentionally contains only the main HTML app. All supporting missions, agent protocols, source assets, and quality checks are stored in separate folders so the project can be moved to another computer cleanly.

## Folder Map

- `run` - the single launch file for the student app.
- `dashboard` - the agent orchestration dashboard.
- `agents` - the teaching, diagram, visual, question-bank, challenge-question, and learning-experience protocols.
- `modules` - one folder per learning mission.
- `qa` - quality notes and test runners.
- `source` - source page images and visual QA screenshots.

## Current Missions

- Pascal Triangle
- Consecutive Number Triangles
- Angles
- U2T2 Units
- Volume of Prisms
- Volume Problem Extension
- Relationship Between Sides in Triangles

## Quality Check

If Node.js is available on the computer, run:

```bash
node qa/run_all_quality_checks.js
```

The app itself is static HTML, CSS, and JavaScript, so it can be opened on Windows or Mac from the `run` folder.
