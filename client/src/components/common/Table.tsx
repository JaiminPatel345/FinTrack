import React from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyState?: React.ReactNode;
}

export function Table<T>({ data, columns, emptyState }: TableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 shadow-soft">
      <table className="w-full text-left">
        <thead className="bg-neutral-50 text-sm uppercase tracking-wider text-neutral-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className={px-4 py-3 }>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 text-sm">
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center text-neutral-500">
                {emptyState || 'No records found'}
              </td>
            </tr>
          )}
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-neutral-50 transition-colors">
              {columns.map((column) => (
                <td key={String(column.key)} className={px-4 py-4 }>
                  {column.render ? column.render(row) : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
