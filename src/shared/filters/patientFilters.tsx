export const filterPatientsByUrgency = (patients: any[], urgencyLevels: number[]) => {
  if (urgencyLevels.length === 0) return patients;
  return patients.filter(patient => urgencyLevels.includes(patient.urgency));
};

export const filterPatientsByStatus = (patients: any[], statuses: string[]) => {
  if (statuses.length === 0) return patients;
  return patients.filter(patient => statuses.includes(patient.status));
};

export const filterPatientsBySearch = (patients: any[], searchTerm: string) => {
  if (!searchTerm) return patients;
  const term = searchTerm.toLowerCase();
  return patients.filter(patient => 
    patient.name.toLowerCase().includes(term) ||
    patient.reason?.toLowerCase().includes(term) ||
    patient.center?.toLowerCase().includes(term)
  );
};