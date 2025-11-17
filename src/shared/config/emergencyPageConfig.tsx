import { 
AlertTriangle, Clock, CheckCircle, Building, Users, BarChart2, HelpCircle, RefreshCw, PlayCircle, PhoneCall, Phone, Send, Edit, Eye, Download, PlusCircle, Filter, Search
} from 'lucide-react';

import { transformUserForHeader } from '@transformers/emergencyPageTransformers';
import { getToolbarClasses, getMainLayoutClasses } from '@utils/emergencyStyleUtils';
import { EMERGENCY_PRIORITY_LEVELS, SPECIALTY_OPTIONS } from '@constants/emergencyConstants';

export const getEmergencyPerformanceConfig = (formattedConfig: any) => {
  return {
    metrics: {
      refreshInterval: 30000, // 30 secondes
      autoSave: true,
      enableVirtualization: formattedConfig.pageData.patients.length > 50,
      lazyLoading: true,
      debounceSearch: 300,
      cacheStrategy: 'smart'
    },
    thresholds: {
      waitTime: { warning: 30, critical: 45 },
      systemLoad: { warning: 70, critical: 90 },
      urgentPatients: { warning: 3, critical: 5 }
    }
  };
};

export const getEmergencyAccessibilityConfig = (formattedConfig: any) => {
  return {
    keyboard: {
      shortcuts: true,
      navigation: true,
      trapFocus: true
    },
    screenReader: {
      announcements: true,
      liveRegions: true,
      landmarks: true
    },
    visual: {
      highContrast: formattedConfig.darkMode,
      reducedMotion: false,
      colorBlindSupport: true
    }
  };
};

export const getEmergencySecurityConfig = (formattedConfig: any) => {
  return {
    session: {
      timeout: 3600000, // 1 heure
      autoLock: true,
      requireReauth: {
        criticalActions: true,
        dataExport: true
      }
    },
    audit: {
      enabled: true,
      logLevel: 'info',
      sensitiveActions: [
        'priority_change',
        'patient_transfer',
        'data_export'
      ]
    },
    encryption: {
      localStorage: false,
      transmission: true
    }
  };
};

export const getEmergencyIntegrationConfig = (formattedConfig: any) => {
  return {
    sync: {
      enabled: true,
      interval: 60000, // 1 minute
      conflictResolution: 'server_wins',
      retryAttempts: 3
    },
    offline: {
      enabled: true,
      maxDuration: 3600000, // 1 heure
      queueActions: true,
      cacheSize: 100
    },
    external: {
      his: { enabled: false, endpoint: '/api/his' },
      monitoring: { enabled: false, endpoint: '/api/monitoring' },
      notifications: { enabled: true, endpoint: '/api/notifications' }
    }
  };
};

export const getEmergencyValidationConfig = (formattedConfig: any) => {
  return {
    realTime: true,
    strictMode: false,
    rules: {
      patient: {
        name: { required: true, minLength: 2, maxLength: 100 },
        age: { required: true, min: 0, max: 150 },
        urgency: { required: true, min: 1, max: 5 }
      },
      urgencyChange: {
        justification: {
          required: (old: number, new_: number) => Math.abs(new_ - old) >= 2,
          minLength: 10
        }
      },
      communication: {
        message: { required: true, minLength: 5, maxLength: 1000 }
      }
    },
    onError: (errors: string[]) => {
      console.warn('Validation errors:', errors);
      formattedConfig.emergencyState.setToastMessage('Erreur de validation');
      formattedConfig.emergencyState.setShowSuccessToast(false);
    }
  };
};

export const getEmergencyAnalyticsConfig = (formattedConfig: any) => {
  return {
    enabled: false, // Désactivé par défaut pour la confidentialité
    trackUserActions: false,
    trackPerformance: true,
    trackErrors: true,
    anonymizeData: true,
    metrics: {
      pageViews: false,
      userSessions: false,
      actionCompletions: true,
      errorRates: true,
      performanceMetrics: true
    },
    retention: 30 // jours
  };
};

export const getEmergencyExportConfig = (formattedConfig: any) => {
  return {
    formats: ['pdf', 'excel', 'csv'],
    defaultFormat: 'pdf',
    options: {
      includeCharts: true,
      includeHistory: false,
      includeNotes: true,
      watermark: true,
      compression: 'medium'
    },
    limits: {
      maxFileSize: 10485760, // 10MB
      maxRecords: 1000,
      batchSize: 100
    },
    templates: {
      patient_summary: 'Résumé patient',
      emergency_report: 'Rapport d\'urgence',
      statistics_report: 'Rapport statistique'
    }
  };
};

