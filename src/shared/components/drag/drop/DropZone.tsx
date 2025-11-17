import React, { useState } from 'react';

interface DropZoneProps {
  targetId: string | number;
  targetName: string;
  isAvailable: boolean;
  capacity: {
    current: number;
    max: number;
  };
  onDragOver: (e: React.DragEvent, targetId: string | number) => void;
  onDrop: (e: React.DragEvent, targetId: string | number) => void;
  darkMode?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  targetId,
  targetName,
  isAvailable,
  capacity,
  onDragOver,
  onDrop,
  darkMode = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e, targetId);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, targetId);
  };

  return (
    <div 
      className={`p-2 rounded border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-xs ${isAvailable ? '' : 'opacity-50'} ${isDragOver ? 'bg-blue-50 border-blue-300' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="ml-1 hover:underline cursor-pointer">{targetName}</span>
        </div>
        <span className={`px-1 py-0.5 rounded-full text-xs ${capacity.current >= capacity.max ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {capacity.current} / {capacity.max}
        </span>
      </div>
    </div>
  );
};