import React, { useState, useEffect, useRef } from 'react';
import { 
ChevronLeft, ChevronRight, Clock, Save, X, Share2, FileImage, Users, UserPlus, PauseCircle, PhoneOff, PictureInPicture, Maximize2, Minimize2, Command, AlertTriangle, FileText, Activity, MessageSquare, Clipboard
} from 'lucide-react';

// Import des composants partagés
import { VideoConsultation } from '@teleconsult/VideoConsultation';
import { AlertNotification } from '@feedback/AlertNotification';
import { VitalSigns } from '@medical/VitalSigns';
import { PatientRecord } from '@medical/PatientRecord';
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';
import ThemeSwitcher from '@common/ThemeSwitcher';
import { ConsultationTimer } from '@teleconsult/ConsultationTimer';
import ConnectionStatusMonitor from '@system/ConnectionStatusMonitor';
import { PatientCard } from '@cards/PatientCard';
import { StatusBadge } from '@data-display/StatusBadge';
import UrgencyLevelIndicator from '@medical/UrgencyLevelIndicator';
import { Modal } from '@modals/Modal';
import { SearchInput } from '@forms/SearchInput';
import FloatingActionButton from '@buttons/FloatingActionButton';
import ToastNotification from '@feedback/ToastNotification';
import { StatCard } from '@data-display/StatCard';

// Import des hooks partagés
import { useNotification } from '@hooks/useNotification';
import { useConnectionStatus } from '@hooks/useConnectionStatus';
import { useDarkMode } from '@hooks/useDarkMode';

// Import des services partagés
import { consultationService } from '@services/consultationService';
import { notificationService } from '@services/notificationService';

// Import des utils partagés
import { formatDateTime, formatTime } from '@utils/dateUtils';
import { formatWaitTime } from '@formatters/timeFormatter';

// Import des types partagés
import { Patient, Consultation } from '@types';

// Import des constants partagés
import { URGENCY_LEVELS, PATIENT_STATUS } from '@constants';

// Import des calculators partagés
import { calculateAge } from '@calculators/medicalCalculators';

// Import des builders partagés
import { NotificationBuilder } from '@builders/notificationBuilder';

const TeleconsultationInterface = () => {
  // États principaux
  const [consultationActive, setConsultationActive] = useState(true);
  const [consultationPaused, setConsultationPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState(3);
  const [showPatientPanel, setShowPatientPanel] = useState(true);
  const [notes, setNotes] = useState('');
  const [displayMode, setDisplayMode] = useState('standard');
  const [isMoving, setIsMoving] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [temporaryPause, setTemporaryPause] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [notesBackup, setNotesBackup] = useState(null);
  const [lastAutosave, setLastAutosave] = useState(null);
  const [bandwidth, setBandwidth] = useState(4.2);
  const [showPatientRecord, setShowPatientRecord] = useState(false);
  
  // Hooks partagés
  const { status: connectionStatus, toggleConnection } = useConnectionStatus();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { 
    notifications, 
    addNotification, 
    removeNotification, 
    markAsRead 
  } = useNotification();
  
  // Références DOM
  const containerRef = useRef(null);
  const dragHandleRef = useRef(null);
  
  // Données patient - utilisation des types partagés
  const patientData: Patient = {
    id: "1",
    name: "Marie Ekambi",
    firstName: "Marie",
    age: 8,
    gender: "F",
    urgencyLevel: 3,
    specialty: "Cardiologie",
    doctor: "Dr. Martin",
    center: "Centre Principal",
    waitTime: 15,
    status: "in_consultation",
    arrivalTime: "10:15",
    notes: "Contrôle cardiaque mensuel",
    vitalSigns: {
      bloodPressure: "110/70",
      heartRate: "82",
      temperature: "36.8",
      oxygenSaturation: "98%"
    },
    medicalHistory: {
      medical: ["Souffle cardiaque"],
      surgical: [],
      allergies: ["Pénicilline"],
      family: ["Hypertension maternelle"]
    },
    documents: ["Échographie cardiaque", "ECG récent"],
    consultationReason: "Contrôle cardiaque mensuel"
  };

  const consultationInfo: Consultation = {
    id: "TC-2025-0510-001",
    patientId: patientData.id,
    doctorId: "dr-martin",
    roomId: "room-1",
    startTime: new Date(),
    status: "active"
  };

  // Fonction pour déterminer si les informations cliniques doivent être affichées
  const shouldShowClinicalInfo = () => {
    return displayMode !== 'pip' && displayMode !== 'fullscreen';
  };

  // Récupérer la classe CSS pour le mode d'affichage
  const getDisplayModeClasses = () => {
    switch (displayMode) {
      case 'fullscreen':
        return 'fixed inset-0 z-50';
      case 'compact':
        return 'h-screen max-w-4xl mx-auto';
      case 'pip':
        return isMoving 
          ? 'fixed w-1/3 h-auto shadow-xl rounded-lg z-40 cursor-move border-2 border-blue-500' 
          : 'fixed top-20 right-20 w-1/3 h-auto shadow-xl rounded-lg z-40 cursor-move';
      default:
        return 'h-screen w-4/5 mx-auto';
    }
  };
  
  // Fonction d'ajout de notification utilisant le service partagé
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const notification = new NotificationBuilder()
      .setTitle(type.charAt(0).toUpperCase() + type.slice(1))
      .setMessage(message)
      .setType(type)
      .build();
    
    addNotification(notification);
    notificationService.showToast(message, type);
  };
  
  // Fonctions pour le déplacement de la fenêtre
  const handleDragStart = (e) => {
    if (displayMode === 'pip') {
      setIsMoving(true);
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const offsetX = e.clientX - containerRect.left;
        const offsetY = e.clientY - containerRect.top;
        container.dataset.offsetX = offsetX;
        container.dataset.offsetY = offsetY;
        container.style.transition = 'none';
      }
      e.preventDefault();
    } else if (e.target === dragHandleRef.current) {
      setIsMoving(true);
      showNotification("Déplacez la fenêtre et cliquez pour fixer la position", "info");
    }
  };
  
  const handleDragEnd = () => {
    if (isMoving) {
      setIsMoving(false);
      const container = containerRef.current;
      if (container && displayMode === 'pip') {
        container.style.transition = 'box-shadow 0.2s ease-in-out';
      }
      if (displayMode !== 'pip') {
        showNotification("Position de la fenêtre enregistrée", "info");
      }
    }
  };
  
  const handleMouseMove = (e) => {
    if (isMoving && displayMode === 'pip') {
      const container = containerRef.current;
      if (container) {
        const offsetX = parseInt(container.dataset.offsetX) || 0;
        const offsetY = parseInt(container.dataset.offsetY) || 0;
        const margin = 10;
        const x = Math.max(margin, Math.min(e.clientX - offsetX, window.innerWidth - container.offsetWidth - margin));
        const y = Math.max(margin, Math.min(e.clientY - offsetY, window.innerHeight - container.offsetHeight - margin));
        container.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        container.style.left = '0';
        container.style.top = '0';
      }
      e.preventDefault();
    }
  };

  // Modes d'affichage
  const toggleFullscreen = () => {
    if (displayMode === 'fullscreen') {
      setDisplayMode('standard');
      document.exitFullscreen && document.exitFullscreen();
    } else {
      setDisplayMode('fullscreen');
      containerRef.current && containerRef.current.requestFullscreen();
    }
  };
  
  const togglePictureInPicture = () => {
    setDisplayMode(displayMode === 'pip' ? 'standard' : 'pip');
  };
  
  const toggleCompactMode = () => {
    setDisplayMode(displayMode === 'compact' ? 'standard' : 'compact');
  };
  
  // Démarrer/arrêter la consultation
  const toggleConsultation = () => {
    if (consultationActive) {
      if (window.confirm("Êtes-vous sûr de vouloir terminer cette consultation?")) {
        setConsultationActive(false);
        consultationService.endSession(consultationInfo.id);
        showNotification("Consultation terminée", "success");
      }
    } else {
      setConsultationActive(true);
      setElapsedTime(0);
      consultationService.startSession(consultationInfo.id);
    }
  };
  
  // Mettre en pause la consultation
  const togglePause = () => {
    setConsultationPaused(!consultationPaused);
    
    if (!consultationPaused) {
      consultationService.pauseSession(consultationInfo.id);
      showNotification("Consultation mise en pause", "info");
    } else {
      setTemporaryPause(false);
      setPauseReason('');
      consultationService.resumeSession(consultationInfo.id);
      showNotification("Consultation reprise", "success");
    }
  };
  
  // Gestion de l'interruption temporaire
  const handleTemporaryPause = (reason: string) => {
    setPauseReason(reason);
    setTemporaryPause(true);
    setConsultationPaused(true);
    consultationService.pauseSession(consultationInfo.id);
    showNotification(`Consultation en pause: ${reason}`, "warning");
  };
  
  // Actions
  const shareScreen = () => showNotification("Partage d'écran activé", "info");
  const takeScreenshot = () => showNotification("Capture d'écran enregistrée", "success");
  
  // Simuler le temps qui passe
  useEffect(() => {
    let timer;
    if (consultationActive && !consultationPaused) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [consultationActive, consultationPaused]);
  
  // Simuler des variations de qualité de connexion
  useEffect(() => {
    const qualityTimer = setInterval(() => {
      if (Math.random() < 0.1) {
        const newQuality = Math.max(1, Math.min(5, connectionQuality + (Math.random() > 0.5 ? 1 : -1)));
        setConnectionQuality(newQuality);
        setBandwidth(newQuality * 1.2);
      }
      
      if (Math.random() < 0.03) {
        toggleConnection();
        setNotesBackup(notes);
        showNotification("Connexion perdue! Les notes sont sauvegardées localement", "error");
        
        setTimeout(() => {
          toggleConnection();
          showNotification("Connexion rétablie!", "success");
        }, 5000);
      }
    }, 20000);
    
    return () => clearInterval(qualityTimer);
  }, [connectionQuality, notes, toggleConnection]);

  // Gérer les changements de connexion
  const handleConnectionChange = (isOnline: boolean) => {
    if (!isOnline) {
      setNotesBackup(notes);
      showNotification("Connexion perdue! Les notes sont sauvegardées localement", "error");
    } else {
      showNotification("Connexion rétablie!", "success");
    }
  };

  // Gérer les actions de consultation
  const handleEndConsultation = () => {
    if (window.confirm("Êtes-vous sûr de vouloir terminer cette consultation?")) {
      setConsultationActive(false);
      consultationService.endSession(consultationInfo.id);
      showNotification("Consultation terminée", "success");
    }
  };

  const handlePauseConsultation = () => {
    setConsultationPaused(true);
    consultationService.pauseSession(consultationInfo.id);
    showNotification("Consultation mise en pause", "info");
  };

  const handleResumeConsultation = () => {
    setConsultationPaused(false);
    setTemporaryPause(false);
    setPauseReason('');
    consultationService.resumeSession(consultationInfo.id);
    showNotification("Consultation reprise", "success");
  };

  // Actions rapides
  const quickActions = [
    {
      id: 'prescription',
      icon: <FileText className="h-4 w-4" />,
      label: 'Ordonnance',
      onClick: () => showNotification("Création d'ordonnance", "info")
    },
    {
      id: 'exam',
      icon: <Activity className="h-4 w-4" />,
      label: 'Examen',
      onClick: () => showNotification("Demande d'examen", "info")
    },
    {
      id: 'certificate',
      icon: <Clipboard className="h-4 w-4" />,
      label: 'Certificat',
      onClick: () => showNotification("Certificat médical", "info")
    },
    {
      id: 'message',
      icon: <MessageSquare className="h-4 w-4" />,
      label: 'Message',
      onClick: () => showNotification("Nouveau message", "info")
    }
  ];

  return (
    <div 
      ref={containerRef}
      className={`${getDisplayModeClasses()} ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleMouseMove}
      style={displayMode === 'pip' ? {willChange: 'transform', touchAction: 'none'} : {}}
    >
      {/* En-tête avec info patient et contrôles de session - masqué en mode PiP */}
      {displayMode !== 'pip' && (
        <header 
          ref={dragHandleRef} 
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-2 flex justify-between items-center`}
        >
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold mr-2">
              E
            </div>
            <div>
              <h1 className="font-bold text-base">Téléconsultation</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {consultationInfo.id} • Suivi
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Minuteur */}
            <div className="mr-3">
              <ConsultationTimer 
                elapsedTime={elapsedTime}
                isPaused={consultationPaused}
                darkMode={darkMode}
                size="sm"
              />
            </div>
            
            {/* Statut de connexion */}
            <div className="mr-3">
              <ConnectionStatusMonitor
                isOnline={connectionStatus.isOnline}
                bandwidthSpeed={bandwidth}
                mode="badge"
                onConnectionChange={handleConnectionChange}
              />
            </div>
            
            {/* Boutons de mode d'affichage */}
            <div className="flex mr-2 space-x-1">
              {/* Commutateur de thème */}
              <ThemeSwitcher 
                size="small"
                onChange={toggleDarkMode}
                defaultDarkMode={darkMode}
              />
              
              {/* Mode Picture-in-Picture */}
              <ActionButton
                label=""
                icon={<PictureInPicture className="h-3 w-3" />}
                variant={displayMode === 'pip' ? 'primary' : 'secondary'}
                size="xs"
                onClick={togglePictureInPicture}
              />
              
              {/* Mode compact */}
              <ActionButton
                label=""
                icon={<Minimize2 className="h-3 w-3" />}
                variant={displayMode === 'compact' ? 'primary' : 'secondary'}
                size="xs"
                onClick={toggleCompactMode}
              />
              
              {/* Plein écran */}
              <ActionButton
                label=""
                icon={<Maximize2 className="h-3 w-3" />}
                variant={displayMode === 'fullscreen' ? 'primary' : 'secondary'}
                size="xs"
                onClick={toggleFullscreen}
              />
            </div>
            
            {/* Contrôles de consultation */}
            <ButtonGroup>
              <ActionButton
                label=""
                icon={consultationPaused ? <ChevronRight className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                variant={consultationPaused ? 'primary' : 'secondary'}
                size="xs"
                onClick={togglePause}
              />
              
              <ActionButton
                label=""
                icon={<PhoneOff className="h-4 w-4" />}
                variant="danger"
                size="xs"
                onClick={toggleConsultation}
              />
            </ButtonGroup>
          </div>
        </header>
      )}
      
      {/* En-tête simplifiée pour mode PiP */}
      {displayMode === 'pip' && (
        <div className={`${darkMode ? 'bg-gray-800 bg-opacity-90' : 'bg-gray-800 bg-opacity-80'} p-0.5 flex justify-between items-center`}>
          <div className="ml-2">
            <ConsultationTimer 
              elapsedTime={elapsedTime}
              isPaused={consultationPaused}
              darkMode={true}
              size="sm"
              showIcon={false}
            />
          </div>
          
          <ActionButton
            label=""
            icon={<PhoneOff className="h-3 w-3" />}
            variant="danger"
            size="xs"
            onClick={toggleConsultation}
            className="mr-1"
          />
        </div>
      )}
      
      {/* Contenu principal */}
      {displayMode === 'pip' ? (
        // Mode PiP simplifié
        <div className="flex flex-col overflow-hidden rounded-b-lg">
          <VideoConsultation
            patientName={patientData.name}
            patientInfo={{
              age: patientData.age,
              gender: patientData.gender
            }}
            consultationId={consultationInfo.id}
            consultationType="Suivi"
            onEnd={handleEndConsultation}
            onPause={handlePauseConsultation}
            onResume={handleResumeConsultation}
            darkMode={darkMode}
          />
        </div>
      ) : (
        // Mode standard
        <div className={`flex-1 flex overflow-hidden p-2 space-x-2 ${displayMode === 'compact' ? 'max-h-96' : ''}`}>
          {/* Zone vidéo principale */}
          <div className={`${shouldShowClinicalInfo() && showPatientPanel ? 'w-2/3' : 'w-full'} ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md flex flex-col overflow-hidden`}>
            <VideoConsultation
              patientName={patientData.name}
              patientInfo={{
                age: patientData.age,
                gender: patientData.gender
              }}
              consultationId={consultationInfo.id}
              consultationType="Suivi"
              onEnd={handleEndConsultation}
              onPause={handlePauseConsultation}
              onResume={handleResumeConsultation}
              darkMode={darkMode}
            />
          </div>
          
          {/* Panneau latéral */}
          {shouldShowClinicalInfo() && showPatientPanel && (
            <div className="w-1/3 flex flex-col space-y-3">
              {/* Carte patient */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-2`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-bold text-base">{patientData.name}</h2>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {patientData.age} ans • {patientData.gender === 'F' ? 'F' : 'M'}
                    </p>
                  </div>
                  <UrgencyLevelIndicator 
                    level={patientData.urgencyLevel}
                    showLabel={true}
                    size="sm"
                  />
                </div>
                
                <div className="mb-2">
                  <h3 className={`font-medium text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Motif de consultation</h3>
                  <p className="text-xs">{patientData.consultationReason}</p>
                </div>
                
                <div className="mb-2">
                  <VitalSigns 
                    vitalSigns={patientData.vitalSigns}
                    compact={true}
                    darkMode={darkMode}
                  />
                </div>
                
                <ButtonGroup className="grid grid-cols-2 gap-2">
                  <ActionButton
                    label="DPI"
                    icon={<FileText className="h-3 w-3" />}
                    variant="primary"
                    size="xs"
                    onClick={() => setShowPatientRecord(true)}
                  />
                  <ActionButton
                    label="Historique"
                    icon={<Activity className="h-3 w-3" />}
                    variant="secondary"
                    size="xs"
                  />
                </ButtonGroup>
              </div>
              
              {/* Zone de notes */}
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md flex-1 flex flex-col overflow-hidden`}>
                <div className={`p-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
                  <h3 className="font-medium text-sm">Notes de consultation</h3>
                  <div className="flex items-center space-x-1">
                    {lastAutosave && (
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Sauvegardé {formatTime(lastAutosave)}
                      </span>
                    )}
                    <ActionButton
                      label=""
                      icon={<Save className="h-4 w-4" />}
                      variant="secondary"
                      size="xs"
                    />
                    <ActionButton
                      label=""
                      icon={<X className="h-4 w-4" />}
                      variant="secondary"
                      size="xs"
                      onClick={() => setNotes('')}
                    />
                  </div>
                </div>
                <textarea
                  className={`flex-1 p-2 resize-none border-none outline-none text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                  placeholder="Saisissez vos notes de consultation ici..."
                  value={!connectionStatus.isOnline && notesBackup !== null ? notesBackup : notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={!connectionStatus.isOnline}
                ></textarea>
                
                {!connectionStatus.isOnline && (
                  <StatusBadge 
                    type="warning"
                    label="Mode hors ligne: notes sauvegardées localement"
                    icon={<AlertTriangle className="h-3 w-3" />}
                  />
                )}
                
                <div className={`p-1.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${darkMode ? 'border-gray-600' : 'border-gray-200'} border-t`}>
                  <ButtonGroup className="flex space-x-1 overflow-x-auto pb-0.5">
                    {['Antécédents', 'Examen', 'Diagnostic', 'Traitement'].map((item) => (
                      <ActionButton
                        key={item}
                        label={item}
                        variant="light"
                        size="xs"
                      />
                    ))}
                  </ButtonGroup>
                </div>
              </div>
            </div>
          )}
          
          {/* Bouton pour basculer l'affichage du panneau patient */}
          {shouldShowClinicalInfo() && (
            <button 
              className={`absolute top-1/2 transform -translate-y-1/2 ${darkMode ? 'bg-gray-700' : 'bg-white'} p-1 rounded-full shadow-md z-10`}
              style={{ right: showPatientPanel ? 'calc(33.333% - 10px)' : '10px' }}
              onClick={() => setShowPatientPanel(!showPatientPanel)}
            >
              {showPatientPanel ? 
                <ChevronRight className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : 
                <ChevronLeft className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              }
            </button>
          )}
        </div>
      )}
      
      {/* Barre d'outils secondaire */}
      {shouldShowClinicalInfo() && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-md p-2 border-t flex justify-between items-center`}>
          <ButtonGroup>
            <ActionButton
              label="Partager Écran"
              icon={<Share2 className="h-4 w-4" />}
              variant="secondary"
              size="sm"
              onClick={shareScreen}
            />
            <ActionButton
              label="Documents"
              icon={<FileImage className="h-4 w-4" />}
              variant="secondary"
              size="sm"
            />
            <ActionButton
              label="Inviter"
              icon={<Users className="h-4 w-4" />}
              variant="secondary"
              size="sm"
            />
            <ActionButton
              label="Transférer"
              icon={<UserPlus className="h-4 w-4" />}
              variant="secondary"
              size="sm"
            />
          </ButtonGroup>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="h-4 w-4 mr-1" />
              Début: {formatTime(consultationInfo.startTime)}
            </div>
            
            <ActionButton
              label="Interruption"
              icon={<PauseCircle className="h-4 w-4" />}
              variant="warning"
              size="sm"
              onClick={() => handleTemporaryPause('Interruption brève')}
            />
            
            <ActionButton
              label="Terminer"
              icon={<PhoneOff className="h-4 w-4" />}
              variant="danger"
              size="sm"
              onClick={toggleConsultation}
            />
          </div>
        </div>
      )}

      {/* Actions rapides flottantes */}
      {shouldShowClinicalInfo() && (
        <FloatingActionButton
          actions={quickActions}
          position="bottom-left"
          color="blue"
          size="medium"
          showLabels={true}
        />
      )}
      
      {/* Modal pour les raccourcis clavier */}
      <Modal
        title="Raccourcis clavier"
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        darkMode={darkMode}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Pause/Reprise:</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Espace</kbd>
          </div>
          <div className="flex justify-between">
            <span>Terminer:</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + Q</kbd>
          </div>
          <div className="flex justify-between">
            <span>Plein écran:</span>
            <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">F11</kbd>
          </div>
        </div>
      </Modal>

      {/* Modal pour le dossier patient */}
      <Modal
        title="Dossier Patient Informatisé"
        isOpen={showPatientRecord}
        onClose={() => setShowPatientRecord(false)}
        darkMode={darkMode}
        width="max-w-4xl"
      >
        <PatientRecord
          patient={patientData}
          onClose={() => setShowPatientRecord(false)}
          darkMode={darkMode}
        />
      </Modal>
      
      {/* Notifications Toast */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notifications.map((notification) => (
          <ToastNotification
            key={notification.id}
            type={notification.type}
            message={notification.content}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TeleconsultationInterface;