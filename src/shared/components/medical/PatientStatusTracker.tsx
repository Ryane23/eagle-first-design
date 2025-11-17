import React from 'react';
import { Clock, Activity, CheckCircle, X, User, FileText, Video } from 'lucide-react';

type PatientStatus = 
  'waiting' | 
  'preparation' | 
  'consultation' | 
  'completed' | 
  'cancelled' | 
  'no_show';

interface PatientStatusTrackerProps {
  status: PatientStatus;
  patientName: string;
  waitTime?: number; // in minutes
  doctorName?: string;
  startTime?: string;
  endTime?: string;
  showDetails?: boolean;
  showActions?: boolean;
  onStatusChange?: (newStatus: PatientStatus) => void;
}

const PatientStatusTracker: React.FC<PatientStatusTrackerProps> = ({
  status,
  patientName,
  waitTime,
  doctorName,
  startTime,
  endTime,
  showDetails = true,
  showActions = false,
  onStatusChange
}) => {
  // Déterminer les couleurs et l'icône en fonction du statut
  const getStatusInfo = () => {
    switch (status) {
      case 'waiting':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          label: 'En attente',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'preparation':
        return {
          icon: <Activity className="h-5 w-5 text-blue-500" />,
          label: 'En préparation',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'consultation':
        return {
          icon: <Video className="h-5 w-5 text-purple-500" />,
          label: 'En consultation',
          color: 'bg-purple-100 text-purple-800'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: 'Terminé',
          color: 'bg-green-100 text-green-800'
        };
      case 'cancelled':
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          label: 'Annulé',
          color: 'bg-red-100 text-red-800'
        };
      case 'no_show':
        return {
          icon: <User className="h-5 w-5 text-gray-500" />,
          label: 'Non présenté',
          color: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          icon: <Clock className="h-5 w-5 text-gray-500" />,
          label: 'Statut inconnu',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };
  
  // Récupérer les informations de statut
  const statusInfo = getStatusInfo();
  
  // Obtenir les actions disponibles en fonction du statut actuel
  const getAvailableActions = () => {
    switch (status) {
      case 'waiting':
        return [
          { label: 'Préparer', newStatus: 'preparation' as PatientStatus, color: 'bg-blue-600 text-white' },
          { label: 'Annuler', newStatus: 'cancelled' as PatientStatus, color: 'bg-red-100 text-red-800' }
        ];
      case 'preparation':
        return [
          { label: 'Démarrer consultation', newStatus: 'consultation' as PatientStatus, color: 'bg-purple-600 text-white' },
          { label: 'Retour en attente', newStatus: 'waiting' as PatientStatus, color: 'bg-yellow-100 text-yellow-800' }
        ];
      case 'consultation':
        return [
          { label: 'Terminer', newStatus: 'completed' as PatientStatus, color: 'bg-green-600 text-white' }
        ];
      default:
        return [];
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* En-tête avec le statut actuel */}
      <div className={`p-3 ${statusInfo.color}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {statusInfo.icon}
            <span className="ml-2 font-medium">{statusInfo.label}</span>
          </div>
          {waitTime !== undefined && status === 'waiting' && (
            <div className="text-sm font-medium">
              {waitTime} min d'attente
            </div>
          )}
        </div>
      </div>
      
      {/* Détails du patient */}
      <div className="p-3">
        <div className="font-medium">{patientName}</div>
        
        {showDetails && (
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            {doctorName && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{doctorName}</span>
              </div>
            )}
            
            {startTime && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Début: {startTime}{endTime ? ` - Fin: ${endTime}` : ''}</span>
              </div>
            )}
            
            {status === 'completed' && (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>Consultation terminée</span>
              </div>
            )}
          </div>
        )}
        
        {/* Actions disponibles */}
        {showActions && onStatusChange && (
          <div className="mt-3 flex flex-wrap gap-2">
            {getAvailableActions().map((action, index) => (
              <button
                key={index}
                className={`px-3 py-1 text-xs rounded-md ${action.color}`}
                onClick={() => onStatusChange(action.newStatus)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientStatusTracker;