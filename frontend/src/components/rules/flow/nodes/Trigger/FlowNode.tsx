import { type NodeProps } from "@xyflow/react";

import type { RuleNode } from "@/entities/rules";
import { CommonNode } from "../Common/FlowNode";
import { FlowNodeDialog } from "../Common/FlowNodeDialog";
import { DialogContent } from "./DialogContent";

export function FlowNode({ data }: NodeProps<RuleNode>) {
  return (
    <CommonNode title="Trigger" ports={data.ports}>
      <FlowNodeDialog
        title={data.label}
        trigger={
          <span className="font-medium hover:cursor-pointer">{data.label}</span>
        }
      >
        <DialogContent />
      </FlowNodeDialog>

      <div className="text-muted-foreground green mt-1 text-sm">
        {String(data.trigger)}
      </div>
    </CommonNode>
  );
}
