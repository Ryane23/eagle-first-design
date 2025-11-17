import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
Bell, Menu, X, User, Settings, FileText, Users, Calendar, Activity, ChevronRight, LogOut, Database, Shield, Home, Zap, Cpu, HardDrive, Wifi, Clock, Server, CheckCircle, XCircle, AlertTriangle, Info, Download, Search, RefreshCw, Plus, ArrowRight, Filter, AlertOctagon, Layers, Sliders, Maximize2, Minimize2, Eye, EyeOff, BarChart2, Map, GitBranch, Inbox, ThumbsUp, ThumbsDown, TrendingUp, CheckSquare, BellOff, Smartphone, MessageSquare, PlusCircle, AlertCircle, BookOpen, Briefcase, LifeBuoy, Play, Pause, Trash2, Edit, Save, Share2, Layout, Star, Move, ChevronsUp, ChevronsDown, Coffee, Cast, HelpCircle, Tag, Clipboard, Moon, Sun, Monitor, Archive, RotateCcw, Shuffle, Phone, Mail, Wrench
} from 'lucide-react';

// Importation des composants partagés utilisés
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SearchInput } from '@forms/SearchInput';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { Modal } from '@modals/Modal';
import { AlertNotification } from '@feedback/AlertNotification';
import ThemeSwitcher from '@common/ThemeSwitcher';
import FilterableTable from '@data-display/FilterableTable';
import FloatingActionButton from '@buttons/FloatingActionButton';
import ConnectionStatusMonitor from '@system/ConnectionStatusMonitor';
import UserActivityLog from '@system/UserActivityLog';

// Données fictives pour la supervision
const cpuData = [
  { time: '08:00', usage: 35, prediction: 40 },
  { time: '09:00', usage: 48, prediction: 52 },
  { time: '10:00', usage: 65, prediction: 68 },
  { time: '11:00', usage: 72, prediction: 75 },
  { time: '12:00', usage: 58, prediction: 60 },
  { time: '13:00', usage: 45, prediction: 50 },
  { time: '14:00', usage: 62, prediction: 70 },
  { time: '15:00', usage: 75, prediction: 78 },
  { time: '16:00', usage: 80, prediction: 85 },
  { time: '17:00', usage: 70, prediction: 75 },
  { time: '18:00', prediction: 65 },
  { time: '19:00', prediction: 55 },
  { time: '20:00', prediction: 45 },
  { time: '21:00', prediction: 40 },
];

const memoryData = [
  { time: '08:00', used: 42, available: 58, threshold: 80 },
  { time: '09:00', used: 45, available: 55, threshold: 80 },
  { time: '10:00', used: 48, available: 52, threshold: 80 },
  { time: '11:00', used: 52, available: 48, threshold: 80 },
  { time: '12:00', used: 56, available: 44, threshold: 80 },
  { time: '13:00', used: 50, available: 50, threshold: 80 },
  { time: '14:00', used: 58, available: 42, threshold: 80 },
  { time: '15:00', used: 62, available: 38, threshold: 80 },
  { time: '16:00', used: 58, available: 42, threshold: 80 },
  { time: '17:00', used: 55, available: 45, threshold: 80 },
];

const bandwidthData = [
  { time: '08:00', in: 23, out: 12, users: 35 },
  { time: '09:00', in: 35, out: 18, users: 42 },
  { time: '10:00', in: 45, out: 24, users: 58 },
  { time: '11:00', in: 38, out: 20, users: 65 },
  { time: '12:00', in: 30, out: 16, users: 50 },
  { time: '13:00', in: 28, out: 14, users: 48 },
  { time: '14:00', in: 42, out: 22, users: 60 },
  { time: '15:00', in: 50, out: 26, users: 72 },
  { time: '16:00', in: 40, out: 20, users: 65 },
  { time: '17:00', in: 32, out: 16, users: 52 },
];

const weeklyComparison = [
  { day: 'Lun', thisWeek: 65, lastWeek: 58 },
  { day: 'Mar', thisWeek: 72, lastWeek: 65 },
  { day: 'Mer', thisWeek: 68, lastWeek: 70 },
  { day: 'Jeu', thisWeek: 75, lastWeek: 72 },
  { day: 'Ven', thisWeek: 80, lastWeek: 78 },
  { day: 'Sam', thisWeek: 60, lastWeek: 62 },
  { day: 'Dim', thisWeek: 45, lastWeek: 48 },
];

const heatmapData = [
  { hour: '00:00', value: 10 },
  { hour: '01:00', value: 5 },
  { hour: '02:00', value: 3 },
  { hour: '03:00', value: 2 },
  { hour: '04:00', value: 1 },
  { hour: '05:00', value: 5 },
  { hour: '06:00', value: 15 },
  { hour: '07:00', value: 25 },
  { hour: '08:00', value: 35 },
  { hour: '09:00', value: 60 },
  { hour: '10:00', value: 80 },
  { hour: '11:00', value: 85 },
  { hour: '12:00', value: 75 },
  { hour: '13:00', value: 65 },
  { hour: '14:00', value: 70 },
  { hour: '15:00', value: 90 },
  { hour: '16:00', value: 85 },
  { hour: '17:00', value: 70 },
  { hour: '18:00', value: 50 },
  { hour: '19:00', value: 40 },
  { hour: '20:00', value: 30 },
  { hour: '21:00', value: 25 },
  { hour: '22:00', value: 20 },
  { hour: '23:00', value: 15 },
];

