import { queries } from "./queries";
import type { ListFilters } from "./types";
import { usePaginated } from "./queries";
import { UIProvider, useUIStore } from "./stores";

export function useDetections(filters?: ListFilters) {
  return queries.useList(filters);
}

export function useDetection(id: string | null) {
  return queries.useOne(id);
}

export function useDetectionMutations() {
  return {
    create: queries.useCreate(),
    update: queries.useUpdate(),
    remove: queries.useDelete(),
  };
}

export { usePaginated as useDetectionsPaginated };
export {
  UIProvider as DetectionsUIProvider,
  useUIStore as useDetectionsUIStore,
};
export { columns as detectionsColumns } from "./columns";
