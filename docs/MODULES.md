# Code Modules

## Backend Modules
The backend Java application is organized into clean functional modules under `com.stayhome`.

### `config`
* General application configuration classes.
* Includes MVC and upload resource handling.

### `controller`
* REST controllers that expose HTTP endpoints.
* Controller classes in this module include:
  * `AuthController`
  * `ProductController`
  * `CategoryController`
  * `CartController`
  * `WishlistController`
  * `OrderController`
  * `PublicContentController`
  * `AdminController`
  * `ImageUploadController`

### `dto`
* Data Transfer Objects used by controllers.
* DTOs contain request payload models and response shapes.
* Examples: `RegisterRequest`, `AuthResponse`, `ProductResponse`, `OrderResponse`, `ContactMessageRequest`.

### `entity`
* JPA entity classes that map to MySQL tables.
* Examples: `User`, `Product`, `Category`, `Order`, `CartItem`, `WishlistItem`, `Payment`, `BlogPost`, `ContactMessage`, `NewsletterSubscriber`.

### `repository`
* Spring Data JPA repository interfaces.
* Examples: `UserRepository`, `ProductRepository`, `OrderRepository`, `BlogPostRepository`, `ContactMessageRepository`, `NewsletterSubscriberRepository`.

### `service`
* Business logic and transactional workflows.
* Services orchestrate data access, validation, and response mapping.
* Examples include `AuthService`, `ProductService`, `CartService`, `OrderService`, `AdminService`, `WishlistService`.

### `security`
* JWT authentication and authorization.
* Includes `SecurityConfig`, `JwtAuthFilter`, `JwtUtils`, and `CustomUserDetailsService`.

### `exception`
* Global exception handling and custom error responses.
* Ensures clean HTTP status codes and structured error payloads.

## Frontend Modules
The frontend is structured around a modern React application with reusable state and UI modules.

### `src/api`
* Axios API client configuration.
* Sets the base URL and request/response interceptors.

### `src/contexts`
* Global React context providers.
* Includes `AuthContext`, `CartContext`, and `WishlistContext`.

### `src/components`
* Reusable UI building blocks and route guards.
* Notable components: `Navbar`, `Footer`, `ProtectedRoute`, `AdminRoute`.

### `src/layouts`
* Page layout wrapper components.
* Applies shared navigation, sidebars, and content shells.

### `src/pages`
* Feature pages for both customer and admin experiences.
* Customer pages: `Home`, `Shop`, `ProductDetails`, `Cart`, `Checkout`, `Orders`, `OrderDetails`, `OrderSuccess`, `Profile`, `Login`, `Register`, `Blog`, `BlogDetail`, `Contact`, `About`, `Wishlist`.
* Admin pages: `Dashboard`, `Products`, `Categories`, `Orders`, `Payments`, `Users`, `Messages`, `Newsletter`, `Blogs`, `Settings`.

### `src/utils`
* Shared utility functions.
* Includes helpers for formatting prices and resolving image URLs.

## Build Configuration
* Backend uses Maven with `spring-boot-starter-parent` and Lombok.
* Frontend uses Vite with React, Tailwind CSS, React Router DOM, React Query, Axios, react-hook-form, and Zod for schema validation.
