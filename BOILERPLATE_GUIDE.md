# Boilerplate Usage Guide

This repository is intended to be used as a reusable NestJS enterprise boilerplate.

## What this boilerplate already gives you

- Modular + Clean Architecture folder structure
- Base RBAC and notification scaffolding
- Global logging and error handling hooks
- Docker and Docker Compose files
- Environment template file

## Docker status

The Docker setup is a good starting point.

What is good:

- Multi-stage build in [Dockerfile](Dockerfile)
- Non-root runtime user
- `dumb-init` for proper signal handling
- Separate Postgres and Redis services in [docker-compose.yml](docker-compose.yml)
- Health checks for database and Redis

What still needs improvement before I would call it fully production-ready:

- Replace placeholder runtime pieces with real Prisma, auth, and migration commands
- Add a dedicated production compose profile if you want dev and prod to be separated cleanly
- Add version pinning policy for Node, PostgreSQL, Redis, and NestJS dependencies
- Add startup checks for env vars and DB connectivity

## Version management policy

Use this every time you reuse the boilerplate.

### 1. Keep versions pinned

- Pin Node in Docker using a specific major version, and update deliberately.
- Pin database and Redis image tags.
- Keep `package-lock.json` committed.
- Update dependencies through controlled upgrade steps, not random changes.

### 2. Upgrade workflow

When a library or runtime version changes:

1. Update `package.json`.
2. Regenerate lockfile with `npm install` or `npm update`.
3. Run lint, tests, and build.
4. Rebuild Docker images.
5. Verify database migrations and seed scripts.
6. Commit the version change together with any required code updates.

### 3. Safe upgrade order

Recommended order:

1. Application dependencies
2. Docker base images
3. Database schema/migrations
4. Runtime config and env validation
5. CI/CD pipeline updates

### 4. Things to verify after upgrades

- Application starts cleanly
- Build passes in Docker
- Migration and seed flow still works
- Health checks still pass
- RBAC and authentication behavior still match expectations

## Reuse checklist

Before starting a new project from this boilerplate:

- Update `package.json` project name and description
- Update environment variables in `.env.example`
- Confirm Docker images and Node version are the ones you want to support
- Add or remove modules based on project scope
- Replace starter sample entities and controllers with business-specific ones
- Add real Prisma schema and migrations

## Recommendation

If you want this repo to be a long-term boilerplate, keep a short `CHANGELOG.md` and update this file whenever you change framework versions, Docker image tags, or the structure of the core modules.
