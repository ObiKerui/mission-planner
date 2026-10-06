import { Link } from "@tanstack/react-router";
import { BellIcon, Moon, Sun } from "lucide-react";

import { useTheme } from "../themeProvider";
import { IconButton } from "../ui/IconButton";

export function AppNav() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
      <Link to="/" className="text-xl font-semibold">
        Mission Planner
      </Link>

      <nav className="ml-8 flex gap-6">
        <Link to="/rules" activeProps={{ className: "font-semibold" }}>
          Rules
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <IconButton variant="outline" size="default" tooltip="Notifications">
          <BellIcon /> Notifications
        </IconButton>

        <IconButton
          variant="outline"
          size="default"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          tooltip={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
          Theme
        </IconButton>
      </div>
    </div>
  );
}
