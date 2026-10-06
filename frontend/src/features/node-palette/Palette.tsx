export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="w-64 border-r p-4">
      <h2 className="mb-4 font-semibold">Nodes</h2>

      <div className="space-y-2">
        <div
          draggable
          onDragStart={(event) => onDragStart(event, "trigger")}
          className="cursor-grab rounded-md border p-3"
        >
          Trigger
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "navigate")}
          className="cursor-grab rounded-md border p-3"
        >
          Navigate
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "search")}
          className="cursor-grab rounded-md border p-3"
        >
          Search
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "condition")}
          className="cursor-grab rounded-md border p-3"
        >
          Condition
        </div>

        <div
          draggable
          onDragStart={(event) => onDragStart(event, "action")}
          className="cursor-grab rounded-md border p-3"
        >
          Action
        </div>
      </div>
    </aside>
  );
}
