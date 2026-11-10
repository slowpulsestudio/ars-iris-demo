# Things to review

Decisions and gaps from building the ARS_WebUI2_CRUD screens ([Figma](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1291-39864)). Tick an item once you've looked at it.

**Not checked in a browser.** None of the screens below have been compared with Figma on screen. Start the app with `pnpm dev --port 5191 --strictPort` in `src/iris-shell`.

**Figma annotations.** Figma's own annotations can't be read with the read-only tools. Anything an annotation says that isn't in the layers or the kit's component notes is missing.

## Flow 1: lists and left panel

- [ ] The Iris filter pills are gone from both lists. The Figma frames show only the filter button, and the old filters never changed the rows. The filter menu items do nothing.
- [ ] The directory panel is fixed at 254px, as in Figma. The old drag-to-resize handle is gone.
- [ ] Users have made-up Tags and Location values so the new columns have content (`mockUsers.ts`).
- [ ] The Flat view row menu follows the Location column: `Entra` rows get the Entra user actions (no Delete), the others get the AD user actions. Figma doesn't say which menu a Flat view row uses.
- [ ] A folder with no objects shows `ARS_Empty_Content` with the ARS "No data" drawing. `#/tree` shows the Iris `EmptyFigure` (Branches). Choose one empty state style.
- [ ] The Search frame ([1372:36552](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1372-36552)) was not compared separately.
- [ ] Open items from earlier: `ARS_Create_Menu_Button` is a plain frame in Figma but uses the Iris SplitButton in code; `--oi-content-color-placeholder` is missing; `--oi-motion-ease-move` is listed in the motion skill but not defined.

## Flow 2: selection bars and create

- [ ] The bar variants come from screenshots: variant 2 for one selected row ([1378:48538](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-48538)), the Default bulk bar with "N of total" for several ([1378:49550](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1378-49550)). Check the rule for which one shows.
- [ ] "Show selected" filters the list to the selected rows. Figma doesn't say what the toggle does.
- [ ] The "…" button on the single-select bar opens that row's actions menu. Figma doesn't draw a menu for it.
- [ ] Delete does nothing when several rows are selected, and the Bulk create / invite / delete entries in the New Object menu do nothing.
- [ ] The Select folder side sheet ([1746:14585](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1746-14585)) is the Iris SideSheet plus the ARS tree, built from a screenshot.
- [ ] Every object type uses the same two-step form (General, Account), as the old modal did. Figma draws only the user form.
- [ ] A created user is added to the Users list or the folder. Other types are added to a folder as plain objects, and a non-user created from the Flat view shows the toast without a View button and isn't listed.
- [ ] Step 1's Save and continue now needs the six required fields, as the Figma footer variants show.

## Flow 3: object page and edit

- [ ] Created on, Last sign-in, the four count tiles and the "Member" badge on the Overview are placeholders. The data has no such fields.
- [ ] The Figma save-error frame ([1388:57779](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1388-57779)) shows a different field set from the normal edit form (Name, User logon name, Suffix, pre-Windows 2000). The app keeps one form and puts "User logon name already exists." on the User principal name field.
- [ ] The save error is triggered by a real check (required fields, or another user with the same principal name). Figma doesn't say what causes it.
- [ ] Tabs other than Overview and General show the Iris empty figure.
- [ ] Tree objects that aren't users (groups, computers, contacts, OUs) still use the old detail page. The CRUD file only draws users.
- [ ] The Directory dropdown only offers `@Entra1` and `@O1D.Local`.

## Flow 4: delete, password reset, unsaved changes (not built yet)

- [ ] The old delete, reset-password and unsaved-changes screens are still the Iris versions. The frames to build are `ARS_Delete` ([1755:15058](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=1755-15058)), the AD and Entra password reset modals ([3269:35695](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-35695), [3269:36076](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3269-36076)) and the unsaved-changes modal and toast ([3534:19369](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19369), [3534:19514](https://www.figma.com/design/djs9NKqC3YG6KtAhHiQ4iT/ARS_WebUI2_CRUD?node-id=3534-19514)).
- [ ] `ARS_CRUD_Delete`, `ARS_CRUD_Delete_Success` and `ARS_Modal_Form_Unsaved` exist only in the CRUD file. They will be added under "Missing from Figma" and the Components to review page when built.
