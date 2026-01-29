package health

import (
	"github.com/carmasearch/carma-server/arch/network"
	"github.com/gin-gonic/gin"
)

type controller struct {
	network.BaseController
	service Service
}

func NewController(
	authProvider network.AuthenticationProvider,
	authorizeProvider network.AuthorizationProvider,
	service Service,
) network.Controller {
	return &controller{
		BaseController: network.NewBaseController("/health", authProvider, authorizeProvider),
	}
}
func (c *controller) MountRoutes(group *gin.RouterGroup) {
	group.GET("/", c.getApplicationHealth)
}

func (c *controller) getApplicationHealth(ctx *gin.Context) {
	data, err := c.service.GetApplicationHealth()

	if err != nil {
		c.Send(ctx).MixedError(err)
		return
	}

	c.Send(ctx).SuccessDataResponse("Application is up and running...", data)
}
