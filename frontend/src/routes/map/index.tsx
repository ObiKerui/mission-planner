import { InfrastructureLayer } from "@/features/infrastructure/components/InfrastructureLayer";
import { MapLayersController } from "@/features/map-layers/components/MapLayersController";
import CesiumCanvas from "@/features/map/components/CesiumCanvas";
import { LayersPanel } from "@/features/map/components/LayersPanel";
import { MapOverlay } from "@/features/map/components/MapOverlay";
import { MapSidePanel } from "@/features/map/components/MapSidePanel";
import {
  MapToolbar,
  type tMapPanel,
} from "@/features/map/components/MapToolbar";
import { MapViewport } from "@/features/map/components/MapViewport";
import { CesiumProvider } from "@/features/map/providers/CesiumProvider";
import { MapSettingsProvider } from "@/features/map/stores/useMapSettings";
import { createFileRoute } from "@tanstack/react-router";
import { LayersIcon, WaypointsIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/map/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [activePanel, setActivePanel] = useState<tMapPanel | null>(null);

  return (
    <MapSettingsProvider>
      <CesiumProvider>
        <MapViewport>
          <CesiumCanvas />
          {/* <RegionCanvas /> */}
          <InfrastructureLayer />
          <MapLayersController />

          <MapOverlay>
            <MapToolbar
              items={[
                { id: "layers", label: "", icon: <LayersIcon /> },
                { id: "planning", label: "", icon: <WaypointsIcon /> },
                { id: "mission", label: "" },
              ]}
              activeItem={activePanel}
              onItemClick={(id) =>
                setActivePanel((current) => (current === id ? null : id))
              }
            />

            <MapSidePanel
              side="left"
              open={activePanel === "planning"}
              className="w-[80vw] max-w-6xl"
            >
              <div className="bg-background h-[80vh] w-full overflow-hidden rounded-lg border shadow-lg">
                {/* <ReactFlowProvider> */}
                {/* <RuleFlow definition={data.definition} flowId={externalId} /> */}
                {/* </ReactFlowProvider> */}
              </div>
            </MapSidePanel>

            <MapSidePanel
              side="left"
              open={activePanel === "layers"}
              className="w-96"
            >
              <LayersPanel />
            </MapSidePanel>

            <MapSidePanel
              side="right"
              open={activePanel === "mission"}
              className="w-96"
            >
              <div className="bg-background rounded-lg border p-4 shadow-lg">
                Mission controls
              </div>
            </MapSidePanel>
          </MapOverlay>
        </MapViewport>
      </CesiumProvider>
    </MapSettingsProvider>
  );
}
