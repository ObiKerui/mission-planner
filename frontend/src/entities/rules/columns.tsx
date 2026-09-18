import type { ColumnDef } from "@tanstack/react-table";

import type { DataViewFeatures } from "@/lib/data-view/dataViewFeatures";

import type { Rule } from "./types";

export const columns: ColumnDef<DataViewFeatures, Rule>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "enabled",
    header: "Enabled",
  },
];
