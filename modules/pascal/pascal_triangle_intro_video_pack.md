# Pascal Triangle Intro Video Pack

Date: 2026-04-28

Audience: 11-12 year olds preparing for the Pascal Triangle practice round.

Length target: 90-120 seconds.

Primary source anchor: Lesson 7, "Triangular Number Tables", especially the "Let's Get Ready" sums on book page 90 / PDF page 100, followed by the Pascal Triangle introduction.

## Core Learning Outcome

The learner understands that a consecutive sum

```text
1 + 2 + ... + n
```

can be calculated quickly as

```text
(n + 1) x n / 2
```

and that this shortcut explains the third diagonal of Pascal Triangle.

Corrected learning spine:

```text
Let's Get Ready consecutive sums
-> pairing shortcut
-> Pascal parent-sum rule
-> third diagonal as a running total
-> third number in row r
```

Important child-friendly correction:

```text
One Pascal parent-sum is not the formula.

The parent-sum rule makes the third diagonal grow as a running total:

1
1 + 2 = 3
1 + 2 + 3 = 6
1 + 2 + 3 + 4 = 10

Then the shortcut 1 + ... + n = (n + 1) x n / 2 helps us calculate those running totals quickly.
```

## What The Child Should Be Able To Do After The Intro

The intro must name the wider Pascal skill set first. The learner should be able to:

1. Build Pascal rows by adding the two parents above.
2. Recognise the edge `1`s.
3. Use the second diagonal rule: second number in row `r` is `r - 1`.
4. Explain the third diagonal bridge: parent sums create a running total.
5. Calculate `1 + 2 + ... + n` using `(n + 1) x n / 2`.
6. Use the row shift: third number in row `r` is `1 + 2 + ... + (r - 2)`.
7. Recognise that row totals double, using the Row doubler shortcut.
8. Understand that some questions work backwards from a clue, using Reverse clues reasoning.

## Named Skills

The learner sees this skill card before any scene starts. Each skill maps to a registry token used by the practice bank:

- Parent rule - every inside number is the sum of the two parents directly above it.
- Row doubler - the total of each row doubles as you move one row down.
- Third stair - the third diagonal of Pascal Triangle is a running total of consecutive numbers.
- Reverse clues - some questions give a value or a total and ask you to find the row, position, or rule that produced it.

## Video Structure

| Scene | Time | Purpose | Visual | Voiceover |
|---|---:|---|---|---|
| 1. Learning Map | 0:00-0:15 | Name the full skill set so each scene names its move. | Actual Pascal Triangle plus four skill labels: parent rule, third stair, row doubler, reverse clues. | "This is not only a formula lesson. You are training four named Pascal moves: parent rule, third stair, row doubler, and reverse clues. Name the move before you write a number." |
| 2. Parent Rule | 0:15-0:27 | Show the local Pascal rule before introducing any formula. | Triangle with two parents glowing above a child number. | "Every inside number is made by adding the two parents directly above it. That is the parent rule, the local rule that builds every row of Pascal Triangle." |
| 3. Diagonal Map | 0:27-0:41 | Identify edge, second, and third diagonals so the next scene has somewhere to point. | Same triangle with green edge, blue second diagonal, and gold third diagonal highlighted. | "The edge of the triangle is always one. The second diagonal is row minus one. The third diagonal is the interesting one, because the parent rule turns it into a running total." |
| 4. The Bridge | 0:41-0:58 | Make parent sums become running totals visually before any formula appears. | Triangle plus side ladder showing 1, 1 + 2, 1 + 2 + 3, 1 + 2 + 3 + 4. | "Each gold number keeps its old value and adds the next blue number. So parent sums create a running total of consecutive numbers down the third diagonal. That is the third stair." |
| 5. Shortcut | 0:58-1:11 | Introduce the formula after the visual bridge is settled. | Pairing card showing 1 + 2 + ... + n grouped into matching pairs. | "Now the shortcut is useful, not mysterious. The running total `1 + 2 + ... + n` always equals `(n + 1) x n / 2`, because the numbers pair up from the ends inward." |
| 6. Row Shift | 1:11-1:24 | Teach the exact third stair method for an actual row. | Row 13 -> stop at 11 -> 66 worked example. | "For row `r`, the third number stops at `r - 2`. So the third number in row 13 is `1 + 2 + ... + 11`, which is `12 x 11 / 2 = 66`. Use the running total, not the row number." |
| 7. Row Doubler & Reverse Clues | 1:24-1:36 | Signal the wider exercise set with row doubler and reverse clues. | Row totals 1, 2, 4, 8, 16 on one card; backwards-clue cards on the other. | "Practice also checks the row doubler shortcut: every row total is double the previous row total. And reverse clues, where you start from a given value or row total and work backwards to the address inside the triangle." |
| 8. Ready | 1:36-1:45 | Move into training with the skill set named. | Watch again or train now choice with the four-skill checklist. | "Now start training. The triangle will come back if you need hints. Name the move first: parent rule, third stair, row doubler, or reverse clues. Then calculate, and pass the answer on to the next step." |

