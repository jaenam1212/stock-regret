// 입력 검증 및 살균화 유틸리티

/**
 * 이메일 주소 유효성 검증
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: '이메일은 필수 입력 항목입니다.' };
  }

  // 기본 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '올바른 이메일 형식을 입력해주세요.' };
  }

  // 길이 제한 (320자는 RFC 5321 표준)
  if (email.length > 320) {
    return { isValid: false, error: '이메일이 너무 깁니다.' };
  }

  return { isValid: true };
}

/**
 * 비밀번호 강도 검증
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: '비밀번호는 필수 입력 항목입니다.' };
  }

  // 최소 8자
  if (password.length < 8) {
    return { isValid: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }

  // 최대 128자 (보안상 제한)
  if (password.length > 128) {
    return { isValid: false, error: '비밀번호는 최대 128자까지 가능합니다.' };
  }

  // 영문, 숫자, 특수문자 포함 검증
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strengthCount < 3) {
    return { 
      isValid: false, 
      error: '비밀번호는 영문 대소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.' 
    };
  }

  return { isValid: true };
}

/**
 * 주식 심볼 검증
 */
export function validateStockSymbol(symbol: string): { isValid: boolean; error?: string } {
  if (!symbol) {
    return { isValid: false, error: '종목 심볼은 필수 입력 항목입니다.' };
  }

  // 공백 제거 후 길이 검증
  const trimmedSymbol = symbol.trim();
  if (trimmedSymbol.length === 0) {
    return { isValid: false, error: '종목 심볼을 입력해주세요.' };
  }

  // 길이 제한 (일반적으로 주식 심볼은 1-10자)
  if (trimmedSymbol.length > 20) {
    return { isValid: false, error: '종목 심볼이 너무 깁니다.' };
  }

  // 한국 주식 코드 (6자리 숫자) 또는 영문 심볼 검증
  const koreanStockPattern = /^\d{6}$/;
  const symbolPattern = /^[A-Za-z0-9.-]+$/;

  if (!koreanStockPattern.test(trimmedSymbol) && !symbolPattern.test(trimmedSymbol)) {
    return { 
      isValid: false, 
      error: '올바른 종목 심볼을 입력해주세요 (예: AAPL, 005930).' 
    };
  }

  return { isValid: true };
}

/**
 * 투자 금액 검증
 */
export function validateInvestAmount(amount: number): { isValid: boolean; error?: string } {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { isValid: false, error: '올바른 투자 금액을 입력해주세요.' };
  }

  // 최소 투자 금액 (1원)
  if (amount < 1) {
    return { isValid: false, error: '투자 금액은 1원 이상이어야 합니다.' };
  }

  // 최대 투자 금액 (100억원, 현실적인 제한)
  if (amount > 10_000_000_000) {
    return { isValid: false, error: '투자 금액은 100억원 이하로 입력해주세요.' };
  }

  return { isValid: true };
}

/**
 * 날짜 검증
 */
export function validateDate(dateString: string): { isValid: boolean; error?: string } {
  if (!dateString) {
    return { isValid: false, error: '날짜는 필수 입력 항목입니다.' };
  }

  const date = new Date(dateString);
  
  // 유효한 날짜인지 검증
  if (isNaN(date.getTime())) {
    return { isValid: false, error: '올바른 날짜 형식을 입력해주세요.' };
  }

  // 과거 100년 이후 날짜만 허용
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  
  if (date < minDate) {
    return { isValid: false, error: '너무 오래된 날짜입니다.' };
  }

  // 미래 날짜 제한
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 1); // 내일까지만 허용
  
  if (date > maxDate) {
    return { isValid: false, error: '미래 날짜는 선택할 수 없습니다.' };
  }

  return { isValid: true };
}

/**
 * HTML 태그 제거 (XSS 방지)
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim();
}

/**
 * SQL 인젝션 위험 문자 검증
 */
export function validateSafeString(input: string): { isValid: boolean; error?: string } {
  if (!input) return { isValid: true };

  // SQL 인젝션 위험 패턴 검출
  const dangerousPatterns = [
    /['";]/g,           // 따옴표
    /(--)|(\/\*)|(\*\/)/g, // SQL 주석
    /(union|select|insert|update|delete|drop|exec|execute)/gi, // SQL 키워드
    /<script[^>]*>.*?<\/script>/gi, // 스크립트 태그
    /javascript:/gi,    // 자바스크립트 프로토콜
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: '허용되지 않는 문자가 포함되어 있습니다.' };
    }
  }

  return { isValid: true };
}

/**
 * 종합 입력 검증 헬퍼
 */
export function validateUserInput(data: {
  email?: string;
  password?: string;
  symbol?: string;
  amount?: number;
  date?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (data.email !== undefined) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
  }

  if (data.password !== undefined) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error!;
    }
  }

  if (data.symbol !== undefined) {
    const symbolValidation = validateStockSymbol(data.symbol);
    if (!symbolValidation.isValid) {
      errors.symbol = symbolValidation.error!;
    }
  }

  if (data.amount !== undefined) {
    const amountValidation = validateInvestAmount(data.amount);
    if (!amountValidation.isValid) {
      errors.amount = amountValidation.error!;
    }
  }

  if (data.date !== undefined) {
    const dateValidation = validateDate(data.date);
    if (!dateValidation.isValid) {
      errors.date = dateValidation.error!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}