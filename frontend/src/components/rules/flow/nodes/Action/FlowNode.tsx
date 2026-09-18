import { type NodeProps } from "@xyflow/react";

import { CommonNode } from "../Common/FlowNode";
import type { RuleNode } from "@/entities/rules";

export function FlowNode({ data }: NodeProps<RuleNode>) {
  return (
    <CommonNode title="Action" ports={data.ports}>
      <div className="font-medium">{data.label}</div>

      <div className="mt-1 text-sm text-muted-foreground">
        Action: {String(data.action)}
      </div>

      <div className="mt-1 text-sm text-muted-foreground">
        Event: {String(data.event_type)}
      </div>

      <div className="mt-1 text-sm text-muted-foreground">
        Include: {Array.isArray(data.include) ? data.include.join(", ") : ""}
      </div>
    </CommonNode>
  );
}