export const getEmergencyWorkflowConfig = (formattedConfig: any) => {
  return {
    autoAdvance: false,
    stages: [
      'registration',
      'triage',
      'waiting',
      'preparation',
      'consultation',
      'completion'
    ],
    transitions: {
      'waiting': ['preparation', 'consultation'],
      'preparation': ['consultation', 'waiting'],
      'consultation': ['completion']
    },
    rules: {
      requireJustification: {
        urgencyIncrease: true,
        urgencyDecrease: false,
        statusChange: false
      },
      autoEscalation: {
        enabled: true,
        conditions: [
          { if: 'waitTime > 45 && urgency >= 3', then: 'notify_supervisor' },
          { if: 'urgency >= 5', then: 'immediate_attention' }
        ]
      }
    }
  };
};

export const getEmergencyUIConfig = (formattedConfig: any) => {
  const { darkMode, emergencyState } = formattedConfig;
  
  return {
    theme: {
      mode: darkMode ? 'dark' : 'light',
      colors: 'default',
      density: 'comfortable',
      fontSize: 'normal'
    },
    layout: {
      sidebar: {
        collapsed: false,
        width: 240,
        collapsedWidth: 60
      },
      header: {
        height: 64,
        fixed: true
      },
      footer: {
        height: 40,
        visible: false
      }
    },
    animations: {
      enabled: true,
      duration: 200,
      easing: 'ease-in-out'
    },
    notifications: {
      position: 'bottom-right',
      duration: 5000,
      sound: true,
      desktop: true
    }
  };
};

export const getEmergencyDataConfig = (formattedConfig: any) => {
  return {
    pagination: {
      enabled: true,
      pageSize: 25,
      pageSizeOptions: [10, 25, 50, 100]
    },
    sorting: {
      enabled: true,
      defaultSort: 'urgency',
      multiSort: false
    },
    filtering: {
      enabled: true,
      globalSearch: true,
      columnFilters: true,
      savedFilters: false
    },
    virtualization: {
      enabled: formattedConfig.pageData.patients.length > 100,
      rowHeight: 60,
      overscan: 5
    }
  };
};

export const mergeEmergencyConfigs = (...configs: any[]) => {
  return configs.reduce((merged, config) => {
    return deepMerge(merged, config);
  }, {});
};

