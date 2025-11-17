import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity, FileText, MessageSquare, Clipboard, Calendar, Droplet, Heart, User, Eye } from 'lucide-react';

interface TimelineEvent {
  id: string | number;
  date: string;
  time?: string;
  title: string;
  description?: string;
  type: 'consultation' | 'prescription' | 'exam' | 'note' | 'vital_signs' | 'appointment' | 'procedure' | 'other';
  doctor?: string;
  location?: string;
  details?: any;
  files?: { id: string; name: string; type: string }[];
}

interface MedicalDataTimelineProps {
  events: TimelineEvent[];
  patientName?: string;
  showFilters?: boolean;
  allowExpandAll?: boolean;
  onViewEvent?: (eventId: string | number) => void;
  onViewFile?: (fileId: string, eventId: string | number) => void;
}

const MedicalDataTimeline: React.FC<MedicalDataTimelineProps> = ({
  events,
  patientName,
  showFilters = true,
  allowExpandAll = true,
  onViewEvent,
  onViewFile
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [expandedEvents, setExpandedEvents] = useState<Set<string | number>>(new Set());
  const [expandAll, setExpandAll] = useState<boolean>(false);
  
  // Filtrer les événements
  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.type === filter);
  
  // Trier les événements par date (du plus récent au plus ancien)
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time || '00:00'}`);
    const dateB = new Date(`${b.date} ${b.time || '00:00'}`);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Gérer le développement/réduction d'un événement
  const toggleEvent = (eventId: string | number) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };
  
  // Développer/réduire tous les événements
  const toggleExpandAll = () => {
    if (expandAll) {
      setExpandedEvents(new Set());
    } else {
      setExpandedEvents(new Set(events.map(e => e.id)));
    }
    setExpandAll(!expandAll);
  };
  
  // Obtenir l'icône pour un type d'événement
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-5 w-5 text-blue-500" />;
      case 'prescription': return <FileText className="h-5 w-5 text-green-500" />;
      case 'exam': return <Activity className="h-5 w-5 text-purple-500" />;
      case 'note': return <MessageSquare className="h-5 w-5 text-yellow-500" />;
      case 'vital_signs': return <Heart className="h-5 w-5 text-red-500" />;
      case 'appointment': return <Calendar className="h-5 w-5 text-indigo-500" />;
      case 'procedure': return <Droplet className="h-5 w-5 text-pink-500" />;
      default: return <Clipboard className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Obtenir la classe de couleur pour un type d'événement
  const getEventColorClass = (type: string) => {
    switch (type) {
      case 'consultation': return 'border-blue-200 bg-blue-50';
      case 'prescription': return 'border-green-200 bg-green-50';
      case 'exam': return 'border-purple-200 bg-purple-50';
      case 'note': return 'border-yellow-200 bg-yellow-50';
      case 'vital_signs': return 'border-red-200 bg-red-50';
      case 'appointment': return 'border-indigo-200 bg-indigo-50';
      case 'procedure': return 'border-pink-200 bg-pink-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };
  
  // Obtenir le label pour un type d'événement
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation': return 'Consultation';
      case 'prescription': return 'Prescription';
      case 'exam': return 'Examen';
      case 'note': return 'Note';
      case 'vital_signs': return 'Signes vitaux';
      case 'appointment': return 'Rendez-vous';
      case 'procedure': return 'Procédure';
      default: return 'Autre';
    }
  };
  
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {patientName && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <h3 className="font-medium flex items-center">
            <User className="h-5 w-5 text-blue-500 mr-2" />
            Chronologie médicale - {patientName}
          </h3>
        </div>
      )}
      
      {/* Filtres et contrôles */}
      {(showFilters || allowExpandAll) && (
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex flex-wrap justify-between items-center">
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 text-xs rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFilter('all')}
              >
                Tous
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full ${filter === 'consultation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFilter('consultation')}
              >
                Consultations
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full ${filter === 'prescription' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFilter('prescription')}
              >
                Prescriptions
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full ${filter === 'exam' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFilter('exam')}
              >
                Examens
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-full ${filter === 'vital_signs' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setFilter('vital_signs')}
              >
                Signes vitaux
              </button>
            </div>
          )}
          
          {allowExpandAll && (
            <button
              className="text-xs text-blue-600 flex items-center"
              onClick={toggleExpandAll}
            >
              {expandAll ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Réduire tout
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Développer tout
                </>
              )}
            </button>
          )}
        </div>
      )}
      
      {/* Timeline d'événements */}
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {sortedEvents.length > 0 ? (
          sortedEvents.map(event => {
            const isExpanded = expandedEvents.has(event.id);
            
            return (
              <div key={event.id} className={`p-3 ${getEventColorClass(event.type)}`}>
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleEvent(event.id)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {event.date} {event.time && `• ${event.time}`} • {getEventTypeLabel(event.type)}
                        {event.doctor && ` • Dr. ${event.doctor}`}
                      </div>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-3 ml-8 pl-2 border-l-2 border-gray-300">
                    {event.description && (
                      <div className="mb-2">
                        <p className="text-sm">{event.description}</p>
                      </div>
                    )}
                    
                    {event.details && (
                      <div className="mb-2">
                        {event.type === 'vital_signs' && (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {Object.entries(event.details).map(([key, value]) => (
                              <div key={key} className="bg-white p-2 rounded border border-gray-200">
                                <div className="text-xs text-gray-500">{key}</div>
                                <div className="font-medium">{value}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {event.type !== 'vital_signs' && (
                          <div className="bg-white p-2 rounded border border-gray-200 text-sm">
                            <pre className="whitespace-pre-wrap">
                              {typeof event.details === 'object' 
                                ? JSON.stringify(event.details, null, 2) 
                                : event.details}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {event.files && event.files.length > 0 && (
                      <div className="mb-2">
                        <div className="text-sm font-medium mb-1">Documents associés</div>
                        <div className="flex flex-wrap gap-2">
                          {event.files.map(file => (
                            <button
                              key={file.id}
                              className="flex items-center px-2 py-1 text-xs bg-white rounded border border-gray-200 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onViewFile) onViewFile(file.id, event.id);
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {file.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {onViewEvent && (
                      <div className="mt-2">
                        <button
                          className="flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onViewEvent) onViewEvent(event.id);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir détails complets
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-gray-500">
            <p>Aucun événement médical trouvé.</p>
            {filter !== 'all' && (
              <button
                className="mt-2 text-blue-600 text-sm"
                onClick={() => setFilter('all')}
              >
                Afficher tous les types d'événements
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalDataTimeline;