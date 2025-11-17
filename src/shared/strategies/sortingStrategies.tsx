export interface SortingStrategy {
  sort(patients: any[]): any[];
}

export class UrgencyFirstStrategy implements SortingStrategy {
  sort(patients: any[]): any[] {
    return patients.sort((a, b) => b.urgency - a.urgency || a.waitTime - b.waitTime);
  }
}

export class WaitTimeFirstStrategy implements SortingStrategy {
  sort(patients: any[]): any[] {
    return patients.sort((a, b) => b.waitTime - a.waitTime || b.urgency - a.urgency);
  }
}

export class BalancedStrategy implements SortingStrategy {
  sort(patients: any[]): any[] {
    return patients.sort((a, b) => {
      const scoreA = calculatePatientPriority(a.urgency, a.waitTime);
      const scoreB = calculatePatientPriority(b.urgency, b.waitTime);
      return scoreB - scoreA;
    });
  }
}