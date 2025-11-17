import React from 'react';
import { 
Home, AlertTriangle, Users, MessageSquare, BarChart2, Settings, HelpCircle, Clock, CheckCircle, Building, Stethoscope, Activity, PlayCircle, PhoneCall
} from 'lucide-react';

// Configuration des menus de navigation
export const EMERGENCY_MENU_ITEMS = {
  main: (activeMenuItem: string) => [
    { 
      icon: <Home size={20} />, 
      label: "Tableau de bord", 
      path: "#", 
      isActive: activeMenuItem === 'dashboard' 
    },
    { 
      icon: <Users size={20} />, 
      label: "Salle d'attente", 
      path: "#", 
      isActive: activeMenuItem === 'waitingRoom' 
    },
    { 
      icon: <AlertTriangle size={20} />, 
      label: "Gestion des Urgences", 
      path: "#", 
      isActive: activeMenuItem === 'emergencies' 
    },
    { 
      icon: <MessageSquare size={20} />, 
      label: "Communication", 
      path: "#", 
      isActive: activeMenuItem === 'communication' 
    },
    { 
      icon: <BarChart2 size={20} />, 
      label: "Statistiques", 
      path: "#", 
      isActive: activeMenuItem === 'statistics' 
    }
  ],
  
  bottom: (activeMenuItem: string) => [
    { 
      icon: <Settings size={18} />, 
      label: "Paramètres", 
      path: "#",
      isActive: activeMenuItem === 'settings'
    },
    { 
      icon: <HelpCircle size={18} />, 
      label: "Aide", 
      path: "#",
      isActive: activeMenuItem === 'help'
    }
  ]
};

// Niveaux de priorité d'urgence
export const EMERGENCY_PRIORITY_LEVELS = [
  {
    id: 1,
    level: 1,
    label: "Non urgent",
    description: "Condition stable, aucun risque immédiat, peut attendre sans aggravation.",
    maxWaitTime: 120,
    color: "green",
    icon: "📋",
    criteria: [
      "Signes vitaux stables",
      "Pas de détresse visible",
      "Conditions chroniques stables",
      "Consultations de routine"
    ],
    examples: [
      "Renouvellement d'ordonnance",
      "Contrôle de routine",
      "Vaccination",
      "Certificat médical"
    ]
  },
  {
    id: 2,
    level: 2,
    label: "Peu urgent",
    description: "Condition stable mais nécessitant une attention médicale dans la journée.",
    maxWaitTime: 60,
    color: "blue",
    icon: "📘",
    criteria: [
      "Symptômes légers à modérés",
      "Pas de détresse aiguë",
      "Condition pouvant attendre quelques heures",
      "Inconfort mais pas de danger"
    ],
    examples: [
      "Douleur abdominale légère",
      "Fièvre modérée",
      "Maux de tête légers",
      "Éruption cutanée bénigne"
    ]
  },
  {
    id: 3,
    level: 3,
    label: "Urgent",
    description: "Nécessite une attention dans les prochaines heures, sans danger vital immédiat.",
    maxWaitTime: 30,
    color: "yellow",
    icon: "⚡",
    criteria: [
      "Symptômes modérés à sévères",
      "Inconfort significatif",
      "Risque de complications si retard",
      "Besoin d'évaluation rapide"
    ],
    examples: [
      "Douleur thoracique légère",
      "Fièvre élevée persistante",
      "Vomissements répétés",
      "Essoufflement modéré"
    ]
  },
  {
    id: 4,
    level: 4,
    label: "Très urgent",
    description: "Condition potentiellement grave nécessitant une prise en charge rapide.",
    maxWaitTime: 15,
    color: "orange",
    icon: "⚠️",
    criteria: [
      "Détresse modérée à sévère",
      "Risque de complications graves",
      "Douleur intense",
      "Altération de l'état général"
    ],
    examples: [
      "Douleur thoracique intense",
      "Difficultés respiratoires",
      "Tension artérielle très élevée",
      "Saignements importants"
    ]
  },
  {
    id: 5,
    level: 5,
    label: "Urgence vitale",
    description: "Menace immédiate pour la vie du patient, nécessite une prise en charge immédiate.",
    maxWaitTime: 5,
    color: "red",
    icon: "🚨",
    criteria: [
      "Danger vital immédiat",
      "Détresse extrême",
      "Perte de conscience",
      "Arrêt cardiaque/respiratoire"
    ],
    examples: [
      "Infarctus du myocarde",
      "AVC aigu",
      "Détresse respiratoire sévère",
      "Choc anaphylactique"
    ]
  }
];