export const validateEmergencyConfig = (config: any) => {
  const errors = [];
  
  // Validation des intervalles
  if (config.performance?.metrics?.refreshInterval < 1000) {
    errors.push('L\'intervalle de rafraîchissement doit être d\'au moins 1 seconde');
  }
  
  // Validation des seuils
  if (config.performance?.thresholds?.waitTime?.warning < 1) {
    errors.push('Le seuil d\'avertissement de temps d\'attente doit être positif');
  }
  
  // Validation de sécurité
  if (config.security?.session?.timeout < 300000) {
    errors.push('Le timeout de session doit être d\'au moins 5 minutes');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Fonction utilitaire pour fusion profonde
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}; const getEmergencyHeaderConfig = (formattedConfig: any) => {
  const { pageData, emergencyState, darkMode } = formattedConfig;
  
  return {
    title: "Gestion des Urgences",
    subtitle: `${pageData.doctor.specialty} • ${pageData.doctor.clinique}`,
    darkMode,
    toggleDarkMode: formattedConfig.toggleDarkMode,
    user: transformUserForHeader(pageData.doctor),
    notificationCount: formattedConfig.unreadCount,
    isOnline: formattedConfig.connectionStatus,
    extraHeaderItems: (
      <div className="flex items-center space-x-2">
        <ConnectionStatus
          isOnline={formattedConfig.connectionStatus}
          onToggleConnection={formattedConfig.toggleConnection}
          showControls={true}
          darkMode={darkMode}
        />
        <ThemeSwitcher
          onChange={formattedConfig.toggleDarkMode}
          defaultDarkMode={darkMode}
          size="small"
        />
      </div>
    )
  };
};

export const getEmergencySidebarConfig = (formattedConfig: any) => {
  const { emergencyState } = formattedConfig;
  
  return {
    appName: "EAGLE",
    menuItems: [
      { 
        icon: <Home size={20} />, 
        label: "Tableau de bord", 
        path: "#", 
        isActive: emergencyState.activeMenuItem === 'dashboard' 
      },
      { 
        icon: <Users size={20} />, 
        label: "Salle d'attente", 
        path: "#", 
        isActive: emergencyState.activeMenuItem === 'waitingRoom' 
      },
      { 
        icon: <AlertTriangle size={20} />, 
        label: "Gestion des Urgences", 
        path: "#", 
        isActive: emergencyState.activeMenuItem === 'emergencies' 
      },
      { 
        icon: <MessageSquare size={20} />, 
        label: "Communication", 
        path: "#", 
        isActive: emergencyState.activeMenuItem === 'communication' 
      },
      { 
        icon: <BarChart2 size={20} />, 
        label: "Statistiques", 
        path: "#", 
        isActive: emergencyState.activeMenuItem === 'statistics' 
      }
    ],
    bottomMenuItems: [
      { 
        icon: <Settings size={18} />, 
        label: "Paramètres", 
        path: "#",
        isActive: emergencyState.activeMenuItem === 'settings'
      },
      { 
        icon: <HelpCircle size={18} />, 
        label: "Aide", 
        path: "#",
        isActive: emergencyState.activeMenuItem === 'help'
      }
    ],
    darkMode: formattedConfig.darkMode
  };
};

export const getEmergencyToolbarConfig = (formattedConfig: any) => {
  const { emergencyState, darkMode } = formattedConfig;
  
  return {
    searchSection: {
      className: "flex items-center flex-1 space-x-2"
    },
    searchInput: {
      placeholder: "Rechercher patient ou centre...",
      value: emergencyState.searchTerm,
      onChange: (e: any) => emergencyState.setSearchTerm(e.target.value),
      darkMode: darkMode,
      width: "flex-1",
      icon: <Search size={16} />
    },
    specialtySelector: {
      title: "Spécialité",
      options: SPECIALTY_OPTIONS,
      selectedType: emergencyState.filterSpecialty,
      onChange: emergencyState.setFilterSpecialty,
      className: `px-2 py-1 rounded text-xs ${
        darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
      } border`
    },
    actionSection: {
      className: "flex items-center space-x-2"
    },
    viewSelector: {
      currentView: emergencyState.currentView,
      onChange: emergencyState.setCurrentView,
      availableViews: ['list', 'priority'],
      darkMode: darkMode
    },
    historyButton: {
      label: emergencyState.showHistoryPanel ? "Masquer historique" : "Voir historique",
      onClick: () => emergencyState.setShowHistoryPanel(!emergencyState.showHistoryPanel),
      variant: "secondary" as const,
      size: "xs" as const,
      icon: <Eye size={16} />
    }
  };
};

export const getEmergencyTabsConfig = (formattedConfig: any) => {
  const { 
    emergencyState, 
    pageData, 
    darkMode, 
    handlePriorityChange, 
    handlePatientAction 
  } = formattedConfig;

  const tabsConfig = [
    {
      id: 'patients',
      label: 'Patients',
      icon: <Users className="h-4 w-4" />,
      badge: emergencyState.filteredPatients.length,
      content: (
        <div className="space-y-4">
          {emergencyState.currentView === 'priority' ? (
            <PatientPriorityManager
              patients={emergencyState.filteredPatients.map(p => ({
                ...p,
                priorityLevel: p.urgency,
                modificationHistory: pageData.modificationHistory
                  .filter(h => h.entityId === p.id)
                  .map(h => ({
                    timestamp: h.timestamp,
                    oldLevel: h.changes[0]?.oldValue || p.urgency,
                    newLevel: h.changes[0]?.newValue || p.urgency,
                    user: h.user.name,
                    reason: h.details
                  }))
              }))}
              priorityLevels={EMERGENCY_PRIORITY_LEVELS}
              currentUser={formattedConfig.user}
              onPriorityChange={handlePriorityChange}
              onViewPatient={(patientId) => {
                const patient = emergencyState.filteredPatients.find(p => p.id === patientId);
                if (patient) handlePatientAction('select', patient);
              }}
            />
          ) : (
            <FilterableTable
              columns={getTableColumns(formattedConfig)}
              data={emergencyState.filteredPatients}
              emptyMessage="Aucun patient urgent trouvé"
            />
          )}
        </div>
      )
    },
    {
      id: 'stats',
      label: 'Statistiques',
      icon: <BarChart2 className="h-4 w-4" />,
      content: (
        <div className="space-y-4">
          <StatCardGroup darkMode={darkMode}>
            {getStatsCards(formattedConfig).map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                iconColor={stat.iconColor}
                suffix={stat.suffix}
                darkMode={darkMode}
              />
            ))}
          </StatCardGroup>
        </div>
      )
    }
  ];

  return {
    tabs: tabsConfig,
    defaultTabId: "patients",
    onChange: emergencyState.setActiveTab
  };
};

