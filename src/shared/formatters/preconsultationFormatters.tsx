// Import des formatters existants
import { formatWaitTime } from '@formatters/timeFormatter';
import { formatBloodPressure, formatBMI, interpretBMI } from '@formatters/medicalFormatter';

// Import des utils partagés
import { formatDateTime, formatTime } from '@utils/dateUtils';

// Import des constants partagées
import { VITAL_SIGNS_THRESHOLDS, VITAL_SIGNS_COLORS } from '@constants/preconsultationConstants';

/**
 * Formate les constantes vitales pour l'affichage
 */
export const formatVitalSigns = (vitalSigns: any) => {
  if (!vitalSigns) return null;

  return {
    bloodPressure: {
      value: vitalSigns.bloodPressure || 'N/A',
      formatted: vitalSigns.bloodPressure || 'N/A',
      status: getBloodPressureStatus(vitalSigns.bloodPressure),
      color: getBloodPressureColor(vitalSigns.bloodPressure)
    },
    heartRate: {
      value: vitalSigns.heartRate || 'N/A',
      formatted: vitalSigns.heartRate ? `${vitalSigns.heartRate} bpm` : 'N/A',
      status: getHeartRateStatus(parseFloat(vitalSigns.heartRate)),
      color: getHeartRateColor(parseFloat(vitalSigns.heartRate))
    },
    temperature: {
      value: vitalSigns.temperature || 'N/A',
      formatted: vitalSigns.temperature ? `${vitalSigns.temperature}°C` : 'N/A',
      status: getTemperatureStatus(parseFloat(vitalSigns.temperature)),
      color: getTemperatureColor(parseFloat(vitalSigns.temperature))
    },
    oxygenSaturation: {
      value: vitalSigns.oxygenSaturation || 'N/A',
      formatted: vitalSigns.oxygenSaturation ? `${vitalSigns.oxygenSaturation}%` : 'N/A',
      status: getOxygenSaturationStatus(parseFloat(vitalSigns.oxygenSaturation)),
      color: getOxygenSaturationColor(parseFloat(vitalSigns.oxygenSaturation))
    },
    weight: {
      value: vitalSigns.weight || 'N/A',
      formatted: vitalSigns.weight ? `${vitalSigns.weight} kg` : 'N/A'
    },
    height: {
      value: vitalSigns.height || 'N/A',
      formatted: vitalSigns.height ? `${vitalSigns.height} cm` : 'N/A'
    },
    bmi: {
      value: calculateAndFormatBMI(vitalSigns.weight, vitalSigns.height),
      interpretation: getBMIInterpretation(vitalSigns.weight, vitalSigns.height),
      color: getBMIColor(vitalSigns.weight, vitalSigns.height)
    },
    glycemia: {
      value: vitalSigns.glycemia || 'N/A',
      formatted: vitalSigns.glycemia ? `${vitalSigns.glycemia} g/L` : 'N/A',
      status: getGlycemiaStatus(parseFloat(vitalSigns.glycemia)),
      color: getGlycemiaColor(parseFloat(vitalSigns.glycemia))
    }
  };
};

/**
 * Formate les informations du patient pour l'affichage
 */
export const formatPatientInfo = (patient: any) => {
  if (!patient) return null;

  return {
    fullName: `${patient.firstName || ''} ${patient.name}`.trim(),
    displayName: `${patient.name} (${patient.age} ans)`,
    ageDisplay: `${patient.age} ans`,
    genderDisplay: patient.gender === 'M' ? 'Masculin' : 'Féminin',
    urgencyDisplay: formatUrgencyLevel(patient.urgencyLevel),
    statusDisplay: formatPatientStatus(patient.status),
    arrivalDisplay: formatTime(patient.arrivalTime),
    waitTimeDisplay: formatWaitTime(patient.waitTime || 0),
    contactInfo: formatContactInfo(patient.phone, patient.email)
  };
};

/**
 * Formate les consultations pour l'affichage
 */
