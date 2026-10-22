# Blocked Docker Commands

> Hook Type: MIXED (some blocked, some ask permission)

## Fully Blocked

| Command | Reason |
|---------|--------|
| `docker exec` (db containers) | Direct DB access not allowed |
| `docker push` | Pushes images externally |
| `docker rm -f` | Force removes containers |
| `docker rmi -f` | Force removes images |
| `docker volume rm` | Removes data volumes |
| `docker system prune` | Deletes unused resources |
| `docker-compose down -v` | Removes volumes with data |

## Ask Permission First

| Command | When Allowed |
|---------|-------------|
| `docker build` | After user approval |
| `docker run` | After user approval |
| `docker-compose up` | After user approval |
| `docker-compose down` | After user approval (no -v flag) |
| `docker exec` (non-db) | After user approval |

## Read Only (Allowed)

| Command | Condition |
|---------|-----------|
| `docker ps` | Allowed, read only |
| `docker images` | Allowed, read only |
| `docker logs` | Allowed, read only |
| `docker inspect` | Allowed, read only |
| `docker-compose ps` | Allowed, read only |

## DB Container Detection

If a container name or image contains any of these, treat it as a DB container:
- `postgres`, `mysql`, `mariadb`, `mongo`, `redis`
- `sqlite`, `mssql`, `oracle`, `cassandra`, `elastic`

Never run `docker exec` on these containers.

## On Violation

- Stop immediately.
- Report to user.
- Do not retry.
