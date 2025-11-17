// Types de base
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'secretary';
  initials: string;
  photo?: string;
}

export interface Center {
  id: string;
  name: string;
  code: string;
  type: 'primary' | 'secondary';
  address?: string;
  phone?: string;
}

export interface Patient {
  id: string;
  name: string;
  firstName: string;
  age: number;
  gender: 'M' | 'F';
  phone?: string;
  email?: string;
  urgencyLevel: 1 | 2 | 3 | 4 | 5;
  specialty: string;
  doctor: string;
  center: string;
  waitTime: number;
  status: 'waiting' | 'in_preparation' | 'ready' | 'in_consultation' | 'completed';
  arrivalTime: string;
  notes?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  patients: number;
  maxPatients?: number;
}

export interface Specialty {
  id: string;
  name: string;
  patientCount: number;
  load: 'low' | 'medium' | 'high';
  doctors: Doctor[];
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  roomId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Room {
  id: string;
  name: string;
  equipment: string;
  doctor?: string;
  specialty?: string;
  active: boolean;
  inConsultation: boolean;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isRead: boolean;
  userId?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  level: 'none' | 'read' | 'write' | 'admin';
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  userCount: number;
  color: string;
}

// Types pour les formulaires
export interface AppointmentFormData {
  patientName: string;
  patientAge: number;
  patientGender: 'M' | 'F';
  patientPhone?: string;
  patientEmail?: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  urgencyLevel: number;
  urgencyJustification?: string;
  type: 'first_visit' | 'followup' | 'emergency';
  notes?: string;
  sendReminder: boolean;
  reminderType: 'sms' | 'email' | 'both';
}

// Types pour les statistiques
export interface Stats {
  totalPatients: number;
  waitingPatients: number;
  activeConsultations: number;
  avgWaitTime: number;
  urgentPatients: number;
  completedToday: number;
}

// Types pour la connexion
export interface ConnectionStatus {
  isOnline: boolean;
  bandwidth?: number;
  latency?: number;
  lastConnected?: Date;
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
}

// Types pour les composants UI
export interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'light' | 'dark';
  size: 'xs' | 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
  footer?: React.ReactNode;
  darkMode?: boolean;
}

export interface StatusBadgeProps {
  type: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  icon?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}