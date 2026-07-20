# Authentication Flow

## Overview
CozyCart uses stateless JWT authentication to secure protected endpoints and manage user sessions.

## Login and Registration
### Registration
* Endpoint: `POST /api/auth/register`
* Public endpoint used to create a new customer account.
* Request payload includes `name`, `email`, `phone`, and `password`.
* The backend stores the password hashed with BCrypt.

### Login
* Endpoint: `POST /api/auth/login`
* Public endpoint for authenticating users.
* On success, the backend returns a JWT token and user profile.
* The frontend stores the token in `localStorage` under `token`.

## Token Usage
* The frontend Axios instance in `frontend/src/api/apiClient.js` attaches the JWT token automatically to every request:
  * `Authorization: Bearer <token>`
* If the backend responds with `401 Unauthorized`, the frontend clears localStorage and redirects the user to `/login`.

## Profile Fetching
* Endpoint: `GET /api/auth/profile`
* Protected endpoint that returns the authenticated user profile.
* The frontend verifies the current session on app startup via this endpoint.

## Route Authorization
### Client-side Guards
* `frontend/src/components/ProtectedRoute.jsx`
  * Restricts access to authenticated customer pages such as checkout, orders, and profile.
* `frontend/src/components/AdminRoute.jsx`
  * Restricts access to admin dashboard pages.

### Server-side Guards
* `backend/src/main/java/com/stayhome/security/SecurityConfig.java`
  * Permits public access to catalog and public content endpoints.
  * Requires `ADMIN` role for `/api/admin/**` endpoints.
  * Requires authentication for all other endpoints.

## Admin Role
* Admin users are granted `ROLE_ADMIN` on the backend.
* The frontend determines admin status from the retrieved `user.role` value.
* Admin-only pages include product management, orders, payments, users, messages, newsletter, and blog management.

## Password Management
* Password encryption is handled by Spring Security’s `BCryptPasswordEncoder`.
* Passwords are never stored or sent in plaintext.

## Session Expiration
* JWT expiration is configured through `stayhome.jwt.expiration-ms` (default 24 hours).
* Expired tokens require login again.
