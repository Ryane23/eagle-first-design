import { mockPatients } from '@mocks/patients';

export interface MockDoctor {
  nom: string;
  enConsultation: boolean;
  patients: any[];
}

export interface MockSpecialty {
  nom: string;
  medecins: MockDoctor[];
}

// Données mockées des patients étendues avec antécédents
const patientsWithHistory = [
  {
    id: "1",
    name: "Mbarga Paul",
    firstName: "Paul",
    age: 58,
    gender: "M" as const,
    urgencyLevel: 3 as const,
    status: "ready" as const,
    specialty: "Cardiologie",
    antecedents: {
      medicaux: ["Hypertension artérielle (2018)", "Diabète type 2 (2015)"],
      chirurgicaux: ["Appendicectomie (2010)"],
      allergies: ["Pénicilline"],
      familiaux: ["Père: Infarctus à 62 ans"]
    },
    vitalSigns: {
      bloodPressure: "145/85",
      heartRate: "78",
      temperature: "36.8",
      oxygenSaturation: "97"
    }
  },
  {
    id: "2",
    name: "Fouda Arielle",
    firstName: "Arielle",
    age: 28,
    gender: "F" as const,
    urgencyLevel: 5 as const,
    status: "ready" as const,
    specialty: "Cardiologie",
    antecedents: {
      medicaux: ["Asthme (2010)"],
      chirurgicaux: [],
      allergies: ["Pollen"],
      familiaux: ["Mère: Asthme"]
    },
    vitalSigns: {
      bloodPressure: "120/75",
      heartRate: "95",
      temperature: "37.2",
      oxygenSaturation: "96"
    }
  },
  {
    id: "3",
    name: "Essono Marc",
    firstName: "Marc",
    age: 67,
    gender: "M" as const,
    urgencyLevel: 2 as const,
    status: "ready" as const,
    specialty: "Cardiologie",
    antecedents: {
      medicaux: ["Insuffisance rénale chronique (2019)"],
      chirurgicaux: ["Prothèse de hanche (2018)"],
      allergies: [],
      familiaux: []
    },
    vitalSigns: {
      bloodPressure: "130/80",
      heartRate: "72",
      temperature: "36.5",
      oxygenSaturation: "98"
    }
  },
  {
    id: "4",
    name: "Ateba Samuel",
    firstName: "Samuel",
    age: 45,
    gender: "M" as const,
    urgencyLevel: 4 as const,
    status: "ready" as const,
    specialty: "Neurologie",
    antecedents: {
      medicaux: ["Épilepsie (2005)", "Migraines chroniques (2012)"],
      chirurgicaux: [],
      allergies: ["Ibuprofène"],
      familiaux: ["Sœur: Épilepsie"]
    },
    vitalSigns: {
      bloodPressure: "140/90",
      heartRate: "85",
      temperature: "36.9",
      oxygenSaturation: "98"
    }
  },
  {
    id: "5",
    name: "Ngo Bassa Marie",
    firstName: "Marie",
    age: 32,
    gender: "F" as const,
    urgencyLevel: 2 as const,
    status: "in_preparation" as const,
    specialty: "Neurologie",
    antecedents: {
      medicaux: ["Sclérose en plaques (2018)"],
      chirurgicaux: [],
      allergies: [],
      familiaux: []
    },
    vitalSigns: {
      bloodPressure: "115/70",
      heartRate: "68",
      temperature: "36.6",
      oxygenSaturation: "99"
    }
  },
  {
    id: "6",
    name: "Nkoa Emma",
    firstName: "Emma",
    age: 6,
    gender: "F" as const,
    urgencyLevel: 3 as const,
    status: "ready" as const,
    specialty: "Pédiatrie",
    antecedents: {
      medicaux: ["Asthme (2022)"],
      chirurgicaux: [],
      allergies: ["Arachides"],
      familiaux: ["Père: Asthme"]
    },
    vitalSigns: {
      bloodPressure: "95/60",
      heartRate: "95",
      temperature: "37.1",
      oxygenSaturation: "97"
    }
  },
  {
    id: "7",
    name: "Tchoumi Jean",
    firstName: "Jean",
    age: 42,
    gender: "M" as const,
    urgencyLevel: 1 as const,
    status: "waiting" as const,
    specialty: "Médecine Générale",
    antecedents: {
      medicaux: [],
      chirurgicaux: [],
      allergies: [],
      familiaux: []
    },
    vitalSigns: {
      bloodPressure: "125/75",
      heartRate: "70",
      temperature: "36.7",
      oxygenSaturation: "98"
    }
  },
  {
    id: "8",
    name: "Owona Fatima",
    firstName: "Fatima",
    age: 29,
    gender: "F" as const,
    urgencyLevel: 3 as const,
    status: "in_preparation" as const,
    specialty: "Gynécologie",
    antecedents: {
      medicaux: ["Anémie (2020)"],
      chirurgicaux: [],
      allergies: ["Latex"],
      familiaux: ["Mère: Cancer du sein"]
    },
    vitalSigns: {
      bloodPressure: "110/70",
      heartRate: "75",
      temperature: "36.8",
      oxygenSaturation: "98"
    }
  }
];

// Configuration des spécialités avec médecins et patients
export const mockSpecialties: MockSpecialty[] = [
  {
    nom: "Cardiologie",
    medecins: [
      {
        nom: "Dr. Kouam",
        enConsultation: true,
        patients: patientsWithHistory.filter(p => p.specialty === "Cardiologie")
      }
    ]
  },
  {
    nom: "Neurologie",
    medecins: [
      {
        nom: "Dr. Meka",
        enConsultation: false,
        patients: patientsWithHistory.filter(p => p.specialty === "Neurologie")
      }
    ]
  },
  {
    nom: "Pédiatrie",
    medecins: [
      {
        nom: "Dr. Essama",
        enConsultation: false,
        patients: patientsWithHistory.filter(p => p.specialty === "Pédiatrie")
      }
    ]
  },
  {
    nom: "Médecine Générale",
    medecins: [
      {
        nom: "Dr. Beyala",
        enConsultation: false,
        patients: patientsWithHistory.filter(p => p.specialty === "Médecine Générale")
      },
      {
        nom: "Dr. Mballa",
        enConsultation: true,
        patients: []
      }
    ]
  },
  {
    nom: "Gynécologie",
    medecins: [
      {
        nom: "Dr. Ngo Bala",
        enConsultation: false,
        patients: patientsWithHistory.filter(p => p.specialty === "Gynécologie")
      }
    ]
  },
  {
    nom: "Dermatologie",
    medecins: [
      {
        nom: "Dr. Fouda",
        enConsultation: false,
        patients: []
      }
    ]
  }
];

// Fonction utilitaire pour obtenir les patients par spécialité
export const getPatientsBySpecialty = (specialty: string) => {
  return patientsWithHistory.filter(p => p.specialty === specialty);
};

// Fonction utilitaire pour obtenir les médecins par spécialité
export const getDoctorsBySpecialty = (specialty: string) => {
  const specialite = mockSpecialties.find(s => s.nom === specialty);
  return specialite ? specialite.medecins : [];
};

// Fonction utilitaire pour obtenir le nombre total de patients
export const getTotalPatientsCount = () => {
  return mockSpecialties.reduce((total, specialty) => 
    total + specialty.medecins.reduce((medTotal, medecin) => 
      medTotal + medecin.patients.length, 0
    ), 0
  );
};

// Fonction utilitaire pour obtenir le nombre de patients par statut
export const getPatientsByStatus = (status: string) => {
  return mockSpecialties.reduce((total, specialty) => 
    total + specialty.medecins.reduce((medTotal, medecin) => 
      medTotal + medecin.patients.filter(p => p.status === status).length, 0
    ), 0
  );
};

// Fonction utilitaire pour obtenir les médecins en consultation
export const getDoctorsInConsultation = () => {
  return mockSpecialties.flatMap(specialty => 
    specialty.medecins
      .filter(medecin => medecin.enConsultation)
      .map(medecin => ({
        nom: medecin.nom,
        specialite: specialty.nom,
        patientsCount: medecin.patients.length
      }))
  );
};

// Données mockées pour les statistiques rapides
export const mockPreconsultationStats = {
  totalPatients: getTotalPatientsCount(),
  patientsEnAttente: getPatientsByStatus('waiting'),
  patientsPrets: getPatientsByStatus('ready'),
  patientsEnPreparation: getPatientsByStatus('in_preparation'),
  consultationsActives: getDoctorsInConsultation().length,
  tempsAttenteAVG: 18, // minutes
  efficacitePreparation: 85, // pourcentage
  satisfactionPatients: 4.2 // sur 5
};

export default mockSpecialties;