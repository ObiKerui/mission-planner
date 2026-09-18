/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import mqtt, { type MqttClient } from "mqtt";

type MessageHandler = (payload: unknown, topic: string) => void;

interface MqttContextValue {
  subscribe: (topic: string, handler: MessageHandler) => () => void;
  ready: boolean;
}

const MqttContext = createContext<MqttContextValue | null>(null);

export function MqttProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<MqttClient | null>(null);
  const handlersRef = useRef(new Map<string, Set<MessageHandler>>());

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const client = mqtt.connect(import.meta.env.VITE_MQTT_BROKER_URL);
    const handlers = handlersRef.current;

    clientRef.current = client;

    client.on("connect", () => {
      setReady(true);
    });

    client.on("close", () => {
      setReady(false);
    });

    client.on("message", (topic, message) => {
      let payload: unknown;

      try {
        payload = JSON.parse(message.toString());
      } catch {
        payload = message.toString();
      }

      handlers.forEach((topicHandlers, pattern) => {
        if (topicMatches(pattern, topic)) {
          topicHandlers.forEach((handler) => {
            handler(payload, topic);
          });
        }
      });
    });

    return () => {
      setReady(false);
      handlers.clear();

      client.end(true);
      clientRef.current = null;
    };
  }, []);

  function subscribe(topic: string, handler: MessageHandler) {
    const client = clientRef.current;

    if (!client || !ready) {
      throw new Error("MQTT client is not ready");
    }

    if (!handlersRef.current.has(topic)) {
      handlersRef.current.set(topic, new Set());
      client.subscribe(topic);
    }

    handlersRef.current.get(topic)!.add(handler);

    return () => {
      const handlers = handlersRef.current.get(topic);

      handlers?.delete(handler);

      if (handlers && handlers.size === 0) {
        handlersRef.current.delete(topic);
        client.unsubscribe(topic);
      }
    };
  }

  return (
    <MqttContext.Provider value={{ subscribe, ready }}>
      {children}
    </MqttContext.Provider>
  );
}

export function useMqtt() {
  const context = useContext(MqttContext);

  if (!context) {
    throw new Error("useMqtt must be used inside MqttProvider");
  }

  return context;
}

function topicMatches(pattern: string, topic: string): boolean {
  const p = pattern.split("/");
  const t = topic.split("/");
  for (let i = 0; i < p.length; i++) {
    if (p[i] === "#") return true;
    if (p[i] !== "+" && p[i] !== t[i]) return false;
  }
  return p.length === t.length;
}
