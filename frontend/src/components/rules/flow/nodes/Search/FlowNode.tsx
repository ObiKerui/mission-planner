import { type NodeProps } from "@xyflow/react";

import { CommonNode } from "../Common/FlowNode";
import type { RuleNode } from "@/entities/rules";
import { FlowNodeDialog } from "../Common/FlowNodeDialog";
import { DialogContent } from "./DialogContent";

export function FlowNode({ data }: NodeProps<RuleNode>) {
  return (
    <CommonNode title="Search" ports={data.ports}>
      <FlowNodeDialog
        title={data.label}
        trigger={
          <span className="font-medium hover:cursor-pointer">{data.label}</span>
        }
      >
        <DialogContent />
      </FlowNodeDialog>

      <div className="text-muted-foreground mt-1 text-sm">
        Pattern: {String(data.pattern)}
      </div>

      <div className="text-muted-foreground mt-1 text-sm">
        Spacing: {String(data.spacing_m)} m
      </div>
    </CommonNode>
  );
}
