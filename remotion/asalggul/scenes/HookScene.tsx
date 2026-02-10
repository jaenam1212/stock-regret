import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../../promo-kit/constants';
import { TextReveal } from '../../promo-kit/components/TextReveal';

interface HookSceneProps {
  stockName: string;
  investDate: string;
  investAmount: number;
}

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR').format(n) + '원';

export const HookScene: React.FC<HookSceneProps> = ({
  stockName,
  investDate,
  investAmount,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionMark = spring({
    fps,
    frame: Math.max(0, frame - 40),
    config: { damping: 12, stiffness: 100 },
  });

  const bgPulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.02, 0.06],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 80px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.accent}${Math.round(bgPulse * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div style={{ textAlign: 'center', position: 'relative' }}>
        <TextReveal
          text={`${stockName}을`}
          fontSize={56}
          color={COLORS.gold}
          delay={0}
        />
        <div style={{ height: 20 }} />
        <TextReveal
          text={`${investDate}에`}
          fontSize={48}
          color={COLORS.text}
          delay={10}
        />
        <div style={{ height: 20 }} />
        <TextReveal
          text={formatKRW(investAmount)}
          fontSize={64}
          color={COLORS.accent}
          delay={20}
        />
        <div style={{ height: 20 }} />
        <TextReveal
          text="샀다면"
          fontSize={48}
          color={COLORS.text}
          delay={30}
        />
        <div style={{ height: 40 }} />
        <div
          style={{
            fontSize: 100,
            transform: `scale(${questionMark})`,
            opacity: questionMark,
          }}
        >
          ?
        </div>
      </div>
    </AbsoluteFill>
  );
};
