import {
  floodSpouts,
  documentSpout,
  dataClientSpout,
  routerSpout,
  JSONSpout,
  appSpout,
} from '@anansi/core';
import {
  useController,
  AsyncBoundary,
  CacheProvider,
} from '@data-client/react';

import StreamManager from 'api/StreamManager';
import { getTicker } from 'api/Ticker';

import App from './App';
import { createRouter } from './routing';

const app = (
  <AsyncBoundary>
    <App />
  </AsyncBoundary>
);

const spouts = JSONSpout()(
  documentSpout({ title: 'Coinbase Lite' })(
    dataClientSpout({
      getManagers: () => {
        return [
          new StreamManager(
            new WebSocket('wss://ws-feed.exchange.coinbase.com'),
            { ticker: getTicker },
          ),
          ...CacheProvider.defaultProps.managers,
        ];
      },
    })(
      routerSpout({
        useResolveWith: useController,
        createRouter,
      })(appSpout(app)),
    ),
  ),
);

export default floodSpouts(spouts);
