import React, { useState, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, Cloud, CloudOff, Database, RefreshCw, Clock, CheckCircle, AlertCircle, MapPin, Zap, BarChart2, ChevronRight, ChevronDown, Sliders, Save, Upload, Download, XCircle, Info, HardDrive, Server, UserPlus, RotateCcw, Command, Trash, Archive, PlusCircle, Edit, Maximize, Minimize, Monitor, User
} from 'lucide-react';

// Import des composants partagés
// Layout Components
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';

// Common Components
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Form Components
import { SearchInput } from '@forms/SearchInput';

// Data Display Components
import { StatusBadge } from '@data-display/StatusBadge';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';

// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';

// System Components
import OfflineModeManager from '@system/OfflineModeManager';
import ConnectionStatusMonitor from '@system/ConnectionStatusMonitor';
import SynchronizationQueue from '@system/SynchronizationQueue';

// Tracking Components
import HistoryTracker from '@tracking/HistoryTracker';

// Hooks
import { useConnectionStatus } from '@hooks/useConnectionStatus';
import { useDarkMode } from '@hooks/useDarkMode';

// Utils
import { formatWaitTime, getStatusBadgeVariant } from '@utils/statusUtils';

// Types
import { Center, User as UserType } from '@types';

const OfflineManagementInterface = () => {
 // États
 const [navCollapsed, setNavCollapsed] = useState(false);
 const { darkMode, toggleDarkMode } = useDarkMode();
 const [selectedAction, setSelectedAction] = useState(null);
 const { status: connectionStatus, toggleConnection } = useConnectionStatus();
 const [showSyncHistory, setShowSyncHistory] = useState(false);
 const [syncFrequency, setSyncFrequency] = useState(5);
 const [expandedSection, setExpandedSection] = useState('all');
 const [showStats, setShowStats] = useState(true);

 // Données simulées
 const offlineActions = [
   { id: 1, type: 'patient', action: 'create', timestamp: '10:15', status: 'pending', priority: 'high', data: { name: "Nkoa Marie", age: 32, gender: "F", urgency: 3, specialty: "Pédiatrie" } },
   { id: 2, type: 'patient', action: 'update', timestamp: '10:22', status: 'pending', priority: 'medium', data: { name: "Ekong Paul", id: 45, field: "urgency", oldValue: 2, newValue: 3 } },
   { id: 3, type: 'appointment', action: 'create', timestamp: '10:30', status: 'pending', priority: 'high', data: { patient: "Mbida Jean", doctor: "Dr. Nana", date: "2025-05-12", time: "11:30" } },
   { id: 4, type: 'patient', action: 'create', timestamp: '10:45', status: 'pending', priority: 'high', data: { name: "Biya Robert", age: 57, gender: "M", urgency: 4, specialty: "Cardiologie" } },
   { id: 5, type: 'document', action: 'update', timestamp: '11:05', status: 'pending', priority: 'low', data: { type: "Ordonnance", patient: "Kamga Pierre", id: 112 } },
   { id: 6, type: 'appointment', action: 'update', timestamp: '11:10', status: 'pending', priority: 'medium', data: { patient: "Fouda Alice", id: 78, field: "status", oldValue: "confirmé", newValue: "annulé" } },
 ];

 const syncHistory = [
   { id: 1, timestamp: '09:15', status: 'success', items: 8, details: 'Synchronisation complète réussie' },
   { id: 2, timestamp: '09:45', status: 'failed', items: 0, details: 'Échec de connexion au serveur principal' },
   { id: 3, timestamp: '10:00', status: 'partial', items: 3, details: 'Synchronisation partielle - 3/5 éléments' },
   { id: 4, timestamp: '10:30', status: 'failed', items: 0, details: 'Timeout après 30 secondes' },
   { id: 5, timestamp: '11:00', status: 'success', items: 4, details: 'Synchronisation complète réussie' }
 ];

 // Statistiques de stockage
 const storageStats = {
   used: 4.2, // MB
   total: 50, // MB
   items: 42,
   maxItems: 500,
   lastSync: '11:00',
 };

 // Types d'actions pour le filtrage
 const actionTypes = [
   { id: 'all', label: 'Toutes les actions', count: offlineActions.length },
   { id: 'patient', label: 'Patients', count: offlineActions.filter(a => a.type === 'patient').length },
   { id: 'appointment', label: 'Rendez-vous', count: offlineActions.filter(a => a.type === 'appointment').length },
   { id: 'document', label: 'Documents', count: offlineActions.filter(a => a.type === 'document').length }
 ];

 // Fonction pour gérer la sélection d'une action
 const handleSelectAction = (action) => {
   setSelectedAction(action === selectedAction ? null : action);
 };

 // Centre secondaire (comme dans le tableau de bord original)
 const centerInfo: Center = {
   id: 'CSJ-YDE',
   name: "Clinique Saint Jean - Yaoundé",
   code: "CSJ-YDE",
   type: "secondary"
 };

 // Utilisateur
 const currentUser: UserType = {
   id: 'SS-001',
   name: 'Sara Simo',
   email: 'sara.simo@eagle-health.cm',
   role: 'secretary',
   initials: 'SS'
 };

 // Configuration des éléments de menu pour la Sidebar
 const menuItems = [
   { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
   { icon: <AlertTriangle size={18} />, label: "Gestion des Urgences", path: "#", isActive: false },
   { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
   { icon: <FileText size={18} />, label: "Post Consultation", path: "#", isActive: false },
   { icon: <WifiOff size={18} />, label: "Mode Hors Ligne", path: "#", isActive: true },
   { icon: <Activity size={18} />, label: "Monitoring technique", path: "#", isActive: false },
   { icon: <MessageSquare size={18} />, label: "Communication", path: "#", isActive: false }
 ];

 const bottomMenuItems = [
   { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
   { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
 ];
 
 // Simuler les fonctions de callback
 const handleSync = () => console.log("Synchronisation initiée");
 const handleTestConnection = () => console.log("Test de connexion initié");
 const handleDeleteAction = (actionId) => console.log("Suppression de l'action", actionId);
 const handleActionChange = (actionId, data) => console.log("Modification de l'action", actionId, data);
 const handleChangeSyncFrequency = (minutes) => setSyncFrequency(minutes);

 return (
   <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
     {/* Navigation latérale avec le composant partagé */}
     <Sidebar 
       appName="EAGLE"
       menuItems={menuItems}
       bottomMenuItems={bottomMenuItems}
       darkMode={darkMode}
     />
     
     {/* Contenu principal */}
     <div className="flex-1 overflow-hidden flex flex-col">
       {/* En-tête avec le composant partagé */}
       <Header
         title="Gestion du Mode Hors Ligne"
         subtitle=""
         centerInfo={centerInfo}
         isOnline={connectionStatus.isOnline}
         bandwidth={connectionStatus.bandwidth}
         darkMode={darkMode}
         toggleDarkMode={toggleDarkMode}
         user={currentUser}
         notificationCount={1}
         extraHeaderItems={
           <button 
             onClick={() => setShowStats(!showStats)} 
             className="ml-2 text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md"
             title="Afficher/Masquer les statistiques"
           >
             {showStats ? (
               <>
                 <Minimize size={12} className="mr-1" /> Stats
               </>
             ) : (
               <>
                 <Maximize size={12} className="mr-1" /> Stats
               </>
             )}
           </button>
         }
       />
       
       {/* Contenu principal */}
       <div className="flex-1 overflow-auto p-3">
         {/* Utiliser ConnectionStatusMonitor quand hors ligne */}
         {!connectionStatus.isOnline && (
           <ConnectionStatusMonitor
             isOnline={connectionStatus.isOnline}
             onConnectionChange={toggleConnection}
             onConnectionTest={handleTestConnection}
             showFullAlert={true}
             lastSyncTime={storageStats.lastSync}
             offlineActions={offlineActions.length}
             pinned={false}
           />
         )}
         
         {/* Utiliser ConnectionStatusMonitor quand en ligne */}
         {connectionStatus.isOnline && (
           <ConnectionStatusMonitor
             isOnline={connectionStatus.isOnline}
             onConnectionChange={toggleConnection}
             onReconnect={handleSync}
             showFullAlert={true}
             lastSyncTime={storageStats.lastSync}
             offlineActions={offlineActions.length}
             bandwidthSpeed={connectionStatus.bandwidth}
             pinned={false}
           />
         )}

         {/* Statistiques avec StatCardGroup */}
         {showStats && (
           <StatCardGroup compact={true} darkMode={darkMode}>
             <StatCard
               title="Actions non synchronisées"
               value={offlineActions.length}
               icon={<CloudOff size={18} />}
               iconBgColor="bg-red-100"
               iconColor="text-red-600"
               darkMode={darkMode}
             />
             <StatCard
               title="Stockage utilisé"
               value={`${storageStats.used}/${storageStats.total}`}
               suffix="MB"
               icon={<HardDrive size={18} />}
               iconBgColor="bg-blue-100"
               iconColor="text-blue-600"
               darkMode={darkMode}
             />
             <StatCard
               title="Dernière synchronisation"
               value={storageStats.lastSync}
               icon={<Clock size={18} />}
               iconBgColor="bg-yellow-100"
               iconColor="text-yellow-600"
               darkMode={darkMode}
             />
             <StatCard
               title="Capacité restante"
               value={storageStats.maxItems - storageStats.items}
               suffix="entrées"
               icon={<Database size={18} />}
               iconBgColor="bg-green-100"
               iconColor="text-green-600"
               darkMode={darkMode}
             />
           </StatCardGroup>
         )}
         
         {/* Boutons d'action rapide */}
         <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
           <ButtonGroup>
             <ActionButton
               label="Synchroniser Maintenant"
               icon={<RefreshCw size={14} />}
               variant={connectionStatus.isOnline ? "primary" : "light"}
               size="sm"
               disabled={!connectionStatus.isOnline}
               onClick={handleSync}
             />
             <ActionButton
               label="Nouvel Enregistrement Hors Ligne"
               icon={<UserPlus size={14} />}
               variant="info"
               size="sm"
             />
             <ActionButton
               label="Planifier Synchronisation"
               icon={<Clock size={14} />}
               variant="warning"
               size="sm"
             />
             <ActionButton
               label="Paramètres Hors Ligne"
               icon={<Settings size={14} />}
               variant="secondary"
               size="sm"
             />
           </ButtonGroup>
           
           <div className="flex space-x-1">
             <SearchInput
               placeholder="Rechercher une action..."
               darkMode={darkMode}
             />
             <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} flex items-center`}>
               <Filter size={14} className="mr-1" />
               <span className="text-xs">Filtrer</span>
             </button>
           </div>
         </div>
         
         {/* Interface principale */}
         <div className="grid grid-cols-3 gap-3">
           {/* Colonne gauche - Actions non synchronisées */}
           <div className="col-span-2">
             {/* Filtres par type d'action */}
             <div className="mb-2 flex space-x-1 overflow-x-auto pb-1">
               {actionTypes.map(type => (
                 <button
                   key={type.id}
                   className={`px-2 py-1 rounded-md text-xs flex items-center whitespace-nowrap ${expandedSection === type.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                   onClick={() => setExpandedSection(type.id)}
                 >
                   {type.label} 
                   <span className="ml-1 px-1.5 py-0.5 bg-white rounded-full text-xs">
                     {type.count}
                   </span>
                 </button>
               ))}
             </div>
             
             {/* Utiliser SynchronizationQueue pour la liste des actions */}
             <SynchronizationQueue
               items={offlineActions.filter(action => expandedSection === 'all' || action.type === expandedSection)}
               totalItems={offlineActions.length}
               processedItems={offlineActions.filter(item => item.status !== 'pending').length}
               isOnline={connectionStatus.isOnline}
               lastSyncTime={storageStats.lastSync}
               onSync={handleSync}
               onCancelItem={handleDeleteAction}
               onRetryItem={id => console.log("Retry item", id)}
               onViewDetails={item => setSelectedAction(item)}
               onChangePriority={(id, priority) => console.log("Change priority", id, priority)}
               onClearSuccess={() => console.log("Clear successful items")}
               className="mb-3"
             />
             
             {/* Utiliser HistoryTracker pour l'historique des synchronisations */}
             <HistoryTracker
               history={syncHistory.map(s => ({
                 id: s.id,
                 type: 'synchronization',
                 action: s.status === 'success' ? 'approve' : s.status === 'failed' ? 'reject' : 'other',
                 user: { id: '1', name: 'Système', role: 'admin' },
                 timestamp: s.timestamp,
                 details: s.details,
                 entityId: s.id,
                 entityName: `Synchronisation #${s.id}`
               }))}
               title="Historique des synchronisations"
               showSearch={false}
               maxHeight="150px"
               showFilter={false}
               onExport={() => console.log("Export history")}
             />
           </div>
           
           {/* Colonne droite - Paramètres et informations */}
           <div className="col-span-1">
             {/* Utiliser OfflineModeManager */}
             <OfflineModeManager
               actions={offlineActions}
               syncHistory={syncHistory}
               isOnline={connectionStatus.isOnline}
               storageStats={storageStats}
               onSync={handleSync}
               onTestConnection={handleTestConnection}
               onDeleteAction={handleDeleteAction}
               onActionChange={handleActionChange}
               onChangeSyncFrequency={handleChangeSyncFrequency}
               syncFrequency={syncFrequency}
             />
             
             {/* Le contenu sélectionné reste le même car il est spécifique à cette interface */}
             {selectedAction && (
               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3 mt-3`}>
                 <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                   <div className="flex items-center">
                     <Info size={14} className="mr-1 text-blue-600" />
                     Détails de l'action
                   </div>
                   <button 
                     className="text-gray-500 hover:text-gray-700"
                     onClick={() => setSelectedAction(null)}
                   >
                     <X size={14} />
                   </button>
                 </h3>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between">
                     <span className="text-xs text-gray-500">Type:</span>
                     <span className="text-xs font-medium">
                       {selectedAction.type === 'patient' ? 'Patient' : selectedAction.type === 'appointment' ? 'Rendez-vous' : 'Document'}
                     </span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-xs text-gray-500">Action:</span>
                     <span className="text-xs font-medium">
                       {selectedAction.action === 'create' ? 'Création' : 'Modification'}
                     </span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-xs text-gray-500">Timestamp:</span>
                     <span className="text-xs font-medium">{selectedAction.timestamp}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-xs text-gray-500">Priorité:</span>
                     <StatusBadge
                       type={selectedAction.priority === 'high' ? 'error' : selectedAction.priority === 'medium' ? 'warning' : 'info'}
                       label={selectedAction.priority === 'high' ? 'Haute' : selectedAction.priority === 'medium' ? 'Moyenne' : 'Basse'}
                       size="xs"
                     />
                   </div>
                   
                   <div className="pt-1 border-t border-gray-200">
                     <span className="text-xs text-gray-500 block mb-1">Données:</span>
                     <pre className={`text-xs p-2 rounded-md overflow-x-auto ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                       {JSON.stringify(selectedAction.data, null, 2)}
                     </pre>
                   </div>
                   
                   <div className="pt-1 flex space-x-1">
                     {connectionStatus.isOnline && (
                       <button className="w-full py-1.5 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">
                         <Upload size={12} className="mr-1" />
                         Synchroniser
                       </button>
                     )}
                     <button className="w-full py-1.5 bg-red-100 text-red-800 rounded-md flex items-center justify-center text-xs">
                       <Trash size={12} className="mr-1" />
                       Supprimer
                     </button>
                   </div>
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default OfflineManagementInterface;