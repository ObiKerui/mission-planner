import { createEntityQueries } from "@/lib/createEntityQueries";
import type { ListFilters, Detection } from "./types";
import { api } from "./api";
import { useEntityRealtimeSync } from "@/lib/useEntityRealtimeSync";

export const queries = createEntityQueries<Detection>("detections", api);

export function usePaginated(
  params: { skip: number; limit: number } & ListFilters,
) {
  return queries.usePaginatedList(params);
}

export function useRealtimeSync() {
  useEntityRealtimeSync(
    queries.keys,
    "observations/+/status",
    (topic) => topic.split("/")[1],
  );
}
