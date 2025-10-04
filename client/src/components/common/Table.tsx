import { Table as ChakraTable } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
    );
  }

  return (
    <ChakraTable.Root variant="outline">
      <ChakraTable.Header>
        <ChakraTable.Row>
          {columns.map((column, index) => (
            <ChakraTable.ColumnHeader key={index} width={column.width}>
              {column.header}
            </ChakraTable.ColumnHeader>
          ))}
        </ChakraTable.Row>
      </ChakraTable.Header>
      <ChakraTable.Body>
        {data.map((row, rowIndex) => (
          <ChakraTable.Row key={row.id || rowIndex}>
            {columns.map((column, colIndex) => (
              <ChakraTable.Cell key={colIndex}>
                {typeof column.accessor === 'function'
                  ? column.accessor(row)
                  : (row[column.accessor] as ReactNode)}
              </ChakraTable.Cell>
            ))}
          </ChakraTable.Row>
        ))}
      </ChakraTable.Body>
    </ChakraTable.Root>
  );
}
