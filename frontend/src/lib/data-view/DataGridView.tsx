import type { ReactNode } from "react";
import { useState } from "react";

import {
  type ColumnDef,
  type RowData,
  type RowSelectionState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { dataViewFeatures } from "./dataViewFeatures";

interface DataGridViewProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<typeof dataViewFeatures, TData>[];

  renderItem: (item: TData) => ReactNode;

  loading?: boolean;
  emptyMessage?: string;

  searchable?: boolean;
  searchPlaceholder?: string;

  selectable?: boolean;

  pageSize?: number;

  columnsPerRow?: 1 | 2 | 3 | 4;

  getRowId?: (item: TData) => string;
}

export function DataGridView<TData extends RowData>({
  data,
  columns,
  renderItem,
  loading = false,
  emptyMessage = "No results.",
  searchable = true,
  searchPlaceholder = "Search...",
  selectable = false,
  pageSize = 12,
  columnsPerRow = 3,
  getRowId,
}: DataGridViewProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useTable({
    features: dataViewFeatures,

    data,
    columns,

    state: {
      sorting,
      globalFilter,
      rowSelection,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,

    enableRowSelection: selectable,

    getRowId: getRowId ? (item) => getRowId(item) : undefined,

    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  });

  const rows = table.getRowModel().rows;

  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (loading) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />

          {selectable && (
            <div className="text-sm text-muted-foreground">
              {Object.keys(rowSelection).length} selected
            </div>
          )}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <div className={`grid gap-4 ${gridClasses[columnsPerRow]}`}>
          {rows.map((row) => (
            <div key={row.id} className="relative">
              {selectable && (
                <div className="absolute right-3 top-3 z-10">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                    aria-label="Select item"
                  />
                </div>
              )}

              {renderItem(row.original)}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} result
          {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {table.state.pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
