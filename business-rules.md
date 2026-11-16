# DRAFT DO NOT USE - Business Rules — Directory Management Prototype

## 1. Purpose and Agent Instructions

Extend the existing prototype using the business rules below.

### Recommended implementation guardrails

These instructions guide implementation; they are not additional board-defined functionality.

- Inspect the existing prototype before making changes.
- Preserve its architecture, design system, navigation conventions, and working functionality.
- Reuse existing components, forms, tables, dialogs, and mock-data patterns.
- Implement incrementally. Do not rebuild or redesign the entire application.
- Use local mock interactions. Do not perform live directory, account, security, or mailbox operations.
- Keep AD and Entra object types distinct.
- Do not introduce group-specific fields into assets, devices, or mailboxes merely because the source board contains copied forms.
- Preserve existing behavior where requirements are unspecified, and document it as existing behavior—not a board requirement.
- Do not invent permissions, validation rules, backend capabilities, or product decisions.
- Track unresolved requirements using `NEEDS_CONFIRMATION`.

### Requirement status

- `SOURCE`: Explicitly stated on the board; not necessarily product-approved.
- `NEEDS_CONFIRMATION`: Incomplete, contradictory, questioned, or copied content.
- `GUARDRAIL`: Recommended implementation direction.

### Source

https://www.figma.com/board/vBcbaCAlOcqYj6ltKXZ0BE?node-id=0-3

Source node references use `0:<number>`.

---

## 2. Object Scope and Navigation

### Property views

Support the following domains where specified and compatible with the existing prototype:

1. AD users.
2. Entra users.
3. Entra guest users.
4. AD groups.
5. Entra groups.
6. AD assets.
7. Entra devices.
8. Organizational Units (OUs).
9. Managed Units.

A separate Hybrid User view is an open question, not a confirmed requirement.

### User navigation

The board lists:

1. Overview
2. General
3. User Details
4. Account
5. Connections
6. Memberships
7. Managed Units
8. Roles
9. Authorization
10. Object
11. History

`NEEDS_CONFIRMATION`:
- Another note says Entra users have 14 navigation options; the additional three are not identified.
- Cards use “Roles/Access Templates” while navigation uses “Roles.”
- A note questions three nearby Entra panels, apparently Profile, Dial-In, and Terminal Services. Exact scope is unconfirmed. Do not add or remove these solely from that note.

### AD group navigation

1. Overview
2. General
3. Ownership
4. Memberships
5. Managed Units
6. Roles
7. Object
8. History

### Shared-module applicability

| Domain | Source-board modules |
|---|---|
| AD user | User overview; AD identity/details/account; Profile; Dial-In; Terminal Services; Email; conditional Exchange; user memberships; authorization; metadata; history; Managed Units and Roles placeholders |
| Entra user | Entra overview; Entra identity/details/account; authentication methods; user memberships; authorization; metadata; history; placeholders; copied connection panels requiring confirmation |
| Entra guest | Same as Entra user; additionally custom security attributes |
| AD group | Group overview; AD group general; ownership; Members; Members Of; metadata; history; placeholders |
| Entra group | Group overview; Entra group general; Members; Owners; metadata; history; placeholders |
| AD asset | Asset overview; metadata; history; placeholders; copied group general/ownership/membership content requiring confirmation |
| Entra device | History and placeholders; copied group overview/general/membership/actions requiring confirmation; metadata applicability unresolved |
| OU | OU overview; general; ownership; metadata; history; placeholders |
| Managed Unit | Labeled view-only, but contains copied OU properties/actions; keep read-only pending confirmation |

---

## 3. Overview Requirements

### User overview

Display:

- Large Iris Avatar.
- Email: read-only.
- Parent directory type chip: `Cloud`, `on-Prem`, or `Hybrid`.
- User type: read-only.
- Object ID: read-only.
- Created on: read-only.
- Group Memberships: linked count opening Membership view.

For Entra users and guests, also display linked counts for:

- Applications.
- Assigned roles.
- Assigned licenses.

The destination views are referenced but not fully specified.

### Group overview

Display:

- Large Iris Avatar.
- Membership type: read-only.
- Parent directory type chip.
- Group type: read-only.
- Object ID: read-only.
- Created on: read-only.
- Email: read-only.
- Linked counts: Total direct members, Users, Groups, Devices, Others.

