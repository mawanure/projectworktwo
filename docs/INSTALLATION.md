# Installation Guide

## Overview
This document describes how to install and run the CozyCart / Stay Home application locally.

## Prerequisites
* Java Development Kit (JDK) 17
* Maven or the provided Maven wrapper (`mvnw` / `mvnw.cmd`)
* Node.js 18+ and npm
* MySQL Server 8.x
* Git (optional)

## 1. Clone the Repository
```bash
git clone <repository-url>
cd projectworktwo
```

## 2. Configure the Database
1. Start MySQL.
2. Create the application database:
```sql
CREATE DATABASE stayhome_db;
```
3. Update backend database credentials in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=12345678
```
4. The default datasource URL already points to `jdbc:mysql://localhost:3306/stayhome_db` with Hibernate auto-update enabled.

## 3. Run the Backend
1. Open a terminal in the `backend` folder.
2. Run the Spring Boot application:
* Windows:
```cmd
cd backend
mvnw.cmd spring-boot:run
```
* Linux / macOS:
```bash
cd backend
chmod +x mvnw
./mvnw spring-boot:run
```
3. Confirm the backend is available at `http://localhost:8081`.

## 4. Run the Frontend
1. Open a separate terminal in the `frontend` folder.
2. Install dependencies:
```bash
cd frontend
npm install
```
3. Create `.env` with the API base URL:
```env
VITE_API_BASE_URL=http://localhost:8081
```
4. Start the Vite development server:
```bash
npm run dev
```
5. Open the frontend at the URL shown by Vite (commonly `http://localhost:5173`).

## 5. Test the Application
* Register a new user via the frontend sign-up page.
* Log in and verify profile, cart, wishlist, and checkout flows.
* Confirm admin routes are only accessible after logging in as an admin user.

## 6. Notes
* Backend properties are loaded from `backend/src/main/resources/application.properties` in development and from environment variables in production if `application-prod.properties` is used.
* The backend uses `spring.jpa.hibernate.ddl-auto=update`, so the schema is created and updated automatically on startup.
