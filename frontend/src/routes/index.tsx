import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Mission Planner</h1>

      <p className="mt-2 text-muted-foreground">Plan missions</p>
    </div>
  );
}
