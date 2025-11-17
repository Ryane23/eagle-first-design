import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: 'M' | 'F';
  urgency: number;
  specialty: string;
  doctor: string;
  center: string;
  waitTime: number;
  status: 'waiting' | 'in_consultation' | 'completed';
}

interface ConsultationState {
  patients: Patient[];
  activeConsultations: Array<{
    id: number;
    patient: string;
    doctor: string;
    room: string;
    startTime: string;
    duration: number;
  }>;
  waitingRooms: Array<{
    id: string;
    name: string;
    specialty: string;
    patientCount: number;
    load: 'low' | 'medium' | 'high';
  }>;
}

type ConsultationAction = 
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'UPDATE_PATIENT'; payload: { id: number; updates: Partial<Patient> } }
  | { type: 'REMOVE_PATIENT'; payload: number }
  | { type: 'START_CONSULTATION'; payload: { patientId: number; doctor: string; room: string } }
  | { type: 'END_CONSULTATION'; payload: number };

const initialState: ConsultationState = {
  patients: [],
  activeConsultations: [],
  waitingRooms: []
};

const consultationReducer = (state: ConsultationState, action: ConsultationAction): ConsultationState => {
  switch (action.type) {
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: [...state.patients, action.payload]
      };
    case 'UPDATE_PATIENT':
      return {
        ...state,
        patients: state.patients.map(patient =>
          patient.id === action.payload.id
            ? { ...patient, ...action.payload.updates }
            : patient
        )
      };
    case 'REMOVE_PATIENT':
      return {
        ...state,
        patients: state.patients.filter(patient => patient.id !== action.payload)
      };
    default:
      return state;
  }
};

const ConsultationContext = createContext<{
  state: ConsultationState;
  dispatch: React.Dispatch<ConsultationAction>;
} | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(consultationReducer, initialState);

  return (
    <ConsultationContext.Provider value={{ state, dispatch }}>
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultationContext = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultationContext must be used within ConsultationProvider');
  }
  return context;
};