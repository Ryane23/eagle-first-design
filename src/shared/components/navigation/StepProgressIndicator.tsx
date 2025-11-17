import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number | string;
  label: string;
  completed: boolean;
  current: boolean;
}

interface StepProgressIndicatorProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
}

const StepProgressIndicator: React.FC<StepProgressIndicatorProps> = ({ 
  steps,
  orientation = 'horizontal'
}) => {
  const isVertical = orientation === 'vertical';
  
  return (
    <div className={`flex ${isVertical ? 'flex-col space-y-4' : 'flex-row space-x-4'}`}>
      {steps.map((step, index) => (
        <div 
          key={step.id} 
          className={`flex ${isVertical ? 'items-start' : 'flex-col items-center'} ${index !== steps.length - 1 ? 'flex-1' : ''}`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed ? 'bg-green-500 text-white' : 
              step.current ? 'bg-blue-500 text-white' : 
              'bg-gray-200 text-gray-500'
            }`}>
              {step.completed ? (
                <Check className="w-5 h-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            
            <div className={`${isVertical ? 'ml-3' : 'mt-2 text-center'}`}>
              <div className={`text-sm font-medium ${
                step.completed ? 'text-green-600' : 
                step.current ? 'text-blue-600' : 
                'text-gray-500'
              }`}>
                {step.label}
              </div>
            </div>
          </div>
          
          {/* Ligne de connexion entre les étapes */}
          {index !== steps.length - 1 && (
            <div className={`
              ${isVertical ? 'ml-4 h-10 border-l-2' : 'w-full h-1 mt-3 mx-2'} 
              ${step.completed ? 'border-green-500 bg-green-500' : 'border-gray-200 bg-gray-200'}
            `}></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepProgressIndicator;