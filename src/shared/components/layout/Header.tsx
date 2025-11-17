import React from 'react';
import { Bell, Building, MapPin, Sun, Moon, Wifi, WifiOff, Zap } from 'lucide-react';
import { SearchInput } from '@forms/SearchInput';
import { BackToHome } from '@buttons/BackToHome';

interface HeaderProps {
  title: string;
  subtitle?: string;
  centerInfo?: {
    name: string;
    code: string;
    type: string;
  };
  isOnline?: boolean;
  bandwidth?: number;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: {
    initials: string;
    name: string;
  };
  notificationCount?: number;
  extraHeaderItems?: React.ReactNode;
  showBackToHome?: boolean; // Nouvelle prop pour contrôler l'affichage
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  centerInfo,
  isOnline = true,
  bandwidth,
  darkMode,
  toggleDarkMode,
  user,
  notificationCount = 0,
  extraHeaderItems,
  showBackToHome = true // Par défaut, on affiche le bouton
}) => {
  return (
    <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm px-3 py-2 flex items-center justify-between`}>
      <div className="flex items-center">
        <div>
          <h1 className="text-lg font-bold">{title}</h1>
          <div className="flex items-center text-xs">
            {centerInfo ? (
              <>
                <MapPin size={12} className="text-blue-600 mr-1" />
                <span className="text-gray-500 mr-2">{centerInfo.name}</span>
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-sm text-xs">{centerInfo.code}</span>
                {centerInfo.type && (
                  <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-800 rounded-sm text-xs">{centerInfo.type}</span>
                )}
              </>
            ) : subtitle ? (
              <>
                <Building size={12} className="text-blue-600 mr-1" />
                <span className="text-gray-500">{subtitle}</span>
              </>
            ) : null}
          </div>
        </div>
        
        {isOnline !== undefined && (
          <div className="ml-6 flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full flex items-center text-xs ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isOnline ? (
                <>
                  <Wifi size={12} className="mr-1" /> Connecté
                </>
              ) : (
                <>
                  <WifiOff size={12} className="mr-1" /> Hors ligne
                </>
              )}
            </span>
            
            {bandwidth && isOnline && (
              <div className="text-xs flex items-center bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                <Zap size={12} className="mr-1 text-green-600" /> {bandwidth} Mbps
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
                       
        {/* Items supplémentaires (boutons existants des interfaces) */}
        {extraHeaderItems && (
          <div className="flex items-center space-x-1">
            {extraHeaderItems}
          </div>
        )}
        
        {/* Bouton mode sombre/clair */}
        <button 
          onClick={toggleDarkMode} 
          className={`p-1.5 rounded-full transition-colors ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title={darkMode ? "Mode clair" : "Mode sombre"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* Notifications */}
        <button className={`p-1.5 rounded-full relative transition-colors ${
          darkMode 
            ? 'text-gray-300 hover:bg-gray-700' 
            : 'text-gray-500 hover:bg-gray-100'
        }`}>
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>
        
        {/* Informations utilisateur - masquées sur mobile car remplacées par BackToHome */}
                
        {/* Composant BackToHome responsive */}
        {showBackToHome && (
          <div className="flex items-center">
            <BackToHome darkMode={darkMode} />
          </div>
        )}
      </div>
    </header>
  );
};