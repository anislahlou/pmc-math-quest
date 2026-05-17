# Triangles With Equal Height - Source Extract And Agent Scope

## Source Status

The source PDF pages available in the workspace are image-only through the current tooling. I attempted a visual extraction pass, but the local extraction route exposed only page decoration layers rather than the full rendered pages. This module is therefore released as a **source-informed archetype module**, not as an exact page-replica module.

This extract uses:

- existing source-backed Triangle Sides and U2T2 area work in this repository;
- the agent-source-miner scope for equal-height triangle reasoning;
- an explicit source caveat in every generated problem.

The current bank avoids pretending to have exact page-level extraction where the tool could not verify it. Source Diagram Fidelity applies here as construction fidelity: base labels, height markers, parallel-line relationships, split bases, and shaded differences are mechanically checked, while exact source-page replication is explicitly not claimed.

## Learning Outcome

Students learn to identify triangles with the same perpendicular height, then use that fact to compare areas, prove equal areas, reverse missing bases or heights, and handle challenge diagrams with split bases, parallel lines, shaded differences, and algebraic targets.

## Grand Classics

| Grand Classic | Nickname | Skill Tested | Rule |
|---|---|---|---|
| Area Formula | Half Rectangle | Use base and perpendicular height to find area. | Area = base x height / 2 |
| Equal Height Ratio | Base Ratio Mirror | Compare areas using base ratio when height is shared. | Same height -> area ratio = base ratio |
| Same Base Same Height | Sliding Apex Twin | Recognise equal area despite different-looking shapes. | Same base + same height -> equal area |
| Reverse Formula | Double Then Divide | Find missing base or height from area. | Missing length = 2 x area / known length |
| Multi-Triangle Compare | Area Order Line | Rank or calculate areas across several same-height triangles. | Area order follows base order |
| Split Base | Split Base Shares | Use a common apex over split base segments. | Area split follows base split |
| Compound Difference | Shaded Difference | Subtract two same-height triangle areas. | Difference = base difference x height / 2 |
| Algebra | Expression Area Chase | Convert equal-height area facts into equations. | Equal height removes the shared 1/2 x height factor |
| Equal Area Reverse | Equal Area Equal Base | Infer matching bases from equal area and equal height. | Same height + equal area -> equal base |
| Diagram Reading | Height Detective | Avoid using slanted sides as height. | Height must be perpendicular |

## Diagram Fidelity Requirements

- Every base label must sit on the exact base segment.
- Every height label must attach to a perpendicular line and right-angle mark.
- Parallel-line diagrams must show both parallel guides.
- Initial diagrams must not show derived answers or hidden heights when the task is to notice them.
- Hint state reveals height first; worked state shows formula or ratio reasoning after the visual reason.
- Challenge diagrams keep the construction type: split base, between parallels, nested/shaded, or expression-labelled base.

## Question Bank Minimum

The bank audit generates 24 routine variants per classic and 12 challenge variants. The challenge layer includes:

- hidden split base;
- total area split by ratio;
- equal-area expression solving;
- reverse height from area ratio;
- shaded difference;
- a + b targets;
- equal-area but different-height reverse;
- diagram-only ratio;
- false-friend sloping-side traps;
- reverse total with x and x + 6;
- select-all equal-area pairs;
- area-to-base ratio backwards.
