# Business rules audit

`business-rules.md` (its first line says "DRAFT DO NOT USE") compared with the prototype at `3570d56`; the previous pass used `589a8cd` (13 Nov 2026). This records current implementation versus an unconfirmed draft, not whether the draft is approved or should be implemented. Audit only; no application code was changed.

Since the previous pass, New AD Group and New Entra Distribution Group flows are built, and selection bars have been added to Memberships and Roles. The group-create flows are now included below.

- **Result:** 11 match, 22 partly match, 26 differ, and 5 rule areas have no screen at all.
- **Where the gaps cluster:**
  - Entra users and Entra groups get the AD layouts and forms.
  - The Memberships buttons don't follow the rules.
  - New Entra User uses the AD user form; the newly built group forms only partly match the draft.
  - Several menu actions are shown but do nothing.

✅ matches · ⚠️ partly · ❌ differs

**Tabs and Overview**

| # | Rule | What the app does | |
|---|---|---|---|
| 1 | User tabs: Overview, General, User Details, Account, Connections, Memberships, Managed Units, Roles, Authorization, Object, History | Same 11 tabs for AD and Entra users | ✅ |
| 2 | AD group tabs: Overview, General, Ownership, Memberships, Managed Units, Roles, Object, History | Same 8, labelled "Roles/access templates" and "Object details" | ✅ |
| 3 | Entra group: Entra General, Members and Owners; no Ownership tab | Entra groups get the AD group tabs and content | ❌ |
| 4 | OU: Overview, General, Ownership, Object, History, placeholders | Same | ✅ |
| 5 | User Overview: avatar, email, Object ID, Created on | All shown, but Created on is a fixed sample date. Adds User principal name and Last sign-in | ⚠️ |
| 6 | User Overview: directory chip (Cloud, on-Prem, Hybrid) | No chip; the badges are "Member" and the account status | ❌ |
| 7 | User Overview: User type | "Member" on every user, AD users included | ⚠️ |
| 8 | Group Memberships count opens the Memberships tab | Yes | ✅ |
| 9 | Applications, Assigned roles and Assigned licenses counts: Entra users only, each linked | Shown for AD users too; only Assigned roles opens anything | ❌ |
| 10 | Group Overview: avatar, Membership type, chip, Group type, Object ID, Created on, Email | All shown | ✅ |
| 11 | Membership type for Entra groups: Assigned or Dynamic | "Security Group" or "Distribution Group" on every group, Entra too (your earlier choice to follow Figma) | ⚠️ |
| 12 | Group counts: Total direct members, Users, Groups, Devices, Others | Labelled "Total members"; all five open Memberships (the rules call these destinations unconfirmed) | ⚠️ |
| 13 | OU Overview: header and description | No description | ❌ |
| 14 | OU counts: Total Objects, Users, Groups, OUs, Others, each linked | Four tiles plus an "Other Objects" strip (Shared folders, Contacts, Printers, GMSAs); none of them open anything | ⚠️ |

**Properties**

| # | Rule | What the app does | |
|---|---|---|---|
| 15 | Object details: FQDN, DN, class, Created, Modified, both USNs, GUID, SID, Managed | The fields are present, but group FQDN duplicates DN; OU FQDN is only the OU name; some values are fixed samples or `-`. Groups label Managed "Managed by" | ⚠️ |
| 16 | "Protect object from accidental deletion": an editable checkbox | Read-only Yes/No; groups call it "Protect from deletion" | ❌ |
| 17 | Don't assume AD metadata applies to Entra | Entra groups show AD metadata (CN=…, DC=contoso) | ❌ |
| 18 | AD user General: First name, Last name, Initials, Display name, Description | Adds User principal name with Directory, and Authorization information; Initials only appears while editing | ⚠️ |
| 19 | AD user, User Details tab:<br>• picture<br>• address, Office, Telephone and other numbers, Web page and others<br>• Home and Mobile numbers, Department, Company, Job title<br>• Manager (Modify, Properties, Remove) and Direct Reports | Shows the Entra fields instead. There's no picture, no phone or web page lists, and no Direct Reports. Manager is a plain text field | ❌ |
| 20 | Entra user General: User type (Member or Guest) and Edit certificate user IDs | Neither; same form as AD users | ❌ |
| 21 | Entra user, User Details tab: job and contact fields, Choose picture | Fields match; no Choose picture | ⚠️ |
| 22 | AD group General: pre-Windows 2000 name, Display name, Description, Resource URL, Email, Scope (Domain local, Global, Universal), Type (Security, Distribution) | All shown | ✅ |
| 23 | Keywords: input that adds and removes chips | Plain text input | ❌ |
| 24 | Notes: large text field | Missing; there's a Tags field instead | ❌ |
| 25 | Entra group General: Name, description, Group type, Membership type (Assigned, Dynamic), Object ID, "Entra roles can be assigned" Yes/No | Shows the AD General form | ❌ |
| 26 | Group Ownership:<br>• Manager and Secondary owners, each with Modify, Properties, Remove<br>• Office, address, phone and fax<br>• "Secondary owners can update membership list" | All there except Properties: you can't open the manager or an owner | ⚠️ |
| 27 | Group Ownership: "Approval by primary owner/manager" and "Approval by secondary owner" | Missing; the app adds "Manager can update membership list" instead | ❌ |
| 28 | OU General: Description and address fields | Match; the app also lets you edit Name here (the rules have Rename as an action) | ⚠️ |
| 29 | OU Ownership: Manager and Secondary owners with Add/Modify, Properties, Remove | No Properties | ⚠️ |

**Memberships and placeholder tabs**

| # | Rule | What the app does | |
|---|---|---|---|
| 30 | Memberships: Search, Add (primary button), table | Match ("Add groups" on users, "Add members" on groups) | ✅ |
| 31 | Memberships: Filter | Hidden on both user and group Memberships | ❌ |
| 32 | Remove: a secondary button, disabled | No Remove in the toolbar; each row has a working remove with Undo. The new selection bar offers Properties and Ask AI, but no Remove | ❌ |
| 33 | Temporary access and Set primary group: disabled buttons | Not shown | ❌ |
| 34 | Entra group Members (Add, Bulk Import, Bulk Remove, Bulk Download) and Owners (Add owner) | AD-style Members and Members of instead | ❌ |
| 35 | Managed Units and Roles tabs are placeholders; invent nothing | Group and OU ones are Coming soon; user Roles is built with sample roles and has a selection bar for Properties and Ask AI | ❌ |
| 36 | Managed Units are view only; no changes allowed | Read-only, but both selection bars (list and members) show Copy, Move and Delete, which do nothing | ❌ |

**Creating objects**

| # | Rule | What the app does | |
|---|---|---|---|
| 37 | New AD User, General: First name, Last name, Initials, Display name, Description | Adds Name, User logon name with suffix, and pre-Windows 2000 logon name; no Description | ❌ |
| 38 | New AD User, Account: Generate, Clear and Spell out buttons; "Account is disabled"; "Open properties for this object when I finish" | None of the three buttons; says "Account is inactive"; no Open properties. Password, Confirm and the other three options match | ❌ |
| 39 | New Entra User:<br>• Description, Job Title, Department, Usage Location<br>• "User must sign in" and the MFA option<br>• Developer pack, 22 licenses, 8 roles | Uses the AD user form, so none of these | ❌ |
| 40 | New OU: Name, "Protect container from accidental deletion", Open properties | Match; adds Description | ✅ |
| 41 | No creation form is defined for assets, GMSAs or shared folders | New Asset, GMSA and Shared Folder all use the user form (first and last name, password) | ⚠️ |
| 62 | New AD Group: General fields, scope/type, destination folder; then Exchange checkbox, read-only Alias and associated administrative group | Most fields exist. Folder selection is a final third step rather than part of General; Scope offers Domain local instead of Domain; description is capped at 100 characters. Exchange fields are read-only and the associated group is derived as "[name] members". Defaults are Global, Distribution and Exchange off | ⚠️ |
| 63 | New Entra Distribution Group: name, display name, description, SMTP address/domain, hide-from-list, Join and Leave states | Fields exist. Blank SMTP gets a lower-case, dot-separated default at `@contoso.com`; Join defaults Open and Leave Closed (draft leaves defaults unspecified). The Leave Closed tooltip repeats the Join Closed wording | ⚠️ |

**Actions and dialogs**

| # | Rule | What the app does | |
|---|---|---|---|
| 42 | Delete: confirmation, object details, "This action cannot be undone.", type the name to confirm, no Undo | Matches everywhere | ✅ |
| 43 | Move: search, folder tree, Move and Cancel, toast with Undo/Confirm | No search; a side sheet rather than a modal (as Figma draws it); the toast has Undo and View, no Confirm | ⚠️ |
| 44 | Copy: search, folder tree, toast with Undo/Confirm; must never move the object | Groups: no search; Copy and Cancel; toast has Undo and View; it does make a copy | ⚠️ |
| 45 | Rename a group: Name and pre-Windows 2000 name | Match | ✅ |
| 46 | Properties opens the object | Works for groups, OUs and other objects. Properties on a user row (Users list and Tree view) does nothing | ❌ |
| 47 | AD user Edit opens a specific tab | Only General's Edit button (and ⌘E). The row menu's Connections, Managed Units, Memberships and Roles items do nothing | ⚠️ |
| 48 | AD user actions: Reset Entra ID MFA, Activate/Deactivate, Deprovision, Delete, Reset Password, Create Mailbox, Move, Copy, Properties, Edit | On the user page:<br>• Reset password, Move and Delete work<br>• Reset Entra ID MFA, Copy, Deactivate and Deprovision do nothing<br>• no Activate and no Create Mailbox<br>• Revoke sessions is added | ❌ |
| 49 | The same actions in a user's row menu | • Reset Password, Move and Delete work<br>• Copy does nothing<br>• Deprovision and Deactivate are Coming soon in the Users list but do nothing in Tree view<br>• no Reset Entra ID MFA, Activate or Create Mailbox | ❌ |
| 50 | Entra user actions: Delete, Deprovision, Revoke all sessions, Reset Password, Properties | Row menu:<br>• no Delete<br>• adds Deactivate<br>• Revoke Sessions does nothing<br>• Deprovision is Coming soon<br>The Entra user page shows the AD action set | ❌ |
| 51 | AD group actions: Rename, Deprovision, Delete, Move, Copy, Properties | Match, in the Groups list menu and on the group page | ✅ |
| 52 | Entra group actions, including Move | Move is hidden from the Entra group list and detail page, following decided rule ENT-3. This intentionally differs from the draft's action list | ⚠️ |
| 53 | AD asset (computer) actions: Rename, Deprovision, Reset AD Account, Disable AD Account, Delete, Move, Copy, Properties, BitLocker Recovery | Only Move, Add to favourites and Delete, plus Create and View properties in Tree view | ❌ |
| 54 | OU actions: Rename, Delete, Move, Properties | No Rename; the name is edited in General | ⚠️ |
| 55 | AD group Deprovision: Yes/No, then a toast with Undo/Confirm | Yes/No works; the toast has Undo only. Entra groups also get a dialog titled "Deprovision AD Group" | ⚠️ |
| 56 | AD password reset: Password, Confirm, must change at next logon, never expires, cannot change, read-only "Account is locked out" | No "Account is locked out" row; adds an editable "Account is disabled" | ⚠️ |
| 57 | Entra password reset: a Reset password button first, then the temporary password with a copy button | Opens straight to the temporary password (copy works) | ⚠️ |

**In the rules but no screen at all (and not "Coming soon")**

58. Authentication methods for Entra users.
59. Custom security attributes for Entra guests; the app has no guest users at all.
60. Email and Exchange mailbox properties, and the Create Mailbox action.
61. BitLocker Recovery.
64. Separate Dynamic Distribution, Microsoft 365, Security, Room Mailbox and Shared Mailbox creation forms. The Groups create menu only offers AD group and Entra group; its Entra form creates a Distribution Group. The draft itself marks the generic variants as copied or unresolved.

**Left out of the audit because they show "Coming soon":**
- Add User (the external Entra user);
- Deprovision and Deactivate in the Users list;
- the user tabs Account, Connections, Managed Units, Authorization, Object and History;
- the Managed units, Roles and History tabs on groups and OUs;
- the Devices page;
- every tab except General on computers and other objects, including the AD asset Overview.
