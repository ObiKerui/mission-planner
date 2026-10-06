import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MapPanelSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function MapPanelSection({
  title,
  children,
  className,
}: MapPanelSectionProps) {
  return (
    <section className={cn("border-b p-4 last:border-b-0", className)}>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>

      {children}
    </section>
  );
}
