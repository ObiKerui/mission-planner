import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="shrink-0 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
          <Link to="/" className="text-xl font-semibold">
            Mission Planner
          </Link>

          <nav className="ml-8 flex gap-6">
            <Link to="/rules" activeProps={{ className: "font-semibold" }}>
              Rules
            </Link>
          </nav>
        </div>
      </header>

      <main className="min-h-0 flex-1">
        <div className="mx-auto h-full max-w-7xl px-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