`NEEDS_CONFIRMATION`: The board directs Groups, Devices, and Others to “Total users view.” Do not silently treat those destinations as approved.

### AD asset overview

Display:

- Large Iris Avatar.
- Role: read-only.
- Object ID: read-only.
- Created on: read-only.
- Group Memberships: linked count.

### OU overview

Display a header, description, and linked counts for:

- Total Objects.
- Users.
- Groups.
- OUs.
- Others.

`NEEDS_CONFIRMATION`: Several count destinations are copied from “Total users view.”

---

## 4. Shared Properties and Tables

### Object metadata

The board repeats these fields:

- Fully qualified domain name.
- Distinguished name.
- Object class.
- Created.
- Modified.
- Original USN.
- Current USN.
- Object GUID.
- Object SID.
- Managed.
- Protect object from accidental deletion: checkbox.

Editability is unspecified except for the checkbox.

`NEEDS_CONFIRMATION`: AD-specific metadata is copied into Entra domains. Do not assume all fields apply.

### History

Provide the source-defined areas:

- Change History.
- User Activity.

Both mention tab pages and expandable data.

Event schemas, columns, filters, retention, and expansion contents are unspecified.

### Managed Units and Roles/Access Templates

Cards contain only `NEW`.

Do not invent field definitions or workflows for these placeholders.

### User memberships

Provide:

- Search.
- Filter.
- Add: primary button.
- Remove: secondary button, disabled.
- Temporary access: secondary button, disabled.
- Set primary group: secondary button, disabled.
- Table of groups the object belongs to.

The board does not specify conditions that enable disabled actions.

### AD-style Members and Members Of

Both panels repeat the user-membership controls above.

`NEEDS_CONFIRMATION`: The Members panel describes its table as “groups object is member of,” which appears to describe Members Of instead.

### Entra-style Members and Owners

Members:

- Current-members table.
- Add Members.
- Bulk Import.
- Bulk Remove.
- Bulk Download.

Owners:

- Current-owners table.
- Add owner.

Columns, selection rules, import formats, and dynamic-membership restrictions are unspecified.

### Authorization

Certificates:

- Table of X509 certificates published for the user account.
- Add from file.
- Remove.
- Copy to file.

Entitlements:

- Table listing entitlements.

Managed resources:

- Table listing managed resources.

No column schemas are supplied.

### Authentication methods

Read-only:

- Default sign-in method.
- Usable authentication methods.
- Non-usable methods.
- System-preferred authentication method.

### Custom security attributes

A card in the guest-user area specifies:

- Table.
- Save.
- Discard.
- Add assignment.
- Remove assignment.

Attribute names, types, permissions, table columns, and member-user applicability are unspecified.

---

## 5. AD User Properties

### General

- First name.
- Last name.
- Initials.
- Display name.
- Description.

### User Details

Picture:

- Choose picture button.

Contact information:

- “1st Line.”
- “Street Country.”
- City.
- ZIP/Postal Code.
- Country/region dropdown.
- Office.
- Telephone number.
- Other telephone numbers: add line.
- Email.
- Web page.
- Other web pages: add line.

The source’s Job Information group contains:

- Home telephone.
- Other home telephone numbers: add/remove.
- Mobile number.
- Other mobile numbers: add/remove.
- Department.
- Company.
- Job title.
- Manager: Modify, Properties, Remove.
- Direct Reports table.

`NEEDS_CONFIRMATION`: “1st Line” and “Street Country” are malformed address labels. Some contact fields appear under Job Information.

### Account

Identity:

- User logon name: name field plus directory dropdown.
- User logon name, pre-Windows 2000.

Checkbox options:

- User must change password at next logon.
- Password never expires.
- Store password using reversible encryption.
- Account is disabled.
- Smart card required for interactive login.
- Account is trusted for delegation.
- Account is sensitive and cannot be delegated.
- Use DES encryption types for this account.
- Do not require Kerberos pre-authentication.

Other information and controls:

- Account is locked out.
- Account expires: `Never` or `End of`, with date selection.
- Password expires.
- Logon Hours: opens selection modal.
- Logon To: modal with `All Computers` or `Following computers`.
- Last Logon: modal showing Last Logon and Days since last logon.
- Managed By: secondary-owners table with Add, Remove, Properties.

