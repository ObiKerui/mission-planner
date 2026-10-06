import { AppShell } from "@/components/containers/AppShell";
import { AppNav } from "@/components/navigation/AppNav";
import { ThemeProvider } from "@/components/themeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AppShell header={<AppNav />}>
          <Outlet />
        </AppShell>
      </TooltipProvider>
    </ThemeProvider>
  );
}
