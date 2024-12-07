'use client';
import { CurrencyDetail } from '@coin/components';
import { getCandles, StatsResource, getTicker } from '@coin/resources';
import { useFetch } from '@data-client/react';
import { use } from 'react';

export const dynamic = 'force-dynamic';

export default function AssetDetailPage(props: Props) {
  const params = use(props.params);
  const { id } = params;

  const product_id = `${id}-USD`;
  // Preloading for parallelism - https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preloading-data
  // Unfortunately NextJS does not include a mechanism to do this at the route level, so we will have to use hooks
  useFetch(StatsResource.get, { product_id });
  useFetch(getTicker, { product_id });
  useFetch(getCandles, { product_id });
  const width = 600;
  const height = 400;

  return <CurrencyDetail width={width} height={height} id={id} />;
}

interface Props {
  params: Promise<{ id: string }>;
}
