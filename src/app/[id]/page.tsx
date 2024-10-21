'use client';
import { use } from 'react';
import {
  getCandles,
  CurrencyResource,
  StatsResource,
  getTicker,
} from '@/resources';
import { AsyncBoundary, useFetch, useSuspense } from '@data-client/react';
import Image from 'next/image';

import AssetChart from './AssetChart';
import { Price } from './AssetPrice';
import styles from './page.module.css';
import Stats from './Stats';

export const dynamic = 'force-dynamic';

export default function AssetDetail(props: Props) {
  const params = use(props.params);
  const { id } = params;

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
          <Image
            src={currency.icon}
            style={{ marginBottom: '-.1em' }}
            width="32"
            height="32"
            alt={currency.name}
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

interface Props {
  params: Promise<{ id: string }>;
}
