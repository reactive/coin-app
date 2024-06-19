'use client';
import StreamManager from '@/resources/StreamManager';
import { Ticker } from '@/resources/Ticker';
import { DevToolsManager, getDefaultManagers } from '@data-client/react';
import { DataProvider } from '@data-client/react/nextjs';

const getManagers =
  process.env.NODE_ENV === 'development' ?
    () => [
      ...getDefaultManagers().filter(
        mgr => mgr.constructor.name !== 'DevToolsManager',
      ),
    ]
  : getDefaultManagers;

const managers =
  typeof window === 'undefined' ? getManagers() : (
    [
      new StreamManager(
        () => new WebSocket('wss://ws-feed.exchange.coinbase.com'),
        {
          ticker: Ticker,
        },
      ),
      ...getManagers(),
    ]
  );

export default function Provider({ children }: { children: React.ReactNode }) {
  return <DataProvider managers={managers}>{children}</DataProvider>;
}
