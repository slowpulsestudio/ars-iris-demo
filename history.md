# History

What was built in this repo, the decisions behind it, and where everything lives. Last updated 10 November 2026.

## Where things are

| What | Where | Run and check |
| --- | --- | --- |
| The app (Iris Shell for Active Roles) | [src/iris-shell](src/iris-shell) | `pnpm dev --port 5190 --strictPort` (5173 is used by other prototypes) · `pnpm -s typecheck && pnpm -s build` · `pnpm -s motion:lint` |
| Iris Storybook (one story file per Iris component) | [src/iris-storybook](src/iris-storybook) | `pnpm storybook` (port 6107) · `pnpm -s typecheck && pnpm -s check` |
| ARS kit (ARS components and their Storybook) | [src/ars-ui](src/ars-ui) | `pnpm storybook` (port 6106) · `pnpm -s typecheck && pnpm -s check && pnpm -s build-storybook --quiet` |
| Motion section of the ARS Storybook | [src/ars-ui/src/motion](src/ars-ui/src/motion) | Storybook sections Motion/Tokens and Motion/Usage |
| ARS component audit | [docs/ars-component-map.md](docs/ars-component-map.md) | |
| Personas | [personas/personas.md](personas/personas.md) | |
| Project rules for agents | [prototype-specific-agent-instructions.md](prototype-specific-agent-instructions.md) | |
| Figma links | [.figma-url](.figma-url) | |

- The welcome page has a Storybook button. It opens a Storybooks page that links to both Storybooks ([storybooks.ts](src/iris-shell/src/lib/storybooks.ts)).
- The ARS kit imports Iris through the alias `@iris` → `src/iris-shell/src`, so ARS components use the Iris components directly.
- [check-kit.mjs](src/ars-ui/scripts/check-kit.mjs) enforces:
  - folder names `ARS` + capital letter;
  - `.tsx`, `.module.css` (when imported) and `.stories.tsx` in each folder;
  - an export from [index.ts](src/ars-ui/src/index.ts);
  - story title `ARS/<audit name>`, where the name must be in the audit;
  - only Iris tokens and icons that exist; no hard-coded colours.
- [check-stories.mjs](src/iris-storybook/scripts/check-stories.mjs) requires `src/<Name>.stories.tsx` titled `Iris/<Name>` for every Iris component.

## Figma files

Figma is read-only for this project.

