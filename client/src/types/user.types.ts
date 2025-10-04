export interface CreateUserFormData {
  name: string;
  email: string;
  role: 'manager' | 'employee';
  managerId?: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  managerName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: UserListItem[];
    total: number;
  };
}
