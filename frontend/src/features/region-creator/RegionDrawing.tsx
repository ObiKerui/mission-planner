import { Button } from "@/components/ui/button";
import { useCesium } from "../map/hooks/useCesium";
import { useRegionDrawer } from "./useRegionCreator";

export function RegionCanvas() {
  const { viewer } = useCesium();

  const regionDrawer = useRegionDrawer({
    viewer,
    enabled: true,

    onComplete: (region) => {
      console.log("Region:", region);

      /*
      Example:

      {
        coordinates: [
          {
            longitude: -1.3921,
            latitude: 54.9062,
          },
          {
            longitude: -1.3812,
            latitude: 54.9062,
          },
          {
            longitude: -1.3812,
            latitude: 54.9121,
          },
          {
            longitude: -1.3921,
            latitude: 54.9121,
          }
        ]
      }
      */
    },
  });

  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2">
      <Button
        onClick={regionDrawer.undo}
        disabled={regionDrawer.vertexCount === 0}
      >
        Undo
      </Button>

      <Button
        onClick={regionDrawer.finish}
        disabled={regionDrawer.vertexCount < 3}
      >
        Finish
      </Button>

      <Button
        onClick={regionDrawer.clear}
        disabled={regionDrawer.vertexCount === 0}
      >
        Clear
      </Button>
    </div>
  );
}
