package config

import (
	"os"
	"testing"
	"time"
)

func TestLoad(t *testing.T) {
	// Set test environment variables
	os.Setenv("SERVER_PORT", "9090")
	os.Setenv("DB_HOST", "testhost")
	os.Setenv("LOG_LEVEL", "debug")
	defer func() {
		os.Unsetenv("SERVER_PORT")
		os.Unsetenv("DB_HOST")
		os.Unsetenv("LOG_LEVEL")
	}()

	cfg, err := Load()
	if err != nil {
		t.Fatalf("failed to load config: %v", err)
	}

	if cfg.Server.Port != "9090" {
		t.Errorf("expected port 9090; got %s", cfg.Server.Port)
	}

	if cfg.Database.Host != "testhost" {
		t.Errorf("expected host testhost; got %s", cfg.Database.Host)
	}

	if cfg.Logging.Level != "debug" {
		t.Errorf("expected log level debug; got %s", cfg.Logging.Level)
	}
}

func TestConfig_IsDevelopment(t *testing.T) {
	cfg := &Config{
		Server: ServerConfig{
			Environment: "development",
		},
	}

	if !cfg.IsDevelopment() {
		t.Error("expected IsDevelopment to return true")
	}

	if cfg.IsProduction() {
		t.Error("expected IsProduction to return false")
	}
}

func TestGetDurationEnv(t *testing.T) {
	os.Setenv("TEST_DURATION", "30s")
	defer os.Unsetenv("TEST_DURATION")

	duration := GetDurationEnv("TEST_DURATION", 10*time.Second)
	if duration != 30*time.Second {
		t.Errorf("expected 30s; got %v", duration)
	}

	// Test default value
	duration = GetDurationEnv("NONEXISTENT", 10*time.Second)
	if duration != 10*time.Second {
		t.Errorf("expected 10s default; got %v", duration)
	}
}

func TestGetSliceEnv(t *testing.T) {
	os.Setenv("TEST_SLICE", "value1,value2,value3")
	defer os.Unsetenv("TEST_SLICE")

	slice := GetStringSliceEnv("TEST_SLICE", []string{"default"})
	if len(slice) != 3 {
		t.Errorf("expected 3 values; got %d", len(slice))
	}

	if slice[0] != "value1" || slice[1] != "value2" || slice[2] != "value3" {
		t.Errorf("unexpected slice values: %v", slice)
	}
}
