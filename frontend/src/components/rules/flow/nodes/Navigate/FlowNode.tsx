import { type NodeProps } from "@xyflow/react";

import { CommonNode } from "../Common/FlowNode";
import type { RuleNode } from "@/entities/rules";

export function FlowNode({ data }: NodeProps<RuleNode>) {
  return (
    <CommonNode title="Navigate" ports={data.ports}>
      <div className="font-medium">{data.label}</div>

      <div className="mt-1 text-sm text-muted-foreground">
        Area: {String(data.area)}
      </div>

      <div className="mt-1 text-sm text-muted-foreground">
        Altitude: {String(data.altitude_m)} m
      </div>
    </CommonNode>
  );
}
