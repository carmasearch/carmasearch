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

