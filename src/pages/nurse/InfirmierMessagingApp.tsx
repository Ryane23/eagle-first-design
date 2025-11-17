import React, { useState, useRef, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Moon, Sun, AlertTriangle, Wifi, WifiOff, ChevronDown, Send, Paperclip, Image, Video, File, ChevronRight, ArrowRight, MapPin, MoreVertical, User, Clock, CheckCircle, PlusCircle, RefreshCw, UserPlus, Circle, Phone, PhoneCall, Info, AlertCircle, Trash2, Share2, Monitor, Command, Star, Smartphone, ChevronLeft, PanelRight, PanelLeft, Building, Briefcase, Heart, Thermometer, Clipboard, Stethoscope, UserCheck, FilePlus, Droplet, PieChart, Zap
} from 'lucide-react';

// Import des composants partagés
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { SearchInput } from '@forms/SearchInput';
import { StatusBadge } from '@data-display/StatusBadge';
import { ConnectionStatus } from '@common/ConnectionStatus';
import FloatingActionButton from '@buttons/FloatingActionButton';
import { Modal } from '@modals/Modal';
import { SidePanel } from '@panels/SidePanel';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import ChatInterface from '@communication/ChatInterface';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import DynamicBadge from '@data-display/DynamicBadge';

// Import des modules partagés

