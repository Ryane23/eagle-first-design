import React from 'react';
import { Activity, Droplet, Thermometer, Wind, User } from 'lucide-react';

interface VitalSign {
  name: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  normalRange?: {
    min: number;
    max: number;
  };
}

interface VitalSignsProps {
  vitalSigns: {
    bloodPressure?: string;
    heartRate?: string | number;
    temperature?: string | number;
    oxygenSaturation?: string | number;
    weight?: string | number;
    height?: string | number;
    glycemia?: string | number;
  };
  editable?: boolean;
  compact?: boolean;
  onChange?: (name: string, value: string) => void;
  darkMode?: boolean;
}

export const VitalSigns: React.FC<VitalSignsProps> = ({
  vitalSigns,
  editable = false,
  compact = false,
  onChange,
  darkMode = false
}) => {
  // Calculer l'IMC si le poids et la taille sont disponibles
  const calculateBMI = () => {
    const weight = Number(vitalSigns.weight);
    const height = Number(vitalSigns.height);
    
    if (weight && height && height > 0) {
      // Si la taille est en cm, conversion en m
      const heightInM = height > 3 ? height / 100 : height;
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    
    return null;
  };
  
  const bmi = calculateBMI();
  
  // Vérifier si une valeur est hors de la plage normale
  const isOutOfRange = (value: number, min: number, max: number) => {
    return value < min || value > max;
  };
  
  // Obtenir la classe de couleur en fonction de la valeur
  const getValueColorClass = (value: number, min: number, max: number) => {
    if (isOutOfRange(value, min, max)) {
      return darkMode ? 'text-red-400' : 'text-red-600';
    }
    return '';
  };
  
  // Formater la liste des signes vitaux
  const formatVitalSigns = (): VitalSign[] => {
    const signs: VitalSign[] = [];
    
    if (vitalSigns.bloodPressure) {
      signs.push({
        name: 'TA',
        value: vitalSigns.bloodPressure,
        unit: 'mmHg',
        icon: <Activity className="h-4 w-4" />,
        normalRange: { min: 90, max: 140 }
      });
    }
    
    if (vitalSigns.heartRate) {
      signs.push({
        name: 'Pouls',
        value: vitalSigns.heartRate,
        unit: 'bpm',
        icon: <Activity className="h-4 w-4" />,
        normalRange: { min: 60, max: 100 }
      });
    }
    
    if (vitalSigns.temperature) {
      signs.push({
        name: 'Température',
        value: vitalSigns.temperature,
        unit: '°C',
        icon: <Thermometer className="h-4 w-4" />,
        normalRange: { min: 36, max: 37.8 }
      });
    }
    
    if (vitalSigns.oxygenSaturation) {
      signs.push({
        name: 'SpO2',
        value: vitalSigns.oxygenSaturation,
        unit: '%',
        icon: <Wind className="h-4 w-4" />,
        normalRange: { min: 95, max: 100 }
      });
    }
    
    if (vitalSigns.glycemia) {
      signs.push({
        name: 'Glycémie',
        value: vitalSigns.glycemia,
        unit: 'g/L',
        icon: <Droplet className="h-4 w-4" />,
        normalRange: { min: 0.7, max: 1.2 }
      });
    }
    
    if (bmi) {
      signs.push({
        name: 'IMC',
        value: bmi,
        unit: 'kg/m²',
        icon: <User className="h-4 w-4" />,
        normalRange: { min: 18.5, max: 25 }
      });
    }
    
    return signs;
  };
  
  const vitalSignsList = formatVitalSigns();
  
  // Version compacte pour affichage dans les cartes
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {vitalSignsList.map((sign, index) => (
          <div 
            key={index}
            className={`px-2 py-1 rounded-md text-xs flex items-center ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <span className="mr-1">{sign.icon}</span>
            <span className={`font-medium ${
              sign.normalRange && isOutOfRange(Number(sign.value), sign.normalRange.min, sign.normalRange.max)
                ? (darkMode ? 'text-red-400' : 'text-red-600')
                : ''
            }`}>
              {sign.value} {sign.unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  
  // Version éditable ou en lecture seule standard
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {vitalSignsList.map((sign, index) => (
        <div key={index}>
          <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="inline-block mr-1">{sign.icon}</span>
            {sign.name} ({sign.unit})
          </label>
          
          {editable ? (
            <input 
              type="text" 
              className={`w-full px-2 py-1 text-sm rounded-md border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
              value={sign.value}
              onChange={(e) => onChange && onChange(sign.name.toLowerCase(), e.target.value)}
              aria-label={sign.name}
            />
          ) : (
            <div className={`w-full px-2 py-1 text-sm rounded-md ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            } ${
              sign.normalRange && isOutOfRange(Number(sign.value), sign.normalRange.min, sign.normalRange.max)
                ? (darkMode ? 'text-red-400' : 'text-red-600')
                : ''
            }`}>
              {sign.value} {sign.unit}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};