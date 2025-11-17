export const mapPatientToCard = (patient: any) => ({
  id: patient.id,
  name: patient.name || patient.nom,
  age: patient.age,
  gender: patient.gender || patient.sexe,
  urgency: patient.urgency || patient.urgence,
  specialty: patient.specialty || patient.specialite,
  center: patient.center || patient.centre,
  waitTime: patient.waitTime || calculateWaitTime(patient.arrivalTime),
  doctor: patient.doctor || patient.medecin,
  arrivalTime: patient.arrivalTime || patient.arrival_time,
  notes: patient.notes
});