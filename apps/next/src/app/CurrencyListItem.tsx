'use client';
import { type Currency } from '@coin/resources';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

import { formatLargePrice } from '@/components/formatters';

import { Price, Gain24 } from './AssetPrice';
import styles from './CurrencyList.module.scss';

function CurrencyListItem({ currency }: { currency: Currency }) {
  const router = useRouter();
  return (
    <tr onClick={() => router.push(`/${currency.id}`)}>
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
      <td align="left" className={styles.name}>
        <Link href={`/${currency.id}`}>
          {currency.name}
          <br />
          <small>{currency.display_name}</small>
        </Link>
      </td>
      <td align="right">
        {formatLargePrice.format(currency?.stats?.volume_usd)}
      </td>
      <td align="right" width="100">
        <Price product_id={`${currency.id}-USD`} />
      </td>
      <td align="right" width="100">
        <Gain24 product_id={`${currency.id}-USD`} />
      </td>
    </tr>
  );
}
export default memo(CurrencyListItem);
