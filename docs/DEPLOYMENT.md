# Deployment Guide

## Overview
This guide covers deployment of the CozyCart backend as a Docker container and production configuration recommendations.

## Backend Docker Deployment
The backend includes a multi-stage Dockerfile that builds the Spring Boot application and produces a runtime image using Eclipse Temurin JRE.

### Build the Docker Image
Run from the repository root:
```bash
docker build -t cozycart-backend ./backend
```

### Run the Docker Container
Example command for local deployment:
```bash
docker run -p 8081:8081 \
  -e DB_URL=jdbc:mysql://host.docker.internal:3306/stayhome_db \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=12345678 \
  -e STAYHOME_JWT_SECRET=<your-base64-secret> \
  -e APP_CORS_ALLOWED_ORIGINS=http://localhost:5173 \
  cozycart-backend
```

### Production Environment Variables
Use the following environment variables in production:
* `DB_URL` — JDBC URL for MySQL
* `DB_USERNAME` — MySQL username
* `DB_PASSWORD` — MySQL password
* `STAYHOME_JWT_SECRET` — JWT secret key in Base64
* `APP_CORS_ALLOWED_ORIGINS` — Allowed frontend origins
* `PORT` — Optional HTTP port (defaults to `8080`)

## Frontend Deployment
The frontend is a Vite application and can be deployed to any static hosting provider.

### Vercel Deployment
A simple `vercel.json` rewrite is already configured for SPA routing.

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Production Build
```bash
cd frontend
npm install
npm run build
```

## Production Configuration
### Backend
* Use `application-prod.properties` or environment variables for production configuration.
* Disable SQL logging by setting `spring.jpa.show-sql=false`.
* Set a strong `STAYHOME_JWT_SECRET` and rotate it if needed.
* Use a managed MySQL instance or secure DB host.

### Frontend
* Set `VITE_API_BASE_URL` to your production backend URL in environment variables.
* Ensure the frontend is served over HTTPS.

## Health and Monitoring
* Backend logs should be monitored for authentication failures and database exceptions.
* Use production-ready database backups and monitoring.
* Enforce strong credentials and secrets management.
