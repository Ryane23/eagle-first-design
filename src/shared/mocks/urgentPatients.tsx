export const mockUrgentPatients = [
  {
    id: 4,
    name: "Robert Mbarga",
    age: 68,
    gender: "M",
    urgency: 5,
    waitTime: 2,
    position: 1,
    appointment: "10:00",
    status: "ready",
    specialty: "Cardiologie",
    lastModified: "09:30",
    clinicCode: "CM-KRI",
    clinicName: "Clinique Moderne - Kribi",
    doctor: "Dr. Kouam",
    arrivalTime: "09:30",
    notes: "Douleur thoracique aigüe avec irradiation dans le bras gauche, suspicion d'infarctus",
    reason: "Douleur thoracique aigüe",
    phone: "+237 677 456 789",
    email: "robert.mbarga@email.com",
    vitalSigns: {
      bloodPressure: "180/110",
      heartRate: 95,
      temperature: 37.2,
      oxygenSaturation: 96
    },
    medicalHistory: [
      "Hypertension artérielle",
      "Diabète type 2",
      "Antécédents familiaux de maladie cardiaque"
    ],
    currentMedications: [
      "Lisinopril 10mg - 1x/jour",
      "Metformine 500mg - 2x/jour",
      "Aspirine 75mg - 1x/jour"
    ],
    allergies: ["Pénicilline", "Iode"],
    emergencyContact: {
      name: "Marie Mbarga",
      relation: "Épouse",
      phone: "+237 690 123 456",
      email: "marie.mbarga@email.com"
    },
    insurance: {
      provider: "CNPS",
      number: "12345678901",
      type: "Régime général"
    },
    room: null,
    bed: null,
    previousLocation: null,
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 3,
    name: "Jeanne Atangana",
    age: 33,
    gender: "F",
    urgency: 4,
    waitTime: 5,
    position: 2,
    appointment: "10:15",
    status: "in_preparation",
    specialty: "Cardiologie",
    lastModified: "09:50",
    clinicCode: "CSJ-YDE",
    clinicName: "Clinique Saint Jean - Yaoundé",
    doctor: "Dr. Kouam",
    arrivalTime: "09:45",
    notes: "Tension artérielle élevée (160/95), céphalées intenses, patiente enceinte 32 semaines",
    reason: "Hypertension gravidique",
    phone: "+237 690 987 654",
    email: "jeanne.atangana@email.com",
    vitalSigns: {
      bloodPressure: "160/95",
      heartRate: 88,
      temperature: 36.8,
      oxygenSaturation: 98
    },
    medicalHistory: [
      "Grossesse en cours - 32 semaines",
      "Hypertension gravidique",
      "Primigeste"
    ],
    currentMedications: [
      "Vitamines prénatales",
      "Fer 65mg - 1x/jour",
      "Acide folique 5mg - 1x/jour"
    ],
    allergies: [],
    emergencyContact: {
      name: "Paul Atangana",
      relation: "Mari",
      phone: "+237 677 987 654",
      email: "paul.atangana@email.com"
    },
    insurance: {
      provider: "CNAMGS",
      number: "98765432109",
      type: "Assurance maternité"
    },
    room: "Préparation A",
    bed: null,
    previousLocation: "Accueil",
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 1,
    name: "Marie Ekambi",
    age: 8,
    gender: "F",
    urgency: 3,
    waitTime: 15,
    position: 3,
    appointment: "10:30",
    status: "waiting",
    specialty: "Pédiatrie",
    lastModified: "09:15",
    clinicCode: "CM-LIM",
    clinicName: "Centre Médical - Limbé",
    doctor: "Dr. Kouam",
    arrivalTime: "09:15",
    notes: "Fièvre élevée persistante depuis 2 jours, irritabilité, refus alimentaire",
    reason: "Syndrome fébrile",
    phone: "+237 695 321 789",
    email: null,
    vitalSigns: {
      bloodPressure: "90/60",
      heartRate: 120,
      temperature: 39.1,
      oxygenSaturation: 97
    },
    medicalHistory: [
      "Asthme léger",
      "Allergies alimentaires (arachides)",
      "Vaccination à jour"
    ],
    currentMedications: [
      "Ventoline - au besoin",
      "Paracétamol 250mg - si fièvre"
    ],
    allergies: [
      "Arachides",
      "Fruits à coque"
    ],
    emergencyContact: {
      name: "Claudine Ekambi",
      relation: "Mère",
      phone: "+237 695 321 789",
      email: "claudine.ekambi@email.com"
    },
    insurance: {
      provider: "Mutuelle familiale",
      number: "56789012345",
      type: "Couverture pédiatrique"
    },
    room: null,
    bed: null,
    previousLocation: null,
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 2,
    name: "Claude Bekolo",
    age: 52,
    gender: "M",
    urgency: 2,
    waitTime: 30,
    position: 4,
    appointment: "11:00",
    status: "ready",
    specialty: "Médecine générale",
    lastModified: "08:45",
    clinicCode: "CP-DLA",
    clinicName: "Centre Principal - Douala",
    doctor: "Dr. Kouam",
    arrivalTime: "08:45",
    notes: "Douleur abdominale modérée épigastrique, amélioration après traitement antiacide",
    reason: "Douleur abdominale",
    phone: "+237 678 456 123",
    email: "claude.bekolo@email.com",
    vitalSigns: {
      bloodPressure: "130/80",
      heartRate: 72,
      temperature: 36.5,
      oxygenSaturation: 99
    },
    medicalHistory: [
      "Ulcère gastroduodénal",
      "Reflux gastro-œsophagien",
      "Tabagisme sevré depuis 2 ans"
    ],
    currentMedications: [
      "Oméprazole 20mg - 1x/jour",
      "Domperidone 10mg - avant repas"
    ],
    allergies: [],
    emergencyContact: {
      name: "Sophie Bekolo",
      relation: "Fille",
      phone: "+237 678 456 123",
      email: "sophie.bekolo@email.com"
    },
    insurance: {
      provider: "Assurance privée",
      number: "34567890123",
      type: "Couverture complète"
    },
    room: "Consultation 2",
    bed: null,
    previousLocation: "Salle d'attente",
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 5,
    name: "Paul Tamba",
    age: 42,
    gender: "M",
    urgency: 3,
    waitTime: 20,
    position: 5,
    appointment: "11:15",
    status: "waiting",
    specialty: "Pneumologie",
    lastModified: "09:05",
    clinicCode: "CSJ-YDE",
    clinicName: "Clinique Saint Jean - Yaoundé",
    doctor: "Dr. Kouam",
    arrivalTime: "09:05",
    notes: "Essoufflement progressif depuis 1 semaine, toux sèche persistante, antécédents de tabagisme",
    reason: "Dyspnée d'effort",
    phone: "+237 699 654 321",
    email: "paul.tamba@email.com",
    vitalSigns: {
      bloodPressure: "140/85",
      heartRate: 85,
      temperature: 36.9,
      oxygenSaturation: 94
    },
    medicalHistory: [
      "Tabagisme actif - 20 paquets-années",
      "BPCO légère diagnostiquée en 2022",
      "Bronchite chronique"
    ],
    currentMedications: [
      "Salbutamol - 2 bouffées si besoin",
      "Tiotropium 18mcg - 1x/jour",
      "Prednisolone 5mg - en cas d'exacerbation"
    ],
    allergies: [
      "Sulfamides",
      "Latex"
    ],
    emergencyContact: {
      name: "Rose Tamba",
      relation: "Épouse",
      phone: "+237 699 654 321",
      email: "rose.tamba@email.com"
    },
    insurance: {
      provider: "CNPS",
      number: "78901234567",
      type: "Régime salarié"
    },
    room: null,
    bed: null,
    previousLocation: null,
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 6,
    name: "Sophie Ndom",
    age: 27,
    gender: "F",
    urgency: 4,
    waitTime: 8,
    position: 6,
    appointment: "10:45",
    status: "ready",
    specialty: "Dermatologie",
    lastModified: "09:40",
    clinicCode: "CP-DLA",
    clinicName: "Centre Principal - Douala",
    doctor: "Dr. Kouam",
    arrivalTime: "09:40",
    notes: "Éruption cutanée généralisée apparue brutalement, démangeaisons sévères, suspicion d'allergie médicamenteuse",
    reason: "Éruption cutanée aiguë",
    phone: "+237 691 234 567",
    email: "sophie.ndom@email.com",
    vitalSigns: {
      bloodPressure: "110/70",
      heartRate: 78,
      temperature: 37.0,
      oxygenSaturation: 99
    },
    medicalHistory: [
      "Allergies médicamenteuses suspectées",
      "Eczéma dans l'enfance",
      "Rhinite allergique saisonnière"
    ],
    currentMedications: [
      "Cétirizine 10mg - 1x/jour",
      "Cortisone topique - application locale"
    ],
    allergies: [
      "Pénicilline (suspectée)",
      "Aspirine (suspectée)",
      "Inconnu - en cours d'investigation"
    ],
    emergencyContact: {
      name: "Michel Ndom",
      relation: "Frère",
      phone: "+237 691 234 567",
      email: "michel.ndom@email.com"
    },
    insurance: {
      provider: "Mutuelle étudiante",
      number: "90123456789",
      type: "Couverture de base"
    },
    room: "Consultation 1",
    bed: null,
    previousLocation: "Accueil",
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 7,
    name: "Thomas Ebogo",
    age: 75,
    gender: "M",
    urgency: 3,
    waitTime: 35,
    position: 7,
    appointment: "11:30",
    status: "waiting",
    specialty: "Cardiologie",
    lastModified: "08:30",
    clinicCode: "CM-KRI",
    clinicName: "Clinique Moderne - Kribi",
    doctor: "Dr. Kouam",
    arrivalTime: "08:30",
    notes: "Fatigue intense, essoufflement à l'effort, œdèmes des membres inférieurs",
    reason: "Insuffisance cardiaque décompensée",
    phone: "+237 677 890 123",
    email: null,
    vitalSigns: {
      bloodPressure: "150/90",
      heartRate: 92,
      temperature: 36.7,
      oxygenSaturation: 95
    },
    medicalHistory: [
      "Insuffisance cardiaque chronique",
      "Fibrillation auriculaire",
      "Hypertension artérielle",
      "Diabète type 2"
    ],
    currentMedications: [
      "Furosémide 40mg - 1x/jour",
      "Lisinopril 5mg - 1x/jour",
      "Bisoprolol 2,5mg - 1x/jour",
      "Warfarine 5mg - selon INR"
    ],
    allergies: [],
    emergencyContact: {
      name: "Catherine Ebogo",
      relation: "Fille",
      phone: "+237 695 678 901",
      email: "catherine.ebogo@email.com"
    },
    insurance: {
      provider: "CNPS retraité",
      number: "23456789012",
      type: "Régime retraite"
    },
    room: null,
    bed: null,
    previousLocation: null,
    completedTime: null,
    treatmentTime: null
  },
  {
    id: 8,
    name: "Aisha Mohamadou",
    age: 29,
    gender: "F",
    urgency: 5,
    waitTime: 1,
    position: 8,
    appointment: "10:00",
    status: "in_preparation",
    specialty: "Gynécologie",
    lastModified: "09:55",
    clinicCode: "CSJ-YDE",
    clinicName: "Clinique Saint Jean - Yaoundé",
    doctor: "Dr. Kouam",
    arrivalTime: "09:55",
    notes: "Saignements vaginaux abondants, grossesse 12 semaines, suspicion de fausse couche",
    reason: "Hémorragie génitale",
    phone: "+237 678 345 612",
    email: "aisha.mohamadou@email.com",
    vitalSigns: {
      bloodPressure: "100/65",
      heartRate: 110,
      temperature: 36.8,
      oxygenSaturation: 97
    },
    medicalHistory: [
      "Grossesse actuelle - 12 semaines",
      "Antécédent de fausse couche précoce",
      "Anémie ferriprive"
    ],
    currentMedications: [
      "Acide folique 5mg - 1x/jour",
      "Fer 65mg - 2x/jour",
      "Vitamines prénatales"
    ],
    allergies: [],
    emergencyContact: {
      name: "Ibrahim Mohamadou",
      relation: "Mari",
      phone: "+237 699 876 543",
      email: "ibrahim.mohamadou@email.com"
    },
    insurance: {
      provider: "CNAMGS",
      number: "45678901234",
      type: "Assurance maternité"
    },
    room: "Urgences gynéco",
    bed: "Lit 3",
    previousLocation: "Accueil",
    completedTime: null,
    treatmentTime: null
  }
];

