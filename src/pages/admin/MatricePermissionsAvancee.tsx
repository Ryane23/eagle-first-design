import React, { useState } from 'react';
import { 
Check, X, Shield, Users, User, Settings, Info, Edit, Database, Calendar, Video, FileText, Copy, AlertTriangle, Clock, Save, RefreshCw, Lock, Unlock, Eye, EyeOff, HelpCircle, ChevronRight, ChevronDown, MessageSquare, Filter, Search, Moon, Sun, LogOut, Bell, Home, Menu, Activity, Zap, PieChart, BarChart, GitPullRequest, PlusCircle, Trash2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Imports des composants partagés
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { SearchInput } from '@forms/SearchInput';
import { StatusBadge } from '@data-display/StatusBadge';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import ThemeSwitcher from '@common/ThemeSwitcher';
import DynamicBadge from '@data-display/DynamicBadge';
import RoleBasedActionMenu from '@navigation/RoleBasedActionMenu';
import HistoryTracker from '@tracking/HistoryTracker';

// Imports des modules extraits
import { UserRole, PermissionLevel } from '@enums/userRoles';
import { COLORS } from '@constants/colors';
import { USER_ROLES, PERMISSIONS, NOTIFICATION_TYPES } from '@constants';
import { useAppContext } from '@contexts/AppContext';
import { getUrgencyColor, getStatusBadgeVariant } from '@utils/statusUtils';
import mockNotificationsData, { notificationTemplates } from '@mocks/notifications';
import { mockDoctorInfo, mockMedicalTeam } from '@mocks/doctors';
import { validatePermissions } from '@validators/formValidators';
// import { calculateRoleStatistics } from '@calculators/medicalCalculators'; supprimer e implemeter directement en attendant

// ✅ AJOUTEZ LA FONCTION ICI - APRÈS LES IMPORTS, AVANT LE COMPOSANT
const calculateRoleStatistics = (roleId: string, permissions: any) => {
  if (!permissions || !permissions[roleId]) {
    return {
      securityScore: 0,
      accessLevel: 'none',
      moduleCount: 0,
      permissions: { read: 0, write: 0, admin: 0 },
      riskLevel: 'low' as const,
      recommendations: ['Aucune permission configurée']
    };
  }
  return {
    securityScore: 78,
    accessLevel: 'medium',
    moduleCount: Object.keys(permissions[roleId]).length,
    permissions: { read: 2, write: 3, admin: 1 },
    riskLevel: 'medium' as const,
    recommendations: ['Vérifier les permissions héritées']
  };
}; 

const MatricePermissionsAvancee = () => {
  // Utilisation du contexte global
  const { state, dispatch } = useAppContext();
  
  // États principaux
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState(UserRole.DOCTOR);
  const [showInheritance, setShowInheritance] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedModules, setExpandedModules] = useState({});
  const [viewMode, setViewMode] = useState('matrix');

  // Utilisation des constantes partagées
  const roles = [
    { id: UserRole.SUPER_ADMIN, name: 'Super Administrateur', color: 'red', count: 1 },
    { id: UserRole.ADMIN_FUNCTIONAL, name: 'Administrateur Fonctionnel', color: 'purple', count: 2 },
    { id: UserRole.SECRETARY_PRIMARY, name: 'Secrétaire Principale', color: 'blue', count: 5 },
    { id: UserRole.SECRETARY_SECONDARY, name: 'Secrétaire Secondaire', color: 'cyan', count: 14 },
    { id: UserRole.DOCTOR, name: 'Médecin', color: 'green', count: 18 },
    { id: UserRole.NURSE, name: 'Infirmier', color: 'yellow', count: 20 }
  ];
  
  const accessTypes = [
    { id: PERMISSIONS.NONE, name: 'Aucun', icon: <X size={16} />, color: 'gray' },
    { id: PERMISSIONS.READ, name: 'Lecture', icon: <Eye size={16} />, color: 'blue' },
    { id: PERMISSIONS.WRITE, name: 'Écriture', icon: <Edit size={16} />, color: 'green' },
    { id: PERMISSIONS.ADMIN, name: 'Admin', icon: <Settings size={16} />, color: 'purple' }
  ];
  
  const modules = [
    {
      id: 'teleconsultation',
      name: 'Téléconsultation',
      icon: <Video />,
      color: 'blue',
      submodules: [
        { id: 'video_consultation', name: 'Consultation Vidéo' },
        { id: 'waiting_room', name: 'Salle d\'Attente Virtuelle' },
        { id: 'patient_priority', name: 'Priorisation des Patients' }
      ]
    },
    {
      id: 'dpi',
      name: 'Dossier Patient Informatisé',
      icon: <FileText />,
      color: 'green',
      submodules: [
        { id: 'patient_data', name: 'Données des Patients' },
        { id: 'medical_history', name: 'Historique Médical' },
        { id: 'prescriptions', name: 'Prescriptions' },
        { id: 'lab_results', name: 'Résultats d\'Analyses' }
      ]
    },
    {
      id: 'rdv',
      name: 'Gestion des Rendez-Vous',
      icon: <Calendar />,
      color: 'purple',
      submodules: [
        { id: 'appointment_scheduling', name: 'Planification des RDV' },
        { id: 'appointment_reminder', name: 'Rappels de RDV' },
        { id: 'offline_mode', name: 'Mode Hors Ligne' }
      ]
    }
  ];
  
  // Permissions simulées (à terme depuis une API ou contexte)
  const [permissions, setPermissions] = useState({
    [UserRole.DOCTOR]: {
      teleconsultation: {
        module: PermissionLevel.WRITE,
        video_consultation: PermissionLevel.WRITE,
        waiting_room: PermissionLevel.READ,
        patient_priority: PermissionLevel.WRITE,
        inherited: {}
      },
      dpi: {
        module: PermissionLevel.WRITE,
        patient_data: PermissionLevel.WRITE,
        medical_history: PermissionLevel.WRITE,
        prescriptions: PermissionLevel.WRITE,
        lab_results: PermissionLevel.READ,
        inherited: {}
      },
      rdv: {
        module: PermissionLevel.READ,
        appointment_scheduling: PermissionLevel.READ,
        appointment_reminder: PermissionLevel.READ,
        offline_mode: PermissionLevel.READ,
        inherited: {}
      }
    },
    [UserRole.NURSE]: {
      teleconsultation: {
        module: PermissionLevel.READ,
        video_consultation: PermissionLevel.READ,
        waiting_room: PermissionLevel.WRITE,
        patient_priority: PermissionLevel.WRITE,
        inherited: {}
      },
      dpi: {
        module: PermissionLevel.WRITE,
        patient_data: PermissionLevel.WRITE,
        medical_history: PermissionLevel.READ,
        prescriptions: PermissionLevel.READ,
        lab_results: PermissionLevel.WRITE,
        inherited: {}
      },
      rdv: {
        module: PermissionLevel.WRITE,
        appointment_scheduling: PermissionLevel.WRITE,
        appointment_reminder: PermissionLevel.WRITE,
        offline_mode: PermissionLevel.READ,
        inherited: {}
      }
    },
    [UserRole.SECRETARY_PRIMARY]: {
      teleconsultation: {
        module: PermissionLevel.ADMIN,
        video_consultation: PermissionLevel.ADMIN,
        waiting_room: PermissionLevel.ADMIN,
        patient_priority: PermissionLevel.ADMIN,
        inherited: {}
      },
      dpi: {
        module: PermissionLevel.READ,
        patient_data: PermissionLevel.READ,
        medical_history: PermissionLevel.READ,
        prescriptions: PermissionLevel.READ,
        lab_results: PermissionLevel.READ,
        inherited: {}
      },
      rdv: {
        module: PermissionLevel.ADMIN,
        appointment_scheduling: PermissionLevel.ADMIN,
        appointment_reminder: PermissionLevel.ADMIN,
        offline_mode: PermissionLevel.ADMIN,
        inherited: {}
      }
    },
    [UserRole.SECRETARY_SECONDARY]: {
      teleconsultation: {
        module: PermissionLevel.READ,
        video_consultation: PERMISSIONS.NONE,
        waiting_room: PermissionLevel.WRITE,
        patient_priority: PermissionLevel.WRITE,
        inherited: {}
      },
      dpi: {
        module: PermissionLevel.READ,
        patient_data: PermissionLevel.READ,
        medical_history: PERMISSIONS.NONE,
        prescriptions: PERMISSIONS.NONE,
        lab_results: PERMISSIONS.NONE,
        inherited: {}
      },
      rdv: {
        module: PermissionLevel.WRITE,
        appointment_scheduling: PermissionLevel.WRITE,
        appointment_reminder: PermissionLevel.WRITE,
        offline_mode: PermissionLevel.WRITE,
        inherited: {}
      }
    },
    [UserRole.ADMIN_FUNCTIONAL]: {
      teleconsultation: {
        module: PermissionLevel.ADMIN,
        video_consultation: PermissionLevel.ADMIN,
        waiting_room: PermissionLevel.ADMIN,
        patient_priority: PermissionLevel.ADMIN,
        inherited: {}
      },
      dpi: {
        module: PermissionLevel.ADMIN,
        patient_data: PermissionLevel.ADMIN,
        medical_history: PermissionLevel.ADMIN,
        prescriptions: PermissionLevel.ADMIN,
        lab_results: PermissionLevel.ADMIN,
        inherited: {}
      },
      rdv: {
        module: PermissionLevel.ADMIN,
        appointment_scheduling: PermissionLevel.ADMIN,
        appointment_reminder: PermissionLevel.ADMIN,
        offline_mode: PermissionLevel.ADMIN,
        inherited: {}
      }
    },
    [UserRole.SUPER_ADMIN]: {
      teleconsultation: {
        module: PermissionLevel.ADMIN,
        video_consultation: PermissionLevel.ADMIN,
        waiting_room: PermissionLevel.ADMIN,
        patient_priority: PermissionLevel.ADMIN,
        inherited: {}
      },
      dpi: {
        module: PermissionLevel.ADMIN,
        patient_data: PermissionLevel.ADMIN,
        medical_history: PermissionLevel.ADMIN,
        prescriptions: PermissionLevel.ADMIN,
        lab_results: PermissionLevel.ADMIN,
        inherited: {}
      },
      rdv: {
        module: PermissionLevel.ADMIN,
        appointment_scheduling: PermissionLevel.ADMIN,
        appointment_reminder: PermissionLevel.ADMIN,
        offline_mode: PermissionLevel.ADMIN,
        inherited: {}
      }
    }
  });

  // Utilisation des mocks partagés pour les anomalies (transformation des notifications)
  const anomalies = mockNotificationsData
    .filter(notif => notif.type === 'warning' || notif.type === 'error')
    .map(notif => ({
      id: notif.id,
      type: notif.type === 'warning' ? 'conflict' : 'unused',
      severity: notif.priority,
      description: notif.content,
      recommendation: `Résoudre: ${notif.title}`,
      autoFix: notif.type === 'warning'
    }));

  // Utilisation des mocks de médecins pour les demandes
  const pendingRequests = mockMedicalTeam.slice(0, 2).map((doctor, index) => ({
    id: index + 1,
    user: doctor.name,
    role: "Médecin",
    request: index === 0 ? "Accès en écriture au module Statistiques" : "Accès à l'historique médical",
    clinique: doctor.clinique,
    date: "10/05/2025",
    priority: index === 0 ? "high" : "medium",
    reason: index === 0 ? "Besoin d'accéder aux statistiques de la clinique pour le rapport mensuel" : "Besoin de consulter les antécédents des patients pour les rendez-vous"
  }));
  
  // Données pour les graphiques (utilisation de données calculées)
  const securityStats = [
    { name: 'Très élevé', value: 15 },
    { name: 'Élevé', value: 30 },
    { name: 'Moyen', value: 40 },
    { name: 'Faible', value: 15 }
  ];
  
  const securityChartColors = [COLORS.SUCCESS[500], COLORS.PRIMARY[500], COLORS.WARNING[500], COLORS.ERROR[500]];
  
  // Fonctions utilisant les utils partagés
  const toggleModuleExpansion = (moduleId) => {
    setExpandedModules({
      ...expandedModules,
      [moduleId]: !expandedModules[moduleId]
    });
  };
  
  const changeAccessType = (moduleId, submoduleId, accessType) => {
    setHasUnsavedChanges(true);
    
    const newPermissions = { ...permissions };
    
    if (submoduleId === 'module') {
      newPermissions[selectedRole][moduleId].module = accessType;
      
      // Si on change le module parent, propager aux enfants sauf si hérités
      modules.find(m => m.id === moduleId)?.submodules.forEach(sub => {
        if (!Object.values(newPermissions[selectedRole][moduleId].inherited).flat().includes(sub.id)) {
          newPermissions[selectedRole][moduleId][sub.id] = accessType;
        }
      });
    } else {
      newPermissions[selectedRole][moduleId][submoduleId] = accessType;
    }
    
    setPermissions(newPermissions);
  };
  
  // Utilisation des utils partagés pour les couleurs
  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return 'gray';
    
    const colorMap = {
      'red': state.darkMode ? 'text-red-400' : 'text-red-600',
      'blue': state.darkMode ? 'text-blue-400' : 'text-blue-600',
      'green': state.darkMode ? 'text-green-400' : 'text-green-600',
      'purple': state.darkMode ? 'text-purple-400' : 'text-purple-600',
      'yellow': state.darkMode ? 'text-yellow-500' : 'text-yellow-600',
      'cyan': state.darkMode ? 'text-cyan-400' : 'text-cyan-600'
    };
    
    return colorMap[role.color] || (state.darkMode ? 'text-gray-400' : 'text-gray-600');
  };
  
  const getModuleAccentColor = (moduleColor) => {
    const colorMap = {
      'red': state.darkMode ? 'border-red-700' : 'border-red-500',
      'blue': state.darkMode ? 'border-blue-700' : 'border-blue-500',
      'green': state.darkMode ? 'border-green-700' : 'border-green-500',
      'purple': state.darkMode ? 'border-purple-700' : 'border-purple-500'
    };
    
    return colorMap[moduleColor] || (state.darkMode ? 'border-gray-700' : 'border-gray-300');
  };
  
  const getAccessTypeIcon = (moduleId, submoduleId, accessType) => {
    const type = accessTypes.find(t => t.id === accessType);
    if (!type) return null;
    
    const colorMap = {
      [PERMISSIONS.NONE]: state.darkMode ? 'text-gray-500' : 'text-gray-400',
      [PERMISSIONS.READ]: state.darkMode ? 'text-blue-400' : 'text-blue-600',
      [PERMISSIONS.WRITE]: state.darkMode ? 'text-green-400' : 'text-green-600',
      [PERMISSIONS.ADMIN]: state.darkMode ? 'text-purple-400' : 'text-purple-600'
    };
    
    return (
      <div className={`flex items-center justify-center ${colorMap[type.id] || (state.darkMode ? 'text-gray-400' : 'text-gray-600')}`}>
        {type.icon}
      </div>
    );
  };
  
  const isInherited = (moduleId, submoduleId) => {
    if (!showInheritance) return false;
    
    const modulePermissions = permissions[selectedRole][moduleId];
    if (!modulePermissions || !modulePermissions.inherited) return false;
    
    // Vérifier dans tous les rôles hérités
    for (const [parentRole, inheritedSubmodules] of Object.entries(modulePermissions.inherited)) {
      if (inheritedSubmodules.includes(submoduleId)) {
        return parentRole;
      }
    }
    
    return false;
  };
  
  // Utilisation du calculateur partagé
  const calculateSecurityScore = () => {
    return calculateRoleStatistics(selectedRole, permissions).securityScore || 78;
  };
  
  return (
    <div className={`min-h-screen flex ${state.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Using Sidebar component */}
      <Sidebar 
        appName="EAGLE Admin" 
        menuItems={[
          { icon: <Home size={20} />, label: "Tableau de bord", path: "#", isActive: activeTab === 'dashboard' },
          { icon: <Shield size={20} />, label: "Matrice des Permissions", path: "#", isActive: activeTab === 'matrix' },
          { icon: <Users size={20} />, label: "Gestion Utilisateurs", path: "#", isActive: activeTab === 'users' },
          { icon: <GitPullRequest size={20} />, label: "Demandes", path: "#", isActive: activeTab === 'requests' },
          { icon: <Activity size={20} />, label: "Analyse & Optimisation", path: "#", isActive: activeTab === 'analytics' }
        ]}
        bottomMenuItems={[
          { icon: <LogOut size={18} />, label: "Se déconnecter", path: "#" }
        ]}
        darkMode={state.darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Using Header component */}
        <Header
          title="Matrice des Permissions"
          subtitle="Définition des droits d'accès par profil utilisateur"
          darkMode={state.darkMode}
          toggleDarkMode={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          user={{
            initials: "JK",
            name: "Dr. Kameni Jean"
          }}
          notificationCount={pendingRequests.length}
          extraHeaderItems={
            <ThemeSwitcher 
              size="medium" 
              showLabel={false} 
              onChange={(isDark) => dispatch({ type: 'TOGGLE_DARK_MODE' })} 
              defaultDarkMode={state.darkMode}
            />
          }
        />
        
        {/* Contenu principal */}
        <div className="flex-1 overflow-auto p-4">
          {/* Sélecteur de rôle */}
          <div className={`mb-6 ${state.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
            <h3 className="text-lg font-medium mb-3">Sélection du profil utilisateur</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                    selectedRole === role.id
                      ? (state.darkMode ? `bg-${role.color}-900 text-${role.color}-300` : `bg-${role.color}-100 text-${role.color}-800`)
                      : (state.darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <User className={`h-6 w-6 mb-1 ${selectedRole === role.id ? getRoleColor(role.id) : ''}`} />
                  <span className="text-sm font-medium">{role.name}</span>
                  <span className="text-xs mt-1">{role.count} utilisateur{role.count > 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Assistant intelligent */}
          <div className={`mb-6 ${state.darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} rounded-lg p-4 border ${state.darkMode ? 'border-blue-700' : 'border-blue-200'}`}>
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <div className={`p-2 rounded-full ${state.darkMode ? 'bg-blue-800' : 'bg-blue-100'} mr-3`}>
                  <Zap className={`h-5 w-5 ${state.darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className="font-medium flex items-center">Assistant Intelligent</h3>
                  <p className="text-sm mt-1">
                    Analyse des anomalies récentes pour le rôle {roles.find(r => r.id === selectedRole)?.name}:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                      3 tentatives d'accès refusées au module "Statistiques - Export"
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" />
                      Le module "Mode Hors Ligne" n'a pas été utilisé depuis 45 jours
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {/* Using ActionButton component */}
                <ActionButton
                  label="Suggestions"
                  icon={<Zap className="h-4 w-4" />}
                  variant="primary"
                  size="sm"
                />
                <button 
                  className={`p-1 rounded-lg ${
                    state.darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Matrice des permissions */}
          <div className={`mb-6 ${state.darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
            <div className={`p-4 ${state.darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${state.darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-lg font-medium flex items-center">
                  <span className={getRoleColor(selectedRole)}>
                    {roles.find(r => r.id === selectedRole)?.name || 'Profil'}
                  </span>
                  <span className="mx-2">-</span>
                  <span>Matrice des permissions</span>
                </h2>
                
                <div className="flex items-center mt-2 sm:mt-0">
                  {hasUnsavedChanges && (
                    <DynamicBadge 
                      label="Modifications non enregistrées"
                      variant="warning"
                      rounded="full"
                    />
                  )}
                  
                  <ButtonGroup className="ml-2">
                    <StatusBadge type="error" label="Aucun" icon={<X className="h-3 w-3" />} />
                    <StatusBadge type="info" label="Lecture" icon={<Eye className="h-3 w-3" />} />
                    <StatusBadge type="success" label="Écriture" icon={<Edit className="h-3 w-3" />} />
                    <StatusBadge type="warning" label="Admin" icon={<Settings className="h-3 w-3" />} />
                  </ButtonGroup>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className={`w-full table-auto ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <thead className={`${state.darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium w-3/6">Module / Fonctionnalité</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-1/6">Aucun</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-1/6">Lecture</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-1/6">Écriture</th>
                    <th className="px-4 py-3 text-center text-sm font-medium w-1/6">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {modules.map((module) => (
                    <React.Fragment key={module.id}>
                      {/* Ligne du module principal */}
                      <tr className={`${state.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-3 text-left">
                          <div className="flex items-center">
                            <button 
                              className={`mr-2 p-1 rounded-md ${
                                state.darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                              }`}
                              onClick={() => toggleModuleExpansion(module.id)}
                            >
                              {expandedModules[module.id] ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </button>
                            <div className={`p-1.5 rounded-md mr-2 ${
                              state.darkMode ? `bg-${module.color}-900` : `bg-${module.color}-100`
                            }`}>
                              {React.cloneElement(module.icon, { 
                                className: `h-4 w-4 ${
                                  state.darkMode ? `text-${module.color}-400` : `text-${module.color}-600`
                                }` 
                              })}
                            </div>
                            <div>
                              <span className="font-medium">{module.name}</span>
                              <button 
                                className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                                  state.darkMode ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                <Info className="h-3 w-3 inline mr-0.5" />
                                Détails
                              </button>
                            </div>
                          </div>
                        </td>
                        {accessTypes.map((accessType) => (
                          <td key={accessType.id} className="px-4 py-3 text-center">
                            <button 
                              className={`p-2 rounded-full ${
                                permissions[selectedRole][module.id].module === accessType.id
                                  ? (state.darkMode 
                                      ? `bg-${accessType.color}-900 text-${accessType.color}-300` 
                                      : `bg-${accessType.color}-100 text-${accessType.color}-600`)
                                  : (state.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                              }`}
                              onClick={() => changeAccessType(module.id, 'module', accessType.id)}
                            >
                              {getAccessTypeIcon(module.id, 'module', permissions[selectedRole][module.id].module === accessType.id ? accessType.id : PERMISSIONS.NONE)}
                            </button>
                          </td>
                        ))}
                      </tr>
                      
                      {/* Sous-modules */}
                      {expandedModules[module.id] && module.submodules.map((submodule) => {
                        const inheritedFrom = isInherited(module.id, submodule.id);
                        
                        return (
                          <tr 
                            key={`${module.id}-${submodule.id}`} 
                            className={`${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} border-l-4 ${getModuleAccentColor(module.color)}`}
                          >
                            <td className="px-4 py-2 text-left">
                              <div className="flex items-center pl-8">
                                <span className={`text-sm ${inheritedFrom ? (state.darkMode ? 'text-gray-400' : 'text-gray-500') : ''}`}>
                                  {submodule.name}
                                </span>
                                {inheritedFrom && (
                                  <StatusBadge
                                    type="info"
                                    label={`Hérité de ${roles.find(r => r.id === inheritedFrom)?.name}`}
                                    icon={<Lock className="h-3 w-3" />}
                                  />
                                )}
                              </div>
                            </td>
                            {accessTypes.map((accessType) => (
                              <td key={accessType.id} className="px-4 py-2 text-center">
                                <button 
                                  className={`p-2 rounded-full ${
                                    permissions[selectedRole][module.id][submodule.id] === accessType.id
                                      ? (state.darkMode 
                                          ? `bg-${accessType.color}-900 text-${accessType.color}-300` 
                                          : `bg-${accessType.color}-100 text-${accessType.color}-600`)
                                      : (state.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                                  }`}
                                  onClick={() => changeAccessType(module.id, submodule.id, accessType.id)}
                                  disabled={!!inheritedFrom}
                                >
                                  {getAccessTypeIcon(module.id, submodule.id, permissions[selectedRole][module.id][submodule.id] === accessType.id ? accessType.id : PERMISSIONS.NONE)}
                                </button>
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatricePermissionsAvancee;