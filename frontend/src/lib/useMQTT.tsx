// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useEffect, useRef, useCallback } from "react";
import mqtt from "mqtt";
import type { MqttClient } from "mqtt";
// import type { MQTTMessage} from '@/tyupes'

type MqttMessageHandler = (topic: string, payload: any) => void;

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
  const subscribe = useCallback(
    (client: MqttClient) => {
      const topicList = Array.isArray(topics) ? topics : [topics];

      topicList.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (err) {
            console.error("MQTT subscribe error:", err);
          }
        });
      });
    },
    [topics],
  );

  useEffect(() => {
    if (!autoConnect) return;

    const client = mqtt.connect(url);
    clientRef.current = client;

    client.on("connect", () => {
      console.log("MQTT connected");
      subscribe(client);
    });
    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        // Parse nested JSON field
        if (typeof payload.results === "string") {
          payload.results = JSON.parse(payload.results);
        }
        console.log(typeof payload, payload.results);
        onMessage(topic, payload as MQTTMessage);
      } catch (err) {
        console.error("MQTT message parse error:", err);
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });

    return () => {
      client.end(true);
      clientRef.current = null;
    };
  }, [url, subscribe, onMessage, autoConnect]);

  return clientRef;
}
