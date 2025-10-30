# TP4 API

Backend API for the TP4 project built with Express and Bun.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0 (or Node.js >= 18)

### Installation

```bash
cd api
bun install
```

### Development

To start the development server with hot reload:

```bash
bun run dev
```

The API will be available at `http://localhost:3000`.

### Production

To build and run in production:

```bash
bun run build
bun run start
```

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run build` - Build the project
- `bun test` - Run tests

## API Endpoints

### Health Check

```
GET /health
```

Returns the health status of the API.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Welcome

```
GET /api
```

Returns a welcome message.

**Response:**

```json
{
  "message": "Welcome to TP4 API"
}
```

### Hello

```
GET /api/hello?name=John
```

Returns a personalized greeting.

**Query Parameters:**

- `name` (optional) - Name to greet (defaults to "World")

**Response:**

```json
{
  "message": "Hello, John!"
}
```

## Environment Variables

Create a `.env` file in the `api` directory:

```env
PORT=3000
NODE_ENV=development
```

## Project Structure

```
api/
├── src/
│   └── index.ts       # Main application entry point
├── dist/              # Compiled output (generated)
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Adding New Routes

To add new routes, edit `src/index.ts` or create separate route files in `src/routes/`:

```typescript
import express from "express";

const router = express.Router();

router.get("/example", (req, res) => {
  res.json({ data: "example" });
});

export default router;
```

Then import and use in `src/index.ts`:

```typescript
import exampleRouter from "./routes/example";
app.use("/api/example", exampleRouter);
```

## Docker Deployment

### Building the Docker Image

```bash
docker build -t tp4-api .
```

### Running the Container

```bash
docker run -p 3000:3000 tp4-api
```

The API will be available at `http://localhost:3000`.

### Running with Environment Variables

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e CORS_ORIGIN=http://localhost:4200 \
  tp4-api
```

### Docker Image Details

- **Base Image:** oven/bun:1
- **Port:** 3000
- **Size:** Optimized for production with multi-stage build
- **User:** Non-root user (bunuser)
- **Health Check:** Built-in health check on `/health` endpoint

The Dockerfile uses a multi-stage build:

1. **Install stage:** Installs dev and production dependencies
2. **Build stage:** Builds the TypeScript application
3. **Release stage:** Runs the built application with only production dependencies

### Health Check

The container includes an automatic health check that pings the `/health` endpoint every 30 seconds.

## Technologies

- **Runtime:** Bun
- **Framework:** Express.js
- **Language:** TypeScript
- **CORS:** Enabled for cross-origin requests
