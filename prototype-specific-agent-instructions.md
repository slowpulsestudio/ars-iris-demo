# Prototype-specific agent instructions

Add any instructions here that are specific to this prototype — design decisions, constraints, what you're testing, known issues, personas, etc. This file is never overwritten by /skill-me-up.

## Figma is the source of truth

The design for this prototype comes from Figma. Build what the Figma files show — never invent, guess, or "improve" a design, and never treat the existing code as the design when Figma shows something different.

The links to these files are in `.figma-url`:

| File | Use it for |
|---|---|
| **Main Product Design file** (ARS_WebUI2_CRUD) | The screens being built. It is the source of truth in any conflict. |
| **ARS Product Specific UI Kit** (ARS - Primary) | Active Roles product-level components. |
| **Iris Global UI Kit** (Iris UI – UI Kit) | Shared Iris components. |

- If the files disagree with each other, the Main Product Design file wins.
- Get these links from `.figma-url`. This project's `src/iris-shell/src/lib/verticals.ts` doesn't list Figma libraries, so don't look for them there.

## Figma is read-only

Never create, edit, move, rename, or delete anything in Figma, under any circumstances — including pages whose names start with 🤖.

- Only use Figma tools that read, such as `get_metadata`, `get_design_context`, and `get_variable_defs`.
- Never call `use_figma`, `generate_figma_design`, `create_new_file`, `upload_assets`, or any other Figma tool that can make changes — not even just to read.
- If something can't be read with the read-only tools, stop and tell the Designer. Don't work around it.
- This rule overrides any skill that says otherwise, including the step in `figma-read-from-mcp` that says to explore files with `use_figma`.

## Never open sites in the browser unasked

Other projects on this machine run on the same local address (localhost:5173), so whatever is running there may not be this prototype.

- Never open any site — local or otherwise — in the browser unless the Designer asks you to in that conversation.
- Never "reuse" a running dev server. If the Designer asks for a browser check, start this project's own server on a different port, and confirm the page title is `ars-iris-demo` before doing anything on it.
- This rule overrides any skill or checklist that says to start, reuse, or open localhost, including `figma-read-from-mcp`'s post-build checklist and `skill-me-up`.

## Injest folder is reference only

`Injest/` holds local copies of other projects, kept for reference in case they're needed. It is not part of this prototype.

- Never edit anything in `Injest/`, and never build, run, or import code from it — it isn't on GitHub, so the published site would break.
- Only look in it when the Designer asks you to.
- It's gitignored — never commit it.
