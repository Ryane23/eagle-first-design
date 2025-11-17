export const formatDate = (date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('fr-FR');
    case 'long':
      return dateObj.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'iso':
      return dateObj.toISOString().split('T')[0];
    default:
      return dateObj.toLocaleDateString('fr-FR');
  }
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDateTime = (date: Date | string): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getWeekDays = (weekOffset: number = 0): Array<{
  date: Date;
  day: number;
  dayName: string;
  dateISO: string;
  isToday: boolean;
}> => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
  
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    
    const dayName = day.toLocaleDateString('fr-FR', { weekday: 'short' });
    
    days.push({
      date: day,
      day: day.getDate(),
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      dateISO: formatDate(day, 'iso'),
      isToday: formatDate(day, 'iso') === formatDate(today, 'iso')
    });
  }
  
  return days;
};

export const isWeekend = (date: Date | string): boolean => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = dateObj.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6; // Dimanche ou Samedi
};