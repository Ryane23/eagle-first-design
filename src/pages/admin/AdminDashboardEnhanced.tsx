import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  Bell, User, AlertTriangle, Filter, RefreshCw, MessageSquare, Eye, Download, Zap, Shield, Activity, Home, Users, Settings, Database, LogOut, Calendar
} from 'lucide-react';

// Import des composants partagés
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { AlertNotification } from '@feedback/AlertNotification';
import MultiTabContainer from '@layout/MultiTabContainer';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import ThemeSwitcher from '@common/ThemeSwitcher';
import { ConnectionStatus } from '@common/ConnectionStatus';
import { getStatusBadgeVariant } from '@utils/statusUtils';

// Données fictives pour les graphiques
const consultationData = [
  { name: 'Lun', Pédiatrie: 12, Cardiologie: 8, Générale: 15 },
  { name: 'Mar', Pédiatrie: 15, Cardiologie: 10, Générale: 13 },
  { name: 'Mer', Pédiatrie: 13, Cardiologie: 7, Générale: 16 },
  { name: 'Jeu', Pédiatrie: 14, Cardiologie: 9, Générale: 14 },
  { name: 'Ven', Pédiatrie: 16, Cardiologie: 12, Générale: 18 },
  { name: 'Sam', Pédiatrie: 10, Cardiologie: 5, Générale: 10 },
  { name: 'Dim', Pédiatrie: 4, Cardiologie: 2, Générale: 6 }
];

const waitingTimeData = [
  { name: 'Clinique A', temps: 15 },
  { name: 'Clinique B', temps: 22 },
  { name: 'Clinique C', temps: 18 },
  { name: 'Clinique D', temps: 27 },
  { name: 'Clinique E', temps: 12 }
];

const incidentData = [
  { id: 1, clinique: 'Clinique B', type: 'Critique', statut: 'Non résolu', description: 'Serveur de téléconsultation hors service', temps: '22 min' },
  { id: 2, clinique: 'Clinique D', type: 'Modéré', statut: 'En cours', description: 'Latence élevée sur la signature électronique', temps: '45 min' },
  { id: 3, clinique: 'Clinique A', type: 'Modéré', statut: 'Non résolu', description: 'Problème synchronisation DPI', temps: '35 min' },
  { id: 4, clinique: 'Clinique E', type: 'Faible', statut: 'Résolu', description: "Erreur d'affichage calendrier", temps: '1h 20min' },
  { id: 5, clinique: 'Clinique C', type: 'Critique', statut: 'Résolu', description: 'Perte de connexion', temps: '35 min' }
];

// Actions en attente
const pendingActions = [
  { id: 1, type: 'approval', texte: 'Approbation de compte utilisateur', nombre: 3 },
  { id: 2, type: 'incident', texte: 'Incidents non résolus', nombre: 2 },
  { id: 3, type: 'update', texte: 'Mises à jour en attente', nombre: 1 }
];

// Suggestions système
const systemSuggestions = [
  { id: 1, texte: 'Répartir la charge entre cliniques A et B', impact: 'Haute', categorie: 'optimisation' },
  { id: 2, texte: 'Augmenter la fréquence des sauvegardes', impact: 'Moyenne', categorie: 'sécurité' },
  { id: 3, texte: 'Archiver les consultations de plus de 6 mois', impact: 'Basse', categorie: 'performance' }
];

const AdminDashboardEnhanced = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState('jour');
  const [focusMode, setFocusMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [alertBannerVisible, setAlertBannerVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('vue-generale');
  
  const handleDismissAlert = () => {
    setAlertBannerVisible(false);
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Critique':
      case 'Non résolu':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'Modéré':
      case 'En cours':
        return darkMode ? 'text-orange-400' : 'text-orange-600';
      case 'Faible':
      case 'Résolu':
        return darkMode ? 'text-green-400' : 'text-green-600';
      default:
        return darkMode ? 'text-gray-300' : 'text-gray-600';
    }
  };

  // Configuration des items pour le Sidebar
  const menuItems = [
    { icon: <Home size={20} />, label: "Tableau de bord", path: "#", isActive: true },
    { icon: <Users size={20} />, label: "Gestion Utilisateurs", path: "#" },
    { icon: <Shield size={20} />, label: "Permissions", path: "#" },
    { icon: <Settings size={20} />, label: "Règles Opérationnelles", path: "#" },
    { icon: <Activity size={20} />, label: "Supervision", path: "#" },
    { icon: <Database size={20} />, label: "Modules", path: "#" },
    { icon: <Zap size={20} />, label: "Hiérarchie RBAC", path: "#" },
    { icon: <MessageSquare size={20} />, label: "Communication", path: "#", isActive: false }
  ];
  
  const bottomMenuItems = [
    { icon: <LogOut size={18} />, label: "Déconnexion", path: "#" }
  ];
  
  // Configuration des onglets pour MultiTabContainer
  const tabs = [
    { 
      id: 'vue-generale', 
      label: 'Vue Générale', 
      content: null
    },
    { 
      id: 'attention-requise', 
      label: 'Attention Requise', 
      badge: 5,
      content: null
    },
    { 
      id: 'cliniques', 
      label: 'Réseau Cliniques', 
      content: null
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance Système', 
      content: null
    }
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar component */}
      <Sidebar 
        appName="EAGLE Admin"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Header component */}
        <Header
          title="Tableau de Bord"
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          user={{ initials: "JK", name: "Dr. Kamga Jean" }}
          notificationCount={5}
          extraHeaderItems={
            <div className="flex items-center">
              <ButtonGroup>
                <ActionButton 
                  label="Jour" 
                  variant={timeRange === 'jour' ? "primary" : "secondary"} 
                  onClick={() => setTimeRange('jour')}
                />
                <ActionButton 
                  label="Semaine" 
                  variant={timeRange === 'semaine' ? "primary" : "secondary"} 
                  onClick={() => setTimeRange('semaine')}
                />
                <ActionButton 
                  label="Mois" 
                  variant={timeRange === 'mois' ? "primary" : "secondary"} 
                  onClick={() => setTimeRange('mois')}
                />
              </ButtonGroup>
              
              <ActionButton 
                icon={<Eye size={20} />} 
                label={focusMode ? 'Mode Standard' : 'Mode Focus'} 
                variant="secondary" 
                onClick={toggleFocusMode}
                className="ml-3"
              />
              
              <ConnectionStatus 
                isOnline={true} 
                mode="minimal"
                className="ml-3"
              />
            </div>
          }
        />
        
        {/* Bannière d'alerte système */}
        {alertBannerVisible && (
          <AlertNotification 
            message="Le serveur de téléconsultation de la Clinique B est hors service. Impact sur 12 consultations prévues aujourd'hui."
            type="error"
            isVisible={alertBannerVisible}
            onClose={handleDismissAlert}
            position="top-center"
            showDetails={true}
            darkMode={darkMode}
          />
        )}
        
        {/* Navigation par onglets */}
        <div className="mx-5 mt-4">
          <MultiTabContainer 
            tabs={tabs}
            defaultTabId="vue-generale"
            onChange={(tabId) => setActiveTab(tabId)}
          />
        </div>
        
        {/* Dashboard Content */}
        <main className="p-5 flex-1">
          {activeTab === 'vue-generale' && (
            <>
              {/* Stats Cards */}
              <StatCardGroup compact={false} darkMode={darkMode}>
                <StatCard
                  title="Total Utilisateurs"
                  value="52"
                  icon={<Users size={16} />}
                  iconBgColor="bg-blue-100"
                  iconColor="text-blue-500"
                  suffix="Médecins: 18 | Secrétaires: 14 | Infirmiers: 20"
                  darkMode={darkMode}
                />
                <StatCard
                  title="Consultations/Jour"
                  value="87"
                  icon={<Calendar size={16} />}
                  iconBgColor="bg-green-100"
                  iconColor="text-green-500"
                  suffix="↑ 12% depuis semaine dernière"
                  darkMode={darkMode}
                />
                <StatCard
                  title="Performance Système"
                  value="78%"
                  icon={<Activity size={16} />}
                  iconBgColor="bg-yellow-100"
                  iconColor="text-yellow-500"
                  suffix="CPU: 65% | RAM: 48% | Latence: 230ms"
                  darkMode={darkMode}
                />
                <StatCard
                  title="Incidents (24h)"
                  value="3"
                  icon={<Bell size={16} />}
                  iconBgColor="bg-red-100"
                  iconColor="text-red-500"
                  suffix="1 critique | 2 modérés | 5 résolus"
                  darkMode={darkMode}
                />
              </StatCardGroup>
              
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Left Column - Charts */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Centre de résolution */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow py-3 px-4 border-l-4 ${
                    darkMode ? 'border-blue-700' : 'border-blue-500'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                        Centre de résolution - Actions requises
                      </h2>
                      <div>
                        <ActionButton 
                          label="Tout traiter" 
                          variant="info" 
                          size="xs"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {pendingActions.map(action => (
                        <div key={action.id} className={`flex justify-between items-center p-2 rounded-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center">
                            <div className={`rounded-full p-2 ${
                              action.type === 'incident' 
                                ? (darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600')
                                : action.type === 'approval'
                                  ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600')
                                  : (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600')
                            } mr-3`}>
                              {action.type === 'incident' 
                                ? <AlertTriangle size={16} />
                                : action.type === 'approval'
                                  ? <Users size={16} />
                                  : <RefreshCw size={16} />
                              }
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {action.texte}
                              </p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                En attente: <span className="font-bold">{action.nombre}</span>
                              </p>
                            </div>
                          </div>
                          <ActionButton 
                            label="Traiter" 
                            variant="primary" 
                            size="xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Charts */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Consultations par Spécialité
                      </h2>
                      <div className="flex items-center">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mr-3`}>
                          {timeRange === 'jour' ? '24 dernières heures' : 
                           timeRange === 'semaine' ? '7 derniers jours' : '30 derniers jours'}
                        </span>
                        <ActionButton 
                          icon={<Download size={16} />} 
                          variant="secondary" 
                          size="xs" 
                          label=""
                        />
                      </div>
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={consultationData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
                            axisLine={{ stroke: darkMode ? '#4B5563' : '#D1D5DB' }}
                          />
                          <YAxis 
                            tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
                            axisLine={{ stroke: darkMode ? '#4B5563' : '#D1D5DB' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                              borderColor: darkMode ? '#374151' : '#E5E7EB'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="Pédiatrie" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Cardiologie" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Générale" 
                            stroke="#10B981" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Incidents */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
                    <div className={`py-3 px-4 ${
                      darkMode ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-100 text-red-800'
                    } flex justify-between items-center`}>
                      <h3 className="font-medium flex items-center">
                        <AlertTriangle size={18} className="mr-2" />
                        Incidents non résolus
                      </h3>
                      <StatusBadge 
                        type="error" 
                        label={`${incidentData.filter(i => i.statut !== 'Résolu').length} incidents`}
                      />
                    </div>
                    <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {incidentData
                        .filter(incident => incident.statut !== 'Résolu')
                        .map(incident => (
                          <div key={incident.id} className={`p-3 ${
                            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                          }`}>
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {incident.description}
                              </h4>
                              <StatusBadge 
                                type={incident.type === 'Critique' ? 'error' : 'warning'} 
                                label={incident.type}
                              />
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex items-center space-x-3">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                  {incident.clinique}
                                </span>
                                <span className={`${getStatusClass(incident.statut)}`}>
                                  {incident.statut}
                                </span>
                              </div>
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                                {incident.temps}
                              </span>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <ActionButton 
                                label="Résoudre" 
                                variant="primary" 
                                size="xs"
                                fullWidth={true}
                              />
                              <ActionButton 
                                icon={<MessageSquare size={14} />} 
                                variant="secondary" 
                                size="xs"
                                label=""
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Suggestions système */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
                    <div className={`py-3 px-4 ${
                      darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'
                    } flex justify-between items-center`}>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                        Suggestions système
                      </h3>
                      <StatusBadge 
                        type="info" 
                        label={`${systemSuggestions.length} suggestions`}
                      />
                    </div>
                    <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {systemSuggestions.map(suggestion => (
                        <div key={suggestion.id} className="p-3">
                          <div className="flex items-start">
                            <div className={`p-1.5 rounded-full mt-0.5 ${
                              suggestion.impact === 'Haute'
                                ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600')
                                : suggestion.impact === 'Moyenne'
                                  ? (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-600')
                                  : (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600')
                            } mr-3`}>
                              {suggestion.categorie === 'optimisation' 
                                ? <Zap size={14} />
                                : suggestion.categorie === 'sécurité'
                                  ? <Shield size={14} />
                                  : <Activity size={14} />
                              }
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {suggestion.texte}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs ${
                                  suggestion.impact === 'Haute'
                                    ? (darkMode ? 'text-blue-400' : 'text-blue-600')
                                    : suggestion.impact === 'Moyenne'
                                      ? (darkMode ? 'text-yellow-400' : 'text-yellow-600')
                                      : (darkMode ? 'text-green-400' : 'text-green-600')
                                }`}>
                                  Impact: {suggestion.impact}
                                </span>
                                <div>
                                  <button className={`text-xs mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Ignorer
                                  </button>
                                  <button className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                    Appliquer
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Temps d'attente */}
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Temps d'Attente Moyen
                      </h2>
                      <div className="text-sm text-gray-500">Par clinique (min)</div>
                    </div>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={waitingTimeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
                            axisLine={{ stroke: darkMode ? '#4B5563' : '#D1D5DB' }}
                          />
                          <YAxis 
                            tick={{ fill: darkMode ? '#9CA3AF' : '#4B5563' }} 
                            axisLine={{ stroke: darkMode ? '#4B5563' : '#D1D5DB' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                              borderColor: darkMode ? '#374151' : '#E5E7EB'
                            }}
                            formatter={(value) => [`${value} min`, 'Temps d\'attente']}
                          />
                          <Bar dataKey="temps" fill={darkMode ? '#6366F1' : '#4F46E5'} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Contenu pour autres onglets - Simplifié pour cette version stable */}
          {activeTab !== 'vue-generale' && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 text-center`}>
              <div className="mb-4">
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {activeTab === 'attention-requise' && "Onglet Attention Requise"}
                  {activeTab === 'cliniques' && "Onglet Réseau Cliniques"}
                  {activeTab === 'maintenance' && "Onglet Maintenance Système"}
                </h2>
                <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Ce contenu est disponible dans la version complète du tableau de bord.
                </p>
              </div>
              <ActionButton 
                label="Retour à la Vue Générale" 
                variant="primary" 
                onClick={() => setActiveTab('vue-generale')}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default AdminDashboardEnhanced;