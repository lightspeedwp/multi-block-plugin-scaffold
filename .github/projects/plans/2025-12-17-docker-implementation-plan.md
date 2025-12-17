---
title: Docker Implementation Plan
category: Infrastructure
status: Draft
created: 2025-12-17
audience: Developers, DevOps
---

# Docker Implementation Plan

## Objective

Enable reliable local development and testing for the multi-block plugin scaffold by standardising Docker usage for WordPress and test environments.

## Steps

1. **Confirm Requirements**
   - Identify all services needed (WordPress, MySQL/MariaDB, phpMyAdmin, etc.).
   - Review existing scripts (e.g., `wp-env`, `bin/install-wp-tests.sh`).
   - Decide if custom PHP extensions or configuration are needed beyond the official images.

2. **Add Docker Configuration (Official WordPress Image)**
   - Use the [official WordPress Docker image](https://hub.docker.com/_/wordpress) as the base for local development.
   - Create a `docker-compose.yml` with at least:
     - `wordpress` service (using `wordpress:latest` or a specific version)
     - `db` service (using `mysql:8` or `mariadb:latest`)
     - Optional: `phpmyadmin` for DB inspection
   - Mount the plugin source directory into `/var/www/html/wp-content/plugins/{{slug}}` for live development.
   - Use Docker volumes for persistent database and uploads storage.
   - Expose ports (e.g., 8080 for WordPress, 3306 for DB if needed).
   - Example plugin mount in `docker-compose.yml`:

     ```yaml
     services:
       wordpress:
         image: wordpress:latest
         ports:
           - "8080:80"
         volumes:
           - ./src:/var/www/html/wp-content/plugins/{{slug}}
           - ./uploads:/var/www/html/wp-content/uploads
         environment:
           WORDPRESS_DB_HOST: db
           WORDPRESS_DB_USER: root
           WORDPRESS_DB_PASSWORD: example
           WORDPRESS_DB_NAME: wordpress
       db:
         image: mysql:8
         environment:
           MYSQL_ROOT_PASSWORD: example
           MYSQL_DATABASE: wordpress
         volumes:
           - db_data:/var/lib/mysql
     volumes:
       db_data:
     ```

   - Add a `Dockerfile` only if you need custom PHP extensions or tools.

3. **Plugin Installation and Setup**
   - Document how to activate the plugin in the Docker WordPress admin.
   - Provide a script or Makefile target to copy/install dependencies if needed.
   - Optionally, pre-install the plugin via a custom entrypoint or WP-CLI command in the container.

4. **Integrate with wp-env (Optional/Advanced)**
   - If using `@wordpress/env`, configure `.wp-env.json` to match the Docker Compose setup.
   - Document differences between `wp-env` and raw Docker Compose usage.

5. **Automate Test Environment**
   - Update test scripts to check/start Docker as a prerequisite for all integration/E2E tests.
   - Ensure `bin/install-wp-tests.sh` can connect to the Docker DB (use `db` as host, credentials from compose).
   - Consider using a separate test database or container for isolation.

6. **Validation**
   - Run `docker-compose up` and verify WordPress is accessible at `http://localhost:8080/wp-admin`.
   - Mount plugin code and confirm live reload works (edit code, refresh WP admin).
   - Run all dry-run, unit, and E2E tests inside the Docker environment.
   - Confirm logs and volumes persist as expected.

7. **Documentation**
   - Update `README.md` and `DEVELOPMENT.md` with:
     - Docker Compose usage instructions (`docker-compose up`, `down`, etc.)
     - How to access WordPress, DB, and phpMyAdmin (if included)
     - How to mount plugin code and troubleshoot permissions
     - How to run tests in Docker
     - Common issues (e.g., port conflicts, file permissions, DB resets)
   - Add a FAQ for Docker-specific problems (e.g., "Why can't I see my plugin?", "How do I reset the DB?").

## Docker-Friendly Guidelines

- Always use volumes to mount your plugin source for live development.
- Prefer the official WordPress and MySQL/MariaDB images for simplicity and support.
- Use environment variables for DB credentials and WordPress setup.
- Document any custom PHP extensions or configuration in the Dockerfile.
- Use `docker-compose down -v` to reset the environment (including DB).
- For CI, use the same Docker Compose setup to ensure parity with local dev.
- Use WP-CLI in the container for plugin activation, DB resets, and test setup.

## Validation Steps

- All tests pass in Docker environment.
- Developers can start/stop environment with one command.
- No manual DB or WordPress setup required.
- Plugin code mounts correctly for live reload.

## Risks/Unknowns

- Host OS compatibility (macOS, Windows, Linux).
- Port conflicts or resource limits.
- Custom PHP extensions or configuration needs.

---
