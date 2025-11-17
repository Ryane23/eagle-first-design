import React, { useState } from 'react';
import { Clipboard, FileText, Activity, ChevronDown, ChevronUp, AlertCircle, User, X } from 'lucide-react';
import { VitalSigns } from '@medical/VitalSigns';
import { MedicalHistory } from '@medical/MedicalHistory';
import { PatientDocuments } from '@documents/PatientDocuments';

interface PatientData {
  id: number;
  name: string;
  age: number;
  gender: string;
  urgencyLevel?: number;
  doctor?: string;
  specialty?: string;
  status?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string | number;
    temperature?: string | number;
    oxygenSaturation?: string | number;
    weight?: string | number;
    height?: string | number;
    glycemia?: string | number;
  };
  medicalHistory?: {
    medical?: string[];
    surgical?: string[];
    allergies?: string[];
    family?: string[];
  };
  consultationReason?: string;
  documents?: string[];
  notes?: string;
}

interface PatientRecordProps {
  patient: PatientData;
  onUpdate?: (updatedPatient: PatientData) => void;
  onClose?: () => void;
  onMarkReady?: () => void;
  onStartConsultation?: () => void;
  sections?: {
    history?: boolean;
    vitalSigns?: boolean;
    documents?: boolean;
    consultationReason?: boolean;
    notes?: boolean;
  };
  readOnly?: boolean;
  darkMode?: boolean;
}

export const PatientRecord: React.FC<PatientRecordProps> = ({
  patient,
  onUpdate,
  onClose,
  onMarkReady,
  onStartConsultation,
  sections = {
    history: true,
    vitalSigns: true,
    documents: true,
    consultationReason: true,
    notes: true
  },
  readOnly = false,
  darkMode = false
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    medicalHistory: true,
    vitalSigns: true,
    documents: true,
    consultationReason: true,
    notes: true
  });
  
  const [formValues, setFormValues] = useState({
    consultationReason: patient.consultationReason || '',
    notes: patient.notes || ''
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormValues({
      ...formValues,
      [field]: value
    });
    
    if (onUpdate) {
      onUpdate({
        ...patient,
        [field]: value
      });
    }
  };
  
  // Statut du patient (prêt, en préparation, etc.)
  const getStatusBadge = () => {
    if (!patient.status) return null;
    
    let bgColor, textColor;
    let statusText;
    
    switch (patient.status) {
      case 'ready':
      case 'pret':
        bgColor = darkMode ? 'bg-green-900' : 'bg-green-100';
        textColor = darkMode ? 'text-green-300' : 'text-green-800';
        statusText = 'Prêt';
        break;
      case 'in_preparation':
      case 'en_preparation':
        bgColor = darkMode ? 'bg-yellow-900' : 'bg-yellow-100';
        textColor = darkMode ? 'text-yellow-300' : 'text-yellow-800';
        statusText = 'En préparation';
        break;
      case 'in_consultation':
      case 'en_consultation':
        bgColor = darkMode ? 'bg-blue-900' : 'bg-blue-100';
        textColor = darkMode ? 'text-blue-300' : 'text-blue-800';
        statusText = 'En consultation';
        break;
      default:
        bgColor = darkMode ? 'bg-gray-700' : 'bg-gray-100';
        textColor = darkMode ? 'text-gray-300' : 'text-gray-800';
        statusText = patient.status;
    }
    
    return (
      <div className={`px-2 py-0.5 h-fit self-center rounded-md text-xs ${bgColor} ${textColor}`}>
        {statusText}
      </div>
    );
  };
  
  // Niveau d'urgence
  const getUrgencyBadge = () => {
    if (!patient.urgencyLevel) return null;
    
    let bgColor, textColor;
    
    switch (patient.urgencyLevel) {
      case 5:
        bgColor = darkMode ? 'bg-red-900' : 'bg-red-100';
        textColor = darkMode ? 'text-red-300' : 'text-red-800';
        break;
      case 4:
        bgColor = darkMode ? 'bg-orange-900' : 'bg-orange-100';
        textColor = darkMode ? 'text-orange-300' : 'text-orange-800';
        break;
      case 3:
        bgColor = darkMode ? 'bg-yellow-900' : 'bg-yellow-100';
        textColor = darkMode ? 'text-yellow-300' : 'text-yellow-800';
        break;
      case 2:
        bgColor = darkMode ? 'bg-blue-900' : 'bg-blue-100';
        textColor = darkMode ? 'text-blue-300' : 'text-blue-800';
        break;
      case 1:
        bgColor = darkMode ? 'bg-green-900' : 'bg-green-100';
        textColor = darkMode ? 'text-green-300' : 'text-green-800';
        break;
      default:
        bgColor = darkMode ? 'bg-gray-700' : 'bg-gray-100';
        textColor = darkMode ? 'text-gray-300' : 'text-gray-800';
    }
    
    return (
      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${bgColor} ${textColor}`}>
        Niveau {patient.urgencyLevel}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center">
          <Clipboard className={`h-5 w-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
          Dossier Patient Informatisé
        </h3>
        
        {onClose && (
          <button 
            className={`p-1 rounded-md text-xs ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={onClose}
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Informations patient */}
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <div className="flex justify-between">
          <div>
            <div className="font-medium text-base">{patient.name}</div>
            <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {patient.age} ans • {patient.gender === 'M' ? 'Homme' : 'Femme'}
              {getUrgencyBadge()}
              {patient.doctor && ` • ${patient.doctor}`}
              {patient.specialty && ` (${patient.specialty})`}
            </div>
          </div>
          
          {getStatusBadge()}
        </div>
      </div>
      
      {/* Antécédents médicaux */}
      {sections.history && (
        <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className={`p-2 flex justify-between items-center cursor-pointer ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
            onClick={() => toggleSection('medicalHistory')}
          >
            <div className="font-medium text-sm flex items-center">
              <AlertCircle className={`h-4 w-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              Antécédents médicaux
            </div>
            {expandedSections.medicalHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          {expandedSections.medicalHistory && patient.medicalHistory && (
            <div className="p-2">
              <MedicalHistory 
                medicalHistory={patient.medicalHistory}
                editable={!readOnly}
                onUpdate={(updatedHistory) => {
                  if (onUpdate) {
                    onUpdate({
                      ...patient,
                      medicalHistory: updatedHistory
                    });
                  }
                }}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Paramètres vitaux */}
      {sections.vitalSigns && (
        <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className={`p-2 flex justify-between items-center cursor-pointer ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
            onClick={() => toggleSection('vitalSigns')}
          >
            <div className="font-medium text-sm flex items-center">
              <Activity className={`h-4 w-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              Paramètres vitaux
            </div>
            {expandedSections.vitalSigns ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          {expandedSections.vitalSigns && (
            <div className="p-2">
              <VitalSigns 
                vitalSigns={patient.vitalSigns || {}}
                editable={!readOnly}
                onChange={(name, value) => {
                  if (onUpdate && patient.vitalSigns) {
                    onUpdate({
                      ...patient,
                      vitalSigns: {
                        ...patient.vitalSigns,
                        [name]: value
                      }
                    });
                  }
                }}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Motif de consultation */}
      {sections.consultationReason && (
        <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="font-medium text-sm flex items-center">
              <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              Motif de consultation
            </div>
          </div>
          
          <div className="p-2">
            {readOnly ? (
              <div className={`w-full px-2 py-1 text-sm rounded-md ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {formValues.consultationReason || "Aucun motif spécifié"}
              </div>
            ) : (
              <textarea 
                className={`w-full px-2 py-1 text-sm rounded-md border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}
                placeholder="Saisir le motif de consultation..."
                rows={2}
                value={formValues.consultationReason}
                onChange={(e) => handleInputChange('consultationReason', e.target.value)}
              ></textarea>
            )}
          </div>
        </div>
      )}
      
      {/* Documents */}
      {sections.documents && (
        <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className={`p-2 flex justify-between items-center cursor-pointer ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
            onClick={() => toggleSection('documents')}
          >
            <div className="font-medium text-sm flex items-center">
              <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              Documents et examens
            </div>
            {expandedSections.documents ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          {expandedSections.documents && (
            <div className="p-2">
              <PatientDocuments 
                documents={patient.documents || []}
                readOnly={readOnly}
                onUpdate={(updatedDocuments) => {
                  if (onUpdate) {
                    onUpdate({
                      ...patient,
                      documents: updatedDocuments
                    });
                  }
                }}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      )}
      
      {/* Notes */}
      {sections.notes && (
        <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div 
            className={`p-2 flex justify-between items-center cursor-pointer ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
            onClick={() => toggleSection('notes')}
          >
            <div className="font-medium text-sm flex items-center">
              <FileText className={`h-4 w-4 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              Notes
            </div>
            {expandedSections.notes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
          
          {expandedSections.notes && (
            <div className="p-2">
              {readOnly ? (
                <div className={`w-full px-2 py-1 text-sm rounded-md ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  {formValues.notes || "Aucune note"}
                </div>
              ) : (
                <textarea 
                  className={`w-full px-2 py-1 text-sm rounded-md border ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                  }`}
                  placeholder="Notes additionnelles..."
                  rows={3}
                  value={formValues.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                ></textarea>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Actions */}
      {!readOnly && (
        <div className="flex space-x-2 mt-4">
          {onClose && (
            <button 
              className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-sm">Annuler</span>
            </button>
          )}
          
          {onMarkReady && (
            <button 
              className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                darkMode ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              onClick={onMarkReady}
            >
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm">Marquer prêt</span>
            </button>
          )}
          
          {onStartConsultation && (
            <button 
              className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
                darkMode ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={onStartConsultation}
            >
              <Activity className="h-4 w-4 mr-1" />
              <span className="text-sm">Démarrer</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};