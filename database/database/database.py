from collections.abc import Generator
from contextlib import contextmanager
from typing import Any

from sqlalchemy import Engine, create_engine, text
from sqlalchemy.orm import Session, sessionmaker

_ENGINE: Engine | None = None
_SESSION_LOCAL: sessionmaker[Session] | None = None


def init_engine(database_url: str, **kwargs: Any) -> None:
    """Initialise the database engine.

    Call once during application startup.
    """
    global _ENGINE, _SESSION_LOCAL

    _ENGINE = create_engine(database_url, **kwargs)

    _SESSION_LOCAL = sessionmaker(
        bind=_ENGINE,
        autocommit=False,
        autoflush=False,
    )


def get_engine() -> Engine:
    """Return the configured database engine."""
    if _ENGINE is None:
        raise RuntimeError("Call init_engine() before using the database.")

    return _ENGINE

@contextmanager
def session_scope() -> Generator[Session, None, None]:
    if _SESSION_LOCAL is None:
        raise RuntimeError("Call init_engine() before using the database.")

    session = _SESSION_LOCAL()

    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency providing a database session."""
    if _SESSION_LOCAL is None:
        raise RuntimeError("Call init_engine() before using the database.")

    db = _SESSION_LOCAL()

    try:
        yield db
    finally:
        db.close()
        
def check_connection() -> bool:
    """Return True if the database is reachable."""
    try:
        with get_engine().connect() as conn:
            conn.execute(text("SELECT 1"))

        return True

    except RuntimeError:
        return False