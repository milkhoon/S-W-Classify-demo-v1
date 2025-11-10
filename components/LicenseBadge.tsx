import React from 'react';
import type { LicenseType } from '../types';

interface LicenseBadgeProps {
  type: LicenseType;
}

export const LicenseBadge: React.FC<LicenseBadgeProps> = ({ type }) => {
    const getTypeStyles = (type: LicenseType) => {
        switch (type) {
            case '프리웨어':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            case '쉐어웨어':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case '상용':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    return (
        <div className={`inline-block self-start px-2 py-0.5 text-xs font-semibold rounded-full border ${getTypeStyles(type)}`}>
            {type}
        </div>
    );
};
