import React, { useState, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Moon, Sun, AlertTriangle, Wifi, WifiOff, ChevronDown, Send, ChevronRight, ArrowRight, Clock, CheckCircle, PlusCircle, RefreshCw, UserPlus, Video, Eye, Edit, UserCheck, Play, Info, List, Grid, User
} from 'lucide-react';

// Import des composants partagés (GARDÉS INTACTS)
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatCard } from '@data-display/StatCard';
import { SearchInput } from '@forms/SearchInput';
import { ViewSelector } from '@layout/ViewSelector';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import { StatusBadge } from '@data-display/StatusBadge';
import { PatientCard } from '@cards/PatientCard';
import { DropZone } from '@dragdrop/DropZone';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { ConnectionStatus } from '@common/ConnectionStatus';
import ToastNotification from '@feedback/ToastNotification';
import DynamicBadge from '@data-display/DynamicBadge';
import { AlertNotification } from '@feedback/AlertNotification';
import FilterableTable from '@data-display/FilterableTable';
import FloatingActionButton from '@buttons/FloatingActionButton';
import { PatientRecord } from '@medical/PatientRecord';
import { Modal } from '@modals/Modal';
import { SidePanel } from '@panels/SidePanel';

// Import des modules présents dans connaissance du projet
import { mockDoctorInfo } from '@mocks/doctors';
import mockNotificationsData from '@mocks/notifications';
import { formatWaitTime } from '@formatters/timeFormatter';
import { 
  sortPatientsByUrgency, 
  sortPatientsByWaitTime, 
  sortPatientsByName 
} from '@sorters/patientSorter';
import { 
  filterPatientsByUrgency, 
  filterPatientsByStatus, 
  filterPatientsBySearch 
} from '@filters/patientFilters';
import { URGENCY_LEVELS, PATIENT_STATUS } from '@constants';

