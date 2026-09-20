import { useCallback, useEffect, useRef } from "react";
import mqtt from "mqtt";
import type { MqttClient } from "mqtt";

type MqttPayload = unknown;

type MqttMessageHandler = (topic: string, payload: MqttPayload) => void;

interface UseMqttOptions {
  url: string;
  topics: string | string[];
  onMessage: MqttMessageHandler;
  autoConnect?: boolean;
}

export function useMqtt({
  url,
  topics,
  onMessage,
  autoConnect = true,
}: UseMqttOptions) {
  const clientRef = useRef<MqttClient | null>(null);
  const onMessageRef = useRef(onMessage);

  // Keep the latest callback without causing the MQTT
  // connection to be recreated when the callback changes.
  onMessageRef.current = onMessage;

  const subscribe = useCallback(
    (client: MqttClient) => {
      const topicList = Array.isArray(topics) ? topics : [topics];

      topicList.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error(`MQTT subscribe error for "${topic}":`, err);
          }
        });
      });
    },
    [topics],
  );

  useEffect(() => {
    if (!autoConnect) {
      return;
    }

    const client = mqtt.connect(url);

    clientRef.current = client;

    client.on("connect", () => {
      console.log("MQTT connected");
      subscribe(client);
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());

        onMessageRef.current(topic, payload);
      } catch (err) {
        console.error("MQTT message parse error:", err);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    client.on("close", () => {
      console.log("MQTT connection closed");
    });

    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, [url, subscribe, autoConnect]);

  return clientRef;
}
