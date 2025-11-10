import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ErrorDisplay } from './components/ErrorDisplay';
import { checkSoftwareLicense } from './services/geminiService';
import type { LicenseResult } from './types';

const App: React.FC = () => {
  const [softwareName, setSoftwareName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LicenseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = useCallback(async () => {
    if (!softwareName.trim()) {
      setError('라이선스를 확인할 소프트웨어 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const licenseResult = await checkSoftwareLicense(softwareName);
      setResult(licenseResult);
    } catch (err) {
      console.error(err);
      setError('라이선스 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [softwareName]);
  
  return (
    <div className="min-h-screen bg-dark-bg text-light-text font-sans antialiased">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Header />

        <main className="mt-8 md:mt-12">
          <div className="max-w-3xl mx-auto">
            <InputForm
              softwareName={softwareName}
              setSoftwareName={setSoftwareName}
              onCheck={handleCheck}
              isLoading={isLoading}
            />

            <div className="mt-8">
              {error && <ErrorDisplay message={error} />}
              {result && <ResultDisplay result={result} />}
              {!isLoading && !result && !error && <WelcomeMessage />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;