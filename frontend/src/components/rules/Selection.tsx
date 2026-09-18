import { DataGridView } from "@/lib/data-view/DataGridView";

import { useRules, ruleColumns } from "@/entities/rules";
import { RuleCard } from "./RuleCard";

export function Selection() {
  const { data: rules = [], isLoading } = useRules();

  return (
    <DataGridView
      data={rules}
      columns={ruleColumns}
      loading={isLoading}
      getRowId={(rule) => rule.id}
      renderItem={(rule) => <RuleCard rule={rule} />}
    />
  );
}
