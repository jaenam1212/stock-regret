'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { validateEmail, validatePassword, sanitizeHtml } from '@/lib/validation';
import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { signUp, signIn } = useAuth();

  // 실시간 입력 검증
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = sanitizeHtml(e.target.value);
    setEmail(value);
    
    const validation = validateEmail(value);
    setEmailError(validation.isValid ? '' : validation.error || '');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (isSignUp) {
      const validation = validatePassword(value);
      setPasswordError(validation.isValid ? '' : validation.error || '');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setEmailError('');
    setPasswordError('');

    // 입력 검증
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || '');
      setLoading(false);
      return;
    }

    if (isSignUp && !passwordValidation.isValid) {
      setPasswordError(passwordValidation.error || '');
      setLoading(false);
      return;
    }

    // 회원가입 시 비밀번호 확인
    if (isSignUp && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        // 회원가입 성공 시 모달 닫고 성공 모달 표시
        onClose();
        setShowSuccessModal(true);
        // 폼 초기화
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setMessage(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  // 회원가입 완료 모달
  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="text-green-400 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-bold mb-4">회원가입 완료!</h2>
            <p className="text-gray-300 mb-6">
              회원가입이 성공적으로 완료되었습니다.
              <br />
              이메일을 확인하여 계정을 활성화해주세요.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isSignUp ? '회원가입' : '로그인'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-3 py-2 bg-gray-800 border rounded focus:outline-none transition-colors ${
                emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
              }`}
              required
            />
            {emailError && (
              <p className="text-red-400 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-3 py-2 bg-gray-800 border rounded focus:outline-none transition-colors ${
                passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
              }`}
              required
            />
            {passwordError && (
              <p className="text-red-400 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 bg-gray-800 border rounded focus:outline-none ${
                  confirmPassword && password !== confirmPassword
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-700 focus:border-blue-500'
                }`}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <div className="text-red-400 text-xs mt-1">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </div>
          )}

          {error && <div className="text-red-400 text-sm">{error}</div>}

          {message && <div className="text-green-400 text-sm">{message}</div>}

          <button
            type="submit"
            disabled={loading || (isSignUp && password !== confirmPassword)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium transition-colors"
          >
            {loading ? '처리 중...' : isSignUp ? '회원가입' : '로그인'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleModeSwitch}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isSignUp
              ? '이미 계정이 있으신가요? 로그인'
              : '계정이 없으신가요? 회원가입'}
          </button>
        </div>
      </div>
    </div>
  );
}
