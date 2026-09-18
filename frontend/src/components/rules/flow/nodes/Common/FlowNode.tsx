import type { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";

import type { RuleNodeData } from "@/entities/rules";

interface CommonNodeProps {
  title: string;
  ports: RuleNodeData["ports"];
  children: ReactNode;
}

export function CommonNode({ title, ports, children }: CommonNodeProps) {
  console.log(title, ports);

  return (
    <div className="relative min-w-[220px] rounded-lg border bg-background shadow-sm">
      {ports.inputs.map((port) => (
        <Handle
          key={`input-${port.id}`}
          id={port.id}
          type="target"
          position={Position.Left}
        />
      ))}

      {ports.outputs.map((port) => (
        <Handle
          key={`output-${port.id}`}
          id={port.id}
          type="source"
          position={Position.Right}
        />
      ))}

      <div className="rounded-t-lg border-b bg-muted px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
