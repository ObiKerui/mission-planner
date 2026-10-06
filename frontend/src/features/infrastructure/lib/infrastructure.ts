export const infrastructureLayers = [
  "power",
  "petroleum",
  "telecoms",
  "water",
  "solar_heatmap",
  "other_pipeline",
] as const;

export type InfrastructureLayer = (typeof infrastructureLayers)[number];

export function getInfrastructureUrl(type: InfrastructureLayer) {
  return `https://openinframap.org/map/${type}/{z}/{x}/{y}.pbf`;
}
