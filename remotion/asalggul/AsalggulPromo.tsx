import React from 'react';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

import { Intro } from '../promo-kit/components/Intro';
import { Outro } from '../promo-kit/components/Outro';
import { HookScene } from './scenes/HookScene';
import { AppScreenScene } from './scenes/AppScreenScene';
import { ResultScene } from './scenes/ResultScene';
import { EmotionScene } from './scenes/EmotionScene';
import { PromoScenario, DEFAULT_SCENARIO } from './data/promoData';

interface AsalggulPromoProps {
  scenario?: PromoScenario;
}

export const AsalggulPromo: React.FC<AsalggulPromoProps> = ({
  scenario = DEFAULT_SCENARIO,
}) => {
  const shares = scenario.investAmount / scenario.pastPrice;
  const currentValue =
    scenario.currency === 'KRW'
      ? shares * scenario.currentPrice
      : shares * scenario.currentPrice * 1350;
  const profit = currentValue - scenario.investAmount;
  const profitPercent = (profit / scenario.investAmount) * 100;
  const multiple = currentValue / scenario.investAmount;

  const T = 15;

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={75}>
        <Intro title="아! 살껄" subtitle="그때 샀으면 지금 얼마?" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={75}>
        <AppScreenScene src="promo/screen-main.png" label="주식 검색 & 차트" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={75}>
        <HookScene
          stockName={scenario.stockName}
          investDate={scenario.investDate}
          investAmount={scenario.investAmount}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={75}>
        <AppScreenScene src="promo/screen-result-viewport.png" label="계산 결과" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={90}>
        <ResultScene
          investAmount={scenario.investAmount}
          currentValue={currentValue}
          profitPercent={profitPercent}
          multiple={multiple}
        />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={75}>
        <AppScreenScene src="promo/screen-emotion.png" />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={75}>
        <EmotionScene multiple={multiple} profit={profit} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      <TransitionSeries.Sequence durationInFrames={60}>
        <Outro url="asalggul.kr" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
