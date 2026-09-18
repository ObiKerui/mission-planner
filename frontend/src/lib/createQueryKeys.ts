export function createQueryKeys(resource: string) {
  return {
    all: [resource] as const,
    lists: () => [resource, "list"] as const,
    list: (filters?: object) => [resource, "list", filters ?? {}] as const,
    details: () => [resource, "detail"] as const,
    detail: (id: string | null) => [resource, "detail", id] as const,
  };
}

export type QueryKeys = ReturnType<typeof createQueryKeys>;
