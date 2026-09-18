import { apiClient } from "@/lib/apiClient";
import { createRestResource } from "@/lib/createRestResource";
import type { {{Singular}} } from "./types";

export const api = {
  ...createRestResource<{{Singular}}>("{{plural}}"),

  listByUserId: (userId: string) =>
    apiClient
      .get<{{Singular}}[]>(`/users/${userId}/{{plural}}`)
      .then((r) => r.data),
};
