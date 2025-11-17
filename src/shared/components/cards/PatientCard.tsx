import React from 'react';
import { Edit, MoreVertical } from 'lucide-react';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';

interface PatientCardProps {
  patient: {
    id: number;
    name: string;
    age: number;
    gender: string;
    urgency: 1 | 2 | 3 | 4 | 5;
    specialty: string;
    center: string;
    waitTime: number;
    doctor: string;
    arrivalTime: string;
    notes?: string;
  };
  darkMode?: boolean;
  onSelect?: () => void;
  onAdjustUrgency?: () => void;
  onDoctorView?: () => void;
  onMoreOptions?: () => void;
  isDraggable?: boolean;
  onDragStart?: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  darkMode = false,
  onSelect,
  onAdjustUrgency,
  onDoctorView,
  onMoreOptions,
  isDraggable = false,
  onDragStart
}) => {
  return (
    <div 
      className={`p-2 rounded-md ${darkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} flex justify-between items-center cursor-pointer ${patient.urgency === 5 ? 'border-l-4 border-red-500 pl-1' : ''}`}
      onClick={onSelect}
      draggable={isDraggable ? "true" : undefined}
      onDragStart={onDragStart}
    >
      <div className="flex items-center">
        <UrgencyIndicator level={patient.urgency} />
        <div className="ml-2">
          <div className="font-medium text-sm">{patient.name}</div>
          <div className="text-xs text-gray-500">{patient.age} ans, {patient.gender} • {patient.center}</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-xs">
          {patient.waitTime} min
          <span className="ml-2 text-gray-500">{patient.arrivalTime}</span>
        </div>
        <div className="flex items-center mt-1">
          <button 
            className="text-xs mr-2 hover:underline cursor-pointer text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onDoctorView && onDoctorView();
            }}
          >
            {patient.doctor}
          </button>
          <button 
            className="p-0.5 text-blue-600 hover:text-blue-800 bg-blue-50 rounded"
            onClick={(e) => { 
              e.stopPropagation(); 
              onAdjustUrgency && onAdjustUrgency(); 
            }}
            title="Ajuster le niveau d'urgence"
          >
            <Edit size={12} />
          </button>
          <button 
            className="p-0.5 text-gray-500 hover:text-gray-700 bg-gray-100 rounded ml-1"
            onClick={(e) => { 
              e.stopPropagation();
              onMoreOptions && onMoreOptions();
            }}
            title="Plus d'options"
          >
            <MoreVertical size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};