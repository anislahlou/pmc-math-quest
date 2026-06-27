# Source extract: Prime Factorisation (2)

**Book section:** Year 6 "M" workbook, **Lesson 24 — Prime Factorisation (2)**
**Printed pages:** 74–86 **(PDF pages 84–96 of `Y6-M-L19-28(1).pdf`; PDF index = printed page + 10)**
**Source PDF:** the Lessons 19–28 workbook copied into the repo at `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf` (the same bound PDF covers Lessons 19–28).
**Bounded by:** Lesson 23 "Calculating with Formulas" before, and the **Stage Test (L21–L24)** after (PDF p.97), confirming this lesson ends at printed p.86.

## Core ideas taught

The lesson's two stated objectives (title page, printed p.74): **group numbers so they have the same product**, and **count the number of zero(s) at the end of a product**.

1. **Trailing zeros.** A zero on the end of a number is a factor of 10, and 10 = 2 × 5. So in a product the number of trailing zeros equals the number of 10s you can build, which is `min(#factors of 2, #factors of 5)` in the prime factorisation.
2. **Factorials.** In `1 × 2 × … × n` there are always more 2s than 5s, so the zeros are decided by the 5s: `⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + …` (Legendre's count of the factor 5).
3. **Smallest missing multiplier.** To force a product to end with `k` zeros, count the 2s and 5s present and multiply by the smallest number that supplies the deficit: `2^max(0, k−#2s) × 5^max(0, k−#5s)`.
4. **Equal-product grouping.** Splitting numbers into groups of equal product works because each group's product is `√(total product)`; prime-factorise everything and share the primes evenly.

There is **no printed answer key**; all bank answers below are computed in code (`countTwosFives`, `legendreTerms`, `onesDigit`) and were cross-checked by an independent verifier.

## Named classics → question bank

| classic id | registry skill | what it drills | representative source items |
|---|---|---|---|
| `zeros-product` | Count zeros in a product | trailing zeros of an explicit product = min(#2s, #5s) | Learn & Discover (14×15→1, 24×15→1, 28×25→2); Exploration 2 (11×2×33×4×5×10→2); Practice (12²×15³→3); Further Ex. (2×25×31×16×15→3) |
| `zeros-factorial` | Zeros in a factorial | zeros of 1×2×…×n via factors of 5 | L&D (5!→1, 10!→2, 50!→12); Exploration 3 (→200→49); Practice (→500→124); Homework (→30→7, →150→37); Exploration 4 (→800→199) |
| `smallest-multiplier` | Smallest missing multiplier | smallest factor so the product ends with k zeros | Exploration 2 (12×75×32×( )→25); Homework (15×16×20×( )→5, 10×11×25×a→4); Further Ex. (35×15×32×45×( )→5) |
| `equal-pairs` | Equal-product pairs | split 4 numbers into two equal-product pairs | Practice (15,21,14,10→210); Homework 6 (24,18,27,36→648) |
| `equal-triples` | Equal-product triples | split 6 numbers into two equal-product triples | Exploration 1 (14,20,40,44,63,99→55440); Homework 2 (2,3,24,33,55,60→3960, answer C); Further Ex. 7 (3,5,22,30,77,175→11550) |
| `ones-digit` | Ones digit of a product | ones digit of a product (a 2 and a 5 ⇒ ends in 0) | Further Basic 1 (2×5×5×5×5×5×5×5→0); trailing-zero pattern 2×3×4×5→0; ones-digit cycles of repeated factors |

All bank data is integer-clean and verified by direct prime-factor counting in the module. The largest factorial value (1 × 2 × … × 800 → 199 zeros) and the largest grouping product (55440) are computed exactly within JavaScript's safe-integer range.

## Lesson navigation in the source

- In Class: Exploration 1 (equal-product triples), Practice (equal-product pairs), Learn & Discover (trailing zeros of a product), Exploration 2 (zeros + smallest missing multiplier), Practice, Learn & Discover (factorial zeros), Exploration 3 (→200), Exploration 4 (→800), Challenge (301×…×999).
- After Class: Teaching Time (→80), Homework 1–6 (zeros, grouping, missing multiplier, factorials).
- Further Exercises: Basic 1–3 (ones digit, zeros), Further 4–10 (missing multiplier, grouping, factorials, first-2006-primes trick), Extensive (Optional) 1–3 (8-number grouping, large factorials).
