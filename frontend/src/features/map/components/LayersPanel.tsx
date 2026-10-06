import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { IconButton } from "@/components/ui/IconButton";
import {
  DropletsIcon,
  FuelIcon,
  Loader2,
  PhoneIcon,
  UtilityPoleIcon,
} from "lucide-react";
import { useMapSettingsStore } from "../stores/useMapSettings";

export function LayersPanel() {
  const {
    infrastructure,
    setInfrastructure,
    infrastructureState,
    baseMap,
    setBaseMap,
  } = useMapSettingsStore((state) => state);
  return (
    <div className="bg-background/80 pointer-events-auto rounded-lg border p-4 shadow-lg backdrop-blur-sm">
      <div className="space-y-4">
        <FieldSet className="rounded-lg border p-4">
          <FieldLegend>Layers</FieldLegend>

          <FieldDescription>
            Configure the map layers and overlays.
          </FieldDescription>

          <FieldGroup>
            <div className="flex gap-2">
              <IconButton
                tooltip="Smooth"
                variant={baseMap === "smooth" ? "default" : "secondary"}
                onClick={() => setBaseMap("smooth")}
              >
                Smooth
              </IconButton>

              <IconButton
                tooltip="Stadia"
                variant={baseMap === "stadia" ? "default" : "secondary"}
                onClick={() => setBaseMap("stadia")}
              >
                Stadia
              </IconButton>
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-lg border p-4">
          <FieldLegend>Infrastructure</FieldLegend>

          <FieldDescription className="flex flex-col">
            <span>Show infrastructure data on the map.</span>
          </FieldDescription>
          <div className="flex gap-2 pt-2">
            {/* Power Lines */}
            <IconButton
              tooltip="power lines"
              variant={infrastructure === "power" ? "default" : "secondary"}
              onClick={() =>
                infrastructure === "power"
                  ? setInfrastructure(null)
                  : setInfrastructure("power")
              }
            >
              {infrastructureState === "loading" &&
              infrastructure === "power" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <UtilityPoleIcon />
              )}
            </IconButton>

            {/* Petroleum */}
            <IconButton
              tooltip="petroleum"
              variant={infrastructure === "petroleum" ? "default" : "secondary"}
              onClick={() =>
                infrastructure === "petroleum"
                  ? setInfrastructure(null)
                  : setInfrastructure("petroleum")
              }
            >
              {infrastructureState === "loading" &&
              infrastructure === "petroleum" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <FuelIcon />
              )}
            </IconButton>

            {/* Water */}
            <IconButton
              tooltip="water"
              variant={infrastructure === "water" ? "default" : "secondary"}
              onClick={() =>
                infrastructure === "water"
                  ? setInfrastructure(null)
                  : setInfrastructure("water")
              }
            >
              {infrastructureState === "loading" &&
              infrastructure === "water" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <DropletsIcon />
              )}
            </IconButton>

            {/* Telecoms */}
            <IconButton
              tooltip="telecoms"
              variant={infrastructure === "telecoms" ? "default" : "secondary"}
              onClick={() =>
                infrastructure === "telecoms"
                  ? setInfrastructure(null)
                  : setInfrastructure("telecoms")
              }
            >
              {infrastructureState === "loading" &&
              infrastructure === "telecoms" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <PhoneIcon />
              )}
            </IconButton>
          </div>

          <FieldGroup>{/* infrastructure fields */}</FieldGroup>
        </FieldSet>
      </div>
    </div>
  );
}
