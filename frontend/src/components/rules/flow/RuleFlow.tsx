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

interface RuleFlowProps {
  definition: RuleDefinition;
}

export function RuleFlow({ definition }: RuleFlowProps) {
  const [nodes, , onNodesChange] = useNodesState(definition.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(definition.edges);

  console.log("edges: ", definition.edges, edges);

  return (
    <div className="h-[600px] w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={ruleNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(connection) => {
          setEdges((edges) => addEdge(connection, edges));
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
