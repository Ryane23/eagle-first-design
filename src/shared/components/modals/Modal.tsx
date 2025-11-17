import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  darkMode?: boolean;
  width?: string;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  footer,
  darkMode = false,
  width = 'max-w-md'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${width} rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg p-4 mx-4`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="mb-4">
          {children}
        </div>
        
        {footer && (
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};