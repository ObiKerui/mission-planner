import logging
from contextlib import asynccontextmanager

import uvicorn
from database.database import init_engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rest_api.config import API_HOST, API_PORT, MQTT_HOST, MQTT_PORT, NODE_RED_URL, get_database_url
from rest_api.routes.rules import router as rules
from rest_api.services.mission_event_service import MissionEventService
from rest_api.services.mqtt_service import MqttService
from rest_api.services.node_red_service import NodeRedService

event_service = MissionEventService()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.node_red_service = NodeRedService(
        base_url=NODE_RED_URL,
    )

    app.state.mqtt_service = MqttService(
        host=MQTT_HOST,
        port=MQTT_PORT,
        topic="mission/events",        
        on_message=event_service.handle
    )

    app.state.mqtt_service.start()

    yield

    app.state.mqtt_service.stop()

app = FastAPI(
    title="Mission Planner API",
    version="0.1.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


init_engine(
    get_database_url(),
    pool_pre_ping=True,
)


app.include_router(rules.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}


def start() -> None:
    uvicorn.run(
        "rest_api.main:app",
        host=API_HOST,
        port=int(API_PORT),
        reload=True,
    )


if __name__ == "__main__":
    start()