import React from 'react';
import type { BulkResultItem } from '../types';
import { Spinner } from './Spinner';
import { LicenseBadge } from './LicenseBadge';

interface BulkCheckViewProps {
    bulkInput: string;
    onBulkInputChange: (value: string) => void;
    onBulkCheck: () => void;
    isBulkLoading: boolean;
    bulkResults: BulkResultItem[];
}

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ErrorIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const BulkCheckView: React.FC<BulkCheckViewProps> = ({ bulkInput, onBulkInputChange, onBulkCheck, isBulkLoading, bulkResults }) => {

    const progress = bulkResults.filter(r => r.status === 'success' || r.status === 'error').length;
    const total = bulkResults.length;

    const escapeCSV = (field: any): string => {
        if (field === null || field === undefined) return '""';
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const handleExport = () => {
        const successfulResults = bulkResults.filter(item => item.status === 'success' && item.result);
        if (successfulResults.length === 0) return;

        const headers = ['소프트웨어 이름', '개인용 라이선스', '개인용 근거', '기업용 라이선스', '기업용 근거', '출처'];
        const rows = successfulResults.map(item => [
            escapeCSV(item.softwareName),
            escapeCSV(item.result!.personal.type),
            escapeCSV(item.result!.personal.reasoning),
            escapeCSV(item.result!.enterprise.type),
            escapeCSV(item.result!.enterprise.reasoning),
            escapeCSV(item.result!.sources.map(s => s.uri).join(' , '))
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `bulk_license_check_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <label htmlFor="bulkSoftwareNames" className="block text-sm font-medium text-medium-text mb-2">
                    소프트웨어 이름 목록 (한 줄에 하나씩)
                </label>
                <textarea
                    id="bulkSoftwareNames"
                    rows={8}
                    className="w-full bg-gray-800/50 border border-dark-border rounded-lg p-4 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 placeholder-gray-500"
                    placeholder="Adobe Photoshop&#10;7-Zip&#10;Visual Studio Code"
                    value={bulkInput}
                    onChange={(e) => onBulkInputChange(e.target.value)}
                    disabled={isBulkLoading}
                />
                <button
                    onClick={onBulkCheck}
                    disabled={isBulkLoading || !bulkInput.trim()}
                    className="mt-4 w-full flex justify-center items-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isBulkLoading ? (
                        <>
                            <Spinner />
                            <span className="ml-2">
                                {total > 0 ? `(${progress}/${total}) 검사 중...` : '검사 시작 중...'}
                            </span>
                        </>
                    ) : (
                        '일괄 검사 시작'
                    )}
                </button>
            </div>

            {bulkResults.length > 0 && (
                <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-light-text">검사 결과</h3>
                        <button
                            onClick={handleExport}
                            disabled={isBulkLoading || bulkResults.filter(r => r.status === 'success').length === 0}
                            className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-light-text font-semibold py-2 px-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            title="성공한 검사 결과를 CSV 파일로 내보냅니다"
                        >
                            <DownloadIcon />
                            <span>CSV로 내보내기</span>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-medium-text">
                            <thead className="text-xs text-light-text uppercase bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">S/W 이름</th>
                                    <th scope="col" className="px-6 py-3">개인용</th>
                                    <th scope="col" className="px-6 py-3">기업용</th>
                                    <th scope="col" className="px-6 py-3 text-center">상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bulkResults.map((item) => (
                                    <tr key={item.id} className="border-b border-dark-border hover:bg-gray-800/30">
                                        <th scope="row" className="px-6 py-4 font-medium text-light-text whitespace-nowrap">{item.softwareName}</th>
                                        <td className="px-6 py-4">{item.result ? <LicenseBadge type={item.result.personal.type} /> : '-'}</td>
                                        <td className="px-6 py-4">{item.result ? <LicenseBadge type={item.result.enterprise.type} /> : '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                {item.status === 'loading' && <Spinner />}
                                                {item.status === 'success' && <SuccessIcon />}
                                                {item.status === 'error' && <ErrorIcon />}
                                                {item.status === 'pending' && <span className="text-xs">대기 중</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
