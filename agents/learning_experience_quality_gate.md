# Learning Experience Quality Gate

Date: 2026-04-29

Purpose: prevent future modules from shipping as mechanically correct but pedagogically weak.

This gate is required before any intro, lesson video, or playable skill pack is released.

## Why This Exists

The Pascal Triangle intro exposed several quality failures:

- narration felt mechanical rather than like teaching
- key skills were not named clearly
- the actual mathematical object was not visible enough
- storyboard items were not presented clearly
- the layout could require unwanted scrolling
- the bridge from parent sums to consecutive sums was not visual enough
- the intro over-focused on one prerequisite and under-signalled the wider skill set
- the video artifact was separate from the training app

## Required Checks

### 1. Named Skill Contract

Before the intro starts, the learner must see the named skills they are about to train.

For Pascal Triangle:

- Parent Rule
- Edge One
- Second-Step Count
- Third Stair / running total bridge
- Row Doubler
- Reverse row questions

### 2. Actual Object Visibility

The main object of study must appear early and repeatedly.

For Pascal Triangle, the actual triangle must be visible in the first minute. A formula-only or card-only intro fails this gate.

### 3. Visual Bridge Before Formula

No formula can appear until the child has seen why it is needed.

For Pascal Triangle:

```text
parent sums
-> third diagonal
-> running total
-> shortcut formula
```

### 4. Storytelling Voice

The voiceover must sound like a teacher guiding a child, not a technical checklist.

Minimum standard:

- opens with purpose
- uses short sentences
- names what to look at
- says why the move matters
- connects each scene to the next
- ends with a clear action

Browser speech synthesis may be used only as an explicit fallback, off by default. A production release should use NotebookLM export, recorded narration, or another natural-voice pipeline.

If the app promises narration or an intro video with sound, the release must include a narration delivery check:

- every intro scene has a real audio asset or approved external audio source
- the app has an actual audio player, not only `speechSynthesis`
- browser speech synthesis remains a fallback only
- module tests verify scene-to-audio mapping and non-empty audio assets
- browser QA or manual sign-off confirms the player reaches a playing state

### 5. Storyboard Readability

Storyboard steps must be scannable.

Each step needs:

- short title
- one-line purpose
- visible current state
- no dense paragraph labels

### 6. Viewport Fit

The first screen must fit standard laptop width without horizontal scrolling.

Required:

- no fixed layout wider than viewport
- `minmax(0, 1fr)` for flexible grid tracks
- responsive single-column layout under tablet width
- static smoke check for key containers
- visual QA screenshot before release when browser automation is available

### 7. Integrated Learning Flow

The video/intro must be part of the training app, not a separate artifact the learner must open manually.

Required routes:

```text
Watch intro
Train now
Return to intro
Start exercises
```

### 8. Exercise Alignment

Every intro skill must map to at least one exercise, hint, or recap item.

Every exercise must map back to one intro skill or prerequisite.

### 9. Diagram Label Anchoring

Every diagram label must sit next to the exact mathematical object it describes.

For angle diagrams:

- draw the angle mark or sector at the true vertex/intersection
- check that the marked sector visually matches the labelled value: acute with acute, obtuse with obtuse, and supplementary partners on the correct other side
- generated angle diagrams must derive their geometry from the generated value, or use a neutral non-scale mark that cannot imply the wrong angle size
- if the source question depends on named points or a specific construction, the diagram must preserve those point relationships rather than using a generic sketch
- place the number, letter, or expression within the marked angle region or immediately beside it
- never use a floating bubble that could belong to a different angle
- for F, Z, C, and double-Z diagrams, every labelled angle must be visually anchored to its own intersection
- visual QA must inspect initial, hint, and worked states

If a child could reasonably ask "which angle is that label for?", the module fails this gate.

### 10. Question Variety And Interest

The practice round must preserve the most interesting source question forms, not only the easiest rule drills.

Required:

- include the chapter's warmup/prerequisite formula when it is a valuable method
- include direct, reverse, and transfer questions when the source uses them
- include expression targets such as `a + b` when the source asks for them
- include at least one multi-step challenge if the source contains multi-step competition examples
- include shape-combination questions when the source teaches common shape angles

## Go / No-Go

Block release if any are true:

- the intro does not show the actual mathematical object
- a core formula appears before its visual reason
- key skills are unnamed
- layout horizontally overflows
- video is not integrated into the practice app
- exercise set tests skills not introduced or named
- audio or narration is promised but no real asset/player check proves it can be heard
- the "bridge" scene cannot be explained by an 11-year-old in one sentence
- labels are not anchored to the exact angle, row, point, or shape they describe
- an angle value is placed on the wrong supplementary side, such as labelling the `71°` sector as `109°`
- a named source construction is replaced by a generic diagram that changes the mathematical relationships
- source challenge questions are flattened into only one-step drills
- a valuable formula appears only as an alternative method when the book uses it as a primary method

## New Agent

### Learning Experience QA Agent

```text
You are the Learning Experience QA Agent for an edtech maths tool.

Your job is to reject learning experiences that are mathematically correct but pedagogically weak.

Audit:
- named skills
- object visibility
- visual bridge before formula
- storytelling voice
- storyboard readability
- viewport fit
- integrated app flow
- exercise alignment
- diagram label anchoring
- source challenge coverage and question variety

Lead with findings. For each issue give:
- severity
- location
- why it harms learning
- exact fix required

Do not approve the module unless the intro and the exercises feel like one coherent learning journey.
```
