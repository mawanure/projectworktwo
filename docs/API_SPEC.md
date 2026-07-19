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
* `categoryId` (optional Long ID)
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
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "items": [
          {
              "id": 1,
              "product": { "id": 5, "name": "Cartoon Print T-Shirt", "price": 12.00, "primaryImageUrl": "images/products/f1.jpg" },
              "addedAt": "2026-07-19T19:00:00"
          }
      ],
      "totalItems": 1
  }
  ```

### 15. Add Item to Wishlist
* **URL:** `/api/wishlist`
* **Method:** `POST`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Request Payload:**
  ```json
  {
      "productId": 5
  }
  ```
* **Success Response (HTTP 200 OK):** Updated `WishlistResponse` with new item.
* **Conflict Response (HTTP 409 Conflict):** Product is already in the wishlist.

### 16. Remove Item from Wishlist
* **URL:** `/api/wishlist/{id}`
* **Method:** `DELETE`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Success Response (HTTP 200 OK):** Updated `WishlistResponse` after removal.

### 17. Check if Product is in Wishlist
* **URL:** `/api/wishlist/check/{productId}`
* **Method:** `GET`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "inWishlist": true
  }
  ```

### 18. Clear Wishlist
* **URL:** `/api/wishlist`
* **Method:** `DELETE`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "message": "Wishlist cleared successfully."
  }
  ```

---

## 📦 Checkout & Order Endpoints (Protected: `ROLE_CUSTOMER`)

### 19. Get Checkout Preview
* **URL:** `/api/orders/checkout-preview`
* **Method:** `GET`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "items": [
          {
              "productId": 5,
              "productName": "Classic Leather Men's Belt",
              "size": "XL",
              "quantity": 2,
              "unitPrice": 12.00,
              "subTotal": 24.00
          }
      ],
      "subtotal": 24.00,
      "deliveryCharge": 60.00,
      "totalAmount": 84.00
  }
  ```

### 20. Place Order
* **URL:** `/api/orders`
* **Method:** `POST`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Request Payload:**
  ```json
  {
      "shippingAddress": "House 12, Road 5, Chatogram, Bangladesh",
      "phone": "01812345678",
      "paymentMethod": "COD"
  }
  ```
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "id": 3,
      "status": "PENDING",
      "subtotal": 24.00,
      "deliveryCharge": 60.00,
      "totalAmount": 84.00,
      "shippingAddress": "House 12, Road 5, Chatogram, Bangladesh",
      "phone": "01812345678",
      "paymentMethod": "COD",
      "paymentStatus": "UNPAID",
      "orderDate": "2026-07-19T19:33:55.268",
      "updatedAt": null,
      "items": [
          {
              "id": 4,
              "product": {
                  "id": 5,
                  "name": "Classic Leather Men's Belt",
                  "price": 12.00,
                  "primaryImageUrl": "images/products/f1.jpg"
              },
              "size": "XL",
              "quantity": 2,
              "price": 12.00,
              "subTotal": 24.00
          }
      ]
  }
  ```

### 21. Fetch Order History
* **URL:** `/api/orders/my-orders`
* **Method:** `GET`
* **Access:** Protected (`ROLE_CUSTOMER`)

### 22. Fetch Order Details & Tracking
* **URL:** `/api/orders/{id}`
* **Method:** `GET`
* **Access:** Protected (`ROLE_CUSTOMER`)

### 23. Cancel Order
* **URL:** `/api/orders/{id}/cancel`
* **Method:** `PATCH`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Description:** Restores stock and marks status as CANCELLED (only PENDING orders allowed).

### 24. Fetch Order Payment Record
* **URL:** `/api/orders/{id}/payment`
* **Method:** `GET`
* **Access:** Protected (`ROLE_CUSTOMER`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "id": 3,
      "orderId": 3,
      "transactionId": null,
      "paymentMethod": "COD",
      "paymentStatus": "UNPAID",
      "amount": 84.00,
      "paidAt": null,
      "createdAt": "2026-07-19T19:33:55.275"
  }
  ```

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

