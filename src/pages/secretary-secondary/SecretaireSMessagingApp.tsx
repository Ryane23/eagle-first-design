import React, { useState, useRef, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Moon, Sun, AlertTriangle, Wifi, WifiOff, ChevronDown, Send, Paperclip, Image, Video, File, ChevronRight, ArrowRight, MapPin, MoreVertical, User, Clock, CheckCircle, PlusCircle, RefreshCw, UserPlus, Circle, Phone, PhoneCall, Info, AlertCircle, Trash2, Share2, Monitor, Command, Star, Smartphone, PanelRight, PanelLeft
} from 'lucide-react';

// Import des composants partagés
// Layout Components
import { Header } from '@layout/Header';
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';

// Common Components
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Form Components
import { SearchInput } from '@forms/SearchInput';

// Data Display Components
import { StatusBadge } from '@data-display/StatusBadge';
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';

// Feedback Components
import { AlertNotification } from '@feedback/AlertNotification';

// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';

// Communication Components
import ChatInterface from '@communication/ChatInterface';

// Modal Components
import { Modal } from '@modals/Modal';

// Hooks
import { useDarkMode } from '@hooks/useDarkMode';
import { useConnectionStatus } from '@hooks/useConnectionStatus';

// Types
import { Center, User as UserType } from '@types';

// Utils
import { formatWaitTime, getStatusBadgeVariant } from '@utils/statusUtils';

// Services
import { notificationService } from '@services/notificationService';

