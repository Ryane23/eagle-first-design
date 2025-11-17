import { formatWaitTime, getUrgencyColor } from '@utils/statusUtils';
import { formatDateTime } from '@utils/dateUtils';

export const formatEmergencyStats = (patients: any[]) => {
  const urgentPatients = patients.filter(p => p.urgency >= 4);
  const readyPatients = patients.filter(p => p.status === 'ready');
  const avgWaitTime = Math.round(patients.reduce((sum, p) => sum + p.waitTime, 0) / patients.length);
  const centers = new Set(patients.map(p => p.clinicCode));

  return {
    totalPatients: {
      value: patients.length,
      label: "Total patients",
      trend: calculateTrend(patients.length, 'patients'),
      change: "+2 depuis hier",
      color: "blue",
      icon: "👥"
    },
    urgentPatients: {
      value: urgentPatients.length,
      label: "Patients urgents",
      percentage: `${Math.round((urgentPatients.length / patients.length) * 100)}%`,
      threshold: 3,
      status: urgentPatients.length > 3 ? "critical" : urgentPatients.length > 1 ? "warning" : "normal",
      color: urgentPatients.length > 3 ? "red" : urgentPatients.length > 1 ? "orange" : "green",
      icon: "🚨"
    },
    readyPatients: {
      value: readyPatients.length,
      label: "Patients prêts",
      percentage: `${Math.round((readyPatients.length / patients.length) * 100)}%`,
      efficiency: readyPatients.length / patients.length,
      color: "green",
      icon: "✅"
    },
    avgWaitTime: {
      value: avgWaitTime,
      label: "Temps d'attente moyen",
      display: formatWaitTime(avgWaitTime),
      status: avgWaitTime > 30 ? "critical" : avgWaitTime > 15 ? "warning" : "normal",
      threshold: { warning: 15, critical: 30 },
      trend: calculateWaitTimeTrend(avgWaitTime),
      color: avgWaitTime > 30 ? "red" : avgWaitTime > 15 ? "yellow" : "green",
      icon: "⏱️"
    },
    connectedCenters: {
      value: centers.size,
      label: "Centres connectés",
      list: Array.from(centers),
      coverage: `${Math.round((centers.size / 5) * 100)}%`, // Sur 5 centres max
      color: "purple",
      icon: "🏥"
    },
    systemStatus: {
      overall: determineSystemStatus(patients),
      load: calculateSystemLoad(patients),
      efficiency: calculateSystemEfficiency(patients),
      lastUpdate: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 30000).toISOString()
    }
  };
};

export const formatPatientData = (patients: any[]) => {
  return patients.map(patient => ({
    ...patient,
    formattedData: {
      urgency: {
        level: patient.urgency,
        label: getUrgencyLabel(patient.urgency),
        color: getUrgencyColor(patient.urgency),
        icon: getUrgencyIcon(patient.urgency),
        description: getUrgencyDescription(patient.urgency)
      },
      status: {
        current: patient.status,
        label: getStatusLabel(patient.status),
        color: getStatusColor(patient.status),
        icon: getStatusIcon(patient.status),
        nextStep: getNextStep(patient.status)
      },
      timing: {
        waitTime: {
          minutes: patient.waitTime || 0,
          display: formatWaitTime(patient.waitTime || 0),
          status: getWaitTimeStatus(patient.waitTime || 0, patient.urgency),
          overdue: isOverdue(patient)
        },
        arrival: {
          time: patient.arrivalTime,
          display: formatDateTime(patient.arrivalTime),
          elapsed: calculateElapsed(patient.arrivalTime)
        },
        estimated: {
          treatment: estimatePatientTreatmentTime(patient),
          completion: calculateEstimatedCompletion(patient),
          total: (patient.waitTime || 0) + estimatePatientTreatmentTime(patient)
        }
      },
      personal: {
        displayName: `${patient.name} (${patient.age} ans)`,
        genderIcon: patient.gender === 'M' ? '👨' : '👩',
        ageGroup: getAgeGroup(patient.age),
        isVulnerable: isVulnerablePatient(patient)
      },
      medical: {
        specialty: {
          name: patient.specialty,
          icon: getSpecialtyIcon(patient.specialty),
          urgencyCompatible: true
        },
        doctor: {
          name: patient.doctor,
          available: true,
          specialized: patient.specialty === 'Cardiologie' // Exemple
        },
        vitalSigns: formatVitalSigns(patient.vitalSigns),
        riskProfile: {
          level: calculateRiskLevel(patient),
          factors: calculateRiskFactors(patient),
          score: calculateRiskScore(patient)
        }
      },
      location: {
        center: {
          code: patient.clinicCode,
          name: patient.clinicName,
          display: `${patient.clinicCode} - ${patient.clinicName}`,
          distance: null, // À calculer selon la localisation
          region: getRegionFromCode(patient.clinicCode)
        },
        room: patient.room || null,
        bed: patient.bed || null
      },
      actions: {
        available: getAvailableActions(patient),
        primary: getPrimaryAction(patient),
        urgent: getUrgentActions(patient),
        disabled: getDisabledActions(patient)
      }
    }
  }));
};

export const formatEmergencyFormatters = (rawData: any) => {
  return {
    patients: formatPatientData(rawData.patients),
    stats: formatEmergencyStats(rawData.patients),
    notifications: formatNotificationData(rawData.notifications),
    history: formatHistoryData(rawData.modificationHistory),
    doctor: formatDoctorData(rawData.doctor),
    centers: formatCentersData(rawData.centers || []),
    specialties: formatSpecialtiesData(rawData.specialties || [])
  };
};

export const formatNotificationData = (notifications: any[]) => {
  return notifications.map(notification => ({
    ...notification,
    formatted: {
      time: {
        original: notification.time,
        display: formatDateTime(notification.time),
        elapsed: calculateTimeElapsed(notification.time),
        isRecent: isRecentNotification(notification.time)
      },
      type: {
        value: notification.type,
        label: getNotificationTypeLabel(notification.type),
        color: getNotificationTypeColor(notification.type),
        icon: getNotificationTypeIcon(notification.type),
        priority: getNotificationPriority(notification.type)
      },
      content: {
        title: notification.title,
        message: notification.message,
        summary: notification.message.substring(0, 100) + (notification.message.length > 100 ? '...' : ''),
        keywords: extractKeywords(notification.message),
        relatedPatient: extractPatientName(notification.message)
      },
      actions: {
        required: requiresAction(notification.type),
        available: getNotificationActions(notification),
        primary: getPrimaryNotificationAction(notification),
        responseTime: getExpectedResponseTime(notification.type)
      },
      status: {
        read: notification.read || false,
        archived: notification.archived || false,
        responded: notification.responded || false,
        expired: isNotificationExpired(notification)
      }
    }
  }));
};

export const formatHistoryData = (history: any[]) => {
  return history.map(item => ({
    ...item,
    formatted: {
      time: {
        timestamp: item.timestamp,
        display: formatDateTime(item.timestamp),
        relative: getRelativeTime(item.timestamp),
        isRecent: isRecentChange(item.timestamp)
      },
      user: {
        name: item.user.name,
        role: item.user.role,
        display: `${item.user.name} (${item.user.role})`,
        initials: getInitials(item.user.name),
        color: getRoleColor(item.user.role)
      },
      changes: {
        summary: formatChangesSummary(item.changes),
        details: item.changes.map(change => ({
          field: change.field,
          oldValue: change.oldValue,
          newValue: change.newValue,
          display: formatChange(change),
          impact: calculateChangeImpact(change),
          direction: change.newValue > change.oldValue ? 'increase' : 'decrease'
        })),
        impact: calculateOverallImpact(item.changes),
        reversible: isReversibleChange(item.changes)
      },
      context: {
        reason: item.details,
        reasonSummary: item.details.substring(0, 50) + (item.details.length > 50 ? '...' : ''),
        category: categorizeChange(item.details),
        justification: item.justification || '',
        approved: !!item.approvedBy,
        approver: item.approvedBy || null
      },
      patient: {
        id: item.entityId,
        name: item.entityName,
        affected: true
      }
    }
  }));
};

export const formatDoctorData = (doctor: any) => {
  return {
    ...doctor,
    formatted: {
      identity: {
        name: doctor.name,
        title: `Dr. ${doctor.name}`,
        initials: getInitials(doctor.name),
        specialty: doctor.specialty,
        id: doctor.id
      },
      status: {
        available: calculateAvailability(doctor),
        workload: calculateWorkload(doctor),
        experience: doctor.experience || "Expérimenté",
        rating: doctor.rating || 4.5
      },
      schedule: {
        current: getCurrentSchedule(),
        workingHours: doctor.workingHours || "08:00-17:00",
        breakTime: "12:00-13:00",
        nextAvailable: getNextAvailableSlot()
      },
      performance: {
        efficiency: calculateEfficiency(doctor),
        patientSatisfaction: 95, // Exemple
        averageConsultationTime: 25,
        completedToday: 8
      },
      contact: {
        phone: doctor.contactInfo?.phone || "+237 677 123 456",
        email: doctor.contactInfo?.email || "kouam@eagle-health.cm",
        office: doctor.contactInfo?.office || "Bureau 204"
      }
    }
  };
};

