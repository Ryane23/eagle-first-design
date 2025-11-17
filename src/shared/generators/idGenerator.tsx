export const generateConsultationId = (): string => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TC-${date}-${time}-${random}`;
};

export const generatePatientId = (): string => {
  return `PAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};