# Source extract: Calculating with Formulas

**Book section:** Year 6 "M" workbook, **Lesson 23 — Calculating with Formulas**
**Printed pages:** 59–73 **(PDF pages 69–83 of `Y6-M-L19-28(1).pdf`; PDF index = printed page + 10)**
**Source PDF:** the Lessons 19–28 workbook copied into the repo at `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf` (the same bound PDF covers Lessons 19–28).
**Bounded by:** Lesson 22 "Train Problems" before, Lesson 24 "Prime Factorisation (2)" after (printed p.74 / PDF p.84), confirming this lesson ends at printed p.73.

## Core idea taught

The lesson's two objectives (printed p.59): **learn the difference of squares formula**, and **use it for quick calculations**.

The geometric derivation (Learn & Discover, printed p.61): the shaded region left when a square of side `b` is removed from a square of side `a` has area `a² − b²`. Cut and rearrange it into a rectangle of length `a + b` and width `a − b`, giving

> **a² − b² = (a + b)(a − b)**

The rest of the lesson applies this single formula to subtractions, products, and long alternating chains. There is **no printed answer key** (one "Pip's answer" spot-the-error reasoning task aside); all bank answers below are computed and integer-clean.

## Named classics → question bank

| classic id | registry skill | what it drills | representative source items |
|---|---|---|---|
| `diff-two-squares` | Difference of two squares | factor a² − b² = (a + b)(a − b) and multiply | Exploration 1 (50² − 49²); Homework (40² − 39², 27² − 3²); Further Ex. (35² − 34²) |
| `squares-in-disguise` | Squares in disguise | rewrite n × n or a plain number as a square first | Exploration 1 (17 × 17 − 49); Exploration 2 (98² − 4, 99² − 1); Further Ex. (67 × 67 − 33 × 33, 31 × 31 − 11 × 11) |
| `products-near-round` | Products near a round number | (n − d)(n + d) = n² − d² | Learn & Discover (19 × 21 = 20² − 1²); Exploration 4 (499 × 501); Homework/Further (59 × 61, 198 × 202, 303 × 297) |
| `consecutive-square-chain` | Consecutive square chain | alternating chain of consecutive squares → 1 + 2 + … + n | Exploration 2 (100² − 99² + … − 1² = 5050); Practice (20² − … − 1²); Homework (30² − … − 1²) |
| `spaced-square-pairs` | Spaced square pairs | pairs whose bases differ by 2, 3 or 4; factor each pair | Exploration 3 (80² − 78² + … + 4² − 2² = 3280); Practice (56² − 52² + … + 8² − 4² = 1680); Homework (60² − 57² + … + 6² − 3²) |
| `spot-the-neighbours` | Spot the neighbours | n × n − (n − 1)(n + 1) = 1, and similar near-square products | Reasoning (2015 × 2015 − 2016 × 2014 = 1); Challenge (31415927² − 31415926 × 31415928 = 1); Homework (50 × 50 − 49 × 51, 123 × 117 − 125 × 115) |

All bank data uses integer-clean variants verified by direct computation in the module (the chain classics evaluate the full sum in code rather than relying on a closed form). The two very large values in `spot-the-neighbours` (the 31415927 case) stay well within JavaScript's safe-integer range, so the difference is exact.

## Lesson navigation in the source

- Let's Get Ready (printed p.60): arithmetic-progression warm-ups (1 + 2 + … + 19; 4 + 8 + … + 36).
- In Class: Learn & Discover (geometric derivation of a² − b²), Explorations 1–4, Practice, Challenge, Reasoning ("Is Pip correct?" — 2015 × 2015 − 2016 × 2014).
- After Class: Teaching Time (40² − 39², 87 × 93), Homework 1–5.
- Further Exercises: Basic 1–3, Further 4–10, Extensive (Optional) 1–3.