export const getEmergencyModalsConfig = (formattedConfig: any) => {
  const { emergencyState, darkMode } = formattedConfig;

  return {
    criteriaModal: {
      title: "Critères des niveaux d'urgence",
      isOpen: emergencyState.showCriteriaInfo,
      onClose: () => emergencyState.setShowCriteriaInfo(false),
      darkMode: darkMode,
      width: "max-w-4xl",
      contentClasses: "space-y-2",
      panelContentClasses: "grid grid-cols-1 md:grid-cols-2 gap-4",
      sectionTitleClasses: "font-medium mb-2",
      descriptionClasses: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`,
      parametersClasses: "space-y-1 text-sm"
    },

    getCriteriaPanel: (level: any) => ({
      key: level.id,
      title: `Niveau ${level.level} - ${level.label}`,
      icon: <UrgencyLevelIndicator level={level.level} showIcon={true} showNumber={false} size="sm" />,
      initiallyExpanded: level.level === 5
    }),

    getColorBadgeClasses: (color: string) => `px-2 py-1 rounded bg-${color}-100 text-${color}-800`,

    confirmationModal: {
      title: "Confirmation requise",
      isOpen: emergencyState.showConfirmation,
      onClose: () => emergencyState.setShowConfirmation(false),
      darkMode: darkMode,
      footer: (
        <ButtonGroup>
          <ActionButton
            label="Annuler"
            onClick={formattedConfig.handleCancel}
            variant="secondary"
          />
          <ActionButton
            label="Confirmer"
            onClick={formattedConfig.handleConfirmChange}
            variant="primary"
          />
        </ButtonGroup>
      ),
      contentClasses: "flex items-center mb-3",
      iconClasses: "h-5 w-5 text-yellow-500 mr-2",
      messageClasses: `text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
    },

    contactModal: {
      title: "Contacter le personnel du centre",
      isOpen: emergencyState.showContactModal,
      onClose: () => emergencyState.setShowContactModal(false),
      darkMode: darkMode,
      footer: (
        <ButtonGroup>
          <ActionButton
            label="Annuler"
            onClick={() => emergencyState.setShowContactModal(false)}
            variant="secondary"
          />
          <ActionButton
            label="Envoyer"
            onClick={formattedConfig.handleContactSubmit}
            variant="primary"
            icon={<Send className="h-4 w-4" />}
            disabled={!emergencyState.contactMessage.trim()}
          />
        </ButtonGroup>
      ),
      contentClasses: "mb-3",
      patientInfoClasses: `p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-3 flex justify-between`,
      patientNameClasses: "text-xs font-medium",
      patientDetailsClasses: "text-xs text-gray-500",
      clinicInfoClasses: "text-right",
      clinicNameClasses: "text-xs font-medium",
      clinicCodeClasses: "text-xs text-gray-500"
    },

    messageComposer: {
      value: emergencyState.contactMessage,
      onChange: emergencyState.setContactMessage,
      onSend: formattedConfig.handleContactSubmit,
      placeholder: "Écrivez votre message au personnel du centre...",
      darkMode: darkMode,
      attachmentTypes: [
        { 
          id: 'urgent', 
          label: 'Marquer urgent', 
          icon: <AlertTriangle size={14} className="mr-2 text-red-600" /> 
        }
      ],
      onMarkUrgent: () => formattedConfig.emergencyService.markMessageUrgent(emergencyState.contactMessage)
    }
  };
};

export const getEmergencyFloatingActionsConfig = (formattedConfig: any) => {
  const { emergencyState } = formattedConfig;

  return {
    actions: [
      {
        id: "help",
        icon: <HelpCircle className="h-4 w-4" />,
        label: "Aide",
        onClick: () => emergencyState.setShowCriteriaInfo(true)
      },
      {
        id: "refresh",
        icon: <RefreshCw className="h-4 w-4" />,
        label: "Actualiser",
        onClick: () => {
          emergencyState.setToastMessage("Données actualisées");
          emergencyState.setShowSuccessToast(true);
        }
      },
      {
        id: "export",
        icon: <Download className="h-4 w-4" />,
        label: "Exporter",
        onClick: () => formattedConfig.emergencyService.exportData('pdf')
      }
    ],
    position: "bottom-right" as const,
    color: "blue",
    showLabels: true
  };
};

// Fonctions utilitaires pour la configuration

