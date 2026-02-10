import React from 'react';
import { Composition } from 'remotion';
import { VIDEO } from './promo-kit/constants';
import { AsalggulPromo } from './asalggul/AsalggulPromo';
import { SCENARIOS } from './asalggul/data/promoData';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AsalggulPromo"
        component={AsalggulPromo}
        durationInFrames={480}
        fps={VIDEO.FPS}
        width={VIDEO.WIDTH}
        height={VIDEO.HEIGHT}
        defaultProps={{
          scenario: SCENARIOS[0],
        }}
      />
      <Composition
        id="AsalggulPromo-NVDA"
        component={AsalggulPromo}
        durationInFrames={480}
        fps={VIDEO.FPS}
        width={VIDEO.WIDTH}
        height={VIDEO.HEIGHT}
        defaultProps={{
          scenario: SCENARIOS[1],
        }}
      />
      <Composition
        id="AsalggulPromo-TSLA"
        component={AsalggulPromo}
        durationInFrames={480}
        fps={VIDEO.FPS}
        width={VIDEO.WIDTH}
        height={VIDEO.HEIGHT}
        defaultProps={{
          scenario: SCENARIOS[2],
        }}
      />
    </>
  );
};
