# agents.md - AI Agent Directory

> All AI coding assistants connected to this repo must follow the shared rules.
> Individual agent guides are in the `.agents/` folder.

## Shared Rules

See [.agents/rules.md](.agents/rules.md) for the full shared ruleset.

**Quick summary:**

- English only in code, comments, commits, and docs.
- Clean, readable, well-commented code.
- Small, focused functions. Composition over inheritance.
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- Business logic stays out of controllers.
- Never hardcode secrets. Use env vars.
- Validate all user input. Parameterized queries only.

## Guardrails

See [.agents/guardrails.md](.agents/guardrails.md) for full lockdown rules.

**Quick summary:**

- Nothing executes without user's "OK" or "Go".
- No git commands by agents. User handles all git.
- No file deletion. No database mutations.
- No reading .env or secrets.
- No process kill/restart.
- No outside communication without permission.
- No docker exec on DB containers.

## Connected Agents

| Agent              | Guide File                                      | Root Config (if needed)                |
|--------------------|------------------------------------------------|----------------------------------------|
| Claude/Antigravity | [.agents/claude.md](.agents/claude.md)          | `CLAUDE.md`                            |
| OpenAI Codex       | [.agents/codex.md](.agents/codex.md)            | `AGENTS.md`                            |
| Cursor             | [.agents/cursor.md](.agents/cursor.md)          | `.cursor/rules/rules.mdc`             |
| GitHub Copilot     | [.agents/copilot.md](.agents/copilot.md)        | `.github/copilot-instructions.md`     |
| Windsurf/Codeium   | [.agents/windsurf.md](.agents/windsurf.md)      | `.windsurfrules`                       |
| Cline              | [.agents/cline.md](.agents/cline.md)            | `.clinerules`                          |

## How to Add a New Agent

1. Create `.agents/<tool-name>.md`.
2. Start with: `> Follow all rules in rules.md first.`
3. Add tool-specific instructions below.
4. Update this table.
5. If the tool needs a root-level config file, create a minimal pointer at the root.