const SecretaireSMessagingApp = () => {
 // États
 const [navCollapsed, setNavCollapsed] = useState(false);
 const { darkMode, toggleDarkMode } = useDarkMode();
 const [selectedConversation, setSelectedConversation] = useState(null);
 const [messageInput, setMessageInput] = useState('');
 const [showPanel, setShowPanel] = useState(true);
 const { status: connectionStatus, toggleConnection } = useConnectionStatus();
 const [searchTerm, setSearchTerm] = useState('');
 const [showAttachMenu, setShowAttachMenu] = useState(false);
 const [activeTab, setActiveTab] = useState('all'); // 'all', 'urgent', 'resolved'
 const [isTyping, setIsTyping] = useState(false);
 const [showNewMessageModal, setShowNewMessageModal] = useState(false);
 const [newMessageSearch, setNewMessageSearch] = useState('');
 const [newMessageFilter, setNewMessageFilter] = useState('all'); // 'all', 'center', 'function', 'name'
 const chatEndRef = useRef(null);

 // Centre secondaire
 const centerInfo: Center = {
   id: "CSJ-YDE",
   name: "Clinique Saint Jean - Yaoundé",
   code: "CSJ-YDE",
   type: "secondary",
   address: "Yaoundé, Cameroun",
   phone: "+237 222 123 456"
 };

 // Données simulées des conversations
 const conversations = [
   { 
     id: 1, 
     name: "Centre Principal - Douala", 
     code: "CHP-DLA", 
     status: "online", 
     contact: "Sophie Priso",
     lastActivity: "Il y a 2 min",
     unreadCount: 2,
     hasUrgentMessage: false,
     type: "centre"
   },
   { 
     id: 2, 
     name: "Dr. Nana", 
     code: "CARD", 
     status: "online", 
     contact: "Dr. Nana",
     lastActivity: "Il y a 10 min",
     unreadCount: 0,
     hasUrgentMessage: false,
     type: "medecin"
   },
   { 
     id: 3, 
     name: "Dr. Tamo", 
     code: "PED", 
     status: "offline", 
     contact: "Dr. Tamo",
     lastActivity: "Il y a 1h",
     unreadCount: 0,
     hasUrgentMessage: true,
     type: "medecin"
   },
   { 
     id: 4, 
     name: "Infirmière - Salle A", 
     code: "INF-A", 
     status: "online", 
     contact: "Lucie Ndongo",
     lastActivity: "Maintenant",
     unreadCount: 1,
     hasUrgentMessage: false,
     type: "staff"
   },
   { 
     id: 5, 
     name: "Support Technique", 
     code: "TECH", 
     status: "online", 
     contact: "Équipe Technique",
     lastActivity: "Il y a 30 min",
     unreadCount: 0,
     hasUrgentMessage: false,
     type: "support"
   }
 ];

 // Données simulées des messages
 const messages = {
   1: [
     { id: 1, sender: "Sophie Priso", time: "09:15", content: "Bonjour Sara, pourriez-vous préparer le patient Kamga Jean pour sa téléconsultation avec Dr. Nana à 10h30 ?", isUrgent: false, isOutgoing: false },
     { id: 2, sender: "Vous", time: "09:17", content: "Bonjour Sophie, bien sûr. Je vais l'installer en salle A et vérifier que tout fonctionne correctement.", isUrgent: false, isOutgoing: true },
     { id: 3, sender: "Sophie Priso", time: "09:18", content: "Parfait. Assurez-vous que sa pression artérielle soit mesurée avant la consultation.", isUrgent: false, isOutgoing: false },
     { id: 4, sender: "Vous", time: "09:20", content: "C'est noté. J'ai déjà préparé son dossier avec les derniers résultats d'analyse.", isUrgent: false, isOutgoing: true },
     { id: 5, sender: "Sophie Priso", time: "09:30", content: "URGENT: Le Dr. Nana peut avancer la consultation à 10h00. Est-ce que le patient est déjà arrivé ?", isUrgent: true, isOutgoing: false },
     { id: 6, sender: "Vous", time: "09:31", content: "Oui, il est déjà là. Je vais l'informer du changement et préparer la salle immédiatement.", isUrgent: true, isOutgoing: true },
   ],
   2: [
     { id: 1, sender: "Dr. Nana", time: "08:45", content: "Bonjour Sara, j'aurai besoin des antécédents médicaux complets du patient Kouam Pierre pour la consultation de ce matin.", isUrgent: false, isOutgoing: false },
     { id: 2, sender: "Vous", time: "08:50", content: "Bonjour Dr. Nana, je vous envoie tout de suite les documents.", isUrgent: false, isOutgoing: true },
     { id: 3, sender: "Vous", time: "08:52", content: "Voici le dossier complet avec l'historique cardiaque et les derniers ECG.", isUrgent: false, isOutgoing: true, hasAttachment: true, attachmentName: "dossier_kouam_pierre.pdf" },
     { id: 4, sender: "Dr. Nana", time: "08:55", content: "Merci Sara, c'est parfait.", isUrgent: false, isOutgoing: false },
   ],
   3: [
     { id: 1, sender: "Dr. Tamo", time: "14:20", content: "URGENT: Le matériel vidéo de la salle B ne fonctionne pas correctement. Pouvez-vous contacter le support technique ?", isUrgent: true, isOutgoing: false },
     { id: 2, sender: "Vous", time: "14:22", content: "J'appelle le support immédiatement et je prépare la salle C en alternative.", isUrgent: true, isOutgoing: true },
   ],
   4: [
     { id: 1, sender: "Lucie Ndongo", time: "09:05", content: "Sara, la patiente Mbarga Marie est arrivée pour sa consultation de 9h30. Je l'installe en salle d'attente.", isUrgent: false, isOutgoing: false },
     { id: 2, sender: "Vous", time: "09:06", content: "Merci Lucie. Pourriez-vous vérifier sa tension avant la consultation ?", isUrgent: false, isOutgoing: true },
     { id: 3, sender: "Lucie Ndongo", time: "09:12", content: "Tension mesurée : 13/8. Je note dans son dossier.", isUrgent: false, isOutgoing: false },
     { id: 4, sender: "Vous", time: "09:13", content: "Parfait, merci. La salle de consultation sera prête dans 10 minutes.", isUrgent: false, isOutgoing: true },
     { id: 5, sender: "Lucie Ndongo", time: "09:40", content: "La patiente est maintenant en consultation avec Dr. Tamo.", isUrgent: false, isOutgoing: false, unread: true },
   ],
   5: [
     { id: 1, sender: "Équipe Technique", time: "10:05", content: "Bonjour Sara, nous effectuons une mise à jour du système de téléconsultation aujourd'hui entre 12h et 14h. Veuillez éviter de planifier des consultations pendant cette période.", isUrgent: false, isOutgoing: false },
     { id: 2, sender: "Vous", time: "10:10", content: "Bonjour, c'est bien noté. J'ai ajusté le planning en conséquence.", isUrgent: false, isOutgoing: true },
     { id: 3, sender: "Équipe Technique", time: "10:12", content: "Merci pour votre collaboration. N'hésitez pas à nous contacter en cas de problème technique.", isUrgent: false, isOutgoing: false },
   ]
 };

 // Statistiques
 const stats = {
   totalMessages: Object.values(messages).flat().length,
   urgentMessages: Object.values(messages).flat().filter(msg => msg.isUrgent).length,
   unresolvedQueries: 2,
   activeSessions: conversations.filter(conv => conv.status === "online").length
 };

 // Utilisateur
 const currentUser: UserType = {
   id: "SS-001",
   name: "Sara Simo",
   email: "sara.simo@eagle-health.cm",
   role: "secretary",
   initials: "SS"
 };
 
 // Items du menu de navigation
 const menuItems = [
   { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
   { icon: <AlertTriangle size={18} />, label: "Gestion des Urgences", path: "#", isActive: false },
   { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
   { icon: <FileText size={18} />, label: "Post Consultation", path: "#", isActive: false },
   { icon: <WifiOff size={18} />, label: "Mode hors ligne", path: "#", isActive: false },
   { icon: <Activity size={18} />, label: "Monitoring technique", path: "#", isActive: false },
   { icon: <MessageSquare size={18} />, label: "Communication", path: "#", isActive: true }
 ];
 
 // Items du menu du bas
 const bottomMenuItems = [
   { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
   { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
 ];
 
 // Fonction de sélection d'une conversation
 const handleSelectConversation = (conversation) => {
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
 const handleSendMessage = () => {
   if (messageInput.trim() === '' || !selectedConversation) return;
   
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
 }, [selectedConversation, messages]);

 // Simuler "en train de taper" pour la démonstration
 useEffect(() => {
   if (selectedConversation?.id === 1) {
     const typingTimeout = setTimeout(() => {
       setIsTyping(true);
       setTimeout(() => setIsTyping(false), 3000);
     }, 8000);
     
     return () => clearTimeout(typingTimeout);
   }
 }, [selectedConversation]);

 // Filtrer les conversations en fonction de la recherche
 const filteredConversations = conversations.filter(conv => {
   const searchLower = searchTerm.toLowerCase();
   return (
     conv.name.toLowerCase().includes(searchLower) ||
     conv.code.toLowerCase().includes(searchLower) ||
     conv.contact.toLowerCase().includes(searchLower)
   );
 });

 // Fonction pour obtenir l'icône en fonction du type de conversation
 const getConversationIcon = (type) => {
   switch(type) {
     case 'centre':
       return <Home size={18} className="text-blue-600" />;
     case 'medecin':
       return <User size={18} className="text-green-600" />;
     case 'staff':
       return <Users size={18} className="text-purple-600" />;
     case 'support':
       return <Settings size={18} className="text-orange-600" />;
     default:
       return <MessageSquare size={18} className="text-gray-600" />;
   }
 };

 // Préparation des messages pour ChatInterface
 const formattedMessages = selectedConversation ? 
   messages[selectedConversation.id].map(msg => ({
     id: msg.id,
     sender: msg.sender,
     senderRole: msg.sender === "Vous" ? "user" : "contact",
     content: msg.content,
     timestamp: msg.time,
     isCurrentUser: msg.isOutgoing
   })) : [];

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
         title="Messagerie"
         subtitle={centerInfo.name}
         centerInfo={centerInfo}
         isOnline={connectionStatus.isOnline}
         darkMode={darkMode}
         toggleDarkMode={toggleDarkMode}
         user={currentUser}
         notificationCount={1}
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
           {/* Recherche et filtre */}
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
           
           {/* Liste des conversations */}
           <div className="flex-1 overflow-y-auto">
             {filteredConversations
               .filter(conv => {
                 if (activeTab === 'all') return true;
                 if (activeTab === 'urgent') return conv.hasUrgentMessage;
                 if (activeTab === 'resolved') return conv.unreadCount === 0 && !conv.hasUrgentMessage;
                 return true;
               })
               .map(conv => (
                 <div 
                   key={conv.id}
                   className={`p-2 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer ${selectedConversation?.id === conv.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                   onClick={() => handleSelectConversation(conv)}
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center">
                       <div className={`relative`}>
                         {getConversationIcon(conv.type)}
                         <Circle size={8} className={`absolute bottom-0 right-0 ${conv.status === 'online' ? 'text-green-500' : 'text-gray-400'} fill-current`} />
                       </div>
                       <div className="ml-2 flex-1 min-w-0">
                         <div className="flex items-center justify-between">
                           <p className="text-sm font-medium truncate">{conv.contact}</p>
                           <span className="text-xs text-gray-500">{conv.lastActivity}</span>
                         </div>
                         <p className="text-xs text-gray-500 truncate">{conv.name}</p>
                       </div>
                     </div>
                   </div>
                   <div className="flex items-center justify-between mt-1">
                     <StatusBadge type="normal" label={conv.code} />
                     <div className="flex items-center">
                       {conv.hasUrgentMessage && (
                         <StatusBadge 
                           type="error" 
                           label="Urgent" 
                           icon={<AlertTriangle size={10} />} 
                         />
                       )}
                       {conv.unreadCount > 0 && (
                         <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                           {conv.unreadCount}
                         </span>
                       )}
                     </div>
                   </div>
                 </div>
               ))}
               
             {filteredConversations.length === 0 && (
               <div className="p-3 text-center text-sm text-gray-500">
                 Aucune conversation ne correspond à votre recherche
               </div>
             )}
           </div>
           
           {/* Actions */}
           <div className="p-2 border-t border-gray-200">
             <ButtonGroup>
               <ActionButton 
                 label="Nouveau message" 
                 icon={<PlusCircle size={14} />} 
                 variant="primary"
                 fullWidth={true}
                 onClick={() => setShowNewMessageModal(true)}
               />
               <ActionButton 
                 label="Actualiser" 
                 icon={<RefreshCw size={14} />} 
                 variant="secondary"
                 fullWidth={true}
               />
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
                     <Circle size={8} className={`absolute bottom-0 right-0 ${selectedConversation.status === 'online' ? 'text-green-500' : 'text-gray-400'} fill-current`} />
                   </div>
                   <div>
                     <h3 className="font-medium text-sm">{selectedConversation.contact}</h3>
                     <div className="flex items-center">
                       <span className="text-xs text-gray-500">{selectedConversation.name}</span>
                       <StatusBadge type="info" label={selectedConversation.code} />
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
                     label="" 
                     icon={<Info size={14} />} 
                     variant="secondary"
                     size="xs"
                   />
                   <ActionButton 
                     label="" 
                     icon={<MoreVertical size={14} />} 
                     variant="secondary"
                     size="xs"
                   />
                 </div>
               </div>
               
               {/* Interface de chat */}
               <ChatInterface 
                 messages={formattedMessages}
                 onSendMessage={handleSendMessage}
                 title=""
                 placeholder="Tapez votre message..."
                 isCollapsible={false}
                 isFloating={false}
                 maxHeight="auto"
               />
               
               {/* Indicateur "En train de taper" visible à l'extérieur du ChatInterface */}
               {isTyping && (
                 <div className={`p-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                   <div className="flex items-center space-x-1 ml-2">
                     <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                     <span className="text-xs text-gray-500 ml-1">{selectedConversation.contact} est en train d'écrire...</span>
                   </div>
                 </div>
               )}
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
               <h4 className="text-xs font-medium mb-2">Statistiques de messagerie</h4>
               <StatCardGroup>
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
                   title="Questions non résolues" 
                   value={stats.unresolvedQueries} 
                   icon={<AlertCircle size={16} />}
                   iconBgColor="bg-yellow-100"
                   iconColor="text-yellow-600"
                   darkMode={darkMode}
                 />
                 <StatCard 
                   title="Sessions actives" 
                   value={`${stats.activeSessions}/${conversations.length}`} 
                   icon={<Users size={16} />}
                   iconBgColor="bg-green-100"
                   iconColor="text-green-600"
                   darkMode={darkMode}
                 />
               </StatCardGroup>
             </div>
             
             {/* Consultations en cours */}
             <div className="p-2 border-b border-gray-200">
               <h4 className="text-xs font-medium mb-2">Consultations en cours</h4>
               <div className="space-y-2 max-h-48 overflow-y-auto">
                 <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 border-green-500`}>
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-medium">Mbarga Marie</span>
                     <StatusBadge type="success" label="En cours" />
                   </div>
                   <div className="text-xs text-gray-500 mt-1">Dr. Tamo • Pédiatrie</div>
                   <div className="text-xs mt-1">Salle A • Débutée à 09:30</div>
                 </div>
                 <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 border-yellow-500`}>
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-medium">Kouam Pierre</span>
                     <StatusBadge type="warning" label="En attente" />
                   </div>
                   <div className="text-xs text-gray-500 mt-1">Dr. Nana • Cardiologie</div>
                   <div className="text-xs mt-1">Prévue à 10:00</div>
                 </div>
               </div>
             </div>
             
             {/* Messages rapides */}
             <div className="p-2 border-b border-gray-200">
               <h4 className="text-xs font-medium mb-2">Réponses rapides</h4>
               <div className="space-y-1">
                 <button className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
                   Le patient est prêt pour la consultation.
                 </button>
                 <button className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
                   J'ai vérifié les signes vitaux du patient.
                 </button>
                 <button className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
                   Les documents demandés sont prêts.
                 </button>
                 <button className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded">
                   Problème technique avec la connexion vidéo.
                 </button>
               </div>
             </div>
             
             {/* Rappels et Actions */}
             <div className="flex-1 overflow-y-auto p-2">
               <h4 className="text-xs font-medium mb-2">Rappels</h4>
               
               <div className={`p-2 mb-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-2 border-blue-500`}>
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-medium">Préparer salle pour Kamga Jean</span>
                   <span className="text-xs text-gray-500">10:00</span>
                 </div>
               </div>
               
               <div className={`p-2 mb-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-2 border-purple-500`}>
                 <div className="flex items-center justify-between">
                   <span className="text-xs font-medium">Vérifier matériel salle B</span>
                   <span className="text-xs text-gray-500">11:30</span>
                 </div>
               </div>
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
                   label="Test technique" 
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
     
     {/* Modal Nouveau Message */}
     <Modal
       title="Nouveau Message"
       isOpen={showNewMessageModal}
       onClose={() => setShowNewMessageModal(false)}
       width="max-w-lg"
     >
       <div className="space-y-4">
         <SearchInput 
           placeholder="Rechercher un contact..."
           value={newMessageSearch}
           onChange={(e) => setNewMessageSearch(e.target.value)}
           darkMode={darkMode}
           width="w-full"
         />
         
         <div className="flex space-x-2 text-xs">
           <button 
             className={`px-2 py-1 rounded-md ${newMessageFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
             onClick={() => setNewMessageFilter('all')}
           >
             Tous
           </button>
           <button 
             className={`px-2 py-1 rounded-md ${newMessageFilter === 'center' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
             onClick={() => setNewMessageFilter('center')}
           >
             Centres
           </button>
           <button 
             className={`px-2 py-1 rounded-md ${newMessageFilter === 'medecin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
             onClick={() => setNewMessageFilter('medecin')}
           >
             Médecins
           </button>
           <button 
             className={`px-2 py-1 rounded-md ${newMessageFilter === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
             onClick={() => setNewMessageFilter('staff')}
           >
             Personnel
           </button>
         </div>
         
         <div className="max-h-64 overflow-y-auto border rounded-md">
           {conversations
             .filter(conv => 
               (newMessageFilter === 'all' || conv.type === newMessageFilter) && 
               (conv.name.toLowerCase().includes(newMessageSearch.toLowerCase()) || 
                conv.contact.toLowerCase().includes(newMessageSearch.toLowerCase()))
             )
             .map(conv => (
               <div 
                 key={conv.id}
                 className="p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                 onClick={() => {
                   setSelectedConversation(conv);
                   setShowNewMessageModal(false);
                 }}
               >
                 <div className="flex items-center">
                   <div className="mr-2">
                     {getConversationIcon(conv.type)}
                   </div>
                   <div>
                     <div className="font-medium text-sm">{conv.contact}</div>
                     <div className="text-xs text-gray-500">{conv.name} • {conv.code}</div>
                   </div>
                   <StatusBadge 
                     type={conv.status === 'online' ? 'success' : 'error'}
                     label={conv.status === 'online' ? 'En ligne' : 'Hors ligne'}
                     className="ml-auto"
                   />
                 </div>
               </div>
             ))}
         </div>
       </div>
     </Modal>
   </div>
 );
};

export default SecretaireSMessagingApp;