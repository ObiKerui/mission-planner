import { useContext } from "react";
import { CesiumContext } from "../providers/CesiumProvider";

export function useCesium() {
  const context = useContext(CesiumContext);

  if (!context) {
    throw new Error("useCesium must be used within a CesiumProvider");
  }

  return context;
}
