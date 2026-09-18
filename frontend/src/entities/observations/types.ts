export interface Observation {
  id: string;

  // Observation timing
  observedAt: string;
  exposureSeconds: number;

  // Target / pointing
  targetName?: string;
  rightAscension: number;
  declination: number;

  // Instrument
  telescope?: string;
  instrument?: string;
  filter?: string;

  // Image properties
  width: number;
  height: number;
  pixelScaleArcsec?: number;

  // Source file
  filename: string;
  fileSizeBytes?: number;

  // Processing state
  status: ObservationStatus;
}

export type ObservationStatus = "imported" | "processing" | "ready" | "failed";

export interface ListFilters {
  user_id?: string;
}
