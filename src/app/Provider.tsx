'use client';
import { DataProvider } from '@data-client/react/nextjs';

import getManagers from './getManagers';

const managers = getManagers();

export default function Provider({ children }: { children: React.ReactNode }) {
  return <DataProvider managers={managers}>{children}</DataProvider>;
}
