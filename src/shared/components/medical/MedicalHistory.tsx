import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface MedicalHistoryProps {
  medicalHistory: {
    medical?: string[];
    surgical?: string[];
    allergies?: string[];
    family?: string[];
  };
  editable?: boolean;
  onUpdate?: (updatedHistory: {
    medical?: string[];
    surgical?: string[];
    allergies?: string[];
    family?: string[];
  }) => void;
  darkMode?: boolean;
}

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  medicalHistory,
  editable = false,
  onUpdate,
  darkMode = false
}) => {
  const [newItem, setNewItem] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'medical' | 'surgical' | 'allergies' | 'family'>('medical');
  
  const handleAddItem = () => {
    if (!newItem.trim() || !onUpdate) return;
    
    const updatedHistory = { ...medicalHistory };
    
    if (!updatedHistory[selectedCategory]) {
      updatedHistory[selectedCategory] = [];
    }
    
    updatedHistory[selectedCategory] = [...(updatedHistory[selectedCategory] || []), newItem.trim()];
    
    onUpdate(updatedHistory);
    setNewItem('');
  };
  
  const handleRemoveItem = (category: 'medical' | 'surgical' | 'allergies' | 'family', index: number) => {
    if (!onUpdate) return;
    
    const updatedHistory = { ...medicalHistory };
    
    if (updatedHistory[category] && updatedHistory[category]!.length > index) {
      updatedHistory[category] = updatedHistory[category]!.filter((_, i) => i !== index);
      onUpdate(updatedHistory);
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'medical': return 'Antécédents médicaux';
      case 'surgical': return 'Antécédents chirurgicaux';
      case 'allergies': return 'Allergies';
      case 'family': return 'Antécédents familiaux';
      default: return category;
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medical': 
        return darkMode ? 'bg-blue-900 bg-opacity-30 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'surgical': 
        return darkMode ? 'bg-purple-900 bg-opacity-30 text-purple-300' : 'bg-purple-100 text-purple-800';
      case 'allergies': 
        return darkMode ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-100 text-red-800';
      case 'family': 
        return darkMode ? 'bg-green-900 bg-opacity-30 text-green-300' : 'bg-green-100 text-green-800';
      default: 
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {/* Liste des antécédents par catégorie */}
      {(['medical', 'surgical', 'allergies', 'family'] as const).map(category => (
        <div key={category}>
          <div className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {getCategoryLabel(category)}
          </div>
          <div className="flex flex-wrap gap-1">
            {medicalHistory[category] && medicalHistory[category]!.length > 0 ? (
              medicalHistory[category]!.map((item, index) => (
                <div 
                  key={index}
                  className={`px-2 py-1 text-xs rounded-md flex items-center ${getCategoryColor(category)}`}
                >
                  <span>{item}</span>
                  {editable && (
                    <button 
                      className="ml-1 rounded-full hover:bg-gray-200 hover:bg-opacity-20 p-0.5" 
                      onClick={() => handleRemoveItem(category, index)}
                      title="Supprimer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Aucun élément enregistré
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Formulaire d'ajout si éditable */}
      {editable && (
        <div>
          <div className={`text-xs font-medium mb-1 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Plus className="h-3 w-3 mr-1" />
            Ajouter un antécédent
          </div>
          <div className="flex gap-1">
            <input 
              type="text" 
              placeholder="Nouvel antécédent..."
              className={`flex-1 px-2 py-1 text-xs rounded-md border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
              }`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <select 
              className={`px-2 py-1 text-xs rounded-md border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'
              }`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
            >
              <option value="medical">Médical</option>
              <option value="surgical">Chirurgical</option>
              <option value="allergies">Allergie</option>
              <option value="family">Familial</option>
            </select>
            <button 
              className={`px-2 py-1 text-xs rounded-md ${
                darkMode ? 'bg-blue-900 text-blue-300 hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              onClick={handleAddItem}
              disabled={!newItem.trim()}
            >
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};