# Configuration Guide

## Backend Configuration
The backend uses Spring Boot properties files under `backend/src/main/resources`.

### Development configuration
`backend/src/main/resources/application.properties`
```properties
spring.application.name=stayhome
spring.datasource.url=jdbc:mysql://localhost:3306/stayhome_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=12345678
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
server.port=8081
app.upload.dir=uploads
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

### Production configuration
`backend/src/main/resources/application-prod.properties`
```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
server.port=${PORT:8080}
stayhome.jwt.secret=${STAYHOME_JWT_SECRET}
app.cors.allowed-origins=${APP_CORS_ALLOWED_ORIGINS}
```

### Important environment variables
* `DB_URL` — JDBC connection string for MySQL
* `DB_USERNAME` — Database username
* `DB_PASSWORD` — Database password
* `STAYHOME_JWT_SECRET` — JWT signing secret (Base64 encoded)
* `APP_CORS_ALLOWED_ORIGINS` — Comma-separated frontend origins for CORS
* `PORT` — Backend HTTP port in production

## Frontend Configuration
The frontend reads the API base URL from `VITE_API_BASE_URL`.

### Example `.env`
```env
VITE_API_BASE_URL=http://localhost:8081
```

### How API requests are configured
* `frontend/src/api/apiClient.js` sets the Axios base URL.
* The JWT token is attached to all outgoing requests from localStorage.

## Uploads and Static Assets
* Uploads are stored in the `uploads/` directory at the backend root.
* Static access is exposed at `/uploads/**` via `WebMvcConfig`.

## Secrets and Production Safety
* Never commit `application-prod.properties` values that contain secrets.
* Store secret values in environment variables or a secure vault.
* Use strong passwords and unique keys for production.
