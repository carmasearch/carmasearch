# CARMA Search - System Architecture

## Executive Summary

CARMA Search is designed as a **microservices-based platform** for vehicle comparison and deal tracking, built for **10+ years of maintainability and scale**. The architecture prioritizes:

- **Scalability**: Handle millions of vehicles and thousands of concurrent users
- **Maintainability**: Clean architecture with clear separation of concerns
- **Performance**: Sub-second search responses, real-time data updates
- **Reliability**: 99.9% uptime, graceful degradation
- **Extensibility**: Easy to add new vehicle types, data sources, features

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│                  Next.js (TypeScript)                       │
│              Deployed on Vercel/Cloudflare                  │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS/REST/GraphQL
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                      API GATEWAY                            │
│              (nginx/Kong/AWS API Gateway)                   │
│         Rate Limiting, Authentication, Routing              │
└─────┬────────────────────┬─────────────────┬────────────────┘
      │                    │                 │
┌─────▼──────────┐  ┌──────▼──────────┐  ┌──▼─────────────┐
│   Backend API  │  │  Scraper        │  │  Search        │
│   (Go)         │  │  Service (Go)   │  │  Service (Go)  │
│   Main Logic   │  │  Data Ingestion │  │  Elasticsearch │
└─────┬──────────┘  └──────┬──────────┘  └──┬─────────────┘
      │                    │                 │
      └────────────────────┼─────────────────┘
                           │
      ┌────────────────────▼─────────────────┐
      │        Data Layer                    │
      │  PostgreSQL  │  Redis  │  S3/Blob   │
      │  (Primary)   │ (Cache) │  (Files)   │
      └──────────────────────────────────────┘
```

## Technology Stack

### Frontend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **State Management**: Zustand or React Query
- **UI Library**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel (recommended) or Cloudflare Pages

### Backend Services

- **Language**: Go 1.21+
- **Framework**: net/http + Chi router
- **Database**: PostgreSQL 15+ (primary)
- **Cache**: Redis 7+
- **Search**: Elasticsearch 8+ (for vehicle search)
- **Queue**: Redis/AWS SQS (for background jobs)
- **Storage**: S3/MinIO (for images, documents)

### Infrastructure

- **Container**: Docker
- **Orchestration**: Kubernetes or AWS ECS
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger or OpenTelemetry

## Core Services Architecture

### 1. Backend API Service (Go)

**Responsibilities**:

- User authentication & authorization
- Vehicle CRUD operations
- Comparison engine
- User preferences & saved searches
- Deal notifications
- Integration with external services

**Key Components**:

```
internal/
├── handler/        # HTTP handlers
├── service/        # Business logic
├── repository/     # Data access
├── model/          # Domain entities
├── middleware/     # HTTP middleware
└── client/         # External API clients
```

**Scaling Strategy**:

- Horizontal scaling (multiple instances behind load balancer)
- Stateless design (session in Redis)
- Connection pooling
- Read replicas for heavy read operations

### 2. Scraper Service (Go)

**Responsibilities**:

- Scrape vehicle data from multiple sources
- Data normalization & validation
- Duplicate detection
- Image downloading & processing
- Rate limiting & politeness

**Architecture**:

```go
// Scraper worker pool pattern
type Scraper interface {
    Scrape(ctx context.Context, source Source) ([]Vehicle, error)
}

// Implementations
- CarGurusScraper
- AutoTraderScraper
- CraigslistScraper
- DealerWebsiteScraper
```

**Why Go over Python?**

- **Concurrency**: Goroutines are perfect for concurrent scraping (1000s of concurrent requests)
- **Performance**: 10-50x faster than Python for I/O operations
- **Memory**: Much lower memory footprint
- **Deployment**: Single binary, no dependency hell
- **Type Safety**: Catch errors at compile time

**Libraries**:

- `colly` or `gocolly` for scraping
- `goquery` for HTML parsing
- `chromedp` for JavaScript-heavy sites

**Scaling**:

- Distributed workers (Kubernetes pods)
- Job queue (Redis or SQS)
- Rate limiting per source
- Proxy rotation for IP blocking

### 3. Search Service

**Technology**: Elasticsearch or Typesense
**Responsibilities**:

- Fast full-text search
- Faceted filtering (make, model, year, price range)
- Geolocation search (nearby deals)
- Ranking & relevance

**Index Structure**:

```json
{
  "vehicle_id": "uuid",
  "make": "Toyota",
  "model": "Camry",
  "year": 2024,
  "price": 28000,
  "location": {
    "lat": 40.7128,
    "lon": -74.006
  },
  "features": ["leather", "sunroof"],
  "seller_rating": 4.5,
  "images": ["url1", "url2"]
}
```

## Database Schema Design

### Core Tables

```sql
-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles (main data)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(100) NOT NULL,  -- cargurus, autotrader, etc.
    source_id VARCHAR(255),         -- ID from source
    vin VARCHAR(17) UNIQUE,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),
    body_type VARCHAR(50),
    price DECIMAL(10,2),
    mileage INTEGER,
    condition VARCHAR(20),          -- new, used, certified
    location_city VARCHAR(100),
    location_state VARCHAR(50),
    location_zip VARCHAR(10),
    dealer_name VARCHAR(255),
    dealer_rating DECIMAL(3,2),
    listing_url TEXT,
    description TEXT,
    features JSONB,                 -- Array of features
    images JSONB,                   -- Array of image URLs
    scraped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicles_year ON vehicles(year);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_location ON vehicles(location_state, location_city);
CREATE INDEX idx_vehicles_vin ON vehicles(vin) WHERE vin IS NOT NULL;
CREATE INDEX idx_vehicles_scraped_at ON vehicles(scraped_at);

-- Comparisons
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    vehicle_ids UUID[],             -- Array of vehicle IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved searches
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    filters JSONB,                  -- Search criteria
    notification_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history (for tracking deals)
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_price_history_vehicle ON price_history(vehicle_id, recorded_at DESC);
```

### Data Partitioning Strategy (for scale)

**When to partition**: When table exceeds 10M rows

```sql
-- Partition vehicles by year (most common filter)
CREATE TABLE vehicles (
    -- ... columns ...
) PARTITION BY RANGE (year);

CREATE TABLE vehicles_2020 PARTITION OF vehicles
    FOR VALUES FROM (2020) TO (2021);

CREATE TABLE vehicles_2021 PARTITION OF vehicles
    FOR VALUES FROM (2021) TO (2022);
-- etc.
```

## Caching Strategy

### Redis Cache Layers

```
┌─────────────────────────────────────────┐
│ Layer 1: Hot Data (TTL: 5 min)         │
│ - Search results                        │
│ - Popular vehicles                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Layer 2: User Sessions (TTL: 30 days)  │
│ - Authentication tokens                 │
│ - User preferences                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Layer 3: Computed Data (TTL: 1 hour)   │
│ - Aggregate statistics                  │
│ - Market trends                         │
└─────────────────────────────────────────┘
```

**Cache Keys Convention**:

```
user:session:{user_id}
vehicle:details:{vehicle_id}
search:results:{hash_of_params}
stats:make:{make}:model:{model}
```

## API Design

### RESTful Endpoints

```
Authentication:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh

Vehicles:
GET    /api/v1/vehicles              # Search/list
GET    /api/v1/vehicles/:id          # Get details
POST   /api/v1/vehicles/:id/favorite # Favorite
GET    /api/v1/vehicles/:id/history  # Price history

Comparisons:
POST   /api/v1/comparisons           # Create comparison
GET    /api/v1/comparisons/:id       # Get comparison
PUT    /api/v1/comparisons/:id       # Update
DELETE /api/v1/comparisons/:id       # Delete
GET    /api/v1/users/me/comparisons  # User's comparisons

Saved Searches:
POST   /api/v1/searches              # Save search
GET    /api/v1/searches              # List saved
DELETE /api/v1/searches/:id          # Delete

User Profile:
GET    /api/v1/users/me              # Get profile
PUT    /api/v1/users/me              # Update profile
GET    /api/v1/users/me/favorites    # Favorite vehicles
```

### Request/Response Examples

**Search Vehicles**:

```bash
GET /api/v1/vehicles?make=Toyota&model=Camry&year_min=2020&price_max=30000&page=1&limit=20

