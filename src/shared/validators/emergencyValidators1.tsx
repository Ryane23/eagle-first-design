import { EmergencyCase, EmergencyAlert } from '@hooks/useEmergencyManagement';
import { EMERGENCY_SEVERITY_LEVELS, EMERGENCY_PATIENT_STATUS } from '@constants/emergencyConstants';

// Interface pour les résultats de validation
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Valider un cas d'urgence complet
export const validateEmergencyCase = (emergencyCase: Partial<EmergencyCase>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation du nom du patient
  if (!emergencyCase.patientName || emergencyCase.patientName.trim().length === 0) {
    errors.push('Le nom du patient est requis');
  } else if (emergencyCase.patientName.trim().length < 2) {
    errors.push('Le nom du patient doit contenir au moins 2 caractères');
  }

  // Validation de l'âge
  if (emergencyCase.age === undefined || emergencyCase.age === null) {
    errors.push('L\'âge du patient est requis');
  } else if (emergencyCase.age < 0 || emergencyCase.age > 150) {
    errors.push('L\'âge doit être compris entre 0 et 150 ans');
  } else if (emergencyCase.age > 100) {
    warnings.push('Âge élevé détecté - vérifier la saisie');
  }

  // Validation du genre
  if (!emergencyCase.gender || !['M', 'F'].includes(emergencyCase.gender)) {
    errors.push('Le genre doit être spécifié (M ou F)');
  }

  // Validation du niveau de sévérité
  if (!emergencyCase.severity || !Object.keys(EMERGENCY_SEVERITY_LEVELS).includes(emergencyCase.severity.toString())) {
    errors.push('Le niveau de sévérité doit être compris entre 1 et 5');
  }

  // Validation des symptômes
  if (!emergencyCase.symptoms || emergencyCase.symptoms.length === 0) {
    errors.push('Au moins un symptôme doit être spécifié');
  } else if (emergencyCase.symptoms.some(symptom => symptom.trim().length === 0)) {
    errors.push('Les symptômes ne peuvent pas être vides');
  }

  // Validation du personnel de triage
  if (!emergencyCase.triageNurse || emergencyCase.triageNurse.trim().length === 0) {
    errors.push('L\'infirmière de triage doit être spécifiée');
  }

  // Validation du statut
  if (emergencyCase.status && !Object.values(EMERGENCY_PATIENT_STATUS).some(status => status.value === emergencyCase.status)) {
    errors.push('Statut du patient invalide');
  }

  // Validation de l'heure d'arrivée
  if (emergencyCase.arrivalTime) {
    const now = new Date();
    const arrivalTime = new Date(emergencyCase.arrivalTime);
    
    if (arrivalTime > now) {
      errors.push('L\'heure d\'arrivée ne peut pas être dans le futur');
    }
    
    const hoursDiff = (now.getTime() - arrivalTime.getTime()) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      warnings.push('Heure d\'arrivée supérieure à 24 heures');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider les signes vitaux d'urgence
export const validateEmergencyVitalSigns = (vitalSigns: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!vitalSigns) {
    return { isValid: true, errors: [], warnings: ['Aucun signe vital fourni'] };
  }

  // Validation de la tension artérielle
  if (vitalSigns.bloodPressure) {
    const bpPattern = /^\d{2,3}\/\d{2,3}$/;
    if (!bpPattern.test(vitalSigns.bloodPressure)) {
      errors.push('Format de tension artérielle invalide (ex: 120/80)');
    } else {
      const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
      
      if (systolic < 50 || systolic > 250) {
        errors.push('Pression systolique anormale (50-250 mmHg)');
      } else if (systolic > 180 || systolic < 90) {
        warnings.push('Pression systolique critique détectée');
      }
      
      if (diastolic < 30 || diastolic > 150) {
        errors.push('Pression diastolique anormale (30-150 mmHg)');
      } else if (diastolic > 110 || diastolic < 60) {
        warnings.push('Pression diastolique critique détectée');
      }
      
      if (systolic <= diastolic) {
        errors.push('La pression systolique doit être supérieure à la diastolique');
      }
    }
  }

  // Validation de la fréquence cardiaque
  if (vitalSigns.heartRate !== undefined) {
    if (typeof vitalSigns.heartRate !== 'number' || vitalSigns.heartRate < 20 || vitalSigns.heartRate > 300) {
      errors.push('Fréquence cardiaque invalide (20-300 bpm)');
    } else if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) {
      warnings.push('Fréquence cardiaque anormale détectée');
    }
  }

  // Validation de la température
  if (vitalSigns.temperature !== undefined) {
    if (typeof vitalSigns.temperature !== 'number' || vitalSigns.temperature < 30 || vitalSigns.temperature > 45) {
      errors.push('Température invalide (30-45°C)');
    } else if (vitalSigns.temperature > 39 || vitalSigns.temperature < 35) {
      warnings.push('Température critique détectée');
    }
  }

  // Validation de la saturation en oxygène
  if (vitalSigns.oxygenSaturation !== undefined) {
    if (typeof vitalSigns.oxygenSaturation !== 'number' || vitalSigns.oxygenSaturation < 50 || vitalSigns.oxygenSaturation > 100) {
      errors.push('Saturation en oxygène invalide (50-100%)');
    } else if (vitalSigns.oxygenSaturation < 90) {
      warnings.push('Saturation en oxygène critique');
    } else if (vitalSigns.oxygenSaturation < 95) {
      warnings.push('Saturation en oxygène basse');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider une alerte d'urgence
export const validateEmergencyAlert = (alert: Partial<EmergencyAlert>): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation du type d'alerte
  if (!alert.type) {
    errors.push('Type d\'alerte requis');
  }

  // Validation du message
  if (!alert.message || alert.message.trim().length === 0) {
    errors.push('Message d\'alerte requis');
  } else if (alert.message.length > 500) {
    errors.push('Message d\'alerte trop long (max 500 caractères)');
  }

  // Validation de l'urgence
  if (!alert.urgency || !['low', 'medium', 'high', 'critical'].includes(alert.urgency)) {
    errors.push('Niveau d\'urgence invalide');
  }

  // Validation de l'ID patient si fourni
  if (alert.patientId && alert.patientId.trim().length === 0) {
    errors.push('ID patient ne peut pas être vide');
  }

  // Validation du timestamp
  if (alert.timestamp) {
    const now = new Date();
    const alertTime = new Date(alert.timestamp);
    
    if (alertTime > now) {
      errors.push('L\'heure de l\'alerte ne peut pas être dans le futur');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider les données de triage
export const validateTriageData = (triageData: {
  severity: number;
  symptoms: string[];
  vitalSigns?: any;
  chiefComplaint: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation de la plainte principale
  if (!triageData.chiefComplaint || triageData.chiefComplaint.trim().length === 0) {
    errors.push('Motif de consultation requis');
  } else if (triageData.chiefComplaint.length > 200) {
    warnings.push('Motif de consultation très long');
  }

  // Validation de la sévérité
  if (!triageData.severity || triageData.severity < 1 || triageData.severity > 5) {
    errors.push('Niveau de sévérité invalide (1-5)');
  }

  // Validation des symptômes
  if (!triageData.symptoms || triageData.symptoms.length === 0) {
    errors.push('Au moins un symptôme doit être spécifié');
  } else {
    const invalidSymptoms = triageData.symptoms.filter(s => !s || s.trim().length === 0);
    if (invalidSymptoms.length > 0) {
      errors.push('Certains symptômes sont vides');
    }
  }

  // Validation des signes vitaux si fournis
  if (triageData.vitalSigns) {
    const vitalSignsValidation = validateEmergencyVitalSigns(triageData.vitalSigns);
    errors.push(...vitalSignsValidation.errors);
    warnings.push(...vitalSignsValidation.warnings);
  } else if (triageData.severity >= 4) {
    warnings.push('Signes vitaux recommandés pour les cas urgents/critiques');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider la capacité du département
export const validateDepartmentCapacity = (departmentData: {
  capacity: number;
  occupied: number;
  emergencyBeds: number;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation de la capacité totale
  if (departmentData.capacity <= 0) {
    errors.push('La capacité doit être supérieure à 0');
  }

  // Validation du nombre occupé
  if (departmentData.occupied < 0) {
    errors.push('Le nombre de lits occupés ne peut pas être négatif');
  } else if (departmentData.occupied > departmentData.capacity) {
    errors.push('Le nombre de lits occupés ne peut pas dépasser la capacité');
  }

  // Validation des lits d'urgence
  if (departmentData.emergencyBeds < 0) {
    errors.push('Le nombre de lits d\'urgence ne peut pas être négatif');
  } else if (departmentData.emergencyBeds > departmentData.capacity) {
    errors.push('Le nombre de lits d\'urgence ne peut pas dépasser la capacité totale');
  }

  // Avertissements de capacité
  const occupancyRate = (departmentData.occupied / departmentData.capacity) * 100;
  if (occupancyRate >= 90) {
    warnings.push('Taux d\'occupation critique (≥90%)');
  } else if (occupancyRate >= 75) {
    warnings.push('Taux d\'occupation élevé (≥75%)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider l'assignation de personnel
export const validateStaffAssignment = (assignment: {
  patientId: string;
  staffId: string;
  staffType: 'doctor' | 'nurse';
  maxPatients?: number;
  currentPatients?: number;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation des IDs
  if (!assignment.patientId || assignment.patientId.trim().length === 0) {
    errors.push('ID patient requis');
  }

  if (!assignment.staffId || assignment.staffId.trim().length === 0) {
    errors.push('ID personnel requis');
  }

  // Validation du type de personnel
  if (!['doctor', 'nurse'].includes(assignment.staffType)) {
    errors.push('Type de personnel invalide');
  }

  // Validation de la charge de travail
  if (assignment.maxPatients && assignment.currentPatients !== undefined) {
    if (assignment.currentPatients >= assignment.maxPatients) {
      warnings.push('Personnel à capacité maximale');
    } else if (assignment.currentPatients >= assignment.maxPatients * 0.8) {
      warnings.push('Personnel proche de la capacité maximale');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider les temps d'attente
export const validateWaitTimes = (waitData: {
  arrivalTime: Date;
  triageTime?: Date;
  treatmentTime?: Date;
  severity: number;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const now = new Date();
  const waitTime = Math.floor((now.getTime() - waitData.arrivalTime.getTime()) / (1000 * 60));

  // Vérification des seuils par sévérité
  const maxWaitTimes = { 1: 240, 2: 120, 3: 60, 4: 30, 5: 0 };
  const maxWait = maxWaitTimes[waitData.severity as keyof typeof maxWaitTimes];

  if (waitTime > maxWait && maxWait > 0) {
    warnings.push(`Temps d'attente dépassé pour le niveau ${waitData.severity}`);
  }

  // Temps de triage
  if (waitData.triageTime) {
    const triageWait = Math.floor((waitData.triageTime.getTime() - waitData.arrivalTime.getTime()) / (1000 * 60));
    if (triageWait > 15) {
      warnings.push('Temps de triage élevé (>15 min)');
    }
    if (triageWait < 0) {
      errors.push('Heure de triage incohérente');
    }
  } else if (waitTime > 20) {
    warnings.push('Patient non encore trié après 20 minutes');
  }

  // Temps de traitement
  if (waitData.treatmentTime) {
    if (waitData.treatmentTime < waitData.arrivalTime) {
      errors.push('Heure de traitement incohérente');
    }
    if (waitData.triageTime && waitData.treatmentTime < waitData.triageTime) {
      errors.push('Heure de traitement antérieure au triage');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Valider une configuration d'équipement
export const validateEquipmentConfig = (equipment: {
  name: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order';
  location: string;
  lastCheck?: Date;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation du nom
  if (!equipment.name || equipment.name.trim().length === 0) {
    errors.push('Nom de l\'équipement requis');
  }

  // Validation du statut
  if (!['available', 'in_use', 'maintenance', 'out_of_order'].includes(equipment.status)) {
    errors.push('Statut d\'équipement invalide');
  }

  // Validation de la localisation
  if (!equipment.location || equipment.location.trim().length === 0) {
    errors.push('Localisation de l\'équipement requise');
  }

  // Validation de la dernière vérification
  if (equipment.lastCheck) {
    const now = new Date();
    const hoursSinceCheck = (now.getTime() - equipment.lastCheck.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCheck > 24 && equipment.status === 'available') {
      warnings.push('Équipement non vérifié depuis plus de 24h');
    }
    
    if (equipment.lastCheck > now) {
      errors.push('Date de dernière vérification dans le futur');
    }
  } else {
    warnings.push('Aucune date de vérification spécifiée');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};