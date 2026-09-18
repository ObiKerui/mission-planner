import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createQueryKeys } from "./createQueryKeys";
import type { createRestResource, PaginatedParams } from "./createRestResource";

export function createEntityQueries<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
>(
  resource: string,
  api: ReturnType<typeof createRestResource<T, TCreate, TUpdate>>,
) {
  const keys = createQueryKeys(resource);

  return {
    keys,

    useList: (params?: object) =>
      useQuery({
        queryKey: keys.list(params),
        queryFn: () => api.list(params),
        refetchInterval: 3000,
      }),
    useOne: (id: string | null) =>
      useQuery({
        queryKey: keys.detail(id),
        queryFn: () => api.get(id!),
        enabled: !!id,
        refetchInterval: 3000,
      }),
    usePaginatedList: (params: PaginatedParams & object) =>
      useQuery({
        queryKey: keys.list(params),
        queryFn: () => api.listPaginated(params),
        placeholderData: keepPreviousData,
      }),
    useCreate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: (body: TCreate) => api.create(body),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: keys.lists() });
        },
      });
    },
    useUpdate: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: ({ id, body }: { id: string; body: TUpdate }) =>
          api.update(id, body),
        onSuccess: (_data, variables) => {
          qc.invalidateQueries({ queryKey: keys.lists() });
          qc.invalidateQueries({ queryKey: keys.detail(variables.id) });
        },
      });
    },
    useDelete: () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: (id: string) => api.remove(id),
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: keys.lists() });
        },
      });
    },
  };
}