// Données de patients pour différents scenarios de test
export const mockPatientsScenarios = {
  // Scenario de surcharge
  overloaded: [
    ...mockUrgentPatients,
    {
      id: 9,
      name: "Jean Nkomo",
      age: 45,
      gender: "M",
      urgency: 4,
      waitTime: 25,
      status: "waiting",
      specialty: "Cardiologie",
      clinicCode: "CP-DLA",
      clinicName: "Centre Principal - Douala",
      doctor: "Dr. Kouam",
      arrivalTime: "09:20",
      notes: "Douleurs thoraciques atypiques"
    },
    {
      id: 10,
      name: "Grace Muna",
      age: 65,
      gender: "F",
      urgency: 3,
      waitTime: 40,
      status: "waiting",
      specialty: "Médecine générale",
      clinicCode: "CSJ-YDE",
      clinicName: "Clinique Saint Jean - Yaoundé",
      doctor: "Dr. Kouam",
      arrivalTime: "09:00",
      notes: "Malaise général, vertiges"
    }
  ],

  // Scenario critique (nombreuses urgences vitales)
  critical: [
    ...mockUrgentPatients.map(p => 
      p.urgency >= 4 ? { ...p, urgency: 5 } : p
    )
  ],

  // Scenario normal (peu d'urgences)
  normal: mockUrgentPatients.filter(p => p.urgency <= 3),

  // Scenario pédiatrique
  pediatric: [
    ...mockUrgentPatients.filter(p => p.age < 18),
    {
      id: 11,
      name: "Kevin Essomba",
      age: 3,
      gender: "M",
      urgency: 4,
      waitTime: 10,
      status: "ready",
      specialty: "Pédiatrie",
      clinicCode: "CM-LIM",
      clinicName: "Centre Médical - Limbé",
      doctor: "Dr. Kouam",
      arrivalTime: "09:30",
      notes: "Détresse respiratoire, bronchiolite suspectée"
    }
  ],

  // Scenario gériatrique
  geriatric: [
    ...mockUrgentPatients.filter(p => p.age >= 65),
    {
      id: 12,
      name: "Martin Olama",
      age: 82,
      gender: "M",
      urgency: 3,
      waitTime: 45,
      status: "waiting",
      specialty: "Médecine générale",
      clinicCode: "CP-DLA",
      clinicName: "Centre Principal - Douala",
      doctor: "Dr. Kouam",
      arrivalTime: "08:15",
      notes: "Confusion, déshydratation, polypathologies"
    }
  ]
};

