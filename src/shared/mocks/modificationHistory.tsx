export const mockModificationHistory = [
  {
    id: 1,
    type: "patient",
    action: "update",
    user: {
      id: "MED-045",
      name: "Dr. Kouam",
      role: "Médecin",
      specialty: "Cardiologie"
    },
    timestamp: "09:50",
    fullTimestamp: "2024-01-15T09:50:00Z",
    changes: [
      {
        field: "Niveau d'urgence",
        oldValue: 2,
        newValue: 4,
        fieldType: "urgency",
        impact: "high"
      }
    ],
    details: "Tension artérielle élevée (160/95), symptômes de céphalées croissants, patiente enceinte 32 semaines",
    entityId: 3,
    entityName: "Jeanne Atangana",
    entityType: "patient",
    justification: "Escalade due à l'aggravation des symptômes hypertensifs chez une patiente enceinte",
    reviewedBy: null,
    approvedBy: "Dr. Kouam",
    approvalTimestamp: "09:51",
    impact: "medium",
    reversible: true,
    category: "urgency_escalation",
    priority: "high",
    clinicCode: "CSJ-YDE",
    clinicName: "Clinique Saint Jean - Yaoundé",
    deviceInfo: {
      device: "Tablet",
      os: "Android",
      browser: "Chrome",
      ip: "192.168.1.45"
    },
    relatedEvents: [
      {
        type: "vital_signs_update",
        timestamp: "09:48",
        details: "Nouvelle mesure tension: 160/95"
      },
      {
        type: "symptom_report",
        timestamp: "09:49",
        details: "Patiente signale céphalées intenses"
      }
    ]
  },
  {
    id: 2,
    type: "patient",
    action: "update",
    user: {
      id: "MED-045",
      name: "Dr. Kouam",
      role: "Médecin",
      specialty: "Cardiologie"
    },
    timestamp: "09:30",
    fullTimestamp: "2024-01-15T09:30:00Z",
    changes: [
      {
        field: "Niveau d'urgence",
        oldValue: 4,
        newValue: 5,
        fieldType: "urgency",
        impact: "critical"
      }
    ],
    details: "Douleur thoracique aigüe avec irradiation dans le bras gauche, suspicion d'infarctus du myocarde",
    entityId: 4,
    entityName: "Robert Mbarga",
    entityType: "patient",
    justification: "Suspicion d'infarctus du myocarde basée sur les symptômes cliniques",
    reviewedBy: null,
    approvedBy: "Dr. Kouam",
    approvalTimestamp: "09:30",
    impact: "high",
    reversible: false,
    category: "emergency_escalation",
    priority: "critical",
    clinicCode: "CM-KRI",
    clinicName: "Clinique Moderne - Kribi",
    deviceInfo: {
      device: "Desktop",
      os: "Windows",
      browser: "Edge",
      ip: "192.168.1.30"
    },
    relatedEvents: [
      {
        type: "symptom_onset",
        timestamp: "09:28",
        details: "Début douleur thoracique aigüe"
      },
      {
        type: "ecg_requested",
        timestamp: "09:31",
        details: "ECG d'urgence demandé"
      }
    ]
  },
  {
    id: 3,
    type: "patient",
    action: "update",
    user: {
      id: "MED-045",
      name: "Dr. Kouam",
      role: "Médecin",
      specialty: "Cardiologie"
    },
    timestamp: "08:45",
    fullTimestamp: "2024-01-15T08:45:00Z",
    changes: [
      {
        field: "Niveau d'urgence",
        oldValue: 3,
        newValue: 2,
        fieldType: "urgency",
        impact: "low"
      }
    ],
    details: "Amélioration de l'état général, douleur abdominale diminuée après traitement antiacide",
    entityId: 2,
    entityName: "Claude Bekolo",
    entityType: "patient",
    justification: "Réponse positive au traitement, diminution significative des symptômes",
    reviewedBy: null,
    approvedBy: "Dr. Kouam",
    approvalTimestamp: "08:46",
    impact: "low",
    reversible: true,
    category: "improvement",
    priority: "low",
    clinicCode: "CP-DLA",
    clinicName: "Centre Principal - Douala",
    deviceInfo: {
      device: "Tablet",
      os: "iOS",
      browser: "Safari",
      ip: "192.168.1.52"
    },
    relatedEvents: [
      {
        type: "treatment_administered",
        timestamp: "08:30",
        details: "Administration antiacide"
      },
      {
        type: "symptom_improvement",
        timestamp: "08:44",
        details: "Patient signale amélioration douleur"
      }
    ]
  },
  {
    id: 4,
    type: "patient",
    action: "create",
    user: {
      id: "SEC-012",
      name: "Marie Tchounga",
      role: "Secrétaire",
      specialty: "Accueil"
    },
    timestamp: "09:55",
    fullTimestamp: "2024-01-15T09:55:00Z",
    changes: [
      {
        field: "Création patient",
        oldValue: null,
        newValue: "Nouveau patient",
        fieldType: "creation",
        impact: "medium"
      }
    ],
    details: "Nouveau patient Aisha Mohamadou, 29 ans, urgence gynécologique",
    entityId: 8,
    entityName: "Aisha Mohamadou",
    entityType: "patient",
    justification: "Admission d'urgence pour hémorragie génitale",
    reviewedBy: "Dr. Kouam",
    approvedBy: "Dr. Kouam",
    approvalTimestamp: "09:56",
    impact: "medium",
    reversible: false,
    category: "admission",
    priority: "high",
    clinicCode: "CSJ-YDE",
    clinicName: "Clinique Saint Jean - Yaoundé",
    deviceInfo: {
      device: "Desktop",
      os: "Windows",
      browser: "Chrome",
      ip: "192.168.1.20"
    },
    relatedEvents: [
      {
        type: "patient_arrival",
        timestamp: "09:54",
        details: "Arrivée patient aux urgences"
      },
      {
        type: "triage_completed",
        timestamp: "09:55",
        details: "Triage initial: Urgence niveau 5"
      }
    ]
  },
  {
    id: 5,
    type: "patient",
    action: "update",
    user: {
      id: "INF-008",
      name: "Claire Nomo",
      role: "Infirmière",
      specialty: "Soins généraux"
    },
    timestamp: "09:42",
    fullTimestamp: "2024-01-15T09:42:00Z",
    changes: [
      {
        field: "Statut",
        oldValue: "waiting",
        newValue: "ready",
        fieldType: "status",
        impact: "low"
      }
    ],
    details: "Patient Sophie Ndom préparée et prête pour consultation dermatologique",
    entityId: 6,
    entityName: "Sophie Ndom",
    entityType: "patient",
    justification: "Préparation terminée, patient prêt pour consultation",
    reviewedBy: null,
    approvedBy: "Claire Nomo",
    approvalTimestamp: "09:42",
    impact: "low",
    reversible: true,
    category: "workflow",
    priority: "medium",
    clinicCode: "CP-DLA",
    clinicName: "Centre Principal - Douala",
    deviceInfo: {
      device: "Mobile",
      os: "Android",
      browser: "Chrome Mobile",
      ip: "192.168.1.67"
    },
    relatedEvents: [
      {
        type: "preparation_started",
        timestamp: "09:38",
        details: "Début préparation patient"
      },
      {
        type: "vital_signs_taken",
        timestamp: "09:40",
        details: "Prise des constantes vitales"
      }
    ]
  },
  {
    id: 6,
    type: "system",
    action: "configuration",
    user: {
      id: "ADM-001",
      name: "Admin Système",
      role: "Administrateur",
      specialty: "IT"
    },
    timestamp: "08:00",
    fullTimestamp: "2024-01-15T08:00:00Z",
    changes: [
      {
        field: "Seuil d'alerte temps d'attente",
        oldValue: 45,
        newValue: 30,
        fieldType: "configuration",
        impact: "medium"
      }
    ],
    details: "Mise à jour des seuils d'alerte pour optimiser la surveillance des temps d'attente",
    entityId: null,
    entityName: "Configuration système",
    entityType: "system",
    justification: "Amélioration de la réactivité du système d'alerte",
    reviewedBy: "Dr. Kouam",
    approvedBy: "Admin Système",
    approvalTimestamp: "08:01",
    impact: "medium",
    reversible: true,
    category: "system_configuration",
    priority: "medium",
    clinicCode: null,
    clinicName: "Système EAGLE",
    deviceInfo: {
      device: "Desktop",
      os: "Linux",
      browser: "Firefox",
      ip: "192.168.1.10"
    },
    relatedEvents: [
      {
        type: "configuration_backup",
        timestamp: "07:59",
        details: "Sauvegarde configuration précédente"
      },
      {
        type: "system_restart",
        timestamp: "08:02",
        details: "Redémarrage des services de monitoring"
      }
    ]
  },
  {
    id: 7,
    type: "patient",
    action: "update",
    user: {
      id: "MED-046",
      name: "Dr. Ngo Bala",
      role: "Médecin",
      specialty: "Gynécologie"
    },
    timestamp: "09:56",
    fullTimestamp: "2024-01-15T09:56:00Z",
    changes: [
      {
        field: "Statut",
        oldValue: "waiting",
        newValue: "in_preparation",
        fieldType: "status",
        impact: "medium"
      },
      {
        field: "Salle assignée",
        oldValue: null,
        newValue: "Urgences gynéco",
        fieldType: "location",
        impact: "low"
      }
    ],
    details: "Prise en charge immédiate d'Aisha Mohamadou pour hémorragie génitale",
    entityId: 8,
    entityName: "Aisha Mohamadou",
    entityType: "patient",
    justification: "Urgence vitale nécessitant prise en charge immédiate",
    reviewedBy: null,
    approvedBy: "Dr. Ngo Bala",
    approvalTimestamp: "09:56",
    impact: "high",
    reversible: false,
    category: "emergency_response",
    priority: "critical",
    clinicCode: "CSJ-YDE",
    clinicName: "Clinique Saint Jean - Yaoundé",
    deviceInfo: {
      device: "Tablet",
      os: "iOS",
      browser: "Safari",
      ip: "192.168.1.78"
    },
    relatedEvents: [
      {
        type: "emergency_team_activated",
        timestamp: "09:55",
        details: "Activation équipe gynécologie d'urgence"
      },
      {
        type: "room_prepared",
        timestamp: "09:56",
        details: "Préparation salle urgences gynéco"
      }
    ]
  },
  {
    id: 8,
    type: "patient",
    action: "update",
    user: {
      id: "INF-005",
      name: "Jean Mballa",
      role: "Infirmier",
      specialty: "Urgences"
    },
    timestamp: "09:15",
    fullTimestamp: "2024-01-15T09:15:00Z",
    changes: [
      {
        field: "Notes",
        oldValue: "Fièvre élevée",
        newValue: "Fièvre élevée persistante depuis 2 jours, irritabilité, refus alimentaire",
        fieldType: "notes",
        impact: "low"
      }
    ],
    details: "Mise à jour des notes cliniques pour Marie Ekambi après évaluation complémentaire",
    entityId: 1,
    entityName: "Marie Ekambi",
    entityType: "patient",
    justification: "Complément d'informations suite à l'entretien avec la mère",
    reviewedBy: "Dr. Kouam",
    approvedBy: "Jean Mballa",
    approvalTimestamp: "09:16",
    impact: "low",
    reversible: true,
    category: "documentation",
    priority: "low",
    clinicCode: "CM-LIM",
    clinicName: "Centre Médical - Limbé",
    deviceInfo: {
      device: "Tablet",
      os: "Android",
      browser: "Chrome",
      ip: "192.168.1.89"
    },
    relatedEvents: [
      {
        type: "parent_interview",
        timestamp: "09:12",
        details: "Entretien avec la mère de l'enfant"
      },
      {
        type: "clinical_assessment",
        timestamp: "09:14",
        details: "Évaluation clinique complémentaire"
      }
    ]
  }
];

