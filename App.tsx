import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ErrorDisplay } from './components/ErrorDisplay';
import { History } from './components/History';
import { Tabs } from './components/Tabs';
import { BulkCheckView } from './components/BulkCheckView';
import { RationaleDisplay } from './components/RationaleDisplay';
import { checkSoftwareLicense } from './services/geminiService';
import type { LicenseResult, HistoryItem, BulkResultItem } from './types';

const App: React.FC = () => {
  // Common state
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // View state
  const [activeView, setActiveView] = useState<'single' | 'bulk'>('single');

  // Single check state
  const [softwareName, setSoftwareName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LicenseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSoftwareName, setSelectedSoftwareName] = useState<string | null>(null);

  // Bulk check state
  const [bulkInput, setBulkInput] = useState<string>('');
  const [bulkResults, setBulkResults] = useState<BulkResultItem[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState<boolean>(false);

  // Settings state
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('autoSaveEnabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });


  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('licenseCheckerHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse history from localStorage", error);
      localStorage.removeItem('licenseCheckerHistory');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('licenseCheckerHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('autoSaveEnabled', JSON.stringify(isAutoSaveEnabled));
    } catch (error) {
      console.error("Failed to save auto-save setting to localStorage", error);
    }
  }, [isAutoSaveEnabled]);


  const handleCheck = useCallback(async () => {
    if (!softwareName.trim()) {
      setError('라이선스를 확인할 소프트웨어 이름을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setSelectedSoftwareName(softwareName.trim());


    try {
      const licenseResult = await checkSoftwareLicense(softwareName);
      setResult(licenseResult);
      
      if (isAutoSaveEnabled) {
        const newHistoryItem: HistoryItem = {
          id: Date.now(),
          softwareName: softwareName.trim(),
          result: licenseResult,
        };

        setHistory(prevHistory => [
          newHistoryItem,
          ...prevHistory.filter(item => item.softwareName.toLowerCase() !== softwareName.trim().toLowerCase())
        ]);
      }

    } catch (err) {
      console.error(err);
      setError('라이선스 확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setSelectedSoftwareName(null);
    } finally {
      setIsLoading(false);
    }
  }, [softwareName, isAutoSaveEnabled]);
  
  const handleSoftwareNameChange = (name: string) => {
    setSoftwareName(name);
    if (selectedSoftwareName) {
      setSelectedSoftwareName(null);
      setResult(null);
    }
  };

  const handleHistoryClick = useCallback((item: HistoryItem) => {
    setResult(item.result);
    setSoftwareName(item.softwareName);
    setSelectedSoftwareName(item.softwareName);
    setError(null);
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBulkCheck = useCallback(async () => {
    const names = bulkInput.trim().split('\n').map(name => name.trim()).filter(Boolean);
    if (names.length === 0) {
      return;
    }

    setIsBulkLoading(true);
    const initialResults: BulkResultItem[] = names.map((name, index) => ({
      id: Date.now() + index,
      softwareName: name,
      result: null,
      status: 'pending'
    }));
    setBulkResults(initialResults);

    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      setBulkResults(prev => prev.map(item => item.id === initialResults[i].id ? { ...item, status: 'loading' } : item));

      try {
        const licenseResult = await checkSoftwareLicense(name);
        
        setBulkResults(prev => prev.map(item =>
          item.id === initialResults[i].id ? { ...item, status: 'success', result: licenseResult } : item
        ));
        
        if (isAutoSaveEnabled) {
          const newHistoryItem: HistoryItem = {
            id: Date.now() + i,
            softwareName: name,
            result: licenseResult,
          };
          setHistory(prevHistory => [
            newHistoryItem,
            ...prevHistory.filter(hItem => hItem.softwareName.toLowerCase() !== name.toLowerCase())
          ]);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setBulkResults(prev => prev.map(item =>
          item.id === initialResults[i].id ? { ...item, status: 'error', error: errorMessage } : item
        ));
      }
    }

    setIsBulkLoading(false);
  }, [bulkInput, isAutoSaveEnabled]);

  return (
    <div className="min-h-screen bg-dark-bg text-light-text font-sans antialiased">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <Tabs activeView={activeView} onViewChange={setActiveView} />

        {activeView === 'single' ? (
          <main className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <InputForm
                softwareName={softwareName}
                onNameChange={handleSoftwareNameChange}
                onCheck={handleCheck}
                isLoading={isLoading}
              />

              <div className="mt-8">
                {error && <ErrorDisplay message={error} />}
                {result && <ResultDisplay result={result} />}
                {!isLoading && !result && !error && <WelcomeMessage />}
              </div>
            </div>
            <div className="lg:col-span-1">
               <History 
                  history={history}
                  onItemClick={handleHistoryClick}
                  selectedSoftwareName={selectedSoftwareName}
                  isAutoSaveEnabled={isAutoSaveEnabled}
                  onAutoSaveChange={setIsAutoSaveEnabled}
                />
            </div>
          </main>
        ) : (
          <main className="mt-8 md:mt-12">
            <BulkCheckView 
              bulkInput={bulkInput}
              onBulkInputChange={setBulkInput}
              onBulkCheck={handleBulkCheck}
              isBulkLoading={isBulkLoading}
              bulkResults={bulkResults}
            />
          </main>
        )}

        <RationaleDisplay />
      </div>
    </div>
  );
};

export default App;
