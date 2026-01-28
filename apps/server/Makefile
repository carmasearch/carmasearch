.PHONY: help run build test lint clean migrate-up migrate-down migrate-force

# Variables
BINARY_NAME=carma-server
MIGRATE=migrate
DB_URL=postgres://carma_user:carma_password@localhost:5432/carma_db?sslmode=disable

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

run: ## Run the application
	@echo "Starting server..."
	go run cmd/api/main.go

build: ## Build the application
	@echo "Building..."
	go build -o bin/$(BINARY_NAME) cmd/api/main.go

test: ## Run tests
	@echo "Running tests..."
	go test -v -race -coverprofile=coverage.out ./...

test-coverage: test ## Run tests with coverage report
	go tool cover -html=coverage.out

lint: ## Run linter
	@echo "Running linter..."
	@if command -v golangci-lint >/dev/null 2>&1; then \
		golangci-lint run ./...; \
	else \
		echo "golangci-lint not installed. Install it from https://golangci-lint.run/usage/install/"; \
	fi

fmt: ## Format code
	@echo "Formatting code..."
	go fmt ./...
	gofmt -s -w .

clean: ## Clean build artifacts
	@echo "Cleaning..."
	rm -rf bin/
	rm -f coverage.out

deps: ## Download dependencies
	@echo "Downloading dependencies..."
	go mod download
	go mod tidy

# Database migrations
migrate-up: ## Run database migrations
	@echo "Running migrations..."
	@if command -v migrate >/dev/null 2>&1; then \
		migrate -path migrations -database "$(DB_URL)" up; \
	else \
		echo "migrate not installed. Install it from https://github.com/golang-migrate/migrate"; \
	fi

migrate-down: ## Rollback last migration
	@echo "Rolling back migration..."
	@if command -v migrate >/dev/null 2>&1; then \
		migrate -path migrations -database "$(DB_URL)" down 1; \
	else \
		echo "migrate not installed. Install it from https://github.com/golang-migrate/migrate"; \
	fi

migrate-force: ## Force migration version (usage: make migrate-force VERSION=1)
	@echo "Forcing migration version $(VERSION)..."
	migrate -path migrations -database "$(DB_URL)" force $(VERSION)

migrate-create: ## Create new migration (usage: make migrate-create NAME=create_users_table)
	@echo "Creating migration $(NAME)..."
	migrate create -ext sql -dir migrations -seq $(NAME)

install-tools: ## Install development tools
	@echo "Installing development tools..."
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
