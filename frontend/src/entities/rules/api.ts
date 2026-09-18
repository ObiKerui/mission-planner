import { apiClient } from "@/lib/apiClient";
import { createRestResource } from "@/lib/createRestResource";
import type { Rule } from "./types";

export const api = {
  ...createRestResource<Rule>("rules"),

  listByUserId: (userId: string) =>
    apiClient
      .get<Rule[]>(`/users/${userId}/rules`)
      .then((r) => r.data),
};
