import React from 'react';
import { Spinner } from './Spinner';

interface InputFormProps {
  softwareName: string;
  onNameChange: (value: string) => void;
  onCheck: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ softwareName, onNameChange, onCheck, isLoading }) => {
    
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      onCheck();
    }
  };
    
  return (
    <div className="space-y-4 animate-fade-in">
      <label htmlFor="softwareName" className="block text-sm font-medium text-medium-text">
        소프트웨어 이름
      </label>
      <input
        id="softwareName"
        type="text"
        className="w-full bg-dark-card border border-dark-border rounded-lg p-4 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 placeholder-gray-500"
        placeholder="예: Adobe Photoshop, 7-Zip, Visual Studio Code..."
        value={softwareName}
        onChange={(e) => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <button
        onClick={onCheck}
        disabled={isLoading || !softwareName.trim()}
        className="w-full flex justify-center items-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span className="ml-2">검사 중...</span>
          </>
        ) : (
          '검사하기'
        )}
      </button>
    </div>
  );
};