Control types for locked-out status and password-expiry information are unspecified here.

### Email

- Alias: input.
- External email address: disabled input.
- Modify: ghost button opening a modal.
- Modify modal: email-address-type dropdown, email-address input, OK, Cancel.
- Associated administrative group: input/dropdown.

---

## 6. Entra User and Guest Properties

### General / Identity

- First name.
- Last name.
- Display name.
- User principal name plus Domain dropdown.
- User type: `Member` or `Guest`.
- Authorization info.
- Edit certificate user IDs.

### User Details

Picture:

- Choose picture button.

Job information:

- Job Title.
- Company Name.
- Department.
- Employee ID.
- Employee Type.
- Employee Hire Date.
- Office Location.
- Manager.
- Sponsors.

Contact information:

- Street Address.
- City.
- State.
- ZIP/Postal.
- Country/region.
- Business Phone.
- Mobile Phone.
- Email.
- Other emails: add.
- Fax Number.
- Mail Nickname.

### Account

- Password.
- Confirm password.
- Generate, Clear, Spell out.
- “User must sign in”: checkbox.
- “User must change password at next sign in with MFA”: checkbox.
- Managed By: secondary-owners table with Add, Remove, Properties.
- Devices: table with Add, Remove, Properties.

`NEEDS_CONFIRMATION`:
- “User must sign in” semantics are unclear. Do not reinterpret it as block-sign-in.
- MFA-related password-change semantics are undefined.
- Devices is incorrectly described as a secondary-owners table.

---

## 7. Connection Panels

These panels appear for AD users and are duplicated in Entra member/guest areas. Entra applicability requires confirmation.

### Profile

- Profile Path: input.
- Logon script: input.
- Home folder: `Local path` or `Connect`.
- Connect includes drive-selection dropdown.

Full path controls and enablement rules are incomplete.

### Dial-In

- Remote access permission:
  - Allow access.
  - Deny access.
  - Control access through Remote Access Policy.
- Verify caller-ID: checkbox plus input; input disabled when unchecked.
- Callback options mention No callback and Set by caller.
- Callback wording references Routing and Remote Access Service and selection-dependent input enablement; exact mapping is unclear.
- Assign a static IP address: checkbox enabling its input.
- Apply static routes: checkbox enabling a routes table.
- Add routes.
- Delete routes.

### Terminal Services

Sessions:

- End a disconnected session, minutes.
- Active session limit, minutes.
- Idle session limit, minutes.
- On session limit or broken connection:
  - Disconnect from session.
  - End Session.
- Reconnection:
  - From any client.
  - From originating client only.

Remote control:

- Enable remote control: checkbox.
- Require user’s permission: checkbox.
- View the user’s session or Interact with the session.

Profile:

- Terminal-services user-profile input.
- Home directory:
  - Local path plus input.
  - Connect plus input and drive dropdown.
- Allow logon to terminal server: checkbox.

Environment:

- Start the following program at logon: checkbox.
- Program file name.
- Start in.
- Connect client drives at logon.
- Connect client printers at logon.
- Default to main client printer.

`NEEDS_CONFIRMATION`: The last three are described as inputs, despite checkbox-like wording.

---

## 8. Group, Asset, OU, and Managed Unit Properties

### AD group General

- Group name, pre-Windows 2000.
- Display name.
- Description.
- Resource URL.
- Keywords: large input with add/remove chips.
- Email.
- Group scope: Domain local, Global, Universal.
- Group type: source wording “domain security/distribute.”
- Notes: large text field.

Creation uses Security/Distribution; confirm normalized terminology.

### AD group Ownership

- Manager: Modify, Properties, Remove.
- Office.
- Street address.
- City.
- State/province.
- Country/region.
- Telephone number.
- Fax number.
- Secondary owners: Modify, Properties, Remove.
- Secondary owners can update membership list: checkbox.
- Approval by primary owner/manager: checkbox.
- Approval by secondary owner: checkbox.

Approval AND/OR or exclusivity rules are unspecified.

### Entra group General

- Group Name.
- Group description.
- Group type.
- Membership type: Assigned or Dynamic.
- Object ID.
- Microsoft Entra roles can be assigned to group: Yes/No toggle.

Creation distinguishes Dynamic user and Dynamic device; edit-form behavior needs confirmation.

### AD assets and Entra devices

`NEEDS_CONFIRMATION`:
- AD asset General and Ownership duplicate AD group content.
- Entra device Overview, General, Members, Owners, and actions duplicate group content.
- No trustworthy complete device-specific or asset-specific schema is supplied.

Do not add copied group controls to these screens without confirmation.

### OU General

- Description.
- Street address.
- City.
- State/Province.
- ZIP/Postal Code.
- Country/region.

### OU Ownership

- Manager: input with Modify, Properties, Remove.
- Office.
- Street Address.
- City.
- State/Province.
- Country/region.
- Telephone Number.
- Fax Number.
- Secondary Owners: Add, Remove, Properties.

### Managed Units

The heading explicitly says View Only, but copied cards include Rename, Delete, Move, and edit-oriented properties.

`GUARDRAIL`: Keep Managed Units read-only pending clarification.

---

## 9. Exchange and Mailbox Requirements

### Visibility

Show Exchange properties when Exchange is activated on the object.

### General

Read-only:

- Organizational Unit.
- Last logged on by.
- Total items.
- Size.
- Mailbox database.
- Archive database.
- Modified.

Editable:

- Alias.

### Send As delegation

Table columns:

- Name.
- Description.
- Type.

Actions:

- Add.
- Remove.
- Properties.

Name links to properties.

### Email addresses

Columns:

- Type.
- Address.

Actions:

- Add.
- Edit.
- Remove.
- Set as reply.

Also list “Automatically update email addresses based on email address policy”; control type and default are unspecified.

### Advanced

- Simple display name.
- Downgrade high-priority mail bound for X400: checkbox.
- ILS Settings: ghost button opening read-only sidesheet.
- Mailbox rights: ghost button opening read-only sidesheet.
- Mailbox move status: ghost button opening read-only sidesheet.
- Administrative groups: read-only input.

### Mailbox features

Columns: Feature, Status.

Actions: Enable, Disable, Properties.

Feature name also opens properties; properties sidesheet is read-only.

### Mailflow settings

- Name.
- Description.
- Name/property action opens read-only sidesheet.

### Mailbox settings

`NEEDS_CONFIRMATION`: Explicit source note says “MISSING CHECK LAB.”

### Create Mailbox action

Modal containing:

- Confirmation dialogue.
- Alias input.
- Mailbox database input and Browse button.
- Browse reveals search and table with Name, Server.
- Retention policy checkbox reveals search and Name-only policy table.
- Address book policy checkbox reveals search and Name-only policy table.

Selection cardinality and submission details are unspecified.

---

## 10. Creation Flows

Requiredness, defaults, validation, destinations, and completion behavior are unspecified unless explicitly stated.

### New AD User

General:

- First name.
- Last name.
- Initials.
- Display name.
- Description.

Account:

- Password.
- Confirm password.
- Generate, Clear, Spell out.
- User must change password next logon.
- User cannot change password.
- Password never expires.
- Account is disabled.
- Open properties for this object when I finish: checkbox.

`NEEDS_CONFIRMATION`: Stray text “Street Countr”; username/UPN and destination are not supplied in this creation form.

### New Entra User

Basics/Identity:

- First name.
- Last name.
- Initials.
- Display name.
- Description.
- Job Title.
- Department.
- Usage Location.

Account:

- Password.
- Confirm password.
- Generate, Clear, Spell out.
- “User must sign in”: checkbox.
- “User must change password at next sign in with MFA”: checkbox.

Licenses and roles:

- Developer pack checkbox.
- Expand to reveal 22 additional licenses.
- Eight Office 365 role checkboxes.

License and role names are not supplied.

### Add External Entra User

Basics:

- Email.
- Display name.

Invitation:

- Send invite message: checkbox.
- Message input.
- CC Recipient.
- Auto-populated Invite URL.

Properties:

- First name.
- Last name.
- User type: Member/Guest.
- Authorization info/Edit certificate user IDs.

Job information:

- Job Title.
- Company name.
- Department.
- Employee ID.
- Employee Type.
- Employee hire date.
- Office location.
- Add manager.
- Fax Number.

Contact:

