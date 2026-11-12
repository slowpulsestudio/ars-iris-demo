# Demo portal learnings

What we learned from the pages around the prototype: the welcome page, the Storybooks, the Design review tasks list and the "Components not in Figma" page, and from the sample content and placeholders reviewers see. Written so the same pieces can be reused in the next prototype. Where a point is a suggestion, not something already built, it says so.

## What the portal is

The prototype opens on a welcome page, not on the product. From there a reviewer can sign in as a persona, open the Storybooks, or open Design review. All of these pages share one layout (`views/ChoicePage`): a title, a subtitle, an optional Back button and a row of big cards. A new portal page is a few lines: a list of cards.

1. **Welcome page** (`#/welcome`, `views/WelcomePage`). One card per persona. Picking one signs in as that person and opens their start page. It also stands in for any address until a persona is picked, so a link such as `#/users` shows the picker first and then keeps the page that was asked for. The two icon buttons top right (Design review, Storybooks) are the only way to the other portal pages.
2. **Storybooks page** (`#/storybooks`, `views/StorybooksPage`). One card per Storybook, each opening in a new tab. The list lives in `lib/storybooks.ts`.
3. **Design review** (`#/components-to-review`, `views/ReviewHubPage`). A hub with three cards: Components not in Figma, Design review tasks, and Figma tidy-up.
4. **Components not in Figma** (`#/components-to-review/missing`). One card per component the screens use that the Figma kit lacks, each linking to the Figma node it was drawn from. The list lives in `ars-ui/src/missingFromFigma.ts`.
5. **Design review tasks** (`#/components-to-review/tasks`). The checklist, read from `docs/review-notes.md`. **Figma tidy-up** (`#/components-to-review/tidy-up`) is the same page for `docs/figma-tidy-up.md`: spelling, quote style and Figma files that disagree, for the designer to fix in Figma. Both are one page component (`ReviewTasksPage`) given a source.

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
2. **Ticking writes back to the file, but only locally.** While the dev server runs, a tick edits the file. On Vercel the page can't write, so ticks are kept in the reviewer's browser only and are lost if they clear it. Suggestion (done, "Copy my ticks" on both review pages): a button on the deployed page, so a reviewer can send their ticks back.
3. **Every item should link to its screen.** The most useful change was adding a **Prototype** link beside each Figma link. Without it, reviewers had to work out which screen an item meant. Links use sample objects whose addresses are the same every load (for example Isabella Clark, Security Users, Test OU), so they don't go stale.
4. **Say what to click, only when a link can't do it.** Most states now have an address: a tab, a card in edit mode, an open dialog or side sheet, ticked rows, an open request (`?tab=general&edit=general`, `?dialog=delete`, `?select=a,b`; see `docs/deep-linking.md`). The review item's link opens that state directly. What can't be linked (menus, the second step of a create modal, a change to a field before Save) is still described as a click path. Keeping page state in the address, not in `useState`, is what made this possible, and it should be the rule from the first screen.
5. **Keep links plain.** The page shows only bold, code and links. A link label can't contain backticks, or the backticks show on screen.
6. **Split "compare" from "confirm".** Compare items are things a reviewer can check against Figma. Confirm items are decisions where Figma was silent. The second list is where the real design questions are, and it grows with every review. Mark new ones (we used **New:**) so they can be found.
7. **Checked on screen vs not.** The file says which flows were compared in a browser and which weren't. Without that line a reviewer assumes everything was checked.
8. **Suggestion:** a count per flow ("4 of 9 done") on the hub, and a filter for unticked items, so a reviewer can pick up where they stopped.
9. **Stale text (fixed).** The hub subtitle used to say "What to check in the ARS_WebUI2_CRUD screens" although it covers six Figma files; it now says "What to check against the Figma files." Keep it generic when a file is added.
10. **Three kinds of "Confirm" item, and say which.** (a) Figma is silent and the assistant had to choose; (b) the designer asked for something that differs from Figma (a filter that works, photos instead of initials, a "Coming soon" dialog); (c) a Figma mistake, which goes on the Figma tidy-up page. Write (b) as "this is a change you asked for", so the designer can tell it from an assistant's guess and doesn't re-raise it as a bug.
11. **Every behaviour change needs its note and its link in the same commit.** A new dialog gets a `dialog=` value in `docs/deep-linking.md`, a Prototype link in the review note and a history line. Done afterwards, the review list lags behind the app.

## Components not in Figma page

1. **Why it exists.** The screens need parts the ARS kit in Figma doesn't have (dialogs, toasts, tables). Rather than hide that, each is built, tagged and listed with the Figma node it was drawn from, so the design team can decide whether to add it to the kit.
2. **One entry per component** in `missingFromFigma.ts`: the code folder, the Figma layer name and node, the file it came from, and a note on what the kit lacks. The page and the Storybook group both read this one list.
3. **The note matters most.** "Drawn from the CRUD file; the kit's table has these columns instead" tells the design team the actual gap. Entries with only a node link get ignored.
4. **It is a to-do list for the design team,** not for the prototype. Suggestion: add a status per entry (to review, added to the kit, rejected) so the page shows what has been dealt with, and remove entries once the kit has them.
5. **Suggestion:** link each entry to the screens that use it (a Prototype link, like the review tasks), so the design team can see the component in context.
6. **Where the Figma file is wrong or silent,** that goes in the review notes, not here. This page lists components; the notes list decisions.

## Sample data and placeholders

What reviewers see first is the content, not the components. These came up when the designer opened the deployed site.

1. **Repeated content looks fake straight away.** The first sample data drew names and descriptions from short lists, so one folder showed "Ops Admins" six times, groups carried user descriptions and every computer was "Device 123". Fix: bigger pools whose parts fit together (24 departments × 12 roles, each role with its own description), so a group's description matches what it is. Check the longest list on screen, not the first page.
2. **Change the content without moving the objects reviewers link to.** Sample objects are generated from a seeded random draw per folder, and review links point at them (Isabella Clark, Security Users, Julian Long). New content must keep the draws in the same order and count, and any object a link depends on is pinned by its id. Otherwise every Prototype link in `review-notes.md` quietly points at a different object.
3. **One number, one source.** A card on the Overview, a tab label and the list under it all showed a count, and they disagreed. They now read one count. Do the same for any total a reviewer can see in two places.
4. **A filter must read what the list shows.** The directory filter first put every item into a hidden random directory, and a reviewer could not tell why a row appeared. It now reads the Location or Directory column itself, so what is ticked and what is shown always agree. Make "nothing ticked" mean nothing, not everything, and say so on the control ("No directories").
5. **A realistic detail exposes the sloppy ones.** Adding photos to the avatars showed that eight of ten sample emails belonged to other people. When a sample object gets more realistic, check that its name, email, login, avatar and directory agree.
6. **Photos: save them, don't hot-link them.** The sample portraits come from a free source but are saved in `public/avatars/people/`, so the demo works if that site is down. About four in ten people keep initials, because a directory where everyone has a photo also looks fake. The same name always gets the same face.
7. **One placeholder for everything unbuilt.** There were three: a "[WIP]" tag, a plain "Coming soon." line and a bare figure. They are now one view, `ComingSoon` (the interactive satellite and "Coming soon"), used for unbuilt tabs and pages. An action with no design (Deprovision, Deactivate, Add User on the Users list) opens a dialog with the same content, so it never does nothing. Each is flagged in the review notes as "not a Figma design".
8. **Don't invent the placeholder's look.** The satellite was already in the Iris kit as `EmptyFigure`. Search the kit before drawing anything, even a placeholder.

## Reuse in the next prototype

1. Copy `ChoicePage`, `WelcomePage`, `StorybooksPage`, `ReviewHubPage`, `ReviewTasksPage`, `ComponentsReviewPage`, `lib/reviewNotes.ts`, `lib/storybooks.ts` and `missingFromFigma.ts`.
2. Copy `scripts/build-storybooks.mjs` and `vercel.json`, and change the folder names to match.
3. Start `docs/review-notes.md` on day one and add a Prototype link to each item as the screen is built, not afterwards.
4. Check the deployed site, not just the local one, before telling the designer something works.
5. Copy `views/ComingSoon` and `ComingSoonModal` so unbuilt things look the same from the first day, and build the sample data from pools with fixed ids (see "Sample data and placeholders").
