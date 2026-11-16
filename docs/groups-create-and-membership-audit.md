# Groups: create flows, Add Members and Add Membership — audit

Audit only; nothing was built. Columns as the update-existing-screen workflow asks.

## Create New AD Group

General [2109:10097](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2109-10097), Exchange options [2112:12077](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2112-12077)

| # | Area | Current (code) | Target (Figma) | In library | Built locally | Planned action |
|---|---|---|---|---|---|---|
| 1 | Entry points | Groups list Create and Tree view New Group open "Coming soon" | Open the New AD Group flow | ✓ | ✓ (unused CreateGroupModal) | Wire both to the flow; drop the group Coming soon dialog |
| 2 | Step 2 name | "Exchange e-mail" | "Exchange options" | ✓ | ✓ | Rename |
| 3 | Side panel | None (form only) | "Create new AD group" + Figma's text beside the form | ✓ | ✓ (New User's side panel) | Reuse it |
| 4 | Info icons | None | On pre-Windows 2000 name, description, scope, type | ✓ | ✓ | Add (tooltip "More information", as elsewhere) |
| 5 | Description | Plain multiline | 0/100 counter (its helper text is copied from a user form) | ✓ | ✓ | Add counter; leave the copied helper out, tidy-up card |
| 6 | Required marks | Only the two names | Scope and Type also "(Required)" | ✓ | ✓ | Mark them |
| 7 | Destination folder | Fixed to the current folder | "Select destination folder" button | ✓ | ✓ (New User's folder sheet) | Reuse the folder side sheet |
| 8 | Associated administrative group | Folder path | Read-only "[group name] members" (Figma: "Security members") | ✓ | ✓ | Follow Figma's sample |
| 9 | Footer | "Create object" | "Create group →"; Figma's step 2 still says "Step 1 of 2" | ✓ | ✓ | "Create group", "Step 2 of 2"; tidy-up card |

## Create New Entra Distribution Group

Template [2109:11016](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2109-11016), draft [2109:10890](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2109-10890), note [2113:12494](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=2113-12494)

| # | Area | Current (code) | Target (Figma) | In library | Built locally | Planned action |
|---|---|---|---|---|---|---|
| 10 | Entry point | Tree view New Group in an Entra directory opens "Coming soon" | Opens the Entra form | ✗ (draft) | ✓ (unused modal) | Wire it |
| 11 | Fields | Unused modal follows the note | Template still generic ("New [Object Type]"); draft has placeholder labels; the note lists Name (required), Display name, Description, Primary SMTP + @domain, Hide from GAL, Join/Leave | ✗ | ✓ | Build from the note in the draft's layout; Design update card |
| 12 | Join/Leave toggles | Tooltip on the toggle; both Open by default | "Joining group, Open" (on) and "Leaving group, Closed" (off), tooltip on an info icon | ✓ | ✓ | Follow the draft |
| 13 | Side panel and button | None; "Create object" | "Create new Entra distribution group"; "Create group" | ✓ | ✓ | As rows 3 and 9 |

## Add Members

[215:7485](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=215-7485) built; [299:8188](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=299-8188)

| # | Area | Current (code) | Target (Figma) | In library | Built locally | Planned action |
|---|---|---|---|---|---|---|
| 14 | Width | 620px | 980px | ✓ | ✓ | Widen (also widens Add groups and the owner/manager pickers) |
| 15 | Name column | Bold name, no icon | Type icon + blue link name | ✓ | ✓ (Memberships table) | Add icon and link style |
| 16 | Title, subtitle | "Add members", "Object found: N" | Placeholders ("Title", copied text) | — | ✓ | Keep; tidy-up card |
| 17 | Search, filter area, paging, selected block, Cancel/Save | Match | Same | ✓ | ✓ | None |

## Add Membership

[215:7867](https://www.figma.com/design/KukLyO1RkJ4kYTzxGWd2Q7/ARS_WebUI2_Groups?node-id=215-7867)

| # | Area | Current (code) | Target (Figma) | In library | Built locally | Planned action |
|---|---|---|---|---|---|---|
| 18 | Group: Members Of | No way to add this group to other groups; button always "Add members" | Groups-only picker | ✓ | ✓ (the user's Add groups picker) | In Members Of, the button opens the groups picker and adds this group to them |
| 19 | User: Add groups | Same picker, groups only | Matches 215:7867 | ✓ | ✓ | Rows 14–15 only |

## Docs

| # | Area | Current (code) | Target (Figma) | In library | Built locally | Planned action |
|---|---|---|---|---|---|---|
| 20 | Docs | Group creation "Coming soon" on Design update recommendations and review notes | — | — | — | Replace with the built flows; tidy-up cards for rows 5, 9, 16; design update for row 11 |
