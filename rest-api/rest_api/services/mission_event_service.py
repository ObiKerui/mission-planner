# rest_api/services/mission_event_service.py

import logging
from typing import Any

logger = logging.getLogger(__name__)


class MissionEventService:
    def handle(
        self,
        topic: str,
        payload: dict[str, Any],
    ) -> None:
        logger.info(
            "Mission event received: topic=%s payload=%s",
            topic,
            payload,
        )