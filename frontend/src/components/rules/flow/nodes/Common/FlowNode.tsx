import type { ReactNode } from "react";
import { Handle, Position } from "@xyflow/react";

import type { RuleNodeData } from "@/entities/rules";

interface CommonNodeProps {
  title: string;
  ports: RuleNodeData["ports"];
  children: ReactNode;
}

export function CommonNode({ title, ports, children }: CommonNodeProps) {
  return (
    <div className="bg-background relative min-w-55 rounded-lg border shadow-sm">
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

      <div className="bg-muted rounded-t-lg border-b px-4 py-2">
        <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {title}
        </div>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}
