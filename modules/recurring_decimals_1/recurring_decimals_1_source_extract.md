# Source extract: Recurring Decimals (1)

**Book section:** Year 6 "M" workbook, **Lesson 27 — Recurring Decimals (1)**
**Printed pages:** 119–133 **(PDF pages 129–143 of `Y6-M-L19-28(1).pdf`; PDF index = printed page + 10)**
**Source PDF:** the Lessons 19–28 workbook in the repo at `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf` (one bound PDF covers Lessons 19–28); also linked from the missions landing page.
**Bounded by:** Lesson 26 "Circles and Circle Sectors (2)" before (its Extensive Exercises end at PDF p.128), and Lesson 28 after. Note: Lesson 26's own "Let's Look Ahead" box says "Cylinders", but the workbook's actual next lesson is this one.

## Core ideas taught

The lesson's three stated objectives (title page, printed p.119): **compare and order recurring decimals**; **identify the type of recurring decimal that a fraction can be converted into**; **learn the periodicity of recurring decimals**.

1. **Dot notation.** The repeating block gets a dot over its first and last digit (a single repeating digit gets one dot): 8.271271… = 8.2̇71̇, 5.41666… = 5.416̇.
2. **Compare / order by expanding.** Expand each value (percentages too) until digits differ; the dots move the block, so compact forms are never compared directly.
3. **Terminating vs recurring.** Simplify the fraction; factorise the denominator: only 2s and 5s → terminating; any other prime → recurring (L&D fraction groups + Exploration 2 table).
4. **Periodicity.** nth digit = block[(n − 1 − #one-off digits) mod period]; digit sums = whole blocks × block sum + leftovers; the 1/7 family (0.1̇42857̇ … 0.8̇57142̇) as the marquee example.

There is **no printed answer key**; all bank answers are computed on digit strings (no floating point) and cross-checked by an independent verifier.

## Named classics → question bank

| classic id | registry skill | what it drills | representative source items |
|---|---|---|---|
| `dots-notation` | Dots notation | compact ↔ expanded conversions | L&D 2a (8.271271… → 8.2̇71̇; 5.41666… → 5.416̇); L&D 2b (expand 1.3̇52̇, 2.94̇87̇*); Further Basic 2 (0.76̇56̇ expansion, choice D) |
| `compare-two` | Compare recurring decimals | which of two is smaller/larger | L&D (0.42̇5̇ vs 0.4̇25̇ → A smaller); Homework 1 (3.2̇41̇ family); Further Basic 3 (1.9̇3̇ family, largest) |
| `middle-order` | Middle of the order | 5-value ascending order, middle value | Let's Get Ready 1 (0.289…0.31 → 0.295); Homework 2 (72% family → 0.7̇2̇); Teaching Time (36% family) + Further 4 (8.9̇72̇ family) |
| `terminating-recurring` | Terminating or recurring | exactly-one-recurring fraction sets | L&D groups (1/4, 3/11, 21/40, 13/100); Exploration 2 table (20/24, 11/50, 18/21, 9/30, 3/130, 51/75); Practice + Further 7 (19/48) |
| `nth-digit` | Nth digit hunt | (n − 1) mod period, incl. mixed forms | Exploration 3 (0.3̇278̇: 25th → 3, 40th → 8); Exploration 4.1 (2/7 100th digit → 7); Homework 4 (0.7̇45̇ 72nd, 88th) |
| `digit-sum` | Digit sum runs | whole blocks + leftovers; two-digit sums | Exploration 3 (first 100 of 0.3̇278̇ → 500); Exploration 4.2 (first 100 of 6/7 → 453); Homework 5 (first 42 of 0.2̇867̇ → 240); Practice (0.5̇94̇ 60th + 100th → 9) |

\* The workbook prints 2.948̇7̇ (dots on 8 and 7, one-off "94"); the bank encodes it as `rec(2, "94", "87")` = 2.94878787…

All values are exact: recurring decimals are `{int, pre, block}` digit-string records; comparison is lexicographic on expansions, and the 1/7-family blocks (142857 rotations) are hard-coded from the lesson's clockwise memory wheel.

## Lesson navigation in the source

- Let's Get Ready (printed p.120): order five decimals; prime factorise 24 and 75; repeating-sequence sum (5, 6, 4, 5 pattern).
- In Class: L&D (fraction → decimal by division: 1/4, 1/3, 1/6, 3/11), L&D 2 (dot notation both directions), L&D (compare 0.42̇5̇ vs 0.4̇25̇), Exploration 1 (arrange 53%, 0.52̇, 0.5̇23̇, 0.523̇), Practice (7.2̇84̇ family), L&D (terminating vs recurring fraction groups), Exploration 2 (prime-factorisation table), Practice (circle the recurring fractions), Exploration 3 (0.3̇278̇ 25th/40th digit + first-100 sum), Practice (0.5̇94̇ 60th + 100th), Exploration 4 (1/7 family wheel; 2/7 100th digit; 6/7 first-100 sum), Challenge (consecutive-digit sums 271 and 277 in a/7).
- After Class: Teaching Time (36% family ordering), Homework 1–5.
- Further Exercises: Basic 1–3 (fractions to decimals, 0.76̇56̇ expansion, 1.9̇3̇ largest), Further 4–7 (8.9̇72̇ smallest, factorisation table, terminating/recurring identification, recurring fraction choice).
