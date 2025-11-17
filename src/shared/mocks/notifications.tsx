// Notifications existantes (étendues)
export const mockNotificationsData = [
  {
    id: 1,
    type: 'urgent',
    title: 'Patient critique',
    content: 'Patient urgent: Robert Mbarga (Niveau 5) - Douleur thoracique aigüe',
    message: 'Patient urgent: Robert Mbarga (Niveau 5) - Douleur thoracique aigüe',
    time: '09:58',
    read: false,
    priority: 'critical',
    source: 'system',
    category: 'patient',
    relatedPatientId: 4,
    relatedPatientName: 'Robert Mbarga',
    actionRequired: true,
    estimatedResponseTime: 2,
    urgencyLevel: 5,
    autoExpire: false,
    sound: true,
    desktop: true,
    createdBy: 'System',
    clinicCode: 'CM-KRI',
    clinicName: 'Clinique Moderne - Kribi'
  },
  {
    id: 2,
    type: 'info',
    title: 'Patient prêt',
    content: 'Jeanne Atangana prête pour la consultation en cardiologie',
    message: 'Jeanne Atangana prête pour la consultation',
    time: '09:45',
    read: false,
    priority: 'medium',
    source: 'staff',
    category: 'consultation',
    relatedPatientId: 3,
    relatedPatientName: 'Jeanne Atangana',
    actionRequired: false,
    estimatedResponseTime: 0,
    urgencyLevel: 4,
    autoExpire: true,
    expireAfter: 300000, // 5 minutes
    sound: false,
    desktop: true,
    createdBy: 'Infirmière Marie',
    clinicCode: 'CSJ-YDE',
    clinicName: 'Clinique Saint Jean - Yaoundé'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Temps d\'attente critique',
    content: 'Temps d\'attente de Claude Bekolo dépassé (30+ minutes) pour urgence niveau 2',
    message: 'Temps d\'attente de Claude Bekolo > 30min',
    time: '09:30',
    read: false,
    priority: 'high',
    source: 'system',
    category: 'workflow',
    relatedPatientId: 2,
    relatedPatientName: 'Claude Bekolo',
    actionRequired: true,
    estimatedResponseTime: 10,
    urgencyLevel: 2,
    autoExpire: false,
    sound: true,
    desktop: true,
    createdBy: 'System',
    clinicCode: 'CP-DLA',
    clinicName: 'Centre Principal - Douala'
  },
  {
    id: 4,
    type: 'success',
    title: 'Consultation terminée',
    content: 'Consultation avec Paul Etoga terminée avec succès - Durée: 25 minutes',
    message: 'Consultation avec Paul Etoga terminée avec succès',
    time: '09:45',
    read: true,
    priority: 'low',
    source: 'doctor',
    category: 'consultation',
    relatedPatientId: null,
    relatedPatientName: 'Paul Etoga',
    actionRequired: false,
    estimatedResponseTime: 0,
    urgencyLevel: null,
    autoExpire: true,
    expireAfter: 10000, // 10 secondes
    sound: false,
    desktop: false,
    createdBy: 'Dr. Kouam',
    clinicCode: 'CSJ-YDE',
    clinicName: 'Clinique Saint Jean - Yaoundé'
  },
  {
    id: 5,
    type: 'info',
    title: 'Résultats disponibles',
    content: 'Résultats d\'analyse sanguine disponibles pour Thomas Ebogo - À consulter',
    message: 'Résultats d\'analyse disponibles pour Thomas Ebogo',
    time: '08:50',
    read: true,
    priority: 'medium',
    source: 'lab',
    category: 'results',
    relatedPatientId: 7,
    relatedPatientName: 'Thomas Ebogo',
    actionRequired: false,
    estimatedResponseTime: 0,
    urgencyLevel: 3,
    autoExpire: false,
    sound: false,
    desktop: true,
    createdBy: 'Laboratoire',
    clinicCode: 'CM-KRI',
    clinicName: 'Clinique Moderne - Kribi'
  },
  {
    id: 6,
    type: 'urgent',
    title: 'Nouvelle urgence vitale',
    content: 'Aisha Mohamadou (29 ans) - Hémorragie génitale, grossesse 12 semaines',
    message: 'Nouvelle urgence vitale: Aisha Mohamadou - Hémorragie génitale',
    time: '09:55',
    read: false,
    priority: 'critical',
    source: 'admission',
    category: 'patient',
    relatedPatientId: 8,
    relatedPatientName: 'Aisha Mohamadou',
    actionRequired: true,
    estimatedResponseTime: 1,
    urgencyLevel: 5,
    autoExpire: false,
    sound: true,
    desktop: true,
    createdBy: 'Accueil',
    clinicCode: 'CSJ-YDE',
    clinicName: 'Clinique Saint Jean - Yaoundé'
  },
  {
    id: 7,
    type: 'error',
    title: 'Erreur de connexion',
    content: 'Perte de connexion temporaire avec le centre CM-LIM - Tentative de reconnexion',
    message: 'Erreur de connexion avec CM-LIM',
    time: '09:20',
    read: false,
    priority: 'high',
    source: 'system',
    category: 'technical',
    relatedPatientId: null,
    relatedPatientName: null,
    actionRequired: true,
    estimatedResponseTime: 5,
    urgencyLevel: null,
    autoExpire: false,
    sound: false,
    desktop: true,
    createdBy: 'System',
    clinicCode: 'CM-LIM',
    clinicName: 'Centre Médical - Limbé'
  },
  {
    id: 8,
    type: 'warning',
    title: 'Charge système élevée',
    content: 'Nombre élevé de patients urgents (5) - Considérer l\'activation du protocole de surcharge',
    message: 'Charge système élevée - 5 patients urgents actifs',
    time: '09:40',
    read: false,
    priority: 'high',
    source: 'system',
    category: 'system',
    relatedPatientId: null,
    relatedPatientName: null,
    actionRequired: true,
    estimatedResponseTime: 15,
    urgencyLevel: null,
    autoExpire: false,
    sound: true,
    desktop: true,
    createdBy: 'System',
    clinicCode: null,
    clinicName: 'Système EAGLE'
  },
  {
    id: 9,
    type: 'info',
    title: 'Médecin disponible',
    content: 'Dr. Beyala maintenant disponible pour consultations dermatologiques',
    message: 'Dr. Beyala disponible - Dermatologie',
    time: '09:10',
    read: true,
    priority: 'low',
    source: 'staff',
    category: 'availability',
    relatedPatientId: null,
    relatedPatientName: null,
    actionRequired: false,
    estimatedResponseTime: 0,
    urgencyLevel: null,
    autoExpire: true,
    expireAfter: 600000, // 10 minutes
    sound: false,
    desktop: false,
    createdBy: 'Dr. Beyala',
    clinicCode: 'CMN-GAR',
    clinicName: 'Centre Médical du Nord - Garoua'
  },
  {
    id: 10,
    type: 'success',
    title: 'Transfert réussi',
    content: 'Patient Sophie Ndom transférée avec succès en salle de consultation',
    message: 'Transfert réussi: Sophie Ndom en consultation',
    time: '09:42',
    read: true,
    priority: 'low',
    source: 'staff',
    category: 'transfer',
    relatedPatientId: 6,
    relatedPatientName: 'Sophie Ndom',
    actionRequired: false,
    estimatedResponseTime: 0,
    urgencyLevel: 4,
    autoExpire: true,
    expireAfter: 5000,
    sound: false,
    desktop: false,
    createdBy: 'Infirmière Claire',
    clinicCode: 'CP-DLA',
    clinicName: 'Centre Principal - Douala'
  }
];

// Modèles de notifications pour différents scénarios
export const notificationTemplates = {
  urgentPatient: (patient: any) => ({
    type: 'urgent',
    title: 'Patient critique',
    content: `Patient urgent: ${patient.name} (Niveau ${patient.urgency}) - ${patient.reason}`,
    category: 'patient',
    relatedPatientId: patient.id,
    relatedPatientName: patient.name,
    urgencyLevel: patient.urgency,
    actionRequired: true,
    estimatedResponseTime: patient.urgency >= 5 ? 1 : 2,
    autoExpire: false,
    sound: true,
    desktop: true,
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  }),

  patientReady: (patient: any) => ({
    type: 'info',
    title: 'Patient prêt',
    content: `${patient.name} prêt pour la consultation en ${patient.specialty}`,
    category: 'consultation',
    relatedPatientId: patient.id,
    relatedPatientName: patient.name,
    urgencyLevel: patient.urgency,
    actionRequired: false,
    estimatedResponseTime: 0,
    autoExpire: true,
    expireAfter: 300000,
    sound: false,
    desktop: true,
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  }),

  waitTimeExceeded: (patient: any, maxWaitTime: number) => ({
    type: 'warning',
    title: 'Temps d\'attente dépassé',
    content: `${patient.name} attend depuis ${patient.waitTime} minutes (max: ${maxWaitTime} min pour niveau ${patient.urgency})`,
    category: 'workflow',
    relatedPatientId: patient.id,
    relatedPatientName: patient.name,
    urgencyLevel: patient.urgency,
    actionRequired: true,
    estimatedResponseTime: 10,
    autoExpire: false,
    sound: true,
    desktop: true,
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  }),

  consultationCompleted: (patient: any, duration: number) => ({
    type: 'success',
    title: 'Consultation terminée',
    content: `Consultation avec ${patient.name} terminée - Durée: ${duration} minutes`,
    category: 'consultation',
    relatedPatientId: patient.id,
    relatedPatientName: patient.name,
    urgencyLevel: patient.urgency,
    actionRequired: false,
    estimatedResponseTime: 0,
    autoExpire: true,
    expireAfter: 10000,
    sound: false,
    desktop: false,
    clinicCode: patient.clinicCode,
    clinicName: patient.clinicName
  }),

  systemAlert: (message: string, level: 'info' | 'warning' | 'error') => ({
    type: level,
    title: level === 'error' ? 'Erreur système' : level === 'warning' ? 'Alerte système' : 'Information système',
    content: message,
    category: 'system',
    relatedPatientId: null,
    relatedPatientName: null,
    urgencyLevel: null,
    actionRequired: level !== 'info',
    estimatedResponseTime: level === 'error' ? 5 : level === 'warning' ? 15 : 0,
    autoExpire: level === 'info',
    expireAfter: level === 'info' ? 10000 : undefined,
    sound: level === 'error',
    desktop: true,
    clinicCode: null,
    clinicName: 'Système EAGLE'
  }),

  doctorAvailable: (doctorName: string, specialty: string, clinicCode: string, clinicName: string) => ({
    type: 'info',
    title: 'Médecin disponible',
    content: `${doctorName} maintenant disponible pour consultations ${specialty}`,
    category: 'availability',
    relatedPatientId: null,
    relatedPatientName: null,
    urgencyLevel: null,
    actionRequired: false,
    estimatedResponseTime: 0,
    autoExpire: true,
    expireAfter: 600000,
    sound: false,
    desktop: false,
    clinicCode,
    clinicName
  }),

  connectionIssue: (clinicCode: string, clinicName: string, status: 'lost' | 'restored') => ({
    type: status === 'lost' ? 'error' : 'success',
    title: status === 'lost' ? 'Connexion perdue' : 'Connexion rétablie',
    content: status === 'lost' 
      ? `Perte de connexion avec ${clinicName} - Tentative de reconnexion`
      : `Connexion rétablie avec ${clinicName}`,
    category: 'technical',
    relatedPatientId: null,
    relatedPatientName: null,
    urgencyLevel: null,
    actionRequired: status === 'lost',
    estimatedResponseTime: status === 'lost' ? 5 : 0,
    autoExpire: status === 'restored',
    expireAfter: status === 'restored' ? 5000 : undefined,
    sound: status === 'lost',
    desktop: true,
    clinicCode,
    clinicName
  })
};

