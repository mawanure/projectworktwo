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

## [v0.6.0] - 2026-07-19
### Added
* Wishlist Module implementation:
  * Database table `wishlist_items` mapped via JPA with a unique constraint on `(user_id, product_id)` preventing duplicate entries.
  * Wishlist DTO schemas (`WishlistItemRequest`, `WishlistItemResponse`, `WishlistResponse`).
  * Endpoints to manage the wishlist:
    * `GET /api/wishlist` (retrieves full wishlist with total item count).
    * `POST /api/wishlist` (adds product to wishlist; returns `409 Conflict` if already added).
    * `DELETE /api/wishlist/{id}` (removes a specific wishlist item).
    * `DELETE /api/wishlist` (clears all items from wishlist).
    * `GET /api/wishlist/check/{productId}` (checks if product exists in wishlist, returns `{"inWishlist": true/false}`).

---

## [v0.7.0] - 2026-07-19
### Added
* Checkout & Orders Module implementation:
  * Database table schema mappings for `orders` and `order_items`.
  * DTO classes (`CheckoutRequest`, `CheckoutPreviewResponse`, `OrderResponse`, `OrderItemResponse`).
  * Endpoints to manage checkouts and orders:
    * `GET /api/orders/checkout-preview` (returns total subtotal, delivery charges, items preview).
    * `POST /api/orders` (places order, checks stock levels, deducts inventory, clears cart, initiates payment).
    * `GET /api/orders/my-orders` (retrieves customer order history).
    * `GET /api/orders/{id}` (retrieves specific order tracking details).
    * `PATCH /api/orders/{id}/cancel` (cancels PENDING orders and restores product stock).
  * Auto-calculation of delivery charges (free shipping threshold over 1000).
  * Robust transaction boundaries `@Transactional` ensuring database state integrity.

---

## [v0.8.0] - 2026-07-19
### Added
* Payment Module implementation:
  * Database table `payments` with unique constraint per order.
  * Payment entity tracking amount, transaction ID, status (UNPAID, PAID, FAILED, REFUNDED), and paid timestamp.
  * Integration hooks:
    * Auto payment confirmation mapping for COD orders on admin status updates.
    * Auto payment refund mapping (`REFUNDED`) on customer order cancellation.
  * Endpoints:
    * `GET /api/orders/{id}/payment` (customer check of payment info).
    * `GET /api/admin/orders/{id}/payment` (admin check of payment record).
    * `PUT /api/admin/orders/{id}/status` (admin order status update, triggering payment status changes).

---

## [v0.9.0] - 2026-07-19
### Added
* Admin Dashboard Module implementation:
  * Exposed Admin products CRUD endpoints (`POST /api/admin/products`, `PUT /api/admin/products/{id}`, `DELETE /api/admin/products/{id}`).
  * Exposed Admin orders status transitions (`PUT /api/admin/orders/{id}/status`).
  * Admin Dashboard Statistics endpoint (`GET /api/admin/dashboard/stats`) mapping total users, customers, admins, categories, products, orders, cancelled/pending/processing/delivered counts, low stock/out of stock tracking, and total revenue.
  * Admin User Management APIs (`GET /api/admin/users`, `GET /api/admin/users/{id}`, `PATCH /api/admin/users/{id}/block`, `PATCH /api/admin/users/{id}/unblock`, `PUT /api/admin/users/{id}/role`).
  * Admin Product Management extensions (`PATCH /api/admin/products/{id}/stock`, `PATCH /api/admin/products/{id}/activate`, `PATCH /api/admin/products/{id}/deactivate`).
  * Admin Order Management extensions supporting query parameter searches and filters (`GET /api/admin/orders`, `GET /api/admin/orders/{id}`).
  * Admin Payment Management APIs (`GET /api/admin/payments`, `GET /api/admin/payments/{id}`) supporting custom filters by PaymentStatus and PaymentMethod.
  * Created DTO models: `ContactMessageResponse`, `NewsletterSubscriberResponse`, `DashboardStatsResponse`.
  * Database changes: Added `blocked` column to `User` entity and `isActive` column to `Product` entity.

---

## [v0.10.0] - Future Scope
### Added
* Frontend Integration:
  * JS dynamic bindings for catalog, search, product detail, auth state, and cart checkout.

---

## [v0.11.0] - Future Scope
### Added
* Testing:
  * Functional API verification, unit tests, integration tests, and performance regression tests.

---

## [v0.12.0] - Future Scope
### Added
* Deployment:
  * Production configuration, packaging, and deployment with environment variable setup.

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
