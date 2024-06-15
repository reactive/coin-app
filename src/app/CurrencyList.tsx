'use client';
import { formatLargePrice } from '@/components/formatters';
import { CurrencyResource, queryCurrency } from '@/resources/Currency';
import { StatsResource } from '@/resources/Stats';
import {
  AsyncBoundary,
  useFetch,
  useQuery,
  useSuspense,
} from '@data-client/react';
import Image from 'next/image';
import Link from 'next/link';

import AssetPrice, { Gain24 } from './AssetPrice';

export default function CurrencyList() {
  useFetch(StatsResource.getList);
  useSuspense(CurrencyResource.getList);
  useSuspense(StatsResource.getList);
  const currencies = useQuery(queryCurrency);
  if (!currencies) return null;
  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th align="left">Name</th>
          <th>Volume 30d</th>
          <th align="right">Price</th>
          <th align="right">24h %</th>
        </tr>
      </thead>
      <tbody>
        {currencies.slice(0, 25).map(currency => (
          <tr key={currency.pk()}>
            <td>
              {currency.icon && (
                <Image
                  src={currency.icon}
                  width="20"
                  height="20"
                  alt={currency.name}
                />
              )}
            </td>
            <td align="left">
              <Link href={`/${currency.id}`}>{currency.name}</Link>
            </td>
            <td align="right">
              {formatLargePrice.format(currency?.stats?.volume_usd)}
            </td>
            <td align="right" width="100">
              <AsyncBoundary>
                <AssetPrice product_id={`${currency.id}-USD`} />
              </AsyncBoundary>
            </td>
            <td align="right" width="100">
              <AsyncBoundary>
                <Gain24 product_id={`${currency.id}-USD`} />
              </AsyncBoundary>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
