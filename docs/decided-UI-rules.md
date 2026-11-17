# Decided UI rules

The UI rules the designer has decided for this prototype: how screens and components behave where Figma is silent or draws something else. Product rules are in [decided-business-rules.md](decided-business-rules.md). Figma stays the source of truth for how things look; a rule here that differs from Figma is also an item in `docs/review-notes.md` and on the Figma tidy-up page.

Each rule has an ID, what it says, where it comes from and where it is built. When the designer decides a new rule, add it here in the same commit as the change.

## Modals

**MOD-1. A modal with steps is as tall as its tallest step, on every step.** It hugs the full height of the tallest step's content and keeps that height on shorter steps, so the layout doesn't jump between steps and the footer buttons stay in one place, which also helps accessibility.
- Applies to every New object and New group form with a stepper: New AD User, New Entra User, the Tree view's other New object types and New AD Group. Figma keeps their body at a fixed 729px (ARS_New_Object_Template 3367:12947).
- The Select folder step (Figma 3651:20393) is never the tallest: its tree fills the height the other steps give it and scrolls.
- Source: designer, 16 Nov 2026. Built: kit `ARSNewObjectContentContainer` (`stepContents`: every step shares one grid cell, and the steps not on screen are hidden and inert), `views/UsersPage/CreateObjectModal/`, `views/GroupsPage/CreateGroupModal.tsx`.

**MOD-2. Closing a New object form that has something filled in asks first, in the same modal.** The close button, Escape or a click outside the modal swaps the form for the Unsaved changes question (ARS_Modal_Form_Unsaved, ARS_WebUI2_CRUD 3534:19369) on the same backdrop, and the card resizes to it. It never opens a second modal over the form: only one floating layer shows at a time. Cancel, the question's close button, Escape or a click outside resizes the card back to the form, exactly as it was (same step, entries, ticked and opened folders); Discard changes discards the entries and closes. A form with nothing filled in closes straight away.
- The question's buttons here are a ghost Cancel and the Iris danger (destructive) "Discard changes", and its text says to click Discard changes. Figma draws a secondary Cancel and a primary Confirm, which the object pages' edit mode keep.
- The resize uses the Iris motion tokens: the card goes from one panel's size to the other's over `--oi-motion-duration-long` with `--oi-motion-ease-default`, and the new panel fades in over `--oi-motion-duration-default`. With reduced motion the panels swap at once.
- "Filled in" means a text field has a value; the account options and the destination folder don't count.
- Applies to the New object form: New AD User, New Entra User and the Tree view's other New object types. Figma's New Object template (ARS_New_Object_Template 3367:12947) doesn't say what closing does. The New AD Group form still closes straight away.
- Source: designer, 17 Nov 2026. Built: kit `ARSModalFormUnsaved` (`destructive`), `views/UsersPage/CreateObjectModal/` (the swap; the form stays mounted, hidden, under the question), `views/ModalOverlay/` (`panelKey`: a panel swapped in while open gets focus and the card resizes to it).

## Buttons

**BTN-1. A Create button that opens a menu of options is a split button.** Both the main part and the arrow open the menu. A Create that goes straight to one form stays a plain button.
- Users list: Create opens the New User menu (New Entra User, New AD User, Add User). Figma draws a plain "+ Create" there (ARS_Table_Toolbar, Basic, 3422:16062 in ARS_Flat View_User_Content 3423:30755).
- Groups list: Create opens AD group and Entra group (CRT-2). Figma draws a plain "+ Create" (ARS_WebUI2_Groups 160:9037).
- Tree view folder lists: Create opens the New object menu; it was already split.
- Source: designer, 16 Nov 2026. Built: kit `ARSTableToolbar` (a main action with `onActionMenu` is a split button on every variant), `views/UsersPage/UsersPage.tsx`, `views/GroupsPage/GroupsPage.tsx`, `views/TreeView/TreeListPage.tsx`.

## Tables

**TBL-1. The table settings menu lists the columns to show and their order; columns are always resizable.** The settings button in a list's right-most column head (ARS_Table_Config 3663:19416) opens a menu listing every column in the order they show, each with a checkbox to show or hide it and a drag handle to move it (Alt+Up and Alt+Down from the keyboard). It stays open while columns are ticked or moved, and the table follows at once. The first column always shows and stays first. Every column resizes by dragging its head's right edge (or the arrow keys on it), with no Adjust columns step.
- Figma's ARS_Table Menu (3663:20381) has Adjust columns and Add columns entries instead; the menu here has neither.
- Applies to the Users, Groups, Managed Units and Tree view lists, Favourites, the Memberships tabs and a group's members. The choices last while the page is open.
- Source: designer, 17 Nov 2026. Built: Iris `Menu` (`movable` checkbox entries and `onMove`, in `useMenuReorder`), kit `TableHeadRow` (`columnSettings`: `order` and the resize grips) and `ColumnSettingsMenu`, `views/ListFilters/useColumnSettings.ts`.
