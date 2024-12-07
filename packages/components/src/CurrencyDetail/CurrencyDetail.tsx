'use client';
import { CurrencyResource } from '@coin/resources';
import { AsyncBoundary, useSuspense } from '@data-client/react';

import { AssetChart, Stats } from '@coin/components';

import { Price } from './AssetPrice';
import styles from './CurrencyDetail.module.css';
import Image from '../platform/Image';

export function CurrencyDetail({ width, height, id }: Props) {
  const product_id = `${id}-USD`;
  const currency = useSuspense(CurrencyResource.get, { id });

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
          <Price product_id={product_id} />
        </h2>
      </header>
      <AsyncBoundary fallback={<div style={{ width, height }}>&nbsp;</div>}>
        <AssetChart product_id={product_id} width={width} height={height} />
      </AsyncBoundary>
      <section className={styles.statSection}>
        <Stats id={product_id} />
      </section>
    </>
  );
}
interface Props {
  width: number;
  height: number;
  id: string;
}
