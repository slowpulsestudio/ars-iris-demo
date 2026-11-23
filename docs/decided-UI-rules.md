# Decided UI rules

The UI rules the designer has decided for this prototype: how screens and components behave where Figma is silent or draws something else. Product rules are in [decided-business-rules.md](decided-business-rules.md). Figma stays the source of truth for how things look; a rule here that differs from Figma is also an item in `docs/review-notes.md` and on the Figma tidy-up page.

Each rule has an ID, what it says, where it comes from and where it is built. When the designer decides a new rule, add it here in the same commit as the change.

## Modals

**MOD-1. A modal with steps is as tall as its tallest step, on every step.** It hugs the full height of the tallest step's content and keeps that height on shorter steps, so the layout doesn't jump between steps and the footer buttons stay in one place, which also helps accessibility.
- Applies to every New object and New group form with a stepper: New AD User, New Entra User, the Tree view's other New object types and New AD Group. Figma keeps their body at a fixed 729px (ARS_New_Object_Template 3367:12947).
- The Select folder step (Figma 3651:20393) is never the tallest: its tree fills the height the other steps give it and scrolls.
- Source: designer, 16 Nov 2026. Built: kit `ARSNewObjectContentContainer` (`stepContents`: every step shares one grid cell, and the steps not on screen are hidden and inert), `views/UsersPage/CreateObjectModal/`, `views/GroupsPage/CreateGroupModal.tsx`.

**MOD-2. Closing a New object form that has something filled in asks first, in the same modal.** The close button, Escape, a click outside the modal or the footer's ghost Discard button (before the main action) swaps the form for the Unsaved changes question (ARS_Modal_Form_Unsaved, ARS_WebUI2_CRUD 3534:19369) on the same backdrop, and the card resizes to it. It never opens a second modal over the form: only one floating layer shows at a time. Keep my progress, the question's close button, Escape or a click outside resizes the card back to the form, exactly as it was (same step, entries, ticked and opened folders); Discard changes discards the entries and closes. A form with nothing filled in closes straight away.
- The question is drawn in Figma (ARS_Delete 3718:44345): a secondary "Keep my progress" and the Iris Danger style "Discard changes" (white, red text and border, `danger-outline`), a divider under the header and none above the footer, regular text with the two button names semi bold, and 16px between the icon and the text. The object pages' edit mode keep the older Cancel and primary Confirm (ARS_Modal_Form_Unsaved 3534:19369). Figma's footer (ARS_.Modal_New_Object_Footer 3321:20516) has no Discard.
- The resize uses the Iris motion tokens: the card goes from one panel's size to the other's over `--oi-motion-duration-long` with `--oi-motion-ease-default`, and the new panel fades in over `--oi-motion-duration-default`. With reduced motion the panels swap at once.
- "Filled in" means a text field has a value; options, toggles, dropdowns and the destination folder don't count.
- Applies to every New object form, New User and New Group: New AD User, New Entra User, the Tree view's other New object types, New AD Group and New Entra Distribution Group. Figma's New Object template (ARS_New_Object_Template 3367:12947) doesn't say what closing does.
- Source: designer, 17 Nov 2026; the question redrawn in Figma 18 Nov 2026. Built: kit `ARSModalFormUnsaved` (`destructive`) and `ARSModalNewObjectFooter` (`onDiscard`, through `ARSNewObjectTemplate`), `views/NewObjectOverlay/` (the swap; the form stays mounted, hidden, under the question), used by `views/UsersPage/CreateObjectModal/` and `views/GroupsPage/CreateGroupModal.tsx`, `views/ModalOverlay/` (`panelKey`: a panel swapped in while open gets focus and the card resizes to it).

