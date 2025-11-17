// Fonctions de tri existantes (inchangées)
export const sortPatientsByUrgency = (patients: any[], direction: 'asc' | 'desc' = 'desc') => {
  return [...patients].sort((a, b) => {
    const comparison = b.urgency - a.urgency;
    return direction === 'desc' ? comparison : -comparison;
  });
};

export const sortPatientsByWaitTime = (patients: any[], direction: 'asc' | 'desc' = 'desc') => {
  return [...patients].sort((a, b) => {
    const comparison = b.waitTime - a.waitTime;
    return direction === 'desc' ? comparison : -comparison;
  });
};

// Nouvelles fonctions de tri pour les urgences
export const sortPatientsByName = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    const comparison = nameA.localeCompare(nameB, 'fr');
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByAge = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const ageA = a.age || 0;
    const ageB = b.age || 0;
    const comparison = ageA - ageB;
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsBySpecialty = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const specialtyA = a.specialty?.toLowerCase() || '';
    const specialtyB = b.specialty?.toLowerCase() || '';
    const comparison = specialtyA.localeCompare(specialtyB, 'fr');
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByStatus = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  const statusOrder = {
    'waiting': 1,
    'in_preparation': 2,
    'ready': 3,
    'in_consultation': 4,
    'completed': 5
  };

  return [...patients].sort((a, b) => {
    const statusA = statusOrder[a.status] || 0;
    const statusB = statusOrder[b.status] || 0;
    const comparison = statusA - statusB;
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByArrivalTime = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const timeA = a.arrivalTime ? new Date(`${new Date().toDateString()} ${a.arrivalTime}`) : new Date(0);
    const timeB = b.arrivalTime ? new Date(`${new Date().toDateString()} ${b.arrivalTime}`) : new Date(0);
    const comparison = timeA.getTime() - timeB.getTime();
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByAppointment = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const appointmentA = a.appointment ? new Date(`${new Date().toDateString()} ${a.appointment}`) : new Date(0);
    const appointmentB = b.appointment ? new Date(`${new Date().toDateString()} ${b.appointment}`) : new Date(0);
    const comparison = appointmentA.getTime() - appointmentB.getTime();
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByCenter = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const centerA = a.clinicCode?.toLowerCase() || '';
    const centerB = b.clinicCode?.toLowerCase() || '';
    const comparison = centerA.localeCompare(centerB, 'fr');
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByDoctor = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const doctorA = a.doctor?.toLowerCase() || '';
    const doctorB = b.doctor?.toLowerCase() || '';
    const comparison = doctorA.localeCompare(doctorB, 'fr');
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByRisk = (patients: any[], direction: 'asc' | 'desc' = 'desc') => {
  const riskOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
  
  return [...patients].sort((a, b) => {
    const riskA = riskOrder[calculatePatientRisk(a)] || 0;
    const riskB = riskOrder[calculatePatientRisk(b)] || 0;
    const comparison = riskA - riskB;
    return direction === 'desc' ? -comparison : comparison;
  });
};

export const sortPatientsByPriority = (patients: any[], algorithm: string = 'balanced', direction: 'asc' | 'desc' = 'desc') => {
  return [...patients].sort((a, b) => {
    const priorityA = calculatePatientPriority(a, algorithm);
    const priorityB = calculatePatientPriority(b, algorithm);
    const comparison = priorityA - priorityB;
    return direction === 'desc' ? -comparison : comparison;
  });
};

export const sortPatientsByVitalSigns = (patients: any[], vitalSign: string, direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const valueA = getVitalSignValue(a, vitalSign);
    const valueB = getVitalSignValue(b, vitalSign);
    const comparison = valueA - valueB;
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByEstimatedTreatmentTime = (patients: any[], direction: 'asc' | 'desc' = 'asc') => {
  return [...patients].sort((a, b) => {
    const timeA = estimatePatientTreatmentTime(a);
    const timeB = estimatePatientTreatmentTime(b);
    const comparison = timeA - timeB;
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const sortPatientsByTotalTime = (patients: any[], direction: 'asc' | 'desc' = 'desc') => {
  return [...patients].sort((a, b) => {
    const totalA = (a.waitTime || 0) + estimatePatientTreatmentTime(a);
    const totalB = (b.waitTime || 0) + estimatePatientTreatmentTime(b);
    const comparison = totalA - totalB;
    return direction === 'desc' ? -comparison : comparison;
  });
};

// Tri multi-critères
export const sortPatientsByMultipleCriteria = (patients: any[], criteria: any[]) => {
  return [...patients].sort((a, b) => {
    for (const criterion of criteria) {
      const { field, direction = 'asc', weight = 1 } = criterion;
      let comparison = 0;
      
      switch (field) {
        case 'urgency':
          comparison = (b.urgency - a.urgency) * weight;
          break;
        case 'waitTime':
          comparison = ((b.waitTime || 0) - (a.waitTime || 0)) * weight;
          break;
        case 'age':
          comparison = ((a.age || 0) - (b.age || 0)) * weight;
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '') * weight;
          break;
        case 'priority':
          const priorityA = calculatePatientPriority(a);
          const priorityB = calculatePatientPriority(b);
          comparison = (priorityB - priorityA) * weight;
          break;
        case 'risk':
          const riskOrder = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
          const riskA = riskOrder[calculatePatientRisk(a)] || 0;
          const riskB = riskOrder[calculatePatientRisk(b)] || 0;
          comparison = (riskB - riskA) * weight;
          break;
        default:
          comparison = 0;
      }
      
      if (direction === 'asc') comparison = -comparison;
      
      if (comparison !== 0) {
        return comparison;
      }
    }
    return 0;
  });
};

// Tri intelligent basé sur le contexte
export const sortPatientsIntelligent = (patients: any[], context: any = {}) => {
  const {
    timeOfDay = new Date().getHours(),
    doctorSpecialty = null,
    systemLoad = 'normal',
    prioritizeUrgent = true
  } = context;

  // Critères de tri adaptatifs
  const criteria = [];
  
  if (prioritizeUrgent) {
    criteria.push({ field: 'urgency', weight: 3 });
  }
  
  // En période de pointe, prioriser les temps d'attente
  if (systemLoad === 'high' || (timeOfDay >= 10 && timeOfDay <= 12)) {
    criteria.push({ field: 'waitTime', weight: 2 });
  }
  
  // Prioriser la spécialité du médecin connecté
  if (doctorSpecialty) {
    const specialtyPatients = patients.filter(p => p.specialty === doctorSpecialty);
    const otherPatients = patients.filter(p => p.specialty !== doctorSpecialty);
    
    return [
      ...sortPatientsByMultipleCriteria(specialtyPatients, criteria),
      ...sortPatientsByMultipleCriteria(otherPatients, criteria)
    ];
  }
  
  criteria.push({ field: 'priority', weight: 1 });
  
  return sortPatientsByMultipleCriteria(patients, criteria);
};

// Tri par groupes
export const sortPatientsGrouped = (patients: any[], groupBy: string, sortBy: string = 'urgency') => {
  const groups: { [key: string]: any[] } = {};
  
  // Grouper les patients
  patients.forEach(patient => {
    const groupKey = patient[groupBy] || 'Non défini';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(patient);
  });
  
  // Trier chaque groupe
  const sortedGroups = Object.keys(groups).sort().map(groupKey => ({
    groupKey,
    patients: applySingleSort(groups[groupKey], sortBy, 'desc')
  }));
  
  return sortedGroups;
};

// Tri optimisé pour les performances
export const sortPatientsOptimized = (patients: any[], sortBy: string, direction: 'asc' | 'desc' = 'desc') => {
  // Pour de grandes listes, utiliser un tri optimisé
  if (patients.length > 1000) {
    return quickSort(patients, sortBy, direction);
  }
  
  return applySingleSort(patients, sortBy, direction);
};

// Tri avec mémorisation
const sortCache = new Map();

export const sortPatientsWithCache = (patients: any[], sortBy: string, direction: 'asc' | 'desc' = 'desc') => {
  const cacheKey = `${sortBy}-${direction}-${patients.length}-${getDataHash(patients)}`;
  
  if (sortCache.has(cacheKey)) {
    return sortCache.get(cacheKey);
  }
  
  const sorted = applySingleSort(patients, sortBy, direction);
  
  // Limiter la taille du cache
  if (sortCache.size > 10) {
    const firstKey = sortCache.keys().next().value;
    sortCache.delete(firstKey);
  }
  
  sortCache.set(cacheKey, sorted);
  return sorted;
};

// Fonctions utilitaires

const applySingleSort = (patients: any[], sortBy: string, direction: 'asc' | 'desc') => {
  switch (sortBy) {
    case 'urgency':
      return sortPatientsByUrgency(patients, direction);
    case 'waitTime':
      return sortPatientsByWaitTime(patients, direction);
    case 'name':
      return sortPatientsByName(patients, direction);
    case 'age':
      return sortPatientsByAge(patients, direction);
    case 'specialty':
      return sortPatientsBySpecialty(patients, direction);
    case 'status':
      return sortPatientsByStatus(patients, direction);
    case 'arrivalTime':
      return sortPatientsByArrivalTime(patients, direction);
    case 'appointment':
      return sortPatientsByAppointment(patients, direction);
    case 'center':
      return sortPatientsByCenter(patients, direction);
    case 'doctor':
      return sortPatientsByDoctor(patients, direction);
    case 'risk':
      return sortPatientsByRisk(patients, direction);
    case 'priority':
      return sortPatientsByPriority(patients, 'balanced', direction);
    default:
      return patients;
  }
};

const calculatePatientPriority = (patient: any, algorithm: string = 'balanced'): number => {
  const weights = {
    balanced: { urgency: 0.5, waitTime: 0.3, age: 0.1, clinical: 0.1 },
    urgency_first: { urgency: 0.8, waitTime: 0.1, age: 0.05, clinical: 0.05 },
    wait_time_first: { urgency: 0.3, waitTime: 0.6, age: 0.05, clinical: 0.05 }
  };
  
  const w = weights[algorithm] || weights.balanced;
  
  const urgencyScore = (patient.urgency - 1) / 4; // 0-1
  const waitTimeScore = Math.min((patient.waitTime || 0) / 60, 1); // 0-1, plafonné à 1h
  const ageScore = calculateAgeScore(patient.age);
  const clinicalScore = calculateClinicalScore(patient);
  
  return Math.round(
    (urgencyScore * w.urgency +
     waitTimeScore * w.waitTime +
     ageScore * w.age +
     clinicalScore * w.clinical) * 100
  );
};

const calculatePatientRisk = (patient: any): 'low' | 'medium' | 'high' | 'critical' => {
  let riskScore = 0;
  
  riskScore += patient.urgency * 2;
  
  if (patient.age > 75 || patient.age < 2) riskScore += 3;
  else if (patient.age > 65 || patient.age < 5) riskScore += 2;
  
  if ((patient.waitTime || 0) > 60) riskScore += 3;
  else if ((patient.waitTime || 0) > 30) riskScore += 2;
  
  if (patient.vitalSigns) {
    const vs = patient.vitalSigns;
    if (vs.temperature > 39 || vs.temperature < 35) riskScore += 2;
    if (vs.oxygenSaturation < 90) riskScore += 3;
  }
  
  if (riskScore >= 12) return 'critical';
  if (riskScore >= 8) return 'high';
  if (riskScore >= 4) return 'medium';
  return 'low';
};

const calculateAgeScore = (age: number): number => {
  if (age < 2 || age > 75) return 1;
  if (age < 5 || age > 65) return 0.8;
  if (age < 18 || age > 60) return 0.6;
  return 0.4;
};

const calculateClinicalScore = (patient: any): number => {
  let score = 0;
  
  if (patient.medicalHistory?.length > 0) score += 0.3;
  if (patient.allergies?.length > 0) score += 0.2;
  
  if (patient.vitalSigns) {
    const vs = patient.vitalSigns;
    if (vs.temperature > 38.5 || vs.temperature < 36) score += 0.2;
    if (vs.heartRate > 100 || vs.heartRate < 60) score += 0.2;
    if (vs.oxygenSaturation < 95) score += 0.3;
  }
  
  return Math.min(score, 1);
};

const getVitalSignValue = (patient: any, vitalSign: string): number => {
  if (!patient.vitalSigns) return 0;
  
  const vs = patient.vitalSigns;
  
  switch (vitalSign) {
    case 'temperature':
      return parseFloat(vs.temperature) || 0;
    case 'heartRate':
      return parseInt(vs.heartRate) || 0;
    case 'oxygenSaturation':
      return parseInt(vs.oxygenSaturation) || 0;
    case 'systolic':
      return vs.bloodPressure ? parseInt(vs.bloodPressure.split('/')[0]) || 0 : 0;
    case 'diastolic':
      return vs.bloodPressure ? parseInt(vs.bloodPressure.split('/')[1]) || 0 : 0;
    default:
      return 0;
  }
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

const quickSort = (patients: any[], sortBy: string, direction: 'asc' | 'desc'): any[] => {
  if (patients.length <= 1) return patients;
  
  const pivot = patients[Math.floor(patients.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (const patient of patients) {
    const comparison = comparePatients(patient, pivot, sortBy);
    if (comparison < 0) {
      direction === 'asc' ? left.push(patient) : right.push(patient);
    } else if (comparison > 0) {
      direction === 'asc' ? right.push(patient) : left.push(patient);
    } else {
      equal.push(patient);
    }
  }
  
  return [
    ...quickSort(left, sortBy, direction),
    ...equal,
    ...quickSort(right, sortBy, direction)
  ];
};

const comparePatients = (a: any, b: any, sortBy: string): number => {
  switch (sortBy) {
    case 'urgency':
      return (a.urgency || 0) - (b.urgency || 0);
    case 'waitTime':
      return (a.waitTime || 0) - (b.waitTime || 0);
    case 'name':
      return (a.name || '').localeCompare(b.name || '');
    case 'age':
      return (a.age || 0) - (b.age || 0);
    default:
      return 0;
  }
};

const getDataHash = (patients: any[]): string => {
  return patients.length.toString() + 
         patients.slice(0, 3).map(p => p.id || '').join('');
};