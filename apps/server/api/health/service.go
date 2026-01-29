package health

import (
	"fmt"
	"runtime"
	"time"

	"github.com/carmasearch/carma-server/api/health/dto"
	"github.com/carmasearch/carma-server/arch/network"
)

type Service interface {
	GetApplicationHealth() (*dto.InfoHealth, error)
}
type service struct {
	network.BaseService
}

func NewService() Service {
	return &service{
		BaseService: network.NewBaseService(),
	}
}

func (s *service) GetApplicationHealth() (*dto.InfoHealth, error) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	return &dto.InfoHealth{
		Application: "carma-server",
		Version:     "1.0.0",
		Environment: s.Context().Value("env").(string),
		Uptime:      time.Since(s.Context().Value("start_time").(time.Time)).String(),
		Memory:      fmt.Sprintf("%d MB", m.Alloc/1024/1024),
		CPU:         fmt.Sprintf("%d", runtime.NumCPU()),
	}, nil
}
