import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type tMapPanel = "planning" | "layers" | "mission";

export interface MapToolbarItem {
  id: tMapPanel;
  label: string;
  icon?: ReactNode;
}

interface MapToolbarProps {
  items: MapToolbarItem[];
  activeItem?: tMapPanel | null;
  onItemClick: (id: tMapPanel) => void;
  className?: string;
}

export function MapToolbar({
  items,
  activeItem = null,
  onItemClick,
  className,
}: MapToolbarProps) {
  return (
    <div className={cn("flex gap-2 p-4", className)}>
      {items.map((item) => (
        <Button
          key={item.id}
          size="icon-lg"
          variant={activeItem === item.id ? "secondary" : "outline"}
          className="hover:cursor-pointer"
          onClick={() => onItemClick(item.id)}
        >
          {item.icon && <span className="[&>svg]:size-4">{item.icon}</span>}
          {item.label}
        </Button>
      ))}
    </div>
  );
}
