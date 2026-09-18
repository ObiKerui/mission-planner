import { type NodeProps } from "@xyflow/react";

import { CommonNode } from "../Common/FlowNode";
import type { RuleNode } from "@/entities/rules";

export function FlowNode({ data }: NodeProps<RuleNode>) {
  return (
    <CommonNode title="Condition" ports={data.ports}>
      <div className="font-medium">{data.label}</div>

      <div className="mt-1 text-sm text-muted-foreground">
        Event: {String(data.event)}
      </div>

      <div className="mt-1 text-sm text-muted-foreground">
        Object: {String(data.object_type)}
      </div>

      <div className="mt-1 text-sm text-muted-foreground">
        Confidence ≥ {String(data.minimum_confidence)}
      </div>
    </CommonNode>
  );
}
