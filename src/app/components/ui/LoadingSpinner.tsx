
export default function LoadingSpinner() {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">주식 데이터 불러오는 중...</p>
        </div>
      </div>
    );
  }