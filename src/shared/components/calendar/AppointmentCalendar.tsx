import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Grid, List } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  specialty: string;
  date: string; // format ISO "YYYY-MM-DD"
  time: string; // format "HH:MM"
  duration: number; // en minutes
  urgencyLevel?: number;
  type?: string;
  notes?: string;
  confirmed?: boolean;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  timeSlots: string[]; // format "HH:MM"
  onTimeSlotClick?: (date: Date, time: string, doctor?: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onDateChange?: (date: Date) => void;
  selectedDate: Date;
  currentView: 'day' | 'week' | 'month' | 'year';
  onViewChange?: (view: 'day' | 'week' | 'month' | 'year') => void;
  doctors?: {
    id: number;
    name: string;
    specialty: string;
    color: string;
  }[];
  excludeWeekends?: boolean;
  darkMode?: boolean;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  timeSlots,
  onTimeSlotClick,
  onAppointmentClick,
  onDateChange,
  selectedDate,
  currentView,
  onViewChange,
  doctors = [],
  excludeWeekends = false,
  darkMode = false
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Navigation du calendrier
  const navigateCalendar = (direction: number) => {
    const newDate = new Date(selectedDate);
    
    if (currentView === 'day') {
      newDate.setDate(selectedDate.getDate() + direction);
    } else if (currentView === 'week') {
      newDate.setDate(selectedDate.getDate() + direction * 7);
    } else if (currentView === 'month') {
      newDate.setMonth(selectedDate.getMonth() + direction);
    } else if (currentView === 'year') {
      newDate.setFullYear(selectedDate.getFullYear() + direction);
    }
    
    if (onDateChange) {
      onDateChange(newDate);
    }
  };
  
  const goToToday = () => {
    if (onDateChange) {
      onDateChange(new Date());
    }
  };
  
  // Formatage de la date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('fr-FR', options);
  };
  
  // Générer les jours de la semaine
  const getDaysOfWeek = () => {
    const startOfWeek = new Date(selectedDate);
    const day = selectedDate.getDay();
    const diff = selectedDate.getDate() - day + (day === 0 ? -6 : 1); // Ajuster quand le jour est dimanche
    startOfWeek.setDate(diff);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };
  
  // Vérifier si un créneau horaire est disponible pour un médecin
  const isTimeSlotAvailable = (date: Date, time: string, doctor?: string): boolean => {
    if (!doctor) return true;
    
    const dateStr = date.toISOString().split('T')[0];
    const conflictingAppointments = appointments.filter(app => 
      app.date === dateStr && 
      app.time === time && 
      app.doctor === doctor
    );
    
    return conflictingAppointments.length === 0;
  };
  
  // Trouver les rendez-vous pour une date et un créneau spécifiques
  const getAppointmentsForTimeSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(app => app.date === dateStr && app.time === time);
  };
  
  // Obtenir la classe de couleur pour le niveau d'urgence
  const getUrgencyColorClass = (level?: number) => {
    if (!level) return '';
    
    switch (level) {
      case 5: return darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 4: return darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800';
      case 3: return darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 2: return darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 1: return darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      default: return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtenir la couleur associée à un médecin
  const getDoctorColor = (doctorName: string) => {
    const doctor = doctors.find(d => d.name === doctorName);
    if (doctor) {
      // Si c'est une couleur hexadécimale
      if (doctor.color.startsWith('#')) {
        return doctor.color;
      }
      // Si c'est une classe Tailwind, extraire juste la couleur
      return doctor.color.replace(/^(bg|text|border)-/, '');
    }
    return 'gray';
  };
  
  const renderDayView = () => {
    return (
      <div className={`h-full ${darkMode ? 'bg-gray-900' : 'bg-white'} p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{formatDate(selectedDate)}</h3>
          <div className={`text-xs px-2 py-1 rounded-full ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
          }`}>
            {appointments.filter(a => a.date === selectedDate.toISOString().split('T')[0]).length} rendez-vous
          </div>
        </div>
        
        <div className={`grid ${doctors.length > 0 ? `grid-cols-${doctors.length + 1}` : 'grid-cols-1'} gap-2 h-full`}>
          {/* Heures */}
          <div className="space-y-4 pr-2">
            {timeSlots.map(time => (
              <div key={time} className="h-12 flex items-center">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{time}</span>
              </div>
            ))}
          </div>
          
          {doctors.length > 0 ? (
            // Avec colonnes des médecins
            doctors.map(doctor => (
              <div 
                key={doctor.id} 
                className={`border-l ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className={`text-center py-1 mb-2 ${
                  darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  <span className="text-sm font-medium">{doctor.name}</span>
                </div>
                
                <div className="space-y-4">
                  {timeSlots.map(time => {
                    const matchingApps = getAppointmentsForTimeSlot(selectedDate, time)
                      .filter(app => app.doctor === doctor.name);
                    
                    const isAvailable = isTimeSlotAvailable(selectedDate, time, doctor.name);
                    
                    return (
                      <div 
                        key={time} 
                        className={`h-12 relative ${
                          isAvailable
                            ? `hover:bg-${getDoctorColor(doctor.name)}-50 cursor-pointer`
                            : `${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`
                        }`}
                        onClick={() => isAvailable && onTimeSlotClick && onTimeSlotClick(selectedDate, time, doctor.name)}
                      >
                        {matchingApps.length > 0 ? (
                          matchingApps.map(app => (
                            <div 
                              key={app.id}
                              className={`absolute inset-0 mx-1 my-1 rounded-md border-l-4 border-${getDoctorColor(app.doctor)} p-1 overflow-hidden ${
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              } shadow-sm`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAppointmentClick && onAppointmentClick(app);
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium truncate">{app.patientName}</span>
                                {app.urgencyLevel && (
                                  <span className={`text-xs px-1 py-0.5 rounded-full ${getUrgencyColorClass(app.urgencyLevel)}`}>
                                    {app.urgencyLevel}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-xs">
                                <span>{app.time} ({app.duration} min)</span>
                              </div>
                            </div>
                          ))
                        ) : isAvailable ? (
                          <div className="h-full flex items-center justify-center text-xs text-gray-400">
                            + Nouveau
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Indisponible</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            // Sans colonnes des médecins (simple liste)
            <div className="space-y-4">
              {timeSlots.map(time => {
                const matchingApps = getAppointmentsForTimeSlot(selectedDate, time);
                
                return (
                  <div 
                    key={time}
                    className={`min-h-12 relative ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    } border ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } rounded-md p-2 hover:bg-gray-50 cursor-pointer`}
                    onClick={() => onTimeSlotClick && onTimeSlotClick(selectedDate, time)}
                  >
                    {matchingApps.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {matchingApps.map(app => (
                          <div 
                            key={app.id}
                            className={`rounded-md border-l-4 border-${getDoctorColor(app.doctor)} p-2 ${
                              darkMode ? 'bg-gray-700' : 'bg-white'
                            } shadow-sm`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentClick && onAppointmentClick(app);
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{app.patientName}</span>
                              {app.urgencyLevel && (
                                <span className={`text-xs px-1 py-0.5 rounded-full ${getUrgencyColorClass(app.urgencyLevel)}`}>
                                  {app.urgencyLevel}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>{app.doctor}</span>
                              <span>{app.time} ({app.duration} min)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center">
                        <span className="text-xs text-gray-400 mr-2">{time}</span>
                        <span className="text-xs text-gray-400">Aucun rendez-vous</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysOfWeek();
    
    return (
      <div className={`h-full ${darkMode ? 'bg-gray-900' : 'bg-white'} p-4`}>
        <div className="grid grid-cols-8 gap-2 h-full">
          {/* Colonne des heures */}
          <div className="space-y-4 pr-2">
            <div className="h-10"></div>
            {timeSlots.map(time => (
              <div key={time} className="h-12 flex items-center">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{time}</span>
              </div>
            ))}
          </div>
          
          {/* Colonnes des jours */}
          {days.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            
            if (excludeWeekends && isWeekend) return null;
            
            return (
              <div 
                key={index}
                className={`border-l ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className={`text-center py-2 ${
                  isToday
                    ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800')
                    : isWeekend
                      ? (darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                      : (darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-700')
                }`}>
                  <div className="text-sm font-medium">
                    {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className={`text-xs ${isToday ? 'font-bold' : ''}`}>
                    {day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {timeSlots.map(time => {
                    const matchingApps = getAppointmentsForTimeSlot(day, time);
                    
                    return (
                      <div 
                        key={time}
                        className={`h-12 relative ${
                          darkMode 
                            ? isWeekend ? 'bg-gray-800 bg-opacity-50' : '' 
                            : isWeekend ? 'bg-gray-50' : ''
                        } hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 cursor-pointer`}
                        onClick={() => onTimeSlotClick && onTimeSlotClick(day, time)}
                      >
                        {matchingApps.length > 0 ? (
                          matchingApps.map(app => (
                            <div 
                              key={app.id}
                              className={`absolute inset-0 mx-1 my-1 rounded-md border-l-4 border-${getDoctorColor(app.doctor)} p-1 overflow-hidden ${
                                darkMode ? 'bg-gray-700' : 'bg-white'
                              } shadow-sm`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAppointmentClick && onAppointmentClick(app);
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium truncate">{app.patientName}</span>
                                {app.urgencyLevel && (
                                  <span className={`text-xs px-1 py-0.5 rounded-full ${getUrgencyColorClass(app.urgencyLevel)}`}>
                                    {app.urgencyLevel}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>{app.doctor}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-gray-400">
                            + Nouveau
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Contrôles calendrier */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <button 
              className={`p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              onClick={() => navigateCalendar(-1)}
              title="Précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button 
              className={`p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              onClick={goToToday}
              title="Aujourd'hui"
            >
              <Home className="h-5 w-5" />
            </button>
            
            <button 
              className={`p-2 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
              onClick={() => navigateCalendar(1)}
              title="Suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex rounded-lg overflow-hidden">
            <button 
              className={`p-2 ${currentView === 'day' 
                ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
              onClick={() => onViewChange && onViewChange('day')}
              title="Vue jour"
            >
              <span className="text-xs">Jour</span>
            </button>
            
            <button 
              className={`p-2 ${currentView === 'week' 
                ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
              onClick={() => onViewChange && onViewChange('week')}
              title="Vue semaine"
            >
              <span className="text-xs">Semaine</span>
            </button>
            
            <button 
              className={`p-2 ${currentView === 'month' 
                ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
              onClick={() => onViewChange && onViewChange('month')}
              title="Vue mois"
            >
              <span className="text-xs">Mois</span>
            </button>
            
            <button 
              className={`p-2 ${currentView === 'year' 
                ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white') 
                : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}
              onClick={() => onViewChange && onViewChange('year')}
              title="Vue année"
            >
              <span className="text-xs">Année</span>
            </button>
          </div>
          
          <div className="text-lg font-medium">
            {currentView === 'day' 
              ? formatDate(selectedDate)
              : currentView === 'week'
                ? `Semaine du ${getDaysOfWeek()[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                : currentView === 'month'
                  ? selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
                  : `${selectedDate.getFullYear()}`
            }
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
            disabled={zoomLevel <= 0.5}
            title="Zoom arrière"
          >
            <span className="text-xs">-</span>
          </button>
          
          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {Math.round(zoomLevel * 100)}%
          </span>
          
          <button 
            className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
            disabled={zoomLevel >= 2}
            title="Zoom avant"
          >
            <span className="text-xs">+</span>
          </button>
          
          <button 
            className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            title="Vue grille"
          >
            <Grid className="h-4 w-4" />
          </button>
          
          <button 
            className={`p-1.5 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            title="Vue liste"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Contenu principal du calendrier */}
      <div className="flex-1 overflow-auto">
        <div className="h-full" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
          {currentView === 'day' && renderDayView()}
          {currentView === 'week' && renderWeekView()}
          {/* Implémentez ici les vues mois et année selon les besoins */}
        </div>
      </div>
    </div>
  );
};