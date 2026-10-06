import { Selection } from "@/components/rules/Selection";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rules/")({
  component: RulePage,
});

function RulePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-2 pl-4">
      {" "}
      <Selection />
    </div>
  );
}
