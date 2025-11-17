import React, { useState } from 'react';
import { Monitor, Link, Link2, Wifi, Camera, Mic, MoreVertical } from 'lucide-react';

interface ConsultationRoom {
  id: number;
  name: string;
  equipment?: string;
  doctor?: string;
  specialty?: string;
  active: boolean;
  inConsultation: boolean;
}

interface ConsultationRoomsProps {
  rooms: ConsultationRoom[];
  onRoomClick?: (room: ConsultationRoom) => void;
  onAssignDoctor?: (room: ConsultationRoom, doctor: string, specialty: string) => void;
  onStartConsultation?: (room: ConsultationRoom) => void;
  onEndConsultation?: (room: ConsultationRoom) => void;
  onToggleActive?: (room: ConsultationRoom) => void;
  specializationOptions?: {
    doctors: {
      id: number;
      name: string;
      specialty: string;
    }[];
    specialties: string[];
  };
  darkMode?: boolean;
}

export const ConsultationRooms: React.FC<ConsultationRoomsProps> = ({
  rooms,
  onRoomClick,
  onAssignDoctor,
  onStartConsultation,
  onEndConsultation,
  onToggleActive,
  specializationOptions,
  darkMode = false
}) => {
  const [selectedRoom, setSelectedRoom] = useState<ConsultationRoom | null>(null);
  const [assignationMode, setAssignationMode] = useState(false);
  
  const handleRoomClick = (room: ConsultationRoom) => {
    if (onRoomClick) {
      onRoomClick(room);
    }
  };
  
  const handleAssignDoctor = (room: ConsultationRoom, doctor: string, specialty: string) => {
    if (onAssignDoctor) {
      onAssignDoctor(room, doctor, specialty);
    }
    setAssignationMode(false);
    setSelectedRoom(null);
  };
  
  const startAssignation = (room: ConsultationRoom) => {
    setSelectedRoom(room);
    setAssignationMode(true);
  };
  
  return (
    <div>
      <h3 className="text-base font-medium flex items-center mb-3">
        <Monitor className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
        Gestion des salles
      </h3>
      
      {assignationMode && selectedRoom && specializationOptions ? (
        <div className="mb-3 space-y-2">
          <div className={`p-2 rounded-lg border ${
            darkMode ? 'border-blue-700 bg-blue-900 bg-opacity-20' : 'border-blue-200 bg-blue-50'
          }`}>
            <div className="font-medium mb-1 text-sm">Assignation pour {selectedRoom.name}</div>
            <div className="space-y-2">
              {specializationOptions.specialties.map((specialty) => {
                const doctorsInSpecialty = specializationOptions.doctors.filter(d => d.specialty === specialty);
                
                return doctorsInSpecialty.length > 0 ? (
                  <div key={specialty}>
                    <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {specialty}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {doctorsInSpecialty.map(doctor => (
                        <button 
                          key={doctor.id} 
                          className={`py-1 px-2 text-left text-xs rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                          onClick={() => handleAssignDoctor(selectedRoom, doctor.name, specialty)}
                        >
                          {doctor.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
            <button 
              className={`w-full mt-2 py-1 px-2 text-xs rounded-md ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
              onClick={() => {
                setAssignationMode(false);
                setSelectedRoom(null);
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {rooms.map(room => (
            <div 
              key={room.id}
              className={`p-2 rounded-lg border ${
                room.active 
                  ? room.inConsultation
                    ? (darkMode ? 'border-yellow-700 bg-yellow-900 bg-opacity-20' : 'border-yellow-200 bg-yellow-50')
                    : (darkMode ? 'border-green-700 bg-green-900 bg-opacity-20' : 'border-green-200 bg-green-50')
                  : (darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50')
              } cursor-pointer`}
              onClick={() => handleRoomClick(room)}
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-medium text-sm flex items-center">
                    {room.name}
                    <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                      room.active 
                        ? room.inConsultation
                          ? (darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800')
                          : (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                        : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                    }`}>
                      {room.active 
                        ? room.inConsultation 
                          ? 'En consultation' 
                          : 'Disponible'
                        : 'Inactif'
                      }
                    </span>
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {room.doctor 
                      ? `${room.doctor}${room.specialty ? ` (${room.specialty})` : ''}`
                      : "Non assigné"
                    }
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <button 
                    className={`p-1 rounded-lg ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      startAssignation(room);
                    }}
                    title="Assigner un médecin à cette salle"
                  >
                    <Link2 className="h-3 w-3" />
                  </button>
                  
                  <button 
                    className={`p-1 rounded-lg ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleActive) {
                        onToggleActive(room);
                      }
                    }}
                    title={room.active ? "Désactiver cette salle" : "Activer cette salle"}
                  >
                    <MoreVertical className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 mt-1">
                <div className={`p-1 rounded-full ${
                  room.active 
                    ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                }`}>
                  <Wifi className="h-2 w-2" />
                </div>
                <div className={`p-1 rounded-full ${
                  room.active 
                    ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                }`}>
                  <Camera className="h-2 w-2" />
                </div>
                <div className={`p-1 rounded-full ${
                  room.active 
                    ? (darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800')
                    : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')
                }`}>
                  <Mic className="h-2 w-2" />
                </div>
                
                {room.equipment && (
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>
                    {room.equipment}
                  </div>
                )}
              </div>
              
              {room.active && (
                <div className="mt-2 flex space-x-1">
                  {room.inConsultation ? (
                    <button 
                      className={`w-full py-1 text-xs rounded-md flex items-center justify-center ${
                        darkMode 
                          ? 'bg-red-900 text-red-300 hover:bg-red-800' 
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onEndConsultation) {
                          onEndConsultation(room);
                        }
                      }}
                    >
                      Terminer
                    </button>
                  ) : (
                    <button 
                      className={`w-full py-1 text-xs rounded-md flex items-center justify-center ${
                        room.doctor
                          ? (darkMode 
                              ? 'bg-green-900 text-green-300 hover:bg-green-800' 
                              : 'bg-green-600 text-white hover:bg-green-700')
                          : (darkMode 
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                      }`}
                      disabled={!room.doctor}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (room.doctor && onStartConsultation) {
                          onStartConsultation(room);
                        }
                      }}
                    >
                      Démarrer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};