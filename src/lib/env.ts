// 환경변수 검증 및 관리

export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  NEXT_PUBLIC_API_URL?: string;
}

class EnvValidator {
  private static instance: EnvValidator;
  private config: EnvConfig;

  private constructor() {
    this.config = this.validateEnv();
  }

  public static getInstance(): EnvValidator {
    if (!EnvValidator.instance) {
      EnvValidator.instance = new EnvValidator();
    }
    return EnvValidator.instance;
  }

  private validateEnv(): EnvConfig {
    const errors: string[] = [];

    // 필수 환경변수 검증
    const requiredEnvs = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };

    Object.entries(requiredEnvs).forEach(([key, value]) => {
      if (!value) {
        errors.push(`${key} 환경변수가 설정되지 않았습니다.`);
      }
    });

    // URL 형식 검증
    if (requiredEnvs.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        new URL(requiredEnvs.NEXT_PUBLIC_SUPABASE_URL);
      } catch {
        errors.push('NEXT_PUBLIC_SUPABASE_URL이 올바른 URL 형식이 아닙니다.');
      }
    }

    // API URL 검증 (선택사항)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      try {
        new URL(apiUrl);
      } catch {
        errors.push('NEXT_PUBLIC_API_URL이 올바른 URL 형식이 아닙니다.');
      }
    }

    if (errors.length > 0) {
      const errorMessage = `환경변수 검증 실패:\n${errors.join('\n')}`;
      
      // 개발 환경에서는 상세 에러 출력
      if (process.env.NODE_ENV === 'development') {
        console.error(errorMessage);
        console.error('\n.env.local 파일을 확인하고 다음 환경변수들을 설정해주세요:');
        console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
        console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
        console.error('NEXT_PUBLIC_API_URL=your_api_url (선택사항)');
      }
      
      throw new Error(errorMessage);
    }

    return {
      NEXT_PUBLIC_SUPABASE_URL: requiredEnvs.NEXT_PUBLIC_SUPABASE_URL!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: requiredEnvs.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      NEXT_PUBLIC_API_URL: apiUrl,
    };
  }

  public getConfig(): EnvConfig {
    return this.config;
  }

  public getSupabaseUrl(): string {
    return this.config.NEXT_PUBLIC_SUPABASE_URL;
  }

  public getSupabaseAnonKey(): string {
    return this.config.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  public getApiUrl(): string | undefined {
    return this.config.NEXT_PUBLIC_API_URL;
  }
}

// 싱글톤 인스턴스 내보내기
export const envValidator = EnvValidator.getInstance();
export const envConfig = envValidator.getConfig();