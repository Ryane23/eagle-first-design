export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN_FUNCTIONAL = 'admin_functional', 
  SECRETARY_PRINCIPAL = 'secretary_principal',
  SECRETARY_SECONDARY = 'secretary_secondary',
  DOCTOR = 'doctor',
  NURSE = 'nurse'
}

export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  ADMIN = 'admin'
}