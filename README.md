# TP4 Monorepo

This monorepo contains both the web frontend and API backend for the TP4 project.

## Project Structure

```
tp4/
├── web/          # Angular frontend application
├── api/          # Backend API
├── .github/      # GitHub configuration
└── README.md     # This file
```

## Web (Angular Frontend)

The web application is an Angular project located in the `web/` directory.

### Development server

To start the development server:

```bash
cd web
npm install  # or bun install
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building

To build the web project:

```bash
cd web
ng build
```

Build artifacts will be stored in the `web/dist/` directory.

### Running tests

```bash
cd web
ng test
```

For more details, see the [web/README.md](web/README.md) file.

## API (Backend)

The API backend is located in the `api/` directory.

### Development

```bash
cd api
npm install  # or bun install
npm run dev
```

For more details, see the [api/README.md](api/README.md) file.

## Docker Deployment

This project includes separate Docker images for the web frontend and API backend.

### Building Individual Images

**Build Web Frontend:**
```bash
cd web
docker build -t tp4-web .
docker run -p 80:80 tp4-web
```

**Build API Backend:**
```bash
cd api
docker build -t tp4-api .
docker run -p 3000:3000 tp4-api
```

### Using Docker Compose (Recommended)

To run both services together:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- Web frontend on `http://localhost:80`
- API backend on `http://localhost:3000`

### Docker Images

- **tp4-web**: Nginx-based image serving the Angular application (production build)
- **tp4-api**: Bun-based image running the Express API server

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev)