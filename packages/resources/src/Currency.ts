import { Entity, resource, schema } from '@data-client/rest';

import { iconTable } from './cryptoIconTable';
import { Stats } from './Stats';

export class Currency extends Entity {
  id = '';
  name = '';
  min_size = '1';
  status = 'online';
  message = '';
  convertable_to = [];
  details: CryptoDetails = {
    type: 'crypto',
    symbol: 'Ξ',
    network_confirmations: 14,
    sort_order: 67,
    crypto_address_link:
      'https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca?a={{address}}',
    crypto_transaction_link: 'https://etherscan.io/tx/0x{{txId}}',
    push_payment_methods: ['crypto'],
    group_types: [],
    display_name: null,
    processing_time_seconds: null,
    min_withdrawal_amount: 0.01,
    max_withdrawal_amount: 579800,
  };

  default_network = 'ethereum';
  supported_networks: NetworkDetails[] = [];
  display_name = '';

  // faked for client-side join
  stats = Stats.fromJS();

  get icon() {
    return iconTable[this.id]?.img_url;
  }

  static key = 'Currency';

  static process(
    input: any,
    parent: any,
    key: string | undefined,
    args: any[],
  ) {
    // enables client-side join with stats
    return { ...input, stats: `${input.id}-USD` };
  }

  static schema = {
    stats: Stats,
  };
}

export const CurrencyResource = resource({
  urlPrefix: 'https://api.exchange.coinbase.com',
  path: '/currencies/:id',
  schema: Currency,
});

interface Args {
  type?: string;
  limit?: number;
}
export const queryCurrency = new schema.Query(
  CurrencyResource.getList.schema,
  (entries, { type = 'crypto', limit = 25 }: Args = {}) => {
    let sorted = entries.filter(
      currency =>
        currency.details.type === type && currency.status === 'online',
    );

    sorted = sorted.sort((a, b) => {
      return (b.stats?.volume_usd ?? 0) - (a.stats?.volume_usd ?? 0);
    });
    return sorted.slice(0, limit);
  },
);

export interface NetworkDetails {
  id: string;
  name: string;
  status: string;
  contract_address: string;
  crypto_address_link: string;
  crypto_transaction_link: string;
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
  network_confirmations: number;
  processing_time_seconds: number | null;
}

export interface CryptoDetails {
  type: string;
  symbol: string;
  network_confirmations: number;
  sort_order: number;
  crypto_address_link: string;
  crypto_transaction_link: string;
  push_payment_methods: string[];
  group_types: string[];
  display_name: string | null;
  processing_time_seconds: number | null;
  min_withdrawal_amount: number;
  max_withdrawal_amount: number;
}
