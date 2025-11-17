import React, { useState } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, ChevronDown, MoreVertical, UserPlus, RefreshCw, Thermometer, Clock, CheckCircle, Edit, User, ChevronRight, ArrowRight, ArrowUp, ArrowDown, MapPin, Zap, AlertCircle, ExternalLink, MessageCircle, Send, CheckSquare, Square, Shield, ShieldAlert, Eye, Info, ThumbsUp, ThumbsDown, History, Heart, Monitor
} from 'lucide-react';

// Import des composants partagés
// Layout Components
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { Header } from '@layout/Header';

// Form Components
import { SearchInput } from '@forms/SearchInput';

// Data Display Components
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';

// Medical Components
import { PatientRecord } from '@medical/PatientRecord';
import { PatientCard } from '@medical/PatientCard';

// UI Components
import { Modal } from '@modals/Modal';
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Shared Utilities
import { 
  getUrgencyColor,
  getUrgencyLabel,
  getStatusBadgeVariant 
} from '@utils/statusUtils';

// Shared Hooks
import { useDarkMode } from '@hooks/useDarkMode';
import { useConnectionStatus } from '@hooks/useConnectionStatus';

// Shared Types
import { Patient, Center } from '@types';

// Shared Constants
import { 
  URGENCY_LEVELS,
  PATIENT_STATUS 
} from '@constants';

