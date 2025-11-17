import React from 'react';
import { Edit, Calendar, MoreVertical } from 'lucide-react';

interface ConsultantCardProps {
  consultant: {
    id: number;
    name: string;
    specialty: string;
    avatar?: string;
    color: string;
    availability: number;
    patients: number;
    avgConsultation?: number;
    workDays?: number[];
  };
  darkMode?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onViewCalendar?: () => void;
  onMoreOptions?: () => void;
  layout?: 'list' | 'grid';
}

export const ConsultantCard: React.FC<ConsultantCardProps> = ({
  consultant,
  darkMode = false,
  isSelected = false,
  onSelect,
  onEdit,
  onViewCalendar,
  onMoreOptions,
  layout = 'list'
}) => {
  const getSpecialtyColor = (specialty: string) => {
    const colors = {
      "Cardiologie": "bg-blue-500",
      "Pédiatrie": "bg-green-500",
      "Dermatologie": "bg-purple-500",
      "Gynécologie": "bg-pink-500",
      "Neurologie": "bg-yellow-500",
      "Ophtalmologie": "bg-indigo-500"
    };
    return colors[specialty as keyof typeof colors] || "bg-gray-500";
  };

  if (layout === 'list') {
    return (
      <div 
        className={`p-2 rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        onClick={onSelect}
      >
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full ${consultant.color} flex items-center justify-center text-white text-sm mr-3`}>
            {consultant.avatar || consultant.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="font-medium">{consultant.name}</div>
            <div className="text-xs text-gray-500 flex items-center">
              <div className={`w-2 h-2 rounded-full ${getSpecialtyColor(consultant.specialty)} mr-1`}></div>
              {consultant.specialty}
            </div>
            <div className="mt-1 flex items-center space-x-3 text-xs text-gray-600">
              <span>{consultant.patients} patients</span>
              <span>{consultant.availability}% disponible</span>
              {consultant.avgConsultation && <span>~{consultant.avgConsultation} min/consult</span>}
            </div>
          </div>
          <div className="flex space-x-1">
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit();
              }}
            >
              <Edit size={14} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onViewCalendar && onViewCalendar();
              }}
            >
              <Calendar size={14} />
            </button>
            <button 
              className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onMoreOptions && onMoreOptions();
              }}
            >
              <MoreVertical size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div 
      className={`p-2 rounded-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${consultant.color} flex items-center justify-center text-white text-sm mr-3`}>
          {consultant.avatar || consultant.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-medium">{consultant.name}</div>
          <div className="text-xs text-gray-500 flex items-center">
            <div className={`w-2 h-2 rounded-full ${getSpecialtyColor(consultant.specialty)} mr-1`}></div>
            {consultant.specialty}
          </div>
        </div>
        <div className="ml-auto">
          <button 
            className="p-1 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit();
            }}
          >
            <Edit size={14} />
          </button>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200 text-xs grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <Clock size={12} className="text-gray-500 mr-1" />
          <span>{consultant.availability}% Disponible</span>
        </div>
        <div className="flex items-center">
          <Users size={12} className="text-gray-500 mr-1" />
          <span>{consultant.patients} Patients</span>
        </div>
        {consultant.avgConsultation && (
          <div className="flex items-center">
            <Video size={12} className="text-gray-500 mr-1" />
            <span>~{consultant.avgConsultation} min/consult.</span>
          </div>
        )}
        {consultant.workDays && (
          <div className="flex items-center">
            <Calendar size={12} className="text-gray-500 mr-1" />
            <span>{consultant.workDays.length} jours/semaine</span>
          </div>
        )}
      </div>
    </div>
  );
};