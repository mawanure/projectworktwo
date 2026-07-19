# Stay Home E-Commerce - Tasks Tracker

This document tracks implementation items across the project lifecycle.

---

## 📋 Task List

### Phase 1: Project Setup (Completed)
- `[x]` Initialize Spring Boot backend directory structure
- `[x]` Add dependencies in pom.xml (Web, JPA, MySQL, Validation, Lombok)
- `[x]` Configure database connection in application.properties
- `[x]` Create Entity classes
- `[x]` Create Repository interfaces
- `[x]` Create main StayHomeApplication starter class
- `[x]` Verify MySQL database table generation
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 2: Authentication (Completed)
- `[x]` Add Security & JWT dependencies in pom.xml
- `[x]` Modify Role enum (USER -> CUSTOMER) and User entity
- `[x]` Implement DTO classes (RegisterRequest, LoginRequest, AuthResponse, UserResponse)
- `[x]` Implement Security Configurations (SecurityConfig, CustomUserDetailsService, DelegatedAuthenticationEntryPoint)
- `[x]` Implement JWT token utilities (JwtUtils, JwtAuthFilter)
- `[x]` Implement Exception Handlers (GlobalExceptionHandler, ErrorDetails)
- `[x]` Implement AuthController with register, login, and profile endpoints
- `[x]` Verify endpoints with manual testing calls
- `[x]` Create and save Postman collection
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 3: Category Module (Completed)
- `[x]` Create Category DTO schemas (`CategoryRequest`, `CategoryResponse`)
- `[x]` Implement CRUD repository methods in `CategoryRepository`
- `[x]` Implement Category service layer with exception handling
- `[x]` Implement public Category retrieval endpoints (`GET /api/categories`, `GET /api/categories/{id}`)
- `[x]` Implement admin CRUD Category endpoints (POST, PUT, DELETE under `/api/admin/categories`)
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 4: Product Module (Completed)
- `[x]` Create Product DTO schemas (`ProductRequest`, `ProductResponse`, `ProductDetailResponse`)
- `[x]` Implement paginated retrieval queries in `ProductRepository`
- `[x]` Implement Product service handling logic and mapping rules
- `[x]` Expose public search and filter REST APIs (`GET /api/products`, `GET /api/products/{id}`)
- `[x]` Expose public endpoints for Featured Products and New Arrivals
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 5: Cart (Completed)
- `[x]` Implement `cart_items` database table entity mapping
- `[x]` Create Cart DTOs (`CartItemRequest`, `CartItemResponse`, `CartResponse`)
- `[x]` Implement Cart service operations (Add, remove, update quantities, calculate subtotals)
- `[x]` Expose customer cart REST endpoints (`GET /api/cart`, `POST /api/cart`, `PUT /api/cart/{id}`, `DELETE /api/cart/{id}`)
- `[x]` Implement stock validation to prevent over-adding cart quantities
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 6: Wishlist (Completed)
- `[x]` Implement `wishlist_items` database table entity mapping
- `[x]` Create Wishlist DTOs (`WishlistItemRequest`, `WishlistItemResponse`, `WishlistResponse`)
- `[x]` Implement Wishlist service operations (Add with duplicate check, remove, retrieve, clear, check)
- `[x]` Expose customer wishlist REST endpoints (`GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/{id}`, `DELETE /api/wishlist`, `GET /api/wishlist/check/{productId}`)
- `[x]` Enforce 409 Conflict for duplicate product additions
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 7: Checkout & Orders (Completed)
- `[x]` Create Order DTOs (`CheckoutRequest`, `CheckoutPreviewResponse`, `OrderResponse`, `OrderItemResponse`)
- `[x]` Implement stock check, size checking, and quantity validation rules in OrderService
- `[x]` Implement checkout transaction mappings using `@Transactional` boundaries
- `[x]` Expose order checkout endpoint (`POST /api/orders`)
- `[x]` Expose order history retrieve endpoint (`GET /api/orders/my-orders`)
- `[x]` Expose order tracking endpoint (`GET /api/orders/{id}`)
- `[x]` Expose order cancellation endpoint (`PATCH /api/orders/{id}/cancel`) with stock restoration
- `[x]` Expose checkout preview endpoint (`GET /api/orders/checkout-preview`) with delivery charge calculations
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 8: Payment Gateway (Completed)
- `[x]` Integrate transaction management and configurations
- `[x]` Implement payment entity representing payments table
- `[x]` Implement payment creation linked to placed orders
- `[x]` Update order status and payment status on successful payment confirmation
- `[x]` Handle order cancellation and payment refunds (`REFUNDED`)
- `[x]` Expose admin order update endpoint (`PUT /api/admin/orders/{id}/status`) updating payment status
- `[x]` Expose customer/admin payment details checking endpoints
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 9: Admin Dashboard (Completed)
- `[x]` Implement Admin Dashboard API for statistics (users, products, categories, orders, low stock, out of stock, revenue counts)
- `[x]` Expose Admin User Management CRUD (block, unblock, change roles, filter, search, view by ID)
- `[x]` Expose Admin Product Management extension (stock update, activate, deactivate)
- `[x]` Expose Admin Order Management extension (search, filter by customer, filter by status)
- `[x]` Expose Admin Payment Management CRUD (list, details, filter by status, filter by method)
- `[x]` Expose Admin CRUD endpoints for products (`POST`, `PUT`, `DELETE`)
- `[x]` Expose Admin order status updates and support views (tickets, subscribers)
- `[x]` Documentation Update

### Phase 10: Frontend Integration
- `[ ]` Set up JS dynamic fetch binding for categories and catalogs on `index.html` and `shop.html`
- `[ ]` Set up JS binding for product gallery swap and specifications on `sproduct.html`
- `[ ]` Connect HTML forms (Contact, Newsletter, Blog pagination) to backend endpoints
- `[ ]` Integrate client auth token persistence and user state switches on headers
- `[ ]` Connect Cart list checkouts directly to checkout endpoints
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 11: Testing
- `[ ]` Perform extensive functional API verification tests across all modules
- `[ ]` Write unit tests for critical service layers
- `[ ]` Write integration tests for checkout, payment, and authentication flows
- `[ ]` Add database indexes to speed up name search and category filter queries
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 12: Deployment
- `[ ]` Package production configurations and environment variables
- `[ ]` Compile and package production executable (`mvn package`)
- `[ ]` Deploy application to production server
- `[ ]` Verify health endpoints and connectivity
- `[ ]` Build Verification
- `[ ]` Documentation Update
