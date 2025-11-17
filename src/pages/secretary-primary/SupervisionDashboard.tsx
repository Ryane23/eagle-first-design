import React, { useState, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, ChevronDown, ChevronUp, MoreVertical, RefreshCw, Monitor, Clock, CheckCircle, Edit, User, ChevronRight, ArrowRight, MapPin, Zap, BarChart2, Phone, Clipboard, Headphones, Share2, Grid, List, Layout, AlertOctagon, Sliders, Send, RotateCcw, Maximize, Minimize, MessageCircle, PieChart, Map, UserCheck, UserX, Video, VideoOff, Cast, Server, Plus, Minus, Eye, Globe, LifeBuoy, Award, Briefcase, Shield, HardDrive, Layers, PenTool
} from 'lucide-react';

// Importations des composants partagés
// Layout Components
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { ViewSelector } from '@layout/ViewSelector';
import { MultiTabContainer } from '@layout/MultiTabContainer';

// Form Components
import { SearchInput } from '@forms/SearchInput';
import { AppointmentForm } from '@forms/AppointmentForm';

// Data Display Components
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import { DynamicBadge } from '@data-display/DynamicBadge';
import FilterableTable from '@data-display/FilterableTable';

// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import FloatingActionButton from '@buttons/FloatingActionButton';

// Panel Components
import { SidePanel } from '@panels/SidePanel';
import ExpandablePanel from '@panels/ExpandablePanel';

// Modal Components
import { Modal } from '@modals/Modal';

// Card Components
import { CenterCard } from '@cards/CenterCard';
import { PatientCard } from '@cards/PatientCard';
import { ConsultantCard } from '@cards/ConsultantCard';

// Drag & Drop
import { DropZone } from '@dragdrop/DropZone';

// Teleconsultation Components
import { VideoConsultation } from '@teleconsult/VideoConsultation';
import { ConsultationTimer } from '@teleconsult/ConsultationTimer';

// Common UI Components
import { ConnectionStatus } from '@common/ConnectionStatus';
import { ThemeSwitcher } from '@common/ThemeSwitcher';

// Feedback Components
import { AlertNotification } from '@feedback/AlertNotification';
import { ToastNotification } from '@feedback/ToastNotification';

// Medical Components
import { VitalSigns } from '@medical/VitalSigns';
import { PatientRecord } from '@medical/PatientRecord';
import { MedicalHistory } from '@medical/MedicalHistory';
import { PatientStatusTracker } from '@medical/PatientStatusTracker';
import { UrgencyLevelIndicator } from '@medical/UrgencyLevelIndicator';
import { MedicalDataTimeline } from '@medical/MedicalDataTimeline';
import { PatientPriorityManager } from '@medical/PatientPriorityManager';

// Calendar Components
import { AppointmentCalendar } from '@calendar/AppointmentCalendar';

// Patient Management
import { WaitingQueue } from '@patient/WaitingQueue';

// Facility Components
import { ConsultationRooms } from '@facility/ConsultationRooms';

// Document Components
import { PatientDocuments } from '@documents/PatientDocuments';
import { DocumentValidator } from '@documents/DocumentValidator';

// Dashboard Components
import { ActiveConsultations } from '@dashboard/ActiveConsultations';

// Scheduling Components
import { ConflictManager } from '@scheduling/ConflictManager';

// Communication Components
import ChatInterface from '@communication/ChatInterface';

// Navigation Components
import { RoleBasedActionMenu } from '@navigation/RoleBasedActionMenu';
import { StepProgressIndicator } from '@navigation/StepProgressIndicator';

// System Components
import UserActivityLog from '@system/UserActivityLog';
import ConnectionStatusMonitor from '@system/ConnectionStatusMonitor';
import SynchronizationQueue from '@system/SynchronizationQueue';
import OfflineModeManager from '@system/OfflineModeManager';

// Tracking Components
import HistoryTracker from '@tracking/HistoryTracker';

// Composant principal du monitoring des téléconsultations
const SupervisionDashboard = () => {
  // États
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'map', 'centers', 'stats'
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showPiP, setShowPiP] = useState(false);
  const [pipConsultation, setPipConsultation] = useState(null);

  // Données simulées des centres
  const centers = [
    { 
      id: 1, 
      name: "Clinique Centrale - Yaoundé", 
      code: "CCY", 
      type: "Centre Principal",
      location: { lat: 3.866667, lng: 11.516667 },
      status: "online",
      activeConsultations: 12,
      waitingPatients: 8,
      technicalIssues: 1,
      avgWaitTime: 22,
      doctorOccupationRate: 85,
      networkQuality: 92,
      connectionSpeed: "4.2 Mbps"
    },
    { 
      id: 2, 
      name: "Clinique Saint Jean - Yaoundé", 
      code: "CSJ-YDE", 
      type: "Centre Secondaire",
      location: { lat: 3.848056, lng: 11.502222 },
      status: "online",
      activeConsultations: 5,
      waitingPatients: 3,
      technicalIssues: 0,
      avgWaitTime: 15,
      doctorOccupationRate: 60,
      networkQuality: 88,
      connectionSpeed: "3.8 Mbps"
    },
    { 
      id: 3, 
      name: "Centre Médical - Douala", 
      code: "CMD-DLA", 
      type: "Centre Secondaire",
      location: { lat: 4.05, lng: 9.7 },
      status: "online",
      activeConsultations: 8,
      waitingPatients: 6,
      technicalIssues: 2,
      avgWaitTime: 28,
      doctorOccupationRate: 90,
      networkQuality: 76,
      connectionSpeed: "2.9 Mbps"
    },
    { 
      id: 4, 
      name: "Centre de Santé - Bafoussam", 
      code: "CSB-BFM", 
      type: "Centre Secondaire",
      location: { lat: 5.47, lng: 10.42 },
      status: "offline",
      activeConsultations: 0,
      waitingPatients: 4,
      technicalIssues: 1,
      avgWaitTime: 0,
      doctorOccupationRate: 0,
      networkQuality: 0,
      connectionSpeed: "0 Mbps"
    },
    { 
      id: 5, 
      name: "Clinique Nord - Garoua", 
      code: "CNG-GAR", 
      type: "Centre Secondaire",
      location: { lat: 9.3, lng: 13.4 },
      status: "degraded",
      activeConsultations: 3,
      waitingPatients: 2,
      technicalIssues: 1,
      avgWaitTime: 32,
      doctorOccupationRate: 45,
      networkQuality: 62,
      connectionSpeed: "1.8 Mbps"
    }
  ];

  // Données simulées des consultations
  const consultations = [
    {
      id: 1,
      centerId: 1,
      patientName: "Kamga Jean",
      doctorName: "Dr. Nana",
      specialty: "Cardiologie",
      startTime: "09:15",
      duration: 22, // en minutes
      status: "active", // active, waiting, completed, technical_issue
      videoQuality: "good", // good, degraded, audio_only, disconnected
      patientLocation: "Yaoundé",
      urgencyLevel: 3,
      notes: "Contrôle post-opératoire"
    },
    {
      id: 2,
      centerId: 1,
      patientName: "Mbarga Marie",
      doctorName: "Dr. Tamo",
      specialty: "Pédiatrie",
      startTime: "09:05",
      duration: 32,
      status: "active",
      videoQuality: "degraded",
      patientLocation: "Yaoundé",
      urgencyLevel: 2,
      notes: "Problème de connexion intermittent"
    },
    {
      id: 3,
      centerId: 2,
      patientName: "Kouam Pierre",
      doctorName: "Dr. Nana",
      specialty: "Cardiologie",
      startTime: "09:25",
      duration: 15,
      status: "active",
      videoQuality: "good",
      patientLocation: "Mbalmayo",
      urgencyLevel: 4,
      notes: "Patient présentant des signes d'arythmie"
    },
    {
      id: 4,
      centerId: 2,
      patientName: "Fouda Alice",
      doctorName: "Dr. Sob",
      specialty: "Dermatologie",
      startTime: "09:10",
      duration: 0,
      status: "waiting",
      videoQuality: "not_started",
      patientLocation: "Mfou",
      urgencyLevel: 1,
      notes: "Première consultation"
    },
    {
      id: 5,
      centerId: 3,
      patientName: "Amougou Paul",
      doctorName: "Dr. Tamo",
      specialty: "Pédiatrie",
      startTime: "08:55",
      duration: 40,
      status: "active",
      videoQuality: "audio_only",
      patientLocation: "Douala",
      urgencyLevel: 3,
      notes: "Consultation en mode audio uniquement due à une faible bande passante"
    },
    {
      id: 6,
      centerId: 3,
      patientName: "Ndongo Anna",
      doctorName: "Dr. Essama",
      specialty: "Pédiatrie",
      startTime: "09:20",
      duration: 18,
      status: "technical_issue",
      videoQuality: "disconnected",
      patientLocation: "Édéa",
      urgencyLevel: 5,
      notes: "Urgence - Connexion perdue à 09:38, tentative de reconnexion en cours"
    },
    {
      id: 7,
      centerId: 5,
      patientName: "Meka Joseph",
      doctorName: "Dr. Sob",
      specialty: "Dermatologie",
      startTime: "09:00",
      duration: 35,
      status: "active",
      videoQuality: "degraded",
      patientLocation: "Garoua",
      urgencyLevel: 2,
      notes: "Qualité vidéo faible, diagnostic visuel difficile"
    }
  ];

  // Données pour les statistiques
  const stats = {
    totalActiveConsultations: consultations.filter(c => c.status === "active").length,
    totalWaitingPatients: centers.reduce((sum, center) => sum + center.waitingPatients, 0),
    totalTechnicalIssues: centers.reduce((sum, center) => sum + center.technicalIssues, 0),
    avgConsultationTime: 28, // en minutes
    avgNetworkQuality: Math.round(centers.filter(c => c.status !== "offline").reduce((sum, center) => sum + center.networkQuality, 0) / centers.filter(c => c.status !== "offline").length),
    totalCenters: centers.length,
    onlineCenters: centers.filter(c => c.status === "online").length,
    degradedCenters: centers.filter(c => c.status === "degraded").length,
    offlineCenters: centers.filter(c => c.status === "offline").length
  };

  // Données pour les spécialités
  const specialties = [
    { name: "Cardiologie", activeConsultations: 2, avgDuration: 18, waitTime: 20 },
    { name: "Pédiatrie", activeConsultations: 3, avgDuration: 32, waitTime: 15 },
    { name: "Dermatologie", activeConsultations: 2, avgDuration: 26, waitTime: 18 },
    { name: "Neurologie", activeConsultations: 0, avgDuration: 0, waitTime: 0 },
    { name: "Généraliste", activeConsultations: 0, avgDuration: 0, waitTime: 0 }
  ];

  // Fonctions pour les notifications et mises à jour en temps réel
  useEffect(() => {
    // Simuler des mises à jour en temps réel toutes les 30 secondes
    const updateInterval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulation d'une mise à jour aléatoire des données
      if (Math.random() > 0.7) {
        showSystemNotification("Mise à jour des données");
      }
    }, 30000);
    
    return () => clearInterval(updateInterval);
  }, []);
  
  // Fonction pour afficher une notification système
  const showSystemNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Faire disparaître la notification après 5 secondes
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage("");
    }, 5000);
  };
  
  // Fonction pour basculer en mode hors ligne
  const toggleOfflineMode = () => {
    setIsOnline(!isOnline);
    showSystemNotification(isOnline ? 
      "Mode hors ligne activé. Les données seront synchronisées à la reconnexion." : 
      "Mode en ligne activé. Synchronisation des données en cours...");
  };
  
  // Fonction pour ouvrir la vue Picture-in-Picture
  const openPiPView = (consultation) => {
    setPipConsultation(consultation);
    setShowPiP(true);
  };
  
  // Fonction pour fermer la vue Picture-in-Picture
  const closePiPView = () => {
    setShowPiP(false);
    setPipConsultation(null);
  };

  // Fonction pour obtenir les consultations d'un centre spécifique
  const getCenterConsultations = (centerId) => {
    return consultations.filter(c => c.centerId === centerId);
  };

  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "degraded": return "bg-yellow-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Fonction pour obtenir la couleur en fonction de la qualité vidéo
  const getVideoQualityColor = (quality) => {
    switch (quality) {
      case "good": return "text-green-500";
      case "degraded": return "text-yellow-500";
      case "audio_only": return "text-orange-500";
      case "disconnected": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  // Fonction pour obtenir l'icône en fonction de la qualité vidéo
  const getVideoQualityIcon = (quality) => {
    switch (quality) {
      case "good": return <Video className="text-green-500" />;
      case "degraded": return <Video className="text-yellow-500" />;
      case "audio_only": return <Phone className="text-orange-500" />;
      case "disconnected": return <VideoOff className="text-red-500" />;
      default: return <Clock className="text-gray-500" />;
    }
  };

  // Fonction pour obtenir la couleur en fonction du niveau d'urgence
  const getUrgencyColor = (level) => {
    const colors = {
      1: "bg-green-500",
      2: "bg-blue-500",
      3: "bg-yellow-500",
      4: "bg-orange-500",
      5: "bg-red-500"
    };
    return colors[level] || "bg-gray-500";
  };

  // Sélection d'un centre
  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
    setShowDetailPanel(true);
  };

  // Sélection d'une consultation
  const handleSelectConsultation = (consultation) => {
    setSelectedConsultation(consultation);
  };

  // Créer les items du menu pour la barre latérale
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: true },
    { icon: <Globe size={18} />, label: "Centres", path: "#" },
    { icon: <Users size={18} />, label: "Médecins", path: "#" },
    { icon: <Calendar size={18} />, label: "Planification", path: "#" },
    { icon: <Activity size={18} />, label: "Consultations", path: "#" },
    { icon: <Server size={18} />, label: "Infrastructure", path: "#" },
    { icon: <BarChart2 size={18} />, label: "Statistiques", path: "#" },
    { icon: <ClipboardList size={18} />, label: "Rapports", path: "#" }
  ];

  // Créer les items du menu pour le bas de la barre latérale
  const bottomMenuItems = [
    { icon: <MessageCircle size={18} />, label: "Messages", path: "#" },
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Notification */}
      {showNotification && (
        <AlertNotification 
          message={notificationMessage}
          type="info"
          isVisible={showNotification}
          onClose={() => setShowNotification(false)}
          position="top-right"
          darkMode={darkMode}
        />
      )}
      
      {/* Vue Picture-in-Picture */}
      {showPiP && pipConsultation && (
        <div className="fixed bottom-4 right-4 w-64 bg-white rounded-lg shadow-lg z-40 overflow-hidden">
          <div className="bg-blue-600 text-white px-2 py-1 flex justify-between items-center">
            <span className="text-xs font-medium">{pipConsultation.patientName} - {pipConsultation.doctorName}</span>
            <button onClick={closePiPView} className="text-white hover:text-gray-200">
              <X size={16} />
            </button>
          </div>
          <div className="p-2">
            <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
              <div className="text-center">
                <Video size={32} className="mx-auto mb-1 text-gray-500" />
                <span className="text-xs text-gray-500">Simulation de vidéo</span>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs">
                <span className="font-medium">{pipConsultation.specialty}</span>
                <div className="text-gray-500">Démarré à {pipConsultation.startTime}</div>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 bg-red-100 text-red-800 rounded">
                  <Phone size={12} />
                </button>
                <button className="p-1 bg-blue-100 text-blue-800 rounded">
                  <MessageSquare size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation latérale */}
      <Sidebar 
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* En-tête */}
        <Header
          title="Monitoring des Téléconsultations"
          subtitle="Centre Principal - Yaoundé"
          centerInfo={{
            name: "Centre Principal - Yaoundé",
            code: "CCY",
            type: "Principal"
          }}
          isOnline={isOnline}
          bandwidth={4.5}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{
            initials: "SP",
            name: "Sophie Priso"
          }}
          notificationCount={2}
          extraHeaderItems={
            <div className="flex items-center space-x-2">
              <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded-md flex items-center">
                <RefreshCw size={12} className="mr-1" /> Actualiser
              </button>
              <button className="px-2 py-1 bg-purple-600 text-white text-xs rounded-md flex items-center">
                <BarChart2 size={12} className="mr-1" /> Tableau analytique
              </button>
            </div>
          }
        />
        
        {/* Onglets de navigation */}
        <MultiTabContainer
          tabs={[
            {
              id: 'overview',
              label: 'Vue Globale',
              icon: <Eye size={16} />,
              content: null,
              active: activeTab === 'overview'
            },
            {
              id: 'map',
              label: 'Carte',
              icon: <Map size={16} />,
              content: null,
              active: activeTab === 'map'
            },
            {
              id: 'centers',
              label: 'Centres',
              icon: <Globe size={16} />,
              content: null,
              active: activeTab === 'centers'
            },
            {
              id: 'stats',
              label: 'Statistiques',
              icon: <PieChart size={16} />,
              content: null,
              active: activeTab === 'stats'
            }
          ]}
          defaultTabId="overview"
          onChange={setActiveTab}
        />
        
        {/* Contenu principal basé sur l'onglet actif */}
        <div className="flex-1 overflow-auto p-3">
          
          {/* Vue Globale */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              {/* Statistiques globales */}
              <StatCardGroup>
                <StatCard
                  title="Consultations Actives"
                  value={stats.totalActiveConsultations}
                  icon={<Activity size={20} />}
                  iconBgColor="bg-blue-100"
                  iconColor="text-blue-600"
                  darkMode={darkMode}
                />
                
                <StatCard
                  title="Patients en Attente"
                  value={stats.totalWaitingPatients}
                  icon={<Clock size={20} />}
                  iconBgColor="bg-purple-100"
                  iconColor="text-purple-600"
                  darkMode={darkMode}
                />
                
                <StatCard
                  title="Problèmes Techniques"
                  value={stats.totalTechnicalIssues}
                  icon={<AlertTriangle size={20} />}
                  iconBgColor="bg-yellow-100"
                  iconColor="text-yellow-600"
                  darkMode={darkMode}
                />
                
                <StatCard
                  title="Qualité Réseau Moyenne"
                  value={stats.avgNetworkQuality}
                  suffix="%"
                  icon={<Zap size={20} />}
                  iconBgColor="bg-green-100"
                  iconColor="text-green-600"
                  darkMode={darkMode}
                />
              </StatCardGroup>
              
              {/* Liste des consultations actives */}
              <ActiveConsultations 
                consultations={consultations
                  .filter(c => c.status === "active" || c.status === "technical_issue")
                  .map(c => ({
                    id: c.id,
                    patient: c.patientName,
                    doctor: c.doctorName,
                    room: centers.find(center => center.id === c.centerId)?.code || "",
                    startTime: c.startTime,
                    duration: c.duration,
                    isPaused: c.videoQuality === "disconnected"
                  }))}
                onEndConsultation={(id) => console.log("End consultation", id)}
                onPauseConsultation={(id) => console.log("Pause consultation", id)}
                onResumeConsultation={(id) => console.log("Resume consultation", id)}
                onViewDetails={(id) => console.log("View details", id)}
                darkMode={darkMode}
              />
              
              {/* Aperçu des centres */}
              <div className="grid grid-cols-3 gap-3">
                {centers.map(center => (
                  <CenterCard
                    key={center.id}
                    center={{
                      id: center.id,
                      name: center.name,
                      code: center.code,
                      type: center.type,
                      status: center.status,
                      bandwidth: parseFloat(center.connectionSpeed),
                      waitingPatients: center.waitingPatients,
                      consultants: center.activeConsultations,
                      alertLevel: center.technicalIssues > 0 ? "issue" : 
                                  center.doctorOccupationRate > 85 ? "warning" : "normal",
                      lastUpdated: lastUpdate.toLocaleTimeString()
                    }}
                    darkMode={darkMode}
                    onViewDetails={() => handleSelectCenter(center)}
                    onOpenChat={() => setShowChat(true)}
                    onMoreOptions={() => console.log("More options", center.id)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Vue Carte */}
          {activeTab === 'map' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-medium">Carte des Centres</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center">
                    <Plus size={12} className="mr-1" /> Zoom In
                  </button>
                  <button className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs flex items-center">
                    <Minus size={12} className="mr-1" /> Zoom Out
                  </button>
                  <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs flex items-center">
                    <RefreshCw size={12} className="mr-1" /> Actualiser
                  </button>
                </div>
              </div>
              
              {/* Carte simulée */}
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative">
                <div className="absolute inset-0 p-4">
                  {/* C'est une simulation de carte - dans une vraie application, vous utiliseriez une bibliothèque comme Leaflet ou Google Maps */}
                  {centers.map(center => (
                    <div 
                      key={center.id}
                      className="absolute"
                      style={{ 
                        left: `${(center.location.lng - 9) * 15}%`, 
                        top: `${100 - (center.location.lat - 3) * 20}%`
                      }}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full ${
                          center.status === 'online' ? 'bg-green-500' : 
                          center.status === 'degraded' ? 'bg-yellow-500' : 
                          'bg-red-500'
                        } text-white flex items-center justify-center font-bold text-xs relative cursor-pointer hover:shadow-lg transition-shadow`}
                        onClick={() => handleSelectCenter(center)}
                      >
                        {center.activeConsultations}
                        {center.technicalIssues > 0 && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                            {center.technicalIssues}
                          </div>
                        )}
                      </div>
                      <div className="mt-1 bg-white rounded px-1 py-0.5 text-xs font-medium shadow text-center">
                        {center.code}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-gray-400 z-0">
                  Carte du Cameroun (simulation)
                </div>
              </div>
              
              
              
              {/* Légende de la carte */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs">Centre en ligne</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span className="text-xs">Service dégradé</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-xs">Hors ligne</span>
                  </div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
                  </div>
                  <button 
                    className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded flex items-center"
                    onClick={() => showSystemNotification("Données synchronisées")}
                  >
                    <RefreshCw size={12} className="mr-1" /> Temps réel
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Vue Centres */}
          {activeTab === 'centers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Centres de Téléconsultation</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs">{stats.onlineCenters} En ligne</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">{stats.degradedCenters} Dégradés</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-xs">{stats.offlineCenters} Hors ligne</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {centers.map(center => (
                  <ExpandablePanel
                    key={center.id}
                    title={center.name}
                    icon={<div className={`w-3 h-3 rounded-full ${getStatusColor(center.status)}`}></div>}
                    initiallyExpanded={true}
                    headerRightContent={
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                          {center.code}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          {center.type}
                        </span>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-100 rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Consultations actives</span>
                          <span className="font-medium">{center.activeConsultations}</span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              center.doctorOccupationRate > 90 ? 'bg-red-500' : 
                              center.doctorOccupationRate > 70 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`} 
                            style={{ width: `${center.doctorOccupationRate}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 flex justify-between items-center text-xs">
                          <span>Occupation</span>
                          <span className={`font-medium ${
                            center.doctorOccupationRate > 90 ? 'text-red-500' : 
                            center.doctorOccupationRate > 70 ? 'text-yellow-500' : 
                            'text-green-500'
                          }`}>{center.doctorOccupationRate}%</span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Qualité réseau</span>
                          <span className="font-medium">{center.networkQuality}%</span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              center.networkQuality < 60 ? 'bg-red-500' : 
                              center.networkQuality < 80 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`} 
                            style={{ width: `${center.networkQuality}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 flex justify-between items-center text-xs">
                          <span>Vitesse</span>
                          <span className={`font-medium ${
                            center.networkQuality < 60 ? 'text-red-500' : 
                            center.networkQuality < 80 ? 'text-yellow-500' : 
                            'text-green-500'
                          }`}>{center.connectionSpeed}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Clock size={14} className="text-gray-500 mr-1" />
                        <span className="text-xs">Temps d'attente moyen: <strong>{center.avgWaitTime} min</strong></span>
                      </div>
                      <div className="flex items-center">
                        <AlertTriangle size={14} className="text-yellow-500 mr-1" />
                        <span className="text-xs">Problèmes: <strong className={center.technicalIssues > 0 ? 'text-red-600' : ''}>{center.technicalIssues}</strong></span>
                      </div>
                    </div>
                    
                    {/* Liste des consultations du centre */}
                    {getCenterConsultations(center.id).length > 0 ? (
                      <div className="mb-2">
                        <h4 className="text-xs font-medium mb-1">Consultations ({getCenterConsultations(center.id).length})</h4>
                        <div className={`max-h-32 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                          {getCenterConsultations(center.id).map(consultation => (
                            <PatientCard
                              key={consultation.id}
                              patient={{
                                id: consultation.id,
                                name: consultation.patientName,
                                age: 0, // Non spécifié dans les données
                                gender: 'M', // Non spécifié dans les données
                                urgency: consultation.urgencyLevel,
                                specialty: consultation.specialty,
                                center: centers.find(c => c.id === consultation.centerId)?.code || "",
                                waitTime: consultation.duration,
                                doctor: consultation.doctorName,
                                arrivalTime: consultation.startTime,
                                notes: consultation.notes
                              }}
                              darkMode={darkMode}
                              onSelect={() => handleSelectConsultation(consultation)}
                              onAdjustUrgency={() => console.log("Adjust urgency", consultation.id)}
                              onDoctorView={() => console.log("Doctor view", consultation.id)}
                              onMoreOptions={() => console.log("More options", consultation.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-xs text-gray-500 py-2">
                        Aucune consultation active
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-1 mt-2">
                      <ActionButton
                        label="Détails"
                        icon={<Eye size={12} />}
                        variant="info"
                        size="xs"
                        onClick={() => handleSelectCenter(center)}
                      />
                      <ActionButton
                        label="Contacter"
                        icon={<MessageCircle size={12} />}
                        variant="success"
                        size="xs"
                        onClick={() => setShowChat(true)}
                      />
                      <ActionButton
                        icon={<MoreVertical size={12} />}
                        label=""
                        variant="secondary"
                        size="xs"
                        onClick={() => console.log("More options", center.id)}
                      />
                    </div>
                  </ExpandablePanel>
                ))}
              </div>
            </div>
          )}
          
          {/* Vue Statistiques */}
          {activeTab === 'stats' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Statistiques des Consultations</h2>
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs flex items-center">
                    Aujourd'hui
                  </button>
                  <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs flex items-center">
                    Cette semaine
                  </button>
                  <button className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs flex items-center">
                    Ce mois
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                  <h3 className="text-sm font-medium mb-2">Consultations par Spécialité</h3>
                  <FilterableTable
                    columns={[
                      {
                        id: 'specialty',
                        header: 'Spécialité',
                        accessor: (row) => row.name,
                        sortable: true,
                        filterable: true
                      },
                      {
                        id: 'consultations',
                        header: 'Consultations',
                        accessor: (row) => row.activeConsultations,
                        sortable: true
                      },
                      {
                        id: 'avgDuration',
                        header: 'Durée Moy.',
                        accessor: (row) => row.avgDuration > 0 ? `${row.avgDuration} min` : '-',
                        sortable: true
                      },
                      {
                        id: 'waitTime',
                        header: 'Attente Moy.',
                        accessor: (row) => row.waitTime > 0 ? `${row.waitTime} min` : '-',
                        sortable: true
                      }
                    ]}
                    data={specialties}
                    emptyMessage="Aucune donnée disponible"
                  />
                </div>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                  <h3 className="text-sm font-medium mb-2">Performance du Réseau</h3>
                  {/* Graphique fictif de performance réseau */}
                  <div className="bg-gray-100 rounded-lg h-48 p-2 flex items-center justify-center">
                    <div className="text-gray-400">
                      Graphique de performance réseau (simulé)
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-blue-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Latence moyenne</div>
                      <div className="font-medium">230 ms</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Débit moyen</div>
                      <div className="font-medium">3.5 Mbps</div>
                    </div>
                    <div className="bg-purple-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Stabilité</div>
                      <div className="font-medium">92%</div>
                    </div>
                  </div>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                  <h3 className="text-sm font-medium mb-2">Statistiques des Centres</h3>
                  {/* Graphique fictif des performances des centres */}
                  <div className="bg-gray-100 rounded-lg h-48 p-2 flex items-center justify-center">
                    <div className="text-gray-400">
                      Graphique des performances par centre (simulé)
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-green-100 p-2 rounded">
                      <div className="text-xs text-gray-600">En ligne</div>
                      <div className="font-medium">{stats.onlineCenters}/{stats.totalCenters}</div>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Problèmes</div>
                      <div className="font-medium">{stats.totalTechnicalIssues}</div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Consultations</div>
                      <div className="font-medium">{stats.totalActiveConsultations}</div>
                    </div>
                  </div>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                  <h3 className="text-sm font-medium mb-2">Consultations par Heure</h3>
                  {/* Graphique fictif des consultations par heure */}
                  <div className="bg-gray-100 rounded-lg h-48 p-2 flex items-center justify-center">
                    <div className="text-gray-400">
                      Graphique des consultations par heure (simulé)
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-purple-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Heure de pointe</div>
                      <div className="font-medium">09:00 - 10:00</div>
                    </div>
                    <div className="bg-blue-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Temps moyen</div>
                      <div className="font-medium">{stats.avgConsultationTime} min</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded">
                      <div className="text-xs text-gray-600">Attente moyenne</div>
                      <div className="font-medium">18 min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Panel latéral de détail d'un centre */}
      {showDetailPanel && selectedCenter && (
        <SidePanel
          title="Détails du centre"
          isOpen={showDetailPanel}
          onClose={() => setShowDetailPanel(false)}
          darkMode={darkMode}
          width="w-72"
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full ${getStatusColor(selectedCenter.status)} bg-opacity-20`}>
              <Globe size={20} className={getStatusColor(selectedCenter.status)} />
            </div>
            <div className="ml-2">
              <h4 className="font-bold text-sm">{selectedCenter.name}</h4>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">{selectedCenter.type}</span>
                <span className="px-1 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  {selectedCenter.code}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500">Connexion</p>
              <p className="font-medium text-sm flex items-center">
                <Zap size={14} className="mr-1 text-green-500" />
                {selectedCenter.connectionSpeed}
              </p>
            </div>
            <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500">Qualité</p>
              <p className="font-medium text-sm">{selectedCenter.networkQuality}%</p>
            </div>
            <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500">Consultations</p>
              <p className="font-medium text-sm">{selectedCenter.activeConsultations}</p>
            </div>
            <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className="text-xs text-gray-500">En attente</p>
              <p className="font-medium text-sm">{selectedCenter.waitingPatients}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1">Actions rapides</h4>
            <ButtonGroup>
              <ActionButton
                label="Contacter le centre"
                icon={<MessageCircle size={12} />}
                variant="primary"
                size="xs"
                onClick={() => setShowChat(true)}
              />
              <ActionButton
                label="Actualiser"
                icon={<RefreshCw size={12} />}
                variant="success"
                size="xs"
                onClick={() => console.log("Refresh", selectedCenter.id)}
              />
              <ActionButton
                label="Redistribuer patients"
                icon={<ArrowRight size={12} />}
                variant="info"
                size="xs"
                onClick={() => console.log("Redistribute", selectedCenter.id)}
              />
              <ActionButton
                label="Rappel automatique"
                icon={<Phone size={12} />}
                variant="warning"
                size="xs"
                onClick={() => console.log("Auto callback", selectedCenter.id)}
              />
            </ButtonGroup>
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1">Problèmes techniques</h4>
            {selectedCenter.technicalIssues > 0 ? (
              <div className={`p-2 rounded-md ${darkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-100'} text-red-800 space-y-2`}>
                <div className="flex items-start">
                  <AlertOctagon size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium">Connexion instable - Salle A</p>
                    <p className="text-xs">Fluctuations de bande passante, consultation en mode audio uniquement</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs">09:38</span>
                      <button className="px-1 py-0.5 bg-red-200 text-red-800 rounded text-xs">
                        Intervenir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                <p className="text-xs text-gray-500">Aucun problème technique signalé</p>
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1">Consultations actives</h4>
            {getCenterConsultations(selectedCenter.id).length > 0 ? (
              <div className={`max-h-48 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
                {getCenterConsultations(selectedCenter.id).map(consultation => (
                  <PatientCard
                    key={consultation.id}
                    patient={{
                      id: consultation.id,
                      name: consultation.patientName,
                      age: 0, // Non spécifié dans les données
                      gender: 'M', // Non spécifié dans les données
                      urgency: consultation.urgencyLevel,
                      specialty: consultation.specialty,
                      center: centers.find(c => c.id === consultation.centerId)?.code || "",
                      waitTime: consultation.duration,
                      doctor: consultation.doctorName,
                      arrivalTime: consultation.startTime,
                      notes: consultation.notes
                    }}
                    darkMode={darkMode}
                    onSelect={() => handleSelectConsultation(consultation)}
                    onAdjustUrgency={() => console.log("Adjust urgency", consultation.id)}
                    onDoctorView={() => console.log("Doctor view", consultation.id)}
                    onMoreOptions={() => console.log("More options", consultation.id)}
                  />
                ))}
              </div>
            ) : (
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-center`}>
                <p className="text-xs text-gray-500">Aucune consultation active</p>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-xs mb-1">Commentaires</h4>
            <textarea 
              className={`w-full p-2 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} min-h-24`}
              placeholder="Ajouter des notes sur ce centre..."
            ></textarea>
          </div>
          
          <div className="mt-3 flex justify-between">
            <ActionButton
              label="Historique"
              icon={<Eye size={12} />}
              variant="secondary"
              size="xs"
              onClick={() => console.log("History", selectedCenter.id)}
            />
            <ActionButton
              label="Envoyer message"
              icon={<Send size={12} />}
              variant="primary"
              size="xs"
              onClick={() => setShowChat(true)}
            />
          </div>
        </SidePanel>
      )}
      
      {/* Panel de chat avec les centres */}
      {showChat && (
        <ChatInterface
          messages={[
            {
              id: 1,
              sender: "Sophie Priso",
              content: "Pouvez-vous vérifier la connexion au Centre Médical de Douala? Nous avons une urgence.",
              timestamp: "09:20",
              isCurrentUser: true
            },
            {
              id: 2,
              sender: "Centre Médical - Douala",
              content: "Nous sommes en train d'intervenir pour résoudre le problème de connexion. Nous devrions être de retour en ligne dans quelques minutes.",
              timestamp: "09:25",
              isCurrentUser: false
            },
            {
              id: 3,
              sender: "Sophie Priso",
              content: "Merci pour l'update. Tenez-moi informée.",
              timestamp: "09:26",
              isCurrentUser: true
            }
          ]}
          onSendMessage={(message) => console.log("Send message", message)}
          title="Messages"
          isCollapsible={true}
          isFloating={true}
        />
      )}
    </div>
  );
};

export default SupervisionDashboard;