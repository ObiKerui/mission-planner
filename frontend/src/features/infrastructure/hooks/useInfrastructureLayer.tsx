// import { useEffect, useState } from "react";
// import * as Cesium from "cesium";

// import {
//   getInfrastructureUrl,
//   type InfrastructureLayer,
// } from "../lib/infrastructure";
// import {
//   parseInfrastructureFeature,
//   type InfrastructureFeature,
// } from "../lib/infrastructureFeature";
// import { createInfrastructureStyle } from "../lib/infrastructureStyle";

// interface UseInfrastructureLayerOptions {
//   viewer: Cesium.Viewer | null;
//   infrastructure: InfrastructureLayer | null;
// }

// function destroyProvider(
//   viewer: Cesium.Viewer,
//   provider: Cesium.MVTDataProvider | null,
// ) {
//   if (!provider) {
//     return;
//   }

//   viewer.scene.primitives.remove(provider);

//   provider.tileset?.destroy();
// }

// function pickInfrastructure(
//   viewer: Cesium.Viewer,
//   position: Cesium.Cartesian2,
// ) {
//   const offsets = [
//     [0, 0],
//     [-4, 0],
//     [4, 0],
//     [0, -4],
//     [0, 4],
//     [-8, 0],
//     [8, 0],
//     [0, -8],
//     [0, 8],
//   ];

//   for (const [x, y] of offsets) {
//     const picked = viewer.scene.pick(
//       new Cesium.Cartesian2(position.x + x, position.y + y),
//     );

//     if (
//       picked &&
//       typeof picked.getPropertyIds === "function" &&
//       typeof picked.getProperty === "function"
//     ) {
//       return picked;
//     }
//   }

//   return undefined;
// }

// export function useInfrastructureLayer({
//   viewer,
//   infrastructure,
// }: UseInfrastructureLayerOptions) {
//   const [loading, setLoading] = useState(false);

//   const [selectedFeature, setSelectedFeature] =
//     useState<InfrastructureFeature | null>(null);

//   useEffect(() => {
//     if (!viewer || !infrastructure) {
//       setLoading(false);
//       setSelectedFeature(null);
//       return;
//     }

//     let provider: Cesium.MVTDataProvider | null = null;
//     let cancelled = false;

//     const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

//     handler.setInputAction(
//       (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
//         const picked = pickInfrastructure(viewer, movement.position);

//         if (!picked) {
//           setSelectedFeature(null);
//           return;
//         }

//         const feature = parseInfrastructureFeature(picked);

//         console.log("=== INFRASTRUCTURE PICK ===");
//         console.log(feature);

//         setSelectedFeature(feature);
//       },
//       Cesium.ScreenSpaceEventType.LEFT_CLICK,
//     );

//     /*
//      * Set loading immediately so the UI can react to the
//      * infrastructure selection.
//      */
//     setLoading(true);

//     const loadLayer = async () => {
//       try {
//         const endpoint = getInfrastructureUrl(infrastructure);

//         console.log("Loading infrastructure:", infrastructure);
//         console.log("Endpoint:", endpoint);

//         const loadedProvider = await Cesium.MVTDataProvider.fromUrl(endpoint, {
//           minZoom: 6,
//           maxZoom: 14,
//           extent: Cesium.Rectangle.fromDegrees(-8, 49, 2, 59),
//         });

//         /*
//          * The infrastructure may have changed while the
//          * provider was loading.
//          */
//         if (cancelled) {
//           destroyProvider(viewer, loadedProvider);
//           return;
//         }
//         provider = loadedProvider;

//         if (provider.tileset) {
//           provider.tileset.style = createInfrastructureStyle();
//         }

//         viewer.scene.primitives.add(provider);

//         viewer.scene.requestRender();
//       } catch (error) {
//         if (!cancelled) {
//           console.error("Failed to load infrastructure layer:", error);
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     };

//     /*
//      * Give React/browser an opportunity to render the loading
//      * state before starting the Cesium/MVT work.
//      */
//     const timeoutId = setTimeout(() => {
//       if (!cancelled) {
//         void loadLayer();
//       }
//     }, 0);

//     return () => {
//       cancelled = true;

//       clearTimeout(timeoutId);

//       handler.destroy();

//       setLoading(false);
//       setSelectedFeature(null);

//       destroyProvider(viewer, provider);
//       provider = null;

