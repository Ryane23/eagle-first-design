import React, { useState } from 'react';
import { 
User, Shield, Users, Stethoscope, HeartHandshake, UserCog, ArrowRight, Building, Globe, CheckCircle, Activity, AlertTriangle, Zap, ChevronRight, LogIn, Grid, List, Menu, X, Clock
} from 'lucide-react';

// AJOUTER ces 2 imports en haut de votre fichier
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';

const RoleSelector = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // AJOUTER ces 2 hooks après vos états existants
  const navigate = useNavigate();
  const { login } = useAuth();

  // Configuration des rôles
  const roles = [
    {
      id: 'admin',
      name: 'Administrateur',
      shortName: 'Admin',
      icon: <Shield className="h-6 w-6 md:h-8 md:w-8" />,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      borderLight: 'border-purple-200',
      textColor: 'text-purple-700',
      stats: { users: 89, online: 76, modules: 8 },
      mainInterface: 'Permissions & Configuration',
      notifications: 3
    },
    {
      id: 'doctor',
      name: 'Médecin',
      shortName: 'Médecin',
      icon: <Stethoscope className="h-6 w-6 md:h-8 md:w-8" />,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      borderLight: 'border-green-200',
      textColor: 'text-green-700',
      stats: { patients: 12, consultations: 8, urgent: 2 },
      mainInterface: 'Consultations & Urgences',
      notifications: 7
    },
    {
      id: 'nurse',
      name: 'Infirmier',
      shortName: 'Infirmier',
      icon: <HeartHandshake className="h-6 w-6 md:h-8 md:w-8" />,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      borderLight: 'border-blue-200',
      textColor: 'text-blue-700',
      stats: { prepared: 15, waiting: 8, completed: 22 },
      mainInterface: 'Pré/Post Consultation',
      notifications: 4
    },
    {
      id: 'secretary_primary',
      name: 'Secrétaire Principale',
      shortName: 'Sec. Principale',
      icon: <UserCog className="h-6 w-6 md:h-8 md:w-8" />,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      bgLight: 'bg-indigo-50',
      borderLight: 'border-indigo-200',
      textColor: 'text-indigo-700',
      stats: { clinics: 5, activeRooms: 12, queue: 45 },
      mainInterface: 'Coordination Inter-cliniques',
      notifications: 8
    },
    {
      id: 'secretary_secondary',
      name: 'Secrétaire Secondaire',
      shortName: 'Sec. Secondaire',
      icon: <User className="h-6 w-6 md:h-8 md:w-8" />,
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600',
      bgLight: 'bg-cyan-50',
      borderLight: 'border-cyan-200',
      textColor: 'text-cyan-700',
      stats: { registered: 28, waiting: 12, rdv: 16 },
      mainInterface: 'Gestion Locale Patients',
      notifications: 2
    }
  ];

  // État du réseau simplifié
  const networkStatus = {
    active: 4,
    total: 5,
    bandwidth: 3.8
  };

