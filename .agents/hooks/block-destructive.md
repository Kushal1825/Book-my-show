# Blocked Destructive Commands

> Hook Type: ALWAYS BLOCKED
> No agent or subagent may run these commands.

## File Deletion (Blocked)

| Command | OS |
|---------|-----|
| `rm` | Linux/Mac |
| `rm -rf` | Linux/Mac |
| `rmdir` | All |
| `del` | Windows |
| `Remove-Item` | PowerShell |
| `shred` | Linux |
| `unlink` | All |

## Database Mutations (Blocked)

| Command | Type |
|---------|------|
| `DELETE FROM` | SQL |
| `DROP TABLE` | SQL |
| `DROP DATABASE` | SQL |
| `TRUNCATE` | SQL |
| `ALTER TABLE` (destructive) | SQL |
| `db.collection.drop()` | MongoDB |
| `db.dropDatabase()` | MongoDB |
| `FLUSHALL` | Redis |
| `FLUSHDB` | Redis |

## Process Operations (Blocked - Global Rule)

| Command | OS |
|---------|-----|
| `kill` | Linux/Mac |
| `kill -9` | Linux/Mac |
| `pkill` | Linux/Mac |
| `killall` | Linux/Mac |
| `taskkill` | Windows |
| `Stop-Process` | PowerShell |
| `Restart-Service` | PowerShell |
| `Start-Process` (system level) | PowerShell |

## Force Flags (Blocked)

| Flag | Reason |
|------|--------|
| `--force` | Bypasses safety |
| `-f` (force context) | Bypasses safety |
| `--hard` | Destructive reset |
| `--skip-checks` | Bypasses validation |
| `--no-verify` (by agent) | Bypasses hooks |

## On Violation

- Stop immediately.
- Report to user.
- Do not retry or rephrase the command.
