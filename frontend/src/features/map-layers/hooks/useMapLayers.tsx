import { useCallback, useRef } from "react";
import * as Cesium from "cesium";

import { useTheme } from "@/components/themeProvider";
import { useCesium } from "@/features/map/hooks/useCesium";
import type { BaseMapLayer } from "@/features/map/stores/useMapSettings";
import { createBaseMapProvider } from "../lib/mapLayersProvider";

export function useMapLayers() {
  const { viewer } = useCesium();
  const { theme } = useTheme();

  const baseMapLayerRef = useRef<Cesium.ImageryLayer | null>(null);

  const applyBaseMap = useCallback(
    (layer: BaseMapLayer | null) => {
      if (!viewer) {
        return;
      }

      // Remove only the base map that this hook owns.
      if (baseMapLayerRef.current) {
        viewer.imageryLayers.remove(baseMapLayerRef.current, true);
        baseMapLayerRef.current = null;
      }

      // null means "use the default Cesium imagery".
      if (layer === null) {
        return;
      }

      const provider = createBaseMapProvider(layer, theme);

      baseMapLayerRef.current =
        viewer.imageryLayers.addImageryProvider(provider);
    },
    [viewer, theme],
  );

  return {
    applyBaseMap,
  };
}
