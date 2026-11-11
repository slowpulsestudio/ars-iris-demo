# Design review

Design review tasks for the ARS_WebUI2_CRUD screens ([Figma](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1291-39864)), split by flow. Tick an item once you've reviewed it.

**How to review.** Start the app with `pnpm dev --port 5193 --strictPort` in `src/iris-shell` and open http://localhost:5193/. The checklist is also in the app: the clipboard button on the welcome page opens Design review, then Design review tasks. While the dev server runs, ticking an item there edits this file. Each flow has two parts: **Compare with Figma** (look at the screen beside its frame) and **Confirm** (design decisions I made where Figma was silent or unclear).

**Prototype links.** Each flow's "Where" line and each Compare item has a **Prototype** link that opens that screen in a new tab. Pick a persona on the welcome screen first, or the link shows the persona picker: David Smith (admin) for Flows 1 to 11, Lisa Fernandez (self-service) for Flow 12. Where the screen is a dialog or a menu, the link opens the page it starts from and says what to click. The sample objects (Isabella Clark, Julian Long, Security Users, Test OU, Global Security) are the same every time the app loads.

**Not checked on screen.** None of these screens have been compared with Figma in a browser yet. Layout, spacing, type, colour and states are all unchecked.

**Figma annotations.** Figma's own annotations can't be read with the read-only tools. Anything an annotation says that isn't in the layers or the kit's component notes is missing.

## Flow 1: lists and left panel

