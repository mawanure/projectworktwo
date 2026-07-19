# Stay Home E-Commerce - Project Specification

## 1. Project Overview
**Stay Home** is a premium, modern, and responsive e-commerce web application. Initially designed as a static multi-page frontend, the project is being migrated into a full-stack application driven by a Java Spring Boot backend and a MySQL database.

The application aims to provide a seamless shopping experience for clothing and accessories, with interactive catalog filters, dynamic cart management, and secure user authentication.

---

## 2. Target Audience & Business Concept
* **Niche:** Fashion and Apparel (primarily T-Shirts and Summer collections).
* **Business Model:** B2C E-commerce.
* **Core Offerings:** Custom printed apparel, seasonal collections, and interactive product choices (sizing, quantity).
* **Payment Model:** Cash on Delivery (COD) as default, extendable to online gateways (cards, mobile wallets).

---

## 3. Technology Stack
### Frontend
* **Core Structure:** Semantic HTML5.
* **Styling:** Vanilla CSS3 (custom responsive grid and styles).
* **Interactions:** Vanilla JavaScript (ES6+).
* **Icons:** FontAwesome v6.

### Backend
* **Framework:** Spring Boot 3.x.
* **Language:** Java 17 or higher (tested on Java 25).
* **Security:** Spring Security 6 (Stateless JWT Authentication).
* **Data Access:** Spring Data JPA / Hibernate.
* **Validation:** Jakarta Validation API.

### Database
* **Database Engine:** MySQL 8.x.
* **Pool Provider:** HikariCP.

---

## 4. Functional Requirements

### Customer (User) Capabilities
1. **Security & Profile:** Register, login, change details, and fetch client profiles via secure credentials.
2. **Catalog Browsing:** Retrieve lists of products, search titles, check categories, filter new arrivals, and display featured items.
3. **Cart Operations:** Load current selections, add items with specific size parameters, change unit count, and remove items.
4. **Wishlist Management:** Save products to wishlist for future purchases.
5. **Checkout & Order Tracking:** Place an order providing shipping information and track status (Pending, Shipped, etc.).
6. **Interaction:** Submit inquiry forms and register newsletters.

### Administration Capabilities
1. **Catalog CRUD:** Manage (add, update, delete) items and categories.
2. **Orders Control:** List checkouts and update statuses (e.g. PROCESSING, SHIPPED, DELIVERED).
3. **User Management:** Access profiles of registered customers.
4. **Inquiry Tracking:** Review contact tickets and list newsletter subscribers.

---

## 5. Non-Functional Requirements

1. **Security:** BCrypt passwords, JWT token authentication, secure input sanitization.
2. **Performance:** Database indexing to maintain fast page load times and product queries.
3. **Scalability:** Stateless API design allowing horizontal scaling of the Spring Boot instance.
4. **Maintainability:** Standard MVC/N-Tier layered project organization.
5. **Responsiveness:** Mobile-friendly layouts across all pages.

---

## 6. Deployment Architecture

```
   [ Customer Browser ]
            │
            ▼  (HTTPs, Fetch API)
     [ Spring Boot App ]  <─── (Stateless JWT Security)
            │
            ▼  (Hikari Connection Pool)
      [ MySQL Database ]
```

* **Backend Execution:** Runs inside an embedded Apache Tomcat container listening on port 8080.
* **Database Engine:** Runs as a standalone local/remote MySQL service.
* **Statelessness:** The backend does not maintain memory-backed HTTP sessions, enabling clean server scaling.

---

## 7. Future Scope
* **Online Payment Integration:** Adding SSLCommerz, Stripe, or PayPal gateway options.
* **Analytics Engine:** Visual graphics on the Admin Panel detailing monthly revenue, popular items, and customer activity.
* **OAuth2 Authentication:** Google/Facebook login integrations.
* **Recommendation System:** AI/Rule-based items recommendation on product details pages.