// Catégories d'historique pour le filtrage
export const historyCategories = {
  urgency_escalation: "Escalade d'urgence",
  emergency_escalation: "Urgence vitale",
  improvement: "Amélioration",
  admission: "Admission",
  workflow: "Flux de travail",
  system_configuration: "Configuration système",
  emergency_response: "Réponse d'urgence",
  documentation: "Documentation"
};

// Types d'actions possibles
export const actionTypes = {
  create: "Création",
  update: "Modification",
  delete: "Suppression",
  configuration: "Configuration",
  approval: "Approbation",
  review: "Révision"
};

// Types d'entités
export const entityTypes = {
  patient: "Patient",
  doctor: "Médecin",
  system: "Système",
  configuration: "Configuration",
  notification: "Notification"
};

// Niveaux d'impact
export const impactLevels = {
  low: { label: "Faible", color: "green", priority: 1 },
  medium: { label: "Moyen", color: "yellow", priority: 2 },
  high: { label: "Élevé", color: "orange", priority: 3 },
  critical: { label: "Critique", color: "red", priority: 4 }
};

// Fonctions utilitaires pour l'historique
export const getHistoryByEntity = (entityId: number) => {
  return mockModificationHistory.filter(item => item.entityId === entityId);
};

export const getHistoryByUser = (userId: string) => {
  return mockModificationHistory.filter(item => item.user.id === userId);
};

export const getHistoryByCategory = (category: string) => {
  return mockModificationHistory.filter(item => item.category === category);
};

export const getHistoryByTimeRange = (startTime: string, endTime: string) => {
  return mockModificationHistory.filter(item => {
    const itemTime = new Date(`${new Date().toDateString()} ${item.timestamp}`);
    const start = new Date(`${new Date().toDateString()} ${startTime}`);
    const end = new Date(`${new Date().toDateString()} ${endTime}`);
    
    return itemTime >= start && itemTime <= end;
  });
};

export const getRecentHistory = (minutes: number = 60) => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - minutes * 60000);
  
  return mockModificationHistory.filter(item => {
    const itemTime = new Date(`${now.toDateString()} ${item.timestamp}`);
    return itemTime >= cutoff;
  });
};

export const getCriticalChanges = () => {
  return mockModificationHistory.filter(item => 
    item.priority === 'critical' || 
    item.impact === 'high' ||
    item.category === 'emergency_escalation'
  );
};

export const getUrgencyChanges = () => {
  return mockModificationHistory.filter(item => 
    item.changes.some(change => change.fieldType === 'urgency')
  );
};

export const getReversibleChanges = () => {
  return mockModificationHistory.filter(item => item.reversible === true);
};

// Statistiques de l'historique
export const getHistoryStats = () => {
  const total = mockModificationHistory.length;
  const byCategory = {};
  const byUser = {};
  const byImpact = { low: 0, medium: 0, high: 0, critical: 0 };
  
  mockModificationHistory.forEach(item => {
    // Par catégorie
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    
    // Par utilisateur
    byUser[item.user.name] = (byUser[item.user.name] || 0) + 1;
    
    // Par impact
    byImpact[item.impact]++;
  });
  
  return {
    total,
    byCategory,
    byUser,
    byImpact,
    reversibleCount: getReversibleChanges().length,
    urgencyChangesCount: getUrgencyChanges().length,
    criticalChangesCount: getCriticalChanges().length
  };
};

// Générateur d'entrée d'historique
export const createHistoryEntry = (data: {
  type: string;
  action: string;
  user: any;
  entityId?: number;
  entityName?: string;
  changes: any[];
  details: string;
  justification?: string;
  category: string;
  priority: string;
  clinicCode?: string;
  clinicName?: string;
}) => {
  return {
    id: Date.now() + Math.random(),
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    fullTimestamp: new Date().toISOString(),
    entityType: data.type,
    reviewedBy: null,
    approvedBy: data.user.name,
    approvalTimestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    impact: calculateImpact(data.changes),
    reversible: determineReversibility(data.changes),
    deviceInfo: {
      device: "Unknown",
      os: "Unknown",
      browser: "Unknown",
      ip: "Unknown"
    },
    relatedEvents: [],
    ...data
  };
};

// Fonctions d'aide pour la création d'historique
const calculateImpact = (changes: any[]): 'low' | 'medium' | 'high' | 'critical' => {
  const urgencyChanges = changes.filter(c => c.fieldType === 'urgency');
  
  if (urgencyChanges.length > 0) {
    const maxDifference = Math.max(...urgencyChanges.map(c => 
      Math.abs(c.newValue - c.oldValue)
    ));
    
    if (maxDifference >= 3) return 'critical';
    if (maxDifference >= 2) return 'high';
    if (maxDifference >= 1) return 'medium';
  }
  
  return 'low';
};

const determineReversibility = (changes: any[]): boolean => {
  // Les changements vers urgence vitale (5) sont généralement non réversibles
  return !changes.some(c => 
    c.fieldType === 'urgency' && 
    c.newValue === 5
  );
};

// Templates pour différents types de modifications
export const historyTemplates = {
  urgencyIncrease: (patient: any, oldLevel: number, newLevel: number, reason: string) => ({
    type: "patient",
    action: "update",
    entityId: patient.id,
    entityName: patient.name,
    changes: [{
      field: "Niveau d'urgence",
      oldValue: oldLevel,
      newValue: newLevel,
      fieldType: "urgency",
      impact: newLevel >= 5 ? "critical" : newLevel >= 4 ? "high" : "medium"
    }],
    details: reason,
    category: newLevel >= 5 ? "emergency_escalation" : "urgency_escalation",
    priority: newLevel >= 5 ? "critical" : "high",
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  }),
  
  statusChange: (patient: any, oldStatus: string, newStatus: string, reason: string) => ({
    type: "patient",
    action: "update",
    entityId: patient.id,
    entityName: patient.name,
    changes: [{
      field: "Statut",
      oldValue: oldStatus,
      newValue: newStatus,
      fieldType: "status",
      impact: "low"
    }],
    details: reason,
    category: "workflow",
    priority: "medium",
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  }),
  
  patientAdmission: (patient: any) => ({
    type: "patient",
    action: "create",
    entityId: patient.id,
    entityName: patient.name,
    changes: [{
      field: "Création patient",
      oldValue: null,
      newValue: "Nouveau patient",
      fieldType: "creation",
      impact: "medium"
    }],
    details: `Nouveau patient ${patient.name}, ${patient.age} ans, ${patient.specialty}`,
    category: "admission",
    priority: patient.urgency >= 4 ? "high" : "medium",
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  })
};

export default mockModificationHistory;