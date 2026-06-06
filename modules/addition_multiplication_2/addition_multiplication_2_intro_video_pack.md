# Principle of Addition and Multiplication (2) Intro Video Pack

Mission: Lesson 21 - Principle of Addition and Multiplication (2)

## Learning Outcome

TODO: Describe what the learner can do by the end of the intro video for Principle of Addition and Multiplication (2). Write at least one full sentence that captures the named skills children should master before practice begins. Replace this placeholder once the real learning outcome is settled.

## Named Skills Shown Before Practice

- Placeholder skill

TODO: list the real named skills here, one per line. Each named skill should also appear in the storyboard below and in the registry skills array.

## Storyboard

1. **Placeholder skill — intro step 1**
   Placeholder purpose — replace this text with what scene 1 teaches in the final video.
   Voiceover: This is a placeholder voiceover for scene 1. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next.

2. **Placeholder skill — intro step 2**
   Placeholder purpose — replace this text with what scene 2 teaches in the final video.
   Voiceover: This is a placeholder voiceover for scene 2. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next.

3. **Placeholder skill — intro step 3**
   Placeholder purpose — replace this text with what scene 3 teaches in the final video.
   Voiceover: This is a placeholder voiceover for scene 3. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next.

4. **Placeholder skill — intro step 4**
   Placeholder purpose — replace this text with what scene 4 teaches in the final video.
   Voiceover: This is a placeholder voiceover for scene 4. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next.

5. **Placeholder skill — intro step 5**
   Placeholder purpose — replace this text with what scene 5 teaches in the final video.
   Voiceover: This is a placeholder voiceover for scene 5. Replace it with at least twenty five words of teacher narration that describes the visual idea on screen and tells the child what to look for next.


TODO: replace each storyboard scene with the real visual beat for Principle of Addition and Multiplication (2). Keep one scene per named skill. Each scene's voiceover should be at least twenty five words so the intro-pack lint passes.

## Warmup Gate

Before full practice, the learner should answer:

1. TODO: replace this warmup question with a real prompt that previews the first named skill in Principle of Addition and Multiplication (2).
2. TODO: replace this warmup question with a real prompt that previews the second named skill.
3. TODO: replace this warmup question with a real prompt that previews the third named skill.

## Misconception Risks

TODO: list the common misconceptions children bring to Principle of Addition and Multiplication (2). For example:

- TODO: write the first common pitfall a child might fall into here.
- TODO: write the second common pitfall a child might fall into here.
- TODO: write the third common pitfall a child might fall into here.

## Voiceover Draft

TODO: write the full voiceover draft for Principle of Addition and Multiplication (2). Each paragraph below maps to one storyboard scene and must contain at least twenty five words so the intro-pack lint accepts it as a real narration block instead of a placeholder.

This is a placeholder voiceover draft paragraph for scene one. Replace it with the real teacher narration that introduces Principle of Addition and Multiplication (2), names the first skill, and tells the child what to look at on screen during the opening beat of the intro.

This is a placeholder voiceover draft paragraph for scene two. Replace it with the real teacher narration that walks the child through the second named skill of Principle of Addition and Multiplication (2) and explicitly references the visual change happening on screen at this moment.

This is a placeholder voiceover draft paragraph for scene three. Replace it with the real teacher narration that walks the child through the third named skill of Principle of Addition and Multiplication (2) and explicitly references the visual change happening on screen at this moment.

This is a placeholder voiceover draft paragraph for scene four. Replace it with the real teacher narration that walks the child through the fourth named skill of Principle of Addition and Multiplication (2) and explicitly references the visual change happening on screen at this moment.

This is a placeholder voiceover draft paragraph for scene five. Replace it with the real teacher narration that walks the child through the fifth named skill of Principle of Addition and Multiplication (2) and explicitly references the visual change happening on screen at this moment.

## Notes For The Scaffolder

This intro pack was generated by scripts/new-module.mjs. Every TODO above must be replaced before the module is flipped to status="published" in modules/registry.json. The pack must continue to clear qa/intro_pack_lint.js and qa/skill_coverage_lint.js after edits.

The placeholder bank in addition_multiplication_2_module.js exposes a single classic with id ending in "-placeholder" that returns "Placeholder skill" as its skillTag. The skill-coverage gate matches this skill against the storyboard scene titles above, so each storyboard line must keep "Placeholder skill" in its title until you swap in the real named skills.

The audit file addition_multiplication_2_bank_quality_audit.js iterates 16 variants per classic and checks that prompts vary, that at least two correct-choice positions are used, and that the initial visual never includes "Answer:". When you add real classics, copy this contract into the new classics so the audit continues to pass.

The tests file addition_multiplication_2_module_tests.js verifies INTRO_SCENES wiring: each scene's classicId must exist in CLASSIC_IDS, each title/purpose/caption/voiceover meets minimum lengths, and renderIntroScene returns an SVG with role="img". Keep these invariants when you replace the placeholders.

The card visual entry for cardVariant "addition-multiplication-2" still needs to be added to run/card_visuals.js. The diagram-parity gate compares the card SVG against the iconic classic's initial render; without a card entry the gate emits a SKIP, not a fail. Add the card before flipping status to "published".
