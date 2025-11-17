export const validatePatientForm = (data: any) => {
  const errors: Record<string, string> = {};
  
  if (!data.name?.trim()) {
    errors.name = "Le nom est requis";
  }
  
  if (!data.age || data.age < 0 || data.age > 150) {
    errors.age = "Âge invalide";
  }
  
  if (!data.urgency || data.urgency < 1 || data.urgency > 5) {
    errors.urgency = "Niveau d'urgence invalide";
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};