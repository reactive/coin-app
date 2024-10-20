import { formatPrice, formatters } from '@/components/formatters';
import { getTicker, queryGain24, queryPrice } from '@/resources/Ticker';
import { useQuery, useSubscription } from '@data-client/react';
import styles from './AssetPrice.module.css';
import { memo } from 'react';
import NumberFlow from '@number-flow/react';

export const Price = memo(AssetPrice);
export const Gain24 = memo(AssetGain24);

function AssetPrice({ product_id }: Props) {
  useSubscription(getTicker, { product_id });
  const price = useQuery(queryPrice, { product_id });
  if (!price) return <span></span>;
  return (
    <NumberFlow
      value={price}
      format={{
        style: 'currency',
        currency: 'USD',
      }}
    />
  );
}

function AssetGain24({ product_id }: Props) {
  const percentage = useQuery(queryGain24, { product_id });
  if (percentage === undefined) return <span></span>;
  const className = percentage >= 0 ? styles.up : styles.down;
  return (
    <NumberFlow
      className={className}
      format={{
        style: 'percent',
        minimumFractionDigits: 2,
        signDisplay: 'exceptZero',
      }}
      value={percentage}
    />
  );
}

interface Props {
  product_id: string;
}