export const formatConsultationInfo = (consultation: any) => {
  if (!consultation) return null;

  const duration = consultation.duration || calculateDuration(consultation.startTime);
  
  return {
    displayId: `#${consultation.id}`,
    patientDisplay: consultation.patient || `Patient ${consultation.patientId}`,
    doctorDisplay: consultation.doctor || consultation.doctorId,
    roomDisplay: consultation.room || `Salle ${consultation.roomId}`,
    startTimeDisplay: formatDateTime(consultation.startTime),
    durationDisplay: formatDuration(duration),
    statusDisplay: formatConsultationStatus(consultation.status),
    statusColor: getConsultationStatusColor(consultation.status)
  };
};

/**
 * Formate les statistiques pour l'affichage
 */
export const formatStatistics = (stats: any) => {
  return {
    totalPatients: {
      value: stats.totalPatients || 0,
      display: (stats.totalPatients || 0).toString(),
      label: 'Total patients'
    },
    patientsReady: {
      value: stats.patientsReady || 0,
      display: (stats.patientsReady || 0).toString(),
      label: 'Patients prêts',
      percentage: stats.totalPatients > 0 ? 
        Math.round((stats.patientsReady / stats.totalPatients) * 100) : 0
    },
    patientsWaiting: {
      value: stats.patientsWaiting || 0,
      display: (stats.patientsWaiting || 0).toString(),
      label: 'En attente',
      urgency: stats.patientsWaiting > 5 ? 'high' : stats.patientsWaiting > 3 ? 'medium' : 'low'
    },
    consultationsActive: {
      value: stats.consultationsActive || 0,
      display: (stats.consultationsActive || 0).toString(),
      label: 'Consultations actives'
    },
    utilizationRate: {
      value: stats.utilizationRate || 0,
      display: `${stats.utilizationRate || 0}%`,
      label: 'Taux d\'utilisation',
      status: stats.utilizationRate > 80 ? 'high' : 
              stats.utilizationRate > 60 ? 'medium' : 'low'
    },
    averageWaitTime: {
      value: stats.averageWaitTime || 0,
      display: formatWaitTime(stats.averageWaitTime || 0),
      label: 'Temps d\'attente moyen',
      status: (stats.averageWaitTime || 0) > 25 ? 'high' : 
              (stats.averageWaitTime || 0) > 15 ? 'medium' : 'low'
    }
  };
};

/**
 * Formate les informations des salles pour l'affichage
 */
export const formatRoomInfo = (room: any) => {
  return {
    displayName: room.name,
    equipmentDisplay: formatEquipment(room.equipment),
    statusDisplay: formatRoomStatus(room),
    doctorDisplay: room.doctor || 'Non assigné',
    specialtyDisplay: room.specialty || 'Non définie',
    availabilityDisplay: formatRoomAvailability(room),
    utilizationDisplay: formatRoomUtilization(room)
  };
};

/**
 * Formate les antécédents médicaux pour l'affichage
 */
export const formatMedicalHistory = (history: any) => {
  if (!history) return null;

  return {
    medical: formatHistoryList(history.medicaux, 'Antécédents médicaux'),
    surgical: formatHistoryList(history.chirurgicaux, 'Antécédents chirurgicaux'),
    allergies: formatHistoryList(history.allergies, 'Allergies'),
    family: formatHistoryList(history.familiaux, 'Antécédents familiaux'),
    hasAnyHistory: hasAnyMedicalHistory(history)
  };
};

/**
 * Formate une liste d'éléments d'historique
 */
const formatHistoryList = (items: any[], label: string) => {
  if (!items || items.length === 0) {
    return {
      label,
      items: [],
      display: 'Aucun',
      hasItems: false
    };
  }

  return {
    label,
    items: items.map(item => ({
      text: item,
      formatted: item
    })),
    display: items.join(', '),
    hasItems: true,
    count: items.length
  };
};

// Fonctions utilitaires de formatage spécialisées

const formatUrgencyLevel = (level: number): string => {
  const levels = {
    1: 'Non urgent',
    2: 'Peu urgent',
    3: 'Urgent',
    4: 'Très urgent',
    5: 'Urgence vitale'
  };
  return levels[level as keyof typeof levels] || 'Non défini';
};

const formatPatientStatus = (status: string): string => {
  const statuses = {
    waiting: 'En attente',
    in_preparation: 'En préparation',
    ready: 'Prêt',
    in_consultation: 'En consultation',
    completed: 'Terminé'
  };
  return statuses[status as keyof typeof statuses] || status;
};

const formatConsultationStatus = (status: string): string => {
  const statuses = {
    active: 'En cours',
    paused: 'En pause',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };
  return statuses[status as keyof typeof statuses] || status;
};

const formatContactInfo = (phone?: string, email?: string): string => {
  const contacts = [];
  if (phone) contacts.push(phone);
  if (email) contacts.push(email);
  return contacts.join(' • ') || 'Non renseigné';
};

const formatEquipment = (equipment: string): string => {
  const equipmentMap = {
    'Caméra 4K': '📹 4K Ultra HD',
    'Caméra HD': '📹 Full HD',
    'Caméra SD': '📹 Standard'
  };
  return equipmentMap[equipment as keyof typeof equipmentMap] || equipment;
};

const formatRoomStatus = (room: any): string => {
  if (!room.active) return 'Hors service';
  if (room.inConsultation) return 'En consultation';
  if (room.doctor) return 'Assignée';
  return 'Disponible';
};

const formatRoomAvailability = (room: any): string => {
  if (!room.active) return 'Indisponible';
  if (room.inConsultation) return 'Occupée';
  return 'Libre';
};

const formatRoomUtilization = (room: any): string => {
  // Simulation du taux d'utilisation
  if (!room.active) return '0%';
  if (room.inConsultation) return `${Math.floor(Math.random() * 30) + 70}%`;
  return `${Math.floor(Math.random() * 40)}%`;
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// Fonctions de calcul et d'évaluation des statuts

const calculateAndFormatBMI = (weight: string, height: string): string => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  
  if (!w || !h || h <= 0) return 'N/A';
  
  const bmi = w / Math.pow(h / 100, 2);
  return bmi.toFixed(1);
};

const getBMIInterpretation = (weight: string, height: string): string => {
  const bmi = parseFloat(calculateAndFormatBMI(weight, height));
  if (isNaN(bmi)) return 'N/A';
  
  return interpretBMI(bmi);
};

const getBMIColor = (weight: string, height: string): string => {
  const bmi = parseFloat(calculateAndFormatBMI(weight, height));
  if (isNaN(bmi)) return VITAL_SIGNS_COLORS.INFO;
  
  if (bmi < 18.5 || bmi >= 30) return VITAL_SIGNS_COLORS.CRITICAL;
  if (bmi >= 25) return VITAL_SIGNS_COLORS.WARNING;
  return VITAL_SIGNS_COLORS.NORMAL;
};

const getBloodPressureStatus = (bp: string): string => {
  if (!bp) return 'unknown';
  
  const [systolic, diastolic] = bp.split('/').map(v => parseFloat(v));
  const { BLOOD_PRESSURE } = VITAL_SIGNS_THRESHOLDS;
  
  if (systolic >= BLOOD_PRESSURE.CRITICAL_HIGH.systolic || 
      diastolic >= BLOOD_PRESSURE.CRITICAL_HIGH.diastolic) {
    return 'critical';
  }
  if (systolic >= BLOOD_PRESSURE.HIGH.systolic || 
      diastolic >= BLOOD_PRESSURE.HIGH.diastolic) {
    return 'high';
  }
  if (systolic <= BLOOD_PRESSURE.LOW.systolic || 
      diastolic <= BLOOD_PRESSURE.LOW.diastolic) {
    return 'low';
  }
  return 'normal';
};

const getBloodPressureColor = (bp: string): string => {
  const status = getBloodPressureStatus(bp);
  switch (status) {
    case 'critical': return VITAL_SIGNS_COLORS.CRITICAL;
    case 'high': 
    case 'low': return VITAL_SIGNS_COLORS.WARNING;
    case 'normal': return VITAL_SIGNS_COLORS.NORMAL;
    default: return VITAL_SIGNS_COLORS.INFO;
  }
};

const getHeartRateStatus = (hr: number): string => {
  if (!hr) return 'unknown';
  
  const { HEART_RATE } = VITAL_SIGNS_THRESHOLDS;
  
  if (hr >= HEART_RATE.TACHYCARDIA) return 'high';
  if (hr <= HEART_RATE.BRADYCARDIA) return 'low';
  return 'normal';
};

const getHeartRateColor = (hr: number): string => {
  const status = getHeartRateStatus(hr);
  switch (status) {
    case 'high':
    case 'low': return VITAL_SIGNS_COLORS.WARNING;
    case 'normal': return VITAL_SIGNS_COLORS.NORMAL;
    default: return VITAL_SIGNS_COLORS.INFO;
  }
};

const getTemperatureStatus = (temp: number): string => {
  if (!temp) return 'unknown';
  
  const { TEMPERATURE } = VITAL_SIGNS_THRESHOLDS;
  
  if (temp >= TEMPERATURE.FEVER) return 'high';
  if (temp <= TEMPERATURE.HYPOTHERMIA) return 'critical';
  if (temp <= TEMPERATURE.NORMAL_LOW) return 'low';
  return 'normal';
};

const getTemperatureColor = (temp: number): string => {
  const status = getTemperatureStatus(temp);
  switch (status) {
    case 'critical': return VITAL_SIGNS_COLORS.CRITICAL;
    case 'high':
    case 'low': return VITAL_SIGNS_COLORS.WARNING;
    case 'normal': return VITAL_SIGNS_COLORS.NORMAL;
    default: return VITAL_SIGNS_COLORS.INFO;
  }
};

const getOxygenSaturationStatus = (sat: number): string => {
  if (!sat) return 'unknown';
  
  const { OXYGEN_SATURATION } = VITAL_SIGNS_THRESHOLDS;
  
  if (sat <= OXYGEN_SATURATION.CRITICAL) return 'critical';
  if (sat <= OXYGEN_SATURATION.LOW) return 'low';
  return 'normal';
};

const getOxygenSaturationColor = (sat: number): string => {
  const status = getOxygenSaturationStatus(sat);
  switch (status) {
    case 'critical': return VITAL_SIGNS_COLORS.CRITICAL;
    case 'low': return VITAL_SIGNS_COLORS.WARNING;
    case 'normal': return VITAL_SIGNS_COLORS.NORMAL;
    default: return VITAL_SIGNS_COLORS.INFO;
  }
};

const getGlycemiaStatus = (glycemia: number): string => {
  if (!glycemia) return 'unknown';
  
  if (glycemia < 0.7) return 'low';
  if (glycemia > 1.1) return 'high';
  return 'normal';
};

const getGlycemiaColor = (glycemia: number): string => {
  const status = getGlycemiaStatus(glycemia);
  switch (status) {
    case 'high':
    case 'low': return VITAL_SIGNS_COLORS.WARNING;
    case 'normal': return VITAL_SIGNS_COLORS.NORMAL;
    default: return VITAL_SIGNS_COLORS.INFO;
  }
};

const getConsultationStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return VITAL_SIGNS_COLORS.NORMAL;
    case 'paused': return VITAL_SIGNS_COLORS.WARNING;
    case 'completed': return VITAL_SIGNS_COLORS.INFO;
    case 'cancelled': return VITAL_SIGNS_COLORS.CRITICAL;
    default: return VITAL_SIGNS_COLORS.INFO;
  }
};

const calculateDuration = (startTime: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  return Math.floor(diffMs / (1000 * 60));
};

const hasAnyMedicalHistory = (history: any): boolean => {
  if (!history) return false;
  
  return (history.medicaux && history.medicaux.length > 0) ||
         (history.chirurgicaux && history.chirurgicaux.length > 0) ||
         (history.allergies && history.allergies.length > 0) ||
         (history.familiaux && history.familiaux.length > 0);
};