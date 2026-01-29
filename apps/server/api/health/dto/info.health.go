package dto

type InfoHealth struct {
	Application string `json:"application"`
	Version     string `json:"version"`
	Environment string `json:"environment"`
	Uptime      string `json:"uptime"`
	Memory      string `json:"memory"`
	CPU         string `json:"cpu"`
	Disk        string `json:"disk"`
}
