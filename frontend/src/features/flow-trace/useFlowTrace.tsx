import { useCallback, useEffect, useRef, useState } from "react";
import { useMqtt } from "@/lib/mqttClient";
import type { TraceEvent } from "./types";

const FADE_MS = 600;
const TOPIC = "nodered/trace";

export function useFlowTrace(flowId?: string) {
  const { subscribe, ready } = useMqtt();
  const [activeAt, setActiveAt] = useState<Record<string, number>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleMessage = useCallback(
    (payload: unknown, _messageTopic: string) => {
      const ev = payload as TraceEvent;

      if (flowId && ev.z !== flowId) return;
      if (ev.phase !== "enter") return;

      setActiveAt((prev) => ({ ...prev, [ev.nodeId]: ev.t }));

      clearTimeout(timers.current[ev.nodeId]);
      timers.current[ev.nodeId] = setTimeout(() => {
        setActiveAt((prev) => {
          const next = { ...prev };
          delete next[ev.nodeId];
          return next;
        });
      }, FADE_MS);
    },
    [flowId],
  );

  useEffect(() => {
    if (!ready) return;
    return subscribe(TOPIC, handleMessage);
  }, [ready, subscribe, handleMessage]);

  return activeAt; // { [nodeId]: lastEnterTimestamp }
}
