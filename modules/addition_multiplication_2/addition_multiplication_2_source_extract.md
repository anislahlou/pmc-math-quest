# Source Extract: Principle of Addition and Multiplication (2)

## Citation

PDF p43-55 / Book p33-45, Lesson 21 (Principle of Addition and Multiplication, part 2). Page images: `source/source_page_images/addition_multiplication_2/lesson_21_p*.png`.

## Lesson Cover (Book p33 / PDF p43)

Lesson 21 — "Principle of Addition and Multiplication (2)". The lesson's three stated objectives:

1. Solve forming-number problems that include the digit 0 (which cannot be a leading digit).
2. Solve forming-number problems that require the result to be odd or even.
3. Apply the "Bundling Method" to count arrangements where some items must stand adjacent.

This is the second pass on the multiplication principle. The first pass (Lesson 19/20) covered position-by-position counting with no zero in the digit set. Lesson 21 introduces the three twists — leading-zero, parity, and bundling — that make most exam-style problems hard.

## Source Problem A — Two-Digit Forming with Zero (in-class, Book p34 / PDF p44)

> Using the digits {0, 1, 2, 3}, how many two-digit numbers can be made if digits can be repeated?

Canonical reasoning. Leading digit has 3 choices (any of {1, 2, 3} — zero excluded). Trailing digit has 4 choices (any of {0, 1, 2, 3}). Answer: **3 × 4 = 12**.

## Source Problem B — Two-Digit No-Repeat with Zero (in-class, Book p35 / PDF p45)

> Using the digits {0, 1, 2, 3}, how many two-digit numbers can be made if no digit is repeated?

Canonical reasoning. Leading digit: 3 choices. After placing it, the trailing digit can be any of the remaining 3 digits (including zero, because zero never sat in the leading box). Answer: **3 × 3 = 9**.

## Source Problem C — Pip's Wrong Answer (reasoning section, Book p38 / PDF p48)

> Pip is asked: how many 3-digit odd numbers can be made from the digits {0, 1, 2, 3, 4, 5} if no digit is repeated?
>
> Pip writes: "Leading digit has 5 choices (any non-zero). Middle digit has 5 choices (any remaining). Last digit has 3 choices (must be odd: 1, 3, 5). So 5 × 5 × 3 = 75."
>
> Pip is wrong. What is the correct answer?

Canonical reasoning. Parity is a rule about the LAST digit, so we must fix it FIRST.

- Last digit: must be odd. The odd digits in {0..5} are {1, 3, 5}, so **3 choices**.
- Leading digit: cannot be 0 AND cannot equal the digit already placed in the last box. After fixing the last digit (an odd non-zero), the leading box has 6 − 2 = **4 choices**.
- Middle digit: any of the remaining 6 − 2 = **4 choices** (no repeats).

Answer: **3 × 4 × 4 = 48** (not 75).

Pip's mistake — counting the leading digit before applying the parity constraint to the last digit — is the canonical misconception the lesson wants the learner to avoid. The intro scene "Odd/Even Via Last Digit" makes this scene explicit, contrasting 75 (wrong) with 48 (right).

## Source Problem D — APPLE Bundling (Book p41 / PDF p51)

> How many ways can the letters of the word APPLE be arranged in a row if the two Ps must stand next to each other?

Canonical reasoning. Glue the two Ps into one bundle. We now have four units to arrange: {APP-bundle, A, L, E}. Number of arrangements: 4! = 24. We do NOT multiply by 2 because the two Ps are identical letters. Answer: **24**.

If the bundled pair were distinct (e.g. two different students Pip and Bud), the answer would be 4! × 2 = 48.

## Source Problem E — Multi-Bundle Challenge (Book p43 / PDF p53)

> Eight students stand in a row. Students A, B, C must stand together (in any internal order), and students D, E must also stand together (in any internal order). How many arrangements are possible?

Canonical reasoning. Glue ABC into one bundle and DE into another. The row now has 5 effective units: the ABC-bundle, the DE-bundle, F, G, H. Number of arrangements of 5 units: 5! = 120. Multiply by 3! = 6 for the internal order of the ABC bundle, and by 2! = 2 for the internal order of the DE bundle. Answer: **5! × 3! × 2! = 120 × 6 × 2 = 1440**.

## Teacher's Notes — General Formulas

**Forming numbers (no constraints).** From a digit set of size s, the number of n-digit numbers with repeats is s^n. Without repeats, it is s × (s−1) × ... × (s−n+1).

**Leading-zero rule.** If 0 is in the digit set, subtract one from the leading position's choice count. With repeats: (s−1) × s^(n−1). Without repeats: (s−1) × (s−1) × (s−2) × ... × (s−n+1).

**Odd/even rule.** Fix the LAST position first. Let L be the number of valid last digits (odd or even, as required). If 0 is in the set and the rule is "even", case-split on whether the last digit is 0 (case A) or a non-zero even (case B).

**Bundling method.** Items in a line with k disjoint adjacency bundles of sizes b_1, ..., b_k. Effective unit count: n − (b_1 + ... + b_k) + k. Total arrangements: (effective)! × b_1! × b_2! × ... × b_k! (the bundle's internal factorial is omitted for bundles of identical items).

## Pedagogical Lineage

These source problems sit at the top of a ladder of warm-up skills the lesson develops. The module breaks the ladder into seven classics:

1. `digits-with-repeats` — position-by-position counting with no zero in the digit set (warmup, no leading-zero rule needed).
2. `zero-leading-constraint` — the source canonical with-repeats problem (3 × 4 = 12).
3. `no-repeat-distinct-digits` — the source canonical no-repeats problem (3 × 3 = 9), generalised to larger sets.
4. `odd-by-last-digit-repeats` — odd/even via the last digit, with repeats allowed and no zero in the set. Introduces "fix the last digit first".
5. `odd-or-even-no-repeats` — Pip's mistake canonical (3 × 4 × 4 = 48). Zero in the set, no repeats, parity constraint.
6. `bundling-adjacent` — single-bundle arrangement, including the APPLE letters case.
7. `bundling-multi-restriction` — two-bundle challenge with the 8-student canonical answer of 1440.

Each classic generates 4 variants by varying the numeric constants while preserving the source's underlying structure. The canonical variant 0 of each classic reproduces the source numbers where available.

## Source Image Index

- `lesson_21_p33_pdf043.png` — Lesson cover and objectives.
- `lesson_21_p34_pdf044.png` to `lesson_21_p37_pdf047.png` — Forming-number examples with the leading-zero and no-repeat rules.
- `lesson_21_p38_pdf048.png` to `lesson_21_p40_pdf050.png` — Reasoning section: Pip's wrong answer on odd-number formation.
- `lesson_21_p41_pdf051.png` to `lesson_21_p42_pdf052.png` — Bundling method (APPLE example).
- `lesson_21_p43_pdf053.png` to `lesson_21_p45_pdf055.png` — Multi-bundle challenge and end-of-lesson practice.
