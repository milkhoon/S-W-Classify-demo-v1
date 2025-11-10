import React from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange }) => {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-medium-text">{label}</span>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-gray-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
    </label>
  );
};
