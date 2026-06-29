import type { ReactNode } from 'react'

export type DataTableColumn<T> = {
  key: string
  header: ReactNode
  /** Custom cell renderer; defaults to row[key] */
  render?: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowKey?: (row: T, index: number) => string | number
  onRowClick?: (row: T) => void
  emptyMessage?: ReactNode
  className?: string
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const

// Semantic, accessible table styled from the real Supabase logs table
// (manifest supabase-logs) mapped to tokens. Generic over the row type.
function DataTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  emptyMessage = 'No data',
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`overflow-hidden rounded-lg border border-[var(--border-default)] ${className}`}>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border-default)] bg-[var(--background-surface-75)]">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-3 py-2 text-xs font-medium text-[var(--foreground-lighter)] ${alignClass[c.align ?? 'left']} ${c.className ?? ''}`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-[var(--foreground-lighter)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={getRowKey ? getRowKey(row, i) : i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-[var(--border-muted)] transition-colors last:border-b-0 hover:bg-[var(--background-surface-100)] ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={`px-3 py-2 text-[var(--foreground-light)] ${alignClass[c.align ?? 'left']} ${c.className ?? ''}`}
                  >
                    {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