### 29. Fetch All Registered Users / Customer Search
* **URL:** `/api/admin/users`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)
* **Query Parameters:**
  * `search` (optional String - filters by name, email, or phone)
* **Success Response (HTTP 200 OK):**
  ```json
  [
      {
          "id": 2,
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "01812345678",
          "address": "Chatogram, Bangladesh",
          "role": "CUSTOMER",
          "createdAt": "2026-07-19T18:36:01"
      }
  ]
  ```

### 30. Admin: Get Payment Record by Order ID
* **URL:** `/api/admin/orders/{id}/payment`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)

### 31. Admin: Fetch All Contact Message Support Tickets
* **URL:** `/api/admin/contact-messages`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)
* **Success Response (HTTP 200 OK):**
  ```json
  [
      {
          "id": 1,
          "name": "Jane Doe",
          "emailOrPhone": "jane@example.com",
          "message": "Hello, I have a question about delivery.",
          "createdAt": "2026-07-19T19:00:00"
      }
  ]
  ```

### 32. Admin: Fetch All Newsletter Subscribers
* **URL:** `/api/admin/newsletter-subscribers`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)
* **Success Response (HTTP 200 OK):**
  ```json
  [
      {
          "id": 1,
          "email": "subscriber@example.com",
          "subscribedAt": "2026-07-19T19:05:00"
      }
  ]
  ```

### 33. Admin: Fetch Dashboard Statistics
* **URL:** `/api/admin/dashboard/stats`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)
* **Success Response (HTTP 200 OK):**
  ```json
  {
      "totalUsers": 20,
      "totalCustomers": 18,
      "totalAdmins": 2,
      "totalCategories": 5,
      "totalProducts": 50,
      "totalOrders": 12,
      "totalRevenue": 2400.00,
      "pendingOrders": 3,
      "processingOrders": 2,
      "deliveredOrders": 5,
      "cancelledOrders": 2,
      "lowStockProducts": 4,
      "outOfStockProducts": 1
  }
  ```

### 34. Admin: Block User
* **URL:** `/api/admin/users/{id}/block`
* **Method:** `PATCH`
* **Access:** Protected (`ROLE_ADMIN`)

### 35. Admin: Unblock User
* **URL:** `/api/admin/users/{id}/unblock`
* **Method:** `PATCH`
* **Access:** Protected (`ROLE_ADMIN`)

### 36. Admin: Change User Role
* **URL:** `/api/admin/users/{id}/role`
* **Method:** `PUT`
* **Access:** Protected (`ROLE_ADMIN`)
* **Request Payload:**
  ```json
  {
      "role": "ADMIN"
  }
  ```

### 37. Admin: Update Product Stock
* **URL:** `/api/admin/products/{id}/stock`
* **Method:** `PATCH`
* **Access:** Protected (`ROLE_ADMIN`)
* **Request Payload:**
  ```json
  {
      "stock": 100
  }
  ```

### 38. Admin: Activate Product
* **URL:** `/api/admin/products/{id}/activate`
* **Method:** `PATCH`
* **Access:** Protected (`ROLE_ADMIN`)

### 39. Admin: Deactivate Product
* **URL:** `/api/admin/products/{id}/deactivate`
* **Method:** `PATCH`
* **Access:** Protected (`ROLE_ADMIN`)

### 40. Admin: Search/Filter Orders
* **URL:** `/api/admin/orders`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)
* **Query Parameters:**
  * `status` (optional OrderStatus - PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
  * `customerId` (optional Long)
  * `search` (optional String - shipping address or phone)

### 41. Admin: View All Payments / Filter
* **URL:** `/api/admin/payments`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)
* **Query Parameters:**
  * `status` (optional PaymentStatus - UNPAID, PAID, FAILED, REFUNDED)
  * `method` (optional PaymentMethod - COD, CREDIT_CARD, DEBIT_CARD, MOBILE_BANKING, ONLINE_TRANSFER)

### 42. Admin: View Payment Details
* **URL:** `/api/admin/payments/{id}`
* **Method:** `GET`
* **Access:** Protected (`ROLE_ADMIN`)

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
