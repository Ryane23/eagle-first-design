import React from 'react';
import { Grid, List, Calendar, Columns, Maximize, Minimize } from 'lucide-react';

type ViewMode = 'grid' | 'list' | 'calendar' | 'columns' | 'compact' | 'detailed';

interface ViewSelectorProps {
  currentView: ViewMode;
  onChange: (view: ViewMode) => void;
  availableViews?: ViewMode[];
  density?: 'compact' | 'normal' | 'comfortable';
  onDensityChange?: (density: 'compact' | 'normal' | 'comfortable') => void;
  darkMode?: boolean;
  className?: string;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onChange,
  availableViews = ['grid', 'list', 'calendar'],
  density,
  onDensityChange,
  darkMode = false,
  className = ''
}) => {
  const getViewIcon = (view: ViewMode) => {
    switch (view) {
      case 'grid': return <Grid className="h-4 w-4" />;
      case 'list': return <List className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      case 'columns': return <Columns className="h-4 w-4" />;
      case 'compact': return <Minimize className="h-4 w-4" />;
      case 'detailed': return <Maximize className="h-4 w-4" />;
      default: return <Grid className="h-4 w-4" />;
    }
  };
  
  const getViewLabel = (view: ViewMode) => {
    switch (view) {
      case 'grid': return 'Grille';
      case 'list': return 'Liste';
      case 'calendar': return 'Calendrier';
      case 'columns': return 'Colonnes';
      case 'compact': return 'Compact';
      case 'detailed': return 'Détaillé';
      default: return view;
    }
  };
  
  const getDensityIcon = (densityValue: 'compact' | 'normal' | 'comfortable') => {
    switch (densityValue) {
      case 'compact': return <Minimize className="h-4 w-4" />;
      case 'comfortable': return <Maximize className="h-4 w-4" />;
      default: return <Columns className="h-4 w-4" />;
    }
  };
  
  const getDensityLabel = (densityValue: 'compact' | 'normal' | 'comfortable') => {
    switch (densityValue) {
      case 'compact': return 'Compact';
      case 'comfortable': return 'Confortable';
      default: return 'Normal';
    }
  };
  
  return (
    <div className={`inline-flex items-center rounded-lg overflow-hidden ${className}`}>
      {/* Sélecteur de vue */}
      <div className="flex rounded-lg overflow-hidden">
        {availableViews.map(view => (
          <button 
            key={view}
            className={`p-2 flex items-center ${
              currentView === view
                ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
            onClick={() => onChange(view)}
            title={getViewLabel(view)}
          >
            {getViewIcon(view)}
            <span className="ml-1 text-xs hidden sm:inline">{getViewLabel(view)}</span>
          </button>
        ))}
      </div>
      
      {/* Sélecteur de densité si activé */}
      {density && onDensityChange && (
        <div className="flex ml-2 rounded-lg overflow-hidden">
          {(['compact', 'normal', 'comfortable'] as const).map(densityValue => (
            <button 
              key={densityValue}
              className={`p-2 flex items-center ${
                density === densityValue
                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                  : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
              }`}
              onClick={() => onDensityChange(densityValue)}
              title={getDensityLabel(densityValue)}
            >
              {getDensityIcon(densityValue)}
              <span className="ml-1 text-xs hidden lg:inline">{getDensityLabel(densityValue)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};