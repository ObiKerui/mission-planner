import { useCesium } from "@/features/map/hooks/useCesium";
import { useMapSettingsStore } from "@/features/map/stores/useMapSettings";

import { useInfrastructureLayer } from "../hooks/useInfrastructureLayer";
import { useEffect } from "react";

export function InfrastructureLayer() {
  const { getViewer } = useCesium();

  const infrastructure = useMapSettingsStore((state) => state.infrastructure);
  const setInfrastructureState = useMapSettingsStore(
    (state) => state.setInfrastructureState,
  );

  const viewer = getViewer();

  const { loading, selectedFeature } = useInfrastructureLayer({
    viewer,
    infrastructure,
  });

  /*
   * The selected feature will eventually be passed to the
   * infrastructure details panel.
   */
  void selectedFeature;

  /*
   * Loading will eventually be consumed by the map controls
   * so the active infrastructure button can show a spinner.
   */
  useEffect(() => {
    setInfrastructureState(loading ? "loading" : "ready");
  }, [loading, setInfrastructureState]);

  return null;
}
