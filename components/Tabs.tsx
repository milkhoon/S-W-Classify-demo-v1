import React from 'react';

interface TabsProps {
  activeView: 'single' | 'bulk';
  onViewChange: (view: 'single' | 'bulk') => void;
}

const SingleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l-2.293-2.293a1 1 0 010-1.414l7-7a1 1 0 011.414 0l7 7a1 1 0 010 1.414L15 21m-5-5a2 2 0 002 2h.01a2 2 0 002-2v-.01a2 2 0 00-2-2h-.01a2 2 0 00-2 2z" />
  </svg>
);

const BulkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
);

export const Tabs: React.FC<TabsProps> = ({ activeView, onViewChange }) => {
  const getButtonClasses = (view: 'single' | 'bulk') => {
    const base = 'flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-primary';
    if (activeView === view) {
      return `${base} bg-brand-primary text-white shadow-lg`;
    }
    return `${base} bg-dark-card hover:bg-gray-700/50 text-medium-text`;
  };

  return (
    <div className="mt-6 p-1.5 bg-dark-card border border-dark-border rounded-xl grid grid-cols-2 gap-2 max-w-sm mx-auto">
      <button onClick={() => onViewChange('single')} className={getButtonClasses('single')}>
        <SingleIcon />
        단일 검사
      </button>
      <button onClick={() => onViewChange('bulk')} className={getButtonClasses('bulk')}>
        <BulkIcon />
        일괄 검사
      </button>
    </div>
  );
};
