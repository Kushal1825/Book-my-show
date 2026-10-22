# BookMyShow Backend - Project Architecture Plan

## 1. Overview

This document outlines the architecture, directory structure, and implementation plan for the BookMyShow backend service.

The goal is to build a modular, high-performance, and clean backend foundation using Fastify and TypeScript.

---

## 2. Tech Stack

- **Runtime:** Node.js
- **Framework:** Fastify
- **Language:** TypeScript (Latest)
- **Linter:** Oxlint
- **Databases & Cache:** MongoDB, Redis (connection only for now)

---

## 3. Directory Structure

```text
book-my-show/
├── .agents/                          # Agent guidelines and guardrails
│   ├── rules.md
│   └── guardrails.md
│
├── src/
│   ├── server.ts                     # Application entry point
│   ├── app.ts                        # Fastify instance creation and configuration
│   │
│   ├── config/                       # Configuration and environment variables
│   │   └── env.ts                    # Env schema validation and constants
│   │
│   ├── bootstrap/                    # Startup lifecycle and plugins
│   │   ├── index.ts                  # Central orchestrator for startup sequence
│   │   ├── logger.ts                 # Pino logger configuration
│   │   ├── helmet.ts                 # Security headers plugin
│   │   ├── cors.ts                   # CORS configuration
│   │   ├── mongodb.ts                # MongoDB connection lifecycle
│   │   ├── redis.ts                  # Redis client connection and lifecycle
│   │   ├── telemetry.ts              # Health check endpoint and metrics
│   │   ├── error-handler.ts          # Centralized error handler
│   │   └── routes.ts                 # Central route registration
│   │
│   ├── shared/                       # Shared cross-cutting components
│   │   ├── errors/
│   │   │   └── app-error.ts          # Standard application error classes
│   │   ├── constants/
│   │   │   └── status-codes.ts       # HTTP status codes and messages
│   │   ├── types/
│   │   │   └── common.types.ts       # Global response and pagination types
│   │   └── utils/
│   │       ├── date.util.ts          # Date and timing helper functions
│   │       ├── response.util.ts      # Standard JSON response envelope
│   │       └── id-generator.util.ts  # Identifier generators
│   │
│   └── modules/                      # Business feature modules
│       ├── cities/
│       │   ├── cities.types.ts       # City module TypeScript types
│       │   ├── cities.schema.ts      # Fastify validation schemas
│       │   ├── cities.routes.ts      # Route declarations
│       │   ├── cities.controller.ts  # Request and response handling
│       │   └── cities.service.ts     # Business logic
│       │
│       ├── cinemas/
│       │   ├── cinemas.types.ts      # Cinema module TypeScript types
│       │   ├── cinemas.schema.ts     # Fastify validation schemas
│       │   ├── cinemas.routes.ts     # Route declarations
│       │   ├── cinemas.controller.ts # Request and response handling
│       │   └── cinemas.service.ts    # Business logic
│       │
│       └── shows/
│           ├── shows.types.ts        # Show module TypeScript types
│           ├── shows.schema.ts       # Fastify validation schemas
│           ├── shows.routes.ts       # Route declarations
│           ├── shows.controller.ts   # Request and response handling
│           └── shows.service.ts      # Business logic
│
├─── seeds/
|       └ data/
│        ├── cities.seed.json          # Initial cities seed data
│        ├── cinemas.seed.json         # Initial cinemas seed data
│        └── shows.seed.json           # Initial shows seed data
│
├── scripts/                          # Utility and maintenance scripts
│   └── seed.ts                       # Database seeding runner
│
├── logs/                             # Local log storage (git ignored)
├── health/
│   └── no-found.test.ts                       # Database seeding runner
│   └── health.test.ts                       # Database seeding runner
│
├── docker/
├── dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
├── .oxlintrc.json                    # Oxlint configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Project manifest and scripts
├── plan.md                           # This architecture plan
└── README.md                         # Project documentation
```

---

## 4. Initial API Scope

| Module | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| **Cities** | `GET` | `/api/v1/cities` | Fetch all available cities |
| **Cinemas** | `GET` | `/api/v1/cinemas` | Fetch cinemas by city ID |
| **Shows** | `GET` | `/api/v1/shows` | Fetch shows by cinema ID |

---

## 5. Scope Notes

- **Docker:** Dockerfile and docker-compose files are deferred to a later phase but file is available in the project.
- **Redis:** Limited to connection and lifecycle management in `src/bootstrap/redis.ts` for now.
- **Elasticsearch:** Deferred until the search module is introduced.

---

## 6. Implementation Phases

1. **Phase 1: Project Setup & Tooling**
   - Create `package.json` with required dependencies.
   - Configure `tsconfig.json` and `.oxlintrc.json`.

2. **Phase 2: Core Bootstrap & Server**
   - Implement `src/server.ts` and `src/app.ts`.
   - Implement `src/config/env.ts`.
   - Implement all startup files in `src/bootstrap/`.

3. **Phase 3: Shared Layer**
   - Create error classes, response wrappers, and common types in `src/shared/`.

4. **Phase 4: Feature Modules**
   - Implement `cities`, `cinemas`, and `shows` modules with types, schemas, controllers, and services.

5. **Phase 5: Seeds & Scripts**
   - Add seed JSON files in `database/seeds/`.
   - Add runner in `scripts/seed.ts`.
