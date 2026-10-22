# Blocked Secrets and Env Access

> Hook Type: ALWAYS BLOCKED
> No agent or subagent may read, create, or log secrets.

## Reading Blocked

| Pattern | Description |
|---------|-------------|
| `.env` | Environment file |
| `.env.*` | Any env variant (.env.local, .env.prod, etc.) |
| `*.pem` | SSL certificates |
| `*.key` | Private keys |
| `*.p12` | Certificate bundles |
| `credentials.json` | Service credentials |
| `secrets.json` | Secrets file |
| `secrets.yml` / `secrets.yaml` | Secrets file |
| `service-account.json` | GCP service account |
| `*.keystore` | Java keystore |
| `id_rsa` / `id_ed25519` | SSH keys |
| `token.json` | Auth tokens |
| `auth.json` | Auth config |

## Commands Blocked

| Command | What it does |
|---------|-------------|
| `cat .env` | Reads env file |
| `type .env` | Reads env file (Windows) |
| `Get-Content .env` | Reads env file (PowerShell) |
| `echo $SECRET_VAR` | Prints secret value |
| `printenv` | Prints all env vars |
| `env` (dump all) | Dumps env vars |
| `set` (dump all) | Dumps env vars (Windows) |

## Creation Blocked

- Never create `.env` or any secrets file without user permission.
- If the project needs env vars, ask the user to create the file.
- You may create `.env.example` with placeholder values (no real secrets).

## Logging Blocked

- Never print, log, or display secret values.
- Never include secrets in commit messages or comments.
- Never copy secrets into any other file.

## If You Need Env Info

- Ask the user: "What value should I use for X?"
- The user will provide or set it themselves.

## On Violation

- Stop immediately.
- Report to user.
- Do not retry.
