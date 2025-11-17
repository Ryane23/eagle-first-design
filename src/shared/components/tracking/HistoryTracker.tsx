import React, { useState } from 'react';
import { Clock, ArrowRight, User, Eye, Download, FileText, ChevronDown, ChevronUp, Filter, Search, Calendar, RefreshCw, Copy, Check } from 'lucide-react';

interface HistoryItem {
  id: string | number;
  type: string;
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'transfer' | 'other';
  user: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  details?: string;
  entityId?: string | number;
  entityName?: string;
}

interface HistoryTrackerProps {
  history: HistoryItem[];
  title?: string;
  maxHeight?: string;
  showFilter?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  onViewDetails?: (item: HistoryItem) => void;
  onExport?: () => void;
  className?: string;
}

const HistoryTracker: React.FC<HistoryTrackerProps> = ({
  history,
  title = "Historique des modifications",
  maxHeight = '500px',
  showFilter = true,
  showSearch = true,
  showExport = true,
  onViewDetails,
  onExport,
  className = ''
}) => {
  const [expandedItem, setExpandedItem] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    action: 'all',
    dateRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Obtenir les types uniques
  const uniqueTypes = Array.from(new Set(history.map(item => item.type)));
  
  // Obtenir les actions uniques
  const uniqueActions = Array.from(new Set(history.map(item => item.action)));
  
  // Obtenir les classes de couleur pour une action
  const getActionColorClass = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'approve': return 'bg-green-100 text-green-800';
      case 'reject': return 'bg-red-100 text-red-800';
      case 'transfer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtenir l'icône pour une action
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <FileText className="h-4 w-4 text-green-500" />;
      case 'update': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'delete': return <Clock className="h-4 w-4 text-red-500" />;
      case 'approve': return <Check className="h-4 w-4 text-green-500" />;
      case 'reject': return <Clock className="h-4 w-4 text-red-500" />;
      case 'transfer': return <ArrowRight className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Obtenir le texte pour une action
  const getActionText = (action: string) => {
    switch (action) {
      case 'create': return 'Création';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'approve': return 'Approbation';
      case 'reject': return 'Rejet';
      case 'transfer': return 'Transfert';
      default: return 'Action';
    }
  };
  
  // Formater la valeur pour l'affichage
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'Non défini';
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'object') return JSON.stringify(value);
    return value.toString();
  };
  
  // Filtrer l'historique
  const filteredHistory = history.filter(item => {
    // Filtre de recherche
    if (searchTerm && !(
      item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.entityName && item.entityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Filtre par type
    if (filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }
    
    // Filtre par action
    if (filters.action !== 'all' && item.action !== filters.action) {
      return false;
    }
    
    // Filtre par date
    if (filters.dateRange !== 'all') {
      const itemDate = new Date(item.timestamp);
      const today = new Date();
      
      if (filters.dateRange === 'today') {
        return (
          itemDate.getDate() === today.getDate() &&
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      }
      
      if (filters.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        return itemDate >= weekAgo;
      }
      
      if (filters.dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        return itemDate >= monthAgo;
      }
    }
    
    return true;
  });
  
  // Copier l'ID dans le presse-papiers
  const copyId = (id: string | number) => {
    navigator.clipboard.writeText(id.toString());
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          {title}
        </h3>
        
        <div className="flex items-center space-x-2">
          {showSearch && (
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-8 pr-2 py-1 text-sm border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          
          {showFilter && (
            <button 
              className="flex items-center px-2 py-1 text-sm border rounded-md bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtres
              {showFilters ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </button>
          )}
          
          {showExport && onExport && (
            <button 
              className="flex items-center px-2 py-1 text-sm border rounded-md bg-gray-50"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </button>
          )}
        </div>
      </div>
      
      {/* Zone de filtres */}
      {showFilters && (
        <div className="p-3 bg-gray-50 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'entité
              </label>
              <select 
                className="w-full p-1.5 text-sm border rounded-md"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">Tous les types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'action
              </label>
              <select 
                className="w-full p-1.5 text-sm border rounded-md"
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
              >
                <option value="all">Toutes les actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{getActionText(action)}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période
              </label>
              <select 
                className="w-full p-1.5 text-sm border rounded-md"
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste de l'historique */}
      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredHistory.map(item => (
              <div 
                key={item.id} 
                className="p-3 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {getActionIcon(item.action)}
                    </div>
                    
                    <div>
                      <div className="flex items-center flex-wrap gap-1">
                        <span className="font-medium text-sm">{item.user.name}</span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${getActionColorClass(item.action)}`}>
                          {getActionText(item.action)}
                        </span>
                        <span className="text-gray-500 text-sm">{item.type}</span>
                        {item.entityName && (
                          <span className="text-gray-700 text-sm">"{item.entityName}"</span>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.timestamp}
                        </span>
                      </div>
                      
                      {item.entityId && (
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <span>ID: {item.entityId}</span>
                          <button 
                            onClick={() => copyId(item.entityId!)}
                            className="ml-1 text-blue-500 hover:text-blue-700"
                            title="Copier l'ID"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                      
                      {item.details && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.details}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    {item.changes && item.changes.length > 0 && (
                      <button 
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      >
                        {expandedItem === item.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    )}
                    
                    {onViewDetails && (
                      <button 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => onViewDetails(item)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Détails des modifications */}
                {expandedItem === item.id && item.changes && (
                  <div className="mt-3 pl-8 text-sm">
                    <h4 className="font-medium text-gray-700 mb-2">Modifications:</h4>
                    <div className="space-y-2">
                      {item.changes.map((change, index) => (
                        <div 
                          key={index}
                          className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-2"
                        >
                          <div className="font-medium text-gray-700">{change.field}</div>
                          <div className="text-red-600 line-through">
                            {formatValue(change.oldValue)}
                          </div>
                          <div className="text-green-600">
                            {formatValue(change.newValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="font-medium">Aucun historique disponible</p>
            <p className="text-sm">Aucune action ne correspond aux critères sélectionnés.</p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredHistory.length > 0 && (
        <div className="p-3 bg-gray-50 border-t flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredHistory.length} élément{filteredHistory.length > 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm border rounded-md bg-white text-gray-700">
              Précédent
            </button>
            <button className="px-3 py-1 text-sm border rounded-md bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 text-sm border rounded-md bg-white text-gray-700">
              2
            </button>
            <button className="px-3 py-1 text-sm border rounded-md bg-white text-gray-700">
              3
            </button>
            <button className="px-3 py-1 text-sm border rounded-md bg-white text-gray-700">
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTracker;