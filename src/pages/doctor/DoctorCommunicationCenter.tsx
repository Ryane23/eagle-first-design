import { useState, useRef, useEffect } from 'react';
import {
Users, Bell, Calendar, FileText, Settings, Menu, Home, MessageSquare, HelpCircle, Search, Moon, Sun, AlertTriangle, Wifi, WifiOff, ChevronDown, Send, Paperclip, ChevronRight, User, CheckCircle, PlusCircle, RefreshCw, Circle, PhoneCall, Info, AlertCircle, Trash2, Share2, Command, PanelRight, PanelLeft, Activity, ClipboardList, Shield, File, X, MoreVertical, Clock } from 'lucide-react';

// Imports des modules partagés (INCHANGÉS)
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { SearchInput } from '@forms/SearchInput';
import { AlertNotification } from '@feedback/AlertNotification';
import ChatInterface from '@communication/ChatInterface';
import { StatusBadge } from '@data-display/StatusBadge';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import { Modal } from '@modals/Modal';
import { SidePanel } from '@panels/SidePanel';
import { ConnectionStatus } from '@common/ConnectionStatus';
import MultiTabContainer from '@layout/MultiTabContainer';
import ToastNotification from '@feedback/ToastNotification';
import DynamicBadge from '@data-display/DynamicBadge';
import FloatingActionButton from '@buttons/FloatingActionButton';

// Imports des modules partagés identifiés comme étant en implémentation directe
import { useDarkMode } from '@hooks/useDarkMode';
import { useConnectionStatus } from '@hooks/useConnectionStatus';
import { useNotification } from '@hooks/useNotification';
import { useAppContext } from '@contexts/AppContext';
import { formatDateTime, formatTime } from '@utils/dateUtils';
import { formatWaitTime } from '@utils/statusUtils';
import { APP_NAME, USER_ROLES, NOTIFICATION_TYPES } from '@constants';
import { mockDoctorInfo } from '@mocks/doctors';
import mockNotificationsData from '@mocks/notifications';

