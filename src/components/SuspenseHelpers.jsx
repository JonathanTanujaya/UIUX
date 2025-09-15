import { Suspense } from 'react';
import { PageLoading } from './LoadingComponents';

// Higher-order component to wrap lazy components with Suspense
export const withSuspense = (Component, fallback = <PageLoading />) => {
  return props => (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Pre-configured Suspense wrapper for pages
export const PageSuspense = ({ children, fallback = <PageLoading /> }) => (
  <Suspense fallback={fallback}>{children}</Suspense>
);