const EagleUrgencyValidation = () => {
 // États
 const [navCollapsed, setNavCollapsed] = useState(false);
 const { darkMode, toggleDarkMode } = useDarkMode();
 const [filterStatus, setFilterStatus] = useState('pending'); // 'pending', 'validated', 'adjusted', 'all'
 const [selectedPatient, setSelectedPatient] = useState(null);
 const [showCommentModal, setShowCommentModal] = useState(false);
 const [commentText, setCommentText] = useState('');
 const { status: connectionStatus } = useConnectionStatus();
 const [sortBy, setSortBy] = useState('time'); // 'time', 'urgency', 'center'
 const [searchQuery, setSearchQuery] = useState('');
 
 // Données simulées des centres secondaires
 const centers: Center[] = [
   { id: '1', name: "Clinique Saint Jean - Yaoundé", code: "CSJ-YDE", type: 'secondary' },
   { id: '2', name: "Centre Médical Biyem-Assi", code: "CMB-ASS", type: 'secondary' },
   { id: '3', name: "Polyclinique du Centre - Douala", code: "PCD-DLA", type: 'secondary' },
   { id: '4', name: "Hôpital de District Bonassama", code: "HDB-BON", type: 'secondary' },
   { id: '5', name: "Clinique La Patience - Bafoussam", code: "CLP-BAF", type: 'secondary' }
 ];
 
 // Données simulées des secrétaires secondaires
 const secretaries = [
   { id: 1, name: "Marie Kouam", center: '1', avatar: "MK" },
   { id: 2, name: "Paul Ndongo", center: '2', avatar: "PN" },
   { id: 3, name: "Julie Mbarga", center: '3', avatar: "JM" },
   { id: 4, name: "Robert Tamo", center: '4', avatar: "RT" },
   { id: 5, name: "Esther Fouda", center: '5', avatar: "EF" }
 ];
 
 // Données simulées des patients avec urgences à valider
 const patients = [
   { 
     id: '1', 
     name: "Kamga",
     firstName: "Jean",
     age: 45, 
     gender: "M" as const, 
     assignedUrgency: 4, 
     urgencyLevel: 4,
     center: '1', 
     secretary: 1, 
     time: "09:15",
     arrivalTime: "09:15",
     status: "pending",
     reason: "Douleur thoracique intense depuis 2h",
     specialty: "Cardiologie",
     doctor: "Dr. Kouam",
     waitTime: 0,
     vitalSigns: { 
       bp: "160/95", 
       hr: 98, 
       temp: 37.2, 
       spo2: 96, 
       pain: 8 
     },
     notes: "Antécédent d'infarctus, douleur irradiant vers le bras gauche",
     medicalHistory: ["Hypertension", "Infarctus du myocarde (2020)", "Diabète type 2"]
   },
   { 
     id: '2', 
     name: "Mbarga",
     firstName: "Marie",
     age: 28, 
     gender: "F" as const, 
     assignedUrgency: 3,
     urgencyLevel: 3,
     center: '2', 
     secretary: 2, 
     time: "08:45",
     arrivalTime: "08:45",
     status: "pending",
     reason: "Migraine sévère, photophobie",
     specialty: "Neurologie",
     doctor: "Dr. Kouam",
     waitTime: 30,
     vitalSigns: { 
       bp: "135/85", 
       hr: 82, 
       temp: 37.0, 
       spo2: 99, 
       pain: 7 
     },
     notes: "Migraines récurrentes, pas de réponse aux analgésiques habituels",
     medicalHistory: ["Migraines chroniques"]
   },
   { 
     id: '3', 
     name: "Kouam",
     firstName: "Pierre",
     age: 62, 
     gender: "M" as const, 
     assignedUrgency: 5,
     urgencyLevel: 5,
     center: '3', 
     secretary: 3, 
     time: "09:05",
     arrivalTime: "09:05",
     status: "pending",
     reason: "Dyspnée aiguë, fatigue extrême",
     specialty: "Pneumologie",
     doctor: "Dr. Kouam",
     waitTime: 10,
     vitalSigns: { 
       bp: "90/60", 
       hr: 112, 
       temp: 38.1, 
       spo2: 89, 
       pain: 6 
     },
     notes: "BPCO, désaturation importante, sueurs",
     medicalHistory: ["BPCO", "Emphysème pulmonaire", "Ex-fumeur"]
   },
   { 
     id: '4', 
     name: "Fouda",
     firstName: "Alice",
     age: 35, 
     gender: "F" as const, 
     assignedUrgency: 2,
     urgencyLevel: 2,
     center: '4', 
     secretary: 4, 
     time: "08:30",
     arrivalTime: "08:30",
     status: "validated",
     reason: "Éruption cutanée, démangeaisons",
     specialty: "Dermatologie",
     doctor: "Dr. Beyala",
     waitTime: 45,
     vitalSigns: { 
       bp: "125/75", 
       hr: 76, 
       temp: 37.3, 
       spo2: 98, 
       pain: 4 
     },
     notes: "Apparition brutale après repas, suspicion d'allergie alimentaire",
     medicalHistory: ["Allergie aux fruits de mer"]
   },
   { 
     id: '5', 
     name: "Amougou",
     firstName: "Paul",
     age: 52, 
     gender: "M" as const, 
     assignedUrgency: 3,
     urgencyLevel: 4,
     center: '5', 
     secretary: 5, 
     time: "09:00",
     arrivalTime: "09:00",
     status: "adjusted",
     adjustedUrgency: 4,
     reason: "Vertiges, nausées persistantes depuis ce matin",
     specialty: "Médecine générale",
     doctor: "Dr. Kouam",
     waitTime: 15,
     vitalSigns: { 
       bp: "175/95", 
       hr: 88, 
       temp: 37.0, 
       spo2: 97, 
       pain: 5 
     },
     notes: "Hypertension non contrôlée, céphalées occipitales",
     medicalHistory: ["Hypertension", "AVC ischémique (2019)"]
   },
   { 
     id: '6', 
     name: "Ndongo",
     firstName: "Anna",
     age: 7, 
     gender: "F" as const, 
     assignedUrgency: 4,
     urgencyLevel: 5,
     center: '1', 
     secretary: 1, 
     time: "08:15",
     arrivalTime: "08:15",
     status: "adjusted",
     adjustedUrgency: 5,
     reason: "Fièvre élevée 40°C, convulsion",
     specialty: "Pédiatrie",
     doctor: "Dr. Manga",
     waitTime: 60,
     vitalSigns: { 
       bp: "90/60", 
       hr: 130, 
       temp: 40.2, 
       spo2: 95, 
       pain: 6 
     },
     notes: "Episode de convulsion ce matin, antécédent d'épilepsie",
     medicalHistory: ["Épilepsie", "Asthme"]
   },
   { 
     id: '7', 
     name: "Meka",
     firstName: "Joseph",
     age: 40, 
     gender: "M" as const, 
     assignedUrgency: 1,
     urgencyLevel: 1,
     center: '2', 
     secretary: 2, 
     time: "09:30",
     arrivalTime: "09:30",
     status: "pending",
     reason: "Douleur lombaire suite à effort physique",
     specialty: "Médecine générale",
     doctor: "Dr. Kouam",
     waitTime: 0,
     vitalSigns: { 
       bp: "130/80", 
       hr: 72, 
       temp: 36.8, 
       spo2: 99, 
       pain: 3 
     },
     notes: "Survenue après avoir soulevé une charge lourde, pas d'irradiation",
     medicalHistory: ["Hernie discale L4-L5 (2018)"]
   }
 ];

 // Fonction pour filtrer les patients selon le statut
 const filteredPatients = patients.filter(patient => {
   if (filterStatus === 'all') return true;
   return patient.status === filterStatus;
 }).filter(patient => {
   if (!searchQuery) return true;
   return patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          patient.reason.toLowerCase().includes(searchQuery.toLowerCase());
 });

 // Fonction pour trier les patients
 const sortedPatients = [...filteredPatients].sort((a, b) => {
   if (sortBy === 'time') {
     return a.time.localeCompare(b.time);
   } else if (sortBy === 'urgency') {
     const urgencyA = a.adjustedUrgency || a.assignedUrgency;
     const urgencyB = b.adjustedUrgency || b.assignedUrgency;
     return urgencyB - urgencyA;
   } else if (sortBy === 'center') {
     return a.center.localeCompare(b.center);
   }
   return 0;
 });

 // Fonction pour sélectionner un patient
 const handleSelectPatient = (patient) => {
   setSelectedPatient(patient);
 };

 // Fonction pour valider l'urgence
 const handleValidateUrgency = () => {
   if (!selectedPatient) return;
   // Simuler une mise à jour du statut
   alert(`Urgence de niveau ${selectedPatient.assignedUrgency} validée pour ${selectedPatient.name}`);
   // Dans une vraie application, on mettrait à jour l'état
 };

 // Fonction pour ajuster l'urgence
 const handleAdjustUrgency = (adjustment) => {
   if (!selectedPatient) return;
   const currentLevel = selectedPatient.adjustedUrgency || selectedPatient.assignedUrgency;
   let newLevel = currentLevel + adjustment;
   // Limiter entre 1 et 5
   newLevel = Math.max(1, Math.min(5, newLevel));
   
   alert(`Urgence ajustée de ${currentLevel} à ${newLevel} pour ${selectedPatient.name}`);
   // Dans une vraie application, on mettrait à jour l'état
 };

 // Fonction pour forcer la priorité
 const handleForcePriority = () => {
   if (!selectedPatient) return;
   alert(`Priorisation forcée appliquée pour ${selectedPatient.name}`);
   // Dans une vraie application, on mettrait à jour l'état
 };

 // Fonction pour envoyer un commentaire
 const handleSendComment = () => {
   if (!selectedPatient || !commentText) return;
   alert(`Commentaire envoyé à ${getSecretaryName(selectedPatient.secretary)}: "${commentText}"`);
   setCommentText('');
   setShowCommentModal(false);
   // Dans une vraie application, on mettrait à jour l'état
 };

 // Fonction pour obtenir le nom du centre
 const getCenterName = (centerId) => {
   const center = centers.find(c => c.id === centerId);
   return center ? center.name : "Centre inconnu";
 };

 // Fonction pour obtenir le code du centre
 const getCenterCode = (centerId) => {
   const center = centers.find(c => c.id === centerId);
   return center ? center.code : "???";
 };

 // Fonction pour obtenir le nom du secrétaire
 const getSecretaryName = (secretaryId) => {
   const secretary = secretaries.find(s => s.id === secretaryId);
   return secretary ? secretary.name : "Inconnu";
 };

 // Fonction pour obtenir l'avatar du secrétaire
 const getSecretaryAvatar = (secretaryId) => {
   const secretary = secretaries.find(s => s.id === secretaryId);
   return secretary ? secretary.avatar : "??";
 };

 // Texte de l'urgence
 const getUrgencyText = (level) => {
   return getUrgencyLabel(level);
 };

 // Texte du statut
 const getStatusText = (status) => {
   const statuses = {
     "pending": "En attente",
     "validated": "Validé",
     "adjusted": "Ajusté"
   };
   return statuses[status] || status;
 };

 // Classe CSS du statut
 const getStatusClass = (status) => {
   const classes = {
     "pending": "bg-blue-100 text-blue-800",
     "validated": "bg-green-100 text-green-800",
     "adjusted": "bg-yellow-100 text-yellow-800"
   };
   return classes[status] || "bg-gray-100 text-gray-800";
 };
 
 // Configuration des items du menu
 const menuItems = [
   { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
   { icon: <Users size={18} />, label: "Patients", path: "#", isActive: false },
   { icon: <ShieldAlert size={18} />, label: "Validation Urgences", path: "#", isActive: true },
   { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
   { icon: <Activity size={18} />, label: "Consultations", path: "#", isActive: false },
   { icon: <FileText size={18} />, label: "Documents", path: "#", isActive: false },
   { icon: <ClipboardList size={18} />, label: "Rapports", path: "#", isActive: false },
   { icon: <Monitor size={18} />, label: "Salles d'attente", path: "#", isActive: false }
 ];
 
 // Configuration des items du menu du bas
 const bottomMenuItems = [
   { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
   { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
 ];
 
 // Configuration de l'en-tête
 const headerConfig = {
   title: "Validation des Urgences",
   subtitle: undefined,
   centerInfo: {
     name: "Centre Principal - Yaoundé",
     code: "CP-YDE",
     type: ""
   },
   isOnline: connectionStatus.isOnline,
   bandwidth: 4.2,
   darkMode: darkMode,
   toggleDarkMode: toggleDarkMode,
   user: {
     initials: "SP",
     name: "Sara Principal"
   },
   notificationCount: 1
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
       <Header {...headerConfig} />
       
       {/* Contenu */}
       <div className="flex-1 overflow-auto p-3 flex">
         {/* Liste des patients à gauche */}
         <div className="w-2/5 pr-2">
           {/* Filtres et recherche */}
           <div className="mb-3 flex flex-wrap gap-2">
             <div className="flex-grow">
               <SearchInput 
                 placeholder="Rechercher un patient..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 darkMode={darkMode}
                 width="w-full"
               />
             </div>
             <div className="flex space-x-1">
               <select 
                 className={`py-1.5 px-2 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
               >
                 <option value="pending">En attente</option>
                 <option value="validated">Validés</option>
                 <option value="adjusted">Ajustés</option>
                 <option value="all">Tous</option>
               </select>
               <select 
                 className={`py-1.5 px-2 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
               >
                 <option value="time">Tri par heure</option>
                 <option value="urgency">Tri par urgence</option>
                 <option value="center">Tri par centre</option>
               </select>
             </div>
           </div>
           
           {/* Liste des patients */}
           <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
             <div className={`px-3 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
               <h2 className="font-medium text-sm flex items-center">
                 Patients à évaluer
                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                   {filteredPatients.length}
                 </span>
               </h2>
             </div>
             
             <div className="overflow-y-auto max-h-96">
               {sortedPatients.length > 0 ? (
                 sortedPatients.map(patient => (
                   <div 
                     key={patient.id} 
                     className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${selectedPatient && selectedPatient.id === patient.id ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : 'hover:bg-gray-50'} cursor-pointer`}
                     onClick={() => handleSelectPatient(patient)}
                   >
                     <div className="flex justify-between items-start">
                       <div className="flex items-start">
                         <UrgencyIndicator 
                           level={patient.adjustedUrgency || patient.assignedUrgency}
                           size="sm"
                           showNumber={true}
                           showLabel={false}
                         />
                         <div className="ml-2">
                           <div className="font-medium text-sm">{patient.name}</div>
                           <div className="text-xs text-gray-500">{patient.age} ans, {patient.gender}</div>
                         </div>
                       </div>
                       <div className="flex flex-col items-end">
                         <StatusBadge 
                           type={patient.status} 
                           label={getStatusText(patient.status)}
                         />
                         <span className="text-xs text-gray-500 mt-1">{patient.time}</span>
                       </div>
                     </div>
                     <div className="mt-1 text-xs">
                       <p className="line-clamp-1 text-gray-600">{patient.reason}</p>
                       <div className="flex items-center mt-1">
                         <div className="bg-gray-200 text-gray-700 rounded-full px-1.5 flex items-center mr-1">
                           <Thermometer size={10} className="mr-0.5" />
                           {patient.vitalSigns.temp}°C
                         </div>
                         <div className="bg-gray-200 text-gray-700 rounded-full px-1.5 flex items-center mr-1">
                           <Heart size={10} className="mr-0.5" />
                           {patient.vitalSigns.hr} bpm
                         </div>
                         <div className="bg-gray-200 text-gray-700 rounded-full px-1.5 flex items-center">
                           {patient.vitalSigns.bp}
                         </div>
                       </div>
                     </div>
                     <div className="mt-1 flex justify-between items-center">
                       <div className="flex items-center text-xs text-gray-500">
                         <span className="bg-gray-100 px-1 py-0.5 rounded">
                           {getCenterCode(patient.center)}
                         </span>
                         <span className="mx-1">•</span>
                         <div className="flex items-center">
                           <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs mr-1">
                             {getSecretaryAvatar(patient.secretary)}
                           </div>
                           <span>{getSecretaryName(patient.secretary).split(' ')[0]}</span>
                         </div>
                       </div>
                       {patient.status === 'adjusted' && (
                         <div className="flex items-center text-xs">
                           <ArrowUp size={12} className={patient.adjustedUrgency > patient.assignedUrgency ? 'text-red-500' : 'text-green-500'} />
                           <span className={patient.adjustedUrgency > patient.assignedUrgency ? 'text-red-500' : 'text-green-500'}>
                             {patient.assignedUrgency} → {patient.adjustedUrgency}
                           </span>
                         </div>
                       )}
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="p-4 text-center text-sm text-gray-500">
                   Aucun patient ne correspond aux critères sélectionnés
                 </div>
               )}
             </div>
           </div>
         </div>
         
         {/* Détails et actions à droite */}
         <div className="w-3/5 pl-2">
           {selectedPatient ? (
             <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow h-full flex flex-col`}>
               {/* En-tête des détails */}
               <div className={`px-3 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'} flex justify-between items-center`}>
                 <h2 className="font-medium">Validation de l'urgence</h2>
                 <div className="flex items-center">
                   <span className="text-xs text-gray-500 mr-2">Dernière mise à jour: Aujourd'hui 09:45</span>
                   <button className="text-gray-500 hover:text-gray-700">
                     <X size={18} onClick={() => setSelectedPatient(null)} />
                   </button>
                 </div>
               </div>
               
               {/* Corps des détails */}
               <div className="p-3 flex-1 overflow-y-auto">
                 {/* En-tête patient */}
                 <div className="flex justify-between items-start mb-3">
                   <div className="flex items-start">
                     <div className={`${getUrgencyColor(selectedPatient.adjustedUrgency || selectedPatient.assignedUrgency)} p-2 rounded-full`}>
                       <User size={24} className="text-white" />
                     </div>
                     <div className="ml-2">
                       <h3 className="font-bold text-lg">{selectedPatient.name}</h3>
                       <p className="text-sm text-gray-500">{selectedPatient.age} ans, {selectedPatient.gender}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className={`mb-1 px-2 py-1 inline-block rounded-full ${getUrgencyColor(selectedPatient.adjustedUrgency || selectedPatient.assignedUrgency)} text-white font-medium`}>
                       {getUrgencyText(selectedPatient.adjustedUrgency || selectedPatient.assignedUrgency)}
                     </div>
                     <p className="text-sm text-gray-500">Enregistré à {selectedPatient.time}</p>
                   </div>
                 </div>
                 
                 {/* Informations du centre et secrétaire */}
                 <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} mb-3 flex justify-between`}>
                   <div>
                     <p className="text-xs text-gray-500">Centre</p>
                     <p className="font-medium text-sm flex items-center">
                       <MapPin size={14} className="mr-1 text-blue-600" />
                       {getCenterName(selectedPatient.center)}
                       <span className="ml-1 px-1 bg-blue-100 text-blue-800 rounded text-xs">
                         {getCenterCode(selectedPatient.center)}
                       </span>
                     </p>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500">Enregistré par</p>
                     <p className="font-medium text-sm flex items-center">
                       <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs mr-1">
                         {getSecretaryAvatar(selectedPatient.secretary)}
                       </div>
                       {getSecretaryName(selectedPatient.secretary)}
                     </p>
                   </div>
                 </div>
                 
                 {/* Bloc de validation d'urgence */}
                 <div className="mb-3 flex items-stretch">
                   <div className={`flex-grow p-3 rounded-l-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                     <h4 className="font-medium text-sm flex items-center mb-2">
                       <ShieldAlert size={16} className="mr-1 text-orange-500" />
                       Niveau d'urgence assigné
                     </h4>
                     <div className="flex items-center text-center">
                       <div className="flex-1">
                         <div className={`w-10 h-10 rounded-full ${getUrgencyColor(1)} mx-auto flex items-center justify-center`}>
                           <span className="text-white font-bold">1</span>
                         </div>
                         <p className="text-xs mt-1">Non urgent</p>
                       </div>
                       <div className="flex-1">
                         <div className={`w-10 h-10 rounded-full ${getUrgencyColor(2)} mx-auto flex items-center justify-center`}>
                           <span className="text-white font-bold">2</span>
                         </div>
                         <p className="text-xs mt-1">Peu urgent</p>
                       </div>
                       <div className="flex-1">
                         <div className={`w-10 h-10 rounded-full ${getUrgencyColor(3)} mx-auto flex items-center justify-center`}>
                           <span className="text-white font-bold">3</span>
                         </div>
                         <p className="text-xs mt-1">Urgent</p>
                       </div>
                       <div className="flex-1">
                         <div className={`w-10 h-10 rounded-full ${getUrgencyColor(4)} mx-auto flex items-center justify-center ${selectedPatient.assignedUrgency === 4 ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
                           <span className="text-white font-bold">4</span>
                         </div>
                         <p className="text-xs mt-1">Très urgent</p>
                       </div>
                       <div className="flex-1">
                         <div className={`w-10 h-10 rounded-full ${getUrgencyColor(5)} mx-auto flex items-center justify-center ${selectedPatient.assignedUrgency === 5 ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
                           <span className="text-white font-bold">5</span>
                         </div>
                         <p className="text-xs mt-1">Critique</p>
                       </div>
                     </div>
                   </div>
                   <div className="w-44 p-3 rounded-r-md bg-blue-600 flex flex-col justify-between">
                     <h4 className="font-medium text-sm text-white mb-2 text-center">Actions</h4>
                     <div className="space-y-2">
                       <button 
                         onClick={handleValidateUrgency}
                         className="w-full py-1 rounded bg-white text-blue-800 text-xs font-medium flex items-center justify-center"
                       >
                         <CheckCircle size={14} className="mr-1" />
                         Valider
                       </button>
                       <div className="flex justify-between">
                         <button 
                           onClick={() => handleAdjustUrgency(-1)}
                           className="flex-1 mr-1 py-1 rounded bg-blue-500 text-white text-xs font-medium flex items-center justify-center"
                         >
                           <ArrowDown size={14} />
                         </button>
                         <button 
                           onClick={() => handleAdjustUrgency(1)}
                           className="flex-1 py-1 rounded bg-blue-500 text-white text-xs font-medium flex items-center justify-center"
                         >
                           <ArrowUp size={14} />
                         </button>
                       </div>
                       <button 
                         onClick={handleForcePriority}
                         className="w-full py-1 rounded bg-red-100 text-red-800 text-xs font-medium flex items-center justify-center"
                       >
                         <AlertTriangle size={14} className="mr-1" />
                         Priorisation forcée
                       </button>
                     </div>
                   </div>
                 </div>
                 
                 {/* Justificatifs médicaux */}
                 <div className="mb-3">
                   <h4 className="font-medium text-sm mb-2 flex items-center">
                     <FileText size={16} className="mr-1 text-blue-600" />
                     Justificatifs médicaux
                   </h4>
                   <div className="grid grid-cols-2 gap-2">
                     <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                       <p className="text-xs text-gray-500">Motif de consultation</p>
                       <p className="font-medium text-sm">{selectedPatient.reason}</p>
                     </div>
                     <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                       <p className="text-xs text-gray-500">Notes</p>
                       <p className="font-medium text-sm">{selectedPatient.notes}</p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Signes vitaux */}
                 <div className="mb-3">
                   <h4 className="font-medium text-sm mb-2 flex items-center">
                     <Heart size={16} className="mr-1 text-red-600" />
                     Paramètres vitaux
                   </h4>
                   <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex flex-wrap`}>
                     <div className="w-1/5 p-1">
                       <p className="text-xs text-gray-500">Temp.</p>
                       <p className={`font-medium text-sm ${selectedPatient.vitalSigns.temp > 38 ? 'text-red-600' : ''}`}>
                         {selectedPatient.vitalSigns.temp}°C
                       </p>
                     </div>
                     <div className="w-1/5 p-1">
                       <p className="text-xs text-gray-500">FC</p>
                       <p className={`font-medium text-sm ${selectedPatient.vitalSigns.hr > 100 ? 'text-red-600' : ''}`}>
                         {selectedPatient.vitalSigns.hr} bpm
                       </p>
                     </div>
                     <div className="w-1/5 p-1">
                       <p className="text-xs text-gray-500">TA</p>
                       <p className={`font-medium text-sm ${selectedPatient.vitalSigns.bp.startsWith('1') && parseInt(selectedPatient.vitalSigns.bp.split('/')[0]) > 140 ? 'text-red-600' : ''}`}>
                         {selectedPatient.vitalSigns.bp}
                       </p>
                     </div>
                     <div className="w-1/5 p-1">
                       <p className="text-xs text-gray-500">SpO2</p>
                       <p className={`font-medium text-sm ${selectedPatient.vitalSigns.spo2 < 95 ? 'text-red-600' : ''}`}>
                         {selectedPatient.vitalSigns.spo2}%
                       </p>
                     </div>
                     <div className="w-1/5 p-1">
                       <p className="text-xs text-gray-500">Douleur</p>
                       <p className={`font-medium text-sm ${selectedPatient.vitalSigns.pain > 7 ? 'text-red-600' : selectedPatient.vitalSigns.pain > 4 ? 'text-orange-600' : ''}`}>
                         {selectedPatient.vitalSigns.pain}/10
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Antécédents */}
                 <div className="mb-3">
                   <h4 className="font-medium text-sm mb-2 flex items-center">
                     <History size={16} className="mr-1 text-purple-600" />
                     Antécédents médicaux
                   </h4>
                   <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                     <div className="flex flex-wrap">
                       {selectedPatient.medicalHistory.map((item, index) => (
                         <span key={index} className="m-0.5 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                           {item}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
                 
                 {/* Actions supplémentaires */}
                 <div className="flex space-x-2 mb-3">
                   <button 
                     onClick={() => setShowCommentModal(true)}
                     className="flex-1 py-2 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center text-sm"
                   >
                     <MessageCircle size={16} className="mr-1" />
                     Commenter
                   </button>
                   <button className="flex-1 py-2 rounded-md bg-gray-100 text-gray-800 flex items-center justify-center text-sm">
                     <Eye size={16} className="mr-1" />
                     Voir DPI complet
                   </button>
                 </div>
               </div>
             </div>
           ) : (
             <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow h-full flex items-center justify-center p-6 text-center`}>
               <div>
                 <Shield size={48} className={`mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                 <h3 className="text-xl font-medium mb-2">Validation des niveaux d'urgence</h3>
                 <p className="text-gray-500 max-w-md mx-auto mb-4">
                   Sélectionnez un patient dans la liste pour vérifier et valider son niveau d'urgence. 
                   Vous pouvez ajuster le niveau si nécessaire ou appliquer une priorisation forcée.
                 </p>
                 <div className="flex justify-center">
                   <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-2 rounded-md">
                     <Info size={16} className="mr-2" />
                     <span className="text-sm">
                       {patients.filter(p => p.status === 'pending').length} patients en attente de validation
                     </span>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
     </div>
     
     {/* Modal de commentaire */}
     {showCommentModal && selectedPatient && (
       <Modal
         title={`Commentaire pour ${getSecretaryName(selectedPatient.secretary)}`}
         isOpen={showCommentModal}
         onClose={() => setShowCommentModal(false)}
         darkMode={darkMode}
         footer={
           <div className="flex justify-between items-center w-full">
             <div className="flex items-center text-xs text-gray-500">
               <CheckSquare size={14} className="mr-1" />
               Une notification sera envoyée au secrétaire
             </div>
             <button 
               onClick={handleSendComment}
               className="px-3 py-1.5 bg-blue-600 text-white rounded flex items-center text-sm"
               disabled={!commentText}
             >
               <Send size={14} className="mr-1" />
               Envoyer
             </button>
           </div>
         }
       >
         <textarea 
           className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} min-h-32`}
           placeholder="Saisissez votre commentaire ici..."
           value={commentText}
           onChange={(e) => setCommentText(e.target.value)}
         ></textarea>
       </Modal>
     )}
   </div>
 );
};

export default EagleUrgencyValidation;