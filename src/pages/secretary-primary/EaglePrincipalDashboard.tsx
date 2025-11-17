import React, { useState } from 'react';
import {
Users, Bell, Calendar, FileText, Settings, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Filter, AlertTriangle, Building, Network, BarChart2, Plus, UserCheck, MessageCircle, Eye, EyeOff, Wifi, Zap, User, Search
} from 'lucide-react';

// Importations des composants partagés
import { Sidebar } from '@layout/Sidebar';
import { Header } from '@layout/Header';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { SearchInput } from '@forms/SearchInput';
import { CenterCard } from '@cards/CenterCard';
import { ConnectionStatus } from '@common/ConnectionStatus';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { StatusBadge } from '@data-display/StatusBadge';

const EaglePrincipalDashboard = () => {
  // États
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('network');
  const [activeTab, setActiveTab] = useState('all');
  const [showStats, setShowStats] = useState(true);
  const [statsCompact, setStatsCompact] = useState(true);
  const [density, setDensity] = useState('normal');
  
  // Données simulées - Centres
  const centers = [
    { id: 1, name: "Centre Principal - Douala", code: "CP-DLA", type: "Centre Principal", status: "online", bandwidth: 8.5, waitingPatients: 12, consultants: 5, alertLevel: "normal", lastUpdated: "2 min" },
    { id: 2, name: "Clinique Saint Jean - Yaoundé", code: "CSJ-YDE", type: "Centre Secondaire", status: "online", bandwidth: 3.8, waitingPatients: 8, consultants: 3, alertLevel: "normal", lastUpdated: "5 min" },
    { id: 3, name: "Hôpital de District - Bafoussam", code: "HD-BAF", type: "Centre Secondaire", status: "offline", bandwidth: 0, waitingPatients: 5, consultants: 2, alertLevel: "issue", lastUpdated: "15 min" },
    { id: 4, name: "Centre Médical - Limbé", code: "CM-LIM", type: "Centre Secondaire", status: "online", bandwidth: 2.2, waitingPatients: 4, consultants: 2, alertLevel: "warning", lastUpdated: "3 min" },
    { id: 5, name: "Clinique Moderne - Kribi", code: "CMK-KRI", type: "Centre Secondaire", status: "online", bandwidth: 4.1, waitingPatients: 6, consultants: 2, alertLevel: "normal", lastUpdated: "7 min" }
  ];
  
  // Éléments du menu latéral
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: true },
    { icon: <Network size={18} />, label: "Réseau", path: "#" },
    { icon: <Users size={18} />, label: "Patients", path: "#" },
    { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#" },
    { icon: <FileText size={18} />, label: "Documents", path: "#" }
  ];
  
  const bottomMenuItems = [
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];
  
  // Statistiques réseau
  const networkStats = {
    totalPatients: 17,
    waitingPatients: 10,
    inConsultationPatients: 3,
    completedConsultations: 1,
    avgWaitTime: 22,
    urgentPatients: 4,
    pendingValidation: 3,
    centersOnline: 4,
    centersOffline: 1,
    totalCenters: 5
  };

  // Gestionnaires d'événements pour les cartes des centres
  const handleViewDetails = (centerId) => {
    console.log("Voir les détails du centre:", centerId);
  };

  const handleOpenChat = (centerId) => {
    console.log("Ouvrir le chat avec le centre:", centerId);
  };

  const handleMoreOptions = (centerId) => {
    console.log("Plus d'options pour le centre:", centerId);
  };

  // Toggle le mode sombre
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div>   
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
          title="Tableau de Bord - Centre Principal"
          subtitle="Réseau de Cliniques EAGLE"
          centerInfo={{
            name: "Réseau de Cliniques EAGLE",
            code: `${networkStats.centersOnline}/${networkStats.totalCenters} centres en ligne`,
            type: "Centre Principal"
          }}
          isOnline={true}
          bandwidth={8.5}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          user={{ initials: "SP", name: "Sophie Priso" }}
          notificationCount={3}
          extraHeaderItems={
            <button 
              onClick={() => setShowStats(!showStats)} 
              className="ml-2 text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md"
              title="Afficher/Masquer les statistiques"
            >
              {showStats ? (
                <>
                  <EyeOff size={12} className="mr-1" /> Stats
                </>
              ) : (
                <>
                  <Eye size={12} className="mr-1" /> Stats
                </>
              )}
            </button>
          }
        />
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-3">
          {/* Statistiques compactes */}
          {showStats && statsCompact && (
            <StatCardGroup darkMode={darkMode} compact={true}>
              <StatCard
                title="Patients en attente"
                value={networkStats.waitingPatients}
                icon={<Users size={16} />}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                darkMode={darkMode}
              />
              
              <StatCard
                title="En consultation"
                value={networkStats.inConsultationPatients}
                icon={<Activity size={16} />}
                iconBgColor="bg-purple-100"
                iconColor="text-purple-600"
                darkMode={darkMode}
              />
              
              <StatCard
                title="Temps moyen d'attente"
                value={networkStats.avgWaitTime}
                suffix="min"
                icon={<AlertTriangle size={16} />}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
                darkMode={darkMode}
              />
              
              <StatCard
                title="Urgences à valider"
                value={networkStats.pendingValidation}
                icon={<AlertTriangle size={16} />}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                action={{
                  label: "Voir",
                  icon: <Eye size={10} />,
                  onClick: () => console.log("Voir les urgences")
                }}
                darkMode={darkMode}
              />
              
              <StatCard
                title="Centres en ligne"
                value={`${networkStats.centersOnline}/${networkStats.totalCenters}`}
                icon={<Building size={16} />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                action={{
                  label: "État",
                  icon: <Network size={10} />,
                  onClick: () => console.log("Voir l'état du réseau")
                }}
                darkMode={darkMode}
              />
            </StatCardGroup>
          )}
          
          {/* Boutons d'accès rapide et recherche */}
          <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
            <ButtonGroup className="flex flex-wrap gap-1">
              <ActionButton
                label="Salle d'attente"
                icon={<Plus size={14} />}
                variant="primary"
                onClick={() => console.log("Salle d'attente")}
              />
              
              <ActionButton
                label="Valider urgences"
                icon={<UserCheck size={14} />}
                variant="success"
                count={networkStats.pendingValidation}
                onClick={() => console.log("Valider urgences")}
              />
              
              <ActionButton
                label="Communications"
                icon={<MessageCircle size={14} />}
                variant="info"
                onClick={() => console.log("Communications")}
              />
              
              <ActionButton
                label="Rapport global"
                icon={<BarChart2 size={14} />}
                variant="dark"
                onClick={() => console.log("Générer rapport")}
              />
            </ButtonGroup>
            
            <div className="flex space-x-1 items-center">
              <SearchInput 
                placeholder="Rechercher..." 
                darkMode={darkMode} 
                width="w-64"
              />
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} flex items-center`}>
                <Filter size={14} className="mr-1" />
                <span className="text-xs">Filtrer</span>
              </button>
            </div>
          </div>
          
          {/* Vue Réseau - Liste des centres */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {centers.map(center => (
              <CenterCard
                key={center.id}
                center={{
                  id: center.id,
                  name: center.name,
                  code: center.code,
                  type: center.type,
                  status: center.status,
                  bandwidth: center.bandwidth,
                  waitingPatients: center.waitingPatients,
                  consultants: center.consultants,
                  alertLevel: center.alertLevel,
                  lastUpdated: center.lastUpdated
                }}
                darkMode={darkMode}
                onViewDetails={() => handleViewDetails(center.id)}
                onOpenChat={() => handleOpenChat(center.id)}
                onMoreOptions={() => handleMoreOptions(center.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EaglePrincipalDashboard;