import React, { useState } from 'react';
import { RefreshCw, Upload, X, Archive, AlertTriangle, Eye, Clock, CheckCircle, ArrowUp, ArrowDown, Server, Database, Filter, Menu, Shield } from 'lucide-react';

interface QueueItem {
  id: string | number;
  type: string;
  action: 'create' | 'update' | 'delete' | 'sync';
  status: 'pending' | 'in_progress' | 'success' | 'error';
  priority: 'high' | 'medium' | 'low';
  data: any;
  timestamp: string;
  retries?: number;
  errorMessage?: string;
  dependencies?: Array<string | number>;
}

interface SynchronizationQueueProps {
  items: QueueItem[];
  totalItems: number;
  processedItems: number;
  isOnline: boolean;
  lastSyncTime?: string;
  onSync: () => void;
  onCancelItem?: (itemId: string | number) => void;
  onRetryItem?: (itemId: string | number) => void;
  onViewDetails?: (item: QueueItem) => void;
  onChangePriority?: (itemId: string | number, priority: 'high' | 'medium' | 'low') => void;
  onClearSuccess?: () => void;
  className?: string;
}

const SynchronizationQueue: React.FC<SynchronizationQueueProps> = ({
  items,
  totalItems,
  processedItems,
  isOnline,
  lastSyncTime,
  onSync,
  onCancelItem,
  onRetryItem,
  onViewDetails,
  onChangePriority,
  onClearSuccess,
  className = ''
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'success' | 'error'>('all');
  const [selectedItem, setSelectedItem] = useState<QueueItem | null>(null);
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority'>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filtrer les éléments
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });
  
  // Trier les éléments
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'timestamp') {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Trier par priorité
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityA = priorityOrder[a.priority] || 0;
      const priorityB = priorityOrder[b.priority] || 0;
      return sortDirection === 'asc' ? priorityA - priorityB : priorityB - priorityA;
    }
  });
  
  // Obtenir le nombre d'éléments par statut
  const getItemCountByStatus = (status: string) => {
    return items.filter(item => item.status === status).length;
  };
  
  // Obtenir les classes de couleur pour la priorité
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtenir les classes de couleur pour le statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtenir l'icône pour le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_progress': return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  
  // Gérer le changement de tri
  const handleSortChange = (field: 'timestamp' | 'priority') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* En-tête */}
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <Database className="h-5 w-5 text-blue-500 mr-2" />
          File de synchronisation
        </h3>
        <div className="flex items-center">
          {lastSyncTime && (
            <span className="text-xs text-gray-600 mr-3">
              Dernière synchronisation: {lastSyncTime}
            </span>
          )}
          <div className="flex items-center">
            <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
              <div 
                className="h-2 bg-blue-600 rounded-full" 
                style={{ width: `${(processedItems / totalItems) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">
              {processedItems}/{totalItems}
            </span>
          </div>
        </div>
      </div>
      
      {/* Statistiques et contrôles */}
      <div className="p-3 border-b flex flex-wrap justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-2 py-1 text-xs rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            onClick={() => setFilter('all')}
          >
            Tous ({items.length})
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-yellow-100 text-yellow-800'}`}
            onClick={() => setFilter('pending')}
          >
            En attente ({getItemCountByStatus('pending')})
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${filter === 'in_progress' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
            onClick={() => setFilter('in_progress')}
          >
            En cours ({getItemCountByStatus('in_progress')})
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${filter === 'success' ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-800'}`}
            onClick={() => setFilter('success')}
          >
            Réussi ({getItemCountByStatus('success')})
          </button>
          <button
            className={`px-2 py-1 text-xs rounded-full ${filter === 'error' ? 'bg-blue-600 text-white' : 'bg-red-100 text-red-800'}`}
            onClick={() => setFilter('error')}
          >
            Erreur ({getItemCountByStatus('error')})
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <button
              className="px-2 py-1 text-xs border rounded-l flex items-center"
              onClick={() => handleSortChange('timestamp')}
            >
              <Clock className="h-3 w-3 mr-1" />
              Date
              {sortBy === 'timestamp' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
              )}
            </button>
            <button
              className="px-2 py-1 text-xs border rounded-r border-l-0 flex items-center"
              onClick={() => handleSortChange('priority')}
            >
              <Shield className="h-3 w-3 mr-1" />
              Priorité
              {sortBy === 'priority' && (
                sortDirection === 'asc' ? <ArrowUp className="h-3 w-3 ml-1" /> : <ArrowDown className="h-3 w-3 ml-1" />
              )}
            </button>
          </div>
          
          {isOnline && (
            <button
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded flex items-center"
              onClick={onSync}
            >
              <Upload className="h-3 w-3 mr-1" />
              Synchroniser
            </button>
          )}
          
          {onClearSuccess && getItemCountByStatus('success') > 0 && (
            <button
              className="px-2 py-1 text-xs border rounded flex items-center"
              onClick={onClearSuccess}
            >
              <Archive className="h-3 w-3 mr-1" />
              Archiver
            </button>
          )}
        </div>
      </div>
      
      {/* Liste d'éléments */}
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-200">
        {sortedItems.length > 0 ? (
          sortedItems.map(item => (
            <div 
              key={item.id} 
              className={`p-3 ${selectedItem?.id === item.id ? 'bg-blue-50' : 'hover:bg-gray-50'} cursor-pointer`}
              onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-3">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap">
                      <span className="font-medium text-sm mr-2">{item.type}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusClass(item.status)}`}>
                        {item.status === 'pending' ? 'En attente' : 
                        item.status === 'in_progress' ? 'En cours' : 
                        item.status === 'success' ? 'Réussi' : 'Erreur'}
                      </span>
                      {item.retries && item.retries > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          Tentatives: {item.retries}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.timestamp} • {item.action === 'create' ? 'Création' : item.action === 'update' ? 'Modification' : item.action === 'delete' ? 'Suppression' : 'Synchronisation'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${getPriorityClass(item.priority)}`}>
                    {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                  </span>
                  
                  {onChangePriority && item.status === 'pending' && (
                    <button
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Menu de changement de priorité
                      }}
                    >
                      <Menu className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onViewDetails && (
                    <button
                      className="p-1 text-blue-600 hover:text-blue-800 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(item);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onRetryItem && item.status === 'error' && (
                    <button
                      className="p-1 text-green-600 hover:text-green-800 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRetryItem(item.id);
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onCancelItem && (item.status === 'pending' || item.status === 'error') && (
                    <button
                      className="p-1 text-red-600 hover:text-red-800 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelItem(item.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Détails de l'élément sélectionné */}
              {selectedItem?.id === item.id && (
                <div className="mt-2 ml-7 pl-2 border-l-2 border-gray-300">
                  {item.errorMessage && (
                    <div className="mb-2 p-2 bg-red-50 text-red-800 text-sm rounded border border-red-200">
                      <div className="font-medium">Erreur:</div>
                      <div>{item.errorMessage}</div>
                    </div>
                  )}
                  
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    <pre className="whitespace-pre-wrap break-all text-xs text-gray-600">
                      {JSON.stringify(item.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Server className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Aucun élément dans la file de synchronisation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SynchronizationQueue;