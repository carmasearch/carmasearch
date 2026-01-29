package redis

import (
	"context"
	"time"
)

type Cache[T any] interface {
	SetJSON(key string, value *T, expiration time.Duration) error
	GetJSON(key string) (*T, error)
	SetJSONList(key string, values []*T, expiration time.Duration) error
	GetJSONList(key string) ([]*T, error)
	Delete(key string) (int64, error)
	DeleteList(key string) (int64, error)
}

type cache[T any] struct {
	context context.Context
	store   Store
}
