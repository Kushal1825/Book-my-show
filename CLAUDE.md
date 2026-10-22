# CLAUDE.md - Claude / Antigravity Entry Point

> This file points Claude and Antigravity to the shared config.

## Read These Files First

1. [.agents/guardrails.md](.agents/guardrails.md) - **Lockdown rules (MUST READ)**
2. [.agents/rules.md](.agents/rules.md) - Shared project rules
3. [.agents/claude.md](.agents/claude.md) - Claude-specific guide
4. [.agents/hooks/](.agents/hooks/) - All blocked command lists

## Quick Guardrails

- No execution without user's "OK" or "Go".
- No git commands. No file deletion. No process kill.
- No reading .env or secrets. No outside network calls without permission.
- No database mutations. No docker exec on DB containers.
- Plan first, show the plan, wait for approval, then execute.
- These rules apply in ALL modes, including auto mode.
