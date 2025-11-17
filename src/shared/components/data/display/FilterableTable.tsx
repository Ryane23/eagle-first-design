import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface Column {
  id: string;
  header: string;
  accessor: (row: any) => any;
  sortable?: boolean;
  filterable?: boolean;
}

interface FilterableTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
}

const FilterableTable: React.FC<FilterableTableProps> = ({
  columns,
  data,
  emptyMessage = "Aucune donnée disponible"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  // Gestion du tri
  const handleSort = (columnId: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === columnId && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnId, direction });
  };
  
  // Application des filtres et tri
  const filteredAndSortedData = useMemo(() => {
    let filteredData = [...data];
    
    // Appliquer recherche globale
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        return columns.some(column => {
          const value = column.accessor(item);
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }
    
    // Appliquer filtres par colonne
    Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        const column = columns.find(col => col.id === columnId);
        if (column) {
          filteredData = filteredData.filter(item => {
            const value = column.accessor(item);
            return value && value.toString().toLowerCase().includes(filterValue.toLowerCase());
          });
        }
      }
    });
    
    // Appliquer tri
    if (sortConfig) {
      const column = columns.find(col => col.id === sortConfig.key);
      if (column) {
        filteredData.sort((a, b) => {
          const valueA = column.accessor(a);
          const valueB = column.accessor(b);
          
          if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
    }
    
    return filteredData;
  }, [data, searchTerm, sortConfig, columnFilters, columns]);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
          {showFilters ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
        </button>
      </div>
      
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {columns.filter(col => col.filterable).map(column => (
              <div key={column.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column.header}
                </label>
                <input
                  type="text"
                  placeholder={`Filtrer par ${column.header.toLowerCase()}`}
                  className="w-full px-3 py-2 border rounded-md"
                  value={columnFilters[column.id] || ''}
                  onChange={(e) => setColumnFilters({...columnFilters, [column.id]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th 
                  key={column.id}
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && (
                      <button 
                        onClick={() => handleSort(column.id)}
                        className="ml-1 text-gray-400"
                      >
                        {sortConfig?.key === column.id ? (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 flex flex-col">
                            <ChevronUp className="h-2 w-2" />
                            <ChevronDown className="h-2 w-2" />
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map(column => (
                    <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilterableTable;