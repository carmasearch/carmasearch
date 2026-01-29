package startup

import (
	"context"
	"fmt"
	"strconv"

	"github.com/carmasearch/carma-server/arch/network"
	"github.com/carmasearch/carma-server/arch/redis"
	"github.com/carmasearch/carma-server/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Shutdown = func()

func Server() {
	env, err := config.LoadEnv(".env")
	if err != nil {
		fmt.Println(err)
	}
	router, shutdown := create(env)
	defer shutdown()
	port, err := strconv.ParseUint(env.Server.Port, 10, 16)
	if err != nil {
		panic(err)
	}

	router.Start(env.Server.Host, uint16(port))
}

func create(env *config.Config) (network.Router, Shutdown) {
	ctx := context.Background()

	dsn := env.GeneratePGConnectionString()
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("failed to connect database: " + err.Error())
	}
	store := redis.NewStore(ctx, &env.Redis)
	store.Connect()
	// define module here
	module := NewModule(ctx, env, db, store)

	// router here
	router := network.NewRouter(env.Server.Environment)
	router.RegisterValidationParsers(network.CustomTagNameFunc())
	router.LoadRootMiddlewares(module.RootMiddlewares())
	router.LoadControllers(module.Controllers())

	shutdown := func() {
		store.Disconnect()
	}

	return router, shutdown
}
