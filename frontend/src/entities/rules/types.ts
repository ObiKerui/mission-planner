import type { Edge, Node } from "@xyflow/react";

export interface ListFilters {
  user_id?: string;
}

export type RulePort = {
  id: string;
  label?: string;
};

export type RuleNodeData = {
  label: string;

  ports: {
    inputs: RulePort[];
    outputs: RulePort[];
  };

  [key: string]: unknown;
};

const nodeTypes = [
  "trigger",
  "navigate",
  "search",
  "condition",
  "action",
] as const;

export type tNodeType = (typeof nodeTypes)[number];

export type RuleNode = Node<RuleNodeData, tNodeType>;

export interface RuleDefinition {
  nodes: RuleNode[];
  edges: Edge[];
}

export interface Rule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  definition: RuleDefinition;
}
