// import { apiClient } from "@/lib/apiClient";
import { createRestResource } from "@/lib/createRestResource";
import type { Detection } from "./types";

export const api = {
  ...createRestResource<Detection>("detections"),

  // listByUserId: (userId: string) =>
  //   apiClient
  //     .get<Observation[]>(`/users/${userId}/observations`)
  //     .then((r) => r.data),
};
