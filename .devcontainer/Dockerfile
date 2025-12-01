# WordPress Multi-Block Plugin Development Container
FROM mcr.microsoft.com/devcontainers/php:1-8.1-bullseye

# Install additional PHP extensions
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    default-mysql-client \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libwebp-dev \
    subversion \
    unzip \
    wget \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd mysqli pdo_mysql zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

# Install Node.js and npm (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Set up PHP configuration
RUN echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/memory.ini \
    && echo "upload_max_filesize=64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=64M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/timeout.ini

# Create workspace directory
WORKDIR /workspace

# Set up non-root user
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Ensure proper permissions
RUN chown -R $USERNAME:$USERNAME /workspace

USER $USERNAME

# Default command
CMD ["sleep", "infinity"]
