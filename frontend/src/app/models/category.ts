/** Forma de `CategoryResponse` (backend/ENDPOINTS.md). */
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  active: boolean;
  displayOrder: number;
}