const getTableColumns = (formattedConfig: any) => {
  const { handlePatientAction, emergencyState } = formattedConfig;

  return [
    {
      id: 'urgency',
      header: 'Urgence',
      accessor: (row: any) => (
        <UrgencyLevelIndicator
          level={row.urgency}
          showIcon={true}
          showNumber={true}
          size="sm"
        />
      ),
      sortable: true
    },
    {
      id: 'name',
      header: 'Patient',
      accessor: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.age} ans • {row.gender}</div>
        </div>
      ),
      sortable: true,
      filterable: true
    },
    {
      id: 'status',
      header: 'Statut',
      accessor: (row: any) => (
        <StatusBadge
          type={row.status === 'ready' ? 'success' : row.status === 'in_preparation' ? 'warning' : 'info'}
          label={row.status === 'ready' ? 'Prêt' : row.status === 'in_preparation' ? 'En préparation' : 'En attente'}
        />
      ),
      filterable: true
    },
    {
      id: 'waitTime',
      header: 'Attente',
      accessor: (row: any) => (
        <DynamicBadge
          label={`${row.waitTime} min`}
          variant={row.waitTime > 20 ? 'error' : row.waitTime > 10 ? 'warning' : 'success'}
          icon={<Clock className="h-3 w-3" />}
        />
      ),
      sortable: true
    },
    {
      id: 'clinic',
      header: 'Centre',
      accessor: (row: any) => (
        <div>
          <div className="text-xs font-medium">{row.clinicCode}</div>
          <div className="text-xs text-gray-500">{row.clinicName}</div>
        </div>
      ),
      filterable: true
    },
    {
      id: 'actions',
      header: 'Actions',
      accessor: (row: any) => (
        <ButtonGroup>
          <ActionButton
            label="Consulter"
            icon={<PlayCircle className="h-3 w-3" />}
            variant="primary"
            size="xs"
            onClick={() => handlePatientAction('consult', row)}
          />
          <ActionButton
            label="Contact"
            icon={<PhoneCall className="h-3 w-3" />}
            variant="secondary"
            size="xs"
            onClick={() => {
              emergencyState.setCurrentPatient(row);
              emergencyState.setShowContactModal(true);
            }}
          />
        </ButtonGroup>
      )
    }
  ];
};

const getStatsCards = (formattedConfig: any) => {
  const { pageData } = formattedConfig;
  const urgentPatients = pageData.patients.filter(p => p.urgency >= 4);
  const readyPatients = pageData.patients.filter(p => p.status === 'ready');
  const avgWaitTime = Math.round(
    pageData.patients.reduce((sum, p) => sum + p.waitTime, 0) / pageData.patients.length
  );
  const centers = new Set(pageData.patients.map(p => p.clinicCode));

  return [
    {
      title: "Patients urgents",
      value: urgentPatients.length,
      icon: <AlertTriangle className="h-4 w-4" />,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      title: "Temps d'attente moyen",
      value: avgWaitTime,
      suffix: "min",
      icon: <Clock className="h-4 w-4" />,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Patients prêts",
      value: readyPatients.length,
      icon: <CheckCircle className="h-4 w-4" />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Centres connectés",
      value: centers.size,
      icon: <Building className="h-4 w-4" />,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];
};

export const getEmergencyLayoutConfig = (formattedConfig: any) => {
  const { emergencyState } = formattedConfig;

  return {
    pageClasses: getEmergencyPageClasses(formattedConfig.darkMode),
    toolbarClasses: getToolbarClasses(formattedConfig.darkMode),
    mainLayoutClasses: getMainLayoutClasses(emergencyState.showHistoryPanel),
    showHistoryPanel: emergencyState.showHistoryPanel
  };
};

export const getEmergencyNotificationConfig = (formattedConfig: any) => {
  return {
    offlineAlert: {
      message: "Mode hors ligne actif - Les données sont stockées localement et seront synchronisées automatiquement une fois la connexion rétablie.",
      type: "warning" as const,
      isVisible: formattedConfig.emergencyState.showOfflineAlert,
      onClose: () => formattedConfig.emergencyState.setShowOfflineAlert(false),
      position: "top-center" as const,
      darkMode: formattedConfig.darkMode
    },
    successToast: {
      message: formattedConfig.emergencyState.toastMessage,
      type: "success" as const,
      isVisible: formattedConfig.emergencyState.showSuccessToast,
      onClose: () => formattedConfig.emergencyState.setShowSuccessToast(false),
      position: "bottom-right" as const
    }
  };
};

export const getEmergencyHistoryConfig = (formattedConfig: any) => {
  return {
    historyPanel: {
      title: "Historique des modifications",
      isOpen: true,
      onClose: () => formattedConfig.emergencyState.setShowHistoryPanel(false),
      darkMode: formattedConfig.darkMode
    },
    historyTracker: {
      history: formattedConfig.pageData.modificationHistory,
      maxHeight: "calc(100vh-16rem)",
      showFilter: false,
      showSearch: false,
      showExport: false
    }
  };
};