import { getLikertOptions } from '../services/globalServices';
import React from 'react';

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const LikertScale: React.FC<LikertScaleProps> = ({ value, onChange }) => {
  const options = getLikertOptions();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${value === option.value
              ? 'ring-2 ring-primary-500 ring-offset-2 transform scale-105'
              : 'hover:bg-gray-50'
              }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.color} text-white font-bold mb-2`}>
              {option.value}
            </div>
            <span className="text-sm font-medium text-gray-700">{option.label}</span>
          </button>
        ))}
      </div>
      {value !== null && (
        <div className="text-center">
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpar seleção
          </button>
        </div>
      )}
    </div>
  );
};

export default LikertScale;