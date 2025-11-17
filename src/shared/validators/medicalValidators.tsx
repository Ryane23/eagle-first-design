export const validateVitalSigns = (vitalSigns: any) => {
  const errors: string[] = [];
  
  if (vitalSigns.temperature && (vitalSigns.temperature < 35 || vitalSigns.temperature > 42)) {
    errors.push("Température anormale détectée");
  }
  
  if (vitalSigns.heartRate && (vitalSigns.heartRate < 40 || vitalSigns.heartRate > 200)) {
    errors.push("Fréquence cardiaque anormale détectée");
  }
  
  if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 90) {
    errors.push("Saturation en oxygène critique");
  }
  
  return { isValid: errors.length === 0, errors };
};