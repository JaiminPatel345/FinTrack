import React from 'react';
import { Select } from '@components/common/Select';
import { Input } from '@components/common/Input';
import { EXPENSE_STATUSES } from '@utils/constants';

interface ExpenseFiltersProps {
  categories: Array<{ id: string; name: string }>;
  status: string;
  onStatusChange: (status: string) => void;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  startDate?: string;
  endDate?: string;
  onDateChange: (range: { startDate?: string; endDate?: string }) => void;
  onSearch?: (text: string) => void;
}

export const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  categories,
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  startDate,
  endDate,
  onDateChange,
  onSearch,
}) => {
  return (
    <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-4">
      <Select label="Status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="">All statuses</option>
        {EXPENSE_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option.replace(/_/g, ' ')}
          </option>
        ))}
      </Select>

      <Select
        label="Category"
        value={categoryId}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      <Input
        type="date"
        label="From"
        value={startDate}
        onChange={(event) => onDateChange({ startDate: event.target.value, endDate })}
      />

      <Input
        type="date"
        label="To"
        value={endDate}
        onChange={(event) => onDateChange({ startDate, endDate: event.target.value })}
      />

      {onSearch && (
        <div className="md:col-span-4">
          <Input label="Search description" placeholder="Search expenses" onChange={(event) => onSearch(event.target.value)} />
        </div>
      )}
    </div>
  );
};
