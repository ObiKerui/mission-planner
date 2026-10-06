import { createScopedImmerStore } from "@/lib/createScopedStore";

export const baseMapLayers = ["smooth", "stadia"] as const;

export type BaseMapLayer = (typeof baseMapLayers)[number];

export const infrastructureLayers = [
  "power",
  "telecoms",
  "petroleum",
  "water",
  "solar_heatmap",
  "other_pipeline",
] as const;

export const infrastructureState = ["ready", "loading", "error"] as const;

type InfrastructureState = (typeof infrastructureState)[number];

export type InfrastructureLayer = (typeof infrastructureLayers)[number];

export interface MapSettingsState {
  baseMap: BaseMapLayer | null;
  infrastructure: InfrastructureLayer | null;
  infrastructureState: InfrastructureState;

  setBaseMap: (layer: BaseMapLayer | null) => void;

  setInfrastructure: (layer: InfrastructureLayer | null) => void;

  setInfrastructureState: (state: InfrastructureState) => void;
}

export const {
  Provider: MapSettingsProvider,
  useScopedStore: useMapSettingsStore,
} = createScopedImmerStore<MapSettingsState>((set) => ({
  baseMap: null,
  infrastructure: null,
  infrastructureState: "ready",

  setBaseMap: (layer) =>
    set((state) => {
      state.baseMap = layer;
    }),

  setInfrastructure: (layer) =>
    set((state) => {
      state.infrastructure = layer;
    }),

  setInfrastructureState: (state) =>
    set((s) => {
      s.infrastructureState = state;
    }),
}));
