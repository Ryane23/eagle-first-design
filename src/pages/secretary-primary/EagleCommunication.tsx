import React, { useState, useRef, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Moon, Sun, AlertTriangle, Wifi, WifiOff, ChevronDown, Send, Paperclip, Image, Video, File, ChevronRight, ArrowRight, MapPin, MoreVertical, User, Clock, CheckCircle, PlusCircle, RefreshCw, UserPlus, Circle, Phone, PhoneCall, Info, AlertCircle, Trash2, Share2, Monitor, Command, Star, StarHalf, Smartphone, ChevronLeft, Maximize, PanelRight, PanelLeft, Minimize
} from 'lucide-react';

// Importation des composants partagés
// Shared Components - Layout
import { Sidebar } from '@layout/Sidebar';
import { Header } from '@layout/Header';

// Shared Components - Form
import { SearchInput } from '@forms/SearchInput';

// Shared Components - Common
import { ConnectionStatus } from '@common/ConnectionStatus';

// Shared Components - Data Display
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';

// Shared Components - Communication
import ChatInterface from '@communication/ChatInterface';

// Shared Components - Buttons
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import FloatingActionButton from '@buttons/FloatingActionButton';

// Shared Hooks
import { useConnectionStatus } from '@hooks/useConnectionStatus';
import { useDarkMode } from '@hooks/useDarkMode';

// Shared Types
import { User as UserType, Center } from '@types';

// Shared Utils
import { formatWaitTime, getStatusBadgeVariant } from '@utils/statusUtils';

// Shared Constants
import { NOTIFICATION_TYPES, USER_ROLES } from '@constants';

