# Motion learnings

Everything this prototype has been told and has learned about motion, in one place. The rules come from the `motion` skill ([.agents/skills/motion/SKILL.md](../../.agents/skills/motion/SKILL.md)) and the Iris motion tokens. The rest is what we found when we built it. Written so the same choices can be reused in the next prototype.

## Direction

1. **Motion explains a change.** If it does not help the user see what changed, do not add it. It is functional, fast, consistent and subtle.
2. **Iris motion tokens only.** Never write a duration or an easing as a raw number or `cubic-bezier(...)` in a component. If a token is missing, say so (see "Token gaps").
3. **Enter and exit use their own tokens.** Entry takes `--oi-motion-ease-enter` (sheets: `--oi-motion-ease-drawer`) and the longer duration. Exit takes `--oi-motion-ease-exit` and a shorter one. Both directions animate: a prompt that only animated the exit had to be repeated for the entry.
4. **Opacity and transform first.** A small movement (about 8px) plus a fade is the default. Layout properties are only animated where there is no transform equivalent (the sidebar's `width`, an accordion's `height`, the filter row's grid rows).
5. **Every animation has a reduced-motion version.** Under `prefers-reduced-motion` it fades with no movement, or does not animate. It is gentler, not a different design.
6. **Never ship:** `transition: all`, a `scale(0)` entrance, the built-in `ease-in` on UI, or a forked copy of an Iris curve. `pnpm -s motion:lint` in `src/iris-shell` fails on all four.
7. **Keyboard actions done many times a day stay unanimated** (⌘K, ⌘B, ⌘/).
8. **Done means:** system tokens, the same behaviour as the rest of the UI, performance checked, reduced motion in place.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--oi-motion-duration-snap` | 0ms | no animation |
| `--oi-motion-duration-short` | 120ms | hover and press feedback, small state changes |
| `--oi-motion-duration-default` | 200ms | exits, panels opening or closing a row |
| `--oi-motion-duration-long` | 280ms | entries of sheets, toasts and the action bar |
| `--oi-motion-duration-loop` | 1000ms | loops such as spinners |
| `--oi-motion-ease-default`, `-enter`, `-exit` | `cubic-bezier(0.23, 1, 0.32, 1)` | all resolve to the emphasized curve |
| `--oi-motion-ease-emphasized` | `cubic-bezier(0.23, 1, 0.32, 1)` | the strong ease-out used for UI |
| `--oi-motion-ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | side sheets |
| `--oi-motion-ease-none` | `linear` | loops |

The Motion section of the ARS Storybook (Motion/Tokens and Motion/Usage, in [src/ars-ui/src/motion](../../src/ars-ui/src/motion)) shows the live values, each curve and which tokens each component uses.

## How each piece moves

| Piece | Enter | Exit | Reduced motion |
|---|---|---|---|
| Side sheet | `--oi-motion-ease-drawer`, `--oi-motion-duration-long` | `--oi-motion-ease-exit`, `--oi-motion-duration-default` | fade |
| Toast | flies in from the right edge: `--oi-motion-ease-enter`, `--oi-motion-duration-long` | flies back out: `--oi-motion-ease-exit`, `--oi-motion-duration-default` | fade, no movement |
| Action bar | flies up from the bottom edge, same tokens as the toast | flies back down | fade, no movement |
| Ask-AI panel | fades and slides 8px on the enter token | the same on the exit token, stays mounted (inert) while closing | off |
| Filter row under the toolbar | opens by height on `--oi-motion-ease-emphasized`, `--oi-motion-duration-default`, so the table glides down | closes the same way, so the table glides up | no transition |
| Card reveal (Insights, Identity Manager, Identity Insights) | `--oi-motion-ease-enter`, 500ms with a 40ms stagger | | |
| Iris UI Kit filter parts (`src/iris-new`) | hover and press on `--oi-motion-duration-short` and `--oi-motion-ease-default` | | transitions off |

## Learnings

1. **A sheet that mounts already open never animates.** The side sheet's slide did not play until it started from `@starting-style`.
2. **Unmount delays come from the token.** The side sheet unmounted after a fixed 200ms against a 280ms slide, and the action bar's exit delay was a hardcoded 180ms. Read the duration from the token (`motionDurationMs` in `src/iris-shell/src/lib/motion.ts`) so the delay and the animation cannot drift apart. It accepts both `200ms` and the `.2s` a CSS minifier writes.
3. **A synchronous render can skip the entry.** The toast is shown through a store update that renders at once, so the "visible" flip could happen before the starting position was painted. It now waits one painted frame.
4. **One hovering layer at a time.** While a side sheet is on screen the action bar flies out, and it flies back in when the sheet goes. The selection is kept, and Esc then closes the sheet without clearing it. `lib/sideSheetStore.ts` tells the bar a sheet is mounted.
5. **A closing panel stays mounted but inert,** so it can animate out and cannot take focus.
6. **Animate a row's height with grid rows.** The filter row uses `grid-template-rows: 0fr` to `1fr` with an inner box that clips. While closed, a negative top margin cancels the card's gap, so the layout matches having no row. The inner box has padding so focus rings are not cut off.
7. **Sticky is not motion, but it shares the scroll container.** Sticky pagination and the sticky table head only work against the container that actually scrolls. A table that sets `overflow: auto` without a height limit becomes a scroll container that never scrolls, and sticky stops working inside it.
8. **A forked curve is a bug.** The card reveal used its own copy of `cubic-bezier(0.22, 1, 0.36, 1)` that came with the Iris packages. It now uses `--oi-motion-ease-enter`.
9. **A slower token is a token swap, not a new number.** When an animation feels too fast, move up a duration token (`short`, `default`, `long`) instead of typing a longer time.
10. **Check the motion tokens in Figma first.** For resizing something vertically the Figma asks for the motion-move easing, not a default transition (see "Token gaps").

## Token gaps

1. `--oi-motion-ease-move` is listed in the motion skill but is not defined in the tokens.
2. The Checkbox's 80ms delay and the AI shimmer's 2000ms have no matching duration token.
3. The card reveal's 500ms duration and 40ms stagger have no matching tokens.
4. The Iris "emphasis" easing for the filter badge is not in the project yet. Until it is, use `cubic-bezier(0.34, 1.56, 0.64, 1)` and say where it is used.
5. The tab underline was left as it was, on request.
6. Chart draw motion comes from the Iris charts. Do not rebuild it.

## Prompts that worked

Phrases that produced the right result, from [example-prompts.md](../../example-prompts.md):

1. "Do you see the motion tokens in Iris? If so, add smooth but sharp motion the enter/exit tokens so the filter side-sheet smoothly slides in and out."
2. "The motion token used is too fast, use a slower one. Also, it is only happening on exit, not entry, add that too."
3. "Add motion to the open/close of accordions, use Iris motion tokens for entry/exit respectively."
4. "Check the motion design tokens in Figma for this — it should use the motion-move easing token when resizing [element] vertically, not a default transition."
5. "Use the draw chart motion built into Iris."

## Where it lives

1. Skill: [.agents/skills/motion/SKILL.md](../../.agents/skills/motion/SKILL.md)
2. Helpers: `src/iris-shell/src/lib/motion.ts`
3. Lint: `src/iris-shell/scripts/motion-lint.ts`, run with `pnpm -s motion:lint`
4. Storybook: `src/ars-ui/src/motion`
5. History: [history.md](../../history.md), "5. Iris motion tokens", "10 Nov: motion lint and the Motion section", "12 Nov: toast flies in and out"