// Générateur de notifications pour les tests
export const generateNotification = (template: string, data: any) => {
  const templateFunc = notificationTemplates[template];
  if (!templateFunc) return null;

  const notification = templateFunc(data);
  return {
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    priority: notification.type === 'urgent' ? 'critical' : 
             notification.type === 'warning' || notification.type === 'error' ? 'high' :
             notification.type === 'info' ? 'medium' : 'low',
    source: 'system',
    createdBy: 'System',
    ...notification
  };
};

// Notifications par catégorie
export const getNotificationsByCategory = (category: string) => {
  return mockNotificationsData.filter(n => n.category === category);
};

export const getNotificationsByType = (type: string) => {
  return mockNotificationsData.filter(n => n.type === type);
};

export const getNotificationsByPriority = (priority: string) => {
  return mockNotificationsData.filter(n => n.priority === priority);
};

export const getUnreadNotifications = () => {
  return mockNotificationsData.filter(n => !n.read);
};

export const getNotificationsRequiringAction = () => {
  return mockNotificationsData.filter(n => n.actionRequired);
};

export const getRecentNotifications = (minutes: number = 30) => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - minutes * 60000);
  
  return mockNotificationsData.filter(n => {
    const notificationTime = new Date(`${now.toDateString()} ${n.time}`);
    return notificationTime >= cutoff;
  });
};

// Notifications en temps réel (simulation)
export const mockRealTimeNotifications = [
  {
    id: 'rt-1',
    type: 'urgent',
    title: 'Nouvelle urgence',
    content: 'Nouveau patient critique en route - ETA 5 minutes',
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    live: true
  },
  {
    id: 'rt-2',
    type: 'warning',
    title: 'Équipement',
    content: 'ECG Salle 2 nécessite maintenance - Signaler au service technique',
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    live: true
  }
];

// Statistiques des notifications
export const getNotificationStats = () => {
  const total = mockNotificationsData.length;
  const unread = mockNotificationsData.filter(n => !n.read).length;
  const urgent = mockNotificationsData.filter(n => n.type === 'urgent').length;
  const actionRequired = mockNotificationsData.filter(n => n.actionRequired).length;
  
  return {
    total,
    unread,
    urgent,
    actionRequired,
    readRate: Math.round(((total - unread) / total) * 100),
    urgentRate: Math.round((urgent / total) * 100),
    actionRate: Math.round((actionRequired / total) * 100)
  };
};

// Configuration des notifications par type
export const notificationConfig = {
  urgent: {
    color: 'red',
    icon: '🚨',
    sound: true,
    desktop: true,
    autoExpire: false,
    priority: 'critical'
  },
  warning: {
    color: 'yellow',
    icon: '⚠️',
    sound: true,
    desktop: true,
    autoExpire: false,
    priority: 'high'
  },
  error: {
    color: 'red',
    icon: '❌',
    sound: true,
    desktop: true,
    autoExpire: false,
    priority: 'high'
  },
  info: {
    color: 'blue',
    icon: 'ℹ️',
    sound: false,
    desktop: true,
    autoExpire: true,
    expireAfter: 10000,
    priority: 'medium'
  },
  success: {
    color: 'green',
    icon: '✅',
    sound: false,
    desktop: false,
    autoExpire: true,
    expireAfter: 5000,
    priority: 'low'
  }
};

// Actions disponibles pour chaque type de notification
export const notificationActions = {
  urgent: ['respond_immediately', 'escalate', 'mark_read', 'archive'],
  warning: ['acknowledge', 'respond', 'mark_read', 'archive'],
  error: ['resolve', 'escalate', 'mark_read', 'archive'],
  info: ['mark_read', 'archive', 'delete'],
  success: ['mark_read', 'archive', 'delete']
};

// Règles d'escalation automatique
export const escalationRules = [
  {
    condition: (notification: any) => 
      notification.type === 'urgent' && 
      !notification.read && 
      getNotificationAge(notification) > 300000, // 5 minutes
    action: 'escalate_to_supervisor',
    message: 'Notification urgente non lue depuis plus de 5 minutes'
  },
  {
    condition: (notification: any) => 
      notification.type === 'error' && 
      notification.category === 'technical' &&
      getNotificationAge(notification) > 600000, // 10 minutes
    action: 'escalate_to_technical',
    message: 'Erreur technique non résolue depuis plus de 10 minutes'
  },
  {
    condition: (notification: any) => 
      notification.actionRequired && 
      !notification.read &&
      getNotificationAge(notification) > 900000, // 15 minutes
    action: 'auto_remind',
    message: 'Rappel: Action requise sur cette notification'
  }
];