| File | Use |
| --- | --- |
| [ARS_WebUI2_CRUD](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD) | Main product design; wins any conflict |
| [Iris UI Kit](https://www.figma.com/design/kgmR6KueZaAaS1t9m3WLiQ/Iris-UI--UI-Kit) | What the Iris code must match |
| [ARS - Primary](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2123-30425) | ARS product kit: 72 components on page "Iris UI" (2123:30425) |
| [ARS_WebUI2_User-View-Approvals](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6651) | UserView end-user pages; work in progress |

## Rules and decisions

From the Designer during this work. The project-wide ones are also in [prototype-specific-agent-instructions.md](prototype-specific-agent-instructions.md).

**Figma**
- Figma is read-only. Only `get_metadata`, `get_design_context`, `get_variable_defs` and `get_screenshot`; never `use_figma` or any write tool.
- Figma is the source of truth. Build structure and styling exactly as drawn. Never call parts of it old or outdated, or swap them for other components.
- Text copy and icon choices in Figma are content. Components take them as props or data; they are never baked in as rules.
- In design context, Code-Connected Iris components (Button, AppHeader, Select, Pagination) are left out. Use `get_metadata` for the instances and `get_screenshot` for labels.

**Iris and ARS**
- The audit ([docs/ars-component-map.md](docs/ars-component-map.md)) says which Iris pieces each ARS component uses. Read it and act; don't ask.
- The Iris code must match the Iris UI Kit. When the UI Kit has a component or variant the Iris code lacks, add it to Iris (for example Button ghost, Toggle). ARS only adds what its own file draws differently (for example the grey input fill).
- A plain frame in the audit (no UI Kit instance) is built in ARS from the ARS file, even when the Iris code has a similar code-only component (StatCard, Card).

**Writing and reporting**
- Cite Figma as file name + component or variant name + node ID, with links.
- Never invent names (such as "ARS mock") and never guess how a design was made.
- Keep reports neutral and specific.

**Working practice**
- Never open sites in the browser unless asked in that conversation. localhost:5173 is shared with other prototypes.
- Use only this repo and Figma. Don't read other projects or the Injest folder.
- Commit locally after verifying; push only when asked.
- Write "ARS" in caps in names (`ARSTable`, never `ArsTable`). Use pnpm only.

**Product decisions**
- Directory tree, [ARS_Tree_Expand_Content 3563:17385](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3563-17385):
  - all rows stay 24px (ignore the 40px row 3563:21000);
  - trail lines continue down while rows below are in the same branch ("Figma is in error there");
  - the text fade on every row stays.
- The welcome and Storybooks pages are always dark; product screens default to light.
- The navigation sidebar is pinned open by default.

## Timeline

### 5–9 Nov: setup

- `e53ef07`: agent instructions and skills.
- `c9b4253`: Iris packages installed for Active Roles.
- `cfb9e70`: Figma file and setup answers recorded.
- `0d52fd9`: Figma made read-only (write skill removed).
- `5f89b9e`: Iris UI Kit and ARS kit links added to `.figma-url`.
- `9e19780`: `.DS_Store` and `Injest/` ignored.
- `a25bd43`: Figma documented as the source of truth.
- `076a61c`: rule "never open sites in the browser unasked".

### 9 Nov: audit, personas, welcome page

- `3cfca25`: [docs/ars-component-map.md](docs/ars-component-map.md) records, for each of the 72 ARS components, what it is built from (ARS components inside, Iris code components, outside pieces) and where it is used.
- `762533e`: UserView pages added to the audit (work in progress).
- `85ca58e`: audit labels reworded to describe Figma as it is.
- `5f9d4bd`: welcome page with a persona picker; each persona has its own navigation ([personas](src/iris-shell/src/lib/personas)).
- `895f49c`: persona source sheets in [personas](personas).

### 9 Nov: ARS kit and Iris Storybook

- `549a0e3`: `src/ars-ui` package with Storybook, starting with ARS_Pagination.
- `be5c7f5`, `610bbb4`, `24b4837`: the first 10 ARS components and the kit check.
  - The rest of the table pieces: ARS_Row, ARS_Table_Header, ARS_Table_Row_Header, ARS.Table head_Mixed_obj and ARS.Table head_single_obj.
  - Then ARS_Table_Toolbar, ARS_Table_Config, ARS_Header and ARS_Table.
- `9e462ef`: `src/iris-storybook` with a story for every Iris component.
- `4c4fdc1`: Storybook button and Storybooks page on the welcome screen.

### 10 Nov: ARS components 11–48

| Commit | Components |
| --- | --- |
| `90c941e` | The 12 menus (Iris Menu filled with ARS items) and ARS_Create_Menu_Button |
| `e89b97e` | ARS_Main_Content Placeholder |
| `281661c` | Filter pill pieces |
| `f558b92` | User cards |
| `f812ef6` | Page headers, page tabs, action panel, sub-tabs template |
| `d21a03c` | ARS_Object_Content and ARS_User_Page |
| `2560fc4` | Group page |
| `8f3e599` | ARS_Table_Group_Row and ARS_Group_Table |
| `a5eeedc` | ARS_Managed_by |
| `bfa1597` | ARS_Ownership |
| `806e07d` | ARS_Overview_Template |

### 10 Nov: Iris code aligned to the Iris UI Kit

Decision: "update the Iris code to match the Iris Figma UI Kit, and same for ARS".

| Commit | Change | UI Kit node |
| --- | --- | --- |
| `c4dc5a9` | Button gets the Ghost style; ARS's own ghost button removed | 2205:2885 |
| `0531227` | IconButton ghost hover | |
| `e018904` | TextInput (28/32px, 0.5px strong border), Textarea, FormField | .Input 4660:1965, 4873:12240, 4859:11615 |
| `e012449` | Select | .Select 5699:1359 |
| `80b15b5` | Menu | 3427:98 |
| `1ffbd98` | Checkbox | 2102:447 |
| `d9629d1` | Link, Badge, Avatar. ARS overview tiles are now built as drawn (plain frames) instead of the Iris StatCard | 3340:536, 109:246, 107:24 |
| `e1b39e3` | Tabs | 114:841 |
| `0da9e4a` | Pagination; ARS_Pagination uses it | |
| `b5bf95c` | SplitButton | 3981:92 |
| `bfd2ba8` | New Iris TableCell, TableHeadItem and Tag; ARS copies removed | 4125:3344, 4439:1445, 3534:232 |

### 10 Nov: app

- `149845e`:
  - the welcome and Storybooks pages stay dark;
  - product screens default to light (stored under `ars.productTheme`);
  - the self-service persona title is now "Selfservice end-user".
- `c5524e0`:
  - navigation is pinned open by default (`ars.globalSidebar.pinnedOpen`);
  - welcome cards get a border on hover.
- `6120e94`: headings stay in place when switching between the welcome and Storybooks pages.

### 10 Nov: the five-item list

**1. Modal, toast, stepper and action bar**
- `0af15ea`: Modal (3945:422) — sizes, backdrop, header, footer divider.
- `c4d2d1d`: Toast — types, supporting text, actions, 5s pausable countdown.
- `4ca10d6`: Stepper — 18px indicator, padding, completed and error colours.
- `e6fd4fc`: ActionBar (6104:3853).

**2. Sidebar, plus new Iris Tree, Banner and Spinner**
- `4b3e9ac`: new Spinner (4899:10051) and Banner (3101:5587).
- `dd4eb4d`: new Tree (351:1555).
- `be76157`: sidebar nav items.
- `4b35e4e`: icons as content; Tree text fade, rounded trails, context menu, drag-and-drop, separator and scroll-to-selected.
  - Tree icons come from data.
  - Banner and Toast take an `icon` prop.
- `4260a8c`: the app's directory tree view uses the Iris Tree with the ARS settings (8px block padding, 20px indicator).
- `5e63a19`: trail lines continue down while rows below are in the same branch.

**3. The remaining ARS styling on Iris cards**
- `000e3b8`: the Iris UI Kit has no Card page, so ARS cards use an ARS card frame drawn from the ARS file ([parts/Card](src/ars-ui/src/parts/Card)) instead of restyling the Iris code-only Card.

**4. The remaining 24 ARS components, following the audit** — the kit is now complete at 72/72.

| Commit | What |
| --- | --- |
| `7a13f1a` | ARS_.Modal_New_Object_Footer, ARS_Stepper_with_div, ARS_New_Object_Content, ARS_New_Object_Content_Container, ARS_New_Object_Template, ARS_New_Object_Toast, ARS_Form_Error, ARS_Modal_Content_Delete, ARS_Modal_Content_Success, ARS_Delete_Confirmation_Modal_Template. New part ModalMessage; FormInput gained `info`, `error`, `type` and `placeholder` |
| `e3d9d85` | Reset_Content success, ARS_Password_Reset_Entra_User, ARS_User_Password_Reset_AD. New parts PasswordInput and ModalPanel |
| `390fc2b` | Iris additions these needed (details below) |
| `7f6ad33` | ARS_Action_bar, ARS_Sidebar, ARS_Directory_Management_Content, ARS_Directory_Management_Panel, ARS_Directory_Multiselect, ARS_Empty_Content. New parts ViewSwitch and NoDataIllustration |
| `acf70c9` | ARS_Flat View_User_Content, Tree_View_AD_Content, ARS_App_Layout_Flat_View, ARS_Flat_Master, ARS_Treeview_Master. New part ContentScreen; TableHeadRow got an `actions` slot |

Iris additions in `390fc2b`:
- new Toggle (111:249);
- ActionBar: optional total, a toggle slot, custom icons;
- MultiSelect panel matches UI Kit MultiSelect 8584:9634 and gains `defaultOpen`;
- Select accepts a `ref`.

Story helpers are in [src/ars-ui/src/stories](src/ars-ui/src/stories):
- [IrisAppProviders.tsx](src/ars-ui/src/stories/IrisAppProviders.tsx) — the providers that Iris shell chrome needs, `withRoute` and `signedInUser`;
- [directorySamples.ts](src/ars-ui/src/stories/directorySamples.ts);
- [tableSamples.ts](src/ars-ui/src/stories/tableSamples.ts).

**5. Iris motion tokens** (`128e7c8`)
- **Side sheet**
  - It opens on `--oi-motion-ease-drawer` over `--oi-motion-duration-long` and closes on `--oi-motion-ease-exit` over `--oi-motion-duration-default`.
  - The opening slide never played because the panel mounted already open. It now starts from `@starting-style`.
  - The unmount delay was a fixed 200ms against a 280ms slide. It is now read from the duration token.
- **Toast:** enters on `--oi-motion-ease-enter` and exits on `--oi-motion-ease-exit`. The unmount delay comes from the duration token.
- **Ask-AI panel:** it had no open or close animation. It now fades and slides 8px on the enter and exit tokens, stays mounted (inert) while closing, and turns this off under reduced motion.
- **Hard-coded timings replaced with tokens:**
  - AI panel: 150ms, 180ms with its own curve, `ease-out`, and the 1s loops;
  - Stepper check: its overshoot curve.
- **Not changed:**
  - the tab underline, as asked;
  - the Checkbox's 80ms delay and the AI shimmer's 2000ms, which have no matching token.

### 10 Nov: motion lint and the Motion section

- `fadb86a`: the staggered card reveal on the Insights, Identity Manager and Identity Insights pages.
  - It used its own copy of a curve, `cubic-bezier(0.22, 1, 0.36, 1)`, which came with the Iris packages.
  - It now uses `--oi-motion-ease-enter`.
  - `pnpm -s motion:lint` is clean.
  - The reveal keeps its 500ms duration and 40ms stagger, which have no matching tokens.
- `6b1b60e`: a Motion section in the ARS Storybook, beside the ARS section.
  - **Motion/Tokens:** the duration and easing tokens with their live values, each easing's curve, and a Play control that moves a dot on each token.
  - **Motion/Usage:** the side sheet, Ask AI panel, toast, tabs underline and stepper check. Each lists the tokens it uses for enter, exit and reduced motion, above the live Iris component.

### 10 Nov: the ARS_WebUI2_CRUD screens

Built flow by flow from the [CRUD file](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1291-39864) after a discrepancy audit. The app now imports the kit through `@ars`; the Iris layers never import it (the shell takes the directory panel through `AppShellProvider`). What still needs checking is in [docs/review-notes.md](docs/review-notes.md).

- **Flow 1, lists** (`0a25494` to `6f03878`): the ARS directory panel, the Users list (`ARS_Flat View_User_Content`), the Tree list (`Tree_View_AD_Content`), the no-selection state (Iris `EmptyFigure`) and the Components to review page.
- **Flow 2, create** (`50889c1`, `48f0710`, `3a0b56d`): `ARS_Action_bar` for one or several selected rows, the New object modal (`ARS_New_Object_Template`, two steps, Select folder side sheet) and `ARS_New_Object_Toast` with View.
- **Flow 3, object page** (`ad79aee`, `302b679`): `ARS_User_Page` with Overview and General, the Properties card edited in place, and the save error (required fields and a taken user principal name).
- **Flow 4, delete, reset, unsaved** (`b5cb0ff`, `bb4677a`): `ARS_Delete` and `ARS_Modal_Form_Unsaved` (CRUD file only, shown under "Missing from Figma" in Storybook and on the Components to review page), the AD and Entra password reset, and a navigation guard for unsaved changes.
- **Follow-ups**: the unsaved-changes guard now also covers the browser's Back button and links that only change the address; the User Details tab shows the Contact and Job information cards (`ARS_Users_ContactInfo Card`, `ARS_Users_Job Info Card`), each edited and saved on its own, with values kept in memory for the session.
- Not built because the CRUD file doesn't draw them: bulk delete, detail pages for objects other than users, and the other user tabs.

All flow 1 to 4 commits and the follow-ups above are on `origin/main`.

### 11 Nov: move objects

Built from a second Figma file, [ARS_WebUI2_Move_Browse_Objects](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2008-1687). Move opens a side sheet (Iris Side sheet with the directory tree) from a row menu, the selection bar or a user page, then shows a toast with Undo and View. In Tree view, rows can also be dragged onto a folder in the left panel. Three kit components are new and listed under "Missing from Figma": Selected objects block, the Move toast and Element-Dragged. The Iris Side sheet gained an optional header icon, and the Iris Tree accepts drops from outside it. Flat view and Tree view keep separate sample data, so a moved Flat view user changes its Location text only. The checks are in Flow 6 of [docs/review-notes.md](docs/review-notes.md).

### 11 Nov: groups, organizational units, managed units and self-service

Four more Figma files, built flow by flow with an audit first; every flow, node and status is in [docs/figma-flows.md](docs/figma-flows.md) and the checks are Flows 7 to 12 in [docs/review-notes.md](docs/review-notes.md).

- **Groups** (Flows 7 to 9, [Groups file](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24)): the group page with Overview, General, Ownership, Memberships and Object details; Rename, Copy and Deprovision (written requirements only in Figma); Add member; the Groups list; New AD Group and New Entra Distribution Group. New: Iris Radio, `FormInput` radio and checkbox, and several kit components under "Missing from Figma".
- **Organizational units** (Flow 10, [OU Management file](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1009-3972)): the New Organizational Unit modal and the OU page.
- **Managed units** (Flow 11, [Managed Units file](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=4002-9991)): the list and a unit's members.
- **Self-service** (Flow 12, [User-View-Approvals file](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6651)): Home, My Access with the Request Access sheet, Approvals with Approve, Deny and Escalate, and User Profile, in `views/UserView/` from Iris components (the shell had placeholders there before).
- Not built: Groups Managed units, Roles and History tabs, OU Managed units, Roles and History, the Managed Units Tree view screen and member row menus. These commits are on `origin/main` up to `a82f866`. (Rechecked later: the tabs have no frames in Figma, the Tree view screen is now built, and the row menu has no trigger in Figma. See "11 Nov: unbuilt items rechecked" below.)

### 11 Nov: review of Flows 7 to 12 in the app

Every screen from the Groups, OU Management, Managed Units and self-service files was opened in the running app (port 5193) and compared with Figma's layer values by reading the page, not screenshots. What was wrong was fixed in small local commits; what still differs or isn't in Figma is marked **New** in each flow's Confirm list in [docs/review-notes.md](docs/review-notes.md).

- **Self-service** (`b53cbd5`, `c0cb03f`): reworked to the Figma frames; Response Time is now a line chart, rows open their sheet on click, Profile has Cancel and Save Changes.
- **Groups list** (`a82f866`, `93e9350`): ARS_Table_Groups' columns (type badge, tags, directory); Entra groups now read O365Group and their directory name.
- **Group page** (`3b1c479` to `6e21fae`): Overview rebuilt as ARS_Group_Overview (new kit component ARSGroupOverview); Object Management 315px with Figma's "object's"; header location "O1D.local\Builtin"; General edit with info icons, the 0/100 count, placeholders and the Tags help line (the kit form field gained help text and a character count); Ownership subtitle and order; Memberships toolbar ("…", filter, split Add member) and 15 per page; dates as "Aug 14, 2024".
- **Dialogs and create** (`84fd6ce`, `1cd2a33`): table headings no longer shift when a table has no action column (Add Member, Managed Unit Members); one-step create modals (New Entra Distribution Group) hide the stepper instead of showing "Step name".
- **OU** (`efa5a37`, `b134cfd`, `4359645`): Managed units tab; four tiles and the Other Objects strip; "Organizational unit · O1D.local"; General with Name (renames the OU, now also in the left panel), Figma's labels and widths; Object details without a subtitle and with an OU=…,DC=… name; "Protect container…" starts unticked.
- **Managed Units** (`2ccb0f9`, `fe5ff94`): Figma's column widths and column settings button; the list rows lost a "…" Figma doesn't draw.
- **Design review tasks** (`fc49f1c`): every flow and Compare item links to its prototype screen.

### 11 Nov: review of Flows 1 to 6 in the app

The screens from the CRUD and Move files (lists, selection bars, create, user page, delete and reset, User Details, move) were compared with Figma's layer values the same way. Almost everything already matched; three things were fixed in local commits, and the rest is marked **New** in [docs/review-notes.md](docs/review-notes.md), with the open questions at the end of that page.

- **Users list tags** (`41f52a3`): the X on each tag now removes it for the session, as in the Groups list.
- **Directory tree names** (`635690a`, then `63c8fe8`): first sentence case for "Access templates" and "Managed units"; then, once you said the CRUD file wins, "Managed directories / Active Directory / Entra ID" as in its panel.
- **Unsaved changes modal** (`21a5bbc`): "Your unsaved changes will be discarded. To continue, click Confirm. To review your changes and save them later, click Cancel." replaces text with a typo; the earlier note that Figma has the typo was wrong.
- **Follow the CRUD file** (`63c8fe8`, `f2b76ac`): the Flat view Create button briefly opened the CRUD New object menu (corrected, see "Users list Create menu" below); the one-row selection bar has no Delete (new `showDelete` on ARSActionBar); Tree list search also covers the folders below the current one.
- **Menus stay on screen** (`c02b872`): the viewport clamp in the Iris Menu never ran after the menu mounted; it does now, and menus flip above their button when there is no room below.
- **Spelling** (`235814d`): "passowrd", "Reigon" and the missing full stop in the created toast are corrected in the app; with quote style and the places where the Figma files disagree they are on the Figma tidy-up page (its own card on the Design review hub, `docs/figma-tidy-up.md`).
- **Wrong Figma references fixed in the notes**: Flow 5's node and Flow 1's Tree view nodes (4517:19943, right-click menu 2385:57427) are in ARS-Primary, not the CRUD file, so the links now point there and the Tree view was compared with them (it matches); node 1369:32139 no longer exists. Every item and question on the review page now carries its Figma node link.

### 11 Nov: unbuilt items rechecked

Each item on the "not built" list was checked against Figma again before building anything.

- **Managed Units Tree view**: built. Tree view → Managed units now shows the managed units list (ARS_Treeview_Master, 7051:7736); it showed made-up contacts and computers before.
- **Managed Unit member row menu**: not built. Figma's ARS_AD User Actions menu (7077:3917) has no trigger: member rows (7069:6835) have no "…" and nothing shows how it opens.
- **Groups and OU Managed units, Roles and History tabs**: nothing to build. Groups has only note titles (64:6814, 64:6809, 64:6811); OU's Change History frame (1403:12579) says only "In progress under Change history Figma file". They stay as empty states.
- **Copy my ticks**: a button on both review pages (Design review tasks and Figma tidy-up) copies the ticked items as markdown, so a reviewer using the deployed page can send their ticks back.

### 11 Nov: user Overview cards link to their tabs

- **Group memberships and Assigned roles** on a user's Overview are blue links that open the Memberships and Roles tabs, for users in the Flat view and the Tree view. Each number is the same as the total on its tab label (before, the cards had their own numbers and the Memberships tab always said "(8)"). Roles now has a count in its label too, which Figma doesn't draw; see Flow 3 in the review notes. The kit's ARSOverviewTemplate fields gained an optional `onClick`.

### 11 Nov: Users list Create menu

Users > Create in the Flat view had the long New object menu (groups, OUs, bulk actions), which I put there by misreading "the CRUD file's menu is correct". It now opens ARS_New User Entra Dir, Variant3 ([2275:91121](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2275-91121)): New Entra User, New AD User, Add User. The long menu stays on the Tree view's Create. A new Entra user is added with Location "Entra" so its row menu is the Entra one. The group and OU dialogs on the Users page were removed, as nothing opens them any more.

### 11 Nov: user Memberships tab

The user Memberships tab, which was an empty state, now lists the groups the user is a member of, laid out as the Members Of page in the Groups file (search, split Add member button, group table, paging, Add Member modal). The sample data follows the demo site (https://product-test-pi-indol.vercel.app/#/users): groups with a name and a description, two per user. The group names were varied later: a list of forty, with two different groups for each of the ten sample users and two spread-out picks for any other user. The Overview card, the tab label and the list all use the one list, so they agree (Isabella Clark: 2) and adding a group raises all three. The Roles tab now has content too, as many sample roles as its label and card say; Figma and the demo site have none for it, so it reuses this tab's layout (flagged in the Flow 3 notes). Differences from Figma are in the Flow 3 notes (`lib/userMemberships.ts`, `lib/userRoles.ts`, `views/ObjectPage/UserMembershipsTab.tsx`, `UserRolesTab.tsx`).

### 12 Nov: toast flies in and out

The toast now flies in from the right edge of the window and back out the same way (before, it rose from below with a blur and scale). It uses only Iris motion tokens and transform and opacity: the entry takes `--oi-motion-duration-long` with `--oi-motion-ease-enter`, the exit `--oi-motion-duration-default` with `--oi-motion-ease-exit`, and with reduced motion it fades with no movement. The entry also wasn't animating at all before: the toast is shown through a store update that renders synchronously, so the "visible" flip could happen before the starting position was ever painted. It now waits for one painted frame. The toast is also used in the AI panel, so it flies the same way there.

The action bar does the same, from the bottom edge: it flies up into place and back down, with the same tokens and a fade-only reduced-motion case (its exit delay was a hardcoded 180ms and is now `--oi-motion-duration-default`). Only one hovering layer shows at a time: while a side sheet is on screen the bar flies out, and it flies back in once the sheet has gone (the selection is kept, and Esc then closes the sheet without clearing the selection). A small store, `lib/sideSheetStore.ts`, tells the bar a sheet is mounted.

### 12 Nov: paging always visible, action bar above it, Move not for Entra

On the list screens (Users, Tree view list, Groups, a managed unit's members) the pagination is now sticky at the bottom of the scrolling list, so paging is always in view, and the action bar floats above it instead of over it (before, the bar covered the pagination). While the bar shows, the list keeps one extra row of space above the pagination (`--ars-pagination-space`, set by `withBar` in `ARSScreen.module.css`) so the last row can scroll clear of the bar. The kit's ARSPagination gained `sticky`; the card's bottom padding moves into the sticky pagination (`--ars-pagination-pad-bottom`) so rows never show in a strip beneath it. The kit's ARSActionBar gained `hiddenActions`; on the Users list Move is left out when any selected user has Location Entra, as the Entra row menu already has none.

### 12 Nov: sample content no longer repeats

The generated directory data (`lib/directoryData.ts`) reused a handful of names and descriptions, so a folder showed "Ops Admins" six times, groups carried user descriptions, and computers were all "Computer" or "Device 123". Groups are now named "[Department] [Role]" (24 departments × 12 roles, each with its own description, so a group's description matches what it is), computers get a site-and-type name such as `PAR-LT-303` with a matching description, users and contacts get their own description pools, and the Groups list tags a "[Department] [Role]" group with its department plus a topic. The Users list tags use a longer list of pairs. The random draws are unchanged, so existing ids and names (Julian Long, Security Users) stay as the docs and links expect.

### 12 Nov: "Coming soon" satellite everywhere, and a dialog for Deprovision and Deactivate

Unbuilt user, group and OU tabs showed only the satellite with no words. They now say "Coming soon" under it. The pages that said "[WIP]" (Devices, Agents, Applications, Access templates), the Safeguard page and the old Tree detail tabs use the same satellite and wording, through one shared view, `ComingSoon`; the two stylesheets that only styled the old placeholders are gone. In the Users list's row menu, Deprovision and Deactivate used to do nothing; each now opens a dialog (`ComingSoonModal`, built on the Iris Modal) with the satellite and "Coming soon". Deep links: `?dialog=deprovision` and `?dialog=deactivate` with a `target`. On the Users list's Create menu, Add User opens the same dialog (`?dialog=add-user`) instead of a create form, as it has no design.

### 12 Nov: faces on the user Overview

The Overview's profile avatar showed initials for everyone. About six in ten users now show a photo: sixteen portraits from randomuser.me (free to use; the demo site hot-links the same source) are saved in `public/avatars/people/` and picked in `lib/userPhotos.ts` from the first name, the same face every time for the same person. The rest keep initials, as in Figma. Names not in the lookup lists keep initials. The kit's ARSOverviewTemplate gained an optional `avatarSrc`.

The ten named sample users on the Users list had emails that belonged to other people (Isabella Clark showed `i.patel@acme.io`; most were shifted by one or two rows). Each now reads initial.lastname, the same as the generated users (`i.clark@acme.io`).

## Iris files changed since the Iris packages were installed

These files differ from the package installed in `c9b4253`, so they will show as changed when the Iris packages are updated (see the update-iris-packages skill).

- **Components changed:** ActionBar, AiPanel, AppHeader, Avatar, Badge, Button, Checkbox, DataTable, FormField, GlobalSidebar, IconButton, Link, Menu, Modal, MultiSelect, NavItem, Pagination, Select, SideSheet, Sidebar, SplitButton, Stepper, Tabs, TextInput, Textarea, Toast, Tree. DataTable (`b53cbd5`) can hide its action column and open a row on click, for the self-service tables.
- **Components added:** Banner, LineChart, Radio, Spinner, TableCell, TableHeadItem, Tag, Toggle, Tree. LineChart (`b53cbd5`) is for the self-service Response Time chart; Radio (`ab44f76`) is for the group scope and type fields.
- **App files:**
  - `App.tsx` and `main.tsx`;
  - lib: `appShellContext`, `currentUser`, `personas` (folder and `personas.ts`), `productMenu`, `router`, `storybooks.ts`, `useSidebarPinned`, `useTheme`, `verticals`;
  - views: AppShell, ChoicePage, IdentityManagerPage (Identity Manager and Identity Insights styles), InsightsPage (styles), StorybooksPage, WelcomePage, WipPage;
  - public: the persona avatars and the Storybook logo.

## Open items

- The Iris code tokens have no `--oi-content-color-placeholder`, so placeholder text uses the tertiary colour.
- The audit shows the button in [ARS_Create_Menu_Button 3360:40921](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3360-40921) as a plain frame. The code uses the Iris SplitButton. Not yet re-checked.
- In [ARS_Tree_Expand_Content 3563:17385](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3563-17385), Users has an open caret but no children. The stories note this.
- In [ARS_Treeview_Master 3367:42088](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3367-42088), the header is a detached frame. The code uses the Iris AppHeader with the same breadcrumb.
- Commits from `7a13f1a` onward were checked with type checks, the kit and story checks, and builds. Flows 7 to 12 were also reviewed in a browser on 11 Nov, and Flows 1 to 6 later the same day.
- The tokens have no `--oi-motion-ease-move`, although the motion skill lists it.

## ARS components

All 72 components in ARS - Primary, with their code.

| Figma component | Node | Code |
| --- | --- | --- |
| ARS.Table head_Mixed_obj | [3423:28002](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3423-28002) | [ARSTableHeadMixedObj](src/ars-ui/src/components/ARSTableHeadMixedObj/ARSTableHeadMixedObj.tsx) |
| ARS.Table head_single_obj | [3423:27419](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3423-27419) | [ARSTableHeadSingleObj](src/ars-ui/src/components/ARSTableHeadSingleObj/ARSTableHeadSingleObj.tsx) |
| ARS_.Modal_New_Object_Footer | [3321:20516](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3321-20516) | [ARSModalNewObjectFooter](src/ars-ui/src/components/ARSModalNewObjectFooter/ARSModalNewObjectFooter.tsx) |
| ARS_Action_bar | [2385:59821](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-59821) | [ARSActionBar](src/ars-ui/src/components/ARSActionBar/ARSActionBar.tsx) |
| ARS_AD Bulk User Actions | [2385:57425](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-57425) | [ARSADBulkUserActions](src/ars-ui/src/components/ARSADBulkUserActions/ARSADBulkUserActions.tsx) |
| ARS_AD Bulk User Flat View | [2385:57426](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-57426) | [ARSADBulkUserFlatView](src/ars-ui/src/components/ARSADBulkUserFlatView/ARSADBulkUserFlatView.tsx) |
| ARS_AD Right Click Tree Menu | [2385:57427](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-57427) | [ARSADRightClickTreeMenu](src/ars-ui/src/components/ARSADRightClickTreeMenu/ARSADRightClickTreeMenu.tsx) |
| ARS_AD User Actions | [2275:90709](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2275-90709) | [ARSADUserActions](src/ars-ui/src/components/ARSADUserActions/ARSADUserActions.tsx) |
| ARS_App_Layout_Flat_View | [2385:56316](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-56316) | [ARSAppLayoutFlatView](src/ars-ui/src/components/ARSAppLayoutFlatView/ARSAppLayoutFlatView.tsx) |
| ARS_Create_Menu_Button | [3360:40921](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3360-40921) | [ARSCreateMenuButton](src/ars-ui/src/components/ARSCreateMenuButton/ARSCreateMenuButton.tsx) |
| ARS_Delete_Confirmation_Modal_Template | [2385:59716](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-59716) | [ARSDeleteConfirmationModalTemplate](src/ars-ui/src/components/ARSDeleteConfirmationModalTemplate/ARSDeleteConfirmationModalTemplate.tsx) |
| ARS_Directory_Management_Content | [3563:17386](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3563-17386) | [ARSDirectoryManagementContent](src/ars-ui/src/components/ARSDirectoryManagementContent/ARSDirectoryManagementContent.tsx) |
| ARS_Directory_Management_Panel | [2385:54213](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-54213) | [ARSDirectoryManagementPanel](src/ars-ui/src/components/ARSDirectoryManagementPanel/ARSDirectoryManagementPanel.tsx) |
| ARS_Directory_Multiselect | [4596:20589](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4596-20589) | [ARSDirectoryMultiselect](src/ars-ui/src/components/ARSDirectoryMultiselect/ARSDirectoryMultiselect.tsx) |
| ARS_Empty_Content | [3423:30769](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3423-30769) | [ARSEmptyContent](src/ars-ui/src/components/ARSEmptyContent/ARSEmptyContent.tsx) |
| ARS_Entra User Actions | [2275:90868](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2275-90868) | [ARSEntraUserActions](src/ars-ui/src/components/ARSEntraUserActions/ARSEntraUserActions.tsx) |
| ARS_filter-remove | [2650:24557](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2650-24557) | [ARSFilterRemove](src/ars-ui/src/components/ARSFilterRemove/ARSFilterRemove.tsx) |
| ARS_filter-select | [2650:24519](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2650-24519) | [ARSFilterSelect](src/ars-ui/src/components/ARSFilterSelect/ARSFilterSelect.tsx) |
| ARS_Filter_Menu | [3064:26920](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3064-26920) | [ARSFilterMenu](src/ars-ui/src/components/ARSFilterMenu/ARSFilterMenu.tsx) |
| ARS_Flat View_User_Content | [3423:30755](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3423-30755) | [ARSFlatViewUserContent](src/ars-ui/src/components/ARSFlatViewUserContent/ARSFlatViewUserContent.tsx) |
| ARS_Flat_Master | [4006:17053](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4006-17053) | [ARSFlatMaster](src/ars-ui/src/components/ARSFlatMaster/ARSFlatMaster.tsx) |
| ARS_Form_Error | [3621:46744](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3621-46744) | [ARSFormError](src/ars-ui/src/components/ARSFormError/ARSFormError.tsx) |
| ARS_Group_General content | [2944:30704](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2944-30704) | [ARSGroupGeneralContent](src/ars-ui/src/components/ARSGroupGeneralContent/ARSGroupGeneralContent.tsx) |
| ARS_Group_Page | [2944:29514](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2944-29514) | [ARSGroupPage](src/ars-ui/src/components/ARSGroupPage/ARSGroupPage.tsx) |
| ARS_Group_Table | [2843:24904](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2843-24904) | [ARSGroupTable](src/ars-ui/src/components/ARSGroupTable/ARSGroupTable.tsx) |
| ARS_Header | [3368:19597](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3368-19597) | [ARSHeader](src/ars-ui/src/components/ARSHeader/ARSHeader.tsx) |
| ARS_Main_Content Placeholder | [3429:18447](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3429-18447) | [ARSMainContentPlaceholder](src/ars-ui/src/components/ARSMainContentPlaceholder/ARSMainContentPlaceholder.tsx) |
| ARS_Managed_by | [3527:16182](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3527-16182) | [ARSManagedBy](src/ars-ui/src/components/ARSManagedBy/ARSManagedBy.tsx) |
| ARS_Modal_Content_Delete | [3651:44611](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3651-44611) | [ARSModalContentDelete](src/ars-ui/src/components/ARSModalContentDelete/ARSModalContentDelete.tsx) |
| ARS_Modal_Content_Success | [3651:44368](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3651-44368) | [ARSModalContentSuccess](src/ars-ui/src/components/ARSModalContentSuccess/ARSModalContentSuccess.tsx) |
| ARS_New Object Menu | [3066:57117](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3066-57117) | [ARSNewObjectMenu](src/ars-ui/src/components/ARSNewObjectMenu/ARSNewObjectMenu.tsx) |
| ARS_New User Entra Dir | [2275:91121](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2275-91121) | [ARSNewUserEntraDir](src/ars-ui/src/components/ARSNewUserEntraDir/ARSNewUserEntraDir.tsx) |
| ARS_New_Object_Content | [3493:17061](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3493-17061) | [ARSNewObjectContent](src/ars-ui/src/components/ARSNewObjectContent/ARSNewObjectContent.tsx) |
| ARS_New_Object_Content_Container | [3367:12347](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3367-12347) | [ARSNewObjectContentContainer](src/ars-ui/src/components/ARSNewObjectContentContainer/ARSNewObjectContentContainer.tsx) |
| ARS_New_Object_Template | [3367:12947](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3367-12947) | [ARSNewObjectTemplate](src/ars-ui/src/components/ARSNewObjectTemplate/ARSNewObjectTemplate.tsx) |
| ARS_New_Object_Toast | [4029:38684](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4029-38684) | [ARSNewObjectToast](src/ars-ui/src/components/ARSNewObjectToast/ARSNewObjectToast.tsx) |
| ARS_object-rule | [2650:24550](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2650-24550) | [ARSObjectRule](src/ars-ui/src/components/ARSObjectRule/ARSObjectRule.tsx) |
| ARS_object-selected | [2650:24543](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2650-24543) | [ARSObjectSelected](src/ars-ui/src/components/ARSObjectSelected/ARSObjectSelected.tsx) |
| ARS_Object_Content | [2385:56718](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-56718) | [ARSObjectContent](src/ars-ui/src/components/ARSObjectContent/ARSObjectContent.tsx) |
| ARS_Overview_Template | [3353:38318](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3353-38318) | [ARSOverviewTemplate](src/ars-ui/src/components/ARSOverviewTemplate/ARSOverviewTemplate.tsx) |
| ARS_Ownership | [3527:16049](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3527-16049) | [ARSOwnership](src/ars-ui/src/components/ARSOwnership/ARSOwnership.tsx) |
| ARS_Page Menu | [3663:20458](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3663-20458) | [ARSPageMenu](src/ars-ui/src/components/ARSPageMenu/ARSPageMenu.tsx) |
| ARS_Page_Action panel | [2944:29985](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2944-29985) | [ARSPageActionPanel](src/ars-ui/src/components/ARSPageActionPanel/ARSPageActionPanel.tsx) |
| ARS_Page_Content | [2944:30346](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2944-30346) | [ARSPageContent](src/ars-ui/src/components/ARSPageContent/ARSPageContent.tsx) |
| ARS_Page_Header (set) | [3066:57118](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3066-57118) | [ARSPageHeader](src/ars-ui/src/components/ARSPageHeader/ARSPageHeader.tsx) |
| ARS_Page_Header (single) | [2944:30067](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2944-30067) | [ARSPageHeaderSingle](src/ars-ui/src/components/ARSPageHeaderSingle/ARSPageHeaderSingle.tsx) |
| ARS_Page_Tabs | [2944:30035](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2944-30035) | [ARSPageTabs](src/ars-ui/src/components/ARSPageTabs/ARSPageTabs.tsx) |
| ARS_Pagination | [82:31768](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=82-31768) | [ARSPagination](src/ars-ui/src/components/ARSPagination/ARSPagination.tsx) |
| ARS_Password_Reset_Entra_User | [4486:19008](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4486-19008) | [ARSPasswordResetEntraUser](src/ars-ui/src/components/ARSPasswordResetEntraUser/ARSPasswordResetEntraUser.tsx) |
| ARS_Row | [111:29461](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=111-29461) | [ARSRow](src/ars-ui/src/components/ARSRow/ARSRow.tsx) |
| ARS_Sidebar | [2385:56389](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-56389) | [ARSSidebar](src/ars-ui/src/components/ARSSidebar/ARSSidebar.tsx) |
| ARS_Stepper_with_div | [3367:11939](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3367-11939) | [ARSStepperWithDiv](src/ars-ui/src/components/ARSStepperWithDiv/ARSStepperWithDiv.tsx) |
| ARS_Sub_Tabs_Template | [4503:19905](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4503-19905) | [ARSSubTabsTemplate](src/ars-ui/src/components/ARSSubTabsTemplate/ARSSubTabsTemplate.tsx) |
| ARS_Table | [99:30760](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=99-30760) | [ARSTable](src/ars-ui/src/components/ARSTable/ARSTable.tsx) |
| ARS_Table Menu | [3663:20381](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3663-20381) | [ARSTableMenu](src/ars-ui/src/components/ARSTableMenu/ARSTableMenu.tsx) |
| ARS_Table_Config | [3663:19416](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3663-19416) | [ARSTableConfig](src/ars-ui/src/components/ARSTableConfig/ARSTableConfig.tsx) |
| ARS_Table_Group_Row | [2843:24711](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2843-24711) | [ARSTableGroupRow](src/ars-ui/src/components/ARSTableGroupRow/ARSTableGroupRow.tsx) |
| ARS_Table_Header | [3368:12193](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3368-12193) | [ARSTableHeader](src/ars-ui/src/components/ARSTableHeader/ARSTableHeader.tsx) |
| ARS_Table_Row_Header | [2385:56534](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2385-56534) | [ARSTableRowHeader](src/ars-ui/src/components/ARSTableRowHeader/ARSTableRowHeader.tsx) |
| ARS_Table_Toolbar | [2613:23294](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2613-23294) | [ARSTableToolbar](src/ars-ui/src/components/ARSTableToolbar/ARSTableToolbar.tsx) |
| ARS_Treeview_Master | [3367:42088](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3367-42088) | [ARSTreeviewMaster](src/ars-ui/src/components/ARSTreeviewMaster/ARSTreeviewMaster.tsx) |
| ARS_User_Page | [3129:8132](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3129-8132) | [ARSUserPage](src/ars-ui/src/components/ARSUserPage/ARSUserPage.tsx) |
| ARS_User_Page_Header | [3598:47947](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3598-47947) | [ARSUserPageHeader](src/ars-ui/src/components/ARSUserPageHeader/ARSUserPageHeader.tsx) |
| ARS_User_Page_Tabs | [3598:46761](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3598-46761) | [ARSUserPageTabs](src/ars-ui/src/components/ARSUserPageTabs/ARSUserPageTabs.tsx) |
| ARS_User_Password_Reset_AD | [4486:18890](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4486-18890) | [ARSUserPasswordResetAD](src/ars-ui/src/components/ARSUserPasswordResetAD/ARSUserPasswordResetAD.tsx) |
| ARS_Users_ContactInfo Card | [2820:30082](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2820-30082) | [ARSUsersContactInfoCard](src/ars-ui/src/components/ARSUsersContactInfoCard/ARSUsersContactInfoCard.tsx) |
| ARS_Users_Job Info Card | [2820:29901](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2820-29901) | [ARSUsersJobInfoCard](src/ars-ui/src/components/ARSUsersJobInfoCard/ARSUsersJobInfoCard.tsx) |
| ARS_users_Properties Card | [2820:29757](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2820-29757) | [ARSUsersPropertiesCard](src/ars-ui/src/components/ARSUsersPropertiesCard/ARSUsersPropertiesCard.tsx) |
| Create menu | [3360:40902](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=3360-40902) | [ARSCreateMenu](src/ars-ui/src/components/ARSCreateMenu/ARSCreateMenu.tsx) |
| Entra User Bulk Actions | [2275:91260](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=2275-91260) | [ARSEntraUserBulkActions](src/ars-ui/src/components/ARSEntraUserBulkActions/ARSEntraUserBulkActions.tsx) |
| Reset_Content success | [4486:19024](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4486-19024) | [ARSResetContentSuccess](src/ars-ui/src/components/ARSResetContentSuccess/ARSResetContentSuccess.tsx) |
| Tree_View_AD_Content | [4517:19943](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS---Primary?node-id=4517-19943) | [ARSTreeViewADContent](src/ars-ui/src/components/ARSTreeViewADContent/ARSTreeViewADContent.tsx) |
