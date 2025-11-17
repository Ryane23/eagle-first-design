// Import des types partagés
import { Patient, Consultation, Room } from '@types/index';

// Import des utils partagés
import { formatDateTime, formatTime } from '@utils/dateUtils';
import { formatWaitTime } from '@utils/statusUtils';

// Import des calculators partagés
import { calculateIMC, interpretIMC } from '@calculators/medicalCalculators';

/**
 * Transforme les données mockées de patients en format Patient standardisé
 */
export const transformMockPatientToPatient = (
  mockPatient: any, 
  specialty: string, 
  doctor: string
): Patient => {
  return {
    id: mockPatient.id,
    name: mockPatient.name,
    firstName: mockPatient.firstName || mockPatient.name.split(' ')[1] || '',
    age: mockPatient.age,
    gender: mockPatient.gender,
    phone: mockPatient.phone,
    email: mockPatient.email,
    urgencyLevel: mockPatient.urgencyLevel,
    specialty: specialty,
    doctor: doctor,
    center: "Centre Secondaire",
    waitTime: Math.floor(Math.random() * 30) + 5, // Temps d'attente simulé
    status: mockPatient.status,
    arrivalTime: mockPatient.arrivalTime || "09:00",
    notes: mockPatient.notes || "",
    vitalSigns: mockPatient.vitalSigns,
    medicalHistory: mockPatient.antecedents,
    consultationReason: mockPatient.consultationReason || "",
    documents: mockPatient.documents || []
  };
};

/**
 * Transforme les consultations pour l'affichage dans ActiveConsultations
 */
export const transformConsultationsForDisplay = (consultations: Consultation[]): any[] => {
  return consultations
    .filter(consultation => consultation.status === 'active')
    .map(consultation => ({
      id: consultation.id,
      patient: `Patient ${consultation.patientId}`, // Idéalement récupérer le nom via un service
      doctor: consultation.doctorId,
      room: `Salle ${consultation.roomId}`,
      startTime: formatDateTime(consultation.startTime),
      duration: consultation.duration || calculateConsultationDuration(consultation.startTime),
      isPaused: consultation.status === 'paused',
      status: consultation.status
    }));
};

/**
 * Transforme les données de formulaire en format de constantes vitales
 */
export const transformFormDataToVitalSigns = (formData: any) => {
  const weight = parseFloat(formData.poids);
  const height = parseFloat(formData.taille);
  const imc = calculateIMC(weight, height);
  const imcInterpretation = parseFloat(imc) ? interpretIMC(parseFloat(imc)) : null;

  return {
    bloodPressure: `${formData.ta_systolique}/${formData.ta_diastolique}`,
    heartRate: formData.pouls,
    temperature: formData.temperature,
    oxygenSaturation: formData.saturation,
    weight: formData.poids,
    height: formData.taille,
    glycemia: formData.glycemie,
    bmi: imc,
    bmiInterpretation: imcInterpretation,
    measuredAt: new Date().toISOString(),
    measuredBy: "Infirmière" // À récupérer du contexte utilisateur
  };
};

/**
 * Transforme les données patient pour l'export DPI
 */
export const transformPatientForDPIExport = (patient: Patient, formData: any) => {
  const vitalSigns = transformFormDataToVitalSigns(formData);
  
  return {
    patient: {
      id: patient.id,
      fullName: `${patient.firstName} ${patient.name}`,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      urgencyLevel: patient.urgencyLevel,
      specialty: patient.specialty,
      doctor: patient.doctor,
      center: patient.center
    },
    session: {
      type: 'preconsultation',
      status: 'completed',
      startTime: new Date().toISOString(),
      consultationReason: formData.motif,
      notes: formData.notes
    },
    vitalSigns,
    medicalHistory: patient.medicalHistory,
    documents: formData.documents || [],
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      exportedBy: "Système Préconsultation",
      version: "1.0",
      checksum: generateChecksum(patient.id, vitalSigns)
    }
  };
};

/**
 * Transforme les statistiques de spécialités pour l'affichage
 */
export const transformSpecialtyStatistics = (specialites: any[]) => {
  return specialites.map(specialite => {
    const totalPatients = specialite.medecins.reduce((t: number, m: any) => t + m.patients.length, 0);
    const patientsReady = specialite.medecins.reduce((t: number, m: any) => 
      t + m.patients.filter((p: any) => p.status === 'ready').length, 0
    );
    const patientsWaiting = specialite.medecins.reduce((t: number, m: any) => 
      t + m.patients.filter((p: any) => p.status === 'waiting').length, 0
    );
    const patientsInPreparation = specialite.medecins.reduce((t: number, m: any) => 
      t + m.patients.filter((p: any) => p.status === 'in_preparation').length, 0
    );
    const doctorsInConsultation = specialite.medecins.filter((m: any) => m.enConsultation).length;

    return {
      specialty: specialite.nom,
      totalPatients,
      patientsReady,
      patientsWaiting,
      patientsInPreparation,
      doctorsTotal: specialite.medecins.length,
      doctorsInConsultation,
      averageWaitTime: calculateAverageWaitTime(specialite),
      efficiency: totalPatients > 0 ? Math.round((patientsReady / totalPatients) * 100) : 0,
      workload: categorizeWorkload(totalPatients)
    };
  });
};

/**
 * Transforme les données des salles pour l'affichage détaillé
 */
export const transformRoomsForDisplay = (rooms: Room[]) => {
  return rooms.map(room => ({
    ...room,
    statusDisplay: getRoomStatusDisplay(room),
    utilizationTime: calculateRoomUtilization(room),
    equipmentQuality: getEquipmentQuality(room.equipment),
    availability: room.active && !room.inConsultation ? 'available' : 
                 room.inConsultation ? 'busy' : 'inactive'
  }));
};

/**
 * Transforme les données pour le dashboard de statistiques
 */
export const transformForStatisticsDashboard = (
  specialites: any[], 
  consultations: Consultation[], 
  rooms: Room[]
) => {
  const totalPatients = specialites.reduce((total, s) => 
    total + s.medecins.reduce((t: number, m: any) => t + m.patients.length, 0), 0
  );

  const patientsByStatus = {
    waiting: specialites.reduce((total, s) => 
      total + s.medecins.reduce((t: number, m: any) => 
        t + m.patients.filter((p: any) => p.status === 'waiting').length, 0
      ), 0
    ),
    inPreparation: specialites.reduce((total, s) => 
      total + s.medecins.reduce((t: number, m: any) => 
        t + m.patients.filter((p: any) => p.status === 'in_preparation').length, 0
      ), 0
    ),
    ready: specialites.reduce((total, s) => 
      total + s.medecins.reduce((t: number, m: any) => 
        t + m.patients.filter((p: any) => p.status === 'ready').length, 0
      ), 0
    )
  };

  const roomStatistics = {
    total: rooms.length,
    active: rooms.filter(r => r.active).length,
    inUse: rooms.filter(r => r.inConsultation).length,
    available: rooms.filter(r => r.active && !r.inConsultation).length
  };

  const consultationStatistics = {
    active: consultations.filter(c => c.status === 'active').length,
    total: consultations.length,
    averageDuration: calculateAverageConsultationDuration(consultations)
  };

  return {
    overview: {
      totalPatients,
      patientsByStatus,
      roomStatistics,
      consultationStatistics,
      utilizationRate: roomStatistics.active > 0 ? 
        Math.round((roomStatistics.inUse / roomStatistics.active) * 100) : 0
    },
    specialties: transformSpecialtyStatistics(specialites),
    trends: generateTrendData(),
    alerts: generateAlerts(patientsByStatus, roomStatistics)
  };
};

/**
 * Transforme les données pour l'affichage des notifications système
 */
