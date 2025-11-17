import React, { useState, useEffect, useRef } from 'react';
import { 
Settings, 
Users, 
Video, 
Calendar,
MessageSquare, 
HelpCircle,
Bell,
AlertTriangle,
RefreshCw,
BarChart2,
Moon,
Sun,
Save,
RotateCcw,
X,
Sliders,
Clock,
Shield,
Edit,
Plus,
Trash2,
Activity,
Play,
Info,
CheckCircle,
Loader,
User,
Database,
Menu,
Zap,
Home,
LogOut,
Copy,
Archive,
Columns,
Layout,
Bookmark,
GitCompare,
Star,
FileCheck,
Download,
Upload,
Cpu,
BarChart,
LineChart,
Layers,
History,
WifiOff
} from 'lucide-react';

// Importation des composants partagés
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { Modal } from '@modals/Modal';
import { ConnectionStatus } from '@common/ConnectionStatus';
import { AlertNotification } from '@feedback/AlertNotification';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import FloatingActionButton from '@buttons/FloatingActionButton';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Import des utils partagés
import { formatDateTime, formatTime } from '@utils/dateUtils';
import { getUrgencyColor } from '@utils/statusUtils';

// Import des constants partagées
import { EMERGENCY_THEME_COLORS, EMERGENCY_PRIORITY_LEVELS } from '@constants/emergencyConstants';

// Import des validators partagés
import { validateEmergencyLevel } from '@validators/emergencyValidators';

// Import des types partagés
import { UrgencyLevel, ConsultationSettings, PatientDistribution } from '@types/configurationTypes';

// Import des hooks partagés
import { useFormValidation } from '@hooks/useFormValidation';

// Components personnalisés pour éviter les conflits de noms
const ScheduleIcon = (props) => <Calendar {...props} />;

