export const mockDoctorInfo = {
  id: "MED-045",
  name: "Dr. Kouam",
  firstName: "Michel",
  lastName: "Kouam",
  title: "Docteur",
  specialty: "Cardiologie",
  clinique: "Centre Principal",
  clinicCode: "CP-DLA",
  photo: null,
  
  // Informations professionnelles
  professional: {
    license: "ORD-CM-2010-045",
    experience: "15 ans",
    graduationYear: 2008,
    university: "Université de Yaoundé I",
    certifications: [
      "Cardiologie interventionnelle",
      "Urgences cardiaques",
      "Échographie cardiaque",
      "Formation ACLS"
    ],
    specializations: [
      "Cardiologie interventionnelle",
      "Insuffisance cardiaque",
      "Arythmies",
      "Hypertension artérielle"
    ]
  },
  
  // Informations de contact
  contactInfo: {
    phone: "+237 677 123 456",
    email: "kouam@eagle-health.cm",
    office: "Bureau 204, 2ème étage",
    emergencyPhone: "+237 690 123 456"
  },
  
  // Horaires de travail
  schedule: {
    monday: { start: "08:00", end: "17:00", break: "12:00-13:00" },
    tuesday: { start: "08:00", end: "17:00", break: "12:00-13:00" },
    wednesday: { start: "08:00", end: "17:00", break: "12:00-13:00" },
    thursday: { start: "08:00", end: "17:00", break: "12:00-13:00" },
    friday: { start: "08:00", end: "17:00", break: "12:00-13:00" },
    saturday: { start: "08:00", end: "12:00", break: null },
    sunday: "Repos"
  },
  
  // Préférences utilisateur
  preferences: {
    theme: "light",
    language: "fr",
    notifications: {
      urgent: true,
      email: true,
      sms: false,
      desktop: true
    },
    autoRefresh: true,
    refreshInterval: 30,
    defaultView: "list",
    compactMode: false
  },
  
  // Statistiques actuelles
  currentStats: {
    patientsToday: 12,
    completedToday: 8,
    pendingConsultations: 4,
    averageConsultationTime: 25,
    efficiency: 92,
    patientSatisfaction: 4.8
  },
  
  // État actuel
  currentStatus: {
    available: true,
    currentActivity: "consultation",
    currentPatient: "Robert Mbarga",
    nextAvailableSlot: "11:30",
    workload: "normal", // low, normal, high, overloaded
    location: "Consultation Room 1"
  },
  
  // Permissions et rôles
  permissions: {
    canModifyUrgency: true,
    canAccessAllPatients: true,
    canExportData: true,
    canManageSchedule: true,
    canContactCenters: true,
    adminAccess: false,
    canApproveChanges: true
  }
};

// Autres médecins de l'équipe
export const mockMedicalTeam = [
  {
    id: "MED-046",
    name: "Dr. Ngo Bala",
    firstName: "Sarah",
    lastName: "Ngo Bala",
    specialty: "Gynécologie",
    clinique: "Centre Principal",
    clinicCode: "CP-DLA",
    contactInfo: {
      phone: "+237 677 234 567",
      email: "ngobala@eagle-health.cm",
      office: "Bureau 205, 2ème étage"
    },
    currentStatus: {
      available: true,
      workload: "low",
      patientsToday: 6
    },
    experience: "12 ans",
    rating: 4.7
  },
  {
    id: "MED-047",
    name: "Dr. Beyala",
    firstName: "Antoine",
    lastName: "Beyala",
    specialty: "Dermatologie",
    clinique: "Centre Médical Nord",
    clinicCode: "CMN-GAR",
    contactInfo: {
      phone: "+237 677 345 678",
      email: "beyala@eagle-health.cm",
      office: "Bureau 101, RDC"
    },
    currentStatus: {
      available: false,
      workload: "high",
      patientsToday: 15
    },
    experience: "8 ans",
    rating: 4.5
  },
  {
    id: "MED-048",
    name: "Dr. Fouda",
    firstName: "Jean-Claude",
    lastName: "Fouda",
    specialty: "Neurologie",
    clinique: "Hôpital Sainte Véronique",
    clinicCode: "HSV-DLA",
    contactInfo: {
      phone: "+237 677 456 789",
      email: "fouda@eagle-health.cm",
      office: "Bureau 302, 3ème étage"
    },
    currentStatus: {
      available: true,
      workload: "normal",
      patientsToday: 9
    },
    experience: "20 ans",
    rating: 4.9
  },
  {
    id: "MED-049",
    name: "Dr. Manga",
    firstName: "Christine",
    lastName: "Manga",
    specialty: "Pédiatrie",
    clinique: "Clinique Saint Jean",
    clinicCode: "CSJ-YDE",
    contactInfo: {
      phone: "+237 677 567 890",
      email: "manga@eagle-health.cm",
      office: "Bureau 150, 1er étage"
    },
    currentStatus: {
      available: true,
      workload: "normal",
      patientsToday: 11
    },
    experience: "10 ans",
    rating: 4.6
  },
  {
    id: "MED-050",
    name: "Dr. Etoga",
    firstName: "Paul",
    lastName: "Etoga",
    specialty: "Pneumologie",
    clinique: "Centre Médical",
    clinicCode: "CM-LIM",
    contactInfo: {
      phone: "+237 677 678 901",
      email: "etoga@eagle-health.cm",
      office: "Bureau 201, 2ème étage"
    },
    currentStatus: {
      available: false,
      workload: "normal",
      patientsToday: 7
    },
    experience: "14 ans",
    rating: 4.4
  }
];

// Spécialistes disponibles par urgence
export const mockSpecialistsByUrgency = {
  cardiologie: [
    mockDoctorInfo,
    {
      id: "MED-051",
      name: "Dr. Mbassi",
      specialty: "Cardiologie",
      available: true,
      currentLoad: 3
    }
  ],
  pediatrie: [
    mockMedicalTeam.find(d => d.specialty === "Pédiatrie"),
    {
      id: "MED-052",
      name: "Dr. Kotto",
      specialty: "Pédiatrie",
      available: true,
      currentLoad: 2
    }
  ],
  gynecologie: [
    mockMedicalTeam.find(d => d.specialty === "Gynécologie")
  ],
  neurologie: [
    mockMedicalTeam.find(d => d.specialty === "Neurologie")
  ],
  pneumologie: [
    mockMedicalTeam.find(d => d.specialty === "Pneumologie")
  ],
  dermatologie: [
    mockMedicalTeam.find(d => d.specialty === "Dermatologie")
  ]
};

// Planning des médecins pour la journée
export const mockDoctorSchedules = {
  [mockDoctorInfo.id]: {
    date: new Date().toISOString().split('T')[0],
    slots: [
      { time: "08:00", patient: null, available: true },
      { time: "08:30", patient: "Thomas Ebogo", available: false },
      { time: "09:00", patient: "Marie Ekambi", available: false },
      { time: "09:30", patient: "Robert Mbarga", available: false },
      { time: "10:00", patient: "Jeanne Atangana", available: false },
      { time: "10:30", patient: null, available: true },
      { time: "11:00", patient: "Claude Bekolo", available: false },
      { time: "11:30", patient: null, available: true },
      { time: "12:00", patient: "PAUSE", available: false },
      { time: "13:00", patient: "Paul Tamba", available: false },
      { time: "13:30", patient: null, available: true },
      { time: "14:00", patient: "Sophie Ndom", available: false },
      { time: "14:30", patient: null, available: true },
      { time: "15:00", patient: null, available: true },
      { time: "15:30", patient: null, available: true },
      { time: "16:00", patient: null, available: true },
      { time: "16:30", patient: null, available: true }
    ],
    breaks: ["12:00-13:00"],
    emergencySlots: ["10:30", "13:30", "15:00", "15:30"],
    totalSlots: 17,
    bookedSlots: 8,
    availableSlots: 9
  }
};

// Historique des performances des médecins
export const mockDoctorPerformance = {
  [mockDoctorInfo.id]: {
    daily: {
      consultationsCompleted: 8,
      averageTime: 25,
      patientSatisfaction: 4.8,
      urgencyHandled: 3,
      efficiency: 92
    },
    weekly: {
      consultationsCompleted: 45,
      averageTime: 26,
      patientSatisfaction: 4.7,
      urgencyHandled: 12,
      efficiency: 89
    },
    monthly: {
      consultationsCompleted: 180,
      averageTime: 25,
      patientSatisfaction: 4.8,
      urgencyHandled: 45,
      efficiency: 91
    },
    trends: {
      efficiency: "stable",
      satisfaction: "increasing",
      consultationTime: "decreasing"
    }
  }
};

// Compétences et certifications détaillées
export const mockDoctorCompetencies = {
  [mockDoctorInfo.id]: {
    clinical: [
      {
        name: "Cardiologie interventionnelle",
        level: "Expert",
        certification: "Valide jusqu'en 2025",
        lastUpdate: "2023-01-15"
      },
      {
        name: "Urgences cardiaques",
        level: "Expert",
        certification: "ACLS - Valide jusqu'en 2024",
        lastUpdate: "2022-06-10"
      },
      {
        name: "Échographie cardiaque",
        level: "Avancé",
        certification: "ESC Guidelines",
        lastUpdate: "2023-03-20"
      }
    ],
    technical: [
      {
        name: "Système EAGLE",
        level: "Expert",
        lastTraining: "2023-01-01"
      },
      {
        name: "Télémédecine",
        level: "Avancé",
        lastTraining: "2022-11-15"
      }
    ],
    languages: [
      { name: "Français", level: "Natif" },
      { name: "Anglais", level: "Courant" },
      { name: "Allemand", level: "Intermédiaire" }
    ]
  }
};

// Feedback et évaluations patients
export const mockDoctorFeedback = {
  [mockDoctorInfo.id]: {
    recent: [
      {
        date: "2024-01-15",
        patient: "Anonyme",
        rating: 5,
        comment: "Excellent médecin, très professionnel et à l'écoute",
        category: "consultation"
      },
      {
        date: "2024-01-14",
        patient: "Anonyme",
        rating: 4,
        comment: "Bon diagnostic, explications claires",
        category: "communication"
      },
      {
        date: "2024-01-13",
        patient: "Anonyme",
        rating: 5,
        comment: "Prise en charge rapide et efficace",
        category: "rapidite"
      }
    ],
    summary: {
      totalReviews: 156,
      averageRating: 4.8,
      categories: {
        professionalism: 4.9,
        communication: 4.7,
        rapidite: 4.8,
        competence: 4.9
      }
    }
  }
};

// Utilitaires pour la gestion des médecins
export const getDoctorBySpecialty = (specialty: string) => {
  return [mockDoctorInfo, ...mockMedicalTeam].find(doctor => 
    doctor.specialty.toLowerCase() === specialty.toLowerCase()
  );
};

export const getAvailableDoctors = () => {
  return [mockDoctorInfo, ...mockMedicalTeam].filter(doctor => 
    doctor.currentStatus?.available !== false
  );
};

export const getDoctorWorkload = (doctorId: string): 'low' | 'normal' | 'high' | 'overloaded' => {
  const doctor = [mockDoctorInfo, ...mockMedicalTeam].find(d => d.id === doctorId);
  return doctor?.currentStatus?.workload || 'normal';
};

export const getDoctorNextAvailableSlot = (doctorId: string): string => {
  const schedule = mockDoctorSchedules[doctorId];
  if (!schedule) return "Non disponible";
  
  const now = new Date();
  const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  const nextSlot = schedule.slots.find(slot => 
    slot.available && slot.time > currentTime
  );
  
  return nextSlot ? nextSlot.time : "Aucun créneau disponible";
};

export const calculateDoctorEfficiency = (doctorId: string): number => {
  const performance = mockDoctorPerformance[doctorId];
  if (!performance) return 0;
  
  const { consultationsCompleted, averageTime } = performance.daily;
  const expectedConsultations = 12; // Nombre attendu par jour
  const expectedTime = 30; // Temps attendu par consultation
  
  const timeEfficiency = (expectedTime / averageTime) * 100;
  const volumeEfficiency = (consultationsCompleted / expectedConsultations) * 100;
  
  return Math.round((timeEfficiency + volumeEfficiency) / 2);
};

export const getDoctorSpecializations = (doctorId: string): string[] => {
  const doctor = [mockDoctorInfo, ...mockMedicalTeam].find(d => d.id === doctorId);
  return doctor?.professional?.specializations || [];
};

export const canDoctorHandleUrgency = (doctorId: string, urgencyLevel: number): boolean => {
  const doctor = [mockDoctorInfo, ...mockMedicalTeam].find(d => d.id === doctorId);
  
  if (!doctor) return false;
  if (!doctor.currentStatus?.available) return false;
  
  // Les urgences vitales (niveau 5) peuvent être prises par tous les médecins disponibles
  if (urgencyLevel >= 5) return true;
  
  // Les autres urgences selon la spécialité
  return doctor.currentStatus.workload !== 'overloaded';
};

export const getDoctorContactPreferences = (doctorId: string) => {
  const doctor = [mockDoctorInfo, ...mockMedicalTeam].find(d => d.id === doctorId);
  return doctor?.preferences?.notifications || {
    urgent: true,
    email: true,
    sms: false,
    desktop: true
  };
};