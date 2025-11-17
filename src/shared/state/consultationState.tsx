export interface ConsultationState {
  activeConsultations: any[];
  waitingPatients: any[];
  availableRooms: any[];
  connectionStatus: boolean;
}

export const initialConsultationState: ConsultationState = {
  activeConsultations: [],
  waitingPatients: [],
  availableRooms: [],
  connectionStatus: true
};