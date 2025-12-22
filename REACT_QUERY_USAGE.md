# React Query 사용 가이드

## 설치
```bash
pnpm add @tanstack/react-query
```

## 사용 방법

### 1. StockContent에서 useCryptoData 훅 사용 예시

```tsx
import { useCryptoData } from '@/app/hooks/useCryptoData';

// 컴포넌트 내부에서
const { data: stockInfo, isLoading, error, isFetching } = useCryptoData({
  symbol: 'bitcoin',
  enabled: !!symbol, // symbol이 있을 때만 fetch
});

// 이전 데이터가 있으면 즉시 표시, 백그라운드에서 업데이트
// isLoading: 첫 로딩 중
// isFetching: 백그라운드 업데이트 중
// data: 캐시된 데이터 또는 새 데이터
```

### 2. 장점

- **캐싱**: 5분간 같은 데이터는 API 호출 없이 캐시 사용
- **이전 데이터 재사용**: 새 데이터 로딩 중에도 이전 데이터 표시 (placeholderData)
- **자동 재시도**: 네트워크 에러 시 자동 재시도
- **백그라운드 업데이트**: 사용자가 다른 탭 갔다가 돌아와도 자동 업데이트 가능

### 3. 캐시 전략

- `staleTime: 5분` - 5분간은 fresh 상태 유지 (재요청 안 함)
- `gcTime: 30분` - 30분간 메모리에 유지 (이전 데이터 재사용 가능)
- `placeholderData` - 새 데이터 로딩 중 이전 데이터 표시

### 4. 5년 데이터 로딩 전략

현재 API는 5년 데이터를 한 번에 요청합니다. React Query의 캐싱으로:
- 같은 심볼을 다시 조회하면 캐시된 데이터 사용
- 다른 심볼로 전환 후 다시 돌아와도 캐시 활용
- 불필요한 API 호출 감소로 rate limit 방지

