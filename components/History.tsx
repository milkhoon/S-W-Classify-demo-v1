import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryProps {
    history: HistoryItem[];
    onItemClick: (item: HistoryItem) => void;
    selectedSoftwareName: string | null;
}

const HistoryIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export const History: React.FC<HistoryProps> = ({ history, onItemClick, selectedSoftwareName }) => {
    
    const escapeCSV = (field: string | undefined): string => {
        if (field === null || field === undefined) {
            return '""';
        }
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const handleExport = () => {
        if (history.length === 0) return;

        const headers = ['소프트웨어 이름', '개인용 라이선스', '개인용 근거', '기업용 라이선스', '기업용 근거', '출처'];
        const rows = history.map(item => [
            escapeCSV(item.softwareName),
            escapeCSV(item.result.personal.type),
            escapeCSV(item.result.personal.reasoning),
            escapeCSV(item.result.enterprise.type),
            escapeCSV(item.result.enterprise.reasoning),
            escapeCSV(item.result.sources.map(s => s.uri).join(' , '))
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `software_license_history_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <aside className="bg-dark-card border border-dark-border rounded-lg p-6 h-full sticky top-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <HistoryIcon />
                    <h2 className="text-xl font-bold text-light-text">검사 기록</h2>
                </div>
                <button
                    onClick={handleExport}
                    disabled={history.length === 0}
                    className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-light-text font-semibold py-2 px-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    title="검사 기록을 CSV 파일로 내보냅니다"
                >
                    <DownloadIcon />
                    <span>내보내기</span>
                </button>
            </div>
            
            {history.length > 0 ? (
                <ul className="space-y-2 mt-4 overflow-y-auto max-h-[60vh] pr-2 -mr-2">
                    {history.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => onItemClick(item)}
                                className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${
                                    selectedSoftwareName && selectedSoftwareName.toLowerCase() === item.softwareName.toLowerCase()
                                        ? 'bg-brand-primary/20 text-brand-primary font-semibold'
                                        : 'hover:bg-gray-700/50 text-medium-text hover:text-light-text'
                                }`}
                            >
                                <span className="truncate block">{item.softwareName}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-medium-text mt-12">
                    <p>검사 기록이 없습니다.</p>
                    <p className="text-sm mt-1">소프트웨어를 검사하면 여기에 기록이 남습니다.</p>
                </div>
            )}
        </aside>
    );
};
