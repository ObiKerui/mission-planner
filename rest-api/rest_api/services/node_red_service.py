from typing import Any

import httpx


class NodeRedService:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")

    def deploy_flow(
        self,
        flow: list[dict[str, Any]],
    ) -> None:
        response = httpx.post(
            f"{self.base_url}/flows",
            json=flow,
        )

        response.raise_for_status()