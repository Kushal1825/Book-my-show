# Blocked Git Commands

> Hook Type: ALWAYS BLOCKED
> No agent or subagent may run these commands.

## Blocked Commands

| Command | Reason |
|---------|--------|
| `git add` | User handles staging |
| `git commit` | User handles commits |
| `git push` | User handles pushes |
| `git pull` | User handles pulls |
| `git reset` | Destructive, user only |
| `git rebase` | Destructive, user only |
| `git merge` | User handles merges |
| `git stash` | User handles stash |
| `git checkout -b` | User creates branches |
| `git branch -d` | User deletes branches |
| `git branch -D` | User deletes branches |
| `git tag` | User handles tags |
| `git remote` | User handles remotes |
| `git cherry-pick` | User only |
| `git revert` | User only |

## Allowed (Read Only)

| Command | Condition |
|---------|-----------|
| `git status` | Allowed, read only |
| `git log` | Allowed, read only |
| `git diff` | Allowed, read only |
| `git branch` (list) | Allowed, read only |

## On Violation

- Stop immediately.
- Report to user.
- Do not retry or rephrase the command.
