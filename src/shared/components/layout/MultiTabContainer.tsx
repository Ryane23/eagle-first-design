import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  badge?: number | string;
}

interface MultiTabContainerProps {
  tabs: Tab[];
  defaultTabId?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (tabId: string) => void;
}

const MultiTabContainer: React.FC<MultiTabContainerProps> = ({
  tabs,
  defaultTabId,
  orientation = 'horizontal',
  onChange
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabs.length > 0 ? tabs[0].id : ''));
  
  const isVertical = orientation === 'vertical';
  
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  return (
    <div className={`flex ${isVertical ? 'flex-row' : 'flex-col'}`}>
      <div className={`${isVertical ? 'w-48 flex-shrink-0 mr-4' : 'flex border-b'}`}>
        <div className={`${isVertical ? 'flex flex-col' : 'flex overflow-x-auto'}`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`
                ${isVertical ? 'text-left mb-1 px-3 py-2' : 'px-4 py-2 whitespace-nowrap'}
                ${activeTabId === tab.id 
                  ? isVertical 
                    ? 'bg-blue-100 text-blue-700 rounded-lg' 
                    : 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'}
                flex items-center text-sm font-medium
              `}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className={`${isVertical ? 'flex-1' : 'mt-4'}`}>
        {activeTab && activeTab.content}
      </div>
    </div>
  );
};

export default MultiTabContainer;

export { MultiTabContainer }