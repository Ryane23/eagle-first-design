import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, Database, Clock, CheckCircle, X } from 'lucide-react';

interface OfflineAction {
  id: string | number;
  type: string;
  action: string;
  timestamp: string;
  status: 'pending' | 'synced' | 'error';
  priority: 'high' | 'medium' | 'low';
  data: any;
}

interface SyncHistory {
  id: string | number;
  timestamp: string;
  status: 'success' | 'failed' | 'partial';
  items: number;
  details: string;
}

interface OfflineModeManagerProps {
  actions: OfflineAction[];
  syncHistory: SyncHistory[];
  isOnline: boolean;
  storageStats?: {
    used: number;
    total: number;
    items: number;
    maxItems: number;
    lastSync: string;
  };
  onSync: () => void;
  onTestConnection: () => void;
  onDeleteAction?: (actionId: string | number) => void;
  onActionChange?: (actionId: string | number, data: any) => void;
  onChangeSyncFrequency?: (minutes: number) => void;
  syncFrequency?: number;
  className?: string;
}

const OfflineModeManager: React.FC<OfflineModeManagerProps> = ({
  actions,
  syncHistory,
  isOnline,
  storageStats,
  onSync,
  onTestConnection,
  onDeleteAction,
  onActionChange,
  onChangeSyncFrequency,
  syncFrequency = 5,
  className = ''
}) => {
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [selectedAction, setSelectedAction] = useState<OfflineAction | null>(null);
  const [internalSyncFrequency, setInternalSyncFrequency] = useState(syncFrequency);
  
  // Mettre à jour la fréquence de synchronisation en interne lorsqu'elle change via les props
  useEffect(() => {
    setInternalSyncFrequency(syncFrequency);
  }, [syncFrequency]);
  
  // Obtenir la classe de couleur pour les priorités
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtenir la classe de couleur pour les statuts de synchronisation
  const getSyncStatusClass = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'partial': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };
  
  // Obtenir l'icône pour les statuts de synchronisation
  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <X className="h-4 w-4 text-red-600" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Gérer le changement de fréquence de synchronisation
  const handleSyncFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setInternalSyncFrequency(newValue);
    
    if (onChangeSyncFrequency) {
      onChangeSyncFrequency(newValue);
    }
  };
  
  return (
    <div className={`${className}`}>
      {/* Alerte de mode hors ligne */}
      {!isOnline && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <WifiOff className="h-5 w-5 mr-2" />
            <div>
              <p className="font-bold">Mode Hors Ligne Actif</p>
              <p className="text-sm">Les modifications seront enregistrées localement et synchronisées automatiquement lors de la reconnexion.</p>
            </div>
          </div>
          <button 
            className="px-3 py-1 bg-red-200 hover:bg-red-300 text-red-800 rounded-md text-sm flex items-center"
            onClick={onTestConnection}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Tester la connexion
          </button>
        </div>
      )}
      
      {/* Bannière de mode en ligne (quand connecté) */}
      {isOnline && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-3 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Wifi className="h-5 w-5 mr-2" />
            <div>
              <p className="font-bold">Connexion Active</p>
              <p className="text-sm">
                {actions.filter(a => a.status === 'pending').length} actions en attente de synchronisation. 
                {storageStats && ` Dernière synchronisation: ${storageStats.lastSync}`}
              </p>
            </div>
          </div>
          <button 
            className="px-3 py-1 bg-green-200 hover:bg-green-300 text-green-800 rounded-md text-sm flex items-center"
            onClick={onSync}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Synchroniser maintenant
          </button>
        </div>
      )}
      
      {/* Statistiques de stockage */}
      {storageStats && (
        <div className="bg-white rounded-lg shadow p-3 mb-3">
          <h3 className="font-medium text-sm mb-2 flex items-center">
            <Database className="h-4 w-4 mr-2 text-blue-600" />
            Stockage Local
          </h3>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Espace utilisé</span>
                <span>{storageStats.used}/{storageStats.total} MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(storageStats.used / storageStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Enregistrements stockés</span>
                <span>{storageStats.items}/{storageStats.maxItems}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(storageStats.items / storageStats.maxItems) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Paramètres de synchronisation */}
      {onChangeSyncFrequency && (
        <div className="bg-white rounded-lg shadow p-3 mb-3">
          <h3 className="font-medium text-sm mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            Paramètres de Synchronisation
          </h3>
          
          <div>
            <label className="text-xs text-gray-500 block mb-1">Fréquence des tentatives</label>
            <div className="flex items-center">
              <input 
                type="range" 
                min="1" 
                max="30" 
                value={internalSyncFrequency} 
                onChange={handleSyncFrequencyChange}
                className="flex-1 mr-2"
              />
              <span className="text-xs font-medium w-12 text-center">
                {internalSyncFrequency} min
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste des actions en attente */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-3">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-sm">Actions en attente de synchronisation</h3>
          {actions.length > 0 && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              {actions.length} actions
            </span>
          )}
        </div>
        
        <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
          {actions.length > 0 ? (
            actions.map(action => (
              <div 
                key={action.id}
                className={`p-3 ${selectedAction?.id === action.id ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
                onClick={() => setSelectedAction(action === selectedAction ? null : action)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-sm flex items-center">
                      {action.type === 'patient' && <User className="h-4 w-4 text-blue-600 mr-1" />}
                      {action.type === 'document' && <FileText className="h-4 w-4 text-orange-600 mr-1" />}
                      {action.action === 'create' ? 'Création' : 'Modification'} {action.type}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {action.timestamp}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityClass(action.priority)}`}>
                      {action.priority === 'high' ? 'Haute' : action.priority === 'medium' ? 'Moyenne' : 'Basse'}
                    </span>
                    
                    {isOnline && onActionChange && (
                      <button 
                        className="ml-2 p-1 text-blue-600 hover:bg-blue-100 rounded" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onActionChange) onActionChange(action.id, action.data);
                        }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    
                    {onDeleteAction && (
                      <button 
                        className="ml-1 p-1 text-red-600 hover:bg-red-100 rounded" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDeleteAction) onDeleteAction(action.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Afficher les détails lorsque l'action est sélectionnée */}
                {selectedAction?.id === action.id && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <pre className="whitespace-pre-wrap break-all">
                      {JSON.stringify(action.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <CheckCircle className="h-10 w-10 mx-auto mb-2 text-green-500" />
              <p>Toutes les actions sont synchronisées</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Historique des synchronisations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium text-sm">Historique des synchronisations</h3>
          <button 
            className="text-xs text-blue-600"
            onClick={() => setShowSyncHistory(!showSyncHistory)}
          >
            {showSyncHistory ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        
        {showSyncHistory && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Éléments</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syncHistory.map((sync) => (
                  <tr key={sync.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {sync.timestamp}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        {getSyncStatusIcon(sync.status)}
                        <span className={`ml-1 text-xs ${getSyncStatusClass(sync.status)}`}>
                          {sync.status === 'success' ? 'Réussie' : sync.status === 'failed' ? 'Échouée' : 'Partielle'}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs">
                      {sync.items} éléments
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {sync.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineModeManager;