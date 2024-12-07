import { CurrencyList } from '@coin/components';

export const dynamic = 'force-dynamic';

export default function Crypto() {
  return (
    <>
      <title>Live Crypto Prices with Reactive Data Client</title>
      <CurrencyList />
    </>
  );
}
