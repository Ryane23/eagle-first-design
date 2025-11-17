import { VALIDATION_RULES, SYSTEM_LIMITS } from '@constants/emergencyConstants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export const validateEmergencyLevel = (level: number): boolean => {
  return level >= 1 && level <= 5 && Number.isInteger(level);
};

export const validateContactMessage = (message: string): boolean => {
  if (!message || typeof message !== 'string') return false;
  
  const trimmed = message.trim();
  return trimmed.length >= VALIDATION_RULES.communication.message.minLength &&
         trimmed.length <= VALIDATION_RULES.communication.message.maxLength;
};

export const validatePatientData = (patient: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation du nom
  if (!patient.name || typeof patient.name !== 'string') {
    errors.push('Le nom du patient est requis');
  } else {
    const name = patient.name.trim();
    if (name.length < VALIDATION_RULES.patient.name.minLength) {
      errors.push(`Le nom doit contenir au moins ${VALIDATION_RULES.patient.name.minLength} caractères`);
    }
    if (name.length > VALIDATION_RULES.patient.name.maxLength) {
      errors.push(`Le nom ne peut pas dépasser ${VALIDATION_RULES.patient.name.maxLength} caractères`);
    }
  }

  // Validation de l'âge
  if (patient.age === undefined || patient.age === null) {
    errors.push('L\'âge du patient est requis');
  } else {
    const age = Number(patient.age);
    if (isNaN(age) || !Number.isInteger(age)) {
      errors.push('L\'âge doit être un nombre entier');
    } else {
      if (age < VALIDATION_RULES.patient.age.min) {
        errors.push(`L'âge ne peut pas être négatif`);
      }
      if (age > VALIDATION_RULES.patient.age.max) {
        errors.push(`L'âge ne peut pas dépasser ${VALIDATION_RULES.patient.age.max} ans`);
      }
      if (age > 100) {
        warnings.push('Âge très élevé - vérifiez la saisie');
      }
    }
  }

  // Validation du niveau d'urgence
  if (!validateEmergencyLevel(patient.urgency)) {
    errors.push('Le niveau d\'urgence doit être compris entre 1 et 5');
  }

  // Validation du genre
  if (patient.gender && !['M', 'F'].includes(patient.gender)) {
    errors.push('Le genre doit être M (Masculin) ou F (Féminin)');
  }

  // Validation du téléphone (optionnel mais format si présent)
  if (patient.phone && !validatePhoneNumber(patient.phone)) {
    warnings.push('Format de téléphone invalide');
  }

  // Validation de l'email (optionnel mais format si présent)
  if (patient.email && !validateEmail(patient.email)) {
    warnings.push('Format d\'email invalide');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateUrgencyChange = (
  oldLevel: number, 
  newLevel: number, 
  justification?: string
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation des niveaux
  if (!validateEmergencyLevel(oldLevel)) {
    errors.push('Niveau d\'urgence actuel invalide');
  }
  if (!validateEmergencyLevel(newLevel)) {
    errors.push('Nouveau niveau d\'urgence invalide');
  }

  // Vérification de la justification pour les changements significatifs
  const difference = Math.abs(newLevel - oldLevel);
  if (difference >= 2) {
    if (!justification || justification.trim().length < 10) {
      errors.push('Une justification d\'au moins 10 caractères est requise pour un changement significatif');
    } else if (justification.length > 500) {
      errors.push('La justification ne peut pas dépasser 500 caractères');
    }
  }

  // Avertissements pour certains types de changements
  if (newLevel > oldLevel + 2) {
    warnings.push('Escalade importante du niveau d\'urgence');
  }
  if (newLevel < oldLevel - 2) {
    warnings.push('Réduction importante du niveau d\'urgence');
  }
  if (newLevel === 5 && oldLevel < 4) {
    warnings.push('Passage direct en urgence vitale - vérifiez la pertinence');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateCommunicationData = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation du message
  if (!validateContactMessage(data.message)) {
    errors.push(`Le message doit contenir entre ${VALIDATION_RULES.communication.message.minLength} et ${VALIDATION_RULES.communication.message.maxLength} caractères`);
  }

  // Validation du destinataire
  if (!data.recipient || typeof data.recipient !== 'object') {
    errors.push('Le destinataire est requis');
  } else {
    if (!data.recipient.clinicCode) {
      errors.push('Le code du centre destinataire est requis');
    }
    if (!data.recipient.name) {
      warnings.push('Nom du centre destinataire manquant');
    }
  }

  // Validation du sujet (optionnel)
  if (data.subject && data.subject.length > VALIDATION_RULES.communication.subject.maxLength) {
    errors.push(`Le sujet ne peut pas dépasser ${VALIDATION_RULES.communication.subject.maxLength} caractères`);
  }

  // Validation de la priorité
  if (data.priority && !['normal', 'urgent', 'critical'].includes(data.priority)) {
    errors.push('La priorité doit être normal, urgent ou critical');
  }

  // Validation de l'expéditeur
  if (!data.sender || !data.sender.id) {
    errors.push('Les informations de l\'expéditeur sont requises');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateNotesData = (notes: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (notes && notes.length > VALIDATION_RULES.notes.content.maxLength) {
    errors.push(`Les notes ne peuvent pas dépasser ${VALIDATION_RULES.notes.content.maxLength} caractères`);
  }

  if (notes && notes.trim().length === 0) {
    warnings.push('Les notes sont vides');
  }

  // Vérification de caractères suspects
  if (notes && /[<>{}]/.test(notes)) {
    warnings.push('Les notes contiennent des caractères qui pourraient être problématiques');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateSystemLimits = (data: any, type: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (type) {
    case 'patients':
      if (Array.isArray(data) && data.length > SYSTEM_LIMITS.maxPatients) {
        errors.push(`Le nombre maximum de patients (${SYSTEM_LIMITS.maxPatients}) est dépassé`);
      }
      break;

    case 'notifications':
      if (Array.isArray(data) && data.length > SYSTEM_LIMITS.maxNotifications) {
        warnings.push(`Nombre élevé de notifications (${data.length}/${SYSTEM_LIMITS.maxNotifications})`);
      }
      break;

    case 'history':
      if (Array.isArray(data) && data.length > SYSTEM_LIMITS.maxHistoryItems) {
        warnings.push('Historique volumineux - performance potentiellement impactée');
      }
      break;

    case 'fileSize':
      if (typeof data === 'number' && data > SYSTEM_LIMITS.maxFileSize) {
        errors.push(`La taille du fichier dépasse la limite autorisée (${SYSTEM_LIMITS.maxFileSize / 1024 / 1024}MB)`);
      }
      break;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateTimeConstraints = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation des heures d'arrivée
  if (data.arrivalTime) {
    const arrivalTime = new Date(`${new Date().toDateString()} ${data.arrivalTime}`);
    const now = new Date();
    
    if (arrivalTime > now) {
      errors.push('L\'heure d\'arrivée ne peut pas être dans le futur');
    }
    
    const timeDiff = now.getTime() - arrivalTime.getTime();
    if (timeDiff > 12 * 60 * 60 * 1000) { // Plus de 12 heures
      warnings.push('Heure d\'arrivée très ancienne');
    }
  }

  // Validation des temps d'attente
  if (data.waitTime !== undefined) {
    if (data.waitTime < 0) {
      errors.push('Le temps d\'attente ne peut pas être négatif');
    }
    if (data.waitTime > 8 * 60) { // Plus de 8 heures
      warnings.push('Temps d\'attente exceptionnellement long');
    }
  }

  // Validation des rendez-vous
  if (data.appointment) {
    const appointmentTime = new Date(`${new Date().toDateString()} ${data.appointment}`);
    const now = new Date();
    
    const timeDiff = appointmentTime.getTime() - now.getTime();
    if (timeDiff < -2 * 60 * 60 * 1000) { // Plus de 2 heures de retard
      warnings.push('Rendez-vous en retard significatif');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateWorkflowTransition = (
  currentStatus: string, 
  newStatus: string, 
  context?: any
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validTransitions: { [key: string]: string[] } = {
    'waiting': ['in_preparation', 'ready', 'completed'],
    'in_preparation': ['ready', 'waiting', 'completed'],
    'ready': ['in_consultation', 'waiting', 'completed'],
    'in_consultation': ['completed', 'waiting'],
    'completed': [] // État final
  };

  if (!validTransitions[currentStatus]) {
    errors.push(`Statut actuel invalide: ${currentStatus}`);
  } else if (!validTransitions[currentStatus].includes(newStatus)) {
    errors.push(`Transition invalide de ${currentStatus} vers ${newStatus}`);
  }

  // Vérifications contextuelles
  if (context) {
    if (newStatus === 'in_consultation' && !context.doctor) {
      errors.push('Un médecin doit être assigné pour démarrer la consultation');
    }
    
    if (newStatus === 'ready' && context.urgency >= 5) {
      warnings.push('Patient en urgence vitale marqué comme prêt - vérifiez la priorité');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateUserPermissions = (
  user: any, 
  action: string, 
  resource?: any
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!user || !user.role) {
    errors.push('Informations utilisateur manquantes');
    return { isValid: false, errors, warnings };
  }

  const permissions: { [key: string]: string[] } = {
    'doctor': ['read', 'update_urgency', 'add_notes', 'start_consultation', 'communicate'],
    'nurse': ['read', 'update_status', 'add_notes', 'communicate'],
    'secretary': ['read', 'communicate', 'schedule'],
    'admin': ['read', 'write', 'delete', 'admin']
  };

  const userPermissions = permissions[user.role.toLowerCase()] || [];
  
  if (!userPermissions.includes(action)) {
    errors.push(`Action non autorisée: ${action} pour le rôle ${user.role}`);
  }

  // Vérifications spécifiques
  if (action === 'update_urgency' && resource?.urgency === 5) {
    if (user.role.toLowerCase() !== 'doctor') {
      errors.push('Seuls les médecins peuvent définir une urgence vitale');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateDataIntegrity = (data: any, schema: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation de la cohérence des données
  if (data.patients && Array.isArray(data.patients)) {
    const patientIds = new Set();
    
    data.patients.forEach((patient: any, index: number) => {
      // Vérification des IDs uniques
      if (patientIds.has(patient.id)) {
        errors.push(`ID patient dupliqué: ${patient.id} à l'index ${index}`);
      }
      patientIds.add(patient.id);
      
      // Cohérence urgence/temps d'attente
      if (patient.urgency >= 4 && patient.waitTime > 30) {
        warnings.push(`Patient ${patient.name}: urgence élevée mais temps d'attente long`);
      }
      
      // Cohérence statut/temps
      if (patient.status === 'completed' && patient.waitTime === 0) {
        warnings.push(`Patient ${patient.name}: statut terminé mais pas de temps d'attente enregistré`);
      }
    });
  }

  // Validation des références
  if (data.history && data.patients) {
    const patientIds = new Set(data.patients.map((p: any) => p.id));
    
    data.history.forEach((entry: any) => {
      if (entry.entityId && !patientIds.has(entry.entityId)) {
        warnings.push(`Référence patient invalide dans l'historique: ${entry.entityId}`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Fonctions utilitaires
export const validatePhoneNumber = (phone: string): boolean => {
  // Format camerounais: +237 suivi de 9 chiffres ou format local
  const patterns = [
    /^\+237[0-9]{9}$/, // Format international
    /^[26][0-9]{8}$/, // Format local (commence par 2 ou 6)
    /^\d{9}$/ // 9 chiffres
  ];
  
  return patterns.some(pattern => pattern.test(phone.replace(/[\s-]/g, '')));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Supprime les balises HTML potentielles
    .replace(/\s+/g, ' ') // Normalise les espaces
    .substring(0, 1000); // Limite la longueur
};

export const validateBusinessRules = (data: any): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Règle: Maximum 3 patients en urgence vitale simultanément
  if (data.patients) {
    const vitalEmergencies = data.patients.filter((p: any) => p.urgency === 5 && p.status !== 'completed');
    if (vitalEmergencies.length > 3) {
      warnings.push('Nombre élevé d\'urgences vitales simultanées');
    }
  }

  // Règle: Temps d'attente cohérent avec l'urgence
  if (data.patients) {
    data.patients.forEach((patient: any) => {
      const maxWaitTime = getMaxWaitTimeForUrgency(patient.urgency);
      if (patient.waitTime > maxWaitTime) {
        warnings.push(`Patient ${patient.name}: temps d'attente dépassé pour niveau ${patient.urgency}`);
      }
    });
  }

  // Règle: Médecin approprié pour la spécialité
  if (data.doctor && data.patients) {
    data.patients.forEach((patient: any) => {
      if (patient.specialty && patient.specialty !== data.doctor.specialty && patient.specialty !== 'Médecine générale') {
        warnings.push(`Patient ${patient.name}: spécialité ${patient.specialty} différente du médecin`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

const getMaxWaitTimeForUrgency = (urgency: number): number => {
  const maxWaitTimes = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  return maxWaitTimes[urgency] || 30;
};

export const createValidationSummary = (validations: ValidationResult[]): ValidationResult => {
  const allErrors = validations.flatMap(v => v.errors);
  const allWarnings = validations.flatMap(v => v.warnings || []);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};