const predictiveMaintenanceData = [
  { component: 'Serveur WebRTC', health: 87, expected: '2 mois', maintenance: 'Non' },
  { component: 'Base de données', health: 92, expected: '3 mois', maintenance: 'Non' },
  { component: 'Stockage Cloud', health: 78, expected: '3 semaines', maintenance: 'Programmée' },
  { component: 'Serveur HL7', health: 95, expected: '4 mois', maintenance: 'Non' },
  { component: 'Serveur de Sauvegarde', health: 68, expected: '1 semaine', maintenance: 'Urgente' },
];

const connectedUsers = [
  { id: 1, name: 'Dr. Kouam', role: 'Médecin', clinic: 'Centre Principal', status: 'active', time: '3h 24m' },
  { id: 2, name: 'Mme. Atangana', role: 'Secrétaire', clinic: 'Centre Principal', status: 'active', time: '1h 45m' },
  { id: 3, name: 'M. Ebogo', role: 'Infirmier', clinic: 'Clinique A', status: 'active', time: '0h 32m' },
  { id: 4, name: 'Dr. Ndongo', role: 'Médecin', clinic: 'Clinique B', status: 'idle', time: '0h 58m' },
  { id: 5, name: 'Mme. Mendouga', role: 'Secrétaire', clinic: 'Clinique C', status: 'active', time: '2h 10m' },
];

const clinics = [
  { id: 1, name: 'Centre Principal', status: 'operational', load: 75, users: 12, latency: '230ms' },
  { id: 2, name: 'Clinique A', status: 'operational', load: 60, users: 8, latency: '280ms' },
  { id: 3, name: 'Clinique B', status: 'warning', load: 85, users: 10, latency: '340ms' },
  { id: 4, name: 'Clinique C', status: 'operational', load: 55, users: 7, latency: '310ms' },
  { id: 5, name: 'Clinique D', status: 'degraded', load: 40, users: 5, latency: '500ms' },
];

const services = [
  { id: 1, name: 'WebRTC', status: 'operational', latency: '230ms', uptime: '99.8%', trend: 'stable' },
  { id: 2, name: 'Signature Électronique', status: 'operational', latency: '310ms', uptime: '99.9%', trend: 'improving' },
  { id: 3, name: 'API HL7/FHIR', status: 'operational', latency: '280ms', uptime: '99.5%', trend: 'stable' },
  { id: 4, name: 'Stockage Cloud', status: 'warning', latency: '450ms', uptime: '98.2%', trend: 'degrading' },
  { id: 5, name: 'Zoom SDK', status: 'degraded', latency: '520ms', uptime: '96.7%', trend: 'degrading' },
];

const backupHistory = [
  { id: 1, date: '2025-05-10', time: '23:00', type: 'Complète', status: 'success', size: '4.8 GB' },
  { id: 2, date: '2025-05-09', time: '23:00', type: 'Complète', status: 'success', size: '4.7 GB' },
  { id: 3, date: '2025-05-08', time: '23:00', type: 'Complète', status: 'success', size: '4.7 GB' },
  { id: 4, date: '2025-05-07', time: '23:00', type: 'Complète', status: 'failed', size: '0 GB' },
  { id: 5, date: '2025-05-06', time: '23:00', type: 'Complète', status: 'success', size: '4.6 GB' },
];

const systemLogs = [
  { id: 1, timestamp: '2025-05-11 09:23:45', level: 'error', component: 'WebRTC', message: 'Échec de connexion au serveur de signalisation' },
  { id: 2, timestamp: '2025-05-11 08:42:12', level: 'warning', component: 'API HL7', message: 'Délai de réponse élevé depuis le laboratoire externe' },
  { id: 3, timestamp: '2025-05-11 08:30:54', level: 'info', component: 'Système', message: 'Rotation des logs effectuée avec succès' },
  { id: 4, timestamp: '2025-05-11 07:15:23', level: 'info', component: 'Authentification', message: 'Mise à jour des certificats SSL' },
  { id: 5, timestamp: '2025-05-10 22:03:19', level: 'warning', component: 'Stockage', message: 'Espace disque inférieur à 20%' },
  { id: 6, timestamp: '2025-05-10 18:47:32', level: 'error', component: 'Zoom SDK', message: 'Échec de l\'intégration API pour 3 sessions' },
  { id: 7, timestamp: '2025-05-10 16:22:05', level: 'info', component: 'Base de données', message: 'Indexation complétée avec succès' },
];