Where: Flat view ([#/users](#/users)), Tree view ([#/tree](#/tree) and any folder, e.g. [Builtin](#/tree/o1d-builtin)), the [Favorites](#/favorites) tab.

### Compare with Figma

- [ ] Directory panel, Flat view: view switch, directory picker, entity list ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)). Prototype: [Flat view](#/users).
- [ ] Directory panel, Tree view: tree rows, indent lines, selected row, the right-click menu ([1369:32139](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-32139)). Prototype: [Builtin folder](#/tree/o1d-builtin), right-click a folder in the left panel.
- [ ] Users list: header, toolbar, the five columns, row height, tags, status badge, pagination ([Flat view 3091:15082](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3091-15082)). Prototype: [Users list](#/users).
- [ ] Folder list: header, Split Create button, Name / Object type / Description columns, pagination ([1369:32139](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-32139)). Prototype: [Builtin folder](#/tree/o1d-builtin).
- [ ] Search results ([1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)). Not compared separately; it uses the same toolbar search. Prototype: [Users list](#/users), type in the search box.
- [ ] No folder selected ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)). Prototype: [Tree view, nothing selected](#/tree).
- [ ] Menus: filter, page "…", create, New object, AD and Entra user actions. Prototype: [Users list](#/users) and [Builtin folder](#/tree/o1d-builtin): the filter button, the "…" by the title, Create and its arrow, and a row's "…".

### Confirm

- [ ] **Empty states.** `#/tree` uses the Iris empty figure (Branches). A folder with no objects uses `ARS_Empty_Content` with the ARS "No data" drawing. Pick one style.
- [ ] **Filter pills dropped.** The Figma frames show only the filter button, so the old filter pills are gone. The filter menu items do nothing.
- [ ] **Panel width.** Fixed at 254px as in Figma. The old drag-to-resize handle is gone.
- [ ] **Made-up data.** Users have invented Tags and Location values so the new columns have content.
- [ ] **Row menus.** Rows with Location `Entra` get the Entra actions menu (no Delete); the rest get the AD actions menu. Figma doesn't say which a Flat view row uses.
- [ ] **Earlier open items.** `ARS_Create_Menu_Button` is a plain frame in Figma but uses the Iris SplitButton in code. `--oi-content-color-placeholder` is missing. `--oi-motion-ease-move` is listed in the motion skill but not defined.

## Flow 2: selection bars and create

Where: select rows in either list ([Users list](#/users), [Builtin folder](#/tree/o1d-builtin)); Create (Flat view) or Create / New object (Tree view); Select destination folder; create an object and use the toast's View.

### Compare with Figma

- [ ] Action bar for one selected row, with Show selected ([1378:48538](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-48538)). Prototype: [Users list](#/users), tick one row.
- [ ] Action bar for several selected rows, "N of total selected" ([1378:49550](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-49550)). Prototype: [Users list](#/users), tick two or more rows.
- [ ] New object menu ([1293:49512](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1293-49512)). Prototype: [Builtin folder](#/tree/o1d-builtin), the arrow beside Create.
- [ ] New object modal, step 1 General: stepper, fields, dropdown, folder button, footer ([1345:24260](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24260)). Prototype: [Users list](#/users), Create.
- [ ] New object modal, step 2 Account ([1345:24274](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24274)). Prototype: [Users list](#/users), Create, fill the required fields, Save and continue.
- [ ] Footer states: disabled and enabled "Save and continue", then "Create object" ([1378:47487](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-47487)). Prototype: [Users list](#/users), Create.
- [ ] Select folder side sheet ([1746:14585](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1746-14585)). Built from a screenshot only. Prototype: [Users list](#/users), Create, the folder button.
- [ ] Created toast with View and Dismiss ([1724:13727](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1724-13727)). Prototype: [Users list](#/users), create a user.

### Confirm

- [ ] **Which bar shows.** Variant 2 for one selected row, the Default bulk bar with the total for several. This comes from screenshots.
- [ ] **Show selected.** It filters the list to the selected rows. Figma doesn't say what it does.
- [ ] **"…" on the single-select bar.** It opens that row's actions menu. Figma draws no menu for it.
- [ ] **No-op actions.** Delete with several rows selected, and the Bulk create / invite / delete entries in the New object menu, do nothing.
- [ ] **One form for every type.** All object types use the same two steps (General, Account). Figma draws only the user form.
- [ ] **What a created object does.** A user joins the Users list or the folder. Other types join a folder as plain objects. A non-user created from the Flat view shows the toast without View and isn't listed.
- [ ] **Step 1 gating.** Save and continue needs the six Required fields, as the Figma footer variants show.

## Flow 3: object page and edit

Where: open a user from either list ([Isabella Clark](#/users/isabella-clark) in Flat view, [Julian Long](#/tree/o1d-builtin/o1d-builtin-o0) in Tree view), then Edit on the General tab.

### Compare with Figma

- [ ] Page header: back, icon, title, class and location, arrows, "…" ([1369:30614](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-30614)). Prototype: [Isabella Clark](#/users/isabella-clark).
- [ ] Tabs row (eleven tabs). Prototype: [Isabella Clark](#/users/isabella-clark).
- [ ] Overview: profile, details, four count tiles ([3500:18134](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3500-18134), [1378:51604](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-51604)). Prototype: [Isabella Clark](#/users/isabella-clark), Overview.
- [ ] General, read mode: Properties card and Object Management panel ([1378:55162](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-55162)). Prototype: [Isabella Clark](#/users/isabella-clark), General.
- [ ] General, edit mode: field widths, required marks, Directory dropdown, description box, Cancel and Save ([1378:54606](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-54606)). Prototype: [Isabella Clark](#/users/isabella-clark), General, Edit.
- [ ] Save error: banner above the card and the field error ([1388:57779](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1388-57779)). Prototype: [Isabella Clark](#/users/isabella-clark), General, Edit, clear a required field, Save.

### Confirm

- [ ] **Placeholder content.** Created on, Last sign-in, the four count tiles and the "Member" badge on the Overview are placeholders.
- [ ] **Two different forms in Figma.** The save-error frame shows other fields (Name, User logon name, Suffix, pre-Windows 2000) from the normal edit form. I kept one form and put "User logon name already exists." on the User principal name field.
- [ ] **What triggers the error.** A required field left empty, or another user with the same principal name. Figma doesn't say.
- [ ] **Other tabs.** Every tab except Overview and General shows the Iris empty figure.
- [ ] **Objects that aren't users.** Groups, computers, contacts and OUs in the Tree view still use the old detail page. The CRUD file only draws users.
- [ ] **Directory dropdown.** Only `@Entra1` and `@O1D.Local`.

## Flow 4: delete, password reset, unsaved changes

Where: Delete and Reset password from a row menu, the selection bar or the object page ([Users list](#/users), [Isabella Clark](#/users/isabella-clark)); edit a user, change a field, then leave.

### Compare with Figma

- [ ] Delete, confirm step ([1755:15057](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15057)). Prototype: [Users list](#/users), a row's "…", Delete.
- [ ] Delete, wait step ([1755:15056](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15056)). Prototype: [Users list](#/users), a row's "…", Delete, type the name, Delete user.
- [ ] Delete, success step ([1755:15055](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15055)). Prototype: as above, after the wait.
- [ ] AD password reset: empty, filled, wait, success ([3269:35695](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35695), [3269:35790](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35790), [3269:35884](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35884), [3269:35915](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35915)). Prototype: [Builtin folder](#/tree/o1d-builtin), Julian Long's "…", Reset Password.
- [ ] Entra password reset ([3269:36076](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-36076)). Prototype: [Users list](#/users), the "…" of a row whose Location is Entra, Reset password.
- [ ] Unsaved changes modal ([3534:19369](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19369)). Prototype: [Isabella Clark](#/users/isabella-clark), General, Edit, change a field, then click another tab.
- [ ] Update toast ([3534:19514](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19514)). Prototype: [Isabella Clark](#/users/isabella-clark), General, Edit, change a field, Save.

### Confirm

- [ ] **New components.** The delete modal and the unsaved-changes modal exist only in the CRUD file. They are in the "Missing from Figma" group in Storybook and on the Components to review page.
- [ ] **Delete button style.** Figma draws "Delete user" in the primary style, not the danger style. The app follows Figma. It stays disabled until the name is typed.
- [ ] **Wait steps.** "Please wait..." lasts a fixed 1.2 seconds for delete and 1.5 for reset, as there is no real work. Delete can't be closed while it waits.
- [ ] **When the object goes.** Delete removes the object when you close the success step, then returns to the list. Bulk delete from the selection bar isn't built, since Figma doesn't draw it.
- [ ] **Other object types.** The delete modal is titled with the type (for example "Delete Computer"). Figma draws only the user.
- [ ] **Entra or AD.** A user is Entra when its Location is `Entra` (Flat view) or its directory is `@Entra1` (user page). Entra goes straight to a generated temporary password. AD gets the form, and Reset password enables when both passwords match. The account options have no effect.
- [ ] **What triggers Unsaved changes.** Cancel, a tab, the header arrows and back button, J/K, the breadcrumb, the sidebar, the browser's Back button and links that only change the address, such as names in the lists. Check that Back leaves the address as it was when you choose to stay.
- [ ] **Wording.** The modal says "will be discard", as Figma does.
- [ ] **Update toast.** It says "Successfully updated User". Its View button has nothing else to open, because the object page is already showing.

## Flow 5: User Details tab

Where: open a user from either list ([Isabella Clark](#/users/isabella-clark)), then the User Details tab.

### Compare with Figma

- [ ] User Details tab ([ARS_Object_Content, Variant3, 2385:56718](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=2385-56718)): Contact information and Job information cards, read and edit. Prototype: [Isabella Clark](#/users/isabella-clark), User Details.

### Confirm

- [ ] **Sample values.** Every user shows Figma's sample values, except Email, which is the user's own. Nothing else about a user feeds these fields.
- [ ] **Contact edit form.** Figma's edit variant of the Contact information card shows the job fields. The app edits the contact fields instead.
- [ ] **Session only.** Saved values are kept in memory and reset on reload.
- [ ] **Each card on its own.** Edit, Cancel and Save act on one card. Leaving with unsaved changes in either card shows the Unsaved changes modal.
- [ ] **Not built.** Bulk delete, detail pages for objects other than users, and the user tabs after User Details aren't drawn in the CRUD file, so they stay empty states.

## Flow 6: move objects

Figma: [ARS_WebUI2_Move_Browse_Objects](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2008-1687), a different file from the other flows.

Where: Move in a row menu, in the selection bar, or in Object Management on a user page (Flat view and Tree view); in Tree view, drag a row onto a folder in the left panel. Start from the [Builtin folder](#/tree/o1d-builtin) or [Julian Long](#/tree/o1d-builtin/o1d-builtin-o0).

### Compare with Figma

- [ ] Move object side sheet, single ([2381:17307](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-17307), chosen: [2381:17308](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-17308)). Prototype: [Builtin folder](#/tree/o1d-builtin), a row's "…", Move.
- [ ] Move Objects side sheet, several ([Sidesheet 2290:68343](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2290-68343), frame [ARS_Bulk_Move 2274:30742](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2274-30742)). Prototype: [Builtin folder](#/tree/o1d-builtin), tick two or more rows, Move in the selection bar.
- [ ] Selected objects block ([2224:16697](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2224-16697)). Prototype: as above; it is the block of tags at the top of the sheet.
- [ ] Move toast, three drawings: [Toast 2355:28099](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2355-28099) (several), [Move User toast 2396:13581](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2396-13581) (one, View object), [Successfully moved toast 2381:23258](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-23258) (Undo only). Prototype: move one or several objects from the [Builtin folder](#/tree/o1d-builtin).
- [ ] Element-Dragged chip ([2281:47208](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2281-47208)) and the drag and drop frame ([2158:17323](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2158-17323)). Prototype: [Builtin folder](#/tree/o1d-builtin), drag a row onto a folder in the left panel.
- [ ] Row menu with Move ([2381:21456](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-21456)) and selection bar ([2305:85120](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2305-85120)). Prototype: [Builtin folder](#/tree/o1d-builtin), a row's "…", or tick a row.

### Confirm

- [ ] **Three new components.** Selected objects block, the Move toast and Element-Dragged are not in ARS - Primary. They are under "Missing from Figma" in Storybook and on the Components to review page. The side sheet itself needs no new component: it is the Iris Side sheet with the directory tree.
- [ ] **Iris Side sheet.** It gained an optional header icon for Figma's folder-arrow icon. Figma's subtitle is 14px in the secondary colour; the Iris sheet uses a smaller, lighter caption. I left that as it is, since the Select folder sheet shares it.
- [ ] **Toast wording and buttons.** One object: "User Evelyn Park moved to Test1 successfully." with Undo and View object (the newer Move User toast; the other drawing has Undo only). Several: "Moved 3 objects to Test1 successfully." with Undo and View, which opens the destination folder. The toast closes after 5 seconds, like the others.
- [ ] **Undo.** It puts each object back in its old folder and position, and returns to the old address when it was moved from its own page.
- [ ] **Move stays disabled** until a folder is chosen that can take the objects. A folder an object is already in is refused, and an OU can't go into itself or one of its folders. In the several-objects sheet, removing a tag leaves it out of the move; with none left, Move is disabled.
- [ ] **Flat view.** Users there have a Location as text, not a place in the tree, so Move sets the Location to the folder's path (for example "O1D.local\Test OU\Test1", or "Entra"). A moved user does not appear in that folder in Tree view, because the two lists are separate sample data. Moving between AD and Entra is allowed.
- [ ] **Tree view.** Moving an object changes its folder; its Location on the page follows. The old object pages for computers, groups and the rest got a Move item in their menu, which Figma doesn't draw.
- [ ] **Row menu.** The row menu is the existing ARS_AD User Actions menu, which already has Move. Figma also draws a smaller ARS_Object_Menu ([4055:26642](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=4055-26642): View properties, Move, Add to favorites, Delete). It isn't used anywhere yet, since I couldn't tell which objects get it.
- [ ] **Drag and drop.** Rows in the Tree view table can be dragged onto a folder in the left panel; dragging a selected row takes the whole selection. The chip is the Folder variant for folders and the User variant for everything else. A closed folder opens after the pointer rests on it for 0.6 seconds (Figma gives no time). Valid folders use the tree's existing drop highlight; Figma draws no drop state. It isn't available in Flat view, whose left panel has no folders.
- [ ] **Permissions.** Figma says permission checks are respected. There are none in the sample data, so every folder is allowed except the invalid ones above.
- [ ] **Unsaved changes.** Moving a user from the page while their form has unsaved changes asks first, as leaving does.

## Flow 7: group page (Groups file, part 1)

Figma: [ARS_WebUI2_Groups](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24). Part 1 is the group page only; the group dialogs, the create flows and the other tabs follow.

Where: Tree view, open a group (a row with the Group type, e.g. [Security Users](#/tree/o1d-builtin/o1d-builtin-o23)), then its tabs.

### Compare with Figma

- [ ] Group page header and tabs ([ARS_Group_Header 158:35994](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-35994), [ARS_Group_Tabs 158:32718](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-32718)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23).
- [ ] Overview with Object Management ([ARS_Group_Overview 158:33654](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-33654), [ARS_Group_Page_Overview 158:36016](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-36016)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Overview.
- [ ] General, read and edit ([General Read 159:7057](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-7057), [General Edit 159:7117](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-7117)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), General, then Edit.
- [ ] Ownership, read and edit ([Ownership Read 159:8006](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8006), [Ownership Edit 159:8066](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8066)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Ownership, then hover the card and Edit.
- [ ] Object details ([159:8194](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8194)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Object details.

### Confirm

- [ ] **Tabs.** The sticky notes list Members, Members Of, Managed Units, Object and History; ARS_Group_Tabs draws Overview, General, Ownership, Memberships, Managed units, Roles/access templates, Object details and History. I used the tabs frame. Memberships, Managed units, Roles/access templates and History show an empty state for now.
- [ ] **Radio buttons.** Figma draws Group scope and Group type as radio buttons, and Iris had none. I added an Iris Radio (Storybook: Iris/Radio) and a checkbox option on the kit's form field.
- [ ] **Not the kit's group card.** The ARS - Primary kit has a group Properties card (Group name, Display name and so on, in a dropdown). This file draws a different General card, so the page follows this file.
- [ ] **Overview.** It uses the existing Overview template (profile summary and count tiles) with this file's numbers: total, users, groups, devices, others, owners. Figma draws "Basic information" as labelled rows with an "Overview" title and subtitle, and a Source of Cloud. The counts are made up from the group's size (owners is 0).
- [ ] **Object Management.** Rename, Move, Copy, Deprovision and Delete (see Flow 8). Figma draws Move, Copy, Deprovision and Delete; Rename is added at the top from the written requirements.
- [ ] **Ownership.** The manager and secondary owners show "Not set". Figma's annotation says the full Add manager interaction is in the OU feature, so there is no picker yet; it comes with the OU flow. "Manager can update membership list" is disabled until a manager is set.
- [ ] **Sample values.** Scope, type and email are derived from the group (email is its name at contoso.com). Modified date, USNs and SID in Object details are Figma's samples. "Protect from deletion" is shown as No, not a checkbox. Tags are typed as text, not drawn as chips.
- [ ] **Values are kept for the session.** Display name and description are saved to the group, so the list shows them; the other fields reset on reload.
- [ ] **Description counter.** Figma shows "0/100"; the field has no limit or counter yet.

## Flow 8: group dialogs and Memberships (Groups file, part 2)

Figma: [ARS_WebUI2_Groups](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24).

Where: a group's page ([Security Users](#/tree/o1d-builtin/o1d-builtin-o23)), Object Management (Rename, Copy, Deprovision) and the Memberships tab.

### Compare with Figma

- [ ] Memberships tab ([ARS_Group_Members_Content 160:24932](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-24932), [Members and Members of buttons 160:9082](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-9082), [table 160:9033](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-9033)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Memberships.
- [ ] The written requirements for the dialogs: [Rename 64:6802](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6802), [Copy 64:6804](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6804), [Deprovision 64:6805](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6805). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Overview, then Rename, Copy or Deprovision in Object Management.

### Confirm

- [ ] **No frames for the dialogs.** Rename, Copy and Deprovision exist only as written notes, so I built them on the ARS modal panel and the existing destination sheet. Two new components under "Missing from Figma" (Rename Group Modal, Deprovision AD Group) say so. Button labels (Cancel and Rename; No and Yes) and the Deprovision question are mine.
- [ ] **Rename** changes the group's name and its pre-Windows 2000 name, both required. The list and the page header follow.
- [ ] **Copy** uses the Move side sheet, titled Copy, with a Copy button. It makes "Copy of [name]" in the chosen folder (the same folder is allowed), keeps scope, type and the other fields, and shows a toast with Undo and View object. Figma's note says "New User screen", which I took to mean choosing where the copy goes.
- [ ] **Deprovision** asks Yes or No, then shows a toast with Undo. The sample data has no status, so a deprovisioned group shows a "Deprovisioned" badge in its Overview. That badge is mine.
- [ ] **Memberships tab.** Members and Members of buttons, a search, "Add member", the group table and paging. The data has no memberships, so Members are objects from the group's folder (as many as its member count) and Members of are up to three groups from the same folder. "Add member" does nothing yet: Figma's add-members modal ([215:7485](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=215-7485)) is not built. Remove, temporary access and Set primary group (from the notes) aren't built either.

## Flow 9: Add Member, Groups list and creating groups (Groups file, part 3)

Figma: [ARS_WebUI2_Groups](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24).

Where: Memberships tab, Add member; Directory Management, [Groups](#/groups); Create, Group in Flat view, or New, New Group in Tree view ([Builtin folder](#/tree/o1d-builtin) for AD, [3bf67d.onmicrosoft.com](#/tree/entra-3bf67d) for Entra).

### Compare with Figma

- [ ] Add Member modal ([215:7485](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=215-7485)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Memberships, Add member.
- [ ] Groups list ([ARS_Table_Groups 158:33464](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-33464), frame [157:14884](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=157-14884)). Prototype: [Groups](#/groups).
- [ ] The written requirements for New AD Group ([steps 1 and 2: 2111:11197](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2111-11197), [2111:11198](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2111-11198)) and New Entra Distribution Group ([2113:12494](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2113-12494)). Prototype: the arrow beside Create, New Group, in the [Builtin folder](#/tree/o1d-builtin) (AD) or [3bf67d.onmicrosoft.com](#/tree/entra-3bf67d) (Entra).

### Confirm

- [ ] **Add Member.** Lists the objects in the group's folder that aren't members yet, with a search, paging, the chosen objects as removable tags and Cancel and Save. Save adds them to Members for the session and shows a toast. A new component under "Missing from Figma".
- [ ] **Groups list.** It reuses the Tree view list layout with the column "Group type" (Security or Distribution) and every group in the directory. Figma's table has more columns than the two it names, and its toolbar isn't clear, so this follows the Tree view list. Rows open the group page. A row's "..." button does nothing yet.
- [ ] **Creating a group.** In Tree view, New Group in an Entra directory opens New Entra Distribution Group; anywhere else it opens New AD Group (two steps: General, then the Exchange e-mail address). In Flat view and from the Groups list the group is made in O1D.local. Both flows come from written notes with no frames, so the layout is the New object modal; the Exchange step's Alias is read-only (the group name) and Associated administrative group shows the folder, which is my guess.
- [ ] **Entra Distribution Group.** One form with Join and Leave toggles (Open or Closed) whose tooltips use Figma's text; the two Closed tooltips both start "Only group owners can add members", as in the notes. A group made here is a Distribution, Universal group.
- [ ] **Still empty.** Managed units and Roles/access templates (marked NEW, no content in Figma) and History (Change History and User Activity, no frames) show the empty state.

## Flow 10: organizational units (OU Management file)

Figma: [ARS_WebUI2_OU_Management](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1009-3972) (page "Iris UI", section "Current screens"; the ARCHIVED section is not built).

Where: Tree view, the arrow beside Create, New Organizational Unit ([Builtin folder](#/tree/o1d-builtin)), or Create in Flat view; a row's "..." menu, View properties; the Ownership tab of a group or an OU ([Test OU](#/tree/o1d-local/o1d-test-ou)).

### Compare with Figma

- [ ] New Organizational Unit modal ([ARS_New_Organizational_Unit 1394:14812](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1394-14812), screen [1349:12126](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1349-12126)). Prototype: [Builtin folder](#/tree/o1d-builtin), the arrow beside Create, New Organizational Unit.
- [ ] OU Overview ([1131:10263](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1131-10263)). Prototype: [Test OU](#/tree/o1d-local/o1d-test-ou).
- [ ] OU General, read and edit ([1065:6047](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1065-6047), [1069:7492](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1069-7492)). Prototype: [Test OU](#/tree/o1d-local/o1d-test-ou), General, then Edit.
- [ ] Ownership: [ARS_Managed_by 1200:10265](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1200-10265), [saved 1373:11754](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1373-11754), [Add/Change Manager 1189:7985](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1189-7985). Prototype: [Test OU](#/tree/o1d-local/o1d-test-ou), Ownership, hover the card, Edit, Add manager.
- [ ] Object details ([1065:8070](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1065-8070)). Prototype: [Test OU](#/tree/o1d-local/o1d-test-ou), Object details.

### Confirm

- [ ] **New Organizational Unit.** Name (required), Description, "Protect container from accidental deletion", and Figma's explanation on the right; the button reads "Save & Continue →". Figma draws the header icon as a user (copied from the New User modal) and I kept it. The second checkbox, "Open properties for this object when I click finish", is from the written note, not the frame. Without it ticked you stay on the list and the toast offers View; with it, the OU's page opens. A new component under "Missing from Figma".
- [ ] **Where the OU page opens.** There is no frame showing how you reach it, so it opens from View properties in a row's menu (the menu already has it) and from Open properties after creating.
- [ ] **Tabs.** Overview, General, Ownership, Roles, Object details, History as the header draws them. Roles and History are empty: the Change History frame says "In progress under Change history Figma file". Figma also draws a count after History (12); I left it out.
- [ ] **Overview.** Five count tiles taken from what the OU holds. Figma's annotation says a card opens the filtered list of objects; the tiles aren't clickable yet. The count tiles use the existing Overview layout.
- [ ] **Object management.** Move and Delete, as the Overview draws them. Delete removes the OU and everything under it. Move uses the same side sheet; an OU can't go into itself or its folders.
- [ ] **General.** Description, street address, city, state/province, zip/postal code and country/region, from the written Edit AD OU note. Saved for the session, except the description, which the list shows too.
- [ ] **Ownership (also on groups).** The Managed by card now shows a manager, office details and secondary owners. Add manager and Add owner open the Add Member modal as a picker (the Add/Change Manager frame shows a modal like it); the manager is one person, owners can be several. To change the manager, remove it and add another; Figma's pencil on the manager isn't wired. Groups add the two "can update membership list" checkboxes from the written notes.
- [ ] **Object details.** A Properties card of read-only values; "Protect object from accidental deletion" is Yes or No, not a disabled checkbox. A new OU is protected unless you untick it.
- [ ] **Deleting OUs from the list** now removes the OU (before, nothing happened).

## Flow 11: Managed Units

Figma: [ARS_WebUI2_Managed-Units](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=4002-9991) (section "Managed Units" on page "Design"; "As-Is" and "Wires" are not built).

Where: Flat view, Management units in the left panel ([Managed Units](#/management-units)); open a unit to see its members ([Global Security](#/management-units/global-security)).

### Compare with Figma

- [ ] Managed Units list ([ARS_Managed_Users_Content 7058:6179](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7058-6179), screen [ARS_Flat_Master 7051:3954](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7051-3954)). Prototype: [Managed Units](#/management-units).
- [ ] A unit's members ([ARS_Managed_Unit_Members 7074:6939](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7074-6939), [table 7064:12185](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7064-12185), screen [7064:14262](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7064-14262)). Prototype: [Global Security](#/management-units/global-security).
- [ ] Selection bar ([ARS_Action_bar 7077:3722](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7077-3722)) and row menu ([ARS_AD User Actions 7077:3917](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7077-3917)). Prototype: [Global Security](#/management-units/global-security), tick a member.

### Confirm

- [ ] **Two new components** under "Missing from Figma": the Managed Units list and the unit's members page.
- [ ] **Sample data.** The 15 units and the member names are Figma's sample rows; the app has no managed-unit data. Each unit shows 8 to 15 of the sample members, rotated per unit. Figma's list says there are more pages; there is one page of 15.
- [ ] **Route.** The list is at the existing Management units entry (before, a placeholder); a unit opens at its own address, so it can be linked. Its header's arrows step to the previous and next unit. The header reads "[unit] Members" and "O1D.local · Managed Units", which stands in for Figma's "[Directory name] [Location]".
- [ ] **Selection bar.** It appears when members are ticked, with Select all and close. Its other buttons (Copy, Move, Properties, Delete) do nothing, since members aren't directory objects here. The row "..." menu and Figma's ARS_AD User Actions menu aren't wired on these tables.
- [ ] **Tree view.** The Managed units folder in Tree view still shows generated objects. Figma's ARS_Treeview_Master ([7051:7736](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7051-7736)) isn't built.
- [ ] **No create.** The list has a search only; Figma shows no Create button.

## Flow 12: self-service screens (User-View-Approvals file)

Figma: [ARS_WebUI2_User-View-Approvals](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6651) (page "Iris"; "Ideation" and "As-Is" are not built).

Where: the self-service persona's navigation: [Home](#/user-view/home), [User Profile](#/user-view/profile), [Approvals](#/user-view/approvals) and [My Access](#/user-view/my-access). Pick Lisa Fernandez on the welcome screen first.

### Compare with Figma

- [ ] Home ([home-dashboard 10199:6772](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6772)). Prototype: [Home](#/user-view/home).
- [ ] My Access ([my-access-screen-full 10199:6654](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6654)) and its Request Access side sheet ([10199:7056](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7056)). Prototype: [My Access](#/user-view/my-access), then Request Access.
- [ ] User Profile ([user-profile-settings 10199:7207](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7207), content [10199:7273](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7273)). Prototype: [User Profile](#/user-view/profile).
- [ ] Approvals ([Design-1-Approvals-Dashboard 10199:7351](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7351)). Prototype: [Approvals](#/user-view/approvals).
- [ ] Approve, Deny and Escalate modals ([10199:7617](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7617), [10199:7638](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7638), [10199:7659](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7659)). Prototype: [Approvals](#/user-view/approvals), open a pending request, then Approve, Deny or Escalate.
- [ ] Review, Approved and Denied side sheets ([10300:2178](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10300-2178), [10300:8498](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10300-8498), [10300:8588](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10300-8588)) and the Person card ([10301:2300](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10301-2300)). Prototype: [Approvals](#/user-view/approvals), open a pending request, or an approved or denied one under Previous.

### Confirm

- [ ] **Built from Iris components, not the ARS kit.** This file is Iris-only, so nothing was added to "Missing from Figma". The views are in `views/UserView/`.
- [ ] **Sample data.** The rows, names and counts are Figma's samples (8 access records, 5 named approval requests); I generated 11 more approval requests so the tabs show 16, 3 and 13 as in Figma. "Approved Today 12", "Rejected Today 1", "20 Total" and "4 Objects" on Home and Approvals are Figma's numbers, not computed.
- [ ] **Charts on Home.** Iris has no line chart, so Response Time is drawn as a bar chart. The bar values and the 75/15/10 split are placeholders because Figma's chart values aren't readable.
- [ ] **My Access.** Auto Extend is a toggle only on Active rows. Export downloads the visible rows as a CSV (Figma doesn't say what Export does). Submitting a request adds a Pending row and a toast, with the owner and description taken from the chosen object; Submit needs an object and a reason.
- [ ] **Approvals.** Figma doesn't say how a row opens the sheet; I added a Review button (Pending) or View button (decided) to each row. Approve, Deny and Escalate open the modals from the Review sheet; Approve and Deny move the request to Previous with a toast, and Deny requires a reason. Escalate only shows a toast, since no email is sent.
- [ ] **Profile.** Fields are editable but there are no Save or Cancel buttons in Figma, so changes aren't kept after leaving the page. Add from File and Copy to File show a "not available" toast; Remove deletes the ticked certificates.
- [ ] **Person card.** Built as a small shared part (avatar, name, email, role badge) used in the Request Access and Review sheets.
- [ ] **Not checked in a browser.** The build, type and motion checks pass, but these screens haven't been seen running.
