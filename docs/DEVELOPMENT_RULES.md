# Stay Home E-Commerce - Development Rules

This document outlines core principles, directories, naming conventions, and coding patterns to follow when extending the Stay Home application.

---

## 🛠️ Code Conventions & Patterns

### 1. Separation of Concerns (N-Tier Architecture)
* **Entities (`com.stayhome.entity`):** Map directly to MySQL tables. Use Lombok for clean declarations, but avoid exposing these in controllers.
* **DTOs (`com.stayhome.dto`):** Used to isolate transfer structures from database schemas. Validation annotations (`@NotBlank`, `@Size`, `@Email`) should reside here.
* **Repositories (`com.stayhome.repository`):** Standard Spring Data JPA interfaces. Avoid raw SQL queries unless complex analytical joins are required.
* **Services (`com.stayhome.service`):** Put all transactional business rules here. Controllers must never query repositories directly.
* **Controllers (`com.stayhome.controller`):** Expose endpoints, catch raw requests, and bind validations via `@Valid`.

### 2. Transaction Boundaries
* Methods executing multi-record inserts or updates (e.g. creating an Order and updating Product stock levels) must carry `@Transactional` to enforce atomic rollback on error.

### 3. Naming Conventions
* **Java Classes:** PascalCase (e.g., `CustomUserDetailsService`, `AuthController`).
* **Variables / Methods:** camelCase (e.g., `generateToken`, `userRepository`).
* **Database Columns:** snake_case (e.g., `created_at`, `category_id`).
* **REST Endpoints:** kebab-case and lowercase (e.g., `/api/auth/register`, `/api/products/new-arrivals`).

---

## 🛑 Coding Rules & Guardrails

To maintain project integrity and consistency, Antigravity and any developer must adhere to the following rules:

* **Never change package names:** Preserve package organization structure.
* **Never rename existing APIs:** Do not change routes of already implemented and validated endpoints.
* **Never remove previous functionality:** Build on top of previous changes without breaking existing workflows.
* **Never modify database schema without updating DATABASE.md:** Keep database documentation synced with entities.
* **Always update CHANGELOG.md:** Document all additions, modifications, or version increments.
* **Always update TASKS.md:** Keep task checkboxes synced with actual work.
* **Always compile before marking a task complete:** Verify code building using `mvn compile` or similar command checks.
* **Never generate placeholder code:** All methods, models, properties, and exceptions must be production-ready and fully written.
* **Never leave TODO comments:** Write complete code; do not leave unresolved flags or placeholders.
* **Write production-ready code only:** Code must have robust exception handling, logging, and validations.
* **If a module depends on another module, complete the dependency first:** Adhere to roadmap dependencies (e.g., build Category before Product).

---

## 🔒 Security Constraints
* **Passwords:** Must be hashed using Spring Security's `BCryptPasswordEncoder`. Plaintext checks are forbidden.
* **Statelessness:** No sessions allowed. JWT must be attached to the Bearer Authorization header for every protected endpoint request.
* **Exceptions:** Access denials must be caught by `DelegatedAuthenticationEntryPoint` and returned as a JSON structure, avoiding HTML error redirects.

---

## ⚙️ Error Handling Protocol
* Global handler `GlobalExceptionHandler` intercepts validation failures and throws cleanly mapped HTTP statuses with `ErrorDetails` payloads.
* Return custom client-facing errors (e.g., `EmailAlreadyExistsException` returning 400 Bad Request) instead of exposing database-level stacktraces.