import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../constants';

interface OutroProps {
  url: string;
  cta?: string;
}

export const Outro: React.FC<OutroProps> = ({
  url,
  cta = '지금 확인해보세요',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ fps, frame, config: { damping: 200 } });
  const ctaOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 60px' }}>
        <div
          style={{
            fontSize: 40,
            color: COLORS.textMuted,
            opacity: ctaOpacity,
          }}
        >
          {cta}
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: COLORS.accent,
            marginTop: 32,
            transform: `scale(${scale})`,
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
