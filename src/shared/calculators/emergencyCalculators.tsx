import { EmergencyCase } from '@hooks/useEmergencyManagement';

// Calculer le score de priorité d'un patient d'urgence
export const calculateEmergencyPriorityScore = (
  severity: number,
  waitTime: number,
  age?: number,
  vitalSigns?: any,
  algorithm: 'standard' | 'time_priority' | 'severity_priority' = 'standard'
): number => {
  let baseScore = 0;
  
  // Score basé sur la sévérité (0-100)
  const severityScore = severity * 20;
  
  // Score basé sur le temps d'attente (0-100)
  const waitTimeScore = Math.min(waitTime / 2, 100);
  
  // Score basé sur l'âge (bonus pour les âges extrêmes)
  let ageBonus = 0;
  if (age !== undefined) {
    if (age < 2 || age > 80) {
      ageBonus = 10;
    } else if (age < 5 || age > 70) {
      ageBonus = 5;
    }
  }
  
  // Score basé sur les signes vitaux
  let vitalSignsBonus = 0;
  if (vitalSigns) {
    vitalSignsBonus = calculateVitalSignsRisk(vitalSigns);
  }
  
  // Application de l'algorithme de pondération
  switch (algorithm) {
    case 'time_priority':
      baseScore = severityScore * 0.4 + waitTimeScore * 0.6;
      break;
    case 'severity_priority':
      baseScore = severityScore * 0.8 + waitTimeScore * 0.2;
      break;
    case 'standard':
    default:
      baseScore = severityScore * 0.7 + waitTimeScore * 0.3;
      break;
  }
  
  // Ajouter les bonus
  const finalScore = Math.min(baseScore + ageBonus + vitalSignsBonus, 200);
  
  return Math.round(finalScore);
};

// Calculer le risque basé sur les signes vitaux
export const calculateVitalSignsRisk = (vitalSigns: {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
}): number => {
  let riskScore = 0;
  
  // Évaluation de la tension artérielle
  if (vitalSigns.bloodPressure) {
    const [systolic, diastolic] = vitalSigns.bloodPressure.split('/').map(Number);
    
    if (systolic > 180 || systolic < 90 || diastolic > 110 || diastolic < 60) {
      riskScore += 15; // Risque critique
    } else if (systolic > 160 || systolic < 100 || diastolic > 100 || diastolic < 70) {
      riskScore += 8;  // Risque modéré
    }
  }
  
  // Évaluation de la fréquence cardiaque
  if (vitalSigns.heartRate) {
    if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) {
      riskScore += 12; // Risque critique
    } else if (vitalSigns.heartRate > 100 || vitalSigns.heartRate < 60) {
      riskScore += 6;  // Risque modéré
    }
  }
  
  // Évaluation de la température
  if (vitalSigns.temperature) {
    if (vitalSigns.temperature > 39 || vitalSigns.temperature < 35) {
      riskScore += 10; // Risque critique
    } else if (vitalSigns.temperature > 38.5 || vitalSigns.temperature < 36) {
      riskScore += 5;  // Risque modéré
    }
  }
  
  // Évaluation de la saturation en oxygène
  if (vitalSigns.oxygenSaturation) {
    if (vitalSigns.oxygenSaturation < 90) {
      riskScore += 20; // Risque critique
    } else if (vitalSigns.oxygenSaturation < 95) {
      riskScore += 10; // Risque modéré
    }
  }
  
  return Math.min(riskScore, 50); // Maximum 50 points de bonus
};

// Calculer le temps d'attente estimé pour un patient
export const calculateEstimatedWaitTime = (
  patientSeverity: number,
  currentQueue: EmergencyCase[],
  averageConsultationTime: number = 30
): number => {
  // Filtrer les patients avec une priorité égale ou supérieure
  const higherPriorityPatients = currentQueue.filter(patient => 
    patient.severity >= patientSeverity && patient.status === 'waiting'
  );
  
  // Calculer le temps d'attente basé sur la file d'attente
  const queueTime = higherPriorityPatients.length * averageConsultationTime;
  
  // Ajuster selon la sévérité
  const severityMultiplier = {
    1: 1.2,  // Non urgent - peut attendre plus
    2: 1.0,  // Peu urgent
    3: 0.8,  // Urgent - priorité plus élevée
    4: 0.4,  // Très urgent
    5: 0.1   // Critique - quasi immédiat
  };
  
  const adjustedTime = queueTime * (severityMultiplier[patientSeverity as keyof typeof severityMultiplier] || 1);
  
  return Math.max(Math.round(adjustedTime), patientSeverity >= 4 ? 5 : 10);
};

