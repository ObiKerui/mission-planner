import { RuleFlow } from "@/components/rules/flow/RuleFlow";
import { useRule } from "@/entities/rules";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rules/$externalId")({
  component: RuleDetailPage,
});

function RuleDetailPage() {
  const { externalId } = Route.useParams();

  const { data, isLoading, isError } = useRule(externalId);

  if (isLoading) {
    return <div>Loading rule...</div>;
  }

  if (isError) {
    return <div>Failed to load rule.</div>;
  }

  if (!data) {
    return <div>Rule not found.</div>;
  }
  return <RuleFlow definition={data.definition} />;
}