- Street Address.
- City.
- State.
- ZIP/Postal.
- Country/region.
- Business Phone.
- Mobile Phone.
- Email.
- Other emails: add.

Parental controls:

- Age group.
- Consent provided for minor.

Settings:

- Usage location dropdown.

Assignments:

- Add Administrative Unit.
- Add Group.
- Add Role.

`NEEDS_CONFIRMATION`: The Assignments card is titled Licenses.

### New AD Group

Step 1 — General:

- Group name.
- Group name, pre-Windows 2000.
- Group description: large text field.
- Scope dropdown: Domain, Global, Universal.
- Type dropdown: Security, Distribution.
- Select destination folder: navigation dropdown, single selection.

Step 2 — Exchange:

- Create an Exchange email address: checkbox.
- Alias: read-only, populated with Group name.
- Associated administrative group: read-only; derivation unclear.

`NEEDS_CONFIRMATION`: Creation says Domain while properties say Domain local. Checkbox effects are unspecified.

### New Entra Distribution Group

- Name: required.
- Display name.
- Description.
- Primary SMTP address: local-part field plus @domain dropdown.
- Leaving Primary SMTP address blank uses a default; generation algorithm unspecified.
- Hide from global address list: checkbox, unchecked by default.
- Join group: Open/Closed.
- Leave group: Open/Closed.

Tooltips:

- Join Open: Anyone can join without owner approval.
- Join Closed: Only group owners can add members; join requests automatically declined.
- Leave Open: Anyone can leave without owner approval.
- Leave Closed: Leave requests automatically declined. Source also says “only group owners can add members,” which appears copied.

Initial Join/Leave toggle states are unspecified.

### Other Entra Group and Mailbox Creation Forms

The board assigns the same generic body to:

- Dynamic Distribution Group.
- Microsoft 365 Group.
- Security Group.
- Room Mailbox.
- Shared Mailbox.

Generic body:

- Group type: Security/M365.
- Group name.
- Group description.
- Microsoft Entra roles can be assigned: Yes/No.
- Membership type: Assigned/Dynamic user/Dynamic device.

`NEEDS_CONFIRMATION`:
- Most cards are incorrectly titled New Entra Distribution Group.
- Dynamic-distribution recipient rules are absent.
- Room/shared-mailbox-specific fields are absent.
- Allowed type/membership/role-assignment combinations are undefined.

Preserve existing specialized forms; do not replace them with this generic body.

### Conflicted New AD Asset / Entra Group

The surrounding headings say New AD Asset and New AD Group, while the form says New Entra Group.

The form contains the generic group fields above, plus:

- Owners: opens Add owners sidesheet.
- Members: opens Add members sidesheet.

Do not assign this form to AD asset creation without confirmation.

### New OU

- Name.
- Protect container from accidental deletion: checkbox.
- Open properties when I click Finish: checkbox.

Defaults and parent selection are unspecified.

---

## 11. Actions and Dialog Contracts

### Delete

Source-defined contract:

- Modal.
- Confirmation dialogue.
- Object details.
- Warning: “This action cannot be undone.”
- Typed-input confirmation security feature.

Required confirmation text and exact buttons are unspecified.

`GUARDRAIL`: Do not offer Undo for irreversible Delete. Reuse an existing confirmation contract or leave completion blocked pending clarification.

### Move

- Modal and confirmation dialogue.
- Search.
- Directory tree.
- Move/Cancel.
- Confirmation toast with Undo/Confirm.

Toast lifecycle and reversibility semantics are unspecified.

### Copy

The board specifies:

- New User screen.
- Confirmation dialogue.
- Search.
- Directory tree.
- Move/Cancel buttons.
- Undo/Confirm toast.

`NEEDS_CONFIRMATION`: New User and Move wording is copied across other object types. Copy must not accidentally invoke Move.

### Rename

Cards specify:

- Modal.
- Name input.
- Group name, pre-Windows 2000 input.

`NEEDS_CONFIRMATION`: The group-specific second field also appears for assets, OUs, and devices.

### Properties and Edit

- Properties opens the object.
- AD-user Edit opens a specific tab directly; eligible tabs are not listed.

### Action availability

