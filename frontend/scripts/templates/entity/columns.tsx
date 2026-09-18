import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { {{Singular}} } from "./types";
import { tableFeaturesConfig } from "@/lib/table";

const columnHelper = createColumnHelper<
  typeof tableFeaturesConfig,
  {{Singular}}
>();

export const columns: ColumnDef<typeof tableFeaturesConfig, {{Singular}}>[] = [
  columnHelper.accessor("targetName", {
    header: "Target",
  }),

  columnHelper.accessor("observedAt", {
    header: "Observed",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),

  columnHelper.accessor("filter", {
    header: "Filter",
  }),

];
