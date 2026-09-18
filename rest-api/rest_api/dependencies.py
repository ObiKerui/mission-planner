from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from database.database import get_session

DbSession = Annotated[
    Session,
    Depends(get_session),
]
