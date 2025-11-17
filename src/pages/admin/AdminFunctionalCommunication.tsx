import React, { useState, useRef, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, AlertTriangle, Share2, MapPin, MoreVertical, User, Clock, CheckCircle, PlusCircle, RefreshCw, UserPlus, Circle, Phone, PhoneCall, Info, AlertCircle, Trash2, Monitor, Command, Star, StarHalf, Smartphone, ChevronLeft, Maximize, BarChart2, Shield, Radio, Database, ChevronsUp, Server, Lock, UserCheck, Briefcase, Sliders, Key, PenTool, Archive, Send, Paperclip, Image, Video, File, ChevronRight, ArrowRight
} from 'lucide-react';

// Import des composants partagés
import { Sidebar } from '@layout/Sidebar';
import { Header } from '@layout/Header';
import { SearchInput } from '@forms/SearchInput';
import { ConnectionStatus } from '@common/ConnectionStatus';
import { Modal } from '@modals/Modal';
import { AlertNotification } from '@feedback/AlertNotification';
import ToastNotification from '@feedback/ToastNotification';
import ThemeSwitcher from '@common/ThemeSwitcher';
import ChatInterface from '@communication/ChatInterface';
import { StatusBadge } from '@data-display/StatusBadge';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import MultiTabContainer from '@layout/MultiTabContainer';
import DynamicBadge from '@data-display/DynamicBadge';
import UrgencyLevelIndicator from '@medical/UrgencyLevelIndicator';
import ExpandablePanel from '@panels/ExpandablePanel';
import FilterableTable from '@data-display/FilterableTable';
import FloatingActionButton from '@buttons/FloatingActionButton';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';

// Import des hooks partagés
import { useNotification } from '@hooks/useNotification';
import { useDarkMode } from '@hooks/useDarkMode';
import { useConnectionStatus } from '@hooks/useConnectionStatus';

// Import des services partagés
import { notificationService } from '@services/notificationService';

// Import des constants partagées
import { USER_ROLES, NOTIFICATION_TYPES } from '@constants';
import { COLORS } from '@constants/colors';

// Import des types partagés
import { User as Usertype, Notification as NotificationType } from '@types';

// Import des utils partagés
import { formatDateTime, formatTime } from '@utils/dateUtils';

const AdminFunctionalCommunication = () => {
  // États avec hooks partagés
  const [navCollapsed, setNavCollapsed] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { status: connectionStatus, toggleConnection } = useConnectionStatus();
  const { notifications, addNotification, markAsRead, markAllAsRead, removeNotification } = useNotification();
  
  // États locaux
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showPanel, setShowPanel] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isTyping, setIsTyping] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('normal');
  const [recipientType, setRecipientType] = useState('all');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState('system');
  const [showNotifications, setShowNotifications] = useState(false);
  const [createNewMessageModal, setCreateNewMessageModal] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState('');
  const [toasts, setToasts] = useState([]);

  const chatEndRef = useRef(null);

  // Centre principal (Admin)
  const centerInfo = {
    name: "Administration Fonctionnelle - Douala",
    code: "ADM-FUNC",
    type: "Centre Principal"
  };

  // Fonction pour afficher un toast
  const showToast = (message, type = 'info') => {
    const toast = {
      id: Date.now(),
      message,
      type,
      onClose: () => setToasts(prev => prev.filter(t => t.id !== toast.id))
    };
    setToasts(prev => [...prev, toast]);
  };

  // Utilisation des données mockées partagées
  const { recipients, conversations, stats } = adminCommunicationMockData;

  // Initialisation des notifications avec le service partagé
  useEffect(() => {
    const initialNotifications = [
      {
        title: "Mise à jour des permissions",
        content: "Les permissions RBAC des infirmiers ont été modifiées avec succès.",
        time: "Il y a 35 minutes",
        type: "success",
        isRead: false
      },
      {
        title: "Alerte système",
        content: "Utilisation CPU > 90% sur le serveur principal. Action requise.",
        time: "Il y a 2 heures",
        type: "error",
        isRead: true
      },
      {
        title: "Nouvelle demande",
        content: "Dr. Kamga Jean a demandé une modification de ses permissions.",
        time: "Il y a 5 heures",
        type: "info",
        isRead: false
      },
      {
        title: "Maintenance programmée",
        content: "Maintenance système prévue dimanche à 22h00.",
        time: "Hier à 14:30",
        type: "warning",
        isRead: false
      },
      {
        title: "Sauvegarde réussie",
        content: "La sauvegarde quotidienne a été complétée avec succès.",
        time: "Hier à 10:15",
        type: "success",
        isRead: true
      }
    ];
    
    initialNotifications.forEach(notif => addNotification(notif));
  }, [addNotification]);

  // Fonction pour obtenir l'icône du type de destinataire
  const getRecipientIcon = (type) => {
    switch(type) {
      case 'clinic':
        return <Monitor size={18} />;
      case 'doctor':
        return <User size={18} />;
      case 'secretary':
        return <FileText size={18} />;
      case 'system':
        return <Server size={18} className="text-purple-500" />;
      case 'nurse':
        return <Activity size={18} className="text-green-500" />;
      default:
        return <User size={18} />;
    }
  };

  // Fonction de sélection d'un destinataire
  const handleSelectRecipient = (recipient) => {
    setSelectedRecipient(recipient);
    // Simuler un délai de chargement puis indiquer que le message a été lu
    setTimeout(() => {
      const updatedRecipients = [...recipients];
      const index = updatedRecipients.findIndex(r => r.id === recipient.id);
      if (index !== -1) {
        updatedRecipients[index].unreadCount = 0;
      }
    }, 1000);
  };

  // Fonction d'envoi de message
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedRecipient) return;
    
    // Dans une application réelle, on enverrait le message au backend
    // Ici on simule l'ajout du message à la conversation
    setMessageInput('');
    // Après envoi, simuler "tapant..."
    setTimeout(() => setIsTyping(true), 2000);
    // Puis simuler une réponse
    setTimeout(() => setIsTyping(false), 5000);
  };

  // Fonction d'envoi de broadcast
  const handleSendBroadcast = () => {
    if (broadcastMessage.trim() === '') return;
    // Ici on simulerait l'envoi du message à tous les destinataires sélectionnés
    // Réinitialiser les champs et fermer le modal
    setBroadcastMessage('');
    setBroadcastPriority('normal');
    setRecipientType('all');
    setShowBroadcastModal(false);
    
    // Utiliser le système de toast
    showToast(`Message envoyé avec succès aux ${recipientType === 'all' ? 'utilisateurs' : recipientType}.`, 'success');
  };

  // Fonction pour sélectionner un modèle de message
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setBroadcastMessage(template.content);
    setShowTemplateModal(false);
  };

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRecipient, conversations]);

  // Filtrer les destinataires en fonction de la recherche et de l'onglet actif
  const filteredRecipients = recipients.filter(recipient => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      recipient.name.toLowerCase().includes(searchLower) ||
      recipient.code.toLowerCase().includes(searchLower) ||
      recipient.contact.toLowerCase().includes(searchLower)
    );

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'urgent') return matchesSearch && recipient.hasUrgentMessage;
    if (activeTab === 'system') return matchesSearch && recipient.type === 'system';
    if (activeTab === 'admin') return matchesSearch && recipient.type === 'admin';
    if (activeTab === 'resolved') return matchesSearch && recipient.unreadCount === 0 && !recipient.hasUrgentMessage;
    
    return matchesSearch;
  });

  // Menu items pour la Sidebar
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <AlertTriangle size={18} />, label: "Gestion des Urgences", path: "#", isActive: false },
    { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
    { icon: <ClipboardList size={18} />, label: "Post Consultation", path: "#", isActive: false },
    { icon: <MessageSquare size={18} />, label: "Communication", path: "#", isActive: true },
    { icon: <UserCheck size={18} />, label: "Gestion des comptes", path: "#", isActive: false },
    { icon: <Lock size={18} />, label: "Permissions RBAC", path: "#", isActive: false },
    { icon: <Sliders size={18} />, label: "Configuration", path: "#", isActive: false },
    { icon: <BarChart2 size={18} />, label: "Monitoring technique", path: "#", isActive: false }
  ];

  // Bottom menu items pour Sidebar
  const bottomMenuItems = [
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];

  // Convertir les messages du destinataire sélectionné pour ChatInterface
  const formatMessagesForChatInterface = () => {
    if (!selectedRecipient || !conversations[selectedRecipient.id]) return [];
    
    return conversations[selectedRecipient.id].map(msg => ({
      id: msg.id,
      sender: msg.sender,
      senderRole: msg.sender === "Système" ? "system" : (msg.isOutgoing ? "you" : "user"),
      content: msg.content,
      timestamp: msg.time,
      isCurrentUser: msg.isOutgoing
    }));
  };

  // Configuration des onglets pour MultiTabContainer
  const tabsConfig = [
    { 
      id: 'all', 
      label: 'Tous', 
      content: <RecipientsList recipients={filteredRecipients} onSelect={handleSelectRecipient} selectedRecipient={selectedRecipient} darkMode={darkMode} /> 
    },
    { 
      id: 'urgent', 
      label: 'Urgents', 
      badge: recipients.filter(r => r.hasUrgentMessage).length,
      content: <RecipientsList recipients={filteredRecipients} onSelect={handleSelectRecipient} selectedRecipient={selectedRecipient} darkMode={darkMode} /> 
    },
    { 
      id: 'system', 
      label: 'Système', 
      content: <RecipientsList recipients={filteredRecipients} onSelect={handleSelectRecipient} selectedRecipient={selectedRecipient} darkMode={darkMode} /> 
    },
    { 
      id: 'admin', 
      label: 'Admin', 
      content: <RecipientsList recipients={filteredRecipients} onSelect={handleSelectRecipient} selectedRecipient={selectedRecipient} darkMode={darkMode} /> 
    },
    { 
      id: 'resolved', 
      label: 'Résolus', 
      content: <RecipientsList recipients={filteredRecipients} onSelect={handleSelectRecipient} selectedRecipient={selectedRecipient} darkMode={darkMode} /> 
    }
  ];

  // Actions rapides flottantes
  const quickActions = [
    { 
      id: 'broadcast', 
      icon: <Share2 />, 
      label: 'Message groupé', 
      onClick: () => setShowBroadcastModal(true) 
    },
    { 
      id: 'template', 
      icon: <Archive />, 
      label: 'Modèles', 
      onClick: () => setShowTemplateModal(true) 
    },
    { 
      id: 'new-message', 
      icon: <PlusCircle />, 
      label: 'Nouveau message', 
      onClick: () => setCreateNewMessageModal(true) 
    }
  ];

  // Nombre de notifications non lues
  const unreadNotificationsCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation latérale avec composant partagé */}
      <Sidebar 
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* En-tête avec composant partagé */}
        <Header
          title="Communication Administrateur Fonctionnel"
          subtitle=""
          centerInfo={centerInfo}
          isOnline={connectionStatus.isOnline}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          user={{
            initials: "BM",
            name: "Bertrand Moyo"
          }}
          notificationCount={unreadNotificationsCount}
          extraHeaderItems={
            <ActionButton
              label={showPanel ? "Panneau" : "Panneau"}
              icon={showPanel ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
              variant="secondary"
              size="xs"
              onClick={() => setShowPanel(!showPanel)}
            />
          }
        />
        
        {/* Contenu principal - affichage flexible */}
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des destinataires */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
            {/* Recherche et actions */}
            <div className="p-2 border-b border-gray-200">
              <div className="relative mb-2">
                <SearchInput 
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  darkMode={darkMode}
                  width="w-full"
                />
              </div>
              <ButtonGroup>
                <ActionButton
                  label="Nouveau message"
                  icon={<PlusCircle size={14} />}
                  variant="primary"
                  size="xs"
                  onClick={() => setCreateNewMessageModal(true)}
                  fullWidth
                />
                <ActionButton
                  label="Message groupé"
                  icon={<Share2 size={14} />}
                  variant="success"
                  size="xs"
                  onClick={() => setShowBroadcastModal(true)}
                  fullWidth
                />
              </ButtonGroup>
            </div>
            
            {/* Onglets avec MultiTabContainer */}
            <div className="flex-1 overflow-hidden">
              <MultiTabContainer 
                tabs={tabsConfig}
                defaultTabId="all"
                onChange={setActiveTab}
                orientation="horizontal"
              />
            </div>
            
            {/* Actions */}
            <div className="p-2 border-t border-gray-200">
              <ActionButton
                label="Actualiser statuts"
                icon={<RefreshCw size={14} />}
                variant="secondary"
                size="sm"
                onClick={() => showToast('Statuts actualisés', 'info')}
                fullWidth
              />
            </div>
          </div>
          
          {/* Zone de chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedRecipient ? (
              <>
                {/* En-tête de conversation */}
                <div className={`p-2 flex items-center justify-between border-b ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center">
                    <div className="mr-2 relative">
                      {getRecipientIcon(selectedRecipient.type)}
                      <Circle size={8} className={`absolute bottom-0 right-0 ${selectedRecipient.status === 'online' ? 'text-green-500' : 'text-gray-400'} fill-current`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{selectedRecipient.name}</h3>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{selectedRecipient.contact}</span>
                        <DynamicBadge 
                          label={selectedRecipient.code}
                          variant="info"
                          size="xs"
                        />
                      </div>
                    </div>
                  </div>
                  <ButtonGroup>
                    {selectedRecipient.type !== 'system' && (
                      <ActionButton
                        label="Appeler"
                        icon={<PhoneCall size={14} />}
                        variant="info"
                        size="xs"
                        onClick={() => showToast('Fonction d\'appel non implémentée', 'info')}
                      />
                    )}
                    <ActionButton
                      label="Détails"
                      icon={<Info size={14} />}
                      variant="secondary"
                      size="xs"
                      onClick={() => showToast('Détails du contact', 'info')}
                    />
                    <ActionButton
                      label=""
                      icon={<MoreVertical size={14} />}
                      variant="secondary"
                      size="xs"
                      onClick={() => {}}
                    />
                  </ButtonGroup>
                </div>
                
                {/* Messages - Utilisation du composant partagé ChatInterface */}
                {selectedRecipient && conversations[selectedRecipient.id] ? (
                  <ChatInterface 
                    messages={formatMessagesForChatInterface()}
                    onSendMessage={handleSendMessage}
                    title=""
                    placeholder="Écrivez votre message..."
                    maxHeight="calc(100vh - 200px)"
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-6">
                      <MessageSquare size={48} className="mx-auto mb-2 text-gray-400" />
                      <h3 className="font-medium text-sm mb-1">Aucun message</h3>
                      <p className="text-xs text-gray-500">Démarrer une nouvelle conversation</p>
                    </div>
                  </div>
                )}
                
                {/* Zone de saisie personnalisée (conservée ici car elle a des fonctionnalités spécifiques) */}
                <div className={`p-2 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-end space-x-2">
                    <div className="relative flex-1">
                      <textarea 
                        placeholder="Tapez votre message..." 
                        className={`w-full p-2 pr-8 rounded-md text-sm resize-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                        rows="2"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      ></textarea>
                      <div className="absolute right-2 bottom-2">
                        <ActionButton
                          label=""
                          icon={<Paperclip size={16} />}
                          variant="secondary"
                          size="xs"
                          onClick={() => setShowAttachMenu(!showAttachMenu)}
                        />
                        
                        {showAttachMenu && (
                          <div className="absolute bottom-6 right-0 bg-white rounded-md shadow-lg py-1 w-40">
                            <ActionButton
                              label="Document"
                              icon={<File size={14} />}
                              variant="light"
                              size="xs"
                              onClick={() => {}}
                              fullWidth
                            />
                            <ActionButton
                              label="Image"
                              icon={<Image size={14} />}
                              variant="light"
                              size="xs"
                              onClick={() => {}}
                              fullWidth
                            />
                            <ActionButton
                              label="Permission RBAC"
                              icon={<Key size={14} />}
                              variant="light"
                              size="xs"
                              onClick={() => {}}
                              fullWidth
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <ActionButton
                      label=""
                      icon={<Send size={18} />}
                      variant="primary"
                      size="md"
                      onClick={handleSendMessage}
                      disabled={messageInput.trim() === ''}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                    <ButtonGroup>
                      <ActionButton
                        label="Urgent"
                        icon={<AlertCircle size={12} />}
                        variant="danger"
                        size="xs"
                        onClick={() => {}}
                      />
                      <ActionButton
                        label="Admin"
                        icon={<Shield size={12} />}
                        variant="info"
                        size="xs"
                        onClick={() => {}}
                      />
                      <ActionButton
                        label="Modèles"
                        icon={<PenTool size={12} />}
                        variant="secondary"
                        size="xs"
                        onClick={() => setShowTemplateModal(true)}
                      />
                    </ButtonGroup>
                    <span>Entrée pour envoyer, Shift+Entrée pour nouvelle ligne</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-lg mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-sm text-gray-500 mb-4">Sélectionnez un destinataire pour communiquer ou envoyez un message groupé</p>
                  <ButtonGroup>
                    <ActionButton
                      label="Nouveau message"
                      icon={<PlusCircle size={16} />}
                      variant="primary"
                      size="md"
                      onClick={() => setCreateNewMessageModal(true)}
                    />
                    <ActionButton
                      label="Message groupé"
                      icon={<Share2 size={16} />}
                      variant="success"
                      size="md"
                      onClick={() => setShowBroadcastModal(true)}
                    />
                  </ButtonGroup>
                </div>
              </div>
            )}
          </div>
          
          {/* Panneau d'informations */}
          {showPanel && (
            <div className={`w-64 border-l ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col`}>
              <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-sm">Informations</h3>
                <ActionButton
                  label=""
                  icon={<X size={16} />}
                  variant="secondary"
                  size="xs"
                  onClick={() => setShowPanel(false)}
                />
              </div>
              
              {/* Statistiques avec StatCardGroup */}
              <div className="p-2 border-b border-gray-200">
                <h4 className="text-xs font-medium mb-2">Statistiques de communication</h4>
                <StatCardGroup darkMode={darkMode} compact={true}>
                  <StatCard
                    title="Messages totaux"
                    value={stats.totalMessages}
                    icon={<MessageSquare size={16} />}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Messages urgents"
                    value={stats.urgentMessages}
                    icon={<AlertTriangle size={16} />}
                    iconBgColor="bg-red-100"
                    iconColor="text-red-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Messages administratifs"
                    value={stats.adminMessages}
                    icon={<Shield size={16} />}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Alertes système"
                    value={stats.systemAlerts}
                    icon={<Server size={16} />}
                    iconBgColor="bg-purple-100"
                    iconColor="text-purple-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Utilisateurs actifs"
                    value={`${stats.activeRecipients}/${recipients.length}`}
                    icon={<Users size={16} />}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Réponses en attente"
                    value={stats.pendingResponses}
                    icon={<Clock size={16} />}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Temps de réponse moyen"
                    value={stats.responseTime}
                    icon={<Activity size={16} />}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                    darkMode={darkMode}
                  />
                </StatCardGroup>
              </div>
              
              {/* Permissions RBAC avec ExpandablePanel */}
              <div className="flex-1 overflow-y-auto p-2">
                <ExpandablePanel
                  title="Permissions RBAC récentes"
                  icon={<Key />}
                  initiallyExpanded={true}
                >
                  <div className="space-y-2">
                    <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Infirmiers CSJ-YDE</span>
                        <DynamicBadge label="Modifié" variant="success" size="xs" />
                      </div>
                      <p className="text-xs text-gray-500">Ajout: ParametresVitaux.Edit</p>
                      <p className="text-xs text-gray-500">Il y a 35 minutes</p>
                    </div>
                    <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Secrétaires Secondaires</span>
                        <DynamicBadge label="En attente" variant="warning" size="xs" />
                      </div>
                      <p className="text-xs text-gray-500">Ajout: Patient.ModifyUrgencyLevel</p>
                      <p className="text-xs text-gray-500">Validation technique requise</p>
                    </div>
                    <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Dr. Kamga Jean</span>
                        <DynamicBadge label="Modifié" variant="success" size="xs" />
                      </div>
                      <p className="text-xs text-gray-500">Ajout: Prescription.Antibiotics</p>
                      <p className="text-xs text-gray-500">Hier à 15:30</p>
                    </div>
                  </div>
                </ExpandablePanel>
              </div>
              
              {/* Actions */}
              <div className="p-2 border-t border-gray-200 space-y-2">
                <ActionButton
                  label="Gérer les permissions RBAC"
                  icon={<Key size={14} />}
                  variant="info"
                  size="sm"
                  onClick={() => showToast('Redirection vers gestion RBAC', 'info')}
                  fullWidth
                />
                <ActionButton
                  label="Journaux d'activité"
                  icon={<Archive size={14} />}
                  variant="secondary"
                  size="sm"
                  onClick={() => showToast('Ouverture des journaux', 'info')}
                  fullWidth
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de message groupé avec composant partagé Modal */}
      {showBroadcastModal && (
        <Modal
          title="Message administratif groupé"
          isOpen={showBroadcastModal}
          onClose={() => setShowBroadcastModal(false)}
          darkMode={darkMode}
          width="max-w-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Destinataires</label>
            <ButtonGroup className="mb-2">
              <ActionButton
                label="Tous les utilisateurs"
                variant={recipientType === 'all' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => setRecipientType('all')}
              />
              <ActionButton
                label="Cliniques"
                variant={recipientType === 'clinics' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => setRecipientType('clinics')}
              />
              <ActionButton
                label="Médecins"
                variant={recipientType === 'doctors' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => setRecipientType('doctors')}
              />
              <ActionButton
                label="Infirmiers"
                variant={recipientType === 'nurses' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => setRecipientType('nurses')}
              />
              <ActionButton
                label="Secrétaires"
                variant={recipientType === 'secretaries' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => setRecipientType('secretaries')}
              />
            </ButtonGroup>
            
            <label className="block text-sm font-medium mb-1">Priorité</label>
            <ButtonGroup className="mb-4">
              <ActionButton
                label="Normale"
                variant={broadcastPriority === 'normal' ? 'primary' : 'secondary'}
                size="xs"
                onClick={() => setBroadcastPriority('normal')}
              />
              <ActionButton
                label="Importante"
                variant={broadcastPriority === 'important' ? 'warning' : 'secondary'}
                size="xs"
                onClick={() => setBroadcastPriority('important')}
              />
              <ActionButton
                label="Urgente"
                variant={broadcastPriority === 'urgent' ? 'danger' : 'secondary'}
                size="xs"
                onClick={() => setBroadcastPriority('urgent')}
              />
            </ButtonGroup>

            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Message</label>
              <ActionButton
                label="Utiliser un modèle"
                icon={<Archive size={12} />}
                variant="info"
                size="xs"
                onClick={() => setShowTemplateModal(true)}
              />
            </div>
            <textarea 
              className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} mb-4`}
              rows="5"
              placeholder="Tapez votre message administratif..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            ></textarea>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="notification" className="mr-2" />
              <label htmlFor="notification" className="text-sm">Envoi de notification (SMS/email) en plus du message système</label>
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="acknowledgment" className="mr-2" />
              <label htmlFor="acknowledgment" className="text-sm">Demander un accusé de réception</label>
            </div>

            <ButtonGroup>
              <ActionButton
                label="Annuler"
                variant="secondary"
                size="md"
                onClick={() => setShowBroadcastModal(false)}
                fullWidth
              />
              <ActionButton
                label="Envoyer"
                variant="primary"
                size="md"
                onClick={handleSendBroadcast}
                disabled={broadcastMessage.trim() === ''}
                fullWidth
              />
            </ButtonGroup>
          </div>
        </Modal>
      )}

      {/* Modal de modèles de messages */}
      {showTemplateModal && (
        <Modal
          title="Modèles de messages"
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          darkMode={darkMode}
          width="max-w-lg"
        >
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Sélectionnez un modèle</h4>
              <ActionButton
                label="Nouveau modèle"
                icon={<PlusCircle size={12} />}
                variant="info"
                size="xs"
                onClick={() => {
                  setShowTemplateModal(false);
                  setShowNewTemplateModal(true);
                }}
              />
            </div>

            <div className={`mb-4 overflow-y-auto max-h-72 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md p-2`}>
              {messageTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`p-2 mb-2 rounded-md cursor-pointer ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{template.title}</span>
                    <DynamicBadge
                      label={template.category}
                      variant={
                        template.category === 'system' ? 'info' :
                        template.category === 'feature' ? 'success' :
                        template.category === 'training' ? 'info' :
                        'error'
                      }
                      size="xs"
                    />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{template.content}</p>
                </div>
              ))}
            </div>

            <ButtonGroup>
              <ActionButton
                label="Annuler"
                variant="secondary"
                size="md"
                onClick={() => setShowTemplateModal(false)}
                fullWidth
              />
              <ActionButton
                label="Utiliser ce modèle"
                variant="primary"
                size="md"
                disabled={!selectedTemplate}
                onClick={() => {
                  if (selectedTemplate) {
                    if (showBroadcastModal) {
                      setBroadcastMessage(selectedTemplate.content);
                      setShowTemplateModal(false);
                    } else {
                      setMessageInput(selectedTemplate.content);
                      setShowTemplateModal(false);
                    }
                  }
                }}
                fullWidth
              />
            </ButtonGroup>
          </div>
        </Modal>
      )}

      {/* Modal pour créer un nouveau modèle */}
      {showNewTemplateModal && (
        <Modal
          title="Créer un nouveau modèle"
          isOpen={showNewTemplateModal}
          onClose={() => setShowNewTemplateModal(false)}
          darkMode={darkMode}
          width="max-w-lg"
        >
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Titre du modèle</label>
              <input 
                type="text" 
                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                placeholder="Ex: Maintenance planifiée"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Catégorie</label>
              <select 
                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                value={newTemplateCategory}
                onChange={(e) => setNewTemplateCategory(e.target.value)}
              >
                <option value="system">Système</option>
                <option value="feature">Fonctionnalité</option>
                <option value="training">Formation</option>
                <option value="security">Sécurité</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Contenu du modèle</label>
              <textarea 
                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                rows="6"
                placeholder="Tapez le contenu du modèle. Utilisez [VARIABLE] pour indiquer les éléments à remplacer."
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
              ></textarea>
            </div>

            <ButtonGroup>
              <ActionButton
                label="Annuler"
                variant="secondary"
                size="md"
                onClick={() => setShowNewTemplateModal(false)}
                fullWidth
              />
              <ActionButton
                label="Créer le modèle"
                variant="primary"
                size="md"
                disabled={!newTemplateName || !newTemplateContent}
                onClick={() => {
                  setShowNewTemplateModal(false);
                  showToast(`Le modèle "${newTemplateName}" a été créé avec succès.`, 'success');
                  setNewTemplateName('');
                  setNewTemplateContent('');
                }}
                fullWidth
              />
            </ButtonGroup>
          </div>
        </Modal>
      )}

      {/* Modal pour créer un nouveau message */}
      {createNewMessageModal && (
        <Modal
          title="Nouveau message"
          isOpen={createNewMessageModal}
          onClose={() => setCreateNewMessageModal(false)}
          darkMode={darkMode}
          width="max-w-lg"
        >
          <div className="mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Destinataire</label>
              <select 
                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                value={newMessageRecipient}
                onChange={(e) => setNewMessageRecipient(e.target.value)}
              >
                <option value="">Sélectionnez un destinataire</option>
                {recipients.map(recipient => (
                  <option key={recipient.id} value={recipient.id}>
                    {recipient.name} ({recipient.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea 
                className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                rows="5"
                placeholder="Tapez votre message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" id="urgent-message" className="mr-2" />
              <label htmlFor="urgent-message" className="text-sm">Marquer comme urgent</label>
            </div>

            <ButtonGroup>
              <ActionButton
                label="Annuler"
                variant="secondary"
                size="md"
                onClick={() => setCreateNewMessageModal(false)}
                fullWidth
              />
              <ActionButton
                label="Envoyer"
                variant="primary"
                size="md"
                disabled={!newMessageRecipient || !messageInput}
                onClick={() => {
                  setCreateNewMessageModal(false);
                  const recipient = recipients.find(r => r.id.toString() === newMessageRecipient.toString());
                  if (recipient) {
                    setSelectedRecipient(recipient);
                  }
                  setNewMessageRecipient('');
                  setMessageInput('');
                  showToast('Message envoyé avec succès', 'success');
                }}
                fullWidth
              />
            </ButtonGroup>
          </div>
        </Modal>
      )}

      {/* Bouton d'actions rapides flottant */}
      <FloatingActionButton
        actions={quickActions}
        position="bottom-right"
        color="blue"
        showLabels
      />

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <ToastNotification key={toast.id} {...toast} />
        ))}
      </div>

      {/* Indicateur de statut de connexion */}
      <div className="fixed bottom-4 left-4 z-40">
        <ConnectionStatus 
          isOnline={connectionStatus.isOnline}
          showControls
          onToggleConnection={toggleConnection}
          darkMode={darkMode}
          mode="badge"
        />
      </div>
    </div>
  );
};

// Composant pour la liste des destinataires (extrait pour réutilisation dans les onglets)
const RecipientsList = ({ recipients, onSelect, selectedRecipient, darkMode }) => {
  const getRecipientIcon = (type) => {
    switch(type) {
      case 'clinic':
        return <Monitor size={18} />;
      case 'doctor':
        return <User size={18} />;
      case 'secretary':
        return <FileText size={18} />;
      case 'system':
        return <Server size={18} className="text-purple-500" />;
      case 'nurse':
        return <Activity size={18} className="text-green-500" />;
      default:
        return <User size={18} />;
    }
  };

  return (
    <div className="overflow-y-auto">
      {recipients.map(recipient => (
        <div 
          key={recipient.id}
          className={`p-2 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer ${selectedRecipient?.id === recipient.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
          onClick={() => onSelect(recipient)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`relative ${recipient.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                {getRecipientIcon(recipient.type)}
                <Circle size={8} className={`absolute bottom-0 right-0 ${recipient.status === 'online' ? 'text-green-500' : 'text-gray-400'} fill-current`} />
              </div>
              <div className="ml-2 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{recipient.name}</p>
                  <span className="text-xs text-gray-500">{recipient.lastActivity}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{recipient.contact}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <DynamicBadge label={recipient.code} variant="neutral" size="xs" />
            <div className="flex items-center space-x-1">
              {recipient.hasUrgentMessage && (
                <UrgencyLevelIndicator 
                  level={recipient.urgencyLevel}
                  showIcon
                  size="sm"
                />
              )}
              {recipient.unreadCount > 0 && (
                <DynamicBadge 
                  label={recipient.unreadCount.toString()}
                  variant="info"
                  size="xs"
                  rounded="full"
                  count={recipient.unreadCount}
                />
              )}
            </div>
          </div>
        </div>
      ))}
        
      {recipients.length === 0 && (
        <div className="p-3 text-center text-sm text-gray-500">
          Aucun destinataire ne correspond à votre recherche
        </div>
      )}
    </div>
  );
};

export default AdminFunctionalCommunication;