// Calculer la charge de travail du département
export const calculateDepartmentWorkload = (data: {
  totalCapacity: number;
  occupiedBeds: number;
  waitingPatients: number;
  staffCount: number;
  averageStayTime: number;
}) => {
  const occupancyRate = (data.occupiedBeds / data.totalCapacity) * 100;
  const patientToStaffRatio = (data.occupiedBeds + data.waitingPatients) / data.staffCount;
  
  // Calculer le score de charge (0-100)
  let workloadScore = 0;
  
  // Facteur d'occupation (40% du score)
  workloadScore += (occupancyRate / 100) * 40;
  
  // Facteur ratio patient/personnel (35% du score)
  const optimalRatio = 4; // 4 patients par membre du personnel
  const ratioScore = Math.min((patientToStaffRatio / optimalRatio), 1) * 35;
  workloadScore += ratioScore;
  
  // Facteur file d'attente (25% du score)
  const queueScore = Math.min((data.waitingPatients / data.totalCapacity), 1) * 25;
  workloadScore += queueScore;
  
  // Déterminer le niveau de charge
  let workloadLevel: 'low' | 'moderate' | 'high' | 'critical';
  if (workloadScore < 30) {
    workloadLevel = 'low';
  } else if (workloadScore < 60) {
    workloadLevel = 'moderate';
  } else if (workloadScore < 85) {
    workloadLevel = 'high';
  } else {
    workloadLevel = 'critical';
  }
  
  return {
    score: Math.round(workloadScore),
    level: workloadLevel,
    occupancyRate: Math.round(occupancyRate),
    patientToStaffRatio: Math.round(patientToStaffRatio * 10) / 10,
    recommendedActions: getWorkloadRecommendations(workloadLevel, data)
  };
};

// Calculer les métriques de performance d'urgence
export const calculateEmergencyPerformanceMetrics = (cases: EmergencyCase[]) => {
  const now = new Date();
  
  // Calculer les temps moyens
  const waitTimes = cases
    .filter(c => c.status !== 'discharged')
    .map(c => Math.floor((now.getTime() - c.arrivalTime.getTime()) / (1000 * 60)));
  
  const averageWaitTime = waitTimes.length > 0 
    ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length 
    : 0;
  
  // Calculer le taux de patients critiques
  const criticalRate = (cases.filter(c => c.severity >= 4).length / cases.length) * 100;
  
  // Calculer la distribution par sévérité
  const severityDistribution = {
    1: cases.filter(c => c.severity === 1).length,
    2: cases.filter(c => c.severity === 2).length,
    3: cases.filter(c => c.severity === 3).length,
    4: cases.filter(c => c.severity === 4).length,
    5: cases.filter(c => c.severity === 5).length
  };
  
  // Calculer les temps de réponse par sévérité
  const responseTimesBySeverity = Object.keys(severityDistribution).reduce((acc, severity) => {
    const severityCases = cases.filter(c => c.severity === parseInt(severity));
    const avgTime = severityCases.length > 0
      ? severityCases.reduce((sum, c) => {
          const waitTime = Math.floor((now.getTime() - c.arrivalTime.getTime()) / (1000 * 60));
          return sum + waitTime;
        }, 0) / severityCases.length
      : 0;
    
    return { ...acc, [severity]: Math.round(avgTime) };
  }, {});
  
  return {
    totalCases: cases.length,
    averageWaitTime: Math.round(averageWaitTime),
    criticalRate: Math.round(criticalRate * 10) / 10,
    severityDistribution,
    responseTimesBySeverity,
    performance: calculatePerformanceGrade(averageWaitTime, criticalRate)
  };
};

// Calculer le score de triage automatique
export const calculateTriageScore = (
  chiefComplaint: string,
  symptoms: string[],
  vitalSigns?: any,
  age?: number
): { suggestedSeverity: number; confidence: number; reasoning: string[] } => {
  let score = 1;
  let confidence = 80;
  const reasoning: string[] = [];
  
  // Mots-clés critiques
  const criticalKeywords = [
    'arrêt cardiaque', 'infarctus', 'avc', 'détresse respiratoire',
    'hémorragie massive', 'traumatisme crânien', 'coma'
  ];
  
  const urgentKeywords = [
    'douleur thoracique', 'dyspnée', 'accident', 'chute',
    'perte de connaissance', 'convulsions', 'fièvre élevée'
  ];
  
  // Analyser la plainte principale et les symptômes
  const allText = (chiefComplaint + ' ' + symptoms.join(' ')).toLowerCase();
  
  if (criticalKeywords.some(keyword => allText.includes(keyword))) {
    score = 5;
    confidence = 95;
    reasoning.push('Mots-clés critiques détectés');
  } else if (urgentKeywords.some(keyword => allText.includes(keyword))) {
    score = Math.max(score, 4);
    confidence = 85;
    reasoning.push('Mots-clés urgents détectés');
  }
  
  // Analyser les signes vitaux
  if (vitalSigns) {
    const vitalRisk = calculateVitalSignsRisk(vitalSigns);
    if (vitalRisk >= 30) {
      score = Math.max(score, 5);
      reasoning.push('Signes vitaux critiques');
    } else if (vitalRisk >= 15) {
      score = Math.max(score, 4);
      reasoning.push('Signes vitaux anormaux');
    } else if (vitalRisk >= 8) {
      score = Math.max(score, 3);
      reasoning.push('Signes vitaux préoccupants');
    }
  }
  
  // Facteur âge
  if (age !== undefined) {
    if (age < 1 || age > 85) {
      score = Math.max(score, 4);
      reasoning.push('Âge à risque élevé');
    } else if (age < 5 || age > 75) {
      score = Math.max(score, 3);
      reasoning.push('Âge nécessitant attention particulière');
    }
  }
  
  // Ajuster la confiance selon le nombre d'indicateurs
  if (reasoning.length > 2) {
    confidence = Math.min(confidence + 10, 95);
  } else if (reasoning.length === 0) {
    confidence = 60;
    reasoning.push('Évaluation basée sur les critères par défaut');
  }
  
  return {
    suggestedSeverity: score,
    confidence,
    reasoning
  };
};

// Calculer l'optimisation des ressources
export const calculateResourceOptimization = (
  zones: any[],
  staff: any[],
  equipment: any[]
) => {
  const recommendations: string[] = [];
  
  // Analyser la répartition des zones
  zones.forEach(zone => {
    const occupancyRate = (zone.occupied / zone.capacity) * 100;
    
    if (occupancyRate > 90) {
      recommendations.push(`Zone ${zone.name} surchargée (${Math.round(occupancyRate)}%)`);
    } else if (occupancyRate < 30) {
      recommendations.push(`Zone ${zone.name} sous-utilisée (${Math.round(occupancyRate)}%)`);
    }
  });
  
  // Analyser la disponibilité du personnel
  const availableStaff = staff.filter(s => s.status === 'available').length;
  const totalStaff = staff.length;
  const staffUtilization = ((totalStaff - availableStaff) / totalStaff) * 100;
  
  if (staffUtilization > 85) {
    recommendations.push('Personnel surchargé - envisager du renfort');
  } else if (staffUtilization < 50) {
    recommendations.push('Personnel sous-utilisé - optimisation possible');
  }
  
  // Analyser les équipements
  const availableEquipment = equipment.filter(e => e.status === 'available').length;
  const totalEquipment = equipment.length;
  const equipmentUtilization = ((totalEquipment - availableEquipment) / totalEquipment) * 100;
  
  if (equipmentUtilization > 80) {
    recommendations.push('Équipements fortement sollicités');
  }
  
  return {
    staffUtilization: Math.round(staffUtilization),
    equipmentUtilization: Math.round(equipmentUtilization),
    recommendations,
    overallEfficiency: Math.round((100 - Math.abs(staffUtilization - 70)) * 0.7 + (100 - Math.abs(equipmentUtilization - 60)) * 0.3)
  };
};

// Fonctions utilitaires

const getWorkloadRecommendations = (level: string, data: any): string[] => {
  const recommendations: string[] = [];
  
  switch (level) {
    case 'critical':
      recommendations.push('Activer le protocole de surcharge');
      recommendations.push('Demander du personnel de renfort');
      recommendations.push('Considérer la fermeture aux nouvelles admissions non urgentes');
      break;
    case 'high':
      recommendations.push('Alerter l\'équipe de supervision');
      recommendations.push('Préparer le personnel de garde');
      recommendations.push('Optimiser les flux de patients');
      break;
    case 'moderate':
      recommendations.push('Surveiller l\'évolution de la charge');
      recommendations.push('Préparer les ressources supplémentaires');
      break;
    case 'low':
      recommendations.push('Profiter pour la maintenance préventive');
      recommendations.push('Formation du personnel disponible');
      break;
  }
  
  return recommendations;
};

const calculatePerformanceGrade = (avgWaitTime: number, criticalRate: number): {
  grade: string;
  score: number;
  color: string;
} => {
  let score = 100;
  
  // Pénalité pour temps d'attente
  if (avgWaitTime > 60) score -= 30;
  else if (avgWaitTime > 30) score -= 15;
  else if (avgWaitTime > 15) score -= 5;
  
  // Pénalité pour taux de patients critiques élevé (surcharge)
  if (criticalRate > 40) score -= 20;
  else if (criticalRate > 25) score -= 10;
  
  let grade: string;
  let color: string;
  
  if (score >= 90) {
    grade = 'A';
    color = '#22c55e';
  } else if (score >= 80) {
    grade = 'B';
    color = '#3b82f6';
  } else if (score >= 70) {
    grade = 'C';
    color = '#f59e0b';
  } else if (score >= 60) {
    grade = 'D';
    color = '#f97316';
  } else {
    grade = 'F';
    color = '#ef4444';
  }
  
  return { grade, score: Math.max(score, 0), color };
};
    