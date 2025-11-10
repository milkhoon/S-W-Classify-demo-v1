import React from 'react';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const WelcomeMessage: React.FC = () => {
    return (
        <div className="text-center p-8 bg-dark-card border border-dashed border-dark-border rounded-lg">
            <div className="flex justify-center items-center mb-4">
                <InfoIcon />
            </div>
            <h2 className="text-xl font-semibold text-light-text">라이선스 검사 결과를 기다리고 있습니다</h2>
            <p className="mt-2 text-medium-text">
                위 입력란에 소프트웨어 이름을 입력하고 '검사하기' 버튼을 누르면 AI가 분석한 라이선스 정보가 여기에 표시됩니다.
            </p>
        </div>
    );
};