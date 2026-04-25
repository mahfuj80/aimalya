---
name: Nestjs
description: Describe what this custom agent does and when to use it.
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

<!-- Tip: Use /create-agent in chat to generate content with agent assistance -->

# Instructions for NestJS Modular Clean Architecture Coding Agent
# NestJS Clean Code Generation Guide

This file is the canonical instruction set for generating and reviewing code in this repository.

## 1. Objectives

- Keep architecture clean and scalable.
- Generate maintainable, testable, production-ready code.
- Enforce strict layer boundaries.
- Prefer simple, explicit code over clever code.

## 2. Target Architecture

Use Modular + Clean Architecture with strict separation:

```bash
src/
  core/                 # Pure shared business logic (no NestJS, no Prisma)
  config/               # App + env + infra configuration
  database/             # Global database setup (Prisma module/service)
  common/               # Shared NestJS-level concerns
  modules/              # Feature modules (auth, user, task, ...)
  integrations/         # External services (mail, sms, payment, storage)
  jobs/                 # Background jobs/processors/schedulers
  docs/                 # Swagger/OpenAPI setup
  app.module.ts
  main.ts
```

Feature module shape:

```bash
modules/<feature>/
  domain/               # Entities, value objects, repository contracts
  application/          # Use cases, dto, mappers, interfaces
  infrastructure/       # Prisma repos, adapters, external implementations
  presentation/         # Controllers, request validation, transport
  <feature>.module.ts
```

## 3. Dependency Direction (Must Follow)

Allowed flow:

```text
presentation -> application -> domain
infrastructure -> domain
```

Rules:

- Domain depends on nothing outside domain/core.
- Application depends on domain contracts, never Prisma directly.
- Infrastructure implements domain/application contracts.
- Presentation orchestrates request/response only.
- No cross-module direct coupling; use explicit contracts/events.

## 4. Layer Responsibilities

Domain layer:

- Business rules and invariants.
- Entities and value objects are framework-agnostic.
- Repository interfaces live here.

Application layer:

- Use-case orchestration.
- Input/output DTOs.
- Transaction and policy coordination.

Infrastructure layer:

- Prisma repositories and external adapters.
- Mapping persistence models to domain entities.
- No business rules beyond technical mapping/IO concerns.

Presentation layer:

- Controllers, pipes, guards, interceptors.
- Request validation and response shaping.
- No business logic.

## 5. Prisma and Persistence Rules

- Use one global `PrismaService` instance.
- Inject Prisma only in infrastructure repositories/services.
- Never return raw Prisma models from use cases/controllers.
- Always map database records to domain objects.
- Keep Prisma schema concerns isolated from domain language.

## 6. Code Generation Standards

General style:

- Use strict TypeScript types; avoid `any`.
- Small functions with single responsibility.
- Prefer explicit names (`createUserUseCase`) over vague names (`handler`).
- Prefer composition over inheritance.
- Keep controller methods thin.

Error handling:

- Throw meaningful domain/application exceptions.
- Translate to HTTP errors at presentation boundary.
- Do not leak internal stack details in API responses.

Validation:

- Validate external input with DTO + `class-validator`.
- Validate domain invariants in domain/value objects.

Async behavior:

- Use `async/await` consistently.
- Never ignore promise rejections.
- Keep side effects explicit.

## 7. API and DTO Conventions

- One DTO per request/response intent.
- Avoid exposing internal entity shape directly as API contract.
- Keep DTO names explicit:
  - `CreateUserRequestDto`
  - `CreateUserResponseDto`
  - `UpdateUserRequestDto`

## 8. Mapper Conventions

- Add dedicated mappers between layers.
- Typical mapper pairs:
  - `PrismaUserMapper` (database <-> domain)
  - `UserDtoMapper` (domain/application <-> API)
- Mapper methods should be pure and deterministic.

## 9. Testing Standards

- Domain tests: pure unit tests for business rules.
- Application tests: use-case tests with mocked repository contracts.
- Infrastructure tests: repository integration tests (Prisma).
- Presentation tests: controller/e2e behavior tests.

Minimum expectation for generated features:

- One unit test for core business behavior.
- One test for failure path (validation/not found/conflict/etc.).

## 10. Forbidden Patterns

