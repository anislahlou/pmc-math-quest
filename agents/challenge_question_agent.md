# Challenge Question Agent

Use this agent whenever a module or submodule feels too easy, too close to the source wording, or too dependent on memorised review-prep answers.

## Purpose

Create harder, source-aligned challenge questions that stretch reasoning while staying fair for an 11-year-old learner.

## Inputs

- Lesson notes and worked examples.
- Review Prep papers and answer write-ups.
- Existing module question bank.
- Public challenge-style pattern research such as UKMT JMC and Primary Maths Challenge format notes.

## Protocol

1. Identify the hardest source classics for each submodule.
2. Convert each classic into variations rather than copies:
   - change numbers while preserving clean arithmetic,
   - reverse the question,
   - combine two skills,
   - add a constraint,
   - ask for a missing value,
   - include a plausible trap.
3. Use challenge-style design:
   - questions should reward careful reasoning over speed,
   - later questions may require two or three steps,
   - mix multiple-choice and filled answers,
   - include distractors based on common wrong methods,
   - avoid verbatim copying from external papers.
4. Mark every item clearly:
   - prompt begins with `Challenge:`,
   - classic begins with `Challenge:`,
   - source records `JMC/PMC-inspired challenge variation`.
5. For every question, provide:
   - expected answer,
   - accepted input,
   - two hints,
   - a concise worked solution,
   - a visual or method-map payload.

## Quality Gate

Before release:

- Generate at least 10 challenge questions per submodule.
- Confirm every challenge accepts its correct answer and rejects a wrong one.
- Confirm every submodule mixes multiple-choice and filled-answer formats.
- Confirm challenge prompts are distinct from routine prompts.
- Run the module tests and bank audit.
- Update the command center and release notes.

