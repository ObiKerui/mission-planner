import { type NodeProps } from "@xyflow/react";

import { CommonNode } from "../Common/FlowNode";
import type { RuleNode } from "@/entities/rules";
import { FlowNodeDialog } from "../Common/FlowNodeDialog";
import { DialogContent } from "./DialogContent";

export function FlowNode({ data }: NodeProps<RuleNode>) {
  return (
    <CommonNode title="Action" ports={data.ports}>
      <FlowNodeDialog
        title={data.label}
        trigger={
          <span className="font-medium hover:cursor-pointer">{data.label}</span>
        }
      >
        <DialogContent />
      </FlowNodeDialog>

      <div className="text-muted-foreground mt-1 text-sm">
        Action: {String(data.action)}
      </div>

      <div className="text-muted-foreground mt-1 text-sm">
        Event: {String(data.event_type)}
      </div>

      <div className="text-muted-foreground mt-1 text-sm">
        Include: {Array.isArray(data.include) ? data.include.join(", ") : ""}
      </div>
    </CommonNode>
  );
}
