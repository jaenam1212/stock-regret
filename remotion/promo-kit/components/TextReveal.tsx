import React from 'react';
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface TextRevealProps {
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  fontSize = 48,
  color = '#ffffff',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);
  const progress = spring({
    fps,
    frame: adjustedFrame,
    config: { damping: 200 },
  });

  const y = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        fontSize,
        fontWeight: 700,
        color,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      {text}
    </div>
  );
};