const EagleCommunication = () => {
  // États
  const [navCollapsed, setNavCollapsed] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showPanel, setShowPanel] = useState(true);
  const { status: connectionStatus, toggleConnection } = useConnectionStatus();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'urgent', 'resolved'
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Centre principal
  const centerInfo: Center = {
    id: "1",
    name: "Centre Hospitalier Principal - Douala",
    code: "CHP-DLA",
    type: "primary",
    address: "Rue principale, Douala",
    phone: "237000000"
  };

  // Utilisateur actuel
  const currentUser: UserType = {
    id: "1",
    name: "Sophie Priso",
    email: "sophie.priso@eagle.cm",
    role: "secretary",
    initials: "SP"
  };

  // Données simulées des centres secondaires
  const secondaryClinics = [
    { 
      id: 1, 
      name: "Clinique Saint Jean - Yaoundé", 
      code: "CSJ-YDE", 
      status: "online", 
      secretary: "Sara Simo",
      lastActivity: "Il y a 5 min",
      unreadCount: 3,
      hasUrgentMessage: false
    },
    { 
      id: 2, 
      name: "Centre Médical du Nord - Garoua", 
      code: "CMN-GAR", 
      status: "online", 
      secretary: "Marc Fouda",
      lastActivity: "Il y a 20 min",
      unreadCount: 0,
      hasUrgentMessage: false
    },
    { 
      id: 3, 
      name: "Polyclinique de Bonabéri - Douala", 
      code: "PCB-DLA", 
      status: "offline", 
      secretary: "Alice Nkoto",
      lastActivity: "Il y a 3h",
      unreadCount: 1,
      hasUrgentMessage: true
    },
    { 
      id: 4, 
      name: "Centre de Santé Intégré - Bafoussam", 
      code: "CSI-BAF", 
      status: "online", 
      secretary: "Paul Mbarga",
      lastActivity: "Maintenant",
      unreadCount: 0,
      hasUrgentMessage: false
    },
    { 
      id: 5, 
      name: "Clinique La Paix - Limbe", 
      code: "CLP-LBE", 
      status: "online", 
      secretary: "Marie Tamo",
      lastActivity: "Il y a 10 min",
      unreadCount: 2,
      hasUrgentMessage: true
    }
  ];

  // Données simulées de conversations
  const conversations = {
    1: [
      { id: 1, sender: "Sara Simo", time: "09:15", content: "Bonjour, j'ai un patient qui a besoin d'une consultation urgente en cardiologie.", isUrgent: false, isOutgoing: false },
      { id: 2, sender: "Vous", time: "09:17", content: "Bonjour Sara, pouvez-vous m'envoyer son dossier pour évaluation ?", isUrgent: false, isOutgoing: true },
      { id: 3, sender: "Sara Simo", time: "09:20", content: "Voici le dossier du patient avec ses antécédents et les derniers ECG.", isUrgent: false, isOutgoing: false, hasAttachment: true, attachmentName: "dossier_patient_125.pdf" },
      { id: 4, sender: "Vous", time: "09:25", content: "Merci, je viens d'attribuer le Dr. Nana pour la consultation à 10h30. Pouvez-vous préparer le patient ?", isUrgent: false, isOutgoing: true },
      { id: 5, sender: "Sara Simo", time: "09:26", content: "Je vais le préparer tout de suite et vérifier que son matériel vidéo fonctionne bien.", isUrgent: false, isOutgoing: false },
      { id: 6, sender: "Sara Simo", time: "09:40", content: "URGENT: Le patient présente maintenant des douleurs thoraciques intenses. Pouvons-nous avancer la consultation ?", isUrgent: true, isOutgoing: false },
      { id: 7, sender: "Vous", time: "09:41", content: "Consultation avancée immédiatement. Dr. Nana va se connecter dans 2 minutes. Préparez tous les signes vitaux.", isUrgent: true, isOutgoing: true },
    ],
    2: [
      { id: 1, sender: "Marc Fouda", time: "08:30", content: "Bonjour, avons-nous une mise à jour du planning des spécialistes pour cette semaine ?", isUrgent: false, isOutgoing: false },
      { id: 2, sender: "Vous", time: "08:45", content: "Bonjour Marc, oui, le Dr. Sob sera disponible jeudi matin pour les consultations dermatologiques.", isUrgent: false, isOutgoing: true },
    ],
    3: [
      { id: 1, sender: "Alice Nkoto", time: "14:20", content: "URGENT: Nous avons un problème de connexion depuis 1h et plusieurs patients en attente.", isUrgent: true, isOutgoing: false },
      { id: 2, sender: "Vous", time: "14:25", content: "J'ai contacté l'équipe technique. En attendant, passez en mode consultation téléphonique pour les cas urgents.", isUrgent: true, isOutgoing: true },
    ],
    4: [], // Nouvelle conversation
    5: [
      { id: 1, sender: "Marie Tamo", time: "10:05", content: "Bonjour, pouvons-nous avoir accès au dossier du patient Kamga Jean qui a été transféré hier ?", isUrgent: false, isOutgoing: false },
      { id: 2, sender: "Vous", time: "10:10", content: "Bonjour Marie, je vous partage son dossier immédiatement.", isUrgent: false, isOutgoing: true },
      { id: 3, sender: "Vous", time: "10:11", content: "Voici le dossier complet avec les résultats de ses derniers examens.", isUrgent: false, isOutgoing: true, hasAttachment: true, attachmentName: "dossier_kamga_jean.pdf" },
      { id: 4, sender: "Marie Tamo", time: "10:15", content: "URGENT: Le Dr. Sob demande si des allergies médicamenteuses sont notées dans son dossier avant de prescrire.", isUrgent: true, isOutgoing: false },
      { id: 5, sender: "Vous", time: "10:16", content: "Oui, allergie à la pénicilline documentée page 3 du dossier. Je vous envoie également ses dernières analyses sanguines.", isUrgent: true, isOutgoing: true },
    ]
  };

  // Statistiques
  const stats = {
    totalMessages: Object.values(conversations).flat().length,
    urgentMessages: Object.values(conversations).flat().filter(msg => msg.isUrgent).length,
    unresolvedQueries: 3,
    activeClinics: secondaryClinics.filter(clinic => clinic.status === "online").length
  };

  // Items du menu de navigation
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <Users size={18} />, label: "Patients", path: "#", isActive: false },
    { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
    { icon: <Activity size={18} />, label: "Consultations", path: "#", isActive: false },
    { icon: <MessageSquare size={18} />, label: "Communication", path: "#", isActive: true },
    { icon: <FileText size={18} />, label: "Documents", path: "#", isActive: false },
    { icon: <ClipboardList size={18} />, label: "Rapports", path: "#", isActive: false },
  ];

  const bottomMenuItems = [
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" },
  ];
  
  // Fonction de sélection d'une clinique
  const handleSelectClinic = (clinic) => {
    setSelectedClinic(clinic);
    // Simuler un délai de chargement puis indiquer que le message a été lu
    setTimeout(() => {
      const updatedClinics = [...secondaryClinics];
      const index = updatedClinics.findIndex(c => c.id === clinic.id);
      if (index !== -1) {
        updatedClinics[index].unreadCount = 0;
      }
    }, 1000);
  };

  // Fonction d'envoi de message
  const handleSendMessage = () => {
    if (messageInput.trim() === '' || !selectedClinic) return;
    
    // Dans une application réelle, on enverrait le message au backend
    // Ici on simule l'ajout du message à la conversation
    setMessageInput('');
    // Après envoi, simuler "tapant..."
    setTimeout(() => setIsTyping(true), 2000);
    // Puis simuler une réponse
    setTimeout(() => setIsTyping(false), 5000);
  };

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedClinic, conversations]);

  // Simuler "en train de taper" pour la démonstration
  useEffect(() => {
    if (selectedClinic?.id === 1) {
      const typingTimeout = setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }, 8000);
      
      return () => clearTimeout(typingTimeout);
    }
  }, [selectedClinic]);

  // Filtrer les cliniques en fonction de la recherche
  const filteredClinics = secondaryClinics.filter(clinic => {
    const searchLower = searchTerm.toLowerCase();
    return (
      clinic.name.toLowerCase().includes(searchLower) ||
      clinic.code.toLowerCase().includes(searchLower) ||
      clinic.secretary.toLowerCase().includes(searchLower)
    );
  });

  // Fonction pour formater le statut
  const getStatusColor = (status) => {
    return status === 'online' ? 'text-green-500' : 'text-gray-400';
  };

  // Transformer les conversations pour le ChatInterface
  const formatChatMessages = (clinicId) => {
    if (!conversations[clinicId]) return [];
    
    return conversations[clinicId].map(msg => ({
      id: msg.id,
      sender: msg.sender,
      senderRole: msg.sender === "Vous" ? "Secrétaire Principale" : "Secrétaire Secondaire",
      content: msg.content,
      timestamp: msg.time,
      isCurrentUser: msg.isOutgoing
    }));
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation latérale */}
      <Sidebar 
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* En-tête */}
        <Header
          title="Communication Inter-Cliniques"
          subtitle="Module de communication"
          centerInfo={centerInfo}
          isOnline={connectionStatus.isOnline}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          user={currentUser}
          notificationCount={3}
          extraHeaderItems={
            <button 
              onClick={() => setShowPanel(!showPanel)} 
              className="ml-2 text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md"
              title="Afficher/Masquer le panneau de statistiques"
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
          {/* Liste des cliniques */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} w-64 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
            {/* Recherche et filtre */}
            <div className="p-2 border-b border-gray-200">
              <SearchInput
                placeholder="Rechercher une clinique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                darkMode={darkMode}
                width="w-full"
              />
            </div>
            
            {/* Onglets */}
            <div className="flex text-xs text-center border-b border-gray-200">
              <button 
                className={`flex-1 py-2 px-2 ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Tous
              </button>
              <button 
                className={`flex-1 py-2 px-2 ${activeTab === 'urgent' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
                onClick={() => setActiveTab('urgent')}
              >
                Urgents
              </button>
              <button 
                className={`flex-1 py-2 px-2 ${activeTab === 'resolved' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
                onClick={() => setActiveTab('resolved')}
              >
                Résolus
              </button>
            </div>
            
            {/* Liste des cliniques */}
            <div className="flex-1 overflow-y-auto">
              {filteredClinics
                .filter(clinic => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'urgent') return clinic.hasUrgentMessage;
                  if (activeTab === 'resolved') return clinic.unreadCount === 0 && !clinic.hasUrgentMessage;
                  return true;
                })
                .map(clinic => (
                  <div 
                    key={clinic.id}
                    className={`p-2 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer ${selectedClinic?.id === clinic.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                    onClick={() => handleSelectClinic(clinic)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`relative ${clinic.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                          <User size={18} />
                          <Circle size={8} className={`absolute bottom-0 right-0 ${clinic.status === 'online' ? 'text-green-500' : 'text-gray-400'} fill-current`} />
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">{clinic.secretary}</p>
                            <span className="text-xs text-gray-500">{clinic.lastActivity}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{clinic.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded">{clinic.code}</span>
                      <div className="flex items-center">
                        {clinic.hasUrgentMessage && (
                          <StatusBadge
                            type="warning"
                            label="Urgent"
                            icon={<AlertTriangle size={10} />}
                          />
                        )}
                        {clinic.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {clinic.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
              {filteredClinics.length === 0 && (
                <div className="p-3 text-center text-sm text-gray-500">
                  Aucune clinique ne correspond à votre recherche
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="p-2 border-t border-gray-200">
              <ButtonGroup>
                <ActionButton
                  label="Nouvelle connexion"
                  icon={<UserPlus size={14} />}
                  variant="primary"
                  fullWidth={true}
                />
                <ActionButton
                  label="Actualiser statuts"
                  icon={<RefreshCw size={14} />}
                  variant="secondary"
                  fullWidth={true}
                />
              </ButtonGroup>
            </div>
          </div>
          
          {/* Zone de chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedClinic ? (
              <>
                {/* En-tête de conversation */}
                <div className={`p-2 flex items-center justify-between border-b ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center">
                    <div className="mr-2 relative">
                      <User size={20} className="text-blue-600" />
                      <Circle size={8} className={`absolute bottom-0 right-0 ${selectedClinic.status === 'online' ? 'text-green-500' : 'text-gray-400'} fill-current`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{selectedClinic.secretary}</h3>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{selectedClinic.name}</span>
                        <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-800 rounded-sm text-xs">{selectedClinic.code}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ActionButton
                      label="Appeler"
                      icon={<PhoneCall size={14} />}
                      variant="info"
                      size="sm"
                    />
                    <ActionButton
                      label="Détails"
                      icon={<Info size={14} />}
                      variant="secondary"
                      size="sm"
                    />
                    <button className="p-1.5 rounded-md bg-gray-100 text-gray-800">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className={`flex-1 overflow-y-auto p-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  {conversations[selectedClinic.id] && conversations[selectedClinic.id].length > 0 ? (
                    <>
                      {conversations[selectedClinic.id].map(message => (
                        <div 
                          key={message.id} 
                          className={`mb-3 flex ${message.isOutgoing ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-3/4 rounded-lg p-2 ${
                              message.isUrgent
                                ? 'bg-red-100 text-red-800'
                                : message.isOutgoing
                                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white')
                                  : (darkMode ? 'bg-gray-700' : 'bg-white')
                            } ${!message.isUrgent && !message.isOutgoing && darkMode ? 'text-white' : ''}`}
                          >
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium">{message.sender}</span>
                              <span className="ml-2 text-xs opacity-75">{message.time}</span>
                              {message.isUrgent && (
                                <span className="ml-2 flex items-center text-xs font-bold">
                                  <AlertTriangle size={12} className="mr-0.5" /> URGENT
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.hasAttachment && (
                              <div className={`mt-1 p-1 rounded flex items-center text-xs ${message.isUrgent ? 'bg-red-200' : 'bg-gray-100'}`}>
                                <File size={14} className="mr-1 text-blue-600" />
                                <span className={message.isUrgent ? 'text-red-800' : 'text-gray-800'}>
                                  {message.attachmentName}
                                </span>
                                <button className="ml-1 p-0.5 rounded hover:bg-gray-200">
                                  <ArrowRight size={12} className="text-blue-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Indicateur "En train de taper" */}
                      {isTyping && (
                        <div className="flex justify-start mb-3">
                          <div className={`rounded-lg p-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white'}`}>
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatEndRef} />
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center p-6">
                        <MessageSquare size={48} className="mx-auto mb-2 text-gray-400" />
                        <h3 className="font-medium text-sm mb-1">Aucun message</h3>
                        <p className="text-xs text-gray-500">Démarrer une nouvelle conversation</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Zone de saisie */}
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
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => setShowAttachMenu(!showAttachMenu)}
                        >
                          <Paperclip size={16} />
                        </button>
                        
                        {showAttachMenu && (
                          <div className="absolute bottom-6 right-0 bg-white rounded-md shadow-lg py-1 w-40">
                            <button className="flex items-center w-full text-left px-3 py-1 text-sm hover:bg-gray-100">
                              <File size={14} className="mr-2 text-blue-600" />
                              Document
                            </button>
                            <button className="flex items-center w-full text-left px-3 py-1 text-sm hover:bg-gray-100">
                              <Image size={14} className="mr-2 text-green-600" />
                              Image
                            </button>
                            <button className="flex items-center w-full text-left px-3 py-1 text-sm hover:bg-gray-100">
                              <Video size={14} className="mr-2 text-purple-600" />
                              Vidéo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      className={`p-2 rounded-md ${messageInput.trim() === '' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
                      onClick={handleSendMessage}
                      disabled={messageInput.trim() === ''}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center hover:text-gray-700">
                        <AlertCircle size={12} className="mr-0.5 text-red-600" />
                        Urgent
                      </button>
                      <button className="flex items-center hover:text-gray-700">
                        <Clock size={12} className="mr-0.5" />
                        Planifier
                      </button>
                    </div>
                    <span>Entrée pour envoyer, Shift+Entrée pour nouvelle ligne</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-6">
                  <MessageSquare size={64} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-lg mb-2">Aucune conversation sélectionnée</h3>
                  <p className="text-sm text-gray-500 mb-4">Sélectionnez une clinique pour commencer à communiquer</p>
                  <ActionButton
                    label="Ajouter une clinique"
                    icon={<UserPlus size={16} />}
                    variant="primary"
                    size="md"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Panneau d'informations */}
          {showPanel && (
            <div className={`w-64 border-l ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex flex-col`}>
              <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium text-sm">Informations</h3>
                <button 
                  onClick={() => setShowPanel(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-md"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Statistiques */}
              <div className="p-2 border-b border-gray-200">
                <h4 className="text-xs font-medium mb-2">Statistiques de communication</h4>
                <StatCardGroup darkMode={darkMode}>
                  <StatCard
                    title="Messages totaux"
                    value={stats.totalMessages}
                    icon={<MessageSquare size={14} />}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Messages urgents"
                    value={stats.urgentMessages}
                    icon={<AlertTriangle size={14} />}
                    iconBgColor="bg-red-100"
                    iconColor="text-red-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Questions non résolues"
                    value={stats.unresolvedQueries}
                    icon={<AlertCircle size={14} />}
                    iconBgColor="bg-yellow-100"
                    iconColor="text-yellow-600"
                    darkMode={darkMode}
                  />
                  <StatCard
                    title="Cliniques actives"
                    value={`${stats.activeClinics}/${secondaryClinics.length}`}
                    icon={<User size={14} />}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                    darkMode={darkMode}
                  />
                </StatCardGroup>
              </div>
              
              {/* Centres */}
              <div className="flex-1 overflow-y-auto p-2">
                <h4 className="text-xs font-medium mb-2">État des centres</h4>
                {secondaryClinics.map(clinic => (
                  <div key={clinic.id} className={`mb-2 p-2 rounded-md ${darkMode ? 'bg-gray-750' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{clinic.code}</span>
                      <ConnectionStatus 
                        isOnline={clinic.status === 'online'}
                        darkMode={darkMode}
                      />
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">{clinic.name}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <User size={12} className="mr-1" />
                      <span>{clinic.secretary}</span>
                    </div>
                    
                    {/* Indicateurs */}
                    <div className="flex items-center mt-2 space-x-1">
                      {clinic.hasUrgentMessage && (
                        <StatusBadge
                          type="warning"
                          label="Urgent"
                          icon={<AlertTriangle size={10} />}
                        />
                      )}
                      {clinic.unreadCount > 0 && (
                        <StatusBadge
                          type="info"
                          label={`${clinic.unreadCount} non lu${clinic.unreadCount > 1 ? 's' : ''}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Actions */}
              <div className="p-2 border-t border-gray-200">
                <ButtonGroup>
                  <ActionButton
                    label="Partager un document"
                    icon={<Share2 size={14} />}
                    variant="info"
                    fullWidth={true}
                  />
                  <ActionButton
                    label="Démarrer une visioconférence"
                    icon={<Monitor size={14} />}
                    variant="success"
                    fullWidth={true}
                  />
                </ButtonGroup>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EagleCommunication;