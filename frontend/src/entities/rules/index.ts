import { queries } from "./queries";

import type {
  Rule,
  RuleDefinition,
  ListFilters,
  RuleNode,
  RuleNodeData,
} from "./types";

import { useByUserId, usePaginated } from "./queries";

import { UIProvider, useUIStore } from "./stores";

export function useRules(filters?: ListFilters) {
  return queries.useList(filters);
}

export function useRule(id: string | null) {
  return queries.useOne(id);
}

export function useRuleMutations() {
  return {
    create: queries.useCreate(),
    update: queries.useUpdate(),
    remove: queries.useDelete(),
  };
}

export { useByUserId as useRuleByUserId, usePaginated as useRulePaginated };

export { UIProvider as RuleUIProvider, useUIStore as useRuleUIStore };

export { columns as ruleColumns } from "./columns";

export type { Rule, RuleDefinition, RuleNode, RuleNodeData };
