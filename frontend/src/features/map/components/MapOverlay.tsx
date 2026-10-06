import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MapOverlayProps {
  children: ReactNode;
  className?: string;
}

export function MapOverlay({ children, className }: MapOverlayProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-4 top-0 z-1000",
        className,
      )}
    >
      <div className="pointer-events-auto relative">{children}</div>
    </div>
  );
}
