import os

from dotenv import load_dotenv

load_dotenv()

def get_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL is not set")
    return url

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = os.getenv("API_PORT", "8000")

NODE_RED_URL = os.getenv(
    "NODE_RED_URL",
    "http://localhost:1880",
)

MQTT_HOST = os.getenv(
    "MQTT_HOST",
    "localhost",
)

MQTT_PORT = int(
    os.getenv(
        "MQTT_PORT",
        "1883",
    )
)

NODE_RED_MQTT_HOST = os.getenv(
    "NODE_RED_MQTT_HOST",
    "localhost",
)

NODE_RED_MQTT_PORT = int(
    os.getenv(
        "NODE_RED_MQTT_PORT",
        "1883",
    )
)