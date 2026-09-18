import { TriggerNode } from "./nodes/Trigger";
import { NavigateNode } from "./nodes/Navigate";
import { SearchNode } from "./nodes/Search";
import { ConditionNode } from "./nodes/Condition";
import { ActionNode } from "./nodes/Action";

export const ruleNodeTypes = {
  trigger: TriggerNode,
  navigate: NavigateNode,
  search: SearchNode,
  condition: ConditionNode,
  action: ActionNode,
};
