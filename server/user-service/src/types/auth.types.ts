export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  companyId: string;
  iat?: number;
  exp?: number;
}