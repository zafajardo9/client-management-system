"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  /** Optional custom cell renderer. If omitted, the field value is stringified. */
  render?: (row: T, rowIndex: number) => React.ReactNode;
  /** Optional tooltip or sublabel in header */
  description?: React.ReactNode;
  /** Sorting affordance only - wire up via sort + onSortChange props */
  sortable?: boolean;
  sortKey?: string; // when different from key
};

export type DataTableSort = {
  key: string;
  direction: "asc" | "desc";
};

export type DataTableProps<T> = {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  /** Unique row id getter. Defaults to index-based key. */
  getRowId?: (row: T, index: number) => string | number;
  /** Optional caption text */
  caption?: React.ReactNode;
  /** Optional toolbar slot rendered above the table */
  toolbar?: React.ReactNode;
  /** Rendered when there is no data */
  emptyState?: React.ReactNode;
  /** Loading state renders skeleton rows */
  loading?: boolean;
  /** Number of skeleton rows to display while loading */
  loadingRows?: number;
  /** Zebra striping */
  striped?: boolean;
  /** Dense mode reduces paddings */
  dense?: boolean;
  /** Row click handler or row href to make rows navigable */
  onRowClick?: (row: T) => void;
  rowHref?: (row: T) => string;
  /** Sorting (visual only unless onSortChange provided) */
  sort?: DataTableSort | null;
  onSortChange?: (next: DataTableSort) => void;
  className?: string;
  tableClassName?: string;
};

/**
 * DataTable - composable table built on shadcn/ui table primitives.
 *
 * Goals
 * - Looks modern out-of-the-box (sticky header, zebra, hover, rounded container)
 * - Small API surface; no heavy dependencies
 * - Reusable across pages to keep visuals consistent
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  getRowId,
  caption,
  toolbar,
  emptyState,
  loading = false,
  loadingRows = 5,
  striped = true,
  dense = false,
  onRowClick,
  rowHref,
  sort,
  onSortChange,
  className,
  tableClassName,
}: DataTableProps<T>) {
  const rowKey = (row: T, i: number) => (getRowId ? getRowId(row, i) : i);

  const headerCellClass = "whitespace-nowrap text-xs font-medium text-neutral-500";
  const cellPadding = dense ? "px-3 py-2" : "px-4 py-3";

  return (
    <div className={[
      "rounded-xl border bg-background text-foreground shadow-sm",
      "overflow-hidden",
      className ?? "",
    ].join(" ")}
    >
      {toolbar ? (
        <div className="flex items-center justify-between gap-4 p-3 sm:p-4 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
          {toolbar}
        </div>
      ) : null}

      <div className="relative overflow-x-auto">
        <Table className={["min-w-full", tableClassName ?? ""].join(" ")}>
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <TableRow>
              {columns.map((col) => {
                const align = col.align ?? "left";
                const isSorted = sort && (sort.key === (col.sortKey ?? String(col.key)));
                const nextDir = !sort || sort.direction === "desc" ? "asc" : "desc";
                return (
                  <TableHead
                    key={String(col.key)}
                    className={[
                      headerCellClass,
                      cellPadding,
                      align === "center" ? "text-center" : align === "right" ? "text-right" : "",
                      col.className ?? "",
                      col.sortable && onSortChange ? "cursor-pointer select-none" : "",
                    ].join(" ")}
                    onClick={() => {
                      if (col.sortable && onSortChange) {
                        onSortChange({ key: String(col.sortKey ?? col.key), direction: isSorted ? nextDir : "asc" });
                      }
                    }}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.description ? (
                        <span className="text-[10px] text-neutral-400">{col.description}</span>
                      ) : null}
                      {col.sortable && (
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded">
                          <svg
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={[
                              "h-3 w-3 transition-transform",
                              isSorted && sort?.direction === "asc" ? "rotate-180" : "",
                              isSorted ? "opacity-100" : "opacity-40 group-hover:opacity-70",
                            ].join(" ")}
                            aria-hidden
                          >
                            <path d="M10 4l4 6H6l4-6zm0 12l-4-6h8l-4 6z" />
                          </svg>
                        </span>
                      )}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: loadingRows }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="animate-pulse">
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} className={[cellPadding].join(" ")}>
                        <div className="h-4 w-24 rounded bg-neutral-200" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className={[cellPadding, "text-center text-sm text-neutral-500"].join(" ")}>
                      {emptyState ?? "No data to display"}
                    </TableCell>
                  </TableRow>
                )
              : data.map((row, i) => {
                  const href = rowHref?.(row);
                  return (
                    <TableRow
                      key={rowKey(row, i)}
                      className={[
                        striped && i % 2 === 1 ? "bg-neutral-50 dark:bg-neutral-900/30" : "",
                        onRowClick || href ? "hover:bg-neutral-50 dark:hover:bg-neutral-900/40 cursor-pointer transition-colors" : "",
                      ].join(" ")}
                      onClick={() => {
                        if (onRowClick) onRowClick(row);
                        if (!onRowClick && href) {
                          window.location.assign(href);
                        }
                      }}
                    >
                      {columns.map((col) => {
                        const align = col.align ?? "left";
                        const content = col.render
                          ? col.render(row, i)
                          : formatCell(row[col.key as keyof T]);
                        return (
                          <TableCell
                            key={String(col.key)}
                            className={[
                              cellPadding,
                              align === "center" ? "text-center" : align === "right" ? "text-right" : "",
                              col.className ?? "",
                            ].join(" ")}
                          >
                            {content}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatCell(value: unknown): React.ReactNode {
  if (value == null) return "—";
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
