import type { UserRole } from './common.types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  companyId: string;
  managerId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId: string | null;
  managerName: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  managerId?: string;
  sendPasswordEmail?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  managerId?: string;
  isActive?: boolean;
}

export interface UserDetail extends UserListItem {
  companyId: string;
  companyName: string;
  updatedAt: string;
}

export interface AssignManagerRequest {
  userId: string;
  managerId: string;
}
