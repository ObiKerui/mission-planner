import * as React from "react";
import { cn } from "@/lib/utils";

type SlideInSide = "left" | "right";

interface SlideInContainerProps {
  side?: SlideInSide;
  open: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SlideInContainer({
  side = "right",
  open,
  children,
  className,
}: SlideInContainerProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 top-full z-50",
        "transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className={cn(
          "pointer-events-auto absolute top-0",
          "transition-transform duration-300 ease-in-out",
          side === "left" && "left-0",
          side === "right" && "right-0",
          open
            ? "translate-x-0"
            : side === "left"
              ? "-translate-x-full"
              : "translate-x-full",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