// REMPLACER votre fonction handleRoleSelect existante par :
  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    login(roleId); // Authentification
    
    setTimeout(() => {
      // Navigation vers le dashboard du rôle
      navigate(`/${roleId}/dashboard`);
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header compact */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo et titre */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg md:text-xl font-bold text-gray-800">EAGLE</h1>
                <p className="text-xs text-gray-500 hidden md:block">Système de Téléconsultation</p>
              </div>
            </div>

            {/* Status réseau - Desktop */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center text-sm">
                <div className="flex items-center mr-4">
                  <Globe className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{networkStatus.active}/{networkStatus.total} centres</span>
                  <div className="h-2 w-2 bg-green-400 rounded-full ml-2 animate-pulse" />
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-gray-600">{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            {/* Menu mobile */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Status mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-2 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Globe className="h-3 w-3 text-gray-400 mr-1" />
                <span>{networkStatus.active}/{networkStatus.total} centres actifs</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-3 w-3 text-gray-400 mr-1" />
                <span>{networkStatus.bandwidth} Mbps</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Contenu principal - hauteur calculée */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-7xl">
          {/* Titre compact */}
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sélectionnez votre profil</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Accédez à vos interfaces personnalisées</p>
          </div>

          {/* Alertes urgentes - bandeau compact */}
          <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-800">
                <span className="font-medium">5 urgences</span> en attente • 
                <span className="ml-1">28 patients</span> dans les files
              </span>
            </div>
            <button className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md hidden sm:block">
              Voir détails
            </button>
          </div>

          {/* Sélecteur de vue - Desktop uniquement */}
          <div className="hidden md:flex justify-end mb-4">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Grille des rôles - Responsive */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4' 
              : 'space-y-3'
            }
          `}>
            {roles.map((role) => (
              <div
                key={role.id}
                className={`
                  bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 
                  border-2 ${selectedRole === role.id ? 'border-blue-400' : 'border-transparent'}
                  ${viewMode === 'list' ? 'flex items-center p-4' : 'p-4 md:p-5'}
                `}
              >
                {viewMode === 'grid' ? (
                  // Vue grille compacte
                  <>
                    {/* En-tête avec icône et nom */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`h-12 w-12 md:h-14 md:w-14 rounded-lg bg-gradient-to-br ${role.gradient} p-2.5 text-white shadow-md`}>
                        {role.icon}
                      </div>
                      {role.notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {role.notifications}
                        </span>
                      )}
                    </div>

                    {/* Nom et description */}
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                      <span className="md:hidden">{role.shortName}</span>
                      <span className="hidden md:inline">{role.name}</span>
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5 mb-3">{role.mainInterface}</p>

                    {/* Stats compactes */}
                    <div className="grid grid-cols-3 gap-1 mb-3 text-center">
                      {Object.entries(role.stats).map(([key, value], idx) => (
                        <div key={idx} className={`${role.bgLight} ${role.borderLight} border rounded-md py-1`}>
                          <div className="text-lg md:text-xl font-bold">{value}</div>
                          <div className="text-xs text-gray-500">{key}</div>
                        </div>
                      ))}
                    </div>

                    {/* Bouton connexion */}
                    <button
                      onClick={() => handleRoleSelect(role.id)}
                      className={`w-full py-2 px-3 rounded-lg bg-gradient-to-r ${role.gradient} text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center`}
                    >
                      {selectedRole === role.id ? (
                        <>
                          <span className="animate-pulse">Connexion...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="h-4 w-4 mr-1.5" />
                          <span className="hidden sm:inline">Se connecter</span>
                          <span className="sm:hidden">Connexion</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  // Vue liste ultra-compacte
                  <>
                    <div className="flex items-center flex-1">
                      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${role.gradient} p-2.5 text-white shadow-md mr-4`}>
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{role.name}</h3>
                        <p className="text-sm text-gray-600">{role.mainInterface}</p>
                      </div>
                      <div className="hidden sm:flex items-center space-x-4 mx-6">
                        {Object.entries(role.stats).map(([key, value], idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-lg font-bold">{value}</div>
                            <div className="text-xs text-gray-500">{key}</div>
                          </div>
                        ))}
                      </div>
                      {role.notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-4">
                          {role.notifications}
                        </span>
                      )}
                      <button
                        onClick={() => handleRoleSelect(role.id)}
                        className={`py-2 px-4 rounded-lg bg-gradient-to-r ${role.gradient} text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Actions rapides - Version compacte mobile/desktop */}
          <div className="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <button className="p-2.5 md:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center space-x-2 border border-gray-200">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-xs md:text-sm font-medium">Urgences</span>
            </button>
            <button className="p-2.5 md:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center space-x-2 border border-gray-200">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-xs md:text-sm font-medium">Files</span>
            </button>
            <button className="p-2.5 md:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center space-x-2 border border-gray-200">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-xs md:text-sm font-medium">Monitoring</span>
            </button>
            <button className="p-2.5 md:p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center space-x-2 border border-gray-200">
              <Building className="h-4 w-4 text-purple-500" />
              <span className="text-xs md:text-sm font-medium">Centres</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer ultra compact */}
      <footer className="bg-white border-t border-gray-200 py-2 md:py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            © 2025 EAGLE Healthcare • 
            <a href="#" className="ml-1 hover:text-gray-700">Support</a> • 
            <a href="#" className="ml-1 hover:text-gray-700">Aide</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RoleSelector;