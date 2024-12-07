'use client';

import { getTicker } from '@coin/resources';
import { useLive } from '@data-client/react';
import NumberFlow from '@number-flow/react';
import { memo } from 'react';

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