Response:
{
  "data": [
    {
      "id": "uuid",
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "price": 28000,
      "mileage": 15000,
      "location": {
        "city": "Los Angeles",
        "state": "CA"
      },
      "images": ["url1", "url2"],
      "dealer": {
        "name": "ABC Motors",
        "rating": 4.5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "total_pages": 8
  }
}
```

## Performance Targets

### Response Times (p95)

- Homepage: < 200ms
- Search results: < 500ms
- Vehicle details: < 300ms
- Comparisons: < 400ms

### Throughput

- 1,000 requests/second (initial)
- 10,000 requests/second (year 2)
- 100,000 requests/second (year 5)

### Data Scale

- 1M vehicles (initial)
- 10M vehicles (year 2)
- 100M vehicles (year 5+)

## Security Architecture

### Authentication

- **JWT tokens** for stateless auth
- **Refresh tokens** stored in Redis
- **HttpOnly cookies** for web
- **Rate limiting** per IP/user

### Authorization

```go
// Role-based access control
type Role string

const (
    RoleUser     Role = "user"
    RoleAdmin    Role = "admin"
    RoleScraper  Role = "scraper"
)

// Middleware
func RequireAuth(roles ...Role) func(http.Handler) http.Handler
```

### Data Protection

- **Encryption at rest** (database encryption)
- **Encryption in transit** (TLS 1.3)
- **PII handling** (GDPR compliance)
- **SQL injection prevention** (parameterized queries)
- **XSS prevention** (content security policy)

## Monitoring & Observability

### Metrics to Track

```go
// Business metrics
- vehicles.scraped.total
- vehicles.active.count
- users.registered.total
- searches.performed.total
- comparisons.created.total

// System metrics
- api.request.duration
- api.request.count
- db.query.duration
- db.connections.active
- cache.hit.ratio
- scraper.success.rate
```

### Alerting Rules

- API response time > 1s for 5 minutes
- Error rate > 1% for 5 minutes
- Database connection pool > 80% for 10 minutes
- Scraper failure rate > 10% for 30 minutes

### Logging Standards

```json
{
  "timestamp": "2026-01-28T10:30:00Z",
  "level": "info",
  "request_id": "req-123",
  "user_id": "user-456",
  "service": "api",
  "endpoint": "/api/v1/vehicles",
  "method": "GET",
  "status": 200,
  "duration_ms": 45,
  "message": "request completed"
}
```

## Disaster Recovery & Backup

### Database Backups

- **Continuous backup** (PostgreSQL WAL)
- **Daily snapshots** (retained for 30 days)
- **Weekly full backup** (retained for 1 year)
- **Point-in-time recovery** (last 7 days)

### Disaster Recovery Plan

- **RTO** (Recovery Time Objective): 1 hour
- **RPO** (Recovery Point Objective): 5 minutes
- **Multi-region deployment** (production only)
- **Automated failover** for critical services

## Deployment Architecture

### Development Environment

```
Developer Laptop → Docker Compose → Local PostgreSQL/Redis
```

### Staging Environment

```
AWS/GCP → Kubernetes → RDS → ElastiCache
(Mirrors production but smaller instances)
```

### Production Environment

```
AWS/GCP Multi-Region
├── Load Balancer (ALB/Global LB)
├── Kubernetes Cluster (3+ nodes)
│   ├── API Pods (3+ replicas)
│   ├── Scraper Pods (5+ replicas)
│   └── Search Service Pods (3+ replicas)
├── RDS PostgreSQL (Multi-AZ)
├── ElastiCache Redis (Cluster mode)
├── Elasticsearch Cluster (3+ nodes)
└── S3 (Images & backups)
```

## Cost Optimization

### Initial Phase (0-1000 users)

- **Infrastructure**: $200-500/month
- Single region, smaller instances
- Shared PostgreSQL instance

### Growth Phase (1K-100K users)

- **Infrastructure**: $2,000-5,000/month
- Multi-AZ deployment
- Dedicated cache & search

### Scale Phase (100K+ users)

- **Infrastructure**: $10,000-50,000/month
- Multi-region
- Dedicated teams per service

## Technology Decision Rationale

### Why Go for Backend?

✅ **Pros**:

- Excellent concurrency (goroutines)
- Fast compilation & execution
- Small memory footprint
- Great standard library
- Easy deployment (single binary)
- Strong typing & error handling
- Mature ecosystem for microservices

❌ **Alternatives Considered**:

- **Node.js**: Weaker typing, callback hell, higher memory
- **Python**: Slow, GIL issues, dependency management
- **Rust**: Steeper learning curve, slower development
- **Java**: Heavy runtime, verbose, slow startup

### Why PostgreSQL over MongoDB?

✅ **PostgreSQL**:

- ACID compliance
- Relational integrity
- Complex queries & joins
- JSON support (JSONB)
- Proven at scale
- Better for financial data (prices)

❌ **MongoDB**:

- Eventual consistency issues
- No transactions (historically)
- Schema flexibility not needed
- Higher memory usage

### Why Next.js for Frontend?

✅ **Next.js**:

- SEO optimization (SSR/SSG)
- Fast page loads
- Great developer experience
- TypeScript support
- Large ecosystem
- Easy deployment (Vercel)

## Migration & Evolution Strategy

### Year 1: MVP

- Core CRUD operations
- Basic search
- Single scraper source
- Monolithic deployment

### Year 2-3: Microservices

- Split scraper service
- Add search service
- Implement caching
- Multi-region deployment

### Year 4-5: Scale

- ML for price predictions
- Advanced personalization
- Mobile apps (React Native)
- Real-time notifications

### Year 6-10: Innovation

- AI-powered recommendations
- Blockchain for vehicle history
- AR vehicle visualization
- Integration marketplace

## Conclusion

This architecture provides:

- **Scalability** from 10 to 10M users
- **Maintainability** through clean architecture
- **Performance** through caching & optimization
- **Reliability** through redundancy & monitoring
- **Extensibility** for future features

The Go-based backend ensures high performance and easy maintenance for the next 10+ years.
