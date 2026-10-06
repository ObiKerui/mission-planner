import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import type { RuleNode } from "@/entities/rules";
import type { tNodeType } from "@/entities/rules/types";

function createNodeData(nodeType: tNodeType) {
  return {
    label: "label",
    ports: {
      inputs: [],
      outputs: [],
    },
  };
}

export function useAddNode(
  setNodes: React.Dispatch<React.SetStateAction<RuleNode[]>>,
) {
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow",
      ) as tNodeType;

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: RuleNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: createNodeData(type),
      };

      setNodes((nodes) => [...nodes, newNode]);
    },
    [screenToFlowPosition, setNodes],
  );

  return { onDrop, onDragOver };
}
