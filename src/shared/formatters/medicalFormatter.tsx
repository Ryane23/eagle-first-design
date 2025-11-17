export const formatBloodPressure = (systolic: number, diastolic: number): string => {
  return `${systolic}/${diastolic}`;
};

export const formatBMI = (weight: number, height: number): string => {
  if (!weight || !height || height <= 0) return "N/A";
  const bmi = weight / Math.pow(height / 100, 2);
  return bmi.toFixed(1);
};

export const interpretBMI = (bmi: number): string => {
  if (bmi < 18.5) return "Insuffisance pondérale";
  if (bmi < 25) return "Poids normal";
  if (bmi < 30) return "Surpoids";
  return "Obésité";
};