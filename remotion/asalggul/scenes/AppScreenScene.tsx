import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../../promo-kit/constants';

interface AppScreenSceneProps {
  src: string;
  label?: string;
}

export const AppScreenScene: React.FC<AppScreenSceneProps> = ({
  src,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ fps, frame, config: { damping: 200 } });
  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const labelOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
      }}
    >
      {label && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.text,
            opacity: labelOpacity,
            zIndex: 2,
          }}
        >
          {label}
        </div>
      )}

      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          borderRadius: 32,
          overflow: 'hidden',
          boxShadow: '0 25px 80px rgba(59,130,246,0.3)',
          border: '3px solid rgba(255,255,255,0.1)',
          maxWidth: 900,
          width: '100%',
        }}
      >
        <Img src={staticFile(src)} style={{ width: '100%', display: 'block' }} />
      </div>
    </AbsoluteFill>
  );
};
