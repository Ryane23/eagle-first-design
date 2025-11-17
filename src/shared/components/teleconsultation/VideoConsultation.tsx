import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, Monitor, Volume2, VolumeX, Clock, Camera, AlertTriangle, PhoneOff, WifiOff, Wifi, PauseCircle, PlayCircle, Phone } from 'lucide-react';
import { ConsultationTimer } from '@teleconsult/ConsultationTimer';

interface VideoConsultationProps {
  patientName: string;
  patientInfo?: {
    age?: number;
    gender?: string;
  };
  consultationId: string;
  consultationType: string;
  onEnd: () => void;
  onPause: () => void;
  onResume: () => void;
  darkMode?: boolean;
}

export const VideoConsultation: React.FC<VideoConsultationProps> = ({
  patientName,
  patientInfo,
  consultationId,
  consultationType,
  onEnd,
  onPause,
  onResume,
  darkMode = false
}) => {
  const [connected, setConnected] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [consultationPaused, setConsultationPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState(3); // 1-5, 5 étant excellent
  const [audioOnlyMode, setAudioOnlyMode] = useState(false);

  // Simuler le temps qui passe
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!consultationPaused && connected) {
      timer = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [consultationPaused, connected]);

  // Récupérer le statut de la connexion
  const getConnectionQualityClass = () => {
    switch (connectionQuality) {
      case 1: return "text-red-500";
      case 2: return "text-orange-500";
      case 3: return "text-yellow-500";
      case 4: return "text-green-500";
      case 5: return "text-green-500";
      default: return "text-gray-500";
    }
  };

  // Récupérer le texte pour la qualité de connexion
  const getConnectionQualityText = () => {
    switch (connectionQuality) {
      case 1: return "Critique";
      case 2: return "Faible";
      case 3: return "Moyenne";
      case 4: return "Bonne";
      case 5: return "Excellente";
      default: return "Inconnue";
    }
  };

  // Récupérer l'icône pour la qualité de connexion
  const getConnectionQualityIcon = () => {
    switch (connectionQuality) {
      case 1: return <WifiOff className="h-4 w-4 text-red-500" />;
      case 2: return <Wifi className="h-4 w-4 text-orange-500" />;
      case 3: return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 4: 
      case 5: return <Wifi className="h-4 w-4 text-green-500" />;
      default: return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  // Mettre en pause/reprendre la consultation
  const togglePause = () => {
    setConsultationPaused(!consultationPaused);
    
    if (consultationPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  // Confirmer la fin de la consultation
  const confirmEndConsultation = () => {
    if (window.confirm("Êtes-vous sûr de vouloir terminer cette consultation?")) {
      onEnd();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Zone vidéo principale */}
      <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
        {audioOnlyMode ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Volume2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-white font-bold text-xl">{patientName}</h3>
            <p className="text-gray-400">Mode audio uniquement</p>
            <p className="text-yellow-500 text-sm mt-2 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Connexion insuffisante pour la vidéo (&lt; 2 Mbps)
            </p>
          </div>
        ) : (
          <>
            {!connected ? (
              <div className="text-center">
                <WifiOff className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl">Connexion perdue</h3>
                <p className="text-gray-400">Tentative de reconnexion...</p>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                {/* Simuler la vidéo du patient */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{patientName.charAt(0)}</span>
                  </div>
                  <h3 className="text-white font-bold text-xl">{patientName}</h3>
                  {patientInfo && (
                    <p className="text-gray-400">
                      {patientInfo.age && `${patientInfo.age} ans`} 
                      {patientInfo.gender && ` • ${patientInfo.gender === 'F' ? 'Féminin' : 'Masculin'}`}
                    </p>
                  )}
                </div>
                
                {/* Petite fenêtre du médecin */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-600 rounded-full mx-auto flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Dr.</span>
                    </div>
                    {!videoEnabled && (
                      <div className="mt-1 text-xs text-white">Caméra désactivée</div>
                    )}
                  </div>
                </div>
                
                {/* Indicateur de problèmes techniques */}
                {connectionQuality <= 2 && (
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-lg text-sm flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Connexion instable
                  </div>
                )}
                
                {/* Indicateur de consultation en pause */}
                {consultationPaused && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                    <div className="text-center">
                      <PauseCircle className="h-16 w-16 text-white mx-auto mb-2" />
                      <p className="text-white text-lg font-bold">Consultation en pause</p>
                      <button 
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={togglePause}
                      >
                        Reprendre
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Barre de contrôles vidéo */}
      <div className="bg-gray-800 p-3 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-full ${videoEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
            onClick={() => setVideoEnabled(!videoEnabled)}
            disabled={audioOnlyMode}
            title="Activer/désactiver la caméra"
          >
            <Video className="h-5 w-5" />
          </button>
          
          <button 
            className={`p-2 rounded-full ${micEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
            onClick={() => setMicEnabled(!micEnabled)}
            title="Activer/désactiver le microphone"
          >
            {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          
          <button 
            className={`p-2 rounded-full ${audioEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
            title="Activer/désactiver le son"
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="flex items-center mx-2">
          <ConsultationTimer 
            elapsedTime={elapsedTime}
            isPaused={consultationPaused}
          />
          <div className="ml-3 flex items-center">
            {getConnectionQualityIcon()}
            <span className={`text-sm ml-1 font-medium ${getConnectionQualityClass()}`}>
              {getConnectionQualityText()}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-full bg-gray-700 text-white"
            title="Partager l'écran"
          >
            <Monitor className="h-5 w-5" />
          </button>
          
          <button 
            className="p-2 rounded-full bg-gray-700 text-white"
            title="Prendre une capture d'écran"
          >
            <Camera className="h-5 w-5" />
          </button>
          
          <button 
            className={`p-2 rounded-full ${consultationPaused ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}
            onClick={togglePause}
            title={consultationPaused ? "Reprendre la consultation" : "Mettre en pause"}
          >
            {consultationPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
          </button>
          
          <button 
            className="p-2 rounded-full bg-red-600 text-white"
            onClick={confirmEndConsultation}
            title="Terminer la consultation"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};