export const formatCentersData = (centers: any[]) => {
  return centers.map(center => ({
    ...center,
    formatted: {
      identity: {
        name: center.name,
        code: center.code,
        display: `${center.code} - ${center.name}`,
        region: center.region || getRegionFromCode(center.code)
      },
      status: {
        operational: center.status === 'operational',
        load: center.currentLoad || 0,
        capacity: center.capacity || 50,
        utilization: Math.round((center.currentLoad / center.capacity) * 100)
      },
      capabilities: {
        emergencyLevel: center.emergencyLevel || 'basic',
        specialties: center.specialties || [],
        equipment: center.equipment || [],
        operatingHours: center.operatingHours || '24/7'
      },
      staff: {
        doctors: center.staff?.doctors || 0,
        nurses: center.staff?.nurses || 0,
        technicians: center.staff?.technicians || 0,
        total: (center.staff?.doctors || 0) + (center.staff?.nurses || 0) + (center.staff?.technicians || 0)
      },
      contact: {
        phone: center.phone,
        email: center.email,
        address: center.address
      }
    }
  }));
};

export const formatSpecialtiesData = (specialties: any[]) => {
  return specialties.map(specialty => ({
    ...specialty,
    formatted: {
      identity: {
        name: specialty.name,
        id: specialty.id,
        description: specialty.description,
        icon: getSpecialtyIcon(specialty.name)
      },
      metrics: {
        patientCount: specialty.currentPatients || 0,
        waitingTime: specialty.waitingTime || 0,
        doctorCount: specialty.availableDoctors || 0,
        avgConsultationTime: specialty.averageConsultationTime || 25
      },
      status: {
        load: calculateSpecialtyLoad(specialty),
        availability: specialty.availableDoctors > 0,
        waitStatus: getWaitStatus(specialty.waitingTime)
      },
      capabilities: {
        urgencyLevels: specialty.urgencyLevels || [1, 2, 3, 4, 5],
        equipment: specialty.equipment || [],
        commonConditions: specialty.commonConditions || []
      }
    }
  }));
};

// Fonctions utilitaires
const calculateTrend = (current: number, type: string): string => {
  // Simulation de tendance
  const trends = {
    patients: ["+5%", "stable", "-2%"],
    waitTime: ["+10min", "stable", "-5min"]
  };
  return trends[type]?.[Math.floor(Math.random() * 3)] || "stable";
};

const calculateWaitTimeTrend = (avgWaitTime: number): string => {
  if (avgWaitTime > 30) return "increasing";
  if (avgWaitTime < 10) return "decreasing";
  return "stable";
};

const determineSystemStatus = (patients: any[]): 'normal' | 'busy' | 'overloaded' => {
  const urgentCount = patients.filter(p => p.urgency >= 4).length;
  const totalActive = patients.filter(p => p.status !== 'completed').length;
  
  if (urgentCount > 3 || totalActive > 10) return 'overloaded';
  if (urgentCount > 1 || totalActive > 6) return 'busy';
  return 'normal';
};

const calculateSystemLoad = (patients: any[]): number => {
  const activePatients = patients.filter(p => p.status !== 'completed').length;
  const maxCapacity = 15; // Capacité maximale simulée
  return Math.round((activePatients / maxCapacity) * 100);
};

const calculateSystemEfficiency = (patients: any[]): number => {
  const completed = patients.filter(p => p.status === 'completed').length;
  return Math.round((completed / patients.length) * 100);
};

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

const getUrgencyIcon = (level: number): string => {
  const icons = { 1: '📋', 2: '📘', 3: '⚡', 4: '⚠️', 5: '🚨' };
  return icons[level] || '📋';
};

const getUrgencyDescription = (level: number): string => {
  const descriptions = {
    1: 'Condition stable, pas de risque immédiat',
    2: 'Nécessite attention dans la journée',
    3: 'Attention requise dans les prochaines heures',
    4: 'Prise en charge rapide nécessaire',
    5: 'Danger vital immédiat'
  };
  return descriptions[level] || '';
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

const getStatusColor = (status: string): string => {
  const colors = {
    'waiting': 'gray',
    'in_preparation': 'yellow',
    'ready': 'green',
    'in_consultation': 'blue',
    'completed': 'purple'
  };
  return colors[status] || 'gray';
};

const getStatusIcon = (status: string): string => {
  const icons = {
    'waiting': '⏳',
    'in_preparation': '🔄',
    'ready': '✅',
    'in_consultation': '👨‍⚕️',
    'completed': '✨'
  };
  return icons[status] || '📋';
};

const getNextStep = (status: string): string => {
  const nextSteps = {
    'waiting': 'Préparation',
    'in_preparation': 'Prêt pour consultation',
    'ready': 'Début consultation',
    'in_consultation': 'Finalisation',
    'completed': 'Aucune'
  };
  return nextSteps[status] || 'Inconnu';
};

const getWaitTimeStatus = (waitTime: number, urgency: number): 'normal' | 'warning' | 'critical' => {
  const thresholds = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  const maxWait = thresholds[urgency] || 30;
  
  if (waitTime <= maxWait * 0.7) return 'normal';
  if (waitTime <= maxWait) return 'warning';
  return 'critical';
};

const isOverdue = (patient: any): boolean => {
  const thresholds = { 1: 120, 2: 60, 3: 30, 4: 15, 5: 5 };
  const maxWait = thresholds[patient.urgency] || 30;
  return (patient.waitTime || 0) > maxWait;
};

const calculateElapsed = (arrivalTime: string): number => {
  const arrival = new Date(`${new Date().toDateString()} ${arrivalTime}`);
  const now = new Date();
  return Math.floor((now.getTime() - arrival.getTime()) / (1000 * 60));
};

const estimatePatientTreatmentTime = (patient: any): number => {
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

const calculateEstimatedCompletion = (patient: any): string => {
  const arrival = new Date(`${new Date().toDateString()} ${patient.arrivalTime}`);
  const completion = new Date(arrival.getTime() + ((patient.waitTime || 0) + estimatePatientTreatmentTime(patient)) * 60000);
  return completion.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const getAgeGroup = (age: number): string => {
  if (age < 2) return 'Nourrisson';
  if (age < 12) return 'Enfant';
  if (age < 18) return 'Adolescent';
  if (age < 65) return 'Adulte';
  return 'Senior';
};

const isVulnerablePatient = (patient: any): boolean => {
  return patient.age < 5 || patient.age > 75 || patient.urgency >= 4;
};

const getSpecialtyIcon = (specialty: string): string => {
  const icons = {
    'Cardiologie': '❤️',
    'Pédiatrie': '👶',
    'Pneumologie': '🫁',
    'Dermatologie': '🧴',
    'Neurologie': '🧠',
    'Médecine générale': '🩺'
  };
  return icons[specialty] || '🏥';
};

const formatVitalSigns = (vitalSigns: any) => {
  if (!vitalSigns) return null;
  
  return {
    temperature: `${vitalSigns.temperature}°C`,
    heartRate: `${vitalSigns.heartRate} bpm`,
    bloodPressure: vitalSigns.bloodPressure,
    oxygenSaturation: `${vitalSigns.oxygenSaturation}%`,
    status: getVitalSignsStatus(vitalSigns)
  };
};

const getVitalSignsStatus = (vs: any): 'normal' | 'warning' | 'critical' => {
  if (!vs) return 'normal';
  
  if (vs.temperature > 39 || vs.temperature < 35) return 'critical';
  if (vs.oxygenSaturation < 90) return 'critical';
  if (vs.heartRate > 120 || vs.heartRate < 50) return 'critical';
  
  if (vs.temperature > 38.5 || vs.temperature < 36) return 'warning';
  if (vs.oxygenSaturation < 95) return 'warning';
  if (vs.heartRate > 100 || vs.heartRate < 60) return 'warning';
  
  return 'normal';
};

const calculateRiskLevel = (patient: any): 'low' | 'medium' | 'high' | 'critical' => {
  let score = 0;
  
  score += patient.urgency * 2;
  if (patient.age > 75 || patient.age < 2) score += 3;
  if ((patient.waitTime || 0) > 30) score += 2;
  
  if (score >= 10) return 'critical';
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

const calculateRiskFactors = (patient: any): string[] => {
  const factors = [];
  
  if (patient.age > 75) factors.push('Âge avancé');
  if (patient.urgency >= 5) factors.push('Urgence vitale');
  if ((patient.waitTime || 0) > 30) factors.push('Attente prolongée');
  if (patient.medicalHistory?.length > 0) factors.push('Antécédents');
  
  return factors;
};

const calculateRiskScore = (patient: any): number => {
  let score = 0;
  
  score += patient.urgency * 10;
  if (patient.age > 75) score += 15;
  if ((patient.waitTime || 0) > 30) score += 10;
  if (patient.vitalSigns?.oxygenSaturation < 95) score += 15;
  
  return score;
};

const getRegionFromCode = (code: string): string => {
  if (code.includes('YDE')) return 'Centre';
  if (code.includes('DLA')) return 'Littoral';
  if (code.includes('GAR')) return 'Nord';
  if (code.includes('LIM')) return 'Sud-Ouest';
  return 'Autre';
};

const getAvailableActions = (patient: any): string[] => {
  const actions = ['view', 'contact'];
  
  if (patient.status === 'ready') actions.push('consult');
  if (patient.status !== 'completed') actions.push('modify_priority', 'add_notes');
  if (patient.urgency >= 4) actions.push('urgent_call');
  
  return actions;
};

const getPrimaryAction = (patient: any): string => {
  if (patient.status === 'ready') return 'consult';
  if (patient.urgency >= 5) return 'urgent_call';
  if (patient.status === 'waiting') return 'prepare';
  return 'view';
};

const getUrgentActions = (patient: any): string[] => {
  if (patient.urgency >= 5) return ['urgent_call', 'immediate_consult'];
  if (patient.urgency >= 4) return ['priority_consult', 'urgent_call'];
  return [];
};

const getDisabledActions = (patient: any): string[] => {
  const disabled = [];
  
  if (patient.status === 'completed') {
    disabled.push('consult', 'modify_priority', 'prepare');
  }
  
  if (patient.status === 'in_consultation') {
    disabled.push('modify_priority');
  }
  
  return disabled;
};

const getNotificationTypeLabel = (type: string): string => {
  const labels = {
    'urgent': 'Urgent',
    'warning': 'Attention',
    'info': 'Information',
    'success': 'Succès',
    'error': 'Erreur'
  };
  return labels[type] || type;
};

const getNotificationTypeColor = (type: string): string => {
  const colors = {
    'urgent': 'red',
    'warning': 'yellow',
    'info': 'blue',
    'success': 'green',
    'error': 'red'
  };
  return colors[type] || 'gray';
};

const getNotificationTypeIcon = (type: string): string => {
  const icons = {
    'urgent': '🚨',
    'warning': '⚠️',
    'info': 'ℹ️',
    'success': '✅',
    'error': '❌'
  };
  return icons[type] || '📢';
};

const getNotificationPriority = (type: string): 'low' | 'medium' | 'high' | 'critical' => {
  const priorities = {
    'urgent': 'critical',
    'warning': 'high',
    'error': 'high',
    'info': 'medium',
    'success': 'low'
  };
  return priorities[type] || 'medium';
};

const isRecentNotification = (time: string): boolean => {
  const notificationTime = new Date(`${new Date().toDateString()} ${time}`);
  const now = new Date();
  return (now.getTime() - notificationTime.getTime()) < 300000; // 5 minutes
};

const calculateTimeElapsed = (time: string): string => {
  const notificationTime = new Date(`${new Date().toDateString()} ${time}`);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / 60000);
  
  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  const hours = Math.floor(diffMinutes / 60);
  return `Il y a ${hours}h`;
};

const extractKeywords = (message: string): string[] => {
  const keywords = message.toLowerCase().match(/\b(urgent|patient|niveau|attente|critique)\b/g);
  return keywords || [];
};

const extractPatientName = (message: string): string | null => {
  const match = message.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
  return match ? match[1] : null;
};

const requiresAction = (type: string): boolean => {
  return ['urgent', 'warning', 'error'].includes(type);
};

const getNotificationActions = (notification: any): string[] => {
  const actions = ['mark_read'];
  
  if (notification.type === 'urgent') {
    actions.push('respond_immediately', 'escalate');
  } else if (notification.type === 'warning') {
    actions.push('acknowledge', 'respond');
  }
  
  actions.push('archive', 'delete');
  return actions;
};

const getPrimaryNotificationAction = (notification: any): string => {
  if (notification.type === 'urgent') return 'respond_immediately';
  if (notification.type === 'warning') return 'acknowledge';
  return 'mark_read';
};

const getExpectedResponseTime = (type: string): number => {
  const times = {
    'urgent': 2,
    'warning': 10,
    'error': 5,
    'info': 30,
    'success': 0
  };
  return times[type] || 15;
};

const isNotificationExpired = (notification: any): boolean => {
  const createdTime = new Date(`${new Date().toDateString()} ${notification.time}`);
  const now = new Date();
  const ageHours = (now.getTime() - createdTime.getTime()) / (1000 * 60 * 60);
  
  return ageHours > 24; // Expire après 24h
};

const isRecentChange = (timestamp: string): boolean => {
  const changeTime = new Date(`${new Date().toDateString()} ${timestamp}`);
  const now = new Date();
  return (now.getTime() - changeTime.getTime()) < 3600000; // 1 heure
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const getRoleColor = (role: string): string => {
  const colors = {
    'Médecin': 'blue',
    'Infirmier': 'green',
    'Secrétaire': 'purple',
    'Admin': 'red'
  };
  return colors[role] || 'gray';
};

const formatChangesSummary = (changes: any[]): string => {
  return changes.map(change => 
    `${change.field}: ${change.oldValue} → ${change.newValue}`
  ).join(', ');
};

const formatChange = (change: any): string => {
  const arrow = change.newValue > change.oldValue ? '↗️' : '↘️';
  return `${change.field}: ${change.oldValue} ${arrow} ${change.newValue}`;
};

const calculateChangeImpact = (change: any): 'low' | 'medium' | 'high' => {
  if (change.field.includes('urgence')) {
    const diff = Math.abs(change.newValue - change.oldValue);
    if (diff >= 3) return 'high';
    if (diff >= 2) return 'medium';
    return 'low';
  }
  return 'low';
};

const calculateOverallImpact = (changes: any[]): 'low' | 'medium' | 'high' => {
  const impacts = changes.map(calculateChangeImpact);
  if (impacts.includes('high')) return 'high';
  if (impacts.includes('medium')) return 'medium';
  return 'low';
};

const isReversibleChange = (changes: any[]): boolean => {
  return !changes.some(c => c.newValue === 5 && c.field.includes('urgence'));
};

const categorizeChange = (details: string): string => {
  const detailsLower = details.toLowerCase();
  if (detailsLower.includes('douleur')) return 'Symptôme';
  if (detailsLower.includes('tension')) return 'Signes vitaux';
  if (detailsLower.includes('amélioration')) return 'Amélioration';
  return 'Autre';
};

const getRelativeTime = (timestamp: string): string => {
  const time = new Date(`${new Date().toDateString()} ${timestamp}`);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - time.getTime()) / 60000);
  
  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  const hours = Math.floor(diffMinutes / 60);
  return `Il y a ${hours}h`;
};

const calculateAvailability = (doctor: any): boolean => {
  const hour = new Date().getHours();
  return hour >= 8 && hour < 17; // Heures ouvrables
};

const calculateWorkload = (doctor: any): 'low' | 'medium' | 'high' => {
  const hour = new Date().getHours();
  if (hour >= 10 && hour <= 12) return 'high';
  if (hour >= 14 && hour <= 16) return 'medium';
  return 'low';
};

const getCurrentSchedule = (): string => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const getNextAvailableSlot = (): string => {
  const now = new Date();
  const nextSlot = new Date(now.getTime() + 30 * 60000); // +30 minutes
  return nextSlot.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const calculateEfficiency = (doctor: any): number => {
  // Simulation basée sur l'heure et la charge de travail
  const hour = new Date().getHours();
  if (hour >= 10 && hour <= 12) return 85; // Période chargée
  if (hour >= 14 && hour <= 16) return 90; // Efficacité normale
  return 95; // Période calme
};

const calculateSpecialtyLoad = (specialty: any): 'low' | 'medium' | 'high' => {
  const patientCount = specialty.currentPatients || 0;
  const doctorCount = specialty.availableDoctors || 1;
  const ratio = patientCount / doctorCount;
  
  if (ratio > 5) return 'high';
  if (ratio > 3) return 'medium';
  return 'low';
};

const getWaitStatus = (waitTime: number): 'excellent' | 'good' | 'acceptable' | 'poor' => {
  if (waitTime <= 10) return 'excellent';
  if (waitTime <= 20) return 'good';
  if (waitTime <= 30) return 'acceptable';
  return 'poor';
};