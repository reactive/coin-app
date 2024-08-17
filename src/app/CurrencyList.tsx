'use client';
import { CurrencyResource, queryCurrency } from '@/resources/Currency';
import { StatsResource } from '@/resources/Stats';
import { useFetch, useQuery, useSuspense } from '@data-client/react';

import styles from './CurrencyList.module.scss';
import CurrencyListItem from './CurrencyListItem';

export default function CurrencyList() {
  useFetch(StatsResource.getList);
  useSuspense(CurrencyResource.getList);
  useSuspense(StatsResource.getList);
  const currencies = useQuery(queryCurrency);
  if (!currencies) return null;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th align="right"></th>
          <th align="left">Name</th>
          <th>Volume (30d)</th>
          <th align="right">Price</th>
          <th align="right">24h %</th>
        </tr>
      </thead>
      <tbody>
        {currencies.map(currency => (
          <CurrencyListItem key={currency.pk()} currency={currency} />
        ))}
      </tbody>
    </table>
  );
}
