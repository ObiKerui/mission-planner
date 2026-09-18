import { queries } from "./queries";

import type { {{Singular}}, ListFilters } from "./types";

import { useByUserId, usePaginated } from "./queries";

import { UIProvider, useUIStore } from "./stores";

export function use{{Singular}}s(filters?: ListFilters) {
  return queries.useList(filters);
}

export function use{{Singular}}(id: string | null) {
  return queries.useOne(id);
}

export function use{{Singular}}Mutations() {
  return {
    create: queries.useCreate(),
    update: queries.useUpdate(),
    remove: queries.useDelete(),
  };
}

export {
  useByUserId as use{{Singular}}ByUserId,
  usePaginated as use{{Singular}}Paginated,
};

export {
  UIProvider as {{Singular}}UIProvider,
  useUIStore as use{{Singular}}UIStore,
};

export { columns as {{singular}}Columns } from "./columns";

export type { {{Singular}} };