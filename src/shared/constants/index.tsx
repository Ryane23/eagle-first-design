// Constantes de l'application
export const APP_NAME = 'EAGLE';
export const APP_VERSION = '1.0.0';

// Niveaux d'urgence
export const URGENCY_LEVELS = {
  1: { label: 'Non urgent', color: 'green', description: 'Consultation de routine' },
  2: { label: 'Peu urgent', color: 'blue', description: 'Peut attendre plusieurs heures' },
  3: { label: 'Urgent', color: 'yellow', description: 'Nécessite une attention dans l\'heure' },
  4: { label: 'Très urgent', color: 'orange', description: 'Nécessite une attention rapide' },
  5: { label: 'Urgence vitale', color: 'red', description: 'Nécessite une attention immédiate' }
};

// Statuts des patients
export const PATIENT_STATUS = {
  WAITING: 'waiting',
  IN_PREPARATION: 'in_preparation', 
  READY: 'ready',
  IN_CONSULTATION: 'in_consultation',
  COMPLETED: 'completed'
} as const;

// Rôles utilisateur
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_FUNCTIONAL: 'admin_functional',
  SECRETARY_PRIMARY: 'secretary_primary',
  SECRETARY_SECONDARY: 'secretary_secondary',
  DOCTOR: 'doctor',
  NURSE: 'nurse'
} as const;

// Permissions
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write', 
  ADMIN: 'admin',
  NONE: 'none'
} as const;

// Types de notification
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

// Durées par défaut des consultations (en minutes)
export const DEFAULT_CONSULTATION_DURATIONS = {
  'Médecine générale': 15,
  'Pédiatrie': 20,
  'Cardiologie': 30,
  'Neurologie': 30,
  'Dermatologie': 20,
  'Gynécologie': 25,
  'Ophtalmologie': 25
};

// Horaires de travail standard
export const WORKING_HOURS = {
  START: '08:00',
  END: '17:00',
  LUNCH_START: '12:00',
  LUNCH_END: '13:00',
  SLOT_DURATION: 30 // minutes
};

// Seuils de performance
export const PERFORMANCE_THRESHOLDS = {
  BANDWIDTH_MIN: 1.0, // Mbps
  LATENCY_MAX: 500, // ms
  CPU_WARNING: 80, // %
  MEMORY_WARNING: 85, // %
  WAIT_TIME_WARNING: 30 // minutes
};

// Messages d'erreur standard
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  VALIDATION_ERROR: 'Données de formulaire invalides',
  PERMISSION_DENIED: 'Permissions insuffisantes',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur interne'
};

// Configuration de l'interface
export const UI_CONFIG = {
  SIDEBAR_WIDTH: 240,
  SIDEBAR_COLLAPSED_WIDTH: 60,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 40,
  BORDER_RADIUS: 8,
  ANIMATION_DURATION: 200
};

// Formats de date
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'dddd DD MMMM YYYY',
  TIME: 'HH:mm',
  DATETIME: 'DD/MM/YYYY HH:mm'
};