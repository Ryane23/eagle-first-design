import React, { useState, useRef } from 'react';
import { 
Users, Bell, Calendar, FileText, Settings, Menu, X, Home, Activity, ClipboardList, MessageSquare, HelpCircle, Search, Filter, Sun, Moon, AlertTriangle, Wifi, WifiOff, ChevronDown, MoreVertical, UserPlus, RefreshCw, Monitor, ChevronRight, ArrowRight, ExternalLink, AlertCircle, MapPin, Zap, BarChart2, Smartphone, Clipboard, Headphones, Clock, CheckCircle, PlusCircle, Edit, User, Sliders, MessageCircle, Layers, GitMerge, CheckSquare, Shield, Briefcase, Heart, UserCheck, RotateCcw, Printer, Send
} from 'lucide-react';

// Import des composants partagés
// Layout Components
// Layout Components
import { Sidebar } from '@layout/Sidebar';
import { SidebarItem } from '@layout/SidebarItem';
import { SidebarSection } from '@layout/SidebarSection';
import { Header } from '@layout/Header';
import { ViewSelector } from '@layout/ViewSelector';

// Form Components
import { SearchInput } from '@forms/SearchInput';

// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';

// Data Display Components
import { StatCard } from '@data-display/StatCard';
import { StatCardGroup } from '@data-display/StatCardGroup';
import { StatusBadge } from '@data-display/StatusBadge';
import { UrgencyIndicator } from '@data-display/UrgencyIndicator';

// Panel Components
import { SidePanel } from '@panels/SidePanel';
import { Modal } from '@modals/Modal';

// Card Components
import { PatientCard } from '@cards/PatientCard';
import { ConsultantCard } from '@cards/ConsultantCard';

// Utility Components
import { ConnectionStatus } from '@common/ConnectionStatus';
import { DropZone } from '@dragdrop/DropZone';

// Utility Modules
import { getUrgencyColor } from '@utils/statusUtils';
import { filterPatientsBySearch } from '@filters/patientFilters';
import { mockPatients } from '@mocks/patients';
import { mockCenters } from '@mocks/centers';
import { mockSpecialties } from '@mocks/specialties';

