import { useEffect, useRef } from "react";
import { useCesium } from "../hooks/useCesium";
import * as Cesium from "cesium";

Cesium.Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

export default function CesiumCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { setViewer } = useCesium();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.width = "100%";
    container.style.height = "100%";

    const viewer = new Cesium.Viewer(container, {
      animation: true,
      timeline: true,
      geocoder: true,
      baseLayerPicker: true,
      fullscreenButton: true,
      homeButton: true,
      sceneModePicker: true,
      navigationHelpButton: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      selectionIndicator: false,
      infoBox: false,
    });

    viewer.scene.fog.enabled = true;
    viewer.scene.globe.enableLighting = true;
    viewer.shadows = true;

    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-5, 50, 600000),
    });

    viewer.scene.requestRender();

    setViewer(viewer);

    return () => {
      setViewer(null);
      viewer.destroy();
    };
  }, []);

  return <div ref={containerRef} className="relative h-full w-full" />;
}
