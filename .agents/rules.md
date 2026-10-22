# Shared Project Rules

> Single source of truth. All AI tools must follow these rules.
> 
> **IMPORTANT: Read [guardrails.md](guardrails.md) before doing anything.**
> **Read all files in [hooks/](hooks/) folder for blocked commands.**

## Project

**BookMyShow** - Online movie/event ticket booking platform.

## Guardrails

See [guardrails.md](guardrails.md) for the full lockdown rules.

Quick summary:
- Nothing executes without user's "OK" or "Go".
- No git commands. User handles all git.
- No database mutations. No file deletion.
- No reading secrets or .env files.
- No killing/restarting processes.
- No outside communication without permission.
- Stay inside the project folder.
- Plan first, execute after approval.

## Language

- All code, comments, commits, and docs in **English**.
- No Hinglish or Hindi in the codebase.

## Code Style

- Clean, readable, well-commented code.
- Follow naming conventions of the chosen language/framework.
- Small, focused functions.
- Composition over inheritance.
- No magic numbers. Use named constants.
- Inline comments only for non-obvious logic.

## Git Conventions

- Small, focused commits. One logical change per commit.
- Conventional commit messages:

| Prefix      | Use for            |
|-------------|--------------------|
| `feat:`     | New feature        |
| `fix:`      | Bug fix            |
| `docs:`     | Documentation      |
| `refactor:` | Code restructuring |
| `test:`     | Tests              |
| `chore:`    | Maintenance        |

## Architecture

- Clean separation of concerns.
- Design for scalability.
- RESTful API conventions.
- Business logic stays out of controllers.
- Environment variables for config. Never hardcode secrets.
- Group files by feature, not by type (when applicable).

## Testing

- Write tests for all business logic.
- Meaningful coverage, not 100%.
- Keep test files close to source files.

## Error Handling

- Handle errors gracefully.
- Proper HTTP status codes.
- Log errors with context.

## Security

- Never commit secrets, API keys, or passwords.
- Validate all user input.
- Parameterized queries only. No raw SQL concatenation.
- Sanitize output to prevent XSS.

## Tech Stack

> To be decided.

## Key Decisions

| Decision   | Choice | Reason |
|------------|--------|--------|
| Tech stack | TBD    | -      |
| Database   | TBD    | -      |
| Auth       | TBD    | -      |
| Hosting    | TBD    | -      |
