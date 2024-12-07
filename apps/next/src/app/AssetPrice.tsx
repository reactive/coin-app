import { getTicker, queryGain24, queryPrice } from '@coin/resources';
import { useQuery, useSubscription } from '@data-client/react';
import { memo } from 'react';

import { formatPrice, formatters } from '@/components/formatters';

import styles from './AssetPrice.module.css';

export const Price = memo(AssetPrice);
export const Gain24 = memo(AssetGain24);

function AssetPrice({ product_id }: Props) {
  useSubscription(getTicker, { product_id });
  const price = useQuery(queryPrice, { product_id });
  if (!price) return <span></span>;
  return <span>{formatPrice.format(price)}</span>;
}

function AssetGain24({ product_id }: Props) {
  const percentage = useQuery(queryGain24, { product_id });
  if (percentage === undefined) return <span></span>;
  const className = percentage >= 0 ? styles.up : styles.down;
  return <span className={className}>{formatters.percentage(percentage)}</span>;
}

interface Props {
  product_id: string;
}
