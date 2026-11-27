# Business rules audit: results and recommendations

These are recommendations for the 48 partial or differing items presented in the audit table. The first number matches that table; the audit number links each item back to [business-rules-audit.md](business-rules-audit.md), which was checked against revision `3570d56`. The five no-screen areas and the matches are not included here.

The comparison source, [business-rules.md](../business-rules.md), is marked **DRAFT DO NOT USE**. Its contents are not approved requirements. Follow Figma for design and [decided business rules](decided-business-rules.md) for existing decisions. Where the draft, Figma and a decided rule conflict, do not implement a recommendation until the conflict is resolved. All recommendations below are proposed, not decisions.

⚠️ Partial · ❌ Differs

## Tabs and overview

| No. | Audit # | Status | Finding | Recommended solution |
|---:|---:|---|---|---|
| 1 | 3 | ❌ | Entra groups use AD tabs and content. | Check the Entra group design and confirm whether separate General, Members and Owners views are intended. If confirmed, give Entra groups their own views without changing AD groups. |
| 2 | 5 | ⚠️ | User creation dates are fixed sample values. | Use each user's own creation date when available; show an unset value when it is not. Retain the extra overview fields if Figma calls for them. |
| 3 | 6 | ❌ | User overview lacks a directory-type chip. | Check the user overview design; if a directory chip is intended, display the user's actual Cloud, on-premises or Hybrid type rather than a fixed value. |
| 4 | 7 | ⚠️ | Every user is labelled Member, including AD users. | Confirm which users should display a user type. Use the user's actual type where applicable and avoid assigning Member by default to AD users. |
| 5 | 9 | ❌ | Entra-specific counts appear for AD users; two have no destination. | Confirm which counts belong on each user type and their destinations. Keep the existing linked Roles count in line with decided rule CNT-1; do not invent Applications or Licenses destinations. |
| 6 | 11 | ⚠️ | Entra membership type displays Security or Distribution Group. | Keep the current Figma-led presentation unless the intended distinction between group type and membership type is confirmed; then show the correct value for each. |
| 7 | 12 | ⚠️ | Group counts all open Memberships; destinations are unconfirmed. | Confirm whether the total means direct members and where each count should lead. Keep counts consistent with their underlying lists; do not invent separate destinations. |
| 8 | 13 | ❌ | OU overview has no description. | Check the OU overview design and, if a description belongs there, display the OU's saved description with an appropriate empty state. |
| 9 | 14 | ⚠️ | OU counts are not linked. | Confirm which counts should be links and where they go, including the Other Objects strip. Wire only confirmed destinations and keep counts consistent with the displayed objects. |

## Properties

| No. | Audit # | Status | Finding | Recommended solution |
|---:|---:|---|---|---|
| 10 | 15 | ⚠️ | Some group and OU metadata is duplicated, incomplete or sample data. | Use the correct value for each metadata field when available; distinguish unavailable data from an actual value. Confirm which fields are applicable before changing the display. |
| 11 | 16 | ❌ | Accidental-deletion protection is read-only. | Confirm whether protection should be editable on object details. If approved, save the setting and ensure deletion honours it; otherwise retain the read-only display. |
| 12 | 17 | ❌ | Entra groups show AD metadata. | Confirm the Entra metadata fields, then show only applicable Entra values rather than fabricated AD distinguished names and domain data. |
| 13 | 18 | ⚠️ | AD user General has extra fields and hides initials in read mode. | Compare the AD General design with the draft; show and edit the confirmed fields consistently without removing Figma-required fields solely because the draft omits them. |
| 14 | 19 | ❌ | AD User Details uses Entra-style fields and lacks AD-specific controls. | Confirm the AD-specific design and fields, then separate AD from Entra details. Add only approved picture, contact, manager and Direct Reports interactions. |
| 15 | 20 | ❌ | Entra User type and certificate user IDs are absent. | Confirm their design and behaviour before adding the Entra-specific fields; use actual user type rather than a universal fixed label. |
| 16 | 21 | ⚠️ | Entra User Details has no Choose picture action. | Confirm the picture-selection design and intended prototype behaviour, then add it without altering the existing contact and job fields. |
| 17 | 23 | ❌ | Group Keywords is plain text, not chips. | Confirm the keyword interaction and storage format; if approved, support adding and removing individual keywords and preserve existing values. |
| 18 | 24 | ❌ | Group Notes is missing; Tags is present. | Check whether Notes and Tags are separate fields. Add Notes only if confirmed; do not silently repurpose or remove Tags. |
| 19 | 25 | ❌ | Entra groups use the AD General form. | Confirm the Entra General design, then show the applicable group type, membership type, object ID and role-assignment fields instead of AD-only fields. |
| 20 | 26 | ⚠️ | Group manager and owner Properties actions are missing. | Confirm the intended person destination, then link each manager and owner to their own properties without changing add or remove behaviour. |
| 21 | 27 | ❌ | Group approval settings are missing. | Confirm whether the two approval settings are distinct from the existing membership-update settings. Add and save them only if approved; do not substitute one for the other. |
| 22 | 28 | ⚠️ | OU Name can be edited in General. | Confirm whether General editing is the intended rename mechanism. Keep it if approved, or provide a separate Rename action without losing the saved name. |
| 23 | 29 | ⚠️ | OU manager and owner Properties actions are missing. | Confirm the intended person destination, then link each manager and owner to their own properties while retaining existing add and remove controls. |

## Memberships and creation

| No. | Audit # | Status | Finding | Recommended solution |
|---:|---:|---|---|---|
| 24 | 31 | ❌ | Memberships toolbar Filter is hidden. | Check the Memberships design; if filtering is intended, expose the existing filter interaction on both user and group lists and apply it to the displayed rows. |
| 25 | 32 | ❌ | Memberships has per-row removal rather than the draft's disabled toolbar Remove. | Confirm whether per-row removal with Undo should remain or be replaced by a toolbar action. Keep the selection bar required by LST-2; do not introduce bulk removal without an approved flow. |
| 26 | 33 | ❌ | Temporary access and Set primary group are absent. | Confirm whether these controls belong in the current design. If approved but unbuilt, present them according to the agreed placeholder behaviour rather than inventing actions. |
| 27 | 34 | ❌ | Entra groups lack dedicated Members and Owners flows. | Confirm the Entra Members and Owners design and each Add/Bulk action. Build only approved flows and retain AD membership behaviour separately. |
| 28 | 35 | ❌ | User Roles has sample content although the draft calls it a placeholder. | Confirm whether the existing Roles list should remain. Preserve CNT-1's linked, consistent Roles count and LST-2's selection bar unless those decisions change. |
| 29 | 36 | ❌ | Managed Units are read-only but show no-op mutation actions. | Preserve read-only data and the LST-2 selection bar. Confirm whether its no-op Copy, Move and Delete actions should remain as decided or be revised; do not enable changes without approval. |
| 30 | 37 | ❌ | New AD User General lacks Description and adds other fields. | Compare the current form with the AD user design; add or change fields only where confirmed. Preserve the decided three-step AD user flow, CRT-4. |
| 31 | 38 | ❌ | New AD User Account lacks password tools and Open properties. | Confirm which password tools, account-option label and Open properties behaviour are intended; implement approved controls with clearly defined results. |
| 32 | 39 | ❌ | New Entra User uses the generic AD-style form. | Confirm the Entra-specific form and assignments, then separate its fields and steps from AD. Preserve ENT-2: no Entra location or folder selection. |
| 33 | 41 | ⚠️ | Asset, GMSA and Shared Folder creation reuse the user form. | Confirm the intended form for each object type before replacing the generic form. Do not invent object-specific fields or creation behaviour from the draft. |
| 34 | 62 | ⚠️ | New AD Group differs in folder step, scope and Exchange details. | Keep the three-step folder flow required by CRT-3. Confirm the scope label, description limit and Exchange checkbox behaviour; retain read-only derived fields only if their values are approved. |
| 35 | 63 | ⚠️ | Entra Distribution Group has assumed defaults and copied Leave tooltip. | Confirm the SMTP default, Join/Leave defaults and tooltip wording. Ensure approved choices are saved and reflected after creation; preserve the one-step, no-location flow in ENT-2. |

## Actions and dialogs

| No. | Audit # | Status | Finding | Recommended solution |
|---:|---:|---|---|---|
| 36 | 43 | ⚠️ | Move uses a sheet without search and has Undo/View rather than Confirm. | Keep the Figma sheet and decided destination restrictions. Confirm whether search or a Confirm toast action is required before adding either. |
| 37 | 44 | ⚠️ | Group Copy has no search and uses Undo/View. | Keep Copy separate from Move and preserve permitted destinations under ENT-3 and LST-4. Confirm whether search or Confirm is required. |
| 38 | 46 | ❌ | User row Properties does nothing. | Wire Properties to the selected user's page from both Users and Tree view, consistent with the existing object navigation. |
| 39 | 47 | ⚠️ | User row tab shortcuts do nothing. | Confirm which shortcuts should be offered, then open the selected user's corresponding tab. Use the agreed Coming soon treatment for unbuilt tabs. |
| 40 | 48 | ❌ | Several AD user page actions are missing or do nothing. | Confirm the action list and designs. Wire approved actions to their intended prototype flows; use the decided Coming soon treatment for unbuilt actions instead of inventing live account operations. |
| 41 | 49 | ❌ | Several AD user row actions are missing or do nothing. | Align approved row actions with the user page and make their behaviour consistent between Users and Tree view, using Coming soon for unbuilt flows. |
| 42 | 50 | ❌ | Entra user row actions differ from the draft and several do nothing. | Confirm the Entra action list and reconcile row and page actions. Retain ENT-3's no-Move rule; use Coming soon for approved but unbuilt flows. |
| 43 | 52 | ⚠️ | Entra group Move is absent despite the draft's action list. | Keep Move hidden: decided rule ENT-3 explicitly forbids moving Entra objects. No change unless the designer revises that decision. |
| 44 | 53 | ❌ | AD asset actions are mostly absent. | Confirm the asset-specific actions and designs, then add approved prototype flows or Coming soon states. Do not reuse group-specific actions solely from copied draft content. |
| 45 | 54 | ⚠️ | OU has no separate Rename action. | Confirm whether editing Name in General is sufficient. If a separate Rename is approved, route it to a defined rename flow while keeping both entry points consistent. |
| 46 | 55 | ⚠️ | Group Deprovision toast lacks Confirm; Entra dialog says AD. | Confirm the intended toast actions. Correct the dialog's object-type wording if the Entra deprovision flow is approved, without changing AD behaviour. |
| 47 | 56 | ⚠️ | AD password reset omits lockout status and adds Account is disabled. | Confirm which account states are shown or editable; add lockout as read-only if approved and keep reset options consistent with the intended design. |
| 48 | 57 | ⚠️ | Entra password reset opens directly to the result. | Confirm whether a separate Reset password confirmation is required before the temporary password. Keep password copying available in the approved result state. |
