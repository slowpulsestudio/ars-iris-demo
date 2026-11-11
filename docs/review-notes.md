# Design review

Design review tasks for the built screens, split by flow. The first six flows are from the ARS_WebUI2_CRUD file ([Figma](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1291-39864)) and the Move file; the rest come from the Groups, OU Management, Managed Units and User-View files. Tick an item once you've reviewed it.

**How to review.** Start the app with `pnpm dev --port 5193 --strictPort` in `src/iris-shell` and open http://localhost:5193/. The checklist is also in the app: the clipboard button on the welcome page opens Design review, then Design review tasks. While the dev server runs, ticking an item there edits this file. Each flow has two parts: **Compare with Figma** (look at the screen beside its frame) and **Confirm** (design decisions I made where Figma was silent or unclear).

**Prototype links.** Each flow's "Where" line and each Compare item has a **Prototype** link that opens that screen in a new tab. The link signs you in as the flow's persona, so there is no need to pick one first: David Smith (admin) for Flows 1 to 11 and Lisa Fernandez (self-service) for Flow 12. A flow can set its own persona with a `Persona:` line under its heading (the persona's id, for example `self-service-end-user`); without one it is `admin-user`. In the file the links are plain app addresses like `#/users`; the Design review tasks page adds the persona (`#/admin-user/users`). A link also opens the screen in the state the item is about: a tab (`?tab=general`), a card in edit mode (`&edit=general`), an open dialog or side sheet (`?dialog=delete`), ticked rows (`?select=a,b`) or an open request (`?request=REQ-001&modal=approve`); the full list of address parts is in `docs/deep-linking.md`. Only things that can't be set from an address are left as "click…": menus, the second step of the New object modal, the waiting steps of Delete and Reset password, and changing a field before Save. The sample objects (Isabella Clark, Julian Long, Security Users, Test OU, Global Security) are the same every time the app loads.

**Checked on screen (November 2026).** All twelve flows were opened in the running app and compared with Figma's layer values (text, spacing, colours, widths) by reading the page, not by eye. What was wrong was fixed; what still differs or isn't in Figma is listed under each flow's Confirm, marked **New**. Figma is the source of truth: where the app differed it now follows Figma, except for spelling mistakes and quote style, which are on the **Figma tidy-up** card for you to fix in Figma. Every item and every question has its Figma node link. Nothing is open: if I have a question, it goes in a "Questions for the designer" card at the end.

**Figma annotations.** Figma's own annotations can't be read with the read-only tools. Anything an annotation says that isn't in the layers or the kit's component notes is missing.

## Flow 1: lists and left panel

Where: Flat view ([#/users](#/users)), Tree view ([#/tree](#/tree) and any folder, e.g. [Builtin](#/tree/o1d-builtin)), the [Favorites](#/favorites) tab.

### Compare with Figma

- [ ] Directory panel, Flat view: view switch, directory picker, entity list ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)). Prototype: [Flat view](#/users).
- [ ] Directory panel, Tree view: tree rows, indent lines, selected row ([panel 3563:17384](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3563-17384), [tree rows 3563:17385](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3563-17385)) and the right-click menu ([2385:57427](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2385-57427)). Prototype: [Builtin folder](#/tree/o1d-builtin), right-click a folder in the left panel.
- [ ] Users list: header, toolbar, the five columns, row height, tags, status badge, pagination ([Flat view 3091:15082](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3091-15082)). Prototype: [Users list](#/users).
- [ ] Folder list: header, Split Create button, Name / Object type / Description columns, pagination ([Tree_View_AD_Content 4517:19943](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=4517-19943), shown in the CRUD file's [search screen 1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)). Prototype: [Builtin folder](#/tree/o1d-builtin).
- [ ] Search results ([1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)). Compared with the Tree view search frame: Name 180, Object type 119, Description flex, config column. Prototype: [Users list](#/users), type in the search box.
- [ ] No folder selected ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)). Prototype: [Tree view, nothing selected](#/tree).
- [ ] Menus: filter, page "…", create, New object, AD and Entra user actions. Prototype: [Users list](#/users) and [Builtin folder](#/tree/o1d-builtin): the filter button, the "…" by the title, Create and its arrow, and a row's "…".

### Confirm

- [ ] **Empty states.** `#/tree` uses the Iris empty figure (Branches). A folder with no objects uses `ARS_Empty_Content` with the ARS "No data" drawing. Pick one style.
- [ ] **Filter pills dropped.** The Figma frames show only the filter button, so the old filter pills are gone. The filter menu items do nothing.
- [ ] **Panel width.** Fixed at 254px as in Figma. The old drag-to-resize handle is gone.
- [ ] **Made-up data.** Users have invented Tags and Location values so the new columns have content.
- [ ] **Row menus.** Rows with Location `Entra` get the Entra actions menu (no Delete); the rest get the AD actions menu. Figma doesn't say which a Flat view row uses.
- [ ] **Earlier open items.** `ARS_Create_Menu_Button` is a plain frame in Figma but uses the Iris SplitButton in code. `--oi-content-color-placeholder` is missing. `--oi-motion-ease-move` is listed in the motion skill but not defined.
- [ ] **New: tags can be removed.** Figma draws an X on every tag in the Users list ([3091:15082](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3091-15082)); the app drew it but it did nothing. It now removes the tag for the session (as in the Groups list). Reload brings them back.
- [ ] **New: Tree view compared with the current frames.** The old links for the Tree view pointed at nodes that are gone from the CRUD file (1369:32139). The Tree view is now checked against the frames that exist: the folder list ([Tree_View_AD_Content 4517:19943](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=4517-19943), in the kit file, not the CRUD file), the left panel and tree rows ([3563:17384](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3563-17384), [3563:17385](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3563-17385)), the right-click menu ([2385:57427](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2385-57427)), and the CRUD file's search screen ([1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)) and "no folder selected" screen ([1372:37388](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37388)). Text, columns, widths and menu items match.
- [ ] **New: directory names follow the CRUD file.** The panel in the CRUD file ([1372:37423](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37423)) says "Access templates / Managed units / Managed directories / Active Directory / Entra ID", and the app now does too (it said "Active Directories", "Entra Directories" and title-case names). The kit panel and the Move file say differently; that is on the Figma tidy-up card.
- [ ] **New: search covers sub-folders.** A Figma note on the search ([Tree view search 1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)) says it covers the folder and the folders below it, not the ones above. The Tree list now does that; a result opens, moves and deletes from its own folder. Prototype: [O1D.local, search "Julian Long"](#/tree/o1d-local) (type it in the search box). The Flat view has no folders, so it is unchanged.
- [ ] **New: menus stay on screen.** Popover menus (row "…", filter, page "…", Create) used to run off the bottom or right edge of a short window. They now flip above the button or stay inside the window. Check with a short browser window.

## Flow 2: selection bars and create

Where: select rows in either list ([Users list](#/users), [Builtin folder](#/tree/o1d-builtin)); Create (Flat view) or Create / New object (Tree view); Select destination folder; create an object and use the toast's View.

### Compare with Figma

- [ ] Action bar for one selected row, with Show selected ([1378:48538](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-48538)). Prototype: [Users list with one row ticked](#/users?select=isabella-clark).
- [ ] Action bar for several selected rows, "N of total selected" ([1378:49550](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-49550)). Prototype: [Users list with two rows ticked](#/users?select=isabella-clark,liam-bennett).
- [ ] New object menu ([1293:49512](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1293-49512)). Prototype: [Builtin folder](#/tree/o1d-builtin), the arrow beside Create.
- [ ] New object modal, step 1 General: stepper, fields, dropdown, folder button, footer ([1345:24260](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24260)). Prototype: [New User modal, step 1](#/users?dialog=create&type=User). Account ([1345:24274](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24274)). Prototype: [Users list](#/users), Create, fill the required fields, Save and continue.
- [ ] New object modal, step 2 Account ([1345:24274](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24274)). Prototype: [New User modal](#/users?dialog=create&type=User), fill the required fields, Save and continue.
- [ ] Footer states: disabled and enabled "Save and continue", then "Create object" ([1378:47487](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-47487)). Prototype: [New User modal](#/users?dialog=create&type=User).
- [ ] Select folder side sheet ([1746:14585](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1746-14585)). Built from a screenshot only. Prototype: [New User modal](#/users?dialog=create&type=User), the folder button.
- [ ] Created toast with View and Dismiss ([1724:13727](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1724-13727)). Prototype: [Users list](#/users), create a user.

### Confirm

- [ ] **Which bar shows.** Variant 2 for one selected row, the Default bulk bar with the total for several. This comes from screenshots.
- [ ] **Show selected.** It filters the list to the selected rows. Figma doesn't say what it does.
- [ ] **"…" on the single-select bar.** It opens that row's actions menu. Figma draws no menu for it.
- [ ] **No-op actions.** Delete with several rows selected, and the Bulk create / invite / delete entries in the New object menu, do nothing.
- [ ] **One form for every type.** All object types use the same two steps (General, Account). Figma draws only the user form.
- [ ] **What a created object does.** A user joins the Users list or the folder. Other types join a folder as plain objects. A non-user created from the Flat view shows the toast without View and isn't listed.
- [ ] **Step 1 gating.** Save and continue needs the six Required fields, as the Figma footer variants show.
- [ ] **New: one New object menu.** The Flat view's Create button used the kit's Create menu; it now opens the CRUD file's New object menu ([1293:49512](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1293-49512): New AD User, Add User, New Group, New Organizational Unit, New Group Managed Service Account, New Shared Folder, New Asset, Bulk create, Bulk invite, Bulk delete), as the Tree view already did. The kit's Create menu ([3360:40902](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3360-40902)) is no longer used by the app; it is on the Figma tidy-up card.
- [ ] **New: no Delete on the one-row bar.** Figma's one-row bar ([1378:48538](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-48538)) ends at "…" with nothing after it. The app no longer shows Delete there (for several rows it still does, [1378:49550](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-49550)); a single object is deleted from its row menu or its page. Prototype: [Users list with one row ticked](#/users?select=isabella-clark).
- [ ] **New: checked and matching.** Modal title, stepper, field labels, "Select destination folder", footer text ([1345:24260](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1345-24260), [1378:47487](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-47487)), the Select folder sheet text ([1746:14585](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1746-14585)) and the created toast text ([1724:13727](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1724-13727)) match Figma. The toast now has a full stop before "To open it, click View." (Figma omits it; on the tidy-up card).

## Flow 3: object page and edit

Where: open a user from either list ([Isabella Clark](#/users/isabella-clark) in Flat view, [Julian Long](#/tree/o1d-builtin/o1d-builtin-o0) in Tree view), then Edit on the General tab.

### Compare with Figma

- [ ] Page header: back, icon, title, class and location, arrows, "…" ([1369:30614](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1369-30614)). Prototype: [Isabella Clark](#/users/isabella-clark).
- [ ] Tabs row (eleven tabs). Prototype: [Isabella Clark](#/users/isabella-clark).
- [ ] Overview: profile, details, four count tiles ([3500:18134](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3500-18134), [1378:51604](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-51604)). Prototype: [Isabella Clark](#/users/isabella-clark), Overview.
- [ ] General, read mode: Properties card and Object Management panel ([1378:55162](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-55162)). Prototype: [Isabella Clark, General](#/users/isabella-clark?tab=general).
- [ ] General, edit mode: field widths, required marks, Directory dropdown, description box, Cancel and Save ([1378:54606](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-54606)). Prototype: [Isabella Clark, General in edit mode](#/users/isabella-clark?tab=general&edit=general).
- [ ] Save error: banner above the card and the field error ([1388:57779](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1388-57779)). Prototype: [Isabella Clark, General in edit mode](#/users/isabella-clark?tab=general&edit=general), clear a required field, Save.

### Confirm

- [ ] **Placeholder content.** Created on, Last sign-in, the four count tiles and the "Member" badge on the Overview are placeholders.
- [ ] **Two different forms in Figma.** The save-error frame shows other fields (Name, User logon name, Suffix, pre-Windows 2000) from the normal edit form. I kept one form and put "User logon name already exists." on the User principal name field.
- [ ] **What triggers the error.** A required field left empty, or another user with the same principal name. Figma doesn't say.
- [ ] **Other tabs.** Every tab except Overview and General shows the Iris empty figure.
- [ ] **Objects that aren't users.** Groups, computers, contacts and OUs in the Tree view still use the old detail page. The CRUD file only draws users.
- [ ] **Directory dropdown.** Only `@Entra1` and `@O1D.Local`.
- [ ] **New: Figma typo not copied.** Figma's Object Management line ([1378:55162](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-55162)) reads "Manage this objects access…" without the apostrophe. The app says "object's"; it is on the Figma tidy-up card. Everything else on Overview ([3500:18134](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3500-18134)), General read and edit ([1378:54606](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-54606)) and the save-error banner ([1388:57779](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1388-57779)) matches Figma's text.

## Flow 4: delete, password reset, unsaved changes

Where: Delete and Reset password from a row menu, the selection bar or the object page ([Users list](#/users), [Isabella Clark](#/users/isabella-clark)); edit a user, change a field, then leave.

### Compare with Figma

- [ ] Delete, confirm step ([1755:15057](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15057)). Prototype: [Delete User dialog](#/users/isabella-clark?dialog=delete).
- [ ] Delete, wait step ([1755:15056](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15056)). Prototype: [Delete User dialog](#/users/isabella-clark?dialog=delete), type the name, Delete user.
- [ ] Delete, success step ([1755:15055](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15055)). Prototype: as above, after the wait.
- [ ] AD password reset: empty, filled, wait, success ([3269:35695](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35695), [3269:35790](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35790), [3269:35884](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35884), [3269:35915](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35915)). Prototype: [AD user, Reset password dialog](#/users/isabella-clark?dialog=reset-password).
- [ ] Entra password reset ([3269:36076](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-36076)). Prototype: [Entra user, Reset password dialog](#/users/liam-bennett?dialog=reset-password).
- [ ] Unsaved changes modal ([3534:19369](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19369)). Prototype: [Isabella Clark, General in edit mode](#/users/isabella-clark?tab=general&edit=general), change a field, then click another tab.
- [ ] Update toast ([3534:19514](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19514)). Prototype: [Isabella Clark, General in edit mode](#/users/isabella-clark?tab=general&edit=general), change a field, Save.

### Confirm

- [ ] **New components.** The delete modal and the unsaved-changes modal exist only in the CRUD file. They are in the "Missing from Figma" group in Storybook and on the Components to review page.
- [ ] **Delete button style.** Figma draws "Delete user" in the primary style, not the danger style. The app follows Figma. It stays disabled until the name is typed.
- [ ] **Wait steps.** "Please wait..." lasts a fixed 1.2 seconds for delete and 1.5 for reset, as there is no real work. Delete can't be closed while it waits.
- [ ] **When the object goes.** Delete removes the object when you close the success step, then returns to the list. Bulk delete from the selection bar isn't built, since Figma doesn't draw it.
- [ ] **Other object types.** The delete modal is titled with the type (for example "Delete Computer"). Figma draws only the user.
- [ ] **Entra or AD.** A user is Entra when its Location is `Entra` (Flat view) or its directory is `@Entra1` (user page). Entra goes straight to a generated temporary password. AD gets the form, and Reset password enables when both passwords match. The account options have no effect.
- [ ] **What triggers Unsaved changes.** Cancel, a tab, the header arrows and back button, J/K, the breadcrumb, the sidebar, the browser's Back button and links that only change the address, such as names in the lists. Check that Back leaves the address as it was when you choose to stay.
- [ ] **Wording.** Fixed ([3534:19369](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19369)): the modal used to say "will be discard", and the earlier note claimed Figma does too. Figma says "Your unsaved changes will be discarded. To continue, click **Confirm**. To review your changes and save them later, click **Cancel**." and the app now matches.
- [ ] **Update toast.** It says "Successfully updated User". Its View button has nothing else to open, because the object page is already showing.
- [ ] **New: typo fixed, quotes unchanged.** The AD reset password placeholder ([3269:35695](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35695)) says "Enter new passowrd" in Figma; the app says "Enter new password". The Delete success text uses curly quotes in Figma ([1755:15055](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15055), ‘MKim’) and the confirm step straight ones ([1755:15057](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15057)); the app uses straight quotes for both. Both are on the Figma tidy-up card.

## Flow 5: User Details tab

Where: open a user from either list ([Isabella Clark](#/users/isabella-clark)), then the User Details tab.

### Compare with Figma

- [ ] User Details tab ([ARS_Object_Content, Variant3, 2385:56718](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2385-56718)): Contact information and Job information cards, read and edit. Prototype: [Isabella Clark, User Details](#/users/isabella-clark?tab=user-details).

### Confirm

- [ ] **Sample values.** Every user shows Figma's sample values, except Email, which is the user's own. Nothing else about a user feeds these fields.
- [ ] **Contact edit form.** Figma's edit variant of the Contact information card shows the job fields. The app edits the contact fields instead.
- [ ] **Session only.** Saved values are kept in memory and reset on reload.
- [ ] **New: wrong Figma link fixed.** This node is in the ARS-Primary file, not the CRUD file, so the link now points there. The tab names, Contact information and Job information labels and sample values match it. Figma's "Country/Reigon" is corrected to "Country/Region" in the app (also on the Managed by card, [3527:16182](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3527-16182)); it is on the Figma tidy-up card.
- [ ] **Each card on its own.** Edit, Cancel and Save act on one card. Leaving with unsaved changes in either card shows the Unsaved changes modal.
- [ ] **Not built.** Bulk delete, detail pages for objects other than users, and the user tabs after User Details aren't drawn in the CRUD file, so they stay empty states.

## Flow 6: move objects

Figma: [ARS_WebUI2_Move_Browse_Objects](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2008-1687), a different file from the other flows.

Where: Move in a row menu, in the selection bar, or in Object Management on a user page (Flat view and Tree view); in Tree view, drag a row onto a folder in the left panel. Start from the [Builtin folder](#/tree/o1d-builtin) or [Julian Long](#/tree/o1d-builtin/o1d-builtin-o0).

### Compare with Figma

- [ ] Move object side sheet, single ([2381:17307](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-17307), chosen: [2381:17308](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-17308)). Prototype: [Move sheet for Julian Long](#/tree/o1d-builtin?dialog=move&target=o1d-builtin-o0).
- [ ] Move Objects side sheet, several ([Sidesheet 2290:68343](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2290-68343), frame [ARS_Bulk_Move 2274:30742](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2274-30742)). Prototype: [Move sheet for two objects](#/tree/o1d-builtin?select=o1d-builtin-o0,o1d-builtin-o2&dialog=move&target=o1d-builtin-o0,o1d-builtin-o2).
- [ ] Selected objects block ([2224:16697](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2224-16697)). Prototype: [Move sheet for two objects](#/tree/o1d-builtin?select=o1d-builtin-o0,o1d-builtin-o2&dialog=move&target=o1d-builtin-o0,o1d-builtin-o2); it is the block of tags at the top of the sheet.
- [ ] Move toast, three drawings: [Toast 2355:28099](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2355-28099) (several), [Move User toast 2396:13581](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2396-13581) (one, View object), [Successfully moved toast 2381:23258](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-23258) (Undo only). Prototype: move one or several objects from the [Builtin folder](#/tree/o1d-builtin).
- [ ] Element-Dragged chip ([2281:47208](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2281-47208)) and the drag and drop frame ([2158:17323](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2158-17323)). Prototype: [Builtin folder](#/tree/o1d-builtin), drag a row onto a folder in the left panel.
- [ ] Row menu with Move ([2381:21456](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-21456)) and selection bar ([2305:85120](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2305-85120)). Prototype: [Builtin folder with a row ticked](#/tree/o1d-builtin?select=o1d-builtin-o0), or a row's "…".

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
- [ ] **New: checked and matching.** Sheet title, subtitle, selected-objects text ([2290:68343](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2290-68343)), both toast texts and buttons ([2355:28099](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2355-28099), [2396:13581](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2396-13581)) and the row menu labels ([2381:21456](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2381-21456)) match the Move file. Its drag-and-drop frame ([2158:17323](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2158-17323)) spells the third tab "Favourites"; the CRUD file and the app say "Favorites" (tidy-up card).

## Flow 7: group page (Groups file, part 1)

Figma: [ARS_WebUI2_Groups](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24). Part 1 is the group page only; the group dialogs, the create flows and the other tabs follow.

Where: Tree view, open a group (a row with the Group type, e.g. [Security Users](#/tree/o1d-builtin/o1d-builtin-o23)), then its tabs.

### Compare with Figma

- [ ] Group page header and tabs ([ARS_Group_Header 158:35994](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-35994), [ARS_Group_Tabs 158:32718](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-32718)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23).
- [ ] Overview with Object Management ([ARS_Group_Overview 158:33654](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-33654), [ARS_Group_Page_Overview 158:36016](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-36016)). Prototype: [Security Users](#/tree/o1d-builtin/o1d-builtin-o23), Overview.
- [ ] General, read and edit ([General Read 159:7057](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-7057), [General Edit 159:7117](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-7117)). Prototype: [General](#/tree/o1d-builtin/o1d-builtin-o23?tab=general) and [General in edit mode](#/tree/o1d-builtin/o1d-builtin-o23?tab=general&edit=general).
- [ ] Ownership, read and edit ([Ownership Read 159:8006](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8006), [Ownership Edit 159:8066](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8066)). Prototype: [Ownership](#/tree/o1d-builtin/o1d-builtin-o23?tab=ownership) and [Ownership in edit mode](#/tree/o1d-builtin/o1d-builtin-o23?tab=ownership&edit=ownership).
- [ ] Object details ([159:8194](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=159-8194)). Prototype: [Object details](#/tree/o1d-builtin/o1d-builtin-o23?tab=object-details).

### Confirm

- [ ] **Tabs.** The sticky notes list Members, Members Of, Managed Units, Object and History; ARS_Group_Tabs draws Overview, General, Ownership, Memberships, Managed units, Roles/access templates, Object details and History. I used the tabs frame. Managed units, Roles/access templates and History show an empty state (Memberships is Flow 8).
- [ ] **Radio buttons.** Figma draws Group scope and Group type as radio buttons, and Iris had none. I added an Iris Radio (Storybook: Iris/Radio) and a checkbox option on the kit's form field.
- [ ] **Not the kit's group card.** The ARS - Primary kit has a group Properties card (Group name, Display name and so on, in a dropdown). This file draws a different General card, so the page follows this file.
- [ ] **Overview.** Now drawn as ARS_Group_Overview: an "Overview" title and subtitle, then Basic information and Members as labelled rows (new kit component ARSGroupOverview, under "Missing from Figma"). The member counts are made up from the group's size (68% users, 17% groups, 11% devices) plus members added this session; Owner(s) counts the manager and secondary owners.
- [ ] **New: Overview Source.** Every group shows "Cloud", Figma's sample. AD groups show it too; Figma gives no other value.
- [ ] **New: Overview counts and copy.** The counts are link-coloured in Figma; clicking one opens the Memberships tab, which Figma doesn't say. The copy button beside the name shows a "Name copied" toast; Figma draws no feedback.
- [ ] **New: Cloud badge.** Figma draws it 24px tall with a 1px border; the Iris Badge is 20px with a 0.5px border. I kept the Iris Badge.
- [ ] **Object Management.** Rename, Move, Copy, Deprovision and Delete (see Flow 8). Figma draws Move, Copy, Deprovision and Delete; Rename is added at the top from the written requirements. The panel is 315px wide and its helper reads "object's", as Figma draws it (it was 382px and "objects").
- [ ] **Header location.** It reads "Security Group · O1D.local\Builtin": the directory, then the folders, with backslashes, as Figma's "AD1\Groups".
- [ ] **New: General has an Edit button.** Figma's General Read card has no Edit button and the Groups file has no hover state. The button is kept (as on the CRUD Properties card) so the card can be edited.
- [ ] **New: info icons.** Display name and Group name have Figma's info icon after "(Required)", with no text in Figma; the tooltip says "More information", as in the New object form.
- [ ] **General edit.** Description has the "0/100" count and a 100-character limit; Resource URL, Keywords and Email use their name as placeholder; Tags is a text area with "Enter tags that describe this object." under it; every field is 280px wide (159:7117).
- [ ] **Ownership.** The Managed by card from the OU flow (Flow 10), with this file's subtitle "Configure ownership and membership approval settings." and "Secondary owners can update membership list" after Secondary owners. "Manager can update membership list" is disabled until a manager is set. Street address is one line, as in both files.
- [ ] **Sample values.** Scope, type and email are derived from the group (email is its name at contoso.com). Modified date, USNs and SID in Object details are Figma's samples. Dates read "Aug 14, 2024" as in Figma; **New:** Figma's Created also shows a time (09:41:22 AM), which the sample data doesn't have. "Protect from deletion" is shown as Yes or No; Figma draws a ticked checkbox. Tags are typed as text, not drawn as chips.
- [ ] **Values are kept for the session.** Display name and description are saved to the group, so the list shows them; the other fields reset on reload.

## Flow 8: group dialogs and Memberships (Groups file, part 2)

Figma: [ARS_WebUI2_Groups](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24).

Where: a group's page ([Security Users](#/tree/o1d-builtin/o1d-builtin-o23)), Object Management (Rename, Copy, Deprovision) and the Memberships tab.

### Compare with Figma

- [ ] Memberships tab ([ARS_Group_Members_Content 160:24932](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-24932), [Members and Members of buttons 160:9082](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-9082), [table 160:9033](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=160-9033)). Prototype: [Memberships, Members](#/tree/o1d-builtin/o1d-builtin-o23?tab=memberships) and [Members of](#/tree/o1d-builtin/o1d-builtin-o23?tab=memberships&view=members-of).
- [ ] The written requirements for the dialogs: [Rename 64:6802](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6802), [Copy 64:6804](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6804), [Deprovision 64:6805](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=64-6805). Prototype: [Rename](#/tree/o1d-builtin/o1d-builtin-o23?dialog=rename), [Copy](#/tree/o1d-builtin/o1d-builtin-o23?dialog=copy) and [Deprovision](#/tree/o1d-builtin/o1d-builtin-o23?dialog=deprovision) dialogs on Security Users.

### Confirm

- [ ] **No frames for the dialogs.** Rename, Copy and Deprovision exist only as written notes, so I built them on the ARS modal panel and the existing destination sheet. Two new components under "Missing from Figma" (Rename Group Modal, Deprovision AD Group) say so. Button labels (Cancel and Rename; No and Yes) and the Deprovision question are mine.
- [ ] **Rename** changes the group's name and its pre-Windows 2000 name, both required. The list and the page header follow.
- [ ] **Copy** uses the Move side sheet, titled Copy, with a Copy button. It makes "Copy of [name]" in the chosen folder (the same folder is allowed), keeps scope, type and the other fields, and shows a toast with Undo and View object. Figma's note says "New User screen", which I took to mean choosing where the copy goes.
- [ ] **New: no search in Copy or Move.** The written notes for Move and Copy list a "Search window", but the drawn Move sheet (Move file, Flow 6) has no search, so none was added.
- [ ] **Deprovision** asks Yes or No, then shows a toast with Undo. The sample data has no status, so a deprovisioned group shows a "Deprovisioned" badge in its Overview. That badge is mine.
- [ ] **Memberships tab.** Members and Members of buttons, a search, the "…", filter and split "Add member" buttons as 160:24932 draws them, the group table, and paging at 15 per page as Figma shows. The data has no memberships, so Members are objects from the group's folder (as many as its member count) and Members of are up to three groups from the same folder. Add member opens the Add Member modal (Flow 9). The table scrolls sideways when it is wider than its column. Remove, temporary access and Set primary group (from the notes) aren't built.
- [ ] **New: toolbar buttons with no action.** Figma's "…" button and the arrow on "Add member" have no defined action, so they do nothing, like the filter button.

## Flow 9: Add Member, Groups list and creating groups (Groups file, part 3)

Figma: [ARS_WebUI2_Groups](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=58-24).

Where: Memberships tab, Add member; Directory Management, [Groups](#/groups); Create, Group in Flat view, or New, New Group in Tree view ([Builtin folder](#/tree/o1d-builtin) for AD, [3bf67d.onmicrosoft.com](#/tree/entra-3bf67d) for Entra).

### Compare with Figma

- [ ] Add Member modal ([215:7485](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=215-7485)). Prototype: [Add Member, with one object chosen](#/tree/o1d-builtin/o1d-builtin-o23?tab=memberships&dialog=add-member&pick=o1d-builtin-o4).
- [ ] Groups list ([ARS_Table_Groups 158:33464](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=158-33464), frame [157:14884](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=157-14884)). Prototype: [Groups](#/groups).
- [ ] The written requirements for New AD Group ([steps 1 and 2: 2111:11197](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2111-11197), [2111:11198](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2111-11198)) and New Entra Distribution Group ([2113:12494](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2113-12494)). Prototype: [New AD Group](#/tree/o1d-builtin?dialog=new-group) (in the Builtin folder) and [New Entra Distribution Group](#/tree/entra-3bf67d?dialog=new-group) (in 3bf67d.onmicrosoft.com).

### Confirm

- [ ] **Add Member.** Lists the objects in the group's folder that aren't members yet, with a search, paging, the chosen objects as removable tags and Cancel and Save. Save adds them to Members for the session and shows a toast. A new component under "Missing from Figma". Its Description heading now sits over its column (a hidden actions cell had pushed it 26px left).
- [ ] **Groups list.** ARS_Table_Groups' columns: Name, Group type badge, Description, removable Tags and Directory (new kit component ARSTableGroups, under "Missing from Figma"). AD groups read SecurityGroup or DistributionGroup with the directory and folders ("O1D.local\Builtin", Figma's "AD1\Groups"); Entra groups read O365Group with the directory only ("3bf67d.onmicrosoft.com", Figma's "Entra1"). Only groups in a directory are listed, not those in the Access Templates or Managed Units folders. Tags are Figma's sample pairs, given out in turn, and removing one lasts for the session. The toolbar has Create, which opens New AD Group in O1D.local. Rows open the group page; a row's "…" and the column settings button do nothing.
- [ ] **Creating a group.** In Tree view, New Group in an Entra directory opens New Entra Distribution Group; anywhere else it opens New AD Group (two steps: General, then the Exchange e-mail address). In Flat view and from the Groups list the group is made in O1D.local. Both flows come from written notes with no frames, so the layout is the New object modal; the Exchange step's Alias is read-only (the group name) and Associated administrative group shows the folder, which is my guess.
- [ ] **Entra Distribution Group.** One form with Join and Leave toggles (Open or Closed) whose tooltips use Figma's text; the two Closed tooltips both start "Only group owners can add members", as in the notes. A group made here is a Distribution, Universal group. It has no stepper, as the OU file's one-step modal hides it (it used to show the kit's sample "General / Step name").
- [ ] **New: created toast wording.** Figma's text ([1697:13458](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1697-13458)) has no full stop before "To": "…created in [location] To open it, click View." The app now adds one for users, groups and the other objects (tidy-up card).
- [ ] **Still empty.** Managed units and Roles/access templates (marked NEW, no content in Figma) and History (Change History and User Activity, no frames) show the empty state.

## Flow 10: organizational units (OU Management file)

Figma: [ARS_WebUI2_OU_Management](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1009-3972) (page "Iris UI", section "Current screens"; the ARCHIVED section is not built).

Where: Tree view, the arrow beside Create, New Organizational Unit ([Builtin folder](#/tree/o1d-builtin)), or Create in Flat view; a row's "..." menu, View properties; the Ownership tab of a group or an OU ([Test OU](#/tree/o1d-local/o1d-test-ou)).

### Compare with Figma

- [ ] New Organizational Unit modal ([ARS_New_Organizational_Unit 1394:14812](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1394-14812), screen [1349:12126](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1349-12126)). Prototype: [New Organizational Unit](#/tree/o1d-builtin?dialog=new-ou).
- [ ] OU Overview ([1131:10263](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1131-10263)). Prototype: [Test OU](#/tree/o1d-local/o1d-test-ou).
- [ ] OU General, read and edit ([1065:6047](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1065-6047), [1069:7492](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1069-7492)). Prototype: [General](#/tree/o1d-local/o1d-test-ou?tab=general) and [General in edit mode](#/tree/o1d-local/o1d-test-ou?tab=general&edit=general).
- [ ] Ownership: [ARS_Managed_by 1200:10265](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1200-10265), [saved 1373:11754](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1373-11754), [Add/Change Manager 1189:7985](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1189-7985). Prototype: [Ownership](#/tree/o1d-local/o1d-test-ou?tab=ownership), [in edit mode](#/tree/o1d-local/o1d-test-ou?tab=ownership&edit=ownership) and the [Add manager dialog](#/tree/o1d-local/o1d-test-ou?tab=ownership&edit=ownership&dialog=add-manager).
- [ ] Object details ([1065:8070](https://www.figma.com/design/DwKW5hhTprayGwhbMtOKMr/ARS_WebUI2_OU_Management?node-id=1065-8070)). Prototype: [Object details](#/tree/o1d-local/o1d-test-ou?tab=object-details).

### Confirm

- [ ] **New Organizational Unit.** Name (required), Description, "Protect container from accidental deletion" (unticked, as both frames draw it; it used to start ticked), and Figma's explanation on the right; the button reads "Save & Continue →". Figma draws the header icon as a user (copied from the New User modal) and I kept it. The second checkbox, "Open properties for this object when I click finish", is from the written note, not the frame. Without it ticked you stay on the list and the toast offers View; with it, the OU's page opens. A new component under "Missing from Figma".
- [ ] **New: two explanations in Figma.** The component (1394:14812) says "Add a new organizational unit to structure your team or department hierarchy…"; the screen (1349:12126) says "Create an organizational unit (OU) for structuring your team or department hierarchy…". The app keeps the screen's wording. Pick one.
- [ ] **Where the OU page opens.** There is no frame showing how you reach it, so it opens from View properties in a row's menu (the menu already has it) and from Open properties after creating.
- [ ] **Tabs.** Overview, General, Ownership, Managed units, Roles, Object details, History, as the Overview frame draws them (Managed units was missing). Managed units, Roles and History are empty: the Change History frame says "In progress under Change history Figma file". Figma also draws a count after History (12); I left it out.
- [ ] **Header.** "Organizational unit · O1D.local": a small "u" and the location from the directory down, as Figma writes it.
- [ ] **Overview.** Four tiles (Total Objects, Users, Groups, Organizational Units) and the "Other Objects" strip below them with Shared folders, Contacts, Printers and GMSAs, as 1131:10263 draws it (it used to be a fifth tile). The sample data has no shared folders or printers, so those read 0. Figma's annotation says a card opens the filtered list of objects; the tiles still don't, because the list's filter doesn't work yet.
- [ ] **Object management.** Move and Delete, as the Overview draws them. Delete removes the OU and everything under it. Move uses the same side sheet; an OU can't go into itself or its folders.
- [ ] **New: "Object management" capital.** The OU file writes "Object management" with a small "m"; the CRUD and Groups files write "Object Management". The shared panel keeps the capital.
- [ ] **General.** Name, Description, Street address, City, State/province, ZIP/postal code and Country/region, with Figma's labels and widths (Name and Description 576px, the rest 280px in pairs) from 1065:6047 and 1069:7492. Changing the Name renames the OU everywhere, including the left panel. Saved for the session, except the name and description, which the list shows too.
- [ ] **New: Name is required in the app.** Figma doesn't mark it required; saving an empty name shows "Name is required." (the New OU wording), since an OU needs a name.
- [ ] **New: Country/region.** Figma draws a dropdown but gives no list of countries, so it stays a text field.
- [ ] **Ownership (also on groups).** The Managed by card shows a manager, office details and secondary owners. Add manager and Add owner open the Add Member modal as a picker (the Add/Change Manager frame shows a modal like it); the manager is one person, owners can be several. To change the manager, remove it and add another; Figma's pencil on the manager isn't wired. Street address is one line in both files. Groups add the two "can update membership list" checkboxes from the written notes.
- [ ] **Object details.** A Properties card with no subtitle (Figma hides it) of read-only values; the distinguished name reads "OU=Test OU,DC=O1D,DC=local", Figma's form. Created is written out ("Friday, November 7, 2025") but has no time, and OUs made in the app have none ("-"). "Protect object from accidental deletion" is Yes or No, not a disabled checkbox.
- [ ] **Deleting OUs from the list** now removes the OU (before, nothing happened).
- [ ] **Deleting OUs from the list** now removes the OU (before, nothing happened).

## Flow 11: Managed Units

Figma: [ARS_WebUI2_Managed-Units](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=4002-9991) (section "Managed Units" on page "Design"; "As-Is" and "Wires" are not built).

Where: Flat view, Management units in the left panel ([Managed Units](#/management-units)); open a unit to see its members ([Global Security](#/management-units/global-security)).

### Compare with Figma

- [ ] Managed Units list ([ARS_Managed_Users_Content 7058:6179](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7058-6179), screen [ARS_Flat_Master 7051:3954](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7051-3954)). Prototype: [Managed Units](#/management-units).
- [ ] A unit's members ([ARS_Managed_Unit_Members 7074:6939](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7074-6939), [table 7064:12185](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7064-12185), screen [7064:14262](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7064-14262)). Prototype: [Global Security](#/management-units/global-security).
- [ ] Selection bar ([ARS_Action_bar 7077:3722](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7077-3722)) and row menu ([ARS_AD User Actions 7077:3917](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7077-3917)). Prototype: [Global Security, two members ticked](#/management-units/global-security?select=global-security-m0,global-security-m1).

### Confirm

- [ ] **Two new components** under "Missing from Figma": the Managed Units list and the unit's members page.
- [ ] **Sample data.** The 15 units and the member names are Figma's sample rows; the app has no managed-unit data. Each unit shows 8 to 15 of the sample members, rotated per unit. Figma's list says there are more pages; there is one page of 15.
- [ ] **Route.** The list is at the existing Management units entry (before, a placeholder); a unit opens at its own address, so it can be linked. Its header's arrows step to the previous and next unit. The header reads "[unit] Members" and "O1D.local · Managed Units", which stands in for Figma's "[Directory name] [Location]".
- [ ] **Selection bar.** It appears when members are ticked, with Select all and close. Its other buttons (Copy, Move, Properties, Delete) do nothing, since members aren't directory objects here. Figma's ARS_AD User Actions menu isn't wired on these tables.
- [ ] **Columns.** The list is Name 180, Modified 86, Description and Type, with no "…" on the rows; the members table is Name 180, then Description and Type sharing the rest. Both heads end with Figma's column settings button (ARS_Table_Config), as 7058:6179 and 7074:6939 draw them. The list used to have wider columns and a "…" on every row, which Figma doesn't draw.
- [ ] **New: column settings button.** It does nothing; Figma draws no menu for it.
- [ ] **New: Description heading icon.** Figma's list puts a newspaper icon (Media/ArticleNyTimes) before "Description" in the head. It looks like a leftover, so it isn't in the app.
- [ ] **Tree view.** The Managed units folder in Tree view still shows generated objects. Figma's ARS_Treeview_Master ([7051:7736](https://www.figma.com/design/WsXrW6CBUME9thy8z8hPRR/ARS_WebUI2_Managed-Units?node-id=7051-7736)) isn't built.
- [ ] **No create.** The list has a search only; Figma shows no Create button.

## Flow 12: self-service screens (User-View-Approvals file)

Figma: [ARS_WebUI2_User-View-Approvals](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6651) (page "Iris"; "Ideation" and "As-Is" are not built).

Persona: self-service-end-user

Where: the self-service persona's navigation: [Home](#/user-view/home), [User Profile](#/user-view/profile), [Approvals](#/user-view/approvals) and [My Access](#/user-view/my-access). The links sign you in as Lisa Fernandez.

### Compare with Figma

- [ ] Home ([home-dashboard 10199:6772](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6772)). Prototype: [Home](#/user-view/home).
- [ ] My Access ([my-access-screen-full 10199:6654](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-6654)) and its Request Access side sheet ([10199:7056](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7056)). Prototype: [My Access](#/user-view/my-access) and the [Request Access sheet](#/user-view/my-access?sheet=request-access).
- [ ] User Profile ([user-profile-settings 10199:7207](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7207), content [10199:7273](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7273)). Prototype: [User Profile](#/user-view/profile).
- [ ] Approvals ([Design-1-Approvals-Dashboard 10199:7351](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7351)). Prototype: [Approvals](#/user-view/approvals) and its [Pending tab](#/user-view/approvals?tab=pending). and Escalate modals ([10199:7617](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7617), [10199:7638](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7638), [10199:7659](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7659)). Prototype: [Approvals](#/user-view/approvals), open a pending request, then Approve, Deny or Escalate.
- [ ] Approve, Deny and Escalate modals ([10199:7617](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7617), [10199:7638](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7638), [10199:7659](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10199-7659)). Prototype: [Approve](#/user-view/approvals?tab=pending&request=REQ-001&modal=approve), [Deny](#/user-view/approvals?tab=pending&request=REQ-001&modal=deny) and [Escalate](#/user-view/approvals?tab=pending&request=REQ-001&modal=escalate), each over request REQ-001.
- [ ] Review, Approved and Denied side sheets ([10300:2178](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10300-2178), [10300:8498](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10300-8498), [10300:8588](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10300-8588)) and the Person card ([10301:2300](https://www.figma.com/design/pM8TUtMbcdF3JrEZaVXrE6/ARS_WebUI2_User-View-Approvals?node-id=10301-2300)). Prototype: the [Review sheet](#/user-view/approvals?request=REQ-001) (pending request REQ-001), the [Approved sheet](#/user-view/approvals?request=REQ-003) (REQ-003) and the [Denied sheet](#/user-view/approvals?request=REQ-004) (REQ-004).

### Confirm

- [ ] **Built from Iris components, not the ARS kit.** This file is Iris-only, so nothing was added to "Missing from Figma". The views are in `views/UserView/`.
- [ ] **Sample data.** The rows, names and counts are Figma's samples (8 access records, 5 named approval requests); I generated 11 more approval requests so the tabs show 16, 3 and 13 as in Figma. "Approved Today 12", "Rejected Today 1", "20 Total" and "4 Objects" on Home and Approvals are Figma's numbers, not computed.
- [ ] **Charts on Home.** Response Time is a line chart, as Figma draws it; I added a LineChart to Iris for it (Storybook: Iris/LineChart). The monthly values in Approvals by Month and Response Time are read off Figma's chart axes, since Figma has no data behind them. The 75/15/10 Approval Distribution split is still a placeholder.
- [ ] **My Access.** Auto Extend is a toggle only on Active rows. Export downloads the visible rows as a CSV (Figma doesn't say what Export does). Submitting a request adds a Pending row and a toast, with the owner and description taken from the chosen object; Submit needs an object and a reason.
- [ ] **Approvals.** Clicking a row opens its sheet: Review for a pending request, the Approved or Denied sheet for a decided one. Figma doesn't say how a row opens; there are no extra buttons on the rows. Approve, Deny and Escalate open the modals from the Review sheet; Approve and Deny move the request to Previous with a toast, and Deny requires a reason. Escalate only shows a toast, since no email is sent.
- [ ] **Profile.** Fields are editable, with Cancel and Save Changes at the bottom as Figma draws them; both are disabled until something changes. Save checks the required fields and shows a "Profile saved" toast; saved values last until the page is reloaded. Change photo, Add from File and Copy to File show a "not available" toast; Remove deletes the ticked certificates.
- [ ] **Person card.** Built as a small shared part (avatar, name, email, role badge) used in the Request Access and Review sheets.
- [ ] **Checked in a browser.** These screens were reworked against Figma and opened in the running app (commits b53cbd5 and c0cb03f).

## Figma tidy-up

Figma is followed everywhere in the app except the items below. The first group are spelling and wording mistakes in Figma, which the app corrects; the second are quote style and places where Figma's own files disagree. Please fix them in Figma so the app and Figma match again. Tick each once it is done.

### Spelling and punctuation (the app has the corrected text)

- [ ] **AD reset password placeholder.** "Enter new passowrd" should be "Enter new password" ([ARS_User_Password_Reset_AD, 3269:35695](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35695)). Prototype: [AD user, Reset password dialog](#/users/isabella-clark?dialog=reset-password).
- [ ] **Country/Region.** "Country/Reigon" should be "Country/Region" in the Contact information card ([ARS_Object_Content Variant3, 2385:56718](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2385-56718), [ARS_Users_ContactInfo Card, 2820:30082](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2820-30082)) and in the Managed by card ([ARS_Managed_by, 3527:16182](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3527-16182)). Prototype: [Isabella Clark, User Details](#/users/isabella-clark?tab=user-details).
- [ ] **Created toast.** "[Object type] created in [Object location] To open it, click View." needs a full stop after the location ([ARS_New_Object_Toast, 1697:13458](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1697-13458)).
- [ ] **Object Management line.** "Manage this objects access, location, and restriction to the domain." should read "object's" ([ARS_Object_Content, 1378:55162](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-55162)). Prototype: [Isabella Clark, General](#/users/isabella-clark?tab=general).
- [ ] **Favorites.** The Move file's drag-and-drop frame writes "Favourites" ([2158:17323](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2158-17323)); the CRUD file and the app write "Favorites" ([1372:37423](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37423)).

### Quote style and files that disagree

- [ ] **Quote style.** The Delete success text uses curly quotes, ‘MKim’ ([1755:15055](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15055)), and the confirm step uses straight ones, 'MKim' ([1755:15057](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15057)). The app uses straight quotes in both. Pick one style in Figma.
- [ ] **New object menu.** The kit's Create menu ([ARS_Create_Menu, 3360:40902](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3360-40902): User, Group, Computer, Organizational unit, Shared folder, Contact, Group Managed Service Account) differs from the CRUD file's ([1293:49512](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1293-49512): New AD User, Add User, New Group, New Organizational Unit, New Group Managed Service Account, New Shared Folder, New Asset, Bulk create, Bulk invite, Bulk delete). The app follows the CRUD file. Prototype: [Users list, Create](#/users).
- [ ] **One-row action bar.** The kit's ARS_Action_bar variant 2 ([2385:59821](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=2385-59821)) has Delete after "…"; the CRUD file's one-row bar ([1378:48538](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-48538)) has none. The app follows the CRUD file. Prototype: [Users list with one row ticked](#/users?select=isabella-clark).
- [ ] **Directory names.** The CRUD panel ([1372:37423](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-37423)) says "Managed directories / Active Directory / Entra ID". The kit panel ([3563:17384](https://www.figma.com/design/IlG4nne9VhqpONzqc0tfKg/ARS-Primary?node-id=3563-17384)) and the Move sheet ([2290:68343](https://www.figma.com/design/IXKXZpycHiFcKbvHMvlc9r/ARS_WebUI2_Move_Browse_Objects?node-id=2290-68343)) say "Managed Directories / Active Directories / Entra Directories". The app follows the CRUD file everywhere, including the Move sheet. Prototype: [Tree view](#/tree).

