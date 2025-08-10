import { createClient } from '@supabase/supabase-js';

// 환경변수가 제대로 설정되어 있는지 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경변수가 없으면 경고 출력
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 환경변수가 설정되지 않았습니다.');
  console.warn(
    'NEXT_PUBLIC_SUPABASE_URL:',
    supabaseUrl ? '설정됨' : '설정되지 않음'
  );
  console.warn(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY:',
    supabaseAnonKey ? '설정됨' : '설정되지 않음'
  );
}

// 환경변수가 없으면 null 반환
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// 데이터베이스 타입 정의
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CalculationHistory {
  id: string;
  user_id: string;
  symbol: string;
  invest_date: string;
  invest_amount: number;
  past_price: number;
  current_price: number;
  shares: number;
  current_value: number;
  profit: number;
  profit_percent: number;
  yearly_return: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  symbol?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
