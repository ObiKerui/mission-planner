import logging

import uvicorn
from database.database import init_engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rest_api.config import API_HOST, API_PORT, get_database_url
from rest_api.routes.rules import router as rules

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mission Planner API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


init_engine(
    get_database_url(),
    pool_pre_ping=True,
)

@app.on_event("startup")
def startup():
    db_url = ''
    # init_engine(db_url, echo=False)
    
app.include_router(rules.router)

@app.get("/health", tags=["health"])
def health():
    return { "status": "ok"}

def start() -> None:
    uvicorn.run(
        "rest_api.main:app",
        host=API_HOST,
        port=int(API_PORT),
        reload=True,
    )
    
if __name__ == "__main__":
    start()