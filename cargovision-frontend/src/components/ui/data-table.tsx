import * as React from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: keyof T | string
  header: string
  accessor?: (row: T) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  className?: string
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ 
  columns, 
  data, 
  className,
  onRowClick 
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b transition-colors hover:bg-muted/50",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
                        column.className
                      )}
                    >
                      {column.accessor 
                        ? column.accessor(row)
                        : String(row[column.key as keyof T])
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 