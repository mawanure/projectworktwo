# Security Overview

## Application Security Model
CozyCart applies a layered security model across backend and frontend components.

## Authentication
* Stateless JWT tokens are issued on successful login.
* Backend uses `JwtUtils` to generate and validate tokens.
* Tokens carry the authenticated user email as subject and the user role as a claim.
* Token expiration is configurable using `stayhome.jwt.expiration-ms`.

## Authorization
* Spring Security configuration permits public access to catalog and blog content.
* `/api/admin/**` routes require `ROLE_ADMIN`.
* All other routes require authenticated access.
* Client-side guards in `ProtectedRoute.jsx` and `AdminRoute.jsx` prevent unauthorized navigation.

## Password Security
* Plaintext passwords are never stored.
* Passwords are hashed using `BCryptPasswordEncoder`.

## Cross-Origin Access
* CORS is configured in `SecurityConfig.java`.
* Allowed origins are loaded from `app.cors.allowed-origins` or default to localhost origins.
* Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.

## File Upload Validation
* Product image uploads are validated in `ImageUploadController`.
* Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/gif`.
* File size limit is 5 MB.
* Files are stored under the configured `app.upload.dir`.

## Data Exposure Controls
* Controllers return DTO responses instead of raw entities.
* Sensitive fields such as password hashes are excluded from API responses.

## Error Handling
* Global exception handling uses structured error responses.
* Invalid credentials and authorization failures are converted to appropriate HTTP statuses.

## Production Hardening Recommendations
* Run the backend behind TLS/HTTPS.
* Use strong secret values for `STAYHOME_JWT_SECRET`.
* Store production credentials in a secure secrets store.
* Restrict the frontend origin list to trusted domains.
* Disable Spring SQL logging in production.
