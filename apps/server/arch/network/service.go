package network

import "context"

type baseService struct {
	ctx context.Context
}

func NewBaseService() BaseService {
	return &baseService{
		ctx: context.Background(),
	}
}

func (s *baseService) Context() context.Context {
	return s.ctx
}
