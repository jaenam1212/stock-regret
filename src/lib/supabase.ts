import { createClient } from '@supabase/supabase-js';
import { getSupabaseAnonKey, getSupabaseUrl } from './env';

// 환경변수 설정 사용 (빌드 시 기본값 제공)
const supabaseUrl = getSupabaseUrl() || 'https://example.localhost';
const supabaseAnonKey = getSupabaseAnonKey() || 'placeholder-key';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
