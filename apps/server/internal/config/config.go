package config

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// Load reads configuration from environment variables
func LoadEnv(path string) (*Config, error) {
	// Load .env file if it exists (ignore error in production)
	_ = godotenv.Load(path) // path could be .env which is in the root directory of the project

	cfg := &Config{
		Server: ServerConfig{
			Port:         GetEnv("SERVER_PORT", "8080"),
			Host:         GetEnv("SERVER_HOST", "0.0.0.0"),
			ReadTimeout:  GetDurationEnv("SERVER_READ_TIMEOUT", 15*time.Second),
			WriteTimeout: GetDurationEnv("SERVER_WRITE_TIMEOUT", 15*time.Second),
			IdleTimeout:  GetDurationEnv("SERVER_IDLE_TIMEOUT", 60*time.Second),
			Environment:  GetEnv("ENV", gin.DebugMode),
		},
		Database: DatabaseConfig{
			Host:            GetEnv("DB_HOST", "localhost"),
			Port:            GetEnv("DB_PORT", "5432"),
			User:            GetEnv("DB_USER", "carma_user"),
			Password:        GetEnv("DB_PASSWORD", "carma0912pass"),
			DBName:          GetEnv("DB_NAME", "carma_db"),
			SSLMode:         GetEnv("DB_SSLMODE", "disable"),
			MaxOpenConns:    GetIntEnv("DB_MAX_OPEN_CONNS", 25),
			MaxIdleConns:    GetIntEnv("DB_MAX_IDLE_CONNS", 5),
			ConnMaxLifetime: GetDurationEnv("DB_CONN_MAX_LIFETIME", 5*time.Minute),
		},
		Redis: RedisConfig{
			Addr:     GetEnv("REDIS_ADDR", "localhost:6379"),
			Password: GetEnv("REDIS_PASSWORD", ""),
			DB:       GetIntEnv("REDIS_DB", 0),
		},
		Logging: LoggingConfig{
			Level:  GetEnv("LOG_LEVEL", "info"),
			Format: GetEnv("LOG_FORMAT", "json"),
		},
		CORS: CORSConfig{
			AllowOrigins: GetStringSliceEnv("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000"}),
			AllowHeaders: GetStringSliceEnv("CORS_ALLOWED_HEADERS", []string{"Accept", "Authorization", "Content-Type", "X-Request-ID"}),
			AllowMethods: GetStringSliceEnv("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
		},
	}

	// Validate required fields
	if err := cfg.Validate(); err != nil {
		return nil, err
	}
	return cfg, nil
}
