# Recurring Decimals (1) Intro Video Pack

Mission: Lesson 27 - Recurring Decimals (1)

## Learning Outcome

By the end of this intro video the learner can work with recurring decimals end to end: write a repeating decimal in dot notation (dots over the first and last digit of the repeating block, a single dot for a single repeating digit) and expand the dots back into digits; compare two recurring decimals by expanding both until their digits first differ; order a mixed list of percentages, terminating and recurring decimals and pick the middle value; decide whether a fraction terminates or recurs by simplifying and factorising the denominator (only 2s and 5s terminate); and use periodicity — the nth digit is block[(n − 1) mod period], and long digit sums collapse into whole blocks times the block sum plus leftovers.

## Named Skills Shown Before Practice

- Dots notation
- Compare recurring decimals
- Middle of the order
- Terminating or recurring
- Nth digit hunt
- Digit sum runs

Each named skill below appears as one storyboard scene, one intro-scene title in the module JS, and one entry in the registry skills array, so the vocabulary stays identical everywhere the child meets it.

## Storyboard

1. **Dots notation**
   Purpose: mark the repeating block with dots on its first and last digit.
   Voiceover: A recurring decimal repeats a block of digits forever. Writing eight point two seven one, two seven one, on and on would never end, so we mark the block instead. Put a dot over the first digit of the block and a dot over the last digit. If just one digit repeats, it wears a single dot on its own.

2. **Compare recurring decimals**
   Purpose: expand both decimals until their digits first differ.
   Voiceover: Two recurring decimals can start with the same digits and still be different sizes. Expand each one, digit by digit, until the first place where they disagree. Whichever has the smaller digit there is the smaller number. The dots move the repeating block, so never compare the compact forms directly — always expand first.

3. **Middle of the order**
   Purpose: expand every value — percentages too — then sort and pick the centre.
   Voiceover: When a list mixes percentages, plain decimals and recurring decimals, expand every one of them to the same number of digits. A percentage is just a decimal in disguise. Then sort the expansions like ordinary numbers and read off the one sitting in the centre of the order. The expansion does all the hard work.

4. **Terminating or recurring**
   Purpose: simplify, then factorise the denominator — only 2s and 5s terminate.
   Voiceover: Whether a fraction terminates or recurs is decided by its denominator. First write the fraction in simplest form. Then break the denominator into prime factors. If you only find twos and fives, the decimal stops. Any other prime, like a three, a seven or an eleven, forces the decimal to repeat forever.

5. **Nth digit hunt**
   Purpose: the digits cycle with the period — use (n − 1) mod period.
   Voiceover: To find a faraway digit you never need to write them all out. The digits march in a cycle whose length is the period of the block. Subtract one from the position, divide by the period, and the remainder tells you which digit of the block you have landed on. Remainder zero means the first digit of the block.

6. **Digit sum runs**
   Purpose: whole blocks times the block sum, plus the leftover digits.
   Voiceover: Long digit sums collapse the same way. Count how many whole repeating blocks fit into your run of digits, multiply by the sum of one block, and then add the handful of leftover digits from the start of the next block. One hundred digits of a period four decimal is exactly twenty five blocks.

## Warmup Gate

Before full practice, the learner should answer:

1. In 8.271271271…, which digits repeat, and where do the two dots go in dot notation?
2. Expand 0.42̇5̇ and 0.4̇25̇ to five decimal digits each. At which digit do they first differ, and which is smaller?
3. 40 = 2 × 2 × 2 × 5 and 6 = 2 × 3. Why does 21/40 terminate while 5/6 recurs?

## Misconception Risks

These are the common pitfalls children bring to recurring decimals:

- Reading the dots as decoration and comparing compact forms digit by digit without expanding — 0.42̇5̇ and 0.4̇25̇ look almost identical but differ from the fourth digit.
- Putting dots over the wrong digits, e.g. dotting the one-off digits in 5.41666… instead of writing 5.416̇.
- Forgetting to simplify before factorising the denominator: 20/24 looks recurring-ish until it becomes 5/6 — and 9/45 looks recurring until it becomes 1/5.
- Off-by-one errors in the period count: the nth digit is block[(n − 1) mod period], so remainder zero is the FIRST digit of the block, not the last.

## Voiceover Draft

This is the full voiceover draft. Each paragraph maps to one storyboard scene and is written to be read aloud to an eleven or twelve year old, naming the skill and pointing at what changes on screen during that beat of the intro.

Dots notation. Eight point two seven one, two seven one, two seven one — the block two seven one marches across the screen and would march forever. Two dots drop onto the block, one on its first digit and one on its last, and the endless march folds into one tidy symbol. A lone repeating digit takes a single dot.

Compare recurring decimals. Two nearly identical decimals face off. Their expansions roll out side by side, digit by digit, and the first three digits agree. Then the fourth pair lights up: a two against a four. That single glowing column decides everything — the number with the two is smaller, no matter what comes after.

Middle of the order. Five values line up wearing disguises: a percentage, a plain decimal, three dotted ones. Each pulls off its disguise and shows four expanded digits. Now they shuffle into ascending order along a number line, and the one standing third — dead centre — steps forward as the middle of the order.

Terminating or recurring. Two fractions go into the factor machine. Forty splits into two, two, two, five — only twos and fives — and its decimal stops neatly. Six splits into two and three, and the three jams the machine: the decimal can never stop. Simplify first, then read the denominator's primes.

Nth digit hunt. The block three two seven eight loops around a circle of four positions. To find the twenty fifth digit nobody counts to twenty five: subtract one, take the remainder mod four, and the pointer lands on position one — the digit three. The fortieth digit lands on remainder three — the digit eight.

Digit sum runs. One hundred digits stack up in rows of four. Twenty five complete rows, each summing to twenty. The total pops out as twenty five times twenty, five hundred, with zero digits left over. When the rows do not divide evenly, the last incomplete row simply adds its few digits on top.

## Notes For The Author

Audio narration files are optional for this module. When recorded, drop one `.wav` per scene into the `audio/` folder and add an `audio` field to each INTRO_SCENES entry; until then the app falls back to the browser speech engine and the narration text on screen.
