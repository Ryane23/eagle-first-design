import React, { useState, useEffect } from 'react';
import {
  Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, 
  MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, 
  ChevronDown, MoreVertical, UserPlus, RefreshCw, Monitor, Clock, CheckCircle, PlusCircle, 
  Edit, User, ChevronRight, Video, ExternalLink, MapPin, Zap, BarChart2, Smartphone, 
  Share2, Grid, List, Layout, Circle, Printer, Send, RotateCcw, Maximize, Minimize, 
  Building, Network, MessageCircle, BarChart, UserCheck, PieChart, Move, Plus, Eye, 
  XCircle, Pen, LogOut, Stethoscope, FileHeart, EyeOff, CalendarDays, History, 
  CalendarClock, Hourglass, TrendingUp, TrendingDown
} from 'lucide-react';

// Imports des modules partagés
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import MultiTabContainer from '@layout/MultiTabContainer';
import { ViewSelector } from '@layout/ViewSelector';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import { StatusBadge } from '@data-display/StatusBadge';
import DynamicBadge from '@data-display/DynamicBadge';
import { PatientCard } from '@cards/PatientCard';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import FloatingActionButton from '@buttons/FloatingActionButton';
import { Modal } from '@modals/Modal';
import { AlertNotification } from '@feedback/AlertNotification';
import ToastNotification from '@feedback/ToastNotification';
import { SearchInput } from '@forms/SearchInput';
import ChatInterface from '@communication/ChatInterface';
import { SidePanel } from '@panels/SidePanel';

// Imports des modules métier refactorisés
import { mockDoctorInfo } from '@mocks/doctors';
import { mockCenters } from '@mocks/centers';
import { mockUrgentPatients } from '@mocks/urgentPatients';
import mockNotificationsData from '@mocks/notifications';
import { useConnectionStatus } from '@hooks/useConnectionStatus';
import { useNotification } from '@hooks/useNotification';
import { 
  sortPatientsByUrgency, 
  sortPatientsByWaitTime 
} from '@sorters/patientSorter';
import { 
  filterPatientsByUrgency, 
  filterPatientsByStatus 
} from '@filters/patientFilters';
import { transformPatientsForTable } from '@transformers/patientTransformers';
import { 
  formatElapsedTime, 
  formatWaitTime 
} from '@formatters/timeFormatter';
import { 
  calculateAge, 
  calculateWaitTime 
} from '@utils/medical/calculators';
import { consultationService } from '@services/consultationService';
import { URGENCY_LEVELS } from '@config/urgencyLevels';
import { PATIENT_STATUS } from '@constants';
import { COLORS } from '@config/colors';

// Import des composants spécifiques au médecin
import SalleAttenteVirtuelle from '@doctor/SalleAttenteVirtuelle';
import GestionUrgences from '@doctor/GestionUrgences';
import DoctorCommunicationCenter from '@doctor/DoctorCommunicationCenter';
import TeleconsultationInterface from '@doctor/TeleconsultationInterface';

