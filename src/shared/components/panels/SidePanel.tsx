import React from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  darkMode?: boolean;
  width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  title,
  isOpen,
  onClose,
  children,
  darkMode = false,
  width = 'w-72'
}) => {
  if (!isOpen) return null;

  return (
    <div className={`${width} border-l ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} h-screen overflow-y-auto transition-all duration-300 fixed right-0 top-0 z-10`}>
      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-sm">{title}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-3">
        {children}
      </div>
    </div>
  );
};