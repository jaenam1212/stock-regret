import axios from 'axios';

// 서버 사이드에서 사용할 baseURL 설정
const getBaseURL = () => {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 환경변수나 기본값 사용
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }
  // 클라이언트 사이드에서는 현재 도메인 사용
  return '';
};

// 기본 axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (로깅, 토큰 등)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리, 로깅 등)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      'API Response Error:',
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default apiClient;
