export type LicenseType = '상용' | '쉐어웨어' | '프리웨어' | '확인 불가';

export interface LicenseInfo {
  type: LicenseType;
  reasoning: string;
}

export interface Source {
    uri: string;
    title: string;
}

export interface LicenseResult {
  personal: LicenseInfo;
  enterprise: LicenseInfo;
  sources: Source[];
}

export interface HistoryItem {
  id: number;
  softwareName: string;
  result: LicenseResult;
}

export interface BulkResultItem {
  id: number;
  softwareName: string;
  result: LicenseResult | null;
  status: 'pending' | 'loading' | 'success' | 'error';
  error?: string;
}
