import React from 'react';
import { Building, Eye, MessageCircle, MoreVertical, Wifi, WifiOff, Clock } from 'lucide-react';
import { StatusBadge } from '@data-display/StatusBadge';

interface CenterCardProps {
  center: {
    id: number;
    name: string;
    code: string;
    type: string;
    status: 'online' | 'offline';
    bandwidth?: number;
    waitingPatients: number;
    consultants: number;
    alertLevel: 'normal' | 'warning' | 'issue';
    lastUpdated?: string;
  };
  darkMode?: boolean;
  onViewDetails?: () => void;
  onOpenChat?: () => void;
  onMoreOptions?: () => void;
}

export const CenterCard: React.FC<CenterCardProps> = ({
  center,
  darkMode = false,
  onViewDetails,
  onOpenChat,
  onMoreOptions
}) => {
  const getAlertLevelText = (level: string) => {
    const texts = {
      "normal": "Normal",
      "warning": "Attention",
      "issue": "Problème"
    };
    return texts[level as keyof typeof texts] || level;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-sm flex items-center">
            <Building size={14} className="mr-1 text-blue-600" />
            {center.name}
          </h3>
          <div className="flex items-center mt-0.5">
            <span className="text-xs text-gray-500 mr-1">{center.code}</span>
            <StatusBadge 
              type={center.alertLevel}
              label={getAlertLevelText(center.alertLevel)}
            />
          </div>
        </div>
        <div className="flex items-center">
          <StatusBadge 
            type={center.status}
            icon={center.status === 'online' ? <Wifi size={10} /> : <WifiOff size={10} />}
          />
          {center.status === 'online' && center.bandwidth && (
            <span className="ml-1 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-full">
              {center.bandwidth} Mbps
            </span>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-1 mb-2">
        <div className="p-2 rounded bg-gray-100 text-center relative">
          <div className="text-xs text-gray-500">Patients en attente</div>
          <div className="font-bold mt-0.5">
            {center.waitingPatients}
          </div>
          {center.waitingPatients > 10 && (
            <span className="absolute top-0 right-0 text-xs bg-red-500 text-white px-1 rounded-bl rounded-tr-lg">
              !
            </span>
          )}
        </div>
        <div className="p-2 rounded bg-gray-100 text-center">
          <div className="text-xs text-gray-500">Consultants actifs</div>
          <div className="font-bold mt-0.5">{center.consultants}</div>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 mt-2 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-0.5" />
          {center.lastUpdated ? `Mise à jour: ${center.lastUpdated}` : 'À l\'instant'}
        </div>
        <div className="flex space-x-1">
          <button 
            className="p-1 rounded bg-blue-100 text-blue-800 text-xs"
            onClick={onViewDetails}
          >
            <Eye size={12} />
          </button>
          <button 
            className="p-1 rounded bg-purple-100 text-purple-800 text-xs"
            onClick={onOpenChat}
          >
            <MessageCircle size={12} />
          </button>
          <button 
            className="p-1 rounded bg-gray-100 text-gray-800 text-xs"
            onClick={onMoreOptions}
          >
            <MoreVertical size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};