const ConfigurationReglesOperationnelles = () => {
  // États pour le thème et les fonctionnalités de l'interface
  const [darkMode, setDarkMode] = useState(false);
  const [connected, setConnected] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [activeTab, setActiveTab] = useState('repartition');
  const [notifications, setNotifications] = useState(2);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({ name: '', duration: 20 });
  
  // États pour les fonctionnalités avancées
  const [showPresets, setShowPresets] = useState(false);
  const [showComparisonMode, setShowComparisonMode] = useState(false);
  const [comparisonConfig, setComparisonConfig] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(null);
  const [dashboardLayout, setDashboardLayout] = useState('standard');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [scheduledChanges, setScheduledChanges] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [configurationsHistory, setConfigurationsHistory] = useState([]);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  
  // Références pour les graphiques
  const impactChartRef = useRef(null);
  const distributionChartRef = useRef(null);
  
  // Préréglages configurés
  const presets = [
    {
      id: 'clinique-petite',
      name: 'Petite Clinique',
      description: 'Optimisé pour les petites cliniques avec 1-3 médecins',
      config: {
        patientDistribution: { urgencyWeight: 40, maxPatientsPerHour: 4, useRoundRobin: true, allowManualOverride: true },
        bandwidthThreshold: 1.5,
        delayAlertThreshold: 15
      }
    },
    {
      id: 'clinique-grande',
      name: 'Grand Centre Médical',
      description: 'Optimisé pour les grands centres avec plus de 10 médecins',
      config: {
        patientDistribution: { urgencyWeight: 60, maxPatientsPerHour: 6, useRoundRobin: true, allowManualOverride: true },
        bandwidthThreshold: 2,
        delayAlertThreshold: 10
      }
    },
    {
      id: 'urgences',
      name: 'Mode Urgences',
      description: 'Priorité maximale aux cas urgents',
      config: {
        patientDistribution: { urgencyWeight: 80, maxPatientsPerHour: 8, useRoundRobin: true, allowManualOverride: true },
        bandwidthThreshold: 1,
        delayAlertThreshold: 5
      }
    },
    {
      id: 'equilibre',
      name: 'Équilibre Optimal',
      description: 'Balance équilibrée entre urgence et temps d\'attente',
      config: {
        patientDistribution: { urgencyWeight: 50, maxPatientsPerHour: 5, useRoundRobin: true, allowManualOverride: true },
        bandwidthThreshold: 2,
        delayAlertThreshold: 10
      }
    }
  ];
  
  // Historique des configurations (simulé)
  const configHistory = [
    { id: 1, timestamp: '2025-05-10 09:30', user: 'Sarah Ngoumou', description: 'Ajustement du poids d\'urgence à 60%', changes: ['Poids d\'urgence: 50% → 60%'] },
    { id: 2, timestamp: '2025-05-08 14:15', user: 'Sarah Ngoumou', description: 'Optimisation pour période d\'affluence', changes: ['Patients par heure: 4 → 5', 'Seuil d\'alerte: 15min → 10min'] },
    { id: 3, timestamp: '2025-05-02 11:00', user: 'Jean Kamga', description: 'Configuration initiale', changes: ['Paramètres initiaux établis'] }
  ];
  
  const [patientDistribution, setPatientDistribution] = useState({
    urgencyWeight: 50, // Pourcentage pour l'urgence (le reste est pour l'ancienneté)
    maxPatientsPerHour: 5, // Nombre max de patients par heure par médecin
    useRoundRobin: true, // Utilisation de l'algorithme round-robin
    allowManualOverride: true, // Autoriser les secrétaires à contourner l'algorithme
  });
  
  // 2. Critères d'urgence
  const [urgencyLevels, setUrgencyLevels] = useState([
    { id: 1, level: 1, label: "Non urgent", timeThreshold: 120, requireNotification: false, notifyStaff: [], color: "bg-green-500" },
    { id: 2, level: 2, label: "Peu urgent", timeThreshold: 60, requireNotification: false, notifyStaff: [], color: "bg-blue-500" },
    { id: 3, level: 3, label: "Urgent", timeThreshold: 30, requireNotification: true, notifyStaff: ["medecin"], color: "bg-yellow-500" },
    { id: 4, level: 4, label: "Très urgent", timeThreshold: 15, requireNotification: true, notifyStaff: ["medecin", "infirmier"], color: "bg-orange-500" },
    { id: 5, level: 5, label: "Urgence vitale", timeThreshold: 5, requireNotification: true, notifyStaff: ["medecin", "infirmier", "secretaire"], color: "bg-red-500" },
  ]);

  // 3. Paramètres de consultation
  const [consultationSettings, setConsultationSettings] = useState({
    defaultDurations: [
      { specialty: "Médecine générale", duration: 15 },
      { specialty: "Pédiatrie", duration: 20 },
      { specialty: "Cardiologie", duration: 30 },
      { specialty: "Dermatologie", duration: 20 },
    ],
    bandwidthThreshold: 2, // Mbps, seuil pour basculer en mode audio uniquement
    delayAlertThreshold: 10, // minutes, seuil pour alerter sur le retard
  });
  
  // Information administrateur
  const adminInfo = {
    name: "Sarah Ngoumou",
    role: "Administrateur Fonctionnel",
    id: "ADM-023",
    photo: null
  };
  
  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Gestion du toggle de connexion (pour démo)
  const toggleConnection = () => {
    setConnected(!connected);
  };
  
  // Fonction pour obtenir la classe de couleur basée sur le niveau d'urgence
  const getUrgencyColorClass = (level) => {
    return getUrgencyColor(level);
  };
  
  // Application d'un préréglage
  const applyPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setPatientDistribution(preset.config.patientDistribution);
      setConsultationSettings({
        ...consultationSettings,
        bandwidthThreshold: preset.config.bandwidthThreshold,
        delayAlertThreshold: preset.config.delayAlertThreshold
      });
      setSelectedPreset(presetId);
      setShowUnsavedChanges(true);
      setSimulationResults(null);
    }
  };
  
  // Simulation des effets des changements (pour démonstration)
  const simulateChanges = () => {
    setIsSimulating(true);
    
    // Simuler un délai de calcul
    setTimeout(() => {
      // Résultats simulés en fonction des paramètres
      setSimulationResults({
        avgWaitTime: Math.round(120 - (patientDistribution.urgencyWeight * 0.8)),
        patientsPerDay: Math.round(patientDistribution.maxPatientsPerHour * 8),
        urgencyDistribution: [
          { level: 1, percentage: 30 },
          { level: 2, percentage: 35 },
          { level: 3, percentage: 20 },
          { level: 4, percentage: 10 },
          { level: 5, percentage: 5 },
        ],
        impactScore: patientDistribution.urgencyWeight > 60 ? "Élevé" : patientDistribution.urgencyWeight > 40 ? "Moyen" : "Faible",
        impactDetails: patientDistribution.urgencyWeight > 60 
          ? "L'accent mis sur l'urgence pourrait augmenter les temps d'attente pour les patients non-urgents."
          : patientDistribution.urgencyWeight < 40 
            ? "L'accent mis sur l'ancienneté pourrait retarder les patients urgents."
            : "Balance équilibrée entre urgence et temps d'attente."
      });
      setIsSimulating(false);
    }, 1500);
  };
  
  // Sauvegarde des modifications
  const saveChanges = () => {
    // Ici, on simulerait l'envoi des données au backend
    alert("Les modifications ont été enregistrées avec succès.");
    setShowUnsavedChanges(false);
  };
  
  // Réinitialisation des modifications
  const resetChanges = () => {
    // Réinitialisation à des valeurs par défaut (exemple simplifié)
    setPatientDistribution({
      urgencyWeight: 50,
      maxPatientsPerHour: 5,
      useRoundRobin: true,
      allowManualOverride: true,
    });
    setShowUnsavedChanges(false);
    setSimulationResults(null);
  };
  
  // Mise à jour d'un niveau d'urgence
  const updateUrgencyLevel = (id, field, value) => {
    // Validation du niveau d'urgence si c'est le champ level
    if (field === 'level' && !validateEmergencyLevel(value)) {
      return;
    }
    
    setUrgencyLevels(urgencyLevels.map(level => 
      level.id === id ? { ...level, [field]: value } : level
    ));
    setShowUnsavedChanges(true);
  };
  
  // Mise à jour de la durée par spécialité
  const updateSpecialtyDuration = (specialty, duration) => {
    setConsultationSettings({
      ...consultationSettings,
      defaultDurations: consultationSettings.defaultDurations.map(item => 
        item.specialty === specialty ? { ...item, duration } : item
      )
    });
    setShowUnsavedChanges(true);
  };
  
  // Ajout d'une nouvelle spécialité
  const addSpecialty = () => {
    setShowSpecialtyModal(true);
  };
  
  // Soumission du formulaire d'ajout de spécialité
  const submitNewSpecialty = () => {
    if (newSpecialty.name.trim()) {
      setConsultationSettings({
        ...consultationSettings,
        defaultDurations: [
          ...consultationSettings.defaultDurations,
          { specialty: newSpecialty.name, duration: newSpecialty.duration }
        ]
      });
      setShowUnsavedChanges(true);
      setShowSpecialtyModal(false);
      setNewSpecialty({ name: '', duration: 20 });
    }
  };
  
  // Suppression d'une spécialité
  const removeSpecialty = (specialty) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la spécialité "${specialty}" ?`)) {
      setConsultationSettings({
        ...consultationSettings,
        defaultDurations: consultationSettings.defaultDurations.filter(item => 
          item.specialty !== specialty
        )
      });
      setShowUnsavedChanges(true);
    }
  };

  const sidebarMenuItems = [
    { icon: <Home size={20} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <Users size={20} />, label: "Gestion Utilisateurs", path: "#", isActive: false },
    { icon: <Shield size={20} />, label: "Permissions", path: "#", isActive: false },
    { icon: <Settings size={20} />, label: "Règles Opérationnelles", path: "#", isActive: true },
    { icon: <Activity size={20} />, label: "Supervision", path: "#", isActive: false },
    { icon: <Database size={20} />, label: "Modules", path: "#", isActive: false },
    { icon: <Zap size={20} />, label: "Hiérarchie RBAC", path: "#", isActive: false },
  ];

  const sidebarBottomItems = [
    { icon: <LogOut size={18} />, label: "Se déconnecter", path: "#" }
  ];
  
  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Barre de navigation latérale */}
      <Sidebar 
        appName="EAGLE Admin"
        menuItems={sidebarMenuItems}
        bottomMenuItems={sidebarBottomItems}
        darkMode={darkMode}
      />
    
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          title="Configuration des Règles"
          subtitle={adminInfo.role + " • ID: " + adminInfo.id}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          isOnline={connected}
          user={{
            initials: adminInfo.name.split(' ').map(n => n[0]).join(''),
            name: adminInfo.name
          }}
          notificationCount={notifications}
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
            message="Les modifications seront stockées localement et synchronisées automatiquement lors de la reconnexion."
            type="error"
            isVisible={!connected}
            position="bottom-center"
            darkMode={darkMode}
          />
        )}

        {/* Contenu principal */}
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center">
              <Settings className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
              Configuration des Règles Opérationnelles
            </h2>
            
            <div className="flex items-center space-x-4">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentTime}</div>
              
              {/* Barre d'outils avancée */}
              <ButtonGroup className={`border ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-0.5`}>
                <button 
                  onClick={() => setShowPresets(!showPresets)} 
                  className={`p-1.5 rounded-l-md ${showPresets ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Préréglages recommandés"
                >
                  <Bookmark size={18} />
                </button>
                <button 
                  onClick={() => {
                    if (!showComparisonMode) {
                      // Enregistrer la configuration actuelle pour comparaison
                      setComparisonConfig({
                        patientDistribution: {...patientDistribution},
                        consultationSettings: {...consultationSettings},
                        simulationResults: simulationResults
                      });
                    } else {
                      setComparisonConfig(null);
                    }
                    setShowComparisonMode(!showComparisonMode);
                  }} 
                  className={`p-1.5 ${showComparisonMode ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Mode comparaison"
                >
                  <GitCompare size={18} />
                </button>
                <button 
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)} 
                  className={`p-1.5 ${showAdvancedSettings ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700') : ''} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Paramètres avancés"
                >
                  <Sliders size={18} />
                </button>
                <button 
                  onClick={() => setShowScheduleModal(true)} 
                  className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Programmer des changements"
                >
                  <ScheduleIcon size={18} />
                </button>
                <button 
                  onClick={() => setShowHistoryModal(true)} 
                  className={`p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Historique des modifications"
                >
                  <History size={18} />
                </button>
                <button 
                  onClick={() => setShowImportExportModal(true)} 
                  className={`p-1.5 rounded-r-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  title="Importer/Exporter"
                >
                  <Download size={18} />
                </button>
              </ButtonGroup>
              
              {/* Toggle de mise en page */}
              <button 
                onClick={() => setDashboardLayout(dashboardLayout === 'standard' ? 'advanced' : 'standard')} 
                className={`p-1.5 border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} rounded-md`}
                title="Changer la mise en page"
              >
                {dashboardLayout === 'standard' ? <Columns size={18} /> : <Layout size={18} />}
              </button>
            </div>
          </div>
          
          {/* Panneau de préréglages */}
          {showPresets && (
            <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" />
                  Préréglages Recommandés
                </h3>
                <button 
                  className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                  onClick={() => setShowPresets(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {presets.map(preset => (
                  <div 
                    key={preset.id} 
                    className={`p-3 rounded-lg border ${selectedPreset === preset.id ? 'border-blue-500' : (darkMode ? 'border-gray-700' : 'border-gray-200')} cursor-pointer hover:shadow-md transition-shadow duration-200`}
                    onClick={() => applyPreset(preset.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{preset.name}</h4>
                      {selectedPreset === preset.id && (
                        <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{preset.description}</p>
                    <div className="mt-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span>Poids urgence:</span>
                        <span className="font-medium">{preset.config.patientDistribution.urgencyWeight}%</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Patients/heure:</span>
                        <span className="font-medium">{preset.config.patientDistribution.maxPatientsPerHour}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Alertes après:</span>
                        <span className="font-medium">{preset.config.delayAlertThreshold} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Barre d'onglets */}
          <div className="mb-6">
            <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                className={`py-2 px-4 font-medium text-sm flex items-center ${
                  activeTab === 'repartition' 
                    ? `border-b-2 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                }`}
                onClick={() => setActiveTab('repartition')}
              >
                <Users className="h-4 w-4 mr-2" />
                Répartition des patients
              </button>
              
              <button 
                className={`py-2 px-4 font-medium text-sm flex items-center ${
                  activeTab === 'urgence' 
                    ? `border-b-2 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                }`}
                onClick={() => setActiveTab('urgence')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Critères d'urgence
              </button>
              
              <button 
                className={`py-2 px-4 font-medium text-sm flex items-center ${
                  activeTab === 'consultation' 
                    ? `border-b-2 ${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-600'}`
                    : `${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                }`}
                onClick={() => setActiveTab('consultation')}
              >
                <Video className="h-4 w-4 mr-2" />
                Paramètres de consultation
              </button>
            </div>
          </div>
          
          {/* Contenu des onglets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale (2/3) */}
            <div className="lg:col-span-2">
              {/* 1. Onglet Répartition des patients */}
              {activeTab === 'repartition' && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Sliders className="h-5 w-5 mr-2" />
                    Paramètres de répartition des patients
                  </h3>
                  
                  {/* Poids Urgence vs Ancienneté avec visualisation contextuelle */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <label className="font-medium text-sm">Poids Urgence vs Ancienneté</label>
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" 
                          onMouseEnter={() => setShowHelpTooltip('urgencyWeight')}
                          onMouseLeave={() => setShowHelpTooltip(null)}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        
                        {showHelpTooltip === 'urgencyWeight' && (
                          <div className={`absolute mt-8 ml-6 p-3 rounded-lg shadow-lg z-10 text-sm max-w-xs ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}>
                            <p className="font-medium mb-1">Comment fonctionne le poids d'urgence?</p>
                            <p className="mb-2">Cette valeur détermine l'importance relative entre le niveau d'urgence et le temps d'attente lors de la priorisation des patients.</p>
                            <ul className="space-y-1 list-disc pl-4">
                              <li>Valeurs élevées (70%+): Priorité aux cas urgents indépendamment du temps d'attente</li>
                              <li>Valeurs équilibrées (40-60%): Balance entre urgence et équité</li>
                              <li>Valeurs basses (30%-): Priorité à l'ordre d'arrivée</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <span className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {patientDistribution.urgencyWeight}% / {100 - patientDistribution.urgencyWeight}%
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-2`}>Ancienneté</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={patientDistribution.urgencyWeight}
                        onChange={(e) => {
                          setPatientDistribution({...patientDistribution, urgencyWeight: parseInt(e.target.value)});
                          setShowUnsavedChanges(true);
                          setSimulationResults(null);
                          setSelectedPreset(null); // Déselectionner le préréglage car on a modifié les paramètres
                        }}
                        className="flex-1"
                      />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>Urgence</span>
                    </div>
                    
                    {/* Visualisation contextuelle de l'impact */}
                    <div className={`mt-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Impact estimé:</span>
                          <span className={`ml-1 ${
                            patientDistribution.urgencyWeight > 70 ? (darkMode ? 'text-red-400' : 'text-red-600') :
                            patientDistribution.urgencyWeight < 30 ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') :
                            (darkMode ? 'text-green-400' : 'text-green-600')
                          }`}>
                            {patientDistribution.urgencyWeight > 70 ? "Priorité forte aux urgences" :
                            patientDistribution.urgencyWeight < 30 ? "Priorité à l'ordre d'arrivée" :
                            "Équilibre optimal"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-3">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{Math.round(80 - (patientDistribution.urgencyWeight * 0.4))} min</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{Math.round(60 + (patientDistribution.urgencyWeight * 0.2))} patients/jour</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini graphique d'impact */}
                      <div className="mt-1 h-4 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                        <div className="h-full flex">
                          <div 
                            className="bg-green-500" 
                            style={{ width: `${Math.min(100, Math.max(0, 100 - Math.abs(patientDistribution.urgencyWeight - 50) * 2))}%` }}
                          ></div>
                          <div 
                            className={`${patientDistribution.urgencyWeight > 50 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                            style={{ width: `${Math.min(100, Math.abs(patientDistribution.urgencyWeight - 50) * 2)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Score de priorité = {patientDistribution.urgencyWeight}% × niveau d'urgence + {100 - patientDistribution.urgencyWeight}% × temps d'attente
                    </p>
                  </div>
                  
                  {/* Patients par heure avec visualisation contextuelle */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <label className="font-medium text-sm">Nombre maximum de patients par heure et par médecin</label>
                        <button 
                          className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          onMouseEnter={() => setShowHelpTooltip('maxPatients')}
                          onMouseLeave={() => setShowHelpTooltip(null)}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        
                        {showHelpTooltip === 'maxPatients' && (
                          <div className={`absolute mt-8 ml-6 p-3 rounded-lg shadow-lg z-10 text-sm max-w-xs ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}>
                            <p className="font-medium mb-1">Charge de travail des médecins</p>
                            <p className="mb-2">Ce paramètre détermine le nombre maximum de patients qu'un médecin peut voir par heure, influençant directement le temps d'attente et la charge de travail.</p>
                            <ul className="space-y-1 list-disc pl-4">
                              <li>2-3 patients/h: Consultations approfondies</li>
                              <li>4-5 patients/h: Équilibre recommandé</li>
                              <li>6+ patients/h: Consultations rapides, risque de surcharge</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <button 
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-l-md px-2 py-1`}
                          onClick={() => {
                            if (patientDistribution.maxPatientsPerHour > 1) {
                              setPatientDistribution({...patientDistribution, maxPatientsPerHour: patientDistribution.maxPatientsPerHour - 1});
                              setShowUnsavedChanges(true);
                              setSimulationResults(null);
                              setSelectedPreset(null);
                            }
                          }}
                        >
                          -
                        </button>
                        <span className={`px-3 py-1 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                          {patientDistribution.maxPatientsPerHour}
                        </span>
                        <button 
                          className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-r-md px-2 py-1`}
                          onClick={() => {
                            setPatientDistribution({...patientDistribution, maxPatientsPerHour: patientDistribution.maxPatientsPerHour + 1});
                            setShowUnsavedChanges(true);
                            setSimulationResults(null);
                            setSelectedPreset(null);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Visualisation contextuelle de l'impact */}
                    <div className={`mt-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Impact estimé:</span>
                          <span className={`ml-1 ${
                            patientDistribution.maxPatientsPerHour > 6 ? (darkMode ? 'text-red-400' : 'text-red-600') :
                            patientDistribution.maxPatientsPerHour < 4 ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') :
                            (darkMode ? 'text-green-400' : 'text-green-600')
                          }`}>
                            {patientDistribution.maxPatientsPerHour > 6 ? "Charge élevée" :
                            patientDistribution.maxPatientsPerHour < 4 ? "Consultations approfondies" :
                            "Équilibre optimal"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-3">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{100 - (patientDistribution.maxPatientsPerHour * 5)} min</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{patientDistribution.maxPatientsPerHour * 8} patients/jour</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mini graphique de charge */}
                      <div className="mt-1 h-4 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                        <div 
                          className={`h-full ${
                            patientDistribution.maxPatientsPerHour <= 3 ? 'bg-blue-500' :
                            patientDistribution.maxPatientsPerHour <= 5 ? 'bg-green-500' :
                            patientDistribution.maxPatientsPerHour <= 6 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, (patientDistribution.maxPatientsPerHour / 10) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      Cette limite s'applique à tous les consultants et spécialités. Les consultants ne pourront pas dépasser cette limite.
                    </p>
                  </div>
                  
                  {/* Algorithme de répartition amélioré */}
                  <div className="mb-6">
                    <div className="flex items-center">
                      <h4 className="font-medium text-sm">Algorithme de répartition</h4>
                      <button 
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        onMouseEnter={() => setShowHelpTooltip('algorithm')}
                        onMouseLeave={() => setShowHelpTooltip(null)}
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      
                      {showHelpTooltip === 'algorithm' && (
                        <div className={`absolute mt-8 ml-6 p-3 rounded-lg shadow-lg z-10 text-sm max-w-xs ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'}`}>
                          <p className="font-medium mb-1">Algorithmes de répartition</p>
                          <p className="mb-2">Détermine comment les patients sont distribués entre les médecins disponibles.</p>
                          <ul className="space-y-1 list-disc pl-4">
                            <li><span className="font-medium">Round-Robin:</span> Distribution équilibrée, chaque médecin reçoit un nombre similaire de patients</li>
                            <li><span className="font-medium">Réaffectation manuelle:</span> Permet aux secrétaires de contourner l'algorithme automatique</li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mb-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mt-3">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="round-robin" 
                          checked={patientDistribution.useRoundRobin}
                          onChange={() => {
                            setPatientDistribution({...patientDistribution, useRoundRobin: !patientDistribution.useRoundRobin});
                            setShowUnsavedChanges(true);
                            setSimulationResults(null);
                            setSelectedPreset(null);
                          }}
                          className="h-4 w-4 mr-2"
                        />
                        <label htmlFor="round-robin" className="text-sm">Utiliser l'algorithme round-robin</label>
                      </div>
                      <StatusBadge 
                        type={patientDistribution.useRoundRobin ? 'success' : 'info'}
                        label={patientDistribution.useRoundRobin ? 'Activé' : 'Désactivé'}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="manual-override" 
                          checked={patientDistribution.allowManualOverride}
                          onChange={() => {
                            setPatientDistribution({...patientDistribution, allowManualOverride: !patientDistribution.allowManualOverride});
                            setShowUnsavedChanges(true);
                            setSimulationResults(null);
                            setSelectedPreset(null);
                          }}
                          className="h-4 w-4 mr-2"
                        />
                        <label htmlFor="manual-override" className="text-sm">Autoriser la réaffectation manuelle</label>
                      </div>
                      <StatusBadge 
                        type={patientDistribution.allowManualOverride ? 'success' : 'info'}
                        label={patientDistribution.allowManualOverride ? 'Activé' : 'Désactivé'}
                      />
                    </div>
                    
                    {/* Visualisation contextuelle de l'algorithme */}
                    <div className={`mt-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex justify-between text-xs">
                        <div>
                          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Impact estimé:</span>
                          <span className={`ml-1 ${
                            patientDistribution.useRoundRobin ? (darkMode ? 'text-green-400' : 'text-green-600') :
                            (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                          }`}>
                            {patientDistribution.useRoundRobin ? "Charge équilibrée entre médecins" : "Possible déséquilibre de charge"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Visualisation de la répartition */}
                      <div className="mt-1 relative h-5">
                        <div className="flex justify-between absolute inset-0">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-1/4 px-0.5">
                              <div 
                                className={`h-4 rounded ${
                                  patientDistribution.useRoundRobin ? 'bg-green-500' : 
                                  i === 0 ? 'bg-red-500' : 
                                  i === 1 ? 'bg-yellow-500' : 
                                  i === 2 ? 'bg-blue-500' : 
                                  'bg-green-500'
                                }`}
                                style={{ 
                                  width: '100%', 
                                  opacity: patientDistribution.useRoundRobin ? 0.9 : 
                                  i === 0 ? 1 : 
                                  i === 1 ? 0.8 : 
                                  i === 2 ? 0.5 : 
                                  0.3
                                }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      L'algorithme round-robin répartit équitablement les patients entre les médecins disponibles, pondéré par les niveaux d'urgence.
                    </p>
                  </div>
                  
                  {/* Section paramètres avancés conditionnelle */}
                  {showAdvancedSettings && (
                    <div className={`mt-6 p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                      <h4 className="font-medium flex items-center mb-3">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres avancés
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Règles conditionnelles */}
                        <div>
                          <label className="block mb-2 text-sm font-medium">Règles conditionnelles</label>
                          <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <input type="checkbox" id="weekend-rule" className="h-4 w-4 mr-2" />
                                <label htmlFor="weekend-rule" className="text-sm">Augmenter le poids d'ancienneté le week-end</label>
                              </div>
                              <ActionButton 
                                label="Configurer"
                                variant="info"
                                size="xs"
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input type="checkbox" id="peak-rule" className="h-4 w-4 mr-2" />
                                <label htmlFor="peak-rule" className="text-sm">Mode haute capacité aux heures de pointe</label>
                              </div>
                              <ActionButton 
                                label="Configurer"
                                variant="info"
                                size="xs"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Exceptions par médecin */}
                        <div>
                          <label className="block mb-2 text-sm font-medium">Exceptions par médecin</label>
                          <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="text-sm text-center py-2">
                              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucune exception configurée
                              </span>
                            </div>
                            <ActionButton 
                              label="Ajouter une exception"
                              icon={<Plus className="h-3 w-3 mr-1" />}
                              variant="light"
                              size="sm"
                              fullWidth={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* 2. Onglet Critères d'urgence */}
              {activeTab === 'urgence' && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Configuration des niveaux d'urgence
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className={`w-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <thead>
                        <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <th className="px-3 py-2 text-left text-sm font-medium">Niveau</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Libellé</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Seuil (min)</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Notification</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {urgencyLevels.map((level) => (
                          <tr key={level.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-white ${level.color}`}>
                                {level.level}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <input 
                                type="text" 
                                value={level.label} 
                                onChange={(e) => updateUrgencyLevel(level.id, 'label', e.target.value)}
                                className={`w-full px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <input 
                                type="number" 
                                value={level.timeThreshold} 
                                onChange={(e) => updateUrgencyLevel(level.id, 'timeThreshold', parseInt(e.target.value))}
                                min="1"
                                max="240"
                                className={`w-20 px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                              />
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  id={`notify-${level.id}`} 
                                  checked={level.requireNotification}
                                  onChange={() => updateUrgencyLevel(level.id, 'requireNotification', !level.requireNotification)}
                                  className="h-4 w-4 mr-2"
                                />
                                <label htmlFor={`notify-${level.id}`} className="text-sm">Requise</label>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <button className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}>
                                <Edit className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Info className="h-4 w-4 inline mr-1" />
                      Le seuil temporel indique le temps d'attente maximum recommandé pour chaque niveau d'urgence.
                    </p>
                  </div>
                </div>
              )}
              
              {/* 3. Onglet Paramètres de consultation */}
              {activeTab === 'consultation' && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Paramètres de consultation
                  </h3>
                  
                  {/* Durée par défaut des consultations */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Durée par défaut des consultations</h4>
                      <ActionButton 
                        label="Ajouter une spécialité"
                        icon={<Plus className="h-3 w-3 mr-1" />}
                        variant="info"
                        size="xs"
                        onClick={() => setShowSpecialtyModal(true)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      {consultationSettings.defaultDurations.map((item) => (
                        <div key={item.specialty} className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
                          <span className="font-medium text-sm">{item.specialty}</span>
                          <div className="flex items-center">
                            <div className="flex items-center border rounded-md overflow-hidden mr-2 bg-white dark:bg-gray-700">
                              <button 
                                className={`px-2 py-1 ${darkMode ? 'bg-gray-800 hover:bg-gray-900 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                onClick={() => {
                                  if (item.duration > 5) {
                                    updateSpecialtyDuration(item.specialty, item.duration - 5);
                                  }
                                }}
                              >
                                -
                              </button>
                              <span className={`px-3 py-1 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{item.duration} min</span>
                              <button 
                                className={`px-2 py-1 ${darkMode ? 'bg-gray-800 hover:bg-gray-900 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                onClick={() => updateSpecialtyDuration(item.specialty, item.duration + 5)}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
                              onClick={() => removeSpecialty(item.specialty)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Paramètres connexion bande passante */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Paramètres de connexion et bande passante</h4>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm">Seuil de bande passante pour mode dégradé</label>
                        <span className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {consultationSettings.bandwidthThreshold} Mbps
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="5" 
                        step="0.5"
                        value={consultationSettings.bandwidthThreshold}
                        onChange={(e) => {
                          setConsultationSettings({
                            ...consultationSettings, 
                            bandwidthThreshold: parseFloat(e.target.value)
                          });
                          setShowUnsavedChanges(true);
                        }}
                        className="w-full"
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        En dessous de ce seuil, le système basculera automatiquement en mode audio uniquement.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-sm">Seuil d'alerte pour délai de consultation</label>
                        <span className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {consultationSettings.delayAlertThreshold} min
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="30" 
                        step="5"
                        value={consultationSettings.delayAlertThreshold}
                        onChange={(e) => {
                          setConsultationSettings({
                            ...consultationSettings, 
                            delayAlertThreshold: parseInt(e.target.value)
                          });
                          setShowUnsavedChanges(true);
                        }}
                        className="w-full"
                      />
                      <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Une alerte sera envoyée au médecin si la consultation dépasse sa durée prévue de plus de cette valeur.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Colonne latérale (1/3) */}
            <div className="space-y-6">
              {/* Actions */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
                <h3 className="font-medium mb-4">Actions</h3>
                
                <div className="space-y-2">
                  <ActionButton 
                    label="Enregistrer les modifications"
                    icon={<Save className="h-4 w-4 mr-2" />}
                    variant="primary"
                    onClick={saveChanges}
                    disabled={!showUnsavedChanges}
                    fullWidth={true}
                  />
                  
                  <ActionButton 
                    label="Réinitialiser"
                    icon={<RotateCcw className="h-4 w-4 mr-2" />}
                    variant="secondary"
                    onClick={resetChanges}
                    disabled={!showUnsavedChanges}
                    fullWidth={true}
                  />
                  
                  <ActionButton 
                    label={isSimulating ? "Simulation en cours..." : "Simuler l'impact"}
                    icon={isSimulating ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                    variant={isSimulating ? "warning" : "primary"}
                    onClick={simulateChanges}
                    disabled={isSimulating}
                    fullWidth={true}
                  />
                </div>
              </div>
              
              {/* Indicateur de modifications non enregistrées */}
              {showUnsavedChanges && (
                <AlertNotification
                  message="Vous avez des modifications en attente. N'oubliez pas d'enregistrer vos changements."
                  type="warning"
                  isVisible={true}
                  darkMode={darkMode}
                />
              )}
              
              {/* Résultats de simulation */}
              {simulationResults && (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
                  <h3 className="font-medium mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Résultats de la simulation
                  </h3>
                  
                  <div className={`mb-4 p-3 rounded-lg ${
                    simulationResults.impactScore === "Élevé" 
                      ? (darkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50') 
                      : simulationResults.impactScore === "Moyen"
                        ? (darkMode ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50')
                        : (darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50')
                  }`}>
                    <div className="flex items-start">
                      {simulationResults.impactScore === "Élevé" ? (
                        <AlertTriangle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-500'} mr-2 flex-shrink-0`} />
                      ) : simulationResults.impactScore === "Moyen" ? (
                        <AlertTriangle className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} mr-2 flex-shrink-0`} />
                      ) : (
                        <CheckCircle className={`h-5 w-5 ${darkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0`} />
                      )}
                      <div>
                        <h4 className={`font-medium ${
                          simulationResults.impactScore === "Élevé" 
                            ? (darkMode ? 'text-red-300' : 'text-red-700') 
                            : simulationResults.impactScore === "Moyen"
                              ? (darkMode ? 'text-yellow-300' : 'text-yellow-700')
                              : (darkMode ? 'text-green-300' : 'text-green-700')
                        }`}>
                          Impact {simulationResults.impactScore}
                        </h4>
                        <p className={`text-sm ${
                          simulationResults.impactScore === "Élevé" 
                            ? (darkMode ? 'text-red-400' : 'text-red-600') 
                            : simulationResults.impactScore === "Moyen"
                              ? (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                              : (darkMode ? 'text-green-400' : 'text-green-600')
                        }`}>
                          {simulationResults.impactDetails}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <StatCardGroup darkMode={darkMode}>
                    <StatCard
                      title="Temps d'attente moyen estimé"
                      value={simulationResults.avgWaitTime}
                      suffix="min"
                      icon={<Clock className="h-4 w-4" />}
                      iconBgColor="bg-blue-100"
                      iconColor="text-blue-800"
                      darkMode={darkMode}
                    />
                    
                    <StatCard
                      title="Patients traités par jour"
                      value={simulationResults.patientsPerDay}
                      icon={<Users className="h-4 w-4" />}
                      iconBgColor="bg-green-100"
                      iconColor="text-green-800"
                      darkMode={darkMode}
                    />
                  </StatCardGroup>
                  
                  <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-3`}>
                    <span className="text-sm block mb-2">Distribution des niveaux d'urgence</span>
                    <div className="h-4 flex rounded-full overflow-hidden">
                      {simulationResults.urgencyDistribution.map((item) => (
                        <div 
                          key={item.level}
                          className={`${getUrgencyColorClass(item.level)}`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs">Niveau 1-2</span>
                      <span className="text-xs">Niveau 3</span>
                      <span className="text-xs">Niveau 4-5</span>
                    </div>
                  </div>
                  
                  <p className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Ces résultats sont basés sur des simulations et peuvent varier en situation réelle.
                  </p>
                </div>
              )}
              
              {/* Aide & Informations */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
                <h3 className="font-medium mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Aide & Informations
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h4 className="font-medium mb-1">Comment fonctionne la priorisation ?</h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Le système priorise les patients selon une formule combinant le niveau d'urgence et le temps d'attente selon les poids configurés.
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h4 className="font-medium mb-1">Niveaux d'urgence recommandés</h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Les niveaux 4-5 devraient être réservés aux urgences médicales nécessitant une attention immédiate, tandis que les niveaux 1-2 conviennent aux consultations de routine.
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h4 className="font-medium mb-1">Optimiser les délais d'attente</h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Un équilibre de 50/50 entre urgence et ancienneté est recommandé pour la plupart des cliniques. Ajustez selon les besoins spécifiques de votre établissement.
                    </p>
                  </div>
                </div>
                
                <ActionButton 
                  label="Voir toute la documentation"
                  icon={<HelpCircle className="h-4 w-4 mr-1" />}
                  variant="info"
                  size="sm"
                  fullWidth={true}
                  className="mt-3"
                />
              </div>
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
      
      {/* Modal pour ajouter une spécialité */}
      {showSpecialtyModal && (
        <Modal
          title="Ajouter une spécialité"
          isOpen={showSpecialtyModal}
          onClose={() => setShowSpecialtyModal(false)}
          darkMode={darkMode}
          footer={
            <>
              <ActionButton 
                label="Annuler"
                variant="secondary"
                onClick={() => setShowSpecialtyModal(false)}
              />
              <ActionButton 
                label="Ajouter"
                variant="primary"
                onClick={submitNewSpecialty}
                disabled={!newSpecialty.name.trim()}
              />
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className={`block mb-1 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nom de la spécialité
              </label>
              <input 
                type="text" 
                value={newSpecialty.name} 
                onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
                className={`w-full px-3 py-2 rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Ex: Neurologie"
              />
            </div>
            
            <div>
              <label className={`block mb-1 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Durée par défaut (minutes)
              </label>
              <div className="flex items-center">
                <button 
                  className={`px-3 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } rounded-l-md`}
                  onClick={() => {
                    if (newSpecialty.duration > 5) {
                      setNewSpecialty({...newSpecialty, duration: newSpecialty.duration - 5});
                    }
                  }}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={newSpecialty.duration} 
                  onChange={(e) => setNewSpecialty({...newSpecialty, duration: parseInt(e.target.value) || 0})}
                  className={`w-16 px-3 py-2 text-center ${
                    darkMode 
                      ? 'bg-gray-800 text-white border-gray-700' 
                      : 'bg-white text-gray-800 border-gray-200'
                  } border-y`}
                  min="5"
                  max="120"
                  step="5"
                />
                <button 
                  className={`px-3 py-2 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } rounded-r-md`}
                  onClick={() => setNewSpecialty({...newSpecialty, duration: newSpecialty.duration + 5})}
                >
                  +
                </button>
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>minutes</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ConfigurationReglesOperationnelles;