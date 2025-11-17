import { formatWaitTime, getUrgencyColor, getStatusBadgeVariant } from '@utils/statusUtils';
import { formatDateTime } from '@utils/dateUtils';

export const transformPatientsForTable = (patients: any[]) => {
  return patients.map(patient => ({
    id: patient.id,
    urgency: patient.urgency,
    urgencyColor: getUrgencyColor(patient.urgency),
    urgencyLabel: getUrgencyLabel(patient.urgency),
    name: patient.name,
    displayName: `${patient.name} (${patient.age} ans)`,
    age: patient.age,
    gender: patient.gender,
    genderDisplay: patient.gender === 'M' ? 'Homme' : 'Femme',
    status: patient.status,
    statusDisplay: getStatusLabel(patient.status),
    statusVariant: getStatusBadgeVariant(patient.status),
    waitTime: patient.waitTime,
    waitTimeDisplay: formatWaitTime(patient.waitTime),
    waitTimeStatus: getWaitTimeStatus(patient.waitTime, patient.urgency),
    clinic: {
      code: patient.clinicCode,
      name: patient.clinicName,
      displayName: `${patient.clinicCode} - ${patient.clinicName}`
    },
    specialty: patient.specialty,
    doctor: patient.doctor,
    notes: patient.notes,
    arrivalTime: patient.arrivalTime,
    arrivalTimeDisplay: formatDateTime(patient.arrivalTime),
    estimatedTime: patient.appointment,
    estimatedTimeDisplay: formatDateTime(patient.appointment),
    lastModified: patient.lastModified,
    lastModifiedDisplay: formatDateTime(patient.lastModified),
    // Données calculées
    priorityScore: calculatePriorityScore(patient),
    riskLevel: calculateRiskLevel(patient),
    estimatedTreatmentTime: estimateTreatmentTime(patient),
    totalExpectedTime: (patient.waitTime || 0) + estimateTreatmentTime(patient),
    isOverdue: isPatientOverdue(patient),
    needsAttention: needsImmediateAttention(patient)
  }));
};

export const transformPatientsForPriority = (patients: any[], history: any[]) => {
  return patients.map(patient => ({
    ...patient,
    priorityLevel: patient.urgency,
    priorityScore: calculatePriorityScore(patient),
    priorityLabel: getUrgencyLabel(patient.urgency),
    priorityColor: getUrgencyColor(patient.urgency),
    modificationHistory: history
      .filter(h => h.entityId === patient.id)
      .map(h => ({
        id: h.id,
        timestamp: h.timestamp,
        timestampDisplay: formatDateTime(h.timestamp),
        oldLevel: h.changes[0]?.oldValue || patient.urgency,
        newLevel: h.changes[0]?.newValue || patient.urgency,
        user: h.user.name,
        userRole: h.user.role,
        reason: h.details,
        reasonSummary: h.details.substring(0, 50) + (h.details.length > 50 ? '...' : ''),
        impact: calculateChangeImpact(h.changes),
        reversible: isReversibleChange(h.changes),
        justification: h.justification || '',
        approved: h.approvedBy ? true : false,
        approver: h.approvedBy
      })),
    riskFactors: calculateRiskFactors(patient),
    treatmentPriority: calculateTreatmentPriority(patient),
    resourceRequirements: calculateResourceRequirements(patient),
    nextRecommendedAction: getNextRecommendedAction(patient),
    canModifyPriority: canUserModifyPriority(patient),
    escalationRequired: requiresEscalation(patient)
  }));
};

export const transformPatientsForCards = (patients: any[]) => {
  return patients.map(patient => ({
    ...transformPatientsForTable([patient])[0],
    cardType: determineCardType(patient),
    cardVariant: determineCardVariant(patient),
    cardActions: getAvailableActions(patient),
    highlighted: shouldHighlightCard(patient),
    compactMode: false,
    showVitalSigns: patient.urgency >= 4,
    showMedicalHistory: patient.urgency >= 3,
    showEstimatedTime: true
  }));
};

export const transformPatientsForTimeline = (patients: any[]) => {
  return patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    urgency: patient.urgency,
    startTime: patient.arrivalTime,
    estimatedEndTime: calculateEstimatedEndTime(patient),
    actualEndTime: patient.status === 'completed' ? patient.completedTime : null,
    duration: estimateTreatmentTime(patient),
    actualDuration: calculateActualDuration(patient),
    status: patient.status,
    milestone: getCurrentMilestone(patient),
    nextMilestone: getNextMilestone(patient),
    progress: calculateProgress(patient),
    delays: calculateDelays(patient),
    specialty: patient.specialty,
    doctor: patient.doctor,
    room: patient.room || null,
    notes: patient.notes
  }));
};

export const transformPatientsForExport = (patients: any[], format: 'pdf' | 'excel' | 'csv') => {
  const baseTransformation = patients.map(patient => ({
    'ID Patient': patient.id,
    'Nom': patient.name,
    'Âge': patient.age,
    'Genre': patient.gender === 'M' ? 'Masculin' : 'Féminin',
    'Niveau d\'urgence': `${patient.urgency}/5 - ${getUrgencyLabel(patient.urgency)}`,
    'Statut': getStatusLabel(patient.status),
    'Temps d\'attente (min)': patient.waitTime || 0,
    'Spécialité': patient.specialty,
    'Médecin': patient.doctor,
    'Centre': `${patient.clinicCode} - ${patient.clinicName}`,
    'Heure d\'arrivée': patient.arrivalTime,
    'Rendez-vous prévu': patient.appointment || 'Non défini',
    'Notes': patient.notes || '',
    'Dernière modification': formatDateTime(patient.lastModified)
  }));

  if (format === 'pdf') {
    return baseTransformation.map(patient => ({
      ...patient,
      'Score de priorité': calculatePriorityScore(patients.find(p => p.id === patient['ID Patient'])),
      'Niveau de risque': calculateRiskLevel(patients.find(p => p.id === patient['ID Patient'])),
      'Temps estimé de traitement (min)': estimateTreatmentTime(patients.find(p => p.id === patient['ID Patient']))
    }));
  }

  return baseTransformation;
};

export const transformPatientForDetails = (patient: any, history: any[] = []) => {
  return {
    // Informations de base
    basicInfo: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      genderDisplay: patient.gender === 'M' ? 'Masculin' : 'Féminin',
      phone: patient.emergencyContact?.phone || patient.phone,
      email: patient.email || patient.emergencyContact?.email
    },

    // État médical
    medicalStatus: {
      urgency: patient.urgency,
      urgencyLabel: getUrgencyLabel(patient.urgency),
      urgencyColor: getUrgencyColor(patient.urgency),
      status: patient.status,
      statusDisplay: getStatusLabel(patient.status),
      specialty: patient.specialty,
      doctor: patient.doctor,
      notes: patient.notes || '',
      lastModified: formatDateTime(patient.lastModified)
    },

    // Temporalité
    timing: {
      arrivalTime: patient.arrivalTime,
      arrivalTimeDisplay: formatDateTime(patient.arrivalTime),
      waitTime: patient.waitTime || 0,
      waitTimeDisplay: formatWaitTime(patient.waitTime || 0),
      estimatedTreatmentTime: estimateTreatmentTime(patient),
      totalExpectedTime: (patient.waitTime || 0) + estimateTreatmentTime(patient),
      appointment: patient.appointment,
      appointmentDisplay: patient.appointment ? formatDateTime(patient.appointment) : 'Non défini',
      isOverdue: isPatientOverdue(patient),
      delayMinutes: calculateDelay(patient)
    },

    // Localisation
    location: {
      center: {
        code: patient.clinicCode,
        name: patient.clinicName,
        fullName: `${patient.clinicCode} - ${patient.clinicName}`
      },
      room: patient.room || null,
      previousLocation: patient.previousLocation || null
    },

    // Données cliniques
    clinical: {
      vitalSigns: transformVitalSigns(patient.vitalSigns),
      medicalHistory: patient.medicalHistory || [],
      currentMedications: patient.currentMedications || [],
      allergies: patient.allergies || [],
      riskFactors: calculateRiskFactors(patient),
      riskLevel: calculateRiskLevel(patient),
      riskScore: calculateRiskScore(patient)
    },

    // Contact d'urgence
    emergencyContact: patient.emergencyContact ? {
      name: patient.emergencyContact.name,
      relation: patient.emergencyContact.relation,
      phone: patient.emergencyContact.phone,
      email: patient.emergencyContact.email || null
    } : null,

    // Historique des modifications
    history: history
      .filter(h => h.entityId === patient.id)
      .map(h => ({
        id: h.id,
        timestamp: formatDateTime(h.timestamp),
        user: `${h.user.name} (${h.user.role})`,
        action: h.action,
        changes: h.changes.map(change => ({
          field: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
          display: `${change.field}: ${change.oldValue} → ${change.newValue}`
        })),
        reason: h.details,
        justification: h.justification || '',
        impact: calculateChangeImpact(h.changes)
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),

    // Actions disponibles
    availableActions: getAvailableActions(patient),

    // Métriques calculées
    metrics: {
      priorityScore: calculatePriorityScore(patient),
      treatmentPriority: calculateTreatmentPriority(patient),
      systemLoad: 'normal', // À calculer selon le contexte
      recommendations: getPatientRecommendations(patient)
    }
  };
};

// Fonctions utilitaires
const getUrgencyLabel = (level: number): string => {
  const labels = {
    1: 'Non urgent',
    2: 'Peu urgent',
    3: 'Urgent',
    4: 'Très urgent',
    5: 'Urgence vitale'
  };
  return labels[level] || 'Inconnu';
};

const getStatusLabel = (status: string): string => {
  const labels = {
    'waiting': 'En attente',
    'in_preparation': 'En préparation',
    'ready': 'Prêt',
    'in_consultation': 'En consultation',
    'completed': 'Terminé'
  };
  return labels[status] || status;
};

const getWaitTimeStatus = (waitTime: number, urgency: number): 'normal' | 'warning' | 'critical' => {
  const thresholds = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  const maxWait = thresholds[urgency] || 30;
  
  if (waitTime <= maxWait * 0.7) return 'normal';
  if (waitTime <= maxWait) return 'warning';
  return 'critical';
};

const calculatePriorityScore = (patient: any): number => {
  const urgencyScore = patient.urgency * 20;
  const waitTimeScore = Math.min((patient.waitTime || 0) / 3, 20);
  const ageScore = patient.age > 65 || patient.age < 5 ? 10 : 0;
  const clinicalScore = patient.vitalSigns ? 10 : 0;
  
  return Math.round(urgencyScore + waitTimeScore + ageScore + clinicalScore);
};

const calculateRiskLevel = (patient: any): 'low' | 'medium' | 'high' | 'critical' => {
  let score = 0;
  
  score += patient.urgency * 2;
  if (patient.age > 75 || patient.age < 2) score += 3;
  if ((patient.waitTime || 0) > 30) score += 2;
  if (patient.vitalSigns) {
    if (patient.vitalSigns.temperature > 39) score += 2;
    if (patient.vitalSigns.oxygenSaturation < 90) score += 3;
  }
  
  if (score >= 10) return 'critical';
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

const estimateTreatmentTime = (patient: any): number => {
  const baseTimes = {
    'Cardiologie': 30,
    'Pédiatrie': 25,
    'Pneumologie': 25,
    'Dermatologie': 20,
    'Neurologie': 35,
    'Médecine générale': 20
  };
  
  let time = baseTimes[patient.specialty] || 25;
  if (patient.urgency >= 5) time += 15;
  else if (patient.urgency >= 4) time += 10;
  if (patient.age > 70 || patient.age < 5) time += 5;
  
  return time;
};

const isPatientOverdue = (patient: any): boolean => {
  const thresholds = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  const maxWait = thresholds[patient.urgency] || 30;
  return (patient.waitTime || 0) > maxWait;
};

const needsImmediateAttention = (patient: any): boolean => {
  if (patient.urgency >= 5) return true;
  if (patient.urgency >= 4 && (patient.waitTime || 0) > 20) return true;
  if (patient.vitalSigns?.oxygenSaturation < 90) return true;
  return false;
};

const calculateChangeImpact = (changes: any[]): 'low' | 'medium' | 'high' => {
  const urgencyChanges = changes.filter(c => c.field.includes('urgence'));
  if (urgencyChanges.length === 0) return 'low';
  
  const maxDifference = Math.max(...urgencyChanges.map(c => Math.abs(c.newValue - c.oldValue)));
  if (maxDifference >= 3) return 'high';
  if (maxDifference >= 2) return 'medium';
  return 'low';
};

const isReversibleChange = (changes: any[]): boolean => {
  return !changes.some(c => c.newValue === 5 && c.field.includes('urgence'));
};

const calculateRiskFactors = (patient: any): string[] => {
  const factors = [];
  
  if (patient.age > 75) factors.push('Âge avancé');
  if (patient.age < 2) factors.push('Très jeune âge');
  if (patient.urgency >= 5) factors.push('Urgence vitale');
  if ((patient.waitTime || 0) > 30) factors.push('Attente prolongée');
  if (patient.medicalHistory?.length > 0) factors.push('Antécédents médicaux');
  if (patient.allergies?.length > 0) factors.push('Allergies connues');
  
  return factors;
};

const calculateTreatmentPriority = (patient: any): number => {
  let priority = patient.urgency * 2;
  if (patient.age > 65) priority += 1;
  if ((patient.waitTime || 0) > 30) priority += 1;
  if (patient.vitalSigns?.oxygenSaturation < 95) priority += 2;
  return Math.min(10, priority);
};

const calculateResourceRequirements = (patient: any): string[] => {
  const requirements = ['Salle de consultation'];
  
  if (patient.urgency >= 5) {
    requirements.push('Équipement de monitoring');
    requirements.push('Personnel spécialisé');
    requirements.push('Matériel d\'urgence');
  } else if (patient.urgency >= 4) {
    requirements.push('Monitoring de base');
  }
  
  if (patient.specialty === 'Cardiologie') {
    requirements.push('ECG');
  }
  
  return requirements;
};

const getNextRecommendedAction = (patient: any): string => {
  if (patient.status === 'ready') return 'Débuter consultation';
  if (patient.urgency >= 5) return 'Intervention immédiate';
  if (patient.urgency >= 4 && (patient.waitTime || 0) > 15) return 'Évaluation prioritaire';
  if ((patient.waitTime || 0) > 45) return 'Vérifier état patient';
  return 'Surveillance continue';
};

const canUserModifyPriority = (patient: any): boolean => {
  // Logique basée sur les permissions utilisateur et l'état du patient
  return patient.status !== 'completed' && patient.status !== 'in_consultation';
};

const requiresEscalation = (patient: any): boolean => {
  if (patient.urgency >= 5) return false; // Déjà au maximum
  if (patient.urgency >= 4 && (patient.waitTime || 0) > 30) return true;
  if ((patient.waitTime || 0) > 60) return true;
  return false;
};

const determineCardType = (patient: any): 'standard' | 'urgent' | 'critical' => {
  if (patient.urgency >= 5) return 'critical';
  if (patient.urgency >= 4) return 'urgent';
  return 'standard';
};

const determineCardVariant = (patient: any): 'default' | 'highlighted' | 'warning' | 'danger' => {
  if (patient.urgency >= 5) return 'danger';
  if (patient.urgency >= 4) return 'warning';
  if (needsImmediateAttention(patient)) return 'highlighted';
  return 'default';
};

const getAvailableActions = (patient: any): string[] => {
  const actions = [];
  
  if (patient.status === 'ready') actions.push('start_consultation');
  if (patient.status !== 'completed') actions.push('modify_priority');
  actions.push('add_notes');
  actions.push('contact_center');
  if (patient.status === 'waiting') actions.push('prepare_patient');
  
  return actions;
};

const shouldHighlightCard = (patient: any): boolean => {
  return patient.urgency >= 4 || needsImmediateAttention(patient);
};

const calculateEstimatedEndTime = (patient: any): string => {
  const arrivalTime = new Date(`${new Date().toDateString()} ${patient.arrivalTime}`);
  const estimatedEnd = new Date(arrivalTime.getTime() + ((patient.waitTime || 0) + estimateTreatmentTime(patient)) * 60000);
  return estimatedEnd.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const calculateActualDuration = (patient: any): number | null => {
  if (patient.status !== 'completed' || !patient.completedTime) return null;
  
  const arrival = new Date(`${new Date().toDateString()} ${patient.arrivalTime}`);
  const completion = new Date(`${new Date().toDateString()} ${patient.completedTime}`);
  
  return Math.round((completion.getTime() - arrival.getTime()) / 60000);
};

const getCurrentMilestone = (patient: any): string => {
  const milestones = {
    'waiting': 'Attente',
    'in_preparation': 'Préparation',
    'ready': 'Prêt',
    'in_consultation': 'Consultation',
    'completed': 'Terminé'
  };
  return milestones[patient.status] || 'Inconnu';
};

const getNextMilestone = (patient: any): string | null => {
  const nextMilestones = {
    'waiting': 'Préparation',
    'in_preparation': 'Consultation',
    'ready': 'Consultation',
    'in_consultation': 'Completion',
    'completed': null
  };
  return nextMilestones[patient.status] || null;
};

const calculateProgress = (patient: any): number => {
  const progressMap = {
    'waiting': 20,
    'in_preparation': 40,
    'ready': 60,
    'in_consultation': 80,
    'completed': 100
  };
  return progressMap[patient.status] || 0;
};

const calculateDelays = (patient: any): { total: number; justified: boolean; reason?: string } => {
  const expectedTime = estimateTreatmentTime(patient);
  const actualWaitTime = patient.waitTime || 0;
  const thresholds = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  const maxWait = thresholds[patient.urgency] || 30;
  
  const delay = Math.max(0, actualWaitTime - maxWait);
  
  return {
    total: delay,
    justified: delay <= 15, // Seuil de tolérance
    reason: delay > 15 ? 'Dépassement du temps d\'attente optimal' : undefined
  };
};

const calculateDelay = (patient: any): number => {
  const thresholds = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  const maxWait = thresholds[patient.urgency] || 30;
  return Math.max(0, (patient.waitTime || 0) - maxWait);
};

const transformVitalSigns = (vitalSigns: any) => {
  if (!vitalSigns) return null;
  
  return {
    temperature: {
      value: parseFloat(vitalSigns.temperature) || null,
      display: vitalSigns.temperature ? `${vitalSigns.temperature}°C` : 'Non renseigné',
      status: getTemperatureStatus(parseFloat(vitalSigns.temperature))
    },
    heartRate: {
      value: parseInt(vitalSigns.heartRate) || null,
      display: vitalSigns.heartRate ? `${vitalSigns.heartRate} bpm` : 'Non renseigné',
      status: getHeartRateStatus(parseInt(vitalSigns.heartRate))
    },
    bloodPressure: {
      value: vitalSigns.bloodPressure || null,
      display: vitalSigns.bloodPressure || 'Non renseigné',
      systolic: vitalSigns.bloodPressure ? parseInt(vitalSigns.bloodPressure.split('/')[0]) : null,
      diastolic: vitalSigns.bloodPressure ? parseInt(vitalSigns.bloodPressure.split('/')[1]) : null,
      status: getBloodPressureStatus(vitalSigns.bloodPressure)
    },
    oxygenSaturation: {
      value: parseInt(vitalSigns.oxygenSaturation) || null,
      display: vitalSigns.oxygenSaturation ? `${vitalSigns.oxygenSaturation}%` : 'Non renseigné',
      status: getOxygenSaturationStatus(parseInt(vitalSigns.oxygenSaturation))
    }
  };
};

const getTemperatureStatus = (temp: number): 'normal' | 'warning' | 'critical' => {
  if (!temp) return 'normal';
  if (temp >= 39 || temp <= 35) return 'critical';
  if (temp >= 38.5 || temp <= 36) return 'warning';
  return 'normal';
};

const getHeartRateStatus = (hr: number): 'normal' | 'warning' | 'critical' => {
  if (!hr) return 'normal';
  if (hr >= 120 || hr <= 50) return 'critical';
  if (hr >= 100 || hr <= 60) return 'warning';
  return 'normal';
};

const getBloodPressureStatus = (bp: string): 'normal' | 'warning' | 'critical' => {
  if (!bp) return 'normal';
  const [systolic] = bp.split('/').map(Number);
  if (systolic >= 180 || systolic <= 90) return 'critical';
  if (systolic >= 140 || systolic <= 100) return 'warning';
  return 'normal';
};

const getOxygenSaturationStatus = (sat: number): 'normal' | 'warning' | 'critical' => {
  if (!sat) return 'normal';
  if (sat <= 88) return 'critical';
  if (sat <= 92) return 'warning';
  return 'normal';
};

const calculateRiskScore = (patient: any): number => {
  let score = 0;
  
  score += patient.urgency * 10;
  if (patient.age > 75) score += 15;
  else if (patient.age > 65) score += 10;
  else if (patient.age < 2) score += 15;
  else if (patient.age < 5) score += 10;
  
  if ((patient.waitTime || 0) > 60) score += 15;
  else if ((patient.waitTime || 0) > 30) score += 10;
  
  if (patient.vitalSigns) {
    const vs = patient.vitalSigns;
    if (vs.temperature > 39 || vs.temperature < 35) score += 10;
    if (vs.oxygenSaturation < 90) score += 15;
    if (vs.bloodPressure) {
      const [systolic] = vs.bloodPressure.split('/').map(Number);
      if (systolic > 180 || systolic < 90) score += 10;
    }
  }
  
  return score;
};

const getPatientRecommendations = (patient: any): string[] => {
  const recommendations = [];
  
  if (patient.urgency >= 5) {
    recommendations.push('Prise en charge immédiate requise');
    recommendations.push('Surveillance continue des signes vitaux');
  } else if (patient.urgency >= 4) {
    recommendations.push('Évaluation prioritaire dans les 15 minutes');
    recommendations.push('Monitoring régulier');
  }
  
  if ((patient.waitTime || 0) > 30) {
    recommendations.push('Temps d\'attente dépassé - réévaluation nécessaire');
  }
  
  if (patient.age > 75) {
    recommendations.push('Attention particulière en raison de l\'âge');
  }
  
  if (patient.vitalSigns?.oxygenSaturation < 95) {
    recommendations.push('Surveillance de la saturation en oxygène');
  }
  
  return recommendations;
};