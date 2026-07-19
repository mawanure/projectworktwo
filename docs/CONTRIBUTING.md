# Stay Home E-Commerce - Contributing Guidelines

Thank you for contributing to the Stay Home E-Commerce project. To maintain code quality and consistency across releases, please adhere to these guidelines.

---

## 💻 Coding Style

### Java (Backend)
* **Code Formatting:** Follow standard Google Java Style. Use spaces instead of tabs (4 spaces indentation).
* **Naming:** Use standard camelCase for variables/methods, PascalCase for classes, and UPPER_CASE for static final constants.
* **Declarations:** Minimize boilerplate using Lombok annotations (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`).
* **Lombok Constraints:** Always specify explicit versions for Lombok inside properties or plugins when targeting newer JDKs (like JDK 25) to avoid compiler crashes.

### Frontend
* **Vanilla Approach:** Do not add external JS/CSS frameworks (like TailwindCSS or React) unless explicitly requested.
* **Separation:** Keep HTML, CSS, and JS logic isolated. Always use Fetch API to interface with backend REST endpoints.
* **Grid and Padding:** Preserve the existing `.section-p1` padding (`40px 80px`) and `.normal` button selectors.

---

## 📝 Commit Message Convention

We follow semantic prefixing for all commits. Commit messages must use the following prefixes:

* **`feat:`** Used when introducing a new feature or endpoint (e.g., `feat: add category retrieval APIs`).
* **`fix:`** Used when fixing a bug or correcting a system error (e.g., `fix: resolve JWT public key retrieval exception`).
* **`refactor:`** Used when reorganizing code without modifying user-facing features (e.g., `refactor: extract user mapping logic into mapper utils`).
* **`docs:`** Used when editing documentation files (e.g., `docs: create contributing guidelines`).
* **`style:`** Used when correcting visual styling (CSS) or indentation formats.

---

## 🌿 Branch Naming Convention

Create descriptive branch names using the following formats:

* **Feature Branches:** `feature/<module-name>` (e.g., `feature/category-module`, `feature/product-module`)
* **Bug Fix Branches:** `bugfix/<issue-name>` (e.g., `bugfix/jwt-expiration-error`)
* **Refactor Branches:** `refactor/<module-name>` (e.g., `refactor/security-configurations`)

---

## 🔍 Pull Request Checklist

Before submitting a Pull Request (PR) or merging changes, ensure you verify the following items:

- [ ] Code compiles without errors (Build Verification passes).
- [ ] No TODO or placeholder code blocks exist.
- [ ] Database schema adjustments (if any) are documented in `DATABASE.md`.
- [ ] Endpoint details (if any are added or modified) are documented in `API_SPEC.md`.
- [ ] Changes are summarized in `CHANGELOG.md`.
- [ ] Checkboxes in `TASKS.md` are updated to reflect completed items.
- [ ] All unit/integration tests run and pass.

---

## 🛠️ Build Verification Steps

Always perform these steps locally before committing changes:

1. **Clean and Compile:**
   Navigate to the `backend/` directory and compile the Java project:
   ```bash
   mvn clean compile
   ```
   *Verify that no annotation processing errors (e.g. Lombok build errors) occur.*

2. **Run Tests:**
   Execute the test suite to ensure no regressions:
   ```bash
   mvn test
   ```

3. **Verify App Startup:**
   Start the application locally and check database connection statuses:
   ```bash
   mvn spring-boot:run
   ```
   *Verify Tomcat starts on port 8080 and Hibernate connects to MySQL without DDL schema errors.*
