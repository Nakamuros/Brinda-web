/** Forma de `PageResponse<T>` (backend: `catalog/dto/PageResponse.java`). */
export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
