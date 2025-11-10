import React from 'react';

const RationaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const RationaleDisplay: React.FC = () => {
    return (
        <footer className="mt-12 bg-dark-card border border-dark-border rounded-lg p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <RationaleIcon />
                <h2 className="text-xl font-bold text-light-text">구현 판단 기준 (Implementation Rationale)</h2>
            </div>
            <div className="space-y-4 text-medium-text text-sm">
                <p>
                    시니어 프론트엔드 엔지니어로서, 저는 웹 플랫폼의 제약 내에서 안전하고 사용자 친화적이며 유지보수가 용이한 기능을 제공하는 것을 최우선으로 생각합니다. 이 애플리케이션의 핵심 기능들은 다음 기준에 따라 구현되었습니다.
                </p>
                <ul className="list-disc list-inside space-y-3 pl-2">
                    <li>
                        <strong className="text-light-text/90">보안 및 플랫폼 규정 준수:</strong> 웹 브라우저는 보안을 위해 사용자의 컴퓨터에 직접 파일을 생성하거나 디렉토리를 만드는 행위를 엄격히 제한합니다. '기록 자동 저장' 기능은 이러한 보안 모델을 준수하기 위해 브라우저 표준 기술인 <code className="bg-gray-700/50 text-xs px-1 py-0.5 rounded">localStorage</code>를 사용하여 구현되었습니다. 이는 안전하게 사용자 데이터를 브라우저 내에 저장하는 검증된 방식입니다.
                    </li>
                    <li>
                        <strong className="text-light-text/90">상태 관리 (State Management):</strong> 애플리케이션의 핵심 데이터(검사 기록, 자동 저장 설정 등)는 React의 상태 관리 훅(<code className="bg-gray-700/50 text-xs px-1 py-0.5 rounded">useState</code>)을 사용하여 최상위 <code className="bg-gray-700/50 text-xs px-1 py-0.5 rounded">App</code> 컴포넌트에서 중앙 관리됩니다. 이를 통해 데이터의 흐름을 예측 가능하게 만들고, 앱 전체의 일관성을 유지합니다.
                    </li>
                    <li>
                        <strong className="text-light-text/90">데이터 영속성 (Persistence):</strong> 사용자가 설정한 '자동 저장' 옵션이 앱을 껐다 켜도 유지되도록 <code className="bg-gray-700/50 text-xs px-1 py-0.5 rounded">useEffect</code> 훅을 사용해 상태를 <code className="bg-gray-700/50 text-xs px-1 py-0.5 rounded">localStorage</code>와 동기화했습니다. 이를 통해 매번 설정을 다시 할 필요 없는 편리한 사용자 경험을 제공합니다.
                    </li>
                    <li>
                        <strong className="text-light-text/90">컴포넌트 재사용성:</strong> UI의 각 부분(헤더, 입력 폼, 토글 스위치 등)은 독립적인 컴포넌트로 분리하여 개발되었습니다. 예를 들어 <code className="bg-gray-700/50 text-xs px-1 py-0.5 rounded">ToggleSwitch</code> 컴포넌트는 재사용이 가능하도록 설계되어 코드 중복을 줄이고 유지보수성을 높였습니다.
                    </li>
                    <li>
                        <strong className="text-light-text/90">명확한 사용자 피드백:</strong> 로딩 상태, 오류 발생, 자동 저장 비활성화 등 각 상황에 맞는 명확한 시각적 피드백을 제공하여 사용자가 현재 앱의 상태를 쉽게 파악하고 다음 행동을 결정할 수 있도록 돕습니다.
                    </li>
                </ul>
            </div>
        </footer>
    );
};
