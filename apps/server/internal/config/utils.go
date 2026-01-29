package config

import (
	"fmt"
)

// Validate checks if required configuration values are set
func (c *Config) Validate() error {
	if c.Database.Password == "" && c.Server.Environment == "production" {
		return fmt.Errorf("DB_PASSWORD is required in production")
	}
	return nil
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Server.Environment == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Server.Environment == "production"
}

// Generate pg database connection string
func (c *Config) GeneratePGConnectionString() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", c.Database.Host, c.Database.User, c.Database.Password, c.Database.DBName, c.Database.Port, c.Database.SSLMode)
}

// Generate redis db conneciton string
func (c *Config) GenerateRedisConnectionString() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s", c.Database.Host, c.Database.User, c.Database.Password, c.Database.DBName, c.Database.Port, c.Database.SSLMode)
}
