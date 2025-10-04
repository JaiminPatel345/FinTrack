import React, { useMemo, useState } from 'react';
import { UsersTable } from '@components/users/UsersTable';
import { UserModal } from '@components/users/UserModal';
import { SendPasswordModal } from '@components/users/SendPasswordModal';
import { Button } from '@components/common/Button';
import { useUsers } from '@hooks/useUsers';
import { UserListItem } from '@types/user.types';

export const UsersManagement: React.FC = () => {
  const { users, loading, createUser, updateUser, deactivateUser, sendPasswordEmail } = useUsers();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null);

  const managers = useMemo(() => users.filter((user) => user.role === 'manager'), [users]);

  const handleInvite = async (data: any) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
    } else {
      await createUser(data);
    }
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: UserListItem) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const openPasswordModal = (user: UserListItem) => {
    setSelectedUser(user);
    setPasswordModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Team members</h1>
          <p className="text-sm text-neutral-500">Invite managers and employees, assign approvers, and manage access.</p>
        </div>
        <Button onClick={openCreateModal}>Invite user</Button>
      </div>

      <UsersTable
        users={users}
        onEdit={openEditModal}
        onDeactivate={deactivateUser}
        onSendPassword={(userId) => {
          const user = users.find((item) => item.id === userId);
          if (user) {
            openPasswordModal(user);
          }
        }}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleInvite}
        managers={managers}
        initialData={selectedUser ?? undefined}
      />

      <SendPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        userEmail={selectedUser?.email}
        onConfirm={async () => {
          if (selectedUser) {
            await sendPasswordEmail(selectedUser.id);
            setPasswordModalOpen(false);
          }
        }}
      />
    </div>
  );
};

export default UsersManagement;
