# Source Extract: Algebraic Word Puzzles

## Citation

PDF p154 / Book p144, Lesson 8 (Algebraic Thinking in Word Problems), Extensive Challenges Optional section. Page image: `source/source_page_images/algebraic_word_puzzles/lesson_8_extensive_p144.png`.

## Source Problem 1 — Hat Counting

> In a maths club, each boy wears a red hat, each girl wears a yellow hat, and each teacher wears a blue hat. No one sees their own hat.
>
> - A boy said: "I see two more red hats than yellow hats."
> - A girl said: "I see twice as many yellow hats as blue hats."
> - A teacher said: "I see eleven fewer blue hats than red hats."
>
> How many girls are in the club?

## Source Problem 2 — Pair Sums

> Four people, each with a whole-number weight in kilograms, step onto a scale in pairs. The pair weights recorded are 99, 113, 125, 130, and 144 kilograms. Two of the four people never weighed together. How heavy is the heavier of those two?

## Teacher's Notes — Canonical Solutions

### Problem 1: Self-exclusion + system of three equations

Let B, G, T be the total counts of boys, girls and teachers. Every speaker cannot see their own hat, so inside their statement the count of their own group drops by one.

- Boy sees (B − 1) red and G yellow. Statement: (B − 1) − G = 2, i.e. B − G = 3.
- Girl sees (G − 1) yellow and T blue. Statement: (G − 1) = 2T, i.e. G = 2T + 1.
- Teacher sees B red and (T − 1) blue. Statement: B − (T − 1) = 11, i.e. B = T + 10.

Substitute teacher into boy: (T + 10) − G = 3, so G = T + 7. Combine with girl's G = 2T + 1: T + 7 = 2T + 1, so T = 6. Then G = 13 and B = 16.

Answer: **13 girls**.

### Problem 2: Pair-sum decomposition + missing-pair logic

Four people a ≤ b ≤ c ≤ d produce six pair sums: a+b, a+c, a+d, b+c, b+d, c+d. Every weight appears in exactly three pair sums, so the sum of all six pair sums equals 3 × S where S = a + b + c + d.

The five given sums total 99 + 113 + 125 + 130 + 144 = 611. The smallest pair sum is always a + b and the largest is always c + d, so S = 99 + 144 = 243. The missing pair sum equals 3S − (sum of five given) = 3 × 243 − 611 = 729 − 611 = 118.

The six sums in order: 99, 113, 118, 125, 130, 144. From a + b = 99 and c + d = 144, plus a + c = 113 and b + d = 130, we recover a = 47, b = 52, c = 66, d = 78. The missing pair must be (b, c) = (52, 66) because it is the one b+c = 118 sum we never observed. The heavier of the missing pair is c.

Answer: **66 kg**.

## Pedagogical Lineage

These two source problems are not stand-alone tricks — they sit at the top of a ladder of warm-up skills the chapter develops. The module breaks that ladder into six classics:

1. `two-group-difference` — one statement, single self-exclusion application.
2. `three-group-ratio` — variable substitution with "twice as many" wording.
3. `hat-system-2-statement` — system of two equations in two unknowns.
4. `hat-system-3-statement` — the full source Problem 1.
5. `three-people-pair-sums` — three-person warmup for pair-sum decomposition.
6. `four-people-five-sums` — the full source Problem 2.

Each classic generates at least four variants by varying the numeric constants while preserving the source's underlying structure. The canonical (variant 0) of `hat-system-3-statement` reproduces Problem 1 with answer 13 girls; the canonical of `four-people-five-sums` reproduces Problem 2 with answer 66 kg.
