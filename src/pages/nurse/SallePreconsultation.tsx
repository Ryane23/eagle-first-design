import React, { useState, useEffect } from 'react';
import { 
Bell, Users, Clock, Calendar, FileText, Video, CheckCircle, AlertTriangle, Settings, User, RefreshCw, Wifi, WifiOff, Search, Heart, Clipboard, Edit, DoorOpen, HelpCircle, Stethoscope, Mic, Camera, Plus, Upload, Thermometer, Activity, Droplet, Monitor, Play, Check, ArrowRight, Link, Link2, MessageCircle, RotateCcw, Save, Pill, FilePlus, X, ChevronDown, ChevronUp, AlertCircle, Wind, BarChart2, Shield, Database, QrCode, Printer, ExternalLink, Zap, Home, Menu as MenuIcon
} from 'lucide-react';

// Import des composants partagés
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { ConnectionStatus } from '@common/ConnectionStatus';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import FloatingActionButton from '@buttons/FloatingActionButton';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import { StatusBadge } from '@data-display/StatusBadge';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import DynamicBadge from '@data-display/DynamicBadge';
import { PatientCard } from '@cards/PatientCard';
import { ConsultantCard } from '@cards/ConsultantCard';
import { CenterCard } from '@cards/CenterCard';
import { ActiveConsultations } from '@dashboard/ActiveConsultations';
import { DropZone } from '@dragdrop/DropZone';
import { ConsultationRooms } from '@facility/ConsultationRooms';
import { SearchInput } from '@forms/SearchInput';
import { AppointmentForm } from '@forms/AppointmentForm';
import { Modal } from '@modals/Modal';
import ExpandablePanel from '@panels/ExpandablePanel';
import { SidePanel } from '@panels/SidePanel';
import { MedicalHistory } from '@medical/MedicalHistory';
import { VitalSigns } from '@medical/VitalSigns';
import { PatientRecord } from '@medical/PatientRecord';
import PatientStatusTracker from '@medical/PatientStatusTracker';
import { WaitingQueue } from '@patient/WaitingQueue';
import { PatientDocuments } from '@documents/PatientDocuments';
import { AlertNotification } from '@feedback/AlertNotification';
import ToastNotification from '@feedback/ToastNotification';
import ChatInterface from '@communication/ChatInterface';
import ThemeSwitcher from '@common/ThemeSwitcher';
import MultiTabContainer from '@layout/MultiTabContainer';
import { ViewSelector } from '@layout/ViewSelector';

// Import des types
import { Patient, Room, Consultation, Doctor, Specialty } from '@types';

// Import des utils
import { formatWaitTime } from '@utils/statusUtils';
import { formatDateTime } from '@utils/dateUtils';
import { calculateAge } from '@calculators/medicalCalculators';

// Import des formatters
import { formatBloodPressure, formatBMI, interpretBMI } from '@formatters/medicalFormatter';
import { formatVitalSigns, formatPatientInfo } from '@formatters/preconsultationFormatters';

// Import des transformers
import { transformPatientsForCards, transformPatientForDetails } from '@transformers/patientTransformers';
import { 
  transformMockPatientToPatient, 
  transformConsultationsForDisplay,
  transformFormDataToVitalSigns,
  transformPatientForDPIExport
} from '@transformers/preconsultationTransformers';

// Import des validators
import { validatePatientForm } from '@validators/formValidators';
import { validateVitalSigns } from '@validators/medicalValidators';

// Import des constants
import { APP_NAME, URGENCY_LEVELS, PATIENT_STATUS } from '@constants';
import { COLORS } from '@constants/colors';

// Import des mocks (à remplacer par des appels API en production)
import { mockSpecialties } from '@mocks/specialties';
import { mockDoctorInfo } from '@mocks/doctors';