// Générateur de patients aléatoires pour les tests
export const generateRandomPatient = (id: number = Date.now()): any => {
  const names = [
    "Jean Mballa", "Marie Fouda", "Paul Nkomo", "Grace Ateba",
    "Pierre Essomba", "Sophie Biya", "Claude Manga", "Rose Ebolo"
  ];
  
  const specialties = [
    "Cardiologie", "Pédiatrie", "Pneumologie", "Dermatologie",
    "Médecine générale", "Neurologie", "Gynécologie"
  ];
  
  const clinics = [
    { code: "CP-DLA", name: "Centre Principal - Douala" },
    { code: "CSJ-YDE", name: "Clinique Saint Jean - Yaoundé" },
    { code: "CM-LIM", name: "Centre Médical - Limbé" },
    { code: "CM-KRI", name: "Clinique Moderne - Kribi" }
  ];
  
  const statuses = ["waiting", "in_preparation", "ready"];
  
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomSpecialty = specialties[Math.floor(Math.random() * specialties.length)];
  const randomClinic = clinics[Math.floor(Math.random() * clinics.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const age = Math.floor(Math.random() * 80) + 1;
  const urgency = Math.floor(Math.random() * 5) + 1;
  const waitTime = Math.floor(Math.random() * 60);
  
  const arrivalTime = new Date();
  arrivalTime.setMinutes(arrivalTime.getMinutes() - waitTime);
  
  return {
    id,
    name: randomName,
    age,
    gender: Math.random() > 0.5 ? "M" : "F",
    urgency,
    waitTime,
    position: Math.floor(Math.random() * 10) + 1,
    appointment: new Date(Date.now() + Math.random() * 4 * 60 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    status: randomStatus,
    specialty: randomSpecialty,
    lastModified: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    clinicCode: randomClinic.code,
    clinicName: randomClinic.name,
    doctor: "Dr. Kouam",
    arrivalTime: arrivalTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    notes: "Patient généré automatiquement pour les tests",
    reason: "Consultation de routine"
  };
};

// Utilitaires pour la gestion des patients
export const getPatientsByUrgency = (urgencyLevel: number) => {
  return mockUrgentPatients.filter(patient => patient.urgency === urgencyLevel);
};

export const getPatientsByStatus = (status: string) => {
  return mockUrgentPatients.filter(patient => patient.status === status);
};

export const getPatientsBySpecialty = (specialty: string) => {
  return mockUrgentPatients.filter(patient => patient.specialty === specialty);
};

export const getPatientsByCenter = (centerCode: string) => {
  return mockUrgentPatients.filter(patient => patient.clinicCode === centerCode);
};

export const getOverduePatients = () => {
  const urgencyThresholds = {
    1: 120, 2: 60, 3: 30, 4: 15, 5: 5
  };
  
  return mockUrgentPatients.filter(patient => {
    const maxWaitTime = urgencyThresholds[patient.urgency] || 30;
    return patient.waitTime > maxWaitTime;
  });
};

export const getCriticalPatients = () => {
  return mockUrgentPatients.filter(patient => 
    patient.urgency >= 5 || 
    (patient.urgency >= 4 && patient.waitTime > 20) ||
    (patient.vitalSigns && (
      patient.vitalSigns.oxygenSaturation < 90 ||
      patient.vitalSigns.temperature > 39 ||
      patient.vitalSigns.temperature < 35
    ))
  );
};