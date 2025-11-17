import React, { useState } from 'react';
import { Clock, Filter, User, FileText, Calendar, Edit, Trash2, Plus, ChevronDown, ChevronUp, Download, Search, RefreshCw, Eye } from 'lucide-react';

interface Activity {
  id: string | number;
  user: {
    id: string;
    name: string;
    role: string;
  };
  action: 'create' | 'update' | 'delete' | 'view' | 'download' | 'login' | 'logout' | 'other';
  resourceType: string;
  resourceId?: string | number;
  resourceName?: string;
  timestamp: string;
  details?: string;
  ip?: string;
  location?: string;
}

interface UserActivityLogProps {
  activities: Activity[];
  canExport?: boolean;
  canFilter?: boolean;
  canSearch?: boolean;
  maxHeight?: string;
  showDetails?: boolean;
  onViewDetails?: (activity: Activity) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  className?: string;
}

const UserActivityLog: React.FC<UserActivityLogProps> = ({
  activities,
  canExport = true,
  canFilter = true,
  canSearch = true,
  maxHeight = '400px',
  showDetails = true,
  onViewDetails,
  onExport,
  onRefresh,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedActivity, setExpandedActivity] = useState<string | number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    action: 'all',
    resourceType: 'all',
    dateRange: 'today'
  });
  
  // Obtenir l'icône pour une action
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Plus className="h-4 w-4 text-green-500" />;
      case 'update': return <Edit className="h-4 w-4 text-blue-500" />;
      case 'delete': return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'view': return <Eye className="h-4 w-4 text-purple-500" />;
      case 'download': return <Download className="h-4 w-4 text-indigo-500" />;
      case 'login': return <User className="h-4 w-4 text-green-500" />;
      case 'logout': return <User className="h-4 w-4 text-gray-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Obtenir le texte pour une action
  const getActionText = (action: string) => {
    switch (action) {
      case 'create': return 'Création';
      case 'update': return 'Modification';
      case 'delete': return 'Suppression';
      case 'view': return 'Consultation';
      case 'download': return 'Téléchargement';
      case 'login': return 'Connexion';
      case 'logout': return 'Déconnexion';
      default: return 'Action';
    }
  };
  
  // Obtenir la classe de couleur pour une action
  const getActionClass = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'view': return 'bg-purple-100 text-purple-800';
      case 'download': return 'bg-indigo-100 text-indigo-800';
      case 'login': return 'bg-green-100 text-green-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Obtenir l'icône pour un type de ressource
  const getResourceIcon = (resourceType: string) => {
    switch (resourceType.toLowerCase()) {
      case 'patient': return <User className="h-4 w-4 text-blue-500" />;
      case 'document': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'appointment': return <Calendar className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Filtrer les activités
  const filteredActivities = activities.filter(activity => {
    // Filtre de recherche
    if (searchTerm && !(
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activity.resourceName && activity.resourceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      activity.resourceType.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      return false;
    }
    
    // Filtre par action
    if (filters.action !== 'all' && activity.action !== filters.action) {
      return false;
    }
    
    // Filtre par type de ressource
    if (filters.resourceType !== 'all' && activity.resourceType !== filters.resourceType) {
      return false;
    }
    
    // Filtre par plage de dates
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const activityDate = new Date(activity.timestamp);
      
      if (filters.dateRange === 'today' && (
        activityDate.getDate() !== today.getDate() ||
        activityDate.getMonth() !== today.getMonth() ||
        activityDate.getFullYear() !== today.getFullYear()
      )) {
        return false;
      }
      
      if (filters.dateRange === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (activityDate < weekAgo) {
          return false;
        }
      }
      
      if (filters.dateRange === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (activityDate < monthAgo) {
          return false;
        }
      }
    }
    
    return true;
  });
  
  // Obtenir la liste des types de ressources uniques
  const uniqueResourceTypes = Array.from(new Set(activities.map(a => a.resourceType)));
  
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* En-tête */}
      <div className="p-3 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-2">
        <h3 className="font-medium flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          Journal d'activité
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {canSearch && (
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
          
          {canFilter && (
            <button 
              className="flex items-center px-2 py-1 text-sm border rounded-md bg-gray-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtres
              {showFilters ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </button>
          )}
          
          {onRefresh && (
            <button 
              className="flex items-center px-2 py-1 text-sm border rounded-md bg-gray-50"
              onClick={onRefresh}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          
          {canExport && onExport && (
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
                Action
              </label>
              <select 
                className="w-full p-1.5 text-sm border rounded-md"
                value={filters.action}
                onChange={(e) => setFilters({...filters, action: e.target.value})}
              >
                <option value="all">Toutes les actions</option>
                <option value="create">Création</option>
                <option value="update">Modification</option>
                <option value="delete">Suppression</option>
                <option value="view">Consultation</option>
                <option value="download">Téléchargement</option>
                <option value="login">Connexion</option>
                <option value="logout">Déconnexion</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de ressource
              </label>
              <select 
                className="w-full p-1.5 text-sm border rounded-md"
                value={filters.resourceType}
                onChange={(e) => setFilters({...filters, resourceType: e.target.value})}
              >
                <option value="all">Tous les types</option>
                {uniqueResourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="all">Toutes les dates</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste des activités */}
      <div 
        className="divide-y divide-gray-200 overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <div 
              key={activity.id} 
              className="p-3 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {getActionIcon(activity.action)}
                    </div>
                    <div>
                      <div className="font-medium text-sm flex items-center flex-wrap">
                        <span className="mr-1">{activity.user.name}</span>
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${getActionClass(activity.action)}`}>
                          {getActionText(activity.action)}
                        </span>
                        <span className="mx-1 text-gray-600">•</span>
                        <span className="flex items-center">
                          {getResourceIcon(activity.resourceType)}
                          <span className="ml-1">{activity.resourceType}</span>
                        </span>
                        {activity.resourceName && (
                          <span className="ml-1 text-gray-600">
                            {activity.resourceName}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {activity.timestamp}
                        {activity.ip && ` • IP: ${activity.ip}`}
                        {activity.location && ` • ${activity.location}`}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {expandedActivity !== activity.id && showDetails && activity.details && (
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      onClick={() => setExpandedActivity(activity.id)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}
                  
                  {expandedActivity === activity.id && (
                    <button 
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      onClick={() => setExpandedActivity(null)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  )}
                  
                  {onViewDetails && (
                    <button 
                      className="p-1 text-blue-600 hover:text-blue-800 rounded"
                      onClick={() => onViewDetails(activity)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Détails dépliables */}
              {expandedActivity === activity.id && activity.details && (
                <div className="mt-2 ml-7 pl-2 border-l-2 border-gray-300">
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {activity.details}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>Aucune activité ne correspond aux critères.</p>
            {(searchTerm || filters.action !== 'all' || filters.resourceType !== 'all') && (
              <button
                className="mt-2 text-blue-600 text-sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    action: 'all',
                    resourceType: 'all',
                    dateRange: 'today'
                  });
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivityLog;