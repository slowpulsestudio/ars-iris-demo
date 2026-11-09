# Prototype-specific agent instructions

Add any instructions here that are specific to this prototype — design decisions, constraints, what you're testing, known issues, personas, etc. This file is never overwritten by /skill-me-up.

## Figma is read-only

Never create, edit, move, rename, or delete anything in Figma, under any circumstances — including pages whose names start with 🤖.

- Only use Figma tools that read, such as `get_metadata`, `get_design_context`, and `get_variable_defs`.
- Never call `use_figma`, `generate_figma_design`, `create_new_file`, `upload_assets`, or any other Figma tool that can make changes — not even just to read.
- If something can't be read with the read-only tools, stop and tell the Designer. Don't work around it.
- This rule overrides any skill that says otherwise, including the step in `figma-read-from-mcp` that says to explore files with `use_figma`.
