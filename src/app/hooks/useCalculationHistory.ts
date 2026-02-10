'use client';

export function useCalculationHistory() {
  return {
    history: [] as never[],
    loading: false,
    error: null,
  };
}
