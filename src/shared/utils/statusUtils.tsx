export const getUrgencyColor = (level: number): string => {
  const colors = {
    1: 'bg-green-500',
    2: 'bg-blue-500', 
    3: 'bg-yellow-500',
    4: 'bg-orange-500',
    5: 'bg-red-500'
  };
  return colors[level as keyof typeof colors] || 'bg-gray-500';
};

export const getUrgencyLabel = (level: number): string => {
  const labels = {
    1: 'Non urgent',
    2: 'Peu urgent', 
    3: 'Urgent',
    4: 'Très urgent',
    5: 'Urgence vitale'
  };
  return labels[level as keyof typeof labels] || 'Inconnu';
};

export const getStatusBadgeVariant = (status: string): 'success' | 'warning' | 'error' | 'info' => {
  switch (status.toLowerCase()) {
    case 'online':
    case 'active':
    case 'connected':
    case 'validated':
    case 'ready':
      return 'success';
    case 'warning':
    case 'pending':
    case 'waiting':
      return 'warning';
    case 'offline':
    case 'error':
    case 'rejected':
    case 'failed':
      return 'error';
    default:
      return 'info';
  }
};

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};