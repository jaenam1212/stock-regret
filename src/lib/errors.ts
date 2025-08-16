// 에러 처리 표준화

export interface ApiError {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
}

export class StockRegretError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: string;

  constructor(code: string, message: string, statusCode: number = 500, details?: string) {
    super(message);
    this.name = 'StockRegretError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Error 클래스 상속 시 필요
    Object.setPrototypeOf(this, StockRegretError.prototype);
  }

  public toApiError(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

// 표준 에러 코드 정의
export const ERROR_CODES = {
  // 인증 관련
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_ALREADY_EXISTS: 'AUTH_EMAIL_ALREADY_EXISTS',
  AUTH_WEAK_PASSWORD: 'AUTH_WEAK_PASSWORD',
  AUTH_INVALID_EMAIL: 'AUTH_INVALID_EMAIL',
  AUTH_SESSION_EXPIRED: 'AUTH_SESSION_EXPIRED',

  // 데이터 관련
  DATA_NOT_FOUND: 'DATA_NOT_FOUND',
  DATA_INVALID_SYMBOL: 'DATA_INVALID_SYMBOL',
  DATA_INVALID_DATE: 'DATA_INVALID_DATE',
  DATA_INVALID_AMOUNT: 'DATA_INVALID_AMOUNT',

  // API 관련
  API_EXTERNAL_SERVICE_ERROR: 'API_EXTERNAL_SERVICE_ERROR',
  API_RATE_LIMIT_EXCEEDED: 'API_RATE_LIMIT_EXCEEDED',
  API_INVALID_REQUEST: 'API_INVALID_REQUEST',

  // 환경 설정 관련
  ENV_MISSING_VARIABLE: 'ENV_MISSING_VARIABLE',
  ENV_INVALID_CONFIGURATION: 'ENV_INVALID_CONFIGURATION',

  // 일반적인 에러
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: '이메일 또는 비밀번호가 올바르지 않습니다.',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: '사용자를 찾을 수 없습니다.',
  [ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS]: '이미 존재하는 이메일입니다.',
  [ERROR_CODES.AUTH_WEAK_PASSWORD]: '비밀번호가 너무 약합니다.',
  [ERROR_CODES.AUTH_INVALID_EMAIL]: '올바르지 않은 이메일 형식입니다.',
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: '세션이 만료되었습니다. 다시 로그인해주세요.',

  [ERROR_CODES.DATA_NOT_FOUND]: '요청한 데이터를 찾을 수 없습니다.',
  [ERROR_CODES.DATA_INVALID_SYMBOL]: '올바르지 않은 종목 심볼입니다.',
  [ERROR_CODES.DATA_INVALID_DATE]: '올바르지 않은 날짜입니다.',
  [ERROR_CODES.DATA_INVALID_AMOUNT]: '올바르지 않은 투자 금액입니다.',

  [ERROR_CODES.API_EXTERNAL_SERVICE_ERROR]: '외부 서비스에서 오류가 발생했습니다.',
  [ERROR_CODES.API_RATE_LIMIT_EXCEEDED]: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
  [ERROR_CODES.API_INVALID_REQUEST]: '잘못된 요청입니다.',

  [ERROR_CODES.ENV_MISSING_VARIABLE]: '필수 환경변수가 설정되지 않았습니다.',
  [ERROR_CODES.ENV_INVALID_CONFIGURATION]: '환경 설정이 올바르지 않습니다.',

  [ERROR_CODES.UNKNOWN_ERROR]: '알 수 없는 오류가 발생했습니다.',
  [ERROR_CODES.VALIDATION_ERROR]: '입력값이 올바르지 않습니다.',
  [ERROR_CODES.NETWORK_ERROR]: '네트워크 오류가 발생했습니다.',
};

/**
 * 에러 코드로부터 표준 에러 생성
 */
export function createError(
  code: keyof typeof ERROR_CODES,
  details?: string,
  statusCode?: number
): StockRegretError {
  const message = ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
  return new StockRegretError(code, message, statusCode, details);
}

/**
 * Supabase 에러를 표준 에러로 변환
 */
export function handleSupabaseError(error: unknown): StockRegretError {
  if (!error) {
    return createError(ERROR_CODES.UNKNOWN_ERROR);
  }

  // Supabase 에러 코드 매핑
  const errorMessage = typeof error === 'object' && error !== null && 'message' in error 
    ? (error as { message: string }).message 
    : String(error);
    
  switch (errorMessage) {
    case 'Invalid login credentials':
      return createError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, errorMessage, 401);
    
    case 'User already registered':
      return createError(ERROR_CODES.AUTH_EMAIL_ALREADY_EXISTS, errorMessage, 409);
    
    case 'Password should be at least 6 characters':
      return createError(ERROR_CODES.AUTH_WEAK_PASSWORD, errorMessage, 400);
    
    case 'Unable to validate email address: invalid format':
      return createError(ERROR_CODES.AUTH_INVALID_EMAIL, errorMessage, 400);
    
    default:
      if (errorMessage.includes('JWT')) {
        return createError(ERROR_CODES.AUTH_SESSION_EXPIRED, errorMessage, 401);
      }
      
      const status = typeof error === 'object' && error !== null && 'status' in error 
        ? (error as { status: number }).status 
        : 500;
      
      return createError(
        ERROR_CODES.UNKNOWN_ERROR,
        errorMessage,
        status
      );
  }
}

/**
 * Fetch API 에러를 표준 에러로 변환
 */
export function handleFetchError(error: unknown, url?: string): StockRegretError {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return createError(
      ERROR_CODES.NETWORK_ERROR,
      `네트워크 연결을 확인해주세요. ${url ? `URL: ${url}` : ''}`,
      0
    );
  }

  if (error instanceof Error && error.name === 'AbortError') {
    return createError(
      ERROR_CODES.API_EXTERNAL_SERVICE_ERROR,
      '요청이 시간 초과되었습니다.',
      408
    );
  }

  const message = error instanceof Error ? error.message : '외부 API 호출 중 오류가 발생했습니다.';
  return createError(
    ERROR_CODES.API_EXTERNAL_SERVICE_ERROR,
    message,
    500
  );
}

/**
 * 개발/프로덕션 환경에 맞는 에러 로깅
 */
export function logError(error: Error | StockRegretError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 Error${context ? ` in ${context}` : ''}`);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    if (error instanceof StockRegretError) {
      console.error('Code:', error.code);
      console.error('Status:', error.statusCode);
      console.error('Details:', error.details);
    }
    
    console.groupEnd();
  } else {
    // 프로덕션 환경에서는 최소한의 정보만 로깅
    console.error(`Error${context ? ` in ${context}` : ''}: ${error.message}`);
  }
}

/**
 * 안전한 에러 응답 생성 (민감한 정보 제거)
 */
export function createSafeErrorResponse(error: Error | StockRegretError): ApiError {
  if (error instanceof StockRegretError) {
    return error.toApiError();
  }

  // 일반 Error의 경우 민감한 정보 숨김
  if (process.env.NODE_ENV === 'development') {
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message,
      statusCode: 500,
    };
  }

  // 프로덕션에서는 일반적인 메시지만 반환
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: '서버 오류가 발생했습니다.',
    statusCode: 500,
  };
}