const activeAlerts = [
  { id: 1, timestamp: '2025-05-11 09:23:45', level: 'critical', component: 'WebRTC', message: 'Échec de connexion au serveur de signalisation', status: 'new', assignee: null },
  { id: 2, timestamp: '2025-05-11 08:42:12', level: 'warning', component: 'API HL7', message: 'Délai de réponse élevé depuis le laboratoire externe', status: 'in_progress', assignee: 'Jean Kamga' },
  { id: 3, timestamp: '2025-05-10 22:03:19', level: 'warning', component: 'Stockage', message: 'Espace disque inférieur à 20%', status: 'new', assignee: null },
  { id: 4, timestamp: '2025-05-10 18:47:32', level: 'critical', component: 'Zoom SDK', message: 'Échec de l\'intégration API pour 3 sessions', status: 'in_progress', assignee: 'Marie Fouda' },
];

const recommendedActions = [
  { id: 1, component: 'WebRTC', action: 'Redémarrer le service de signalisation', impact: 'Faible', success_rate: '95%' },
  { id: 2, component: 'Stockage Cloud', action: 'Purger les fichiers temporaires', impact: 'Aucun', success_rate: '100%' },
  { id: 3, component: 'Zoom SDK', action: 'Mettre à jour les certificats API', impact: 'Moyen', success_rate: '85%' },
  { id: 4, component: 'Serveur de Sauvegarde', action: 'Planifier maintenance préventive', impact: 'Moyen', success_rate: '92%' },
];

const savedDashboards = [
  { id: 1, name: 'Vue Générale', description: 'Tableaux de bord et métriques essentielles' },
  { id: 2, name: 'Performance Réseau', description: 'Bande passante et latence des cliniques' },
  { id: 3, name: 'Capacité Système', description: 'CPU, mémoire et surveillance des ressources' },
  { id: 4, name: 'Surveillance Services', description: 'État détaillé des services de l\'application' },
];

const availableWidgets = [
  { id: 1, name: 'CPU', icon: <Cpu />, type: 'graph' },
  { id: 2, name: 'Mémoire', icon: <HardDrive />, type: 'graph' },
  { id: 3, name: 'Bande Passante', icon: <Wifi />, type: 'graph' },
  { id: 4, name: 'Utilisateurs', icon: <Users />, type: 'table' },
  { id: 5, name: 'Services', icon: <Server />, type: 'table' },
  { id: 6, name: 'Alertes', icon: <Bell />, type: 'list' },
  { id: 7, name: 'Prédictions', icon: <TrendingUp />, type: 'graph' },
  { id: 8, name: 'Cliniques', icon: <Map />, type: 'map' },
  { id: 9, name: 'Maintenance', icon: <Wrench />, type: 'list' },
  { id: 10, name: 'Heatmap Activité', icon: <Activity />, type: 'heatmap' },
];

// Transformation des données pour les composants partagés
const servicesTableColumns = [
  { id: 'name', header: 'Service', accessor: (row: any) => row.name, sortable: true, filterable: true },
  { 
    id: 'status', 
    header: 'Statut', 
    accessor: (row: any) => (
      <StatusBadge 
        type={row.status} 
        label={row.status === 'operational' ? 'Opérationnel' : 
               row.status === 'warning' ? 'Attention' : 
               row.status === 'degraded' ? 'Dégradé' : 'En panne'} 
      />
    ), 
    sortable: true 
  },
  { id: 'latency', header: 'Latence', accessor: (row: any) => row.latency, sortable: true },
  { id: 'uptime', header: 'Disponibilité', accessor: (row: any) => row.uptime, sortable: true },
  { 
    id: 'trend', 
    header: 'Tendance', 
    accessor: (row: any) => (
      <div className="flex items-center">
        {row.trend === 'improving' && <ChevronsUp className="h-4 w-4 text-green-500" />}
        {row.trend === 'stable' && <ArrowRight className="h-4 w-4 text-blue-500" />}
        {row.trend === 'degrading' && <ChevronsDown className="h-4 w-4 text-red-500" />}
        <span className="ml-1 text-sm">
          {row.trend === 'improving' ? 'Amélioration' : 
           row.trend === 'stable' ? 'Stable' : 'Dégradation'}
        </span>
      </div>
    )
  }
];

const maintenanceTableColumns = [
  { id: 'component', header: 'Composant', accessor: (row: any) => row.component, sortable: true, filterable: true },
  { 
    id: 'health', 
    header: 'Santé', 
    accessor: (row: any) => (
      <div className="flex items-center">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              row.health < 70 ? 'bg-red-500' : 
              row.health < 85 ? 'bg-yellow-500' : 'bg-green-500'
            }`} 
            style={{ width: `${row.health}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm">{row.health}%</span>
      </div>
    ),
    sortable: true 
  },
  { id: 'expected', header: 'Durée prévue', accessor: (row: any) => row.expected, sortable: true },
  { 
    id: 'maintenance', 
    header: 'Maintenance', 
    accessor: (row: any) => (
      <StatusBadge 
        type={row.maintenance === 'Urgente' ? 'error' : 
              row.maintenance === 'Programmée' ? 'warning' : 'success'} 
        label={row.maintenance} 
      />
    ), 
    sortable: true 
  },
  { 
    id: 'actions', 
    header: 'Actions', 
    accessor: (row: any) => (
      <ActionButton
        label="Planifier"
        variant="primary"
        size="xs"
      />
    )
  }
];

const usersTableColumns = [
  { id: 'name', header: 'Nom', accessor: (row: any) => row.name, sortable: true, filterable: true },
  { id: 'role', header: 'Rôle', accessor: (row: any) => row.role, sortable: true, filterable: true },
  { id: 'clinic', header: 'Clinique', accessor: (row: any) => row.clinic, sortable: true, filterable: true },
  { 
    id: 'status', 
    header: 'Statut', 
    accessor: (row: any) => (
      <StatusBadge 
        type={row.status === 'active' ? 'success' : 'warning'} 
        label={row.status === 'active' ? 'Actif' : 'Inactif'} 
      />
    ), 
    sortable: true 
  },
  { id: 'time', header: 'Temps connecté', accessor: (row: any) => row.time, sortable: true }
];

// Transformation des logs pour UserActivityLog
const transformedLogs = systemLogs.map(log => ({
  id: log.id,
  user: { id: 'system', name: 'Système', role: 'System' },
  action: log.level === 'error' ? 'delete' : log.level === 'warning' ? 'update' : 'create',
  resourceType: log.component,
  resourceName: log.message,
  timestamp: log.timestamp,
  details: log.message
}));

const SupervisionTechniqueOptimisee = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLogLevel, setSelectedLogLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState(1);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const [showAlertDetails, setShowAlertDetails] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('day');
  const [showPredictions, setShowPredictions] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState({ email: true, sms: true, app: true });
  const [isOnline, setIsOnline] = useState(true);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  
  // Gestion des widgets des tableaux de bord personnalisables
  const [dashboardWidgets, setDashboardWidgets] = useState([
    { id: 1, widgetType: 1, size: 'medium', position: 1 },
    { id: 2, widgetType: 2, size: 'medium', position: 2 },
    { id: 3, widgetType: 3, size: 'medium', position: 3 },
    { id: 4, widgetType: 6, size: 'large', position: 4 },
    { id: 5, widgetType: 5, size: 'large', position: 5 },
  ]);
  
  // Simulation d'une mise à jour des données toutes les 5 secondes si autoRefresh est activé
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log('Rafraîchissement automatique des données...');
        // Ici on pourrait mettre à jour les données réelles
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Effet pour gérer les alertes d'urgence
  useEffect(() => {
    if (isEmergencyMode) {
      setShowEmergencyAlert(true);
    }
  }, [isEmergencyMode]);

  // Effet pour gérer les alertes hors ligne
  useEffect(() => {
    if (!isOnline) {
      setShowOfflineAlert(true);
    }
  }, [isOnline]);
  
  // Obtenir la tendance icône
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return <ChevronsUp className="h-4 w-4 text-green-500" />;
      case 'stable': return <ArrowRight className="h-4 w-4 text-blue-500" />;
      case 'degrading': return <ChevronsDown className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Filtrer les logs en fonction du niveau et du terme de recherche
  const filteredLogs = systemLogs.filter(log => {
    const matchesLevel = selectedLogLevel === 'all' || log.level === selectedLogLevel;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.component.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });
  
  // Gérer l'activation du mode urgence
  const toggleEmergencyMode = () => {
    setIsEmergencyMode(!isEmergencyMode);
    
    // Si on active le mode urgence, réduire la sidebar et aller au tableau de bord
    if (!isEmergencyMode) {
      setSidebarOpen(false);
      setActiveTab('dashboard');
    }
  };
  
  // Fonction pour ajouter un widget au tableau de bord
  const addWidgetToDashboard = (widgetType) => {
    const newWidget = {
      id: Math.max(...dashboardWidgets.map(w => w.id)) + 1,
      widgetType: widgetType,
      size: 'medium',
      position: dashboardWidgets.length + 1
    };
    
    setDashboardWidgets([...dashboardWidgets, newWidget]);
    setShowAddWidgetModal(false);
  };
  
  // Fonction pour supprimer un widget du tableau de bord
  const removeWidget = (widgetId) => {
    setDashboardWidgets(dashboardWidgets.filter(w => w.id !== widgetId));
  };
  
  // Rendu du widget en fonction du type
  const renderWidget = (widget) => {
    const widgetType = availableWidgets.find(w => w.id === widget.widgetType);
    
    if (!widgetType) return null;
    
    switch (widgetType.id) {
      case 1: // CPU - Remplacé par StatCard + graphique
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="p-4">
              <StatCard
                title="Utilisation CPU"
                value={`${cpuData[cpuData.length - 1].usage}%`}
                icon={<Cpu size={16} />}
                iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
                iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
                suffix="Dernières 10h"
                action={{
                  label: "Fermer",
                  icon: <X size={12} />,
                  onClick: () => removeWidget(widget.id)
                }}
                darkMode={darkMode}
              />
              
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cpuData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="time" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis domain={[0, 100]} stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        color: darkMode ? '#e5e7eb' : '#111827',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                      }} 
                    />
                    <Area type="monotone" dataKey="usage" stroke="#3b82f6" fill="#93c5fd" fillOpacity={darkMode ? 0.2 : 0.6} />
                    {showPredictions && (
                      <Area type="monotone" dataKey="prediction" stroke="#9333ea" fill="#c4b5fd" fillOpacity={0.1} strokeDasharray="5 5" />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex justify-between mt-2">
                <ActionButton
                  label={showPredictions ? 'Masquer prédictions' : 'Afficher prédictions'}
                  icon={showPredictions ? <EyeOff size={12} /> : <Eye size={12} />}
                  variant="secondary"
                  size="xs"
                  onClick={() => setShowPredictions(!showPredictions)}
                />
                <ButtonGroup>
                  <ActionButton
                    label="Jour"
                    variant={selectedTimeRange === 'day' ? 'primary' : 'secondary'}
                    size="xs"
                    onClick={() => setSelectedTimeRange('day')}
                  />
                  <ActionButton
                    label="Semaine"
                    variant={selectedTimeRange === 'week' ? 'primary' : 'secondary'}
                    size="xs"
                    onClick={() => setSelectedTimeRange('week')}
                  />
                  <ActionButton
                    label="Mois"
                    variant={selectedTimeRange === 'month' ? 'primary' : 'secondary'}
                    size="xs"
                    onClick={() => setSelectedTimeRange('month')}
                  />
                </ButtonGroup>
              </div>
            </div>
          </div>
        );
        
      case 2: // Mémoire - Remplacé par StatCard + graphique
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="p-4">
              <StatCard
                title="Utilisation Mémoire"
                value={`${memoryData[memoryData.length - 1].used}%`}
                icon={<HardDrive size={16} />}
                iconBgColor={darkMode ? 'bg-green-900' : 'bg-green-100'}
                iconColor={darkMode ? 'text-green-400' : 'text-green-600'}
                suffix="Dernières 10h"
                action={{
                  label: "Fermer",
                  icon: <X size={12} />,
                  onClick: () => removeWidget(widget.id)
                }}
                darkMode={darkMode}
              />
              
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="time" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis domain={[0, 100]} stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        color: darkMode ? '#e5e7eb' : '#111827',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                      }} 
                    />
                    <Area type="monotone" dataKey="used" stroke="#10b981" fill="#6ee7b7" fillOpacity={darkMode ? 0.2 : 0.6} />
                    <Area type="monotone" dataKey="threshold" stroke="#ef4444" fill="none" strokeDasharray="3 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
        
      case 3: // Bande Passante - Remplacé par StatCard + graphique
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="p-4">
              <StatCard
                title="Bande Passante"
                value={`${bandwidthData[bandwidthData.length - 1].in + bandwidthData[bandwidthData.length - 1].out} MB/s`}
                icon={<Wifi size={16} />}
                iconBgColor={darkMode ? 'bg-purple-900' : 'bg-purple-100'}
                iconColor={darkMode ? 'text-purple-400' : 'text-purple-600'}
                suffix="Dernières 10h"
                action={{
                  label: "Fermer",
                  icon: <X size={12} />,
                  onClick: () => removeWidget(widget.id)
                }}
                darkMode={darkMode}
              />
              
              <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={bandwidthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                    <XAxis dataKey="time" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis yAxisId="left" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis yAxisId="right" orientation="right" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                        color: darkMode ? '#e5e7eb' : '#111827',
                        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                      }} 
                    />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="in" name="Entrée" stroke="#8b5cf6" fill="#c4b5fd" fillOpacity={darkMode ? 0.2 : 0.6} />
                    <Area yAxisId="left" type="monotone" dataKey="out" name="Sortie" stroke="#ec4899" fill="#fbcfe8" fillOpacity={darkMode ? 0.2 : 0.6} />
                    {comparisonMode && (
                      <Line yAxisId="right" type="monotone" dataKey="users" name="Utilisateurs" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
        
      case 4: // Utilisateurs - Remplacé par FilterableTable
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <StatCard
                title="Utilisateurs Connectés"
                value={connectedUsers.length.toString()}
                icon={<Users size={16} />}
                iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
                iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
                darkMode={darkMode}
              />
              <ActionButton
                label=""
                icon={<X size={16} />}
                variant="secondary"
                size="xs"
                onClick={() => removeWidget(widget.id)}
              />
            </div>
            <div className="p-4">
              <FilterableTable
                columns={usersTableColumns}
                data={connectedUsers}
                emptyMessage="Aucun utilisateur connecté"
              />
            </div>
          </div>
        );
        
      case 5: // Services - Remplacé par FilterableTable
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <StatCard
                title="État des Services"
                value={services.filter(s => s.status === 'operational').length.toString()}
                icon={<Server size={16} />}
                iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
                iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
                suffix={`/${services.length} opérationnels`}
                darkMode={darkMode}
              />
              <ActionButton
                label=""
                icon={<X size={16} />}
                variant="secondary"
                size="xs"
                onClick={() => removeWidget(widget.id)}
              />
            </div>
            <div className="p-4">
              <FilterableTable
                columns={servicesTableColumns}
                data={services}
                emptyMessage="Aucun service disponible"
              />
            </div>
          </div>
        );
        
      case 6: // Alertes - Amélioré avec StatusBadge
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <StatCard
                title="Alertes Actives"
                value={activeAlerts.length.toString()}
                icon={<Bell size={16} />}
                iconBgColor={darkMode ? 'bg-red-900' : 'bg-red-100'}
                iconColor={darkMode ? 'text-red-400' : 'text-red-600'}
                darkMode={darkMode}
              />
              <div className="flex items-center space-x-2">
                <StatusBadge
                  type="error"
                  label={`${activeAlerts.filter(a => a.level === 'critical').length} critiques`}
                  icon={<AlertCircle size={12} />}
                />
                <ActionButton
                  label=""
                  icon={<X size={16} />}
                  variant="secondary"
                  size="xs"
                  onClick={() => removeWidget(widget.id)}
                />
              </div>
            </div>
            <div className={`${widget.size === 'large' ? 'max-h-96' : 'max-h-48'} overflow-y-auto`}>
              {activeAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer border-b border-gray-200 dark:border-gray-700`} onClick={() => setShowAlertDetails(alert)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <StatusBadge
                          type={alert.level === 'critical' ? 'error' : alert.level === 'warning' ? 'warning' : 'info'}
                          label={alert.level === 'critical' ? 'Critique' : alert.level === 'warning' ? 'Attention' : 'Info'}
                          icon={alert.level === 'critical' ? <AlertCircle size={12} /> : <AlertTriangle size={12} />}
                        />
                        <span className={`ml-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {alert.component}
                        </span>
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                        {alert.message}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {alert.timestamp}
                        </div>
                        <StatusBadge
                          type={alert.status === 'new' ? 'info' : 
                                alert.status === 'in_progress' ? 'warning' : 'success'}
                          label={alert.status === 'new' ? 'Nouvelle' :
                                 alert.status === 'in_progress' ? 'En cours' : 'Résolue'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {activeAlerts.length === 0 && (
                <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium">Tout est en ordre</p>
                  <p>Aucune alerte active pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        );
        
      case 8: // Cliniques - Amélioré avec StatusBadge
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <StatCard
                title="Statut des Cliniques"
                value={clinics.filter(c => c.status === 'operational').length.toString()}
                icon={<Map size={16} />}
                iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
                iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
                suffix={`/${clinics.length} opérationnelles`}
                darkMode={darkMode}
              />
              <ActionButton
                label=""
                icon={<X size={16} />}
                variant="secondary"
                size="xs"
                onClick={() => removeWidget(widget.id)}
              />
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {clinics.map((clinic) => (
                <div 
                  key={clinic.id} 
                  className={`border rounded-lg p-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{clinic.name}</h4>
                    <StatusBadge
                      type={clinic.status}
                      label={clinic.status === 'operational' ? 'Opérationnel' : 
                             clinic.status === 'warning' ? 'Attention' : 'Dégradé'}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Charge:</span>
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            clinic.load > 80 ? 'bg-red-500' : 
                            clinic.load > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${clinic.load}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Utilisateurs:</span>
                      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{clinic.users}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Latence:</span>
                      <StatusBadge
                        type={parseInt(clinic.latency) > 400 ? 'error' : 
                              parseInt(clinic.latency) > 300 ? 'warning' : 'success'}
                        label={clinic.latency}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 9: // Maintenance - Remplacé par FilterableTable
        return (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden ${widget.size === 'large' ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <StatCard
                title="Maintenance Prédictive"
                value={predictiveMaintenanceData.filter(m => m.maintenance === 'Urgente').length.toString()}
                icon={<Wrench size={16} />}
                iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
                iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
                suffix="interventions urgentes"
                darkMode={darkMode}
              />
              <ActionButton
                label=""
                icon={<X size={16} />}
                variant="secondary"
                size="xs"
                onClick={() => removeWidget(widget.id)}
              />
            </div>
            <div className="p-4">
              <FilterableTable
                columns={maintenanceTableColumns}
                data={predictiveMaintenanceData}
                emptyMessage="Aucune maintenance requise"
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar 
        appName="EAGLE Admin"
        menuItems={[
          { icon: <Home size={20} />, label: "Tableau de bord", path: "#", isActive: false },
          { icon: <Users size={20} />, label: "Gestion Utilisateurs", path: "#", isActive: false },
          { icon: <Shield size={20} />, label: "Permissions", path: "#", isActive: false },
          { icon: <Settings size={20} />, label: "Règles Opérationnelles", path: "#", isActive: false },
          { icon: <Activity size={20} />, label: "Supervision", path: "#", isActive: true },
          { icon: <Database size={20} />, label: "Modules", path: "#", isActive: false },
          { icon: <Zap size={20} />, label: "Hiérarchie RBAC", path: "#", isActive: false }
        ]}
        bottomMenuItems={[
          { icon: <LogOut size={20} />, label: "Se déconnecter", path: "#" }
        ]}
        darkMode={darkMode}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <Header 
          title="Supervision Technique"
          darkMode={darkMode}
          isOnline={isOnline}
          user={{
            initials: "JK",
            name: "Dr. Kamga Jean"
          }}
          notificationCount={3}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          extraHeaderItems={
            <div className="flex items-center space-x-2">
              <ConnectionStatusMonitor
                isOnline={isOnline}
                mode="badge"
                onConnectionChange={setIsOnline}
              />
              <ThemeSwitcher
                defaultDarkMode={darkMode}
                onChange={setDarkMode}
                size="small"
              />
            </div>
          }
        />
        
        {/* Alertes système */}
        {showEmergencyAlert && (
          <AlertNotification
            type="error"
            message="Mode urgence activé - Incidents critiques détectés: 2"
            isVisible={showEmergencyAlert}
            onClose={() => setShowEmergencyAlert(false)}
            position="top-center"
            duration={0}
          />
        )}
        
        {showOfflineAlert && (
          <AlertNotification
            type="warning"
            message="Mode hors ligne actif - Les données seront synchronisées lors de la reconnexion"
            isVisible={showOfflineAlert}
            onClose={() => setShowOfflineAlert(false)}
            position="top-center"
            duration={0}
          />
        )}
        
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Statistiques globales */}
          <StatCardGroup darkMode={darkMode} compact={false}>
            <StatCard
              title="Charge CPU"
              value={`${cpuData[cpuData.length - 1].usage}%`}
              icon={<Cpu size={16} />}
              iconBgColor={darkMode ? 'bg-blue-900' : 'bg-blue-100'}
              iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
              darkMode={darkMode}
            />
            <StatCard
              title="Mémoire"
              value={`${memoryData[memoryData.length - 1].used}%`}
              icon={<HardDrive size={16} />}
              iconBgColor={darkMode ? 'bg-green-900' : 'bg-green-100'}
              iconColor={darkMode ? 'text-green-400' : 'text-green-600'}
              darkMode={darkMode}
            />
            <StatCard
              title="Services"
              value={`${services.filter(s => s.status === 'operational').length}/${services.length}`}
              icon={<Server size={16} />}
              iconBgColor={darkMode ? 'bg-purple-900' : 'bg-purple-100'}
              iconColor={darkMode ? 'text-purple-400' : 'text-purple-600'}
              suffix="opérationnels"
              darkMode={darkMode}
            />
            <StatCard
              title="Alertes"
              value={activeAlerts.filter(a => a.level === 'critical').length.toString()}
              icon={<AlertTriangle size={16} />}
              iconBgColor={darkMode ? 'bg-red-900' : 'bg-red-100'}
              iconColor={darkMode ? 'text-red-400' : 'text-red-600'}
              suffix="critiques"
              darkMode={darkMode}
            />
          </StatCardGroup>
          
          {/* Sélection de Dashboard et Contrôles */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg mb-6`}>
            <div className="p-4 flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-2">
                <select 
                  className={`rounded-lg border text-sm py-2 px-3 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                  value={currentDashboard}
                  onChange={(e) => setCurrentDashboard(parseInt(e.target.value))}
                >
                  {savedDashboards.map(dashboard => (
                    <option key={dashboard.id} value={dashboard.id}>
                      {dashboard.name}
                    </option>
                  ))}
                </select>
                <ButtonGroup className="ml-2">
                  <ActionButton
                    icon={<Star size={16} />}
                    label=""
                    variant="secondary"
                    size="sm"
                  />
                  <ActionButton
                    icon={<Save size={16} />}
                    label=""
                    variant="secondary"
                    size="sm"
                  />
                  <ActionButton
                    icon={<Share2 size={16} />}
                    label=""
                    variant="secondary"
                    size="sm"
                  />
                </ButtonGroup>
              </div>
              
              <div className="flex items-center space-x-2">
                <SearchInput
                  placeholder="Rechercher..."
                  darkMode={darkMode}
                />
                <ActionButton
                  label="Ajouter Widget"
                  icon={<PlusCircle size={16} />}
                  variant="primary"
                  onClick={() => setShowAddWidgetModal(true)}
                />
                <ActionButton
                  label={isEmergencyMode ? "Désactiver Mode Urgence" : "Activer Mode Urgence"}
                  icon={<AlertCircle size={16} />}
                  variant={isEmergencyMode ? "success" : "danger"}
                  onClick={toggleEmergencyMode}
                />
              </div>
            </div>
          </div>
          
          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {dashboardWidgets
              .sort((a, b) => a.position - b.position)
              .map(widget => renderWidget(widget))}
          </div>
          
          {/* Section Logs Système */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg mb-6`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <StatCard
                title="Logs Système"
                value={transformedLogs.length.toString()}
                icon={<FileText size={16} />}
                iconBgColor={darkMode ? 'bg-gray-700' : 'bg-gray-100'}
                iconColor={darkMode ? 'text-gray-400' : 'text-gray-600'}
                suffix="entrées"
                darkMode={darkMode}
              />
            </div>
            <div className="p-4">
              <UserActivityLog
                activities={transformedLogs}
                canExport={true}
                canFilter={true}
                canSearch={true}
                maxHeight="400px"
                showDetails={true}
              />
            </div>
          </div>
        </main>
      </div>
      
      {/* Modal pour ajouter un widget */}
      {showAddWidgetModal && (
        <Modal
          title="Ajouter un Widget"
          isOpen={showAddWidgetModal}
          onClose={() => setShowAddWidgetModal(false)}
          darkMode={darkMode}
          width="max-w-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {availableWidgets.map(widget => (
              <div 
                key={widget.id} 
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer ${
                  darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-blue-50'
                }`}
                onClick={() => addWidgetToDashboard(widget.id)}
              >
                <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} mb-2`}>
                  {React.cloneElement(widget.icon, { 
                    className: darkMode ? 'text-blue-400' : 'text-blue-600',
                    size: 24 
                  })}
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{widget.name}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{widget.type}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
      
      {/* Modal pour les détails d'alerte */}
      {showAlertDetails && (
        <Modal
          title={
            <div className="flex items-center">
              <StatusBadge
                type={showAlertDetails.level === 'critical' ? 'error' : 'warning'}
                label={showAlertDetails.level === 'critical' ? 'Critique' : 'Attention'}
                icon={<AlertCircle size={12} />}
              />
              <span className="ml-2">Alerte: {showAlertDetails.component}</span>
            </div>
          }
          isOpen={!!showAlertDetails}
          onClose={() => setShowAlertDetails(null)}
          darkMode={darkMode}
          width="max-w-2xl"
        >
          <div className="space-y-4 mb-6">
            <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className="text-lg font-medium">{showAlertDetails.message}</p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {showAlertDetails.timestamp}
              </p>
            </div>
            
            <h3 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions recommandées</h3>
            <div className="space-y-3">
              {recommendedActions
                .filter(action => action.component === showAlertDetails.component)
                .map((action, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{action.action}</p>
                        <div className="flex items-center mt-1">
                          <StatusBadge
                            type={action.impact === 'Élevé' ? 'error' : 
                                  action.impact === 'Moyen' ? 'warning' : 
                                  action.impact === 'Faible' ? 'info' : 'success'}
                            label={`Impact: ${action.impact}`}
                          />
                          <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Taux de succès: {action.success_rate}
                          </span>
                        </div>
                      </div>
                      <ActionButton
                        label="Exécuter"
                        variant="primary"
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
                
              {recommendedActions.filter(action => action.component === showAlertDetails.component).length === 0 && (
                <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Aucune action recommandée disponible.
                </p>
              )}
            </div>
          </div>
            
          <div className="space-y-4">
            <h3 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Diagnostique</h3>
            <div className={`p-4 border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="space-y-2">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Cause probable:</strong> Problème de configuration du serveur de signalisation WebRTC.
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Impact:</strong> Les utilisateurs ne peuvent pas démarrer de nouvelles consultations vidéo.
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Services affectés:</strong> Module de Téléconsultation.
                </p>
              </div>
                
              <div className="flex justify-end mt-4 space-x-3">
                <ActionButton
                  label="Voir documentation"
                  icon={<BookOpen size={16} />}
                  variant="secondary"
                  size="sm"
                />
                <ActionButton
                  label="Créer un ticket"
                  icon={<GitBranch size={16} />}
                  variant="primary"
                  size="sm"
                />
              </div>
            </div>
          </div>
            
          <div className="flex justify-between mt-6">
            <ActionButton
              label="Archiver"
              icon={<Archive size={16} />}
              variant="secondary"
              size="sm"
            />
              
            <ButtonGroup>
              <ActionButton
                label="Marquer comme résolu"
                icon={<CheckSquare size={16} />}
                variant="success"
                size="sm"
              />
              <ActionButton
                label="Fermer"
                icon={<XCircle size={16} />}
                variant="danger"
                size="sm"
                onClick={() => setShowAlertDetails(null)}
              />
            </ButtonGroup>
          </div>
        </Modal>
      )}
      
      {/* Bouton d'assistance flottant */}
      <FloatingActionButton
        actions={[
          {
            id: 'emergency',
            icon: <AlertCircle className="h-5 w-5" />,
            label: 'Mode Urgence',
            onClick: toggleEmergencyMode
          },
          {
            id: 'refresh',
            icon: <RefreshCw className="h-5 w-5" />,
            label: 'Actualiser',
            onClick: () => window.location.reload()
          },
          {
            id: 'settings',
            icon: <Settings className="h-5 w-5" />,
            label: 'Paramètres',
            onClick: () => console.log('Paramètres')
          }
        ]}
        mainIcon={<HelpCircle className="h-6 w-6" />}
        color="blue"
        position="bottom-right"
        showLabels={true}
      />
    </div>
  );
};

export default SupervisionTechniqueOptimisee;