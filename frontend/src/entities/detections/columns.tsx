import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { Detection } from "./types";
import { tableFeaturesConfig } from "@/lib/table";

const columnHelper = createColumnHelper<
  typeof tableFeaturesConfig,
  Detection
>();

export const columns: ColumnDef<typeof tableFeaturesConfig, Detection>[] = [
  columnHelper.accessor("image_id", {
    header: "Image ID",
  }),

  // columnHelper.accessor("confidence", {
  //   header: "Observed",
  //   cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  // }),

  // columnHelper.accessor("filter", {
  //   header: "Filter",
  // }),

  // columnHelper.accessor("exposureSeconds", {
  //   header: "Exposure",
  //   cell: (info) => `${info.getValue()}s`,
  // }),

  // columnHelper.accessor("status", {
  //   header: "Status",
  // }),
];
