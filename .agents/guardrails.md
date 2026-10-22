# Guardrails - Full Lockdown Rules

> Every AI agent and subagent MUST read and follow this file.
> These rules apply in ALL modes, including auto mode.
> No rule can be bypassed, skipped, or overridden.

## Golden Rule

**Nothing happens without user's explicit "OK" or "Go".**

Plan first. Show the plan. Wait for approval. Then execute.

---

## Critical Level (🔴 Blocked Always)

### 1. No Execution Without Approval

- Do not run any command until the user says "OK" or "Go".
- In auto mode, still pause and ask before executing.
- Show the plan first. Wait for approval.

### 2. No Git Write Commands

- Never run: `git add`, `git commit`, `git push`, `git pull`, `git reset`, `git rebase`, `git merge`, `git stash`, `git checkout -b`, `git branch -d`, `git tag`, `git remote`.
- The user will handle all git write operations.
- If a subagent tries to run git write commands, block it immediately.
- **Read-only git is allowed**: `git status`, `git log`, `git diff`, `git branch` (list), `git show`.

### 3. No Database Mutations

- Never run: `DELETE`, `DROP`, `TRUNCATE`, `ALTER TABLE`.
- Do not touch the database directly without user instruction.
- Even `SELECT` queries need user permission.
- Docker exec to access DB is also blocked.

### 4. No File Deletion

- Never delete any file or folder.
- Never run: `rm`, `del`, `rmdir`, `Remove-Item`, `shred`.
- Renaming a file requires user permission first.

### 5. No Reading Secrets

- Never read `.env`, `.env.*`, or any secrets/credentials file.
- Never read files containing API keys, tokens, or passwords.
- Never print or log secret values.
- If you need env var info, ask the user.

### 6. No Process Kill or Restart

- Never run: `kill`, `pkill`, `taskkill`, `Stop-Process`, `Restart-Service`.
- Never terminate or restart any running process.
- This is a global rule, no exceptions.

### 7. No Outside Communication (Default Locked)

- Network is **locked by default**. All network calls are blocked.
- User can unlock with: `allow_net 5min`, `allow_net 10min`, `allow_net 30min`, or `allow_net this task`.
- User can re-lock with: `lock_net`.
- When unlocked, agent must state the URL and reason before calling.
- When time expires, network auto-locks.
- Even when unlocked, outbound data ops are always blocked: `npm publish`, `docker push`, `ssh`, `scp`, `ftp`.
- See [hooks/block-network.md](hooks/block-network.md) for full details.

### 8. No Docker DB Access

- Never run: `docker exec` to access any database container.
- Never run: `docker run` with database images without permission.
- Docker commands that touch data volumes are blocked.

---

## High Level (🟠 Ask First)

### 9. No Creation Without Approval

- Do not create any file or folder until user approves the plan.
- Show what you want to create. Wait for "Go".

### 10. Stay Inside Project Folder

- All file operations must stay inside the project root.
- Never read or write outside `E:\Projects\System-Design\Book-my-show`.
- If you need something from outside, ask the user.

### 11. No Package Install Without Approval

- Never run: `npm install`, `yarn add`, `gem install`, `pip install`, `bundle install`, `composer require`.
- Show the package name and reason. Wait for approval.

### 12. No Force Flags

- Never use: `--force`, `-f`, `--hard`, `--skip-checks`.
- These flags bypass safety checks and are not allowed.

### 13. No Secret/Env File Creation

- Never create `.env`, `.env.*`, or any credentials file without permission.
- If the project needs env vars, ask the user to create the file.

---

## Medium Level (🟡 Inform First)

### 14. No Overwrite Without Warning

- Before overwriting any existing file, inform the user.
- Show what will change. Wait for confirmation.

### 15. Plan First, Execute Later

- For any task, show the plan first.
- List all files that will be created or modified.
- Wait for user to say "Go".

---

## Enforcement

- All agents (Claude, Cursor, Copilot, Codex, Windsurf, Cline) must follow these rules.
- All subagents spawned by any agent must inherit these rules.
- If any rule is violated, stop immediately and report to the user.
- Git hooks provide an additional layer of protection at the system level.

## Blocked Commands Quick Reference

```
ALWAYS BLOCKED:
  git add, git commit, git push, git pull, git reset, git rebase
  rm, del, rmdir, Remove-Item, shred
  kill, pkill, taskkill, Stop-Process, Restart-Service
  DELETE, DROP, TRUNCATE, ALTER TABLE
  docker exec (db access), docker push
  npm publish, ssh, scp, ftp
  cat .env, type .env, Get-Content .env

ASK PERMISSION FIRST:
  curl, wget, Invoke-WebRequest
  npm install, yarn add, gem install, pip install
  docker run, docker exec (non-db)
  Any file creation or overwrite
```
