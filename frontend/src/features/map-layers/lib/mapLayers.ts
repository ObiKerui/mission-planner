// features/map-layers/lib/mapLayers.ts

export type MapLayer = "smooth" | "stadia";

export interface MapLayerDefinition {
  id: MapLayer;
  label: string;
}

export const MAP_LAYERS: MapLayerDefinition[] = [
  {
    id: "smooth",
    label: "Smooth",
  },
  {
    id: "stadia",
    label: "Stadia",
  },
];
