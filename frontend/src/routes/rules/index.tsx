import { Selection } from "@/components/rules/Selection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rules/")({
  component: RulePage,
});

function RulePage() {
  return <Selection />;
}