// Options de spécialités médicales
export const SPECIALTY_OPTIONS = [
  { value: "all", label: "Toutes spécialités" },
  { value: "Cardiologie", label: "Cardiologie" },
  { value: "Pneumologie", label: "Pneumologie" },
  { value: "Dermatologie", label: "Dermatologie" },
  { value: "Pédiatrie", label: "Pédiatrie" },
  { value: "Neurologie", label: "Neurologie" },
  { value: "Médecine générale", label: "Médecine générale" },
  { value: "Gynécologie", label: "Gynécologie" },
  { value: "Orthopédie", label: "Orthopédie" },
  { value: "Ophtalmologie", label: "Ophtalmologie" }
];

// Options de tri
export const SORT_OPTIONS = [
  { value: "urgencyLevel", label: "Niveau d'urgence", icon: <AlertTriangle size={16} /> },
  { value: "waitTime", label: "Temps d'attente", icon: <Clock size={16} /> },
  { value: "name", label: "Nom du patient", icon: <Users size={16} /> },
  { value: "specialty", label: "Spécialité", icon: <Stethoscope size={16} /> },
  { value: "status", label: "Statut", icon: <Activity size={16} /> },
  { value: "arrivalTime", label: "Heure d'arrivée", icon: <Clock size={16} /> }
];

// Types de statut des patients
export const PATIENT_STATUS_TYPES = {
  WAITING: {
    value: 'waiting',
    label: 'En attente',
    color: 'gray',
    icon: '⏳',
    description: 'Patient en attente de prise en charge'
  },
  IN_PREPARATION: {
    value: 'in_preparation',
    label: 'En préparation',
    color: 'yellow',
    icon: '🔄',
    description: 'Patient en cours de préparation'
  },
  READY: {
    value: 'ready',
    label: 'Prêt',
    color: 'green',
    icon: '✅',
    description: 'Patient prêt pour la consultation'
  },
  IN_CONSULTATION: {
    value: 'in_consultation',
    label: 'En consultation',
    color: 'blue',
    icon: '👨‍⚕️',
    description: 'Patient actuellement en consultation'
  },
  COMPLETED: {
    value: 'completed',
    label: 'Terminé',
    color: 'purple',
    icon: '✨',
    description: 'Consultation terminée'
  }
};

// Types de notifications
export const NOTIFICATION_TYPES = {
  URGENT: {
    value: 'urgent',
    label: 'Urgent',
    color: 'red',
    icon: '🚨',
    priority: 'critical',
    sound: true,
    autoExpire: false
  },
  WARNING: {
    value: 'warning',
    label: 'Attention',
    color: 'yellow',
    icon: '⚠️',
    priority: 'high',
    sound: true,
    autoExpire: true,
    expireAfter: 30000 // 30 secondes
  },
  INFO: {
    value: 'info',
    label: 'Information',
    color: 'blue',
    icon: 'ℹ️',
    priority: 'medium',
    sound: false,
    autoExpire: true,
    expireAfter: 10000 // 10 secondes
  },
  SUCCESS: {
    value: 'success',
    label: 'Succès',
    color: 'green',
    icon: '✅',
    priority: 'low',
    sound: false,
    autoExpire: true,
    expireAfter: 5000 // 5 secondes
  },
  ERROR: {
    value: 'error',
    label: 'Erreur',
    color: 'red',
    icon: '❌',
    priority: 'high',
    sound: true,
    autoExpire: false
  }
};

// Actions rapides disponibles
export const QUICK_ACTIONS = [
  {
    id: "consult",
    label: "Consulter",
    icon: <PlayCircle size={14} />,
    variant: "primary",
    shortcut: "C",
    description: "Démarrer la consultation"
  },
  {
    id: "contact",
    label: "Contacter",
    icon: <PhoneCall size={14} />,
    variant: "secondary",
    shortcut: "T",
    description: "Contacter le centre"
  },
  {
    id: "priority",
    label: "Priorité",
    icon: <AlertTriangle size={14} />,
    variant: "warning",
    shortcut: "P",
    description: "Modifier la priorité"
  },
  {
    id: "notes",
    label: "Notes",
    icon: <MessageSquare size={14} />,
    variant: "info",
    shortcut: "N",
    description: "Ajouter des notes"
  }
];

// Seuils de performance
export const PERFORMANCE_THRESHOLDS = {
  WAIT_TIME: {
    EXCELLENT: 10,
    GOOD: 20,
    ACCEPTABLE: 30,
    CRITICAL: 45
  },
  SYSTEM_LOAD: {
    LOW: 30,
    MEDIUM: 60,
    HIGH: 80,
    CRITICAL: 95
  },
  URGENT_PATIENTS: {
    LOW: 2,
    MEDIUM: 4,
    HIGH: 6,
    CRITICAL: 8
  },
  RESPONSE_TIME: {
    EXCELLENT: 2,
    GOOD: 5,
    ACCEPTABLE: 10,
    CRITICAL: 15
  }
};

