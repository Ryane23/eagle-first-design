// src/shared/components/BackToHome.tsx
import React, { useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronDown, User, LogOut } from 'lucide-react';

interface BackToHomeProps {
  darkMode?: boolean;
  className?: string;
  variant?: 'icon-only' | 'compact' | 'full' | 'dropdown' | 'auto';
  position?: 'header' | 'sidebar' | 'floating';
}

export const BackToHome: React.FC<BackToHomeProps> = ({ 
  darkMode = false,
  className = "",
  variant = 'auto',
  position = 'header'
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBackHome = () => {
    logout();
    navigate('/');
  };

  const getRoleName = (role: string) => {
    const roles = {
      'admin': 'Administrateur',
      'doctor': 'Médecin',
      'nurse': 'Infirmier',
      'secretary_main': 'Secrétaire Principale',
      'secretary_secondary': 'Secrétaire Secondaire'
    };
    return roles[role as keyof typeof roles] || role;
  };

  if (!user) return null;

  // Version icône seulement (très petit écran)
  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleBackHome}
        className={`p-2 rounded-full transition-colors ${
          darkMode 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        } ${className}`}
        title="Changer de profil"
        aria-label="Changer de profil"
      >
        <Home size={16} />
      </button>
    );
  }

  // Version dropdown avec avatar (tablette/desktop)
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          } ${className}`}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {user.initials || user.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium truncate max-w-32">
              {user.name}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getRoleName(user.role)}
            </div>
          </div>
          <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showDropdown && (
          <>
            {/* Overlay pour fermer le dropdown */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Menu dropdown */}
            <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-20 ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}>
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.initials || user.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {getRoleName(user.role)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="py-1">
                <button
                  onClick={handleBackHome}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home size={16} className="mr-3" />
                  Changer de profil
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Version compacte (mobile/tablette)
  if (variant === 'compact') {
    return (
      <button
        onClick={handleBackHome}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
          darkMode 
            ? 'bg-gray-700 text-white hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        } ${className}`}
        title="Changer de profil"
      >
        <Home size={14} />
        <span className="hidden sm:inline">Changer profil</span>
      </button>
    );
  }

  // Version complète (desktop large)
  if (variant === 'full') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      } ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.initials || user.name?.charAt(0) || 'U'}
          </div>
          <div className="text-sm">
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {user.name}
            </div>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {getRoleName(user.role)}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleBackHome}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          title="Retour à l'accueil pour changer de profil"
        >
          <Home size={14} />
          <span>Changer profil</span>
        </button>
      </div>
    );
  }

  // Version automatique (responsive par défaut)
  return (
    <>
      {/* Mobile : Icône seulement */}
      <div className="block sm:hidden">
        <button
          onClick={handleBackHome}
          className={`p-2 rounded-full transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          } ${className}`}
          title="Changer de profil"
          aria-label="Changer de profil"
        >
          <Home size={16} />
        </button>
      </div>

      {/* Tablette : Compact avec texte */}
      <div className="hidden sm:block lg:hidden">
        <button
          onClick={handleBackHome}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          } ${className}`}
          title="Changer de profil"
        >
          <Home size={14} />
          <span>Profil</span>
        </button>
      </div>

      {/* Desktop : Dropdown avec avatar */}
      <div className="hidden lg:block">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            } ${className}`}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {user.initials || user.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium truncate max-w-32">
                {user.name}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {getRoleName(user.role)}
              </div>
            </div>
            <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowDropdown(false)}
              />
              
              <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg z-20 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user.initials || user.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {getRoleName(user.role)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleBackHome();
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Home size={16} className="mr-3" />
                    Changer de profil
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};