export const transformSystemNotifications = (
  patientsByStatus: any,
  roomStats: any,
  consultations: Consultation[]
) => {
  const notifications = [];

  // Notifications basées sur les patients en attente
  if (patientsByStatus.waiting > 5) {
    notifications.push({
      id: 'patients-waiting',
      type: 'warning',
      title: 'Patients en attente',
      message: `${patientsByStatus.waiting} patients en attente de préparation`,
      priority: 'medium',
      action: 'Accélérer les préparations'
    });
  }

  // Notifications basées sur l'utilisation des salles
  const utilizationRate = roomStats.active > 0 ? (roomStats.inUse / roomStats.active) * 100 : 0;
  if (utilizationRate > 90) {
    notifications.push({
      id: 'high-utilization',
      type: 'error',
      title: 'Utilisation élevée',
      message: `Taux d'utilisation des salles: ${Math.round(utilizationRate)}%`,
      priority: 'high',
      action: 'Activer des salles supplémentaires'
    });
  }

  // Notifications basées sur les consultations longues
  const longConsultations = consultations.filter(c => {
    const duration = calculateConsultationDuration(c.startTime);
    return duration > 45; // Plus de 45 minutes
  });

  if (longConsultations.length > 0) {
    notifications.push({
      id: 'long-consultations',
      type: 'info',
      title: 'Consultations prolongées',
      message: `${longConsultations.length} consultation(s) de plus de 45 minutes`,
      priority: 'low',
      action: 'Vérifier le statut'
    });
  }

  return notifications;
};

// Fonctions utilitaires privées

const calculateConsultationDuration = (startTime: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  return Math.floor(diffMs / (1000 * 60)); // Durée en minutes
};

const calculateAverageWaitTime = (specialite: any): number => {
  const allPatients = specialite.medecins.flatMap((m: any) => m.patients);
  if (allPatients.length === 0) return 0;
  
  const totalWaitTime = allPatients.reduce((total: number, patient: any) => {
    return total + (patient.waitTime || 15); // Valeur par défaut
  }, 0);
  
  return Math.round(totalWaitTime / allPatients.length);
};

const categorizeWorkload = (patientCount: number): 'low' | 'medium' | 'high' => {
  if (patientCount <= 2) return 'low';
  if (patientCount <= 5) return 'medium';
  return 'high';
};

const getRoomStatusDisplay = (room: Room): string => {
  if (!room.active) return 'Hors service';
  if (room.inConsultation) return 'En consultation';
  if (room.doctor) return 'Assignée';
  return 'Disponible';
};

const calculateRoomUtilization = (room: Room): number => {
  // Simulation du temps d'utilisation (en pourcentage)
  if (!room.active) return 0;
  if (room.inConsultation) return Math.floor(Math.random() * 30) + 70; // 70-100%
  return Math.floor(Math.random() * 40); // 0-40%
};

const getEquipmentQuality = (equipment: string): 'excellent' | 'good' | 'basic' => {
  switch (equipment) {
    case 'Caméra 4K': return 'excellent';
    case 'Caméra HD': return 'good';
    case 'Caméra SD': return 'basic';
    default: return 'basic';
  }
};

const calculateAverageConsultationDuration = (consultations: Consultation[]): number => {
  const completedConsultations = consultations.filter(c => c.duration);
  if (completedConsultations.length === 0) return 0;
  
  const totalDuration = completedConsultations.reduce((total, c) => total + (c.duration || 0), 0);
  return Math.round(totalDuration / completedConsultations.length);
};

const generateTrendData = () => {
  // Données de tendance simulées pour les graphiques
  return {
    dailyPatients: Array.from({ length: 7 }, (_, i) => ({
      day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
      patients: Math.floor(Math.random() * 20) + 10
    })),
    hourlyUtilization: Array.from({ length: 9 }, (_, i) => ({
      hour: `${8 + i}:00`,
      utilization: Math.floor(Math.random() * 40) + 60
    }))
  };
};

const generateAlerts = (patientsByStatus: any, roomStats: any) => {
  const alerts = [];
  
  if (patientsByStatus.waiting > 8) {
    alerts.push({
      level: 'high',
      message: 'Nombre élevé de patients en attente',
      recommendation: 'Accélérer les préparations'
    });
  }
  
  if (roomStats.available === 0) {
    alerts.push({
      level: 'critical',
      message: 'Aucune salle disponible',
      recommendation: 'Terminer les consultations en cours ou activer des salles'
    });
  }
  
  return alerts;
};

const generateChecksum = (patientId: string, vitalSigns: any): string => {
  // Génération simple d'un checksum pour l'intégrité des données
  const data = `${patientId}-${JSON.stringify(vitalSigns)}-${Date.now()}`;
  return btoa(data).slice(0, 16);
};