//       viewer.scene.requestRender();
//     };
//   }, [viewer, infrastructure]);

//   return {
//     loading,
//     selectedFeature,
//   };
// }

import { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";

import {
  getInfrastructureUrl,
  type InfrastructureLayer,
} from "../lib/infrastructure";
import {
  parseInfrastructureFeature,
  type InfrastructureFeature,
} from "../lib/infrastructureFeature";
import { pickInfrastructure } from "../lib/infrastructurePicking";
import { destroyInfrastructureProvider } from "../lib/infrastructureProvider";
import { createInfrastructureStyle } from "../lib/infrastructureStyle";

interface UseInfrastructureLayerOptions {
  viewer: Cesium.Viewer | null;
  infrastructure: InfrastructureLayer | null;
}

export function useInfrastructureLayer({
  viewer,
  infrastructure,
}: UseInfrastructureLayerOptions) {
  const [loading, setLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<InfrastructureFeature | null>(null);

  const hoveredFeatureRef = useRef<Cesium.Cesium3DTileFeature | null>(null);

  const hoveredOriginalColorRef = useRef<Cesium.Color | null>(null);

  useEffect(() => {
    if (!viewer || !infrastructure) {
      setLoading(false);
      setSelectedFeature(null);
      return;
    }

    let provider: Cesium.MVTDataProvider | null = null;
    let cancelled = false;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    const restoreHoveredFeature = () => {
      const feature = hoveredFeatureRef.current;
      const originalColor = hoveredOriginalColorRef.current;

      if (feature && originalColor) {
        feature.color = originalColor;
      }

      hoveredFeatureRef.current = null;
      hoveredOriginalColorRef.current = null;
    };

    const setHoveredFeature = (
      feature: Cesium.Cesium3DTileFeature | undefined,
    ) => {
      if (feature === hoveredFeatureRef.current) {
        return;
      }

      console.log("this happened?");

      restoreHoveredFeature();

      if (!feature) {
        viewer.scene.requestRender();
        return;
      }

      hoveredFeatureRef.current = feature;
      hoveredOriginalColorRef.current = feature.color.clone();

      // feature.color = Cesium.Color.WHITE.withAlpha(1.0);
      feature.color = Cesium.Color.YELLOW.withAlpha(1.0);

      viewer.scene.requestRender();
    };

    handler.setInputAction(
      (movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const picked = pickInfrastructure(viewer, movement.endPosition);

        if (!picked) {
          setHoveredFeature(undefined);
          viewer.scene.canvas.style.cursor = "default";
          return;
        }

        setHoveredFeature(picked);
        viewer.scene.canvas.style.cursor = "pointer";
      },
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
    );

    handler.setInputAction(
      (movement: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = pickInfrastructure(viewer, movement.position);

        if (!picked) {
          setSelectedFeature(null);
          return;
        }

        const feature = parseInfrastructureFeature(picked);

        console.log("=== INFRASTRUCTURE PICK ===");
        console.log(feature);

        setSelectedFeature(feature);
      },
      Cesium.ScreenSpaceEventType.LEFT_CLICK,
    );

    setLoading(true);

    const loadLayer = async () => {
      try {
        const endpoint = getInfrastructureUrl(infrastructure);

        console.log("Loading infrastructure:", infrastructure);
        console.log("Endpoint:", endpoint);

        const loadedProvider = await Cesium.MVTDataProvider.fromUrl(endpoint, {
          minZoom: 6,
          maxZoom: 14,
          extent: Cesium.Rectangle.fromDegrees(-8, 49, 2, 59),
        });

        if (cancelled) {
          destroyInfrastructureProvider(viewer, loadedProvider);
          return;
        }

        provider = loadedProvider;

        if (provider.tileset) {
          provider.tileset.style = createInfrastructureStyle();
        }

        viewer.scene.primitives.add(provider);

        viewer.scene.requestRender();
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load infrastructure layer:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        void loadLayer();
      }
    }, 0);

    return () => {
      cancelled = true;

      clearTimeout(timeoutId);

      handler.destroy();

      restoreHoveredFeature();

      viewer.scene.canvas.style.cursor = "default";

      setLoading(false);
      setSelectedFeature(null);

      destroyInfrastructureProvider(viewer, provider);
      provider = null;

      viewer.scene.requestRender();
    };
  }, [viewer, infrastructure]);

  return {
    loading,
    selectedFeature,
  };
}
