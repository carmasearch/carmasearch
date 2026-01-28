from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="CarMasearch Scraper API", version="1.0.0", description="CarMasearch Scraper API")

@app.get("/")
async def root():
    res:dict = {
        "status": "Running..."
    }
    return JSONResponse(content=res, status_code=200)