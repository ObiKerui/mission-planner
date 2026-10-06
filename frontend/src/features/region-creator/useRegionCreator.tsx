import { useCallback, useEffect, useRef, useState } from "react";
import {
  Cartesian2,
  Cartesian3,
  Cartographic,
  Color,
  Entity,
  Math as CesiumMath,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from "cesium";

export type RegionCoordinate = {
  longitude: number;
  latitude: number;
};

export type Region = {
  coordinates: RegionCoordinate[];
};

export type UseRegionDrawerOptions = {
  viewer: Cesium.Viewer | null;
  enabled?: boolean;
  onComplete?: (region: Region) => void;
};

export function useRegionDrawer({
  viewer,
  enabled = false,
  onComplete,
}: UseRegionDrawerOptions) {
  const handlerRef = useRef<ScreenSpaceEventHandler | null>(null);

  const vertexEntitiesRef = useRef<Entity[]>([]);
  const polygonEntityRef = useRef<Entity | null>(null);
  const polylineEntityRef = useRef<Entity | null>(null);

  const positionsRef = useRef<Cartesian3[]>([]);

  const [positions, setPositions] = useState<Cartesian3[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  /**
   * Keep the ref in sync with React state.
   */
  const updatePositions = useCallback((next: Cartesian3[]) => {
    positionsRef.current = next;
    setPositions(next);
  }, []);

  /**
   * Convert Cesium Cartesian3 positions into lon/lat coordinates.
   */
  const positionsToCoordinates = useCallback(
    (positions: Cartesian3[]): RegionCoordinate[] => {
      return positions.map((position) => {
        const cartographic = Cartographic.fromCartesian(position);

        return {
          longitude: CesiumMath.toDegrees(cartographic.longitude),
          latitude: CesiumMath.toDegrees(cartographic.latitude),
        };
      });
    },
    [],
  );

  /**
   * Pick a position on the globe.
   */
  const pickPosition = useCallback(
    (screenPosition: Cartesian2): Cartesian3 | undefined => {
      if (!viewer) {
        return undefined;
      }

      const scene = viewer.scene;

      // Try depth picking first if supported.
      if (scene.pickPositionSupported) {
        const picked = scene.pickPosition(screenPosition);

        if (picked) {
          return picked;
        }
      }

      // Fall back to picking against the globe.
      const ray = viewer.camera.getPickRay(screenPosition);

      if (!ray) {
        return undefined;
      }

      return scene.globe.pick(ray, scene) ?? undefined;
    },
    [viewer],
  );

  /**
   * Remove all temporary Cesium entities.
   */
  const removeEntities = useCallback(() => {
    if (!viewer) {
      return;
    }

    for (const entity of vertexEntitiesRef.current) {
      viewer.entities.remove(entity);
    }

    vertexEntitiesRef.current = [];

    if (polygonEntityRef.current) {
      viewer.entities.remove(polygonEntityRef.current);
      polygonEntityRef.current = null;
    }

    if (polylineEntityRef.current) {
      viewer.entities.remove(polylineEntityRef.current);
      polylineEntityRef.current = null;
    }
  }, [viewer]);

  /**
   * Rebuild the visual representation of the region.
   */
  const updateEntities = useCallback(
    (nextPositions: Cartesian3[]) => {
      if (!viewer) {
        return;
      }

      removeEntities();

      // Vertex handles
      vertexEntitiesRef.current = nextPositions.map((position) =>
        viewer.entities.add({
          position,

          point: {
            pixelSize: 10,
            color: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
          },
        }),
      );

      // Connecting line
      if (nextPositions.length >= 2) {
        polylineEntityRef.current = viewer.entities.add({
          polyline: {
            positions: nextPositions,
            width: 3,
            material: Color.CYAN,
            clampToGround: true,
          },
        });
      }

      // Polygon
      if (nextPositions.length >= 3) {
        polygonEntityRef.current = viewer.entities.add({
          polygon: {
            hierarchy: nextPositions,
            material: Color.CYAN.withAlpha(0.3),
            outline: true,
            outlineColor: Color.CYAN,
          },
        });
      }
    },
    [viewer, removeEntities],
  );

  /**
   * Add a point to the region.
   */
  const addPoint = useCallback(
    (position: Cartesian3) => {
      const nextPositions = [...positionsRef.current, position];

      updatePositions(nextPositions);
      updateEntities(nextPositions);

      setIsDrawing(true);
    },
    [updatePositions, updateEntities],
  );

  /**
   * Finish the current region.
   */
  const finish = useCallback(() => {
    const currentPositions = positionsRef.current;

    if (currentPositions.length < 3) {
      return;
    }

    const region: Region = {
      coordinates: positionsToCoordinates(currentPositions),
    };

    onComplete?.(region);

    setIsDrawing(false);
  }, [onComplete, positionsToCoordinates]);

  /**
   * Cancel the current drawing.
   */
  const cancel = useCallback(() => {
    updatePositions([]);
    removeEntities();
    setIsDrawing(false);
  }, [updatePositions, removeEntities]);

  /**
   * Remove the last point.
   */
  const undo = useCallback(() => {
    const currentPositions = positionsRef.current;

    if (currentPositions.length === 0) {
      return;
    }

    const nextPositions = currentPositions.slice(0, -1);

    updatePositions(nextPositions);
    updateEntities(nextPositions);

    if (nextPositions.length === 0) {
      setIsDrawing(false);
    }
  }, [updatePositions, updateEntities]);

  /**
   * Clear the region.
   */
  const clear = useCallback(() => {
    updatePositions([]);
    removeEntities();
    setIsDrawing(false);
  }, [updatePositions, removeEntities]);

  /**
   * Mouse/keyboard handlers.
   */
  useEffect(() => {
    if (!viewer || !enabled) {
      return;
    }

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handlerRef.current = handler;

    /**
     * Left click = add point.
     */
    handler.setInputAction((movement: { position: Cartesian2 }) => {
      const position = pickPosition(movement.position);

      if (!position) {
        return;
      }

      addPoint(position);
    }, ScreenSpaceEventType.LEFT_CLICK);

    /**
     * Escape = cancel.
     *
     * Backspace = undo.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancel();
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      handler.destroy();
      handlerRef.current = null;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewer, enabled, pickPosition, addPoint, cancel, undo]);

  /**
   * Remove Cesium entities when the hook is unmounted
   * or the viewer changes.
   */
  useEffect(() => {
    return () => {
      if (!viewer) {
        return;
      }

      for (const entity of vertexEntitiesRef.current) {
        viewer.entities.remove(entity);
      }

      vertexEntitiesRef.current = [];

      if (polygonEntityRef.current) {
        viewer.entities.remove(polygonEntityRef.current);
        polygonEntityRef.current = null;
      }

      if (polylineEntityRef.current) {
        viewer.entities.remove(polylineEntityRef.current);
        polylineEntityRef.current = null;
      }
    };
  }, [viewer]);

  return {
    positions,
    coordinates: positionsToCoordinates(positions),
    isDrawing,
    vertexCount: positions.length,

    finish,
    cancel,
    undo,
    clear,
  };
}
