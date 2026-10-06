import {
  addEdge,
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import { ruleNodeTypes } from "./nodeTypes";
import type { RuleDefinition } from "@/entities/rules";
import { useFlowTrace } from "@/features/flow-trace/useFlowTrace";
import { useMemo } from "react";
import { NodePalette } from "@/features/node-palette/Palette";
import { useAddNode } from "./useAddNode";

interface RuleFlowProps {
  definition: RuleDefinition;
  flowId: string;
}

export function RuleFlow({ definition, flowId }: RuleFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(definition.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(definition.edges);

  const activeAt = useFlowTrace(flowId);
  const { onDrop, onDragOver } = useAddNode(setNodes);

  const styledNodes = useMemo(
    () =>
      nodes.map((n) =>
        activeAt[n.id]
          ? { ...n, className: `${n.className ?? ""} flow-node-active`.trim() }
          : n.className?.includes("flow-node-active")
            ? {
                ...n,
                className: n.className.replace("flow-node-active", "").trim(),
              }
            : n,
      ),
    [nodes, activeAt],
  );

  return (
    <div className="flex h-full w-full gap-2">
      <NodePalette />
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        nodeTypes={ruleNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => {
          setEdges((edges) => addEdge(connection, edges));
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