// Fonctions utilitaires
const getNotificationAge = (notification: any): number => {
  const now = new Date();
  const notificationTime = new Date(`${now.toDateString()} ${notification.time}`);
  return now.getTime() - notificationTime.getTime();
};

export const shouldNotificationExpire = (notification: any): boolean => {
  if (!notification.autoExpire) return false;
  const age = getNotificationAge(notification);
  return age > (notification.expireAfter || 10000);
};

export const getNotificationPriorityScore = (notification: any): number => {
  const priorityScores = {
    critical: 100,
    high: 75,
    medium: 50,
    low: 25
  };
  
  let score = priorityScores[notification.priority] || 0;
  
  // Bonus pour les notifications non lues
  if (!notification.read) score += 20;
  
  // Bonus pour les notifications récentes
  const age = getNotificationAge(notification);
  if (age < 300000) score += 10; // Moins de 5 minutes
  
  // Bonus pour les notifications nécessitant une action
  if (notification.actionRequired) score += 15;
  
  return score;
};

export const formatNotificationForDisplay = (notification: any) => {
  const config = notificationConfig[notification.type] || notificationConfig.info;
  const age = getNotificationAge(notification);
  
  return {
    ...notification,
    config,
    age,
    ageDisplay: formatAge(age),
    priorityScore: getNotificationPriorityScore(notification),
    shouldExpire: shouldNotificationExpire(notification),
    actions: notificationActions[notification.type] || [],
    needsEscalation: escalationRules.some(rule => rule.condition(notification))
  };
};

const formatAge = (ageMs: number): string => {
  const minutes = Math.floor(ageMs / 60000);
  const hours = Math.floor(minutes / 60);
  
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a plus de 24h`;
};

// Simulation de nouvelles notifications
export const simulateNewNotification = (): any => {
  const types = ['urgent', 'warning', 'info', 'success', 'error'];
  const categories = ['patient', 'system', 'consultation', 'technical', 'workflow'];
  const patients = ['Robert Mbarga', 'Jeanne Atangana', 'Marie Ekambi', 'Claude Bekolo'];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const patient = Math.random() > 0.5 ? patients[Math.floor(Math.random() * patients.length)] : null;
  
  const messages = {
    urgent: [
      `Nouveau patient critique: ${patient || 'Patient inconnu'}`,
      'Détresse respiratoire sévère signalée',
      'Arrêt cardiaque - Équipe de réanimation requise'
    ],
    warning: [
      `Temps d'attente dépassé pour ${patient || 'un patient'}`,
      'Charge système élevée - 6 patients urgents',
      'Équipement défaillant en salle 3'
    ],
    info: [
      `${patient || 'Patient'} prêt pour consultation`,
      'Nouveau médecin disponible',
      'Résultats d\'analyse disponibles'
    ],
    success: [
      `Consultation avec ${patient || 'patient'} terminée`,
      'Connexion rétablie avec centre distant',
      'Sauvegarde automatique réussie'
    ],
    error: [
      'Erreur de connexion base de données',
      'Échec synchronisation avec centre CM-LIM',
      'Erreur lors de l\'envoi de notification'
    ]
  };
  
  const typeMessages = messages[type] || messages.info;
  const message = typeMessages[Math.floor(Math.random() * typeMessages.length)];
  
  return generateNotification(type === 'urgent' ? 'urgentPatient' : 'systemAlert', {
    name: patient,
    urgency: Math.floor(Math.random() * 5) + 1,
    reason: message,
    clinicCode: 'SIM-TEST',
    clinicName: 'Centre de Simulation'
  });
};

// Export par défaut des notifications
export { mockNotificationsData as default };