## Full Voiceover Draft

The book starts with long sums like `1 + 2 + ... + 10`, then longer sums up to 39 and 80. Adding one number at a time works, but it is painfully slow. So we learn a shortcut first, before we open Pascal Triangle. Pair the first and last numbers: `1 + 10 = 11`. Then `2 + 9 = 11`, then `3 + 8 = 11`, and the same idea continues right across the sum.

Imagine writing the sum forwards and backwards. Each column adds to 11, and there are 10 columns. So the doubled sum is `11 x 10`, which is one hundred and ten. But that counts the same sum twice, so we divide by two to get fifty-five. For any last number `n`, the same pairing argument gives `1 + 2 + ... + n = (n + 1) x n / 2`. That is the shortcut formula.

Now pause, because Pascal Triangle has a different rule. Inside Pascal Triangle, a number is made by adding the two parents above it, the parent rule. For example, `3 + 3 = 6`. That one parent-sum is not the shortcut formula. The shortcut appears because of what happens when we keep using the parent rule down the third diagonal, scene after scene.

The third diagonal starts at one. The next third-diagonal number is `1 + 2 = 3`. The next one is `3 + 3 = 6`, which is the same as `1 + 2 + 3`. The next one is `6 + 4 = 10`, which is the same as `1 + 2 + 3 + 4`. So the third diagonal is a running total of consecutive numbers: `1, 3, 6, 10, 15`, and so on. That is the third stair move.

Now the shortcut from the start of the lesson becomes useful. If a question asks for the third number in row `r`, we do not add all the way to `r`. We add up to `r - 2`. For example, row 13 uses `1 + 2 + ... + 11`. The shortcut gives `(12 x 11) / 2 = 66`, so the third number in row 13 is 66.

The practice also trains the row doubler shortcut: row totals follow the doubling pattern 1, 2, 4, 8, 16, 32. And reverse clues, where the question gives a value or a row total and asks you to find the row, position, or rule that produced it. In every problem, name the move first: parent rule, third stair, row doubler, or reverse clues. Then calculate, then pass the answer on to the next step of the question.

## Misconception Risks

- Confusing one parent-sum with the running-total formula, so the child writes `(n + 1) x n / 2` after a single addition.
- Using the row number `r` directly in `1 + 2 + ... + r` for the third diagonal, instead of stopping at `r - 2`.
- Treating Pascal Triangle like an ordinary consecutive-number triangle and ignoring the parent rule.
- Forgetting that row totals double when using the row doubler shortcut.
- Reading reverse clues forwards and missing the cue that the question starts from the answer.

Now try the warmup check.

## On-Screen Text Rules

Keep text short. The video should not show whole paragraphs.

Allowed on-screen cards:

```text
Long sum -> shortcut
1 + 2 + ... + n
(n + 1) x n / 2
Third diagonal = triangular numbers
Row r -> add up to r - 2
```

Avoid:

