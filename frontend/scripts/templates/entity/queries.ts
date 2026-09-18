import { createEntityQueries } from "@/lib/createEntityQueries";
import type { ListFilters, {{Singular}} } from "./types";
import { api } from "./api";
import { useQuery } from "@tanstack/react-query";
import { useEntityRealtimeSync } from "@/lib/useEntityRealtimeSync";

export const queries = createEntityQueries<{{Singular}}>("{{plural}}", api);

export function usePaginated(
  params: { skip: number; limit: number } & ListFilters,
) {
  return queries.usePaginatedList(params);
}

export function useByUserId(userId: string) {
  return useQuery({
    queryKey: queries.keys.list({ userId }),
    queryFn: () => api.listByUserId(userId),
    enabled: !!userId,
  });
}

export function useRealtimeSync() {
  useEntityRealtimeSync(
    queries.keys,
    "{{plural}}/+/status",
    (topic) => topic.split("/")[1],
  );
}
