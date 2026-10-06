import { useEffect } from "react";

import { useMapSettingsStore } from "@/features/map/stores/useMapSettings";
import { useMapLayers } from "../hooks/useMapLayers";

export function MapLayersController() {
  const baseMap = useMapSettingsStore((state) => state.baseMap);
  const { applyBaseMap } = useMapLayers();

  useEffect(() => {
    applyBaseMap(baseMap);
  }, [baseMap, applyBaseMap]);

  return null;
}
