'use client';
import { getCandles, getTicker } from '@coin/resources';
import { useLive } from '@data-client/react';
import { lazy, useMemo } from 'react';

const LineChart = lazy(() => import(/* webpackPreload: true */ './LineChart'));

export function AssetChart({ product_id, width, height }: Props) {
  const candles = useLive(getCandles, { product_id });
  const ticker = useLive(getTicker, { product_id });

  const fullCandles = useMemo(() => {
    return [
      { timestamp: ticker.time.getTime() / 1000, price_open: ticker.price },
      ...candles,
    ];
  }, [candles, ticker]);

  return <LineChart data={fullCandles} width={width} height={height} />;
}

interface Props {
  product_id: string;
  width: number;
  height: number;
}
