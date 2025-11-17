import React, { useState } from 'react';
import { 
  Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, AlertTriangle, Wifi, WifiOff, ChevronDown, MoreVertical, UserPlus, RefreshCw, Monitor, Thermometer, Clock, CheckCircle, PlusCircle, Edit, User, ChevronRight, ArrowRight, ExternalLink, AlertCircle, MapPin, Zap, BarChart2, Smartphone, Clipboard, Headphones, Share2, Grid, List, Layout, Circle, AlertOctagon, Sliders, Printer, Send, RotateCcw, Maximize, Minimize, Command, Save, Phone
} from 'lucide-react';

// Import shared components
// Layout Components
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { ViewSelector } from '@layout/ViewSelector';
import MultiTabContainer from '@layout/MultiTabContainer';

// Form Components
import { SearchInput } from '@forms/SearchInput';
import { AppointmentForm } from '@forms/AppointmentForm';

// Data Display
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import DynamicBadge from '@data-display/DynamicBadge';
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

// Teleconsultation
import { VideoConsultation } from '@teleconsult/VideoConsultation';
import { ConsultationTimer } from '@teleconsult/ConsultationTimer';

// Common UI
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Feedback
import { AlertNotification } from '@feedback/AlertNotification';
import ToastNotification from '@feedback/ToastNotification';

// Medical Components
import { VitalSigns } from '@medical/VitalSigns';
import { PatientRecord } from '@medical/PatientRecord';
import { MedicalHistory } from '@medical/MedicalHistory';
import PatientStatusTracker from '@medical/PatientStatusTracker';
import UrgencyLevelIndicator from '@medical/UrgencyLevelIndicator';
import MedicalDataTimeline from '@medical/MedicalDataTimeline';

// Calendar
import { AppointmentCalendar } from '@calendar/AppointmentCalendar';

// Patient Management
import { WaitingQueue } from '@patient/WaitingQueue';

// Facility
import { ConsultationRooms } from '@facility/ConsultationRooms';

// Documents
import { PatientDocuments } from '@documents/PatientDocuments';
import DocumentValidator from '@documents/DocumentValidator';

// Dashboard
import { ActiveConsultations } from '@dashboard/ActiveConsultations';

// Scheduling
import { ConflictManager } from '@scheduling/ConflictManager';

// Communication
import ChatInterface from '@communication/ChatInterface';

// System
import ConnectionStatusMonitor from '@system/ConnectionStatusMonitor';
import SynchronizationQueue from '@system/SynchronizationQueue';

// Navigation
import StepProgressIndicator from '@navigation/StepProgressIndicator';
import RoleBasedActionMenu from '@navigation/RoleBasedActionMenu';

// Tracking
import HistoryTracker from '@tracking/HistoryTracker';

// Utils
import { getUrgencyColor } from '@utils/statusUtils';

const EagleDashboard = () => {
  // États
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState('list'); // 'list', 'status', 'specialty', 'doctor'
  const [activeTab, setActiveTab] = useState('arrived'); // 'arrived', 'waiting', 'preparing', etc.
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showTechMenu, setShowTechMenu] = useState(false);
  const [activeAppointmentTab, setActiveAppointmentTab] = useState('today'); // 'today', 'all'
  
  // Données simulées
  const patients = [
    { id: 1, name: "Kamga Jean", age: 45, gender: "M", urgency: 3, specialty: "Cardiologie", status: "waiting", waitTime: 35, doctor: "Dr. Nana", arrivalTime: "08:15" },
    { id: 2, name: "Mbarga Marie", age: 28, gender: "F", urgency: 2, specialty: "Pédiatrie", status: "preparing", waitTime: 20, doctor: "Dr. Tamo", arrivalTime: "08:30" },
    { id: 3, name: "Kouam Pierre", age: 62, gender: "M", urgency: 4, specialty: "Cardiologie", status: "waiting", waitTime: 15, doctor: "Dr. Nana", arrivalTime: "08:45" },
    { id: 4, name: "Fouda Alice", age: 35, gender: "F", urgency: 1, specialty: "Dermatologie", status: "ready", waitTime: 10, doctor: "Dr. Sob", arrivalTime: "09:00" },
    { id: 5, name: "Amougou Paul", age: 52, gender: "M", urgency: 3, specialty: "Pédiatrie", status: "in_consultation", waitTime: 5, doctor: "Dr. Tamo", arrivalTime: "09:15" },
    { id: 6, name: "Ndongo Anna", age: 7, gender: "F", urgency: 5, specialty: "Pédiatrie", status: "waiting", waitTime: 2, doctor: "Dr. Tamo", arrivalTime: "09:25" },
    { id: 7, name: "Meka Joseph", age: 40, gender: "M", urgency: 2, specialty: "Dermatologie", status: "completed", waitTime: 0, doctor: "Dr. Sob", arrivalTime: "07:30" }
  ];
  
  // Données simulées pour les rendez-vous
  const appointments = [
    { id: 101, name: "Biya Robert", age: 55, gender: "M", specialty: "Cardiologie", doctor: "Dr. Nana", time: "11:30", arrived: false, isLate: false },
    { id: 102, name: "Essomba Claire", age: 32, gender: "F", specialty: "Pédiatrie", doctor: "Dr. Tamo", time: "13:00", arrived: false, isLate: false },
    { id: 103, name: "Atangana Eric", age: 48, gender: "M", specialty: "Dermatologie", doctor: "Dr. Sob", time: "14:15", arrived: false, isLate: false },
    { id: 104, name: "Nkoulou Sarah", age: 25, gender: "F", specialty: "Cardiologie", doctor: "Dr. Nana", time: "15:30", arrived: false, isLate: false },
    { id: 105, name: "Ewane Michel", age: 60, gender: "M", specialty: "Pédiatrie", doctor: "Dr. Tamo", time: "16:00", arrived: false, isLate: false },
    { id: 1, name: "Kamga Jean", age: 45, gender: "M", specialty: "Cardiologie", doctor: "Dr. Nana", time: "08:00", arrived: true, isLate: false },
    { id: 2, name: "Mbarga Marie", age: 28, gender: "F", specialty: "Pédiatrie", doctor: "Dr. Tamo", time: "08:30", arrived: true, isLate: false }
  ];
  
  const specialties = [...new Set(patients.map(p => p.specialty))];
  const doctors = [...new Set(patients.map(p => p.doctor))];

  // Centre secondaire
  const centerInfo = {
    name: "Clinique Saint Jean - Yaoundé",
    code: "CSJ-YDE",
    type: "Centre Secondaire"
  };
  
  // Statistiques
  const stats = {
    waiting: patients.filter(p => p.status === "waiting").length,
    completed: patients.filter(p => p.status === "completed").length,
    avgWaitTime: Math.round(patients.reduce((acc, p) => acc + p.waitTime, 0) / patients.length),
    urgentPatients: patients.filter(p => p.urgency >= 4).length
  };

  // Fonction de changement de patient sélectionné
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPanel(true);
  };

  // Texte du statut
  const getStatusText = (status) => {
    const statuses = {
      "waiting": "En attente",
      "preparing": "En préparation",
      "ready": "Prêt",
      "in_consultation": "En consultation",
      "completed": "Terminé"
    };
    return statuses[status] || status;
  };

  // Classe CSS du statut
  const getStatusClass = (status) => {
    const classes = {
      "waiting": "bg-blue-100 text-blue-800",
      "preparing": "bg-yellow-100 text-yellow-800",
      "ready": "bg-green-100 text-green-800",
      "in_consultation": "bg-purple-100 text-purple-800",
      "completed": "bg-gray-100 text-gray-800"
    };
    return classes[status] || "bg-gray-100 text-gray-800";
  };

  // Configuration des éléments de menu pour la barre latérale
  const menuItems = [
    { icon: <Home size={18} className="text-blue-600 flex-shrink-0" />, label: "Tableau de bord", path: "#", isActive: true },
    { icon: <AlertTriangle size={18} />, label: "Gestion des Urgences", path: "#" },
    { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#" },
    { icon: <FileText size={18} />, label: "Post Consultation", path: "#" },
    { icon: <WifiOff size={18} />, label: "Mode hors ligne", path: "#" },
    { icon: <Activity size={18} />, label: "Monitoring technique", path: "#" },
    { icon: <MessageSquare size={18} />, label: "Communication", path: "#" }
  ];

  const bottomMenuItems = [
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];

  const user = {
    initials: "SS",
    name: "Sara Simo"
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation latérale */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} ${navCollapsed ? 'w-14' : 'w-52'} transition-all duration-300 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} h-full flex flex-col`}>
        {/* Logo et toggle */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200">
          {!navCollapsed && <span className="font-bold text-lg text-blue-600">EAGLE</span>}
          <button 
            onClick={() => setNavCollapsed(!navCollapsed)}
            className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-1 rounded-md`}
          >
            {navCollapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        {/* Menu Items */}
        <SidebarSection navCollapsed={navCollapsed} darkMode={darkMode}>
          {menuItems.map((item, index) => (
            <SidebarItem 
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              navCollapsed={navCollapsed}
              darkMode={darkMode}
              href={item.path}
            />
          ))}
        </SidebarSection>
        
        {/* Bottom menu */}
        <SidebarSection 
          navCollapsed={navCollapsed} 
          darkMode={darkMode} 
          isBottomSection={true}
        >
          {bottomMenuItems.map((item, index) => (
            <SidebarItem 
              key={index}
              icon={item.icon}
              label={item.label}
              navCollapsed={navCollapsed}
              darkMode={darkMode}
              href={item.path}
            />
          ))}
        </SidebarSection>
      </div>
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* En-tête */}
        <Header
          title="Tableau de Bord"
          subtitle={centerInfo.name}
          centerInfo={centerInfo}
          isOnline={isOnline}
          bandwidth={3.8}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={user}
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
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-3">
          {/* Statistiques */}
          {showStats && (
            <StatCardGroup darkMode={darkMode} compact={true}>
              <StatCard
                title="Patients en attente"
                value={stats.waiting}
                icon={<Users size={18} />}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Consultations terminées"
                value={stats.completed}
                icon={<CheckCircle size={18} />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Temps d'attente moyen"
                value={stats.avgWaitTime}
                suffix="min"
                icon={<Clock size={18} />}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
                darkMode={darkMode}
              />
              <StatCard
                title="Patients urgents (4-5)"
                value={stats.urgentPatients}
                icon={<AlertTriangle size={18} />}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
                darkMode={darkMode}
              />
            </StatCardGroup>
          )}
          
          {/* Boutons d'accès rapide et recherche */}
          <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
            <div className="flex flex-wrap gap-1">
              <ActionButton 
                label="Nouvel Enregistrement" 
                icon={<UserPlus size={14} />} 
                variant="primary"
              />
              
              <div className="relative">
                <ActionButton 
                  label="Écrans Spécialisés" 
                  icon={<ExternalLink size={14} />} 
                  variant="secondary"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                />
                
                {showActionMenu && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 text-xs">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Monitor size={14} className="mr-2 text-purple-600" />
                      Affichage Salle d'Attente
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Thermometer size={14} className="mr-2 text-green-600" />
                      Mode Infirmier
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <FileText size={14} className="mr-2 text-orange-600" />
                      Suivi Post-Consultation
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Clipboard size={14} className="mr-2 text-blue-600" />
                      Checklist d'accueil
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Smartphone size={14} className="mr-2 text-indigo-600" />
                      Interface Patient
                    </a>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <ActionButton 
                  label="Signaler Problème" 
                  icon={<AlertCircle size={14} />} 
                  variant="warning"
                  onClick={() => setShowTechMenu(!showTechMenu)}
                />
                
                {showTechMenu && (
                  <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg py-1 text-xs">
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Headphones size={14} className="mr-2 text-red-600" />
                      Problème Audio
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Monitor size={14} className="mr-2 text-red-600" />
                      Problème Vidéo
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Wifi size={14} className="mr-2 text-red-600" />
                      Problème Connexion
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <Printer size={14} className="mr-2 text-red-600" />
                      Problème Impression
                    </a>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                      <AlertOctagon size={14} className="mr-2 text-red-600" />
                      Autre Problème
                    </a>
                  </div>
                )}
              </div>
              
              <ActionButton 
                label="Synchroniser" 
                icon={<RotateCcw size={14} />} 
                variant="info"
              />
            </div>
            
            <div className="flex space-x-1">
              <SearchInput
                placeholder="Rechercher un patient..."
                darkMode={darkMode}
              />
              <button className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} flex items-center`}>
                <Filter size={14} className="mr-1" />
                <span className="text-xs">Filtrer</span>
              </button>
            </div>
          </div>
          
          {/* Barre d'outils des vues - masquée pour l'onglet Rendez-vous */}
          {activeTab !== 'appointments' && (
            <div className={`mb-2 p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow flex items-center justify-between`}>
              <ViewSelector
                currentView={activeView}
                onChange={setActiveView}
                availableViews={['list', 'status', 'specialty', 'doctor']}
                darkMode={darkMode}
              />

              <div className="flex items-center space-x-1 text-xs">
                <button className="p-1 rounded bg-gray-100 text-gray-600 flex items-center">
                  <Send size={14} className="mr-1" />
                  Envoyer SMS groupe
                </button>
                <button className="p-1 rounded bg-gray-100 text-gray-600 flex items-center">
                  <Printer size={14} className="mr-1" />
                  Imprimer liste
                </button>
                <button className="p-1 rounded bg-gray-100 text-gray-600 flex items-center">
                  <Sliders size={14} className="mr-1" />
                  Options
                </button>
              </div>
            </div>
          )}
          
          {/* Onglets */}
          <div className="mb-3 border-b">
            <ul className="flex text-xs font-medium text-center">
              <li className="mr-2">
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'appointments' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('appointments')}
                >
                  Rendez-vous
                </a>
              </li>
              <li className="mr-2">
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'arrived' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('arrived')}
                >
                  Arrivés
                </a>
              </li>
              <li className="mr-2">
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'waiting' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('waiting')}
                >
                  En attente
                </a>
              </li>
              <li className="mr-2">
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'preparing' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('preparing')}
                >
                  En préparation
                </a>
              </li>
              <li className="mr-2">
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'ready' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('ready')}
                >
                  Prêts
                </a>
              </li>
              <li className="mr-2">
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'in_consultation' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('in_consultation')}
                >
                  En consultation
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={`inline-block px-3 py-2 rounded-t-lg ${activeTab === 'completed' ? 'border-b-2 border-blue-600 active text-blue-600' : 'border-transparent hover:border-gray-300'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Terminés
                </a>
              </li>
            </ul>
          </div>
          
          {/* Vue Rendez-vous (nouvelle) */}
          {activeTab === 'appointments' && (
            <>
              {/* Sous-onglets pour Rendez-vous */}
              <div className="mb-3 bg-gray-100 rounded-md p-1 inline-flex">
                <button 
                  className={`px-3 py-1 rounded-md text-xs ${activeAppointmentTab === 'today' ? 'bg-white shadow' : ''}`}
                  onClick={() => setActiveAppointmentTab('today')}
                >
                  Aujourd'hui
                </button>
                <button 
                  className={`px-3 py-1 rounded-md text-xs ${activeAppointmentTab === 'all' ? 'bg-white shadow' : ''}`}
                  onClick={() => setActiveAppointmentTab('all')}
                >
                  Tous les rendez-vous
                </button>
              </div>
              
              {/* Contenu des sous-onglets */}
              {activeAppointmentTab === 'today' ? (
                <>
                  {/* Barre de filtres spécifique aux rendez-vous */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`px-2 py-1 text-xs ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md flex items-center`}>
                        <Calendar size={14} className="mr-1 text-blue-600" />
                        <span>Mardi 20 Mai 2025</span>
                      </div>
                      <select className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md`}>
                        <option value="all">Toutes spécialités</option>
                        {specialties.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <select className={`text-xs px-2 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md`}>
                        <option value="all">Tous médecins</option>
                        {doctors.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      <div className="flex bg-gray-100 rounded-md">
                        <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded-l-md">Liste</button>
                        <button className="px-2 py-1 text-xs text-gray-600">Agenda</button>
                        <button className="px-2 py-1 text-xs text-gray-600 rounded-r-md">Tableau</button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ActionButton
                        label="Nouveau rendez-vous"
                        icon={<PlusCircle size={14} />}
                        variant="primary"
                        size="sm"
                      />
                      <button className="p-1 rounded-md bg-gray-100 text-gray-600">
                        <Printer size={14} />
                      </button>
                      <button className="p-1 rounded-md bg-gray-100 text-gray-600">
                        <Sliders size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Mini-timeline pour visualiser la densité des rendez-vous */}
                  <div className={`mb-3 p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
                    <div className="flex items-center text-xs text-gray-500 mb-1 justify-between">
                      <span>8:00</span>
                      <span>10:00</span>
                      <span>12:00</span>
                      <span>14:00</span>
                      <span>16:00</span>
                      <span>18:00</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full relative">
                      {/* Marqueurs de rendez-vous sur la timeline */}
                      {appointments.map((apt, idx) => {
                        // Convertir l'heure en position relative (8:00 = 0%, 18:00 = 100%)
                        const [hours, minutes] = apt.time.split(':').map(Number);
                        const position = ((hours - 8) * 60 + minutes) / (10 * 60) * 100;
                        const color = apt.arrived ? 'bg-green-500' : (apt.isLate ? 'bg-red-500' : 'bg-blue-500');
                        return (
                          <div 
                            key={idx} 
                            className={`absolute w-2 h-6 ${color} rounded-full top-1/2 transform -translate-y-1/2`} 
                            style={{ left: `${position}%` }}
                            title={`${apt.name} - ${apt.time}`}
                          ></div>
                        );
                      })}
                      
                      {/* Indicateur "Maintenant" */}
                      <div 
                        className="absolute w-1 h-6 bg-red-600 top-1/2 transform -translate-y-1/2 flex flex-col items-center"
                        style={{ left: '30%' }}
                      >
                        <div className="w-3 h-3 bg-red-600 rounded-full -mt-3"></div>
                        <span className="absolute -top-6 text-xs font-bold bg-red-100 text-red-800 px-1 rounded whitespace-nowrap">
                          10:00 (Maintenant)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                        <span className="text-gray-500">À venir</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                        <span className="text-gray-500">En retard</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-gray-500">Arrivé</span>
                      </div>
                    </div>
                  </div>
                
                  {/* Section "Rendez-vous imminents" */}
                  <div className={`mb-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-3`}>
                    <h3 className="text-sm font-medium px-2 py-1 bg-red-50 text-red-800 rounded-md mb-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <AlertCircle size={16} className="mr-1" />
                        Rendez-vous imminents (prochaine heure)
                      </div>
                      <span className="text-xs bg-red-100 px-2 py-0.5 rounded-full">2 patients</span>
                    </h3>
                    
                    {appointments
                      .filter(a => !a.arrived && a.time >= "10:00" && a.time <= "11:00")
                      .map(appointment => (
                        <div 
                          key={`imminent-${appointment.id}`}
                          className="p-3 rounded-md border-l-4 border-red-500 shadow-sm bg-red-50 mb-2 flex items-center"
                        >
                          {/* Indicateur de temps restant (cercle progressif) */}
                          <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                            <div className="absolute inset-0 border-4 border-red-200 rounded-full"></div>
                            <div 
                              className="absolute inset-0 border-4 border-red-500 rounded-full"
                              style={{ 
                                clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 25% 0%)'
                              }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-bold text-red-600">25min</span>
                            </div>
                          </div>
                          
                          {/* Informations patient */}
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-medium">{appointment.name}</span>
                              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 animate-pulse">
                                {appointment.time}
                              </span>
                            </div>
                            <div className="text-xs text-gray-700 mt-1 flex items-center">
                              <span className="mr-2">{appointment.doctor}</span>
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                {appointment.specialty}
                              </span>
                            </div>
                          </div>
                          
                          {/* Actions rapides */}
                          <div className="flex items-center space-x-1">
                            <ActionButton 
                              label="Arrivé" 
                              icon={<CheckCircle size={12} />}
                              variant="success"
                              size="xs"
                            />
                            <button className="p-1.5 rounded-md bg-blue-100 text-blue-600" title="Appeler">
                              <Phone size={14} />
                            </button>
                            <button className="p-1.5 rounded-md bg-gray-100 text-gray-600" title="Plus d'options">
                              <MoreVertical size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                
                  {/* Vérifier si des rendez-vous existent pour aujourd'hui */}
                  {appointments.length > 0 ? (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-4`}>
                      {/* Grouper les rendez-vous par période */}
                      {[['08:00', '12:00', 'Matinée'], ['12:00', '17:00', 'Après-midi']].map(([start, end, label]) => {
                        const periodAppointments = appointments.filter(a => a.time >= start && a.time < end);
                        
                        return periodAppointments.length > 0 ? (
                          <div key={label} className="mb-4">
                            <h3 className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md mb-2 flex justify-between">
                              <span>{label}</span>
                              <span className="text-gray-500">{periodAppointments.length} rendez-vous</span>
                            </h3>
                            
                            <div className="space-y-2">
                              {periodAppointments
                                .sort((a, b) => a.time.localeCompare(b.time))
                                .map(appointment => {
                                  // Code couleur basé sur la spécialité
                                  const specialtyColors = {
                                    'Cardiologie': 'border-red-500',
                                    'Pédiatrie': 'border-blue-500',
                                    'Dermatologie': 'border-green-500'
                                  };
                                  
                                  const borderColor = specialtyColors[appointment.specialty] || 'border-gray-300';
                                  
                                  // Vérifier si le rendez-vous est dans la prochaine heure
                                  const isImminent = !appointment.arrived && appointment.time >= "10:00" && appointment.time <= "11:00";
                                  
                                  return (
                                    <div 
                                      key={appointment.id} 
                                      className={`p-3 rounded-md border ${borderColor} border-l-4 ${appointment.arrived ? 'bg-gray-100 opacity-70' : (isImminent ? 'bg-red-50' : '')} ${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'} flex items-center`}
                                    >
                                      {/* Heure */}
                                      <div className="w-16 text-center">
                                        <div className="text-sm font-bold">{appointment.time}</div>
                                        <div className="text-xs text-gray-500">
                                          {appointment.arrived ? 'Arrivé' : 'Attendu'}
                                        </div>
                                      </div>
                                      
                                      {/* Séparateur */}
                                      <div className="mx-3 h-12 border-r border-gray-200"></div>
                                      
                                      {/* Informations patient */}
                                      <div className="flex-1">
                                        <div className="flex items-center flex-wrap">
                                          <span className="font-medium mr-2">{appointment.name}</span>
                                          <span className="mr-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                                            {appointment.age} ans, {appointment.gender}
                                          </span>
                                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                                            {appointment.specialty}
                                          </span>
                                          {isImminent && (
                                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 animate-pulse flex items-center">
                                              <Clock size={10} className="mr-1" />
                                              Imminent
                                            </span>
                                          )}
                                          {appointment.isLate && (
                                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800 flex items-center">
                                              <AlertTriangle size={10} className="mr-1" />
                                              En retard
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center">
                                          <span className="mr-2">{appointment.doctor}</span>
                                          <div className="flex items-center mr-2">
                                            <Monitor size={12} className="mr-1 text-blue-600" />
                                            <span>Salle {Math.floor(Math.random() * 3) + 1}</span>
                                          </div>
                                          {!appointment.arrived && (
                                            <div className="flex space-x-1 text-gray-600">
                                              <button className="hover:text-blue-600" title="Envoyer un SMS de rappel">
                                                <MessageSquare size={12} />
                                              </button>
                                              <button className="hover:text-blue-600" title="Appeler le patient">
                                                <Phone size={12} />
                                              </button>
                                              <button className="hover:text-blue-600" title="Ajouter une note">
                                                <FileText size={12} />
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {/* Actions */}
                                      <div className="ml-4 flex items-center space-x-2">
                                        {!appointment.arrived ? (
                                          <ActionButton
                                            label="Marquer comme arrivé"
                                            icon={<CheckCircle size={14} />}
                                            variant="success"
                                            size="xs"
                                          />
                                        ) : (
                                          <div className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-xs flex items-center">
                                            <CheckCircle size={14} className="mr-1 text-green-600" />
                                            Arrivé à {appointment.arrivalTime || '08:10'}
                                          </div>
                                        )}
                                        
                                        <div className="flex">
                                          <button className="p-1.5 rounded-md bg-gray-100 text-gray-600" title="Modifier">
                                            <Edit size={14} />
                                          </button>
                                          <div className="relative">
                                            <button className="p-1.5 rounded-md bg-gray-100 text-gray-600 ml-1" title="Plus d'options">
                                              <MoreVertical size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-8 text-center`}>
                      <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
                      <h3 className="text-lg font-medium mb-1">Aucun rendez-vous prévu aujourd'hui</h3>
                      <p className="text-sm text-gray-500">Il n'y a pas de rendez-vous programmés pour la journée en cours</p>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center">
                        <PlusCircle size={16} className="mr-2" />
                        Ajouter un rendez-vous
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-4`}>
                  <div className="flex mb-4 space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input 
                        type="date" 
                        className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`} 
                        defaultValue="2025-05-20"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Spécialité</label>
                      <select 
                        className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                      >
                        <option value="">Toutes les spécialités</option>
                        {specialties.map(specialty => (
                          <option key={specialty} value={specialty}>{specialty}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Médecin</label>
                      <select 
                        className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                      >
                        <option value="">Tous les médecins</option>
                        {doctors.map(doctor => (
                          <option key={doctor} value={doctor}>{doctor}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button className="p-2 bg-blue-600 text-white rounded-md text-sm flex items-center">
                        <Search size={16} className="mr-1" />
                        Rechercher
                      </button>
                    </div>
                  </div>
                  <div className="text-center p-8 text-gray-500">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-400" />
                    <p>Sélectionnez des critères de recherche pour afficher les rendez-vous</p>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Vue Liste */}
          {activeView === 'list' && activeTab !== 'appointments' && (
            <FilterableTable
              columns={[
                {
                  id: 'urgency',
                  header: 'Urgence',
                  accessor: (patient) => (
                    <div className="flex items-center">
                      <UrgencyIndicator level={patient.urgency} size="sm" />
                    </div>
                  ),
                  sortable: true
                },
                {
                  id: 'patient',
                  header: 'Patient',
                  accessor: (patient) => (
                    <>
                      <div className="font-medium text-sm">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.age} ans, {patient.gender}</div>
                    </>
                  ),
                  sortable: true,
                  filterable: true
                },
                {
                  id: 'specialty',
                  header: 'Spécialité',
                  accessor: (patient) => patient.specialty,
                  sortable: true,
                  filterable: true
                },
                {
                  id: 'status',
                  header: 'Statut',
                  accessor: (patient) => (
                    <StatusBadge
                      type={patient.status as any}
                      label={getStatusText(patient.status)}
                    />
                  ),
                  sortable: true,
                  filterable: true
                },
                {
                  id: 'arrival',
                  header: 'Arrivée',
                  accessor: (patient) => patient.arrivalTime,
                  sortable: true
                },
                {
                  id: 'waitTime',
                  header: 'Attente',
                  accessor: (patient) => patient.waitTime > 0 ? `${patient.waitTime} min` : '-',
                  sortable: true
                },
                {
                  id: 'doctor',
                  header: 'Médecin',
                  accessor: (patient) => patient.doctor,
                  sortable: true,
                  filterable: true
                },
                {
                  id: 'actions',
                  header: 'Actions',
                  accessor: (patient) => (
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        className="p-1 text-xs rounded bg-blue-100 text-blue-800 flex items-center" 
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <Edit size={12} className="mr-1" /> 
                        Editer
                      </button>
                      <button 
                        className="p-1 text-xs rounded bg-gray-100 text-gray-800" 
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  )
                }
              ]}
              data={patients.filter(p => activeTab === 'all' || p.status === activeTab)}
              emptyMessage="Aucun patient ne correspond aux critères de filtrage"
            />
          )}
          
          {/* Vue par Statut */}
          {activeView === 'status' && activeTab !== 'appointments' && (
            <div className="grid grid-cols-4 gap-2">
              {['waiting', 'preparing', 'ready', 'in_consultation'].map(status => (
                <div key={status} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-2`}>
                  <h3 className="font-medium text-sm mb-2 flex items-center">
                    {getStatusText(status)}
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {patients.filter(p => p.status === status).length}
                    </span>
                  </h3>
                  
                  <div className="space-y-1 max-h-screen overflow-y-auto">
                    {patients
                      .filter(p => p.status === status)
                      .map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          darkMode={darkMode}
                          onSelect={() => handleSelectPatient(patient)}
                          onAdjustUrgency={() => {}}
                          onDoctorView={() => {}}
                          onMoreOptions={() => {}}
                        />
                      ))}
                      
                    {patients.filter(p => p.status === status).length === 0 && (
                      <div className="p-2 text-center text-xs text-gray-500">
                        Aucun patient {getStatusText(status).toLowerCase()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Vue par Spécialité */}
          {activeView === 'specialty' && activeTab !== 'appointments' && (
            <div className="grid grid-cols-3 gap-2">
              {specialties.map(specialty => (
                <div key={specialty} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-2`}>
                  <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                    <div>
                      {specialty}
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                        {patients.filter(p => p.specialty === specialty).length}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {doctors.find(d => patients.find(p => p.specialty === specialty && p.doctor === d))}
                    </span>
                  </h3>
                  
                  <div className="space-y-1 max-h-screen overflow-y-auto">
                    {patients
                      .filter(p => p.specialty === specialty && (activeTab === 'all' || p.status === activeTab))
                      .sort((a, b) => b.urgency - a.urgency || a.waitTime - b.waitTime)
                      .map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          darkMode={darkMode}
                          onSelect={() => handleSelectPatient(patient)}
                          onAdjustUrgency={() => {}}
                          onDoctorView={() => {}}
                          onMoreOptions={() => {}}
                        />
                      ))}
                      
                    {patients.filter(p => p.specialty === specialty && (activeTab === 'all' || p.status === activeTab)).length === 0 && (
                      <div className="p-2 text-center text-xs text-gray-500">
                        Aucun patient en {specialty.toLowerCase()} {activeTab !== 'all' ? `(${getStatusText(activeTab).toLowerCase()})` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Vue par Médecin */}
          {activeView === 'doctor' && activeTab !== 'appointments' && (
            <div className="grid grid-cols-3 gap-2">
              {doctors.map(doctor => (
                <div key={doctor} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-2`}>
                  <h3 className="font-medium text-sm mb-2 flex items-center justify-between">
                    <div>
                      {doctor}
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                        {patients.filter(p => p.doctor === doctor && (activeTab === 'all' || p.status === activeTab)).length}
                      </span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded">
                      {patients.find(p => p.doctor === doctor)?.specialty}
                    </span>
                  </h3>
                  
                  <div className="space-y-1 max-h-screen overflow-y-auto">
                    {patients
                      .filter(p => p.doctor === doctor && (activeTab === 'all' || p.status === activeTab))
                      .sort((a, b) => b.urgency - a.urgency || a.waitTime - b.waitTime)
                      .map(patient => (
                        <PatientCard
                          key={patient.id}
                          patient={patient}
                          darkMode={darkMode}
                          onSelect={() => handleSelectPatient(patient)}
                          onAdjustUrgency={() => {}}
                          onDoctorView={() => {}}
                          onMoreOptions={() => {}}
                        />
                      ))}
                      
                    {patients.filter(p => p.doctor === doctor && (activeTab === 'all' || p.status === activeTab)).length === 0 && (
                      <div className="p-2 text-center text-xs text-gray-500">
                        Aucun patient pour {doctor} {activeTab !== 'all' ? `(${getStatusText(activeTab).toLowerCase()})` : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Panel latéral des détails patient */}
      {showPanel && selectedPatient && (
        <div className={`w-72 border-l ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} h-screen overflow-y-auto transition-all duration-300 fixed right-0 top-0 z-10`}>
          <div className="p-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-sm">Détails du patient</h3>
            <button 
              onClick={() => setShowPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="p-2">
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-full ${getUrgencyColor(selectedPatient.urgency)}`}>
                <User size={20} className="text-white" />
              </div>
              <div className="ml-2">
                <h4 className="font-bold text-sm">{selectedPatient.name}</h4>
                <p className="text-xs text-gray-500">{selectedPatient.age} ans, {selectedPatient.gender}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mb-3">
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Spécialité</p>
                <p className="font-medium text-sm">{selectedPatient.specialty}</p>
              </div>
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Médecin</p>
                <p className="font-medium text-sm">{selectedPatient.doctor}</p>
              </div>
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Statut</p>
                <p className="font-medium text-sm">{getStatusText(selectedPatient.status)}</p>
              </div>
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Arrivée</p>
                <p className="font-medium text-sm">{selectedPatient.arrivalTime}</p>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Actions rapides</h4>
              <div className="grid grid-cols-2 gap-1">
                {/* Actions spécifiques selon le statut du patient */}
                {selectedPatient.status === "waiting" && (
                  <>
                    <button className="py-1.5 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Débuter pré-consult.
                    </button>
                    <button className="py-1.5 bg-purple-100 text-purple-800 rounded-md flex items-center justify-center text-xs">
                      <ArrowRight size={12} className="mr-1" />
                      Réassigner médecin
                    </button>
                    <button className="py-1.5 bg-yellow-100 text-yellow-800 rounded-md flex items-center justify-center text-xs">
                      <Clock size={12} className="mr-1" />
                      Modifier horaire
                    </button>
                    <button className="py-1.5 bg-gray-200 text-gray-800 rounded-md flex items-center justify-center text-xs">
                      <MessageSquare size={12} className="mr-1" />
                      Notifier patient
                    </button>
                  </>
                )}
                
                {selectedPatient.status === "preparing" && (
                  <>
                    <button className="py-1.5 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">
                      <Monitor size={12} className="mr-1" />
                      Accéder salle pré-consult.
                    </button>
                    <button className="py-1.5 bg-green-100 text-green-800 rounded-md flex items-center justify-center text-xs">
                      <CheckCircle size={12} className="mr-1" />
                      Confirmer préparation
                    </button>
                    <button className="py-1.5 bg-yellow-100 text-yellow-800 rounded-md flex items-center justify-center text-xs">
                      <Wifi size={12} className="mr-1" />
                      Test matériel
                    </button>
                    <button className="py-1.5 bg-gray-200 text-gray-800 rounded-md flex items-center justify-center text-xs">
                      <MessageSquare size={12} className="mr-1" />
                      Notifier patient
                    </button>
                  </>
                )}
                
                {selectedPatient.status === "ready" && (
                  <>
                    <button className="py-1.5 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">
                      <Activity size={12} className="mr-1" />
                      Démarrer consultation
                    </button>
                    <button className="py-1.5 bg-yellow-100 text-yellow-800 rounded-md flex items-center justify-center text-xs">
                      <Wifi size={12} className="mr-1" />
                      Vérifier connexion
                    </button>
                    <button className="py-1.5 bg-purple-100 text-purple-800 rounded-md flex items-center justify-center text-xs">
                      <Clipboard size={12} className="mr-1" />
                      Rappel consignes
                    </button>
                    <button className="py-1.5 bg-gray-200 text-gray-800 rounded-md flex items-center justify-center text-xs">
                      <MessageSquare size={12} className="mr-1" />
                      Notifier patient
                    </button>
                  </>
                )}
                
                {selectedPatient.status === "in_consultation" && (
                  <>
                    <button className="py-1.5 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">
                      <Wifi size={12} className="mr-1" />
                      État connexion
                    </button>
                    <button className="py-1.5 bg-yellow-100 text-yellow-800 rounded-md flex items-center justify-center text-xs">
                      <Clock size={12} className="mr-1" />
                      Durée: {Math.floor(Math.random() * 10) + 5} min
                    </button>
                    <button className="py-1.5 bg-purple-100 text-purple-800 rounded-md flex items-center justify-center text-xs">
                      <MessageSquare size={12} className="mr-1" />
                      Message au médecin
                    </button>
                    <button className="py-1.5 bg-gray-200 text-gray-500 rounded-md flex items-center justify-center text-xs opacity-60">
                      <AlertTriangle size={12} className="mr-1" />
                      Signaler problème
                    </button>
                  </>
                )}
                
                {selectedPatient.status === "completed" && (
                  <>
                    <button className="py-1.5 bg-blue-600 text-white rounded-md flex items-center justify-center text-xs">
                      <FileText size={12} className="mr-1" />
                      Voir prescriptions
                    </button>
                    <button className="py-1.5 bg-green-100 text-green-800 rounded-md flex items-center justify-center text-xs">
                      <Calendar size={12} className="mr-1" />
                      Planifier suivi
                    </button>
                    <button className="py-1.5 bg-purple-100 text-purple-800 rounded-md flex items-center justify-center text-xs">
                      <Printer size={12} className="mr-1" />
                      Imprimer documents
                    </button>
                    <button className="py-1.5 bg-gray-200 text-gray-800 rounded-md flex items-center justify-center text-xs">
                      <MessageSquare size={12} className="mr-1" />
                      Notifier patient
                    </button>
                  </>
                )}
                {/* Actions additionnelles (communes mais avec disponibilité contextuelle) */}
                <button className="py-1.5 bg-yellow-100 text-yellow-800 rounded-md flex items-center justify-center text-xs">
                  <Edit size={12} className="mr-1" />
                  Modifier urgence
                </button>
                <button className={`py-1.5 rounded-md flex items-center justify-center text-xs ${selectedPatient.status === "completed" ? "bg-gray-200 text-gray-500 opacity-60" : "bg-orange-100 text-orange-800"}`}>
                  <BarChart2 size={12} className="mr-1" />
                  Historique patient
                </button>
                <button className={`py-1.5 rounded-md flex items-center justify-center text-xs ${selectedPatient.status === "completed" ? "bg-gray-200 text-gray-500 opacity-60" : "bg-indigo-100 text-indigo-800"}`}>
                  <Monitor size={12} className="mr-1" />
                  Test écran patient
                </button>
                <button className={`py-1.5 rounded-md flex items-center justify-center text-xs ${["in_consultation", "completed"].includes(selectedPatient.status) ? "bg-gray-200 text-gray-500 opacity-60" : "bg-red-100 text-red-800"}`}>
                  <X size={12} className="mr-1" />
                  Annuler demande
                </button>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Checklist pré-consultation</h4>
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-1`}>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">Vérification pièce d'identité</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">Test micro/caméra</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">Documents nécessaires</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">Patient positionné</span>
                </label>
                <button className="mt-1 w-full py-1 bg-blue-100 text-blue-800 rounded flex items-center justify-center text-xs">
                  <ExternalLink size={12} className="mr-1" />
                  Test technique
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-xs mb-1">Notes pour le médecin</h4>
              <textarea 
                className={`w-full p-2 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} min-h-24`}
                placeholder="Ajouter des notes ici..."
              ></textarea>
            </div>
            
            <div className="mt-3 text-right">
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs flex items-center ml-auto">
                <Save size={12} className="mr-1" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EagleDashboard;