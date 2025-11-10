import React from 'react';
import type { LicenseResult, LicenseInfo } from '../types';
import { LicenseBadge } from './LicenseBadge';

interface ResultDisplayProps {
  result: LicenseResult;
}

const LicenseCard: React.FC<{ title: string; info: LicenseInfo }> = ({ title, info }) => {
    return (
        <div className="bg-gray-800/50 p-6 rounded-lg border border-dark-border h-full flex flex-col">
            <h3 className="text-lg font-semibold text-light-text mb-3">{title}</h3>
            <LicenseBadge type={info.type} />
            <p className="text-medium-text mt-4 leading-relaxed flex-grow">{info.reasoning}</p>
        </div>
    );
};

const LinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2 text-medium-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
)

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-brand-primary mb-6">라이선스 검사 결과</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
            <LicenseCard title="개인용 (Personal)" info={result.personal} />
            <LicenseCard title="기업용 (Enterprise)" info={result.enterprise} />
        </div>

        {result.sources && result.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-dark-border">
                <h3 className="text-lg font-semibold text-medium-text mb-4">참고 출처</h3>
                <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                        <li key={index}>
                            <a 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-brand-primary/80 hover:text-brand-primary hover:underline transition-colors duration-200"
                            >
                                <LinkIcon />
                                <span className="truncate">{source.title || source.uri}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};