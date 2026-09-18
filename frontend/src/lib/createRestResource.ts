import { apiClient } from "./apiClient";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaginatedParams {
  skip: number;
  limit: number;
}

export function createRestResource<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
>(resource: string, extensions: Record<string, unknown> = {}) {
  const base = `/${resource}`;

  return {
    list: (params?: object) =>
      apiClient.get<T[]>(base, { params }).then((r) => r.data),
    listPaginated: (params: PaginatedParams & object) =>
      apiClient.get<PaginatedResponse<T>>(base, { params }).then((r) => r.data),
    get: (id: string) => apiClient.get<T>(`${base}/${id}`).then((r) => r.data),
    create: (body: TCreate) =>
      apiClient.post<T>(base, body).then((r) => r.data),
    update: (id: string, body: TUpdate) =>
      apiClient.patch<T>(`${base}/${id}`, body).then((r) => r.data),
    remove: (id: string) =>
      apiClient.delete<void>(`${base}/${id}`).then((r) => r.data),

    ...extensions,
  };
}
