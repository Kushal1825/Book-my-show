# Blocked Network Commands

> Hook Type: BLOCKED BY DEFAULT, UNLOCKABLE
> Network is locked unless user explicitly unlocks it.

## Default State: LOCKED 🔒

All network calls are blocked until user says otherwise.

## How to Unlock

User says one of these:

| Command | Effect |
|---------|--------|
| `allow_net 5min` | Network unlocked for 5 minutes |
| `allow_net 10min` | Network unlocked for 10 minutes |
| `allow_net 30min` | Network unlocked for 30 minutes |
| `allow_net this task` | Network unlocked until current task is done |
| `lock_net` | Immediately lock network again |

## Rules When Unlocked

- Agent must state: "Network is unlocked, X minutes remaining."
- Agent must tell user what URL it will call and why, before calling.
- When time expires, network auto-locks. No more calls.
- Agent must state: "Network lock restored." when time is up.

## Always Blocked (Even When Unlocked)

| Command | Reason |
|---------|--------|
| `npm publish` | Publishes to public registry |
| `docker push` | Pushes images externally |
| `ssh` | Remote server access |
| `scp` | Remote file copy |
| `ftp` / `sftp` | File transfer |
| `rsync` (remote) | Remote sync |

These are outbound data operations. Never allowed.

## Allowed When Unlocked

| Command | Condition |
|---------|-----------|
| `curl` (GET) | Tell user the URL first |
| `wget` | Tell user the URL first |
| `Invoke-WebRequest` | Tell user the URL first |
| `npm install` | Tell user the package first |
| `yarn add` | Tell user the package first |
| `pip install` | Tell user the package first |
| `gem install` | Tell user the package first |
| `fetch` (in code) | Tell user the URL first |

## On Violation

- Stop immediately.
- Report to user.
- Do not retry.
