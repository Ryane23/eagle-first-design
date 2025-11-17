import React, { useState, useEffect } from 'react';
import { 
Search, Filter, UserPlus, Edit, Key, User, Users, Mail, Phone, Plus, X, Check, ChevronDown, Eye, EyeOff, XCircle, HelpCircle, RefreshCw, Bell, Home, Shield, Settings, Activity, Database, Zap, LogOut, Calendar, ChevronRight, FileText, Sliders, Building, Clock, Power
} from 'lucide-react';

// Imports des composants partagés UNIQUEMENT (modules de niveau supérieur)
import { ConnectionStatus } from '@common/ConnectionStatus';
import { SearchInput } from '@forms/SearchInput';
import { Modal } from '@modals/Modal';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import ThemeSwitcher from '@common/ThemeSwitcher';
import FilterableTable from '@data-display/FilterableTable';
import ToastNotification from '@feedback/ToastNotification';
import UserActivityLog from '@system/UserActivityLog';
import RoleBasedActionMenu from '@navigation/RoleBasedActionMenu';

// Imports des modules partagés extraits
import { User as UserType, Role, Permission } from '@types';
import { UserRole, PermissionLevel } from '@enums/userRoles';
import { formatDateTime } from '@utils/dateUtils';
import { 
  validateEmail, 
  validatePhoneCameroon, 
  validateRequired, 
  validateMinLength, 
  validateMaxLength 
} from '@utils/validationUtils';
import { NotificationBuilder } from '@builders/notificationBuilder';
import { useFormValidation } from '@hooks/useFormValidation';
import { useNotification } from '@hooks/useNotification';
import { useAppContext } from '@contexts/AppContext';
import { apiService } from '@services/api';
import { notificationService } from '@services/notificationService';
import { 
  USER_ROLES, 
  PERMISSIONS, 
  ERROR_MESSAGES, 
  DATE_FORMATS 
} from '@constants';

const GestionUtilisateurs = () => {
  // Utilisation du contexte global
  const { state, dispatch } = useAppContext();
  
  // Utilisation du hook de notification
  const { addNotification, notifications, unreadCount } = useNotification();
  
  // États UI uniquement
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [connected, setConnected] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Configuration de validation pour le formulaire utilisateur
  const validationRules = {
    firstName: (value: string) => {
      if (!validateRequired(value)) return 'Le prénom est requis';
      if (!validateMinLength(value, 2)) return 'Le prénom doit contenir au moins 2 caractères';
      if (!validateMaxLength(value, 50)) return 'Le prénom ne peut pas dépasser 50 caractères';
      return true;
    },
    lastName: (value: string) => {
      if (!validateRequired(value)) return 'Le nom est requis';
      if (!validateMinLength(value, 2)) return 'Le nom doit contenir au moins 2 caractères';
      if (!validateMaxLength(value, 50)) return 'Le nom ne peut pas dépasser 50 caractères';
      return true;
    },
    email: (value: string) => {
      if (!validateRequired(value)) return 'L\'email est requis';
      if (!validateEmail(value)) return 'Format d\'email invalide';
      return true;
    },
    phone: (value: string) => {
      if (value && !validatePhoneCameroon(value)) return 'Format de téléphone invalide';
      return true;
    },
    role: (value: string) => {
      if (!validateRequired(value)) return 'Le rôle est requis';
      return true;
    }
  };
  
  // États pour les formulaires avec validation
  const initialUserData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    clinic: '',
    sendEmail: true,
    password: ''
  };
  
  const { 
    values: newUser, 
    errors, 
    handleChange, 
    validate, 
    reset: resetForm,
    isValid 
  } = useFormValidation(initialUserData, validationRules);
  
  // Simulation des données utilisateur (normalement viendraient du service API)
  const users: UserType = [
    { 
      id: 'USR-001', 
      name: 'Kouam',
      email: 'j.kouam@eagle-clinics.cm',
      role: UserRole.DOCTOR,
      initials: 'JK',
      photo: undefined
    },
    { 
      id: 'USR-002', 
      name: 'Mbarga',
      email: 'm.mbarga@eagle-clinics.cm',
      role: UserRole.SECRETARY_PRINCIPAL,
      initials: 'MM',
      photo: undefined
    },
    { 
      id: 'USR-003', 
      name: 'Etoundi',
      email: 'p.etoundi@eagle-clinics.cm',
      role: UserRole.NURSE,
      initials: 'PE',
      photo: undefined
    },
    { 
      id: 'USR-004', 
      name: 'Bekolo',
      email: 's.bekolo@eagle-clinics.cm',
      role: UserRole.SECRETARY_SECONDARY,
      initials: 'SB',
      photo: undefined
    },
    { 
      id: 'USR-005', 
      name: 'Atangana',
      email: 'r.atangana@eagle-clinics.cm',
      role: UserRole.DOCTOR,
      initials: 'RA',
      photo: undefined
    }
  ];

  // Données étendues pour l'affichage (simulation)
  const extendedUsers = users.map(user => ({
    ...user,
    firstName: user.name.split(' ')[0] || user.name,
    lastName: user.name.split(' ')[1] || '',
    phone: '+237 651234567',
    clinic: user.role === UserRole.DOCTOR ? 'Centre Principal' : 'Clinique Secondaire 1',
    status: Math.random() > 0.2 ? 'Actif' : 'Inactif',
    lastConnection: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }));

  // Configuration des colonnes pour FilterableTable
  const columns = [
    {
      id: 'name',
      header: 'Nom complet',
      accessor: (user: any) => `${user.firstName} ${user.lastName}`,
      sortable: true,
      filterable: true
    },
    {
      id: 'id',
      header: 'Identifiant',
      accessor: (user: any) => user.id,
      sortable: true,
      filterable: true
    },
    {
      id: 'email',
      header: 'Email',
      accessor: (user: any) => user.email,
      sortable: true,
      filterable: true
    },
    {
      id: 'role',
      header: 'Rôle',
      accessor: (user: any) => (
        <StatusBadge 
          type="info"
          label={getUserRoleLabel(user.role)}
          rounded="full"
        />
      ),
      sortable: true,
      filterable: true
    },
    {
      id: 'clinic',
      header: 'Clinique',
      accessor: (user: any) => user.clinic,
      sortable: true,
      filterable: true
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (user: any) => (
        <StatusBadge 
          type={user.status === 'Actif' ? 'success' : 'error'}
          label={user.status}
          rounded="full"
        />
      ),
      sortable: true
    },
    {
      id: 'lastConnection',
      header: 'Dernière connexion',
      accessor: (user: any) => formatDateTime(user.lastConnection),
      sortable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (user: any) => (
        <RoleBasedActionMenu
          actions={[
            {
              id: 'edit',
              label: 'Modifier',
              icon: <Edit className="h-4 w-4" />,
              action: () => handleEditUser(user),
              roles: ['admin', 'manager'],
              variant: 'secondary'
            },
            {
              id: 'reset-password',
              label: 'Réinitialiser mot de passe',
              icon: <Key className="h-4 w-4" />,
              action: () => handleResetPassword(user),
              roles: ['admin', 'manager'],
              variant: 'warning'
            }
          ]}
          userRoles={[state.user?.role || 'admin']}
          layout="horizontal"
          size="sm"
        />
      )
    }
  ];

  // Configuration de la barre latérale
  const menuItems = [
    { icon: <Home size={20} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <Users size={20} />, label: "Gestion Utilisateurs", path: "#", isActive: true },
    { icon: <Shield size={20} />, label: "Permissions", path: "#", isActive: false },
    { icon: <Settings size={20} />, label: "Règles Opérationnelles", path: "#", isActive: false },
    { icon: <Activity size={20} />, label: "Supervision", path: "#", isActive: false },
    { icon: <Database size={20} />, label: "Modules", path: "#", isActive: false },
    { icon: <Zap size={20} />, label: "Hiérarchie RBAC", path: "#", isActive: false }
  ];
  
  const bottomMenuItems = [
    { icon: <LogOut size={18} />, label: "Se déconnecter", path: "#" }
  ];

  // Fonction utilitaire pour obtenir le label du rôle
  const getUserRoleLabel = (role: UserRole): string => {
    const roleLabels = {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
      [UserRole.ADMIN_FUNCTIONAL]: 'Admin Fonctionnel',
      [UserRole.SECRETARY_PRINCIPAL]: 'Secrétaire Principale',
      [UserRole.SECRETARY_SECONDARY]: 'Secrétaire Secondaire',
      [UserRole.DOCTOR]: 'Médecin',
      [UserRole.NURSE]: 'Infirmier'
    };
    return roleLabels[role] || role;
  };

  // Handlers utilisant les services
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleResetPassword = async (user: any) => {
    try {
      // Utilisation du service API pour réinitialiser le mot de passe
      const response = await apiService.post('/users/reset-password', { userId: user.id });
      
      if (response.success) {
        // Utilisation du NotificationBuilder pour créer une notification
        const notification = new NotificationBuilder()
          .setTitle('Mot de passe réinitialisé')
          .setMessage(`Mot de passe réinitialisé pour ${user.firstName} ${user.lastName}`)
          .setType('success')
          .build();
        
        addNotification(notification);
        
        // Notification système
        await notificationService.showNotification({
          title: 'Succès',
          body: `Mot de passe réinitialisé pour ${user.firstName} ${user.lastName}`
        });
      }
    } catch (error) {
      const errorNotification = new NotificationBuilder()
        .setTitle('Erreur')
        .setMessage(ERROR_MESSAGES.SERVER_ERROR)
        .setType('error')
        .build();
      
      addNotification(errorNotification);
    }
  };

  const handleAddUser = async () => {
    if (!validate()) {
      const errorNotification = new NotificationBuilder()
        .setTitle('Erreur de validation')
        .setMessage(ERROR_MESSAGES.VALIDATION_ERROR)
        .setType('error')
        .build();
      
      addNotification(errorNotification);
      return;
    }

    try {
      // Utilisation du service API pour créer l'utilisateur
      const response = await apiService.post('/users', newUser);
      
      if (response.success) {
        setShowAddModal(false);
        resetForm();
        
        const successNotification = new NotificationBuilder()
          .setTitle('Utilisateur créé')
          .setMessage('Utilisateur créé avec succès')
          .setType('success')
          .build();
        
        addNotification(successNotification);
        
        // Mise à jour du contexte global si nécessaire
        dispatch({ type: 'SET_NOTIFICATIONS', payload: unreadCount + 1 });
      }
    } catch (error) {
      const errorNotification = new NotificationBuilder()
        .setTitle('Erreur')
        .setMessage(ERROR_MESSAGES.SERVER_ERROR)
        .setType('error')
        .build();
      
      addNotification(errorNotification);
    }
  };

  // Mise à jour du contexte lors du changement de notifications
  useEffect(() => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: unreadCount });
  }, [unreadCount, dispatch]);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar 
        appName="EAGLE Admin" 
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode} 
      />
        
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header
          title="Gestion des Utilisateurs"
          subtitle="Administration"
          isOnline={connected}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={state.user || { initials: "AS", name: "Admin Système" }}
          notificationCount={state.notifications}
          extraHeaderItems={
            <ConnectionStatus 
              isOnline={connected} 
              onToggleConnection={() => setConnected(!connected)}
              showControls={true}
              darkMode={darkMode}
            />
          }
        />
        
        {/* Alerte hors ligne */}
        {!connected && (
          <ConnectionStatus 
            isOnline={false} 
            showFullAlert={true}
            onReconnect={() => setConnected(!connected)}
            darkMode={darkMode}
            className="m-6"
          />
        )}
        
        {/* Contenu principal */}
        <div className="p-6">
          {/* Barre d'actions */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <SearchInput
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                darkMode={darkMode}
                width="w-64"
              />
              
              <ActionButton
                label="Filtres avancés"
                icon={<Filter className="h-4 w-4" />}
                variant={showFilters ? "info" : "secondary"}
                onClick={() => setShowFilters(!showFilters)}
                size="md"
              />
            </div>
            
            <ActionButton
              label="Ajouter un utilisateur"
              icon={<UserPlus className="h-5 w-5" />}
              variant="primary"
              size="md"
              onClick={() => setShowAddModal(true)}
            />
          </div>
          
          {/* Tableau des utilisateurs */}
          <div className={`rounded-lg overflow-hidden shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <FilterableTable 
              columns={columns}
              data={extendedUsers}
              emptyMessage="Aucun utilisateur trouvé"
            />
          </div>
        </div>
      </div>
      
      {/* Modal d'ajout d'utilisateur */}
      <Modal
        title="Ajouter un nouvel utilisateur"
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        darkMode={darkMode}
        width="max-w-2xl"
        footer={
          <ButtonGroup>
            <ActionButton
              label="Annuler"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            />
            <ActionButton
              label="Créer l'utilisateur"
              variant="primary"
              onClick={handleAddUser}
              disabled={!isValid}
            />
          </ButtonGroup>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Formulaire avec validation */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Prénom *
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
              } ${errors.firstName ? 'border-red-500' : ''}`}
              value={newUser.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nom *
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
              } ${errors.lastName ? 'border-red-500' : ''}`}
              value={newUser.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email *
            </label>
            <input
              type="email"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
              } ${errors.email ? 'border-red-500' : ''}`}
              value={newUser.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Téléphone
            </label>
            <input
              type="tel"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
              } ${errors.phone ? 'border-red-500' : ''}`}
              value={newUser.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+237 6XX XXX XXX"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Rôle *
            </label>
            <select
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
              } ${errors.role ? 'border-red-500' : ''}`}
              value={newUser.role}
              onChange={(e) => handleChange('role', e.target.value)}
            >
              <option value="">Sélectionner un rôle</option>
              {Object.values(UserRole).map(role => (
                <option key={role} value={role}>
                  {getUserRoleLabel(role)}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role}</p>
            )}
          </div>
        </div>
      </Modal>
      
      {/* Activité utilisateur */}
      <div className="fixed bottom-4 right-4 max-w-md">
        <UserActivityLog
          activities={[
            {
              id: 1,
              user: { id: '1', name: 'Admin', role: 'Administrateur' },
              action: 'create',
              resourceType: 'utilisateur',
              resourceName: 'Jean Kouam',
              timestamp: formatDateTime(new Date()),
              details: 'Création d\'un nouveau compte médecin'
            }
          ]}
          maxHeight="300px"
          canExport={false}
          showDetails={false}
        />
      </div>
    </div>
  );
};

export default GestionUtilisateurs;