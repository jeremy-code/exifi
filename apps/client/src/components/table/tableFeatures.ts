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
  sortFn_basic,
} from "@tanstack/react-table";

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
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
    basic: sortFn_basic,
  },
});

type Features = typeof features;

export { features, type Features };