| Domain | Actions shown on board |
|---|---|
| AD user | Reset Entra ID MFA; Activate/Deactivate; Deprovision; Delete; Reset Password; Create Mailbox; Move; Copy; Properties; Edit |
| Entra user/guest | Delete; Deprovision; Revoke all sessions; Reset Password; Properties |
| AD group | Rename; Deprovision; Delete; Move; Copy; Properties |
| Entra group | Rename; Deprovision; Delete; Move; Copy; Properties; several actions incorrectly say AD Group |
| AD asset | Rename; Deprovision; Reset AD Account; Disable AD Account; Delete; Move; Copy; Properties; BitLocker Recovery |
| Entra device | Copied Rename Group, Deprovision AD Group, Delete AD Group; Move; Copy; Properties |
| OU | Rename; Delete; Move; Properties |
| Managed Unit | Copied OU actions conflict with View Only; do not enable mutations |

### Confirmation variants

- AD-user MFA reset and AD-asset account reset:
  - Modal, confirmation, OK/Cancel, Undo/Confirm toast.
- AD-user Activate/Deactivate and Deprovision:
  - Modal, confirmation, Yes/No, Undo/Confirm toast.
- AD-group Deprovision, AD-asset Deprovision/Disable, and copied group/device Deprovision:
  - Modal, confirmation, Yes/No, Undo/Confirm toast.
- Entra-user/guest Deprovision and Revoke all sessions:
  - Modal, confirmation, Yes/No.
  - No toast specified.

Do not infer that security operations are genuinely reversible from toast wording.

### AD password reset

- Password.
- Confirm password.
- User must change at next logon: checkbox.
- Password never expires: checkbox.
- User cannot change password: checkbox.
- Account is locked out: read-only checkbox.

### Entra password reset

- Modal.
- Primary Reset password button.
- Confirmation showing temporary password.
- Copy icon.

### BitLocker Recovery

Only “Recover BitLocker password” is supplied.

Permissions, secret handling, recovery workflow, and audit behavior require confirmation.

---

## 12. Unresolved Decisions

Do not silently resolve:

1. Whether a separate Hybrid User view is needed.
2. Eleven versus fourteen Entra navigation options.
3. Which three panels the “No to these 3” note rejects.
4. AD-specific connection and metadata applicability to Entra.
5. Copied group fields/actions in asset and device domains.
6. Generic forms under specialized group/mailbox headings.
7. Managed Units View Only versus mutation actions.
8. Copy dialogs using Move terminology.
9. Rename dialogs using group-specific fields for other objects.
10. Incorrect overview-count destinations.
11. Password/MFA checkbox semantics.
12. Missing Exchange Mailbox Settings.
13. Missing Managed Units and Roles/Access Templates functionality.
14. Missing validation, defaults, permissions, field constraints, and dirty-state behavior.
15. Missing schemas for most tables.
16. Missing dynamic-membership rules, temporary-access expiry, and approval logic.
17. Missing license/role names and compatibility rules.
18. Missing invitation generation, CC, expiry, and parental-control options.
19. Undefined deprovision, disable, account reset, MFA reset, and session-revocation effects.
20. Undefined Undo/Confirm lifecycle.

Board notes propose combining Entra functionality with existing ARS WebUI data and displaying backend data. Treat these as integration intentions—not proof of available APIs or approved scope.

---

## 13. Acceptance Criteria

- Existing prototype structure and working behavior are preserved.
- Changes reuse existing components and mock patterns.
- No live directory or security operations are introduced.
- AD, Entra, member, guest, group, asset, device, OU, and Managed Unit contexts remain distinguishable.
- Explicit options, read-only fields, defaults, and disabled states match the source.
- Checkbox-controlled inputs and tables follow specified enablement rules.
- Distribution-group Name is required; Hide from GAL starts unchecked.
- The 22-license and eight-role counts remain documented without invented names.
- Supplied table columns are retained; missing schemas are flagged.
- Copied group fields do not leak into unrelated object screens.
- Managed Units remains read-only pending clarification.
- Delete does not offer Undo.
- Copy does not perform Move.
- Unresolved decisions are reported, not presented as implemented requirements.

### Agent completion report

Return:

1. Screens and components updated.
2. Rules implemented.
3. Existing behavior preserved.
4. Assumptions made.
5. Requirements blocked by NEEDS_CONFIRMATION.
6. Tests performed and untested paths.
