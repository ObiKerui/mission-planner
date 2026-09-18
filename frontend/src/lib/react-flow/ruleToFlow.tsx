import type { Edge, Node } from "@xyflow/react";

import type { Rule } from "@/entities/rules";

export function ruleToFlow(rule: Rule): {
  nodes: Node[];
  edges: Edge[];
} {
  return {
    nodes: rule.definition.nodes,
    edges: rule.definition.edges,
  };
}
