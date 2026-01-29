package redis

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type Store interface {
	GetInstance() *store
	Connect()
	Disconnect()
}
type store struct {
	*redis.Client
	context context.Context
}
