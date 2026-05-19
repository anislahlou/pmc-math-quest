# Consecutive Number Triangles Intro Video Pack

Date: 2026-04-29

Audience: 11-12 year olds preparing for PMC/JMC-style pattern questions.

Length target: 100-130 seconds.

Primary source anchor: Lesson 7, "Triangular Number Tables", especially the ordinary consecutive-number triangle, the even-number triangle, reverse position questions, row sums, and the wider challenge triangle.

## Core Learning Outcome

The learner understands that a consecutive-number triangle is an address map. Every number in the triangle has a row and a seat, and we can move between value and address in either direction.

The key move is:

```text
number in row r, position k = numbers before the row + k
```

For the ordinary triangle:

```text
numbers before row r = 1 + 2 + ... + (r - 1) = r(r - 1) / 2
```

So:

```text
value = r(r - 1) / 2 + k
```

## Named Skills

The learner sees this skill card before any scene starts. Each skill maps to a registry token used by the practice bank:

- Row end - the last number in each row, which is a triangular number for the ordinary triangle.
- Seat value - the number at row `r`, position `k`, calculated by counting everything before the row, then stepping into the row.
- Find address - the reverse move: given a value, find the row and the position it sits in.
- Even twin - the same address map applied to the even-number triangle, where every value is doubled.
- Wide row - the stretch pattern where rows have one, three, five, seven seats and the row ends are square numbers instead of triangular numbers.

## What The Child Should Be Able To Do After The Intro

The learner should be able to:

1. Recognise the ordinary consecutive-number triangle and distinguish it from Pascal Triangle.
2. Find the last number in a row using triangular numbers (the row end skill).
3. Find a specific position in a row (the seat value skill).
4. Find the row and position of a given value (the find address skill).
5. Add all values in a row using first plus last times count divided by two.
6. Transfer the same address map to the even-number triangle using the even twin shortcut.
7. Notice that the wide row challenge is a different triangle with square row ends, and switch maps accordingly.

## Video Structure

| Scene | Time | Purpose | Visual | Voiceover |
|---|---:|---|---|---|
| 1. New Map | 0:00-0:13 | Separate this chapter from Pascal Triangle. | Ordinary triangle and even-number triangle side by side, both labelled. | "This is not Pascal Triangle. In this chapter the numbers are simply placed row by row, so every number has an address: a row and a seat. The visual idea is a map, not a parent-sum rule." |
| 2. Row Ends | 0:13-0:28 | Show row lengths and the last number in each row. | Row 4 highlighted with its end value `10` glowing. | "Row four has four seats, and its last number is ten. Ten is the row end because by the end of row four we have placed one plus two plus three plus four numbers in total. Row ends are triangular numbers." |
| 3. Seat Value | 0:28-0:44 | Teach the seat value move `T_(r-1) + k`. | Row 21, seat 5 example with `210 + 5 = 215`. | "Count everything before the row, then step into the row. To reach seat five in row twenty-one, count all the numbers in rows one to twenty, which is two hundred ten, then step five seats in to land on two hundred fifteen." |
| 4. Find Address | 0:44-1:00 | Teach the reverse move, value to row plus position. | Value `60` trapped between row ends `55` and `66` on the triangle. | "To find an address, trap the value between two row ends. Sixty is after fifty-five and before sixty-six, so it sits in row eleven. It is five steps after the previous row end, so its seat number is five. Value to row to seat." |
| 5. Row Sum | 1:00-1:14 | Teach the row total using first plus last. | Row 10 highlighted with values `46` through `55`. | "A row is a run of consecutive numbers. For row ten, the first value is forty-six and the last is fifty-five. Use first plus last, times the number of seats, divided by two. That is the row sum, much faster than adding seat by seat." |
| 6. Even Twin | 1:14-1:30 | Transfer the address map to the even triangle. | Ordinary address map doubled into the even-number triangle. | "The even-number triangle uses exactly the same addresses, but every ordinary value is doubled. If you are given the even value eighty, divide by two first to get the ordinary value forty, find that address, then keep the same address in the even triangle." |
| 7. Wide Row | 1:30-1:44 | Warn that a similar-looking triangle uses a different map. | Wide row pattern `1 / 2 3 4 / 5 6 7 8 9` with row ends `1, 4, 9, 16` highlighted. | "The wide row triangle is different. Its rows have one seat, then three, then five, then seven, so its row ends are square numbers, not triangular numbers. Before you calculate, ask which triangle you are in and choose the matching map." |
| 8. Ready | 1:44-1:52 | Move into practice. | Skill checklist: row end, seat value, find address, even twin, wide row. | "Now train the map. For every problem, ask which triangle you are in, then choose the move: row end, seat value, find address, even twin, or wide row. Name the move before you write a number." |

## Warmup Gate

Before practice unlocks, the child answers four warmup checks:

1. What is the row end for row 6 in the ordinary triangle? (`21`)
2. What is the number at row 7, seat 3 in the ordinary triangle? (`24`)
3. Find the address (row and seat) of the value `47` in the ordinary triangle. (Row 10, seat 2.)
4. The even-number triangle has the same addresses but doubled values. What value sits at row 4, seat 3? (`20`)

## Misconception Risks

- Treating the consecutive-number triangle as Pascal Triangle and trying to add parents above.
- Forgetting to count the numbers in the rows before the target row when calculating seat value.
- Reading the value backwards into the wrong row by missing a triangular row end.
- Doubling first when using the even twin, instead of dividing the even value by two before finding the ordinary address.
- Using the ordinary row end formula on a wide row triangle, when row ends are actually square numbers there.

## Full Voiceover Draft

This chapter looks a bit like Pascal Triangle, but the rule is completely different. In Pascal Triangle, a number is made from the two parents above it. Here, the numbers are simply placed row by row, so every number has an address made of a row and a seat. The visual idea is a map of addresses, not a calculation rule.

Row four has four seats, and its last number is ten. Ten is the row end because by the end of row four we have placed one plus two plus three plus four numbers in total. That is why row ends are triangular numbers in the ordinary triangle.

To find a seat, count all the numbers before the row, then move into the row. For example, the fifth number in row twenty-one. Before row twenty-one there are one plus two and so on up to twenty, which is two hundred and ten. Then step five seats into row twenty-one and you land on two hundred and fifteen.

To work backwards, trap the value between two row ends. For the value sixty, the row ends are fifty-five and sixty-six, so sixty must sit in row eleven. Sixty is five steps after fifty-five, so its seat number is five. That is the find address move.

For a whole row sum, use first plus last, times the number of seats, divided by two. The row is a run of consecutive numbers, so the average is the midpoint, and the row sum is the average times the count.

The even-number triangle uses the same address map, but every ordinary value is doubled. So if you are given an even value, divide it by two first, find the ordinary address, then keep that same address in the even triangle. This is the even twin shortcut.

One warning. The wide row challenge triangle is different. Its rows have one, three, five, seven seats, so its row ends are square numbers like one, four, nine, sixteen, instead of triangular numbers. In practice, the first question is always: which triangle am I in? Then pick the matching map: row end, seat value, find address, even twin, or wide row. Name the move before you write a number.

## Acceptance Gate

The intro is blocked if:

- it treats this as Pascal Triangle
- it does not show the actual consecutive triangle
- it does not teach row and position as an address
- it introduces formulas before the visual row-count idea
- it omits the even-number transfer (even twin)
- it fails to warn that the wide row challenge is a different map
