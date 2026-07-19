# 🛒 CozyCart - E-Commerce Platform

Welcome to **CozyCart**, a complete, professional full-stack E-Commerce platform built using modern web technologies. This project features a robust and secure Spring Boot Java backend coupled with a highly responsive, modern React frontend styled with Tailwind CSS.

---

## 🚀 Features

### 👤 Customer Features
*   **Authentication & Security:** Secure registration and login with JWT (JSON Web Tokens), route guarding, and encrypted passwords.
*   **Product Discovery:** Browse products with categories, search, and view detailed product pages.
*   **Shopping Cart:** Add, update quantities, or remove items in a persistent shopping cart.
*   **Wishlist:** Save favorite products to access or purchase them later.
*   **Checkout & Orders:** Seamless checkout workflow, secure order placement, and tracking order history.
*   **Interactive UI:** Clean, responsive web design using Tailwind CSS, fluid animations, and real-time Toast notifications.

### 🛠️ Admin Dashboard
*   **Overview & Statistics:** Monitor key performance indicators (sales, users, orders).
*   **Product Management:** Full CRUD operations (Create, Read, Update, Delete) for products.
*   **Category Management:** Manage and organize product categories.
*   **Order Management:** Monitor order list and update shipping/delivery statuses.
*   **User Management:** View registered users and manage user roles.
*   **Interactions:** Manage contact messages from customers and newsletter subscriptions.

---

## 🛠️ Technology Stack

### Backend
*   **Core Framework:** Spring Boot 3.x
*   **Security:** Spring Security (JWT Authentication & Authorization)
*   **Database:** MySQL
*   **ORM:** Spring Data JPA (Hibernate)
*   **Build Tool:** Maven (Java 17)
*   **Containerization:** Docker

### Frontend
*   **Library:** React 19 (Vite)
*   **Routing:** React Router DOM v7
*   **State Management & Data Fetching:** TanStack React Query v5
*   **Form Handling & Validation:** React Hook Form + Zod
*   **Styling:** Tailwind CSS v4 + PostCSS
*   **Icons & Notifications:** Lucide React & React Hot Toast
*   **HTTP Client:** Axios

---

## 📁 Project Structure

```text
projectworktwo/
├── backend/                  # Spring Boot Java Backend
│   ├── src/                  # Backend Source Code
│   ├── pom.xml               # Maven Dependencies & Configuration
│   ├── Dockerfile            # Docker configuration for deployment
│   └── stayhome_...json      # Postman Collection for API Testing
├── src/                      # React Frontend Source Code
│   ├── components/           # Reusable UI Components
│   ├── pages/                # Page Views (Shop, Admin, Profile, etc.)
│   ├── App.jsx               # Application Router & Layout
│   └── main.jsx              # Entry point
├── public/                   # Static Frontend Assets
├── package.json              # Frontend Scripts & Dependencies
└── vite.config.js            # Vite configuration
```

---

## ⚙️ Prerequisites

Before running the application, make sure you have the following installed:
*   [Java Development Kit (JDK) 17](https://adoptium.net/)
*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [MySQL Server](https://www.mysql.com/)
*   [Maven](https://maven.apache.org/) (optional if using `mvnw`)

---

## 🔧 Getting Started

### 1. Database Setup
1. Open your MySQL client and create a database named `cozycart_db`:
   ```sql
   CREATE DATABASE cozycart_db;
   ```
2. Update the database credentials in [application.properties](file:///d:/Mahfuz/Project/projectworktwo/backend/src/main/resources/application.properties):
   ```properties
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```

### 2. Run the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will run on port `8081`.*

### 3. Run the Frontend
1. Navigate back to the project root:
   ```bash
   cd ..
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Set up the local environment file. Create or edit a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8081
   ```
4. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on port `5173`.*

---

## 🐳 Docker Deployment (Backend)

To package and run the backend using Docker:

1. Build the Docker image:
   ```bash
   docker build -t cozycart-backend ./backend
   ```
2. Run the container (make sure to provide environment variables for production):
   ```bash
   docker run -p 8080:8080 \
     -e DB_URL=jdbc:mysql://host.docker.internal:3306/cozycart_db \
     -e DB_USERNAME=root \
     -e DB_PASSWORD=your_password \
     -e STAYHOME_JWT_SECRET=your_jwt_secret_key \
     -e APP_CORS_ALLOWED_ORIGINS=http://localhost:5173 \
     cozycart-backend
   ```

