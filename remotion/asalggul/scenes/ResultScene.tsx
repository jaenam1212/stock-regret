import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../../promo-kit/constants';

interface ResultSceneProps {
  investAmount: number;
  currentValue: number;
  profitPercent: number;
  multiple: number;
}

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR').format(Math.round(n)) + '원';

export const ResultScene: React.FC<ResultSceneProps> = ({
  investAmount,
  currentValue,
  profitPercent,
  multiple,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const countProgress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const displayValue = investAmount + (currentValue - investAmount) * countProgress;

  const resultScale = spring({
    fps,
    frame: Math.max(0, frame - 50),
    config: { damping: 12, stiffness: 80 },
  });

  const profitOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const getMultipleColor = () => {
    if (multiple >= 10) return COLORS.loss;
    if (multiple >= 3) return COLORS.orange;
    if (multiple >= 1.5) return COLORS.gold;
    return COLORS.profit;
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 60px',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, color: COLORS.textMuted, marginBottom: 16 }}>
          투자금 {formatKRW(investAmount)}
        </div>

        <div style={{ fontSize: 28, color: COLORS.textMuted, marginBottom: 40 }}>
          ↓
        </div>

        <div style={{ fontSize: 32, color: COLORS.textMuted, marginBottom: 12 }}>
          현재 가치
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.profit,
            transform: `scale(${resultScale})`,
          }}
        >
          {formatKRW(displayValue)}
        </div>

        <div
          style={{
            marginTop: 48,
            opacity: profitOpacity,
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, color: COLORS.textMuted }}>수익률</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: COLORS.profit }}>
              +{profitPercent.toFixed(1)}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, color: COLORS.textMuted }}>배수</div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                color: getMultipleColor(),
              }}
            >
              {multiple.toFixed(1)}배
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
