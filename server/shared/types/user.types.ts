import { UserRole } from './common.types';

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  managerId?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  managerId?: string;
}

export interface ManagerRelationship {
  id: string;
  employeeId: string;
  managerId: string;
  companyId: string;
  createdAt: Date;
}

export interface UserWithManager extends User {
  manager?: {
    id: string;
    name: string;
    email: string;
  };
}