**MOD-3. A New object form's fields stop 16px short of the divider.** The form column keeps its 702px and the divider stays at its right edge; the fields end 16px (the spacing token `--oi-spacing-l`) before it, on every step, as ARS_WebUI2_CRUD 3680:22606 lays it out.
- Applies to every New object form, New User and New Group.
- Source: designer, 17 Nov 2026. Built: kit `ARSNewObjectContent` (the form column's right padding).

## Buttons

**BTN-1. A Create button that opens a menu of options is a split button.** Both the main part and the arrow open the menu. A Create that goes straight to one form stays a plain button.
- Users list: Create opens the New User menu (New Entra User, New AD User, Add User). Figma draws a plain "+ Create" there (ARS_Table_Toolbar, Basic, 3422:16062 in ARS_Flat View_User_Content 3423:30755).
- Groups list: Create opens AD group and Entra group (CRT-2). Figma draws a plain "+ Create" (ARS_WebUI2_Groups 160:9037).
- Tree view folder lists: Create opens the New object menu; it was already split.
- Source: designer, 16 Nov 2026. Built: kit `ARSTableToolbar` (a main action with `onActionMenu` is a split button on every variant), `views/UsersPage/UsersPage.tsx`, `views/GroupsPage/GroupsPage.tsx`, `views/TreeView/TreeListPage.tsx`.

**BTN-2. An icon-only button is square.** It is as wide as it is tall, never stretched or squeezed.
- The Advanced filter Panel's two view buttons are 28px squares (`--oi-size-m`); the draft had them 36px wide.
- The table settings button in the right-most column head is a 32px square, like the rows' "…" buttons; the head cell's padding no longer squeezes it.
- Source: designer, 17 Nov 2026. Built: `iris-new` `AdvancedFilterPanel` (`.switchItem`), kit `TableHeadRow` (the action head cell takes the rows' 6px button inset).

## Tables

**TBL-1. The table settings menu lists the columns to show and their order.** The settings button in a list's right-most column head (ARS_Table_Config 3663:19416) opens a menu that starts with Edit width, a toggle that is off by default (TBL-2), then lists every column in the order they show, each with a checkbox to show or hide it and a drag handle to move it (Alt+Up and Alt+Down from the keyboard). It stays open while columns are ticked or moved, and the table follows at once. The first column always shows and stays first, and Actions, the right-most column, ends the list the same way: always shown, never moved.
- Figma's ARS_Table Menu (3663:20381) has Adjust columns and Add columns entries instead.
- Applies to the Users, Groups, Managed Units and Tree view lists, Favourites, the Memberships tabs and a group's members. The choices last while the page is open.
- Source: designer, 17 Nov 2026. Built: Iris `Menu` (`toggle` entries, `movable` checkbox entries and `onMove`, in `useMenuReorder`), kit `ColumnSettingsMenu` and `TableHeadRow` (`columnSettings`: `order`), `views/ListFilters/useColumnSettings.ts`.

**TBL-2. Columns resize only while Edit width is on, and resizing never opens a gap.** With Edit width on, each edge between two columns shows a 2px grip and can be dragged, or moved with the arrow keys (8px a press, 40px with Shift). The column on one side grows by what the other loses, neither under 80px, so the row keeps its width. The table's fill column (Description; the last column while it is hidden) always stretches to fill the row, so dragging its edge resizes the column beside it. The last column's right edge, at Actions, doesn't move.
- Figma's ARS_Table Menu (3663:20381) has an Adjust columns entry instead of the toggle.
- Applies to every list with the table settings menu (TBL-1).
- Source: designer, 17 Nov 2026. Built: kit `TableHeadRow` (the grips, the two widths an edge changes, and the rules that size the head and every row).

**TBL-3. Column head icons are 16px.** The sort, filter and leading icons in a column head are 16px, a size down from the 20px they were.
- Source: designer, 17 Nov 2026. Built: kit `ARSSortableHeaderCell`.

## System communications

How the prototype tells the user something happened: toast, Background Job, notification, alert. None of it is drawn in Figma yet (see the Design update recommendations page). After the tech review (19 Nov 2026) the engineers recommend working through the list in serial, not tracking each object, and being able to stop if something looks bad. AD can report "24/100 completed"; Entra can't, but is fast, so it says "Changes submitted". Item level progress waits until a customer asks for it.

**SYS-1. An instant action never becomes a Background Job.** Work that takes under a second or two ("Settings saved", moving one user) shows a toast that dismisses itself.
- Source: designer, 19 Nov 2026. Built: `lib/useMoveUsers.ts` (one user: toast; two or more: job).

**SYS-2. Five complexity directions are compared.** Each adds to the one before. A is recommended; the MVP is C.
- A. Toasts only (complexity 1): one toast for job started, complete and failed. They all dismiss themselves.
- B. Top bar: popover only (complexity 2): A, plus the Hourglass button (Iris UI Explorations 2880:26127) whose popover lists the jobs, like the notifications menu. Never a feed. Shows progress is happening, but spinner only (no count).
- C. Bottom tray: simple (MVP, complexity 3): a feed under the toast area, as wide as a toast, with the toast moved up above it. The down caret folds it into just its title bar, drawn exactly as when open (title and count, no change of style), and the up caret expands it again; the X closes it and the Hourglass reopens it. It stays with the user across app pages but not on the welcome page. AD shows a spinner and Cancel, no count and no bar: it shows progress is happening, but spinner only; the title names the total ("Moving 100 users").
- D. Bottom tray: overall progress (complexity 4): C with an overall progress bar and Stop. The one-line bar keeps a thin overall bar under it.
- E. Bottom tray: item progress (complexity 5): D with every object listed. Each row is the object's name with, at the far right, a small spinner while it moves, a tick once moved or a warning if it failed; hovering (or focusing) a waiting or moving row swaps that for a Cancel button. The job itself has no spinner while it runs, as the rows carry it.
- In every direction a job's state (spinner, tick, warning, cancelled) sits at the far right of the job, as each object's does in E.
- The welcome page offers the five as cards, each with a picture of its component and a 1 to 5 complexity rating in gears (the letters and numbers run in order of complexity): A large on top with a "Recommended" badge on its top edge, as on a pricing page; B to E small below. Each signs in as David Smith on the Users list with every AD user (64) ticked, so Move is one click away.
- The direction's name in the middle of the top bar is a dropdown to switch to another; switching clears the jobs and goes back to that start. That area matters more than the breadcrumb: while it shows, the breadcrumb folds into its "…" menu and the current page, and when the top bar is under 1320px (e.g. the navigation pinned on a laptop) the breadcrumb hides altogether. Only under 1120px do the trigger buttons fold into a "Triggers" menu; the dropdown hides only under 640px.
- Moving two or more objects ends in a toast or job row with **View in destination**: it opens the destination with the moved objects ticked, and the list's hidden column **When added here** (table settings) says when each arrived, so a mistaken move can be undone by hand (select them, Move back). It opens with **Show selected** on, so only the moved objects show; the action bar keeps the Show selected toggle even with several ticked (Figma shows it for one only), so the rest of the list is one click away. Moving users opens the Users list filtered to the destination Location, so turning Show selected off or clearing the selection still leaves the user in the destination; moving tree objects opens the destination folder.
- In A (Toasts only) the demo move runs four times as fast, as there is no progress to watch.
- Source: designer, 19 Nov 2026 (tech review); 23 Nov 2026 (View in destination, undo by hand, A recommended). Built: `lib/jobsDirection.ts`, `lib/jobsStore.ts`, `views/BackgroundJobs/`, `views/SystemComms/`, `views/WelcomePage/`, `components/AppHeader/` (`center`), `views/ChoicePage/` (`wide`, `badge`), `public/directions/`.

**SYS-3. The Hourglass shows a job is running at a glance.** While a job runs its sand falls and the glass turns over; with reduced motion it stays still. A red dot (2880:26097) shows while a job has failed. Not shown in A.
- Source: designer, 19 Nov 2026. Built: `views/BackgroundJobs/HourglassIcon.tsx`, `JobsHeaderButton.tsx`.

**SYS-4. A failure stops the job, except at item level.** In A to D the job stops at the failed object and says "Stopped after 18 of 40 users. Some users could not be moved." (objects aren't tracked one by one). In E the failed object is marked and the rest carry on. There is no Retry.
- Source: designer, 19 Nov 2026 (tech review). Built: `lib/jobsStore.ts`.

**SYS-5. Entra changes can't be stopped and have no count.** An Entra job says "Changes submitted" with a spinner, then "Changes applied", and "Entra changes can't be stopped." in place of Cancel or Stop.
- Source: designer, 19 Nov 2026 (tech review). Built: `lib/jobsStore.ts` (`directory`), `views/BackgroundJobs/BackgroundJobItem.tsx`.

**SYS-6. A job escalates to a notification only when the user has likely moved on.** That is when it ran 20 seconds or more (`JOB_ESCALATE_AFTER_MS`), or, in C to E, when it ends while the feed is closed.
- Source: designer, 19 Nov 2026. Built: `lib/jobsStore.ts`, `lib/notificationsStore.ts`.
