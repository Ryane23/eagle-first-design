import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeSwitcherProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onChange?: (isDarkMode: boolean) => void;
  defaultDarkMode?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  size = 'medium',
  showLabel = false,
  onChange,
  defaultDarkMode = false
}) => {
  const [darkMode, setDarkMode] = useState(defaultDarkMode);
  
  useEffect(() => {
    // Vérifie si le thème sombre est déjà défini
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    
    // Applique le thème
    applyTheme(isDarkMode);
  }, []);
  
  const applyTheme = (isDark: boolean) => {
    // Ajoute ou supprime la classe 'dark' du document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyTheme(newDarkMode);
    
    if (onChange) {
      onChange(newDarkMode);
    }
  };
  
  // Classes de taille
  const sizeClasses = {
    'small': 'h-8 w-8',
    'medium': 'h-10 w-10',
    'large': 'h-12 w-12'
  }[size];
  
  const iconSizeClasses = {
    'small': 'h-4 w-4',
    'medium': 'h-5 w-5',
    'large': 'h-6 w-6'
  }[size];
  
  return (
    <div className="flex items-center">
      {showLabel && (
        <span className="mr-2 text-sm">
          {darkMode ? 'Mode sombre' : 'Mode clair'}
        </span>
      )}
      <button
        onClick={toggleTheme}
        className={`${sizeClasses} rounded-full flex items-center justify-center transition-colors ${
          darkMode 
            ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        aria-label={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
      >
        {darkMode ? <Sun className={iconSizeClasses} /> : <Moon className={iconSizeClasses} />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;