# Stay Home E-Commerce - Implementation Roadmap

This document outlines the step-by-step phased schedule to fully transition the Stay Home static frontend into a dynamic full-stack e-commerce application.

---

## 🗺️ Migration Phases

```mermaid
gantt
    title Migration Schedule
    dateFormat  YYYY-MM-DD
    section Phase 1 & 2
    Phase 1: Project Setup (Completed)      :done, p1, 2026-07-10, 2d
    Phase 2: Authentication (Completed)     :done, p2, after p1, 3d
    section Phase 3 & 4
    Phase 3: Category Module (Completed)   :done, p3, after p2, 2d
    Phase 4: Product Module (Completed)    :done, p4, after p3, 4d
    section Phase 5 & 6
    Phase 5: Cart (Completed)              :done, p5, after p4, 3d
    Phase 6: Wishlist (Completed)          :done, p6, after p5, 2d
    Phase 7: Checkout & Orders (Completed) :done, p7, after p6, 4d
    Phase 8: Payment Gateway (Completed)   :done, p8, after p7, 4d
    Phase 9: Admin Dashboard (Completed)   :done, p9, after p8, 5d
    section Phase 10 & 11
    Phase 10: Frontend Upgrade & Integration (Completed) :done, p10, after p9, 6d
    section Phase 11 & 12
    Phase 11: Testing                      :p11, after p10, 3d
    Phase 12: Deployment                   :p12, after p11, 2d
```

---

## 🔍 Detailed Phase Descriptions

### Phase 1: Project Setup (Completed)
* Initialize Maven directory structure under `backend/`.
* Set up core Spring Boot dependencies (JPA, Web, MySQL, Validation, Lombok).
* Configure database connection in `application.properties`.
* Write core JPA Entity models.
* Establish initial JpaRepositories for data access.

### Phase 2: Authentication (Completed)
* Enable Spring Security and configure stateless session policy.
* Integrate JJWT token utilities (generating and validating custom JWT tokens).
* Establish secure endpoints: registration, login, and protected profile checking.
* Add global validation and custom error exception handlers.

### Phase 3: Category Module (Completed)
* Create Category Entity mapping, custom repository queries, and service functions.
* Implement Category DTOs (`CategoryRequest`, `CategoryResponse`).
* Expose public Category REST APIs (retrieving list of categories, fetching category by ID).
* Build CRUD Category APIs for Admin roles.

### Phase 4: Product Module (Completed)
* Implement Product entity relationships, custom pagination, and search query repositories.
* Create Product DTO schemas.
* Expose public REST endpoints (Search catalog, fetch product details, filter by category, retrieve featured products and new arrivals).

### Phase 5: Cart (Completed)
* Set up `cart_items` database table mapped via JPA to persist customer cart selections.
* Create Cart DTO structures (`CartItemRequest`, `CartItemResponse`, `CartResponse`).
* Expose REST APIs to retrieve, add, update quantities, and clear cart items.
* Stock validation enforcement preventing over-adding items beyond available stock.

### Phase 6: Wishlist (Completed)
* Set up `wishlist_items` database table mapped via JPA with a unique constraint on `(user_id, product_id)` preventing duplicates.
* Create Wishlist DTO structures (`WishlistItemRequest`, `WishlistItemResponse`, `WishlistResponse`).
* Expose REST APIs: retrieve wishlist, add item (with duplicate conflict check), remove item, clear all, and check if product exists in wishlist.

### Phase 7: Checkout & Orders (Completed)
* Implement checkout preview endpoint with delivery charge calculation and free delivery threshold.
* Implement order placement validating cart item availability and stock levels.
* Add transaction boundaries (`@Transactional`) to enforce atomic stock updates, payment records initialization, and cart clearing.
* Expose order details query, history endpoints, and cancel order REST APIs restoring product stock.

### Phase 8: Payment Gateway (Completed)
* Implement payment tracking entity mapped to the `payments` table.
* Synchronize order status transitions (e.g. `CONFIRMED`) to update payment state to `PAID` with transaction timestamps.
* Handle cancellation refunds setting payments to `REFUNDED`.
* Expose admin endpoint for updating order statuses and verifying payment status records.

### Phase 9: Admin Dashboard (Completed)
* Secure administrative endpoints using role verification (`ROLE_ADMIN`).
* Implement Dashboard Stats API supplying user counts, products catalog quantities, low stock/out of stock tracking, and total revenue summation.
* Implement User Management allowing blocking, unblocking, querying by ID, filtering by roles, and changing user credentials/roles.
* Implement Product Management extensions providing stock updates, activation, and deactivation.
* Implement Order and Payment Management permitting custom status/method filters, payment listings, and payment detail lookups.

### Phase 10: Frontend Upgrade & Integration (Completed)
* Complete CSS design system rewrite with Inter font, CSS tokens, micro-animations, glassmorphism, responsive breakpoints.
* Created 5 new pages: `checkout.html`, `orders.html`, `wishlist.html`, `login.html`, `register.html`.
* Upgraded all existing pages: `index.html`, `shop.html`, `sproduct.html`, `cart.html`, `contact.html`, `about.html`, `blog.html`.
* Full `script.js` API integration layer: Auth (JWT), cart badge, wishlist toggle, toast system, modal login, product loading, cart CRUD, order history, contact form, newsletter, and auto-routing page detector.

### Phase 11: Testing
* Perform functional integration testing (authentication, inventory deduction, checkout, payments).
* Write unit and integration tests for critical service layers.
* Conduct API regression testing across all modules.

### Phase 12: Deployment
* Set up production profiles and configure environment variables.
* Compile finalized executable packages.
* Deploy application to production server and verify health endpoints.
