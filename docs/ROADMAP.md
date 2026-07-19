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
    Phase 5: Cart & Wishlist (Next Step)   :active, p5, after p4, 3d
    Phase 6: Checkout & Orders              :p6, after p5, 4d
    section Phase 7 & 8
    Phase 7: Contact, Newsletter & Blog     :p7, after p6, 4d
    Phase 8: Admin Dashboard                :p8, after p7, 5d
    section Phase 9 & 10
    Phase 9: Frontend Integration           :p9, after p8, 6d
    Phase 10: Testing & Deployment          :p10, after p9, 3d
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

### Phase 5: Cart & Wishlist
* Set up database tables for saving customer Cart and Wishlist items if persisted, or validate state items from client requests.
* Create DTO structures.
* Expose REST APIs to retrieve, add, update quantities, and clear cart/wishlist items.

### Phase 6: Checkout & Orders
* Implement checkout endpoints validating stock quantity, sizes, prices, and shipping details.
* Add transaction boundaries (`@Transactional`) to rollback state if order item mapping fails.
* Expose customer order history retrieve endpoints and order tracking status checks.

### Phase 7: Contact, Newsletter & Blog
* Set up contact message repository and endpoints to save support tickets.
* Implement newsletter registration endpoint checks.
* Implement paginated blog post fetch APIs.

### Phase 8: Admin Dashboard
* Secure admin endpoints using role verification (`ROLE_ADMIN`).
* Implement full CRUD admin endpoints for products, orders, users, blog posts, contact inquiries, and newsletter sub-lists.

### Phase 9: Frontend Integration
* Update HTML pages to dynamically fetch database records using JS Fetch API (Search, catalogs, single product details).
* Implement client-side Auth state management (JWT token persistence in `localStorage`/cookies).
* Connect cart checkouts and order form queries directly to API endpoints.

### Phase 10: Testing & Deployment
* Perform functional integration testing (authentication, inventory deduction checkouts).
* Set up production profiles, compile finalized executable packages, and deploy.
