# Source extract: Train Problems

**Book section:** Year 6 "M" workbook, **Lesson 22 — Train Problems**
**Printed pages:** 46–58 **(PDF pages 56–68 of `Y6-M-L19-28(1) (2).pdf`; PDF index = printed page + 10)**
**Source PDF copied into repo:** `modules/train_problems/source/Y6-M-L19-28_lesson22_train_problems.pdf`
**Bounded by:** Lesson 21 before, Lesson 23 "Calculating with Formulas" after (printed p.59 / PDF p.69), confirming the lesson ends at printed p.58.

## Core idea taught

The distance a train travels is measured **from the front of the train**, so the train's own length always matters.

1. **Passing a point object** (pole / signpost / tree / telegraph pole — width ignored): distance travelled = **train length**.
2. **Crossing a bridge / tunnel / viaduct** (object with its own length): distance travelled = **train length + structure length** (the train is clear only when its tail leaves the far end).
3. **Two crossings at the same speed**: write `train + structure = speed × time` for each, then **subtract to eliminate the train length** and solve for speed; back-substitute for the length.
4. **Double-speed variant**: the second crossing is at twice the speed — build two equations (`L + b1 = v·t1`, `L + b2 = 2v·t2`) and solve.

There is **no printed answer key** in the workbook (one "Pip's answer" spot-the-error prompt aside); all answers below are computed.

## Named classics → question bank

| classic id | registry skill | what it drills | representative source items |
|---|---|---|---|
| `pass-marker` | Pass the marker | time/length/speed when passing a point object; distance = train length | Learn & Discover telegraph pole (250 m @ 25 m/s → 10 s); Exploration 1 (50 m/s, 15 s → 750 m); Further Ex. 1–2 |
| `clear-bridge` | Clear the bridge | time to fully cross = (train + bridge) ÷ speed | Exploration 2 (450 m train, 1350 m bridge, 18 m/s → 100 s); Homework 2 (2600 m bridge → 150 s) |
| `bridge-speed` | Bridge speed | speed = (train + bridge) ÷ time | Exploration 2 (120 m, 720 m, 40 s → 21 m/s); Practice (170 m, 460 m, 35 s → 18 m/s); Reasoning "Pip" |
| `find-train` | Find the train | train length = speed × time − bridge | Exploration 3 Colne Valley Viaduct (3.4 km, 73 m/s, 50 s → 250 m); Homework 3 (→ 1790 m bridge); Further Ex. 6 |
| `two-bridge` | Two-bridge solve | subtract two same-speed crossings to cancel train length → speed | Exploration 4 (600 m/39 s, 840 m/51 s → v=20, L=180); Homework 5 (480/30, 810/45 → v=22, L=180) |
| `double-speed` | Double-speed crossing | second crossing at double speed; two-equation solve for train length | Challenge (100 m/15 s, 150 m/2× /10 s → L=50); Extensive Ex. 2 (400 m/40 s, 700 m/2× /30 s → v=15, L=200) |

All bank data uses integer-clean variants verified to be internally consistent. Three printed items (Further Ex. 10, Extensive Ex. 3, and a labelled slip in the lesson's worked "Pip" reasoning) contain apparent typos that yield non-positive lengths/speeds as printed — these were **excluded** from the bank in favour of consistent values; see the extraction notes for the flagged numbers if the teacher's key surfaces.

## Lesson navigation in the source

- Let's Get Ready (printed p.47): cyclist/motorbike/car warm-ups (point vs bridge).
- In Class: Learn & Discover (pole, then bridge, then tunnel), Explorations 1–4, Practice, Challenge, Reasoning ("Is Pip correct?").
- After Class: Teaching Time, Homework 1–5.
- Further Exercises: Basic 1–3, Further 4–10, Extensive (Optional) 1–3.
