import type { ReactNode } from "react";

import { SlideInContainer } from "@/components/containers/SlideInContainer";

interface MapSidePanelProps {
  open: boolean;
  side: "left" | "right";
  children: ReactNode;
  className?: string;
}

export function MapSidePanel({
  open,
  side,
  children,
  className,
}: MapSidePanelProps) {
  return (
    <SlideInContainer side={side} open={open} className={className}>
      {children}
    </SlideInContainer>
  );
}
