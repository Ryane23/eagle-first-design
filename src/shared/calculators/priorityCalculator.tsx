export const calculatePatientPriority = (
  urgencyLevel: number,
  waitTime: number,
  algorithm: string = '50/50'
): number => {
  switch (algorithm) {
    case '70/30':
      return 0.7 * urgencyLevel + 0.3 * (waitTime / 10);
    case '30/70':
      return 0.3 * urgencyLevel + 0.7 * (waitTime / 10);
    default: // '50/50'
      return 0.5 * urgencyLevel + 0.5 * (waitTime / 10);
  }
};