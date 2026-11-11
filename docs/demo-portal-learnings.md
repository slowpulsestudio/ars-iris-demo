# Demo portal learnings

What we learned from the pages around the prototype: the welcome page, the Storybooks, the Design review tasks list and the "Components not in Figma" page. Written so the same pieces can be reused in the next prototype. Where a point is a suggestion, not something already built, it says so.

## What the portal is

The prototype opens on a welcome page, not on the product. From there a reviewer can sign in as a persona, open the Storybooks, or open Design review. All of these pages share one layout (`views/ChoicePage`): a title, a subtitle, an optional Back button and a row of big cards. A new portal page is a few lines: a list of cards.

1. **Welcome page** (`#/welcome`, `views/WelcomePage`). One card per persona. Picking one signs in as that person and opens their start page. It also stands in for any address until a persona is picked, so a link such as `#/users` shows the picker first and then keeps the page that was asked for. The two icon buttons top right (Design review, Storybooks) are the only way to the other portal pages.
2. **Storybooks page** (`#/storybooks`, `views/StorybooksPage`). One card per Storybook, each opening in a new tab. The list lives in `lib/storybooks.ts`.
3. **Design review** (`#/components-to-review`, `views/ReviewHubPage`). A hub with two cards: Components not in Figma, and Design review tasks.
4. **Components not in Figma** (`#/components-to-review/missing`). One card per component the screens use that the Figma kit lacks, each linking to the Figma node it was drawn from. The list lives in `ars-ui/src/missingFromFigma.ts`.
5. **Design review tasks** (`#/components-to-review/tasks`). The checklist, read from `docs/review-notes.md`.

## Storybook

1. **A link to `127.0.0.1` is a bug on Vercel.** The Storybooks page first linked to the local dev servers. On a deployed site that gives "connection refused", because the address is the visitor's own computer. The Storybooks must be built as static files and shipped with the site.
2. **How it works now.** `scripts/build-storybooks.mjs` builds both Storybooks into `dist/storybook/iris` and `dist/storybook/ars`; `vercel.json` runs it after the app build. Links use the local servers in development and `/storybook/...` in a deployed build.
3. **"The build finished" is not "it works".** For a long time the only check was that `build-storybook` ended without errors. Nobody opened the result. The fix was checked by serving the built folder and requesting each Storybook's page, frame and story list. Next time, check from the deployed address as soon as the first deploy is up.
4. **Each Storybook is its own project** with its own packages and lock file, so the build installs each one first. This makes the deploy slower. Suggestion: if it gets too slow, put the Storybooks in their own Vercel project and link to that address.
5. **Stories tagged `missing-from-figma`** are the ones the Missing page lists, and the kit check (`pnpm check` in `src/ars-ui`) fails if a component is in one place and not the other. Keep that check; it stops the two lists drifting.
6. **A Storybook is the fastest design review.** Reviewers can see every state of a component without clicking through the app. Suggestion: add the Figma node link to each story's description (most ARS stories already do).

## Welcome page

1. **Personas as the front door.** Choosing who you are first means every later page can show the right navigation, and a review link works for any persona. Each persona is one JSON file (`lib/personas/`) with a name, title, scenario text and start page.
2. **Persona links.** An address can start with a persona id: `#/admin-user/groups` signs in as David Smith and opens Groups, in a browser that has never seen the app. `#/admin-user` alone opens that persona's start page. An address with no persona (`#/groups`) still shows the picker first. The review notes use plain addresses and the Design review tasks page adds the persona per flow (a `Persona:` line under the flow heading, `admin-user` by default). The first version of the Prototype links skipped this and every link landed on the persona picker.
3. **Reviewer tools sit outside the product.** The two icon buttons are in the top corner of the welcome page, away from the product screens, so the prototype itself looks like the real product.
4. **Suggestion:** a "Reset" button on the welcome page that clears the saved persona and sample data. Today a reviewer has to clear browser storage by hand, and a stale persona is the most common reason a screen "doesn't match".
5. **Suggestion:** show the build date or commit on the welcome page, so a reviewer can tell whether Vercel has the latest push.

## Design review tasks list

1. **The checklist is a markdown file** (`docs/review-notes.md`), one section per flow, in the order Where / Compare with Figma / Confirm. The page reads and displays it, so the designer and the AI assistant edit the same file.
2. **Ticking writes back to the file, but only locally.** While the dev server runs, a tick edits the file. On Vercel the page can't write, so ticks are kept in the reviewer's browser only and are lost if they clear it. Suggestion: a "Copy my notes" button on the deployed page, so a reviewer can send their ticks back.
3. **Every item should link to its screen.** The most useful change was adding a **Prototype** link beside each Figma link. Without it, reviewers had to work out which screen an item meant. Links use sample objects whose addresses are the same every load (for example Isabella Clark, Security Users, Test OU), so they don't go stale.
4. **Say what to click.** For a dialog or a menu, the link can only open the page it starts from, so the item adds the click path ("the arrow beside Create, New Group").
5. **Keep links plain.** The page shows only bold, code and links. A link label can't contain backticks, or the backticks show on screen.
6. **Split "compare" from "confirm".** Compare items are things a reviewer can check against Figma. Confirm items are decisions where Figma was silent. The second list is where the real design questions are, and it grows with every review. Mark new ones (we used **New:**) so they can be found.
7. **Checked on screen vs not.** The file says which flows were compared in a browser and which weren't. Without that line a reviewer assumes everything was checked.
8. **Suggestion:** a count per flow ("4 of 9 done") on the hub, and a filter for unticked items, so a reviewer can pick up where they stopped.
9. **Stale text.** The hub still says "What to check in the ARS_WebUI2_CRUD screens", although it now covers six Figma files. Update it when the next file is added.

## Components not in Figma page

1. **Why it exists.** The screens need parts the ARS kit in Figma doesn't have (dialogs, toasts, tables). Rather than hide that, each is built, tagged and listed with the Figma node it was drawn from, so the design team can decide whether to add it to the kit.
2. **One entry per component** in `missingFromFigma.ts`: the code folder, the Figma layer name and node, the file it came from, and a note on what the kit lacks. The page and the Storybook group both read this one list.
3. **The note matters most.** "Drawn from the CRUD file; the kit's table has these columns instead" tells the design team the actual gap. Entries with only a node link get ignored.
4. **It is a to-do list for the design team,** not for the prototype. Suggestion: add a status per entry (to review, added to the kit, rejected) so the page shows what has been dealt with, and remove entries once the kit has them.
5. **Suggestion:** link each entry to the screens that use it (a Prototype link, like the review tasks), so the design team can see the component in context.
6. **Where the Figma file is wrong or silent,** that goes in the review notes, not here. This page lists components; the notes list decisions.

## Reuse in the next prototype

1. Copy `ChoicePage`, `WelcomePage`, `StorybooksPage`, `ReviewHubPage`, `ReviewTasksPage`, `ComponentsReviewPage`, `lib/reviewNotes.ts`, `lib/storybooks.ts` and `missingFromFigma.ts`.
2. Copy `scripts/build-storybooks.mjs` and `vercel.json`, and change the folder names to match.
3. Start `docs/review-notes.md` on day one and add a Prototype link to each item as the screen is built, not afterwards.
4. Check the deployed site, not just the local one, before telling the designer something works.
