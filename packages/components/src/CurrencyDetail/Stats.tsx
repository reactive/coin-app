'use client';
import { StatsResource } from '@coin/resources';
import { useSuspense } from '@data-client/react';

import { Gain24, formatPrice, formatLargePrice } from '@coin/components';

export function Stats({ id }: { id: string }) {
  const stats = useSuspense(StatsResource.get, { product_id: id });
  return (
    <table>
      <tbody>
        <tr>
          <th align="right">high</th>
          <td>{formatPrice.format(stats.high)}</td>
        </tr>
        <tr>
          <th align="right">low</th>
          <td>{formatPrice.format(stats.low)}</td>
        </tr>
        <tr>
          <th align="right">volume</th>
          <td>{formatLargePrice.format(stats.volume_usd)}</td>
        </tr>
        <tr>
          <th align="right">24h %</th>
          <td>
            <Gain24 product_id={id} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