const InfirmierMessagingApp = () => {
  // Hook de gestion de l'état de communication
  const {
    conversations,
    messages,
    stats,
    selectedConversation,
    setSelectedConversation,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredConversations
  } = useCommunicationState(mockCommunicationData);

  // Hook de gestion des messages
  const {
    messageInput,
    setMessageInput,
    isTyping,
    handleSendMessage,
    handleSelectConversation: handleConversationSelect
  } = useMessageHandling();

  // États locaux pour l'interface
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageSearch, setNewMessageSearch] = useState('');
  const [newMessageFilter, setNewMessageFilter] = useState('all');
  const chatEndRef = useRef(null);

  // Données de configuration
  const centerInfo = COMMUNICATION_UI_CONFIG.centerInfo;
  const menuItems = COMMUNICATION_MENU_CONFIG.mainMenuItems;
  const bottomMenuItems = COMMUNICATION_MENU_CONFIG.bottomMenuItems;

  // Fonction de sélection d'une conversation
  const handleSelectConversation = (conversation) => {
    handleConversationSelect(conversation);
    setSelectedConversation(conversation);
    // Simuler un délai de chargement puis indiquer que le message a été lu
    setTimeout(() => {
      const updatedConversations = [...conversations];
      const index = updatedConversations.findIndex(c => c.id === conversation.id);
      if (index !== -1) {
        updatedConversations[index].unreadCount = 0;
      }
    }, 1000);
  };

  // Fonction d'envoi de message
  const handleMessageSend = () => {
    if (!validateMessage(messageInput) || !selectedConversation) return;
    
    handleSendMessage(messageInput, selectedConversation.id);
    setMessageInput('');
  };

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation, messages]);

  // Simuler "en train de taper" pour la démonstration
  useEffect(() => {
    if (selectedConversation?.id === 1) {
      const typingTimeout = setTimeout(() => {
        // setIsTyping géré par le hook useMessageHandling
        setTimeout(() => {}, 3000);
      }, 8000);
      
      return () => clearTimeout(typingTimeout);
    }
  }, [selectedConversation]);

  // Transformation des données pour l'affichage
  const displayConversations = transformConversationsForDisplay(filteredConversations);
  const displayStats = transformStatsForDisplay(stats);
  const chatMessages = selectedConversation ? 
    transformMessagesForChat(messages[selectedConversation.id]) : [];

  // Actions pour le FloatingActionButton
  const floatingActions = [
    {
      id: "new_message",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Nouveau message",
      onClick: () => setShowNewMessageModal(true)
    },
    {
      id: "refresh",
      icon: <RefreshCw className="h-4 w-4" />,
      label: "Actualiser",
      onClick: () => console.log("Actualiser")
    }
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation latérale avec le composant Sidebar */}
      <Sidebar 
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* En-tête avec le composant Header */}
        <Header
          title="Communication"
          subtitle=""
          centerInfo={centerInfo}
          isOnline={isOnline}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{
            initials: "LN",
            name: "Lucie Ndongo"
          }}
          notificationCount={2}
          extraHeaderItems={
            <button 
              onClick={() => setShowPanel(!showPanel)} 
              className="ml-2 text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md"
              title="Afficher/Masquer le panneau d'informations"
            >
              {showPanel ? (
                <>
                  <PanelRight size={12} className="mr-1" /> Panneau
                </>
              ) : (
                <>
                  <PanelLeft size={12} className="mr-1" /> Panneau
                </>
              )}
            </button>
          }
        />
        
        {/* Contenu principal - affichage flexible */}
        <div className="flex-1 flex overflow-hidden">
          {/* Liste des conversations */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
            {/* Recherche */}
            <div className="p-2 border-b border-gray-200">
              <SearchInput 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                darkMode={darkMode}
                width="w-full"
              />
            </div>
            
            {/* Onglets */}
            <div className="flex text-xs text-center border-b border-gray-200">
              <button 
                className={`flex-1 py-2 px-2 ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : ''} hover:bg-gray-50`}
                onClick={() => setActiveTab('all')}
              >
                Tous ({displayConversations.length})
              </button>
              <button 
                className={`flex-1 py-2 px-2 ${activeTab === 'urgent' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : ''} hover:bg-gray-50 flex items-center justify-center`}
                onClick={() => setActiveTab('urgent')}
              >
                <AlertTriangle size={10} className="mr-1 text-red-500" />
                Urgents ({displayConversations.filter(c => c.hasUrgentMessage).length})
              </button>
              <button 
                className={`flex-1 py-2 px-2 ${activeTab === 'resolved' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : ''} hover:bg-gray-50`}
                onClick={() => setActiveTab('resolved')}
              >
                Résolus
              </button>
            </div>
            
            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {displayConversations
                .filter(conv => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'urgent') return conv.hasUrgentMessage;
                  if (activeTab === 'resolved') return conv.unreadCount === 0 && !conv.hasUrgentMessage;
                  return true;
                })
                .map(conv => (
                <div key={conv.id}
                    className={`relative p-2 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer ${selectedConversation?.id === conv.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''} transition-colors`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`relative`}>
                          {getConversationIcon(conv.type)}
                          <Circle size={8} className={`absolute bottom-0 right-0 ${getConversationStatusColor(conv.status)} fill-current`} />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{conv.contact}</p>
                            <span className="text-xs text-gray-500">{formatLastActivity(conv.lastActivity)}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{conv.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded-full">{conv.code}</span>
                      <div className="flex items-center">
                        {conv.hasUrgentMessage && (
                          <DynamicBadge
                            label="Urgent"
                            variant="error"
                            size="xs"
                            icon={<AlertTriangle size={10} />}
                            rounded="full"
                          />
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    {conv.status === 'online' && conv.type === 'medecin' && (
                      <div className="absolute right-0 top-0 w-2 h-2 bg-green-500 rounded-full m-1"></div>
                    )}
                  </div>
                ))}
                
              {displayConversations.length === 0 && (
                <div className="p-3 text-center text-sm text-gray-500">
                  Aucune conversation ne correspond à votre recherche
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="p-2 border-t border-gray-200">
              <ButtonGroup className="flex-col space-y-1">
                <ActionButton
                  label="Nouveau message"
                  icon={<PlusCircle size={14} />}
                  variant="primary"
                  fullWidth={true}
                  onClick={() => setShowNewMessageModal(true)}
                />
                <div className="flex space-x-1">
                  <ActionButton
                    label="Actualiser"
                    icon={<RefreshCw size={14} />}
                    variant="secondary"
                    onClick={() => console.log("Actualiser")}
                  />
                  <ActionButton
                    label="Favoris"
                    icon={<Star size={14} />}
                    variant="success"
                    onClick={() => console.log("Favoris")}
                  />
                </div>
              </ButtonGroup>
            </div>
          </div>
          
          {/* Zone de chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                {/* En-tête de conversation */}
                <div className={`p-2 flex items-center justify-between border-b ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center">
                    <div className="mr-2 relative">
                      {getConversationIcon(selectedConversation.type)}
                      <Circle size={8} className={`absolute bottom-0 right-0 ${getConversationStatusColor(selectedConversation.status)} fill-current`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{selectedConversation.contact}</h3>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{selectedConversation.name}</span>
                        <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-800 rounded-sm text-xs">{selectedConversation.code}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ActionButton
                      label="Appeler"
                      icon={<PhoneCall size={14} />}
                      variant="info"
                      size="xs"
                    />
                    <ActionButton
                      label="Vidéo"
                      icon={<Video size={14} />}
                      variant="success"
                      size="xs"
                    />
                    <div className="relative group">
                      <button className="p-1.5 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors">
                        <MoreVertical size={14} />
                      </button>
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                        <button className="flex items-center w-full text-left px-3 py-1 text-xs hover:bg-gray-100">
                          <Share2 size={12} className="mr-2 text-blue-600" />
                          Partager le contact
                        </button>
                        <button className="flex items-center w-full text-left px-3 py-1 text-xs hover:bg-gray-100">
                          <Bell size={12} className="mr-2 text-purple-600" />
                          Notifications
                        </button>
                        <button className="flex items-center w-full text-left px-3 py-1 text-xs hover:bg-gray-100">
                          <Trash2 size={12} className="mr-2 text-red-600" />
                          Supprimer l'historique
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interface de chat avec le composant ChatInterface */}
                <ChatInterface
                  messages={chatMessages}
                  onSendMessage={handleMessageSend}
                  title=""
                  placeholder="Tapez votre message..."
                  isCollapsible={false}
                  maxHeight="100%"
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-lg mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-sm text-gray-500 mb-4">Sélectionnez une conversation pour commencer à discuter</p>
                  <ActionButton
                    label="Nouveau message"
                    icon={<PlusCircle size={16} />}
                    variant="primary"
                    onClick={() => setShowNewMessageModal(true)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Panneau d'informations avec le composant SidePanel */}
          {showPanel && (
            <SidePanel
              title="Informations"
              isOpen={showPanel}
              onClose={() => setShowPanel(false)}
              darkMode={darkMode}
              width="w-64"
            >
              {/* Statistiques */}
              <div className="p-2 border-b border-gray-200">
                <h4 className="text-xs font-medium mb-2">Tableau de bord</h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayStats.statCards.map((card, index) => (
                    <StatCard
                      key={index}
                      title={card.title}
                      value={card.value}
                      icon={card.icon}
                      iconBgColor={card.iconBgColor}
                      iconColor={card.iconColor}
                      suffix={card.suffix}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              </div>
              
              {/* Patients à préparer */}
              <div className="p-2 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium">Patients à préparer</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">2 en attente</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {displayStats.patientsToPrepareb.map((patient, index) => (
                    <div key={index} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'} border-l-4 ${patient.urgency === 'urgent' ? 'border-red-500' : 'border-yellow-500'} shadow-sm hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{patient.name}</span>
                        <DynamicBadge
                          label={patient.urgency === 'urgent' ? "Urgent" : "À préparer"}
                          variant={patient.urgency === 'urgent' ? "error" : "warning"}
                          size="xs"
                          icon={patient.urgency === 'urgent' ? <AlertTriangle size={10} /> : undefined}
                          rounded="full"
                        />
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Stethoscope size={10} className="mr-1 text-green-600" />
                        {patient.doctor} • {patient.specialty}
                      </div>
                      <div className="text-xs mt-1 flex items-center">
                        <Clock size={10} className="mr-1 text-blue-600" />
                        {patient.time} • 
                        <Clipboard size={10} className="ml-1 mr-1 text-purple-600" />
                        {patient.preparation}
                      </div>
                      <button className="w-full mt-1 py-0.5 bg-blue-50 text-blue-700 rounded text-xs hover:bg-blue-100 transition-colors">
                        Marquer comme préparé
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Téléconsultations prévues */}
              <div className="p-2 border-b border-gray-200">
                <h4 className="text-xs font-medium mb-2">Téléconsultations prévues</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {displayStats.teleconsultations.map((consult, index) => (
                    <div key={index} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 border-green-500`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{consult.patientName}</span>
                        <StatusBadge
                          type="success"
                          label="Prête"
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{consult.doctor} • {consult.specialty}</div>
                      <div className="text-xs mt-1">{consult.room} • {consult.time}</div>
                      <button className="w-full mt-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                        Démarrer la consultation
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-2 border-b border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium">Réponses rapides</h4>
                  <button className="text-xs text-blue-600 hover:text-blue-800">
                    <PlusCircle size={12} className="inline mr-0.5" /> Ajouter
                  </button>
                </div>
                <div className="space-y-1">
                  {displayStats.quickResponses.map((response, index) => (
                    <button key={index} className="w-full text-left px-2 py-1 text-xs bg-white hover:bg-gray-100 rounded shadow-sm border border-gray-100 transition-colors">
                      {response}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Check-list téléconsultation */}
              <div className="flex-1 overflow-y-auto p-2">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-medium">Check-list Pré-consultation</h4>
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    {displayStats.checklist.completed}/{displayStats.checklist.total}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {displayStats.checklist.items.map((item, index) => (
                    <div key={index} className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm border border-gray-100 transition-shadow hover:shadow-md`}>
                      <div className="flex items-center text-xs">
                        <button className={`w-5 h-5 rounded-full ${item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center mr-2 hover:bg-${item.completed ? 'green' : 'gray'}-200 transition-colors`}>
                          {item.completed ? (
                            <CheckCircle size={12} className="text-green-600" />
                          ) : (
                            <Circle size={12} className="text-gray-400" />
                          )}
                        </button>
                        <span>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-2 border-t border-gray-200">
                <ButtonGroup className="grid grid-cols-2 gap-2">
                  <ActionButton
                    label="Accéder au DPI"
                    icon={<Clipboard size={14} />}
                    variant="info"
                    size="sm"
                  />
                  <ActionButton
                    label="Test vidéo"
                    icon={<Video size={14} />}
                    variant="success"
                    size="sm"
                  />
                  <ActionButton
                    label="Signes vitaux"
                    icon={<Heart size={14} />}
                    variant="warning"
                    size="sm"
                  />
                  <ActionButton
                    label="Examens"
                    icon={<FileText size={14} />}
                    variant="warning"
                    size="sm"
                  />
                </ButtonGroup>
              </div>
            </SidePanel>
          )}
        </div>
      </div>

      {/* Bouton d'action flottant */}
      <FloatingActionButton
        actions={floatingActions}
        mainIcon={<MessageSquare className="h-5 w-5" />}
        position="bottom-right"
        color="blue"
        showLabels={true}
      />

      {/* Modal pour nouveau message */}
      <Modal
        title="Nouveau message"
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        width="max-w-xl"
        darkMode={darkMode}
        footer={
          <>
            <button 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              onClick={() => setShowNewMessageModal(false)}
            >
              Annuler
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md ml-2"
              onClick={() => {
                // Logique d'envoi d'un nouveau message
                setShowNewMessageModal(false);
              }}
            >
              Envoyer
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Destinataire</label>
            <SearchInput 
              placeholder="Rechercher un contact..." 
              value={newMessageSearch}
              onChange={(e) => setNewMessageSearch(e.target.value)}
              darkMode={darkMode}
              width="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea 
              className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              rows={6}
              placeholder="Saisissez votre message..."
            ></textarea>
          </div>
          <div>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Marquer comme urgent</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InfirmierMessagingApp;