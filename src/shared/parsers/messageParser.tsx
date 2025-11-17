export const parseMessageContent = (content: string) => {
  const urgentPattern = /URGENT[:\s]+(.*)/gi;
  const timePattern = /(\d{1,2}:\d{2})/g;
  const patientPattern = /patient\s+([A-Za-z\s]+)/gi;
  
  return {
    isUrgent: urgentPattern.test(content),
    mentions: {
      times: content.match(timePattern) || [],
      patients: content.match(patientPattern) || []
    },
    priority: urgentPattern.test(content) ? 'high' : 'normal'
  };
};