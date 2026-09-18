import { queries } from "./queries";
import type { ListFilters } from "./types";
import { useByUserId, usePaginated } from "./queries";
import { UIProvider, useUIStore } from "./stores";

export function useObservations(filters?: ListFilters) {
  return queries.useList(filters);
}

export function useObservation(id: string | null) {
  return queries.useOne(id);
}

export function useObservationMutations() {
  return {
    create: queries.useCreate(),
    update: queries.useUpdate(),
    remove: queries.useDelete(),
  };
}

export {
  useByUserId as useObservationsByUserId,
  usePaginated as useObservationsPaginated,
};
export {
  UIProvider as ObservationsUIProvider,
  useUIStore as useObservationsUIStore,
};
export { columns as observationColumns } from "./columns";
