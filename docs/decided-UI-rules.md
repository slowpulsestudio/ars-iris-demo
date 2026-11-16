# Decided UI rules

The UI rules the designer has decided for this prototype: how screens and components behave where Figma is silent or draws something else. Product rules are in [decided-business-rules.md](decided-business-rules.md). Figma stays the source of truth for how things look; a rule here that differs from Figma is also an item in `docs/review-notes.md` and on the Figma tidy-up page.

Each rule has an ID, what it says, where it comes from and where it is built. When the designer decides a new rule, add it here in the same commit as the change.

## Modals

**MOD-1. A modal with steps is as tall as its tallest step, on every step.** It hugs the full height of the tallest step's content and keeps that height on shorter steps, so the layout doesn't jump between steps and the footer buttons stay in one place, which also helps accessibility.
- Applies to every New object and New group form with a stepper: New AD User, New Entra User, the Tree view's other New object types and New AD Group. Figma keeps their body at a fixed 729px (ARS_New_Object_Template 3367:12947).
- The Select folder step (Figma 3651:20393) is never the tallest: its tree fills the height the other steps give it and scrolls.
- Source: designer, 16 Nov 2026. Built: kit `ARSNewObjectContentContainer` (`stepContents`: every step shares one grid cell, and the steps not on screen are hidden and inert), `views/UsersPage/CreateObjectModal/`, `views/GroupsPage/CreateGroupModal.tsx`.
