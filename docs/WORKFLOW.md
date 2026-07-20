# Development Workflow

## Overview
This guide outlines the recommended workflow for development, testing, and feature contributions.

## Branching and Task Work
1. Create a new branch for each feature or bug fix:
```bash
git checkout -b feature/<short-description>
```
2. Keep changes focused on a single concern.
3. Update `docs/DEVELOPMENT_RULES.md` and `docs/CHANGELOG.md` when changing architecture or implementation patterns.

## Backend Development
* Use the existing package structure in `backend/src/main/java/com/stayhome/`.
* Add new endpoints in `controller` classes.
* Keep business logic inside `service` classes.
* Use DTOs for all public request and response bodies.
* Add repository interfaces when new entities are introduced.

## Frontend Development
* Route and page declarations live in `frontend/src/App.jsx`.
* Use `react-hook-form` and `zod` for validation.
* Use `React Query` for API data fetching and caching.
* Shared state lives in `frontend/src/contexts`.
* Guard private routes with `ProtectedRoute` and admin pages with `AdminRoute`.

## Testing
* Backend tests are located under `backend/src/test/java`.
* Existing integration tests and unit tests should be run with Maven:
```bash
cd backend
./mvnw test
```
* Use browser developer tools or Vite error logs for frontend troubleshooting.

## Deployment Process
* Build backend with Docker for production.
* Build frontend with `npm run build`.
* Serve the static frontend files from a CDN or hosting provider.
* Connect the frontend to the backend with `VITE_API_BASE_URL`.

## Release Notes
* Document significant new capabilities in `docs/CHANGELOG.md`.
* Keep README and docs updated with architecture or configuration changes.
