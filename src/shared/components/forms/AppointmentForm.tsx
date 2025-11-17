import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, AlertTriangle, X, Save } from 'lucide-react';

interface AppointmentFormProps {
  onSubmit: (data: AppointmentData) => void;
  onCancel: () => void;
  initialData?: Partial<AppointmentData>;
  doctors: {
    id: number;
    name: string;
    specialty: string;
  }[];
  timeSlots: string[];
  checkConflict?: (doctor: string, date: string, time: string, duration: number, excludeId?: number) => boolean;
  isOnline?: boolean;
  darkMode?: boolean;
  
  // Props pour personnalisation par rôle
  userRole?: 'nurse' | 'secretary_secondary' | 'doctor' | 'admin';
  allowedActions?: {
    canEditDoctor?: boolean;
    canSetUrgency?: boolean;
    canScheduleRecurring?: boolean;
    canOverrideConflicts?: boolean;
    maxUrgencyLevel?: number;
  };
  customFields?: {
    hideFields?: string[];
    requiredFields?: string[];
  };
  labels?: {
    submitButton?: string;
    cancelButton?: string;
    formTitle?: string;
    patientSectionTitle?: string;
    appointmentSectionTitle?: string;
  };
}

export interface AppointmentData {
  id?: number;
  patientName: string;
  patientAge: string;
  patientGender: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  duration: string;
  urgencyLevel: string;
  type: string;
  notes: string;
  sendReminder: boolean;
  reminderType: 'sms' | 'email' | 'both';
  isRecurring: boolean;
  recurrencePattern: string;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  doctors,
  timeSlots,
  checkConflict,
  isOnline = true,
  darkMode = false,
  userRole,
  allowedActions = {},
  customFields = {},
  labels = {}
}) => {
  const [formData, setFormData] = useState<AppointmentData>({
    patientName: '',
    patientAge: '',
    patientGender: 'M',
    doctor: '',
    specialty: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '30',
    urgencyLevel: '2',
    type: 'followup',
    notes: '',
    sendReminder: true,
    reminderType: 'sms',
    isRecurring: false,
    recurrencePattern: 'weekly',
    ...initialData
  });
  
  const [hasConflict, setHasConflict] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppointmentData, string>>>({});
  
  // Fonction helper pour vérifier si un champ doit être affiché
  const shouldShowField = (fieldName: string) => {
    return !customFields.hideFields?.includes(fieldName);
  };
  
  // Fonction helper pour vérifier si un champ est requis
  const isFieldRequired = (fieldName: keyof AppointmentData) => {
    const defaultRequired = ['patientName', 'doctor', 'date', 'time'];
    return defaultRequired.includes(fieldName) || customFields.requiredFields?.includes(fieldName);
  };
  
  // Mettre à jour la spécialité lorsqu'un médecin est sélectionné
  useEffect(() => {
    if (formData.doctor) {
      const selectedDoctor = doctors.find(d => d.name === formData.doctor);
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          specialty: selectedDoctor.specialty
        }));
      }
    }
  }, [formData.doctor, doctors]);
  
  // Vérifier les conflits d'horaire
  useEffect(() => {
    if (checkConflict && formData.doctor && formData.date && formData.time) {
      const conflict = checkConflict(
        formData.doctor, 
        formData.date, 
        formData.time, 
        parseInt(formData.duration), 
        initialData?.id
      );
      setHasConflict(conflict);
    } else {
      setHasConflict(false);
    }
  }, [formData.doctor, formData.date, formData.time, formData.duration, checkConflict, initialData?.id]);
  
  const handleChange = (field: keyof AppointmentData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur si le champ est rempli
    if (formErrors[field] && value) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const errors: Partial<Record<keyof AppointmentData, string>> = {};
    
    // Validation des champs requis
    if (isFieldRequired('patientName') && !formData.patientName) {
      errors.patientName = 'Le nom du patient est requis';
    }
    if (isFieldRequired('doctor') && !formData.doctor) {
      errors.doctor = 'Veuillez sélectionner un médecin';
    }
    if (isFieldRequired('date') && !formData.date) {
      errors.date = 'La date est requise';
    }
    if (isFieldRequired('time') && !formData.time) {
      errors.time = 'L\'heure est requise';
    }
    if (isFieldRequired('patientAge') && !formData.patientAge) {
      errors.patientAge = 'L\'âge est requis';
    }
    if (isFieldRequired('notes') && !formData.notes) {
      errors.notes = 'Les notes sont requises';
    }
    
    // Validation spécifique par rôle
    if (userRole === 'nurse' && allowedActions.maxUrgencyLevel) {
      if (parseInt(formData.urgencyLevel) > allowedActions.maxUrgencyLevel) {
        errors.urgencyLevel = `Niveau d'urgence maximum autorisé : ${allowedActions.maxUrgencyLevel}`;
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Confirmer si conflit détecté et pas d'override autorisé
    if (hasConflict && !allowedActions.canOverrideConflicts) {
      const confirmContinue = window.confirm(
        "Il existe un conflit d'horaire avec un autre rendez-vous. Continuer quand même?"
      );
      if (!confirmContinue) {
        return;
      }
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">
            {labels.patientSectionTitle || 'Informations patient'}
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nom du patient {isFieldRequired('patientName') && '*'}
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                } ${formErrors.patientName ? 'border-red-500' : ''}`}
                placeholder="Nom complet"
                value={formData.patientName}
                onChange={(e) => handleChange('patientName', e.target.value)}
              />
              {formErrors.patientName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.patientName}</p>
              )}
            </div>
            
            {shouldShowField('patientAge') && shouldShowField('patientGender') && (
              <div className="grid grid-cols-2 gap-3">
                {shouldShowField('patientAge') && (
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Âge {isFieldRequired('patientAge') && '*'}
                    </label>
                    <input
                      type="number"
                      className={`w-full px-3 py-2 rounded-md border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } ${formErrors.patientAge ? 'border-red-500' : ''}`}
                      placeholder="Âge"
                      value={formData.patientAge}
                      onChange={(e) => handleChange('patientAge', e.target.value)}
                    />
                    {formErrors.patientAge && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.patientAge}</p>
                    )}
                  </div>
                )}
                
                {shouldShowField('patientGender') && (
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Genre
                    </label>
                    <select
                      className={`w-full px-3 py-2 rounded-md border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      value={formData.patientGender}
                      onChange={(e) => handleChange('patientGender', e.target.value)}
                    >
                      <option value="M">Homme</option>
                      <option value="F">Femme</option>
                    </select>
                  </div>
                )}
              </div>
            )}
            
            {shouldShowField('type') && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type de consultation
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-1.5"
                      checked={formData.type === 'new'}
                      onChange={() => handleChange('type', 'new')}
                    />
                    <span className="text-sm">Nouveau patient</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      className="mr-1.5"
                      checked={formData.type === 'followup'}
                      onChange={() => handleChange('type', 'followup')}
                    />
                    <span className="text-sm">Suivi</span>
                  </label>
                </div>
              </div>
            )}
            
            {shouldShowField('urgencyLevel') && allowedActions.canSetUrgency !== false && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Niveau d'urgence
                </label>
                <select
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${formErrors.urgencyLevel ? 'border-red-500' : ''}`}
                  value={formData.urgencyLevel}
                  onChange={(e) => handleChange('urgencyLevel', e.target.value)}
                >
                  <option value="1">1 - Non urgent</option>
                  <option value="2">2 - Peu urgent</option>
                  <option value="3">3 - Urgent</option>
                  {(!allowedActions.maxUrgencyLevel || allowedActions.maxUrgencyLevel >= 4) && (
                    <option value="4">4 - Très urgent</option>
                  )}
                  {(!allowedActions.maxUrgencyLevel || allowedActions.maxUrgencyLevel >= 5) && (
                    <option value="5">5 - Urgence vitale</option>
                  )}
                </select>
                {formErrors.urgencyLevel && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.urgencyLevel}</p>
                )}
              </div>
            )}
            
            {shouldShowField('notes') && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notes {isFieldRequired('notes') && '*'}
                </label>
                <textarea
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  } ${formErrors.notes ? 'border-red-500' : ''}`}
                  placeholder="Notes additionnelles"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
                {formErrors.notes && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.notes}</p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">
            {labels.appointmentSectionTitle || 'Détails du rendez-vous'}
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Médecin {isFieldRequired('doctor') && '*'}
              </label>
              <select
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } ${formErrors.doctor ? 'border-red-500' : ''}`}
                value={formData.doctor}
                onChange={(e) => handleChange('doctor', e.target.value)}
                disabled={allowedActions.canEditDoctor === false}
              >
                <option value="">Sélectionner un médecin</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name} ({doctor.specialty})
                  </option>
                ))}
              </select>
              {formErrors.doctor && (
                <p className="text-red-500 text-xs mt-1">{formErrors.doctor}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date {isFieldRequired('date') && '*'}
                </label>
                <input
                  type="date"
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${formErrors.date ? 'border-red-500' : ''}`}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
                {formErrors.date && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                )}
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Heure {isFieldRequired('time') && '*'}
                </label>
                <select
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } ${formErrors.time ? 'border-red-500' : ''}`}
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
                {formErrors.time && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>
                )}
              </div>
            </div>
            
            {shouldShowField('duration') && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Durée (minutes)
                </label>
                <select
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="90">1h30</option>
                </select>
              </div>
            )}
            
            {hasConflict && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  <p className="text-sm text-yellow-800">
                    {allowedActions.canOverrideConflicts 
                      ? "Conflit d'horaire détecté - Vous pouvez forcer la création"
                      : "Conflit d'horaire détecté avec un autre rendez-vous"
                    }
                  </p>
                </div>
              </div>
            )}
            
            {shouldShowField('sendReminder') && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Options de rappel
                </label>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.sendReminder}
                      onChange={(e) => handleChange('sendReminder', e.target.checked)}
                    />
                    <span className="text-sm">Envoyer un rappel</span>
                  </label>
                  
                  {formData.sendReminder && (
                    <div className="ml-6 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-1.5"
                          checked={formData.reminderType === 'sms'}
                          onChange={() => handleChange('reminderType', 'sms')}
                        />
                        <span className="text-sm">SMS</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-1.5"
                          checked={formData.reminderType === 'email'}
                          onChange={() => handleChange('reminderType', 'email')}
                        />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          className="mr-1.5"
                          checked={formData.reminderType === 'both'}
                          onChange={() => handleChange('reminderType', 'both')}
                        />
                        <span className="text-sm">SMS + Email</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {shouldShowField('isRecurring') && allowedActions.canScheduleRecurring !== false && (
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.isRecurring}
                    onChange={(e) => handleChange('isRecurring', e.target.checked)}
                  />
                  <span className="text-sm font-medium">Rendez-vous récurrent</span>
                </label>
                
                {formData.isRecurring && (
                  <div className="mt-2">
                    <select
                      className={`w-full px-3 py-2 rounded-md border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      value={formData.recurrencePattern}
                      onChange={(e) => handleChange('recurrencePattern', e.target.value)}
                    >
                      <option value="daily">Quotidien</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="biweekly">Toutes les 2 semaines</option>
                      <option value="monthly">Mensuel</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Indicateur de mode hors ligne */}
      {!isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
            <p className="text-sm text-orange-800">
              Mode hors ligne - Les rendez-vous seront synchronisés une fois la connexion rétablie
            </p>
          </div>
        </div>
      )}
      
      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            darkMode
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <X className="h-4 w-4 inline mr-1" />
          {labels.cancelButton || 'Annuler'}
        </button>
        
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
            isOnline
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          <Save className="h-4 w-4 inline mr-1" />
          {labels.submitButton || (initialData?.id ? 'Modifier' : 'Créer') + ' le rendez-vous'}
        </button>
      </div>
    </form>
  );
};