# Stay Home E-Commerce - Changelog

All notable changes to this project will be documented in this file.

---

## [v0.3.0] - 2026-07-19
### Added
* Category Module implementation:
  * Public endpoints to fetch all categories and single categories.
  * Admin endpoints protected by ROLE_ADMIN to create, update, and delete categories.
  * Seeding logic in DatabaseSeeder to initialize categories and admin/customer accounts.
  * Custom exceptions (`ResourceNotFoundException`, `ResourceConflictException`).

---

## [v0.4.0] - 2026-07-19
### Added
* Product Module (CRUD, Discovery & Details) implementation:
  * Public endpoints to fetch all products paginated, search by keyword, filter by category, and sort by price.
  * Public endpoints to fetch single product details including rating, sizes, and multiple images.
  * Public endpoint for Related Products (`GET /api/products/{id}/related`) returning up to 4 similar items.
  * Availability status calculation ("In Stock" / "Out of Stock") based on stock count mapped inside DTOs.
  * Public endpoints for Featured Products and New Arrivals (sorted by creation timestamp).
  * Admin endpoints protected by ROLE_ADMIN to create, update, and delete products.
  * Database Seeder updates to populate default product listings with mapped images.
  * DTO layer isolation using ProductRequest, ProductResponse, and ProductSummaryResponse.

---

## [v0.5.0] - 2026-07-19
### Added
* Shopping Cart Module implementation:
  * Database table `cart_items` mapped via JPA to persist customer selections.
  * Cart DTO schemas (`CartItemRequest`, `CartItemResponse`, `CartResponse`).
  * Endpoints to manage the cart:
    * `GET /api/cart` (retrieves full cart status and aggregates subtotal prices).
    * `POST /api/cart` (adds or increments cart items, validating stock availability).
    * `PUT /api/cart/{id}` (updates item quantities, checking stock limits).
    * `DELETE /api/cart/{id}` (removes item from cart).
  * Auto database validation of stock limits preventing over-adding cart quantities.

---

## [v0.6.0] - Future Scope
### Added
* Wishlist module implementation.
* Checkout & Order processing module integration.

---

## [v0.2.0] - 2026-07-19
### Added
* Custom Spring Security 6 integration enabling JWT stateless authentication filters.
* Token utility helper class (`JwtUtils`) utilizing JJWT `0.11.5`.
* Custom validation interceptors (`DelegatedAuthenticationEntryPoint`).
* Data Transfer Objects (DTO) layer to protect entities from direct API exposure.
* Endpoints for customer authentication:
  * `POST /api/auth/register` (hashing password via BCrypt, default `CUSTOMER` role).
  * `POST /api/auth/login` (exposes valid token on success).
  * `GET /api/auth/profile` (returns authenticated client profile details).
* Global exception handling mapping constraint validations and credential faults.
* Automated PowerShell API test script.
* Exported Postman collection schema mapping.
* Upgraded Lombok compiler version to `1.18.46` for JDK 25 compliance.

### Changed
* Modified `Role` enum to have `CUSTOMER` instead of `USER`.

---

## [v0.1.0] - 2026-07-19
### Added
* Initial Maven layout setup under the `backend` folder.
* JPA entities representing database architecture:
  * `User`, `Category`, `Product`, `ProductImage`, `Order`, `OrderItem`, `BlogPost`, `ContactMessage`, `NewsletterSubscriber`.
* DB repositories extending `JpaRepository` for CRUD access.
* Database connection configured for local MySQL setups.
* Tested bootstrap running and schema table drop/re-creation.
* Original static HTML pages preserved in project root.