const DoctorCommunicationCenter = () => {
  // Utilisation des hooks partagés (REMPLACEMENTS)
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { status: connectionStatus, toggleConnection } = useConnectionStatus();
  const { notifications, addNotification, markAsRead, markAllAsRead, removeNotification } = useNotification();
  const { state: appState } = useAppContext();

  // États locaux spécifiques à la page (INCHANGÉS)
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showPanel, setShowPanel] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplyModal, setShowQuickReplyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [patientFilter, setPatientFilter] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const chatEndRef = useRef(null);

  // Utilisation des données mockées partagées (REMPLACEMENT)
  const doctorInfo = mockDoctorInfo;

  // Configuration du menu latéral
  const menuItems = [
    {
      icon: <Home size={18} />,
      label: "Tableau de bord",
      path: "/dashboard",
      isActive: false
    },
    {
      icon: <Users size={18} />,
      label: "Salle d'attente",
      path: "/waiting-room",
      isActive: false
    },
    {
      icon: <AlertTriangle size={18} />,
      label: "Gestion des Urgences",
      path: "/emergency",
      isActive: false
    },
    {
      icon: <MessageSquare size={18} />,
      label: "Communications",
      path: "/communications",
      isActive: true
    },
    {
      icon: <Activity size={18} />,
      label: "Statistiques",
      path: "/statistics",
      isActive: false
    }
  ];

  const bottomMenuItems = [
    {
      icon: <HelpCircle size={18} />,
      label: "Aide",
      path: "/help"
    },
    {
      icon: <Settings size={18} />,
      label: "Paramètres",
      path: "/settings"
    }
  ];

  // Initialisation des notifications avec les données mockées partagées (REMPLACEMENT)
  useEffect(() => {
    mockNotificationsData.forEach(notification => {
      addNotification({
        title: notification.title,
        content: notification.message,
        time: notification.time,
        type: notification.type,
        isRead: notification.read
      });
    });
  }, [addNotification]);

  // Données simulées des contacts
  const contacts = [
    // Patients
    { 
      id: 1, 
      name: "Kamdem Paul", 
      category: "patient", 
      status: "actif", 
      info: "54 ans, Diabète",
      avatar: "KP",
      lastActivity: "Il y a 2h",
      unreadCount: 2,
      isUrgent: false,
      patientId: "PAT-12451"
    },
    { 
      id: 2, 
      name: "Mboula Alice", 
      category: "patient", 
      status: "actif", 
      info: "8 ans, Consultation fièvre",
      avatar: "MA",
      lastActivity: "Il y a 30 min",
      unreadCount: 0,
      isUrgent: true,
      patientId: "PAT-89732"
    },
    // Équipe médicale
    { 
      id: 4, 
      name: "Dr. Kamga Jean", 
      category: "team", 
      status: "online", 
      info: "Cardiologie",
      avatar: "KJ",
      lastActivity: "En ligne",
      unreadCount: 1,
      isUrgent: false,
      specialtyCode: "MED-CARDIO"
    },
    { 
      id: 5, 
      name: "Mbarga Paul", 
      category: "team", 
      status: "online", 
      info: "Infirmier",
      avatar: "MP",
      lastActivity: "Il y a 10 min",
      unreadCount: 0,
      isUrgent: false,
      roleCode: "INF-12"
    },
    // Laboratoire
    { 
      id: 9, 
      name: "Laboratoire Analyses", 
      category: "lab", 
      status: "online", 
      info: "Résultats examens",
      avatar: "LA",
      lastActivity: "Il y a 20 min",
      unreadCount: 1,
      isUrgent: false,
      serviceCode: "LAB-3"
    }
  ];

  // Données simulées de conversations adaptées pour ChatInterface
  const conversations = {
    1: [
      { id: 1, sender: "Kamdem Paul", time: "10:15", content: "Bonjour Docteur, j'ai une question concernant mes médicaments pour le diabète. Est-ce que je dois les prendre avant ou après les repas?", isUrgent: false, isOutgoing: false },
      { id: 2, sender: "Vous", time: "10:20", content: "Bonjour M. Kamdem, pour le Metformine, il est préférable de le prendre pendant ou juste après les repas pour réduire les effets indésirables digestifs. Pour le Gliclazide, prenez-le avant le petit déjeuner.", isUrgent: false, isOutgoing: true },
      { id: 3, sender: "Kamdem Paul", time: "10:22", content: "Merci Docteur. Et concernant les effets secondaires dont nous avions parlé la dernière fois, j'ai remarqué des picotements dans les pieds. Est-ce normal?", isUrgent: false, isOutgoing: false },
      { id: 4, sender: "Vous", time: "10:30", content: "Les picotements peuvent être liés à une neuropathie diabétique. C'est important de le surveiller. Pouvez-vous décrire plus précisément ces sensations et depuis quand elles ont commencé?", isUrgent: false, isOutgoing: true },
    ],
    2: [
      { id: 1, sender: "Infirmier Mbamba", time: "09:45", content: "Dr. Ndogo, la petite Mboula Alice vient d'arriver avec une fièvre de 39.5°C. Symptômes: maux de tête, frissons depuis hier soir. Parents très inquiets.", isUrgent: true, isOutgoing: false },
      { id: 2, sender: "Vous", time: "09:47", content: "Merci pour l'information. A-t-elle d'autres symptômes comme toux, difficultés respiratoires ou éruption cutanée?", isUrgent: false, isOutgoing: true },
      { id: 3, sender: "Infirmier Mbamba", time: "09:50", content: "Pas de toux ni d'éruption, mais elle se plaint de douleurs abdominales légères. Température actuelle 39.3°C après Doliprane il y a 1h.", isUrgent: false, isOutgoing: false },
      { id: 4, sender: "Vous", time: "09:52", content: "Je vais la voir en priorité. Merci de préparer un bilan sanguin standard et de lui donner un antipyrétique si la température remonte au-dessus de 39°C.", isUrgent: false, isOutgoing: true },
    ],
    4: [
      { id: 1, sender: "Dr. Kamga Jean", time: "14:30", content: "Bonjour Sarah, j'ai un patient de 62 ans avec des antécédents de pneumopathie qui présente des symptômes respiratoires atypiques. Pourrais-tu jeter un œil à son dossier quand tu auras un moment?", isUrgent: false, isOutgoing: false },
      { id: 2, sender: "Vous", time: "14:45", content: "Bonjour Jean, bien sûr. Quels sont ces symptômes atypiques qui t'interpellent?", isUrgent: false, isOutgoing: true },
      { id: 3, sender: "Dr. Kamga Jean", time: "14:50", content: "Merci. Il présente une toux sèche persistante depuis 3 semaines, fatigue importante, mais sans fièvre ni expectoration. L'auscultation montre des crépitants bilatéraux mais la radio thoracique est peu contributive.", isUrgent: false, isOutgoing: false, hasAttachment: true, attachmentName: "DossierPneumo_62A.pdf" },
    ],
  };

  const messages = selectedContact && conversations[selectedContact.id] ? conversations[selectedContact.id].map(msg => ({
    id: msg.id,
    sender: msg.sender,
    senderRole: msg.isOutgoing ? 'doctor' : 'other',
    content: msg.content,
    timestamp: msg.time,
    isCurrentUser: msg.isOutgoing
  })) : [];

  // Configuration des onglets pour MultiTabContainer
  const contactTabs = [
    {
      id: 'all',
      label: 'Tous',
      icon: <Users size={12} />,
      content: null
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: <User size={12} />,
      content: null
    },
    {
      id: 'team',
      label: 'Équipe',
      icon: <Users size={12} />,
      content: null
    },
    {
      id: 'urgent',
      label: 'Urgent',
      icon: <AlertTriangle size={12} />,
      content: null
    }
  ];

  // Fonction pour obtenir l'icône du type de contact
  const getContactIcon = (category) => {
    switch(category) {
      case 'patient':
        return <User size={18} className="text-blue-500" />;
      case 'team':
        return <Users size={18} className="text-green-500" />;
      case 'lab':
        return <FileText size={18} className="text-purple-500" />;
      default:
        return <User size={18} />;
    }
  };

  // Nombre de notifications non lues (UTILISATION du hook partagé)
  const unreadNotificationsCount = notifications.filter(notif => !notif.isRead).length;
  
  // Messages non lus et urgents
  const unreadUrgentCount = contacts.filter(contact => contact.unreadCount > 0 && contact.isUrgent).length;
  const pendingActionsCount = 3; // Simulé pour l'exemple
  
  // Fonction de sélection d'un contact
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  // Fonction d'envoi de message
  const handleSendMessage = (message) => {
    if (message.trim() === '' || !selectedContact) return;
    
    // Afficher une notification toast
    setToastMessage('Message envoyé avec succès');
    setToastType('success');
    setShowToast(true);
    
    setTimeout(() => setIsTyping(true), 2000);
    setTimeout(() => setIsTyping(false), 5000);
  };

  // Fonctions de gestion des notifications (UTILISATION des hooks partagés)
  const markNotificationAsRead = (id) => {
    markAsRead(id);
  };

  const markAllNotificationsAsRead = () => {
    markAllAsRead();
  };

  const deleteNotification = (id) => {
    removeNotification(id);
  };

  // Filtrer les contacts en fonction de la recherche et de l'onglet actif
  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.info.toLowerCase().includes(searchLower)
    );

    if (patientFilter !== 'all' && contact.category === 'patient') {
      if (patientFilter === 'active' && contact.status !== 'actif') return false;
      if (patientFilter === 'archived' && contact.status !== 'archivé') return false;
    }

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'patients') return matchesSearch && contact.category === 'patient';
    if (activeTab === 'team') return matchesSearch && contact.category === 'team';
    if (activeTab === 'urgent') return matchesSearch && contact.isUrgent;
    if (activeTab === 'archived') return matchesSearch && contact.status === 'archivé';
    
    return matchesSearch;
  });

  // Fonction pour formater le statut
  const getStatusColor = (status) => {
    if (status === 'online') return 'text-green-500';
    if (status === 'actif') return 'text-blue-500';
    if (status === 'archivé') return 'text-gray-400';
    return 'text-gray-400';
  };

  // Fonction pour obtenir la couleur d'avatar en fonction de la catégorie
  const getAvatarColor = (category) => {
    switch(category) {
      case 'patient':
        return 'bg-blue-100 text-blue-700';
      case 'team':
        return 'bg-green-100 text-green-700';
      case 'lab':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Actions flottantes
  const floatingActions = [
    {
      id: 'new-message',
      icon: <PlusCircle size={16} />,
      label: 'Nouveau message',
      onClick: () => {
        setToastMessage('Nouvelle conversation démarrée');
        setToastType('info');
        setShowToast(true);
      }
    },
    {
      id: 'share-dpi',
      icon: <Share2 size={16} />,
      label: 'Partager DPI',
      onClick: () => {
        setToastMessage('DPI partagé');
        setToastType('success');
        setShowToast(true);
      }
    }
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <Sidebar
        appName={APP_NAME}
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <Header
          title="Centre de Communications"
          centerInfo={{
            name: doctorInfo.clinique,
            code: doctorInfo.clinicCode,
            type: doctorInfo.specialty
          }}
          isOnline={connectionStatus.isOnline}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          user={{
            initials: doctorInfo.name.split(' ').map(n => n[0]).join(''),
            name: doctorInfo.name
          }}
          notificationCount={unreadNotificationsCount}
          extraHeaderItems={
            <div className="flex items-center space-x-2">
              <DynamicBadge
                label="Consultations"
                variant="info"
                count={5}
                icon={<Clock size={12} />}
              />
              <DynamicBadge
                label="Urgent"
                variant="error"
                count={unreadUrgentCount}
                icon={<AlertTriangle size={12} />}
                pulsating={unreadUrgentCount > 0}
              />
              <ActionButton
                label={showPanel ? "Panneau" : "Panneau"}
                icon={showPanel ? <PanelRight size={12} /> : <PanelLeft size={12} />}
                variant="secondary"
                size="xs"
                onClick={() => setShowPanel(!showPanel)}
              />
            </div>
          }
        />
        
        {/* Contenu principal - affichage flexible */}
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des contacts */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
            {/* Recherche et actions */}
            <div className="p-2 border-b border-gray-200">
              <div className="mb-2">
                <SearchInput
                  darkMode={darkMode}
                  placeholder="Rechercher conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <ButtonGroup>
                <ActionButton
                  label="Nouveau message"
                  icon={<PlusCircle size={14} />}
                  variant="primary"
                  size="xs"
                  onClick={() => {
                    setToastMessage('Nouvelle conversation');
                    setToastType('info');
                    setShowToast(true);
                  }}
                />
                <ActionButton
                  label="Partager DPI"
                  icon={<Share2 size={14} />}
                  variant="success"
                  size="xs"
                  onClick={() => {
                    setToastMessage('DPI partagé');
                    setToastType('success');
                    setShowToast(true);
                  }}
                />
                <ActionButton
                  icon={<CheckCircle size={14} />}
                  variant="secondary"
                  size="xs"
                  onClick={() => setShowQuickReplyModal(true)}
                />
              </ButtonGroup>
            </div>
            
            {/* Onglets avec MultiTabContainer */}
            <div className="border-b border-gray-200">
              <MultiTabContainer
                tabs={contactTabs}
                defaultTabId={activeTab}
                onChange={setActiveTab}
                orientation="horizontal"
              />
            </div>
            
            {/* Filtres pour patients si l'onglet patients est actif */}
            {activeTab === 'patients' && (
              <div className="flex p-2 space-x-1 text-xs border-b border-gray-200">
                <select 
                  className={`w-full p-1.5 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  value={patientFilter}
                  onChange={(e) => setPatientFilter(e.target.value)}
                >
                  <option value="all">Tous les patients</option>
                  <option value="active">Patients actifs</option>
                  <option value="archived">Patients archivés</option>
                  <option value="recent">Consultations récentes</option>
                </select>
              </div>
            )}
            
            {/* Liste des contacts */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`p-2 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer ${selectedContact?.id === contact.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAvatarColor(contact.category)} mr-2`}>
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{contact.name}</p>
                        <span className="text-xs text-gray-500">{contact.lastActivity}</span>
                      </div>
                      <div className="flex items-center">
                        <StatusBadge
                          type={contact.status === 'online' ? 'online' : contact.status === 'actif' ? 'success' : 'offline'}
                        />
                        <p className="text-xs text-gray-500 truncate ml-1">{contact.info}</p>
                      </div>
                    </div>
                    {contact.unreadCount > 0 && (
                      <DynamicBadge
                        label={contact.unreadCount.toString()}
                        variant="info"
                        size="xs"
                        rounded="full"
                      />
                    )}
                  </div>
                  {contact.isUrgent && (
                    <div className="mt-1">
                      <DynamicBadge
                        label="Attention requise"
                        variant="error"
                        size="xs"
                        icon={<AlertTriangle size={10} />}
                        pulsating
                        rounded="full"
                      />
                    </div>
                  )}
                </div>
              ))}
                
              {filteredContacts.length === 0 && (
                <div className="p-3 text-center text-sm text-gray-500">
                  Aucun contact ne correspond à votre recherche
                </div>
              )}
            </div>
            
            {/* Actions rapides */}
            <div className="p-2 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium">Actions rapides</span>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Personnaliser
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1 mb-2">
                <ActionButton
                  label="Consultation"
                  icon={<Users size={14} />}
                  variant="info"
                  size="xs"
                />
                <ActionButton
                  label="Prescription"
                  icon={<FileText size={14} />}
                  variant="success"
                  size="xs"
                />
                <ActionButton
                  label="Rendez-vous"
                  icon={<Clock size={14} />}
                  variant="warning"
                  size="xs"
                />
                <ActionButton
                  label="Actualiser"
                  icon={<RefreshCw size={14} />}
                  variant="secondary"
                  size="xs"
                />
              </div>
              <ActionButton
                label="Actualiser conversations"
                icon={<RefreshCw size={14} />}
                variant="secondary"
                size="xs"
                fullWidth
              />
            </div>
          </div>
          
          {/* Zone de chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedContact ? (
              <>
                {/* En-tête de conversation */}
                <div className={`p-2 flex items-center justify-between border-b ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAvatarColor(selectedContact.category)} mr-2`}>
                      {selectedContact.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm flex items-center">
                        {selectedContact.name}
                        {selectedContact.isUrgent && (
                          <DynamicBadge
                            label="Urgent"
                            variant="error"
                            size="xs"
                            icon={<AlertTriangle size={10} />}
                            className="ml-2"
                          />
                        )}
                      </h3>
                      <div className="flex items-center">
                        <StatusBadge
                          type={selectedContact.status === 'online' ? 'online' : selectedContact.status === 'actif' ? 'success' : 'offline'}
                        />
                        <span className="text-xs text-gray-500 ml-1">{selectedContact.info}</span>
                        {selectedContact.category === 'patient' && (
                          <DynamicBadge
                            label={selectedContact.patientId}
                            variant="info"
                            size="xs"
                            className="ml-1"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <ButtonGroup>
                    {selectedContact.category === 'patient' && (
                      <ActionButton
                        label="Partager DPI"
                        icon={<Share2 size={14} />}
                        variant="info"
                        size="xs"
                      />
                    )}
                    {selectedContact.category === 'team' && (
                      <ActionButton
                        label="Appeler"
                        icon={<PhoneCall size={14} />}
                        variant="info"
                        size="xs"
                      />
                    )}
                    <ActionButton
                      label="Détails"
                      icon={<Info size={14} />}
                      variant="secondary"
                      size="xs"
                    />
                    <ActionButton
                      icon={<MoreVertical size={14} />}
                      variant="secondary"
                      size="xs"
                    />
                  </ButtonGroup>
                </div>
                
                {/* Interface de chat */}
                <div className="flex-1">
                  <ChatInterface
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    title={`Discussion avec ${selectedContact.name}`}
                    placeholder="Tapez votre message..."
                    maxHeight="100%"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-lg mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-sm text-gray-500 mb-4">Sélectionnez un contact pour échanger des messages</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Panneau d'informations */}
          {showPanel && (
            <SidePanel
              title="Informations"
              isOpen={showPanel}
              onClose={() => setShowPanel(false)}
              darkMode={darkMode}
              width="w-64"
            >
              {/* Onglets du panneau d'informations */}
              <div className="flex mb-3 border rounded-md overflow-hidden">
                <button className="flex-1 py-1 px-2 text-xs bg-blue-600 text-white">
                  Contact
                </button>
                <button className="flex-1 py-1 px-2 text-xs bg-white text-gray-800">
                  Journal
                </button>
                <button className="flex-1 py-1 px-2 text-xs bg-white text-gray-800">
                  Stats
                </button>
              </div>
              
              {selectedContact ? (
                <>
                  {/* Détails du contact */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">Détails du contact</h4>
                    <div className="flex items-center mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(selectedContact.category)} mr-2`}>
                        {selectedContact.avatar}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm">{selectedContact.name}</h5>
                        <p className="text-xs text-gray-500">{selectedContact.info}</p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-100'} text-xs mb-2`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Catégorie</span>
                        <span className="font-medium">
                          {selectedContact.category === 'patient' ? 'Patient' : 
                           selectedContact.category === 'team' ? 'Équipe médicale' : 
                           selectedContact.category === 'lab' ? 'Laboratoire' : 
                           selectedContact.category}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-500">Statut</span>
                        <StatusBadge
                          type={selectedContact.status === 'online' ? 'online' : selectedContact.status === 'actif' ? 'success' : 'offline'}
                          label={selectedContact.status === 'online' ? 'En ligne' : 
                                 selectedContact.status === 'actif' ? 'Actif' : 
                                 selectedContact.status === 'archivé' ? 'Archivé' : 
                                 selectedContact.status}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Code</span>
                        <span className="font-medium">
                          {selectedContact.category === 'patient' ? selectedContact.patientId : 
                           selectedContact.category === 'team' ? (selectedContact.specialtyCode || selectedContact.roleCode) : 
                           selectedContact.serviceCode}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions spécifiques selon le type de contact */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium mb-2">
                      Actions {selectedContact.category === 'patient' ? 'patient' : 
                              selectedContact.category === 'team' ? 'équipe' : 'service'}
                    </h4>
                    <div className="space-y-2">
                      {selectedContact.category === 'patient' ? (
                        <>
                          <ActionButton
                            label="Consulter DPI"
                            icon={<FileText size={14} />}
                            variant="info"
                            size="xs"
                            fullWidth
                          />
                          <ActionButton
                            label="Nouvelle ordonnance"
                            icon={<PlusCircle size={14} />}
                            variant="success"
                            size="xs"
                            fullWidth
                          />
                          <ActionButton
                            label="Partager DPI"
                            icon={<Share2 size={14} />}
                            variant="warning"
                            size="xs"
                            fullWidth
                          />
                        </>
                      ) : selectedContact.category === 'team' ? (
                        <>
                          <ActionButton
                            label="Appeler"
                            icon={<PhoneCall size={14} />}
                            variant="info"
                            size="xs"
                            fullWidth
                          />
                          <ActionButton
                            label="Consultation conjointe"
                            icon={<Users size={14} />}
                            variant="success"
                            size="xs"
                            fullWidth
                          />
                        </>
                      ) : (
                        <>
                          <ActionButton
                            label="Voir résultats"
                            icon={<File size={14} />}
                            variant="info"
                            size="xs"
                            fullWidth
                          />
                          <ActionButton
                            label="Nouvelle demande"
                            icon={<PlusCircle size={14} />}
                            variant="success"
                            size="xs"
                            fullWidth
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Journal de communication */}
                  <div>
                    <h4 className="text-xs font-medium mb-2">Journal de communication</h4>
                    <div className={`mb-2 p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-100'} text-xs`}>
                      <p className="font-medium">Dernier échange</p>
                      <p className="text-gray-500 mb-1">Aujourd'hui, 10:30</p>
                      <p>Communication sur suivi de traitement</p>
                    </div>
                    <div className={`mb-2 p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-100'} text-xs`}>
                      <p className="font-medium">Partage DPI</p>
                      <p className="text-gray-500 mb-1">Il y a 2 jours</p>
                      <p>Droits accordés à l'infirmier Mbarga</p>
                    </div>
                    <div className={`mb-2 p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-100'} text-xs`}>
                      <p className="font-medium">Résultats d'examens</p>
                      <p className="text-gray-500 mb-1">Il y a 1 semaine</p>
                      <p>Envoi de résultats d'analyses biologiques</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Info size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Sélectionnez un contact pour voir les détails</p>
                </div>
              )}
              
              {/* Actions générales */}
              <div className="mt-4">
                <ActionButton
                  label="Actualiser"
                  icon={<RefreshCw size={14} />}
                  variant="secondary"
                  size="xs"
                  fullWidth
                />
              </div>
            </SidePanel>
          )}
        </div>
      </div>
      
      {/* Modal de réponses rapides */}
      <Modal
        title="Réponses rapides"
        isOpen={showQuickReplyModal}
        onClose={() => setShowQuickReplyModal(false)}
        darkMode={darkMode}
        width="max-w-md"
      >
        <div className="mb-2">
          <SearchInput
            darkMode={darkMode}
            placeholder="Rechercher une réponse rapide..."
            className="mb-2"
          />
          
          <div className="flex space-x-1 mb-2">
            <ActionButton label="Tous" variant="primary" size="xs" />
            <ActionButton label="Patient" variant="secondary" size="xs" />
            <ActionButton label="Équipe" variant="secondary" size="xs" />
            <ActionButton label="Urgence" variant="secondary" size="xs" />
          </div>
        </div>
        
        <div className="mb-4 max-h-72 overflow-y-auto">
          <div className="p-2 bg-blue-50 rounded-md mb-2 cursor-pointer hover:bg-blue-100">
            <h4 className="font-medium">Résultats normaux</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              J'ai analysé vos résultats d'examens et tout est dans les valeurs normales. Continuez le traitement prescrit et prenez rendez-vous pour un suivi dans 3 mois.
            </p>
            <div className="flex justify-end mt-1">
              <ActionButton label="Utiliser" variant="primary" size="xs" />
            </div>
          </div>
          <div className="p-2 bg-blue-50 rounded-md mb-2 cursor-pointer hover:bg-blue-100">
            <h4 className="font-medium">Transfert urgent</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              Patient nécessitant une prise en charge urgente. Antécédents: [ANTÉCÉDENTS]. Symptômes actuels: [SYMPTÔMES]. Traitement initié: [TRAITEMENT]. Merci de confirmer la réception.
            </p>
            <div className="flex justify-end mt-1">
              <ActionButton label="Utiliser" variant="primary" size="xs" />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <ActionButton
              label="Créer nouvelle réponse"
              icon={<PlusCircle size={12} />}
              variant="success"
              size="xs"
            />
          </div>
        </div>
      </Modal>
      
      {/* Bouton d'action flottant */}
      <FloatingActionButton
        actions={floatingActions}
        mainIcon={<MessageSquare size={20} />}
        position="bottom-right"
        color="blue"
        showLabels
      />
      
      {/* Notifications Toast */}
      {showToast && (
        <ToastNotification
          type={toastType}
          message={toastMessage}
          duration={3000}
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Status de connexion */}
      <ConnectionStatus
        isOnline={connectionStatus.isOnline}
        onToggleConnection={toggleConnection}
        showControls={false}
        showFullAlert={!connectionStatus.isOnline}
        darkMode={darkMode}
      />
    </div>
  );
};

export default DoctorCommunicationCenter;