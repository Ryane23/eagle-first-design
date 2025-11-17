import React, { useState, useEffect } from 'react';
import { 
  Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, 
  ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, 
  AlertTriangle, Wifi, WifiOff, ChevronDown, MoreVertical, UserPlus, 
  RefreshCw, Monitor, Clock, CheckCircle, PlusCircle, Edit, User, 
  ChevronRight, Video, ArrowRight, MapPin, Zap, BarChart2, Phone, 
  Send, Eye, Shield, Database, HeartHandshake, PhoneCall, Info, 
  AlertCircle, Trash2, Share2, Command, Clipboard, Save
} from 'lucide-react';

// Import des modules partagés - OPTIMISATION COMPLÈTE
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { SidePanel } from '@panels/SidePanel';
import { ViewSelector } from '@layout/ViewSelector';
import { SearchInput } from '@forms/SearchInput';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import DynamicBadge from '@data-display/DynamicBadge';
import FilterableTable from '@data-display/FilterableTable';
import { Modal } from '@modals/Modal';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import FloatingActionButton from '@buttons/FloatingActionButton';
import { AlertNotification } from '@feedback/AlertNotification';
import ToastNotification from '@feedback/ToastNotification';
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';
import { PatientCard } from '@cards/PatientCard';
import UrgencyLevelIndicator from '@medical/UrgencyLevelIndicator';
import PatientPriorityManager from '@medical/PatientPriorityManager';
import HistoryTracker from '@tracking/HistoryTracker';
import ExpandablePanel from '@panels/ExpandablePanel';
import MultiTabContainer from '@layout/MultiTabContainer';

// Import des modules extraits (nouvellement partagés)
import { mockDoctorInfo } from '@mocks/doctors';
import { mockUrgentPatients } from '@mocks/urgentPatients';
import mockModificationHistory from '@mocks/modificationHistory';
import mockNotificationsData from '@mocks/notifications';
import { 
  EMERGENCY_PRIORITY_LEVELS, 
  EMERGENCY_MENU_ITEMS, 
  QUICK_ACTIONS 
} from '@constants/emergencyConstants';
import { 
  filterPatientsBySearch, 
  filterPatientsByUrgency 
} from '@filters/patientFilters';
import { 
  sortPatientsByUrgency, 
  sortPatientsByWaitTime, 
  sortPatientsByName 
} from '@sorters/patientSorter';
import { 
  simulateOfflineMode, 
  simulateOnlineMode 
} from '@utils/connectionUtils';
import { formatEmergencyStats } from '@formatters/emergencyFormatters';
import { calculatePatientPriority } from '@calculators/priorityCalculator';
import { ConsultationService } from '@services/consultationService';
import { NotificationService } from '@services/notificationService';

