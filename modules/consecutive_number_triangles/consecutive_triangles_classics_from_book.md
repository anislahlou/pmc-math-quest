# Consecutive Number Triangles Classics From Lesson 7

Source: `C:\Users\AnisLahlou\Downloads\Y6-M-Lesson 1-9-Vol.1.pdf`

Scope: Lesson 7, "Triangular Number Tables", PDF pages 104-114 / book pages 94-104. This module is a sibling of Pascal Triangle, not a Pascal Triangle extension.

## Main Ordinary Triangle

```text
      1
    2   3
  4   5   6
7   8   9   10
...
```

Rows have lengths `1, 2, 3, 4...`.

The last number in row `r` is:

```text
T_r = r(r + 1) / 2
```

The number in row `r`, position `k`, is:

```text
T_(r - 1) + k
```

## Even Number Triangle

```text
      2
    4   6
  8  10  12
14 16 18 20
...
```

This has the same row and position addresses as the ordinary triangle, but every value is doubled.

The number in row `r`, position `k`, is:

```text
2 x (T_(r - 1) + k)
```

To find the address of an even number, first divide by 2, then use the ordinary triangle address.

## Stretch Wide Triangle

The book also shows a wider triangular arrangement:

```text
Row 1:       1
Row 2:     2 3 4
Row 3:   5 6 7 8 9
Row 4: 10 11 12 13 14 15 16
```

Rows have lengths `1, 3, 5, 7...`.

The last number in row `r` is:

```text
r^2
```

The number in row `r`, position `k`, is:

```text
(r - 1)^2 + k
```

## Approved Classics

| ID | Nickname | Skill Tested | Rule | Book Evidence |
|---|---|---|---|---|
| `consecutive.row-length` | Row Has Row Count | Know how many numbers are in ordinary row `r`. | Row `r` contains `r` numbers. | PDF p.104 |
| `consecutive.row-end` | Row End | Find the last number in ordinary row `r`. | `T_r = r(r + 1) / 2`. | PDF p.104, p.105 |
| `consecutive.seat-value` | Find The Seat | Find position `k` in ordinary row `r`. | `T_(r - 1) + k`. | PDF p.105, p.106 |
| `consecutive.row-sum` | Whole Row Total | Add all numbers in ordinary row `r`. | First is `T_(r - 1) + 1`, last is `T_r`; average x count. | PDF p.105, p.112 |
| `consecutive.find-address` | Find The Address | Given a value, find its ordinary row and position. | Find `r` where `T_(r - 1) < value <= T_r`, then subtract `T_(r - 1)`. | PDF p.106, p.107, p.113 |
| `even.seat-value` | Even Twin Seat | Find position `k` in the even-number triangle. | Double the ordinary triangle value. | PDF p.107, p.113 |
| `even.find-address` | Even Twin Address | Given an even value, find row and position. | Divide by 2, then find ordinary address. | PDF p.107, p.114 |
| `wide.seat-value` | Wide Row Seat | Work in the 1, 3, 5, 7 row-length triangle. | `(r - 1)^2 + k`. | PDF p.108, p.114 |

## Child-Friendly Explainer Spine

1. This is a triangle of addresses: row number and seat number.
2. The row tells you how many seats are in that row.
3. The last number in a row is how many numbers have appeared so far.
4. To find a seat, count everything before the row, then step into the row.
5. To find an address, trap the value between two row-end numbers.
6. The even triangle uses the same address map, but every value is doubled.
7. The wide triangle is a different map: its row ends are square numbers.
