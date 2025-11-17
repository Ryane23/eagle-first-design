import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, User, Clock, ArrowUp, ArrowDown, Save, RotateCcw, CheckCircle, X, HelpCircle, Plus, Trash2, FileText } from 'lucide-react';

interface PriorityLevel {
  id: number;
  level: number;
  label: string;
  description: string;
  maxWaitTime: number; // en minutes
  color: string;
  escalationRules?: {
    timeThreshold: number; // en minutes
    action: 'notify' | 'escalate' | 'alert';
    recipients: string[];
  }[];
}

interface Patient {
  id: string | number;
  name: string;
  age: number;
  gender: 'M' | 'F';
  priorityLevel: number;
  waitTime: number; // en minutes
  arrivalTime: string;
  symptoms?: string;
  tags?: string[];
  specialty?: string;
  assignedTo?: string;
  modificationHistory?: {
    timestamp: string;
    oldLevel: number;
    newLevel: number;
    user: string;
    reason: string;
  }[];
}

interface PatientPriorityManagerProps {
  patients: Patient[];
  priorityLevels: PriorityLevel[];
  currentUser: {
    id: string;
    name: string;
    role: string;
    canModifyPriority: boolean;
  };
  onPriorityChange: (patientId: string | number, newLevel: number, reason: string) => void;
  onNotify?: (patientId: string | number, recipients: string[]) => void;
  onAddPatient?: () => void;
  onViewPatient?: (patientId: string | number) => void;
  onAssignPatient?: (patientId: string | number, userId: string) => void;
  className?: string;
}