const SallePreconsultation = () => {
  // États
  const [darkMode, setDarkMode] = useState(false);
  const [connected, setConnected] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPoste, setSelectedPoste] = useState<Room | null>(null);
  const [assignationMode, setAssignationMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    antecedents: true,
    parametres: true,
    documents: true
  });
  
  // Données mockées avec transformation
  const specialites: Specialty[] = [
    {
      id: '1',
      name: "Cardiologie",
      patientCount: 3,
      load: 'medium',
      doctors: [
        {
          id: 'dr1',
          name: "Dr. Kouam",
          specialty: "Cardiologie",
          available: false,
          patients: 3,
          maxPatients: 5
        }
      ]
    },
    {
      id: '2',
      name: "Neurologie", 
      patientCount: 2,
      load: 'low',
      doctors: [
        {
          id: 'dr2',
          name: "Dr. Meka",
          specialty: "Neurologie",
          available: true,
          patients: 2,
          maxPatients: 4
        }
      ]
    },
    {
      id: '3',
      name: "Pédiatrie",
      patientCount: 1,
      load: 'low',
      doctors: [
        {
          id: 'dr3',
          name: "Dr. Essama",
          specialty: "Pédiatrie", 
          available: true,
          patients: 1,
          maxPatients: 3
        }
      ]
    }
  ];

  // Mock patients avec transformation vers le type Patient
  const mockPatientsData = [
    {
      id: '1',
      nom: "Mbarga Paul",
      firstName: "Paul",
      age: 58,
      sexe: "M",
      urgence: 3,
      statut: "en_preparation",
      medecin: "Dr. Kouam",
      specialite: "Cardiologie",
      antecedents: {
        medicaux: ["Hypertension artérielle (2018)", "Diabète type 2 (2015)"],
        chirurgicaux: ["Appendicectomie (2010)"],
        allergies: ["Pénicilline"],
        familiaux: ["Père: Infarctus à 62 ans"]
      }
    },
    {
      id: '2',
      nom: "Fouda Arielle",
      firstName: "Arielle", 
      age: 28,
      sexe: "F",
      urgence: 5,
      statut: "pret",
      medecin: "Dr. Kouam",
      specialite: "Cardiologie",
      antecedents: {
        medicaux: ["Asthme (2010)"],
        chirurgicaux: [],
        allergies: ["Pollen"],
        familiaux: ["Mère: Asthme"]
      }
    },
    {
      id: '3',
      nom: "Essono Marc",
      firstName: "Marc",
      age: 67,
      sexe: "M", 
      urgence: 2,
      statut: "pret",
      medecin: "Dr. Kouam",
      specialite: "Cardiologie",
      antecedents: {
        medicaux: ["Insuffisance rénale chronique (2019)"],
        chirurgicaux: ["Prothèse de hanche (2018)"],
        allergies: [],
        familiaux: []
      }
    },
    {
      id: '4',
      nom: "Ateba Samuel",
      firstName: "Samuel",
      age: 45,
      sexe: "M",
      urgence: 4,
      statut: "pret",
      medecin: "Dr. Meka",
      specialite: "Neurologie",
      antecedents: {
        medicaux: ["Épilepsie (2005)", "Migraines chroniques (2012)"],
        chirurgicaux: [],
        allergies: ["Ibuprofène"],
        familiaux: ["Sœur: Épilepsie"]
      }
    },
    {
      id: '5',
      nom: "Ngo Bassa Marie",
      firstName: "Marie",
      age: 32,
      sexe: "F",
      urgence: 2,
      statut: "en_preparation",
      medecin: "Dr. Meka",
      specialite: "Neurologie",
      antecedents: {
        medicaux: ["Sclérose en plaques (2018)"],
        chirurgicaux: [],
        allergies: [],
        familiaux: []
      }
    },
    {
      id: '6',
      nom: "Nkoa Emma",
      firstName: "Emma",
      age: 6,
      sexe: "F",
      urgence: 3,
      statut: "pret",
      medecin: "Dr. Essama",
      specialite: "Pédiatrie",
      antecedents: {
        medicaux: ["Asthme (2022)"],
        chirurgicaux: [],
        allergies: ["Arachides"],
        familiaux: ["Père: Asthme"]
      }
    }
  ];

  // Transformation des données mockées en patients typés
  const transformedPatients: Patient[] = mockPatientsData.map(mockPatient => 
    transformMockPatientToPatient(mockPatient, mockPatient.specialite, mockPatient.medecin)
  );

  // Postes de consultation disponibles
  const [postes, setPostes] = useState<Room[]>([
    { 
      id: '1', 
      name: "Salle 1", 
      equipment: "Caméra 4K", 
      doctor: "Dr. Kouam", 
      specialty: "Cardiologie", 
      active: true, 
      inConsultation: true 
    },
    { 
      id: '2', 
      name: "Salle 2", 
      equipment: "Caméra HD", 
      doctor: "Dr. Meka", 
      specialty: "Neurologie", 
      active: true, 
      inConsultation: false 
    },
    { 
      id: '3', 
      name: "Salle 3", 
      equipment: "Caméra SD", 
      doctor: "", 
      specialty: "", 
      active: true, 
      inConsultation: false 
    },
    { 
      id: '4', 
      name: "Salle 4", 
      equipment: "Caméra HD", 
      doctor: "Dr. Essama", 
      specialty: "Pédiatrie", 
      active: true, 
      inConsultation: false 
    }
  ]);
  
  // Consultations actives avec transformation
  const [consultationsActives, setConsultationsActives] = useState<Consultation[]>([
    { 
      id: '101', 
      patientId: '1',
      doctorId: 'dr1',
      roomId: '1',
      startTime: new Date(),
      status: 'active'
    }
  ]);

  const [formValues, setFormValues] = useState({
    ta_systolique: "134",
    ta_diastolique: "72",
    glycemie: "1.0",
    temperature: "37.0",
    pouls: "75",
    saturation: "98",
    taille: "172",
    poids: "68",
    motif: "",
    notes: "",
    documents: []
  });

  // Utilisation du formatter pour l'IMC
  const calculateIMC = () => {
    return formatBMI(parseFloat(formValues.poids), parseFloat(formValues.taille));
  };

  // Effet pour mettre à jour la liste des médecins en consultation
  useEffect(() => {
    // Synchroniser l'état de consultation du médecin avec l'état des postes
    const medecinsEnConsultation = postes
      .filter(p => p.inConsultation && p.doctor)
      .map(p => p.doctor);
      
    console.log("Médecins en consultation:", medecinsEnConsultation);
  }, [postes]);

  // Fonctions de gestion
  const toggleConnection = () => {
    setConnected(!connected);
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const assignerMedecin = (poste: Room, medecin: string, specialite: string) => {
    const updatedPostes = postes.map(p => {
      if (p.id === poste.id) {
        return {...p, doctor: medecin, specialty: specialite};
      }
      return p;
    });
    setPostes(updatedPostes);
    setAssignationMode(false);
    alert(`${medecin} assigné à ${poste.name}`);
  };

  const gererPoste = (poste: Room) => {
    setSelectedPoste(poste);
    setAssignationMode(true);
  };

  const selectPatient = (patient: any, medecin: string, specialite: string) => {
    // Transformation du patient sélectionné
    const transformedPatient = transformMockPatientToPatient(
      {...patient, medecin, specialite}, 
      specialite, 
      medecin
    );
    setSelectedPatient(transformedPatient);
    
    // Pré-remplir le formulaire avec les données du patient
    if (patient.parametres) {
      setFormValues({
        ...formValues,
        ...patient.parametres
      });
    }
  };

  const admettrePatient = (patient: any, medecin: string, specialite: string, medecinEnConsultation: boolean) => {
    // Vérifier si le médecin est déjà en consultation
    if (medecinEnConsultation) {
      alert(`${medecin} est déjà en consultation. Veuillez attendre qu'il termine la consultation en cours.`);
      return;
    }
    
    const posteDisponible = postes.find(p => p.doctor === medecin && !p.inConsultation);
    
    if (!posteDisponible) {
      alert(`Aucun poste disponible pour ${medecin}`);
      return;
    }
    
    // Marquer le poste comme étant en consultation
    const updatedPostes = postes.map(p => {
      if (p.id === posteDisponible.id) {
        return {...p, inConsultation: true};
      }
      return p;
    });
    
    setPostes(updatedPostes);
    alert(`Patient ${patient.nom} admis en salle ${posteDisponible.name} avec ${medecin}`);
  };

  const demarrerConsultation = () => {
    if (!selectedPatient) {
      alert("Veuillez sélectionner un patient d'abord");
      return;
    }
    
    const posteDisponible = postes.find(p => 
      p.doctor === selectedPatient.doctor && 
      p.active && 
      !p.inConsultation
    );
    
    if (!posteDisponible) {
      alert(`Aucun poste disponible pour ${selectedPatient.doctor}`);
      return;
    }
    
    // Validation des données vitales avant démarrage
    const vitalSignsData = transformFormDataToVitalSigns(formValues);
    const validation = validateVitalSigns(vitalSignsData);
    
    if (!validation.isValid) {
      alert(`Erreurs dans les signes vitaux: ${validation.errors.join(', ')}`);
      return;
    }
    
    // Simuler le démarrage d'une consultation
    alert(`Démarrage de la consultation pour ${selectedPatient.name} avec ${selectedPatient.doctor} dans ${posteDisponible.name}`);
    alert("Test technique réussi !");
    
    // Ajouter aux consultations actives
    const newConsultation: Consultation = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      doctorId: selectedPatient.doctor,
      roomId: posteDisponible.id,
      startTime: new Date(),
      status: 'active'
    };
    
    setConsultationsActives([...consultationsActives, newConsultation]);
    
    // Marquer le poste comme utilisé
    const updatedPostes = postes.map(p => {
      if (p.id === posteDisponible.id) {
        return {...p, inConsultation: true};
      }
      return p;
    });
    
    setPostes(updatedPostes);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    alert("Document ajouté (simulation)");
  };

  const exportToDPI = () => {
    if (!selectedPatient) {
      alert("Aucun patient sélectionné pour l'export");
      return;
    }
    
    // Utilisation du transformer pour l'export DPI
    const exportData = transformPatientForDPIExport(selectedPatient, formValues);
    console.log("Données d'export DPI:", exportData);
    alert("Données exportées vers le Dossier Patient Informatisé");
  };

  // Section des consultations actives avec transformation
  const renderConsultationsActives = () => {
    const transformedConsultations = transformConsultationsForDisplay(consultationsActives);
    
    return (
      <ActiveConsultations 
        consultations={transformedConsultations}
        compact={true}
        darkMode={darkMode}
      />
    );
  };

  // Section des patients par spécialité et médecin
  const renderPatientsSection = () => {
    // Grouper les patients par spécialité et médecin
    const patientsBySpecialtyAndDoctor = transformedPatients.reduce((acc, patient) => {
      const key = `${patient.specialty}-${patient.doctor}`;
      if (!acc[key]) {
        acc[key] = {
          specialty: patient.specialty,
          doctor: patient.doctor,
          patients: []
        };
      }
      acc[key].patients.push(patient);
      return acc;
    }, {} as Record<string, { specialty: string; doctor: string; patients: Patient[] }>);

    return (
      <div className="space-y-4 mb-4">
        {Object.values(patientsBySpecialtyAndDoctor).map((group, index) => (
          <div key={index} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
              <h3 className="font-medium flex items-center">
                {group.specialty === 'Cardiologie' ? (
                  <Heart className="h-4 w-4 mr-2" />
                ) : group.specialty === 'Pédiatrie' ? (
                  <User className="h-4 w-4 mr-2" />
                ) : (
                  <Stethoscope className="h-4 w-4 mr-2" />
                )}
                {group.specialty}
              </h3>
            </div>
            
            <div className="p-3">
              <div className="font-medium mb-2 flex items-center">
                <span>{group.doctor}</span>
                {postes.some(p => p.doctor === group.doctor && p.inConsultation) && (
                  <StatusBadge 
                    type="warning"
                    label="En consultation"
                    rounded="full"
                  />
                )}
              </div>
              
              {/* Patients prêts */}
              {group.patients.filter(p => p.status === 'ready').length > 0 && (
                <div className="mb-3">
                  <div className={`text-xs font-medium mb-1 flex items-center ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Patients prêts
                  </div>
                  
                  <div className="space-y-2">
                    {group.patients
                      .filter(p => p.status === 'ready')
                      .map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={{
                            ...patient,
                            center: "Clinique Yaoundé Sud",
                            waitTime: 15, // Utilisation du formatWaitTime
                            arrivalTime: "10:00"
                          }}
                          darkMode={darkMode}
                          onSelect={() => selectPatient(patient, group.doctor, group.specialty)}
                          onDoctorView={() => {}}
                          onAdjustUrgency={() => {}}
                          onMoreOptions={() => {}}
                        />
                      ))}
                  </div>
                </div>
              )}
              
              {/* Patients en préparation */}
              {group.patients.filter(p => p.status === 'in_preparation').length > 0 && (
                <div>
                  <div className={`text-xs font-medium mb-1 flex items-center ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    <Clipboard className="h-3 w-3 mr-1" />
                    En préparation
                  </div>
                  
                  <div className="space-y-2">
                    {group.patients
                      .filter(p => p.status === 'in_preparation')
                      .map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={{
                            ...patient,
                            center: "Clinique Yaoundé Sud",
                            waitTime: 10,
                            arrivalTime: "09:45"
                          }}
                          darkMode={darkMode}
                          onSelect={() => selectPatient(patient, group.doctor, group.specialty)}
                          onDoctorView={() => {}}
                          onAdjustUrgency={() => {}}
                          onMoreOptions={() => {}}
                        />
                      ))}
                  </div>
                </div>
              )}
              
              {group.patients.length === 0 && (
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aucun patient pour ce médecin aujourd'hui
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Section des postes (partie gauche)
  const renderPostesSection = () => (
    <ConsultationRooms
      rooms={postes}
      onRoomClick={(room) => {}}
      onAssignDoctor={(room, doctor, specialty) => assignerMedecin(room, doctor, specialty)}
      onStartConsultation={(room) => {}}
      onEndConsultation={(room) => {}}
      onToggleActive={(room) => {}}
      specializationOptions={{
        doctors: specialites.flatMap(s => s.doctors.map(d => ({
          id: d.id,
          name: d.name,
          specialty: d.specialty
        }))),
        specialties: specialites.map(s => s.name)
      }}
      darkMode={darkMode}
    />
  );

  // Section de préparation (partie droite)
  const renderPreparationSection = () => (
    <div className="space-y-4">
      {selectedPatient ? (
        <PatientRecord 
          patient={{
            ...selectedPatient,
            vitalSigns: transformFormDataToVitalSigns(formValues),
            medicalHistory: selectedPatient.medicalHistory,
            consultationReason: formValues.motif,
            documents: formValues.documents,
            notes: formValues.notes
          }}
          onUpdate={(updatedPatient) => {
            // Mise à jour des valeurs du formulaire
            if (updatedPatient.vitalSigns) {
              const bp = updatedPatient.vitalSigns.bloodPressure?.split('/') || ['', ''];
              setFormValues({
                ...formValues,
                ta_systolique: bp[0] || formValues.ta_systolique,
                ta_diastolique: bp[1] || formValues.ta_diastolique,
                pouls: updatedPatient.vitalSigns.heartRate?.toString() || formValues.pouls,
                temperature: updatedPatient.vitalSigns.temperature?.toString() || formValues.temperature,
                saturation: updatedPatient.vitalSigns.oxygenSaturation?.toString() || formValues.saturation,
                poids: updatedPatient.vitalSigns.weight?.toString() || formValues.poids,
                taille: updatedPatient.vitalSigns.height?.toString() || formValues.taille,
                glycemie: updatedPatient.vitalSigns.glycemia?.toString() || formValues.glycemie,
                motif: updatedPatient.consultationReason || formValues.motif,
                notes: updatedPatient.notes || formValues.notes,
                documents: updatedPatient.documents || formValues.documents
              });
            }
          }}
          onClose={() => setSelectedPatient(null)}
          onMarkReady={() => {
            alert(`Patient ${selectedPatient.name} marqué comme prêt`);
            setSelectedPatient(null);
          }}
          onStartConsultation={demarrerConsultation}
          sections={{
            history: true,
            vitalSigns: true,
            documents: true,
            consultationReason: true,
            notes: true
          }}
          readOnly={false}
          darkMode={darkMode}
        />
      ) : (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium flex items-center">
              <Clipboard className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
              Dossier Patient Informatisé
            </h3>
          </div>
          
          <div className="p-6 text-center">
            <User className={`h-12 w-12 mx-auto mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Sélectionnez un patient pour commencer sa préparation
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Configuration des éléments de sidebar
  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Tableau de bord",
      path: "/dashboard",
      isActive: false
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Rendez-vous",
      path: "/appointments",
      isActive: false
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Gestion des Urgences",
      path: "/urgencies",
      isActive: false
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      label: "Pré-consultation",
      path: "/pre-consultation",
      isActive: true
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Post-consultation",
      path: "/post-consultation",
      isActive: false
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Monitoring",
      path: "/monitoring",
      isActive: false
    },
    {
      icon: <WifiOff className="h-5 w-5" />,
      label: "Mode hors ligne",
      path: "/offline-mode",
      isActive: false
    }
  ];

  const bottomMenuItems = [
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Aide",
      path: "/help"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Paramètres",
      path: "/settings"
    }
  ];

  // Construction de l'interface complète
  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Barre de navigation latérale */}
      <div className={`w-16 md:w-56 flex-shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-full flex flex-col`}>
        {/* Logo et toggle */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          <span className="font-bold text-lg text-blue-600">{APP_NAME}</span>
          <button className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-md`}>
            <MenuIcon size={18} />
          </button>
        </div>
        
        {/* Menu Items */}
        <SidebarSection navCollapsed={false} darkMode={darkMode}>
          {menuItems.map((item, index) => (
            <SidebarItem 
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              navCollapsed={false}
              darkMode={darkMode}
              href={item.path}
            />
          ))}
        </SidebarSection>
        
        {/* Bottom menu */}
        <SidebarSection 
          navCollapsed={false} 
          darkMode={darkMode} 
          isBottomSection={true}
        >
          {bottomMenuItems.map((item, index) => (
            <SidebarItem 
              key={index}
              icon={item.icon}
              label={item.label}
              navCollapsed={false}
              darkMode={darkMode}
              href={item.path}
            />
          ))}
        </SidebarSection>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <Header
          title="Salle de Préconsultation"
          subtitle="Centre Secondaire"
          centerInfo={{
            name: "Clinique Yaoundé Sud",
            code: "CYS",
            type: "Centre Secondaire"
          }}
          isOnline={connected}
          bandwidth={3.8}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{
            initials: "AB",
            name: "Anne Biyongo"
          }}
          notificationCount={3}
          extraHeaderItems={
            <button 
              className={`text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} px-3 py-1 rounded-lg flex items-center`}
              onClick={toggleConnection}
            >
              {connected ? <WifiOff className="h-4 w-4 mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              {connected ? 'Simuler perte connexion' : 'Reconnexion'}
            </button>
          }
        />
        
        {/* Indicateur mode hors ligne */}
        {!connected && (
          <AlertNotification
            message="Les données sont stockées localement et seront synchronisées automatiquement une fois la connexion rétablie."
            type="error"
            isVisible={!connected}
            position="top-center"
            darkMode={darkMode}
          />
        )}
        
        {/* Contenu principal */}
        <div className="p-4">
          {/* Encadré des consultations actives */}
          {renderConsultationsActives()}
          
          {/* Contenu avec deux colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Colonne de gauche */}
            <div>
              {/* Liste des patients d'abord */}
              {!selectedPatient && renderPatientsSection()}
              
              {/* Section des postes ensuite */}
              {renderPostesSection()}
            </div>
            
            {/* Colonne de droite (2/3) */}
            <div className="lg:col-span-2">
              {renderPreparationSection()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouton d'assistance flottant */}
      <FloatingActionButton
        mainIcon={<HelpCircle className="h-6 w-6" />}
        position="bottom-right"
        color="blue"
        size="large"
      />
      
      {/* Bouton messages flottant */}
      <div className="fixed bottom-6 left-20 md:left-64">
        <button className={`${
          darkMode ? 'bg-purple-900 text-purple-300 hover:bg-purple-800' : 'bg-purple-600 text-white hover:bg-purple-700'
        } rounded-full p-3 shadow-lg transition-colors duration-300 relative`}>
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
        </button>
      </div>
      
      {/* Barre d'outils flottante */}
      <div className="fixed top-1/2 transform -translate-y-1/2 right-6">
        <div className={`flex flex-col space-y-2 p-2 rounded-lg shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Scanner code QR"
          >
            <QrCode className="h-5 w-5" />
          </button>
          
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Prendre une photo"
          >
            <Camera className="h-5 w-5" />
          </button>
          
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Imprimer documents"
          >
            <Printer className="h-5 w-5" />
          </button>
          
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Test de connexion"
          >
            <Zap className="h-5 w-5" />
          </button>
          
          <button 
            className={`p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            title="Exporter vers DPI"
            onClick={exportToDPI}
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SallePreconsultation;