- too many formulas at once
- calling ordinary counting triangles "Pascal Triangle"
- introducing combinations, binomial expansion, or probability
- saying the third number in row `r` is `1 + ... + r`

## Warmup Gate

The intro is complete only when the child answers these:

1. Calculate `1 + 2 + ... + 10`.
   - Expected: `55`
   - Preferred method: `(11 x 10) / 2`

2. Calculate `1 + 2 + ... + 39`.
   - Expected: `780`
   - Preferred method: `(40 x 39) / 2`

3. What is the third number in row 13 of Pascal Triangle?
   - Expected: `66`
   - Preferred method: row 13 uses `1 + ... + 11`, so `(12 x 11) / 2`

4. Why does row 13 use 11, not 13?
   - Expected idea: the third diagonal is shifted; row `r` uses `r - 2`.

## NotebookLM Steering Prompt

```text
Create a short, teacher-like video overview for an 11-12 year old preparing for Pascal Triangle practice.

Use only the supplied source notes.

Start by naming the full skill set:
- build Pascal rows using parent sums
- recognise edge 1s
- use the second diagonal
- understand the third diagonal as a running total
- use the consecutive-sum shortcut
- understand row totals and reverse questions

The main bridge concept is the Let's Get Ready shortcut:

1 + 2 + ... + n = (n + 1) x n / 2

But do not start with a formula-only explanation. Show the actual Pascal Triangle early.

Use this order:

1. Show the actual Pascal Triangle.
2. Show the parent rule: two parents above make the child number.
3. Show the edge, second diagonal, and third diagonal.
4. Show the bridge: the third diagonal keeps the old gold value and adds the next blue second-diagonal number.
5. Show the running total: 1, then 1 + 2, then 1 + 2 + 3, then 1 + 2 + 3 + 4.
6. Then introduce the shortcut:

1 + 2 + ... + n = (n + 1) x n / 2

Use row 13 as the worked transfer: third number in row 13 uses 1 + 2 + ... + 11 = (12 x 11) / 2 = 66.

Briefly signal that the practice also includes row totals and reverse questions.

Use row 13 as the worked transfer:

third number in row 13 = 1 + 2 + ... + 11 = (12 x 11) / 2 = 66

Keep it calm, concrete, and visual. Do not introduce unrelated Pascal properties such as combinations, binomial expansion, probability, or paths.

End with four warmup questions:
1. 1 + 2 + ... + 10
2. 1 + 2 + ... + 39
3. third number in row 13
4. why row r uses r - 2 for the third diagonal
```

## Review Checklist

Before accepting the video:

- Does it start from the Let's Get Ready consecutive sums?
- Does it teach the pairing shortcut before Pascal Triangle?
- Does it explicitly show `(n + 1) x n / 2`?
- Does it explain why we divide by 2?
- Does it clearly say one parent-sum is not the shortcut formula?
- Does it show repeated parent-sums creating a running total down the third diagonal?
- Does it connect that running total to the shortcut formula?
- Does it say row `r` uses `r - 2` for the third number?
- Does it avoid unrelated Pascal facts?
- Does it include a warmup gate before practice?

## Voice Production Decision

Browser speech synthesis is not a production voice. It may remain in the app only as an explicit fallback, off by default.

For the Pascal Triangle intro, preferred production routes are:

1. NotebookLM video/audio overview for the first polished version, using this storyboard and steering prompt as the source pack.
2. Chatterbox TTS for an open-source voice prototype if we want a self-hosted pipeline.
3. Kokoro as the lightweight open-source fallback if Chatterbox setup is too heavy.

The voiceover must be reviewed as teaching, not as audio generation. It must sound like a calm, enthusiastic teacher guiding an 11-year-old through the triangle.

## App Integration

Placement in the app:

```text
Intro -> Warmup Gate -> Practice Round -> Recap -> Fresh Round
```

Intro card actions:

- Watch intro
- Review rule card
- Try warmup
- Skip intro, still take warmup

Telemetry to store:

- intro watched / skipped
- warmup attempts
- failed warmup concepts
- whether the child later misses Third Stair
