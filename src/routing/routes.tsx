import { lazy, Route } from '@anansi/router';
import { getImage } from '@data-client/img';
import { Controller } from '@data-client/react';

import { getTicker } from 'api/Ticker';

const lazyPage = (pageName: string) =>
  lazy(
    () =>
      import(
        /* webpackChunkName: '[request]', webpackPrefetch: true */ `pages/${pageName}`
      ),
  );

export const namedPaths = {
  Home: '/',
  AssetDetail: '/asset/:id',
} as const;

export const routes: Route<Controller>[] = [
  {
    name: 'Home',
    component: lazyPage('Home'),
    async resolveData(controller) {
      const product_id = `${'BTC'}-USD`;
      await controller.fetchIfStale(getTicker, { product_id });
    },
  },
  {
    name: 'AssetDetail',
    component: lazyPage('AssetDetail'),
    /*async resolveData(controller) {
      const product_id = `${'BTC'}-USD`;
      await controller.fetch(getTicker, { product_id });
    },*/
  },
];
