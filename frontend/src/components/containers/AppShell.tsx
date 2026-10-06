interface AppShellProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden">
      <header className="shrink-0 border-b">{header}</header>

      <main className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full w-full overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
