import React from 'react';
import { Video, Clock, Phone, Eye, PauseCircle, X } from 'lucide-react';

interface ActiveConsultation {
  id: number;
  patient: string;
  doctor: string;
  room: string;
  startTime: string;
  duration: number; // en minutes
  isPaused?: boolean;
}

interface ActiveConsultationsProps {
  consultations: ActiveConsultation[];
  onEndConsultation?: (consultationId: number) => void;
  onPauseConsultation?: (consultationId: number) => void;
  onResumeConsultation?: (consultationId: number) => void;
  onViewDetails?: (consultationId: number) => void;
  compact?: boolean;
  darkMode?: boolean;
}

export const ActiveConsultations: React.FC<ActiveConsultationsProps> = ({
  consultations,
  onEndConsultation,
  onPauseConsultation,
  onResumeConsultation,
  onViewDetails,
  compact = false,
  darkMode = false
}) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins.toString().padStart(2, '0')}m`;
    }
    
    return `${mins} min`;
  };
  
  // Version compacte pour les tableaux de bord
  if (compact) {
    return (
      <div className={`rounded-lg p-3 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-2">
          <Video className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
          <h3 className="font-medium">Consultations actives</h3>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
          }`}>{consultations.length}</span>
        </div>
        
        {consultations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {consultations.map(consultation => (
              <div 
                key={consultation.id} 
                className={`p-2 rounded-lg border ${
                  consultation.isPaused
                    ? (darkMode ? 'border-yellow-700 bg-yellow-900 bg-opacity-20' : 'border-yellow-200 bg-yellow-50')
                    : (darkMode ? 'border-blue-700 bg-blue-900 bg-opacity-20' : 'border-blue-200 bg-blue-50')
                }`}
              >
                <div className="font-medium text-sm">{consultation.patient}</div>
                <div className="flex justify-between items-center text-xs">
                  <span>{consultation.room} • {consultation.doctor}</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {consultation.startTime} ({formatDuration(consultation.duration)})
                  </span>
                </div>
                
                {consultation.isPaused && (
                  <div className={`text-xs mt-1 ${
                    darkMode ? 'text-yellow-400' : 'text-yellow-700'
                  }`}>
                    <PauseCircle className="h-3 w-3 inline mr-1" />
                    En pause
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Aucune consultation en cours
          </div>
        )}
      </div>
    );
  }
  
  // Version complète
  return (
    <div className={`rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
      <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Video className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
            <h3 className="font-medium">Consultations actives</h3>
            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}>{consultations.length}</span>
          </div>
        </div>
      </div>
      
      {consultations.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {consultations.map(consultation => (
            <div 
              key={consultation.id} 
              className={`p-4 ${
                consultation.isPaused
                  ? (darkMode ? 'bg-yellow-900 bg-opacity-10' : 'bg-yellow-50')
                  : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{consultation.patient}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {consultation.doctor} • {consultation.room}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button 
                    className={`p-2 rounded-full ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => onViewDetails && onViewDetails(consultation.id)}
                    title="Voir les détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  {consultation.isPaused ? (
                    <button 
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                      }`}
                      onClick={() => onResumeConsultation && onResumeConsultation(consultation.id)}
                      title="Reprendre la consultation"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                  ) : (
                    <button 
                      className={`p-2 rounded-full ${
                        darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                      }`}
                      onClick={() => onPauseConsultation && onPauseConsultation(consultation.id)}
                      title="Mettre en pause"
                    >
                      <PauseCircle className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button 
                    className={`p-2 rounded-full ${
                      darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
                    }`}
                    onClick={() => onEndConsultation && onEndConsultation(consultation.id)}
                    title="Terminer la consultation"
                  >
                    <Phone className="h-4 w-4 transform rotate-135" />
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex items-center">
                <div className={`px-2 py-1 rounded-full text-xs flex items-center ${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Clock className="h-3 w-3 mr-1" />
                  Début: {consultation.startTime}
                </div>
                <div className={`ml-2 px-2 py-1 rounded-full text-xs flex items-center ${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}>
                  Durée: {formatDuration(consultation.duration)}
                </div>
                {consultation.isPaused && (
                  <div className={`ml-2 px-2 py-1 rounded-full text-xs flex items-center ${
                    darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <PauseCircle className="h-3 w-3 mr-1" />
                    En pause
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <Video className={`h-10 w-10 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Aucune consultation active pour le moment
          </p>
        </div>
      )}
    </div>
  );
};