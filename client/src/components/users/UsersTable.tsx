import React from 'react';
import { Table } from '@components/common/Table';
import { Badge } from '@components/common/Badge';
import { Button } from '@components/common/Button';
import { UserListItem } from '@types/user.types';
import { format } from 'date-fns';

interface UsersTableProps {
  users: UserListItem[];
  onEdit: (user: UserListItem) => void;
  onDeactivate: (userId: string) => void;
  onSendPassword: (userId: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDeactivate, onSendPassword }) => {
  return (
    <Table
      data={users}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'email', header: 'Email' },
        {
          key: 'role',
          header: 'Role',
          render: (row) => <Badge variant={row.role === 'manager' ? 'info' : 'default'}>{row.role}</Badge>,
        },
        {
          key: 'managerName',
          header: 'Manager',
          render: (row) => row.managerName || '—',
        },
        {
          key: 'createdAt',
          header: 'Created',
          render: (row) => format(new Date(row.createdAt), 'dd MMM yyyy'),
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (row) => (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onSendPassword(row.id)}>
                Send Password
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDeactivate(row.id)}>
                Deactivate
              </Button>
            </div>
          ),
        },
      ]}
      emptyState={<p className="text-neutral-400">No users found for your company.</p>}
    />
  );
};
