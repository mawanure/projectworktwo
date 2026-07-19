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

### Phase 3: Category Module
- `[x]` Create Category DTO schemas (`CategoryRequest`, `CategoryResponse`)
- `[x]` Implement CRUD repository methods in `CategoryRepository`
- `[x]` Implement Category service layer with exception handling
- `[x]` Implement public Category retrieval endpoints (`GET /api/categories`, `GET /api/categories/{id}`)
- `[x]` Implement admin CRUD Category endpoints (POST, PUT, DELETE under `/api/admin/categories`)
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 4: Product Module
- `[x]` Create Product DTO schemas (`ProductRequest`, `ProductResponse`, `ProductDetailResponse`)
- `[x]` Implement paginated retrieval queries in `ProductRepository`
- `[x]` Implement Product service handling logic and mapping rules
- `[x]` Expose public search and filter REST APIs (`GET /api/products`, `GET /api/products/{id}`)
- `[x]` Expose public endpoints for Featured Products and New Arrivals
- `[x]` Build Verification
- `[x]` API Testing
- `[x]` Documentation Update

### Phase 5: Cart & Wishlist
- `[ ]` Implement database tables or custom entities for Cart and Wishlist mapping
- `[ ]` Create Cart & Wishlist DTOs (`CartItemRequest`, `CartResponse`, `WishlistResponse`)
- `[ ]` Implement Cart / Wishlist service operations (Add, remove, update quantities, calculate subtotals)
- `[ ]` Expose customer cart REST endpoints (`GET /api/cart`, `POST /api/cart`, `PUT /api/cart/{id}`, `DELETE /api/cart/{id}`)
- `[ ]` Expose customer wishlist REST endpoints (`GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/{id}`)
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 6: Checkout & Orders
- `[ ]` Create Order DTOs (`CheckoutRequest`, `OrderResponse`, `OrderDetailResponse`)
- `[ ]` Implement stock check, size checking, and quantity validation rules in OrderService
- `[ ]` Implement checkout transaction mappings using `@Transactional` boundaries
- `[ ]` Expose order checkout endpoint (`POST /api/orders`)
- `[ ]` Expose order history retrieve endpoint (`GET /api/orders/my-orders`)
- `[ ]` Expose order tracking endpoint (`GET /api/orders/{id}`)
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 7: Contact, Newsletter & Blog
- `[ ]` Implement repository and endpoints for support tickets (`POST /api/contact`)
- `[ ]` Implement subscription endpoints with constraint checks (`POST /api/newsletter/subscribe`)
- `[ ]` Expose paginated blog APIs (`GET /api/blogs`, `GET /api/blogs/{id}`)
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 8: Admin Dashboard
- `[ ]` Expose Admin CRUD endpoints for products (`POST`, `PUT`, `DELETE` under `/api/admin/products`)
- `[ ]` Expose Admin order query and status updates (`GET /api/admin/orders`, `PUT /api/admin/orders/{id}/status`)
- `[ ]` Expose Admin customer search query (`GET /api/admin/users`)
- `[ ]` Expose Admin ticket view (`GET /api/admin/contact-messages`)
- `[ ]` Expose Admin subscription view (`GET /api/admin/newsletter-subscribers`)
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 9: Frontend Integration
- `[ ]` Set up JS dynamic fetch binding for categories and catalogs on `index.html` and `shop.html`
- `[ ]` Set up JS binding for product gallery swap and specifications on `sproduct.html`
- `[ ]` Connect HTML forms (Contact, Newsletter, Blog pagination) to backend endpoints
- `[ ]` Integrate client auth token persistence and user state switches on headers
- `[ ]` Connect Cart list checkouts directly to checkout endpoints
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update

### Phase 10: Testing & Deployment
- `[ ]` Perform extensive functional API verification tests
- `[ ]` Add database indexes to speed up name search and category filter queries
- `[ ]` Package production configurations and deploy application executable
- `[ ]` Build Verification
- `[ ]` API Testing
- `[ ]` Documentation Update
