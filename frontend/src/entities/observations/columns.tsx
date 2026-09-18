import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { Observation } from "./types";
import { tableFeaturesConfig } from "@/lib/table";

const columnHelper = createColumnHelper<
  typeof tableFeaturesConfig,
  Observation
>();

export const columns: ColumnDef<typeof tableFeaturesConfig, Observation>[] = [
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

  columnHelper.accessor("exposureSeconds", {
    header: "Exposure",
    cell: (info) => `${info.getValue()}s`,
  }),

  columnHelper.accessor("status", {
    header: "Status",
  }),
];
