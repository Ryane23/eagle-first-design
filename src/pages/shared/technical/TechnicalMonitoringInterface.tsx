import React, { useState, useEffect, useRef } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, ChevronDown, MoreVertical, RefreshCw, Monitor, Minimize, Maximize, Clock, CheckCircle, Edit, User, ChevronRight, ArrowRight, MapPin, Zap, BarChart2, Phone, Clipboard, Headphones, Share2, Grid, List, Layout, AlertOctagon, Sliders, Send, RotateCcw, MessageCircle, Power, Database, Video, VideoOff, Mic, MicOff, Timer, Heart, Thermometer, Droplet, Plus, Archive, FilePlus, Paperclip, Save, PenTool, Eye, Layers, PieChart, BarChart, DownloadCloud, UploadCloud, Volume2, VolumeX, ToggleLeft, ToggleRight, PhoneCall, PhoneOff, Radio, Circle
} from 'lucide-react';

// Importation des composants partagés
// Layout Components
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { ViewSelector } from '@layout/ViewSelector';
import { MultiTabContainer } from '@layout/MultiTabContainer';

// Form Components
import { SearchInput } from '@forms/SearchInput';

// Data Display Components
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import DynamicBadge from '@data-display/DynamicBadge';
import FilterableTable from '@data-display/FilterableTable';

// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';

// Panel Components
import { SidePanel } from '@panels/SidePanel';

// Modal Components
import { Modal } from '@modals/Modal';

// Card Components
import { CenterCard } from '@cards/CenterCard';
import { PatientCard } from '@cards/PatientCard';
import { ConsultantCard } from '@cards/ConsultantCard';

// Drag & Drop
import { DropZone } from '@dragdrop/DropZone';

// Teleconsultation
import { VideoConsultation } from '@teleconsult/VideoConsultation';
import { ConsultationTimer } from '@teleconsult/ConsultationTimer';

// Common Components
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Feedback Components
import { AlertNotification } from '@feedback/AlertNotification';
import ToastNotification from '@feedback/ToastNotification';

// Medical Components
import { VitalSigns } from '@medical/VitalSigns';
import { PatientRecord } from '@medical/PatientRecord';

// Calendar Components
import { AppointmentCalendar } from '@calendar/AppointmentCalendar';

// Patient Management
import { WaitingQueue } from '@patient/WaitingQueue';

// Facility Components
import { ConsultationRooms } from '@facility/ConsultationRooms';

// Dashboard Components
import { ActiveConsultations } from '@dashboard/ActiveConsultations';

// System Components
import SynchronizationQueue from '@system/SynchronizationQueue';
import ConnectionStatusMonitor from '@system/ConnectionStatusMonitor';

// Shared Modules
import { 
  getUrgencyColor, 
  getStatusBadgeVariant 
} from '@utils/statusUtils';
import { formatElapsedTime } from '@formatters/timeFormatter';
import { 
  sortPatientsByUrgency,
  sortPatientsByWaitTime, 
  sortPatientsByName 
} from '@sorters/patientSorter';
import { filterPatientsByStatus } from '@filters/patientFilters';
import { URGENCY_LEVELS } from '@config/urgencyLevels';
import { 
  PATIENT_STATUS, 
  PERFORMANCE_THRESHOLDS 
} from '@constants';
import { useConnectionStatus } from '@hooks/useConnectionStatus';
import { useNotification } from '@hooks/useNotification';
import { notificationService } from '@services/notificationService';
import type { 
  Center, 
  Patient, 
  Stats 
} from '@types';

const TechnicalMonitoringInterface = () => {
  // États (state)
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'ongoing', 'problems', 'offline'
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showTechnicalPanel, setShowTechnicalPanel] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ title: "", message: "", type: "info" });
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [showPiP, setShowPiP] = useState(false);
  const [pipConsultation, setPipConsultation] = useState(null);
  const [enableSound, setEnableSound] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showStats, setShowStats] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('urgency');
  
  // Utilisation des hooks partagés
  const { addNotification, notifications } = useNotification();
  const { status: connectionStatus, toggleConnection } = useConnectionStatus();
  
  // Référence pour la notification sonore
  const audioRef = useRef(null);
  
  // Données simulées des consultations
  const consultations = [
    {
      id: 1,
      patientName: "Kamga Jean",
      patientAge: 45,
      patientGender: "M",
      doctorName: "Dr. Nana",
      specialty: "Cardiologie",
      startTime: "09:15",
      duration: 30,
      elapsedTime: 22,
      remainingTime: 8,
      status: "ongoing", // ongoing, problem, offline, completed
      connectionQuality: "good", // good, degraded, poor, offline
      videoEnabled: true,
      audioEnabled: true,
      connectionSpeed: "3.8 Mbps",
      urgencyLevel: 3,
      packetLoss: "0.2%",
      latency: "120ms",
      jitter: "8ms",
      networkStats: {
        history: [4.0, 3.9, 3.8, 3.7, 3.8, 3.9, 3.8],
        packetLossHistory: [0.1, 0.2, 0.2, 0.3, 0.2, 0.2, 0.2],
        latencyHistory: [110, 115, 118, 125, 122, 120, 120]
      },
      technicalNotes: [
        { time: "09:18", note: "Consultation démarrée sans problème", severity: "info" },
        { time: "09:26", note: "Légère diminution de qualité vidéo, auto-ajustement appliqué", severity: "warning" }
      ],
      deviceInfo: {
        camera: "Webcam HD (résolution: 1280x720)",
        microphone: "Microphone intégré",
        speaker: "Haut-parleurs intégrés",
        browser: "Chrome 122.0.6261.112",
        os: "Windows 10"
      }
    },
    {
      id: 2,
      patientName: "Mbarga Marie",
      patientAge: 28,
      patientGender: "F",
      doctorName: "Dr. Tamo",
      specialty: "Pédiatrie",
      startTime: "09:05",
      duration: 40,
      elapsedTime: 32,
      remainingTime: 8,
      status: "problem",
      connectionQuality: "degraded",
      videoEnabled: true,
      audioEnabled: true,
      connectionSpeed: "2.1 Mbps",
      urgencyLevel: 2,
      packetLoss: "1.8%",
      latency: "220ms",
      jitter: "15ms",
      networkStats: {
        history: [3.5, 3.2, 2.8, 2.4, 2.2, 2.1, 2.1],
        packetLossHistory: [0.4, 0.8, 1.2, 1.5, 1.8, 1.8, 1.8],
        latencyHistory: [150, 170, 190, 210, 220, 220, 220]
      },
      technicalNotes: [
        { time: "09:10", note: "Consultation démarrée sans problème", severity: "info" },
        { time: "09:15", note: "Diminution progressive de la qualité de connexion", severity: "warning" },
        { time: "09:25", note: "Passé en mode vidéo basse résolution", severity: "warning" }
      ],
      deviceInfo: {
        camera: "Webcam externe USB (résolution: 1920x1080)",
        microphone: "Casque USB",
        speaker: "Casque USB",
        browser: "Firefox 123.0",
        os: "macOS 12.6"
      }
    },
    {
      id: 3,
      patientName: "Kouam Pierre",
      patientAge: 62,
      patientGender: "M",
      doctorName: "Dr. Nana",
      specialty: "Cardiologie",
      startTime: "09:45",
      duration: 35,
      elapsedTime: 5,
      remainingTime: 30,
      status: "ongoing",
      connectionQuality: "good",
      videoEnabled: true,
      audioEnabled: true,
      connectionSpeed: "4.2 Mbps",
      urgencyLevel: 4,
      packetLoss: "0.1%",
      latency: "105ms",
      jitter: "5ms",
      networkStats: {
        history: [4.0, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2],
        packetLossHistory: [0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1],
        latencyHistory: [110, 108, 107, 106, 105, 105, 105]
      },
      technicalNotes: [
        { time: "09:45", note: "Consultation démarrée sans problème", severity: "info" }
      ],
      deviceInfo: {
        camera: "Webcam HD intégrée (résolution: 1280x720)",
        microphone: "Microphone intégré",
        speaker: "Haut-parleurs externes",
        browser: "Edge 122.0.2365.80",
        os: "Windows 11"
      }
    },
    {
      id: 4,
      patientName: "Fouda Alice",
      patientAge: 35,
      patientGender: "F",
      doctorName: "Dr. Sob",
      specialty: "Dermatologie",
      startTime: "09:10",
      duration: 25,
      elapsedTime: 25,
      remainingTime: 0,
      status: "completed",
      connectionQuality: "good",
      videoEnabled: true,
      audioEnabled: true,
      connectionSpeed: "3.5 Mbps",
      urgencyLevel: 1,
      packetLoss: "0.3%",
      latency: "130ms",
      jitter: "7ms",
      networkStats: {
        history: [3.4, 3.4, 3.5, 3.5, 3.5, 3.5, 3.5],
        packetLossHistory: [0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
        latencyHistory: [135, 132, 130, 130, 130, 130, 130]
      },
      technicalNotes: [
        { time: "09:12", note: "Consultation démarrée sans problème", severity: "info" },
        { time: "09:35", note: "Consultation terminée correctement", severity: "info" }
      ],
      deviceInfo: {
        camera: "Webcam Logitech C920 (résolution: 1920x1080)",
        microphone: "Microphone Blue Yeti",
        speaker: "Haut-parleurs intégrés",
        browser: "Chrome 122.0.6261.112",
        os: "Windows 10"
      }
    },
    {
      id: 5,
      patientName: "Ndongo Anna",
      patientAge: 7,
      patientGender: "F",
      doctorName: "Dr. Tamo",
      specialty: "Pédiatrie",
      startTime: "10:00",
      duration: 30,
      elapsedTime: 15,
      remainingTime: 15,
      status: "offline",
      connectionQuality: "offline",
      videoEnabled: false,
      audioEnabled: false,
      connectionSpeed: "0 Mbps",
      urgencyLevel: 5,
      packetLoss: "100%",
      latency: "∞",
      jitter: "∞",
      networkStats: {
        history: [3.8, 3.5, 2.8, 1.5, 0.8, 0.2, 0],
        packetLossHistory: [0.2, 0.5, 1.2, 5.5, 15.8, 75.2, 100],
        latencyHistory: [120, 145, 190, 350, 780, 1500, 0]
      },
      technicalNotes: [
        { time: "10:00", note: "Consultation démarrée sans problème", severity: "info" },
        { time: "10:08", note: "Qualité vidéo dégradée, bande passante réduite", severity: "warning" },
        { time: "10:12", note: "Passage en mode audio uniquement", severity: "warning" },
        { time: "10:15", note: "Connexion perdue, tentative de reconnexion", severity: "error" }
      ],
      deviceInfo: {
        camera: "Webcam intégrée",
        microphone: "Microphone intégré",
        speaker: "Haut-parleurs intégrés",
        browser: "Safari 16.3",
        os: "iOS 16.3"
      },
      reconnectAttempts: 3,
      lastReconnectTime: "10:18"
    }
  ];
  
  // Information sur le centre
  const centerInfo: Center = {
    id: '1',
    name: "Clinique Saint Jean - Yaoundé",
    code: "CSJ-YDE",
    type: "secondary",
    address: "Quartier Bastos, Yaoundé",
    phone: "+237 222 123 456"
  };
  
  // Statistiques
  const stats: Stats = {
    totalPatients: consultations.length,
    waitingPatients: consultations.filter(c => c.status === "ongoing").length,
    activeConsultations: consultations.filter(c => c.status === "ongoing").length,
    avgWaitTime: Math.round(consultations.filter(c => c.connectionQuality !== "offline").reduce((sum, c) => sum + parseFloat(c.connectionSpeed), 0) / consultations.filter(c => c.connectionQuality !== "offline").length * 10) / 10,
    urgentPatients: consultations.filter(c => c.urgencyLevel >= 4).length,
    completedToday: consultations.filter(c => c.status === "completed").length
  };
  
  // Données de performance du réseau
  const networkPerformance = {
    dailyReport: {
      avgSpeed: "3.7 Mbps",
      peakUsage: "08:30 - 11:30",
      totalData: "2.8 GB",
      connectionIssues: 7,
      successRate: "94.2%"
    },
    hourlyStats: [
      { hour: "8:00", speed: 3.8, issues: 1 },
      { hour: "9:00", speed: 3.5, issues: 3 },
      { hour: "10:00", speed: 3.2, issues: 2 },
      { hour: "11:00", speed: 3.6, issues: 1 },
      { hour: "12:00", speed: 3.9, issues: 0 }
    ]
  };
  
  // Fonction pour obtenir la couleur en fonction de la qualité de connexion
  const getConnectionQualityColor = (quality) => {
    switch (quality) {
      case "good": return "bg-green-500";
      case "degraded": return "bg-yellow-500";
      case "poor": return "bg-orange-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  // Fonction pour obtenir le texte de la qualité de connexion
  const getConnectionQualityText = (quality) => {
    switch (quality) {
      case "good": return "Bonne";
      case "degraded": return "Dégradée";
      case "poor": return "Faible";
      case "offline": return "Hors ligne";
      default: return "Inconnue";
    }
  };
  
  // Fonction pour obtenir la couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing": return "bg-green-100 text-green-800";
      case "problem": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-red-100 text-red-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    switch (status) {
      case "ongoing": return "En cours";
      case "problem": return "Problème";
      case "offline": return "Hors ligne";
      case "completed": return "Terminée";
      default: return status;
    }
  };
  
  // Fonction pour sélectionner une consultation
  const handleSelectConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setShowTechnicalPanel(true);
  };
  
  // Fonction pour basculer en mode hors ligne / en ligne
  const toggleOnlineMode = () => {
    if (isOnline) {
      // Passage en mode hors ligne
      setIsOnline(false);
      setOfflineQueue([
        { action: "update", consultationId: 1, field: "connectionQuality", value: "degraded", timestamp: new Date() },
        { action: "note", consultationId: 2, note: "Basculement en mode audio uniquement", severity: "warning", timestamp: new Date() },
        { action: "reconnect", consultationId: 5, timestamp: new Date() }
      ]);
      displayNotification("Mode hors ligne activé", "Les modifications seront synchronisées dès la reconnexion", "warning");
    } else {
      // Passage en mode en ligne
      setIsOnline(true);
      // Simuler la synchronisation
      displayNotification("Synchronisation en cours", `${offlineQueue.length} actions synchronisées avec le serveur`, "success");
      setOfflineQueue([]);
      setLastUpdate(new Date());
    }
  };
  
  // Fonction pour afficher une notification
  const displayNotification = (title, message, type = "info") => {
    addNotification({
      title,
      content: message,
      type,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    });
    
    // Jouer le son de notification si activé
    if (enableSound && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };
  
  // Fonction pour démarrer un appel de rappel automatique
  const initiateCallBack = (consultation) => {
    setReconnectAttempt(consultation.id);
    displayNotification(
      "Rappel automatique initié", 
      `Tentative de reconnexion avec ${consultation.patientName}`, 
      "info"
    );
    
    // Simuler un délai de reconnexion
    setTimeout(() => {
      // Simuler un échec de reconnexion
      displayNotification(
        "Échec de la reconnexion", 
        `Impossible de joindre ${consultation.patientName}. Nouvelle tentative dans 30 secondes.`, 
        "error"
      );
      
      // Simuler une deuxième tentative après un délai
      setTimeout(() => {
        // Simuler une reconnexion réussie
        setReconnectAttempt(null);
        displayNotification(
          "Reconnexion réussie", 
          `La connexion avec ${consultation.patientName} a été rétablie.`, 
          "success"
        );
      }, 5000);
    }, 3000);
  };
  
  // Afficher Picture-in-Picture
  const togglePiP = (consultation) => {
    if (showPiP && pipConsultation && pipConsultation.id === consultation.id) {
      setShowPiP(false);
      setPipConsultation(null);
    } else {
      setShowPiP(true);
      setPipConsultation(consultation);
    }
  };
  
  // Simule des mises à jour périodiques pour montrer les fonctionnalités en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Dans une application réelle, ceci serait remplacé par des WebSockets
      const now = new Date();
      setLastUpdate(now);
      
      // Simuler un problème aléatoire toutes les 20 secondes environ
      if (Math.random() > 0.95) {
        displayNotification(
          "Problème de connexion détecté", 
          "La qualité vidéo de la consultation avec Mbarga Marie s'est dégradée.", 
          "warning"
        );
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Configuration des items du menu latéral
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <AlertTriangle size={18} />, label: "Gestion des Urgences", path: "#", isActive: false },
    { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
    { icon: <FileText size={18} />, label: "Post Consultation", path: "#", isActive: false },
    { icon: <WifiOff size={18} />, label: "Mode hors ligne", path: "#", isActive: false },
    { icon: <Activity size={18} />, label: "Monitoring technique", path: "#", isActive: true }
  ];
  
  const bottomMenuItems = [
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];
  
  // Créer des onglets pour la vue multi-onglets
  const tabs = [
    { id: 'all', label: 'Toutes', content: <div>Toutes les consultations</div> },
    { id: 'ongoing', label: 'En cours', content: <div>Consultations en cours</div> },
    { id: 'problems', label: 'Problèmes', content: <div>Consultations avec problèmes</div> },
    { id: 'offline', label: 'Hors ligne', content: <div>Consultations hors ligne</div> }
  ];
  
  // Fonction de tri personnalisée pour les consultations
  const sortConsultations = (consultations, sortType) => {
    switch (sortType) {
      case 'urgency_desc':
        return sortPatientsByUrgency(consultations.map(c => ({ ...c, urgency: c.urgencyLevel })), 'desc');
      case 'urgency_asc':
        return sortPatientsByUrgency(consultations.map(c => ({ ...c, urgency: c.urgencyLevel })), 'asc');
      case 'quality_desc':
        return [...consultations].sort((a, b) => {
          const qualityOrder = { good: 0, degraded: 1, poor: 2, offline: 3 };
          return qualityOrder[b.connectionQuality] - qualityOrder[a.connectionQuality];
        });
      case 'quality_asc':
        return [...consultations].sort((a, b) => {
          const qualityOrder = { good: 0, degraded: 1, poor: 2, offline: 3 };
          return qualityOrder[a.connectionQuality] - qualityOrder[b.connectionQuality];
        });
      case 'time_asc':
        return sortPatientsByWaitTime(consultations.map(c => ({ ...c, waitTime: c.remainingTime })), 'asc');
      case 'time_desc':
        return sortPatientsByWaitTime(consultations.map(c => ({ ...c, waitTime: c.remainingTime })), 'desc');
      case 'name_asc':
        return sortPatientsByName(consultations.map(c => ({ ...c, name: c.patientName })), 'asc');
      case 'name_desc':
        return sortPatientsByName(consultations.map(c => ({ ...c, name: c.patientName })), 'desc');
      default:
        return consultations;
    }
  };
  
  // Fonction de filtrage
  const filterConsultations = (consultations, filter) => {
    if (filter === 'all') return consultations;
    if (filter === 'problems') return filterPatientsByStatus(consultations, ['problem']);
    if (filter === 'offline') return filterPatientsByStatus(consultations, ['offline']);
    return consultations;
  };
  
  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Audio pour les notifications */}
      <audio ref={audioRef}>
        <source src="notification-sound.mp3" type="audio/mpeg" />
      </audio>
      
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
          title="Monitoring Technique"
          subtitle={centerInfo.type}
          centerInfo={centerInfo}
          isOnline={isOnline}
          bandwidth={stats.avgWaitTime}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{
            initials: "TS",
            name: "Tech Support"
          }}
          notificationCount={2}
          extraHeaderItems={
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                <RefreshCw size={12} className="mr-1" /> 
                <span>MAJ: {new Date(lastUpdate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <button
                onClick={() => setCompactView(!compactView)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                title={compactView ? "Vue détaillée" : "Vue compacte"}
              >
                {compactView ? <Layers size={18} /> : <Grid size={18} />}
              </button>
            </div>
          }
        />
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-3">
          {/* Statistiques (affichables/masquables) */}
          {showStats && (
            <StatCardGroup compact={true} darkMode={darkMode}>
              <StatCard
                title="Consultations"
                value={`${stats.activeConsultations}/${stats.totalPatients}`}
                icon={<Activity size={16} />}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Problèmes"
                value={consultations.filter(c => c.status === "problem").length}
                icon={<AlertTriangle size={16} />}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Hors ligne"
                value={consultations.filter(c => c.status === "offline").length}
                icon={<WifiOff size={16} />}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Débit moyen"
                value={stats.avgWaitTime}
                suffix="Mbps"
                icon={<Zap size={16} />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                darkMode={darkMode}
              />
            </StatCardGroup>
          )}
          
          {/* Filtres rapides et recherche */}
          <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
            <div className="flex flex-wrap gap-1">
              <ButtonGroup>
                <ActionButton
                  label="Tous"
                  icon={<Activity size={12} />}
                  variant={selectedFilter === 'all' ? 'primary' : 'light'}
                  onClick={() => setSelectedFilter('all')}
                  size="xs"
                />
                <ActionButton
                  label={`Problèmes ${consultations.filter(c => c.status === 'problem').length > 0 ? `(${consultations.filter(c => c.status === 'problem').length})` : ''}`}
                  icon={<AlertTriangle size={12} />}
                  variant={selectedFilter === 'problems' ? 'warning' : 'light'}
                  onClick={() => setSelectedFilter('problems')}
                  size="xs"
                />
                <ActionButton
                  label={`Hors ligne ${consultations.filter(c => c.status === 'offline').length > 0 ? `(${consultations.filter(c => c.status === 'offline').length})` : ''}`}
                  icon={<WifiOff size={12} />}
                  variant={selectedFilter === 'offline' ? 'danger' : 'light'}
                  onClick={() => setSelectedFilter('offline')}
                  size="xs"
                />
              </ButtonGroup>
              
              <ActionButton
                label="Analytique"
                icon={<BarChart size={12} />}
                variant={showAnalytics ? 'info' : 'light'}
                onClick={() => setShowAnalytics(!showAnalytics)}
                size="xs"
              />
              
              <div className="p-1 bg-gray-100 rounded-md flex items-center ml-1">
                <span className="text-xs text-gray-500 mr-1 ml-1">Tri:</span>
                <select
                  className="text-xs bg-transparent border-none focus:ring-0 px-1 py-0.5 appearance-none"
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  style={{ backgroundPosition: "right 0.25rem center" }}
                >
                  <option value="urgency_desc">Urgence (⬇️ Plus élevée)</option>
                  <option value="urgency_asc">Urgence (⬆️ Moins élevée)</option>
                  <option value="quality_desc">Qualité (⬇️ Problèmes)</option>
                  <option value="quality_asc">Qualité (⬆️ Stable)</option>
                  <option value="time_asc">Temps (⬆️ Imminent)</option>
                  <option value="time_desc">Temps (⬇️ Plus tard)</option>
                  <option value="name_asc">Nom (A-Z)</option>
                  <option value="name_desc">Nom (Z-A)</option>
                </select>
                <ChevronDown size={12} className="text-gray-500 -ml-4" />
              </div>
              
              {/* Indicateur du tri actif */}
              <DynamicBadge
                label={`Trié par: ${
                  selectedSort === 'urgency_desc' ? "Urgence (décroissant)" :
                  selectedSort === 'urgency_asc' ? "Urgence (croissant)" :
                  selectedSort === 'quality_desc' ? "Problèmes d'abord" :
                  selectedSort === 'quality_asc' ? "Stables d'abord" :
                  selectedSort === 'time_asc' ? "Temps imminents" :
                  selectedSort === 'time_desc' ? "Temps plus longs" :
                  selectedSort === 'name_asc' ? "Nom (A-Z)" :
                  selectedSort === 'name_desc' ? "Nom (Z-A)" : ""
                }`}
                variant="info"
                size="xs"
              />
            </div>
            
            <div className="flex space-x-1">
              <SearchInput 
                placeholder="Rechercher..." 
                darkMode={darkMode} 
              />
            </div>
          </div>
          
          {/* Onglets */}
          <MultiTabContainer
            tabs={tabs}
            defaultTabId={activeTab}
            onChange={setActiveTab}
          />
          
          {/* Contenu principal (selon l'onglet actif) */}
          {!showAnalytics ? (
            // Vue des consultations
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {sortConsultations(
                filterConsultations(consultations, selectedFilter),
                selectedSort
              ).map(consultation => (
                  <div 
                    key={consultation.id}
                    className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${consultation.status === 'offline' ? 'border-l-4 border-red-500' : consultation.status === 'problem' ? 'border-l-4 border-yellow-500' : 'border-l-4 border-gray-200'}`}
                    onClick={() => handleSelectConsultation(consultation)}
                  >
                    {compactView ? (
                      // Vue compacte
                      <div className="p-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getConnectionQualityColor(consultation.connectionQuality)} mr-2`}></div>
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-sm">{consultation.patientName}</span>
                                <UrgencyIndicator level={consultation.urgencyLevel} size="xs" />
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="mr-2">{consultation.doctorName}</span>
                                <StatusBadge
                                  type={getStatusBadgeVariant(consultation.status)}
                                  label={getStatusText(consultation.status)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center">
                              <span className="text-xs mr-1">
                                {consultation.connectionSpeed}
                              </span>
                              {consultation.connectionQuality === 'offline' ? (
                                <PhoneCall size={12} className="text-red-600" onClick={(e) => { e.stopPropagation(); initiateCallBack(consultation); }} />
                              ) : (
                                <Monitor size={12} className="text-blue-600" onClick={(e) => { e.stopPropagation(); togglePiP(consultation); }} />
                              )}
                            </div>
                            <div className="flex items-center text-xs">
                              <Clock size={10} className="mr-1 text-gray-500" />
                              <span className="text-gray-500">
                                {consultation.status === 'ongoing' 
                                  ? `${consultation.remainingTime}m restant` 
                                  : `${consultation.elapsedTime}/${consultation.duration}m`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Vue normale
                      <>
                        {/* En-tête de la carte */}
                        <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${getConnectionQualityColor(consultation.connectionQuality)} mr-2`}></div>
                            <div>
                              <h3 className="font-medium text-sm">{consultation.patientName}</h3>
                              <div className="flex items-center">
                                <span className="text-xs text-gray-500">{consultation.patientAge} ans, {consultation.patientGender}</span>
                                <UrgencyIndicator level={consultation.urgencyLevel} size="xs" />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <StatusBadge
                              type={getStatusBadgeVariant(consultation.status)}
                              label={getStatusText(consultation.status)}
                            />
                            <span className="text-xs text-gray-500 mt-0.5">{consultation.specialty}</span>
                          </div>
                        </div>
                        
                        {/* Corps de la carte */}
                        <div className="p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Clock size={14} className="text-gray-500 mr-1" />
                              <span className="text-xs">Début: <strong>{consultation.startTime}</strong></span>
                            </div>
                            <div className="flex items-center">
                              <Timer size={14} className="text-gray-500 mr-1" />
                              <span className="text-xs">
                                {consultation.status === 'ongoing' 
                                  ? `Reste: ${consultation.remainingTime} min` 
                                  : `Durée: ${consultation.elapsedTime}/${consultation.duration} min`}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center">
                              <User size={14} className="text-blue-600 mr-1" />
                              <span className="text-xs">{consultation.doctorName}</span>
                            </div>
                            
                            {/* Barre de qualité de connexion */}
                            {consultation.connectionQuality !== 'offline' && (
                              <div className="flex-1 ml-2">
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      consultation.connectionQuality === 'good' ? 'bg-green-600' :
                                      consultation.connectionQuality === 'degraded' ? 'bg-yellow-600' :
                                      'bg-orange-600'
                                    }`} 
                                    style={{ width: `${
                                      consultation.connectionQuality === 'good' ? 90 :
                                      consultation.connectionQuality === 'degraded' ? 60 :
                                      30
                                    }%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Affichage des métriques techniques */}
                          <div className="grid grid-cols-3 gap-1 bg-gray-100 rounded-md p-2 mb-3">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center">
                                <Zap size={12} className={`mr-1 ${
                                  parseFloat(consultation.connectionSpeed) > PERFORMANCE_THRESHOLDS.BANDWIDTH_MIN * 3 ? 'text-green-600' :
                                  parseFloat(consultation.connectionSpeed) > PERFORMANCE_THRESHOLDS.BANDWIDTH_MIN ? 'text-yellow-600' :
                                  'text-red-600'
                                }`} />
                                <span className="text-xs font-medium">{consultation.connectionSpeed}</span>
                              </div>
                              <span className="text-xs text-gray-500">Débit</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="flex items-center">
                                <Activity size={12} className={`mr-1 ${
                                  parseInt(consultation.latency) < PERFORMANCE_THRESHOLDS.LATENCY_MAX / 3 ? 'text-green-600' :
                                  parseInt(consultation.latency) < PERFORMANCE_THRESHOLDS.LATENCY_MAX / 2 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`} />
                                <span className="text-xs font-medium">{consultation.latency}</span>
                              </div>
                              <span className="text-xs text-gray-500">Latence</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="flex items-center">
                                <AlertOctagon size={12} className={`mr-1 ${
                                  parseFloat(consultation.packetLoss) < 1 ? 'text-green-600' :
                                  parseFloat(consultation.packetLoss) < 5 ? 'text-yellow-600' :
                                  'text-red-600'
                                }`} />
                                <span className="text-xs font-medium">{consultation.packetLoss}</span>
                              </div>
                              <span className="text-xs text-gray-500">Perte</span>
                            </div>
                          </div>
                          
                          {/* Actions selon le statut */}
                          <ButtonGroup>
                            {consultation.status === 'ongoing' || consultation.status === 'problem' ? (
                              <ActionButton
                                label={showPiP && pipConsultation && pipConsultation.id === consultation.id ? "Fermer PiP" : "Voir PiP"}
                                icon={showPiP && pipConsultation && pipConsultation.id === consultation.id ? <Minimize size={12} /> : <Maximize size={12} />}
                                variant="info"
                                size="xs"
                                onClick={(e) => { e.stopPropagation(); togglePiP(consultation); }}
                              />
                            ) : null}
                            
                            {consultation.status === 'problem' && (
                              <ActionButton
                                label="Optimiser"
                                icon={<RefreshCw size={12} />}
                                variant="warning"
                                size="xs"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  displayNotification(
                                    "Optimisation de connexion",
                                    `Tentative d'amélioration de la connexion pour ${consultation.patientName}`,
                                    "info"
                                  );
                                }}
                              />
                            )}
                            
                            {consultation.status === 'offline' && (
                              <ActionButton
                                label={reconnectAttempt === consultation.id ? "Reconnexion..." : "Rappeler"}
                                icon={<PhoneCall size={12} />}
                                variant="danger"
                                size="xs"
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  initiateCallBack(consultation);
                                }}
                              />
                            )}
                            
                            <button 
                              className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs"
                              onClick={(e) => { e.stopPropagation(); }}
                            >
                              <MoreVertical size={12} />
                            </button>
                          </ButtonGroup>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                
                {/* Message si aucune consultation ne correspond aux filtres */}
                {filterConsultations(consultations, selectedFilter).length === 0 && (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} col-span-3 rounded-lg shadow p-6 text-center`}>
                      <AlertOctagon size={32} className="mx-auto mb-2 text-gray-400" />
                      <h3 className="text-lg font-medium mb-1">Aucune consultation trouvée</h3>
                      <p className="text-sm text-gray-500">Aucune consultation ne correspond aux critères sélectionnés.</p>
                      <ActionButton
                        label="Voir toutes les consultations"
                        variant="primary"
                        size="sm"
                        className="mt-3"
                        onClick={() => setSelectedFilter('all')}
                      />
                    </div>
                  )}
            </div>
          ) : (
            // Vue analytique
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Graphique des performances journalières */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                <h3 className="text-sm font-medium mb-2">Performance du Réseau (24h)</h3>
                <div className="h-48 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Graphique des performances réseau</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Débit moyen</div>
                    <div className="font-medium">{networkPerformance.dailyReport.avgSpeed}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Taux de succès</div>
                    <div className="font-medium">{networkPerformance.dailyReport.successRate}</div>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="text-xs text-gray-500">Incidents</div>
                    <div className="font-medium">{networkPerformance.dailyReport.connectionIssues}</div>
                  </div>
                </div>
              </div>
              
              {/* Rapport sur les consultations */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                <h3 className="text-sm font-medium mb-2">Statistiques des Consultations</h3>
                <div className="h-48 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Graphique des consultations par statut</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Connexions stables</span>
                      <span className="font-medium text-green-600">{stats.activeConsultations}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-600" 
                        style={{ width: `${(stats.activeConsultations / stats.totalPatients) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span>Problèmes techniques</span>
                      <span className="font-medium text-yellow-600">{consultations.filter(c => c.status === 'problem').length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-600" 
                        style={{ width: `${(consultations.filter(c => c.status === 'problem').length / stats.totalPatients) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span>Connexions perdues</span>
                      <span className="font-medium text-red-600">{consultations.filter(c => c.status === 'offline').length}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600" 
                        style={{ width: `${(consultations.filter(c => c.status === 'offline').length / stats.totalPatients) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-2 rounded">
                    <h4 className="text-xs font-medium mb-1">Performances du système</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Temps de service</span>
                        <span className="font-medium">99.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Débit moyen</span>
                        <span className="font-medium">3.8 Mbps</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Connexions aujourd'hui</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Actuellement actives</span>
                        <span className="font-medium">{stats.activeConsultations}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Statistiques des périphériques */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">État des Périphériques</h3>
                  <button className="text-xs text-blue-600">Exporter</button>
                </div>
                <FilterableTable
                  columns={[
                    {
                      id: 'patient',
                      header: 'Patient',
                      accessor: row => row.patientName,
                      sortable: true,
                      filterable: true
                    },
                    {
                      id: 'camera',
                      header: 'Caméra',
                      accessor: row => (
                        <div className="flex items-center">
                          <Video 
                            size={12} 
                            className={row.videoEnabled ? 'text-green-600 mr-1' : 'text-red-600 mr-1'} 
                          />
                          {row.deviceInfo?.camera || 'N/A'}
                        </div>
                      ),
                      sortable: false,
                      filterable: false
                    },
                    {
                      id: 'microphone',
                      header: 'Micro',
                      accessor: row => (
                        <div className="flex items-center">
                          <Mic 
                            size={12} 
                            className={row.audioEnabled ? 'text-green-600 mr-1' : 'text-red-600 mr-1'} 
                          />
                          {row.deviceInfo?.microphone || 'N/A'}
                        </div>
                      ),
                      sortable: false,
                      filterable: false
                    },
                    {
                      id: 'browser',
                      header: 'Navigateur',
                      accessor: row => `${row.deviceInfo?.browser || 'N/A'} / ${row.deviceInfo?.os || 'N/A'}`,
                      sortable: true,
                      filterable: true
                    }
                  ]}
                  data={consultations}
                  emptyMessage="Aucun périphérique détecté"
                />
              </div>
              
              {/* Journal d'événements */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Journal des Événements Techniques</h3>
                  <div className="flex space-x-1">
                    <button className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">Tous</button>
                    <button className="text-xs text-gray-500">Erreurs</button>
                    <button className="text-xs text-gray-500">Avertissements</button>
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {consultations
                      .flatMap(consultation => 
                        consultation.technicalNotes.map(note => ({
                          patientName: consultation.patientName,
                          ...note
                        }))
                      )
                      .sort((a, b) => {
                        const timeA = a.time.split(':').map(Number);
                        const timeB = b.time.split(':').map(Number);
                        return (timeB[0] * 60 + timeB[1]) - (timeA[0] * 60 + timeA[1]);
                      })
                      .map((note, index) => (
                        <li 
                          key={index} 
                          className={`text-xs p-1 rounded ${
                            note.severity === 'error' ? 'bg-red-50 text-red-800' :
                            note.severity === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                            'bg-blue-50 text-blue-800'
                          }`}
                        >
                          <span className="font-medium">{note.time}</span> - 
                          <span className="font-medium ml-1">{note.patientName}</span>: {note.note}
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Panel latéral technique */}
      {showTechnicalPanel && selectedConsultation && (
        <SidePanel
          title="Diagnostic Technique"
          isOpen={showTechnicalPanel}
          onClose={() => setShowTechnicalPanel(false)}
          darkMode={darkMode}
          width="w-80"
        >
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-full ${getConnectionQualityColor(selectedConsultation.connectionQuality)} bg-opacity-20`}>
              <Activity size={20} className={
                selectedConsultation.connectionQuality === 'good' ? 'text-green-600' :
                selectedConsultation.connectionQuality === 'degraded' ? 'text-yellow-600' :
                selectedConsultation.connectionQuality === 'poor' ? 'text-orange-600' :
                'text-red-600'
              } />
            </div>
            <div className="ml-2">
              <h4 className="font-bold text-sm">{selectedConsultation.patientName}</h4>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-1">{selectedConsultation.patientAge} ans, {selectedConsultation.patientGender}</span>
                <UrgencyIndicator level={selectedConsultation.urgencyLevel} size="xs" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Médecin</span>
              <span className="font-medium text-sm">{selectedConsultation.doctorName}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Statut</span>
              <StatusBadge
                type={getStatusBadgeVariant(selectedConsultation.status)}
                label={getStatusText(selectedConsultation.status)}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Qualité</span>
              <StatusBadge
                type={getStatusBadgeVariant(selectedConsultation.connectionQuality)}
                label={getConnectionQualityText(selectedConsultation.connectionQuality)}
              />
            </div>
          </div>
          
          {/* Aperçu vidéo (simulé) */}
          {selectedConsultation.status !== 'offline' && (
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Aperçu de session</h4>
              <div className={`aspect-video bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs mb-1 ${selectedConsultation.status === 'problem' ? 'bg-yellow-100' : ''}`}>
                {selectedConsultation.videoEnabled ? (
                  "Flux vidéo en direct"
                ) : (
                  <div className="flex flex-col items-center">
                    <VideoOff size={24} className="mb-1" />
                    <span>Vidéo désactivée</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Résolution: {selectedConsultation.videoEnabled ? '720p' : 'N/A'}</span>
                <span className="text-gray-500">FPS: {selectedConsultation.videoEnabled ? '25' : 'N/A'}</span>
                <span className="text-gray-500">Codec: {selectedConsultation.videoEnabled ? 'VP9' : 'N/A'}</span>
              </div>
            </div>
          )}
          
          {/* Métriques de connexion */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium text-xs">Métriques de connexion</h4>
              <button 
                className="p-1 bg-blue-100 rounded text-blue-700 text-xs"
                onClick={() => {
                  displayNotification(
                    "Actualisation des métriques", 
                    "Métriques mises à jour pour " + selectedConsultation.patientName, 
                    "info"
                  );
                }}
              >
                <RefreshCw size={12} />
              </button>
            </div>
            
            <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Débit</span>
                <span className={`text-xs font-medium ${
                  parseFloat(selectedConsultation.connectionSpeed) > PERFORMANCE_THRESHOLDS.BANDWIDTH_MIN * 3 ? 'text-green-600' :
                  parseFloat(selectedConsultation.connectionSpeed) > PERFORMANCE_THRESHOLDS.BANDWIDTH_MIN ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{selectedConsultation.connectionSpeed}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${
                    parseFloat(selectedConsultation.connectionSpeed) > PERFORMANCE_THRESHOLDS.BANDWIDTH_MIN * 3 ? 'bg-green-600' :
                    parseFloat(selectedConsultation.connectionSpeed) > PERFORMANCE_THRESHOLDS.BANDWIDTH_MIN ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`} 
                  style={{ width: `${Math.min(100, parseFloat(selectedConsultation.connectionSpeed) * 20)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Latence</span>
                <span className={`text-xs font-medium ${
                  parseInt(selectedConsultation.latency) < PERFORMANCE_THRESHOLDS.LATENCY_MAX / 3 ? 'text-green-600' :
                  parseInt(selectedConsultation.latency) < PERFORMANCE_THRESHOLDS.LATENCY_MAX / 2 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{selectedConsultation.latency}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${
                    parseInt(selectedConsultation.latency) < PERFORMANCE_THRESHOLDS.LATENCY_MAX / 3 ? 'bg-green-600' :
                    parseInt(selectedConsultation.latency) < PERFORMANCE_THRESHOLDS.LATENCY_MAX / 2 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`} 
                  style={{ width: `${Math.min(100, 100 - (parseInt(selectedConsultation.latency) / 5))}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Perte de paquets</span>
                <span className={`text-xs font-medium ${
                  parseFloat(selectedConsultation.packetLoss) < 1 ? 'text-green-600' :
                  parseFloat(selectedConsultation.packetLoss) < 5 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{selectedConsultation.packetLoss}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${
                    parseFloat(selectedConsultation.packetLoss) < 1 ? 'bg-green-600' :
                    parseFloat(selectedConsultation.packetLoss) < 5 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`} 
                  style={{ width: `${Math.min(100, 100 - parseFloat(selectedConsultation.packetLoss) * 10)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs">Gigue (jitter)</span>
                <span className={`text-xs font-medium ${
                  parseInt(selectedConsultation.jitter) < 10 ? 'text-green-600' :
                  parseInt(selectedConsultation.jitter) < 20 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{selectedConsultation.jitter}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    parseInt(selectedConsultation.jitter) < 10 ? 'bg-green-600' :
                    parseInt(selectedConsultation.jitter) < 20 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`} 
                  style={{ width: `${Math.min(100, 100 - parseInt(selectedConsultation.jitter) * 5)}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Graphique d'évolution de la connexion */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1">Évolution de la connexion</h4>
            <div className="bg-gray-100 rounded-md h-32 p-2 flex items-center justify-center">
              <span className="text-xs text-gray-500">Graphique d'évolution de la connexion</span>
              {/* Dans une vraie application, un graphique serait affiché ici */}
            </div>
          </div>
          
          {/* Information sur les périphériques */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1">Information périphériques</h4>
            <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-1`}>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Caméra:</span>
                <span className="font-medium">{selectedConsultation.deviceInfo?.camera || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Microphone:</span>
                <span className="font-medium">{selectedConsultation.deviceInfo?.microphone || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Haut-parleurs:</span>
                <span className="font-medium">{selectedConsultation.deviceInfo?.speaker || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Navigateur:</span>
                <span className="font-medium">{selectedConsultation.deviceInfo?.browser || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Système:</span>
                <span className="font-medium">{selectedConsultation.deviceInfo?.os || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* Journal des événements techniques */}
          <div className="mb-3">
            <h4 className="font-medium text-xs mb-1">Journal des événements</h4>
            <div className={`max-h-32 overflow-y-auto mb-2 p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              {selectedConsultation.technicalNotes && selectedConsultation.technicalNotes.length > 0 ? (
                <div className="space-y-1">
                  {selectedConsultation.technicalNotes.map((note, index) => (
                    <div 
                      key={index} 
                      className={`text-xs p-1 rounded mb-1 ${
                        note.severity === 'error' ? 'bg-red-50 text-red-800' :
                        note.severity === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-blue-50 text-blue-800'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{note.time}</span>
                      </div>
                      <p>{note.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center">Aucun événement enregistré</p>
              )}
            </div>
            
            {/* Ajouter une note (dans une vraie application) */}
            <div className="flex">
              <input 
                type="text" 
                placeholder="Ajouter une note technique..." 
                className={`flex-1 p-1.5 rounded-l-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border border-gray-300`}
              />
              <button className="px-2 bg-blue-600 text-white rounded-r-md text-xs">
                <Send size={12} />
              </button>
            </div>
          </div>
          
          {/* Actions techniques selon le statut */}
          <ButtonGroup className="mt-3">
            {selectedConsultation.status === 'ongoing' && (
              <>
                <ActionButton
                  label="Mode audio"
                  icon={<Phone size={12} />}
                  variant="success"
                  size="sm"
                  fullWidth
                />
                <ActionButton
                  label="Exporter logs"
                  icon={<DownloadCloud size={12} />}
                  variant="info"
                  size="sm"
                  fullWidth
                />
              </>
            )}
            
            {selectedConsultation.status === 'problem' && (
              <>
                <ActionButton
                  label="Optimiser connexion"
                  icon={<RefreshCw size={12} />}
                  variant="warning"
                  size="sm"
                  fullWidth
                />
                <ActionButton
                  label="Contacter patient"
                  icon={<MessageCircle size={12} />}
                  variant="info"
                  size="sm"
                  fullWidth
                />
              </>
            )}
            
            {selectedConsultation.status === 'offline' && (
              <>
                <ActionButton
                  label={reconnectAttempt === selectedConsultation.id ? "Reconnexion..." : "Rappel automatique"}
                  icon={<PhoneCall size={12} />}
                  variant="danger"
                  size="sm"
                  fullWidth
                  onClick={() => initiateCallBack(selectedConsultation)}
                />
                <ActionButton
                  label="Notification SMS"
                  icon={<MessageCircle size={12} />}
                  variant="info"
                  size="sm"
                  fullWidth
                />
              </>
            )}
            
            <button className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md flex items-center justify-center text-xs">
              <MoreVertical size={12} />
            </button>
          </ButtonGroup>
        </SidePanel>
      )}
      
      {/* Vue Picture-in-Picture */}
      {showPiP && pipConsultation && (
        <div className="fixed bottom-4 right-4 w-64 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
          <div className="bg-blue-600 text-white px-2 py-1 flex justify-between items-center">
            <span className="text-xs font-medium">{pipConsultation.patientName} - {pipConsultation.doctorName}</span>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => togglePiP(pipConsultation)} 
                className="text-white hover:text-gray-200"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="p-2">
            <div className="bg-gray-200 h-32 flex items-center justify-center rounded">
              <div className="text-center">
                <Video size={24} className="mx-auto mb-1 text-gray-500" />
                <span className="text-xs text-gray-500">
                  {pipConsultation.videoEnabled ? "Flux vidéo en direct" : "Vidéo désactivée"}
                </span>
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center text-xs">
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full ${getConnectionQualityColor(pipConsultation.connectionQuality)} mr-1`}></span>
                <span>{getConnectionQualityText(pipConsultation.connectionQuality)}</span>
              </div>
              <div>
                <span className="text-gray-500">{pipConsultation.connectionSpeed}</span>
              </div>
            </div>
            <div className="mt-1 flex space-x-1">
              <ActionButton
                label="Diagnostiquer"
                icon={<Monitor size={12} />}
                variant="success"
                size="xs"
                fullWidth
              />
              <ActionButton
                icon={<Maximize size={12} />}
                variant="info"
                size="xs"
                fullWidth
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
          {notifications.slice(0, 3).map((notification) => (
            <ToastNotification
              key={notification.id}
              message={notification.content}
              type={notification.type}
              isVisible={!notification.isRead}
              onClose={() => {}}
              position="bottom-right"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TechnicalMonitoringInterface;