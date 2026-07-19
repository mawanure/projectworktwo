# Stay Home E-Commerce - API Specifications

All endpoints communicate via standard HTTP requests and responses using JSON formatting.

* **Base URL:** `http://localhost:8080`

---

## 🔒 Security Headers
Protected endpoints require passing the JSON Web Token in the Authorization header:
* `Authorization: Bearer <JWT_TOKEN>`

---

## 🔑 Authentication Endpoints

### 1. Register User
* **URL:** `/api/auth/register`
* **Method:** `POST`
* **Access:** Public
* **Request Payload (`RegisterRequest`):**
  ```json
  {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01812345678",
      "password": "securePassword123"
  }
  ```
* **Success Response (HTTP 201 Created):**
  ```json
  {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01812345678",
      "address": null,
      "role": "CUSTOMER",
      "createdAt": "2026-07-19T18:36:01"
  }
  ```

### 2. User Login
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Access:** Public
* **Request Payload (`LoginRequest`):**
  ```json
  {
      "email": "john@example.com",
      "password": "securePassword123"
  }
  ```
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "token": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoi...",
      "user": {
          "id": 2,
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "01812345678",
          "address": null,
          "role": "CUSTOMER",
          "createdAt": "2026-07-19T18:36:01"
      }
  }
  ```

### 3. Fetch User Profile
* **URL:** `/api/auth/profile`
* **Method:** `GET`
* **Access:** Protected (`ROLE_CUSTOMER` / `ROLE_ADMIN`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "01812345678",
      "address": "Chatogram, Bangladesh",
      "role": "CUSTOMER",
      "createdAt": "2026-07-19T18:36:01"
  }
  ```

---

## 🏷️ Public Catalog Endpoints

### 4. Categories
* **URL:** `/api/categories`
* **Method:** `GET`
* **Access:** Public

### 5. Search and Filter Products
* **URL:** `/api/products`
* **Method:** `GET`
* **Access:** Public
* **Query Parameters:**
  * `page` (default 0)
  * `size` (default 10)
  * `category` (optional Long ID)
  * `search` (optional String name match)
* **Success Response (HTTP 200 OK):** Standard Spring Data Page payload containing list of products.

### 6. Fetch Single Product Details
* **URL:** `/api/products/{id}`
* **Method:** `GET`
* **Access:** Public

### 7. Get Featured Products
* **URL:** `/api/products/featured`
* **Method:** `GET`
* **Access:** Public

### 8. Get New Arrivals
* **URL:** `/api/products/new-arrivals`
* **Method:** `GET`
* **Access:** Public

### 9. Get Related Products
* **URL:** `/api/products/{id}/related`
* **Method:** `GET`
* **Access:** Public
* **Description:** Returns 4 products in the same category (excluding current product).

---

## 🛒 Cart & Wishlist Endpoints (Protected: `ROLE_CUSTOMER`)

### 10. Fetch Cart Items
* **URL:** `/api/cart`
* **Method:** `GET`

### 11. Add Item to Cart
* **URL:** `/api/cart`
* **Method:** `POST`
* **Request Payload:**
  ```json
  {
      "productId": 5,
      "size": "XL",
      "quantity": 2
  }
  ```

### 12. Update Cart Item Quantity
* **URL:** `/api/cart/{id}`
* **Method:** `PUT`
* **Request Payload:**
  ```json
  {
      "quantity": 3
  }
  ```

### 13. Remove Item from Cart
* **URL:** `/api/cart/{id}`
* **Method:** `DELETE`

### 14. Fetch Wishlist Items
* **URL:** `/api/wishlist`
* **Method:** `GET`

### 15. Add Item to Wishlist
* **URL:** `/api/wishlist`
* **Method:** `POST`
* **Request Payload:**
  ```json
  {
      "productId": 5
  }
  ```

### 16. Remove Item from Wishlist
* **URL:** `/api/wishlist/{id}`
* **Method:** `DELETE`

---

## 📦 Checkout & Order Endpoints (Protected: `ROLE_CUSTOMER`)

### 17. Place Order (Checkout)
* **URL:** `/api/orders`
* **Method:** `POST`
* **Request Payload:**
  ```json
  {
      "shippingAddress": "Chatogram, Bangladesh",
      "phone": "01812345678",
      "paymentMethod": "COD"
  }
  ```

### 18. Fetch Order History
* **URL:** `/api/orders/my-orders`
* **Method:** `GET`

### 19. Fetch Order Details & Tracking
* **URL:** `/api/orders/{id}`
* **Method:** `GET`

---

## 📬 Contact, Newsletter & Blog Endpoints

### 20. Submit Contact Message
* **URL:** `/api/contact`
* **Method:** `POST`
* **Access:** Public
* **Request Payload:**
  ```json
  {
      "name": "Jane Doe",
      "emailOrPhone": "jane@example.com",
      "message": "Hello, I have a question about delivery."
  }
  ```

### 21. Subscribe to Newsletter
* **URL:** `/api/newsletter/subscribe`
* **Method:** `POST`
* **Access:** Public
* **Request Payload:**
  ```json
  {
      "email": "subscriber@example.com"
  }
  ```

### 22. Get Paginated Blog Posts
* **URL:** `/api/blogs`
* **Method:** `GET`
* **Access:** Public
* **Query Parameters:** `page`, `size`

### 23. Fetch Single Blog Post
* **URL:** `/api/blogs/{id}`
* **Method:** `GET`
* **Access:** Public

---

## 👑 Administrative Endpoints (Protected: `ROLE_ADMIN`)

### 24. Create Product
* **URL:** `/api/admin/products`
* **Method:** `POST`

### 25. Update Product
* **URL:** `/api/admin/products/{id}`
* **Method:** `PUT`

### 26. Delete Product
* **URL:** `/api/admin/products/{id}`
* **Method:** `DELETE`

### 27. Fetch All Orders
* **URL:** `/api/admin/orders`
* **Method:** `GET`

### 28. Update Order Status
* **URL:** `/api/admin/orders/{id}/status`
* **Method:** `PUT`
* **Request Payload:**
  ```json
  {
      "status": "SHIPPED"
  }
  ```

### 29. Fetch All Registered Users
* **URL:** `/api/admin/users`
* **Method:** `GET`

---

## ⚠️ Standard Error Formats

### Validation Failures (HTTP 400 Bad Request)
```json
{
    "timestamp": "2026-07-19T18:35:09",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "validationErrors": {
        "email": "Invalid email format",
        "password": "Password must be at least 6 characters"
    },
    "path": "/api/auth/register"
}
```

### Access Denials (HTTP 401 Unauthorized)
```json
{
    "timestamp": "2026-07-19T18:36:02",
    "status": 401,
    "error": "Unauthorized",
    "message": "Full authentication is required to access this resource",
    "validationErrors": null,
    "path": "/api/auth/profile"
}
```
