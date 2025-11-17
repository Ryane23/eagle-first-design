import React, { useState } from 'react';
import { AlertTriangle, Edit, Calendar, CheckCircle, X, ArrowRight } from 'lucide-react';

interface ScheduleConflict {
  id: number;
  consultants: string[];
  day: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  status: 'nouveau' | 'en_cours' | 'résolu';
  details?: string;
}

interface ConflictManagerProps {
  conflicts: ScheduleConflict[];
  onResolveConflict?: (conflictId: number) => void;
  onReschedule?: (conflictId: number) => void;
  onEditConflict?: (conflictId: number) => void;
  onIgnoreConflict?: (conflictId: number) => void;
  onViewDetails?: (conflictId: number) => void;
  filterByStatus?: string;
  onFilterChange?: (status: string) => void;
  onAutoResolve?: () => void;
  darkMode?: boolean;
}

export const ConflictManager: React.FC<ConflictManagerProps> = ({
  conflicts,
  onResolveConflict,
  onReschedule,
  onEditConflict,
  onIgnoreConflict,
  onViewDetails,
  filterByStatus = 'all',
  onFilterChange,
  onAutoResolve,
  darkMode = false
}) => {
  const [selectedConflict, setSelectedConflict] = useState<ScheduleConflict | null>(null);
  
  const filteredConflicts = filterByStatus === 'all' 
    ? conflicts 
    : conflicts.filter(conflict => conflict.status === filterByStatus);
  
  // Classes de couleur en fonction de la sévérité
  const getConflictSeverityClass = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': 
        return darkMode 
          ? 'bg-red-900 text-red-300 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-300';
      case 'medium': 
        return darkMode 
          ? 'bg-orange-900 text-orange-300 border-orange-700' 
          : 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low': 
        return darkMode 
          ? 'bg-yellow-900 text-yellow-300 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: 
        return darkMode 
          ? 'bg-gray-700 text-gray-300 border-gray-600' 
          : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Icône en fonction de la sévérité
  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    return <AlertTriangle className={`h-4 w-4 ${
      severity === 'high' ? 'text-red-600' : 
      severity === 'medium' ? 'text-orange-600' : 
      'text-yellow-600'
    }`} />;
  };
  
  // Statut formaté
  const getStatusText = (status: string) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'résolu': return 'Résolu';
      default: return status;
    }
  };
  
  // Classe de couleur en fonction du statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'nouveau': 
        return darkMode 
          ? 'bg-red-900 text-red-300' 
          : 'bg-red-100 text-red-800';
      case 'en_cours': 
        return darkMode 
          ? 'bg-yellow-900 text-yellow-300' 
          : 'bg-yellow-100 text-yellow-800';
      case 'résolu': 
        return darkMode 
          ? 'bg-green-900 text-green-300' 
          : 'bg-green-100 text-green-800';
      default: 
        return darkMode 
          ? 'bg-gray-700 text-gray-300' 
          : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
      <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className={`h-5 w-5 ${darkMode ? 'text-red-400' : 'text-red-600'} mr-2`} />
            <h3 className="font-medium">Conflits de Planning Détectés</h3>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'
            }`}>{conflicts.length}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {onFilterChange && (
              <select
                className={`text-xs p-1 ${
                  darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200'
                } rounded border`}
                value={filterByStatus}
                onChange={(e) => onFilterChange(e.target.value)}
              >
                <option value="all">Tous les conflits</option>
                <option value="nouveau">Conflits non résolus</option>
                <option value="résolu">Conflits résolus</option>
              </select>
            )}
            
            {onAutoResolve && (
              <button 
                className={`text-xs px-2 py-1 ${
                  darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                } rounded flex items-center`}
                onClick={onAutoResolve}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Résolution auto
              </button>
            )}
          </div>
        </div>
      </div>
      
      {filteredConflicts.length > 0 ? (
        <div className="p-3 space-y-2">
          {filteredConflicts.map(conflict => (
            <div 
              key={conflict.id} 
              className={`p-3 rounded-md border ${getConflictSeverityClass(conflict.severity)} ${
                conflict.status === 'résolu' ? 'opacity-60' : ''
              }`}
              onClick={() => setSelectedConflict(conflict)}
            >
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium text-sm flex items-center">
                    {getSeverityIcon(conflict.severity)}
                    <span className="ml-1">Conflit: {conflict.day}</span>
                  </h4>
                  <p className="text-xs mt-1">{conflict.reason}</p>
                </div>
                <div className="text-xs">
                  <span className={`px-1.5 py-0.5 rounded-full ${getStatusClass(conflict.status)}`}>
                    {getStatusText(conflict.status)}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 flex items-center">
                <div className="flex space-x-1">
                  {conflict.consultants.map((name, idx) => (
                    <div key={idx} className={`flex items-center ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                    } rounded px-1.5 py-0.5 text-xs`}>
                      {name}
                    </div>
                  ))}
                </div>
                
                <div className="ml-auto flex space-x-1">
                  {conflict.status !== 'résolu' ? (
                    <>
                      {onReschedule && (
                        <button 
                          className={`px-2 py-0.5 ${
                            darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                          } rounded text-xs flex items-center`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReschedule(conflict.id);
                          }}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Reprogrammer
                        </button>
                      )}
                      
                      {onEditConflict && (
                        <button 
                          className={`px-2 py-0.5 ${
                            darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                          } rounded text-xs flex items-center`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditConflict(conflict.id);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Modifier
                        </button>
                      )}
                      
                      {onResolveConflict && (
                        <button 
                          className={`px-2 py-0.5 ${
                            darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                          } rounded text-xs flex items-center`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onResolveConflict(conflict.id);
                          }}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Résoudre
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {onViewDetails && (
                        <button 
                          className={`px-2 py-0.5 ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
                          } rounded text-xs flex items-center`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(conflict.id);
                          }}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Détails
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-gray-500">
          <CheckCircle className={`mb-2 ${
            darkMode ? 'text-green-400 h-8 w-8' : 'text-green-500 h-10 w-10'
          }`} />
          <p className="text-sm font-medium">Aucun conflit détecté</p>
          <p className="text-xs mt-1">Le planning actuel est optimal</p>
        </div>
      )}
      
      {/* Détails du conflit sélectionné - à implémenter selon les besoins */}
      {selectedConflict && onViewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`max-w-md rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Détails du conflit</h3>
              <button onClick={() => setSelectedConflict(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className={`p-3 rounded-md border ${getConflictSeverityClass(selectedConflict.severity)} mb-4`}>
              <div className="flex items-center">
                {getSeverityIcon(selectedConflict.severity)}
                <span className="ml-1 font-medium">{selectedConflict.day}</span>
              </div>
              <p className="mt-1">{selectedConflict.reason}</p>
              <div className="mt-2 font-medium">Consultants concernés :</div>
              <ul className="list-disc list-inside">
                {selectedConflict.consultants.map((name, idx) => (
                  <li key={idx} className="text-sm">{name}</li>
                ))}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className={`px-3 py-1.5 rounded-md ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
                }`}
                onClick={() => setSelectedConflict(null)}
              >
                Fermer
              </button>
              
              {selectedConflict.status !== 'résolu' && onResolveConflict && (
                <button 
                  className={`px-3 py-1.5 rounded-md ${
                    darkMode ? 'bg-green-700 text-white' : 'bg-green-600 text-white'
                  }`}
                  onClick={() => {
                    onResolveConflict(selectedConflict.id);
                    setSelectedConflict(null);
                  }}
                >
                  Marquer comme résolu
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};