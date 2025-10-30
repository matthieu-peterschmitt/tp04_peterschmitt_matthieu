# Docker Deployment Guide

This guide explains how to build and deploy the TP4 monorepo using Docker.

## Overview

The TP4 monorepo consists of two separate Docker images:

- **tp4-web**: Angular frontend served by Nginx
- **tp4-api**: Express.js backend running on Bun

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose 2.0 or later (for running both services)

## Quick Start

### Using Docker Compose (Recommended)

The easiest way to run both services together:

```bash
# From the root directory
docker-compose up -d
```

This will:
- Build both Docker images
- Start the web frontend on port 80
- Start the API backend on port 3000
- Configure networking between services

Access the applications:
- Web: http://localhost:80
- API: http://localhost:3000

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f web
docker-compose logs -f api
```

## Building Individual Images

### Web Frontend

```bash
cd web
docker build -t tp4-web .
```

**Build Arguments:**
- None required

**Image Size:** ~50-60MB (nginx:alpine base)

### API Backend

```bash
cd api
docker build -t tp4-api .
```

**Build Arguments:**
- None required

**Image Size:** ~200-300MB (bun base)

## Running Individual Containers

### Web Frontend

```bash
docker run -d \
  --name tp4-web \
  -p 80:80 \
  tp4-web
```

**Access:** http://localhost:80

### API Backend

```bash
docker run -d \
  --name tp4-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e CORS_ORIGIN=http://localhost \
  tp4-api
```

**Access:** http://localhost:3000

## Environment Variables

### Web Frontend

The web frontend is a static build and doesn't use environment variables at runtime. Configure API endpoints before building:

```bash
# Edit environment files in web/src/environments/
# Then rebuild the image
cd web
docker build -t tp4-web .
```

### API Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3000` | Server port |
| `CORS_ORIGIN` | - | Allowed CORS origins (comma-separated) |

**Example with environment file:**

```bash
docker run -d \
  --name tp4-api \
  -p 3000:3000 \
  --env-file api/.env \
  tp4-api
```

## Docker Compose Configuration

The `docker-compose.yml` file defines:

### Services

- **web**: Angular frontend
  - Port: 80
  - Depends on: api
  - Auto-restart enabled

- **api**: Express backend
  - Port: 3000
  - Health check: `/health` endpoint
  - Auto-restart enabled

### Networks

- **tp4-network**: Bridge network connecting both services

### Customizing docker-compose.yml

```yaml
services:
  api:
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/tp4
      - JWT_SECRET=your-secret-key
    volumes:
      - api_data:/usr/src/app/data
```

## Multi-Stage Builds

Both Dockerfiles use multi-stage builds for optimization:

### Web Dockerfile Stages

1. **base**: Base Bun image
2. **install**: Install Node dependencies
3. **build**: Build Angular application
4. **release**: Nginx serving static files

### API Dockerfile Stages

1. **base**: Base Bun image
2. **install**: Install dev and prod dependencies separately
3. **build**: Build TypeScript to JavaScript
4. **release**: Run with production dependencies only

## Health Checks

### Web Frontend

Nginx automatically handles health checks. Test with:

```bash
curl http://localhost:80
```

### API Backend

Built-in health check endpoint:

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Docker health check runs automatically every 30 seconds.

## Production Deployment

### Security Considerations

1. **Use secrets for sensitive data:**
   ```bash
   docker run -d \
     --name tp4-api \
     --secret jwt_secret \
     tp4-api
   ```

2. **Run as non-root user:** API already configured with non-root user

3. **Use environment-specific configs:**
   - Create separate `.env.production` files
   - Don't commit secrets to version control

4. **Enable HTTPS:** Use a reverse proxy (Nginx, Traefik, Caddy)

### Reverse Proxy Example (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: ./web
      dockerfile: Dockerfile
    restart: always
    networks:
      - tp4-network

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    restart: always
    environment:
      - NODE_ENV=production
    env_file:
      - ./api/.env.production
    networks:
      - tp4-network

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - web
      - api
    networks:
      - tp4-network

networks:
  tp4-network:
    driver: bridge
```

Run with:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs tp4-web
docker logs tp4-api
```

### Port already in use

Change ports in docker-compose.yml:
```yaml
services:
  web:
    ports:
      - "8080:80"  # Changed from 80:80
  api:
    ports:
      - "3001:3000"  # Changed from 3000:3000
```

### API can't connect to web

Ensure both services are on the same Docker network:
```bash
docker network inspect tp4_tp4-network
```

### Build fails

Clear Docker cache and rebuild:
```bash
docker-compose build --no-cache
```

### Image size too large

Check image sizes:
```bash
docker images | grep tp4
```

Optimize by:
- Using `.dockerignore` files
- Removing unnecessary dependencies
- Using alpine base images where possible

## Monitoring

### View resource usage

```bash
docker stats tp4-web tp4-api
```

### Inspect containers

```bash
docker inspect tp4-web
docker inspect tp4-api
```

### Container shell access

```bash
# Web (nginx)
docker exec -it tp4-web sh

# API (bun)
docker exec -it tp4-api sh
```

## Cleanup

### Remove containers

```bash
docker-compose down
```

### Remove images

```bash
docker rmi tp4-web tp4-api
```

### Remove all (containers, images, volumes)

```bash
docker-compose down --rmi all --volumes
```

### Prune unused Docker resources

```bash
docker system prune -a
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Web
        run: |
          cd web
          docker build -t tp4-web .
      
      - name: Build API
        run: |
          cd api
          docker build -t tp4-api .
      
      - name: Push to Registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push tp4-web
          docker push tp4-api
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)