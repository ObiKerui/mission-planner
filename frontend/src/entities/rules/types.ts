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

export type RuleNode = Node<
  RuleNodeData,
  "trigger" | "navigate" | "search" | "condition" | "action"
>;

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
