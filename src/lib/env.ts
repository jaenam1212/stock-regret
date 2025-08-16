// 환경변수 관리

export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_API_URL?: string;
}

// 단순한 환경변수 getter 함수들
export const getSupabaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
};

export const getSupabaseAnonKey = (): string => {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
};

export const getApiUrl = (): string | undefined => {
  return process.env.NEXT_PUBLIC_API_URL;
};

export const getEnvConfig = (): EnvConfig => {
  return {
    NEXT_PUBLIC_SUPABASE_URL: getSupabaseUrl(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: getSupabaseAnonKey(),
    NEXT_PUBLIC_API_URL: getApiUrl(),
  };
};

// 기존 호환성을 위한 export
export const envConfig = getEnvConfig();
