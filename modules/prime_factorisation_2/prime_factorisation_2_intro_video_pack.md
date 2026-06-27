# Prime Factorisation (2) Intro Video Pack

Mission: Lesson 24 - Prime Factorisation (2)

## Learning Outcome

By the end of this intro video the learner can use prime factorisation to answer two kinds of question. First, they can count the trailing zeros of a product by counting its factors of 2 and 5, because every trailing zero is a hidden 10 = 2 × 5, so the number of zeros is min(#2s, #5s); they can apply this to explicit products, to factorials like 1 × 2 × … × n (where the factors of 5 are what run out first), to finding the smallest missing multiplier that reaches a target number of zeros, and to finding the ones digit of a product. Second, they can split a set of numbers into two groups of equal product, because each group's product is the square root of the total product.

## Named Skills Shown Before Practice

- Count zeros in a product
- Zeros in a factorial
- Smallest missing multiplier
- Equal-product pairs
- Equal-product triples
- Ones digit of a product

Each named skill below appears as one storyboard scene, one intro-scene title in the module JS, and one entry in the registry skills array, so the vocabulary stays identical everywhere the child meets it.

## Storyboard

1. **Count zeros in a product**
   Purpose: see that each trailing zero is a factor of 10 = 2 × 5, so count the 2s and 5s.
   Voiceover: Every zero on the end of a product is really a factor of ten, and ten is two times five. So break each number into its prime factors, count how many twos there are and how many fives there are, and because each two pairs with a five to make a ten, the number of trailing zeros is whichever of the two counts is smaller.

2. **Zeros in a factorial**
   Purpose: count zeros of 1 × 2 × … × n by counting only the factors of 5.
   Voiceover: When you multiply one times two times three all the way up to a big number, there are always far more factors of two than of five, so the fives run out first and the fives decide the zeros. Count the multiples of five, then the multiples of twenty five, then one hundred and twenty five, and add those counts together.

3. **Smallest missing multiplier**
   Purpose: supply only the missing 2s and 5s to reach a target number of zeros.
   Voiceover: Sometimes you want a product to end with a set number of zeros. Each zero needs a pair, one two and one five, so count the twos and fives you already have, work out how many of each are still missing, and multiply by the smallest number that supplies exactly those missing twos and fives and nothing more.

4. **Equal-product pairs**
   Purpose: split four numbers into two pairs that share the same product.
   Voiceover: To split four numbers into two pairs with equal products, first multiply all four together to get the total, and because the two equal groups multiply back to that total, each group must be the square root of it. So pair the numbers up until two of them multiply to the same value as the other two.

5. **Equal-product triples**
   Purpose: split six numbers into two groups of three with the same product.
   Voiceover: The same idea works with six numbers split into two groups of three. Prime factorise all six numbers and share the prime factors out evenly between the two groups, so each group of three multiplies to the square root of the total product, exactly like the pairs but with three numbers in each group instead of two.

6. **Ones digit of a product**
   Purpose: use the 2-and-5 idea to find the ones digit of a product.
   Voiceover: The two and five idea also tells you the ones digit of a product. If the product has at least one factor of two and one factor of five it contains a ten, so it must end in zero. If it does not, then simply multiply the last digits together step by step, because the ones digit of a product only depends on the ones digits being multiplied.

## Warmup Gate

Before full practice, the learner should answer:

1. 28 × 25 = 700 ends with two zeros. How does counting the 2s and the 5s in 28 × 25 explain why there are exactly two?
2. In 1 × 2 × 3 × … × 50, why do we only need to count the factors of 5 and not the factors of 2?
3. 15 × 14 = 210 and 21 × 10 = 210. Why must each equal pair come out to the square root of 15 × 21 × 14 × 10?

## Misconception Risks

These are the common pitfalls children bring to prime factorisation and trailing zeros:

- Counting only the obvious zeros (numbers already ending in 0 or 5) and missing hidden 2s and 5s, e.g. thinking 24 × 15 has no zeros when it actually ends in one.
- Taking the larger of #2s and #5s, or adding them, instead of taking the smaller count (the minimum).
- For a factorial, dividing n by 5 once and stopping, forgetting the extra fives from multiples of 25, 125 and so on.
- For the smallest missing multiplier, adding more primes than needed (e.g. multiplying by 10 when only a single 5 is missing) instead of supplying just the deficit.

## Voiceover Draft

This is the full voiceover draft. Each paragraph maps to one storyboard scene and is written to be read aloud to an eleven or twelve year old, naming the skill and pointing at what changes on screen during that beat of the intro.

Count zeros in a product. Watch a zero peel off the end of a product and turn into a ten, and that ten splits into a two and a five. So break every number into primes, count the twos and the fives, pair them up, and the number of trailing zeros is simply the smaller of the two counts.

Zeros in a factorial. Now the product is one times two times three all the way to fifty. There are heaps more twos than fives, so the fives are the bottleneck. Count the multiples of five, then the multiples of twenty five which sneak in an extra five each, add them together, and that total is the number of zeros.

Smallest missing multiplier. Here we want the product to finish with a fixed number of zeros. Each zero needs one more two and one more five, so tally up the twos and fives already present, spot how many are missing, and multiply by the smallest number that fills exactly that gap, never adding a prime you do not need.

Equal-product pairs. Four numbers slide onto the screen. Multiply all four to get the total, then realise each equal pair must be the square root of that total. Hunt for two numbers whose product matches the product of the remaining two, and the pairs lock into place.

Equal-product triples. Six numbers this time, splitting into two groups of three. Prime factorise them all and deal the prime factors out evenly, like sharing cards, so each group of three multiplies to the square root of the total, just as the pairs did but with one extra number per group.

Ones digit of a product. Finally, the ones digit. If a two and a five are both hiding in the product, they make a ten and the answer ends in zero. If not, just multiply the last digits one step at a time, because only the ones digits decide the final ones digit.

## Notes For The Author

Audio narration files are optional for this module. When recorded, drop one `.wav` per scene into the `audio/` folder and add an `audio` field to each INTRO_SCENES entry; until then the app falls back to the browser speech engine and the narration text on screen.
