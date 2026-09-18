import { useQueryClient } from "@tanstack/react-query";
import type { QueryKeys } from "./createQueryKeys";
import { useMqtt } from "./mqttClient";
import { useEffect } from "react";

export function useEntityRealtimeSync(
  keys: QueryKeys,
  topic: string,
  extractId?: (topic: string) => string | undefined,
) {
  const { subscribe, ready } = useMqtt();
  const qc = useQueryClient();

  (useEffect(() => {
    if (!ready) {
      return;
    }

    return subscribe(topic, (_payload, messageTopic) => {
      const id = extractId?.(messageTopic);

      if (id) {
        qc.invalidateQueries({
          queryKey: keys.detail(id),
        });
      }

      qc.invalidateQueries({
        queryKey: keys.list(),
      });
    });
  }),
    [ready, subscribe, qc, topic, keys, extractId]);
}
