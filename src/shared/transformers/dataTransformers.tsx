export const transformPatientForDisplay = (patient: any) => {
  return {
    id: patient.id,
    displayName: `${patient.name} (${patient.age} ans)`,
    urgencyDisplay: `Niveau ${patient.urgency}/5`,
    statusDisplay: getStatusLabel(patient.status),
    waitTimeDisplay: formatWaitTime(patient.waitTime)
  };
};

export const transformVitalSignsForChart = (vitalSigns: any) => {
  return {
    bloodPressure: {
      systolic: parseInt(vitalSigns.bloodPressure?.split('/')[0] || '0'),
      diastolic: parseInt(vitalSigns.bloodPressure?.split('/')[1] || '0')
    },
    heartRate: parseInt(vitalSigns.heartRate || '0'),
    temperature: parseFloat(vitalSigns.temperature || '0'),
    oxygenSaturation: parseInt(vitalSigns.oxygenSaturation || '0')
  };
};