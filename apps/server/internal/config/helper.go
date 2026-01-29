package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// =============== HELPER FUNCTIONS =============== //

// GetEnv returns the value of the environment variable with the given key.
// If the environment variable is not set, it returns the default value.
func GetEnv(key string, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// GetIntEnv returns the value of the environment variable with the given key.
// If the environment variable is not set, it returns the default value.
func GetIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

// GetDurationEnv returns the value of the environment variable with the given key.
// If the environment variable is not set, it returns the default value.
func GetDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

// GetStringSliceEnv returns the value of the environment variable with the given key.
func GetStringSliceEnv(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		// Simple split by comma
		return strings.Split(value, ",")
	}
	return defaultValue
}
