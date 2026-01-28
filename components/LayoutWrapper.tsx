'use client';

import { Navigation } from './Navigation';
import { ServiceWorkerRegistration } from './ServiceWorkerRegistration';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegistration />
      <Navigation />
      {children}
    </>
  );
}