const EagleSallesAttente = () => {
  // États
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [draggingPatient, setDraggingPatient] = useState(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [mergeTargetName, setMergeTargetName] = useState('');
  const [showAdjustUrgencyPanel, setShowAdjustUrgencyPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Utilisation des données mockées importées
  const specialties = mockSpecialties.map(specialty => ({
    ...specialty,
    patientCount: mockPatients.filter(p => p.specialty === specialty.nom).length,
    load: mockPatients.filter(p => p.specialty === specialty.nom).length > 8 ? "high" : 
          mockPatients.filter(p => p.specialty === specialty.nom).length > 4 ? "medium" : "low",
    consultants: specialty.medecins.map(medecin => ({
      id: medecin.id,
      name: medecin.nom,
      available: medecin.disponible,
      patients: medecin.patients.length
    }))
  }));
  
  const patients = mockPatients.map(patient => ({
    ...patient,
    centerName: mockCenters.find(c => c.code === patient.center)?.name || patient.center,
    urgency: patient.urgencyLevel,
    waitTime: Math.floor(Math.random() * 40) + 5, // Simulation temps d'attente
    doctor: `Dr. ${patient.doctor || 'Non assigné'}`,
    arrivalTime: patient.arrivalTime || "08:00"
  }));
  
  // Centre principal - utilisation des données mockées
  const centerInfo = mockCenters.find(c => c.type === 'primary') || {
    name: "Centre Médical Principal - Yaoundé",
    code: "CMP-YDE",
    type: "Centre Principal"
  };
  
  // Calcul des statistiques
  const stats = {
    totalWaiting: patients.length,
    avgWaitTime: Math.round(patients.reduce((acc, p) => acc + p.waitTime, 0) / patients.length),
    urgentPatients: patients.filter(p => p.urgency >= 4).length,
    totalClinics: mockCenters.filter(c => c.type === 'secondary').length,
    activeConsultants: specialties.reduce((acc, s) => acc + s.consultants.filter(c => c.available).length, 0)
  };

  // Références pour le drag and drop
  const draggedItem = useRef(null);
  const dragOverTarget = useRef(null);
  
  // Couleurs de charge
  const getLoadColor = (load) => {
    const colors = {
      "low": "bg-green-100 text-green-800",
      "medium": "bg-yellow-100 text-yellow-800",
      "high": "bg-red-100 text-red-800"
    };
    return colors[load] || "bg-gray-100 text-gray-800";
  };
  
  // Texte de charge
  const getLoadText = (load) => {
    const texts = {
      "low": "Faible",
      "medium": "Moyenne",
      "high": "Élevée"
    };
    return texts[load] || "Inconnue";
  };

  // Gestion de la réattribution par glisser-déposer
  const handleDragStart = (patient) => {
    setDraggingPatient(patient);
    draggedItem.current = patient;
  };
  
  const handleDragOver = (e, doctor) => {
    e.preventDefault();
    dragOverTarget.current = doctor;
  };
  
  const handleDrop = (e, doctor) => {
    e.preventDefault();
    
    // Simuler la réattribution
    if (draggedItem.current && draggedItem.current.doctor !== doctor.name) {
      // Dans une application réelle, nous ferions un appel API ici
      console.log(`Patient ${draggedItem.current.name} réattribué de ${draggedItem.current.doctor} à ${doctor.name}`);
      
      // Pour la démo, on peut montrer une alerte ou une notification
      alert(`Patient ${draggedItem.current.name} réattribué à ${doctor.name}`);
    }
    
    setDraggingPatient(null);
    draggedItem.current = null;
    dragOverTarget.current = null;
  };

  // Fonction de sélection d'un patient
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPanel(true);
    setSelectedSpecialty(null); // Désélection de la spécialité
    setShowAdjustUrgencyPanel(false);
  };
  
  // Fonction de sélection d'une spécialité
  const handleSelectSpecialty = (specialty) => {
    setSelectedSpecialty(specialty);
    setShowPanel(true);
    setSelectedPatient(null); // Désélection du patient
    setShowAdjustUrgencyPanel(false);
  };
  
  // Fonction pour afficher le panneau d'ajustement d'urgence
  const handleAdjustUrgency = (patient) => {
    setSelectedPatient(patient);
    setShowAdjustUrgencyPanel(true);
    setShowPanel(true);
  };
  
  // Fonction pour gérer la fusion des salles d'attente
  const handleMergeSpecialties = () => {
    if (selectedSpecialties.length < 2 || !mergeTargetName) {
      alert("Veuillez sélectionner au moins deux spécialités et définir un nom pour la fusion");
      return;
    }
    
    // Simuler la fusion (dans une app réelle, appel API)
    console.log(`Fusion des spécialités: ${selectedSpecialties.map(s => s.name).join(', ')} en "${mergeTargetName}"`);
    alert(`Spécialités fusionnées en "${mergeTargetName}"`);
    
    // Réinitialiser
    setShowMergeModal(false);
    setSelectedSpecialties([]);
    setMergeTargetName('');
  };
  
  // Fonction pour gérer la sélection des spécialités à fusionner
  const toggleSpecialtySelection = (specialty) => {
    if (selectedSpecialties.find(s => s.id === specialty.id)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s.id !== specialty.id));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };
  
  // Fonction pour accéder à la vue du médecin
  const accessDoctorView = (e, doctor) => {
    e.stopPropagation(); // Empêche la propagation du clic à l'élément parent
    alert(`Accès à la vue du Dr. ${doctor.name.split(' ')[0]} - Interface Médecin`);
  };
  
  // Filtrer les patients par recherche - utilisation du filtre importé
  const filteredPatients = filterPatientsBySearch(patients, searchQuery);

  // Définition des éléments de menu pour la Sidebar
  const menuItems = [
    { icon: <Home size={18} />, label: "Tableau de bord", path: "#", isActive: false },
    { icon: <Layers size={18} />, label: "Salles d'attente", path: "#", isActive: true },
    { icon: <Calendar size={18} />, label: "Rendez-vous", path: "#", isActive: false },
    { icon: <Users size={18} />, label: "Consultants", path: "#", isActive: false },
    { icon: <Activity size={18} />, label: "Consultations", path: "#", isActive: false },
    { icon: <MessageCircle size={18} />, label: "Communications", path: "#", isActive: false },
    { icon: <BarChart2 size={18} />, label: "Statistiques", path: "#", isActive: false }
  ];

  const bottomMenuItems = [
    { icon: <HelpCircle size={18} />, label: "Aide", path: "#" },
    { icon: <Settings size={18} />, label: "Paramètres", path: "#" }
  ];

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Barre de navigation latérale */}
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
          title="Gestion des Salles d'Attente Virtuelles"
          subtitle="Centre Médical Principal - Yaoundé"
          centerInfo={centerInfo}
          isOnline={isOnline}
          bandwidth={5.2}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          user={{ initials: "SP", name: "Sara Principal" }}
          notificationCount={3}
          extraHeaderItems={
            <button 
              onClick={() => setShowStats(!showStats)} 
              className="ml-2 text-xs flex items-center text-gray-500 hover:text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md"
            >
              {showStats ? "Masquer Stats" : "Afficher Stats"}
            </button>
          }
        />
        
        {/* Contenu */}
        <div className="flex-1 overflow-auto p-3">
          {/* Statistiques */}
          {showStats && (
            <StatCardGroup>
              <StatCard 
                title="Patients en attente"
                value={stats.totalWaiting}
                icon={<Users size={18} />}
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              <StatCard 
                title="Temps d'attente moyen"
                value={stats.avgWaitTime}
                suffix="min"
                icon={<Clock size={18} />}
                iconBgColor="bg-yellow-100"
                iconColor="text-yellow-600"
              />
              <StatCard 
                title="Patients urgents (4-5)"
                value={stats.urgentPatients}
                icon={<AlertTriangle size={18} />}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
              />
              <StatCard 
                title="Centres secondaires actifs"
                value={stats.totalClinics}
                icon={<Briefcase size={18} />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
              />
              <StatCard 
                title="Consultants actifs"
                value={stats.activeConsultants}
                icon={<UserCheck size={18} />}
                iconBgColor="bg-indigo-100"
                iconColor="text-indigo-600"
              />
            </StatCardGroup>
          )}
          
          {/* Boutons d'action */}
          <div className="flex flex-wrap items-center justify-between mb-3 gap-y-2">
            <ButtonGroup>
              <ActionButton 
                label="Nouvelle Salle"
                icon={<PlusCircle size={14} />}
                variant="primary"
                size="sm"
              />
              <ActionButton 
                label="Fusionner Salles"
                icon={<GitMerge size={14} />}
                variant="primary"
                size="sm"
                onClick={() => setShowMergeModal(true)}
              />
              <ActionButton 
                label="Communiquer"
                icon={<MessageCircle size={14} />}
                variant="info"
                size="sm"
              />
              <ActionButton 
                label="Synchroniser"
                icon={<RotateCcw size={14} />}
                variant="info"
                size="sm"
              />
            </ButtonGroup>
            
            <ButtonGroup>
              <ActionButton 
                label="Affichage Salle"
                icon={<Monitor size={14} />}
                variant="primary"
                size="sm"
              />
              <ActionButton 
                label="Filtrer"
                icon={<Filter size={14} />}
                variant="secondary"
                size="sm"
              />
              <ActionButton 
                label="Imprimer"
                icon={<Printer size={14} />}
                variant="secondary"
                size="sm"
              />
            </ButtonGroup>
          </div>
          
          {/* Vue des Salles d'Attente */}
          <div className="grid grid-cols-2 gap-3">
            {specialties.map(specialty => (
              <div 
                key={specialty.id} 
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-3`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-semibold text-lg">{specialty.nom}</h3>
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">{specialty.patientCount}</span>
                      <StatusBadge 
                        type={specialty.load}
                        label={getLoadText(specialty.load)}
                      />
                    </div>
                    <div className="flex mt-1 text-xs">
                      <span className="text-gray-500">Consultants: </span>
                      <div className="flex ml-1">
                        {specialty.consultants.map((doc, idx) => (
                          <button 
                            key={doc.id} 
                            className={`${doc.available ? 'text-green-600' : 'text-gray-400'} ${idx !== 0 ? 'ml-2' : ''} hover:underline cursor-pointer`}
                            onClick={(e) => accessDoctorView(e, doc)}
                            title="Voir l'interface du médecin"
                          >
                            {doc.name} ({doc.patients})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <button 
                      className="p-1 text-xs rounded text-blue-600 hover:bg-blue-50"
                      onClick={() => handleSelectSpecialty(specialty)}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      className="p-1 text-xs rounded text-gray-500 hover:bg-gray-100 ml-1"
                      onClick={() => toggleSpecialtySelection(specialty)}
                    >
                      {selectedSpecialties.find(s => s.id === specialty.id) ? (
                        <CheckSquare size={14} className="text-blue-600" />
                      ) : (
                        <CheckSquare size={14} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Liste des patients */}
                <div className={`mt-2 space-y-1 ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {filteredPatients
                    .filter(p => p.specialty === specialty.nom)
                    .sort((a, b) => b.urgency - a.urgency || a.waitTime - b.waitTime)
                    .map(patient => (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        darkMode={darkMode}
                        onSelect={() => handleSelectPatient(patient)}
                        onAdjustUrgency={() => handleAdjustUrgency(patient)}
                        onDoctorView={() => accessDoctorView(event, { name: patient.doctor })}
                        onMoreOptions={() => {}}
                        isDraggable={true}
                        onDragStart={() => handleDragStart(patient)}
                      />
                    ))}
                  
                  {filteredPatients.filter(p => p.specialty === specialty.nom).length === 0 && (
                    <div className="p-3 text-center text-sm text-gray-500">
                      Aucun patient en attente pour cette spécialité
                    </div>
                  )}
                </div>
                
                {/* Zone de réattribution */}
                <div className="mt-3 border-t pt-2">
                  <div className="text-xs font-medium mb-1">Réattribuer un patient (glisser-déposer)</div>
                  <div className="grid grid-cols-2 gap-1">
                    {specialty.consultants.map(doctor => (
                      <DropZone
                        key={doctor.id}
                        targetId={doctor.id}
                        targetName={doctor.name}
                        isAvailable={doctor.available}
                        capacity={{ current: doctor.patients, max: 5 }}
                        onDragOver={(e) => handleDragOver(e, doctor)}
                        onDrop={(e) => handleDrop(e, doctor)}
                        darkMode={darkMode}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Panel latéral */}
      <SidePanel
        title={selectedPatient ? "Détails du patient" : (selectedSpecialty ? "Gestion de la spécialité" : "Ajustement d'urgence")}
        isOpen={showPanel}
        onClose={() => {
          setShowPanel(false);
          setShowAdjustUrgencyPanel(false);
        }}
        darkMode={darkMode}
      >
        {/* Contenu du panel - Patient */}
        {selectedPatient && !showAdjustUrgencyPanel && (
          <div className="p-3">
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-full ${getUrgencyColor(selectedPatient.urgency)}`}>
                <User size={20} className="text-white" />
              </div>
              <div className="ml-2">
                <h4 className="font-bold text-sm">{selectedPatient.name}</h4>
                <p className="text-xs text-gray-500">{selectedPatient.age} ans, {selectedPatient.gender}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Centre d'origine</p>
                <p className="font-medium text-sm">{selectedPatient.centerName}</p>
                <p className="text-xs text-gray-500">{selectedPatient.center}</p>
              </div>
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Spécialité</p>
                <p className="font-medium text-sm">{selectedPatient.specialty}</p>
              </div>
              <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="text-xs text-gray-500">Médecin assigné</p>
                <div className="flex items-center">
                  <p className="font-medium text-sm">{selectedPatient.doctor}</p>
                  <button 
                    className="ml-2 text-xs text-blue-600 hover:underline"
                    onClick={(e) => accessDoctorView(e, { name: selectedPatient.doctor })}
                  >
                    (Voir interface)
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs text-gray-500">Niveau d'urgence</p>
                  <div className="flex items-center">
                    <div className={`${getUrgencyColor(selectedPatient.urgency)} w-4 h-4 rounded-full mr-1`}></div>
                    <p className="font-medium text-sm">{selectedPatient.urgency} / 5</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs text-gray-500">Temps d'attente</p>
                  <p className="font-medium text-sm">{selectedPatient.waitTime} min</p>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Actions</h4>
              <ButtonGroup>
                <ActionButton 
                  label="Ajuster urgence"
                  icon={<Edit size={12} />}
                  variant="warning"
                  size="xs"
                  onClick={() => setShowAdjustUrgencyPanel(true)}
                />
                <ActionButton 
                  label="Réassigner"
                  icon={<ArrowRight size={12} />}
                  variant="warning"
                  size="xs"
                />
                <ActionButton 
                  label="Contacter centre"
                  icon={<MessageSquare size={12} />}
                  variant="info"
                  size="xs"
                />
                <ActionButton 
                  label="Valider priorité"
                  icon={<CheckCircle size={12} />}
                  variant="success"
                  size="xs"
                />
              </ButtonGroup>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Note du centre secondaire</h4>
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-xs min-h-16`}>
                {selectedPatient.notes || "Aucune note fournie"}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-xs mb-1">Commentaire pour le consultant</h4>
              <textarea 
                className={`w-full p-2 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} min-h-24`}
                placeholder="Ajouter un commentaire pour le consultant..."
              ></textarea>
              <ActionButton
                label="Envoyer au consultant"
                icon={<Send size={12} />}
                variant="primary"
                size="sm"
                fullWidth={true}
              />
            </div>
          </div>
        )}
          
        {/* Contenu du panel - Ajustement d'urgence */}
        {selectedPatient && showAdjustUrgencyPanel && (
          <div className="p-3">
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-full ${getUrgencyColor(selectedPatient.urgency)}`}>
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div className="ml-2">
                <h4 className="font-bold text-sm">Ajuster le niveau d'urgence</h4>
                <p className="text-xs text-gray-500">{selectedPatient.name}, {selectedPatient.age} ans</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xs mb-2">Niveau actuel: <span className="font-bold">{selectedPatient.urgency} / 5</span></p>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5].map(level => (
                  <UrgencyIndicator
                    key={level}
                    level={level}
                    showNumber={true}
                    size={level === selectedPatient.urgency ? "lg" : "md"}
                    validated={true}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Non urgent</span>
                <span>Urgent</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-xs mb-1">Justification</h4>
              <textarea 
                className={`w-full p-2 rounded-md text-xs ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} min-h-24`}
                placeholder="Veuillez justifier cette modification du niveau d'urgence..."
              ></textarea>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Critères standardisés</h4>
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-1 max-h-40 overflow-y-auto`}>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">1: Routine, aucun symptôme sévère</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">2: Léger inconfort, symptômes stables</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">3: Douleur modérée, symptômes en progression</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">4: Douleur sévère, décompensation possible</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="text-xs">5: Urgence vitale, détresse aigüe</span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <ActionButton
                label="Annuler"
                variant="secondary"
                size="sm"
                fullWidth={true}
                onClick={() => setShowAdjustUrgencyPanel(false)}
              />
              <ActionButton
                label="Confirmer"
                variant="primary"
                size="sm"
                fullWidth={true}
              />
            </div>
          </div>
        )}
          
        {/* Contenu du panel - Gestion de la spécialité */}
        {selectedSpecialty && !selectedPatient && (
          <div className="p-3">
            <div className="flex items-center mb-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Layers size={20} className="text-blue-600" />
              </div>
              <div className="ml-2">
                <h4 className="font-bold text-sm">{selectedSpecialty.nom}</h4>
                <div className="flex items-center text-xs">
                  <StatusBadge 
                    type={selectedSpecialty.load}
                    label={`Charge ${getLoadText(selectedSpecialty.load).toLowerCase()}`}
                  />
                  <span className="ml-2 text-gray-500">{selectedSpecialty.patientCount} patients</span>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Informations</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs text-gray-500">Nom de la spécialité</p>
                  <input 
                    type="text" 
                    className={`w-full bg-transparent font-medium text-sm py-1 focus:outline-none`} 
                    defaultValue={selectedSpecialty.nom}
                  />
                </div>
                <div className={`px-2 py-1 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs text-gray-500">Seuil de charge (patients/heure)</p>
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="3" 
                      max="8" 
                      defaultValue="5" 
                      className="w-full" 
                    />
                    <span className="ml-2 font-medium text-sm">5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1 flex justify-between items-center">
                <span>Consultants assignés</span>
                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                  <PlusCircle size={14} />
                </button>
              </h4>
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-1`}>
                {selectedSpecialty.consultants.map(doctor => (
                  <div key={doctor.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={doctor.available} 
                        className="mr-1 h-3 w-3 text-blue-600"
                        readOnly
                      />
                      <button 
                        className="text-xs hover:underline cursor-pointer"
                        onClick={(e) => accessDoctorView(e, doctor)}
                      >
                        {doctor.name}
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs mr-2">{doctor.patients} patients</span>
                      <button className="p-0.5 text-gray-500 hover:text-gray-700">
                        <Edit size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="font-medium text-xs mb-1">Paramètres de la salle d'attente</h4>
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-2`}>
                <div>
                  <label className="flex items-center mb-1">
                    <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" defaultChecked />
                    <span className="text-xs">Autoriser les urgences de niveau 5</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1 h-3 w-3 text-blue-600" defaultChecked />
                    <span className="text-xs">Distribution équilibrée des patients</span>
                  </label>
                </div>
                <div>
                  <p className="text-xs mb-1">Algorithme de priorisation</p>
                  <select className={`w-full text-xs p-1 rounded ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                    <option>50% urgence + 50% ancienneté (défaut)</option>
                    <option>70% urgence + 30% ancienneté</option>
                    <option>30% urgence + 70% ancienneté</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <ActionButton
                label="Supprimer"
                icon={<span>🗑️</span>}
                variant="danger"
                size="sm"
                fullWidth={true}
              />
              <ActionButton
                label="Enregistrer"
                variant="primary"
                size="sm"
                fullWidth={true}
              />
            </div>
          </div>
        )}
      </SidePanel>
      
      {/* Modal de fusion des salles */}
      {showMergeModal && (
        <Modal
          title="Fusion de Salles d'Attente"
          isOpen={showMergeModal}
          onClose={() => {
            setShowMergeModal(false);
            setSelectedSpecialties([]);
          }}
          darkMode={darkMode}
          width="max-w-md"
          footer={
            <>
              <ActionButton
                label="Annuler"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowMergeModal(false);
                  setSelectedSpecialties([]);
                }}
              />
              <ActionButton
                label="Fusionner" 
                variant="primary"
                size="sm"
                onClick={handleMergeSpecialties}
                disabled={selectedSpecialties.length < 2 || !mergeTargetName}
              />
            </>
          }
        >
          <div className="mb-3">
            <p className="text-sm mb-2">Sélectionnez les spécialités à fusionner :</p>
            <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} max-h-40 overflow-y-auto`}>
              {specialties.map(specialty => (
                <label key={specialty.id} className="flex items-center py-1">
                  <input 
                    type="checkbox" 
                    className="mr-2 h-4 w-4 text-blue-600"
                    checked={!!selectedSpecialties.find(s => s.id === specialty.id)}
                    onChange={() => toggleSpecialtySelection(specialty)}
                  />
                  <span>{specialty.nom}</span>
                  <span className="ml-1 text-xs text-gray-500">({specialty.patientCount} patients)</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-sm mb-1">Nom de la salle fusionnée :</p>
            <input 
              type="text" 
              className={`w-full p-2 rounded-md text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              placeholder="ex: Cardio-Pneumologie"
              value={mergeTargetName}
              onChange={(e) => setMergeTargetName(e.target.value)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EagleSallesAttente;