// Couleurs du thème
export const EMERGENCY_THEME_COLORS = {
  urgency: {
    1: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    2: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    3: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
    4: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
    5: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" }
  },
  status: {
    waiting: { bg: "bg-gray-100", text: "text-gray-800" },
    in_preparation: { bg: "bg-yellow-100", text: "text-yellow-800" },
    ready: { bg: "bg-green-100", text: "text-green-800" },
    in_consultation: { bg: "bg-blue-100", text: "text-blue-800" },
    completed: { bg: "bg-purple-100", text: "text-purple-800" }
  },
  notification: {
    urgent: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
    warning: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" },
    info: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
    success: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
    error: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" }
  }
};

// Configuration des tableaux
export const TABLE_CONFIG = {
  rowsPerPage: [10, 25, 50, 100],
  defaultRowsPerPage: 25,
  sortable: true,
  filterable: true,
  searchable: true,
  exportable: true,
  selectable: false,
  pagination: true,
  virtualization: false // Activé pour > 100 éléments
};

// Configuration des graphiques
export const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  
  // Couleurs pour les urgences
  urgency1: "#10B981", // Vert
  urgency2: "#3B82F6", // Bleu
  urgency3: "#F59E0B", // Jaune
  urgency4: "#F97316", // Orange
  urgency5: "#EF4444", // Rouge
  
  // Couleurs pour les spécialités
  cardiology: "#DC2626",
  pediatrics: "#059669",
  pneumology: "#7C3AED",
  dermatology: "#DB2777",
  neurology: "#1F2937",
  general: "#6B7280"
};

// Formats de date et heure
export const DATE_TIME_FORMATS = {
  date: "DD/MM/YYYY",
  time: "HH:mm",
  datetime: "DD/MM/YYYY HH:mm",
  timestamp: "DD/MM/YYYY HH:mm:ss",
  relative: "relative", // Il y a 5 minutes
  iso: "ISO" // Format ISO 8601
};

// Messages système
export const SYSTEM_MESSAGES = {
  loading: "Chargement en cours...",
  noData: "Aucune donnée disponible",
  error: "Une erreur s'est produite",
  offline: "Mode hors ligne activé",
  syncing: "Synchronisation en cours...",
  saved: "Modifications sauvegardées",
  networkError: "Erreur de connexion réseau",
  permissionDenied: "Accès refusé",
  sessionExpired: "Session expirée"
};

// Configuration d'export
export const EXPORT_FORMATS = [
  {
    value: "pdf",
    label: "PDF",
    icon: "📄",
    description: "Document PDF imprimable"
  },
  {
    value: "excel",
    label: "Excel",
    icon: "📊",
    description: "Feuille de calcul Excel"
  },
  {
    value: "csv",
    label: "CSV",
    icon: "📋",
    description: "Fichier de valeurs séparées par des virgules"
  },
  {
    value: "json",
    label: "JSON",
    icon: "🔧",
    description: "Format de données structurées"
  }
];

// Raccourcis clavier
export const KEYBOARD_SHORTCUTS = {
  global: {
    "Space": "Actualiser",
    "F": "Filtrer",
    "S": "Rechercher",
    "H": "Historique",
    "?": "Aide",
    "Escape": "Fermer"
  },
  navigation: {
    "ArrowUp": "Précédent",
    "ArrowDown": "Suivant",
    "Enter": "Sélectionner",
    "Tab": "Navigation"
  },
  actions: {
    "C": "Consulter",
    "T": "Téléphoner",
    "P": "Priorité",
    "N": "Notes",
    "E": "Exporter"
  }
};

// Limites et contraintes
export const SYSTEM_LIMITS = {
  maxPatients: 100,
  maxNotifications: 50,
  maxHistoryItems: 200,
  maxSearchResults: 50,
  maxFileSize: 10485760, // 10MB
  maxMessageLength: 1000,
  maxNotesLength: 2000,
  sessionTimeout: 3600000, // 1 heure
  refreshInterval: 30000 // 30 secondes
};

// Règles de validation
export const VALIDATION_RULES = {
  patient: {
    name: { required: true, minLength: 2, maxLength: 100 },
    age: { required: true, min: 0, max: 150 },
    urgency: { required: true, min: 1, max: 5 }
  },
  communication: {
    message: { required: true, minLength: 5, maxLength: 1000 },
    subject: { required: false, maxLength: 200 }
  },
  notes: {
    content: { required: false, maxLength: 2000 }
  }
};

// URLs et endpoints API
export const API_ENDPOINTS = {
  patients: "/api/patients",
  emergencies: "/api/emergencies",
  notifications: "/api/notifications",
  history: "/api/history",
  communication: "/api/communication",
  export: "/api/export",
  sync: "/api/sync"
};

// Configuration de mise en cache
export const CACHE_CONFIG = {
  patients: { ttl: 30000, strategy: "refresh" }, // 30 secondes
  notifications: { ttl: 10000, strategy: "refresh" }, // 10 secondes
  history: { ttl: 300000, strategy: "cache" }, // 5 minutes
  clinics: { ttl: 3600000, strategy: "cache" }, // 1 heure
  settings: { ttl: 86400000, strategy: "persist" } // 24 heures
};