- Business logic in controllers.
- Prisma usage in controllers/use-cases.
- Directly returning Prisma entities in API responses.
- God services with mixed responsibilities.
- Cross-module imports bypassing contracts.
- Silent `catch` blocks.

## 11. Generation Checklist (Use Every Time)

Before finalizing generated code, verify:

1. Correct folder and layer placement.
2. No dependency rule violation.
3. DTO validation is present for external inputs.
4. Mapping exists across boundaries.
5. Error handling is explicit and meaningful.
6. No dead code or unused exports.
7. Tests cover happy path and at least one failure path.

## 12. Reference Blueprint (User Module Example)

```text
presentation/controller
  -> application/use-case
    -> domain/repository interface
      -> infrastructure/prisma repository implementation
```

## 13. Recommended Extensions for Production

- Auth with access/refresh JWT and RBAC.
- Centralized logging and tracing.
- Global exception filter.
- Redis caching where it reduces repeated IO.
- Queue processing (BullMQ) for async workloads.
- OpenAPI docs with clear request/response examples.

## 14. Final Principle

Generate code that is boring in the best way: readable, predictable, testable, and easy to evolve.

## 15. Enterprise Directory Example (Multi-Role RBAC + Notifications + Logger)

Use this as a practical baseline for enterprise projects:

```bash
src/
  core/
    enums/
      role.enum.ts                      # ADMIN, MANAGER, SUPPORT, USER
    exceptions/
    types/
    utils/
  config/
    app.config.ts
    database.config.ts
    env.validation.ts
  database/
    prisma/
      prisma.module.ts
      prisma.service.ts
  common/
    decorators/
      roles.decorator.ts
    guards/
      roles.guard.ts
    interceptors/
      logging.interceptor.ts
    filters/
      http-exception.filter.ts
  modules/
    auth/
      domain/
      application/
      infrastructure/
      presentation/
        controllers/
          auth.controller.ts
      auth.module.ts
    role/
      domain/
        entities/
          role.entity.ts
      application/
      infrastructure/
      presentation/
      role.module.ts
    notification/
      domain/
        entities/
          notification.entity.ts
      application/
        use-cases/
          send-notification.use-case.ts
      infrastructure/
        services/
      presentation/
        controllers/
          notification.controller.ts
      notification.module.ts
    user/
      domain/
      application/
      infrastructure/
      presentation/
      user.module.ts
  integrations/
    mail/
    sms/
    storage/
  jobs/
    processors/
    schedulers/
  docs/
  app.module.ts
  main.ts
```

## 16. Module Examples

### 16.1 Multi-Role Strategy (Single and Multi-Role Access)

- Define roles in `core/enums/role.enum.ts` with 3-4 roles (for example: `ADMIN`, `MANAGER`, `SUPPORT`, `USER`).
- Allow one user to hold multiple roles (`UserRole[]`).
- Use `@Roles(UserRole.ADMIN)` for single-role endpoints.
- Use `@Roles(UserRole.ADMIN, UserRole.MANAGER)` or similar for multi-role endpoints.
- Enforce with `RolesGuard` that reads metadata from `Roles` decorator.

### 16.2 Notification Module Example

- Domain entity: `NotificationEntity` (id, userId, title, message, channel, isRead).
- Application use-case: `SendNotificationUseCase`.
- Presentation controller: `NotificationController` that only delegates to use-case.
- Infrastructure services: adapters for `EMAIL`, `SMS`, and `IN_APP` delivery.

### 16.3 Logger + Error Handling Example

- Request/response logging in `common/interceptors/logging.interceptor.ts`.
- Centralized HTTP error shaping in `common/filters/http-exception.filter.ts`.
- Avoid logging sensitive payload data (passwords, tokens, secrets).

## 17. Generation Rule for Access Control

Whenever generating secured endpoints:

1. Add role metadata with `Roles` decorator.
2. Protect route/controller with `RolesGuard`.
3. Keep authorization checks at presentation boundary or dedicated policies.
4. Keep business decisions in use-cases/domain, not in controllers.

## 18. Generation Rule for Notifications

Whenever generating notification features:

1. Keep channel-agnostic intent in application use-cases.
2. Keep channel-specific logic in infrastructure adapters.
3. Keep delivery status persistence in repository layer.
4. Expose only DTO-based responses from controllers.
