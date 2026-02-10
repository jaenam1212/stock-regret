import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../../promo-kit/constants';

interface EmotionSceneProps {
  multiple: number;
  profit: number;
}

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR').format(Math.round(n)) + '원';

const getEmotion = (multiple: number) => {
  if (multiple >= 100) return { emoji: '🤯', text: '미쳤다...', color: COLORS.loss };
  if (multiple >= 10) return { emoji: '😱', text: '헐...', color: COLORS.orange };
  if (multiple >= 2) return { emoji: '😭', text: '아... 진짜 살걸...', color: COLORS.gold };
  return { emoji: '😢', text: '그래도 이득이긴 한데...', color: COLORS.profit };
};

export const EmotionScene: React.FC<EmotionSceneProps> = ({
  multiple,
  profit,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { emoji, text, color } = getEmotion(multiple);

  const emojiScale = spring({
    fps,
    frame,
    config: { damping: 8, stiffness: 80 },
  });

  const textOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const profitSlide = spring({
    fps,
    frame: Math.max(0, frame - 25),
    config: { damping: 200 },
  });
  const profitY = interpolate(profitSlide, [0, 1], [60, 0]);

  const shake =
    multiple >= 10
      ? Math.sin(frame * 1.5) * interpolate(frame, [0, 30], [8, 0], {
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `translateX(${shake}px)`,
        }}
      >
        <div
          style={{
            fontSize: 180,
            transform: `scale(${emojiScale})`,
            marginBottom: 32,
          }}
        >
          {emoji}
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color,
            opacity: textOpacity,
          }}
        >
          {text}
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 44,
            fontWeight: 700,
            color: COLORS.text,
            opacity: profitSlide,
            transform: `translateY(${profitY}px)`,
          }}
        >
          +{formatKRW(profit)} 벌었을텐데!
        </div>
      </div>
    </AbsoluteFill>
  );
};
