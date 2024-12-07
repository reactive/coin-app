'use client';
import { Ticker } from '@coin/resources';
import { StreamManager } from '@coin/stream';
import { getDefaultManagers, actionTypes } from '@data-client/react';

export default function getManagers() {
  const mgrs = getDefaultManagers({
    devToolsManager: {
      // double latency to help with high frequency updates
      latency: 1000,
      // skip websocket updates as these are too spammy
      predicate: (state, action) =>
        action.type !== actionTypes.SET_TYPE || action.schema !== Ticker,
    },
  });
  // only open stream client-side
  if (typeof window !== 'undefined') {
    mgrs.unshift(
      new StreamManager(
        () => new WebSocket('wss://ws-feed.exchange.coinbase.com'),
        { ticker: Ticker },
      ),
    );
  }
  return mgrs;
}
