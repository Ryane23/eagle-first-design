import React, { useState } from 'react';
import {
 BarChart,
 Bar,
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 Legend,
 ResponsiveContainer,
 PieChart,
 Pie,
 Cell,
 AreaChart,
 Area
} from 'recharts';

import {
Menu, X, ChevronRight, Home, Users, Calendar, Activity, Settings, Bell, FileText, MessageSquare, Clock, BarChart2, TrendingUp, TrendingDown, Sun, Moon, User, Search, Filter, Download, Wifi, WifiOff, AlertTriangle, CheckCircle, HelpCircle, Zap, PieChart as PieChartIcon, Sliders, UserPlus, ChevronDown, Map, Building, Maximize, Minimize, Command, RefreshCw, MoreVertical, MapPin, ThumbsUp
} from 'lucide-react';

// Import shared components
// Layout Components
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { ViewSelector } from '@layout/ViewSelector';

// Form Components
import { SearchInput } from '@forms/SearchInput';

// Data Display Components
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';

// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';

// UI Components
import { ConnectionStatus } from '@ui/ConnectionStatus';
import ThemeSwitcher from '@ui/ThemeSwitcher';

// Hooks
import { useDarkMode } from '@hooks/useDarkMode';

// Utils
import { formatWaitTime } from '@utils/statusUtils';

// Constants
import { CHART_COLORS } from '@constants/emergencyConstants';

// Types
import { Center } from '@types';

function PerformanceTableau() {
 // États de base
 const { darkMode, toggleDarkMode } = useDarkMode();
 const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 const [activeTab, setActiveTab] = useState('dashboard');
 const [showStats, setShowStats] = useState(true);
 const [periodFilter, setPeriodFilter] = useState('24h');
 const [centerFilter, setCenterFilter] = useState('all');
 const [viewMode, setViewMode] = useState('combined');
 const [showExportMenu, setShowExportMenu] = useState(false);
 const [isOnline, setIsOnline] = useState(true);

 // Données pour les centres
 const centers: Center[] = [
   { id: '1', name: 'Clinique Saint Jean - Yaoundé', code: 'CSJ-YDE', type: 'secondary' },
   { id: '2', name: 'Centre Hospitalier Moderne - Douala', code: 'CHM-DLA', type: 'secondary' },
   { id: '3', name: 'Hôpital Sainte Pauline - Bafoussam', code: 'HSP-BAF', type: 'secondary' },
   { id: '4', name: 'Centre Médical Lumière - Garoua', code: 'CML-GAR', type: 'secondary' },
   { id: '5', name: 'Clinique Coeur Sacré - Buea', code: 'CCS-BUE', type: 'secondary' }
 ];

 // Données des statistiques
 const stats = [
   { id: 'patients', label: 'Patients aujourd\'hui', value: 148, trend: 12, status: 'up', icon: <Users size={18} />, color: 'blue' },
   { id: 'waitTime', label: 'Temps d\'attente moyen', value: 22, unit: 'min', trend: -3, status: 'down', icon: <Clock size={18} />, color: 'yellow' },
   { id: 'urgencies', label: 'Urgences critiques', value: 12, trend: 4, status: 'up', icon: <AlertTriangle size={18} />, color: 'red' },
   { id: 'completed', label: 'Consultations terminées', value: 87, trend: 9, status: 'up', icon: <CheckCircle size={18} />, color: 'green' },
   { id: 'satisfaction', label: 'Satisfaction patients', value: 92, unit: '%', trend: 2, status: 'up', icon: <ThumbsUp size={18} />, color: 'indigo' }
 ];

 // Données pour les graphiques
 const waitingTimeData = [
   { name: 'YDE', time: 25, patients: 42 },
   { name: 'DLA', time: 18, patients: 36 },
   { name: 'BAF', time: 15, patients: 28 },
   { name: 'GAR', time: 32, patients: 22 },
   { name: 'BUE', time: 21, patients: 20 }
 ];

 const hourlyPatientFlow = [
   { hour: '8h', CSJ: 4, CHM: 3, HSP: 2, CML: 2, CCS: 1 },
   { hour: '9h', CSJ: 7, CHM: 5, HSP: 4, CML: 3, CCS: 2 },
   { hour: '10h', CSJ: 12, CHM: 9, HSP: 6, CML: 5, CCS: 4 },
   { hour: '11h', CSJ: 15, CHM: 12, HSP: 9, CML: 8, CCS: 6 },
   { hour: '12h', CSJ: 9, CHM: 7, HSP: 5, CML: 4, CCS: 3 },
   { hour: '13h', CSJ: 6, CHM: 4, HSP: 3, CML: 2, CCS: 2 },
   { hour: '14h', CSJ: 10, CHM: 8, HSP: 6, CML: 5, CCS: 4 },
   { hour: '15h', CSJ: 14, CHM: 11, HSP: 8, CML: 7, CCS: 5 },
   { hour: '16h', CSJ: 11, CHM: 9, HSP: 7, CML: 6, CCS: 4 },
   { hour: '17h', CSJ: 8, CHM: 6, HSP: 4, CML: 3, CCS: 2 }
 ];

 const urgencyBySpecialty = [
   { name: 'Cardiologie', urgence1: 5, urgence2: 8, urgence3: 12, urgence4: 15, urgence5: 4 },
   { name: 'Pédiatrie', urgence1: 8, urgence2: 12, urgence3: 15, urgence4: 6, urgence5: 2 },
   { name: 'Dermatologie', urgence1: 12, urgence2: 15, urgence3: 8, urgence4: 3, urgence5: 1 },
   { name: 'Gynécologie', urgence1: 7, urgence2: 10, urgence3: 14, urgence4: 5, urgence5: 2 },
   { name: 'Neurologie', urgence1: 4, urgence2: 7, urgence3: 9, urgence4: 11, urgence5: 3 }
 ];

 const weeklyTrends = [
   { day: 'Lun', patients: 85, avgWaitTime: 22 },
   { day: 'Mar', patients: 78, avgWaitTime: 19 },
   { day: 'Mer', patients: 92, avgWaitTime: 25 },
   { day: 'Jeu', patients: 87, avgWaitTime: 21 },
   { day: 'Ven', patients: 105, avgWaitTime: 28 },
   { day: 'Sam', patients: 65, avgWaitTime: 17 },
   { day: 'Dim', patients: 45, avgWaitTime: 12 }
 ];

 // Fonctions auxiliaires
 const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
 const toggleShowStats = () => setShowStats(!showStats);

 // Configurer les éléments du menu pour Sidebar
 const menuItems = [
   { icon: <Home size={20} />, label: "Tableau de bord", path: "#", isActive: activeTab === 'dashboard' },
   { icon: <Users size={20} />, label: "Patients", path: "#", isActive: activeTab === 'patients' },
   { icon: <Calendar size={20} />, label: "Rendez-vous", path: "#", isActive: activeTab === 'appointments' },
   { icon: <Activity size={20} />, label: "Consultations", path: "#", isActive: activeTab === 'consultations' },
   { icon: <BarChart2 size={20} />, label: "Performance", path: "#", isActive: activeTab === 'performance' },
   { icon: <Building size={20} />, label: "Centres", path: "#", isActive: activeTab === 'centers' },
   { icon: <FileText size={20} />, label: "Documents", path: "#", isActive: activeTab === 'documents' },
   { icon: <MessageSquare size={20} />, label: "Messages", path: "#", isActive: activeTab === 'messages' },
 ];

 const bottomMenuItems = [
   { icon: <Settings size={20} />, label: "Paramètres", path: "#" }
 ];

 return (
   <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
     {/* Sidebar */}
     <Sidebar
       appName="EAGLE"
       menuItems={menuItems}
       bottomMenuItems={bottomMenuItems}
       darkMode={darkMode}
     />
     
     {/* Main Content */}
     <div className="flex-1 flex flex-col overflow-hidden">
       {/* Header */}
       <Header
         title="Tableau de Performance Clinique"
         subtitle="Centre Principal - Coordination"
         centerInfo={{
           name: "Centre Principal - Coordination",
           code: "CP-COORD",
           type: ""
         }}
         isOnline={isOnline}
         darkMode={darkMode}
         toggleDarkMode={toggleDarkMode}
         user={{
           initials: "SP",
           name: "Sarah Principal"
         }}
         notificationCount={1}
         extraHeaderItems={
           <ButtonGroup>
             <ActionButton
               label={showStats ? "Masquer" : "Afficher"}
               icon={showStats ? <Minimize size={14} /> : <Maximize size={14} />}
               onClick={toggleShowStats}
               variant="secondary"
               size="xs"
             />
             <StatusBadge
               type="info"
               icon={<Command size={14} />}
               label="Alt+F: Rechercher"
             />
           </ButtonGroup>
         }
       />
       
       {/* Main Content Area */}
       <main className="flex-1 overflow-auto p-4">
         {/* Stats */}
         {showStats && (
           <StatCardGroup>
             {stats.map((stat) => (
               <StatCard
                 key={stat.id}
                 title={stat.label}
                 value={stat.value.toString() + (stat.unit || '')}
                 icon={stat.icon}
                 iconBgColor={`bg-${stat.color}-100`}
                 iconColor={`text-${stat.color}-600`}
                 action={{
                   label: `${Math.abs(stat.trend)}%`,
                   icon: stat.status === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />,
                   onClick: () => {}
                 }}
                 darkMode={darkMode}
               />
             ))}
           </StatCardGroup>
         )}
         
         {/* Filters */}
         <div className="flex justify-between items-center mb-6">
           <div className="flex space-x-3">
             <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-2 rounded-md">
               <PieChartIcon size={16} className="mr-2" />
               <span className="font-medium">Analyse de Performance</span>
             </div>
             
             <select 
               value={centerFilter}
               onChange={(e) => setCenterFilter(e.target.value)}
               className="bg-white border border-gray-300 rounded-md text-sm px-3 py-2"
             >
               <option value="all">Tous les centres</option>
               {centers.map((center) => (
                 <option key={center.id} value={center.code}>{center.name}</option>
               ))}
             </select>
             
             <ButtonGroup>
               <ActionButton
                 label="24h"
                 variant={periodFilter === '24h' ? 'primary' : 'secondary'}
                 onClick={() => setPeriodFilter('24h')}
                 size="sm"
               />
               <ActionButton
                 label="7 jours"
                 variant={periodFilter === '7j' ? 'primary' : 'secondary'}
                 onClick={() => setPeriodFilter('7j')}
                 size="sm"
               />
               <ActionButton
                 label="30 jours"
                 variant={periodFilter === '30j' ? 'primary' : 'secondary'}
                 onClick={() => setPeriodFilter('30j')}
                 size="sm"
               />
             </ButtonGroup>
             
             <ViewSelector
               currentView={viewMode === 'combined' ? 'compact' : 'detailed'}
               onChange={(mode) => setViewMode(mode === 'compact' ? 'combined' : 'detail')}
               availableViews={['compact', 'detailed']}
               darkMode={darkMode}
             />
           </div>
           
           <div className="flex space-x-2">
             <SearchInput
               placeholder="Rechercher..."
               darkMode={darkMode}
             />
             
             <ExportMenu
               isOpen={showExportMenu}
               onToggle={() => setShowExportMenu(!showExportMenu)}
               onExport={(format) => {
                 console.log(`Exporting in ${format} format`);
                 setShowExportMenu(false);
               }}
               darkMode={darkMode}
             />
             
             <ActionButton
               label="Actualiser"
               icon={<RefreshCw size={16} />}
               variant="secondary"
               size="sm"
             />
           </div>
         </div>
         
         {/* Charts */}
         <div className="grid grid-cols-2 gap-6 mb-6">
           {/* Waiting Time per Center */}
           <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-medium">Temps d'attente par centre</h3>
               <button className="p-1 rounded hover:bg-gray-100">
                 <MoreVertical size={16} />
               </button>
             </div>
             
             <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={waitingTimeData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="name" />
                   <YAxis yAxisId="left" />
                   <YAxis yAxisId="right" orientation="right" />
                   <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                   <Legend />
                   <Bar yAxisId="left" dataKey="time" name="Temps d'attente (min)" fill={CHART_COLORS.primary} />
                   <Bar yAxisId="right" dataKey="patients" name="Nombre de patients" fill={CHART_COLORS.success} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
           
           {/* Patient Flow */}
           <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-medium">Flux de patients par heure</h3>
               <button className="p-1 rounded hover:bg-gray-100">
                 <MoreVertical size={16} />
               </button>
             </div>
             
             <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={hourlyPatientFlow}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="hour" />
                   <YAxis />
                   <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                   <Legend />
                   <Area type="monotone" dataKey="CSJ" name="Saint Jean" fill="#93c5fd" stroke={CHART_COLORS.primary} />
                   <Area type="monotone" dataKey="CHM" name="CH Moderne" fill="#a7f3d0" stroke={CHART_COLORS.success} />
                   <Area type="monotone" dataKey="HSP" name="Pauline" fill="#c4b5fd" stroke="#8b5cf6" />
                   <Area type="monotone" dataKey="CML" name="Lumière" fill="#fcd34d" stroke={CHART_COLORS.warning} />
                   <Area type="monotone" dataKey="CCS" name="Coeur Sacré" fill="#fca5a5" stroke={CHART_COLORS.danger} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>
         </div>
         
         <div className="grid grid-cols-2 gap-6 mb-6">
           {/* Urgency by Specialty */}
           <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-medium">Urgences par spécialité</h3>
               <button className="p-1 rounded hover:bg-gray-100">
                 <MoreVertical size={16} />
               </button>
             </div>
             
             <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={urgencyBySpecialty}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="name" />
                   <YAxis />
                   <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                   <Legend />
                   <Bar dataKey="urgence1" name="Niveau 1" stackId="a" fill={CHART_COLORS.urgency1} />
                   <Bar dataKey="urgence2" name="Niveau 2" stackId="a" fill={CHART_COLORS.urgency2} />
                   <Bar dataKey="urgence3" name="Niveau 3" stackId="a" fill={CHART_COLORS.urgency3} />
                   <Bar dataKey="urgence4" name="Niveau 4" stackId="a" fill={CHART_COLORS.urgency4} />
                   <Bar dataKey="urgence5" name="Niveau 5" stackId="a" fill={CHART_COLORS.urgency5} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
           
           {/* Weekly Trends */}
           <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-medium">Tendances hebdomadaires</h3>
               <button className="p-1 rounded hover:bg-gray-100">
                 <MoreVertical size={16} />
               </button>
             </div>
             
             <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={weeklyTrends}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="day" />
                   <YAxis yAxisId="left" />
                   <YAxis yAxisId="right" orientation="right" />
                   <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                   <Legend />
                   <Line 
                     yAxisId="left"
                     type="monotone" 
                     dataKey="patients" 
                     name="Patients" 
                     stroke={CHART_COLORS.primary}
                     strokeWidth={2}
                     dot={{ r: 4 }}
                     activeDot={{ r: 6 }}
                   />
                   <Line 
                     yAxisId="right"
                     type="monotone" 
                     dataKey="avgWaitTime" 
                     name="Temps d'attente (min)" 
                     stroke={CHART_COLORS.danger}
                     strokeWidth={2}
                     dot={{ r: 4 }}
                     activeDot={{ r: 6 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
         </div>
         
         {/* Performance Indicator */}
         <div className={`rounded-lg shadow p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-medium">Performance globale du réseau</h3>
             <div className="flex space-x-2">
               <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                 <option>Cette semaine</option>
                 <option>Ce mois</option>
                 <option>Trimestre</option>
               </select>
               <button className="p-1 rounded hover:bg-gray-100">
                 <MoreVertical size={16} />
               </button>
             </div>
           </div>
           
           <div className="grid grid-cols-5 gap-4">
             {centers.map((center, index) => {
               const randomPerformance = 60 + Math.floor(Math.random() * 30);
               const color = randomPerformance > 80 ? 'bg-green-100 text-green-800' :
                            randomPerformance > 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800';
               
               return (
                 <div key={center.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                   <div className="flex justify-between items-center mb-2">
                     <div className="font-medium">{center.name.split(' - ')[1]}</div>
                     <div className={`px-2 py-0.5 rounded-full text-xs ${color}`}>
                       {randomPerformance}%
                     </div>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                     <div className={`h-2 rounded-full ${randomPerformance > 80 ? 'bg-green-500' : randomPerformance > 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${randomPerformance}%` }}></div>
                   </div>
                   <div className="flex justify-between text-xs text-gray-500">
                     <span>{Math.floor(Math.random() * 40) + 20} patients</span>
                     <span>{formatWaitTime(Math.floor(Math.random() * 20) + 10)}</span>
                   </div>
                 </div>
               );
             })}
           </div>
         </div>
       </main>
     </div>
   </div>
 );
}

export default PerformanceTableau;