const SalleAttenteVirtuelle = () => {
  // États de l'application
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate] = useState(new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  const [notifications, setNotifications] = useState(3);
  const [connected, setConnected] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('urgencyLevel');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterOptions, setFilterOptions] = useState({
    urgency: [],
    status: [],
    type: []
  });
  const [viewMode, setViewMode] = useState('cards');
  const [draggingPatient, setDraggingPatient] = useState(null);
  const [showTimings, setShowTimings] = useState(false);
  const [consultationActive, setConsultationActive] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('waitingRoom');
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  
  // Données sur les horaires et timings
  const timings = {
    ouvertureSalle: "08:00",
    debutConsultations: "09:00",
    finConsultations: "17:00",
    tempsConsultationMoyen: "20 min",
    pauseDejeuner: "12:30 - 13:30"
  };
  
  // Utilisation des données mockées partagées
  const doctorInfo = mockDoctorInfo;
  const notificationsData = mockNotificationsData;
  
  const statistiques = {
    patientsJour: 15,
    patientsArrivees: 8,
    enAttente: 8,
    consultations: 7,
    tempsAttenteMoyen: 18,
    patientsUrgents: 3
  };
  
  // Données simulées des patients
  const patientsEnAttente = [
    { 
      id: 1, 
      name: "Marie Ekambi", 
      age: 8, 
      gender: "F", 
      urgency: 3, 
      waitTime: 15, 
      specialty: "Cardiologie",
      appointmentTime: "10:30",
      status: "waiting",
      type: "followup",
      category: "arrived",
      assigned: true,
      arrivalTime: "10:15",
      doctor: "Dr. Kouam",
      motif: "Suivi post-opératoire - Insuffisance mitrale",
      vitalSigns: {
        bloodPressure: "110/70",
        heartRate: "85",
        temperature: "36.8",
        oxygenSaturation: "98"
      },
      lastVisit: "15/03/2025",
      notes: "Suivi post-opératoire - Insuffisance mitrale"
    },
    { 
      id: 2, 
      name: "Claude Bekolo", 
      age: 52, 
      gender: "M", 
      urgency: 2, 
      waitTime: 30, 
      specialty: "Cardiologie",
      appointmentTime: "11:00",
      status: "ready",
      type: "new",
      category: "assigned",
      assigned: true,
      arrivalTime: "10:25",
      doctor: "Dr. Kouam",
      motif: "Douleurs thoraciques à l'effort",
      vitalSigns: {
        bloodPressure: "142/88",
        heartRate: "78",
        temperature: "37.1",
        oxygenSaturation: "96"
      },
      lastVisit: null,
      notes: "Douleurs thoraciques à l'effort"
    },
    { 
      id: 3, 
      name: "Jeanne Atangana", 
      age: 33, 
      gender: "F", 
      urgency: 4, 
      waitTime: 5, 
      specialty: "Cardiologie",
      appointmentTime: "10:15",
      status: "in_preparation",
      type: "followup",
      category: "assigned",
      assigned: true,
      arrivalTime: "10:10",
      doctor: "Dr. Kouam",
      motif: "Contrôle tension artérielle - Hypertension artérielle",
      vitalSigns: {
        bloodPressure: "145/95",
        heartRate: "82",
        temperature: "36.6",
        oxygenSaturation: "97"
      },
      lastVisit: "01/04/2025",
      notes: "Contrôle tension artérielle - Hypertension artérielle"
    },
    {
      id: 4,
      name: "Robert Mbarga",
      age: 68,
      gender: "M",
      urgency: 5,
      waitTime: 2,
      specialty: "Cardiologie",
      appointmentTime: "10:00",
      status: "ready",
      type: "new",
      category: "assigned",
      assigned: true,
      arrivalTime: "09:58",
      doctor: "Dr. Kouam",
      motif: "Douleurs thoraciques intenses et dyspnée - Suspicion SCA",
      vitalSigns: {
        bloodPressure: "160/100",
        heartRate: "110",
        temperature: "37.2",
        oxygenSaturation: "94"
      },
      lastVisit: null,
      notes: "Douleurs thoraciques intenses et dyspnée - Suspicion SCA"
    },
    {
      id: 5,
      name: "Sophie Ndongo",
      age: 45,
      gender: "F",
      urgency: 3,
      waitTime: 20,
      specialty: "Cardiologie",
      appointmentTime: "11:15",
      status: "waiting",
      type: "followup",
      category: "arrived",
      assigned: false,
      arrivalTime: "10:55",
      doctor: null,
      motif: "Contrôle traitement insuffisance cardiaque",
      vitalSigns: {
        bloodPressure: "125/85",
        heartRate: "76",
        temperature: "36.9",
        oxygenSaturation: "97"
      },
      lastVisit: "15/02/2025",
      notes: "Contrôle traitement insuffisance cardiaque"
    },
    {
      id: 6,
      name: "Paul Etoga",
      age: 59,
      gender: "M",
      urgency: 1,
      waitTime: 40,
      specialty: "Cardiologie",
      appointmentTime: "09:45",
      status: "waiting",
      type: "followup",
      category: "arrived",
      assigned: false,
      arrivalTime: "09:15",
      doctor: null,
      motif: "Suivi post-infarctus - Contrôle de routine",
      vitalSigns: {
        bloodPressure: "130/80",
        heartRate: "68",
        temperature: "36.6",
        oxygenSaturation: "98"
      },
      lastVisit: "20/01/2025",
      notes: "Suivi post-infarctus - Contrôle de routine"
    },
    {
      id: 7,
      name: "Isabelle Meka",
      age: 72,
      gender: "F",
      urgency: 4,
      waitTime: 10,
      specialty: "Cardiologie",
      appointmentTime: "11:30",
      status: "in_preparation",
      type: "followup",
      category: "arrived",
      assigned: false,
      arrivalTime: "11:20",
      doctor: null,
      motif: "Oedèmes membres inférieurs - Insuffisance cardiaque",
      vitalSigns: {
        bloodPressure: "155/90",
        heartRate: "88",
        temperature: "37.0",
        oxygenSaturation: "95"
      },
      lastVisit: "05/04/2025",
      notes: "Oedèmes membres inférieurs - Insuffisance cardiaque"
    },
    {
      id: 8,
      name: "Thomas Ebogo",
      age: 64,
      gender: "M",
      urgency: 2,
      waitTime: 25,
      specialty: "Cardiologie",
      appointmentTime: "14:00",
      status: "waiting",
      type: "followup",
      category: "rendez-vous",
      assigned: false,
      arrivalTime: null,
      doctor: null,
      motif: "Adaptation traitement anticoagulant",
      vitalSigns: null,
      lastVisit: "10/03/2025",
      notes: "Adaptation traitement anticoagulant"
    }
  ];

  // Données pour la sidebar
  const menuItems = [
    { icon: <Home size={20} />, label: 'Tableau de bord', path: '#', isActive: activeMenuItem === 'dashboard' },
    { icon: <Users size={20} />, label: 'Salle d\'attente', path: '#', isActive: activeMenuItem === 'waitingRoom' },
    { icon: <AlertTriangle size={20} />, label: 'Gestion des Urgences', path: '#', isActive: activeMenuItem === 'emergencies' },
    { icon: <MessageSquare size={20} />, label: 'Communication', path: '#', isActive: activeMenuItem === 'communication' },
    { icon: <ClipboardList size={20} />, label: 'Post Consultation', path: '#', isActive: activeMenuItem === 'postConsultation' }
  ];

  const bottomMenuItems = [
    { icon: <Settings size={18} />, label: 'Paramètres', path: '#' },
    { icon: <HelpCircle size={18} />, label: 'Aide', path: '#' }
  ];

  // User object for header
  const user = {
    initials: doctorInfo.name.split(' ')[0][0],
    name: doctorInfo.name
  };

  // Center info for header
  const centerInfo = {
    name: doctorInfo.clinique,
    code: doctorInfo.id,
    type: doctorInfo.specialty
  };

  // Fonction pour afficher un toast
  const showToastMessage = (message, type = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Simulation du temps qui passe
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effet pour afficher l'alerte hors ligne
  useEffect(() => {
    if (!connected) {
      setShowOfflineAlert(true);
    }
  }, [connected]);
  
  // Toggle connexion (pour démo)
  const toggleConnection = () => {
    setConnected(!connected);
    if (!connected) {
      showToastMessage('Connexion rétablie', 'success');
    } else {
      showToastMessage('Connexion perdue - Mode hors ligne activé', 'warning');
    }
  };
  
  // Gérer l'ouverture des détails du patient
  const handlePatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
    showToastMessage(`Ouverture du dossier de ${patient.name}`, 'info');
  };
  
  // Démarrer une consultation
  const startConsultation = (patient) => {
    setConsultationActive(true);
    showToastMessage(`Consultation démarrée avec ${patient.name}`, 'success');
  };

  // Consulter le prochain patient
  const consultNextPatient = () => {
    const readyPatients = getAssignedPatientsReady();
    if (readyPatients.length > 0) {
      const nextPatient = readyPatients[0];
      startConsultation(nextPatient);
    } else {
      showToastMessage("Aucun patient prêt pour consultation", 'warning');
    }
  };

  // Terminer consultation (pour simulation)
  const endConsultation = () => {
    setConsultationActive(false);
    showToastMessage('Consultation terminée', 'success');
  };

  // Assigner un patient
  const assignPatient = (patient) => {
    showToastMessage(`Patient ${patient.name} assigné au Dr. Kouam`, 'success');
  };

  // Obtenir les patients par catégorie
  const getPatientsByCategory = (category) => {
    return patientsEnAttente.filter(patient => patient.category === category);
  };

  // Obtenir les patients assignés au médecin actuel
  const getAssignedPatients = () => {
    return patientsEnAttente.filter(patient => 
      patient.category === 'assigned' && 
      patient.doctor === doctorInfo.name
    );
  };

  // Obtenir les patients prêts assignés au médecin actuel
  const getAssignedPatientsReady = () => {
    return patientsEnAttente.filter(patient => 
      patient.category === 'assigned' && 
      patient.doctor === doctorInfo.name &&
      patient.status === 'ready'
    ).sort((a, b) => b.urgency - a.urgency);
  };

  // Obtenir les patients arrivés mais non assignés
  const getArrivedUnassignedPatients = () => {
    return patientsEnAttente.filter(patient => 
      patient.category === 'arrived' && 
      !patient.assigned
    );
  };

  // Obtenir les patients avec rendez-vous mais pas encore arrivés
  const getAppointmentPatients = () => {
    return patientsEnAttente.filter(patient => 
      patient.category === 'rendez-vous'
    );
  };

  // Utilisation des filtres et tris partagés
  let filteredPatients = patientsEnAttente;

  // Filtrage avec les fonctions partagées
  if (searchTerm) {
    filteredPatients = filterPatientsBySearch(filteredPatients, searchTerm);
  }
  if (filterOptions.urgency.length > 0) {
    filteredPatients = filterPatientsByUrgency(filteredPatients, filterOptions.urgency);
  }
  if (filterOptions.status.length > 0) {
    filteredPatients = filterPatientsByStatus(filteredPatients, filterOptions.status);
  }

  // Tri avec les fonctions partagées
  if (sortField === 'urgency') {
    filteredPatients = sortPatientsByUrgency(filteredPatients, sortDirection);
  } else if (sortField === 'waitTime') {
    filteredPatients = sortPatientsByWaitTime(filteredPatients, sortDirection);
  } else if (sortField === 'name') {
    filteredPatients = sortPatientsByName(filteredPatients, sortDirection);
  } else if (sortField === 'appointmentTime') {
    filteredPatients = [...filteredPatients].sort((a, b) => {
      const comparison = a.appointmentTime.localeCompare(b.appointmentTime);
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  } else {
    // Par défaut: tri par urgence + temps d'attente (algorithme 50/50)
    filteredPatients = [...filteredPatients].sort((a, b) => {
      const scoreA = 0.5 * a.urgency + 0.5 * (a.waitTime / 10);
      const scoreB = 0.5 * b.urgency + 0.5 * (b.waitTime / 10);
      return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    });
  }

  // Gérer le changement de tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Toggle filter option
  const toggleFilter = (category, value) => {
    setFilterOptions(prev => {
      const newFilters = { ...prev };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(v => v !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilterOptions({
      urgency: [],
      status: [],
      type: []
    });
    setSearchTerm('');
  };
  
  // Gestion du drag and drop
  const handleDragStart = (e, patient) => {
    setDraggingPatient(patient);
    if (e.target.classList.contains('patient-row')) {
      e.target.style.opacity = '0.6';
    }
  };

  const handleDragEnd = (e) => {
    if (e.target.classList.contains('patient-row')) {
      e.target.style.opacity = '1';
    }
    setDraggingPatient(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.target.classList.contains('drop-zone')) {
      e.target.classList.add('bg-gray-100');
    }
  };

  const handleDragLeave = (e) => {
    if (e.target.classList.contains('drop-zone')) {
      e.target.classList.remove('bg-gray-100');
    }
  };

  const handleDrop = (e, category) => {
    e.preventDefault();
    if (e.target.classList.contains('drop-zone')) {
      e.target.classList.remove('bg-gray-100');
    }

    if (draggingPatient) {
      if (category === 'assigned' && draggingPatient.category !== 'assigned') {
        showToastMessage(`Patient ${draggingPatient.name} assigné au Dr. Kouam`, 'success');
      } else if (category === 'arrived' && draggingPatient.category === 'assigned') {
        showToastMessage(`Patient ${draggingPatient.name} retourné dans la salle d'attente`, 'info');
      }
    }
  };

  // Préparer les colonnes pour FilterableTable
  const tableColumns = [
    {
      id: 'name',
      header: 'Patient',
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.age} ans • {row.gender === 'M' ? 'H' : 'F'}</div>
        </div>
      ),
      sortable: true,
      filterable: true
    },
    {
      id: 'appointmentTime', 
      header: 'RDV',
      accessor: (row) => row.appointmentTime,
      sortable: true
    },
    {
      id: 'waitTime',
      header: 'Attente',
      accessor: (row) => formatWaitTime(row.waitTime),
      sortable: true
    },
    {
      id: 'urgency',
      header: 'Urg.',
      accessor: (row) => <UrgencyIndicator level={row.urgency} size="sm" />,
      sortable: true
    },
    {
      id: 'type',
      header: 'Type', 
      accessor: (row) => row.type === 'new' ? 'Nouveau' : 'Suivi',
      sortable: true,
      filterable: true
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (row) => (
        <StatusBadge 
          type={row.status} 
          label={row.status === 'ready' ? 'Prêt' : row.status === 'in_preparation' ? 'En préparation' : 'En attente'}
        />
      ),
      sortable: true,
      filterable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <ButtonGroup>
          <ActionButton
            label="Consulter"
            icon={<Video className="h-3 w-3" />}
            variant={row.status === 'ready' ? 'primary' : 'secondary'}
            size="xs"
            disabled={row.status !== 'ready'}
            onClick={() => startConsultation(row)}
          />
          <ActionButton
            label="Dossier"
            icon={<Eye className="h-3 w-3" />}
            variant="secondary"
            size="xs"
            onClick={() => handlePatientDetails(row)}
          />
        </ButtonGroup>
      )
    }
  ];

  // Actions pour le FAB
  const fabActions = [
    {
      id: 'help',
      icon: <HelpCircle className="h-4 w-4" />,
      label: 'Aide',
      onClick: () => alert('Aide')
    }
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Barre de navigation latérale */}
      <Sidebar
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />

      {/* Contenu principal */}
      <div className="flex-1 ml-52 transition-all duration-300">
        {/* Header */}
        <Header
          title={`Salle d'Attente - ${doctorInfo.name}`}
          centerInfo={centerInfo}
          isOnline={connected}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={user}
          notificationCount={notifications}
          extraHeaderItems={
            <ActionButton
              label={connected ? 'Simuler déconnexion' : 'Reconnecter'}
              icon={connected ? <WifiOff className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              variant="secondary"
              size="xs"
              onClick={toggleConnection}
            />
          }
        />
        
        {/* Contenu principal */}
        <div className="mt-14 p-4">
          {/* Alerte mode hors ligne */}
          <AlertNotification 
            message="Mode hors ligne actif. Les données sont stockées localement et seront synchronisées automatiquement une fois la connexion rétablie."
            type="error"
            isVisible={showOfflineAlert && !connected}
            onClose={() => setShowOfflineAlert(false)}
            position="top-center"
          />

          {/* Statistiques rapides */}
          {showStats && (
            <StatCardGroup darkMode={darkMode}>
              <StatCard
                title="Patients jour"
                value={statistiques.patientsJour}
                icon={<Calendar className="h-3.5 w-3.5" />}
                iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
                iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
                darkMode={darkMode}
              />
              <StatCard
                title="En attente"
                value={statistiques.enAttente}
                icon={<Users className="h-3.5 w-3.5" />}
                iconBgColor={darkMode ? 'bg-yellow-900' : 'bg-yellow-100'}
                iconColor={darkMode ? 'text-yellow-400' : 'text-yellow-600'}
                darkMode={darkMode}
              />
              <StatCard
                title="Terminées"
                value={statistiques.consultations}
                icon={<CheckCircle className="h-3.5 w-3.5" />}
                iconBgColor={darkMode ? 'bg-green-900' : 'bg-green-100'}
                iconColor={darkMode ? 'text-green-400' : 'text-green-600'}
                darkMode={darkMode}
              />
              <StatCard
                title="Attente moy."
                value={statistiques.tempsAttenteMoyen}
                suffix="min"
                icon={<Clock className="h-3.5 w-3.5" />}
                iconBgColor={darkMode ? 'bg-orange-900' : 'bg-orange-100'}
                iconColor={darkMode ? 'text-orange-400' : 'text-orange-600'}
                darkMode={darkMode}
              />
              <StatCard
                title="Urgents"
                value={statistiques.patientsUrgents}
                icon={<AlertTriangle className="h-3.5 w-3.5" />}
                iconBgColor={darkMode ? 'bg-red-900' : 'bg-red-100'}
                iconColor={darkMode ? 'text-red-400' : 'text-red-600'}
                darkMode={darkMode}
              />
            </StatCardGroup>
          )}

          {/* Actions principales */}
          <div className="flex items-center justify-between mb-4">
            <ActionButton
              label="Consulter le prochain"
              icon={<Play className="h-4 w-4" />}
              variant={getAssignedPatientsReady().length > 0 && !consultationActive ? "success" : "secondary"}
              size="md"
              count={getAssignedPatientsReady().length}
              disabled={getAssignedPatientsReady().length === 0 || consultationActive}
              onClick={consultNextPatient}
            />

            {/* Simulation pour testing */}
            {consultationActive && (
              <ActionButton
                label="Terminer consultation (simulation)"
                variant="danger"
                size="sm"
                onClick={endConsultation}
              />
            )}

            <div className="flex items-center space-x-3">
              <ViewSelector
                currentView={viewMode}
                onChange={setViewMode}
                availableViews={['list', 'cards']}
                darkMode={darkMode}
              />

              <SearchInput
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                darkMode={darkMode}
              />

              <ActionButton
                label="Filtres"
                icon={<Filter className="h-4 w-4" />}
                variant="secondary"
                size="sm"
                count={Object.values(filterOptions).reduce((acc, arr) => acc + arr.length, 0) || undefined}
                onClick={() => setShowFilters(!showFilters)}
              />

              <ActionButton
                label="Informations"
                icon={<Info className="h-4 w-4" />}
                variant={showTimings ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowTimings(!showTimings)}
              />
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className={`mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-3`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Filtres</h3>
                <button 
                  className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                  onClick={resetFilters}
                >
                  Réinitialiser
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <h4 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Urgence</h4>
                  <div className="flex flex-wrap">
                    {[5, 4, 3, 2, 1].map(level => (
                      <button 
                        key={`urgency-${level}`}
                        className={`mr-1 mb-1 px-2 py-0.5 text-xs rounded ${
                          filterOptions.urgency.includes(level)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                        onClick={() => toggleFilter('urgency', level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut</h4>
                  <div className="flex flex-wrap">
                    {[
                      {value: 'ready', label: 'Prêt'},
                      {value: 'in_preparation', label: 'En préparation'},
                      {value: 'waiting', label: 'En attente'}
                    ].map(status => (
                      <button
                        key={`status-${status.value}`}
                        className={`mr-1 mb-1 px-2 py-0.5 text-xs rounded ${
                          filterOptions.status.includes(status.value)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                        onClick={() => toggleFilter('status', status.value)}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</h4>
                  <div className="flex flex-wrap">
                    {[
                      {value: 'new', label: 'Nouveau'},
                      {value: 'followup', label: 'Suivi'}
                    ].map(type => (
                      <button
                        key={`type-${type.value}`}
                        className={`mr-1 mb-1 px-2 py-0.5 text-xs rounded ${
                          filterOptions.type.includes(type.value)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                        onClick={() => toggleFilter('type', type.value)}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations sur les horaires */}
          {showTimings && (
            <div className={`mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded p-2`}>
              <div className="flex flex-wrap text-xs">
                <div className="mr-3 mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ouverture:</span>
                  <span className="ml-1">{timings.ouvertureSalle}</span>
                </div>
                <div className="mr-3 mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Début:</span>
                  <span className="ml-1">{timings.debutConsultations}</span>
                </div>
                <div className="mr-3 mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Fin:</span>
                  <span className="ml-1">{timings.finConsultations}</span>
                </div>
                <div className="mr-3 mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Tps moyen/patient:</span>
                  <span className="ml-1">{timings.tempsConsultationMoyen}</span>
                </div>
                <div className="mr-3 mb-1">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Pause:</span>
                  <span className="ml-1">{timings.pauseDejeuner}</span>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'cards' ? (
            /* Vue Encadrés */
            <div className="grid grid-cols-3 gap-4">
              {/* Encadré Mes Patients */}
              <DropZone
                targetId="assigned"
                targetName="Mes Patients"
                isAvailable={true}
                capacity={{ current: getAssignedPatients().length, max: 10 }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                darkMode={darkMode}
              >
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-3 py-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className="font-medium text-sm flex items-center">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Mes Patients ({getAssignedPatients().length})
                    </h3>
                  </div>
                  
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {getAssignedPatients().length > 0 ? (
                      getAssignedPatients()
                        .sort((a, b) => {
                          if (a.status === 'ready' && b.status !== 'ready') return -1;
                          if (a.status !== 'ready' && b.status === 'ready') return 1;
                          return b.urgency - a.urgency;
                        })
                        .map(patient => (
                          <PatientCard
                            key={patient.id}
                            patient={patient}
                            darkMode={darkMode}
                            onSelect={() => handlePatientDetails(patient)}
                            onAdjustUrgency={() => alert(`Ajuster urgence de ${patient.name}`)}
                            onDoctorView={() => handlePatientDetails(patient)}
                            onMoreOptions={() => alert(`Options pour ${patient.name}`)}
                            isDraggable={true}
                            onDragStart={() => setDraggingPatient(patient)}
                          />
                        ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Aucun patient assigné
                      </div>
                    )}
                  </div>
                </div>
              </DropZone>

              {/* Encadré Arrivée */}
              <DropZone
                targetId="arrived"
                targetName="Arrivée"
                isAvailable={true}
                capacity={{ current: getArrivedUnassignedPatients().length, max: 15 }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                darkMode={darkMode}
              >
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-3 py-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className="font-medium text-sm flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Arrivée ({getArrivedUnassignedPatients().length})
                    </h3>
                  </div>
                  
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {getArrivedUnassignedPatients().length > 0 ? (
                      getArrivedUnassignedPatients().map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          darkMode={darkMode}
                          onSelect={() => handlePatientDetails(patient)}
                          onAdjustUrgency={() => alert(`Ajuster urgence de ${patient.name}`)}
                          onDoctorView={() => handlePatientDetails(patient)}
                          onMoreOptions={() => assignPatient(patient)}
                          isDraggable={true}
                          onDragStart={() => setDraggingPatient(patient)}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Aucun patient en attente d'assignation
                      </div>
                    )}
                  </div>
                </div>
              </DropZone>

              {/* Encadré Rendez-vous */}
              <DropZone
                targetId="rendezvous"
                targetName="Rendez-vous"
                isAvailable={true}
                capacity={{ current: getAppointmentPatients().length, max: 20 }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                darkMode={darkMode}
              >
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-lg overflow-hidden`}>
                  <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} px-3 py-2 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className="font-medium text-sm flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Rendez-vous ({getAppointmentPatients().length})
                    </h3>
                  </div>
                  
                  <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                    {getAppointmentPatients().length > 0 ? (
                      getAppointmentPatients().map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          darkMode={darkMode}
                          onSelect={() => handlePatientDetails(patient)}
                          onAdjustUrgency={() => alert(`Ajuster urgence de ${patient.name}`)}
                          onDoctorView={() => handlePatientDetails(patient)}
                          onMoreOptions={() => alert(`Options pour ${patient.name}`)}
                          isDraggable={true}
                          onDragStart={() => setDraggingPatient(patient)}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Aucun rendez-vous en attente
                      </div>
                    )}
                  </div>
                </div>
              </DropZone>
            </div>
          ) : (
            /* Vue Liste */
            <FilterableTable
              columns={tableColumns}
              data={filteredPatients}
              emptyMessage="Aucun patient ne correspond aux critères"
            />
          )}

          {/* Texte informatif sur le drag & drop */}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
            <span><b>Astuce</b>: Faites glisser les patients entre les colonnes pour les assigner ou les retourner en salle d'attente.</span>
          </div>
        </div>
      </div>
      
      {/* Modale détails patient */}
      <Modal
        title={`Dossier Patient - ${selectedPatient?.name}`}
        isOpen={showPatientDetails}
        onClose={() => setShowPatientDetails(false)}
        darkMode={darkMode}
        width="max-w-4xl"
      >
        {selectedPatient && (
          <PatientRecord
            patient={selectedPatient}
            onClose={() => setShowPatientDetails(false)}
            onMarkReady={() => {
              showToastMessage(`${selectedPatient.name} marqué comme prêt`, 'success');
              setShowPatientDetails(false);
            }}
            onStartConsultation={() => {
              startConsultation(selectedPatient);
              setShowPatientDetails(false);
            }}
            darkMode={darkMode}
          />
        )}
      </Modal>

      {/* Toast Notifications */}
      <ToastNotification
        type={toastType}
        message={toastMessage}
        duration={3000}
        onClose={() => setShowToast(false)}
      />

      {/* Bouton d'assistance flottant */}
      <FloatingActionButton
        actions={fabActions}
        mainIcon={<HelpCircle className="h-5 w-5" />}
        position="bottom-right"
        color="blue"
        size="medium"
      />
    </div>
  );
};

export default SalleAttenteVirtuelle;