// Utilitaires de configuration pour les urgences

// Configuration des seuils d'urgence
export const getEmergencyThresholds = () => ({
  waitTime: {
    normal: 30,      // minutes
    warning: 60,     // minutes
    critical: 120    // minutes
  },
  vitalSigns: {
    bloodPressure: {
      systolic: { min: 90, max: 140, critical_min: 70, critical_max: 180 },
      diastolic: { min: 60, max: 90, critical_min: 40, critical_max: 110 }
    },
    heartRate: {
      min: 60, max: 100, critical_min: 50, critical_max: 120
    },
    temperature: {
      min: 36.0, max: 37.5, critical_min: 35.0, critical_max: 39.0
    },
    oxygenSaturation: {
      min: 95, critical_min: 90
    }
  },
  response: {
    triage: 5,       // minutes max pour le triage
    emergency: 15,   // minutes max pour les urgences
    critical: 5      // minutes max pour les cas critiques
  },
  capacity: {
    warning: 75,     // % d'occupation
    critical: 90     // % d'occupation
  }
});

// Configuration des priorités d'urgence
export const getEmergencyPriorityConfig = () => ({
  levels: {
    1: { 
      name: 'Non urgent', 
      color: 'green', 
      maxWaitTime: 240,    // 4 heures
      triageTime: 15,      // minutes
      weight: 1 
    },
    2: { 
      name: 'Peu urgent', 
      color: 'blue', 
      maxWaitTime: 120,    // 2 heures
      triageTime: 10,      // minutes
      weight: 2 
    },
    3: { 
      name: 'Urgent', 
      color: 'yellow', 
      maxWaitTime: 60,     // 1 heure
      triageTime: 10,      // minutes
      weight: 3 
    },
    4: { 
      name: 'Très urgent', 
      color: 'orange', 
      maxWaitTime: 30,     // 30 minutes
      triageTime: 5,       // minutes
      weight: 4 
    },
    5: { 
      name: 'Urgence vitale', 
      color: 'red', 
      maxWaitTime: 0,      // immédiat
      triageTime: 2,       // minutes
      weight: 5 
    }
  },
  algorithms: {
    'standard': {
      name: 'Standard',
      urgencyWeight: 0.7,
      waitTimeWeight: 0.3
    },
    'time_priority': {
      name: 'Priorité temps',
      urgencyWeight: 0.4,
      waitTimeWeight: 0.6
    },
    'severity_priority': {
      name: 'Priorité sévérité',
      urgencyWeight: 0.8,
      waitTimeWeight: 0.2
    }
  }
});

// Configuration des alertes d'urgence
export const getEmergencyAlertConfig = () => ({
  types: {
    'new_emergency': {
      title: 'Nouvelle urgence',
      icon: '🚨',
      sound: 'alert.wav',
      duration: 5000,
      priority: 'medium'
    },
    'deterioration': {
      title: 'Détérioration patient',
      icon: '⚠️',
      sound: 'warning.wav',
      duration: 10000,
      priority: 'high'
    },
    'code_blue': {
      title: 'Code Bleu - Arrêt cardiaque',
      icon: '🔵',
      sound: 'code_blue.wav',
      duration: 30000,
      priority: 'critical'
    },
    'code_red': {
      title: 'Code Rouge - Urgence vitale',
      icon: '🔴',
      sound: 'code_red.wav',
      duration: 30000,
      priority: 'critical'
    },
    'capacity_warning': {
      title: 'Capacité d\'accueil critique',
      icon: '🏥',
      sound: 'capacity.wav',
      duration: 15000,
      priority: 'high'
    }
  },
  autoAcknowledge: {
    'new_emergency': false,
    'deterioration': false,
    'code_blue': false,
    'code_red': false,
    'capacity_warning': true
  },
  escalation: {
    'code_blue': ['supervisor', 'head_nurse', 'attending_physician'],
    'code_red': ['supervisor', 'head_nurse', 'attending_physician'],
    'deterioration': ['assigned_nurse', 'attending_physician']
  }
});

// Configuration des zones d'urgence
export const getEmergencyZoneConfig = () => ({
  zones: {
    'triage': {
      name: 'Triage',
      capacity: 10,
      avgTime: 15,  // minutes
      equipment: ['monitor', 'thermometer', 'stethoscope']
    },
    'minor_emergency': {
      name: 'Urgences mineures',
      capacity: 8,
      avgTime: 45,  // minutes
      equipment: ['basic_supplies', 'suture_kit']
    },
    'major_emergency': {
      name: 'Urgences majeures',
      capacity: 6,
      avgTime: 90,  // minutes
      equipment: ['monitors', 'ventilator', 'defibrillator']
    },
    'critical_care': {
      name: 'Soins critiques',
      capacity: 4,
      avgTime: 180, // minutes
      equipment: ['ventilator', 'defibrillator', 'iv_pumps', 'monitors']
    },
    'isolation': {
      name: 'Isolement',
      capacity: 2,
      avgTime: 120, // minutes
      equipment: ['ppe', 'negative_pressure']
    }
  },
  routing: {
    1: ['triage', 'minor_emergency'],
    2: ['triage', 'minor_emergency'],
    3: ['triage', 'major_emergency'],
    4: ['triage', 'major_emergency', 'critical_care'],
    5: ['critical_care']
  }
});

// Configuration des équipements d'urgence
export const getEmergencyEquipmentConfig = () => ({
  critical: {
    'defibrillator': {
      name: 'Défibrillateur',
      zones: ['major_emergency', 'critical_care'],
      maintenanceInterval: 24, // heures
      checkInterval: 8        // heures
    },
    'ventilator': {
      name: 'Respirateur',
      zones: ['critical_care'],
      maintenanceInterval: 168, // heures (1 semaine)
      checkInterval: 12         // heures
    },
    'cardiac_monitor': {
      name: 'Moniteur cardiaque',
      zones: ['major_emergency', 'critical_care'],
      maintenanceInterval: 72,  // heures
      checkInterval: 24         // heures
    }
  },
  standard: {
    'wheelchair': {
      name: 'Fauteuil roulant',
      zones: ['triage', 'minor_emergency'],
      maintenanceInterval: 168, // heures
      checkInterval: 24         // heures
    },
    'stretcher': {
      name: 'Brancard',
      zones: ['all'],
      maintenanceInterval: 168, // heures
      checkInterval: 24         // heures
    },
    'iv_pump': {
      name: 'Pousse-seringue',
      zones: ['major_emergency', 'critical_care'],
      maintenanceInterval: 72,  // heures
      checkInterval: 12         // heures
    }
  }
});

// Configuration des protocoles d'urgence
export const getEmergencyProtocolConfig = () => ({
  triage: {
    'rapid_assessment': {
      name: 'Évaluation rapide',
      maxTime: 5,    // minutes
      steps: ['vital_signs', 'chief_complaint', 'pain_scale', 'priority_assignment']
    },
    'detailed_assessment': {
      name: 'Évaluation détaillée',
      maxTime: 15,   // minutes
      steps: ['history', 'physical_exam', 'diagnostic_tests', 'treatment_plan']
    }
  },
  codes: {
    'code_blue': {
      name: 'Arrêt cardiaque',
      responseTime: 3,  // minutes
      team: ['physician', 'nurse', 'respiratory_therapist'],
      equipment: ['defibrillator', 'intubation_kit', 'medications']
    },
    'code_red': {
      name: 'Urgence vitale',
      responseTime: 5,  // minutes
      team: ['physician', 'nurse'],
      equipment: ['monitors', 'iv_supplies', 'medications']
    },
    'code_gray': {
      name: 'Sécurité',
      responseTime: 2,  // minutes
      team: ['security', 'supervisor'],
      equipment: ['communication_device']
    }
  },
  discharge: {
    'criteria': {
      'stable_vitals': true,
      'pain_controlled': true,
      'able_to_ambulate': false,  // not required
      'follow_up_arranged': true
    },
    'documentation': ['discharge_summary', 'medications', 'follow_up_instructions']
  }
});

// Configuration des notifications d'urgence
export const getEmergencyNotificationConfig = () => ({
  channels: {
    'push': {
      enabled: true,
      recipients: ['on_duty_staff'],
      types: ['code_blue', 'code_red', 'new_emergency']
    },
    'sms': {
      enabled: true,
      recipients: ['supervisor', 'attending_physician'],
      types: ['code_blue', 'code_red']
    },
    'email': {
      enabled: true,
      recipients: ['administration'],
      types: ['capacity_warning', 'equipment_failure']
    },
    'intercom': {
      enabled: true,
      recipients: ['all_staff'],
      types: ['code_blue', 'code_red', 'evacuation']
    }
  },
  schedules: {
    'immediate': ['code_blue', 'code_red'],
    'within_5min': ['deterioration', 'new_emergency'],
    'within_15min': ['capacity_warning'],
    'daily_summary': ['statistics', 'performance_metrics']
  }
});

// Configuration des métriques de performance d'urgence
export const getEmergencyMetricsConfig = () => ({
  kpis: {
    'door_to_doctor_time': {
      name: 'Temps porte-médecin',
      target: 30,      // minutes
      critical: 60     // minutes
    },
    'triage_time': {
      name: 'Temps de triage',
      target: 10,      // minutes
      critical: 20     // minutes
    },
    'bed_occupancy': {
      name: 'Taux d\'occupation',
      target: 85,      // pourcentage
      critical: 95     // pourcentage
    },
    'left_without_being_seen': {
      name: 'Partis sans être vus',
      target: 2,       // pourcentage
      critical: 5      // pourcentage
    },
    'readmission_rate': {
      name: 'Taux de réadmission 72h',
      target: 3,       // pourcentage
      critical: 8      // pourcentage
    }
  },
  reporting: {
    'real_time': ['bed_occupancy', 'wait_times', 'staff_availability'],
    'hourly': ['patient_flow', 'case_mix'],
    'daily': ['kpi_summary', 'incidents', 'staff_performance'],
    'weekly': ['trends', 'benchmarking'],
    'monthly': ['quality_metrics', 'satisfaction_scores']
  }
});

// Configuration des rôles et permissions d'urgence
export const getEmergencyPermissionConfig = () => ({
  roles: {
    'triage_nurse': {
      permissions: ['triage_patients', 'assign_priority', 'vital_signs'],
      restrictions: ['discharge_patient', 'prescribe_medication']
    },
    'emergency_physician': {
      permissions: ['all_patient_actions', 'prescribe_medication', 'discharge_patient'],
      restrictions: ['admin_functions']
    },
    'charge_nurse': {
      permissions: ['manage_beds', 'staff_assignment', 'escalate_alerts'],
      restrictions: ['prescribe_medication']
    },
    'emergency_supervisor': {
      permissions: ['all_functions', 'admin_override', 'system_configuration'],
      restrictions: []
    }
  },
  emergency_overrides: {
    'code_situations': {
      temporary_permissions: ['emergency_physician_all'],
      duration: 60,  // minutes
      auto_revoke: true
    }
  }
});

// Obtenir la configuration complète d'urgence
export const getCompleteEmergencyConfig = () => ({
  thresholds: getEmergencyThresholds(),
  priorities: getEmergencyPriorityConfig(),
  alerts: getEmergencyAlertConfig(),
  zones: getEmergencyZoneConfig(),
  equipment: getEmergencyEquipmentConfig(),
  protocols: getEmergencyProtocolConfig(),
  notifications: getEmergencyNotificationConfig(),
  metrics: getEmergencyMetricsConfig(),
  permissions: getEmergencyPermissionConfig()
});

// Utilitaire pour valider la configuration
export const validateEmergencyConfig = (config: any): boolean => {
  const requiredSections = [
    'thresholds', 'priorities', 'alerts', 'zones', 
    'equipment', 'protocols', 'notifications', 'metrics'
  ];
  
  return requiredSections.every(section => 
    config[section] && typeof config[section] === 'object'
  );
};

// Utilitaire pour obtenir la configuration par environnement
export const getEnvironmentConfig = (environment: 'development' | 'staging' | 'production') => {
  const baseConfig = getCompleteEmergencyConfig();
  
  switch (environment) {
    case 'development':
      return {
        ...baseConfig,
        alerts: {
          ...baseConfig.alerts,
          autoAcknowledge: {
            ...Object.keys(baseConfig.alerts.types).reduce((acc, type) => ({
              ...acc,
              [type]: true  // Auto-acknowledge en dev
            }), {})
          }
        }
      };
      
    case 'staging':
      return {
        ...baseConfig,
        notifications: {
          ...baseConfig.notifications,
          channels: {
            ...baseConfig.notifications.channels,
            sms: { ...baseConfig.notifications.channels.sms, enabled: false },
            email: { ...baseConfig.notifications.channels.email, enabled: false }
          }
        }
      };
      
    case 'production':
    default:
      return baseConfig;
  }
};