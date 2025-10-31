FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Copy node_modules from temp directory and copy all project files
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build the Angular application for production
ENV NODE_ENV=production
RUN bun run build --configuration production

# Production stage - use nginx to serve static files
FROM nginx:alpine AS release

# Copy the built Angular app from the build stage
COPY --from=build /usr/src/app/dist/tp2/browser /usr/share/nginx/html

# Create nginx configuration for Angular SPA
RUN echo 'server { \
  listen 80; \
  server_name localhost; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { \
  try_files $uri $uri/ /index.html; \
  } \
  # Security headers \
  add_header X-Frame-Options "SAMEORIGIN" always; \
  add_header X-Content-Type-Options "nosniff" always; \
  add_header X-XSS-Protection "1; mode=block" always; \
  # Gzip compression \
  gzip on; \
  gzip_vary on; \
  gzip_min_length 1024; \
  gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
  }' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
