import React, { useState, useEffect } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, ChevronDown, MoreVertical, UserPlus, RefreshCw, Monitor, ChevronRight, ArrowRight, ExternalLink, AlertCircle, MapPin, ChevronLeft, Upload, Download, Video, Trash2, Copy, Plus, Edit, BarChart2, User, Mail, Phone, Clock, CheckCircle, XCircle, Info, AlignLeft, Clipboard, Layout, Grid, List, ChevronsLeft, ChevronsRight, ArrowLeft, Archive, Sliders, Send, PlusCircle, Eye, Star, Heart, Award, Zap, BarChart, PieChart, TrendingUp, Share2, Bookmark, Layers, Shuffle, Repeat, Book, Coffee, Printer, Shield, Database, Briefcase, Lock, Unlock, History, Scissors, Slash, AlertOctagon, Meh, Command, BellOff, BookOpen, RotateCcw, Tag, Paperclip, Link2, GitBranch, GitMerge, Target, Crop, Maximize, Minimize, Save
} from 'lucide-react';

// Layout
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { ViewSelector } from '@layout/ViewSelector';
import MultiTabContainer from '@layout/MultiTabContainer';

// Formulaires
import { SearchInput } from '@forms/SearchInput';

// Affichage de données
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';
import { ConsultantCard } from '@cards/ConsultantCard';

// Interaction
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import FloatingActionButton from '@buttons/FloatingActionButton';

// Overlays & Panels
import { Modal } from '@modals/Modal';
import { SidePanel } from '@panels/SidePanel';
import ExpandablePanel from '@panels/ExpandablePanel';

// Fonctionnalités spécialisées
import { AppointmentCalendar } from '@calendar/AppointmentCalendar';
import { ConflictManager } from '@scheduling/ConflictManager';
import HistoryTracker from '@tracking/HistoryTracker';

// Utilitaires communs
import { ConnectionStatus } from '@common/ConnectionStatus';
import ThemeSwitcher from '@common/ThemeSwitcher';

// Mocks
import { mockMedicalTeam } from '@mocks/doctors';
import mockNotificationsData from '@mocks/notifications';
import mockModificationHistory from '@mocks/modificationHistory';
import { mockCenters } from '@mocks/centers';

// Constantes
import { SPECIALTY_OPTIONS } from '@constants/emergencyConstants';
import { COLORS } from '@constants/colors';
import { USER_ROLES, NOTIFICATION_TYPES } from '@constants';

// Utilitaires
import { getUrgencyColor, getStatusBadgeVariant, formatWaitTime } from '@utils/statusUtils';
import { formatDate, formatTime } from '@utils/dateUtils';

const EagleConsultantManagement = () => {
  // États principaux
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('week');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isCompactView, setIsCompactView] = useState(false);
  
  // États pour les nouvelles fonctionnalités
  const [currentTab, setCurrentTab] = useState('planning');
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConflictsPanel, setShowConflictsPanel] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showLegend, setShowLegend] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [dashboardLayout, setDashboardLayout] = useState('standard');
  const [favoriteFilters, setFavoriteFilters] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [activityFeed, setActivityFeed] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // États pour le menu des filtres amélioré
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [showFilterEditModal, setShowFilterEditModal] = useState(false);
  const [filterCategories, setFilterCategories] = useState(['Personnels', 'Partagés', 'Système']);
  const [activeFilterCategory, setActiveFilterCategory] = useState('Personnels');
  const [currentFilterEditData, setCurrentFilterEditData] = useState(null);
  
  // États pour la gestion des disponibilités
  const [showScheduleContextMenu, setShowScheduleContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({x: 0, y: 0});
  const [selectedScheduleItem, setSelectedScheduleItem] = useState(null);
  const [showScheduleEditModal, setShowScheduleEditModal] = useState(false);
  const [isNewScheduleItem, setIsNewScheduleItem] = useState(false);
  
  // Utilisation des données partagées
  const specialties = ['Toutes les spécialités', ...SPECIALTY_OPTIONS.map(s => s.label)];
  
  // Adaptation des données des consultants depuis mockMedicalTeam
  const consultants = [
    { id: 1, name: "Dr. Nana", specialty: "Cardiologie", avatar: "NM", color: "bg-blue-600", availability: 80, patients: 42, avgConsultation: 18, workDays: [1, 2, 3, 4, 5] },
    { id: 2, name: "Dr. Tamo", specialty: "Pédiatrie", avatar: "MT", color: "bg-green-600", availability: 60, patients: 36, avgConsultation: 15, workDays: [1, 3, 5] },
    { id: 3, name: "Dr. Sob", specialty: "Dermatologie", avatar: "JS", color: "bg-purple-600", availability: 100, patients: 28, avgConsultation: 20, workDays: [1, 2, 3, 4, 5] },
    { id: 4, name: "Dr. Meka", specialty: "Gynécologie", avatar: "EM", color: "bg-pink-600", availability: 40, patients: 18, avgConsultation: 25, workDays: [2, 4] },
    { id: 5, name: "Dr. Fouda", specialty: "Neurologie", avatar: "LF", color: "bg-yellow-600", availability: 70, patients: 22, avgConsultation: 30, workDays: [1, 2, 3, 5] },
    { id: 6, name: "Dr. Ebogo", specialty: "Ophtalmologie", avatar: "CE", color: "bg-indigo-600", availability: 50, patients: 32, avgConsultation: 12, workDays: [1, 3, 4, 5] }
  ];
  
  // Utilisation des données de notifications partagées (adaptées)
  const notifications = mockNotificationsData.slice(0, 4).map(notif => ({
    id: notif.id,
    type: notif.type === 'urgent' ? 'conflit' : notif.type === 'info' ? 'demande' : notif.type,
    message: notif.title,
    time: notif.time,
    read: notif.read
  }));

  // Utilisation de l'historique partagé (adapté)
  const historyItems = mockModificationHistory.slice(0, 3).map(item => ({
    id: item.id,
    user: item.user,
    action: item.action,
    resourceType: item.entityType === 'patient' ? 'plage horaire' : item.entityType,
    details: item.details,
    timestamp: item.timestamp
  }));

  // Utilisation du centre principal depuis mockCenters
  const centerInfo = mockCenters.find(center => center.type === 'primary') || {
    name: "Centre Médical Principal - Yaoundé",
    code: "CMP-YDE",
    type: "Centre Principal",
    satellites: ["CSJ-YDE", "CMB-DLA", "CAM-GSR"]
  };
  
  // Données pour les filtres améliorés
  const predefinedFilters = [
    // Filtres personnels
    { id: 1, name: "Cardiologues uniquement", category: "Personnels", specialty: "Cardiologie", icon: "Heart", color: "text-blue-500", isPinned: true, createdBy: "Vous", lastUsed: "Aujourd'hui" },
    { id: 2, name: "Temps partiels", category: "Personnels", availability: { min: 0, max: 60 }, icon: "Clock", color: "text-purple-500", isPinned: false, createdBy: "Vous", lastUsed: "Hier" },
    { id: 3, name: "Lundi-mercredi-vendredi", category: "Personnels", workDays: [1, 3, 5], icon: "Calendar", color: "text-green-500", isPinned: true, createdBy: "Vous", lastUsed: "Il y a 3 jours" },
    
    // Filtres partagés
    { id: 4, name: "Haute disponibilité", category: "Partagés", availability: { min: 80, max: 100 }, icon: "CheckCircle", color: "text-teal-500", isPinned: false, createdBy: "Admin", lastUsed: "Il y a 1 semaine" },
    { id: 5, name: "Consultations courtes", category: "Partagés", avgConsultation: { max: 20 }, icon: "Zap", color: "text-indigo-500", isPinned: false, createdBy: "Admin", lastUsed: "Il y a 2 semaines" },
    
    // Filtres système
    { id: 6, name: "Tous les consultants", category: "Système", specialty: "all", icon: "Users", color: "text-gray-500", isPinned: false, createdBy: "Système", lastUsed: "Permanent" },
    { id: 7, name: "Vue hebdomadaire complète", category: "Système", view: "week", showStats: true, showHeatmap: true, icon: "BarChart", color: "text-orange-500", isPinned: false, createdBy: "Système", lastUsed: "Permanent" }
  ];
  
  // Données pour les conflits
  const conflicts = [
    { id: 1, consultants: ['Dr. Nana', 'Dr. Fouda'], day: 'Mercredi', reason: 'Même plage horaire (09:00-11:00)', severity: 'high', status: 'nouveau' },
    { id: 2, consultants: ['Dr. Tamo', 'Dr. Sob'], day: 'Vendredi', reason: 'Spécialités requérant même équipement', severity: 'medium', status: 'en_cours' },
    { id: 3, consultants: ['Dr. Meka'], day: 'Jeudi', reason: 'Dépassement heures contractuelles', severity: 'low', status: 'résolu' }
  ];

  // Suggestions
  const optimizationSuggestions = [
    { id: 1, title: "Équilibrer la charge", description: "Transférer 2 patients de Dr. Nana à Dr. Sob le mercredi", impact: "Réduction temps d'attente: -15min", severity: "medium" },
    { id: 2, title: "Optimiser les absences", description: "Décaler congé Dr. Fouda d'une semaine", impact: "Couverture spécialités: +40%", severity: "high" },
    { id: 3, title: "Réorganisation plages", description: "Fusionner plages courtes du vendredi matin", impact: "Efficacité: +12%", severity: "low" }
  ];

  // Modèles de planning
  const planningTemplates = [
    { id: 1, name: "Standard hebdomadaire", description: "Planning régulier avec rotation" },
    { id: 2, name: "Période de vacances", description: "Couverture minimale pendant congés" },
    { id: 3, name: "Haute affluence", description: "Maximisation des ressources" },
    { id: 4, name: "Alternance centres", description: "Rotation entre principal et secondaires" }
  ];

  // Données pour le calendrier
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);
  
  // Pour AppointmentCalendar
  const appointments = [];

  // Annotations
  const annotations = [
    { id: 1, day: 2, time: 10, consultant: 1, text: "Réunion équipe médicale", color: "bg-blue-100" },
    { id: 2, day: 4, time: 14, consultant: 3, text: "Formation nouvelle procédure", color: "bg-green-100" }
  ];

  // Schedule data (simplified for demo)
  const scheduleData = [
    { consultantId: 1, day: 0, startTime: 8, endTime: 12, specialty: "Cardiologie", type: "récurrent" },
    { consultantId: 1, day: 2, startTime: 9, endTime: 15, specialty: "Cardiologie", type: "récurrent" },
    { consultantId: 1, day: 4, startTime: 13, endTime: 17, specialty: "Cardiologie", type: "exceptionnel" },
    { consultantId: 2, day: 0, startTime: 14, endTime: 17, specialty: "Pédiatrie", type: "récurrent" },
    { consultantId: 2, day: 2, startTime: 8, endTime: 12, specialty: "Pédiatrie", type: "récurrent" },
    { consultantId: 2, day: 4, startTime: 9, endTime: 15, specialty: "Pédiatrie", type: "récurrent" },
    { consultantId: 3, day: 1, startTime: 8, endTime: 12, specialty: "Dermatologie", type: "récurrent" },
    { consultantId: 3, day: 3, startTime: 13, endTime: 17, specialty: "Dermatologie", type: "récurrent" },
    { consultantId: 4, day: 1, startTime: 9, endTime: 15, specialty: "Gynécologie", type: "récurrent" },
    { consultantId: 4, day: 3, startTime: 9, endTime: 15, specialty: "Gynécologie", type: "récurrent" },
    { consultantId: 5, day: 0, startTime: 9, endTime: 17, specialty: "Neurologie", type: "exceptionnel" },
    { consultantId: 5, day: 2, startTime: 13, endTime: 17, specialty: "Neurologie", type: "récurrent" },
    { consultantId: 6, day: 0, startTime: 13, endTime: 17, specialty: "Ophtalmologie", type: "récurrent" },
    { consultantId: 6, day: 2, startTime: 8, endTime: 12, specialty: "Ophtalmologie", type: "récurrent" },
    { consultantId: 6, day: 4, startTime: 8, endTime: 12, specialty: "Ophtalmologie", type: "exceptionnel" }
  ];

  // Absences
  const absences = [
    { consultantId: 2, startDate: "2025-05-20", endDate: "2025-05-25", type: "Congé", approved: true },
    { consultantId: 4, startDate: "2025-05-15", endDate: "2025-05-16", type: "Formation", approved: true },
    { consultantId: 1, startDate: "2025-05-30", endDate: "2025-05-30", type: "Personnel", approved: false }
  ];

  // Favoris et vues personnalisées
  const savedViews = [
    { id: 1, name: "Vue urgences", filters: { specialties: ["Cardiologie", "Neurologie"], days: [1, 2, 3, 4, 5] } },
    { id: 2, name: "Temps partiels", filters: { minAvailability: 0, maxAvailability: 60, days: [1, 3, 5] } },
    { id: 3, name: "Suivi hebdo", filters: { view: "week", showStats: true, showHeatmap: true } }
  ];
  
  // Helper functions utilisant les modules partagés
  const getSpecialtyColor = (specialty) => {
    // Utilise les couleurs du système partagé
    const colorMap = {
      "Cardiologie": COLORS.URGENCY[1],
      "Pédiatrie": COLORS.SUCCESS[500],
      "Dermatologie": COLORS.PRIMARY[500],
      "Gynécologie": COLORS.WARNING[500],
      "Neurologie": COLORS.ERROR[500],
      "Ophtalmologie": COLORS.PRIMARY[600]
    };
    return colorMap[specialty] ? `bg-[${colorMap[specialty]}]` : "bg-gray-500";
  };
  
  const getSpecialtyTextColor = (specialty) => {
    const colors = {
      "Cardiologie": "text-blue-800",
      "Pédiatrie": "text-green-800",
      "Dermatologie": "text-purple-800",
      "Gynécologie": "text-pink-800",
      "Neurologie": "text-yellow-800",
      "Ophtalmologie": "text-indigo-800"
    };
    return colors[specialty] || "text-gray-800";
  };
  
  const getConflictSeverityClass = (severity) => {
    // Utilise getStatusBadgeVariant du système partagé
    const variant = severity === 'high' ? 'error' : severity === 'medium' ? 'warning' : 'info';
    const badgeClass = getStatusBadgeVariant(variant);
    
    const classes = {
      "high": "bg-red-100 text-red-800 border-red-300",
      "medium": "bg-orange-100 text-orange-800 border-orange-300",
      "low": "bg-yellow-100 text-yellow-800 border-yellow-300",
    };
    return classes[severity] || "bg-gray-100 text-gray-800 border-gray-300";
  };
  
  const getScheduleItemForCell = (consultantId, day, hour) => {
    return scheduleData.find(item => 
      item.consultantId === consultantId && 
      item.day === day && 
      hour >= item.startTime && 
      hour < item.endTime
    );
  };
  
  const getScheduleItemStyle = (item) => {
    if (!item) return {};
    const baseStyle = getSpecialtyColor(item.specialty);
    return `${baseStyle} ${item.type === 'exceptionnel' ? 'border-2 border-dashed border-white' : ''}`;
  };
  
  const getHeatmapColor = (day, hour) => {
    // Simulation d'une carte thermique de charge - en pratique, cela serait calculé
    const heatLevels = [
      "bg-green-100", "bg-green-200", "bg-yellow-100", "bg-yellow-200", 
      "bg-orange-100", "bg-red-100", "bg-red-200"
    ];
    // Simulons une charge plus élevée aux heures de pointe
    const morningPeak = hour >= 9 && hour <= 11;
    const afternoonPeak = hour >= 14 && hour <= 16;
    const busyDay = day === 1 || day === 3; // mardi et jeudi plus chargés
    
    if (busyDay && (morningPeak || afternoonPeak)) {
      return afternoonPeak ? heatLevels[5] : heatLevels[4];
    } else if (busyDay || morningPeak || afternoonPeak) {
      return busyDay ? heatLevels[3] : heatLevels[2];
    }
    return heatLevels[0];
  };
  
  const getNotificationIconByType = (type) => {
    switch(type) {
      case 'conflit': return <AlertTriangle size={16} className="text-red-500" />;
      case 'demande': return <MessageSquare size={16} className="text-blue-500" />;
      case 'rappel': return <Clock size={16} className="text-yellow-500" />;
      case 'système': return <Info size={16} className="text-gray-500" />;
      default: return <Bell size={16} />;
    }
  };
  
  // Handle week navigation
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };
  
  const goToPrevWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };
  
  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };
  
  const formatWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay() + 1);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const formatDate = (d) => `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };
  
  // Handle drag and drop
  const handleDragStart = (e, consultant) => {
    e.dataTransfer.setData("consultantId", consultant.id);
    // Ajouter une classe visuelle pour l'élément en cours de déplacement
    e.currentTarget.classList.add("opacity-50", "border-2", "border-blue-500");
  };
  
  const handleDragEnd = (e) => {
    // Restaurer l'apparence normale
    e.currentTarget.classList.remove("opacity-50", "border-2", "border-blue-500");
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    // Ajouter un effet visuel sur la zone de dépôt potentielle
    e.currentTarget.classList.add("bg-opacity-50", "border-2", "border-dashed", "border-blue-400");
  };
  
  const handleDragLeave = (e) => {
    // Restaurer l'apparence normale de la zone de dépôt
    e.currentTarget.classList.remove("bg-opacity-50", "border-2", "border-dashed", "border-blue-400");
  };
  
  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-opacity-50", "border-2", "border-dashed", "border-blue-400");
    const consultantId = parseInt(e.dataTransfer.getData("consultantId"));
    
    // Simuler l'ajout d'un élément dans l'historique
    const consultant = consultants.find(c => c.id === consultantId);
    const historyItem = {
      id: historyItems.length + 1,
      user: { id: '1', name: "Sarah P.", role: "Administrateur" },
      action: "create",
      resourceType: "plage horaire",
      details: `${consultant.name}: ${hour}:00-${hour+1}:00 ${weekDays[day]}`,
      timestamp: "À l'instant"
    };
    setActivityFeed([historyItem, ...activityFeed.slice(0, 4)]);
    
    // Afficher notification de confirmation
    alert(`Plage horaire ajoutée: ${consultant.name} - ${weekDays[day]} à ${hour}:00`);
  };
  
  // Fonction pour gérer le zoom
  const handleZoomChange = (newZoom) => {
    if (newZoom >= 0.5 && newZoom <= 2) {
      setZoomLevel(newZoom);
    }
  };
  
  // Fonction pour gérer le clic droit sur une plage horaire
  const handleScheduleContextMenu = (e, consultantId, day, hour, scheduleItem) => {
    e.preventDefault(); // Empêcher le menu contextuel du navigateur
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowScheduleContextMenu(true);
    
    if (scheduleItem) {
      // Si une plage existe déjà
      setSelectedScheduleItem(scheduleItem);
      setIsNewScheduleItem(false);
    } else {
      // Pour créer une nouvelle plage
      setSelectedScheduleItem({
        consultantId: consultantId,
        day: day,
        startTime: hour,
        endTime: hour + 1,
        specialty: consultants.find(c => c.id === consultantId).specialty,
        type: "récurrent"
      });
      setIsNewScheduleItem(true);
    }
  };
  
  // Fonction pour supprimer une plage horaire
  const deleteScheduleItem = (item) => {
    // Dans une application réelle, nous enverrions cela à une API
    // Ici, on simule la suppression pour la démonstration
    alert(`Plage horaire supprimée: ${weekDays[item.day]} de ${item.startTime}:00 à ${item.endTime}:00`);
    
    // Loguer dans l'historique
    const consultant = consultants.find(c => c.id === item.consultantId);
    const historyItem = {
      id: historyItems.length + activityFeed.length + 1,
      user: { id: '1', name: "Sarah P.", role: "Administrateur" },
      action: "delete",
      resourceType: "plage horaire",
      details: `${consultant.name}: ${item.startTime}:00-${item.endTime}:00 ${weekDays[item.day]}`,
      timestamp: "À l'instant"
    };
    setActivityFeed([historyItem, ...activityFeed]);
    
    setShowScheduleContextMenu(false);
  };
  
  // Fonction pour modifier une plage horaire
  const editScheduleItem = (item) => {
    setSelectedScheduleItem(item);
    setShowScheduleEditModal(true);
    setShowScheduleContextMenu(false);
  };
  
  // Fonction pour mettre à jour une plage horaire
  const updateScheduleItem = (updatedItem) => {
    // Dans une application réelle, nous enverrions cela à une API
    // Ici, on simule la mise à jour pour la démonstration
    alert(`Plage horaire ${isNewScheduleItem ? 'ajoutée' : 'modifiée'}: ${weekDays[updatedItem.day]} de ${updatedItem.startTime}:00 à ${updatedItem.endTime}:00`);
    
    // Loguer dans l'historique
    const consultant = consultants.find(c => c.id === updatedItem.consultantId);
    const historyItem = {
      id: historyItems.length + activityFeed.length + 1,
      user: { id: '1', name: "Sarah P.", role: "Administrateur" },
      action: isNewScheduleItem ? "create" : "update",
      resourceType: "plage horaire",
      details: `${consultant.name}: ${updatedItem.startTime}:00-${updatedItem.endTime}:00 ${weekDays[updatedItem.day]}`,
      timestamp: "À l'instant"
    };
    setActivityFeed([historyItem, ...activityFeed]);
    
    setShowScheduleEditModal(false);
  };
  
  // Fonction pour appliquer un filtre
  const applyFilter = (filter) => {
    if (filter.specialty) {
      setSelectedSpecialty(filter.specialty);
    }
    
    if (filter.view) {
      setCurrentView(filter.view);
    }
    
    if (filter.showStats !== undefined) {
      setShowStats(filter.showStats);
    }
    
    if (filter.showHeatmap !== undefined) {
      setShowHeatmap(filter.showHeatmap);
    }
    
    if (filter.workDays) {
      // Dans une implémentation complète, on appliquerait aussi ce filtre
      console.log(`Filtrage par jours de travail: ${filter.workDays.join(', ')}`);
    }
    
    // Fermer le menu
    setShowFiltersMenu(false);
    
    // Mettre à jour la date de dernière utilisation
    // (non implémenté ici, mais serait important dans une application réelle)
  };
  
  // Fonction pour ajouter un filtre aux favoris
  const saveCurrentFilter = () => {
    // Au lieu d'ajouter directement un filtre, on ouvre le modal d'édition
    setCurrentFilterEditData({
      name: "Nouveau filtre",
      category: "Personnels",
      specialty: selectedSpecialty,
      view: currentView,
      icon: "Star",
      color: "text-yellow-500",
      isPinned: false,
      createdBy: "Vous",
      lastUsed: "À l'instant"
    });
    setShowFilterEditModal(true);
    // Important : fermer le menu des filtres quand on ouvre le modal
    setShowFiltersMenu(false);
  };
  
  // Fonction pour épingler/désépingler un filtre
  const togglePinFilter = (filterId) => {
    const updatedFilters = [...favoriteFilters];
    const filterIndex = updatedFilters.findIndex(f => f.id === filterId);
    
    if (filterIndex !== -1) {
      updatedFilters[filterIndex].isPinned = !updatedFilters[filterIndex].isPinned;
      setFavoriteFilters(updatedFilters);
    }
  };
  
  // Fonction pour supprimer un filtre
  const deleteFilter = (filterId) => {
    const updatedFilters = favoriteFilters.filter(f => f.id !== filterId);
    setFavoriteFilters(updatedFilters);
  };
  
  // Fonction pour partager un filtre
  const shareFilter = (filterId) => {
    // Dans une application réelle, cela ouvrirait une interface de partage
    alert(`Filtre partagé avec tous les utilisateurs`);
  };
  
  // Fonction pour appliquer un modèle
  const applyTemplate = (templateId) => {
    alert(`Modèle appliqué: ${planningTemplates.find(t => t.id === templateId).name}`);
    setShowTemplateModal(false);
  };
  
  // Fonction pour gérer les annotations
  const toggleAnnotation = (day, time, consultant) => {
    setActiveAnnotation({ day, time, consultant });
    setShowAnnotationPanel(true);
  };

  // Simuler un changement de layout du dashboard
  const changeLayout = (layout) => {
    setDashboardLayout(layout);
  };
  
  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Exemples de raccourcis
      if (e.ctrlKey && e.key === 'n') {
        setShowAvailabilityModal(true);
        e.preventDefault();
      } else if (e.ctrlKey && e.key === 'f') {
        document.getElementById('search-input')?.focus();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setShowAvailabilityModal(false);
        setShowTemplateModal(false);
        setShowShortcutsModal(false);
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Fil d'Ariane
  const getBreadcrumbs = () => {
    const crumbs = ["EAGLE", "Gestion Consultants"];
    if (currentTab === 'planning') crumbs.push("Planning");
    if (currentTab === 'consultants') crumbs.push("Liste Consultants");
    if (currentTab === 'stats') crumbs.push("Statistiques");
    if (currentTab === 'conflits') crumbs.push("Gestion Conflits");
    
    return (
      <div className="flex items-center text-xs text-gray-500 mb-2">
        {crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight size={12} className="mx-1" />}
            <span className={index === crumbs.length - 1 ? "font-medium" : ""}>{crumb}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Configurer les éléments du menu pour Sidebar
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <Users size={18} />, label: "Patients", path: "#", isActive: false },
    { icon: <Calendar size={18} />, label: "Gestion Consultants", path: "#", isActive: true },
    { icon: <Activity size={18} />, label: "Consultations", path: "#", isActive: false },
    { icon: <FileText size={18} />, label: "Documents", path: "#", isActive: false },
    { icon: <ClipboardList size={18} />, label: "Rapports", path: "#", isActive: false },
    { icon: <MessageSquare size={18} />, label: "Messages", path: "#", isActive: false }
  ];

  const bottomMenuItems = [
    { icon: <Command size={18} />, label: "Raccourcis", path: "#" },
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];

  // Préparation des données pour les tabs
  const tabs = [
    { id: 'planning', label: 'Planning', content: null, badge: null },
    { id: 'consultants', label: 'Consultants', content: null, badge: null },
    { id: 'stats', label: 'Statistiques', content: null, badge: null },
    { id: 'conflits', label: 'Conflits', content: null, badge: conflicts.filter(c => c.status === 'nouveau').length || null }
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Navigation latérale en utilisant le composant Sidebar */}
      <Sidebar 
        appName="EAGLE"
        menuItems={menuItems}
        bottomMenuItems={bottomMenuItems}
        darkMode={darkMode}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* En-tête en utilisant le composant Header */}
        <Header
          title="Gestion des Consultants"
          subtitle={centerInfo.name}
          centerInfo={centerInfo}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{
            initials: "SP",
            name: "Sarah Principale"
          }}
          notificationCount={notifications.filter(n => !n.read).length}
          extraHeaderItems={
            <div className="flex items-center space-x-2">
              <div className="flex items-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                <Calendar size={12} className="mr-1" />
                <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <button 
                onClick={() => setFocusMode(!focusMode)}
                className={`ml-2 text-xs flex items-center px-2 py-0.5 rounded-md ${focusMode ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                title="Mode focus"
              >
                <Target size={12} className="mr-1" />
                {focusMode ? "Quitter Focus" : "Mode Focus"}
              </button>
              
              <ConnectionStatus 
                isOnline={true}
                showStats={false}
                showControls={false}
                mode="badge"
              />
            </div>
          }
        />
        
        {/* Fil d'Ariane */}
        <div className="px-3 py-1 border-b border-gray-200">
          {getBreadcrumbs()}
          
          {/* Onglets de navigation */}
          <MultiTabContainer 
            tabs={tabs} 
            defaultTabId={currentTab}
            onChange={setCurrentTab}
          />
        </div>
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-3">
          {/* Barre d'actions et filtres */}
          <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
            <ButtonGroup className="flex flex-wrap gap-1">
              <ActionButton 
                label="Nouveau Consultant"
                icon={<UserPlus size={14} />}
                variant="primary"
                title="Ajouter un nouveau consultant (Ctrl+Shift+N)"
              />
              
              <ActionButton 
                label="Ajouter Disponibilité"
                icon={<Plus size={14} />}
                variant="success"
                onClick={() => setShowAvailabilityModal(true)}
                title="Ajouter une disponibilité (Ctrl+N)"
              />
              
              <ActionButton 
                label="Modèles de Planning"
                icon={<Copy size={14} />}
                variant="warning"
                onClick={() => setShowTemplateModal(true)}
              />
              
              <ActionButton 
                label="Exporter"
                icon={<Download size={14} />}
                variant="secondary"
              />
              
              <ActionButton 
                label="Optimisation"
                icon={<Zap size={14} />}
                variant="info"
                onClick={() => setShowSuggestions(!showSuggestions)}
                count={optimizationSuggestions.length}
              />
            </ButtonGroup>
            
            <div className="flex space-x-1">
              <select
                className={`px-3 py-1.5 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                title="Filtrer par spécialité"
              >
                {specialties.map((specialty, index) => (
                  <option key={index} value={specialty === 'Toutes les spécialités' ? 'all' : specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
              
              <div className="relative">
                <ActionButton 
                  label="Filtres"
                  icon={<Bookmark size={14} />}
                  variant="secondary"
                  onClick={() => setShowFiltersMenu(!showFiltersMenu)}
                  title="Gérer les filtres"
                />
                
                {showFiltersMenu && (
                  <>
                    {/* Overlay pour capturer les clics à l'extérieur et fermer le menu */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowFiltersMenu(false)}
                    ></div>
                    
                    {/* Positionnement ajusté pour éviter d'être coupé par la barre de navigation */}
                    <div className="absolute right-0 bottom-full mb-1 w-72 bg-white rounded-md shadow-lg z-20 py-1 text-xs">
                      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-medium">Filtres enregistrés</h3>
                        <div className="flex">
                          <button 
                            className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveCurrentFilter();
                            }}
                            title="Créer un nouveau filtre"
                          >
                            <Plus size={14} />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-50 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFiltersMenu(false);
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Navigation par catégories */}
                      <div className="px-2 py-1 border-b border-gray-200 flex space-x-1">
                        {filterCategories.map(category => (
                          <button
                            key={category}
                            className={`px-2 py-1 text-xs rounded-md ${activeFilterCategory === category ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCategory(category);
                            }}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                      
                      {/* Filtres épinglés - affichés en premier */}
                      {predefinedFilters.filter(filter => filter.isPinned).length > 0 && (
                        <div className="p-2 border-b border-gray-200">
                          <div className="flex items-center text-gray-500 mb-1">
                            <Star size={12} className="text-yellow-500 mr-1" />
                            <span>Épinglés</span>
                          </div>
                          {predefinedFilters
                            .filter(filter => filter.isPinned)
                            .map(filter => (
                              <div 
                                key={filter.id} 
                                className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-md group"
                              >
                                <div 
                                  className="flex items-center flex-1 cursor-pointer" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    applyFilter(filter);
                                  }}
                                >
                                  {filter.icon === "Heart" && <Heart size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "Clock" && <Clock size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "Calendar" && <Calendar size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "CheckCircle" && <CheckCircle size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "Zap" && <Zap size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "Users" && <Users size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "BarChart" && <BarChart size={14} className={`${filter.color} mr-1`} />}
                                  {filter.icon === "Star" && <Star size={14} className={`${filter.color} mr-1`} />}
                                  <span>{filter.name}</span>
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100">
                                  <button 
                                    className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      togglePinFilter(filter.id);
                                    }}
                                    title="Désépingler"
                                  >
                                    <Bookmark size={12} />
                                  </button>
                                  <button 
                                    className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 ml-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentFilterEditData(filter);
                                      setShowFilterEditModal(true);
                                    }}
                                    title="Modifier"
                                  >
                                    <Edit size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      
                      {/* Liste de filtres par catégorie */}
                      <div className="max-h-64 overflow-y-auto p-2" onClick={(e) => e.stopPropagation()}>
                        {predefinedFilters
                          .filter(filter => filter.category === activeFilterCategory && !filter.isPinned)
                          .map(filter => (
                            <div 
                              key={filter.id} 
                              className="flex items-center justify-between p-1 hover:bg-gray-50 rounded-md group mb-1"
                            >
                              <div 
                                className="flex items-center flex-1 cursor-pointer" 
                                onClick={() => applyFilter(filter)}
                              >
                                {filter.icon === "Heart" && <Heart size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "Clock" && <Clock size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "Calendar" && <Calendar size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "CheckCircle" && <CheckCircle size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "Zap" && <Zap size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "Users" && <Users size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "BarChart" && <BarChart size={14} className={`${filter.color} mr-1`} />}
                                {filter.icon === "Star" && <Star size={14} className={`${filter.color} mr-1`} />}
                                <span className="truncate">{filter.name}</span>
                                <span className="ml-1 text-gray-400 text-xs">{filter.lastUsed}</span>
                              </div>
                              <div className="flex items-center opacity-0 group-hover:opacity-100">
                                <button 
                                  className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePinFilter(filter.id);
                                  }}
                                  title="Épingler"
                                >
                                  <Bookmark size={12} />
                                </button>
                                
                                {filter.category !== 'Système' && (
                                  <>
                                    <button 
                                      className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 ml-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentFilterEditData(filter);
                                        setShowFilterEditModal(true);
                                      }}
                                      title="Modifier"
                                    >
                                      <Edit size={12} />
                                    </button>
                                    
                                    <button 
                                      className="p-1 text-gray-500 hover:text-blue-600 rounded hover:bg-gray-100 ml-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        shareFilter(filter.id);
                                      }}
                                      title="Partager"
                                    >
                                      <Share2 size={12} />
                                    </button>
                                    
                                    <button 
                                      className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-gray-100 ml-1"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteFilter(filter.id);
                                      }}
                                      title="Supprimer"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                          
                        {predefinedFilters.filter(filter => filter.category === activeFilterCategory && !filter.isPinned).length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            Aucun filtre dans cette catégorie
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2 border-t border-gray-200 flex justify-between">
                        <button 
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveCurrentFilter();
                          }}
                        >
                          <Plus size={12} className="mr-1" />
                          Créer un nouveau filtre
                        </button>
                        
                        <button 
                          className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert('Import/Export de filtres');
                          }}
                        >
                          <Upload size={12} className="mr-1" />
                          Importer/Exporter
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <ViewSelector
                currentView={currentView}
                onChange={setCurrentView}
                availableViews={['day', 'week', 'month']}
              />
              
              <button
                className={`px-3 py-1.5 rounded-md text-xs ${isCompactView ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setIsCompactView(!isCompactView)}
                title={isCompactView ? "Vue standard" : "Vue compacte"}
              >
                {isCompactView ? (
                  <Maximize size={14} />
                ) : (
                  <Minimize size={14} />
                )}
              </button>
            </div>
          </div>
          
          {/* Contenus d'onglets */}
          {currentTab === 'planning' && (
            <>
              {/* Vue Planning */}
              {/* Légende */}
              {showLegend && (
                <div className={`mb-3 p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow flex items-center justify-between text-xs`}>
                  <div>
                    <span className="font-medium mr-2">Légende:</span>
                    <span className="mr-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                      Cardiologie
                    </span>
                    <span className="mr-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                      Pédiatrie
                    </span>
                    <span className="mr-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                      Dermatologie
                    </span>
                    <span className="mr-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-pink-500 mr-1"></span>
                      Gynécologie
                    </span>
                    <span className="mr-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                      Neurologie
                    </span>
                    <span className="mr-3">
                      <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-1"></span>
                      Ophtalmologie
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <span>
                      <span className="inline-block w-4 h-3 border-2 border-dashed border-white bg-blue-500 mr-1"></span>
                      Exceptionnel
                    </span>
                    <span>
                      <span className="inline-block w-4 h-3 bg-blue-500 mr-1"></span>
                      Récurrent
                    </span>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowLegend(false)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Planning Calendar */}
              <div className={`mb-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow overflow-hidden`}>
                {/* Calendar navigation */}
                <div className="flex justify-between items-center p-2 border-b border-gray-200">
                  <div className="flex space-x-2 items-center">
                    <button 
                      className="p-1 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center" 
                      onClick={goToPrevWeek}
                      title="Semaine précédente"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs"
                      onClick={goToCurrentWeek}
                      title="Revenir à la semaine actuelle"
                    >
                      Semaine actuelle
                    </button>
                    <button 
                      className="p-1 rounded-md bg-gray-100 text-gray-700 flex items-center justify-center"
                      onClick={goToNextWeek}
                      title="Semaine suivante"
                    >
                      <ChevronRight size={16} />
                    </button>
                    
                    <div className="text-sm font-medium ml-2">
                      {formatWeekRange(currentWeek)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Contrôles de zoom */}
                    <div className="flex items-center bg-gray-100 rounded-md">
                      <button 
                        className="p-1 text-gray-700"
                        onClick={() => handleZoomChange(zoomLevel - 0.25)}
                        disabled={zoomLevel <= 0.5}
                        title="Zoom arrière"
                      >
                        <Minimize size={16} />
                      </button>
                      <span className="px-2 text-xs font-medium">{Math.round(zoomLevel * 100)}%</span>
                      <button 
                        className="p-1 text-gray-700"
                        onClick={() => handleZoomChange(zoomLevel + 0.25)}
                        disabled={zoomLevel >= 2}
                        title="Zoom avant"
                      >
                        <Maximize size={16} />
                      </button>
                    </div>
                    
                    <button 
                      className={`p-1 rounded-md ${showHeatmap ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setShowHeatmap(!showHeatmap)}
                      title={showHeatmap ? "Masquer carte thermique" : "Afficher carte thermique"}
                    >
                      <TrendingUp size={16} />
                    </button>
                    
                    <button 
                      className="p-1 rounded-md bg-gray-100 text-gray-700"
                      onClick={() => setShowHistoryPanel(!showHistoryPanel)}
                      title="Historique des modifications"
                    >
                      <History size={16} />
                    </button>
                    
                    <button 
                      className={`p-1 rounded-md ${!showLegend ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}
                      onClick={() => setShowLegend(!showLegend)}
                      title={showLegend ? "Masquer légende" : "Afficher légende"}
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Panneau de calendrier avec historique si activé */}
                <div className="flex">
                  {/* Planning Calendar Grid */}
                  <div className={`flex-1 overflow-x-auto transition-all duration-300`} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}>
                    <div className={`min-w-max ${zoomLevel !== 1 ? 'pb-16 pr-16' : ''}`}>
                      {/* Day headers */}
                      <div className="flex">
                        <div className="w-32 p-2 border-r border-b border-gray-200 bg-gray-50 font-medium text-xs">
                          Consultants
                        </div>
                        {weekDays.slice(0, 5).map((day, index) => (
                          <div 
                            key={day} 
                            className="w-24 p-2 border-r border-b border-gray-200 bg-gray-50 font-medium text-xs text-center"
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      {/* Consultant rows */}
                      {consultants
                        .filter(consultant => selectedSpecialty === 'all' || consultant.specialty === selectedSpecialty)
                        .filter(consultant => !focusMode || (focusMode && selectedConsultant === consultant.id))
                        .map(consultant => (
                          <div key={consultant.id} className="flex">
                            {/* Consultant name cell */}
                            <div 
                              className={`w-32 p-2 border-r border-b border-gray-200 flex items-center ${selectedConsultant === consultant.id ? 'bg-blue-50' : ''}`}
                              draggable 
                              onDragStart={(e) => handleDragStart(e, consultant)}
                              onDragEnd={handleDragEnd}
                              onClick={() => setSelectedConsultant(consultant.id === selectedConsultant ? null : consultant.id)}
                            >
                              <div className={`w-6 h-6 rounded-full ${consultant.color} flex items-center justify-center text-white text-xs mr-2`}>
                                {consultant.avatar}
                              </div>
                              <div>
                                <div className="text-xs font-medium">{consultant.name}</div>
                                <div className="text-xs text-gray-500">{consultant.specialty}</div>
                              </div>
                            </div>
                            
                            {/* Schedule cells for each day */}
                            {Array.from({ length: 5 }, (_, dayIndex) => (
                              <div 
                                key={dayIndex}
                                className={`w-24 border-r border-b border-gray-200 relative ${consultant.workDays.includes(dayIndex + 1) ? '' : 'bg-gray-100'}`}
                              >
                                {/* Time slots within the day */}
                                {timeSlots.map((_, hourIndex) => {
                                  const scheduleItem = getScheduleItemForCell(consultant.id, dayIndex, hourIndex + 8);
                                  const annotation = annotations.find(a => 
                                    a.day === dayIndex && a.time === hourIndex + 8 && a.consultant === consultant.id
                                  );
                                  
                                  // Déterminer le style de la cellule
                                  let cellStyle = scheduleItem ? getScheduleItemStyle(scheduleItem) : '';
                                  if (showHeatmap && !scheduleItem) {
                                    cellStyle = getHeatmapColor(dayIndex, hourIndex + 8);
                                  }
                                  
                                  return (
                                    <div
                                      key={hourIndex}
                                      className={`h-6 border-t border-gray-100 ${cellStyle} relative hover:brightness-90 cursor-pointer`}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, dayIndex, hourIndex + 8)}
                                      onContextMenu={(e) => {
                                        // Afficher le menu contextuel pour éditer/supprimer
                                        handleScheduleContextMenu(e, consultant.id, dayIndex, hourIndex + 8, scheduleItem);
                                      }}
                                      onClick={(e) => {
                                        // Si on maintient Ctrl, afficher le menu d'annotation
                                        if (e.ctrlKey) {
                                          toggleAnnotation(dayIndex, hourIndex + 8, consultant.id);
                                        } else if (!scheduleItem) {
                                          // Si pas de plage et clic simple, proposition de création
                                          handleScheduleContextMenu(e, consultant.id, dayIndex, hourIndex + 8, null);
                                        }
                                      }}
                                      title={`${weekDays[dayIndex]} ${hourIndex + 8}:00 - ${hourIndex + 9}:00 (${scheduleItem ? scheduleItem.specialty : 'Disponible'}) - Clic droit pour options`}
                                    >
                                      {scheduleItem && hourIndex + 8 === scheduleItem.startTime && (
                                        <div className="text-white text-xs p-1 truncate">
                                          {scheduleItem.startTime}:00 - {scheduleItem.endTime}:00
                                        </div>
                                      )}
                                      
                                      {annotation && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border border-white z-10" title={annotation.text}></div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Historique des modifications si activé */}
                  {showHistoryPanel && (
                    <SidePanel
                      title="Historique des modifications"
                      isOpen={showHistoryPanel}
                      onClose={() => setShowHistoryPanel(false)}
                      darkMode={darkMode}
                      width="w-72"
                    >
                      <div className="p-2">
                        <HistoryTracker 
                          history={[...historyItems, ...activityFeed.map(item => ({
                            id: item.id,
                            type: item.resourceType,
                            action: item.action,
                            user: item.user,
                            timestamp: item.timestamp,
                            details: item.details
                          }))].slice(0, 10)}
                          maxHeight="500px"
                          showFilter={false}
                          showSearch={false}
                        />
                      </div>
                    </SidePanel>
                  )}
                </div>
              </div>
            </>
          )}
          
          {currentTab === 'consultants' && (
            <>
              {/* Vue Consultants */}
              <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow p-2`}>
                <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    Liste des Consultants
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="mr-2">Visualisation:</span>
                    <ViewSelector 
                      currentView={dashboardLayout}
                      onChange={changeLayout}
                      availableViews={['list', 'grid', 'standard']}
                    />
                  </div>
                </h3>
                
                <div className={`grid ${dashboardLayout === 'list' ? 'grid-cols-1' : dashboardLayout === 'grid' ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                  {consultants
                    .filter(consultant => selectedSpecialty === 'all' || consultant.specialty === selectedSpecialty)
                    .map(consultant => (
                      <ConsultantCard
                        key={consultant.id}
                        consultant={consultant}
                        darkMode={darkMode}
                        isSelected={selectedConsultant === consultant.id}
                        onSelect={() => setSelectedConsultant(consultant.id === selectedConsultant ? null : consultant.id)}
                        onEdit={() => alert(`Éditer ${consultant.name}`)}
                        onViewCalendar={() => alert(`Voir calendrier de ${consultant.name}`)}
                        onMoreOptions={() => alert(`Options pour ${consultant.name}`)}
                        layout={dashboardLayout === 'list' ? 'list' : 'grid'}
                      />
                    ))}
                </div>
              </div>
              
              {/* Absences et congés */}
              <div className={`mt-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow p-2`}>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Absences & Congés
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-xs text-left text-gray-500 bg-gray-50">
                        <th className="p-2 font-medium">Consultant</th>
                        <th className="p-2 font-medium">Type</th>
                        <th className="p-2 font-medium">Date début</th>
                        <th className="p-2 font-medium">Date fin</th>
                        <th className="p-2 font-medium">Statut</th>
                        <th className="p-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absences.map((absence, idx) => {
                        const consultant = consultants.find(c => c.id === absence.consultantId);
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="p-2 text-xs">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full ${consultant.color} flex items-center justify-center text-white text-xs mr-2`}>
                                  {consultant.avatar}
                                </div>
                                {consultant.name}
                              </div>
                            </td>
                            <td className="p-2 text-xs">{absence.type}</td>
                            <td className="p-2 text-xs">{absence.startDate}</td>
                            <td className="p-2 text-xs">{absence.endDate}</td>
                            <td className="p-2 text-xs">
                              <StatusBadge
                                type={absence.approved ? 'success' : 'warning'}
                                label={absence.approved ? 'Approuvé' : 'En attente'}
                                rounded="full"
                              />
                            </td>
                            <td className="p-2 text-xs">
                              <ButtonGroup>
                                {!absence.approved && (
                                  <>
                                    <ActionButton 
                                      label=""
                                      icon={<CheckCircle size={12} />}
                                      variant="success"
                                      size="xs"
                                    />
                                    <ActionButton 
                                      label=""
                                      icon={<XCircle size={12} />}
                                      variant="danger"
                                      size="xs"
                                    />
                                  </>
                                )}
                                <ActionButton 
                                  label=""
                                  icon={<Edit size={12} />}
                                  variant="secondary"
                                  size="xs"
                                />
                              </ButtonGroup>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {currentTab === 'stats' && (
            <>
              {/* Vue Statistiques */}
              <div className="grid grid-cols-2 gap-3">
                <ExpandablePanel
                  title="Taux d'Occupation par Spécialité"
                  icon={<BarChart size={16} className="text-blue-600" />}
                  initiallyExpanded={true}
                  headerRightContent={
                    <ButtonGroup>
                      <ActionButton label="Jour" variant="secondary" size="xs" />
                      <ActionButton label="Semaine" variant="primary" size="xs" />
                      <ActionButton label="Mois" variant="secondary" size="xs" />
                    </ButtonGroup>
                  }
                >
                  <div className="h-64 overflow-hidden flex items-center justify-center">
                    {/* Simuler un graphique de barres */}
                    <div className="w-full flex space-x-4 items-end h-48 px-4">
                      {specialties.filter(s => s !== 'Toutes les spécialités').map((specialty, idx) => {
                        const height = 30 + (idx * 15) % 70;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div 
                              className={`w-full ${getSpecialtyColor(specialty)}`} 
                              style={{height: `${height}%`}}
                            ></div>
                            <span className="text-xs mt-1 text-center">{specialty}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ExpandablePanel>
                
                <ExpandablePanel
                  title="Répartition du Temps par Consultant"
                  icon={<PieChart size={16} className="text-green-600" />}
                  initiallyExpanded={true}
                  headerRightContent={
                    <ActionButton 
                      label="Exporter PDF"
                      variant="info"
                      size="xs"
                    />
                  }
                >
                  <div className="h-64 overflow-hidden flex flex-col items-center justify-center">
                    {/* Simuler un graphique circulaire */}
                    <div className="relative w-40 h-40 rounded-full border-8 border-gray-200 mb-4">
                      {consultants.map((consultant, idx) => (
                        <div 
                          key={idx} 
                          className={`absolute w-40 h-40 ${consultant.color}`}
                          style={{
                            clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(idx * Math.PI / 3)}% ${50 + 50 * Math.sin(idx * Math.PI / 3)}%, ${50 + 50 * Math.cos((idx+1) * Math.PI / 3)}% ${50 + 50 * Math.sin((idx+1) * Math.PI / 3)}%)`
                          }}
                        ></div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {consultants.map(consultant => (
                        <div key={consultant.id} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${consultant.color} mr-1`}></div>
                          <span className="text-xs truncate">{consultant.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ExpandablePanel>
                
                <ExpandablePanel
                  title="Évolution Hebdomadaire de la Charge"
                  icon={<TrendingUp size={16} className="text-yellow-600" />}
                  initiallyExpanded={true}
                >
                  <div className="h-64 overflow-hidden flex items-center justify-center">
                    {/* Simuler un graphique linéaire */}
                    <div className="w-full h-48 border-b border-l border-gray-300 relative">
                      {/* Axe X */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
                        <span>Lun</span>
                        <span>Mar</span>
                        <span>Mer</span>
                        <span>Jeu</span>
                        <span>Ven</span>
                      </div>
                      
                      {/* Ligne de tendance */}
                      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                        <path 
                          d="M0,120 L80,100 L160,140 L240,80 L320,60" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="2"
                        />
                        <path 
                          d="M0,100 L80,120 L160,110 L240,130 L320,90" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </ExpandablePanel>
                
                <ExpandablePanel
                  title="Efficacité des Consultants"
                  icon={<Award size={16} className="text-purple-600" />}
                  initiallyExpanded={true}
                  headerRightContent={
                    <select className="p-1 bg-gray-100 rounded text-xs">
                      <option>Dernier mois</option>
                      <option>Dernier trimestre</option>
                      <option>Année en cours</option>
                    </select>
                  }
                >
                  <div className="space-y-3">
                    {consultants.map(consultant => (
                      <div key={consultant.id} className="flex items-center">
                        <div className={`w-6 h-6 rounded-full ${consultant.color} flex items-center justify-center text-white text-xs mr-2`}>
                          {consultant.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-xs">
                            <span>{consultant.name}</span>
                            <span className="font-medium">
                              {Math.round(85 - (consultant.avgConsultation - 10) * 2)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className={`${consultant.color} rounded-full h-2`} 
                              style={{width: `${85 - (consultant.avgConsultation - 10) * 2}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ExpandablePanel>
              </div>
            </>
          )}
          
          {currentTab === 'conflits' && (
            <>
              {/* Vue Conflits */}
              <ConflictManager
                conflicts={conflicts}
                onResolveConflict={(conflictId) => {
                  alert(`Résolution du conflit ${conflictId}`);
                }}
                onReschedule={(conflictId) => {
                  alert(`Reprogrammation du conflit ${conflictId}`);
                }}
                onEditConflict={(conflictId) => {
                  alert(`Modification du conflit ${conflictId}`);
                }}
                onViewDetails={(conflict) => {
                  alert(`Détails du conflit: ${JSON.stringify(conflict)}`);
                }}
                filterByStatus="all"
                onFilterChange={(status) => console.log(`Filtrage des conflits: ${status}`)}
                onAutoResolve={() => alert('Résolution automatique des conflits')}
                darkMode={darkMode}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Modal pour ajouter une disponibilité */}
      <Modal
        title="Ajouter une Disponibilité"
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        darkMode={darkMode}
        width="max-w-md"
        footer={
          <>
            <ActionButton 
              label="Annuler"
              variant="secondary"
              onClick={() => setShowAvailabilityModal(false)}
            />
            <ActionButton 
              label="Ajouter"
              variant="primary"
            />
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1">Consultant</label>
            <select className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {consultants.map(consultant => (
                <option key={consultant.id} value={consultant.id}>
                  {consultant.name} ({consultant.specialty})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs mb-1">Jour</label>
            <select className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {weekDays.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs mb-1">Heure de début</label>
              <select className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 8}>
                    {i + 8}:00
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs mb-1">Heure de fin</label>
              <select className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={i + 9}>
                    {i + 9}:00
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs mb-1">Spécialité</label>
            <select className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {specialties.filter(s => s !== 'Toutes les spécialités').map((specialty, index) => (
                <option key={index} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs mb-1">Récurrence</label>
            <select className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
              <option value="once">Une seule fois</option>
              <option value="weekly">Chaque semaine</option>
              <option value="biweekly">Toutes les deux semaines</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <label className="flex items-center text-xs cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600 mr-1" />
              Vérifier les conflits avant d'ajouter
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Modal pour les modèles de planning */}
      <Modal
        title="Modèles de Planning"
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        darkMode={darkMode}
        width="max-w-md"
        footer={
          <>
            <ActionButton 
              label="Nouveau modèle"
              icon={<Plus size={14} />}
              variant="success"
            />
            <ActionButton 
              label="Fermer"
              variant="secondary"
              onClick={() => setShowTemplateModal(false)}
            />
          </>
        }
      >
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {planningTemplates.map(template => (
            <div 
              key={template.id} 
              className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => applyTemplate(template.id)}
            >
              <div>
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-gray-500">{template.description}</div>
              </div>
              <div>
                <button className="p-1 text-gray-500 hover:text-gray-700">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Modal>
      
      {/* Modal pour les annotations */}
      <Modal
        title="Ajouter une annotation"
        isOpen={showAnnotationPanel && activeAnnotation !== null}
        onClose={() => setShowAnnotationPanel(false)}
        darkMode={darkMode}
        width="max-w-sm"
        footer={
          <>
            <ActionButton 
              label="Annuler"
              variant="secondary"
              onClick={() => setShowAnnotationPanel(false)}
            />
            <ActionButton 
              label="Enregistrer"
              variant="primary"
              onClick={() => setShowAnnotationPanel(false)}
            />
          </>
        }
      >
        {activeAnnotation && (
          <>
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Jour et heure</div>
              <div className="font-medium text-sm">
                {weekDays[activeAnnotation.day]} à {activeAnnotation.time}:00
              </div>
            </div>
            
            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Consultant</div>
              <div className="font-medium text-sm">
                {consultants.find(c => c.id === activeAnnotation.consultant)?.name}
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Note</label>
              <textarea 
                className={`w-full p-2 rounded-md text-sm min-h-24 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                placeholder="Saisissez votre annotation ici..."
                defaultValue={annotations.find(
                  a => a.day === activeAnnotation.day && 
                  a.time === activeAnnotation.time && 
                  a.consultant === activeAnnotation.consultant
                )?.text || ''}
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Couleur</label>
              <div className="flex space-x-2">
                <button className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></button>
                <button className="w-6 h-6 rounded-full bg-green-100 border-2 border-white"></button>
                <button className="w-6 h-6 rounded-full bg-yellow-100 border-2 border-white"></button>
                <button className="w-6 h-6 rounded-full bg-red-100 border-2 border-white"></button>
                <button className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white"></button>
              </div>
            </div>
          </>
        )}
      </Modal>
      
      {/* Menu contextuel pour les plages horaires */}
      {showScheduleContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowScheduleContextMenu(false)}
          />
          <div 
            className="fixed z-50 bg-white rounded-md shadow-lg py-1 text-xs"
            style={{ 
              left: `${contextMenuPosition.x}px`, 
              top: `${contextMenuPosition.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {!isNewScheduleItem ? (
              <>
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center"
                  onClick={() => editScheduleItem(selectedScheduleItem)}
                >
                  <Edit size={14} className="mr-2 text-blue-600" />
                  Modifier cette plage horaire
                </button>
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center text-red-600"
                  onClick={() => deleteScheduleItem(selectedScheduleItem)}
                >
                  <Trash2 size={14} className="mr-2" />
                  Supprimer cette plage horaire
                </button>
                <div className="border-t border-gray-200 my-1" />
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowScheduleContextMenu(false);
                    toggleAnnotation(selectedScheduleItem.day, selectedScheduleItem.startTime, selectedScheduleItem.consultantId);
                  }}
                >
                  <MessageSquare size={14} className="mr-2 text-purple-600" />
                  Ajouter une annotation
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-1 font-medium text-gray-700">
                  Nouvelle plage horaire
                </div>
                <button 
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center text-green-600"
                  onClick={() => editScheduleItem(selectedScheduleItem)}
                >
                  <Plus size={14} className="mr-2" />
                  Créer une disponibilité
                </button>
              </>
            )}
          </div>
        </>
      )}
      
      {/* Modal pour éditer une plage horaire */}
      <Modal
        title={isNewScheduleItem ? "Ajouter une disponibilité" : "Modifier une disponibilité"}
        isOpen={showScheduleEditModal && selectedScheduleItem !== null}
        onClose={() => setShowScheduleEditModal(false)}
        darkMode={darkMode}
        width="max-w-md"
        footer={
          <>
            <ActionButton 
              label="Annuler"
              variant="secondary"
              onClick={() => setShowScheduleEditModal(false)}
            />
            <ActionButton 
              label={isNewScheduleItem ? 'Ajouter' : 'Mettre à jour'}
              variant="primary"
              onClick={() => updateScheduleItem(selectedScheduleItem)}
            />
          </>
        }
      >
        {selectedScheduleItem && (
          <div className="space-y-3">
            {/* Consultant */}
            <div>
              <label className="block text-xs mb-1">Consultant</label>
              <div className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} flex items-center`}>
                {(() => {
                  const consultant = consultants.find(c => c.id === selectedScheduleItem.consultantId);
                  return (
                    <>
                      <div className={`w-6 h-6 rounded-full ${consultant.color} flex items-center justify-center text-white text-xs mr-2`}>
                        {consultant.avatar}
                      </div>
                      <span>{consultant.name}</span>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* Jour */}
            <div>
              <label className="block text-xs mb-1">Jour</label>
              <select 
                className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                value={selectedScheduleItem.day}
                onChange={(e) => setSelectedScheduleItem({
                  ...selectedScheduleItem,
                  day: parseInt(e.target.value)
                })}
              >
                {weekDays.slice(0, 5).map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Heures */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">Heure de début</label>
                <select 
                  className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  value={selectedScheduleItem.startTime}
                  onChange={(e) => {
                    const startTime = parseInt(e.target.value);
                    setSelectedScheduleItem({
                      ...selectedScheduleItem,
                      startTime: startTime,
                      // Si l'heure de fin est avant l'heure de début, ajuster
                      endTime: selectedScheduleItem.endTime <= startTime ? startTime + 1 : selectedScheduleItem.endTime
                    });
                  }}
                >
                  {Array.from({ length: 11 }, (_, i) => (
                    <option key={i} value={i + 8}>
                      {i + 8}:00
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Heure de fin</label>
                <select 
                  className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                  value={selectedScheduleItem.endTime}
                  onChange={(e) => setSelectedScheduleItem({
                    ...selectedScheduleItem,
                    endTime: parseInt(e.target.value)
                  })}
                >
                  {Array.from({ length: 12 - (selectedScheduleItem.startTime - 8) }, (_, i) => (
                    <option key={i} value={i + selectedScheduleItem.startTime + 1}>
                      {i + selectedScheduleItem.startTime + 1}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Spécialité */}
            <div>
              <label className="block text-xs mb-1">Spécialité</label>
              <select 
                className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                value={selectedScheduleItem.specialty}
                onChange={(e) => setSelectedScheduleItem({
                  ...selectedScheduleItem,
                  specialty: e.target.value
                })}
              >
                <option value={consultants.find(c => c.id === selectedScheduleItem.consultantId).specialty}>
                  {consultants.find(c => c.id === selectedScheduleItem.consultantId).specialty} (Spécialité principale)
                </option>
                {specialties
                  .filter(s => s !== 'Toutes les spécialités' && s !== consultants.find(c => c.id === selectedScheduleItem.consultantId).specialty)
                  .map((specialty, index) => (
                    <option key={index} value={specialty}>
                      {specialty}
                    </option>
                  ))}
              </select>
            </div>
            
            {/* Type */}
            <div>
              <label className="block text-xs mb-1">Type de disponibilité</label>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1.5 rounded-md text-xs flex-1 ${selectedScheduleItem.type === 'récurrent' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setSelectedScheduleItem({
                    ...selectedScheduleItem,
                    type: 'récurrent'
                  })}
                >
                  <Repeat size={14} className="mr-1 inline-block" />
                  Récurrent
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-xs flex-1 ${selectedScheduleItem.type === 'exceptionnel' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setSelectedScheduleItem({
                    ...selectedScheduleItem,
                    type: 'exceptionnel'
                  })}
                >
                  <Calendar size={14} className="mr-1 inline-block" />
                  Exceptionnel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedScheduleItem.type === 'récurrent' 
                  ? "Se répète chaque semaine" 
                  : "Uniquement pour cette date"}
              </p>
            </div>
            
            {/* Options supplémentaires */}
            <div className="pt-2 border-t border-gray-200">
              <label className="flex items-center text-xs cursor-pointer mb-1">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 mr-1" 
                />
                Vérifier les conflits avant de modifier
              </label>
              
              <label className="flex items-center text-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded text-blue-600 mr-1" 
                />
                Notifier le consultant de cette modification
              </label>
            </div>
          </div>
        )}
      </Modal>

      {/* FloatingActionButton pour les actions rapides */}
      <FloatingActionButton
        actions={[
          { id: 'new-consultant', icon: <UserPlus size={16} />, label: 'Nouveau consultant', onClick: () => alert('Ajouter consultant') },
          { id: 'add-availability', icon: <Plus size={16} />, label: 'Ajouter disponibilité', onClick: () => setShowAvailabilityModal(true) },
          { id: 'conflicts', icon: <AlertTriangle size={16} />, label: 'Voir conflits', onClick: () => setCurrentTab('conflits') }
        ]}
        position="bottom-right"
        color="blue"
        showLabels={true}
      />
    </div>
  );
};

export default EagleConsultantManagement;