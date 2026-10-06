import * as Cesium from "cesium";

import type { BaseMapLayer } from "@/features/map/stores/useMapSettings";

export function createBaseMapProvider(
  layer: Exclude<BaseMapLayer, null>,
  theme: string,
): Cesium.ImageryProvider {
  const theme_profile = "alidade_smooth_dark"; // TODO: Make this configurable
  switch (layer) {
    case "smooth":
      return new Cesium.UrlTemplateImageryProvider({
        url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}@2x.png?apikey=${import.meta.env.VITE_CARTO_API_KEY}`,
        credit: "BaseMaps",
      });

    case "stadia":
      return new Cesium.UrlTemplateImageryProvider({
        url: `https://tiles.stadiamaps.com/tiles/${theme_profile}/{z}/{x}/{y}.png?api_key=${import.meta.env.VITE_STADIA_API_KEY}`,
        credit: "Stadia Maps",
      });
  }
}
