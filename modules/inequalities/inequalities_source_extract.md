# Source extract: Inequalities

**Book section:** Year 6 "M" workbook, **Lesson 25 — Inequalities**
**Printed pages:** 90–103 **(PDF pages 100–113 of `Y6-M-L19-28(1).pdf`; PDF index = printed page + 10)**
**Source PDF:** the Lessons 19–28 workbook copied into the repo at `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf` (the same bound PDF covers Lessons 19–28).
**Bounded by:** the **Stage Test (L21–L24)** and Lesson 24 before, and Lesson 26 "Circles and Circle Sectors (2)" after (PDF p.114), confirming this lesson ends at printed p.103.

## Core ideas taught

The lesson's three stated objectives (title page, printed p.90): **recognise inequality symbols**; **learn the properties of inequalities and use them to solve inequalities**; **use inequalities to solve word problems**.

1. **Symbols.** `<` (less than) and `>` (greater than) are strict; `≤` and `≥` also allow the two sides to be equal — so `75 ≤ 75` is true.
2. **Properties.** Adding or subtracting the same value, or multiplying/dividing by a **positive** number, keeps the direction: if `a > b` then `a + 3 > b + 3`; if `a < b` then `3a < 3b`. (Every worked example uses positive coefficients, so the direction never flips.)
3. **Solving for an integer.** Solve like an equation, then choose the smallest/largest integer. A strict `>`/`<` **excludes** the boundary (Pip's trap: `x > 6` ⇒ smallest is **7**, not 6); `≥`/`≤` **includes** it.
4. **Word problems.** Translate "at least / no fewer than / more than" into an inequality, solve, and round to a whole number of items.

There is **no printed answer key** (one "Pip's answer" spot-the-error task aside); all bank answers below are computed in code (`minInt`, `maxInt`, `countPositiveLess`) and were cross-checked by an independent verifier.

## Named classics → question bank

| classic id | registry skill | what it drills | representative source items |
|---|---|---|---|
| `recognise-symbols` | Recognise inequality symbols | pick the one true comparison among <, >, ≤, ≥ | Learn & Discover 1 (75 ≤ 75 true; 27 > 72, 25 ≤ 1, 23 ≥ 32 false) |
| `inequality-properties` | Inequality properties | fill < or > after the same operation on both sides | Learn & Discover 2 (a + 3 vs b + 3), Learn & Discover 3 (3a vs 3b; a vs 5b) |
| `solve-smallest` | Smallest integer solution | solve, then smallest integer (strict > excludes edge) | Exploration 1 (7a − 12 > 51 → 10); 12c − 79 ≥ 8c − 43 → 9; Exploration 2 (4(x+10) > 100 → 16); Reasoning (Pip 6x − 37 > x − 7 → 7) |
| `solve-largest` | Largest integer solution | solve, then largest integer (strict < excludes edge) | Exploration 1 (14b + 6 < 4b + 150 → 14); 6x ≤ 48 → 8; Practice (3(m+2) − 8 < 20 → 7); Teaching Time (3y + 11 ≤ 56 → 15) |
| `word-minimum` | Inequality word problems | translate "at least / more than", solve, round up | Exploration 3 (Zoey's lollipops → 22 packs); Exploration 4 (farmers' profit → 5); Practice (purifiers → 5 / factory → 7); Further (stamps, days) |
| `count-solutions` | Count integer solutions | count positive integers in the solution range | Further Basic 2 (15x − 64 < 9x + 8 → 11 positive integers); Extensive exercises |

All bank data is integer-clean and verified by re-solving each inequality independently. Boundary handling (strict vs non-strict) is encoded per case as a `strict` flag, so `> / <` exclude the edge and `≥ / ≤` include it.

## Lesson navigation in the source

- Let's Get Ready (printed p.91): solve linear equations (revision of Lesson before).
- In Class: Learn & Discover (symbols + properties), Exploration 1 (solve for smallest/largest integer), Reasoning ("Is Pip correct?" boundary trap), Exploration 2, Exploration 3 (Zoey, word problem), Exploration 4 (farmers' profit), Practice (water purifiers), Challenge (80 ≤ 2x² + 12 ≤ 360, raft to Hawaii).
- After Class: Teaching Time (3y + 11 ≤ 56), Homework 1–5.
- Further Exercises: Basic 1–3, Further 4–10 (waiting times, shopping/earning days, factory machines, workbooks), Extensive (Optional) 1–3 (compound and quadratic-range inequalities).
