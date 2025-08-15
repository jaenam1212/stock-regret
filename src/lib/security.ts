// 보안 관련 유틸리티

/**
 * JWT 토큰 유효성 검증
 */
export function isTokenExpired(token: string): boolean {
  try {
    // JWT는 base64url로 인코딩된 3부분으로 구성됨
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }

    // payload 부분 디코딩
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    if (!payload.exp) {
      return true;
    }

    // 현재 시간과 비교 (5분 여유 시간 추가)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < (currentTime + 300);
  } catch {
    return true;
  }
}

/**
 * 세션 자동 갱신 필요 여부 확인
 */
export function shouldRefreshToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    if (!payload.exp) {
      return false;
    }

    // 만료 30분 전에 갱신
    const currentTime = Math.floor(Date.now() / 1000);
    const refreshThreshold = payload.exp - 1800; // 30분 = 1800초
    
    return currentTime > refreshThreshold;
  } catch {
    return false;
  }
}

/**
 * 비밀번호 강도 점수 계산 (0-100)
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length < 8) {
    feedback.push('최소 8자 이상이어야 합니다');
  } else if (password.length >= 12) {
    score += 25;
  } else {
    score += 15;
  }

  // 소문자 확인
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('소문자를 포함해주세요');
  }

  // 대문자 확인
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('대문자를 포함해주세요');
  }

  // 숫자 확인
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push('숫자를 포함해주세요');
  }

  // 특수문자 확인
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 15;
  } else {
    feedback.push('특수문자를 포함해주세요');
  }

  // 반복 문자 확인
  if (!/(.)\1{2,}/.test(password)) {
    score += 10;
  } else {
    feedback.push('같은 문자를 3번 이상 반복하지 마세요');
  }

  // 일반적인 패턴 확인
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /letmein/i,
  ];

  if (!commonPatterns.some(pattern => pattern.test(password))) {
    score += 5;
  } else {
    feedback.push('일반적인 패턴은 사용하지 마세요');
    score -= 20;
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    feedback: feedback.slice(0, 3), // 최대 3개의 피드백만 표시
  };
}

/**
 * CSRF 토큰 생성
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * 안전한 랜덤 문자열 생성
 */
export function generateSecureRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

/**
 * Rate Limiting을 위한 간단한 메모리 기반 카운터
 */
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > record.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  public getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - record.count);
  }

  public getResetTime(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return 0;
    }
    return record.resetTime;
  }

  // 정기적으로 만료된 레코드 정리
  public cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// 글로벌 Rate Limiter 인스턴스들
export const authRateLimiter = new RateLimiter(5, 300000); // 5회/5분
export const apiRateLimiter = new RateLimiter(100, 60000); // 100회/1분

/**
 * 클라이언트 IP 주소 추출 (프록시 환경 고려)
 */
export function getClientIP(request: Request): string {
  // Next.js 환경에서 클라이언트 IP 추출
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (clientIP) {
    return clientIP;
  }

  // 폴백
  return 'unknown';
}

/**
 * 보안 헤더 설정
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // XSS 보호
    'X-XSS-Protection': '1; mode=block',
    
    // 콘텐츠 타입 스니핑 방지
    'X-Content-Type-Options': 'nosniff',
    
    // 클릭재킹 방지
    'X-Frame-Options': 'DENY',
    
    // HTTPS 강제 (프로덕션에서만)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    }),
    
    // Referrer 정책
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // 권한 정책
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
}

/**
 * Content Security Policy 헤더 생성
 */
export function generateCSPHeader(nonce?: string): string {
  const policies = [
    "default-src 'self'",
    `script-src 'self' ${nonce ? `'nonce-${nonce}'` : "'unsafe-inline'"} 'unsafe-eval'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://api.coingecko.com https://query1.finance.yahoo.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];

  return policies.join('; ');
}

// Rate limiter 정리를 위한 주기적 실행 (5분마다)
if (typeof window === 'undefined') { // 서버 사이드에서만 실행
  setInterval(() => {
    authRateLimiter.cleanup();
    apiRateLimiter.cleanup();
  }, 300000);
}