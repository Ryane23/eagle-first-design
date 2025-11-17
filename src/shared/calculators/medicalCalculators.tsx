// Types pour les calculs médicaux
interface Patient {
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'M' | 'F';
}

interface RoleStatistics {
  securityScore: number;
  accessLevel: string;
  moduleCount: number;
  permissions: {
    read: number;
    write: number;
    admin: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// Fonctions existantes
export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const calculateWaitTime = (arrivalTime: string): number => {
  const arrival = new Date(`${new Date().toDateString()} ${arrivalTime}`);
  const now = new Date();
  return Math.floor((now.getTime() - arrival.getTime()) / (1000 * 60));
};

// Nouvelles fonctions ajoutées
export const calculateIMC = (weight: number, height: number): number => {
  if (!weight || !height || height <= 0) return 0;
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const interpretIMC = (imc: number): string => {
  if (imc < 18.5) return 'Insuffisance pondérale';
  if (imc < 25) return 'Poids normal';
  if (imc < 30) return 'Surpoids';
  if (imc < 35) return 'Obésité classe I';
  if (imc < 40) return 'Obésité classe II';
  return 'Obésité classe III';
};

export const calculateRoleStatistics = (roleId: string, permissions: any): RoleStatistics => {
  if (!permissions || !permissions[roleId]) {
    return {
      securityScore: 0,
      accessLevel: 'none',
      moduleCount: 0,
      permissions: { read: 0, write: 0, admin: 0 },
      riskLevel: 'low',
      recommendations: ['Aucune permission configurée']
    };
  }

  const rolePermissions = permissions[roleId];
  const modules = Object.keys(rolePermissions);
  const permissionCounts = { read: 0, write: 0, admin: 0 };
  let totalPermissions = 0;

  // Analyser les permissions par module
  modules.forEach(moduleId => {
    const modulePerms = rolePermissions[moduleId];
    if (typeof modulePerms === 'object') {
      Object.entries(modulePerms).forEach(([key, value]) => {
        if (key !== 'inherited') {
          totalPermissions++;
          switch (value) {
            case 'read':
              permissionCounts.read++;
              break;
            case 'write':
              permissionCounts.write++;
              break;
            case 'admin':
              permissionCounts.admin++;
              break;
          }
        }
      });
    }
  });

  // Calculer le score de sécurité (0-100)
  const adminWeight = 3;
  const writeWeight = 2;
  const readWeight = 1;
  
  const weightedScore = (
    permissionCounts.admin * adminWeight +
    permissionCounts.write * writeWeight +
    permissionCounts.read * readWeight
  );
  
  const maxPossibleScore = totalPermissions * adminWeight;
  const securityScore = maxPossibleScore > 0 
    ? Math.round((weightedScore / maxPossibleScore) * 100)
    : 0;

  // Déterminer le niveau d'accès
  let accessLevel = 'none';
  if (permissionCounts.admin > 0) accessLevel = 'admin';
  else if (permissionCounts.write > 0) accessLevel = 'write';
  else if (permissionCounts.read > 0) accessLevel = 'read';

  // Déterminer le niveau de risque
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (securityScore > 80) riskLevel = 'high';
  else if (securityScore > 50) riskLevel = 'medium';

  // Générer des recommandations
  const recommendations: string[] = [];
  
  if (permissionCounts.admin > 5) {
    recommendations.push('Considérer la réduction des permissions administrateur');
  }
  
  if (permissionCounts.read === 0 && permissionCounts.write === 0 && permissionCounts.admin === 0) {
    recommendations.push('Aucune permission accordée - vérifier la configuration');
  }
  
  if (riskLevel === 'high') {
    recommendations.push('Niveau de privilège élevé - révision recommandée');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Configuration des permissions appropriée');
  }

  return {
    securityScore,
    accessLevel,
    moduleCount: modules.length,
    permissions: permissionCounts,
    riskLevel,
    recommendations
  };
};

// Calculateurs pour les signes vitaux
export const calculateTensionArterielle = (systolique: number, diastolique: number): string => {
  if (systolique < 90 || diastolique < 60) return 'Hypotension';
  if (systolique < 120 && diastolique < 80) return 'Normale';
  if (systolique < 130 && diastolique < 80) return 'Élevée';
  if (systolique < 140 || diastolique < 90) return 'Hypertension stade 1';
  if (systolique < 180 || diastolique < 120) return 'Hypertension stade 2';
  return 'Crise hypertensive';
};

export const calculateFrequenceCardiaque = (bpm: number, age: number): string => {
  const maxHR = 220 - age;
  const percentage = (bpm / maxHR) * 100;
  
  if (bpm < 60) return 'Bradycardie';
  if (bmp > 100) return 'Tachycardie';
  if (percentage < 50) return 'Repos';
  if (percentage < 70) return 'Modérée';
  if (percentage < 85) return 'Vigoureuse';
  return 'Maximale';
};

// Calculateurs de dosage (exemples simplifiés)
export const calculatePediatricDose = (adultDose: number, childWeight: number): number => {
  // Règle de Clark simplifié (poids en kg / 70kg adulte moyen)
  return Math.round((adultDose * childWeight / 70) * 100) / 100;
};

export const calculateSurfaceCorporelle = (weight: number, height: number): number => {
  // Formule de Mosteller
  return Math.sqrt((weight * height) / 3600);
};

// Calculateurs d'urgence
export const calculateGlasgowScore = (
  eyeResponse: number, 
  verbalResponse: number, 
  motorResponse: number
): { score: number; severity: string } => {
  const score = eyeResponse + verbalResponse + motorResponse;
  let severity = 'Normal';
  
  if (score <= 8) severity = 'Coma sévère';
  else if (score <= 12) severity = 'Coma modéré';
  else if (score <= 14) severity = 'Coma léger';
  
  return { score, severity };
};

export const calculateTriageScore = (
  vitalSigns: {
    temperature: number;
    heartRate: number;
    bloodPressure: { systolic: number; diastolic: number };
    oxygenSaturation: number;
  },
  symptoms: string[],
  painLevel: number
): { priority: number; urgency: string } => {
  let score = 0;
  
  // Signes vitaux critiques
  if (vitalSigns.temperature > 38.5 || vitalSigns.temperature < 36) score += 2;
  if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) score += 2;
  if (vitalSigns.bloodPressure.systolic > 180 || vitalSigns.bloodPressure.systolic < 90) score += 3;
  if (vitalSigns.oxygenSaturation < 95) score += 3;
  
  // Symptômes critiques
  const criticalSymptoms = ['chest pain', 'difficulty breathing', 'altered consciousness'];
  if (symptoms.some(s => criticalSymptoms.includes(s.toLowerCase()))) score += 3;
  
  // Douleur
  if (painLevel >= 8) score += 2;
  else if (painLevel >= 5) score += 1;
  
  let priority = 5;
  let urgency = 'Non urgent';
  
  if (score >= 8) { priority = 1; urgency = 'Critique'; }
  else if (score >= 6) { priority = 2; urgency = 'Très urgent'; }
  else if (score >= 4) { priority = 3; urgency = 'Urgent'; }
  else if (score >= 2) { priority = 4; urgency = 'Moins urgent'; }
  
  return { priority, urgency };
};

// Calculateurs statistiques pour les rapports
export const calculatePatientStatistics = (patients: any[]): {
  averageAge: number;
  genderDistribution: { male: number; female: number };
  averageWaitTime: number;
  urgencyDistribution: Record<number, number>;
} => {
  if (!patients.length) {
    return {
      averageAge: 0,
      genderDistribution: { male: 0, female: 0 },
      averageWaitTime: 0,
      urgencyDistribution: {}
    };
  }
  
  const totalAge = patients.reduce((sum, p) => sum + (p.age || 0), 0);
  const averageAge = Math.round(totalAge / patients.length);
  
  const genderDistribution = patients.reduce((acc, p) => {
    if (p.gender === 'M') acc.male++;
    else if (p.gender === 'F') acc.female++;
    return acc;
  }, { male: 0, female: 0 });
  
  const totalWaitTime = patients.reduce((sum, p) => sum + (p.waitTime || 0), 0);
  const averageWaitTime = Math.round(totalWaitTime / patients.length);
  
  const urgencyDistribution = patients.reduce((acc, p) => {
    const urgency = p.urgency || 5;
    acc[urgency] = (acc[urgency] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  return {
    averageAge,
    genderDistribution,
    averageWaitTime,
    urgencyDistribution
  };
};

// Export de tous les calculateurs
export default {
  calculateAge,
  calculateWaitTime,
  calculateIMC,
  interpretIMC,
  calculateRoleStatistics,
  calculateTensionArterielle,
  calculateFrequenceCardiaque,
  calculatePediatricDose,
  calculateSurfaceCorporelle,
  calculateGlasgowScore,
  calculateTriageScore,
  calculatePatientStatistics
};