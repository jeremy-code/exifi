import {
  tableFeatures,
  rowSortingFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowAggregationFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  createSortedRowModel,
  createExpandedRowModel,
  sortFn_alphanumeric,
  sortFn_text,
  sortFn_datetime,
  sortFn_basic,
} from "@tanstack/react-table";

/**
 * Features shared by every table in the app.
 *
 * Both `ExifTable` and `ExifTagTable` render subtrees via `getIsGrouped()` /
 * `getIsAggregated()` / `columnDef.aggregatedCell` (even though neither table
 * calls `getGroupedRowModel()`), and both use column resizing, so those
 * features are registered here once and shared. `rowSelectionFeature` and
 * `rowExpandingFeature` are only exercised by `ExifTable`, and
 * `rowSortingFeature` only by `ExifTagTable`, but keeping one feature set
 * keeps every table's `TFeatures` type (and therefore `createColumnHelper`,
 * `CellContext`, etc.) identical and interchangeable across the app, at the
 * cost of a slightly larger bundle than per-table tree-shaking would give.
 *
 * `columnVisibilityFeature` is required for `row.getVisibleCells()`, which
 * every table's render loop uses; in V8 this method was always present, but
 * V9 gates it behind this feature like everything else.
 */
const features = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowAggregationFeature,
  columnGroupingFeature,
  columnVisibilityFeature,
  columnSizingFeature,
  columnResizingFeature,
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  // Registered individually (rather than spreading the deprecated `sortFns`
  // registry) so only the sort strategies we use get bundled. These are the
  // same built-in strategies `sortFn: 'auto'` could resolve to in V8.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    datetime: sortFn_datetime,
    basic: sortFn_basic,
  },
});

type Features = typeof features;

export { features, type Features };
