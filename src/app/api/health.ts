import { getApiBaseUrl } from '@/app/lib/utils';
import apiClient from './client';

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
}

// 백엔드 헬스체크
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const apiBase = getApiBaseUrl();
    if (!apiBase) {
      // 로컬 Next API 라우트 사용 중
      return true;
    }

    const response = await apiClient.get(`${apiBase.replace(/\/$/, '')}/`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// 백엔드 헬스체크 (상세 정보)
export const getBackendHealth =
  async (): Promise<HealthCheckResponse | null> => {
    try {
      const apiBase = getApiBaseUrl();
      if (!apiBase) {
        return null;
      }

      const response = await apiClient.get(
        `${apiBase.replace(/\/$/, '')}/health`,
        {
          timeout: 5000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return null;
    }
  };
