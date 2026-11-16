# Decided business rules

The product rules the designer has decided for this prototype, in one place. UI rules (how screens behave, such as modal heights) are in [decided-UI-rules.md](decided-UI-rules.md). They are separate from two other things:

- `business-rules.md` (repo root) is the draft taken from the requirements board. Its first line says "DRAFT DO NOT USE", and its rules are unconfirmed. `docs/business-rules-audit.md` checks that draft against the app.
- Figma. Figma stays the source of truth for how things look. A rule here that differs from Figma is also an item in `docs/review-notes.md` and, where it is a design change, on the Design update recommendations page.

Each rule has an ID, what it says, where it comes from and where it is built. When the designer decides a new rule, add it here in the same commit as the change.

## Entra and AD

**ENT-1. Entra objects have no location.** AD objects sit in a folder (a location); Entra objects do not. Everything below follows from this.
- Source: designer, 16 Nov 2026.

**ENT-2. Creating an Entra user or group never asks for a location.**
- The New Entra User form has no "Select destination folder" button and no location under the title.
- The New Entra Distribution Group form is one step (General), with no stepper and no Select folder step.
- The object is made straight in a tenant: the tenant you are viewing in the Tree view, otherwise the first one (3bf67d). The "created" toast does not say "in [location]".
- New AD users and AD groups still choose a folder.
- Built: `views/UsersPage/CreateObjectModal/` (`entra` option), `views/GroupsPage/CreateGroupModal.tsx`, kit `ARSNewObjectTemplate` (the location line is left out when empty).

**ENT-3. Entra objects are not moved, and nothing is moved into Entra ID.**
- Every Move sheet (users, groups, OUs, several objects) shows Active Directory only, and the left panel refuses drops on Entra.
- The Copy sheet still shows Entra ID, so Entra groups can be copied.
- The Users list's action bar leaves Move out when any selected user is in Entra. Entra groups have no Move (requirements board 531:1408).
- Source: designer ("You asked for this" in `docs/review-notes.md`, Flow 6; Move on the bar, Flow 2).
- Not moved anywhere an Entra object appears: Tree view lists (row menus, the action bar, dragging), an Entra user's page, an Entra group's page and the generic object page. AD objects keep Move.

**ENT-4. Entra rows show their directory where AD rows show a folder.** A user's Location column reads `Entra`, `Entra2`, `Entra3` or `Entra4`; an Entra group's Directory column reads its tenant (for example `3bf67d.onmicrosoft.com`). AD rows read a folder path (`AD3\Staff`, `O1D.local\Builtin`). This text is not a place you can move to.
- Built: `views/UsersPage/mockUsers.ts`, `lib/directoryFilter.ts`.

## Lists and navigation

**LST-1. The directory filter follows the list's own column.** "All directories" in the Flat view panel filters Users, Groups and Management units by the directory their Location or Directory column shows. Ticking none shows nothing, and the button reads "No directories".
- Source: designer. Built: `lib/directoryFilter.ts`.

**LST-2. The action bar shows wherever rows can be ticked.** Users, Tree view lists, Groups, Managed units, a group's and a user's Memberships, a user's Roles and Favourites. Where there is no flow behind Copy, Move or Delete, they do nothing.
- Source: designer.

**LST-3. Paging is always in view, and only one floating layer shows at a time.** Paging stays at the bottom of the list, the action bar floats above it, and the bar flies out while a side sheet is open and back in when it closes.
- Source: designer. Built: `ActionBar`, `lib/sideSheetStore.ts`, `ARSPagination`.

**LST-4. The Move and Copy sheets start at Managed directories.** Access templates and Managed units are not destinations, in the sheets or by dragging in the left panel.
- Source: designer.

**LST-5. The breadcrumb shows the whole path** on Tree view pages, each folder opening its list.
- Source: designer.

**LST-6. The directory panel starts closed for David and Werner, open for Lisa.** Each persona remembers its own choice.
- Source: designer.

## Counts and tabs

**CNT-1. One count for a thing, wherever it shows.** A user's Group memberships and Assigned roles tile, the tab label ("Memberships (2)") and the list under the tab show the same number. The tile is a button that opens the tab.
- Source: designer.

## Creating things

**CRT-1. Users > Create is the New User menu** (New Entra User, New AD User, Add User), not the long New object menu, which stays on the Tree view. Add User opens a Coming soon dialog.
- Source: designer.

**CRT-2. The Groups list's Create is a split button** with AD group and Entra group.
- Source: designer.

**CRT-3. A new AD group has three steps:** General, Exchange options, Select folder. The folder defaults to O1D.local from the Groups list, or to the current folder in the Tree view.
- Source: designer. The folder step is drawn as New User's Select folder step (Figma 3651:20393), 16 Nov 2026.

**CRT-4. A new AD user has three steps:** General, Account, Select folder. The folder is picked in the step (Figma 3651:20393), not with a "Select destination folder" button and its side sheet.
- Source: designer, 16 Nov 2026. Built: `views/SelectFolderStep/`, `views/UsersPage/CreateObjectModal/`.

## Anything not built

**NEW-1. Unbuilt tabs, pages and actions say "Coming soon".** They show the interactive Vault figure with disabled-looking text. An action with no design (Deprovision and Deactivate on a user, Add User) opens a dialog with the same content; its Cancel and Confirm just close it.
- Source: designer. Built: `views/ComingSoon/`, `views/ObjectModals/ComingSoonModal.tsx`.
