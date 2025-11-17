import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  darkMode?: boolean;
  width?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Rechercher...",
  value,
  onChange,
  darkMode = false,
  width = "w-64"
}) => {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input 
        type="text" 
        placeholder={placeholder} 
        value={value}
        onChange={onChange}
        className={`pl-8 pr-3 py-1.5 rounded-md text-xs ${width} ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`} 
      />
    </div>
  );
};