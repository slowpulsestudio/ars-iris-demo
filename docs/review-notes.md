# Design review

Design review tasks for the ARS_WebUI2_CRUD screens ([Figma](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1291-39864)), split by flow. Tick an item once you've reviewed it.

**How to review.** Start the app with `pnpm dev --port 5191 --strictPort` in `src/iris-shell` and open http://localhost:5191/. The checklist is also in the app: the clipboard button on the welcome page opens Design review, then Design review tasks. While the dev server runs, ticking an item there edits this file. Each flow has two parts: **Compare with Figma** (look at the screen beside its frame) and **Confirm** (design decisions I made where Figma was silent or unclear).

**Not checked on screen.** None of these screens have been compared with Figma in a browser yet. Layout, spacing, type, colour and states are all unchecked.

**Figma annotations.** Figma's own annotations can't be read with the read-only tools. Anything an annotation says that isn't in the layers or the kit's component notes is missing.

## Flow 1: lists and left panel

Where: `#/users` (Flat view), `#/tree` and any folder (Tree view), the Favorites tab.

### Compare with Figma

- [ ] Directory panel, Flat view: view switch, directory picker, entity list ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)).
- [ ] Directory panel, Tree view: tree rows, indent lines, selected row, the right-click menu ([1369:32139](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-32139)).
- [ ] Users list: header, toolbar, the five columns, row height, tags, status badge, pagination ([Flat view 3091:15082](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3091-15082)).
- [ ] Folder list: header, Split Create button, Name / Object type / Description columns, pagination ([1369:32139](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-32139)).
- [ ] Search results ([1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)). Not compared separately; it uses the same toolbar search.
- [ ] No folder selected ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)).
- [ ] Menus: filter, page "…", create, New object, AD and Entra user actions.

### Confirm

- [ ] **Empty states.** `#/tree` uses the Iris empty figure (Branches). A folder with no objects uses `ARS_Empty_Content` with the ARS "No data" drawing. Pick one style.
- [ ] **Filter pills dropped.** The Figma frames show only the filter button, so the old filter pills are gone. The filter menu items do nothing.
- [ ] **Panel width.** Fixed at 254px as in Figma. The old drag-to-resize handle is gone.
- [ ] **Made-up data.** Users have invented Tags and Location values so the new columns have content.
- [ ] **Row menus.** Rows with Location `Entra` get the Entra actions menu (no Delete); the rest get the AD actions menu. Figma doesn't say which a Flat view row uses.
- [ ] **Earlier open items.** `ARS_Create_Menu_Button` is a plain frame in Figma but uses the Iris SplitButton in code. `--oi-content-color-placeholder` is missing. `--oi-motion-ease-move` is listed in the motion skill but not defined.

## Flow 2: selection bars and create

Where: select rows in either list; Create (Flat view) or Create / New object (Tree view); Select destination folder; create an object and use the toast's View.

### Compare with Figma

- [ ] Action bar for one selected row, with Show selected ([1378:48538](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-48538)).
- [ ] Action bar for several selected rows, "N of total selected" ([1378:49550](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-49550)).
- [ ] New object menu ([1293:49512](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1293-49512)).
- [ ] New object modal, step 1 General: stepper, fields, dropdown, folder button, footer ([1345:24260](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24260)).
- [ ] New object modal, step 2 Account ([1345:24274](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24274)).
- [ ] Footer states: disabled and enabled "Save and continue", then "Create object" ([1378:47487](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-47487)).
- [ ] Select folder side sheet ([1746:14585](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1746-14585)). Built from a screenshot only.
- [ ] Created toast with View and Dismiss ([1724:13727](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1724-13727)).

### Confirm

- [ ] **Which bar shows.** Variant 2 for one selected row, the Default bulk bar with the total for several. This comes from screenshots.
- [ ] **Show selected.** It filters the list to the selected rows. Figma doesn't say what it does.
- [ ] **"…" on the single-select bar.** It opens that row's actions menu. Figma draws no menu for it.
- [ ] **No-op actions.** Delete with several rows selected, and the Bulk create / invite / delete entries in the New object menu, do nothing.
- [ ] **One form for every type.** All object types use the same two steps (General, Account). Figma draws only the user form.
- [ ] **What a created object does.** A user joins the Users list or the folder. Other types join a folder as plain objects. A non-user created from the Flat view shows the toast without View and isn't listed.
- [ ] **Step 1 gating.** Save and continue needs the six Required fields, as the Figma footer variants show.

## Flow 3: object page and edit

Where: open a user from either list (`#/users/<id>` or a folder), then Edit on the General tab.

### Compare with Figma

- [ ] Page header: back, icon, title, class and location, arrows, "…" ([1369:30614](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-30614)).
- [ ] Tabs row (eleven tabs).
- [ ] Overview: profile, details, four count tiles ([3500:18134](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3500-18134), [1378:51604](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-51604)).
- [ ] General, read mode: Properties card and Object Management panel ([1378:55162](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-55162)).
- [ ] General, edit mode: field widths, required marks, Directory dropdown, description box, Cancel and Save ([1378:54606](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-54606)).
- [ ] Save error: banner above the card and the field error ([1388:57779](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1388-57779)).

### Confirm

- [ ] **Placeholder content.** Created on, Last sign-in, the four count tiles and the "Member" badge on the Overview are placeholders.
- [ ] **Two different forms in Figma.** The save-error frame shows other fields (Name, User logon name, Suffix, pre-Windows 2000) from the normal edit form. I kept one form and put "User logon name already exists." on the User principal name field.
- [ ] **What triggers the error.** A required field left empty, or another user with the same principal name. Figma doesn't say.
- [ ] **Other tabs.** Every tab except Overview and General shows the Iris empty figure.
- [ ] **Objects that aren't users.** Groups, computers, contacts and OUs in the Tree view still use the old detail page. The CRUD file only draws users.
- [ ] **Directory dropdown.** Only `@Entra1` and `@O1D.Local`.

## Flow 4: delete, password reset, unsaved changes

Where: Delete and Reset password from a row menu, the selection bar or the object page; edit a user, change a field, then leave.

### Compare with Figma

- [ ] Delete, confirm step ([1755:15057](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15057)).
- [ ] Delete, wait step ([1755:15056](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15056)).
- [ ] Delete, success step ([1755:15055](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15055)).
- [ ] AD password reset: empty, filled, wait, success ([3269:35695](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35695), [3269:35790](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35790), [3269:35884](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35884), [3269:35915](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35915)).
- [ ] Entra password reset ([3269:36076](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-36076)).
- [ ] Unsaved changes modal ([3534:19369](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19369)).
- [ ] Update toast ([3534:19514](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19514)).

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

Where: open a user from either list, then the User Details tab.

### Compare with Figma

- [ ] User Details tab ([ARS_Object_Content, Variant3, 2385:56718](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=2385-56718)): Contact information and Job information cards, read and edit.

### Confirm

- [ ] **Sample values.** Every user shows Figma's sample values, except Email, which is the user's own. Nothing else about a user feeds these fields.
- [ ] **Contact edit form.** Figma's edit variant of the Contact information card shows the job fields. The app edits the contact fields instead.
- [ ] **Session only.** Saved values are kept in memory and reset on reload.
- [ ] **Each card on its own.** Edit, Cancel and Save act on one card. Leaving with unsaved changes in either card shows the Unsaved changes modal.
- [ ] **Not built.** Bulk delete, detail pages for objects other than users, and the user tabs after User Details aren't drawn in the CRUD file, so they stay empty states.

## Flow 6: move objects

Figma: [ARS_WebUI2_Move_Browse_Objects](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2008-1687), a different file from the other flows.

Where: Move in a row menu, in the selection bar, or in Object Management on a user page (Flat view and Tree view); in Tree view, drag a row onto a folder in the left panel.

### Compare with Figma

- [ ] Move object side sheet, single ([2381:17307](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-17307), chosen: [2381:17308](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-17308)).
- [ ] Move Objects side sheet, several ([Sidesheet 2290:68343](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2290-68343), frame [ARS_Bulk_Move 2274:30742](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2274-30742)).
- [ ] Selected objects block ([2224:16697](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2224-16697)).
- [ ] Move toast, three drawings: [Toast 2355:28099](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2355-28099) (several), [Move User toast 2396:13581](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2396-13581) (one, View object), [Successfully moved toast 2381:23258](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-23258) (Undo only).
- [ ] Element-Dragged chip ([2281:47208](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2281-47208)) and the drag and drop frame ([2158:17323](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2158-17323)).
- [ ] Row menu with Move ([2381:21456](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-21456)) and selection bar ([2305:85120](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2305-85120)).

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

Where: Tree view, open a group (a row with the Group type), then its tabs.

### Compare with Figma

- [ ] Group page header and tabs ([ARS_Group_Header 158:35994](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-35994), [ARS_Group_Tabs 158:32718](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-32718)).
- [ ] Overview with Object Management ([ARS_Group_Overview 158:33654](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-33654), [ARS_Group_Page_Overview 158:36016](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-36016)).
- [ ] General, read and edit ([General Read 159:7057](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-7057), [General Edit 159:7117](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-7117)).
- [ ] Ownership, read and edit ([Ownership Read 159:8006](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8006), [Ownership Edit 159:8066](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8066)).
- [ ] Object details ([159:8194](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8194)).

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

Where: a group's page, Object Management (Rename, Copy, Deprovision) and the Memberships tab.

### Compare with Figma

- [ ] Memberships tab ([ARS_Group_Members_Content 160:24932](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-24932), [Members and Members of buttons 160:9082](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-9082), [table 160:9033](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-9033)).
- [ ] The written requirements for the dialogs: [Rename 64:6802](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6802), [Copy 64:6804](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6804), [Deprovision 64:6805](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6805).

### Confirm

- [ ] **No frames for the dialogs.** Rename, Copy and Deprovision exist only as written notes, so I built them on the ARS modal panel and the existing destination sheet. Two new components under "Missing from Figma" (Rename Group Modal, Deprovision AD Group) say so. Button labels (Cancel and Rename; No and Yes) and the Deprovision question are mine.
- [ ] **Rename** changes the group's name and its pre-Windows 2000 name, both required. The list and the page header follow.
- [ ] **Copy** uses the Move side sheet, titled Copy, with a Copy button. It makes "Copy of [name]" in the chosen folder (the same folder is allowed), keeps scope, type and the other fields, and shows a toast with Undo and View object. Figma's note says "New User screen", which I took to mean choosing where the copy goes.
- [ ] **Deprovision** asks Yes or No, then shows a toast with Undo. The sample data has no status, so a deprovisioned group shows a "Deprovisioned" badge in its Overview. That badge is mine.
- [ ] **Memberships tab.** Members and Members of buttons, a search, "Add member", the group table and paging. The data has no memberships, so Members are objects from the group's folder (as many as its member count) and Members of are up to three groups from the same folder. "Add member" does nothing yet: Figma's add-members modal ([215:7485](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=215-7485)) is not built. Remove, temporary access and Set primary group (from the notes) aren't built either.
