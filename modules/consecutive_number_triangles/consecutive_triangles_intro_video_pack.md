# Consecutive Number Triangles Intro Video Pack

Date: 2026-04-29

Audience: 11-12 year olds preparing for PMC/JMC-style pattern questions.

Length target: 90-120 seconds.

Primary source anchor: Lesson 7, "Triangular Number Tables", especially the ordinary consecutive-number triangle, the even-number triangle, reverse position questions, row sums, and the wider challenge triangle.

## Core Learning Outcome

The learner understands that a consecutive-number triangle is an address map.

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

## What The Child Should Be Able To Do After The Intro

The learner should be able to:

1. Recognise the ordinary consecutive-number triangle.
2. Find the last number in a row using triangular numbers.
3. Find a specific position in a row.
4. Find the row and position of a given value.
5. Add all values in a row using first and last.
6. Transfer the same address map to the even-number triangle.
7. Notice that the wide-row challenge is a different triangle with square row ends.

## Video Structure

| Scene | Time | Purpose | Visual | Voiceover |
|---|---:|---|---|---|
| 1. New Map | 0:00-0:13 | Separate this chapter from Pascal Triangle | Ordinary triangle and even triangle side by side | "This is not Pascal Triangle. This chapter is about addresses." |
| 2. Row Ends | 0:13-0:28 | Show row lengths and last numbers | Highlight row 4 ending at 10 | "Row 4 has four seats. Its last number is the total of 1 + 2 + 3 + 4." |
| 3. Seat Value | 0:28-0:44 | Teach `T_(r-1) + k` | Row 21, seat 5 example | "Count everything before the row, then step into the row." |
| 4. Reverse Address | 0:44-1:00 | Teach value -> row + position | Value 60 trapped between 55 and 66 | "Find the two row-end numbers that surround it." |
| 5. Row Sum | 1:00-1:14 | Teach row total | Row 10 from 46 to 55 | "Use first plus last, times number of seats, divided by two." |
| 6. Even Twin | 1:14-1:30 | Transfer to even triangle | Ordinary address map doubled | "The even triangle uses the same seats, but the values are doubled." |
| 7. Wide Challenge | 1:30-1:44 | Warn that a similar triangle may use another map | 1 / 2 3 4 / 5 6 7 8 9 | "This row pattern ends at squares, not triangular numbers." |
| 8. Ready | 1:44-1:52 | Move to practice | Skill checklist | "Now train the map." |

## Full Voiceover Draft

This chapter looks a bit like Pascal Triangle, but the rule is completely different.

In Pascal Triangle, a number is made from the two parents above it.

Here, the numbers are simply placed row by row:

```text
1
2 3
4 5 6
7 8 9 10
```

So think of every number as having an address: row and seat.

Row 4 has four seats, and its last number is 10.

Why 10? Because by the end of row 4, we have placed:

```text
1 + 2 + 3 + 4 = 10
```

That is why row ends are triangular numbers:

```text
1, 3, 6, 10, 15...
```

To find a seat, count all the numbers before the row, then move into the row.

For example, the 5th number in row 21:

before row 21 there are:

```text
1 + 2 + ... + 20 = 210
```

Then step 5 seats into the row:

```text
210 + 5 = 215
```

To work backwards, trap the number between row ends.

For 60:

```text
55 < 60 <= 66
```

So 60 is in row 11.

It is 5 after 55, so it is the 5th number in row 11.

The even-number triangle uses the same address map:

```text
2
4 6
8 10 12
14 16 18 20
```

Every ordinary value is doubled.

So if you are given 80, divide by 2 first.

```text
80 / 2 = 40
```

Find the address of 40 in the ordinary triangle, then keep that same address in the even triangle.

One warning: the wide challenge triangle is different.

Its rows have 1, 3, 5, 7 seats, so its row ends are square numbers:

```text
1, 4, 9, 16...
```

In practice, first ask: which triangle am I in?

Then choose the map.

## Acceptance Gate

The intro is blocked if:

- it treats this as Pascal Triangle
- it does not show the actual consecutive triangle
- it does not teach row and position as an address
- it introduces formulas before the visual row-count idea
- it omits the even-number transfer
- it fails to warn that the wide-row challenge is a different map
