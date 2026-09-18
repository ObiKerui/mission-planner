export interface Detection {
  id: string;
  image_id: string;
  ra_deg: number | null;
  dec_deg: number | null;
  x: number | null;
  y: number | null;
  confidence: number | null;
  class_name: string | null;
  pixel_count: number | null;
}

export interface ListFilters {
  user_id?: string;
}
