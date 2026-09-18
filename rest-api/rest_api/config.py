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