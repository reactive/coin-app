'use client';

import { useLive } from '@data-client/react';
import NumberFlow from '@number-flow/react';
import { memo } from 'react';

import { getTicker } from '@/resources/Ticker';

export const Price = memo(AssetPrice);

function AssetPrice({ product_id }: Props) {
  const ticker = useLive(getTicker, { product_id });
  return (
    <NumberFlow
      value={ticker.price}
      format={{
        style: 'currency',
        currency: 'USD',
      }}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    />
  );
}

interface Props {
  product_id: string;
}
