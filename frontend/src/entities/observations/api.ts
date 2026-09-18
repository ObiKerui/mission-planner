import { apiClient } from "@/lib/apiClient";
import { createRestResource } from "@/lib/createRestResource";
import type { Observation } from "./types";

export const api = {
  ...createRestResource<Observation>("observations"),

  listByUserId: (userId: string) =>
    apiClient
      .get<Observation[]>(`/users/${userId}/observations`)
      .then((r) => r.data),
};
