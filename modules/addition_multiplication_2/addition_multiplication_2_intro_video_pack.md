# Principle of Addition and Multiplication (2) Intro Video Pack

Mission: Lesson 21 - Principle of Addition and Multiplication (2)

This intro is the launch path for Think Academy's Lesson 21 — the second pass on the multiplication principle, now extended to forming-number problems where digits include zero, parity rules constrain the last digit, and the bundling method handles "must stand together" constraints. The six scenes show an 11-year-old why every counting trick is just position-by-position multiplication, and they explicitly head off Pip's classic mistake of forgetting the zero-leading rule when the number must be odd.

## Core Learning Outcome

By the end of this intro the learner can break any forming-number problem or arrangement problem into independent position choices, multiply across positions, and adjust for the three rules that catch most children out: (1) a number cannot start with zero, (2) parity is a rule about the last digit so fix it FIRST, and (3) when two or more items must stand next to each other, glue them into a bundle and multiply by the bundle's internal orderings. The intro names the five skills the learner will train and shows the visual reason each rule exists before any formula appears.

## Named Skills Shown Before Practice

The five skills surfaced before practice, matching `registry.skills`:

- Position-by-position counting
- Zero-leading constraint
- No-repeat decrement
- Odd/even via last digit
- Bundling method

Each named skill maps to at least one classic in the bank and to one or more storyboard scenes below.

## Storyboard

The intro plays as six scenes. Each scene takes one named skill, shows the mathematical object on screen, then narrates the move in the teacher's voice.

1. **Position-By-Position Counting**
   Open with a row of empty digit boxes and the digit set written above them. Light up each box one at a time, showing the number of choices for that position equals the size of the digit set. Multiply the box counts across the row to produce the total. This is the engine every later scene reuses.
   Voiceover: Open with a row of empty boxes, one for each digit we need. Above the boxes, write the digit set we can pull from. The number of choices for each box is the size of that set. Multiply those numbers together and you have every possible number you can build.

2. **Zero-Leading Constraint**
   Drop a zero into the digit set. Highlight that the leading box is special: a number cannot begin with zero, so the leading box loses one option. Trailing boxes keep all options including zero. The intro shows the source canonical {0, 1, 2, 3} two-digit example and walks through 3 × 4 = 12 visually.
   Voiceover: Now drop a zero into the digit set. The trailing boxes can still take any digit, including zero. But the leading box is special. A number cannot begin with zero, so the leading box has one fewer choice. The total drops accordingly.

3. **No-Repeat Decrement**
   Switch the rule to "no digit reused". Each box that gets a digit now removes that digit from the pool available to later boxes. Animate the dropping counts visually: 5, then 4, then 3, then 2. The product is the no-repeat count.
   Voiceover: Switch to the no-repeat rule. Once a digit is placed in one box, it cannot appear again. The first box has five choices, the second has four, the third has three, and so on. Multiply the dropping numbers together to get the total.

4. **Odd/Even Via Last Digit**
   The Pip-mistake scene. Show the digit set {0, 1, 2, 3, 4, 5} and ask for 3-digit odd numbers with no repeats. Display Pip's wrong reasoning (5 × 5 × 3 = 75) on the left and the correct reasoning (3 × 4 × 4 = 48) on the right. The lesson: parity is a rule about the LAST digit, so fix it first; then the leading-zero rule applies cleanly to the remaining positions.
   Voiceover: Watch what Pip almost got wrong. The number must be odd, which is a rule about the last digit. So we fix the last box first, counting only the odd choices available. Then we go back to fill the leading box and the middle boxes. Always fix the constrained box first.

5. **Bundling Method**
   Switch from digit forming to arrangement problems. The word APPLE appears as five letter boxes. The two Ps must stand together — glue them into one bundle. The row now has four units instead of five. Show the count: 4! = 24 arrangements. Note that the two Ps are identical so we do not multiply by two; if the items were distinct (Pip and Bud) we would.
   Voiceover: Switch to arranging items in a line. The word APPLE has two P letters that must sit together. Glue them into one bundle. Now we have four units to arrange instead of five, giving four factorial arrangements. Multiply by the bundle's own two orderings if the items are distinct.

6. **Multi-Bundle Challenge**
   The closing challenge from the source page. Seven students in a row. The ABC trio must stand together AND the DE pair must stand together. Glue both groups into single units. Effective units to arrange: 7 − 5 + 2 = 4. So 4! = 24 arrangements. Multiply by 3! for the ABC bundle's internal order and 2! for the DE bundle. Total: 4! × 3! × 2! = 288. End with the canonical answer highlighted on screen.
   Voiceover: Now add a second bundle. Seven students stand in a row, A B C must be together, and D E must be together. Glue both groups so the row holds four units: the ABC bundle, the DE bundle, plus two loose students. Arrange those four units in four factorial ways, then multiply by three factorial for the ABC bundle's order and two factorial for the DE bundle. That gives two hundred and eighty eight arrangements.

## Warmup Gate

Before the full practice round opens, the learner answers three short gate questions that preview the named skills they will train:

1. Using the digits {1, 2, 3, 4}, how many two-digit numbers can be made if digits can be repeated? (Previews Position-by-position counting.)
2. Using the digits {0, 1, 2, 3}, how many two-digit numbers can be made if digits can be repeated? (Previews the Zero-leading constraint — the source canonical answer is 12.)
3. Using the digits {0, 1, 2, 3}, how many two-digit numbers can be made if no digit is repeated? (Previews the No-repeat decrement, answer 9.)

The warmup gate matters because every later classic stacks these three moves on top of each other. Without warmup mastery, the source reasoning examples — including Pip's wrong answer — read as black-box tricks rather than chained applications of one principle.

## Misconception Risks

These are the common pitfalls an 11-year-old brings into this lesson. The intro must name each one explicitly so practice mistakes become teachable.

- Pip's wrong answer — fixing the last digit AFTER the leading digit: a child writes 5 × 5 × 3 = 75 for a 3-digit odd number from {0..5} with no repeats. They counted the leading digit as 5 (forgetting zero), the middle as 5 (also wrong), and the last as 3 (correct). The intro must show that parity is a rule about the LAST digit, so the last digit is fixed first.
- Forgetting the zero-leading rule entirely: a child writes 4^3 = 64 for {0, 1, 2, 3, 4} 3-digit numbers with repeats, ignoring that 064 is really a 2-digit number. The zero-leading scene must show a number on screen beginning with 0 and label it as a 2-digit number, not a 3-digit number.
- Decrementing in the wrong direction: a child writes "first box 1 choice, second box 2 choices, third box 3 choices" instead of the opposite. The no-repeat decrement scene must show the visual count dropping from left to right as digits are claimed.
- Multiplying the bundle by its size instead of its internal factorial: a child computes 4! × 2 = 48 for APPLE when the two Ps are identical (no internal multiplier) and arrives at the same number 48 by accident. The bundling scene must contrast identical-pair (no times two) with distinct-pair (times two).
- Treating two adjacent bundles as a single bundle: a child sees the multi-bundle problem and multiplies (n − 5 + 1)! × 5! instead of (n − 5 + 2)! × 3! × 2!. The multi-bundle scene must draw the two bundles as separately-coloured rectangles so the child sees that they are independent units.

## Voiceover Draft

This is the full voiceover script for the intro. Each paragraph below maps to one storyboard scene and is at least 25 words of teacher narration. The first paragraph here introduces the whole module before scene 1 begins.

Welcome to the Principle of Addition and Multiplication, part two. These puzzles look different on the surface — digits forming numbers, students standing in a row, letters of a word being rearranged — but underneath they are all the same trick. Today you will learn five named skills that let you turn any counting puzzle into a row of boxes you multiply across.

Open with a row of empty boxes, one for each digit we need. Above the boxes, write the digit set we can pull from. The number of choices for each box is the size of that set. Multiply those numbers together and you have every possible number you can build.

Now drop a zero into the digit set. The trailing boxes can still take any digit, including zero. But the leading box is special. A number cannot begin with zero, so the leading box has one fewer choice. The total drops accordingly, and Lesson 21's first in-class example asks for two-digit numbers from the set {0, 1, 2, 3}; the answer is three times four, which is twelve.

Switch to the no-repeat rule. Once a digit is placed in one box, it cannot appear again. The first box has five choices, the second has four, the third has three, and so on. Multiply the dropping numbers together to get the total. The same {0, 1, 2, 3} set with the no-repeat rule gives three times three, which is nine.

Watch what Pip almost got wrong. The number must be odd, which is a rule about the last digit. So we fix the last box first, counting only the odd choices available. Then we go back to fill the leading box and the middle boxes. Always fix the constrained box first. Pip wrote five times five times three and got seventy five, but the correct answer is three times four times four, which is forty eight.

Switch to arranging items in a line. The word APPLE has two P letters that must sit together. Glue them into one bundle. Now we have four units to arrange instead of five, giving four factorial arrangements. Multiply by the bundle's own two orderings if the items are distinct, but the two Ps are identical so we do not multiply by two. Answer: twenty four.

Now add a second bundle. Eight students stand in a row, A B C must be together, and D E must be together. Glue both groups. We now arrange five units, then multiply by the three factorial for the A B C bundle and the two factorial for the D E bundle. That gives one hundred and twenty times six times two, or one thousand four hundred and forty arrangements.

## Notes For The Author

This pack ships alongside `addition_multiplication_2_module.js`, which exports `INTRO_SCENES` matching the six storyboard scenes above one-to-one. The skill-coverage gate verifies that each registry skill name appears verbatim in the storyboard titles and the scene `title`/`purpose` strings. The intro-pack lint verifies that the pack has all required sections, at least six storyboard scenes, total length within 80..600 lines, and per-scene voiceover wordcount above 25.

The seven source-anchored classics are reproduced in `addition_multiplication_2_source_extract.md`. Source page images are stored in `source/source_page_images/addition_multiplication_2/`.
