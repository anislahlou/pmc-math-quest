# Train Problems Intro Video Pack

Mission: Lesson 22 - Train Problems

## Learning Outcome

By the end of this intro video the learner can solve "train" motion problems by remembering that the distance a train travels is measured from its front, so the train's own length must be added to whatever it crosses. They can pass a point marker, clear a bridge or tunnel, find a speed, recover a hidden train length, and combine two crossings to solve for an unknown — including the case where the second crossing happens at double the speed.

## Named Skills Shown Before Practice

- Pass the marker
- Clear the bridge
- Bridge speed
- Find the train
- Two-bridge solve
- Double-speed crossing

Each named skill below appears as one storyboard scene, one intro-scene title in the module JS, and one entry in the registry skills array, so the vocabulary stays identical everywhere the child meets it.

## Storyboard

1. **Pass the marker**
   Purpose: show that a train passing a point object only travels its own length.
   Voiceover: Start with the simplest case. When a train passes a pole, a tree or a signpost, the marker has no width, so the train is clear the moment its back end goes past, which means the distance travelled is exactly the train's own length.

2. **Clear the bridge**
   Purpose: give the obstacle a length and add it to the train length.
   Voiceover: Now give the obstacle a length of its own. To completely cross a bridge or a tunnel, the front goes all the way over and then the tail still has to leave the far end, so the train travels its own length plus the whole bridge length.

3. **Bridge speed**
   Purpose: divide the total distance by the time to find the speed.
   Voiceover: Speed problems reuse the same total distance. Add the train length to the bridge length to get the distance the train covers, then divide that distance by the crossing time, because distance divided by time always gives the speed in metres per second.

4. **Find the train**
   Purpose: work backwards from speed and time to the hidden train length.
   Voiceover: Sometimes the train length is the mystery. Multiply the speed by the time to get the whole distance travelled, then remember that total is the train plus the bridge, so subtract the bridge length and the number left over is the length of the train itself.

5. **Two-bridge solve**
   Purpose: subtract two same-speed crossings so the train length cancels.
   Voiceover: Here is the clever step that unlocks the hard questions. The same train crosses two different bridges at the same speed, so write distance equals speed times time for each crossing, then subtract one from the other and watch the unknown train length cancel out, leaving just the speed.

6. **Double-speed crossing**
   Purpose: use two equations when the second crossing doubles the speed.
   Voiceover: The hardest case changes the speed between crossings. The first crossing uses one speed and the second uses double that speed, so write an equation for each, remember to double the speed in the second one, then combine the two equations to find the speed first and the train length second.

## Warmup Gate

Before full practice, the learner should answer:

1. A train 200 m long passes a signpost at 20 m/s. How long does that take, and why is the distance just the train length?
2. A train 100 m long crosses a 400 m bridge. How far does the front of the train travel before the whole train is clear of the bridge?
3. Two bridges are crossed by the same train at the same speed. Why does subtracting the two crossings let you ignore the train's length?

## Misconception Risks

These are the common pitfalls children bring to train problems:

- Forgetting the train's own length and using only the bridge length, like Pip in the lesson who wrote 500 ÷ 25 instead of (500 + 75) ÷ 25.
- Treating a pole or tree as if it had a length, and adding something extra when passing a point marker.
- Forgetting to double the speed on the second crossing in the double-speed questions, or doubling the time instead of the speed.
- Mixing up metres and metres-per-second, or leaving an answer in seconds when minutes and seconds were asked for.

## Voiceover Draft

This is the full voiceover draft. Each paragraph maps to one storyboard scene and is written to be read aloud to an eleven or twelve year old, naming the skill and pointing at what changes on screen during that beat of the intro.

Pass the marker. When a train passes a pole, a tree or a signpost, the marker has no width, so the train is clear the moment its back end goes past. Watch the orange train slide past the post: the distance it covers is exactly its own length, nothing more.

Clear the bridge. Now the obstacle has a length of its own. To completely cross a bridge or a tunnel, the front travels all the way over and then the tail still has to leave the far end, so the whole journey is the train length plus the bridge length added together.

Bridge speed. Speed is found the same way it always is, distance divided by time. Add the train length to the bridge length to build the total distance, then divide by the seconds the crossing took, and the answer comes out in metres per second every time.

Find the train. When the train length is hidden, multiply the speed by the time to get the total distance. That total is the train plus the bridge, so subtract the bridge length you were given and the number that remains is the length of the train you were searching for.

Two-bridge solve. The same train now crosses two different bridges at the same speed. Write distance equals speed times time for each crossing, line them up, and subtract one from the other. The matching train length cancels out, and the speed is left sitting on its own ready to read off.

Double-speed crossing. In the toughest puzzles the second crossing is faster, at double the speed. Write one equation for the first crossing and one for the second, doubling the speed in the second equation, then combine them to find the speed first and finally the length of the train.

## Notes For The Author

Audio narration files are optional for this module. When recorded, drop one `.wav` per scene into the `audio/` folder and add an `audio` field to each INTRO_SCENES entry; until then the app falls back to the browser speech engine and the narration text on screen.
