package redis

import (
	"context"
	"fmt"
	"log"

	"github.com/carmasearch/carma-server/internal/config"

	"github.com/redis/go-redis/v9"
)

func NewStore(context context.Context, config *config.RedisConfig) Store {
	client := redis.NewClient(&redis.Options{
		Addr:     config.Addr,
		Password: config.Password,
		DB:       config.DB,
	})
	return &store{
		context: context,
		Client:  client,
	}
}

func (rs *store) GetInstance() *store {
	return rs
}

func (rs *store) Connect() {
	fmt.Println("Connecting to Redis...")
	pong, err := rs.Ping(rs.context).Result()

	if err != nil {
		panic(fmt.Errorf("failed to connect to Redis: %v", err))
	}

	fmt.Println("Connected to Redis:", pong)
}

func (rs *store) Disconnect() {
	fmt.Println("Disconnecting from Redis...")
	err := rs.Close()
	if err != nil {
		log.Panic(err)
	}
	fmt.Println("Disconnected from Redis")
}
