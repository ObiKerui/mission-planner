import type { ReactNode } from "react";

interface MapViewportProps {
  children: ReactNode;
  className?: string;
}

export function MapViewport({ children, className }: MapViewportProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
