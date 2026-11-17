# Decided UI rules

The UI rules the designer has decided for this prototype: how screens and components behave where Figma is silent or draws something else. Product rules are in [decided-business-rules.md](decided-business-rules.md). Figma stays the source of truth for how things look; a rule here that differs from Figma is also an item in `docs/review-notes.md` and on the Figma tidy-up page.

Each rule has an ID, what it says, where it comes from and where it is built. When the designer decides a new rule, add it here in the same commit as the change.

## Modals

**MOD-1. A modal with steps is as tall as its tallest step, on every step.** It hugs the full height of the tallest step's content and keeps that height on shorter steps, so the layout doesn't jump between steps and the footer buttons stay in one place, which also helps accessibility.
- Applies to every New object and New group form with a stepper: New AD User, New Entra User, the Tree view's other New object types and New AD Group. Figma keeps their body at a fixed 729px (ARS_New_Object_Template 3367:12947).
- The Select folder step (Figma 3651:20393) is never the tallest: its tree fills the height the other steps give it and scrolls.
- Source: designer, 16 Nov 2026. Built: kit `ARSNewObjectContentContainer` (`stepContents`: every step shares one grid cell, and the steps not on screen are hidden and inert), `views/UsersPage/CreateObjectModal/`, `views/GroupsPage/CreateGroupModal.tsx`.

**MOD-2. Closing a New object form that has something filled in asks first, in the same modal.** The close button, Escape or a click outside the modal swaps the form for the Unsaved changes question (ARS_Modal_Form_Unsaved, ARS_WebUI2_CRUD 3534:19369) on the same backdrop. It never opens a second modal over the form: only one floating layer shows at a time. Cancel, the question's close button, Escape or a click outside brings the form back on the same step with everything kept; Confirm discards the entries and closes. A form with nothing filled in closes straight away.
- "Filled in" means a text field has a value; the account options and the destination folder don't count.
- Applies to the New object form: New AD User, New Entra User and the Tree view's other New object types. Figma's New Object template (ARS_New_Object_Template 3367:12947) doesn't say what closing does. The New AD Group form still closes straight away.
- Source: designer, 17 Nov 2026. Built: `views/UsersPage/CreateObjectModal/` (the swap), `views/ModalOverlay/` (`panelKey`: a panel swapped in while open gets focus, skipping steps made `inert`).

## Buttons

**BTN-1. A Create button that opens a menu of options is a split button.** Both the main part and the arrow open the menu. A Create that goes straight to one form stays a plain button.
- Users list: Create opens the New User menu (New Entra User, New AD User, Add User). Figma draws a plain "+ Create" there (ARS_Table_Toolbar, Basic, 3422:16062 in ARS_Flat View_User_Content 3423:30755).
- Groups list: Create opens AD group and Entra group (CRT-2). Figma draws a plain "+ Create" (ARS_WebUI2_Groups 160:9037).
- Tree view folder lists: Create opens the New object menu; it was already split.
- Source: designer, 16 Nov 2026. Built: kit `ARSTableToolbar` (a main action with `onActionMenu` is a split button on every variant), `views/UsersPage/UsersPage.tsx`, `views/GroupsPage/GroupsPage.tsx`, `views/TreeView/TreeListPage.tsx`.