const TableauBordMedecin = () => {
  // États de l'application
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [activeTab, setActiveTab] = useState('planning');
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [currentView, setCurrentView] = useState('grid');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [activeRoute, setActiveRoute] = useState('dashboard');

  const navigate = (route) => {
    setActiveRoute(route);
    console.log(`Navigation vers: ${route}`);
  };
  
  // Utilisation des hooks refactorisés
  const { status: connectionStatus, toggleConnection } = useConnectionStatus();
  const { notifications, unreadCount, addNotification } = useNotification();
  
  // Données depuis les mocks refactorisés
  const doctorInfo = mockDoctorInfo;
  const centerInfo = mockCenters[0]; // Premier centre comme exemple
  
  // Transformation des patients depuis les mocks
  const patientsEnAttente = transformPatientsForTable(mockUrgentPatients);
  
  // Calcul des statistiques à partir des données
  const statistiques = {
    patientsJour: patientsEnAttente.length,
    enAttente: filterPatientsByStatus(patientsEnAttente, ['waiting']).length,
    consultations: filterPatientsByStatus(patientsEnAttente, ['completed']).length,
    tempsAttenteMoyen: Math.round(
      patientsEnAttente.reduce((sum, p) => sum + (p.waitTime || 0), 0) / patientsEnAttente.length
    ) || 0
  };
  
  const activitesRecentes = [
    { 
      id: 1, 
      type: "consultation", 
      patient: "Paul Etoga", 
      time: "09:45", 
      details: "Consultation terminée, ordonnance émise." 
    },
    { 
      id: 2, 
      type: "prescription", 
      patient: "Anne Mendouga", 
      time: "09:20", 
      details: "Prescription de Lopressor 50mg, 1 comprimé par jour." 
    },
    { 
      id: 3, 
      type: "lab_request", 
      patient: "Thomas Ebogo", 
      time: "09:00", 
      details: "Demande d'analyse sanguine envoyée." 
    },
    { 
      id: 4, 
      type: "urgency_change", 
      patient: "Jeanne Atangana", 
      time: "08:55", 
      details: "Niveau d'urgence augmenté de 3 à 4." 
    }
  ];
  
  const appointments = [
    { id: 1, time: "09:00", patient: "Paul Etoga", status: "completed", type: "followup" },
    { id: 2, time: "09:30", patient: "Anne Mendouga", status: "completed", type: "followup" },
    { id: 3, time: "10:00", patient: "Robert Mbarga", status: "current", type: "new", urgencyLevel: 5 },
    { id: 4, time: "10:15", patient: "Jeanne Atangana", status: "waiting", type: "followup", urgencyLevel: 4 },
    { id: 5, time: "10:30", patient: "Marie Ekambi", status: "waiting", type: "followup", urgencyLevel: 3 },
    { id: 6, time: "11:00", patient: "Claude Bekolo", status: "waiting", type: "new", urgencyLevel: 2 },
    { id: 7, time: "11:30", patient: "Isabelle Meka", status: "waiting", type: "followup" },
    { id: 8, time: "14:00", patient: "Thomas Ebogo", status: "waiting", type: "followup" },
    { id: 9, time: "14:30", patient: "Sophie Nguini", status: "waiting", type: "new" },
    { id: 10, time: "15:00", patient: "Pierre Ndongo", status: "waiting", type: "followup" }
  ];

  // Configuration du menu de navigation
const menuItems = [
  { 
    icon: <Home size={20} />, 
    label: 'Tableau de bord', 
    onClick: () => navigate('dashboard'),
    isActive: activeRoute === 'dashboard' 
  },
  { 
    icon: <Users size={20} />, 
    label: 'Salle d\'attente', 
    onClick: () => navigate('salle-attente'),
    isActive: activeRoute === 'salle-attente' 
  },
  { 
    icon: <AlertTriangle size={20} />, 
    label: 'Gestion des Urgences', 
    onClick: () => navigate('urgences'),
    isActive: activeRoute === 'urgences' 
  },
  { 
    icon: <MessageSquare size={20} />, 
    label: 'Communications', 
    onClick: () => navigate('communication'),
    isActive: activeRoute === 'communication' 
  },
  { 
    icon: <Video size={20} />, 
    label: 'Téléconsultation', 
    onClick: () => navigate('teleconsultation'),
    isActive: activeRoute === 'teleconsultation' 
  },
  { 
    icon: <BarChart size={20} />, 
    label: 'Statistiques', 
    onClick: () => navigate('statistiques'),
    isActive: activeRoute === 'statistiques' 
  }
];

const bottomMenuItems = [
  { 
    icon: <Settings size={18} />, 
    label: 'Paramètres', 
    onClick: () => navigate('settings'),
    isActive: activeRoute === 'settings'
  },
  { 
    icon: <HelpCircle size={18} />, 
    label: 'Aide', 
    onClick: () => navigate('help'),
    isActive: activeRoute === 'help'
  }
];

  // Configuration des routes
  const routes = {
    dashboard: { 
      component: 'dashboard', 
      title: 'Tableau de bord' 
    },
    'salle-attente': { 
      component: SalleAttenteVirtuelle, 
      title: 'Salle d\'attente'
    },
    urgences: { 
      component: GestionUrgences, 
      title: 'Gestion des Urgences' 
    },
    communication: { 
      component: DoctorCommunicationCenter, 
      title: 'Communications' 
    },
    teleconsultation: { 
      component: TeleconsultationInterface, 
      title: 'Téléconsultation' 
    }
  };

  // Configuration des onglets
  const tabsConfig = [
    {
      id: 'planning',
      label: 'Planning du jour',
      icon: <CalendarDays size={16} />,
      content: renderPlanningContent()
    },
    {
      id: 'appointments',
      label: 'Mes rendez-vous',
      icon: <CalendarClock size={16} />,
      content: renderAppointmentsContent()
    },
    {
      id: 'activities',
      label: 'Activités récentes',
      icon: <History size={16} />,
      content: renderActivitiesContent()
    }
  ];

  // Actions rapides pour le bouton flottant
  const quickActions = [
    {
      id: 'consult',
      icon: <Video className="h-5 w-5" />,
      label: 'Consulter',
      onClick: () => showToastMessage('Nouvelle consultation', 'info')
    },
    {
      id: 'prescription',
      icon: <FileText className="h-5 w-5" />,
      label: 'Ordonnance',
      onClick: () => showToastMessage('Nouvelle ordonnance', 'info')
    },
    {
      id: 'urgent',
      icon: <AlertTriangle className="h-5 w-5" />,
      label: 'Urgence',
      onClick: () => showToastMessage('Gestion des Urgences', 'warning')
    },
    {
      id: 'message',
      icon: <MessageSquare className="h-5 w-5" />,
      label: 'Message',
      onClick: () => showToastMessage('Nouveau message', 'info')
    }
  ];
  
  // Simulation du temps qui passe
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effet pour gérer l'alerte hors ligne
  useEffect(() => {
    if (!connectionStatus.isOnline) {
      setShowOfflineAlert(true);
    } else {
      setShowOfflineAlert(false);
    }
  }, [connectionStatus.isOnline]);
  
  // Gérer l'ouverture des détails du patient
  const handlePatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };
  
  // Démarrer une consultation via le service
  const startConsultation = (patient) => {
    const session = consultationService.createSession(patient.id, doctorInfo.id, 'room-1');
    consultationService.startSession(session.id);
    showToastMessage(`Consultation démarrée avec ${patient.name}`, 'success');
  };

  // Gérer les actions sur les patients
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleAdjustUrgency = (patient) => {
    showToastMessage(`Ajustement urgence pour ${patient.name}`, 'info');
  };

  const handleDoctorView = (patient) => {
    showToastMessage(`Vue médecin pour ${patient.name}`, 'info');
  };

  const handleMoreOptions = (patient) => {
    showToastMessage(`Plus d'options pour ${patient.name}`, 'info');
  };

  // Afficher un toast
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Obtenir les patients triés et filtrés
  const getFilteredPatients = () => {
    let filtered = [...patientsEnAttente];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.center?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return sortPatientsByUrgency(filtered, 'desc');
  };

  const getPatientsUrgents = () => {
    return filterPatientsByUrgency(getFilteredPatients(), [4, 5]);
  };

  const getPatientsReady = () => {
    return filterPatientsByStatus(getFilteredPatients(), ['ready']);
  };

  // Fonction de rendu du contenu planning
  function renderPlanningContent() {
    return (
      <div className="relative">
        {/* Ligne du temps */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="py-2 space-y-0">
          {appointments.map((appointment, index) => (
            <div 
              key={appointment.id} 
              className={`relative flex py-2 ${index !== appointments.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''} ${
                appointment.status === 'current' ? (darkMode ? 'bg-blue-900 bg-opacity-10' : 'bg-blue-50') : ''
              }`}
            >
              {/* Heure */}
              <div className="w-20 pl-3 flex-shrink-0 font-medium text-right pr-4">
                {appointment.time}
              </div>
              
              {/* Indicateur */}
              <div className="relative flex items-center justify-center z-10">
                <div className={`w-4 h-4 rounded-full ${
                  appointment.status === 'completed' ? 'bg-green-500' :
                  appointment.status === 'current' ? 'bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900' :
                  'bg-yellow-500'
                } flex-shrink-0`}></div>
              </div>
              
              {/* Contenu */}
              <div className="flex-1 pl-4 pr-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{appointment.patient}</div>
                  <div className="flex items-center flex-wrap gap-1 mt-0.5">
                    <StatusBadge
                      type={appointment.type === 'new' ? 'info' : 'success'}
                      label={appointment.type === 'new' ? 'Nouveau' : 'Suivi'}
                    />
                    {appointment.urgencyLevel && (
                      <UrgencyIndicator
                        level={appointment.urgencyLevel}
                        size="xs"
                        showNumber={false}
                      />
                    )}
                    {patientsEnAttente.find(p => p.name === appointment.patient)?.center && (
                      <DynamicBadge
                        label={patientsEnAttente.find(p => p.name === appointment.patient)?.center}
                        variant="neutral"
                        size="xs"
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <StatusBadge
                    type={appointment.status === 'completed' ? 'success' : 
                          appointment.status === 'current' ? 'info' : 'warning'}
                    label={appointment.status === 'completed' ? 'Terminé' :
                           appointment.status === 'current' ? 'En cours' :
                           'En attente'}
                  />
                  
                  {appointment.status === 'waiting' && (
                    <ActionButton
                      label=""
                      icon={<Video className="h-4 w-4" />}
                      variant="primary"
                      size="xs"
                      className="ml-2 rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Fonction de rendu du contenu rendez-vous
  function renderAppointmentsContent() {
    return (
      <div className="p-4 text-center">
        <div className="py-8">
          <Calendar className={`mx-auto h-16 w-16 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4`} />
          <h3 className="text-lg font-medium mb-2">Contenu à venir</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Cette section est en cours de développement.
          </p>
        </div>
      </div>
    );
  }

  // Fonction de rendu du contenu activités
  function renderActivitiesContent() {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <History size={18} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
            <h3 className="font-medium">Activités récentes</h3>
          </div>
          <ButtonGroup>
            <ActionButton label="Toutes" variant="info" size="xs" />
            <ActionButton label="Consultations" variant="secondary" size="xs" />
            <ActionButton label="Prescriptions" variant="secondary" size="xs" />
          </ButtonGroup>
        </div>
        
        <div className="space-y-2">
          {activitesRecentes.map(activite => (
            <div 
              key={activite.id}
              className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <DynamicBadge
                    label={activite.type === 'consultation' ? 'Consultation' : 
                           activite.type === 'prescription' ? 'Prescription' :
                           activite.type === 'lab_request' ? 'Examen' :
                           'Modification priorité'}
                    variant="info"
                    size="xs"
                    icon={activite.type === 'consultation' ? <Video className="h-3 w-3" /> : 
                          activite.type === 'prescription' ? <FileText className="h-3 w-3" /> :
                          activite.type === 'lab_request' ? <FileText className="h-3 w-3" /> :
                          <AlertTriangle className="h-3 w-3" />}
                  />
                  <div className="ml-3">
                    <div className="font-medium">{activite.patient}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                      {activite.details}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock size={12} className="mr-1" /> {activite.time} • {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <ActionButton
                  label=""
                  icon={<Eye size={12} />}
                  variant="secondary"
                  size="xs"
                />
              </div>
            </div>
          ))}
          
          <div className="p-2 text-center">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Voir toutes les activités
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Barre de navigation latérale */}
      <Sidebar
        appName="EAGLE"
        menuItems={menuItems.map(item => ({
          ...item,
          path: item.onClick ? '#' : item.path,
          onClick: item.onClick
        }))}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
        navCollapsed={navCollapsed}
        onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
      />
      
      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        {activeRoute === 'dashboard' ? (
          <div className="p-6">
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <Header
                title={`Tableau de Bord - ${doctorInfo.name}`}
                subtitle={`${doctorInfo.specialty} • ${doctorInfo.clinique}`}
                centerInfo={centerInfo}
                isOnline={connectionStatus.isOnline}
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode(!darkMode)}
                user={{
                  initials: doctorInfo.initials,
                  name: doctorInfo.name
                }}
                notificationCount={unreadCount}
                extraHeaderItems={
                  <ActionButton
                    label={showStats ? "Masquer stats" : "Afficher stats"}
                    icon={showStats ? <EyeOff /> : <Eye />}
                    variant="secondary"
                    size="xs"
                    onClick={() => setShowStats(!showStats)}
                  />
                }
              />
              
              {/* Contenu de la page */}
              <div className="mt-1 p-4">
                {/* Alerte mode hors ligne */}
                <AlertNotification
                  message="Mode hors ligne actif. Les données sont stockées localement et seront synchronisées automatiquement une fois la connexion rétablie."
                  type="warning"
                  isVisible={showOfflineAlert}
                  onClose={() => setShowOfflineAlert(false)}
                  position="top-center"
                  duration={0}
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
                  </StatCardGroup>
                )}
                
                {/* Boutons d'accès rapide */}
                <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
                  <ButtonGroup>
                    <ActionButton
                      label="Salle d'attente"
                      icon={<Users size={14} />}
                      variant="primary"
                      size="xs"
                    />
                    <ActionButton
                      label="Nouvelle consultation"
                      icon={<Video size={14} />}
                      variant="success"
                      size="xs"
                    />
                    <ActionButton
                      label="Prescription"
                      icon={<FileText size={14} />}
                      variant="secondary"
                      size="xs"
                    />
                    <ActionButton
                      label="Urgences"
                      icon={<AlertTriangle size={14} />}
                      variant="warning"
                      size="xs"
                      count={getPatientsUrgents().length}
                    />
                    <ActionButton
                      label="Message"
                      icon={<MessageSquare size={14} />}
                      variant="info"
                      size="xs"
                      count={3}
                    />
                  </ButtonGroup>
                  
                  <div className="flex space-x-1 items-center">
                    <SearchInput
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      darkMode={darkMode}
                      width="w-48"
                    />
                    <ActionButton
                      label="Filtrer"
                      icon={<Filter size={14} />}
                      variant="secondary"
                      size="xs"
                      onClick={() => setShowFilters(!showFilters)}
                    />
                    <ViewSelector
                      currentView={currentView}
                      onChange={setCurrentView}
                      availableViews={['grid', 'list']}
                      darkMode={darkMode}
                    />
                  </div>
                </div>
                
                {/* Layout principal à deux colonnes */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Colonne principale (2/3) */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Prochain patient */}
                    {getPatientsReady().length > 0 && (
                      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border-l-4 ${
                        darkMode ? 'border-blue-600' : 'border-blue-500'
                      } shadow p-3 hover:shadow-md transition-shadow`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`rounded-full p-2 ${darkMode ? 'bg-blue-900' : 'bg-blue-100'} mr-3`}>
                              <Video className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                            </div>
                            <div>
                              <h3 className="font-medium">Patient prêt pour consultation</h3>
                              <div className="flex items-center mt-1">
                                <span className="font-bold mr-2">
                                  {sortPatientsByUrgency(getPatientsReady(), 'desc')[0]?.name}
                                </span>
                                <UrgencyIndicator
                                  level={sortPatientsByUrgency(getPatientsReady(), 'desc')[0]?.urgency}
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                          <ActionButton
                            label="Démarrer consultation"
                            icon={<Video className="h-4 w-4" />}
                            variant="primary"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Onglets */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow hover:shadow-md transition-shadow`}>
                      <MultiTabContainer
                        tabs={tabsConfig}
                        defaultTabId="planning"
                        onChange={setActiveTab}
                      />
                    </div>
                  </div>
                  
                  {/* Colonne latérale (1/3) */}
                  <div className="space-y-4">
                    {/* Patients urgents */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow`}>
                      <div className={`py-2 px-4 ${darkMode ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-100 text-red-800'} flex items-center justify-between`}>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          <h3 className="font-medium">Patients urgents</h3>
                        </div>
                        <DynamicBadge
                          label={`${getPatientsUrgents().length} patient${getPatientsUrgents().length > 1 ? 's' : ''}`}
                          variant="error"
                          size="xs"
                        />
                      </div>
                      
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {getPatientsUrgents().map(patient => (
                          <PatientCard
                            key={patient.id}
                            patient={patient}
                            darkMode={darkMode}
                            onSelect={() => handlePatientSelect(patient)}
                            onAdjustUrgency={() => handleAdjustUrgency(patient)}
                            onDoctorView={() => handleDoctorView(patient)}
                            onMoreOptions={() => handleMoreOptions(patient)}
                          />
                        ))}
                        
                        {getPatientsUrgents().length === 0 && (
                          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Aucun patient urgent en attente
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions rapides */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow hover:shadow-md transition-shadow`}>
                      <div className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
                        <h3 className="font-medium flex items-center">
                          <Zap className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
                          Actions rapides
                        </h3>
                        <ActionButton
                          label="Personnaliser"
                          variant="secondary"
                          size="xs"
                        />
                      </div>
                      
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map(action => (
                            <ActionButton
                              key={action.id}
                              label={action.label}
                              icon={action.icon}
                              variant="primary"
                              fullWidth
                              onClick={action.onClick}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Patients en attente */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow hover:shadow-md transition-shadow`}>
                      <div className={`p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
                        <h3 className="font-medium flex items-center">
                          <Users className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
                          Patients en attente
                        </h3>
                        <ActionButton
                          label="Voir tous"
                          variant="secondary"
                          size="xs"
                        />
                      </div>
                      
                      <div className="max-h-80 overflow-auto">
                        {getFilteredPatients().map(patient => (
                          <PatientCard
                            key={patient.id}
                            patient={patient}
                            darkMode={darkMode}
                            onSelect={() => handlePatientDetails(patient)}
                            onAdjustUrgency={() => handleAdjustUrgency(patient)}
                            onDoctorView={() => handleDoctorView(patient)}
                            onMoreOptions={() => handleMoreOptions(patient)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Modal Détails patient */}
            <Modal
              title="Détails du patient"
              isOpen={showPatientDetails}
              onClose={() => setShowPatientDetails(false)}
              darkMode={darkMode}
              width="max-w-2xl"
              footer={
                selectedPatient && (
                  <div className="flex justify-between items-center w-full">
                    <ButtonGroup>
                      <ActionButton
                        label="Dossier complet"
                        icon={<Eye className="h-4 w-4" />}
                        variant="secondary"
                      />
                      <ActionButton
                        label="Modifier urgence"
                        icon={<Pen className="h-4 w-4" />}
                        variant="secondary"
                      />
                    </ButtonGroup>
                    
                    {selectedPatient?.status === 'ready' && (
                      <ActionButton
                        label="Démarrer la consultation"
                        icon={<Video className="h-5 w-5" />}
                        variant="primary"
                        onClick={() => startConsultation(selectedPatient)}
                      />
                    )}
                  </div>
                )
              }
            >
              {selectedPatient && (
                <div>
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedPatient.age} ans • {selectedPatient.gender === 'M' ? 'Homme' : 'Femme'}
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <UrgencyIndicator
                            level={selectedPatient.urgency}
                            showLabel
                            size="sm"
                          />
                          <StatusBadge
                            type={selectedPatient.type === 'new' ? 'info' : 'success'}
                            label={selectedPatient.type === 'new' ? 'Nouveau patient' : 'Patient en suivi'}
                          />
                        </div>
                        <div className="mt-1 text-sm text-gray-500">{selectedPatient.center}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Heure de rendez-vous: <span className="font-medium">{selectedPatient.appointmentTime}</span>
                        </div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Temps d'attente: <span className={selectedPatient.waitTime > 30 ? 'text-red-500 font-medium' : 'font-medium'}>
                            {formatWaitTime(selectedPatient.waitTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Antécédents médicaux
                      </h4>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {selectedPatient.type === 'new' ? 
                            "Aucun antécédent disponible pour ce nouveau patient." : 
                            "Hypertension artérielle diagnostiquée en 2022. Sous traitement Lopressor 50mg. Antécédents familiaux d'infarctus du myocarde."}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Consultations précédentes
                      </h4>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {selectedPatient.type === 'new' ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Première consultation pour ce patient.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-sm">
                              <div className="font-medium">15/04/2025</div>
                              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Contrôle tension artérielle. TA: 145/90.
                              </div>
                            </div>
                            <div className="text-sm">
                              <div className="font-medium">01/03/2025</div>
                              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Ajustement posologie Lopressor.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg mb-6 ${
                    selectedPatient.status === 'ready'
                      ? (darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50 border border-green-200')
                      : (darkMode ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50 border border-yellow-200')
                  }`}>
                    <div className="flex items-start">
                      {selectedPatient.status === 'ready' ? (
                        <CheckCircle className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      ) : (
                        <Clock className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} mr-2 flex-shrink-0`} />
                      )}
                      <div>
                        <h4 className={`font-medium ${selectedPatient.status === 'ready' ? (darkMode ? 'text-green-300' : 'text-green-700') : (darkMode ? 'text-yellow-300' : 'text-yellow-700')}`}>
                          {selectedPatient.status === 'ready' ? 'Patient prêt pour la consultation' : 'Patient en préparation'}
                        </h4>
                        <p className={`text-sm ${selectedPatient.status === 'ready' ? (darkMode ? 'text-green-400' : 'text-green-600') : (darkMode ? 'text-yellow-400' : 'text-yellow-600')}`}>
                          {selectedPatient.status === 'ready' 
                            ? "Tous les paramètres vitaux ont été saisis par l'infirmier. Vous pouvez démarrer la consultation." 
                            : "L'infirmier est en train de préparer le patient. Paramètres vitaux en cours de saisie."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal>

            {/* Panneau de notifications */}
            <SidePanel
              title="Notifications"
              isOpen={showNotificationPanel}
              onClose={() => setShowNotificationPanel(false)}
              darkMode={darkMode}
            >
              <div className="space-y-2">
                {mockNotificationsData.map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 bg-opacity-20' : ''}`}>
                    <div className="flex items-start">
                      <DynamicBadge
                        variant={notification.type === 'urgent' ? 'error' : 
                                 notification.type === 'warning' ? 'warning' :
                                 notification.type === 'success' ? 'success' : 'info'}
                        dot
                      />
                      <div className="ml-2 flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SidePanel>
            
            {/* Bouton d'assistance flottant */}
            <FloatingActionButton
              actions={quickActions}
              mainIcon={<HelpCircle className="h-6 w-6" />}
              position="bottom-right"
              color="blue"
              size="large"
              showLabels={true}
            />

            {/* Toast notifications */}
            {showToast && (
              <ToastNotification
                type={toastType}
                message={toastMessage}
                duration={3000}
                onClose={() => setShowToast(false)}
              />
            )}
          </div>
        ) : (
          <div className="p-6">
{activeRoute === 'salle-attente' && <SalleAttenteVirtuelle onNavigate={navigate} darkMode={darkMode} />}
{activeRoute === 'urgences' && <GestionUrgences onNavigate={navigate} darkMode={darkMode} />}
{activeRoute === 'communication' && <DoctorCommunicationCenter onNavigate={navigate} darkMode={darkMode} />}
{activeRoute === 'teleconsultation' && <TeleconsultationInterface onNavigate={navigate} darkMode={darkMode} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default TableauBordMedecin;