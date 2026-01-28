# CARMA Search - Backend API

The complete platform to compare vehicles. Built for scale and maintainability.

## Architecture

- **Framework**: Go 1.21+ (net/http + chi router)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Deployment**: Docker + Kubernetes ready

## Project Structure

```
carma-backend/
├── cmd/
│   ├── api/              # Main API server
│   └── migrate/          # Migration runner
├── internal/
│   ├── config/           # Configuration management
│   ├── database/         # Database connection & queries
│   ├── handler/          # HTTP handlers
│   ├── middleware/       # HTTP middleware
│   ├── model/            # Domain models
│   ├── repository/       # Data access layer
│   ├── service/          # Business logic
│   └── logger/           # Logging utilities
├── migrations/           # SQL migrations
├── pkg/                  # Public packages (reusable)
├── scripts/              # Utility scripts
├── .env.example
└── Makefile
```

## Getting Started

### Prerequisites
- Go 1.21+
- PostgreSQL 15+
- Redis 7+ (optional for Phase 1)

### Local Development

```bash
# 1. Clone and setup
git clone <repo>
cd carma-backend

# 2. Install dependencies
go mod download

# 3. Copy environment config
cp .env.example .env

# 4. Start dependencies (PostgreSQL)
docker-compose up -d postgres

# 5. Run migrations
make migrate-up

# 6. Start server
make run
```

Server runs at: `http://localhost:8080`

## API Endpoints (Phase 1)

- `GET /health` - Health check
- `GET /ready` - Readiness probe

## Development Commands

```bash
make run          # Run the server
make test         # Run tests
make lint         # Run linter
make migrate-up   # Run migrations
make migrate-down # Rollback migrations
```

## Environment Variables

See `.env.example` for all configuration options.

## Design Principles

1. **Clean Architecture** - Clear separation of concerns
2. **12-Factor App** - Configuration, logging, stateless services
3. **API-First** - REST with OpenAPI/Swagger documentation
4. **Database Migrations** - Version-controlled schema changes
5. **Observability** - Structured logging, metrics, tracing ready