const PatientPriorityManager: React.FC<PatientPriorityManagerProps> = ({
  patients,
  priorityLevels,
  currentUser,
  onPriorityChange,
  onNotify,
  onAddPatient,
  onViewPatient,
  onAssignPatient,
  className = ''
}) => {
  const [expandedPatient, setExpandedPatient] = useState<string | number | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'waitTime'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [changingPriority, setChangingPriority] = useState<string | number | null>(null);
  const [newPriorityLevel, setNewPriorityLevel] = useState<number | null>(null);
  const [changeReason, setChangeReason] = useState('');
  
  // Trier les patients
  const sortedPatients = [...patients].sort((a, b) => {
    if (sortBy === 'priority') {
      return sortDirection === 'desc' ? 
        b.priorityLevel - a.priorityLevel : 
        a.priorityLevel - b.priorityLevel;
    } else {
      return sortDirection === 'desc' ? 
        b.waitTime - a.waitTime : 
        a.waitTime - b.waitTime;
    }
  });
  
  // Obtenir les détails d'un niveau de priorité
  const getPriorityLevelDetails = (level: number) => {
    return priorityLevels.find(p => p.level === level) || priorityLevels[0];
  };
  
  // Obtenir les classes de couleur pour un niveau de priorité
  const getPriorityColorClasses = (level: number) => {
    const priority = getPriorityLevelDetails(level);
    switch (priority.color) {
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  // Gérer le changement de tri
  const handleSortChange = (field: 'priority' | 'waitTime') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Démarrer le changement de priorité
  const startPriorityChange = (patientId: string | number, currentLevel: number) => {
    setChangingPriority(patientId);
    setNewPriorityLevel(currentLevel);
    setChangeReason('');
  };
  
  // Annuler le changement de priorité
  const cancelPriorityChange = () => {
    setChangingPriority(null);
    setNewPriorityLevel(null);
    setChangeReason('');
  };
  
  // Soumettre le changement de priorité
  const submitPriorityChange = (patientId: string | number) => {
    if (newPriorityLevel !== null && changeReason.trim()) {
      onPriorityChange(patientId, newPriorityLevel, changeReason);
      setChangingPriority(null);
      setNewPriorityLevel(null);
      setChangeReason('');
    }
  };
  
  // Vérifier si un patient dépasse le temps d'attente
  const isOverWaitTimeThreshold = (patient: Patient) => {
    const priority = getPriorityLevelDetails(patient.priorityLevel);
    return patient.waitTime > priority.maxWaitTime;
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* En-tête */}
      <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          Gestion des Urgences
        </h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex text-xs border rounded overflow-hidden">
            <button
              className={`px-2 py-1 flex items-center ${
                sortBy === 'priority' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleSortChange('priority')}
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Priorité
              {sortBy === 'priority' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              className={`px-2 py-1 flex items-center border-l ${
                sortBy === 'waitTime' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleSortChange('waitTime')}
            >
              <Clock className="h-3 w-3 mr-1" />
              Temps d'attente
              {sortBy === 'waitTime' && (
                sortDirection === 'desc' ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>
          
          {onAddPatient && (
            <button
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded flex items-center"
              onClick={onAddPatient}
            >
              <Plus className="h-3 w-3 mr-1" />
              Ajouter
            </button>
          )}
        </div>
      </div>
      
      {/* Liste des patients */}
      <div className="divide-y divide-gray-200">
        {sortedPatients.length > 0 ? (
          sortedPatients.map(patient => (
            <div key={patient.id} className="p-3">
              <div className="flex justify-between items-start">
                <div 
                  className="flex items-start cursor-pointer"
                  onClick={() => setExpandedPatient(expandedPatient === patient.id ? null : patient.id)}
                >
                  {/* Indicateur de priorité */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getPriorityColorClasses(patient.priorityLevel)} text-lg font-bold`}>
                    {patient.priorityLevel}
                  </div>
                  
                  <div>
                    <div className="font-medium flex items-center">
                      {patient.name}
                      <span className="ml-2 text-sm text-gray-500">
                        {patient.age} ans • {patient.gender === 'M' ? 'H' : 'F'}
                      </span>
                      {isOverWaitTimeThreshold(patient) && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-0.5" />
                          Dépassé
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm mt-0.5">
                      <span className="text-gray-600 flex items-center mr-3">
                        <Clock className="h-3 w-3 mr-1" />
                        Attente: {patient.waitTime} min
                      </span>
                      <span className="text-gray-600">
                        Arrivé à {patient.arrivalTime}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {onViewPatient && (
                    <button
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      onClick={() => onViewPatient(patient.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  )}
                  
                  {currentUser.canModifyPriority && changingPriority !== patient.id && (
                    <button
                      className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
                      onClick={() => startPriorityChange(patient.id, patient.priorityLevel)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  )}
                  
                  {expandedPatient === patient.id ? (
                    <button
                      className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPatient(null);
                      }}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPatient(patient.id);
                      }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Zone de modification de priorité */}
              {changingPriority === patient.id && (
                <div className="mt-3 ml-12 p-3 border rounded-lg bg-yellow-50 border-yellow-200">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                    Modifier le niveau de priorité
                  </h4>
                  
                  <div className="mb-3">
                    <label className="block text-sm mb-1">
                      Nouveau niveau de priorité
                    </label>
                    <div className="flex gap-1">
                      {priorityLevels.map(level => (
                        <button
                          key={level.id}
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            newPriorityLevel === level.level 
                              ? `${getPriorityColorClasses(level.level)} ring-2 ring-offset-2 ring-blue-500` 
                              : getPriorityColorClasses(level.level)
                          }`}
                          onClick={() => setNewPriorityLevel(level.level)}
                        >
                          {level.level}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-sm mb-1">
                      Raison du changement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full border rounded p-2 text-sm"
                      value={changeReason}
                      onChange={(e) => setChangeReason(e.target.value)}
                      placeholder="Indiquez la raison du changement de priorité..."
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded flex items-center"
                      onClick={cancelPriorityChange}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </button>
                    <button
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded flex items-center"
                      onClick={() => submitPriorityChange(patient.id)}
                      disabled={!newPriorityLevel || !changeReason.trim()}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Enregistrer
                    </button>
                  </div>
                </div>
              )}
              
              {/* Détails dépliables */}
              {expandedPatient === patient.id && (
                <div className="mt-3 ml-12 space-y-3">
                  {/* Symptômes/Spécialité */}
                  {(patient.symptoms || patient.specialty) && (
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {patient.symptoms && (
                        <div className="mb-1">
                          <span className="text-sm font-medium">Symptômes:</span>
                          <p className="text-sm text-gray-600">{patient.symptoms}</p>
                        </div>
                      )}
                      {patient.specialty && (
                        <div>
                          <span className="text-sm font-medium">Spécialité requise:</span>
                          <span className="text-sm text-gray-600 ml-1">{patient.specialty}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Tags */}
                  {patient.tags && patient.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {patient.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Historique des modifications */}
                  {patient.modificationHistory && patient.modificationHistory.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-gray-500" />
                        Historique des modifications
                      </h4>
                      <div className="space-y-1">
                        {patient.modificationHistory.map((mod, index) => (
                          <div key={index} className="text-xs p-2 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center">
                              <div className="font-medium">{mod.user}</div>
                              <span className="mx-1">•</span>
                              <div className="text-gray-500">{mod.timestamp}</div>
                            </div>
                            <div className="mt-0.5 flex items-center">
                              <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-xs ${getPriorityColorClasses(mod.oldLevel)}`}>
                                {mod.oldLevel}
                              </span>
                              <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                              <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-xs ${getPriorityColorClasses(mod.newLevel)}`}>
                                {mod.newLevel}
                              </span>
                              <span className="ml-2 text-gray-600">{mod.reason}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Aucun patient dans la file d'urgence.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPriorityManager;