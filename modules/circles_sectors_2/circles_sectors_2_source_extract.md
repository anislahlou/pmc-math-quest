# Source extract: Circles and Circle Sectors (2)

**Book section:** Year 6 "M" workbook, **Lesson 26 — Circles and Circle Sectors (2)**
**Printed pages:** 104–116 **(PDF pages 114–126 of `Y6-M-L19-28(1).pdf`; PDF index = printed page + 10)**
**Source PDF:** the Lessons 19–28 workbook in the repo at `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf` (one bound PDF covers Lessons 19–28); also linked from the missions landing page.
**Bounded by:** Lesson 25 "Inequalities" before, and Lesson 27 "Cylinders" after, confirming this lesson ends at printed p.116.

## Core ideas taught

The lesson's two stated objectives (title page, printed p.104): **split and combine figures to make the area easier to calculate**, and **find areas by taking away blank area from the whole**. Every problem fixes its own value of π (3.14, 22/7, 3) or asks for the answer **in terms of π** — the module carries the π value per case and computes with it.

1. **Whole minus blank.** Shaded = whole shape − unshaded shapes: square minus inscribed circle, square minus quarter circle, quarter circle minus triangle.
2. **Split and combine.** Join circle centres to make a small square; slice compound figures into quarters/semicircles that reassemble.
3. **Double coverage.** Overlapping shapes (petals from four semicircles, the lens from two quarter circles) are covered exactly twice, so overlap = sum of shapes − whole region.

There is **no printed answer key** (one "Pip's answer" spot-the-error task aside); all bank answers are computed in code and cross-checked by an independent verifier.

## Named classics → question bank

| classic id | registry skill | what it drills | representative source items |
|---|---|---|---|
| `circle-in-square` | Circle in a square | corners = (2r)² − πr² | Exploration 2.1/2.2 (square 400 → r 10; square 196, π = 22/7); Further Basic 2 (r = 10, π = 3.14 → 86) |
| `quarter-shade` | Quarter circle shade | s² − ¼πs², answer in terms of π | Exploration 2 Q2 (side 20 → 400 − 100π, source's own distractor style); Further Basic 3 / homework 2 (4 − π family) |
| `four-circle-gap` | Four circle gap | centre square minus one circle: (2r)² − πr² | Exploration 3 (four circles in a 1600 cm² square, π = 3.14 → 86) |
| `petal-power` | Petal power | petals = 2πr² − 4r²; corners = square − petals | Exploration 4.2 (petals, π = 22/7); Challenge (corners, π = 3); Practice (π = 3) |
| `leaf-lens` | Leaf lens | lens = 2 × ¼πs² − s² = (½π − 1)s² | Learn & Discover figure 2 (side 4 → 8π − 16); homework 1 (semicircle lens in square ABCD) |
| `flag-slice` | Flag slice | ¼πr² − ½r² | Learn & Discover figure 1 (side 4 → 4π − 8); Further 5 (r = 8, π = 3 → 16) |

Numeric cases use r or s values that keep answers exact at ≤ 2 decimal places for π = 3.14 (e.g. 86, 21.5, 228, 57), integers for π = 3 and π = 22/7 with r = 7 or s = 14. The `quarter-shade` classic is always multiple-choice with symbolic labels ("400 − 100π"), mirroring the source's own answer format and distractors.

## Lesson navigation in the source

- Let's Get Ready (printed p.105): circle area in terms of π, semicircle and sector warm-ups (π = 22/7).
- In Class: Exploration 1 (20 quarter-circle perimeter shape), Practice (50 cm square shaded halves), Exploration 2 (inscribed circle; quarter in square, choices in terms of π), Reasoning ("Is Pip correct?" diameter-vs-radius trap), Exploration 3 (four circles, central gap), Learn & Discover (flag slice and leaf lens, in terms of π), Exploration 4 (Pip's shaded circle sections, π = 22/7; petals, π = 22/7), Practice (circle + four quarter circles, π = 3), Challenge (corners around petals, π = 3).
- After Class: Teaching Time (rectangle with circle and semicircle, choices in terms of π), Homework 1–5 (semicircle lens, four-quarter star, quarter in square ABCD, semicircle + quarter circles unshaded, flag slice).
- Further Exercises: Basic 1–3 (compare shaded halves, inscribed circle r = 10, pinwheel quarters), Further and Extensive (star and petal composites).
