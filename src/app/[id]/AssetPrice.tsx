'use client';

import { formatPrice } from '@/components/formatters';
import { getTicker } from '@/resources/Ticker';
import { useLive } from '@data-client/react';
import { memo } from 'react';

export const Price = memo(AssetPrice);

function AssetPrice({ product_id }: Props) {
  const ticker = useLive(getTicker, { product_id });
  const displayPrice = formatPrice.format(ticker.price);
  return <span>{displayPrice}</span>;
}

interface Props {
  product_id: string;
}
