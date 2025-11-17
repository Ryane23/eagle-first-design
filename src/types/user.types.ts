export enum UserRole {
  SECRETARY_SECONDARY = 'secretary_secondary',
  SECRETARY_PRIMARY = 'secretary_primary',
  NURSE = 'nurse',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  initials: string;
  center?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}