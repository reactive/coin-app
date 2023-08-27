import { useSuspense } from '@data-client/react';

import { StatsResource } from 'api/Stats';

export default function Stats({ id }: { id: string }) {
  const stats = useSuspense(StatsResource.get, { id });
  return (
    <p>
      high: {stats.high}
      <br />
      low: {stats.low}
      <br />
      volume: {stats.volume.toString()}
    </p>
  );
}
