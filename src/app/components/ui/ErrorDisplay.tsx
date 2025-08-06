
interface ErrorDisplayProps {
    error: string;
    onRetry?: () => void;
  }
  
  export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold mb-2">문제가 발생했습니다</h2>
          <p className="text-red-400 mb-6">{error}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium 
                       transition-colors transform hover:scale-105"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    );
  }