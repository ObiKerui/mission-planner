import json
import logging
from typing import Any

import paho.mqtt.client as mqtt

logger = logging.getLogger(__name__)


class MqttService:
    def __init__(
        self,
        host: str,
        port: int,
        topic: str,
        on_message,
    ):
        self.host = host
        self.port = port
        self.topic = topic
        self.on_message = on_message

        self.client = mqtt.Client(
            mqtt.CallbackAPIVersion.VERSION2,
        )
        
    def start(self) -> None:
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message

        self.client.connect(
            self.host,
            self.port,
        )

        self.client.loop_start()

    def stop(self) -> None:
        self.client.loop_stop()
        self.client.disconnect()

    def _on_connect(
        self,
        client: mqtt.Client,
        userdata: Any,
        flags: Any,
        reason_code: Any,
        properties: Any,
    ) -> None:
        if reason_code.is_failure:
            logger.error(
                "MQTT connection failed: %s",
                reason_code,
            )
            return

        logger.info(
            "Connected to MQTT broker %s:%s",
            self.host,
            self.port,
        )

        client.subscribe(self.topic)

        logger.info(
            "Subscribed to MQTT topic: %s",
            self.topic,
        )

    def _on_message(
        self,
        client: mqtt.Client,
        userdata: Any,
        message: mqtt.MQTTMessage,
    ) -> None:
        try:
            payload = json.loads(
                message.payload.decode("utf-8")
            )
        except (UnicodeDecodeError, json.JSONDecodeError):
            logger.warning(
                "Received invalid JSON on MQTT topic %s",
                message.topic,
            )
            return

        logger.info(
            "Received MQTT event on %s: %s",
            message.topic,
            payload,
        )