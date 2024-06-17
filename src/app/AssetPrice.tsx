import { formatPrice, formatters } from '@/components/formatters';
import { StatsResource } from '@/resources/Stats';
import { getTicker } from '@/resources/Ticker';
import { useCache, useSubscription } from '@data-client/react';
import styles from './AssetPrice.module.css';

export default function AssetPrice({ product_id }: Props) {
  const price = useLivePrice(product_id);
  if (!price) return <span></span>;
  return <span>{formatPrice.format(price)}</span>;
}

export function Gain24({ product_id }: Props) {
  const ticker = useCache(getTicker, { product_id });
  const stats = useCache(StatsResource.get, { id: product_id });
  if (!ticker && !stats) return <span></span>;
  const percentage =
    ticker ? (ticker.price - ticker.open_24h) / ticker.open_24h
    : stats ? (stats.last - stats.open) / stats.open
    : 0;
  const className = percentage >= 0 ? styles.up : styles.down;
  return <span className={className}>{formatters.percentage(percentage)}</span>;
}

interface Props {
  product_id: string;
}

function useLivePrice(product_id: string) {
  useSubscription(getTicker, { product_id });
  const ticker = useCache(getTicker, { product_id });
  const stats = useCache(StatsResource.get, { id: product_id });
  // fallback to stats, as we can load those in a bulk fetch for SSR
  // it would be preferable to simply provide bulk fetch of ticker to simplify code here
  return ticker?.price ?? stats?.last;
}
