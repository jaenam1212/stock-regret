
interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
    onGoBack?: () => void;
  }
  
  export default function ErrorDisplay({ error, onRetry, onGoBack }: ErrorDisplayProps) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold mb-2">문제가 발생했습니다</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onGoBack && (
              <button 
                onClick={onGoBack}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium 
                         transition-colors transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                돌아가기
              </button>
            )}
            {onRetry && (
              <button 
                onClick={onRetry}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium 
                         transition-colors transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                다시 시도
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }