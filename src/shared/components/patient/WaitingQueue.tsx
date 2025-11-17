import React, { useState } from 'react';
import { Clock, User, AlertTriangle, UserCheck, Edit, Clipboard, ArrowRight, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  urgencyLevel: number;
  order?: number;
  status: 'ready' | 'in_preparation' | 'pret' | 'en_preparation';
  doctor: string;
  specialty: string;
  waitTime?: number;
  arrivalTime?: string;
  notes?: string;
}

interface WaitingQueueProps {
  patients: Patient[];
  specialties: string[];
  doctors: string[];
  onSelectPatient?: (patient: Patient) => void;
  onAdmitPatient?: (patient: Patient) => void;
  onViewRecords?: (patient: Patient) => void;
  onFilterChange?: (filters: QueueFilters) => void;
  allowReordering?: boolean;
  darkMode?: boolean;
}

interface QueueFilters {
  specialty: string;
  doctor: string;
  urgencyLevel: string;
  searchTerm: string;
}

export const WaitingQueue: React.FC<WaitingQueueProps> = ({
  patients,
  specialties,
  doctors,
  onSelectPatient,
  onAdmitPatient,
  onViewRecords,
  onFilterChange,
  allowReordering = false,
  darkMode = false
}) => {
  const [filters, setFilters] = useState<QueueFilters>({
    specialty: 'all',
    doctor: 'all',
    urgencyLevel: 'all',
    searchTerm: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSpecialties, setExpandedSpecialties] = useState<Record<string, boolean>>({});
  const [expandedDoctors, setExpandedDoctors] = useState<Record<string, boolean>>({});
  
  // Toggle l'expansion des sections
  const toggleSection = (section: string, type: 'specialty' | 'doctor') => {
    if (type === 'specialty') {
      setExpandedSpecialties({
        ...expandedSpecialties,
        [section]: !expandedSpecialties[section]
      });
    } else {
      setExpandedDoctors({
        ...expandedDoctors,
        [section]: !expandedDoctors[section]
      });
    }
  };
  
  // Mise à jour des filtres
  const updateFilters = (newFilters: Partial<QueueFilters>) => {
    const updatedFilters = {
      ...filters,
      ...newFilters
    };
    
    setFilters(updatedFilters);
    
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };
  
  // Récupérer la classe de couleur pour le niveau d'urgence
  const getUrgencyColorClass = (level: number) => {
    switch (level) {
      case 5: return darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
      case 4: return darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800';
      case 3: return darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
      case 2: return darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 1: return darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      default: return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filtrer les patients selon les critères
  const filteredPatients = patients.filter(patient => {
    const matchesSpecialty = filters.specialty === 'all' || patient.specialty === filters.specialty;
    const matchesDoctor = filters.doctor === 'all' || patient.doctor === filters.doctor;
    const matchesUrgency = filters.urgencyLevel === 'all' || patient.urgencyLevel.toString() === filters.urgencyLevel;
    const matchesSearch = !filters.searchTerm || 
      patient.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    return matchesSpecialty && matchesDoctor && matchesUrgency && matchesSearch;
  });
  
  // Organiser les patients par spécialité et médecin
  const patientsBySpecialty: Record<string, Patient[]> = {};
  
  filteredPatients.forEach(patient => {
    if (!patientsBySpecialty[patient.specialty]) {
      patientsBySpecialty[patient.specialty] = [];
    }
    
    patientsBySpecialty[patient.specialty].push(patient);
  });
  
  const patientsByDoctor: Record<string, Patient[]> = {};
  
  filteredPatients.forEach(patient => {
    if (!patientsByDoctor[patient.doctor]) {
      patientsByDoctor[patient.doctor] = [];
    }
    
    patientsByDoctor[patient.doctor].push(patient);
  });
  
  // Organiser les patients par statut
  const getPatientsByStatus = (patientsList: Patient[], status: string) => {
    return patientsList.filter(p => 
      p.status === status || 
      (status === 'ready' && p.status === 'pret') ||
      (status === 'in_preparation' && p.status === 'en_preparation')
    );
  };
  
  // Vérifier si un médecin est disponible
  const isDoctorAvailable = (doctorName: string): boolean => {
    // Logique à implémenter selon les besoins
    return true;
  };
  
  // Barre de filtres
  const renderFilters = () => (
    <div className="mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 flex-grow">
          <div className={`relative rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un patient, médecin..."
              className={`pl-8 pr-3 py-1.5 rounded-md border-0 w-full max-w-xs ${
                darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }`}
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
          </div>
          
          <button 
            className={`p-1.5 rounded-md flex items-center ${
              showFilters 
                ? (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            <span>Filtres</span>
            {showFilters ? (
              <ChevronUp className="h-4 w-4 ml-1" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className={`mt-2 p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} grid grid-cols-1 md:grid-cols-3 gap-3`}>
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Spécialité
            </label>
            <select
              className={`w-full py-1.5 px-2 rounded-md border-0 text-sm ${
                darkMode 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-white text-gray-900'
              }`}
              value={filters.specialty}
              onChange={(e) => updateFilters({ specialty: e.target.value })}
            >
              <option value="all">Toutes spécialités</option>
              {specialties.map((specialty, index) => (
                <option key={index} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Médecin
            </label>
            <select
              className={`w-full py-1.5 px-2 rounded-md border-0 text-sm ${
                darkMode 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-white text-gray-900'
              }`}
              value={filters.doctor}
              onChange={(e) => updateFilters({ doctor: e.target.value })}
            >
              <option value="all">Tous médecins</option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>{doctor}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Niveau d'urgence
            </label>
            <select
              className={`w-full py-1.5 px-2 rounded-md border-0 text-sm ${
                darkMode 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-white text-gray-900'
              }`}
              value={filters.urgencyLevel}
              onChange={(e) => updateFilters({ urgencyLevel: e.target.value })}
            >
              <option value="all">Tous niveaux</option>
              <option value="5">5 - Urgence vitale</option>
              <option value="4">4 - Très urgent</option>
              <option value="3">3 - Urgent</option>
              <option value="2">2 - Peu urgent</option>
              <option value="1">1 - Non urgent</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
  
  // Rendu d'un patient
  const renderPatientItem = (patient: Patient) => (
    <div 
      key={patient.id}
      className={`p-2 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} mb-2`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-sm flex items-center">
            {patient.name}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${getUrgencyColorClass(patient.urgencyLevel)}`}>
              Niveau {patient.urgencyLevel}
            </span>
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {patient.age} ans • {patient.gender === 'M' ? 'H' : 'F'}
            {patient.order && ` • Passage: ${patient.order}`}
            {patient.waitTime && ` • Attente: ${patient.waitTime} min`}
            {patient.arrivalTime && ` • Arrivé: ${patient.arrivalTime}`}
          </div>
        </div>
        
        <div className="flex space-x-1">
          <button 
            className={`px-2 py-1 text-xs rounded-md flex items-center ${
              isDoctorAvailable(patient.doctor)
                ? (darkMode ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-600 text-white hover:bg-green-700')
                : (darkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-50')
            }`}
            onClick={() => onAdmitPatient && onAdmitPatient(patient)}
            disabled={!isDoctorAvailable(patient.doctor)}
            title={isDoctorAvailable(patient.doctor) ? `Admettre ${patient.name}` : `${patient.doctor} est occupé`}
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Admettre
          </button>
          
          <button 
            className={`px-2 py-1 text-xs rounded-md flex items-center ${
              darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={() => onViewRecords && onViewRecords(patient)}
            title={`Voir dossier de ${patient.name}`}
          >
            <Clipboard className="h-3 w-3 mr-1" />
            DPI
          </button>
        </div>
      </div>
    </div>
  );

  // Organisation par spécialité
  const renderPatientsBySpecialty = () => (
    <div className="space-y-4">
      {Object.keys(patientsBySpecialty).length > 0 ? (
        Object.keys(patientsBySpecialty).map(specialty => (
          <div key={specialty} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <div 
              className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} cursor-pointer`}
              onClick={() => toggleSection(specialty, 'specialty')}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  {specialty}
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {patientsBySpecialty[specialty].length}
                  </span>
                </h3>
                {expandedSpecialties[specialty] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            
            {expandedSpecialties[specialty] && (
              <div className="p-3">
                {/* Patients prêts */}
                {getPatientsByStatus(patientsBySpecialty[specialty], 'ready').length > 0 && (
                  <div className="mb-3">
                    <div className={`text-xs font-medium mb-1 flex items-center ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Patients prêts
                    </div>
                    
                    <div className="space-y-2">
                      {getPatientsByStatus(patientsBySpecialty[specialty], 'ready')
                        .map(patient => renderPatientItem(patient))}
                    </div>
                  </div>
                )}
                
                {/* Patients en préparation */}
                {getPatientsByStatus(patientsBySpecialty[specialty], 'in_preparation').length > 0 && (
                  <div>
                    <div className={`text-xs font-medium mb-1 flex items-center ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      <Clipboard className="h-3 w-3 mr-1" />
                      En préparation
                    </div>
                    
                    <div className="space-y-2">
                      {getPatientsByStatus(patientsBySpecialty[specialty], 'in_preparation')
                        .map(patient => renderPatientItem(patient))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Aucun patient ne correspond aux critères de filtrage
        </div>
      )}
    </div>
  );
  
  // Organisation par médecin
  const renderPatientsByDoctor = () => (
    <div className="space-y-4">
      {Object.keys(patientsByDoctor).length > 0 ? (
        Object.keys(patientsByDoctor).map(doctor => (
          <div key={doctor} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <div 
              className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'} cursor-pointer`}
              onClick={() => toggleSection(doctor, 'doctor')}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center">
                  {doctor}
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {patientsByDoctor[doctor].length}
                  </span>
                </h3>
                {expandedDoctors[doctor] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
            
            {expandedDoctors[doctor] && (
              <div className="p-3">
                {/* Patients prêts */}
                {getPatientsByStatus(patientsByDoctor[doctor], 'ready').length > 0 && (
                  <div className="mb-3">
                    <div className={`text-xs font-medium mb-1 flex items-center ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      <UserCheck className="h-3 w-3 mr-1" />
                      Patients prêts
                    </div>
                    
                    <div className="space-y-2">
                      {getPatientsByStatus(patientsByDoctor[doctor], 'ready')
                        .map(patient => renderPatientItem(patient))}
                    </div>
                  </div>
                )}
                
                {/* Patients en préparation */}
                {getPatientsByStatus(patientsByDoctor[doctor], 'in_preparation').length > 0 && (
                  <div>
                    <div className={`text-xs font-medium mb-1 flex items-center ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      <Clipboard className="h-3 w-3 mr-1" />
                      En préparation
                    </div>
                    
                    <div className="space-y-2">
                      {getPatientsByStatus(patientsByDoctor[doctor], 'in_preparation')
                        .map(patient => renderPatientItem(patient))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Aucun patient ne correspond aux critères de filtrage
        </div>
      )}
    </div>
  );

  return (
    <div>
      {renderFilters()}
      {renderPatientsBySpecialty()}
    </div>
  );
};