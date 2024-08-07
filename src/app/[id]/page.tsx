'use client';
import { getCandles } from '@/resources/Candles';
import { CurrencyResource } from '@/resources/Currency';
import { StatsResource } from '@/resources/Stats';
import { getTicker } from '@/resources/Ticker';
import { AsyncBoundary, useFetch, useSuspense } from '@data-client/react';

import AssetChart from './AssetChart';
import { Price } from './AssetPrice';
import styles from './page.module.css';
import Stats from './Stats';

export const dynamic = 'force-dynamic';

export default function AssetDetail({
  params: { id },
}: {
  params: { id: string };
}) {
  const product_id = `${id}-USD`;
  // Preloading for parallelism - https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preloading-data
  // Unfortunately NextJS does not include a mechanism to do this at the route level, so we will have to use hooks
  useFetch(StatsResource.get, { product_id });
  useFetch(getTicker, { product_id });
  useFetch(getCandles, { product_id });
  const currency = useSuspense(CurrencyResource.get, { id });
  const width = 600;
  const height = 400;

  return (
    <>
      <title>{`${currency.name} Prices with Reactive Data Client`}</title>
      <header>
        <h1>
          <img
            src={currency.icon}
            style={{ height: '1em', width: '1em', marginBottom: '-.1em' }}
          />{' '}
          {currency.name} <small>{currency.display_name}</small>
        </h1>
        <h2>
          <Price product_id={`${currency.id}-USD`} />
        </h2>
      </header>
      <AsyncBoundary fallback={<div style={{ width, height }}>&nbsp;</div>}>
        <AssetChart
          product_id={`${currency.id}-USD`}
          width={width}
          height={height}
        />
      </AsyncBoundary>
      <section className={styles.statSection}>
        <Stats id={`${currency.id}-USD`} />
      </section>
    </>
  );
}
