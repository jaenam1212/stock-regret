'use client';

import { supabase } from '@/lib/supabase';
import { isTokenExpired, shouldRefreshToken } from '@/lib/security';
import { handleSupabaseError, logError } from '@/lib/errors';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // 토큰 갱신 함수
  const refreshTokenIfNeeded = useCallback(async () => {
    if (!session?.access_token) return;

    if (shouldRefreshToken(session.access_token)) {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          logError(handleSupabaseError(error), 'Token refresh');
          // 갱신 실패 시 로그아웃
          await supabase.auth.signOut();
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (err) {
        logError(err as Error, 'Token refresh');
      }
    }
  }, [session]);

  // 자동 로그아웃 체크
  const checkSessionValidity = useCallback(async () => {
    if (!session?.access_token) return;

    if (isTokenExpired(session.access_token)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('세션이 만료되어 자동 로그아웃됩니다.');
      }
      await supabase.auth.signOut();
    }
  }, [session]);

  useEffect(() => {
    // Supabase가 설정되지 않았으면 인증 기능 비활성화
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 현재 세션 가져오기
    const getSession = async () => {
      if (!supabase) return;
      
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        // 세션 유효성 검증
        if (session?.access_token && isTokenExpired(session.access_token)) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (err) {
        logError(err as Error, 'Get session');
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else if (session) {
        // 새 세션의 유효성 검증
        if (isTokenExpired(session.access_token)) {
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session.user);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 주기적으로 세션 유효성 검사 및 토큰 갱신
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSessionValidity();
      refreshTokenIfNeeded();
    }, 60000); // 1분마다 체크

    return () => clearInterval(interval);
  }, [session, checkSessionValidity, refreshTokenIfNeeded]);

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error(
          'Supabase가 설정되지 않았습니다. 환경변수를 확인해주세요.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // 프로덕션에서는 민감한 에러 정보 숨김
        if (process.env.NODE_ENV === 'development') {
          console.error('회원가입 에러:', error.message);
        }
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('회원가입 예외:', err);
      }
      return {
        data: null,
        error:
          err instanceof Error
            ? err
            : new Error('알 수 없는 에러가 발생했습니다.'),
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return {
        data: null,
        error: new Error(
          'Supabase가 설정되지 않았습니다. 환경변수를 확인해주세요.'
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('로그인 에러:', error.message);
        }
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('로그인 예외:', err);
      }
      return {
        data: null,
        error:
          err instanceof Error
            ? err
            : new Error('알 수 없는 에러가 발생했습니다.'),
      };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