const GestionUrgences = () => {
  // États de l'application
  const [darkMode, setDarkMode] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [selectedUrgencyLevel, setSelectedUrgencyLevel] = useState(3);
  const [previousUrgencyLevel, setPreviousUrgencyLevel] = useState(3);
  const [justification, setJustification] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCriteriaInfo, setShowCriteriaInfo] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [justificationRequired, setJustificationRequired] = useState(false);
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [connected, setConnected] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState("");
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");
  const [sortOption, setSortOption] = useState("urgencyLevel");
  const [activeMenuItem, setActiveMenuItem] = useState("emergencies");
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentView, setCurrentView] = useState('list');
  const [activeTab, setActiveTab] = useState('patients');
  
  // Utilisation des données partagées
  const doctorInfo = mockDoctorInfo;
  const urgentPatients = mockUrgentPatients;
  const modificationHistory = mockModificationHistory;
  const notificationsData = mockNotificationsData;
  const priorityLevels = EMERGENCY_PRIORITY_LEVELS;
  
  // Configuration des éléments de menu depuis les constantes partagées
  const menuItems = EMERGENCY_MENU_ITEMS.main(activeMenuItem);
  const bottomMenuItems = EMERGENCY_MENU_ITEMS.bottom(activeMenuItem);

  // Services partagés
  const consultationService = new ConsultationService();
  const notificationService = new NotificationService();

  // Colonnes pour FilterableTable
  const tableColumns = [
    {
      id: 'urgency',
      header: 'Urgence',
      accessor: (row) => (
        <UrgencyLevelIndicator
          level={row.urgency}
          showIcon={true}
          showNumber={true}
          size="sm"
        />
      ),
      sortable: true
    },
    {
      id: 'name',
      header: 'Patient',
      accessor: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.age} ans • {row.gender}</div>
        </div>
      ),
      sortable: true,
      filterable: true
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (row) => (
        <StatusBadge
          type={row.status === 'ready' ? 'success' : row.status === 'in_preparation' ? 'warning' : 'info'}
          label={row.status === 'ready' ? 'Prêt' : row.status === 'in_preparation' ? 'En préparation' : 'En attente'}
        />
      ),
      filterable: true
    },
    {
      id: 'waitTime',
      header: 'Attente',
      accessor: (row) => (
        <DynamicBadge
          label={`${row.waitTime} min`}
          variant={row.waitTime > 20 ? 'error' : row.waitTime > 10 ? 'warning' : 'success'}
          icon={<Clock className="h-3 w-3" />}
        />
      ),
      sortable: true
    },
    {
      id: 'clinic',
      header: 'Centre',
      accessor: (row) => (
        <div>
          <div className="text-xs font-medium">{row.clinicCode}</div>
          <div className="text-xs text-gray-500">{row.clinicName}</div>
        </div>
      ),
      filterable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row) => (
        <ButtonGroup>
          <ActionButton
            label="Consulter"
            icon={<PlayCircle className="h-3 w-3" />}
            variant="primary"
            size="xs"
            onClick={() => startConsultation(row)}
          />
          <ActionButton
            label="Contact"
            icon={<PhoneCall className="h-3 w-3" />}
            variant="secondary"
            size="xs"
            onClick={() => {
              setCurrentPatient(row);
              setShowContactModal(true);
            }}
          />
        </ButtonGroup>
      )
    }
  ];

  // Utilisateur actuel pour PatientPriorityManager
  const currentUser = {
    id: "MED-045",
    name: "Dr. Kouam",
    role: "Médecin",
    canModifyPriority: true
  };

  // Données statistiques calculées avec les fonctions partagées
  const statsData = formatEmergencyStats(urgentPatients);

  // Configuration des onglets pour MultiTabContainer
  const tabsConfig = [
    {
      id: 'patients',
      label: 'Patients',
      icon: <Users className="h-4 w-4" />,
      badge: filteredPatients.length,
      content: (
        <div className="space-y-4">
          {currentView === 'priority' ? (
            <PatientPriorityManager
              patients={filteredPatients.map(p => ({
                ...p,
                priorityLevel: p.urgency,
                modificationHistory: modificationHistory.filter(h => h.entityId === p.id).map(h => ({
                  timestamp: h.timestamp,
                  oldLevel: h.changes[0]?.oldValue || p.urgency,
                  newLevel: h.changes[0]?.newValue || p.urgency,
                  user: h.user.name,
                  reason: h.details
                }))
              }))}
              priorityLevels={priorityLevels}
              currentUser={currentUser}
              onPriorityChange={handlePriorityChange}
              onViewPatient={(patientId) => {
                const patient = filteredPatients.find(p => p.id === patientId);
                if (patient) handlePatientAction('select', patient);
              }}
            />
          ) : (
            <FilterableTable
              columns={tableColumns}
              data={filteredPatients}
              emptyMessage="Aucun patient urgent trouvé"
            />
          )}
        </div>
      )
    },
    {
      id: 'stats',
      label: 'Statistiques',
      icon: <BarChart2 className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <StatCardGroup darkMode={darkMode}>
            <StatCard
              title={statsData.totalPatients.label}
              value={statsData.totalPatients.value}
              icon={<AlertTriangle className="h-4 w-4" />}
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
              darkMode={darkMode}
            />
            <StatCard
              title={statsData.avgWaitTime.label}
              value={statsData.avgWaitTime.value}
              suffix="min"
              icon={<Clock className="h-4 w-4" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              darkMode={darkMode}
            />
            <StatCard
              title={statsData.readyPatients.label}
              value={statsData.readyPatients.value}
              icon={<CheckCircle className="h-4 w-4" />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              darkMode={darkMode}
            />
            <StatCard
              title={statsData.connectedCenters.label}
              value={statsData.connectedCenters.value}
              icon={<Building className="h-4 w-4" />}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              darkMode={darkMode}
            />
          </StatCardGroup>
        </div>
      )
    }
  ];

  // Actions pour FloatingActionButton depuis les constantes partagées
  const floatingActions = QUICK_ACTIONS.map(action => ({
    id: action.id,
    icon: action.icon,
    label: action.label,
    onClick: () => {
      if (action.id === "help") {
        setShowCriteriaInfo(true);
      } else if (action.id === "refresh") {
        setToastMessage("Données actualisées");
        setShowSuccessToast(true);
      }
    }
  }));

  // Simulation du temps qui passe
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Effet pour l'alerte hors ligne
  useEffect(() => {
    setShowOfflineAlert(!connected);
  }, [connected]);
  
  // Toggle connexion utilisant les utilitaires partagés
  const toggleConnection = () => {
    if (connected) {
      simulateOfflineMode();
    } else {
      simulateOnlineMode();
    }
    setConnected(!connected);
  };
  
  // Gérer l'envoi du message de contact avec le service partagé
  const handleSendContact = () => {
    if (!contactMessage.trim()) {
      alert("Veuillez saisir un message.");
      return;
    }
    
    // Utilisation du service de notification partagé
    notificationService.showToast(`Message envoyé au personnel du centre ${currentPatient.clinicName}.`, 'success');
    setToastMessage(`Message envoyé au personnel du centre ${currentPatient.clinicName}.`);
    setShowSuccessToast(true);
    setContactMessage("");
    setShowContactModal(false);
  };
  
  // Sélectionner un patient pour afficher ses détails
  const handleSelectPatient = (patient) => {
    if (expandedPatientId === patient.id) {
      setExpandedPatientId(null);
    } else {
      setExpandedPatientId(patient.id);
      setCurrentPatient(patient);
      setSelectedUrgencyLevel(patient.urgency);
      setPreviousUrgencyLevel(patient.urgency);
    }
  };
  
  // Observer les changements de niveau d'urgence pour déterminer si une confirmation est nécessaire
  useEffect(() => {
    if (!currentPatient) return;
    
    // Nécessite justification pour tout changement de niveau
    setJustificationRequired(selectedUrgencyLevel !== previousUrgencyLevel);
    
    // Confirmation requise pour les escalades importantes (différence de 2 niveaux ou plus)
    setConfirmationRequired(selectedUrgencyLevel >= previousUrgencyLevel + 2 || selectedUrgencyLevel <= previousUrgencyLevel - 2);
    
  }, [selectedUrgencyLevel, previousUrgencyLevel, currentPatient]);
  
  // Démarrer une consultation avec le service partagé
  const startConsultation = (patient) => {
    const session = consultationService.createSession(patient.id, doctorInfo.id, 'room_1');
    consultationService.startSession(session.id);
    
    setToastMessage(`Démarrage de la consultation avec ${patient.name}`);
    setShowSuccessToast(true);
  };
  
  // Gérer la modification de priorité avec les calculateurs partagés
  const handlePriorityChange = (patientId, newLevel, reason) => {
    const patient = urgentPatients.find(p => p.id === patientId);
    if (!patient) return;
    
    // Utilisation du calculateur partagé
    const priorityScore = calculatePatientPriority(newLevel, patient.waitTime || 0);
    
    if (confirmationRequired) {
      setConfirmationMessage(`Vous allez modifier le niveau d'urgence de ${previousUrgencyLevel} à ${newLevel}, ce qui représente un changement significatif. Êtes-vous sûr?`);
      setShowConfirmation(true);
      return;
    }
    
    // Si pas besoin de confirmation, procéder directement
    submitChange(patientId, newLevel, reason);
  };
  
  // Soumettre le changement après confirmation si nécessaire
  const submitChange = (patientId, newLevel, reason) => {
    setShowConfirmation(false);
    
    // Simuler la soumission
    setTimeout(() => {
      setToastMessage(`Niveau d'urgence modifié avec succès de ${previousUrgencyLevel} à ${newLevel}. Le personnel de ${currentPatient.clinicName} a été notifié.`);
      setShowSuccessToast(true);
      
      // Mettre à jour le niveau précédent pour la prochaine modification
      setPreviousUrgencyLevel(newLevel);
      setJustification("");
      setExpandedPatientId(null);
    }, 500);
  };
  
  // Annuler la modification
  const handleCancel = () => {
    setSelectedUrgencyLevel(previousUrgencyLevel);
    setJustification("");
    setShowConfirmation(false);
  };
  
  // Filtrer les patients avec les fonctions partagées
  const filteredPatients = urgentPatients
    .filter(patient => {
      const matchesSearch = filterPatientsBySearch([patient], searchTerm).length > 0;
      const matchesSpecialty = filterSpecialty === "all" || patient.specialty === filterSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortOption === "urgencyLevel") {
        return sortPatientsByUrgency([a, b], 'desc').indexOf(a) === 0 ? -1 : 1;
      } else if (sortOption === "waitTime") {
        return sortPatientsByWaitTime([a, b], 'desc').indexOf(a) === 0 ? -1 : 1;
      } else if (sortOption === "name") {
        return sortPatientsByName([a, b], 'asc').indexOf(a) === 0 ? -1 : 1;
      }
      return 0;
    });

  // Gestionnaire pour les actions sur les patients
  const handlePatientAction = (action, patient) => {
    switch(action) {
      case 'select':
        handleSelectPatient(patient);
        break;
      case 'adjustUrgency':
        setCurrentPatient(patient);
        setSelectedUrgencyLevel(patient.urgency);
        setPreviousUrgencyLevel(patient.urgency);
        break;
      case 'contact':
        setCurrentPatient(patient);
        setShowContactModal(true);
        break;
      case 'consult':
        startConsultation(patient);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
    
      {/* Contenu principal avec marge pour s'adapter à la navigation fixe */}
      <div className={`ml-${navCollapsed ? '14' : '56'} transition-all duration-300`}>
        {/* Header */}
        <Header
          title="Gestion des Urgences"
          subtitle={`${doctorInfo.specialty} • ${doctorInfo.clinique}`}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{
            initials: doctorInfo.name.split(' ')[0][0],
            name: doctorInfo.name
          }}
          notificationCount={notifications}
          isOnline={connected}
          extraHeaderItems={
            <div className="flex items-center space-x-2">
              <ConnectionStatus
                isOnline={connected}
                onToggleConnection={toggleConnection}
                showControls={true}
                darkMode={darkMode}
              />
              <ThemeSwitcher
                onChange={setDarkMode}
                defaultDarkMode={darkMode}
                size="small"
              />
            </div>
          }
        />
        
        {/* Contenu de la page avec marge pour le header fixe */}
        <div className="pt-12 p-3">
          {/* Alerte mode hors ligne */}
          <AlertNotification
            message="Mode hors ligne actif - Les données sont stockées localement et seront synchronisées automatiquement une fois la connexion rétablie."
            type="warning"
            isVisible={showOfflineAlert}
            onClose={() => setShowOfflineAlert(false)}
            position="top-center"
            darkMode={darkMode}
          />
          
          {/* Toast de succès */}
          <ToastNotification
            message={toastMessage}
            type="success"
            isVisible={showSuccessToast}
            onClose={() => setShowSuccessToast(false)}
            position="bottom-right"
          />
          
          {/* Barre d'outils avec ViewSelector */}
          <div className="flex flex-wrap items-center justify-between mb-3 gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <div className="flex items-center flex-1 space-x-2">
              <SearchInput
                placeholder="Rechercher patient ou centre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                darkMode={darkMode}
                width="flex-1"
              />
              
              <select 
                className={`px-2 py-1 rounded text-xs ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                } border`}
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
              >
                <option value="all">Toutes</option>
                <option value="Cardiologie">Cardio</option>
                <option value="Pneumologie">Pneumo</option>
                <option value="Dermatologie">Dermato</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <ViewSelector
                currentView={currentView}
                onChange={setCurrentView}
                availableViews={['list', 'priority']}
                darkMode={darkMode}
              />
              
              <ActionButton
                label={showHistoryPanel ? "Masquer historique" : "Voir historique"}
                onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                variant="secondary"
                size="xs"
              />
            </div>
          </div>
          
          {/* Layout principal avec onglets et historique optionnel */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            {/* Contenu principal avec onglets */}
            <div className={`${showHistoryPanel ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <MultiTabContainer
                tabs={tabsConfig}
                defaultTabId="patients"
                onChange={setActiveTab}
              />
            </div>
            
            {/* Panneau latéral pour l'historique */}
            {showHistoryPanel && (
              <div className="lg:col-span-1">
                <SidePanel
                  title="Historique des modifications"
                  isOpen={true}
                  onClose={() => setShowHistoryPanel(false)}
                  darkMode={darkMode}
                >
                  <HistoryTracker
                    history={modificationHistory}
                    maxHeight="calc(100vh-16rem)"
                    showFilter={false}
                    showSearch={false}
                    showExport={false}
                  />
                </SidePanel>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal critères d'urgence avec ExpandablePanel */}
      <Modal
        title="Critères des niveaux d'urgence"
        isOpen={showCriteriaInfo}
        onClose={() => setShowCriteriaInfo(false)}
        darkMode={darkMode}
        width="max-w-4xl"
      >
        <div className="space-y-2">
          {priorityLevels.map(level => (
            <ExpandablePanel
              key={level.id}
              title={`Niveau ${level.level} - ${level.label}`}
              icon={<UrgencyLevelIndicator level={level.level} showIcon={true} showNumber={false} size="sm" />}
              initiallyExpanded={level.level === 5}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{level.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Paramètres</h4>
                  <div className="space-y-1 text-sm">
                    <div>Temps d'attente maximum: <strong>{level.maxWaitTime} min</strong></div>
                    <div>Couleur: <span className={`px-2 py-1 rounded bg-${level.color}-100 text-${level.color}-800`}>{level.color}</span></div>
                  </div>
                </div>
              </div>
            </ExpandablePanel>
          ))}
        </div>
      </Modal>
      
      {/* Modal de confirmation */}
      <Modal
        title="Confirmation requise"
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        darkMode={darkMode}
        footer={
          <ButtonGroup>
            <ActionButton
              label="Annuler"
              onClick={() => setShowConfirmation(false)}
              variant="secondary"
            />
            <ActionButton
              label="Confirmer"
              onClick={() => submitChange(currentPatient?.id, selectedUrgencyLevel, justification)}
              variant="primary"
            />
          </ButtonGroup>
        }
      >
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {confirmationMessage}
          </p>
        </div>
      </Modal>
      
      {/* Modal de contact */}
      <Modal
        title="Contacter le personnel du centre"
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        darkMode={darkMode}
        footer={
          <ButtonGroup>
            <ActionButton
              label="Annuler"
              onClick={() => setShowContactModal(false)}
              variant="secondary"
            />
            <ActionButton
              label="Envoyer"
              onClick={handleSendContact}
              variant="primary"
              icon={<Send className="h-4 w-4" />}
              disabled={!contactMessage.trim()}
            />
          </ButtonGroup>
        }
      >
        <div className="mb-3">
          {currentPatient && (
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-3 flex justify-between`}>
              <div>
                <p className="text-xs font-medium">{currentPatient.name}</p>
                <p className="text-xs text-gray-500">{currentPatient.age} ans • {currentPatient.gender === 'M' ? 'H' : 'F'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{currentPatient.clinicName}</p>
                <p className="text-xs text-gray-500">{currentPatient.clinicCode}</p>
              </div>
            </div>
          )}
          
          <textarea
            className={`w-full p-2 rounded-lg border text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            rows="3"
            placeholder="Écrivez votre message au personnel du centre..."
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
          />
          
          <div className="flex items-center justify-between mt-2">
            <ButtonGroup>
              <ActionButton
                label="Appel direct"
                icon={<Phone className="h-3 w-3" />}
                variant="success"
                size="xs"
              />
              <ActionButton
                label="Urgent"
                icon={<AlertTriangle className="h-3 w-3" />}
                variant="danger"
                size="xs"
              />
            </ButtonGroup>
            <div className="text-xs text-gray-500">
              Message envoyé à tous les personnels du centre
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Bouton d'aide flottant avec actions multiples */}
      <FloatingActionButton
        actions={floatingActions}
        position="bottom-right"
        color="blue"
        showLabels={true}
      />
    </div>
  );
};

export default GestionUrgences;