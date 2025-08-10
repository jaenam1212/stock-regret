'use client';

import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Supabase가 설정되지 않았으면 인증 기능 비활성화
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 현재 세션 가져오기
    const getSession = async () => {
      if (!supabase) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      console.log('회원가입 시도:', { email, passwordLength: password.length });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('회원가입 응답:', { data, error });

      if (error) {
        console.error('회원가입 에러:', error);
        console.error('에러 상세:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('회원가입 예외:', err);
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
        console.error('로그인 에러:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      console.error('로그인 예외:', err);
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
