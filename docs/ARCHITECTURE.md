# Stay Home E-Commerce - System Architecture

This document maps out the backend system architecture, data flows, folder structures, and naming conventions to ensure consistency.

---

## 🔁 Architectural Data Flow

We implement standard unidirectional layered architecture pipelines:

### 1. Business Logic Flow
```
[ HTTP Request ] ────► [ Controller ] ────► [ Service ] ────► [ Repository ] ────► [ MySQL DB ]
                                                                                         │
[ HTTP Response ] ◄─── [ Controller ] ◄──── [ Service ] ◄──── [ Repository ] ◄───────────┘
```

### 2. Structure Layer Mappings (Data Conversion)
Database models (entities) are confined to the repository and service layers. They are mapped to DTOs before reaching the controller.
```
  [ Controller ]
        │  ▲
        ▼  │  (Data mapping via DTOs: Requests / Responses)
    [ Service ]
        │  ▲
        ▼  │  (Data mapping via JPA Entities)
  [ Repository ]
        │  ▲
        ▼  │  (SQL Queries / Hibernate transactions)
   [ Database ]
```

---

## 📂 Package Architecture

All Java components reside under the base package `com.stayhome` categorized by role:

```
com.stayhome
├── config                 # Core configuration classes (CORS, Spring configurations)
├── controller             # REST Controllers exposing endpoints
├── dto                    # Request and Response Data Transfer Objects (DTOs)
├── entity                 # JPA database entities
├── exception              # Custom exceptions and GlobalExceptionHandler
├── mapper                 # Object mapping helpers (converting Entity <-> DTO)
├── repository             # Spring Data JPA Repository interfaces
├── security               # JWT filters, entry points, and security setups
├── service                # Transactional business logic service classes
└── util                   # Global utility and helper methods
```

---

## 🏷️ Naming Conventions

To keep components consistent, follow this suffix scheme:

| Component Role | Naming Convention Example | Target Path |
| :--- | :--- | :--- |
| Entity | `User.java`, `Product.java` | `com.stayhome.entity` |
| Repository | `UserRepository.java`, `ProductRepository.java` | `com.stayhome.repository` |
| Service | `UserService.java`, `ProductService.java` | `com.stayhome.service` |
| Controller | `UserController.java`, `ProductController.java` | `com.stayhome.controller` |
| Request DTO | `RegisterRequest.java`, `LoginRequest.java` | `com.stayhome.dto` |
| Response DTO | `UserResponse.java`, `AuthResponse.java` | `com.stayhome.dto` |
| Exception | `EmailAlreadyExistsException.java` | `com.stayhome.exception` |
