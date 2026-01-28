## Error Codes

- VEHICLE_NOT_FOUND
- INVALID_COMPARISON
- SOURCE_UNAVAILABLE
- RATE_LIMITED
- INTERNAL_ERROR

Rules:

- Codes never change
- Messages can change

Ownership Rules:

- API owns domain validation
- Scraper owns data collection
- Web owns presentation only
- No service writes into another service's database
