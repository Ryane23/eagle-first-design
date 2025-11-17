import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandablePanelProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  initiallyExpanded?: boolean;
  headerRightContent?: React.ReactNode;
  expandedClass?: string;
  collapsedClass?: string;
  onToggle?: (expanded: boolean) => void;
}

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  title,
  children,
  icon,
  initiallyExpanded = false,
  headerRightContent,
  expandedClass = "bg-gray-50",
  collapsedClass = "bg-white",
  onToggle
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  const handleToggle = () => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };
  
  return (
    <div className={`border rounded-lg overflow-hidden mb-4 ${expanded ? expandedClass : collapsedClass}`}>
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-center">
          {icon && <div className="mr-3">{icon}</div>}
          <h3 className="font-medium">{title}</h3>
        </div>
        
        <div className="flex items-center">
          {headerRightContent && (
            <div className="mr-3">{headerRightContent}</div>
          )}
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandablePanel;